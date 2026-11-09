import { useState } from "react";

import {
  ArrowUpRight,
  ArrowUp,
  Camera,
  MessageCircle,
  Play,
  MapPin,
  Phone,
  Mail,
  Clock3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Our Services", href: "#services" },
    { name: "Advanced Diagnostics", href: "#diagnostics" },
    { name: "Why Choose Us", href: "#why-us" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Engine Repair",
    "Brake & Suspension",
    "Wheel & Tyre Care",
    "General Maintenance",
    "Advanced Diagnostics",
  ];

  return (
    <footer className="automotive-footer">

      <div className="footer-accent-line"></div>

      {/* NEWSLETTER */}

      <div className="footer-newsletter">

        <div className="footer-newsletter-content">

          <span className="footer-eyebrow">
            STAY CONNECTED
          </span>

          <h2>
            STAY AHEAD
            <br />
            OF THE <span>ROAD.</span>
          </h2>

          <p>
            Get automotive insights, maintenance tips,
            and the latest updates from our workshop.
          </p>

        </div>

        <div className="footer-newsletter-form-wrapper">

          <span className="footer-form-label">
            GET THE LATEST UPDATES
          </span>

          {!subscribed ? (
            <form
              className="footer-newsletter-form"
              onSubmit={handleSubscribe}
            >

              <div className="footer-email-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

              </div>

              <button type="submit">
                SUBSCRIBE
                <ArrowRight size={17} />
              </button>

            </form>
          ) : (
            <div className="footer-subscribe-success">
              <CheckCircle2 size={20} />
              Thanks for subscribing!
            </div>
          )}

          <span className="footer-privacy-note">
            BY SUBSCRIBING, YOU AGREE TO RECEIVE OUR UPDATES.
          </span>

        </div>

      </div>

      {/* MAIN FOOTER */}

      <div className="footer-main">

        {/* BRAND */}

        <div className="footer-brand-column">

          <a href="#home" className="footer-brand">

            <span className="footer-brand-icon">
              A
            </span>

            <span className="footer-brand-name">
              MOTOR
              <strong>LAB.</strong>
            </span>

          </a>

          <p className="footer-brand-description">
            Where precision meets performance.
            We bring together advanced automotive
            technology, expert craftsmanship, and
            exceptional vehicle care.
          </p>

          {/* SOCIAL ICONS */}

          <div className="footer-socials">

            <a
              href="#instagram"
              aria-label="Instagram"
              className="footer-social-link"
            >
              <Camera size={18} />
            </a>

            <a
              href="#facebook"
              aria-label="Facebook"
              className="footer-social-link"
            >
              <MessageCircle size={18} />
            </a>

            <a
              href="#youtube"
              aria-label="YouTube"
              className="footer-social-link"
            >
              <Play size={18} />
            </a>

          </div>

        </div>

        {/* QUICK LINKS */}

        <div className="footer-links-column">

          <h3>
            QUICK LINKS
            <span></span>
          </h3>

          <ul>
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href}>
                  <ArrowUpRight size={14} />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

        </div>

        {/* SERVICES */}

        <div className="footer-links-column">

          <h3>
            OUR SERVICES
            <span></span>
          </h3>

          <ul>
            {services.map((service) => (
              <li key={service}>
                <a href="#services">
                  <ArrowUpRight size={14} />
                  {service}
                </a>
              </li>
            ))}
          </ul>

        </div>

        {/* CONTACT */}

        <div className="footer-contact-column">

          <h3>
            GET IN TOUCH
            <span></span>
          </h3>

          <div className="footer-contact-item">

            <div className="footer-contact-icon">
              <MapPin size={18} />
            </div>

            <div>
              <span>WORKSHOP ADDRESS</span>
              <p>Add your workshop address here</p>
            </div>

          </div>

          <div className="footer-contact-item">

            <div className="footer-contact-icon">
              <Phone size={18} />
            </div>

            <div>
              <span>PHONE NUMBER</span>
              <p>Add your contact number</p>
            </div>

          </div>

          <div className="footer-contact-item">

            <div className="footer-contact-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>EMAIL ADDRESS</span>
              <p>Add your business email</p>
            </div>

          </div>

          <div className="footer-contact-item">

            <div className="footer-contact-icon">
              <Clock3 size={18} />
            </div>

            <div>
              <span>WORKING HOURS</span>
              <p>Monday – Saturday</p>
              <p>9:00 AM – 7:00 PM</p>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM BAR */}

      <div className="footer-bottom">

        <p>
          © {currentYear} <span>AUTOMOTIVE HUB.</span> ALL RIGHTS RESERVED.
        </p>

        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>

        <button
          className="footer-back-top"
          onClick={scrollToTop}
          type="button"
        >
          BACK TO TOP
          <ArrowUp size={16} />
        </button>

      </div>

      <div className="footer-watermark">
        AUTOMOTIVE
      </div>

    </footer>
  );
}

export default Footer;