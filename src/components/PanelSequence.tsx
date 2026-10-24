import React, { useEffect, useRef } from 'react';
import './PanelSequence.css';

const PANEL_COUNT = 8;

interface PanelSequenceProps {
  trackRef?: React.RefObject<HTMLElement | null>;
}

export const PanelSequence: React.FC<PanelSequenceProps> = ({ trackRef }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // In reduced motion mode, show all panels immediately in resting place
      panelRefs.current.forEach((panel) => {
        if (panel) panel.style.transform = 'none';
      });
      contentRefs.current.forEach((content) => {
        if (content) {
          content.style.opacity = '1';
          content.style.pointerEvents = 'auto';
        }
      });
      return;
    }

    let rafId: number | null = null;

    const updateTransforms = () => {
      const track =
        trackRef?.current ||
        (overlayRef.current?.closest('.takeover-scroll-track') as HTMLElement | null);

      if (!track) return;

      const rect = track.getBoundingClientRect();
      const trackTop = -rect.top;
      const scrollableDistance = track.offsetHeight - window.innerHeight;

      const rawProgress = scrollableDistance > 0 ? trackTop / scrollableDistance : 0;
      const progress = Math.min(1, Math.max(0, rawProgress));

      const viewportH = window.innerHeight;

      // Update each panel's physical vertical translation based on staggered progress
      for (let i = 0; i < PANEL_COUNT; i++) {
        const panelEl = panelRefs.current[i];
        if (!panelEl) continue;

        // Staggered entrance: each panel begins 5% later in scroll progress
        const start = i * 0.05;
        const duration = 0.55;
        const rawPanelP = Math.min(1, Math.max(0, (progress - start) / duration));

        // Smooth cubic ease-out
        const easePanelP = 1 - Math.pow(1 - rawPanelP, 3);

        // Calculate translation from off-screen bottom (viewportH + 80px) to resting position (0px)
        const currentY = (1 - easePanelP) * (viewportH + 80);
        panelEl.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
      }

      // Content layer reveal: appears smoothly as the seven panels settle into final position
      const contentProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.12));
      const contentOpacityStr = contentProgress.toFixed(3);
      const isContentActive = contentProgress > 0.8;

      contentRefs.current.forEach((layerEl) => {
        if (!layerEl) return;
        layerEl.style.opacity = contentOpacityStr;
        layerEl.style.pointerEvents = isContentActive ? 'auto' : 'none';
      });
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateTransforms();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial position calculation on mount
    updateTransforms();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [trackRef]);

  return (
    <div
      ref={overlayRef}
      className="panel-sequence-overlay"
      aria-hidden="true"
      id="panels-takeover"
    >
      <div className="panel-sequence-container">
        {Array.from({ length: PANEL_COUNT }, (_, index) => (
          <div
            key={index}
            ref={(el) => (panelRefs.current[index] = el)}
            className="glass-panel"
            style={{ '--panel-index': index } as React.CSSProperties}
          >
            {/* Maintainable content layer: empty now, ready for future content */}
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className="panel-content-layer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelSequence;
