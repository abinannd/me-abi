import React, { useState } from 'react';
import { FluidWave } from './components/FluidWave';

export const App: React.FC = () => {
  // Wave customizer state
  const [waveHeight, setWaveHeight] = useState<number>(1.0);
  const [lineDensity, setLineDensity] = useState<number>(1.0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [glow, setGlow] = useState<number>(1.0);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState<boolean>(false);

  // Palette swatch colors
  const palette = [
    { name: 'Deep Shadow', hex: '#07131B' },
    { name: 'Dark Teal', hex: '#06434A' },
    { name: 'Main Teal', hex: '#087F8C' },
    { name: 'Turquoise', hex: '#18B8B5' },
    { name: 'Cyan Highlight', hex: '#65F0E0' },
  ];

  const handleReset = () => {
    setWaveHeight(1.0);
    setLineDensity(1.0);
    setSpeed(1.0);
    setGlow(1.0);
    setQuality('high');
    setReducedMotion(false);
  };

  return (
    <div className="app-container">
      {/* Background Accent Grid */}
      <div className="bg-grid" />

      {/* Navigation */}
      <header className="navbar">
        <a href="#hero" className="brand">
          <span className="brand-badge">AT</span>
          <div className="brand-text">
            <span className="brand-name">ABINAND TV</span>
            <span className="brand-role">Engineer × Technologist</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#projects" className="nav-link">Projects</a></li>
          <li><a href="#skills" className="nav-link">Skills</a></li>
          <li><a href="#process" className="nav-link">How I Build</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        <button className="nav-action-btn" onClick={() => setIsPanelMinimized(!isPanelMinimized)}>
          {isPanelMinimized ? 'Show Wave Controls' : 'Hide Controls'}
        </button>
      </header>

      {/* Hero Section */}
      <main className="hero-section" id="hero">
        <div className="hero-content">
          <div className="hero-pill">
            <span className="pulse-dot" />
            <span>Procedural GLSL Fluid Wave</span>
          </div>

          <h1 className="hero-title">
            ENGINEER × <br />
            <span className="text-gradient">CREATIVE TECHNOLOGIST</span> <br />
            × BUILDER
          </h1>

          <p className="hero-subtitle">
            Crafting digital experiences that feel different. A hybrid procedural wave composed of fine flowing contour lines, directional lighting, and luminous cyan crests rendered in real-time WebGL.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn-primary">
              Explore Projects ↘
            </a>
            <a href="#contact" className="btn-secondary">
              Get in Touch ↗
            </a>
          </div>
        </div>

        {/* Character Card showcasing integration without obstruction */}
        <div className="hero-visual">
          <div className="character-card">
            <video
              src="/assets/character/me2.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="character-badge">
              <span className="character-badge-title">Interactive Character</span>
              <span className="character-badge-sub">me2.mp4 • Loop</span>
            </div>
          </div>
        </div>
      </main>

      {/* Transparent Fluid Wave Overlay anchored at bottom */}
      <div className="wave-canvas-wrapper" aria-hidden="true">
        <FluidWave
          waveHeight={waveHeight}
          lineDensity={lineDensity}
          speed={speed}
          glow={glow}
          quality={quality}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Floating Wave Shader Control Panel */}
      <aside className={`control-panel ${isPanelMinimized ? 'minimized' : ''}`} aria-label="Shader Controls">
        <div
          className="panel-header"
          onClick={() => setIsPanelMinimized(!isPanelMinimized)}
          title={isPanelMinimized ? 'Click to expand controls' : 'Click to minimize controls'}
        >
          <div className="panel-title-group">
            <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4" />
              <path d="M2 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4" />
            </svg>
            <span className="panel-title">Wave Shader Controls</span>
          </div>
          <button
            className="panel-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsPanelMinimized(!isPanelMinimized);
            }}
          >
            {isPanelMinimized ? 'Expand ↗' : 'Minimize ↘'}
          </button>
        </div>

        {!isPanelMinimized && (
          <div className="panel-body">
            {/* Wave Height Slider */}
            <div className="control-row">
              <div className="control-label-group">
                <span className="control-name">Wave Height</span>
                <span className="control-val">{waveHeight.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.0"
                step="0.05"
                value={waveHeight}
                onChange={(e) => setWaveHeight(parseFloat(e.target.value))}
                className="control-slider"
              />
            </div>

            {/* Line Density Slider */}
            <div className="control-row">
              <div className="control-label-group">
                <span className="control-name">Line Density</span>
                <span className="control-val">{lineDensity.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.6"
                step="0.05"
                value={lineDensity}
                onChange={(e) => setLineDensity(parseFloat(e.target.value))}
                className="control-slider"
              />
            </div>

            {/* Animation Speed Slider */}
            <div className="control-row">
              <div className="control-label-group">
                <span className="control-name">Flow Speed</span>
                <span className="control-val">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="control-slider"
              />
            </div>

            {/* Luminous Glow Slider */}
            <div className="control-row">
              <div className="control-label-group">
                <span className="control-name">Cyan Glow</span>
                <span className="control-val">{glow.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={glow}
                onChange={(e) => setGlow(parseFloat(e.target.value))}
                className="control-slider"
              />
            </div>

            {/* Quality Preset */}
            <div className="control-row">
              <div className="control-label-group">
                <span className="control-name">GPU Quality Tier</span>
              </div>
              <div className="quality-btn-group">
                <button
                  type="button"
                  className={`quality-btn ${quality === 'high' ? 'active' : ''}`}
                  onClick={() => setQuality('high')}
                >
                  High (Desktop)
                </button>
                <button
                  type="button"
                  className={`quality-btn ${quality === 'medium' ? 'active' : ''}`}
                  onClick={() => setQuality('medium')}
                >
                  Balanced
                </button>
                <button
                  type="button"
                  className={`quality-btn ${quality === 'low' ? 'active' : ''}`}
                  onClick={() => setQuality('low')}
                >
                  Low (Mobile)
                </button>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="toggle-row">
              <span>Reduced Motion</span>
              <input
                type="checkbox"
                id="reduced-motion-toggle"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                style={{ cursor: 'pointer', accentColor: 'var(--color-cyan)' }}
              />
            </div>

            {/* Palette Preview */}
            <div className="control-row">
              <span className="control-name" style={{ fontSize: '0.75rem' }}>Active Shader Palette</span>
              <div className="palette-preview">
                {palette.map((swatch) => (
                  <div
                    key={swatch.hex}
                    className="palette-swatch"
                    style={{ backgroundColor: swatch.hex }}
                    title={`${swatch.name}: ${swatch.hex}`}
                  />
                ))}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="panel-footer">
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset Defaults
              </button>
              <span className="loop-badge">16s Harmonic Loop</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default App;
