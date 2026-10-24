import React from 'react';
import { CurtainSection } from '../transitions/CurtainSection';
import { getImageByIndex } from '../../config/imageAssets';
import './ContactSection.css';

export const ContactSection: React.FC = () => {
  // Placement index 5 -> 2.png (cycles via images[5 % 4] = images[1])
  const contactImage = getImageByIndex(5);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CurtainSection
      id="contact"
      zIndex={40}
      trackHeight="160vh"
      backgroundColor="#05080c"
      className="contact-curtain"
    >
      {({ progress }) => {
        const easeP = 1 - Math.pow(1 - progress, 2);
        const visualY = Math.round((1 - easeP) * 50);
        const copyOpacity = Math.min(1, Math.max(0, progress * 1.8));

        return (
          <div className="contact-container">
            {/* Header Rail */}
            <header className="contact-header">
              <div>
                <div className="contact-badge">03 // INITIATE CONTACT</div>
                <h2 className="contact-title">
                  LET'S BUILD SOMETHING EXTRAORDINARY
                </h2>
              </div>
              <div className="contact-tag">[ COLLABORATIONS & SYSTEMS ]</div>
            </header>

            {/* Central Stage */}
            <div className="contact-center-stage">
              <div
                className="contact-copy-block"
                style={{ opacity: copyOpacity }}
              >
                <p className="contact-lead-text">
                  Specializing in bespoke web applications, WebGL graphics, and
                  high-touch user experiences that leave an unforgettable impression.
                </p>
                <p className="contact-sub-text">
                  Available for full-stack engineering contracts, creative technology
                  consulting, and immersive design engineering.
                </p>

                <div className="contact-buttons-row">
                  <a
                    href="mailto:abinandtv@gmail.com"
                    className="contact-cta-primary"
                  >
                    Send Message ↗
                  </a>
                  <a
                    href="https://github.com/abinannd"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-cta-secondary"
                  >
                    GitHub Portfolio ↗
                  </a>
                </div>
              </div>

              <div
                className="contact-visual-frame"
                style={{
                  transform: `translate3d(0, ${visualY}px, 0)`,
                }}
              >
                <img
                  src={contactImage}
                  alt="Creative Architecture"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Footer */}
            <footer className="contact-footer">
              <span className="contact-copyright">
                © 2026 ABINAND TV — CRAFTED WITH REACT, THREE.JS & VITE
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="back-to-top-btn"
                aria-label="Scroll back to top"
              >
                BACK TO TOP ↑
              </button>
            </footer>
          </div>
        );
      }}
    </CurtainSection>
  );
};

export default ContactSection;
