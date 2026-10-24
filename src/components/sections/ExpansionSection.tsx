import React from 'react';
import { CurtainSection } from '../transitions/CurtainSection';
import { getImageByIndex } from '../../config/imageAssets';
import './ExpansionSection.css';

export const ExpansionSection: React.FC = () => {
  // Placement index 0 -> 1.png (Primary expanding image)
  const primaryImage = getImageByIndex(0);
  // Placement index 1 -> 2.png (Supporting secondary thumbnail)
  const secondaryImage = getImageByIndex(1);

  return (
    <CurtainSection
      id="about"
      zIndex={20}
      trackHeight="240vh"
      backgroundColor="#090d16"
      className="expansion-curtain"
    >
      {({ progress }) => {
        // Smooth easing for image dimensions
        const easeP = 1 - Math.pow(1 - progress, 2.5);

        // Calculate dynamic dimensions between initial editorial frame and full-stage expanse
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        const initialW = isMobile ? 320 : 460;
        const targetW = isMobile
          ? Math.min(window.innerWidth * 0.92, 540)
          : Math.min(1360, window.innerWidth * 0.92);

        const initialH = isMobile ? 200 : 280;
        const targetH = isMobile
          ? Math.min(window.innerHeight * 0.45, 360)
          : Math.min(620, window.innerHeight * 0.65);

        const currentW = Math.round(initialW + easeP * (targetW - initialW));
        const currentH = Math.round(initialH + easeP * (targetH - initialH));

        // Fade flanking editorial text as the image expands
        const flankOpacity = Math.max(0, 1 - progress * 2.5);
        const flankLeftX = -Math.round(progress * 40);
        const flankRightX = Math.round(progress * 40);

        return (
          <div className="expansion-container">
            {/* Header Rail */}
            <header className="expansion-header">
              <div>
                <div className="expansion-badge">01 // ARCHITECTURE & PHILOSOPHY</div>
                <h2 className="expansion-title">
                  HIGH-DIMENSIONAL DIGITAL INTERFACES
                </h2>
              </div>
              <div className="expansion-nav-tag">[ SCROLL TO EXPAND ]</div>
            </header>

            {/* Central Expansion Stage */}
            <div className="expansion-stage">
              {/* Left Editorial Flank */}
              <div
                className="expansion-flank-left"
                style={{
                  opacity: flankOpacity,
                  transform: `translate3d(${flankLeftX}px, 0, 0)`,
                  pointerEvents: flankOpacity < 0.1 ? 'none' : 'auto',
                }}
              >
                <p className="flank-quote">
                  "Where structured engineering dissolves into cinematic motion.
                  Every transition is an architectural commitment to performance."
                </p>
                <div className="secondary-thumb-caption">
                  SYS.01 // COMPUTED ARTIFACT
                </div>
              </div>

              {/* The Expanding Hero Frame */}
              <div
                className="expansion-image-frame"
                style={{
                  width: `${currentW}px`,
                  height: `${currentH}px`,
                }}
              >
                <img
                  src={primaryImage}
                  alt="Spatial Canvas Architecture"
                  loading="eager"
                />
              </div>

              {/* Right Supporting Flank */}
              <div
                className="expansion-flank-right"
                style={{
                  opacity: flankOpacity,
                  transform: `translate3d(${flankRightX}px, 0, 0)`,
                  pointerEvents: flankOpacity < 0.1 ? 'none' : 'auto',
                }}
              >
                <div className="secondary-thumbnail-card">
                  <img src={secondaryImage} alt="GPU Render Spec" />
                </div>
                <div className="secondary-thumb-caption">
                  SPEC // 4K PROCEDURAL TEXTURE
                </div>
              </div>
            </div>

            {/* Footer Metrics Rail */}
            <footer className="expansion-footer">
              <div className="expansion-metrics-row">
                <div className="metric-item">
                  <span className="metric-val">0.02s</span>
                  <span className="metric-label">Gaze Latency</span>
                </div>
                <div className="metric-item">
                  <span className="metric-val">60 FPS</span>
                  <span className="metric-label">GLSL Wave Canvas</span>
                </div>
                <div className="metric-item">
                  <span className="metric-val">100%</span>
                  <span className="metric-label">Native Document Scroll</span>
                </div>
              </div>

              <div className="expansion-spec-tag">
                THREE.JS • CUSTOM SHADERS • REACT 18 • TYPESCRIPT
              </div>
            </footer>
          </div>
        );
      }}
    </CurtainSection>
  );
};

export default ExpansionSection;
