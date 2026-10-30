import React, { useEffect, useRef } from 'react';
import { subscribeScroll } from './scrollLoop';
import './CurtainSection.css';

export interface CurtainSectionProps {
  id?: string;
  zIndex: number;
  trackHeight?: string;
  className?: string;
  backgroundColor?: string;
  /**
   * Called (outside React) whenever the section's scroll progress changes, with the
   * sticky frame element. Use it to write transforms/styles directly — progress never
   * goes through React state, so scrolling does not re-render the tree.
   */
  onProgress?: (progress: number, frame: HTMLElement) => void;
  children: React.ReactNode;
}

export const CurtainSection: React.FC<CurtainSectionProps> = ({
  id,
  zIndex,
  trackHeight = '100vh',
  className = '',
  backgroundColor = 'var(--bg-deep-shadow)',
  onProgress,
  children,
}) => {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    // Cached geometry (document-space), refreshed only on resize / layout change.
    let trackTop = 0;
    let scrollableDist = 0;
    let lastProgress = -1;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      scrollableDist = track.offsetHeight - window.innerHeight;
      lastProgress = -1; // force a write after any re-measure
    };

    const update = (scrollY: number) => {
      const traveled = scrollY - trackTop;
      const progress = scrollableDist > 0
        ? Math.min(1, Math.max(0, traveled / scrollableDist))
        : traveled >= 0 ? 1 : 0;

      if (progress === lastProgress) return; // clamped (off-screen) sections do no work
      lastProgress = progress;
      sticky.style.setProperty('--section-progress', progress.toFixed(4));
      onProgressRef.current?.(progress, sticky);
    };

    return subscribeScroll({ measure, update });
  }, []);

  return (
    <section
      ref={trackRef}
      id={id}
      className={`curtain-track ${className}`}
      style={{
        height: trackHeight,
        zIndex,
      }}
    >
      <div
        ref={stickyRef}
        className="curtain-sticky-frame"
        style={{
          backgroundColor,
        }}
      >
        <div className="curtain-content-wrapper">{children}</div>
      </div>
    </section>
  );
};
