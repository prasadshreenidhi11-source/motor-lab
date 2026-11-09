import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Activity, Cpu, ShieldCheck, Gauge, Disc3, CircleDot, ScanLine } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import DiagnosticsScene, { DiagnosticsBackground } from './DiagnosticsScene';
import './DiagnosticsSection.css';

gsap.registerPlugin(ScrollTrigger);

const systems = [
  {
    number: '01', name: 'ENGINE', short: 'ENGINE', icon: Activity,
    description: 'A close inspection of the power unit, its air path, and the hardware that turns combustion into motion.',
    metrics: [['ENGINE HEALTH', '98%', 'Nominal'], ['TEMPERATURE', '72°C', 'Normal range'], ['PERFORMANCE', 'OPTIMAL', 'Within range']],
    category: 'POWERTRAIN', note: 'ILLUSTRATIVE DIAGNOSTICS',
  },
  {
    number: '02', name: 'BRAKE SYSTEM', short: 'BRAKES', icon: Disc3,
    description: 'Rotor, caliper, hub and pad surfaces arranged for a focused look at stopping hardware.',
    metrics: [['BRAKE HEALTH', '98%', 'Nominal'], ['PAD CONDITION', 'GOOD', 'Low wear'], ['BRAKING PERFORMANCE', 'OPTIMAL', 'Within range']],
    category: 'CHASSIS / SAFETY', note: 'ILLUSTRATIVE DIAGNOSTICS',
  },
  {
    number: '03', name: 'TYRE & WHEEL', short: 'WHEEL', icon: CircleDot,
    description: 'Tread, sidewall and forged-style spoke geometry shown as one independent rolling assembly.',
    metrics: [['TYRE PRESSURE', '34 PSI', 'Nominal'], ['TYRE HEALTH', 'GOOD', 'Even wear'], ['WHEEL CONDITION', 'OPTIMAL', 'Within range']],
    category: 'ROAD CONTACT', note: 'ILLUSTRATIVE DIAGNOSTICS',
  },
  {
    number: '04', name: 'BONNET', short: 'BODYWORK', icon: ScanLine,
    description: 'A formed exterior skin with underside bracing, edge returns and hinge hardware for body inspection.',
    metrics: [['BODY PANEL', 'EXCELLENT', 'Surface clear'], ['STRUCTURAL INSPECTION', 'GOOD', 'No visible issue'], ['SURFACE CONDITION', 'OPTIMAL', 'Finish intact']],
    category: 'BODY / STRUCTURE', note: 'ILLUSTRATIVE DIAGNOSTICS',
  },
];

function DiagnosticsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [timerReset, setTimerReset] = useState(0);
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const transitionTimerRef = useRef(0);
  const active = systems[activeIndex];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setSectionVisible(entry.isIntersecting);
    }, { threshold: 0.12 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncPageVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', syncPageVisibility);
    return () => document.removeEventListener('visibilitychange', syncPageVisibility);
  }, []);

  const selectSystem = useCallback((index) => {
    if (index !== activeIndex) {
      window.clearTimeout(transitionTimerRef.current);
      setOutgoingIndex(activeIndex);
      setActiveIndex(index);
      transitionTimerRef.current = window.setTimeout(() => setOutgoingIndex(null), 700);
    }
    setTimerReset((value) => value + 1);
  }, [activeIndex]);

  useEffect(() => {
    if (!sectionVisible || !pageVisible) return undefined;
    const timer = window.setTimeout(() => {
      selectSystem((activeIndex + 1) % systems.length);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, pageVisible, sectionVisible, selectSystem, timerReset]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo('.diagnostics__layout', { y: 18, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      });
      gsap.fromTo(visualRef.current, { opacity: 0 }, {
        opacity: 1,
        duration: 1.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    }, sectionRef);
    return () => {
      context.revert();
      window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const scrollToSelector = () => document.getElementById('diagnostics-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return (
    <section className="diagnostics" id="diagnostics" ref={sectionRef} aria-labelledby="diagnostics-title">
      <div className="diagnostics__backdrop" aria-hidden="true">
        <div className="diagnostics__environment">
          <DiagnosticsBackground />
        </div>
        <div className="diagnostics__shade" />
        <div className="diagnostics__grain" />
      </div>

      <div className="diagnostics__model-layer" ref={visualRef}>
        <DiagnosticsScene activeIndex={activeIndex} outgoingIndex={outgoingIndex} />
      </div>

      <div className="diagnostics__layout">
        <div className="diagnostics__left">
          <div className="diagnostics__eyebrow"><span /> ADVANCED DIAGNOSTICS</div>
          <p className="diagnostics__index"><span>TECHNICAL STUDY</span><span>04 / SYSTEMS</span></p>
          <h2 id="diagnostics-title">EVERY DETAIL.<br /><em>EVERY DIAGNOSIS.</em></h2>
          <p className="diagnostics__copy">Advanced diagnostics that go beyond the surface — real-time insights, peak performance, and total control.</p>

          <div className="diagnostics__actions">
            <button className="diagnostics__primary" type="button" onClick={scrollToSelector}>EXPLORE DIAGNOSTICS <ArrowUpRight size={16} /></button>
            <a className="diagnostics__demo" href="#diagnostics-selector" onClick={(event) => { event.preventDefault(); scrollToSelector(); }}><span><ArrowDownRight size={15} /></span> WATCH DEMO</a>
          </div>

          <div className="diagnostics__features">
            <div><Activity size={19} /><span>REAL-TIME<br />MONITORING</span></div>
            <div><Cpu size={19} /><span>AI-ASSISTED<br />ANALYSIS</span></div>
            <div><ShieldCheck size={19} /><span>PROACTIVE<br />MAINTENANCE</span></div>
          </div>
        </div>

        <div className="diagnostics__right">
          <div className="diagnostics__live"><i /> COMPONENT SELECTION <span>DRAG 360° · AUTO CYCLE</span></div>
          <div className="diagnostics__component-tag"><span>{active.number}</span><div><small>SELECTED ASSEMBLY</small><b>{active.name}</b></div><ActiveIcon size={19} /></div>

          <div className="diagnostics__metrics" aria-live="polite">
            {active.metrics.map(([label, value, status], index) => (
              <article className="diagnostic-card" key={`${active.number}-${label}`} style={{ '--card-index': index }}>
                <div className="diagnostic-card__top"><span>{active.number} / 0{index + 1}</span><i /></div>
                <p>{label}</p>
                <strong>{value}</strong>
                <small>{status}</small>
              </article>
            ))}
          </div>

          <div className="diagnostics__system-copy">
            <span>{active.category}</span>
            <p>{active.description}</p>
          </div>

        </div>
      </div>

      <div className="diagnostics__footer">
        <div className="diagnostics__selector" id="diagnostics-selector" role="tablist" aria-label="Diagnostic components">
          {systems.map((system, index) => {
            const Icon = system.icon;
            return <button
              key={system.number}
              className={`diagnostics__option${activeIndex === index ? ' is-active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => selectSystem(index)}
            >
              <span>{system.number}</span><Icon size={17} /><b>{system.short}</b><ArrowUpRight className="diagnostics__option-arrow" size={14} />
            </button>;
          })}
        </div>
        <p className="diagnostics__disclaimer"><Gauge size={12} /> {active.note} — SAMPLE VALUES FOR PRESENTATION ONLY</p>
      </div>
    </section>
  );
}

export default DiagnosticsSection;
