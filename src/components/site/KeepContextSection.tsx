"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import OctoAsciiMatrix from "@/components/OctoAsciiMatrix";

// ─── AMBIENT MATRIX CODE RAIN (SUBTLE BACKGROUND) ──────────────────────────────
const RAIN_CHARS = "$+=-|/\\:;01{}[]*#~_";

function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();

    const COL_W = 34;

    const makeCols = () => {
      const count = Math.floor(W / COL_W);
      return Array.from({ length: count }, (_, i) => ({
        x: i * COL_W + Math.random() * 4,
        y: Math.random() * -H * 1.5,
        speed: Math.random() * 0.6 + 0.25,
        chars: Array.from(
          { length: Math.floor(Math.random() * 10 + 5) },
          () => RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)],
        ),
        baseAlpha: Math.random() * 0.08 + 0.02,
      }));
    };

    let cols = makeCols();
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      cols.forEach((col) => {
        col.y += col.speed;
        if (col.y > H + col.chars.length * 18) {
          col.y = Math.random() * -180 - 40;
          col.speed = Math.random() * 0.6 + 0.25;
          col.baseAlpha = Math.random() * 0.08 + 0.02;
        }

        if (frame % 45 === 0 && Math.random() > 0.7) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] =
            RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
        }

        col.chars.forEach((ch, j) => {
          const y = col.y + j * 18;
          if (y < -20 || y > H + 20) return;

          const isHead = j === col.chars.length - 1;
          const alpha = isHead ? col.baseAlpha * 3.2 : col.baseAlpha * 0.65;

          ctx.font = "11px 'Courier New', monospace";
          ctx.fillStyle = isHead
            ? `rgba(255, 120, 50, ${Math.min(alpha, 0.32)})`
            : `rgba(255, 85, 0, ${Math.min(alpha, 0.15)})`;
          ctx.fillText(ch, col.x, y);
        });
      });

      frame++;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      resize();
      cols = makeCols();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [shouldReduce]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
}

// ─── WIRE COORDINATES & PATH GENERATION ────────────────────────────────────────
interface Point {
  x: number;
  y: number;
}

interface WireSegment {
  start: Point;
  end: Point;
}

export default function KeepContextSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hidden anchor elements inside each box (for measuring exact docking ports)
  const asciiPortRightRef = useRef<HTMLDivElement>(null);
  const contextPortLeftRef = useRef<HTMLDivElement>(null);
  const contextPortNearPrivateRef = useRef<HTMLDivElement>(null);
  const getStartedPortNear03Ref = useRef<HTMLDivElement>(null);

  const [wire1, setWire1] = useState<WireSegment | null>(null);
  const [wire2, setWire2] = useState<WireSegment | null>(null);
  const [viewSize, setViewSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamically calculate wire coordinates
  const updateWires = useCallback(() => {
    if (
      !containerRef.current ||
      !asciiPortRightRef.current ||
      !contextPortLeftRef.current ||
      !contextPortNearPrivateRef.current ||
      !getStartedPortNear03Ref.current
    )
      return;

    const cRect = containerRef.current.getBoundingClientRect();
    const pAscii = asciiPortRightRef.current.getBoundingClientRect();
    const pCtxLeft = contextPortLeftRef.current.getBoundingClientRect();
    const pCtxPrivate =
      contextPortNearPrivateRef.current.getBoundingClientRect();
    const pStart03 = getStartedPortNear03Ref.current.getBoundingClientRect();

    setViewSize({ width: cRect.width, height: cRect.height });

    // Wire 1: Box 1 (ASCII Left) -> Box 2 (Context Card Top-Right)
    setWire1({
      start: {
        x: pAscii.left + pAscii.width / 2 - cRect.left,
        y: pAscii.top + pAscii.height / 2 - cRect.top,
      },
      end: {
        x: pCtxLeft.left + pCtxLeft.width / 2 - cRect.left,
        y: pCtxLeft.top + pCtxLeft.height / 2 - cRect.top,
      },
    });

    // Wire 2: Box 2 (Near "100% Private") -> Box 3 (Near "03")
    setWire2({
      start: {
        x: pCtxPrivate.left + pCtxPrivate.width / 2 - cRect.left,
        y: pCtxPrivate.top + pCtxPrivate.height / 2 - cRect.top,
      },
      end: {
        x: pStart03.left + pStart03.width / 2 - cRect.left,
        y: pStart03.top + pStart03.height / 2 - cRect.top,
      },
    });
  }, []);

  useEffect(() => {
    updateWires();

    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => updateWires());
    ro.observe(el);
    window.addEventListener("resize", updateWires);

    const t = setTimeout(updateWires, 150);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateWires);
      clearTimeout(t);
    };
  }, [updateWires]);

  // Smooth horizontal S-curve for Wire 1 (Bridge between ASCII Box and Context Card)
  const buildHorizontalPath = (from: Point, to: Point) => {
    const midX = from.x + (to.x - from.x) * 0.52;
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  };

  // Smooth connecting cable from Box 2 (near 100% Private) down to Box 3 (near 03)
  const buildNearPrivateTo03Path = (from: Point, to: Point) => {
    const midY = from.y + (to.y - from.y) * 0.5;
    const bowX = Math.max(from.x, to.x) + 16;
    return `M ${from.x} ${from.y} C ${bowX} ${from.y + 12}, ${bowX} ${to.y - 12}, ${to.x} ${to.y}`;
  };

  return (
    <section
      id="anatomy"
      className="relative w-full min-h-screen py-20 sm:py-28 lg:py-32 flex flex-col items-center justify-center overflow-hidden bg-[#000000] text-white border-t border-white/[0.08] select-none font-matrix"
      aria-label="Keep your context"
    >
      {/* Background Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />

      {/* Subtle matrix rain */}
      <RainCanvas />

      {/* Soft ambient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 25%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.96) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── MAIN STAGE CONTAINER ── */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10"
      >
        {/* ── GLOWING CONNECTING FIBER-OPTIC WIRES (SVG OVERLAY) ── */}
        {viewSize && wire1 && wire2 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible hidden lg:block"
            viewBox={`0 0 ${viewSize.width} ${viewSize.height}`}
            aria-hidden="true"
          >
            <defs>
              <filter
                id="fiberGlowFilter"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── WIRE 1: Box 1 (ASCII Left) -> Box 2 (Context Card Top-Right) ── */}
            <g>
              <path
                d={buildHorizontalPath(wire1.start, wire1.end)}
                fill="none"
                stroke="#FF5500"
                strokeWidth={isHovered ? 2.8 : 2.2}
                strokeLinecap="round"
                filter="url(#fiberGlowFilter)"
                className="drop-shadow-[0_0_12px_rgba(255,85,0,0.9)] transition-all duration-300"
              />
              <path
                d={buildHorizontalPath(wire1.start, wire1.end)}
                fill="none"
                stroke="#FFF2CC"
                strokeWidth="1.2"
                strokeDasharray="7 5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="24;0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* ── WIRE 2: From near "100% Private" on Box 2 down to near "03" on Box 3 ── */}
            <g>
              <path
                d={buildNearPrivateTo03Path(wire2.start, wire2.end)}
                fill="none"
                stroke="#FF5500"
                strokeWidth={isHovered ? 2.8 : 2.2}
                strokeLinecap="round"
                filter="url(#fiberGlowFilter)"
                className="drop-shadow-[0_0_12px_rgba(255,85,0,0.9)] transition-all duration-300"
              />
              <path
                d={buildNearPrivateTo03Path(wire2.start, wire2.end)}
                fill="none"
                stroke="#FFF2CC"
                strokeWidth="1.2"
                strokeDasharray="7 5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="24;0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* ── CLEAN SOLID RETICLES AT WIRE PORTS (NO PULSING OUTLINE) ── */}
            {[
              { pt: wire1.start, id: 0 },
              { pt: wire1.end, id: 1 },
              { pt: wire2.start, id: 2 },
              { pt: wire2.end, id: 3 },
            ].map(({ pt, id }) => (
              <g key={id} transform={`translate(${pt.x}, ${pt.y})`}>
                <circle
                  r="5"
                  fill="#080808"
                  stroke="#FF5500"
                  strokeWidth="1.5"
                />
                <circle r="2" fill="#FFA000" />
                <circle r="0.9" fill="#FFFFFF" />
              </g>
            ))}
          </svg>
        )}

        {/* ── STAGGERED 3-BOX GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-y-6 lg:gap-x-10 items-center">
          {/* ══════════════════════════════════════════════════════════════════
              1. ASCII BOX (LEFT CENTER — RESIZED A LITTLE BIT SMALLER)
             ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 lg:row-span-2 w-full max-w-[490px] xl:max-w-[530px] min-h-[400px] sm:min-h-[430px] xl:min-h-[450px] relative flex flex-col justify-between p-5 sm:p-7 bg-[#000000] backdrop-blur-2xl border border-[#ff550045]  shadow-2xl transition-all duration-300 hover:border-[#FF5500]/70 hover:shadow-[0_12px_40px_rgba(255,85,0,0.22)]"
          >
            {/* Drone Optical Corner Ticks */}
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF5500]" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF5500]" />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF5500]" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF5500]" />

            {/* Invisible Measurement Anchor for Wire 1 Start */}
            <div
              ref={asciiPortRightRef}
              className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />

            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 mb-2 ">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500] animate-pulse" />
                {/* <span className="text-xs font-semibold text-white tracking-wide uppercase">
                  Matrix Core Display
                </span> */}
              </div>
              <span className="text-[11px] text-[#FF5500] animate-marquee font-mono">
                ::
              </span>
            </div>

            {/* Center Canvas: OctoAsciiMatrix (Clean, well-proportioned size) */}
            <div className="relative flex-1 w-full min-h-[290px] sm:min-h-[310px] xl:min-h-[330px] flex items-center justify-center overflow-hidden my-auto rounded">
              <OctoAsciiMatrix
                imageSrc="/assets/octomem-2nd.png"
                color="#FF5500"
                cellSize={4.5}
                speed={0.9}
                className="w-full h-full"
              />
            </div>

            {/* Sub-footer note */}
            {/* <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Phosphor Matrix
              </span>
              <span className="text-[#FF5500]">Move mouse to interact</span>
            </div> */}
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════════
              2. CONTEXT CARD BOX (TOP RIGHT — RESIZED A LITTLE BIT SMALLER)
             ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:col-start-8 lg:row-start-1 w-full max-w-[390px] xl:max-w-[420px] min-h-[220px] sm:min-h-[240px] relative flex flex-col justify-between p-4 sm:p-5 bg-[#080808]/95 backdrop-blur-2xl border border-white/[0.12] rounded-sm shadow-2xl transition-all duration-300 hover:border-[#FF5500]/60 hover:shadow-[0_8px_30px_rgba(255,85,0,0.18)]"
          >
            {/* Drone Optical Corner Ticks */}
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF5500]" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF5500]" />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF5500]" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF5500]" />

            {/* Invisible Measurement Anchor for Wire 1 End (Left Edge Center) */}
            <div
              ref={contextPortLeftRef}
              className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none opacity-0"
              aria-hidden="true"
            />

            {/* Header Badge */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500] animate-pulse" />
                <span className="text-xs font-medium text-white tracking-wide uppercase">
                  Context Card
                </span>
              </div>
              <span className="text-[11px] text-[#FF5500] font-mono">:::</span>
            </div>

            {/* Copy mixing orange and white */}
            <div className="space-y-2 my-auto">
              <h2 className="text-lg sm:text-xl font-normal leading-[1.2] tracking-tight">
                <span className="text-white">One image.</span>{" "}
                <span className="text-[#FF5500]">Your context.</span>
                <br />
                <span className="text-white/90">Your memory, and your AI.</span>
              </h2>

              <p className="text-xs sm:text-[13px] leading-relaxed">
                <span className="text-neutral-200">
                  Chat naturally, save as a picture,
                </span>{" "}
                <span className="text-[#FF5500]">
                  and drop it back in anytime.
                </span>{" "}
                <span className="text-neutral-400">
                  No subscriptions. No cloud locks. Just yours forever.
                </span>
              </p>
            </div>

            {/* Sub-footer note with Docking Port directly near "100% Private" */}
            <div className="relative pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] sm:text-xs text-neutral-400">
              <span>100% PRIVATE</span>
              <div className="relative flex items-center gap-1.5">
                {/* <span className="text-[#FF5500] font-medium">100% Private</span> */}
                {/* Docking Anchor near "100% Private" */}
                <div
                  ref={contextPortNearPrivateRef}
                  className="absolute -bottom-3 right-5 w-1 h-1 pointer-events-none opacity-0"
                  aria-hidden="true"
                />
              </div>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════════
              3. GET STARTED BOX (BOTTOM CENTER-RIGHT — SMALLEST COMPACT)
             ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:col-start-7 lg:row-start-2 w-full max-w-[410px] min-h-[160px] sm:min-h-[175px] relative flex flex-col justify-between p-4 sm:p-5 bg-[#080808]/95 backdrop-blur-2xl border border-white/[0.12] rounded-sm shadow-2xl transition-all duration-300 hover:border-[#FF5500]/60 hover:shadow-[0_8px_30px_rgba(255,85,0,0.18)] lg:-mt-2"
          >
            {/* Drone Optical Corner Ticks */}
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF5500]" />
            <span
              className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-8 border-[#FF5500
            
            ]"
            />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF5500]" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF5500]" />

            {/* Header Badge with Docking Port directly near "03" */}
            <div className="relative flex items-center justify-between pb-2 mb-1.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500] animate-pulse" />
                <span className="text-xs font-medium text-white tracking-wide uppercase">
                  Get Started
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="text-[11px] text-[#FF5500] font-mono font-semibold">
                  ::::
                </span>
                {/* Docking Anchor near "03" */}
                <div
                  ref={getStartedPortNear03Ref}
                  className="absolute -top-3.5 right-1 w-1 h-1 pointer-events-none opacity-0"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Compact Action Prompt & Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap- my-auto">
              <div>
                <h3 className="text-sm sm:text-base font-normal text-white tracking-tight leading-snug">
                  Keep your conversations.
                </h3>
                <span className="text-xs text-neutral-400">
                  Free in your browser.
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/studio"
                  className="group relative inline-flex items-center gap-2 px-4 py-2 bg-[#FF5500]  text-black font-medium text-xs sm:text-sm rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-[#FF5500] hover:text-white hover:shadow-[0_0_30px_rgba(255,85,0,0.45)] transition-all duration-300"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="text-xl text-[#FF5500]  hover:text-white transition-colors"
                >
                  <span> :: </span>
                </Link>
              </div>
            </div>

            {/* Sub-footer note */}
            {/* <div className="pt-2 mt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500">
              <span>Zero Install</span>
              <span className="text-neutral-400">Instant Export</span>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
