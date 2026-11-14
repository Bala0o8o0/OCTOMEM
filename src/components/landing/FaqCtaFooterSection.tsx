"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight, ShieldCheck, Terminal, Heart } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What happens if OCTOMEM's servers vanish forever?",
    a: "Your memory cartridges continue functioning indefinitely. OCTOMEM is architected with 100% client-side cryptography and standard ISO/IEC 15948 PNG parsing. There is no cloud database to shut down. The browser-based studio can run entirely offline from a local cache or HTML bundle.",
  },
  {
    q: "Can OpenAI, Anthropic, or external cloud providers read my memory card?",
    a: "No. If you set a passphrase, the neural state is encrypted using military-grade AES-256-GCM with key derivation via scrypt (32,768 iterations). Cloud providers only see the prompts you actively send to them during live inference; they have zero access to your locked offline cartridge files.",
  },
  {
    q: "How does steganography differ from just saving a plain text chat file?",
    a: "Text files are fragile, messy, and lack cognitive architecture. OCTOMEM distills volatile dialogue into structured knowledge graphs, verified core facts, companion personas, and world states — then seamlessly injects that JSON envelope into lossless PNG chunks with a CRC32 checksum. The result is a tactile, collectible visual cartridge that opens in any photo viewer and mounts instantly into AI docks.",
  },
  {
    q: "Is there any recurring monthly subscription fee?",
    a: "Zero recurring rent. OCTOMEM rejects the predatory SaaS treadmill. A ₹100 7-day Studio Pass gives you unlimited minting and export capabilities. Once you download your PNG cartridges, they belong to you permanently with zero ongoing maintenance costs.",
  },
  {
    q: "What image formats can I use to create memory cards?",
    a: "Standard lossless PNG is the official ISO cartridge format. However, you can upload any JPG, PNG, or WebP photo into OCTOMEM Studio — our client-side image engine automatically converts it into a lossless 24-bit/32-bit PNG cartridge ready for steganographic state injection.",
  },
];

function FaqAccordion({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] transition-colors hover:border-white/20">
      <button
        onClick={onToggle}
        className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
      >
        <span className="font-bold text-base sm:text-lg text-white font-sans tracking-tight">
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-neutral-300"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 sm:px-7 pb-6 text-sm text-neutral-300 font-sans leading-relaxed border-t border-white/5 pt-4">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqCtaFooterSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <footer
      id="faq"
      className="relative w-full bg-[#050508] text-white overflow-hidden border-t border-white/[0.08]"
    >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
        {/* Section Identifier */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 mb-6 shadow-[0_0_20px_rgba(130,67,217,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
            <span className="font-bold tracking-[0.2em] uppercase text-[11px] text-neutral-200">
              07 · FREQUENTLY ASKED QUESTIONS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-[1.05]">
            Frequently inspected{" "}
            <ShinyText
              text="architectural inquiries."
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-400"
              speed={4}
            />
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans max-w-2xl mx-auto">
            Everything you need to know about sovereign AI memory persistence, AES cryptography, and physical PNG steganography.
          </p>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-3.5">
          {FAQS.map((faq, i) => (
            <FaqAccordion
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => toggleIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ── CLOSING OBSIDIAN CTA BANNER ──────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-b from-[#130E26] via-[#0D0B18] to-[#080710] border border-[#8243D9]/40 p-8 sm:p-14 md:p-16 text-center relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(130,67,217,0.25)]">
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(130,67,217,0.25)_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>THE SOVEREIGN MEMORY REVOLUTION</span>
            </div>

            <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.05]">
              Take sovereign possession of your intelligence.
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-xl mx-auto">
              Refuse the subscription trap. Save your companion memories inside permanent artwork cartridges stored safely on your own device.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/studio"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#8243D9] via-[#9333EA] to-[#6D28D9] text-white text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(130,67,217,0.6)] hover:shadow-[0_0_45px_rgba(168,85,247,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Launch Studio Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ── ARCHITECTURAL TELEMETRY FOOTER ───────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-[#030306] px-6 sm:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Identity & Protocol Spec */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <img
                src="/octomem_logo.png"
                alt="OCTOMEM Logo"
                className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
              />
              <span className="font-bold text-white text-sm tracking-wider font-mono">
                OCTOMEM
              </span>
            </div>
            <span className="hidden sm:inline-block text-neutral-600">|</span>
            <span className="text-xs font-mono text-neutral-400">
              ISO/IEC 15948:2004 Conformance • AES-256-GCM Client Crypto
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400">
            <Link href="#problem" className="hover:text-white transition-colors">
              Problem
            </Link>
            <Link href="#concept" className="hover:text-white transition-colors">
              Concept
            </Link>
            <Link href="#archive" className="hover:text-white transition-colors">
              Vault
            </Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#collection" className="hover:text-white transition-colors">
              Cartridges
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pass
            </Link>
            <Link href="/studio" className="text-purple-400 hover:text-white transition-colors font-bold">
              Launch Studio →
            </Link>
          </div>
        </div>

        {/* Micro-Telemetry Bottom Subtext */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-3 text-center sm:text-left">
          <span>ZERO CLOUD DATABASE • 100% CLIENT RAM PRIVACY • BUILT FOR SOVEREIGN AGENTS</span>
          <span>© 2026 OCTOMEM PROTOCOL. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}
