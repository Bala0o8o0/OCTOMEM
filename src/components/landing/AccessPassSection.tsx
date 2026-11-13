"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check, ShieldCheck, Ticket, QrCode, Lock, Zap } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

export default function AccessPassSection() {
  return (
    <section
      id="pricing"
      className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#08080E] text-white border-b border-white/[0.08] overflow-hidden"
    >
      {/* Background ambient radial */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-[radial-gradient(circle,rgba(130,67,217,0.12)_0%,rgba(72,17,191,0.03)_50%,transparent_80%)] blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Section Identifier */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 mb-6 shadow-[0_0_20px_rgba(130,67,217,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          <span className="font-bold tracking-[0.2em] uppercase text-[11px] text-neutral-200">
            06 · THE ACCESS PASS
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#C084FC] text-[11px] font-mono">RADICAL ANTI-SUBSCRIPTION</span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
            Own the export.{" "}
            <ShinyText
              text="Refuse the subscription trap."
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-400"
              speed={4}
            />
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Why pay ₹1,650 every single month just to keep your conversations hostage on server clouds? Pay ₹100 for 7-day minting access. Export your permanent memory cards once, keep them forever.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── SCI-FI PHYSICAL BOARDING PASS TICKET ─────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-4xl relative rounded-3xl bg-[#0D0B18] border border-[#8243D9]/40 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(130,67,217,0.2)] overflow-hidden flex flex-col lg:flex-row">
          
          {/* Main Ticket Body (Left 68%) */}
          <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-8">
            <div>
              {/* Ticket Top Stamp */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8243D9]/20 border border-[#8243D9]/40 flex items-center justify-center text-[#C084FC]">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-white uppercase block">
                      OCTOMEM STUDIO PASS
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      SERIAL: #OCTO-MINT-2026-X9
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                  <span>UNLIMITED EXPORTS</span>
                </div>
              </div>

              {/* Price & Duration */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl sm:text-6xl font-black font-sans text-white">₹100</span>
                  <span className="text-sm font-mono text-neutral-400">/ 7-DAY PASS</span>
                </div>
                <span className="text-xs font-mono text-purple-300">
                  (Single flat utility fee • Zero recurring auto-renew)
                </span>
              </div>

              {/* Ticket Inclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-neutral-300 font-sans">
                  <Check className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>Unlimited lossless PNG card exports</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-300 font-sans">
                  <Check className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>AES-256-GCM + scrypt 32K iterations</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-300 font-sans">
                  <Check className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>Direct BYOK API (OpenAI, Claude, NVIDIA, Local)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-300 font-sans">
                  <Check className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>Permanent file ownership: 0 monthly rent</span>
                </div>
              </div>
            </div>

            {/* Bottom Ownership Guarantee */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                <strong className="text-white">PERMANENT OWNERSHIP:</strong> Once exported, your memory cards belong to you permanently. Even when your pass ends, your cards run offline forever with zero fees.
              </p>
            </div>
          </div>

          {/* Perforated Divider (Dashed Hairline with Cutouts) */}
          <div className="relative flex lg:flex-col items-center justify-between border-t lg:border-t-0 lg:border-l border-dashed border-white/20 px-4 lg:py-6 bg-[#0B0915]">
            {/* Top Cutout */}
            <div className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#08080E] border-b border-white/20" />
            {/* Bottom Cutout */}
            <div className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#08080E] border-t border-white/20" />

            <div className="w-full flex lg:flex-col items-center justify-between gap-6 p-6 lg:p-4 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  AIR-GAPPED PASS
                </span>
                <span className="text-xs font-mono font-bold text-[#C084FC]">
                  STUB #7D-MINT
                </span>
              </div>

              {/* Sci-Fi Barcode / Telemetry Matrix */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-xl bg-white p-2 shadow-inner flex items-center justify-center">
                  <div className="w-full h-full bg-neutral-900 rounded-lg p-1.5 flex flex-col justify-between">
                    <div className="flex justify-between h-2 w-full gap-0.5">
                      <span className="w-1 h-full bg-white" />
                      <span className="w-2 h-full bg-white" />
                      <span className="w-0.5 h-full bg-white" />
                      <span className="w-3 h-full bg-white" />
                      <span className="w-1 h-full bg-white" />
                      <span className="w-2 h-full bg-white" />
                    </div>
                    <div className="flex justify-between h-4 w-full gap-0.5">
                      <span className="w-2 h-full bg-white" />
                      <span className="w-0.5 h-full bg-white" />
                      <span className="w-1 h-full bg-white" />
                      <span className="w-3 h-full bg-white" />
                      <span className="w-2 h-full bg-white" />
                    </div>
                    <span className="text-[7px] font-mono text-center text-white block">
                      OCTOMEM-15948
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  CLIENT READY
                </span>
              </div>

              <Link
                href="/studio"
                className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#8243D9] via-[#9333EA] to-[#6D28D9] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(130,67,217,0.4)] hover:scale-105 active:scale-95 transition-all text-center"
              >
                Launch Studio
              </Link>
            </div>
          </div>
        </div>

        {/* ── ANTI-SUBSCRIPTION COMPARISON TABLE ───────────────────────────── */}
        <div className="w-full max-w-4xl mt-16 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-[#A855F7]">✦</span>
            <span>The Economics of Memory Ownership</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Model */}
            <div className="p-5 rounded-2xl bg-red-500/[0.04] border border-red-500/20 space-y-3">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
                THE CLOUD RENT TREADMILL
              </span>
              <div className="text-2xl font-black text-white">₹19,800 / year</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Pay ₹1,650/month forever. Stop paying, and all your memory and chats are locked away on server disks you cannot download or run.
              </p>
            </div>

            {/* The OCTOMEM Model */}
            <div className="p-5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                SOVEREIGN MATTER (OCTOMEM)
              </span>
              <div className="text-2xl font-black text-white">₹100 when you mint</div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Pay only for the export utility. The physical PNG file lives on your own hard drive forever, opens anywhere, and has zero recurring rent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
