"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import HolographicCard from "@/components/ui/HolographicCard";
import ScrambledText from "@/components/ui/ScrambledText";

export default function CtaBanner() {
  return (
    <section className="py-24 sm:py-32 relative bg-[#000000] text-white overflow-hidden border-t border-white/[0.08] font-matrix select-none">
      {/* Background CAD Grid (Pure Black, Zero BG Gradient) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 text-center">
        <HolographicCard glyphVariant={2} className="p-10 sm:p-16 relative overflow-hidden text-center">
          {/* Top Star Emblem in Orange */}
          <div className="w-12 h-12 bg-[#0D0D0D] border border-white/[0.12] mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#FF5500]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-white/[0.12] text-xs mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
            <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider">
              Get Started
            </span>
          </div>

          <ScrambledText
            as="h2"
            className="text-3xl sm:text-5xl font-medium tracking-tight text-white mb-5 leading-[1.12] justify-center font-orbitron"
            duration={1.2}
          >
            Ready to try your first memory card?
          </ScrambledText>

          <ScrambledText
            as="p"
            className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed mb-10 font-matrix"
            duration={1.4}
          >
            Open the Studio, start a conversation, and download your card in seconds.
          </ScrambledText>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FF5500] hover:bg-[#ff661a] text-white text-sm font-semibold tracking-wide shadow-[0_8px_32px_rgba(255,85,0,0.3)] hover:shadow-[0_12px_44px_rgba(255,85,0,0.5)] transition-all duration-200 font-matrix"
            >
              <span>Launch OCTOMEM Studio</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-matrix text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#FF5500]" />
            <span>100% PRIVATE IN YOUR BROWSER • STAYS ON YOUR DEVICE</span>
          </div>
        </HolographicCard>
      </div>
    </section>
  );
}