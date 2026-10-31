import React, { useCallback, useRef } from 'react';
import { CurtainSection } from '../transitions/CurtainSection';
import { getImageByIndex } from '../../config/imageAssets';
import './ExpansionSection.css';

export const ExpansionSection: React.FC = () => {
  // Placement index 0 -> 1.png (Primary expanding image)
  const primaryImage = getImageByIndex(0);
  // Placement index 1 -> 2.png (Supporting secondary thumbnail)
  const secondaryImage = getImageByIndex(1);

  const frameRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Scroll progress is applied straight to the DOM (no React state, no re-render per frame).
  const applyProgress = useCallback((progress: number) => {
    const easeP = 1 - Math.pow(1 - progress, 2.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 768;
    const initialW = isMobile ? 320 : 460;
    const targetW = isMobile ? Math.min(w * 0.92, 540) : Math.min(1360, w * 0.92);
    const initialH = isMobile ? 200 : 280;
    const targetH = isMobile ? Math.min(h * 0.45, 360) : Math.min(620, h * 0.65);

    const frame = frameRef.current;
    if (frame) {
      frame.style.width = `${Math.round(initialW + easeP * (targetW - initialW))}px`;
      frame.style.height = `${Math.round(initialH + easeP * (targetH - initialH))}px`;
    }

    const flankOpacity = Math.max(0, 1 - progress * 2.5);
    const dx = Math.round(progress * 40);
    const pe = flankOpacity < 0.1 ? 'none' : 'auto';
    const left = leftRef.current;
    if (left) {
      left.style.opacity = String(flankOpacity);
      left.style.transform = `translate3d(${-dx}px, 0, 0)`;
      left.style.pointerEvents = pe;
    }
    const right = rightRef.current;
    if (right) {
      right.style.opacity = String(flankOpacity);
      right.style.transform = `translate3d(${dx}px, 0, 0)`;
      right.style.pointerEvents = pe;
    }
  }, []);

  return (
    <CurtainSection
      id="about"
      zIndex={20}
      trackHeight="240vh"
      backgroundColor="#1A0F2E"
      className="expansion-curtain"
      onProgress={applyProgress}
    >
      {(() => {
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
                ref={leftRef}
                className="expansion-flank-left"
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
                ref={frameRef}
                className="expansion-image-frame"
              >
                <img
                  src={primaryImage}
                  alt="Spatial Canvas Architecture"
                  loading="eager"
                />
              </div>

              {/* Right Supporting Flank */}
              <div
                ref={rightRef}
                className="expansion-flank-right"
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
      })()}
    </CurtainSection>
  );
};

export default ExpansionSection;
