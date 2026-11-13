"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ArrowRight, ShieldCheck, Download, HardDrive, Sparkles, RefreshCw } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

const STAGES = [
  {
    step: "01",
    tag: "CLIENT-SIDE MEMORY",
    title: "Capture in RAM",
    desc: "Your conversation runs strictly inside your local browser session. Dialogue turns, world state, and extracted companion facts are assembled dynamically in volatile memory with zero cloud database persistence.",
    metric: "0 ms Cloud Lag • Zero DB Storage",
    bullets: [
      "Zero server transcripts or telemetry logs",
      "Dynamic rolling distillation of facts and context",
      "Ephemerally isolated inside your client browser tab",
    ],
    icon: Cpu,
  },
  {
    step: "02",
    tag: "STEGANOGRAPHIC PACKAGING",
    title: "Bake into Lossless PNG",
    desc: "When you choose to save, your companion state is optionally encrypted with AES-256-GCM (scrypt KDF) and injected directly into an ancillary PNG chunk (ISO/IEC 15948) before the IEND marker.",
    metric: "Lossless ISO Standard • Bit-Exact Pixels",
    bullets: [
      "Web Crypto API client-side scrypt key derivation",
      "Encrypted payload injected into tEXt chunk",
      "Standard image viewers render cover art flawlessly",
    ],
    icon: Download,
  },
  {
    step: "03",
    tag: "PORTABLE HYDRATION",
    title: "Restore via Air-Gapped Dock",
    desc: "Whenever you want to resume, simply drop your PNG cartridge back into OCTOMEM Studio on any machine. Enter your private passphrase to rehydrate state and continue seamlessly.",
    metric: "100% Offline Capable • Zero Platform Lock-in",
    bullets: [
      "Instant drag-and-drop parsing in client RAM",
      "Runs forever even if all AI company servers vanish",
      "Compatible across ChatGPT, Claude, and Local Ollama",
    ],
    icon: RefreshCw,
  },
];

export default function HowItWorksSection() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section
      id="how-it-works"
      className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#08080E] text-white border-b border-white/[0.08] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-[radial-gradient(circle,rgba(130,67,217,0.12)_0%,rgba(72,17,191,0.03)_50%,transparent_80%)] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Section Identifier */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 mb-6 shadow-[0_0_20px_rgba(130,67,217,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          <span className="font-bold tracking-[0.2em] uppercase text-[11px] text-neutral-200">
            04 · HOW IT WORKS
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#C084FC] text-[11px] font-mono">MECHANICAL CYCLE</span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
            Capture. Export.{" "}
            <ShinyText
              text="Restore without servers."
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-400"
              speed={4}
            />
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            A three-stage sovereign cycle that frees your artificial intelligence from recurring cloud surveillance and permanent platform amnesia.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── 3-STAGE INTERACTIVE MECHANICAL GRID ──────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStage === idx;

            return (
              <motion.div
                key={s.step}
                onClick={() => setActiveStage(idx)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#110D24] border-[#8243D9] shadow-[0_16px_40px_rgba(130,67,217,0.25)]"
                    : "bg-[#0A0A12]/80 border-white/10 hover:border-white/20 shadow-xl"
                }`}
              >
                <div>
                  {/* Step Eyebrow Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                      STAGE {s.step}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#8243D9] text-white shadow-[0_0_15px_#8243D9]"
                          : "bg-white/5 text-neutral-400 border border-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Subtitle Tag */}
                  <span className="text-[10px] font-mono tracking-widest text-[#C084FC] uppercase block mb-1">
                    {s.tag}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                {/* Bullets & Telemetry Metric */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <ul className="space-y-2">
                    {s.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-block">
                      {s.metric}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Interactive Workflow Callout Banner */}
        <div className="w-full max-w-4xl rounded-2xl bg-gradient-to-r from-[#120B24] via-[#1C1236] to-[#120B24] border border-[#8243D9]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-semibold text-[#C084FC] uppercase tracking-wider">
              READY TO MINT YOUR FIRST MEMORY CARTRIDGE?
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Launch Studio with any photo and start talking.
            </h4>
          </div>

          <Link
            href="/studio"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8243D9] to-[#6D28D9] text-white text-xs font-bold tracking-wide flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(130,67,217,0.5)] shrink-0"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Launch Studio Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
