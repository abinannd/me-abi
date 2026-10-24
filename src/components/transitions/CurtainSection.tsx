import React, { useEffect, useRef, useState } from 'react';
import './CurtainSection.css';

export interface CurtainSectionProps {
  id?: string;
  zIndex: number;
  trackHeight?: string;
  className?: string;
  backgroundColor?: string;
  children: React.ReactNode | ((props: { progress: number; isPinned: boolean }) => React.ReactNode);
}

export const CurtainSection: React.FC<CurtainSectionProps> = ({
  id,
  zIndex,
  trackHeight = '100vh',
  className = '',
  backgroundColor = 'var(--bg-deep-shadow)',
  children,
}) => {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollableDist = track.offsetHeight - viewportH;

      // Section is active / pinned when its top edge has reached or passed 0
      const trackTop = -rect.top;
      const pinned = rect.top <= 0 && rect.bottom >= viewportH;
      setIsPinned(pinned);

      let currentProgress = 0;
      if (scrollableDist > 0) {
        currentProgress = Math.min(1, Math.max(0, trackTop / scrollableDist));
      } else {
        currentProgress = rect.top <= 0 ? 1 : 0;
      }

      setProgress(currentProgress);

      if (stickyRef.current) {
        stickyRef.current.style.setProperty('--section-progress', currentProgress.toFixed(4));
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
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
        <div className="curtain-content-wrapper">
          {typeof children === 'function' ? children({ progress, isPinned }) : children}
        </div>
      </div>
    </section>
  );
};
