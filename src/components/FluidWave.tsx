import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import fragmentShader from '../shaders/fluidWave.glsl?raw';
import vertexShader from '../shaders/vertex.glsl?raw';
import { INITIAL_WAVE_CONFIG, WaveConfig } from '../config/waveConfig';

export interface FluidWaveProps extends Partial<WaveConfig> {
  className?: string;
  style?: React.CSSProperties;
}

export const FluidWave: React.FC<FluidWaveProps> = ({
  className,
  style,
  waveHeight = INITIAL_WAVE_CONFIG.waveHeight,
  lineDensity = INITIAL_WAVE_CONFIG.lineDensity,
  speed = INITIAL_WAVE_CONFIG.speed,
  glow = INITIAL_WAVE_CONFIG.glow,
  quality = INITIAL_WAVE_CONFIG.quality,
  reducedMotion = INITIAL_WAVE_CONFIG.reducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep references to Three.js objects for uniform updates without re-instantiation
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Sync props to uniforms smoothly without recreating WebGL resources
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uWaveHeight.value = waveHeight;
  }, [waveHeight]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uLineDensity.value = lineDensity;
  }, [lineDensity]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uSpeed.value = speed;
  }, [speed]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uGlow.value = glow;
  }, [glow]);

  useEffect(() => {
    if (!materialRef.current || !rendererRef.current) return;
    const qualityMultiplier = quality === 'high' ? 1.0 : quality === 'medium' ? 0.75 : 0.5;
    materialRef.current.uniforms.uQuality.value = qualityMultiplier;

    // Adjust DPR based on quality tier to save GPU fill rate on lower tiers
    const maxDpr = quality === 'high' ? 2.0 : quality === 'medium' ? 1.5 : 1.0;
    const targetDpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    rendererRef.current.setPixelRatio(targetDpr);
  }, [quality]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
  }, [reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Initialize Three.js Scene & Orthographic Camera for exact 2D projection
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Initial quality calculation
    const qualityMultiplier = quality === 'high' ? 1.0 : quality === 'medium' ? 0.75 : 0.5;
    const maxDpr = quality === 'high' ? 2.0 : quality === 'medium' ? 1.5 : 1.0;
    const initialDpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    // Alpha-capable WebGL renderer with transparent clear color
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    });

    renderer.setPixelRatio(initialDpr);
    renderer.setClearColor(0x000000, 0); // 100% transparent background
    rendererRef.current = renderer;

    // Fullscreen quad geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Check OS reduced motion preference, respecting prop if defined
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = reducedMotion !== undefined ? reducedMotion : mediaQuery.matches;

    // Shader uniforms
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uWaveHeight: { value: waveHeight },
      uLineDensity: { value: lineDensity },
      uSpeed: { value: speed },
      uGlow: { value: glow },
      uQuality: { value: qualityMultiplier },
      uReducedMotion: { value: isReduced ? 1.0 : 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });

    materialRef.current = material;

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Handle Resize
    const updateSize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    updateSize();

    // Use ResizeObserver for accurate sizing within any container or layout
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // Media query listener for reduced motion
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uReducedMotion.value = e.matches ? 1.0 : 0.0;
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Visibility-aware animation loop to pause when tab is inactive
    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let isVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const deltaSeconds = (currentTime - lastTime) / 1000.0;
      lastTime = currentTime;

      // Cap delta time to prevent large steps on frame drops
      const safeDelta = Math.min(deltaSeconds, 0.1);
      accumulatedTime += safeDelta;

      uniforms.uTime.value = accumulatedTime;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      materialRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
