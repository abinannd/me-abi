import React, { useCallback, useRef } from 'react';
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

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const applyProgress = useCallback((progress: number) => {
    const easeP = 1 - Math.pow(1 - progress, 2);
    const offsets = [70, -50, 90];
    offsets.forEach((o, i) => {
      const el = itemRefs.current[i];
      if (el) el.style.transform = `translate3d(0, ${Math.round((1 - easeP) * o)}px, 0)`;
    });
    const infoOpacity = String(Math.min(1, Math.max(0, (progress - 0.25) / 0.5)));
    infoRefs.current.forEach((el) => { if (el) el.style.opacity = infoOpacity; });
  }, []);

  return (
    <CurtainSection
      id="projects"
      zIndex={30}
      trackHeight="220vh"
      backgroundColor="#05080e"
      className="showcase-curtain"
      onProgress={applyProgress}
    >
      {(() => {
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
                ref={(el) => { itemRefs.current[0] = el; }}
              >
                <div className="gallery-media-wrapper">
                  <img src={imageLeft} alt="Procedural Synthesis" loading="lazy" />
                </div>
                <div
                  className="gallery-item-info"
                  ref={(el) => { infoRefs.current[0] = el; }}
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
                ref={(el) => { itemRefs.current[1] = el; }}
              >
                <div className="gallery-media-wrapper">
                  <img src={imageCenter} alt="Spatial Avatar" loading="eager" />
                </div>
                <div
                  className="gallery-item-info"
                  ref={(el) => { infoRefs.current[1] = el; }}
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
                ref={(el) => { itemRefs.current[2] = el; }}
              >
                <div className="gallery-media-wrapper">
                  <img src={imageRight} alt="Fluid Dynamics" loading="lazy" />
                </div>
                <div
                  className="gallery-item-info"
                  ref={(el) => { infoRefs.current[2] = el; }}
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
      })()}
    </CurtainSection>
  );
};

export default ShowcaseSection;
