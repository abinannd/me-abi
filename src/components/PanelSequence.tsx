import React, { useEffect, useRef } from 'react';
import './PanelSequence.css';

const PANEL_COUNT = 7;

export const PanelSequence: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    // Trigger reveal when section enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasRevealedRef.current) {
          hasRevealedRef.current = true;
          const panels = sectionElement.querySelectorAll<HTMLElement>('.glass-panel');
          panels.forEach((panel) => {
            panel.classList.add('is-visible');
          });
          // Reveal plays only once per page load; disconnect once triggered
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="panel-sequence-section"
      aria-hidden="true"
      id="panels"
    >
      <div className="panel-sequence-container">
        {Array.from({ length: PANEL_COUNT }, (_, index) => (
          <div
            key={index}
            className="glass-panel"
            style={{ '--panel-index': index } as React.CSSProperties}
          />
        ))}
      </div>
    </section>
  );
};

export default PanelSequence;
