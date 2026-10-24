import React from 'react';
import { CurtainSection } from '../transitions/CurtainSection';
import { getImageByIndex } from '../../config/imageAssets';
import './ShowcaseSection.css';

export const ShowcaseSection: React.FC = () => {
  // Image cycle sequence rule:
  // Placement index 2 -> 3.png
  // Placement index 3 -> 4.png
  // Placement index 4 -> 1.png
  const imageLeft = getImageByIndex(2);
  const imageCenter = getImageByIndex(3);
  const imageRight = getImageByIndex(4);

  return (
    <CurtainSection
      id="projects"
      zIndex={30}
      trackHeight="220vh"
      backgroundColor="#05080e"
      className="showcase-curtain"
    >
      {({ progress }) => {
        // Smooth easing for independent image movement
        const easeP = 1 - Math.pow(1 - progress, 2);

        // Individual vertical parallax translations that settle into destination
        const leftY = Math.round((1 - easeP) * 70);
        const centerY = Math.round((1 - easeP) * -50);
        const rightY = Math.round((1 - easeP) * 90);

        // Opacity reveal for supporting descriptions as composition locks
        const infoOpacity = Math.min(1, Math.max(0, (progress - 0.25) / 0.5));

        return (
          <div className="showcase-container">
            {/* Header Rail */}
            <header className="showcase-header">
              <div>
                <div className="showcase-badge">02 // SELECTED ARTIFACTS</div>
                <h2 className="showcase-title">
                  SYNTHESIS OF CODE & PERCEPTION
                </h2>
              </div>
              <div className="showcase-counter">[ 03 CURATED PROJECTS ]</div>
            </header>

            {/* Gallery Grid */}
            <div className="showcase-gallery">
              {/* Left Item */}
              <div
                className="gallery-item gallery-item-side"
                style={{
                  transform: `translate3d(0, ${leftY}px, 0)`,
                }}
              >
                <div className="gallery-media-wrapper">
                  <img src={imageLeft} alt="Procedural Synthesis" loading="lazy" />
                </div>
                <div
                  className="gallery-item-info"
                  style={{ opacity: infoOpacity }}
                >
                  <span className="gallery-item-tag">SYS // GLSL SHADER</span>
                  <h3 className="gallery-item-title">Procedural Synthesis</h3>
                  <p className="gallery-item-desc">
                    Real-time parametric vector contour lines driven by mathematical noise.
                  </p>
                </div>
              </div>

              {/* Center Featured Item */}
              <div
                className="gallery-item gallery-item-center"
                style={{
                  transform: `translate3d(0, ${centerY}px, 0)`,
                }}
              >
                <div className="gallery-media-wrapper">
                  <img src={imageCenter} alt="Spatial Avatar" loading="eager" />
                </div>
                <div
                  className="gallery-item-info"
                  style={{ opacity: infoOpacity }}
                >
                  <span className="gallery-item-tag">CORE // DISCRETE GAZE</span>
                  <h3 className="gallery-item-title">Spatial Avatar Engine</h3>
                  <p className="gallery-item-desc">
                    Cursor-oriented gaze states mapped seamlessly across discrete timestamps.
                  </p>
                </div>
              </div>

              {/* Right Item */}
              <div
                className="gallery-item gallery-item-side"
                style={{
                  transform: `translate3d(0, ${rightY}px, 0)`,
                }}
              >
                <div className="gallery-media-wrapper">
                  <img src={imageRight} alt="Fluid Dynamics" loading="lazy" />
                </div>
                <div
                  className="gallery-item-info"
                  style={{ opacity: infoOpacity }}
                >
                  <span className="gallery-item-tag">RENDER // WEBGL PIPELINE</span>
                  <h3 className="gallery-item-title">Fluid Wave Overlay</h3>
                  <p className="gallery-item-desc">
                    GPU-accelerated wave geometry operating with zero frame skipping.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="showcase-footer">
              <span className="showcase-footer-text">
                All systems engineered for maximum frame rate and fluid touch response.
              </span>
              <span className="showcase-footer-tag">
                [ INDEX 02 — ME-ABI SYSTEM ]
              </span>
            </footer>
          </div>
        );
      }}
    </CurtainSection>
  );
};

export default ShowcaseSection;
