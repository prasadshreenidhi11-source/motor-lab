import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  X,
  CalendarDays,
  CheckCircle2,
  CarFront,
  Wrench,
} from "lucide-react";

import "./FinalCTA.css";

function FinalCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    service: "",
    date: "",
    message: "",
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const openModal = () => {
    setIsSubmitted(false);
    setIsOpen(true);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const today = new Date();
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <>
      {/* FINAL CTA SECTION */}

      <section className="final-cta">
        <div className="final-cta-grid"></div>
        <div className="final-cta-glow"></div>

        <div className="final-cta-container">

          {/* LEFT CONTENT */}

          <div className="final-cta-content">

            <div className="final-cta-eyebrow">
              <span className="final-cta-line"></span>
              YOUR JOURNEY STARTS HERE
            </div>

            <h2>
              READY TO
              <br />
              ELEVATE YOUR
              <br />
              <span>DRIVE?</span>
            </h2>

            <p>
              Give your vehicle the attention it deserves.
              Experience precision engineering, expert care,
              and automotive service without compromise.
            </p>

            <button
              className="final-cta-button"
              onClick={openModal}
              type="button"
            >
              BOOK YOUR APPOINTMENT
              <ArrowUpRight size={19} />
            </button>

            <div className="final-cta-note">
              <span className="final-cta-status-dot"></span>
              EXPERT SERVICE. EXCEPTIONAL RESULTS.
            </div>

          </div>

          {/* RIGHT IMAGE WITH ORANGE FRAME */}

          <div className="final-cta-visual">

            <div className="final-cta-frame">

              <div className="final-cta-frame-content">

                <div className="final-cta-image-glow"></div>

                <img
                  src="/images/polo.png"
                  alt="Volkswagen Polo GT"
                  className="final-cta-car-image"
                />

                <div className="final-cta-image-label">
                  <span>ENGINEERED FOR EXCELLENCE</span>
                  <ArrowUpRight size={16} />
                </div>

                <div className="final-cta-counter">
                  <span></span>
                  01 / 04
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM FEATURES */}

        <div className="final-cta-bottom">

          <div>
            <Wrench size={18} />
            <span>EXPERT AUTOMOTIVE CARE</span>
          </div>

          <div>
            <CarFront size={19} />
            <span>PRECISION ENGINEERING</span>
          </div>

          <div>
            <CalendarDays size={18} />
            <span>PERSONALIZED SERVICE</span>
          </div>

        </div>
      </section>

      {/* BOOKING MODAL */}

      {isOpen && (
        <div
          className="booking-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >

          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >

            <button
              className="booking-close"
              onClick={closeModal}
              type="button"
              aria-label="Close booking form"
            >
              <X size={22} />
            </button>

            {!isSubmitted ? (

              <>
                {/* FORM HEADER */}

                <div className="booking-header">

                  <div className="booking-icon">
                    <CalendarDays size={22} />
                  </div>

                  <span className="booking-eyebrow">
                    LET'S GET YOU MOVING
                  </span>

                  <h3 id="booking-title">
                    BOOK YOUR <span>APPOINTMENT.</span>
                  </h3>

                  <p>
                    Tell us a little about your vehicle and
                    the service you need. We'll take it from there.
                  </p>

                </div>

                {/* FORM */}

                <form
                  className="booking-form"
                  onSubmit={handleSubmit}
                >

                  <div className="booking-form-grid">

                    <div className="booking-field">
                      <label htmlFor="booking-name">
                        FULL NAME
                      </label>

                      <input
                        id="booking-name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-email">
                        EMAIL ADDRESS
                      </label>

                      <input
                        id="booking-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-phone">
                        PHONE NUMBER
                      </label>

                      <input
                        id="booking-phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        pattern="[0-9+\-\s()]{7,20}"
                        title="Enter a valid phone number"
                        required
                      />
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-vehicle">
                        YOUR VEHICLE
                      </label>

                      <input
                        id="booking-vehicle"
                        type="text"
                        name="vehicle"
                        placeholder="e.g. Volkswagen Polo"
                        value={formData.vehicle}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-service">
                        SERVICE REQUIRED
                      </label>

                      <select
                        id="booking-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select a service
                        </option>

                        <option value="Engine Repair">
                          Engine Repair
                        </option>

                        <option value="Brake Service">
                          Brake Service
                        </option>

                        <option value="Tyre & Wheel Service">
                          Tyre & Wheel Service
                        </option>

                        <option value="General Maintenance">
                          General Maintenance
                        </option>

                        <option value="Advanced Diagnostics">
                          Advanced Diagnostics
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-date">
                        PREFERRED DATE
                      </label>

                      <input
                        id="booking-date"
                        type="date"
                        name="date"
                        min={minimumDate}
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="booking-field booking-field-full">
                      <label htmlFor="booking-message">
                        ADDITIONAL MESSAGE
                        <span> OPTIONAL</span>
                      </label>

                      <textarea
                        id="booking-message"
                        name="message"
                        placeholder="Tell us more about your vehicle or the issue..."
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>

                  </div>

                  <button
                    className="booking-submit"
                    type="submit"
                  >
                    CONFIRM BOOKING
                    <ArrowUpRight size={19} />
                  </button>

                  <div className="booking-secure-note">
                    YOUR DETAILS WILL BE USED TO HANDLE YOUR BOOKING REQUEST.
                  </div>

                </form>
              </>

            ) : (

              /* SUCCESS SCREEN */

              <div className="booking-success">

                <div className="booking-success-icon">
                  <CheckCircle2 size={42} />
                </div>

                <span className="booking-eyebrow">
                  REQUEST COMPLETED
                </span>

                <h3>
                  THANK YOU,{" "}
                  <span>{formData.name.split(" ")[0]}!</span>
                </h3>

                <p>
                  Your booking details have been captured
                  in this session. A booking confirmation
                  will require a connected booking service.
                </p>

                <div className="booking-success-details">

                  <div>
                    <span>VEHICLE</span>
                    <strong>{formData.vehicle}</strong>
                  </div>

                  <div>
                    <span>SERVICE</span>
                    <strong>{formData.service}</strong>
                  </div>

                  <div>
                    <span>PREFERRED DATE</span>
                    <strong>{formData.date}</strong>
                  </div>

                </div>

                <button
                  className="booking-submit"
                  onClick={closeModal}
                  type="button"
                >
                  DONE
                  <ArrowUpRight size={19} />
                </button>

              </div>

            )}

          </div>

        </div>
      )}
    </>
  );
}

export default FinalCTA;