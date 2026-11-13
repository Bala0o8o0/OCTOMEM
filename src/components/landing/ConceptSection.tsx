"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ShieldCheck, Lock, Binary, Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

type LayerId = "cover" | "chunks" | "cipher" | "neural";

const SAMPLE_NEURAL_STATE = {
  format: "octomem",
  version: 2.4,
  entityId: "sentinel-core-09",
  name: "OCTOMEM Sentinel",
  timestamp: "2026-10-24T18:40:00Z",
  memoryState: {
    worldState: "Autonomous agent operating across distributed local workflows.",
    coreFacts: [
      "Cryptographic sovereignty strictly preserved",
      "Zero telemetry, zero cloud database storage",
      "Lossless ISO/IEC 15948 cartridge standard",
    ],
    personalityMatrix: {
      analytical: 0.96,
      tactical: 0.91,
      loyalty: 1.0,
    },
  },
  encryptionSpec: {
    algorithm: "AES-256-GCM",
    kdf: "scrypt (N=32768, r=8, p=1)",
    tagLength: 128,
  },
};

const CIPHER_STREAM = `U2FsdGVkX1+vGz7R8L2mK98w1qF...[256-BIT ENCRYPTED STREAM]...
IV: 7f3a9b1c4e20d85a
TAG: 99a14c6e2b8f01de44c9
SALT: e4c9a871032f5b61001a
KEY_DERIVATION: scrypt (32,768 iterations)
STATUS: ZERO_KNOWLEDGE_VERIFIED`;

const PNG_CHUNKS = [
  {
    name: "IHDR",
    type: "Critical",
    desc: "Image header: 1024x1024, 8-bit RGBA, lossless color space",
    badge: "IMAGE BASE",
    color: "border-white/10 text-neutral-300 bg-white/[0.02]",
  },
  {
    name: "IDAT",
    type: "Critical",
    desc: "ZLIB compressed pixel raster: Visual artwork payload",
    badge: "COVER ART",
    color: "border-white/10 text-neutral-300 bg-white/[0.02]",
  },
  {
    name: "tEXt (octomem_state)",
    type: "Ancillary (Safe-to-Copy)",
    desc: "ISO/IEC 15948 encrypted memory chunk sealed with CRC32",
    badge: "STEGO CARRIER",
    color: "border-[#8243D9]/60 text-purple-300 bg-[#8243D9]/10 shadow-[0_0_20px_rgba(130,67,217,0.25)]",
  },
  {
    name: "IEND",
    type: "Critical",
    desc: "Trailer chunk marking end of valid PNG stream",
    badge: "EOF MARKER",
    color: "border-white/10 text-neutral-300 bg-white/[0.02]",
  },
];

export default function ConceptSection() {
  const [activeLayer, setActiveLayer] = useState<LayerId>("neural");
  const [passphrase, setPassphrase] = useState("octomem-sovereign-2026");
  const [authSuccess, setAuthSuccess] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim().length >= 4) {
      setAuthSuccess(true);
    } else {
      setAuthSuccess(false);
    }
  };

  return (
    <section
      id="concept"
      className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#07070B] text-white border-b border-white/[0.08] overflow-hidden"
    >
      {/* Subtle Aurora Ambient Radial */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-[radial-gradient(circle,rgba(130,67,217,0.14)_0%,rgba(72,17,191,0.04)_45%,transparent_75%)] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 mb-6 shadow-[0_0_20px_rgba(130,67,217,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          <span className="font-bold tracking-[0.2em] uppercase text-[11px] text-neutral-200">
            02 · THE CONCEPT
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#C084FC] text-[11px] font-mono">ISO/IEC 15948:2004</span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
            Turn conversations into{" "}
            <ShinyText
              text="something you own."
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-400"
              speed={4}
            />
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Standard AI chats vanish into server black holes. OCTOMEM steganographically seals neural states inside physical PNG artwork cartridges. Open the 4-layer inspector below to see how it works.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── 4-LAYER INTERACTIVE STEGANOGRAPHIC INSPECTOR ─────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-5xl rounded-3xl bg-[#0B0A14]/90 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(130,67,217,0.15)] overflow-hidden">
          {/* Top Inspector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">
                OCTOMEM 4-LAYER STEGANOGRAPHIC STACK
              </span>
            </div>

            {/* 4 Layer Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10 overflow-x-auto">
              <button
                onClick={() => setActiveLayer("cover")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeLayer === "cover"
                    ? "bg-[#8243D9] text-white font-bold shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>1. Visual Cover</span>
              </button>
              <button
                onClick={() => setActiveLayer("chunks")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeLayer === "chunks"
                    ? "bg-[#8243D9] text-white font-bold shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                <span>2. PNG Chunks</span>
              </button>
              <button
                onClick={() => setActiveLayer("cipher")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeLayer === "cipher"
                    ? "bg-[#8243D9] text-white font-bold shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>3. AES Cipher</span>
              </button>
              <button
                onClick={() => setActiveLayer("neural")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeLayer === "neural"
                    ? "bg-[#8243D9] text-white font-bold shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>4. Neural State</span>
              </button>
            </div>
          </div>

          {/* Active Layer Viewport */}
          <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* LAYER 1: VISUAL COVER */}
              {activeLayer === "cover" && (
                <motion.div
                  key="cover"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                >
                  <div className="relative aspect-square max-w-[320px] mx-auto w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                    <Image
                      src="/assets/memory-card-artifact.png"
                      alt="Lossless PNG Cover Artwork"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-300">ISO/IEC 15948:2004</span>
                      <span className="text-emerald-400 font-semibold">1024 × 1024 RGBA</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/20">
                      <span>LAYER 01 // LOSSLESS PIXEL SUBSTRATE</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Standard Image Viewer Compatible
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      To any standard viewer (Apple Photos, Windows Viewer, Android Gallery, or web browsers), this file renders as normal high-resolution artwork. Zero glitching, zero pixel noise, zero visible artifacts.
                    </p>
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-400 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">MIME TYPE:</span>
                        <span className="text-white">image/png</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">PIXEL INTEGRITY:</span>
                        <span className="text-emerald-400">100% LOSSLESS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">VISUAL DISTORTION:</span>
                        <span className="text-white">0.00% (Bit-Exact)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LAYER 2: PNG CHUNKS */}
              {activeLayer === "chunks" && (
                <motion.div
                  key="chunks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
                        LAYER 02 // CHUNK TOPOLOGY
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        Standard Ancillary Chunk Injection Before IEND
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      CRC32 Polynomial: 0xEDB88320
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {PNG_CHUNKS.map((c, i) => (
                      <div
                        key={c.name}
                        className={`p-4 rounded-2xl border ${c.color} flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-neutral-400">
                              CHUNK #{i + 1}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                              {c.badge}
                            </span>
                          </div>
                          <span className="text-sm font-mono font-bold block mb-2 text-white">
                            {c.name}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-snug">
                          {c.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <span>
                      Standard image parsers safely ignore unrecognized lowercase ancillary chunks while preserving the full image. When dropped into OCTOMEM Studio, the chunk is recognized and decrypted instantly.
                    </span>
                  </div>
                </motion.div>
              )}

              {/* LAYER 3: AES CIPHER */}
              {activeLayer === "cipher" && (
                <motion.div
                  key="cipher"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
                        LAYER 03 // MILITARY-GRADE ENCRYPTION
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        AES-256-GCM + Scrypt Key Derivation
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">
                      ● CLIENT-SIDE ONLY
                    </span>
                  </div>

                  {/* Terminal Cipher Output */}
                  <div className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-400 space-y-2">
                    <div className="text-neutral-500 text-[11px]">
                      // Derived key: 32,768 scrypt iterations • 128-bit authentication tag
                    </div>
                    <div className="break-all tracking-wider font-mono text-emerald-300 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      {CIPHER_STREAM}
                    </div>
                  </div>

                  {/* Interactive Passphrase Unlock Test */}
                  <form onSubmit={handleAuth} className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative w-full sm:flex-1">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={passphrase}
                          onChange={(e) => setPassphrase(e.target.value)}
                          placeholder="Test private passphrase..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono text-xs focus:border-[#8243D9] focus:outline-none transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8243D9] to-[#6D28D9] text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-500/25"
                      >
                        SIMULATE DECRYPTION
                      </button>
                    </div>

                    {authSuccess ? (
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Passphrase authenticated. AES-GCM envelope decrypted in memory in 1.4ms.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-mono text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Passphrase must be at least 4 characters long.</span>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* LAYER 4: NEURAL STATE */}
              {activeLayer === "neural" && (
                <motion.div
                  key="neural"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
                        LAYER 04 // REHYDRATED COGNITIVE STATE
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        Structured Cognitive State & Companion Memories
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#C084FC]">
                      ZOD SCHEMA V1 VALIDATED
                    </span>
                  </div>

                  <pre className="p-5 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed max-h-[300px] shadow-inner">
                    {JSON.stringify(SAMPLE_NEURAL_STATE, null, 2)}
                  </pre>

                  <div className="text-xs font-mono text-neutral-400 flex items-center justify-between pt-1">
                    <span>STATE SIZE: ~1.8 KB COMPRESSED</span>
                    <span className="text-purple-300">READY FOR STUDIO INJECTION</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
