"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ScrambledText from "@/components/ui/ScrambledText";
import { AlienPixelGlyphs } from "@/components/ui/HolographicCard";

interface Point {
  x: number;
  y: number;
}

interface WireCoordinates {
  width: number;
  height: number;
  node1: Point;
  target1: Point;
  node2: Point;
  target2: Point;
  node3: Point;
  target3: Point;
}

export default function PortableMemoryCardSection() {
  const [activeHoverLabel, setActiveHoverLabel] = useState<number | null>(null);

  // References to measure exact anchor points dynamically
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<WireCoordinates | null>(null);

  // Mouse tilt physics for the 3D Mecha Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const hoverRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const hoverRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Re-calculate the exact pixel coordinates for the leader lines
  const updateCoordinates = useCallback(() => {
    if (!stageRef.current || !cardRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    if (stageRect.width === 0 || stageRect.height === 0) return;

    // Relative targets on the 3D card image:
    // Feature 1: Top-Left Cover Plate (customizable faceplate)
    const target1: Point = {
      x: cardRect.left - stageRect.left + cardRect.width * 0.43,
      y: cardRect.top - stageRect.top + cardRect.height * 0.22,
    };

    // Feature 2: Glowing Octopus Core (conversation context storage)
    const target2: Point = {
      x: cardRect.left - stageRect.left + cardRect.width * 0.50,
      y: cardRect.top - stageRect.top + cardRect.height * 0.42,
    };

    // Feature 3: Gold Interface Pins (secure locking connector)
    const target3: Point = {
      x: cardRect.left - stageRect.left + cardRect.width * 0.35,
      y: cardRect.top - stageRect.top + cardRect.height * 0.67,
    };

    // Box connection nodes (from their dedicated anchor dots)
    const getNodeCenter = (el: HTMLElement | null, fallbackX: number, fallbackY: number): Point => {
      if (!el) return { x: fallbackX, y: fallbackY };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - stageRect.left + r.width / 2,
        y: r.top - stageRect.top + r.height / 2,
      };
    };

    const node1 = getNodeCenter(node1Ref.current, stageRect.width * 0.22, stageRect.height * 0.18);
    const node2 = getNodeCenter(node2Ref.current, stageRect.width * 0.78, stageRect.height * 0.46);
    const node3 = getNodeCenter(node3Ref.current, stageRect.width * 0.22, stageRect.height * 0.82);

    setCoords({
      width: stageRect.width,
      height: stageRect.height,
      node1,
      target1,
      node2,
      target2,
      node3,
      target3,
    });
  }, []);

  useEffect(() => {
    updateCoordinates();

    const stageEl = stageRef.current;
    if (!stageEl) return;

    const resizeObserver = new ResizeObserver(() => {
      updateCoordinates();
    });

    resizeObserver.observe(stageEl);
    window.addEventListener("resize", updateCoordinates);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCoordinates);
    };
  }, [updateCoordinates]);

  // Construct smooth bezier leader lines
  const buildSmoothPath = (from: Point, to: Point) => {
    const midX = from.x + (to.x - from.x) * 0.52;
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  };

  return (
    <section
      id="the-card"
      className="bg-[#000000] text-[#EDEDF0] relative overflow-hidden py-28 sm:py-36 lg:py-40 select-none border-t border-white/[0.08] font-matrix"
    >
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-white/[0.12] text-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
            <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider">
              The Portable Memory Card
            </span>
          </div>

          <ScrambledText
            as="h2"
            className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-5 leading-[1.12] justify-center font-orbitron"
            duration={1.2}
          >
            An image on the outside. Your conversation inside.
          </ScrambledText>

          <ScrambledText
            as="p"
            className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-matrix"
            duration={1.4}
          >
            To your computer, it is a normal picture file you can view in any app. To OCTOMEM, it is a full conversation ready to continue.
          </ScrambledText>
        </div>

        {/* ── PRODUCT COMPOSITION STAGE WITH SPACIOUS LAYOUT & VISIBLE LEADER WIRES ── */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-6xl xl:max-w-7xl mx-auto min-h-[580px] lg:min-h-[660px] flex items-center justify-center px-4"
        >
          {/* ── HIGH-VISIBILITY GLOWING FIBER-OPTIC SVG WIRES (z-30 to stay above card) ── */}
          {coords && (
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
              viewBox={`0 0 ${coords.width} ${coords.height}`}
            >
              <defs>
                <linearGradient id="wireGlowOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA000" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#FF5500" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF7700" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* ── WIRE 1: Left Top Node -> Cover Photo Faceplate ── */}
              <g
                className="transition-opacity duration-300"
                opacity={activeHoverLabel === 1 ? 1 : activeHoverLabel === null ? 0.75 : 0.35}
              >
                {/* Outer Glow Path */}
                <path
                  d={buildSmoothPath(coords.node1, coords.target1)}
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth={activeHoverLabel === 1 ? 3 : 1.8}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(255,85,0,0.8)]"
                />
                {/* Inner Light Beam */}
                <path
                  d={buildSmoothPath(coords.node1, coords.target1)}
                  fill="none"
                  stroke="#FFF2CC"
                  strokeWidth="1"
                  strokeDasharray="6 5"
                >
                  <animate attributeName="stroke-dashoffset" values="22;0" dur="1.2s" repeatCount="indefinite" />
                </path>

                {/* Target Hardware Reticle on 3D Card */}
                <circle cx={coords.target1.x} cy={coords.target1.y} r="4.5" fill="#FF5500" />
                <circle
                  cx={coords.target1.x}
                  cy={coords.target1.y}
                  r={activeHoverLabel === 1 ? 14 : 10}
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                >
                  <animate attributeName="r" values="7;15;7" dur="2.4s" repeatCount="indefinite" />
                </circle>
                {/* Hit area for card target */}
                <circle
                  cx={coords.target1.x}
                  cy={coords.target1.y}
                  r="22"
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setActiveHoverLabel(1)}
                  onMouseLeave={() => setActiveHoverLabel(null)}
                />
              </g>

              {/* ── WIRE 2: Right Node -> Octopus Chat Memory Core ── */}
              <g
                className="transition-opacity duration-300"
                opacity={activeHoverLabel === 2 ? 1 : activeHoverLabel === null ? 0.75 : 0.35}
              >
                {/* Outer Glow Path */}
                <path
                  d={buildSmoothPath(coords.node2, coords.target2)}
                  fill="none"
                  stroke="#FFA000"
                  strokeWidth={activeHoverLabel === 2 ? 3 : 1.8}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(255,160,0,0.8)]"
                />
                {/* Inner Light Beam */}
                <path
                  d={buildSmoothPath(coords.node2, coords.target2)}
                  fill="none"
                  stroke="#FFF2CC"
                  strokeWidth="1"
                  strokeDasharray="6 5"
                >
                  <animate attributeName="stroke-dashoffset" values="0;22" dur="1.2s" repeatCount="indefinite" />
                </path>

                {/* Target Hardware Reticle on 3D Card */}
                <circle cx={coords.target2.x} cy={coords.target2.y} r="5" fill="#FFA000" />
                <circle
                  cx={coords.target2.x}
                  cy={coords.target2.y}
                  r={activeHoverLabel === 2 ? 16 : 12}
                  fill="none"
                  stroke="#FFA000"
                  strokeWidth="1.2"
                  strokeOpacity="0.7"
                >
                  <animate attributeName="r" values="8;17;8" dur="2.2s" repeatCount="indefinite" />
                </circle>
                {/* Hit area for card target */}
                <circle
                  cx={coords.target2.x}
                  cy={coords.target2.y}
                  r="24"
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setActiveHoverLabel(2)}
                  onMouseLeave={() => setActiveHoverLabel(null)}
                />
              </g>

              {/* ── WIRE 3: Left Bottom Node -> Interface Contact Pins ── */}
              <g
                className="transition-opacity duration-300"
                opacity={activeHoverLabel === 3 ? 1 : activeHoverLabel === null ? 0.75 : 0.35}
              >
                {/* Outer Glow Path */}
                <path
                  d={buildSmoothPath(coords.node3, coords.target3)}
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth={activeHoverLabel === 3 ? 3 : 1.8}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(255,85,0,0.8)]"
                />
                {/* Inner Light Beam */}
                <path
                  d={buildSmoothPath(coords.node3, coords.target3)}
                  fill="none"
                  stroke="#FFF2CC"
                  strokeWidth="1"
                  strokeDasharray="6 5"
                >
                  <animate attributeName="stroke-dashoffset" values="22;0" dur="1.2s" repeatCount="indefinite" />
                </path>

                {/* Target Hardware Reticle on 3D Card */}
                <circle cx={coords.target3.x} cy={coords.target3.y} r="4.5" fill="#FF5500" />
                <circle
                  cx={coords.target3.x}
                  cy={coords.target3.y}
                  r={activeHoverLabel === 3 ? 14 : 10}
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                >
                  <animate attributeName="r" values="7;15;7" dur="2.4s" repeatCount="indefinite" />
                </circle>
                {/* Hit area for card target */}
                <circle
                  cx={coords.target3.x}
                  cy={coords.target3.y}
                  r="22"
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setActiveHoverLabel(3)}
                  onMouseLeave={() => setActiveHoverLabel(null)}
                />
              </g>
            </svg>
          )}

          {/* ── CENTER: THE 3D MECHA MEMORY CARD RENDER (z-20) ── */}
          <div className="relative perspective-[1200px] flex items-center justify-center z-20">
            <motion.div
              style={{
                rotateX: hoverRotateX,
                rotateY: hoverRotateY,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative cursor-default flex items-center justify-center"
            >
              <div
                ref={cardRef}
                className="relative w-[300px] xs:w-[360px] sm:w-[440px] md:w-[480px] lg:w-[480px] xl:w-[520px] aspect-square overflow-hidden flex items-center justify-center"
              >
                <Image
                  src="/images/octo-hero.png"
                  alt="3D Wireframe Memory Card with Glowing Octopus Emblem"
                  fill
                  priority
                  onLoad={updateCoordinates}
                  sizes="(max-width: 640px) 360px, (max-width: 1024px) 480px, 520px"
                  className="object-contain object-center transform transition-transform duration-700 drop-shadow-[0_24px_60px_rgba(0,0,0,0.9)]"
                />
              </div>
            </motion.div>
          </div>

          {/* ── DESKTOP LABELS (Clean, spacious, with dedicated docking nodes) (z-40) ── */}

          {/* Label 1: Your Cover Photo (Top-Left) */}
          <div
            onMouseEnter={() => setActiveHoverLabel(1)}
            onMouseLeave={() => setActiveHoverLabel(null)}
            className="hidden lg:flex absolute left-2 xl:left-8 top-[10%] z-40 w-[260px] xl:w-[280px] flex-col items-start cursor-pointer"
          >
            <div
              className={`p-4 bg-[#080808]/95 backdrop-blur-2xl border transition-all duration-300 relative group shadow-2xl w-full rounded-sm ${
                activeHoverLabel === 1
                  ? "border-[#FF5500]/70 bg-[#120F0D] shadow-[0_8px_30px_rgba(255,85,0,0.22)]"
                  : "border-white/[0.12] hover:border-white/[0.24]"
              }`}
            >
              {/* Clean Corner Accents */}
              <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${activeHoverLabel === 1 ? "border-[#FF5500]" : "border-white/20"}`} />
              <span className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${activeHoverLabel === 1 ? "border-[#FF5500]" : "border-white/20"}`} />
              <span className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${activeHoverLabel === 1 ? "border-[#FF5500]" : "border-white/20"}`} />
              <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${activeHoverLabel === 1 ? "border-[#FF5500]" : "border-white/20"}`} />

              {/* Wire Terminal Node (Right edge, anchors the connecting line) */}
              <div
                ref={node1Ref}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#080808] border border-[#FF5500]/70 flex items-center justify-center transition-all duration-300 shadow-[0_0_8px_rgba(255,85,0,0.5)]"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeHoverLabel === 1 ? "bg-white shadow-[0_0_8px_#FFF]" : "bg-[#FF5500]"}`} />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                  <h3 className="text-sm font-semibold text-white tracking-tight font-orbitron">
                    Your Cover Photo
                  </h3>
                </div>
                <AlienPixelGlyphs variant={1} />
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-matrix">
                Choose any custom art or photo as the front of your card.
              </p>
            </div>
          </div>

          {/* Label 2: Your Saved Chat (Right) */}
          <div
            onMouseEnter={() => setActiveHoverLabel(2)}
            onMouseLeave={() => setActiveHoverLabel(null)}
            className="hidden lg:flex absolute right-2 xl:right-8 top-[40%] z-40 w-[260px] xl:w-[280px] flex-col items-start cursor-pointer"
          >
            <div
              className={`p-4 bg-[#080808]/95 backdrop-blur-2xl border transition-all duration-300 relative group shadow-2xl w-full rounded-sm ${
                activeHoverLabel === 2
                  ? "border-[#FFA000]/70 bg-[#14100B] shadow-[0_8px_30px_rgba(255,160,0,0.22)]"
                  : "border-white/[0.12] hover:border-white/[0.24]"
              }`}
            >
              {/* Clean Corner Accents */}
              <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${activeHoverLabel === 2 ? "border-[#FFA000]" : "border-white/20"}`} />
              <span className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${activeHoverLabel === 2 ? "border-[#FFA000]" : "border-white/20"}`} />
              <span className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${activeHoverLabel === 2 ? "border-[#FFA000]" : "border-white/20"}`} />
              <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${activeHoverLabel === 2 ? "border-[#FFA000]" : "border-white/20"}`} />

              {/* Wire Terminal Node (Left edge, anchors the connecting line) */}
              <div
                ref={node2Ref}
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#080808] border border-[#FFA000]/70 flex items-center justify-center transition-all duration-300 shadow-[0_0_8px_rgba(255,160,0,0.5)]"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeHoverLabel === 2 ? "bg-white shadow-[0_0_8px_#FFF]" : "bg-[#FFA000]"}`} />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFA000] shadow-[0_0_8px_#FFA000]" />
                  <h3 className="text-sm font-semibold text-white tracking-tight font-orbitron">
                    Your Saved Chat
                  </h3>
                </div>
                <AlienPixelGlyphs variant={2} />
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-matrix">
                Your full conversation is stored safely inside the image file.
              </p>
            </div>
          </div>

          {/* Label 3: Optional Password (Bottom-Left) */}
          <div
            onMouseEnter={() => setActiveHoverLabel(3)}
            onMouseLeave={() => setActiveHoverLabel(null)}
            className="hidden lg:flex absolute left-2 xl:left-8 bottom-[10%] z-40 w-[260px] xl:w-[280px] flex-col items-start cursor-pointer"
          >
            <div
              className={`p-4 bg-[#080808]/95 backdrop-blur-2xl border transition-all duration-300 relative group shadow-2xl w-full rounded-sm ${
                activeHoverLabel === 3
                  ? "border-[#FF5500]/70 bg-[#120F0D] shadow-[0_8px_30px_rgba(255,85,0,0.22)]"
                  : "border-white/[0.12] hover:border-white/[0.24]"
              }`}
            >
              {/* Clean Corner Accents */}
              <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${activeHoverLabel === 3 ? "border-[#FF5500]" : "border-white/20"}`} />
              <span className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${activeHoverLabel === 3 ? "border-[#FF5500]" : "border-white/20"}`} />
              <span className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${activeHoverLabel === 3 ? "border-[#FF5500]" : "border-white/20"}`} />
              <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${activeHoverLabel === 3 ? "border-[#FF5500]" : "border-white/20"}`} />

              {/* Wire Terminal Node (Right edge, anchors the connecting line) */}
              <div
                ref={node3Ref}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#080808] border border-[#FF5500]/70 flex items-center justify-center transition-all duration-300 shadow-[0_0_8px_rgba(255,85,0,0.5)]"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeHoverLabel === 3 ? "bg-white shadow-[0_0_8px_#FFF]" : "bg-[#FF5500]"}`} />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                  <h3 className="text-sm font-semibold text-white tracking-tight font-orbitron">
                    Optional Password
                  </h3>
                </div>
                <AlienPixelGlyphs variant={3} />
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-matrix">
                Protect your memory card with a private password only you know.
              </p>
            </div>
          </div>

        </div>

        {/* ── MOBILE LABELS (Clean Cards for screens < lg) ── */}
        <div className="lg:hidden mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-[#080808] border border-white/[0.1] relative flex flex-col justify-start shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                <h3 className="text-sm font-semibold text-white tracking-tight font-orbitron">
                  Your Cover Photo
                </h3>
              </div>
              <AlienPixelGlyphs variant={1} />
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-matrix">
              Choose any custom art or photo as the front of your card.
            </p>
          </div>

          <div className="p-5 bg-[#080808] border border-white/[0.1] relative flex flex-col justify-start shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFA000] shadow-[0_0_8px_#FFA000]" />
                <h3 className="text-sm font-semibold text-white tracking-tight font-orbitron">
                  Your Saved Chat
                </h3>
              </div>
              <AlienPixelGlyphs variant={2} />
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-matrix">
              Your full conversation is stored safely inside the image file.
            </p>
          </div>

          <div className="p-5 bg-[#080808] border border-white/[0.1] relative flex flex-col justify-start shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                <h3 className="text-sm font-semibold text-white tracking-tight font-orbitron">
                  Optional Password
                </h3>
              </div>
              <AlienPixelGlyphs variant={3} />
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-matrix">
              Protect your memory card with a private password only you know.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
