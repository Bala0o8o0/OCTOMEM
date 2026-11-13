"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

export default function KeepContextSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState<number>(0);

  // Master scroll progression through the 260vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Buttery-smooth spring easing for 60fps/120fps hardware-accelerated motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // ── Transform Orchestration ──
  // 1. Vertical axis separation (0 = Assembled, exploded values at progress > 0.5)
  // Top Housing Cover lifts upward: 0 -> -115px
  const topLift = useTransform(smoothProgress, [0.06, 0.52], [0, -115]);

  // Middle Silicon Substrate hovers slightly in the center: 0 -> -12px
  const siliconLift = useTransform(smoothProgress, [0.08, 0.48], [0, -12]);

  // Bottom Chassis settles downward: 0 -> +85px
  const bottomDrop = useTransform(smoothProgress, [0.06, 0.52], [0, 85]);

  // 2. Opacities & Glows
  // Vertical guide rays appear as soon as deconstruction begins
  const raysOpacity = useTransform(smoothProgress, [0.08, 0.35], [0, 0.75]);

  // Quantum core glow intensifies as layers separate
  const coreGlow = useTransform(smoothProgress, [0.15, 0.60], [0.35, 1.0]);

  // Circuit trace flows become brilliant orange
  const circuitPulse = useTransform(smoothProgress, [0.20, 0.65], [0.25, 1.0]);

  // 4 Feature Callout Cards glide in from the sides
  const calloutOpacity = useTransform(smoothProgress, [0.38, 0.68], [0, 1]);
  const calloutLeftX = useTransform(smoothProgress, [0.38, 0.68], [-30, 0]);
  const calloutRightX = useTransform(smoothProgress, [0.38, 0.68], [30, 0]);

  // Tier identity labels
  const layerLabelsOpacity = useTransform(smoothProgress, [0.25, 0.55], [0, 1]);

  // 8 Gold Contact Pins pulse with warm golden-amber light
  const goldPinsGlow = useTransform(smoothProgress, [0.45, 0.85], [0.4, 1.0]);

  // Update active stage pill based on scroll progress
  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (v < 0.22) {
      setActiveStage(0); // Assembled
    } else if (v < 0.48) {
      setActiveStage(1); // Casing Lift
    } else if (v < 0.76) {
      setActiveStage(2); // Context Enclave
    } else {
      setActiveStage(3); // 8-Pin Reload
    }
  });

  // Clicking an inspection pill smoothly scrolls to that stage
  const scrollToStage = (stageIdx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScrollableHeight = rect.height - window.innerHeight;
    const targetPercentages = [0.05, 0.35, 0.62, 0.88];
    const targetY = scrollTop + totalScrollableHeight * targetPercentages[stageIdx];

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  // Dynamic telemetry status readout
  const getTelemetryText = () => {
    switch (activeStage) {
      case 0:
        return "PHASE 01 // ASSEMBLED PNG — Standard image on the outside, lossless conversation inside";
      case 1:
        return "PHASE 02 // CASING LIFT — Elevating anodized cover along precision vertical guide rays";
      case 2:
        return "PHASE 03 // CONTEXT SUBSTRATE — 4 encrypted memory banks active • AES-256-GCM";
      case 3:
        return "PHASE 04 // OFFLINE 8-PIN BUS — Drag-and-drop reload into any LLM with zero cloud lock-in";
      default:
        return "OCTOMEM // SOLID STATE CONTEXT • SPEC: ISO/IEC 15948";
    }
  };

  return (
    <section
      ref={containerRef}
      id="anatomy"
      className="relative w-full h-[260vh] bg-[#050508] text-white select-none border-t border-white/[0.08]"
      aria-label="The Anatomy of a Memory"
    >
      {/* ── Background Precision Blueprint Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />

      {/* Subtle CAD Crosshair Watermarks */}
      <div className="absolute top-10 left-8 sm:left-12 font-mono text-[9px] text-[#444444] pointer-events-none hidden xl:block">
        [OCTOMEM // HARDWARE ARCHITECTURE: SOLID STATE CONTEXT • SPEC: ISO/IEC 15948]
      </div>
      <div className="absolute top-10 right-8 sm:right-12 font-mono text-[9px] text-[#444444] pointer-events-none hidden xl:block">
        ENCRYPTED OFFLINE CARTRIDGE • ZERO CLOUD LOCK-IN
      </div>

      {/* ── Sticky Viewport Stage (100% In-Frame, Never Clips or Traps Scroll) ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center py-5 sm:py-7 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        
        {/* ── Header: Preserved Editorial Headline & Copy ── */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto shrink-0 z-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E0E12] border border-white/[0.12] mb-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7438] animate-pulse shadow-[0_0_10px_#FF7438]" />
            <span className="font-mono text-[#AAAAAA] uppercase text-[10px] tracking-[0.25em]">
              THE ANATOMY OF A MEMORY
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.1] mb-2 font-sans">
            Good ideas{" "}
            <span className="font-normal text-white">deserve to stay.</span>
          </h2>

          {/* Short Punchy Description */}
          <p className="text-xs sm:text-sm text-[#888888] font-light leading-relaxed max-w-xl font-sans line-clamp-2 sm:line-clamp-none">
            Most AI conversations vanish the moment you close the tab. OCTOMEM turns your best chats into a portable PNG memory card that belongs to you forever—an image on the outside, your conversation inside.
          </p>
        </div>

        {/* ── Exploded Memory Card Canvas (Center Stage, 100% In-Frame) ── */}
        <div className="w-full flex-1 max-w-5xl mx-auto flex items-center justify-center relative min-h-0 my-1">
          {/* Ambient Amber Glow behind the chip core */}
          <div
            className="absolute w-[420px] h-[340px] rounded-full bg-[#FF7438]/[0.08] blur-[80px] pointer-events-none"
            aria-hidden="true"
          />

          <svg
            className="w-full h-full max-h-[520px] lg:max-h-[570px] overflow-visible select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            viewBox="0 0 1000 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Deconstructed OCTOMEM Portable Memory Card"
          >
            <defs>
              {/* Central Silicon Core Radiant Glow */}
              <filter id="coreGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gold Contact Pin Shadow & Bloom */}
              <filter id="goldPinGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFB300" floodOpacity="0.8" />
              </filter>

              {/* Laser Edge Contour Filter */}
              <filter id="contourEdgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#FF7438" floodOpacity="0.75" />
              </filter>

              {/* Callout Card Glassmorphism Shadow */}
              <filter id="cardShadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.9" />
              </filter>

              {/* Top Housing Matte Titanium Gradient */}
              <linearGradient id="topHousingGrad" x1="456" y1="220" x2="543" y2="520" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#181A22" />
                <stop offset="100%" stopColor="#0E1015" />
              </linearGradient>

              {/* Silicon Wafer Substrate Gradient */}
              <linearGradient id="waferGrad" x1="456" y1="228" x2="536" y2="510" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10131B" />
                <stop offset="100%" stopColor="#080A0E" />
              </linearGradient>

              {/* Bottom Chassis Base Gradient */}
              <linearGradient id="chassisGrad" x1="456" y1="246" x2="543" y2="540" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#14161E" />
                <stop offset="100%" stopColor="#0A0B0F" />
              </linearGradient>

              {/* 8 Gold Connector Pins Gradient */}
              <linearGradient id="goldPinGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
            </defs>

            {/* ══════════════════════════════════════════════════════════════
                A. VERTICAL ASSEMBLY GUIDE RAYS (STEP-LINKED EXTENSION)
               ══════════════════════════════════════════════════════════════ */}
            <motion.g style={{ opacity: raysOpacity }} className="pointer-events-none">
              {/* Back corner ray */}
              <line x1="456.7" y1="105.5" x2="456.7" y2="446.5" stroke="#FF7438" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
              {/* Left corner ray */}
              <line x1="231.5" y1="222.5" x2="231.5" y2="563.5" stroke="#FF7438" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
              {/* Front corner ray */}
              <line x1="543.3" y1="384.5" x2="543.3" y2="725.5" stroke="#FF7438" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
              {/* Right-bottom corner ray */}
              <line x1="720.8" y1="292.2" x2="720.8" y2="633.2" stroke="#FF7438" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
              {/* Right-top chamfer corner ray */}
              <line x1="720.8" y1="242.8" x2="720.8" y2="583.8" stroke="#FF7438" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
            </motion.g>

            {/* ══════════════════════════════════════════════════════════════
                B. TIER 3: LOWER CHASSIS & 8-PIN GOLD INTERFACE
                   (Settles downward along Y-axis as card explodes)
               ══════════════════════════════════════════════════════════════ */}
            <motion.g style={{ y: bottomDrop }} id="tier-bottom-chassis">
              {/* Base Chassis Floor Perimeter */}
              <polygon
                points="456.7,246.5 231.5,363.5 543.3,525.5 720.8,433.2 720.8,383.8"
                fill="url(#chassisGrad)"
                stroke="#333742"
                strokeWidth="1.1"
              />

              {/* Base Front-Left Extruded Thickness Wall */}
              <polygon
                points="231.5,337.5 543.3,499.5 543.3,525.5 231.5,363.5"
                fill="#0C0D11"
                stroke="#2B2E38"
                strokeWidth="0.9"
              />

              {/* Base Front-Right Extruded Thickness Wall */}
              <polygon
                points="543.3,499.5 720.8,407.2 720.8,433.2 543.3,525.5"
                fill="#08090C"
                stroke="#2B2E38"
                strokeWidth="0.9"
              />

              {/* Chamfer Side Wall */}
              <polygon
                points="720.8,407.2 720.8,357.8 720.8,383.8 720.8,433.2"
                fill="#050608"
                stroke="#2B2E38"
                strokeWidth="0.9"
              />

              {/* 8 Precision Gold Connector Pins (Arrayed along Front-Right Edge) */}
              <g id="gold-pins-bus">
                {[
                  { x1: 546.6, y1: 497.8, x2: 562.2, y2: 489.7, x3: 544.8, y3: 480.7, x4: 529.3, y4: 488.8 },
                  { x1: 568.8, y1: 486.2, x2: 584.4, y2: 478.2, x3: 567.0, y3: 469.2, x4: 551.5, y4: 477.2 },
                  { x1: 591.0, y1: 474.7, x2: 606.5, y2: 466.6, x3: 589.2, y3: 457.6, x4: 573.7, y4: 465.7 },
                  { x1: 613.2, y1: 463.2, x2: 628.7, y2: 455.1, x3: 611.4, y3: 446.1, x4: 595.9, y4: 454.2 },
                  { x1: 635.4, y1: 451.6, x2: 650.9, y2: 443.6, x3: 633.6, y3: 434.6, x4: 618.1, y4: 442.6 },
                  { x1: 657.6, y1: 440.1, x2: 673.1, y2: 432.0, x3: 655.8, y3: 423.0, x4: 640.3, y4: 431.1 },
                  { x1: 679.8, y1: 428.6, x2: 695.3, y2: 420.5, x3: 678.0, y3: 411.5, x4: 662.5, y4: 419.6 },
                  { x1: 702.0, y1: 417.1, x2: 717.5, y2: 409.0, x3: 700.2, y3: 400.0, x4: 684.6, y4: 408.1 },
                ].map((pin, idx) => (
                  <motion.polygon
                    key={idx}
                    points={`${pin.x1},${pin.y1} ${pin.x2},${pin.y2} ${pin.x3},${pin.y3} ${pin.x4},${pin.y4}`}
                    fill="url(#goldPinGrad)"
                    stroke="#FF7438"
                    strokeWidth="0.8"
                    filter="url(#goldPinGlowFilter)"
                    style={{ opacity: goldPinsGlow }}
                  />
                ))}
              </g>

              {/* Lower Edge Orange Accent Lip */}
              <polyline
                points="231.5,363.5 543.3,525.5 720.8,433.2"
                fill="none"
                stroke="#FF7438"
                strokeWidth="1.4"
                filter="url(#contourEdgeGlow)"
              />
            </motion.g>

            {/* ══════════════════════════════════════════════════════════════
                C. TIER 2: SILICON SUBSTRATE & QUANTUM CONTEXT ENCLAVE
                   (Floats in center, circuit traces & core ignite)
               ══════════════════════════════════════════════════════════════ */}
            <motion.g style={{ y: siliconLift }} id="tier-silicon-substrate">
              {/* PCB Substrate Wafer */}
              <polygon
                points="456.7,228.5 241.5,341.5 536.3,494.5 707.8,404.2 707.8,361.8"
                fill="url(#waferGrad)"
                stroke="#2C313C"
                strokeWidth="0.9"
              />

              {/* Circuit Bus Lines (Precision 45° CAD routing) */}
              <motion.g style={{ opacity: circuitPulse }} stroke="#FF7438" strokeWidth="0.9">
                <path d="M 500 390.6 L 500 420 L 555 450 L 555 480" fill="none" opacity="0.8" />
                <path d="M 515 385.0 L 525 415 L 575 440 L 575 470" fill="none" opacity="0.8" />
                <path d="M 530 375.0 L 545 400 L 595 430 L 595 460" fill="none" opacity="0.8" />
                <path d="M 545 365.0 L 565 390 L 615 420 L 615 445" fill="none" opacity="0.8" />
                <path d="M 441 360 L 400 340 L 400 310" fill="none" opacity="0.6" stroke="#888888" />
                <path d="M 450 350 L 420 330 L 420 300" fill="none" opacity="0.6" stroke="#888888" />
              </motion.g>

              {/* Glowing Micro-Vias */}
              <motion.g style={{ opacity: circuitPulse }} fill="#FF7438">
                <circle cx="500" cy="420" r="1.6" />
                <circle cx="525" cy="415" r="1.6" />
                <circle cx="545" cy="400" r="1.6" />
                <circle cx="565" cy="390" r="1.6" />
                <circle cx="400" cy="340" r="1.4" fill="#888888" />
                <circle cx="420" cy="330" r="1.4" fill="#888888" />
              </motion.g>

              {/* Auxiliary Memory Bank: Prompt Schemas */}
              <polygon
                points="415,330 390,345 425,365 450,350"
                fill="#121620"
                stroke="#444C5C"
                strokeWidth="0.8"
              />
              <text x="420" y="350" fill="#999999" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                PROMPT-DATA
              </text>

              {/* Auxiliary Memory Bank: Chat Payload */}
              <polygon
                points="575,340 545,355 595,380 625,365"
                fill="#121620"
                stroke="#444C5C"
                strokeWidth="0.8"
              />
              <text x="585" y="363" fill="#999999" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                CHAT-PAYLOAD
              </text>

              {/* Central Quantum Neural Core Die */}
              <motion.polygon
                points="500.0,329.4 441.1,360.0 500.0,390.6 558.9,360.0"
                fill="#151A24"
                stroke="#FF7438"
                strokeWidth="1.8"
                filter="url(#contourEdgeGlow)"
              />

              {/* Inner Die Resonator Mesh */}
              <polygon
                points="500.0,340.0 460.0,360.0 500.0,380.0 540.0,360.0"
                fill="#1D2330"
                stroke="#E0E0E0"
                strokeWidth="0.8"
              />

              {/* Radiant Center Node */}
              <motion.circle
                cx="500.0"
                cy="360.0"
                r="6"
                fill="#FF7438"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                filter="url(#coreGlowFilter)"
                style={{ opacity: coreGlow }}
              />

              {/* Core Chip Typography */}
              <text
                x="500"
                y="354"
                fill="#FFA060"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="600"
                textAnchor="middle"
                letterSpacing="0.1em"
              >
                SECURE MEMORY // PNG
              </text>
              <text
                x="500"
                y="368"
                fill="#888888"
                fontSize="6"
                fontFamily="monospace"
                textAnchor="middle"
                letterSpacing="0.08em"
              >
                _VAULT
              </text>
            </motion.g>

            {/* ══════════════════════════════════════════════════════════════
                D. TIER 1: UPPER ANODIZED HOUSING COVER & FACEPLATE
                   (Lifts upward along Y-axis to expose internal payload)
               ══════════════════════════════════════════════════════════════ */}
            <motion.g style={{ y: topLift }} id="tier-top-casing">
              {/* Upper Shell Extrusion Side Wall (Front-Left) */}
              <polygon
                points="231.5,337.5 543.3,499.5 543.3,479.5 231.5,317.5"
                fill="#111319"
                stroke="#333744"
                strokeWidth="0.8"
              />

              {/* Upper Shell Extrusion Side Wall (Front-Right) */}
              <polygon
                points="543.3,499.5 720.8,407.2 720.8,387.2 543.3,479.5"
                fill="#0C0E14"
                stroke="#333744"
                strokeWidth="0.8"
              />

              {/* Upper Shell Chamfer Face Wall */}
              <polygon
                points="720.8,407.2 720.8,357.8 720.8,337.8 720.8,387.2"
                fill="#08090E"
                stroke="#333744"
                strokeWidth="0.8"
              />

              {/* Upper Shell Top Face Outer Perimeter */}
              <polygon
                points="456.7,220.5 231.5,337.5 543.3,499.5 720.8,407.2 720.8,357.8"
                fill="url(#topHousingGrad)"
                stroke="#4E5568"
                strokeWidth="1.2"
              />

              {/* Inset Screen Faceplate Rim */}
              <polygon
                points="456.7,234.9 259.3,337.5 543.3,485.1 701.4,402.9 701.4,362.1"
                fill="rgba(10, 12, 17, 0.9)"
                stroke="#2B303C"
                strokeWidth="0.8"
              />

              {/* ── Laser-Etched Mascot Insignia ── */}
              <g id="mascot-insignia">
                {/* Octopus Dome */}
                <ellipse cx="488" cy="272" rx="14" ry="9" fill="none" stroke="#FF7438" strokeWidth="1.4" />
                <circle cx="484" cy="273" r="1.3" fill="#FF7438" />
                <circle cx="492" cy="273" r="1.3" fill="#FF7438" />
                {/* Tentacles */}
                <path d="M 480 278 Q 474 284 476 290" stroke="#FF7438" strokeWidth="1.2" fill="none" />
                <path d="M 484 280 Q 482 287 484 293" stroke="#FF7438" strokeWidth="1.2" fill="none" />
                <path d="M 492 280 Q 494 287 492 293" stroke="#FF7438" strokeWidth="1.2" fill="none" />
                <path d="M 496 278 Q 502 284 500 290" stroke="#FF7438" strokeWidth="1.2" fill="none" />
                {/* Label */}
                <text
                  x="488"
                  y="304"
                  textAnchor="middle"
                  fill="#777E90"
                  fontSize="7"
                  fontFamily="monospace"
                  letterSpacing="0.14em"
                >
                  OCTOMEM // SOLID STATE CONTEXT
                </text>
              </g>

              {/* 3 Laser-Etched Diagonal Status Vents */}
              <g stroke="#FF7438" strokeWidth="0.9" fill="rgba(255, 116, 56, 0.25)">
                <polygon points="487.0,317.2 417.7,353.2 426.4,357.8 495.7,321.8" />
                <polygon points="507.8,328.1 438.5,364.1 447.2,368.6 516.5,332.6" />
                <polygon points="528.6,338.9 459.3,374.9 468.0,379.4 537.2,343.4" />
              </g>

              {/* Chamfer Notch Orange Edge Accent */}
              <line
                x1="720.8"
                y1="407.2"
                x2="720.8"
                y2="357.8"
                stroke="#FF7438"
                strokeWidth="2"
                filter="url(#contourEdgeGlow)"
              />
            </motion.g>

            {/* ══════════════════════════════════════════════════════════════
                E. 4 FEATURE CALLOUT CARDS & PRECISION LEADER LINES
                   (Glide in smoothly from the sides with 0 overlapping)
               ══════════════════════════════════════════════════════════════ */}

            {/* ── CARD 1: TOP-LEFT (Full Tech Stack Architecture) ── */}
            <motion.g
              style={{ opacity: calloutOpacity, x: calloutLeftX }}
              id="callout-card-1"
            >
              {/* Leader Line */}
              <path
                d="M 245 119 L 340 119 L 410 180"
                stroke="#FF7438"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.85"
                fill="none"
              />
              <circle cx="410" cy="180" r="2.5" fill="#FF7438" />

              {/* Glassmorphism Card Box */}
              <rect
                x="25"
                y="90"
                width="220"
                height="58"
                rx="8"
                fill="#0A0B10"
                fillOpacity="0.92"
                stroke="#FF7438"
                strokeWidth="1"
                filter="url(#cardShadowFilter)"
              />
              <circle cx="42" cy="119" r="4.5" fill="#FF7438" filter="url(#coreGlowFilter)" />
              <text x="56" y="114" fill="#FFFFFF" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Full Tech Stack Architecture
              </text>
              <text x="56" y="130" fill="#999999" fontSize="9" fontFamily="sans-serif">
                Components, schemas &amp; API routes
              </text>
            </motion.g>

            {/* ── CARD 2: BOTTOM-LEFT (Resolved Decisions & Fixes) ── */}
            <motion.g
              style={{ opacity: calloutOpacity, x: calloutLeftX }}
              id="callout-card-2"
            >
              {/* Leader Line */}
              <path
                d="M 245 509 L 330 509 L 380 435"
                stroke="#FF7438"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.85"
                fill="none"
              />
              <circle cx="380" cy="435" r="2.5" fill="#FF7438" />

              {/* Glassmorphism Card Box */}
              <rect
                x="25"
                y="480"
                width="220"
                height="58"
                rx="8"
                fill="#0A0B10"
                fillOpacity="0.92"
                stroke="#2A2E3D"
                strokeWidth="1"
                filter="url(#cardShadowFilter)"
              />
              <circle cx="42" cy="509" r="4.5" fill="#FF7438" filter="url(#coreGlowFilter)" />
              <text x="56" y="504" fill="#FFFFFF" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Resolved Decisions &amp; Fixes
              </text>
              <text x="56" y="520" fill="#999999" fontSize="9" fontFamily="sans-serif">
                Never repeat previous debugging
              </text>
            </motion.g>

            {/* ── CARD 3: TOP-RIGHT (Custom AI Persona & Tone) ── */}
            <motion.g
              style={{ opacity: calloutOpacity, x: calloutRightX }}
              id="callout-card-3"
            >
              {/* Leader Line */}
              <path
                d="M 755 119 L 680 119 L 620 280"
                stroke="#FF7438"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.85"
                fill="none"
              />
              <circle cx="620" cy="280" r="2.5" fill="#FF7438" />

              {/* Glassmorphism Card Box */}
              <rect
                x="755"
                y="90"
                width="220"
                height="58"
                rx="8"
                fill="#0A0B10"
                fillOpacity="0.92"
                stroke="#2A2E3D"
                strokeWidth="1"
                filter="url(#cardShadowFilter)"
              />
              <circle cx="772" cy="119" r="4.5" fill="#FF7438" filter="url(#coreGlowFilter)" />
              <text x="786" y="114" fill="#FFFFFF" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Custom AI Persona &amp; Tone
              </text>
              <text x="786" y="130" fill="#999999" fontSize="9" fontFamily="sans-serif">
                System instructions &amp; guidelines
              </text>
            </motion.g>

            {/* ── CARD 4: BOTTOM-RIGHT (Complete Chat Session History) ── */}
            <motion.g
              style={{ opacity: calloutOpacity, x: calloutRightX }}
              id="callout-card-4"
            >
              {/* Leader Line */}
              <path
                d="M 755 509 L 685 509 L 660 480"
                stroke="#FF7438"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.85"
                fill="none"
              />
              <circle cx="660" cy="480" r="2.5" fill="#FF7438" />

              {/* Glassmorphism Card Box */}
              <rect
                x="755"
                y="480"
                width="220"
                height="58"
                rx="8"
                fill="#0A0B10"
                fillOpacity="0.92"
                stroke="#FF7438"
                strokeWidth="1"
                filter="url(#cardShadowFilter)"
              />
              <circle cx="772" cy="509" r="4.5" fill="#FF7438" filter="url(#coreGlowFilter)" />
              <text x="786" y="504" fill="#FFFFFF" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Complete Chat Session History
              </text>
              <text x="786" y="520" fill="#999999" fontSize="9" fontFamily="sans-serif">
                Token-perfect conversation recall
              </text>
            </motion.g>

            {/* ══════════════════════════════════════════════════════════════
                F. 3 TIER IDENTITY LABELS (Fades in during explosion)
               ══════════════════════════════════════════════════════════════ */}
            <motion.g style={{ opacity: layerLabelsOpacity }} className="pointer-events-none">
              {/* Top Cover Header */}
              <g>
                <text x="70" y="42" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="monospace" letterSpacing="0.08em">
                  ANODIZED HOUSING COVER
                </text>
                <text x="70" y="56" fill="#888888" fontSize="9" fontFamily="sans-serif">
                  Standard shareable image faceplate
                </text>
                <path d="M 235 48 L 330 48 L 456.7 105.5" stroke="#777777" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.6" />
                <circle cx="456.7" cy="105.5" r="2" fill="#FF7438" />
              </g>

              {/* Middle Substrate Header */}
              <g>
                <text x="755" y="300" fill="#FF7438" fontSize="11" fontWeight="600" fontFamily="monospace" letterSpacing="0.08em">
                  CONTEXT SILICON SUBSTRATE
                </text>
                <text x="755" y="314" fill="#888888" fontSize="9" fontFamily="sans-serif">
                  Encrypted conversation logs &amp; prompt parameters
                </text>
                <path d="M 755 307 L 720 307 L 690 350" stroke="#777777" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.6" />
                <circle cx="690" cy="350" r="2" fill="#FF7438" />
              </g>

              {/* Bottom Chassis Header */}
              <g>
                <text x="755" y="610" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="monospace" letterSpacing="0.08em">
                  OFFLINE 8-PIN INTERFACE
                </text>
                <text x="755" y="624" fill="#888888" fontSize="9" fontFamily="sans-serif">
                  Instant drag-and-drop reload into any LLM
                </text>
                <path d="M 755 617 L 680 617 L 620 575" stroke="#777777" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.6" />
                <circle cx="620" cy="575" r="2" fill="#FF7438" />
              </g>
            </motion.g>
          </svg>
        </div>

        {/* ── Bottom Telemetry Strip & Interactive Stage Pills ── */}
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08] shrink-0 z-20">
          {/* Stage Selector Pills (Clickable to jump, auto-updates on scroll) */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-[#0E0E12] border border-white/[0.08] rounded-md text-[10.5px] font-mono">
            {[
              { id: 0, label: "01. ASSEMBLED" },
              { id: 1, label: "02. CASING LIFT" },
              { id: 2, label: "03. CONTEXT ENCLAVE" },
              { id: 3, label: "04. 8-PIN BUS" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToStage(item.id)}
                className={`px-2.5 py-1 transition-all duration-200 rounded-sm cursor-pointer ${
                  activeStage === item.id
                    ? "bg-[#FF7438] text-black font-semibold shadow-[0_0_12px_rgba(255,116,56,0.35)]"
                    : "text-[#777777] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Live Dynamic Readout & Scroll Hint */}
          <div className="flex items-center gap-3 text-right">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7438] animate-pulse" />
            <span className="font-mono text-[10px] text-[#AAAAAA] tracking-wider uppercase hidden sm:inline">
              {getTelemetryText()}
            </span>
            <span className="font-mono text-[10px] text-[#666666] tracking-wider uppercase sm:hidden">
              {activeStage === 0 ? "ASSEMBLED" : activeStage === 1 ? "CASING LIFT" : activeStage === 2 ? "ENCLAVE" : "8-PIN BUS"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
