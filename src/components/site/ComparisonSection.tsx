"use client";

import React from "react";
import { Check, X } from "lucide-react";
import HolographicCard from "@/components/ui/HolographicCard";
import ScrambledText from "@/components/ui/ScrambledText";

export default function ComparisonSection() {
  const comparisonItems = [
    {
      feature: "Where it is stored",
      chatHistory: "Stored on company cloud servers",
      octomem: "Saved as standard image files on your computer",
    },
    {
      feature: "Portability",
      chatHistory: "Locked inside a specific website login",
      octomem: "Drag and drop anywhere: USB, email, or local folders",
    },
    {
      feature: "Offline Access",
      chatHistory: "Requires continuous internet connection & server uptime",
      octomem: "100% offline-ready directly inside your browser",
    },
    {
      feature: "Privacy & Control",
      chatHistory: "Subject to privacy policy changes and server logs",
      octomem: "Optional private password; never touches an outside database",
    },
    {
      feature: "Price",
      chatHistory: "$20/month ongoing subscription",
      octomem: "₹100 for 7-day Studio pass • Exported cards are yours forever",
    },
  ];

  return (
    <section
      id="why-cards"
      className="py-28 sm:py-36 relative bg-[#000000] text-white overflow-hidden border-t border-white/[0.08] font-matrix select-none"
    >
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-white/[0.12] text-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
              <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider">
                Feature Comparison
              </span>
            </div>

            <ScrambledText
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12] font-orbitron"
              duration={1.2}
            >
              Why save to an image?
            </ScrambledText>
          </div>

          <ScrambledText
            as="p"
            className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl font-matrix"
            duration={1.4}
          >
            A clear look at how personal memory cards compare to ordinary AI chat history.
          </ScrambledText>
        </div>

        {/* Holographic Comparison Matrix Box */}
        <HolographicCard glyphVariant={5} className="p-0 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 p-6 border-b border-white/[0.08] bg-white/[0.02] text-xs font-matrix uppercase tracking-wider pr-16">
            <div className="col-span-4 text-neutral-400">FEATURE</div>
            <div className="col-span-4 text-red-400 flex items-center gap-1.5">
              <span>REGULAR AI CHAT</span>
            </div>
            <div className="col-span-4 text-[#FF5500] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
              <span>OCTOMEM MEMORY CARDS</span>
            </div>
          </div>

          {/* Body rows */}
          <div className="divide-y divide-white/[0.06]">
            {comparisonItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-6 text-xs sm:text-sm items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-4 font-matrix text-neutral-200 pr-4">
                  {item.feature}
                </div>

                <div className="col-span-4 text-neutral-400 flex items-start sm:items-center gap-2 pr-4 font-matrix">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="leading-relaxed">{item.chatHistory}</span>
                </div>

                <div className="col-span-4 text-white flex items-start sm:items-center gap-2 font-matrix">
                  <Check className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5 sm:mt-0" />
                  <span className="font-medium leading-relaxed">{item.octomem}</span>
                </div>
              </div>
            ))}
          </div>
        </HolographicCard>

      </div>
    </section>
  );
}