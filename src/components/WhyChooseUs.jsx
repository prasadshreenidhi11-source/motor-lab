import React, { useState } from "react";

import {
  ArrowUpRight,
  ArrowRight,
  Play,
  ShieldCheck,
  Cpu,
  Settings,
  Handshake,
  Trophy,
  Headset,
  BadgeCheck,
} from "lucide-react";

import "./WhyChooseUs.css";

// ========================================
// WHY CHOOSE US CARD DATA
// ========================================

const expertiseCards = [
  {
    number: "01 / 04",
    title: "EXPERT",
    subtitle: "TECHNICIANS",
    description: "Skilled professionals with global expertise.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    number: "02 / 04",
    title: "CUTTING-EDGE",
    subtitle: "TECHNOLOGY",
    description: "State-of-the-art tools for precision care.",
    icon: Cpu,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85",
  },
  {
    number: "03 / 04",
    title: "PREMIUM",
    subtitle: "QUALITY",
    description: "Only the highest standards, always.",
    icon: Settings,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    number: "04 / 04",
    title: "CUSTOMER",
    subtitle: "FIRST",
    description: "Your satisfaction is our priority.",
    icon: Handshake,
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=85",
  },
];

// ========================================
// WHY CHOOSE US COMPONENT
// ========================================

function WhyChooseUs() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="why-section" id="why-choose-us">
      <div className="why-container">

        {/* TOP LABEL */}

        <div className="why-top-label">
          <span className="why-label-dot"></span>

          <span className="why-label-title">
            WHY CHOOSE US
          </span>

          <span className="why-label-line"></span>

          <span className="why-label-subtitle">
            THE AUTOMOTIVE HUB ADVANTAGE
          </span>
        </div>

        {/* MAIN CONTENT */}

        <div className="why-main-grid">

          {/* LEFT CONTENT */}

          <div className="why-content">

            <h2 className="why-heading">
              <span>WHY</span>

              <span className="why-heading-orange">
                CHOOSE US.
              </span>
            </h2>

            <p className="why-description">
              Experience the difference with our commitment
              to excellence, innovation and unparalleled service.
            </p>

            <div className="why-actions">

              <a
                href="#expertise"
                className="why-primary-btn"
              >
                DISCOVER OUR ADVANTAGE
                <ArrowUpRight size={19} />
              </a>

              <button
                className="why-video-btn"
                type="button"
              >
                <span className="why-play-circle">
                  <Play size={16} fill="currentColor" />
                </span>

                WATCH OUR STORY
              </button>

            </div>

          </div>

          {/* RIGHT MAIN IMAGE */}

          <div className="why-showcase">

            <div className="why-showcase-frame">

              <img
                src="/images/polo.png"
                alt="Automotive Hub premium car showcase"
                className="why-showcase-image"
              />

              <div className="why-image-overlay"></div>

              <div className="why-frame-corner why-corner-tl"></div>
              <div className="why-frame-corner why-corner-tr"></div>
              <div className="why-frame-corner why-corner-bl"></div>
              <div className="why-frame-corner why-corner-br"></div>

              <div className="why-image-counter">
                <span></span>
                01 / 04
              </div>

            </div>

          </div>

        </div>

        {/* ==================================
            EXPANDABLE HOVER CARDS
        ================================== */}

        <div
          className="why-expandable-cards"
          onMouseLeave={() => setActiveCard(0)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setActiveCard(0);
            }
          }}
        >

          {expertiseCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article
                key={card.number}
                className={`why-expand-card ${
                  activeCard === index ? "active" : ""
                }`}
                tabIndex={0}
                onMouseEnter={() => setActiveCard(index)}
                onFocus={() => setActiveCard(index)}
                onClick={() => setActiveCard(index)}
                aria-label={`${card.title} ${card.subtitle}`}
                aria-expanded={activeCard === index}
              >

                {/* CARD IMAGE */}

                <img
                  src={card.image}
                  alt={`${card.title} ${card.subtitle}`}
                  className="why-expand-image"
                  loading="lazy"
                />

                {/* IMAGE OVERLAY */}

                <div className="why-expand-overlay"></div>

                {/* CARD NUMBER */}

                <div className="why-expand-number">
                  {card.number}
                </div>

                {/* CARD CONTENT */}

                <div className="why-expand-content">

                  <Icon
                    className="why-expand-icon"
                    size={29}
                    strokeWidth={1.7}
                  />

                  <h3>
                    {card.title}
                    <br />
                    {card.subtitle}
                  </h3>

                  <p>
                    {card.description}
                  </p>

                  <span className="why-expand-arrow">
                    <ArrowRight size={19} />
                  </span>

                </div>

              </article>
            );
          })}

        </div>

        {/* ==================================
            BOTTOM TRUST INDICATORS
        ================================== */}

        <div className="why-bottom">

          <div className="why-trust-items">

            <div className="why-trust-item">
              <BadgeCheck size={31} />

              <span>
                TRUSTED
                <br />
                BY ENTHUSIASTS
              </span>
            </div>

            <div className="why-trust-item">
              <Trophy size={31} />

              <span>
                PROVEN
                <br />
                PERFORMANCE
              </span>
            </div>

            <div className="why-trust-item">
              <Headset size={31} />

              <span>
                24/7
                <br />
                SUPPORT
              </span>
            </div>

          </div>

          <div className="why-bottom-message">
            <span></span>

            DRIVE WITH CONFIDENCE

            <span></span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;