"use client";

import React from "react";

const MARQUEE_ITEMS = [
  "OCTOMEM",
  "NEVER LOSE YOUR AI CONVERSATIONS",
  "100% PRIVATE CLIENT-SIDE",
  "WORKS WITH CHATGPT & CLAUDE",
  "ONE-TIME ₹100 PASS · NO SUBSCRIPTIONS",
  "ZERO MONTHLY CLOUD RENT",
  "SAVED IN AN IMAGE ON YOUR PC",
  "BEAUTIFUL ARTWORK CARTRIDGES",
  "PASSWORD PROTECTED VAULT",
  "BRING YOUR MEMORY TO ANY AI",
];

export default function MarqueeTicker() {
  return (
    <div
      className="w-full bg-[#000000] border-y border-white/10 py-5 sm:py-6 overflow-hidden select-none relative"
      aria-label="Running Marquee Ticker"
    >
      <div className="flex items-center gap-10 sm:gap-14 whitespace-nowrap animate-marquee">
        {/* First sequence */}
        {MARQUEE_ITEMS.map((item, idx) => (
          <span
            key={`mq-1-${idx}`}
            className="text-base sm:text-lg lg:text-xl font-mono font-black tracking-[0.22em] text-white uppercase flex items-center gap-4"
          >
            <span className="text-neutral-500 text-sm sm:text-base">✦</span>
            {item}
          </span>
        ))}

        {/* Second sequence for continuous seamless infinite loop */}
        {MARQUEE_ITEMS.map((item, idx) => (
          <span
            key={`mq-2-${idx}`}
            className="text-base sm:text-lg lg:text-xl font-mono font-black tracking-[0.22em] text-white uppercase flex items-center gap-4"
          >
            <span className="text-neutral-500 text-sm sm:text-base">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
