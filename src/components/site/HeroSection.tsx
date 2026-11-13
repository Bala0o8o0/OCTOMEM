"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, ChevronRight, Maximize2, X as XIcon } from "lucide-react";
import ScrambledText from "@/components/ui/ScrambledText";
import ShinyText from "@/components/ui/ShinyText";
import HolographicCard from "@/components/ui/HolographicCard";
import DitherVeil from "@/components/ui/DitherVeil";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hudCardOpen, setHudCardOpen] = useState(true);

  // Scroll-linked smooth fadeout
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    shouldReduceMotion ? [1, 1] : [1, 0.35],
  );
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.75],
    shouldReduceMotion ? [1, 1] : [1, 0.98],
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen max-h-screen min-h-[500px] w-full flex flex-col justify-between pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden bg-[#000000] text-white select-none font-matrix"
    >
      {/* ── Background: CAD Blueprint Grid (Zero Blue, Pure Black, No BG Gradient) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      {/* ── Main Hero Content Wrapper (Fits Entire Viewport In One Screen) ── */}
      <motion.div
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
        className="relative z-10 w-full max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between h-full"
      >
        {/* ══════════════════════════════════════════════════════════════════
            TOP RIGHT: TELEMETRY BADGES (Moved Down With Generous Spacing)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full flex justify-end z-20 pt-3 sm:pt-4 lg:pt-6">
          <div className="flex flex-col items-end gap-1.5 text-xs font-matrix select-none">
            {/* Row 1 */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
              <span className="text-neutral-400 text-[11px] sm:text-[11.5px] tracking-wider">
                ZERO CLOUD RETENTION
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-[#FF5500] font-medium text-[11px] sm:text-[11.5px] tracking-wide">
                YOUR MEMORIES STAY YOURS
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-2 text-[10px] sm:text-[10.5px] text-neutral-500 tracking-widest">
              <span>STANDALONE PNG</span>
              <span className="text-neutral-600">•</span>
              <span>ZERO CLOUD LOCK-IN</span>
              <span className="text-neutral-600">•</span>
              <span className="text-[#FF5500] font-medium">
                DRAG & DROP RELOAD
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CENTER: 3D DITHERED MECHA MEMORY CARD (LARGER FLUID STAGE)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:absolute lg:left-[49%] lg:top-[43%] lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 w-[300px] sm:w-[400px] lg:w-[480px] xl:w-[540px] max-h-[54vh] xl:max-h-[60vh] aspect-square flex items-center justify-center my-auto mx-auto pointer-events-auto">
          <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
            <DitherVeil
              src="/images/octo-hero.png"
              fit="contain"
              pattern="floyd"
              pixelSize={2}
              levels={2}
              palette="rgb"
              inkColor="#000000"
              paperColor="#ffffff"
              contrast={1.15}
              revealRadius={220}
              softness={0.6}
              linger={1.2}
              rimColor="#FF5500"
              rim={0}
              wander={false}
              clickBurst={true}
              className="w-full h-full cursor-pointer"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM ROW: LEFT CONTENT (LARGER) + RIGHT HUD CARD
           ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5 sm:gap-6 z-20 mt-auto">
          {/* ── LEFT: Typography & CTAs (Scaled Larger) ── */}
          <div className="w-full lg:max-w-[420px] xl:max-w-[460px] flex flex-col">
            {/* ReactBits Shimmer Badge (Chamfered, No Rounded) */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0A0A]/90 border border-white/[0.14] text-xs mb-2.5 sm:mb-3 w-fit"
              style={{
                clipPath:
                  "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
              <ShinyText
                text="OCTOMEM"
                className="font-matrix text-[11px] sm:text-[11.5px] tracking-wider text-neutral-200"
                shimmerColor="rgba(255, 120, 30, 0.95)"
                speed={3}
              />
            </div>

            {/* ScrambledText Headline (All 3 lines in electric orange, larger scale) */}
            <ScrambledText
              as="h1"
              className="text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3.15rem] font-semibold tracking-tight text-[#FF5500] leading-[1.2] mb-2.5 sm:mb-3.5 font-sans drop-shadow-[0_0_28px_rgba(255,85,0,0.25)]"
              duration={1.2}
            >
              Your AI Conversations, Saved Forever.
            </ScrambledText>

            {/* ScrambledText Supporting Subhead (Larger & clearer) */}
            <ScrambledText
              as="p"
              className="text-xs sm:text-[13px] lg:text-[13.5px] text-neutral-300 font-normal leading-relaxed max-w-[390px] mb-4 sm:mb-5 font-sans"
              duration={1.4}
            >
              Chat with your favorite AI models, save the discussion as a
              personal memory card on your computer, and pick up right where you
              left off anytime.
            </ScrambledText>

            {/* Action Buttons (Faceted Chamfers, Scaled) */}
            <div className="flex items-center gap-4">
              <Link
                href="/studio"
                className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-white/20 hover:border-[#FF5500] text-white text-xs sm:text-[13px] font-medium tracking-wide shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_6px_28px_rgba(255,85,0,0.3)] transition-all duration-200 font-sans"
                style={{
                  clipPath:
                    "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                }}
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF5500] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="text-xs sm:text-[13px] text-neutral-400 hover:text-white transition-colors tracking-wide font-medium flex items-center gap-1 font-sans"
              >
                <span>How It Works</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </a>
            </div>
          </div>

          {/* ── RIGHT: Compact Precision HUD Box (About OCTOMEM) ── */}
          <div className="w-full lg:w-auto flex justify-end">
            <AnimatePresence mode="wait">
              {hudCardOpen ? (
                <HolographicCard className="p-3.5 sm:p-4 w-full sm:w-[300px] xl:w-[330px]">
                  {/* Top Bracket Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-matrix text-[11px] sm:text-[11.5px] font-semibold text-[#FF5500] tracking-wider uppercase">
                      About OCTOMEM
                    </span>
                  </div>

                  {/* Body Paragraph */}
                  <p className="text-[11px] sm:text-[11.5px] text-neutral-300 leading-relaxed font-sans mb-3">
                    OCTOMEM lets you keep your AI conversations as personal
                    memory cards.
                    <br />
                    <br />
                    Instead of losing your thoughts when a chat session closes,
                    your ideas and notes are saved directly into an image file
                    that you permanently own.
                  </p>

                  {/* Bottom Telemetry Footer + Orange 'X' Icon */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.08]">
                    <div className="font-matrix text-[8.5px] sm:text-[9px] text-neutral-500 uppercase tracking-widest leading-tight">
                      SAVE • OWN • RESUME • CHATS
                    </div>

                    <button
                      type="button"
                      onClick={() => setHudCardOpen(false)}
                      className="p-1 text-[#FF5500] hover:text-white transition-all transform hover:rotate-90 cursor-pointer"
                      title="Minimize details"
                      aria-label="Minimize details"
                    >
                      <XIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                    </button>
                  </div>
                </HolographicCard>
              ) : (
                /* Minimized State */
                <motion.button
                  key="hud-minimized"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setHudCardOpen(true)}
                  className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#0A0A0A]/90 border border-white/[0.14] text-xs font-matrix text-neutral-300 hover:text-white hover:border-[#FF5500]/60 transition-all backdrop-blur-md cursor-pointer"
                  style={{
                    clipPath:
                      "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
                  }}
                >
                  <span className="text-[#FF5500] font-semibold text-[10.5px]">
                    About OCTOMEM
                  </span>
                  <span className="text-[8.5px] text-neutral-500">
                    • Click to Expand
                  </span>
                  <Maximize2 className="w-3 h-3 text-[#FF5500] ml-1" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
