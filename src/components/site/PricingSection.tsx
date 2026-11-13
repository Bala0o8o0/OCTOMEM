"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Ticket, ShieldCheck } from "lucide-react";
import HolographicCard from "@/components/ui/HolographicCard";
import ScrambledText from "@/components/ui/ScrambledText";

export default function PricingSection() {
  const perks = [
    "Full 7-day unlimited access to OCTOMEM Studio",
    "Save and download unlimited memory card images",
    "Use your own photos or artwork as card covers",
    "Optional personal password lock on any card",
    "Load and continue your memory cards anytime for free",
    "Zero recurring charges • No automatic renewal",
  ];

  return (
    <section
      id="pricing"
      className="py-28 sm:py-36 relative bg-[#000000] text-white overflow-hidden border-t border-white/[0.08] font-matrix select-none"
    >
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-white/[0.12] text-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
            <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider">
              Studio Pass
            </span>
          </div>

          <ScrambledText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12] mb-4 justify-center font-orbitron"
            duration={1.2}
          >
            Simple, transparent access.
          </ScrambledText>

          <ScrambledText
            as="p"
            className="text-sm sm:text-base text-neutral-300 leading-relaxed font-matrix"
            duration={1.4}
          >
            Pay for the utility only when you want to create cards. Your saved memory cards stay yours forever.
          </ScrambledText>
        </div>

        {/* ── Holographic HUD Pass Container ── */}
        <div className="max-w-2xl mx-auto">
          <HolographicCard glyphVariant={1} className="p-8 sm:p-10 relative overflow-hidden">
            {/* Top Pass Telemetry Bar (No '//') */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8 font-matrix pr-14">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-matrix">ACCESS PLAN</span>
                  <span className="text-sm font-semibold text-white font-orbitron">Studio Pass • 7 Days Access</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#FF5500] font-orbitron">₹100</span>
                <span className="text-xs text-neutral-400 font-matrix block">/ 7 DAYS ACCESS</span>
              </div>
            </div>

            {/* Perks List */}
            <div className="space-y-3.5 mb-8">
              {perks.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200">
                  <div className="w-5 h-5 bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5500]">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-relaxed font-matrix">{perk}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Link
              href="/studio"
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-[#FF5500] hover:bg-[#ff661a] text-white text-sm font-semibold shadow-[0_8px_32px_rgba(255,85,0,0.3)] hover:shadow-[0_12px_44px_rgba(255,85,0,0.45)] transition-all duration-200 font-matrix"
            >
              <span>Get 7-Day Access Pass</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* Footer status line */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <span className="font-matrix text-[11px] text-neutral-400">
                ● Instant activation
              </span>
              <span className="font-matrix text-[10px] text-neutral-500 uppercase">
                ONE-TIME PAYMENT • NO AUTO-RENEWAL
              </span>
            </div>
          </HolographicCard>
        </div>

      </div>
    </section>
  );
}