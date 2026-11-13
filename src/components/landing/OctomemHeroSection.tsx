"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { Sparkles, ArrowRight, HardDrive, Lock } from "lucide-react";
import PurpleParticleField from "./PurpleParticleField";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";

// Dynamically import 3D Scene with no SSR for ultra-smooth rendering
const Octomem3DScene = dynamic(() => import("@/components/Octomem3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#A855F7] animate-spin" />
    </div>
  ),
});

export default function OctomemHeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const modelWrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Initial state
      gsap.set(ambientGlowRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(wordmarkRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(modelWrapperRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(cardsRef.current?.children || [], { opacity: 0, x: 30 });
      gsap.set(bottomBarRef.current, { opacity: 0, y: 20 });

      // Master Entrance Timeline (Smooth reveal on load)
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      introTl
        .to(
          ambientGlowRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0.05
        )
        .to(
          wordmarkRef.current,
          {
            opacity: 0.85,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0.2
        )
        .to(
          modelWrapperRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.3,
            ease: "power2.out",
          },
          0.35
        )
        .to(
          bottomBarRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          0.55
        )
        .to(
          cardsRef.current?.children || [],
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "back.out(1.1)",
          },
          0.7
        );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[640px] max-h-[1150px] bg-[#07060E] text-white overflow-hidden select-none flex flex-col justify-between pt-16 sm:pt-18"
      aria-label="OCTOMEM Cinematic Hero"
    >
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 1. BACKGROUND: DARK OBSIDIAN SPACE + ROYAL VIOLET AURORA GRADIENT   */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div
        ref={ambientGlowRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 40% 42%, rgba(130, 67, 217, 0.32) 0%, rgba(88, 28, 135, 0.18) 38%, rgba(13, 11, 24, 0.96) 70%, #07060E 100%),
            radial-gradient(circle at 18% 35%, rgba(168, 85, 247, 0.14) 0%, transparent 45%),
            radial-gradient(circle at 82% 65%, rgba(192, 132, 252, 0.14) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating Faint Purple Dust Particles */}
      <PurpleParticleField className="z-1" />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 2. MONOLITHIC WORDMARK "OCTOMEM" (LAYERED BEHIND MODEL AT Z-5)      */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div
        ref={wordmarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-black uppercase tracking-[-0.035em] leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.13] via-white/[0.04] to-transparent drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]"
          style={{
            fontSize: "clamp(5rem, 20vw, 22rem)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          OCTOMEM
        </span>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 3. CENTERPIECE: 3D OCTOMEM MODEL (FULL VIEWPORT Z-20, IN FRONT)      */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div
        ref={modelWrapperRef}
        className="absolute inset-0 z-20 pointer-events-auto flex items-center justify-center"
      >
        <div className="w-full h-full max-w-[1550px]">
          <Octomem3DScene />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 4. FOREGROUND INTERACTION LAYER: RIGHT-SIDE HUD CARDS (Z-30)        */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="relative flex-1 w-full max-w-[1550px] mx-auto px-6 sm:px-12 flex items-center justify-end py-1 pointer-events-none">
        
        {/* RIGHT COLUMN: REFINED PURE VIOLET SCI-FI HUD CARDS */}
        <div
          ref={cardsRef}
          className="hidden lg:flex flex-col gap-2.5 w-[255px] xl:w-[275px] relative z-30 shrink-0 pointer-events-auto my-auto"
        >
          {/* Card 1: Picture Cartridge */}
          <SpotlightCard
            spotlightColor="rgba(168, 85, 247, 0.24)"
            borderColor="rgba(130, 67, 217, 0.28)"
            className="p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:border-[#A855F7]/50 transition-all bg-[#0B0818]/85"
          >
            <div className="flex items-center gap-2.5">
              {/* Compact Violet Mechanical Icon Badge */}
              <div className="w-8 h-8 rounded-xl bg-[#1B1233] border border-[#8243D9]/40 flex items-center justify-center text-[#C084FC] shadow-[0_0_12px_rgba(130,67,217,0.35)] shrink-0">
                <HardDrive className="w-4 h-4 text-[#C084FC]" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-sans font-bold text-xs text-white tracking-tight">
                    Picture Cartridge
                  </span>
                  <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-[#8243D9]/20 text-[#C084FC] border border-[#8243D9]/30">
                    IMAGE
                  </span>
                </div>
                <span className="text-[10px] text-neutral-300 font-sans leading-tight mt-0.5">
                  Chats saved in an image file on your PC
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Private Vault Lock */}
          <SpotlightCard
            spotlightColor="rgba(168, 85, 247, 0.24)"
            borderColor="rgba(130, 67, 217, 0.28)"
            className="p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:border-[#A855F7]/50 transition-all bg-[#0B0818]/85"
          >
            <div className="flex items-center gap-2.5">
              {/* Compact Violet Vault Icon Badge */}
              <div className="w-8 h-8 rounded-xl bg-[#1B1233] border border-[#8243D9]/40 flex items-center justify-center text-[#A855F7] shadow-[0_0_12px_rgba(130,67,217,0.35)] shrink-0">
                <Lock className="w-4 h-4 text-[#A855F7]" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-sans font-bold text-xs text-white tracking-tight">
                    Private Vault
                  </span>
                  <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-[#8243D9]/20 text-[#C084FC] border border-[#8243D9]/30">
                    LOCKED
                  </span>
                </div>
                <span className="text-[10px] text-neutral-300 font-sans leading-tight mt-0.5">
                  Password locked · Zero cloud snooping
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Works with Any AI */}
          <SpotlightCard
            spotlightColor="rgba(168, 85, 247, 0.24)"
            borderColor="rgba(130, 67, 217, 0.28)"
            className="p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:border-[#A855F7]/50 transition-all bg-[#0B0818]/85"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                {/* Compact Violet AI Sparkle Icon Badge */}
                <div className="w-8 h-8 rounded-xl bg-[#1B1233] border border-[#8243D9]/40 flex items-center justify-center text-[#C084FC] shadow-[0_0_12px_rgba(130,67,217,0.35)] shrink-0">
                  <Sparkles className="w-4 h-4 text-[#C084FC]" />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-sans font-bold text-xs text-white tracking-tight">
                      Works with Any AI
                    </span>
                    <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-[#8243D9]/20 text-[#C084FC] border border-[#8243D9]/30">
                      SYNC
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-300 font-sans leading-tight mt-0.5">
                    ChatGPT · Claude · Local AI
                  </span>
                </div>
              </div>

              {/* Delicate Violet Waveform Strip */}
              <div className="w-full h-3 flex items-center pt-0.5">
                <svg viewBox="0 0 160 12" className="w-full h-full text-[#A855F7]">
                  <path
                    d="M0 6 Q20 0 40 6 T80 6 T120 6 T160 6"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="1.5"
                  />
                  <circle cx="40" cy="6" r="2.2" fill="#C084FC" />
                  <circle cx="80" cy="6" r="2.2" fill="#C084FC" />
                  <circle cx="120" cy="6" r="2.2" fill="#C084FC" />
                </svg>
              </div>
            </div>
          </SpotlightCard>

          {/* Primary Violet CTA Button */}
          <div className="flex flex-col gap-1 pt-0.5">
            <Link
              href="/studio"
              className="group relative flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8243D9] via-[#9333EA] to-[#6D28D9] text-white font-semibold text-xs tracking-wide shadow-[0_0_24px_rgba(130,67,217,0.45)] hover:shadow-[0_0_36px_rgba(168,85,247,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-purple-400/30"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                <ShinyText text="Launch Studio · Make Card" speed={3.5} className="font-sans font-bold text-xs" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-purple-200 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-between px-1 text-[8.5px] text-neutral-400 font-sans">
              <span>One-time ₹100 pass</span>
              <Link href="#pricing" className="text-purple-300 hover:text-white transition-colors underline decoration-purple-400/30">
                No subscriptions →
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 5. BOTTOM BAR: HEADLINE & MATRIX DESCRIPTION (Z-10, BEHIND TENTACLES)*/}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <footer
        ref={bottomBarRef}
        className="relative z-10 w-full px-6 sm:px-12 pb-3.5 sm:pb-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pointer-events-none"
      >
        {/* Bottom Left: Eyebrow + Powerful Headline + Matrix Font Description */}
        <div className="flex flex-col items-start gap-1.5 max-w-md pointer-events-auto">
          {/* Eyebrow Pill with ShinyText */}
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#141024]/85 border border-white/15 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse shadow-[0_0_8px_#A855F7]" />
            <ShinyText
              text="KEEP YOUR AI'S MEMORY FOREVER · 100% PRIVATE"
              speed={4}
              className="text-[9px] font-mono tracking-wider text-purple-300 uppercase"
            />
          </div>

          {/* Headline moved to bottom, stacked to keep central stage clear */}
          <h1 className="text-base sm:text-lg lg:text-[1.65rem] font-black tracking-tight leading-[1.1] text-white flex flex-col">
            <span>YOUR AI FORGETS.</span>
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#E879F9]"
              style={{
                textShadow: "0 0 25px rgba(168,85,247,0.5)",
              }}
            >
              YOUR MEMORY DOESN&apos;T.
            </span>
          </h1>

          {/* Matrix Font Description as specifically requested by user */}
          <p className="text-[9.5px] sm:text-[10px] font-mono font-medium text-neutral-300 uppercase tracking-wider leading-relaxed max-w-md">
            SAVE YOUR AI CONVERSATIONS INTO PERMANENT ARTWORK CARTRIDGES. STORED 100% SAFELY ON YOUR OWN DEVICE WITH ZERO MONTHLY CLOUD RENT.
          </p>
        </div>

        {/* Bottom Right: Pixel Checkerboard Matrix + Minimal Status */}
        <div className="hidden sm:flex items-center gap-3 pointer-events-auto pb-1">
          {/* 3x2 Checkerboard Matrix */}
          <div className="grid grid-cols-2 gap-1 w-5 h-6 shrink-0">
            <span className="w-2 h-2 bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
            <span className="w-2 h-2 bg-transparent border border-white/40" />
            <span className="w-2 h-2 bg-transparent border border-white/40" />
            <span className="w-2 h-2 bg-[#8243D9]" />
            <span className="w-2 h-2 bg-[#A855F7]" />
            <span className="w-2 h-2 bg-transparent border border-white/40" />
          </div>

          <div className="flex flex-col text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-tight">
            <span className="text-neutral-500">MEMORY STATUS</span>
            <span className="text-[#C084FC] font-semibold">100% PRIVATE · STORED ON DEVICE</span>
          </div>
        </div>

      </footer>
    </section>
  );
}
