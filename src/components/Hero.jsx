import { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './Hero.css';
import CarScene from './CarScene';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef(null);
  const shadeRef = useRef(null);
  const contentRef = useRef(null);
  const topLabelRef = useRef(null);
  const carFocusRef = useRef(0);
  const specsRef = useRef(null);
  const bottomRef = useRef(null);

  // Controls the 3D exploded-view animation
  const explosionProgressRef = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP EXPERIENCE
      mm.add('(min-width: 651px)', () => {
        const explosionState = { progress: 0 };
        const focusState = { progress: 0 };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=4200',
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Keep the left-side shade in the opening view, then clear it as the hero scrolls.
        timeline.to(
          shadeRef.current,
          {
            opacity: 0,
            duration: 1.4,
            ease: 'none',
          },
          0
        );

        // 1. REMOVE HERO CONTENT
        timeline.to(
          contentRef.current,
          {
            x: -100,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 1,
            ease: 'none',
          },
          0
        );

        // 2. REMOVE TOP LABEL
        timeline.to(
          topLabelRef.current,
          {
            opacity: 0,
            filter: 'blur(6px)',
            y: -30,
            duration: 0.6,
            ease: 'none',
          },
          0
        );

        // 3. REMOVE TECHNICAL DETAILS
        timeline.to(
          specsRef.current,
          {
            opacity: 0,
            filter: 'blur(5px)',
            x: 40,
            duration: 0.7,
            ease: 'none',
          },
          0
        );

        // 4. REMOVE BOTTOM NAVIGATION
        timeline.to(
          bottomRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'none',
          },
          0
        );

        // 5. Move the car into the center of the basement and bring it closer.
        timeline.to(
          focusState,
          {
            progress: 1,
            duration: 2,
            ease: 'none',
            onUpdate: () => {
              carFocusRef.current = focusState.progress;
            },
          },
          0
        );

        // 6. Separate the outer body, then reveal the interior and mechanics.
        timeline.to(
          explosionState,
          {
            progress: 1,
            duration: 2.4,
            ease: 'none',
            onUpdate: () => {
              explosionProgressRef.current = explosionState.progress;
            },
          },
          2
        );

        // 7. Reassemble the car before the pinned hero releases into the next section.
        timeline.to(
          explosionState,
          {
            progress: 0,
            duration: 2.4,
            ease: 'none',
            onUpdate: () => {
              explosionProgressRef.current = explosionState.progress;
            },
          },
          4.8
        );

        // Reset progress when scrolling back to the top
        timeline.eventCallback('onReverseComplete', () => {
          explosionProgressRef.current = 0;
          carFocusRef.current = 0;
        });

        return () => {
          explosionProgressRef.current = 0;
          carFocusRef.current = 0;
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      mm.add('(max-width: 650px)', () => {
        carFocusRef.current = 0.18;
        return () => {
          carFocusRef.current = 0;
        };
      });
      return () => mm.revert();
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>

      {/* BACKGROUND */}
      <div className="hero-background">
        <CarScene progressRef={explosionProgressRef} focusRef={carFocusRef} />
        <div className="hero-shade" ref={shadeRef} />
      </div>

      {/* TOP LABEL */}
      <div className="hero-top-label" ref={topLabelRef}>
        <span className="status-dot"></span>
        ADVANCED AUTOMOTIVE ENGINEERING
      </div>

      {/* LEFT CONTENT */}
      <div className="hero-content" ref={contentRef}>
        <div className="hero-eyebrow">
          <span></span>
          BEYOND THE MACHINE
        </div>

        <h1>
          ENGINEERING
          <br />
          <span>PERFECTION.</span>
        </h1>

        <p className="hero-description">
          Discover the extraordinary engineering hidden
          beneath the surface. Explore every component,
          every mechanism and every detail.
        </p>

        <div className="hero-buttons">
          <a href="#explore" className="hero-primary-btn">
            EXPLORE THE MACHINE
            <ArrowUpRight size={17} />
          </a>

          <button className="hero-secondary-btn">
            <span className="play-icon">
              <Play size={13} fill="currentColor" />
            </span>
            DISCOVER MORE
          </button>
        </div>
      </div>

      {/* RIGHT TECHNICAL DETAILS */}
      <div className="hero-specs" ref={specsRef}>
        <div>
          <span>01 / 04</span>
          <p>PRECISION</p>
        </div>

        <div>
          <span>360°</span>
          <p>INTERACTIVE VIEW</p>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="hero-bottom" ref={bottomRef}>
        <div className="hero-scroll">
          <ArrowDown size={15} />
          <span>SCROLL TO EXPLORE</span>
        </div>

        <div className="hero-bottom-center">
          AUTOMOTIVE ENGINEERING REDEFINED
        </div>

        <div className="hero-bottom-right">
          EST. 2026
        </div>
      </div>

    </section>
  );
}

export default Hero;
