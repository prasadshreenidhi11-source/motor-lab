import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import { BasementEnvironment } from './CarScene';

const MODEL_CONFIG = [
  { url: '/models/car_engine_19_mb.glb', size: 2.35, rotation: [0, 0, 0] },
  { url: '/models/vented_disk_brake__rotor.glb', size: 2.3, rotation: [Math.PI / 2, 0, 0] },
  { url: '/models/scorpio_n_alloy_wheel.glb', size: 2.3, rotation: [0, 0, 0] },
  { url: '/models/bonnut.glb', size: 2.55, rotation: [Math.PI / 2, 0, 0] },
];

function ModelAsset({ url, size, rotation, opacityRef }) {
  const { scene: source } = useGLTF(url);
  const cleanupTimerRef = useRef(0);
  const { model, materials } = useMemo(() => {
    const clone = source.clone(true);
    clone.rotation.set(...rotation);
    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const dimensions = bounds.getSize(new THREE.Vector3());
    const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
    const fitScale = largestDimension > 0 ? size / largestDimension : 1;
    const clonedMaterials = [];

    clone.scale.setScalar(fitScale);
    clone.position.set(-center.x * fitScale, -center.y * fitScale, -center.z * fitScale);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const cloneMaterial = (material) => {
        const instance = material.clone();
        instance.transparent = true;
        instance.depthWrite = false;
        clonedMaterials.push(instance);
        return instance;
      };
      child.material = Array.isArray(child.material)
        ? child.material.map(cloneMaterial)
        : cloneMaterial(child.material);
    });

    return { model: clone, materials: clonedMaterials };
  }, [source, size, rotation]);

  useEffect(() => {
    window.clearTimeout(cleanupTimerRef.current);
    return () => {
      cleanupTimerRef.current = window.setTimeout(() => materials.forEach((material) => material.dispose()), 0);
    };
  }, [materials]);

  useFrame(() => {
    const opacity = THREE.MathUtils.clamp(opacityRef.current, 0, 1);
    materials.forEach((material) => {
      if (Math.abs(material.opacity - opacity) < 0.015) return;
      material.opacity = opacity;
      material.depthWrite = opacity > 0.96;
    });
  });

  return <primitive object={model} dispose={null} />;
}

class ModelLoadBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Html center><div className="diagnostics-model-loading">COMPONENT MODEL UNAVAILABLE</div></Html>;
    }
    return this.props.children;
  }
}

function AnimatedModel({ index, active, initialVisible = false }) {
  const ref = useRef();
  const progress = useRef(initialVisible ? 1 : 0);
  const dragRef = useRef({ pointerId: null, x: 0, resumeAt: 0 });
  const config = MODEL_CONFIG[index];
  const viewport = useThree((state) => state.viewport);

  const handlePointerDown = (event) => {
    if (!active) return;
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.nativeEvent.clientX,
      resumeAt: performance.now() + 2000,
    };
    event.nativeEvent.target.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event) => {
    if (!active || dragRef.current.pointerId !== event.pointerId || !ref.current) return;
    event.stopPropagation();
    const deltaX = event.nativeEvent.clientX - dragRef.current.x;
    ref.current.rotation.y += deltaX * 0.008;
    dragRef.current.x = event.nativeEvent.clientX;
    dragRef.current.resumeAt = performance.now() + 2000;
  };

  const handlePointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    event.stopPropagation();
    if (event.target.hasPointerCapture?.(event.pointerId)) event.target.releasePointerCapture(event.pointerId);
    dragRef.current.pointerId = null;
    dragRef.current.resumeAt = performance.now() + 2000;
    event.nativeEvent.target.style.cursor = 'grab';
  };

  useFrame((state, delta) => {
    if (!ref.current) return;
    const target = active ? 1 : 0;
    progress.current = THREE.MathUtils.damp(progress.current, target, 3.8, delta);
    ref.current.visible = progress.current > 0.01;

    const stageX = viewport.width < 7 ? 0.15 : viewport.width < 10.5 ? 1.1 : 2.2;
    ref.current.position.set(stageX, 1.25 + Math.sin(state.clock.elapsedTime * 0.65 + index) * 0.045, 0.3);
    if (active && dragRef.current.pointerId === null && performance.now() >= dragRef.current.resumeAt) {
      ref.current.rotation.y += delta * 0.16;
    }
  });

  return <group ref={ref}>
    <ModelLoadBoundary>
      <Suspense fallback={<Html center><div className="diagnostics-model-loading">LOADING COMPONENT MODEL</div></Html>}>
        <ModelAsset {...config} opacityRef={progress} />
      </Suspense>
    </ModelLoadBoundary>
    {active && <mesh
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerOver={(event) => { event.stopPropagation(); event.nativeEvent.target.style.cursor = 'grab'; }}
      onPointerOut={(event) => { if (dragRef.current.pointerId === null) event.nativeEvent.target.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[1.45, 20, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>}
  </group>;
}

function ScanPlatform() {
  const ring = useRef();
  const viewport = useThree((state) => state.viewport);
  useFrame((_, delta) => { if (ring.current) ring.current.rotation.z -= delta * 0.08; });
  const stageX = viewport.width < 7 ? 0.15 : viewport.width < 10.5 ? 1.1 : 2.2;
  return <group position={[stageX, 0.07, 0.3]}>
    <mesh ref={ring} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[1.68, 0.024, 8, 96]} /><meshStandardMaterial color="#bd7854" emissive="#71381f" emissiveIntensity={1.1} metalness={0.68} roughness={0.25} /></mesh>
    <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[1.44, 0.012, 6, 96]} /><meshStandardMaterial color="#8b9998" emissive="#353d3c" emissiveIntensity={0.4} /></mesh>
    <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.94, 0.97, 64]} /><meshBasicMaterial color="#707674" transparent opacity={0.34} side={THREE.DoubleSide} /></mesh>
  </group>;
}

function ResponsiveContactShadows() {
  const viewport = useThree((state) => state.viewport);
  const stageX = viewport.width < 7 ? 0.15 : viewport.width < 10.5 ? 1.1 : 2.2;
  return <ContactShadows position={[stageX, 0.03, 0.3]} opacity={0.52} scale={5.5} blur={2.4} far={3.5} />;
}

export default function DiagnosticsScene({ activeIndex, outgoingIndex }) {
  return <Canvas shadows camera={{ position: [6.4, 4.2, 8.8], fov: 34, near: 0.1, far: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
    <fog attach="fog" args={['#08090a', 16, 42]} />
    <Environment preset="warehouse" background={false} />
    <ambientLight intensity={0.3} />
    <spotLight position={[2.2, 5.2, 1.3]} angle={0.65} penumbra={0.8} intensity={26} distance={18} color="#ddd8cf" castShadow />
    <pointLight position={[-0.8, 2.7, 2.7]} intensity={4.2} distance={8} color="#a65e41" />
    <pointLight position={[5.4, 3.4, -1.2]} intensity={3.2} distance={9} color="#aab2b0" />
    <ScanPlatform />
    {outgoingIndex !== null && outgoingIndex !== activeIndex && <AnimatedModel key={`out-${outgoingIndex}`} index={outgoingIndex} active={false} initialVisible />}
    <AnimatedModel key={`active-${activeIndex}`} index={activeIndex} active />
    <ResponsiveContactShadows />
  </Canvas>;
}

export function DiagnosticsBackground() {
  return <Canvas
    shadows
    frameloop="demand"
    camera={{ position: [6.4, 4.2, 8.8], fov: 34, near: 0.1, far: 60 }}
    dpr={[1, 1.25]}
    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
  >
    <color attach="background" args={['#08090a']} />
    <fog attach="fog" args={['#08090a', 16, 42]} />
    <BasementEnvironment />
    <Environment preset="warehouse" background={false} />
  </Canvas>;
}
