import { Component, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, useGLTF } from '@react-three/drei';
import { Activity, ArrowUpRight, Cpu, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import './ExpertiseSection.css';

gsap.registerPlugin(ScrollTrigger);

const expertiseItems = [
  {
    number: '01', title: <>ENGINE<br />ENGINEERING</>, shortTitle: 'Engine Engineering',
    description: 'High-performance engine design and diagnostics.',
    url: '/models/car_engine_19_mb.glb', size: 2, rotation: [0, 0, 0],
  },
  {
    number: '02', title: <>BRAKE &<br />SAFETY SYSTEMS</>, shortTitle: 'Brake & Safety Systems',
    description: 'Advanced braking for maximum control.',
    url: '/models/vented_disk_brake__rotor.glb', size: 1.9, rotation: [Math.PI / 2, 0, 0],
  },
  {
    number: '03', title: <>WHEEL &<br />SUSPENSION</>, shortTitle: 'Wheel & Suspension',
    description: 'Superior stability for every journey.',
    url: '/models/scorpio_n_alloy_wheel.glb', size: 2, rotation: [0, 0, 0],
  },
  {
    number: '04', title: <>BODYWORK &<br />STRUCTURAL</>, shortTitle: 'Bodywork & Structural',
    description: 'Stronger build, greater protection.',
    url: '/models/bonnut.glb', size: 2.05, rotation: [Math.PI / 2, 0, 0],
  },
];

function PreviewModel({ url, size, rotation }) {
  const { scene: source } = useGLTF(url);
  const model = useMemo(() => {
    const clone = source.clone(true);
    clone.rotation.set(...rotation);
    clone.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const dimensions = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(dimensions.x, dimensions.y, dimensions.z);
    const fit = longestSide > 0 ? size / longestSide : 1;
    clone.scale.setScalar(fit);
    clone.position.set(-center.x * fit, -center.y * fit, -center.z * fit);
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
      }
    });
    return clone;
  }, [source, size, rotation]);

  const groupRef = useRef();
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.035;
  });

  return <group ref={groupRef}><primitive object={model} dispose={null} /></group>;
}

class PreviewErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <Html center><span className="expertise-card__model-status">MODEL UNAVAILABLE</span></Html>;
    }
    return this.props.children;
  }
}

function ExpertiseModelPreview({ item }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.68, 4.1], fov: 38, near: 0.1, far: 30 }}
      dpr={[1, 1.2]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.1} color="#e6e2dd" />
      <pointLight position={[-1.6, 0.3, 2]} intensity={1.25} distance={5} color="#c66c42" />
      <Environment preset="warehouse" background={false} />
      <PreviewErrorBoundary>
        <Suspense fallback={<Html center><span className="expertise-card__model-status">LOADING MODEL</span></Html>}>
          <PreviewModel {...item} />
        </Suspense>
      </PreviewErrorBoundary>
    </Canvas>
  );
}

function ExpertiseCard({ item, index }) {
  return (
    <article className="expertise-card" style={{ '--expertise-index': index }}>
      <div className="expertise-card__copy">
        <span className="expertise-card__number">{item.number} <i>/ 04</i></span>
        <h3>{item.title}</h3>
        <span className="expertise-card__rule" />
        <p>{item.description}</p>
        <a className="expertise-card__link" href="#diagnostics" aria-label={`Explore ${item.shortTitle} diagnostics`}>
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="expertise-card__model" aria-hidden="true">
        <ExpertiseModelPreview item={item} />
      </div>
      <span className="expertise-card__corner expertise-card__corner--top" />
      <span className="expertise-card__corner expertise-card__corner--bottom" />
    </article>
  );
}

function ExpertiseSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
 

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const entrance = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true },
      });
      entrance.fromTo('.expertise__eyebrow, .expertise__heading, .expertise__description, .expertise__actions',
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.1, ease: 'power2.out' }
      );
      entrance.fromTo('.expertise__showcase',
        { x: 26, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.9, ease: 'power2.out' },
        0.12
      );
      entrance.fromTo('.expertise-card',
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.1, ease: 'power2.out' },
        0.28
      );
      entrance.fromTo('.expertise__footer',
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power2.out' },
        0.55
      );
    }, sectionRef);
    return () => context.revert();
  }, []);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    if (video.paused) {
      try {
        await video.play();
        setVideoPlaying(true);
      } catch {
        setVideoPlaying(false);
      }
      return;
    }
    video.pause();
    setVideoPlaying(false);
  };

  const startAutoplay = async () => {
    setVideoReady(true);
    try {
      await videoRef.current?.play();
      setVideoPlaying(true);
    } catch {
      setVideoPlaying(false);
    }
  };

  return (
    <section className="expertise" id="expertise" ref={sectionRef} aria-labelledby="expertise-title">
      <div className="expertise__inner">
        <div className="expertise__topline">
          <div className="expertise__eyebrow"><i /> OUR EXPERTISE <span /> AUTOMOTIVE ENGINEERING</div>
          <span className="expertise__serial">// EXPERTISE 002 - 004</span>
        </div>

        <div className="expertise__hero-grid">
          <div className="expertise__intro">
            <h2 className="expertise__heading" id="expertise-title">OUR<br /><em>EXPERTISE.</em></h2>
            <p className="expertise__description">Cutting-edge automotive solutions, engineered for performance, safety and innovation.</p>
            <div className="expertise__actions">
  <a className="expertise__primary" href="#expertise-cards">
    EXPLORE OUR EXPERTISE
    <ArrowUpRight size={16} />
  </a>
</div>
          </div>

          <div className="expertise__showcase" id="expertise-video">
            <div className="expertise__video-meta"><span>ENGINEERING / IN MOTION</span><span>01 / 04</span></div>
           <div className="expertise__video-frame">
  <video
    ref={videoRef}
    src="/videos/repair.mp4"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    aria-label="Automotive repair showcase"
  />

  <div className="expertise__video-shade" />

  {videoError && (
    <div className="expertise__video-loading is-error">
      SHOWCASE VIDEO UNAVAILABLE
    </div>
  )}

  <div className="expertise__video-counter">
    <span /> 01 / 04
  </div>
</div>
          </div>
        </div>

        <div className="expertise__cards" id="expertise-cards">
          {expertiseItems.map((item, index) => <ExpertiseCard key={item.number} item={item} index={index} />)}
        </div>

        <div className="expertise__footer">
          <div className="expertise__features">
            <div><Activity size={20} /><span>REAL-TIME<br />MONITORING</span></div>
            <div><Cpu size={20} /><span>AI-ASSISTED<br />ANALYSIS</span></div>
            <div><ShieldCheck size={20} /><span>PROACTIVE<br />MAINTENANCE</span></div>
          </div>
          <div className="expertise__footer-note"><span /> AUTOMOTIVE HUB — ENGINEERED FOR A BETTER DRIVE</div>
        </div>
      </div>
    </section>
  );
}

export default ExpertiseSection;
