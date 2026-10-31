import React from 'react';
import { CurtainSection } from './components/transitions/CurtainSection';
import { CursorChaseCharacter } from './components/CursorChaseCharacter';
import { FluidWave } from './components/FluidWave';
import { INITIAL_WAVE_CONFIG } from './config/waveConfig';
import { ExpansionSection } from './components/sections/ExpansionSection';
import { ShowcaseSection } from './components/sections/ShowcaseSection';
import { ContactSection } from './components/sections/ContactSection';

export const App: React.FC = () => {
  return (
    <div className="site-canvas">
      {/* 1. HERO SECTION (z-index: 10, stationary pinned stage) */}
      <CurtainSection
        id="hero"
        zIndex={10}
        trackHeight="100vh"
        backgroundColor="var(--bg-deep-shadow)"
      >
        <div className="hero-container">
          {/* LAYER 1: Minimal Top Navigation (z-index: 30) */}
          <header className="navbar">
            <a href="#hero" className="brand">
              <span className="brand-badge">ABI</span>
              <div className="brand-text">
                <span className="brand-name">ABINAND TV</span>
                <span className="brand-role">Creative Technologist</span>
              </div>
            </a>

            <nav aria-label="Main Navigation">
              <ul className="nav-links">
                <li><a href="#about" className="nav-link">About</a></li>
                <li><a href="#projects" className="nav-link">Projects</a></li>
                <li><a href="#contact" className="nav-link">Contact</a></li>
              </ul>
            </nav>

            <a href="#contact" className="nav-action-btn">
              Contact Me ↗
            </a>
          </header>

          {/* LAYER 2: Main Hero Stage */}
          <main className="hero-stage">
            {/* Upper Hero Typography & Context (z-index: 30) */}
            <div className="hero-header-block">
              <div className="hero-role-pill">
                <span className="pulse-dot" />
                <span>Engineer × Creative Technologist × Builder</span>
              </div>

              <h1 className="hero-headline">
                There Somthing About Me<br />
                <span className="text-gradient">That Feel Different.</span>
              </h1>

              <div className="hero-cta-row">
                <a href="#about" className="btn-primary">
                  Explore Architecture ↘
                </a>
                <a href="#contact" className="btn-secondary">
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Centered Character Video (z-index: 10) */}
            <div className="character-stage" aria-label="Hero Character Animation">
              <CursorChaseCharacter className="hero-character-media" />
            </div>

            {/* Procedural Fluid Wave Foreground Overlay (z-index: 20) */}
            <div className="wave-foreground-stage" aria-hidden="true">
              <FluidWave {...INITIAL_WAVE_CONFIG} />
            </div>
          </main>

          {/* Subtle Scroll Indicator at Viewport Base (z-index: 30) */}
          <div className="scroll-indicator" aria-hidden="true">
            <span className="scroll-text">SCROLL TO EXPLORE</span>
            <svg
              className="scroll-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </CurtainSection>

      {/* 2. SECTION 01: ARCHITECTURE & IMAGE EXPANSION (z-index: 20) */}
      <ExpansionSection />

      {/* 3. SECTION 02: SELECTED WORKS & PARALLAX CHOREOGRAPHY (z-index: 30) */}
      <ShowcaseSection />

      {/* 4. SECTION 03: INITIATE CONTACT & CLOSING CURTAIN (z-index: 40) */}
      <ContactSection />
    </div>
  );
};

export default App;
