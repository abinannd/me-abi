import React from 'react';
import { CharacterVideo } from './components/CharacterVideo';
import { FluidWave } from './components/FluidWave';
import { PanelSequence } from './components/PanelSequence';
import { INITIAL_WAVE_CONFIG } from './config/waveConfig';

export const App: React.FC = () => {
  return (
    <>
      <div className="hero-container">
      {/* 1. LAYER 1: Minimal Top Navigation (z-index: 30) */}
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
            <li><a href="#skills" className="nav-link">Skills</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        <a href="#contact" className="nav-action-btn">
          Contact Me ↗
        </a>
      </header>

      {/* 2. Main Hero Stage */}
      <main className="hero-stage" id="hero">
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
            <a href="#projects" className="btn-primary">
              Explore Projects ↘
            </a>
            <a href="#contact" className="btn-secondary">
              Get in Touch
            </a>
          </div>
        </div>

        {/* 3. LAYER 2: Centered Character Video (z-index: 10) */}
        <div className="character-stage" aria-label="Hero Character Animation">
          <CharacterVideo
            src={`${import.meta.env.BASE_URL}assets/character/me2.mp4`}
            className="hero-character-media"
          />
        </div>

        {/* 4. LAYER 3: Procedural Fluid Wave Foreground Overlay (z-index: 20) */}
        <div className="wave-foreground-stage" aria-hidden="true">
          <FluidWave {...INITIAL_WAVE_CONFIG} />
        </div>
      </main>

      {/* Subtle Scroll Indicator at Viewport Base (z-index: 30) */}
      <div className="scroll-indicator" aria-hidden="true">
        <span className="scroll-text">SCROLL TO EXPLORE</span>
        <svg className="scroll-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
    <PanelSequence />
  </>
);
};

export default App;
