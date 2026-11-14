"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cyberAudio } from "@/lib/cyber-audio";

export interface GlitchDottedLogoLoaderProps {
  /** Whether the loading overlay is currently active */
  isLoading?: boolean;
  /** Callback fired when loading sequence completes (hits 100% and finishes exit) */
  onComplete?: () => void;
  /** Minimum duration in milliseconds for the loading experience. Default: 2400ms */
  minDuration?: number;
  /** Path to site logo in /public. Default: "/octomem_logo.png" */
  logoSrc?: string;
  /** Auto-dismiss once 100% is reached. Default: true */
  autoDismiss?: boolean;
  /** Display mode */
  variant?: "fullscreen" | "embedded" | "card";
  /** Allow user to dismiss/skip by pressing ESC or clicking screen. Default: true */
  allowSkip?: boolean;
  /** Legacy toggle (kept for backwards compatibility) */
  showHUD?: boolean;
  /** Glitch intensity multiplier (0 = smooth dots, 1 = cyber glitch, 2 = extreme overdrive). Default: 1 */
  glitchIntensity?: number;
  /** Dot density multiplier: 'dense' | 'balanced' | 'chunky'. Default: 'balanced' */
  dotDensity?: "dense" | "balanced" | "chunky";
  /** Color theme palette */
  colorTheme?: "brand" | "orange" | "cyber" | "matrix";
  /** Additional CSS class names */
  className?: string;
}

interface LogoDot {
  /** Normalized target coordinates [-0.5, 0.5] */
  nx: number;
  ny: number;
  /** Original sampled color components */
  r: number;
  g: number;
  b: number;
  a: number;
  /** Target base dot radius */
  targetRadius: number;
  /** Current animated radius */
  radius: number;
  /** Scatter offset for initial explosion */
  scatterX: number;
  scatterY: number;
  /** Current rendered coordinates */
  x: number;
  y: number;
  /** Spring velocity */
  vx: number;
  vy: number;
  /** Radial reveal delay [0, 1] */
  delay: number;
  /** Pulse phase */
  phase: number;
  /** Categorized cyber hue */
  paletteType: "orange" | "purple" | "cyan" | "white";
}

interface GlitchSlice {
  yMin: number;
  yMax: number;
  offset: number;
  chromaOffset: number;
  alpha: number;
}

export default function GlitchDottedLogoLoader({
  isLoading = true,
  onComplete,
  minDuration = 2400,
  logoSrc = "/octomem_logo.png",
  autoDismiss = true,
  variant = "fullscreen",
  allowSkip = true,
  glitchIntensity = 1.0,
  dotDensity = "balanced",
  colorTheme = "brand",
  className = "",
}: GlitchDottedLogoLoaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isExiting, setIsExiting] = useState(false);

  // References for render loop & state persistence
  const progressRef = useRef(0);
  const isExitingRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const dotsRef = useRef<LogoDot[]>([]);
  const slicesRef = useRef<GlitchSlice[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const isImageLoadedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Manual or automatic skip/finish
  const handleFinish = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setIsExiting(true);
    cyberAudio.playLockConfirmation();

    setTimeout(() => {
      onCompleteRef.current?.();
    }, 400);
  }, []);

  // Handle keyboard shortcut (ESC or Space to skip)
  useEffect(() => {
    if (!allowSkip) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") {
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allowSkip, handleFinish]);

  // Main Canvas & Particle Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    startTimeRef.current = performance.now();
    progressRef.current = 0;
    isExitingRef.current = false;
    setIsExiting(false);

    cyberAudio.playBootThrum();

    // Determine grid step based on density
    const stepSize = dotDensity === "dense" ? 1.6 : dotDensity === "chunky" ? 3.2 : 2.2;

    /**
     * Builds fallback procedural octo-sentinel dots if image is loading or offline
     */
    const generateProceduralOctoDots = (): LogoDot[] => {
      const generated: LogoDot[] = [];
      const totalPoints = dotDensity === "dense" ? 1800 : dotDensity === "chunky" ? 800 : 1200;

      // Central octagonal core
      for (let i = 0; i < totalPoints * 0.45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const octAngle = Math.floor((angle / (Math.PI / 4))) * (Math.PI / 4) + (Math.PI / 8);
        const r = Math.pow(Math.random(), 0.6) * 0.22;
        const nx = Math.cos(octAngle) * r * (0.8 + Math.random() * 0.2);
        const ny = Math.sin(octAngle) * r * (0.8 + Math.random() * 0.2);

        generated.push({
          nx,
          ny,
          r: 255,
          g: 85,
          b: 0,
          a: 255,
          targetRadius: 1.4 + Math.random() * 1.8,
          radius: 0,
          scatterX: (Math.random() - 0.5) * 1200,
          scatterY: (Math.random() - 0.5) * 800,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          delay: Math.hypot(nx, ny) * 0.4 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2,
          paletteType: Math.random() > 0.4 ? "orange" : "white",
        });
      }

      // 8 Curved tentacles radiating outward
      for (let tentacle = 0; tentacle < 8; tentacle++) {
        const baseAngle = (tentacle * Math.PI) / 4;
        const tentacleDots = Math.floor((totalPoints * 0.55) / 8);

        for (let i = 0; i < tentacleDots; i++) {
          const t = i / tentacleDots;
          const curveAngle = baseAngle + Math.sin(t * 3.14) * 0.35 * (tentacle % 2 === 0 ? 1 : -1);
          const dist = 0.2 + t * 0.28;
          const nx = Math.cos(curveAngle) * dist + (Math.random() - 0.5) * 0.03;
          const ny = Math.sin(curveAngle) * dist + (Math.random() - 0.5) * 0.03;

          generated.push({
            nx,
            ny,
            r: 168,
            g: 85,
            b: 247,
            a: 255,
            targetRadius: Math.max(0.8, 2.4 * (1 - t * 0.65)),
            radius: 0,
            scatterX: (Math.random() - 0.5) * 1400,
            scatterY: (Math.random() - 0.5) * 900,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            delay: dist * 0.6 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2,
            paletteType: t > 0.5 ? "cyan" : "purple",
          });
        }
      }

      return generated;
    };

    // Initially populate with procedural dots
    dotsRef.current = generateProceduralOctoDots();

    /**
     * Loads the official site logo and samples its actual pixels into dot coordinates
     */
    const sampleLogoImage = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const offCanvas = document.createElement("canvas");
          const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
          if (!offCtx) return;

          // Scale down for optimal dot matrix count (approx 120 x 112 cells)
          const targetW = dotDensity === "dense" ? 140 : dotDensity === "chunky" ? 80 : 110;
          const aspect = img.width / img.height;
          const targetH = Math.round(targetW / aspect);

          offCanvas.width = targetW;
          offCanvas.height = targetH;
          offCtx.drawImage(img, 0, 0, targetW, targetH);

          const imgData = offCtx.getImageData(0, 0, targetW, targetH).data;
          const sampledDots: LogoDot[] = [];

          const step = Math.max(1, Math.round(stepSize));

          for (let y = 0; y < targetH; y += step) {
            for (let x = 0; x < targetW; x += step) {
              const idx = (y * targetW + x) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              const a = imgData[idx + 3];

              // Filter out transparent and pure black pixels
              if (a > 30 && (r + g + b) > 30) {
                const nx = (x / targetW) - 0.5;
                const ny = (y / targetH) - 0.5;
                const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

                // Classify color palette
                let paletteType: LogoDot["paletteType"] = "white";
                if (r > 180 && g > 60 && b < 100) {
                  paletteType = "orange";
                } else if (r > 120 && b > 180) {
                  paletteType = "purple";
                } else if (b > 180 && g > 150) {
                  paletteType = "cyan";
                } else if (lum > 0.8) {
                  paletteType = "white";
                } else {
                  paletteType = "orange";
                }

                // Radius correlates to luminance
                const targetRadius = Math.max(0.9, 1.0 + lum * 2.2);

                // Scatter distance inversely related to progress
                const angle = Math.random() * Math.PI * 2;
                const dist = 300 + Math.random() * 500;

                sampledDots.push({
                  nx,
                  ny,
                  r,
                  g,
                  b,
                  a,
                  targetRadius,
                  radius: 0,
                  scatterX: Math.cos(angle) * dist,
                  scatterY: Math.sin(angle) * dist,
                  x: 0,
                  y: 0,
                  vx: 0,
                  vy: 0,
                  delay: Math.hypot(nx, ny) * 0.5 + Math.random() * 0.12,
                  phase: Math.random() * Math.PI * 2,
                  paletteType,
                });
              }
            }
          }

          if (sampledDots.length > 100) {
            dotsRef.current = sampledDots;
            isImageLoadedRef.current = true;
          }
        } catch {
          // Fallback procedural dots already active
        }
      };
      img.src = logoSrc;
    };

    sampleLogoImage();

    // Resize handling
    let dpr = 1;
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse tracking for dynamic interactive repulsion
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Glitch slice generator
    let lastGlitchTime = 0;
    const triggerGlitchSpike = (intensity: number) => {
      const sliceCount = Math.floor(1 + Math.random() * 3 * intensity);
      const newSlices: GlitchSlice[] = [];

      for (let i = 0; i < sliceCount; i++) {
        const yCenter = Math.random();
        const height = 0.04 + Math.random() * 0.14;
        const maxOffset = 24 * intensity * glitchIntensity;
        newSlices.push({
          yMin: Math.max(0, yCenter - height / 2),
          yMax: Math.min(1, yCenter + height / 2),
          offset: (Math.random() - 0.5) * maxOffset * 2,
          chromaOffset: (Math.random() - 0.5) * 14 * intensity * glitchIntensity,
          alpha: 0.7 + Math.random() * 0.3,
        });
      }

      slicesRef.current = newSlices;
      cyberAudio.playGlitchClick(intensity);

      setTimeout(() => {
        slicesRef.current = [];
      }, 70 + Math.random() * 80);
    };

    /**
     * Master 60FPS Canvas Render Loop
     */
    const render = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const rawProgress = Math.min(1, elapsed / minDuration);

      // Cybernetic S-curve non-linear loading progress
      let p = rawProgress;
      if (rawProgress < 0.3) {
        p = (rawProgress / 0.3) * 0.35;
      } else if (rawProgress < 0.7) {
        const sub = (rawProgress - 0.3) / 0.4;
        p = 0.35 + Math.sin(sub * Math.PI * 0.5) * 0.42;
      } else {
        const sub = (rawProgress - 0.7) / 0.3;
        p = 0.77 + Math.pow(sub, 1.4) * 0.23;
      }

      progressRef.current = p;

      // Intermittent glitch triggers
      if (now - lastGlitchTime > 180 + Math.random() * 320) {
        lastGlitchTime = now;
        if (glitchIntensity > 0 && Math.random() < 0.55 * glitchIntensity) {
          const intensity = p > 0.4 && p < 0.85 ? 1.4 : 0.8;
          triggerGlitchSpike(intensity);
        }
      }

      const cw = canvas.width;
      const ch = canvas.height;
      const cx = cw / 2;
      const cy = ch / 2;

      // 1. Pure solid pitch black background (zero gradients)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cw, ch);

      // 2. Logo Sizing: prominent, centered, perfectly proportioned
      const maxLogoPx = Math.min(cw * 0.72, ch * 0.65, 460 * dpr);
      const logoW = maxLogoPx;
      const logoH = maxLogoPx * 0.93; // 1306x1213 aspect ratio

      // Laser scanline coordinate
      const scanlineProg = (p * 1.3 - 0.15);
      const scanY = cy - logoH / 2 + scanlineProg * logoH;

      // Slices active currently
      const activeSlices = slicesRef.current;
      const hasGlitchSlices = activeSlices.length > 0;

      // 3. Update and Draw Dotted Logo
      const dots = dotsRef.current;
      const totalDots = dots.length;

      // Color lookup table based on paletteType
      const getColor = (type: LogoDot["paletteType"], alpha = 1.0) => {
        if (colorTheme === "orange") {
          return type === "white"
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(255, 85, 0, ${alpha})`;
        }
        if (colorTheme === "matrix") {
          return `rgba(0, 255, 128, ${alpha})`;
        }
        if (type === "orange") return `rgba(255, 85, 0, ${alpha})`;
        if (type === "purple") return `rgba(180, 100, 255, ${alpha})`;
        if (type === "cyan") return `rgba(0, 240, 255, ${alpha})`;
        return `rgba(255, 255, 255, ${alpha})`;
      };

      // Chromatic Aberration Passes during glitch bursts
      if (hasGlitchSlices) {
        activeSlices.forEach((slice) => {
          const sliceTop = cy - logoH / 2 + slice.yMin * logoH;
          const sliceBottom = cy - logoH / 2 + slice.yMax * logoH;

          // Draw RGB ghost split lines
          ctx.fillStyle = `rgba(0, 240, 255, ${0.15 * slice.alpha})`;
          ctx.fillRect(
            cx - logoW / 2 + slice.offset + slice.chromaOffset,
            sliceTop,
            logoW,
            sliceBottom - sliceTop
          );

          ctx.fillStyle = `rgba(255, 85, 0, ${0.15 * slice.alpha})`;
          ctx.fillRect(
            cx - logoW / 2 + slice.offset - slice.chromaOffset,
            sliceTop,
            logoW,
            sliceBottom - sliceTop
          );
        });
      }

      // Draw Main Dotted Matrix
      for (let i = 0; i < totalDots; i++) {
        const dot = dots[i];

        // Target position centered on canvas
        const targetX = cx + dot.nx * logoW;
        const targetY = cy + dot.ny * logoH;

        // Assembly progress for this specific dot (accounting for delay)
        const dotProgress = Math.max(0, Math.min(1, (p - dot.delay * 0.35) / 0.65));

        // Ease-out spring interpolation from scattered position
        const ease = 1 - Math.pow(1 - dotProgress, 3);
        const curX = targetX + dot.scatterX * (1 - ease);
        const curY = targetY + dot.scatterY * (1 - ease);

        // Check if this dot is inside a glitch slice
        let sliceOffset = 0;
        let sliceAlpha = 1.0;
        if (hasGlitchSlices) {
          const normY = (targetY - (cy - logoH / 2)) / logoH;
          for (let s = 0; s < activeSlices.length; s++) {
            const sl = activeSlices[s];
            if (normY >= sl.yMin && normY <= sl.yMax) {
              sliceOffset = sl.offset;
              sliceAlpha = sl.alpha;
              break;
            }
          }
        }

        // Interactive mouse repulsion
        let repX = 0;
        let repY = 0;
        if (mouseRef.current.active) {
          const mdx = (curX + sliceOffset) - mouseRef.current.x;
          const mdy = curY - mouseRef.current.y;
          const mDist = Math.hypot(mdx, mdy);
          const maxRepelDist = 90 * dpr;

          if (mDist < maxRepelDist && mDist > 0.1) {
            const force = (1 - mDist / maxRepelDist) * 22 * dpr;
            repX = (mdx / mDist) * force;
            repY = (mdy / mDist) * force;
          }
        }

        const renderX = curX + sliceOffset + repX;
        const renderY = curY + repY;

        // Animate radius based on dot progress & laser scanline proximity
        let r = dot.targetRadius * ease * dpr;

        // Scanline flare: dots near laser beam pulse larger and brighter
        const distToScan = Math.abs(targetY - scanY);
        let scanBoost = 0;
        if (distToScan < 24 * dpr) {
          scanBoost = (1 - distToScan / (24 * dpr)) * 1.5;
          r += scanBoost * dpr;
        }

        // Idle breathing pulse once assembled
        if (p > 0.8) {
          const pulse = Math.sin(now * 0.003 + dot.phase) * 0.2;
          r = Math.max(0.6 * dpr, r + pulse * dpr);
        }

        if (r > 0.3) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, r, 0, Math.PI * 2);

          const baseAlpha = (0.2 + ease * 0.8) * sliceAlpha;
          const finalAlpha = Math.min(1.0, baseAlpha + scanBoost * 0.5);

          ctx.fillStyle = scanBoost > 0.5
            ? `rgba(255, 255, 255, ${finalAlpha})`
            : getColor(dot.paletteType, finalAlpha);

          ctx.fill();

          // Phosphor flare on primary dots
          if (r > 2.2 * dpr && finalAlpha > 0.7) {
            ctx.shadowColor = dot.paletteType === "purple" ? "#A855F7" : "#FF5500";
            ctx.shadowBlur = 8 * dpr;
          } else {
            ctx.shadowBlur = 0;
          }
        }
      }

      ctx.shadowBlur = 0;

      // 4. Laser Scanline Beam
      if (p > 0.05 && p < 0.98) {
        const beamY = scanY;
        const beamW = logoW * 1.15;
        const beamGrad = ctx.createLinearGradient(
          cx - beamW / 2,
          beamY,
          cx + beamW / 2,
          beamY
        );
        beamGrad.addColorStop(0, "rgba(255, 85, 0, 0)");
        beamGrad.addColorStop(0.2, "rgba(255, 85, 0, 0.4)");
        beamGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
        beamGrad.addColorStop(0.8, "rgba(0, 240, 255, 0.4)");
        beamGrad.addColorStop(1, "rgba(0, 240, 255, 0)");

        ctx.fillStyle = beamGrad;
        ctx.fillRect(cx - beamW / 2, beamY - 1 * dpr, beamW, 2.5 * dpr);

        // Core laser glow
        ctx.fillStyle = "rgba(255, 85, 0, 0.15)";
        ctx.fillRect(cx - beamW / 2, beamY - 6 * dpr, beamW, 12 * dpr);
      }

      // Check for completion
      if (rawProgress >= 1.0) {
        if (autoDismiss && !isExitingRef.current) {
          handleFinish();
        } else {
          animFrameRef.current = requestAnimationFrame(render);
        }
      } else {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    minDuration,
    logoSrc,
    autoDismiss,
    handleFinish,
    dotDensity,
    colorTheme,
    glitchIntensity,
  ]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        key="glitch-loader-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          filter: "blur(12px)",
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        }}
        onClick={allowSkip ? handleFinish : undefined}
        className={`fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden bg-black ${className}`}
        style={{ cursor: allowSkip ? "pointer" : "default" }}
      >
        {/* Fullscreen Glitch Dotted Canvas - Only the logo on pure black */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-auto"
        />

        {/* Subtle Glitch Flash on Exit */}
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0, 1, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#FF5500]/20 pointer-events-none mix-blend-screen z-50"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
