import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

import Hotspots from './Hotspots';
import PartsInfo from './PartsInfo';
import { INSPECTION_DEFINITIONS } from './inspectionData';
import './Inspection.css';

function createConcreteTexture(seed, isFloor = false) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  const pixels = context.createImageData(size, size);
  let state = seed;

  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  const base = isFloor ? 49 : 76;

  for (let index = 0; index < pixels.data.length; index += 4) {
    const variation = (random() - 0.5) * (isFloor ? 48 : 58);
    const value = THREE.MathUtils.clamp(base + variation, 20, 150);
    pixels.data[index] = value;
    pixels.data[index + 1] = value;
    pixels.data[index + 2] = value + (random() - 0.5) * 3;
    pixels.data[index + 3] = 255;
  }

  context.putImageData(pixels, 0, 0);

  for (let stain = 0; stain < 34; stain += 1) {
    const x = random() * size;
    const width = 12 + random() * 110;
    const alpha = 0.025 + random() * 0.07;
    const gradient = context.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.5, 'rgba(4,5,6,' + alpha + ')');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(x - width, 0, width * 2, size);
  }

  context.strokeStyle = 'rgba(10,11,12,0.32)';
  context.lineWidth = isFloor ? 2 : 1.5;

  for (let crack = 0; crack < 28; crack += 1) {
    let x = random() * size;
    let y = random() * size;
    context.beginPath();
    context.moveTo(x, y);

    for (let segment = 0; segment < 5; segment += 1) {
      x += (random() - 0.5) * 90;
      y += (random() - 0.5) * 90;
      context.lineTo(x, y);
    }

    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(isFloor ? 5 : 3, isFloor ? 5 : 2);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export function BasementEnvironment() {
  const textures = useMemo(
    () => ({
      walls: createConcreteTexture(42),
      floor: createConcreteTexture(92, true),
    }),
    []
  );

  const columns = [-7, -3.5, 3.5, 7];

  return (
    <group>



      {/* Worn concrete floor and the three walls around the car */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[34, 34]} />
        <meshStandardMaterial
          map={textures.floor}
          bumpMap={textures.floor}
          bumpScale={0.045}
          color="#b5b6b7"
          roughness={0.94}
          metalness={0.05}
        />
      </mesh>

      <mesh position={[0, 3.1, -9]} receiveShadow>
        <boxGeometry args={[22, 6.4, 0.45]} />
        <meshStandardMaterial
          map={textures.walls}
          bumpMap={textures.walls}
          bumpScale={0.075}
          color="#a7a8a9"
          roughness={0.98}
        />
      </mesh>

      <mesh position={[-10.8, 3.1, 0]} receiveShadow>
        <boxGeometry args={[0.45, 6.4, 18.5]} />
        <meshStandardMaterial
          map={textures.walls}
          bumpMap={textures.walls}
          bumpScale={0.075}
          color="#999a9b"
          roughness={0.98}
        />
      </mesh>

      <mesh position={[10.8, 3.1, 0]} receiveShadow>
        <boxGeometry args={[0.45, 6.4, 18.5]} />
        <meshStandardMaterial
          map={textures.walls}
          bumpMap={textures.walls}
          bumpScale={0.075}
          color="#858687"
          roughness={0.98}
        />
      </mesh>

      {/* Low ceiling, concrete columns and visible formwork seams */}
      <mesh position={[0, 6.25, -0.3]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 18.5]} />
        <meshStandardMaterial
          map={textures.walls}
          bumpMap={textures.walls}
          bumpScale={0.06}
          color="#858687"
          roughness={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>

      {columns.map((x) => (
        <mesh key={'column-' + x} position={[x, 3, -7.75]} castShadow receiveShadow>
          <boxGeometry args={[0.52, 6, 0.65]} />
          <meshStandardMaterial
            map={textures.walls}
            bumpMap={textures.walls}
            bumpScale={0.07}
            color="#9b9c9d"
            roughness={0.98}
          />
        </mesh>
      ))}

      {[-5.4, -2.4, 0.6, 3.6, 6.6].map((x) => (
        <mesh key={'wall-seam-' + x} position={[x, 3.1, -8.755]}>
          <boxGeometry args={[0.018, 6.1, 0.012]} />
          <meshStandardMaterial color="#242526" roughness={1} />
        </mesh>
      ))}

      {[-1.5, 2.2, 5.2].map((y) => (
        <mesh key={'wall-joint-' + y} position={[0, y, -8.75]}>
          <boxGeometry args={[21.8, 0.018, 0.012]} />
          <meshStandardMaterial color="#292a2b" roughness={1} />
        </mesh>
      ))}

      {/* Utility pipes and old fluorescent housings */}
      <mesh position={[0, 5.35, -8.45]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 17.5, 16]} />
        <meshStandardMaterial color="#656768" metalness={0.55} roughness={0.62} />
      </mesh>

      <mesh position={[-9.95, 5.05, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 16, 12]} />
        <meshStandardMaterial color="#4c4e4f" metalness={0.45} roughness={0.68} />
      </mesh>

      <mesh position={[0, 5.92, -2.8]}>
        <boxGeometry args={[3.2, 0.055, 0.18]} />
        <meshStandardMaterial
          color="#e1e3e4"
          emissive="#d7dcde"
          emissiveIntensity={2.4}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[-5.4, 5.92, -5.4]}>
        <boxGeometry args={[2.4, 0.055, 0.18]} />
        <meshStandardMaterial
          color="#d1d4d6"
          emissive="#c9ced0"
          emissiveIntensity={1.7}
          roughness={0.4}
        />
      </mesh>

      {/* Shallow dark water patches on the concrete */}
      <mesh position={[-2.8, 0.012, 1.2]} rotation={[-Math.PI / 2, 0, -0.25]} scale={[1.45, 0.55, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshPhysicalMaterial
          color="#252829"
          roughness={0.22}
          metalness={0.28}
          transparent
          opacity={0.62}
        />
      </mesh>

      <mesh position={[3.8, 0.012, -1.1]} rotation={[-Math.PI / 2, 0, 0.38]} scale={[1.1, 0.42, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshPhysicalMaterial
          color="#202324"
          roughness={0.2}
          metalness={0.3}
          transparent
          opacity={0.55}
        />
      </mesh>

      <hemisphereLight args={['#d9dcde', '#191a1b', 0.65]} />
      <ambientLight intensity={0.26} />

      <directionalLight
        position={[-4, 7, 4]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={22}
        shadow-bias={-0.0002}
      />

      <spotLight
        position={[0, 5.55, -2.8]}
        intensity={34}
        distance={16}
        angle={0.62}
        penumbra={0.85}
        color="#f1f2f2"
      />

      <pointLight position={[-5.4, 5.3, -5.2]} intensity={12} distance={10} color="#d8dcde" />
      <pointLight position={[4.5, 3.2, 4.5]} intensity={2.4} distance={12} color="#eef0f1" />
    </group>
  );
}

function LoadingModel() {
  return (
    <Html center>
      <div className="model-loading">LOADING BUGATTI CHIRON...</div>
    </Html>
  );
}

function classifyPart(name) {
  const n = name.toLowerCase();

  // This node is a mixed material collection, not a single movable assembly.
  if (/^plastic-parts(?:_|$)/.test(n)) return null;
  if (/tire|tyre|wheel|rim|spoke/.test(n)) return { stage: 1, type: 'wheel' };
  if (/brake|caliper|disc.?rotor/.test(n)) return { stage: 2, type: 'brake' };
  if (/engine|motor|gearbox|transmission|radiator|exhaust/.test(n)) {
    return { stage: 2, type: 'mechanical' };
  }
  if (/seat|steering|dashboard|cockpit|interior|console|door_panel/.test(n)) {
    return { stage: 2, type: 'interior' };
  }
  if (/hood|bonnet|door|bumper|fender|wing|spoiler|diffuser|splitter|mirror|headlight|tail.?light|glass|windshield|windscreen|roof|body|panel|vent/.test(n)) {
    return { stage: 1, type: 'exterior' };
  }

  return null;
}

function prepareParts(model) {
  const parts = [];
  model.updateMatrixWorld(true);

  const modelBounds = new THREE.Box3().setFromObject(model);
  const modelCenter = modelBounds.getCenter(new THREE.Vector3());

  const visit = (object) => {
    if (object === model) {
      object.children.forEach(visit);
      return;
    }

    const config = classifyPart(object.name);
    let hasMesh = false;
    object.traverse((child) => {
      if (child.isMesh) hasMesh = true;
    });

    if (!config || !hasMesh || !object.parent) {
      object.children.forEach(visit);
      return;
    }

    // Move each named assembly as one piece so material submeshes stay aligned.
    const center = new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
    const direction = center.sub(modelCenter);
    if (config.type === 'mechanical') {
      // Lift the engine out through the raised body shell so it reads as the feature component.
      direction.set(0, 1, 0);
    } else {
      if (config.type === 'interior') direction.y *= 0.2;
      else direction.y *= 0.55;
      if (config.type === 'interior') direction.y += 0.35;
    }
    if (direction.lengthSq() < 0.0001) direction.set(0, 1, 0);
    direction.normalize();

    const distance = config.type === 'wheel'
      ? 0.55
      : config.type === 'brake'
        ? 0.3
        : config.type === 'mechanical'
          ? 0.8
          : config.type === 'interior'
            ? 0.38
            : /body/i.test(object.name)
              ? 0.5
              : 0.65;

    const inverseParentBasis = new THREE.Matrix3()
      .setFromMatrix4(object.parent.matrixWorld)
      .invert();

    parts.push({
      object,
      originalPosition: object.position.clone(),
      offset: direction.multiplyScalar(distance).applyMatrix3(inverseParentBasis),
      stage: config.stage,
    });
  };

  model.children.forEach(visit);

  console.log('[Bugatti Chiron] recognized, scroll-separated parts:', parts.length);
  return parts;
}

function getObjectBounds(objects) {
  const bounds = new THREE.Box3().makeEmpty();
  objects.forEach((object) => bounds.expandByObject(object));
  return bounds;
}

function discoverInspectionComponents(model) {
  model.updateMatrixWorld(true);

  return INSPECTION_DEFINITIONS.flatMap((definition) => {
    const node = model.getObjectByName(definition.nodeName);
    if (!node) return [];

    // Engine_Logo_0 is named with the engine group but sits at the far front of the car.
    // Keep the engine inspection pivot around the four clustered engine meshes only.
    const objects = definition.id === 'engine'
      ? node.children.filter((child) => child.isMesh && !/logo/i.test(child.name))
      : [node];
    if (!objects.length || objects.some((object) => object.parent !== objects[0].parent)) return [];

    const bounds = getObjectBounds(objects);
    const center = bounds.getCenter(new THREE.Vector3());
    const anchorLocal = node.worldToLocal(center.clone());

    return [{
      ...definition,
      objects,
      freezeObject: node,
      anchorObject: node,
      anchorLocal,
      worldPosition: new THREE.Vector3(),
      pivotRef: { current: null },
      bounds: bounds.clone(),
    }];
  });
}

function BugattiModel({
  progressRef,
  focusRef,
  inspectionId,
  isClosing,
  onComponentsReady,
  rootRef,
  panelRef,
  leaderPathRef,
  leaderStartRef,
  leaderEndRef,
  onSelect,
}) {
  const { camera, size } = useThree();
  const { scene } = useGLTF('/models/bugatti-chiron.glb');
  const model = useMemo(() => scene.clone(true), [scene]);
  const rigRef = useRef();
  const activeInspectionRef = useRef(null);
  const inspectionClosingRef = useRef(isClosing);
  inspectionClosingRef.current = isClosing;
  const activeMaterialCopiesRef = useRef([]);

  const modelFit = useMemo(() => {
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = Math.max(size.x, size.z) > 0
      ? 5.2 / Math.max(size.x, size.z)
      : 1;

    return {
      scale,
      position: [
        -center.x * scale,
        -bounds.min.y * scale,
        -center.z * scale,
      ],
    };
  }, [model]);

  const parts = useMemo(() => prepareParts(model), [model]);
  const inspectionComponents = useMemo(() => discoverInspectionComponents(model), [model]);
  const lastProgress = useRef(-1);

  const originalMaterials = useMemo(() => {
    const originalMaterials = new Map();
    model.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();
        originalMaterials.set(object, object.material);
      }
    });
    return originalMaterials;
  }, [model]);

  useEffect(() => {
    onComponentsReady(inspectionComponents);
  }, [inspectionComponents, onComponentsReady]);

  useLayoutEffect(() => {
    if (!inspectionId) return undefined;

    const component = inspectionComponents.find((entry) => entry.id === inspectionId);
    if (!component) return undefined;

    const parent = component.objects[0].parent;
    parent.updateWorldMatrix(true, false);
    const centerWorld = getObjectBounds(component.objects).getCenter(new THREE.Vector3());
    const centerParent = parent.worldToLocal(centerWorld.clone());
    const pivot = new THREE.Group();
    pivot.name = `InspectionPivot:${component.id}`;
    parent.add(pivot);
    pivot.position.copy(centerParent);
    parent.updateWorldMatrix(true, false);
    pivot.updateWorldMatrix(true, false);

    component.objects.forEach((object) => pivot.attach(object));

    const cameraDirection = camera.getWorldDirection(new THREE.Vector3()).negate();
    const inverseParentBasis = new THREE.Matrix3()
      .setFromMatrix4(parent.matrixWorld)
      .invert();
    const focusOffset = cameraDirection
      .multiplyScalar(0.58)
      .applyMatrix3(inverseParentBasis);

    component.pivotRef.current = pivot;
    activeInspectionRef.current = {
      component,
      parent,
      pivot,
      centerParent,
      focusPosition: centerParent.clone().add(focusOffset),
    };

    const selectedMeshes = new Set();
    component.objects.forEach((object) => {
      object.traverse((child) => {
        if (child.isMesh) selectedMeshes.add(child);
      });
    });

    model.traverse((object) => {
      if (!object.isMesh) return;
      const original = originalMaterials.get(object);
      if (!original) return;

      const selected = selectedMeshes.has(object);
      const apply = (material) => {
        const copy = material.clone();
        if (selected) {
          if (copy.emissive) {
            copy.emissive.set('#5b3c2c');
            copy.emissiveIntensity = Math.max(copy.emissiveIntensity, 0.12);
          } else if (copy.color) {
            copy.color.lerp(new THREE.Color('#c17b58'), 0.07);
          }
        } else if (copy.color) {
          copy.color.multiplyScalar(0.58);
        }
        activeMaterialCopiesRef.current.push(copy);
        return copy;
      };

      object.material = Array.isArray(original)
        ? original.map(apply)
        : apply(original);
    });

    return () => {
      pivot.rotation.set(0, 0, 0);
      pivot.position.copy(centerParent);
      pivot.scale.set(1, 1, 1);
      component.objects.forEach((object) => parent.attach(object));
      pivot.removeFromParent();
      component.pivotRef.current = null;
      activeInspectionRef.current = null;
      lastProgress.current = -1;

      model.traverse((object) => {
        if (object.isMesh && originalMaterials.has(object)) {
          object.material = originalMaterials.get(object);
        }
      });
      activeMaterialCopiesRef.current.forEach((material) => material.dispose());
      activeMaterialCopiesRef.current = [];
    };
  }, [camera, inspectionComponents, inspectionId, model, originalMaterials]);

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef?.current ?? 0, 0, 1);

    if (Math.abs(progress - lastProgress.current) >= 0.0001) {
      lastProgress.current = progress;

      parts.forEach((part) => {
        if (activeInspectionRef.current?.component.freezeObject === part.object) return;

        const stageProgress = part.stage === 1
          ? THREE.MathUtils.clamp(progress * 2, 0, 1)
          : THREE.MathUtils.clamp((progress - 0.5) * 2, 0, 1);
        const eased = THREE.MathUtils.smoothstep(stageProgress, 0, 1);

        part.object.position
          .copy(part.originalPosition)
          .addScaledVector(part.offset, eased);
      });
    }

    if (rigRef.current) {
      const focus = THREE.MathUtils.clamp(focusRef?.current ?? 0, 0, 1);
      const zoom = THREE.MathUtils.lerp(1, 1.14, focus);
      const openingOffset = THREE.MathUtils.clamp((size.width / size.height) * 1.65, 0.75, 3.2);
      rigRef.current.position.set(THREE.MathUtils.lerp(openingOffset, 0, focus), 0, 0);
      rigRef.current.scale.setScalar(zoom);
    }

    const inspection = activeInspectionRef.current;
    if (inspection) {
      if (inspectionClosingRef.current) {
        const fullTurn = Math.PI * 2;
        const rotationTarget = Math.round(inspection.pivot.rotation.y / fullTurn) * fullTurn;
        inspection.pivot.rotation.y = THREE.MathUtils.damp(
          inspection.pivot.rotation.y,
          rotationTarget,
          5,
          delta
        );
        inspection.pivot.position.lerp(inspection.centerParent, 1 - Math.exp(-5 * delta));
      } else {
        inspection.pivot.position.lerp(inspection.focusPosition, 1 - Math.exp(-4 * delta));
        inspection.pivot.rotation.y += delta * 0.24;
      }
    }

    const selected = inspectionComponents.find((component) => component.id === inspectionId);
    if (selected && leaderPathRef.current && rootRef.current && panelRef.current) {
      const worldPosition = selected.pivotRef.current
        ? selected.pivotRef.current.getWorldPosition(selected.worldPosition)
        : selected.anchorObject.localToWorld(selected.anchorLocal.clone());
      const projected = worldPosition.clone().project(state.camera);
      const rootBounds = rootRef.current.getBoundingClientRect();
      const panelBounds = panelRef.current.getBoundingClientRect();
      const startX = (projected.x * 0.5 + 0.5) * size.width;
      const startY = (-projected.y * 0.5 + 0.5) * size.height;
      const endX = panelBounds.left - rootBounds.left;
      const endY = panelBounds.top - rootBounds.top + Math.min(136, panelBounds.height * 0.3);
      const elbowX = startX + (endX - startX) * 0.55;
      const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${elbowX.toFixed(1)} ${startY.toFixed(1)} L ${elbowX.toFixed(1)} ${endY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      const anchorVisible = projected.z >= -1 && projected.z <= 1;

      leaderPathRef.current.setAttribute('d', path);
      leaderPathRef.current.style.visibility = anchorVisible ? 'visible' : 'hidden';
      if (leaderStartRef.current) {
        leaderStartRef.current.setAttribute('cx', startX.toFixed(1));
        leaderStartRef.current.setAttribute('cy', startY.toFixed(1));
        leaderStartRef.current.style.visibility = anchorVisible ? 'visible' : 'hidden';
      }
      if (leaderEndRef.current) {
        leaderEndRef.current.setAttribute('cx', endX.toFixed(1));
        leaderEndRef.current.setAttribute('cy', endY.toFixed(1));
        leaderEndRef.current.style.visibility = anchorVisible ? 'visible' : 'hidden';
      }
    }
  });

  return (
    <group ref={rigRef}>
      <primitive
        object={model}
        scale={modelFit.scale}
        position={modelFit.position}
      />
      <Hotspots
        components={inspectionComponents}
        rigRef={rigRef}
        progressRef={progressRef}
        selectedId={inspectionId}
        onSelect={onSelect}
      />
    </group>
  );
}

function CarScene({ progressRef, focusRef }) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const leaderPathRef = useRef(null);
  const leaderStartRef = useRef(null);
  const leaderEndRef = useRef(null);
  const inspectionTimerRef = useRef(null);
  const [components, setComponents] = useState([]);
  const [inspectionId, setInspectionId] = useState(null);
  const [panelReady, setPanelReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleComponentsReady = useCallback((items) => {
    setComponents(items);
  }, []);

  const openInspection = useCallback((id) => {
    if (id === inspectionId) return;
    window.clearTimeout(inspectionTimerRef.current);
    setIsClosing(false);
    setPanelReady(false);
    setInspectionId(id);
    inspectionTimerRef.current = window.setTimeout(() => setPanelReady(true), 680);
  }, [inspectionId]);

  const closeInspection = useCallback(() => {
    if (!inspectionId) return;
    window.clearTimeout(inspectionTimerRef.current);
    setIsClosing(true);
    inspectionTimerRef.current = window.setTimeout(() => {
      setInspectionId(null);
      setPanelReady(false);
      setIsClosing(false);
    }, 420);
  }, [inspectionId]);

  useEffect(() => () => window.clearTimeout(inspectionTimerRef.current), []);

  const selectedComponent = components.find((component) => component.id === inspectionId);

  return (
    <div className="car-scene" ref={rootRef}>
      <Canvas
        shadows
        camera={{
          position: [5.2, 2.8, 6.5],
          fov: 36,
          near: 0.1,
          far: 45,
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#08090a']} />
        <fog attach="fog" args={['#08090a', 12, 34]} />

        <Suspense fallback={<LoadingModel />}>
          <BasementEnvironment />
          <BugattiModel
            progressRef={progressRef}
            focusRef={focusRef}
            inspectionId={inspectionId}
            isClosing={isClosing}
            onComponentsReady={handleComponentsReady}
            rootRef={rootRef}
            panelRef={panelRef}
            leaderPathRef={leaderPathRef}
            leaderStartRef={leaderStartRef}
            leaderEndRef={leaderEndRef}
            onSelect={openInspection}
          />
          <Environment preset="warehouse" background={false} />

          <ContactShadows
            position={[0, 0.015, 0]}
            opacity={0.55}
            scale={10}
            blur={2.5}
            far={4}
          />
        </Suspense>

        <OrbitControls
          target={[0, 0.65, 0]}
          enablePan={false}
          enableZoom={false}
          enableRotate
          autoRotate={!inspectionId}
          autoRotateSpeed={0.35}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      <svg
        className={`inspection-leader${inspectionId ? ' is-active' : ''}${isClosing ? ' is-closing' : ''}`}
        aria-hidden="true"
      >
        <path ref={leaderPathRef} pathLength="1" />
        <circle ref={leaderStartRef} className="inspection-leader__start" r="3.5" />
        <circle ref={leaderEndRef} className="inspection-leader__end" r="3" />
      </svg>

      {selectedComponent && (
        <PartsInfo
          key={selectedComponent.id}
          ref={panelRef}
          component={selectedComponent}
          revealed={panelReady}
          isClosing={isClosing}
          onClose={closeInspection}
        />
      )}
    </div>
  );
}

useGLTF.preload('/models/bugatti-chiron.glb');

export default CarScene;
