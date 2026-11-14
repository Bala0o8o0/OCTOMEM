"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HexagonBoxProps {
  num: string;
  title: string;
  icon: React.ReactNode;
}

function HexagonBox({ num, title, icon }: HexagonBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.025 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[250px] h-[288px] flex items-center justify-center cursor-pointer select-none group"
    >
      {/* ── DRONE UI REGULAR HEXAGON SVG FRAME (Thinner laser stroke on hover) ── */}
      <svg
        viewBox="0 0 250 288"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
      >
        <defs>
          <filter id={`hexGlow-${num}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagon Border — thinner & razor-sharp line on hover */}
        <polygon
          points="125,4 246,73.5 246,214.5 125,284 4,214.5 4,73.5"
          fill="rgba(8, 8, 8, 0.96)"
          stroke={isHovered ? "#FF5500" : "rgba(255, 255, 255, 0.16)"}
          strokeWidth={isHovered ? 0.75 : 1.25}
          filter={isHovered ? `url(#hexGlow-${num})` : undefined}
          className="transition-all duration-300 group-hover:stroke-[#FF5500] group-hover:[stroke-width:0.75px]"
        />

        {/* Inner Subtle Inset Hexagon — ultra-thin on hover */}
        <polygon
          points="125,14 236,79 236,209 125,274 14,209 14,79"
          fill="none"
          stroke={isHovered ? "rgba(255, 85, 0, 0.35)" : "rgba(255, 255, 255, 0.06)"}
          strokeWidth={isHovered ? 0.5 : 0.8}
          className="transition-all duration-300 group-hover:stroke-[#FF5500]/40 group-hover:[stroke-width:0.5px]"
        />

        {/* Optical Dot Nodes at 6 Hexagon Vertices */}
        {[
          { x: 125, y: 4 },
          { x: 246, y: 73.5 },
          { x: 246, y: 214.5 },
          { x: 125, y: 284 },
          { x: 4, y: 214.5 },
          { x: 4, y: 73.5 },
        ].map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isHovered ? 2.5 : 2}
              fill={isHovered ? "#FFFFFF" : "#FF5500"}
              className="transition-all duration-300 shadow-[0_0_6px_#FF5500]"
            />
            {isHovered && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="none"
                stroke="#FF5500"
                strokeWidth="0.6"
                strokeOpacity="0.75"
              />
            )}
          </g>
        ))}
      </svg>

      {/* ── INNER CONTENT (Strictly bounded in Safe Hexagon Zone, Zero Border Overlap) ── */}
      <div
        className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-6 pt-5 pb-12"
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        {/* Step Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] group-hover:border-[#FF5500]/50 group-hover:bg-[#FF5500]/10 transition-all duration-300 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
          <span className="text-[10px] font-orbitron tracking-widest text-white/85 group-hover:text-white font-medium">
            {num}
          </span>
        </div>

        {/* Clean Vector SVG Icon with Ambient Glow */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute w-20 h-20 rounded-full bg-[#FF5500]/10 blur-xl opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 pointer-events-none" />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        </div>

        {/* Title — Placed well within the widest cross-section to prevent touching borders */}
        <div className="w-full max-w-[160px] mx-auto flex flex-col items-center mt-1">
          <h3 className="text-sm sm:text-[15px] font-semibold text-white tracking-normal font-orbitron group-hover:text-[#FF5500] transition-colors duration-300 leading-snug">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkflowSection() {
  const steps: HexagonBoxProps[] = [
    {
      num: "01",
      title: "Talk Freely",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 text-white/90 group-hover:text-white transition-colors duration-300"
          fill="none"
        >
          {/* Rounded Chat Bubble */}
          <path
            d="M 22 26 C 22 19, 28 14, 36 14 L 68 14 C 76 14, 82 19, 82 26 L 82 58 C 82 65, 76 70, 68 70 L 46 70 L 30 84 L 30 70 L 36 70 C 28 70, 22 65, 22 58 Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-[#FF5500] transition-colors duration-300"
          />
          <line x1="36" y1="32" x2="68" y2="32" stroke="#FF5500" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="44" x2="60" y2="44" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="56" x2="50" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Save as Image",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 text-white/90 group-hover:text-white transition-colors duration-300"
          fill="none"
        >
          {/* Picture Card Frame */}
          <rect
            x="20"
            y="18"
            width="60"
            height="46"
            rx="6"
            stroke="currentColor"
            strokeWidth="1.8"
            className="group-hover:stroke-[#FFA000] transition-colors duration-300"
          />
          <circle cx="36" cy="34" r="4.5" stroke="#FFA000" strokeWidth="1.8" />
          <path
            d="M 26 56 L 42 38 L 54 50 L 62 42 L 74 56"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.6"
          />
          <path
            d="M 50 64 L 50 82 M 43 75 L 50 82 L 57 75"
            stroke="#FF5500"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Drop & Resume",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 text-white/90 group-hover:text-white transition-colors duration-300"
          fill="none"
        >
          {/* Card Descending */}
          <rect
            x="34"
            y="14"
            width="32"
            height="40"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
            className="group-hover:stroke-[#FF5500] transition-colors duration-300"
          />
          <path
            d="M 50 28 L 50 40 M 45 35 L 50 40 L 55 35"
            stroke="#FF5500"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dock Slot */}
          <path
            d="M 22 62 L 22 76 C 22 81, 26 85, 31 85 L 69 85 C 74 85, 78 81, 78 76 L 78 62"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="group-hover:stroke-white transition-colors duration-300"
          />
        </svg>
      ),
    },
    {
      num: "04",
      title: "Keep Forever",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 text-white/90 group-hover:text-white transition-colors duration-300"
          fill="none"
        >
          {/* Memory Vault / Shield Hexagon Core */}
          <path
            d="M 50 16 L 76 28 L 76 56 C 76 72, 50 84, 50 84 C 50 84, 24 72, 24 56 L 24 28 Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-[#FF5500] transition-colors duration-300"
          />
          {/* Core Chip / Infinite Diamond inside */}
          <polygon
            points="50,34 62,46 50,58 38,46"
            fill="rgba(255, 85, 0, 0.15)"
            stroke="#FF5500"
            strokeWidth="1.8"
          />
          <circle cx="50" cy="46" r="2.5" fill="#FFFFFF" />
          <line x1="50" y1="58" x2="50" y2="70" stroke="#FFA000" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="38" y1="46" x2="30" y2="46" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.5" />
          <line x1="62" y1="46" x2="70" y2="46" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 relative overflow-hidden bg-[#000000] text-white border-t border-white/[0.08] font-matrix select-none"
    >
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      {/* Soft Center Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,85,0,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0A0A] border border-white/[0.12] text-xs mb-4 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
              <span className="font-mono text-[#FF5500] uppercase text-[11px] tracking-wider font-semibold">
                How It Works
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-[1.12]">
              Four simple steps.
              <br />
              <span className="text-white/40">No cloud required.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-xl">
            Everything stays on your device. Chat naturally with your favorite AI models, save the discussion into a standard picture file, resume anytime, and keep your memory forever.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            DESKTOP 4-HEXAGON DIAMOND CONSTELLATION WITH STAR NEXUS WIRES & NODES
            Top (01), Middle-Left (02), Middle-Right (03), Bottom-Center (04)
            Canvas coordinates: 860 x 880
           ══════════════════════════════════════════════════════════════════════════ */}
        <div className="relative w-full max-w-[860px] mx-auto min-h-[880px] hidden md:block">
          
          {/* ── GLOWING CIRCUIT WIRES CONNECTING ALL VERTEX DOTS TO NODES ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            viewBox="0 0 860 880"
          >
            {/* ── 1. Vertical Trunk UP: Center Nexus (430, 434) -> Top Hexagon Bottom Dot (430, 294) ── */}
            <line
              x1="430"
              y1="434"
              x2="430"
              y2="294"
              stroke="#FF5500"
              strokeWidth="1.5"
              className="filter drop-shadow-[0_0_6px_rgba(255,85,0,0.8)]"
            />
            <line
              x1="430"
              y1="434"
              x2="430"
              y2="294"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="0;16" dur="1s" repeatCount="indefinite" />
            </line>

            {/* ── 2. Vertical Trunk DOWN: Center Nexus (430, 434) -> Bottom Hexagon Top Dot (430, 574) ── */}
            <line
              x1="430"
              y1="434"
              x2="430"
              y2="574"
              stroke="#FF5500"
              strokeWidth="1.5"
              className="filter drop-shadow-[0_0_6px_rgba(255,85,0,0.8)]"
            />
            <line
              x1="430"
              y1="434"
              x2="430"
              y2="574"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* ── 3. Radial Upper-Left: Center Nexus (430, 434) -> BL Top-Right Dot (321, 363.5) ── */}
            <line
              x1="430"
              y1="434"
              x2="321"
              y2="363.5"
              stroke="#FFA000"
              strokeWidth="1.4"
              className="filter drop-shadow-[0_0_6px_rgba(255,160,0,0.8)]"
            />
            <line
              x1="430"
              y1="434"
              x2="321"
              y2="363.5"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* ── 4. Radial Upper-Right: Center Nexus (430, 434) -> BR Top-Left Dot (539, 363.5) ── */}
            <line
              x1="430"
              y1="434"
              x2="539"
              y2="363.5"
              stroke="#FFA000"
              strokeWidth="1.4"
              className="filter drop-shadow-[0_0_6px_rgba(255,160,0,0.8)]"
            />
            <line
              x1="430"
              y1="434"
              x2="539"
              y2="363.5"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="0;16" dur="1s" repeatCount="indefinite" />
            </line>

            {/* ── 5. Radial Lower-Left: Center Nexus (430, 434) -> BL Bottom-Right Dot (321, 504.5) ── */}
            <line
              x1="430"
              y1="434"
              x2="321"
              y2="504.5"
              stroke="#FF5500"
              strokeWidth="1.3"
              strokeOpacity="0.85"
              className="filter drop-shadow-[0_0_5px_rgba(255,85,0,0.6)]"
            />
            <line
              x1="430"
              y1="434"
              x2="321"
              y2="504.5"
              stroke="#FFF2CC"
              strokeWidth="0.7"
              strokeDasharray="4 3"
            >
              <animate attributeName="stroke-dashoffset" values="0;14" dur="1.1s" repeatCount="indefinite" />
            </line>

            {/* ── 6. Radial Lower-Right: Center Nexus (430, 434) -> BR Bottom-Left Dot (539, 504.5) ── */}
            <line
              x1="430"
              y1="434"
              x2="539"
              y2="504.5"
              stroke="#FF5500"
              strokeWidth="1.3"
              strokeOpacity="0.85"
              className="filter drop-shadow-[0_0_5px_rgba(255,85,0,0.6)]"
            />
            <line
              x1="430"
              y1="434"
              x2="539"
              y2="504.5"
              stroke="#FFF2CC"
              strokeWidth="0.7"
              strokeDasharray="4 3"
            >
              <animate attributeName="stroke-dashoffset" values="14;0" dur="1.1s" repeatCount="indefinite" />
            </line>

            {/* ── 7. Outer Upper-Left Diagonal: Top BL Dot (309, 224.5) -> Node (254.5, 259.25) -> Mid-Left Top Dot (200, 294) ── */}
            <line
              x1="309"
              y1="224.5"
              x2="200"
              y2="294"
              stroke="#FF5500"
              strokeWidth="1.2"
              className="filter drop-shadow-[0_0_6px_rgba(255,85,0,0.7)]"
            />
            <line
              x1="309"
              y1="224.5"
              x2="200"
              y2="294"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1.2s" repeatCount="indefinite" />
            </line>

            {/* ── 8. Outer Upper-Right Diagonal: Top BR Dot (551, 224.5) -> Node (605.5, 259.25) -> Mid-Right Top Dot (660, 294) ── */}
            <line
              x1="551"
              y1="224.5"
              x2="660"
              y2="294"
              stroke="#FF5500"
              strokeWidth="1.2"
              className="filter drop-shadow-[0_0_6px_rgba(255,85,0,0.7)]"
            />
            <line
              x1="551"
              y1="224.5"
              x2="660"
              y2="294"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="0;16" dur="1.2s" repeatCount="indefinite" />
            </line>

            {/* ── 9. Outer Lower-Left Diagonal: Mid-Left Bottom Dot (200, 574) -> Node (254.5, 608.75) -> Bottom TL Dot (309, 643.5) ── */}
            <line
              x1="200"
              y1="574"
              x2="309"
              y2="643.5"
              stroke="#FF5500"
              strokeWidth="1.2"
              className="filter drop-shadow-[0_0_6px_rgba(255,85,0,0.7)]"
            />
            <line
              x1="200"
              y1="574"
              x2="309"
              y2="643.5"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1.2s" repeatCount="indefinite" />
            </line>

            {/* ── 10. Outer Lower-Right Diagonal: Mid-Right Bottom Dot (660, 574) -> Node (605.5, 608.75) -> Bottom TR Dot (551, 643.5) ── */}
            <line
              x1="660"
              y1="574"
              x2="551"
              y2="643.5"
              stroke="#FF5500"
              strokeWidth="1.2"
              className="filter drop-shadow-[0_0_6px_rgba(255,85,0,0.7)]"
            />
            <line
              x1="660"
              y1="574"
              x2="551"
              y2="643.5"
              stroke="#FFF2CC"
              strokeWidth="0.8"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" values="0;16" dur="1.2s" repeatCount="indefinite" />
            </line>

            {/* ── INLINE GLOWING DOT NODES ON THE WIRES ── */}

            {/* Upper Vertical Mid Node (430, 364) */}
            <g>
              <circle cx="430" cy="364" r="3.5" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="430" cy="364" r="1.5" fill="#FFA000" />
            </g>

            {/* Lower Vertical Mid Node (430, 504) */}
            <g>
              <circle cx="430" cy="504" r="3.5" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="430" cy="504" r="1.5" fill="#FFA000" />
            </g>

            {/* Upper-Left Radial Node (375.5, 398.75) */}
            <g>
              <circle cx="375.5" cy="398.75" r="3.5" fill="#000000" stroke="#FFA000" strokeWidth="1.2" />
              <circle cx="375.5" cy="398.75" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Upper-Right Radial Node (484.5, 398.75) */}
            <g>
              <circle cx="484.5" cy="398.75" r="3.5" fill="#000000" stroke="#FFA000" strokeWidth="1.2" />
              <circle cx="484.5" cy="398.75" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Lower-Left Radial Node (375.5, 469.25) */}
            <g>
              <circle cx="375.5" cy="469.25" r="3.5" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="375.5" cy="469.25" r="1.5" fill="#FFA000" />
            </g>

            {/* Lower-Right Radial Node (484.5, 469.25) */}
            <g>
              <circle cx="484.5" cy="469.25" r="3.5" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="484.5" cy="469.25" r="1.5" fill="#FFA000" />
            </g>

            {/* Outer Upper-Left Node (254.5, 259.25) */}
            <g>
              <circle cx="254.5" cy="259.25" r="4" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="254.5" cy="259.25" r="1.8" fill="#FFA000" />
            </g>

            {/* Outer Upper-Right Node (605.5, 259.25) */}
            <g>
              <circle cx="605.5" cy="259.25" r="4" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="605.5" cy="259.25" r="1.8" fill="#FFA000" />
            </g>

            {/* Outer Lower-Left Node (254.5, 608.75) */}
            <g>
              <circle cx="254.5" cy="608.75" r="4" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="254.5" cy="608.75" r="1.8" fill="#FFA000" />
            </g>

            {/* Outer Lower-Right Node (605.5, 608.75) */}
            <g>
              <circle cx="605.5" cy="608.75" r="4" fill="#000000" stroke="#FF5500" strokeWidth="1.2" />
              <circle cx="605.5" cy="608.75" r="1.8" fill="#FFA000" />
            </g>

            {/* CENTRAL STAR NEXUS ROUTER HUB (430, 434) */}
            <g>
              <circle cx="430" cy="434" r="18" fill="none" stroke="#FF5500" strokeWidth="0.8" strokeOpacity="0.35" />
              <circle cx="430" cy="434" r="12" fill="#000000" stroke="#FF5500" strokeWidth="1.6" className="filter drop-shadow-[0_0_10px_#FF5500]" />
              <circle cx="430" cy="434" r="6" fill="rgba(255, 85, 0, 0.3)" stroke="#FFA000" strokeWidth="1.2" />
              <circle cx="430" cy="434" r="2.8" fill="#FFFFFF" />
            </g>
          </svg>

          {/* Top Hexagon (01: Talk Freely) */}
          <div className="absolute top-[10px] left-[305px] z-20">
            <HexagonBox {...steps[0]} />
          </div>

          {/* Middle Left Hexagon (02: Save as Image) */}
          <div className="absolute top-[290px] left-[75px] z-20">
            <HexagonBox {...steps[1]} />
          </div>

          {/* Middle Right Hexagon (03: Drop & Resume) */}
          <div className="absolute top-[290px] left-[535px] z-20">
            <HexagonBox {...steps[2]} />
          </div>

          {/* Bottom Center Hexagon (04: Keep Forever) */}
          <div className="absolute top-[570px] left-[305px] z-20">
            <HexagonBox {...steps[3]} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            MOBILE STACK: Clean vertical stack of 4 Hexagons with connecting wires & nodes
           ══════════════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center gap-5 md:hidden">
          {steps.map((item, idx) => (
            <React.Fragment key={item.num}>
              <HexagonBox {...item} />
              {idx < 3 && (
                <div className="flex flex-col items-center justify-center my-[-2px]">
                  <div className="w-[1.5px] h-5 bg-gradient-to-b from-[#FF5500] to-[#FFA000] shadow-[0_0_6px_#FF5500]" />
                  <div className="w-3 h-3 rounded-full bg-[#000000] border border-[#FF5500] flex items-center justify-center my-0.5 shadow-[0_0_6px_#FF5500]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFA000]" />
                  </div>
                  <div className="w-[1.5px] h-5 bg-gradient-to-b from-[#FFA000] to-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Clean Bottom Action Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-18 p-6 sm:p-8 bg-[#070707] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl relative"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center shrink-0 hidden sm:flex">
              <Sparkles className="w-5 h-5 text-[#FF5500]" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white font-orbitron">
                Ready to save your first conversation?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 font-matrix">
                No sign-up required. Your discussions stay on your computer forever.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium text-xs sm:text-sm rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.12)] hover:bg-[#FF5500] hover:text-white hover:shadow-[0_0_24px_rgba(255,85,0,0.35)] transition-all duration-300"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="#the-card"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-neutral-400 hover:text-white text-xs sm:text-sm font-light transition-colors"
            >
              <span>Inspect The Card</span>
              <span>↓</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
