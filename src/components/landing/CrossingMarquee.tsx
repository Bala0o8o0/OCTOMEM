"use client";

import React from "react";

const RIBBON_1_ITEMS = [
  "OCTOMEM",
  "NEVER LOSE YOUR AI CHATS",
  "SAVED IN AN IMAGE ON YOUR PC",
  "WORKS WITH CHATGPT & CLAUDE",
  "100% PRIVATE CLIENT-SIDE",
  "ONE-TIME PASS · NO SUBSCRIPTIONS",
  "ZERO MONTHLY CLOUD RENT",
  "PORTABLE MEMORY CARTRIDGES",
];

const RIBBON_2_ITEMS = [
  "YOUR AI FORGETS · YOUR MEMORY DOESN'T",
  "BEAUTIFUL ARTWORK CARTRIDGES",
  "PASSWORD PROTECTED VAULT",
  "ZERO CLOUD SNOOPING",
  "INSTANT ONE-CLICK RESTORE",
  "BRING YOUR MEMORY TO ANY AI",
  "SOVEREIGN DIGITAL COMPANION",
  "100% OFFLINE ENCRYPTED",
];

export default function CrossingMarquee() {
  return (
    <section
      className="relative w-full py-16 sm:py-24 lg:py-28 overflow-hidden bg-[#07060E] border-b border-white/10 select-none flex items-center justify-center"
      aria-label="Crossing Marquee Ticker"
    >
      {/* Ambient Neon Purple Radial Bloom behind crossing point */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
        aria-hidden="true"
      >
        <div className="w-[650px] h-[300px] bg-[#8243D9]/20 blur-[110px] rounded-full" />
      </div>

      {/* Dramatic Crossing Stage */}
      <div className="relative w-full h-[180px] sm:h-[220px] lg:h-[250px] flex items-center justify-center overflow-hidden">
        
        {/* ─── RIBBON 1 (Back): Tilted -4.2deg, Moving Right to Left ─── */}
        <div
          className="absolute w-[130%] -left-[15%] py-4 sm:py-5 bg-[#090616] border-y-2 border-[#8243D9]/50 shadow-[0_0_35px_rgba(130,67,217,0.3)] -rotate-[4.2deg] z-5 flex items-center pointer-events-none overflow-hidden"
          style={{ willChange: "transform" }}
        >
          <div className="flex items-center gap-10 sm:gap-14 whitespace-nowrap animate-marquee">
            {/* Sequence 1 */}
            {RIBBON_1_ITEMS.map((item, idx) => (
              <React.Fragment key={`r1-a-${idx}`}>
                <span className="text-base sm:text-xl lg:text-2xl font-mono font-black tracking-[0.2em] sm:tracking-[0.26em] text-white uppercase flex items-center gap-3.5">
                  <span className="text-[#C084FC] text-lg sm:text-2xl drop-shadow-[0_0_10px_#C084FC]">✦</span>
                  {item}
                </span>
              </React.Fragment>
            ))}
            {/* Sequence 2 (seamless infinite loop) */}
            {RIBBON_1_ITEMS.map((item, idx) => (
              <React.Fragment key={`r1-b-${idx}`}>
                <span className="text-base sm:text-xl lg:text-2xl font-mono font-black tracking-[0.2em] sm:tracking-[0.26em] text-white uppercase flex items-center gap-3.5">
                  <span className="text-[#C084FC] text-lg sm:text-2xl drop-shadow-[0_0_10px_#C084FC]">✦</span>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ─── RIBBON 2 (Front): Tilted +4.2deg, Moving Left to Right, Crossing Directly Over ─── */}
        <div
          className="absolute w-[130%] -left-[15%] py-4 sm:py-5 bg-gradient-to-r from-[#1E0E38]/98 via-[#2D1252]/98 to-[#1E0E38]/98 backdrop-blur-xl border-y-2 border-[#C084FC]/70 shadow-[0_16px_50px_rgba(0,0,0,0.92),0_0_35px_rgba(168,85,247,0.45)] rotate-[4.2deg] z-10 flex items-center pointer-events-none overflow-hidden"
          style={{ willChange: "transform" }}
        >
          <div className="flex items-center gap-10 sm:gap-14 whitespace-nowrap animate-marquee-reverse">
            {/* Sequence 1 */}
            {RIBBON_2_ITEMS.map((item, idx) => (
              <React.Fragment key={`r2-a-${idx}`}>
                <span className="text-base sm:text-xl lg:text-2xl font-mono font-black tracking-[0.2em] sm:tracking-[0.26em] text-[#FAF5FF] uppercase flex items-center gap-3.5">
                  <span className="text-[#E879F9] text-lg sm:text-2xl drop-shadow-[0_0_12px_#E879F9]">✦</span>
                  {item}
                </span>
              </React.Fragment>
            ))}
            {/* Sequence 2 (seamless infinite loop) */}
            {RIBBON_2_ITEMS.map((item, idx) => (
              <React.Fragment key={`r2-b-${idx}`}>
                <span className="text-base sm:text-xl lg:text-2xl font-mono font-black tracking-[0.2em] sm:tracking-[0.26em] text-[#FAF5FF] uppercase flex items-center gap-3.5">
                  <span className="text-[#E879F9] text-lg sm:text-2xl drop-shadow-[0_0_12px_#E879F9]">✦</span>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
