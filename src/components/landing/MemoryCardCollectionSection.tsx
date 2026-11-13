"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Code2, BookOpen, Lock } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

interface Cartridge {
  id: string;
  name: string;
  title: string;
  role: string;
  archetype: string;
  turns: number;
  cipher: string;
  bytes: string;
  accent: string;
  glow: string;
  border: string;
  icon: React.ElementType;
  description: string;
}

const CARTRIDGES: Cartridge[] = [
  {
    id: "archivist",
    name: "Aria",
    title: "Cranial Archivist",
    role: "Long-Term Knowledge Synthesis",
    archetype: "ARCHIVIST // RECALL",
    turns: 142,
    cipher: "AES-256-GCM",
    bytes: "3.2 KB",
    accent: "text-purple-300",
    glow: "rgba(168, 85, 247, 0.35)",
    border: "border-purple-500/40",
    icon: Cpu,
    description: "Consolidates cross-session ideas, research archives, user habits, and philosophical frameworks into permanent neural recall.",
  },
  {
    id: "architect",
    name: "Kaelen",
    title: "Systems Architect",
    role: "Full-Stack Software Blueprint",
    archetype: "ARCHITECT // CODE",
    turns: 88,
    cipher: "AES-256-GCM",
    bytes: "2.7 KB",
    accent: "text-cyan-300",
    glow: "rgba(6, 182, 212, 0.35)",
    border: "border-cyan-500/40",
    icon: Code2,
    description: "Encapsulates software schemas, component design tokens, architectural trade-offs, and clean-code refactoring heuristics.",
  },
  {
    id: "muse",
    name: "Lyra",
    title: "Synthetic Muse",
    role: "Creative Lore & World-Building",
    archetype: "CREATIVE // LORE",
    turns: 215,
    cipher: "AES-256-GCM",
    bytes: "4.1 KB",
    accent: "text-emerald-300",
    glow: "rgba(52, 211, 153, 0.35)",
    border: "border-emerald-500/40",
    icon: BookOpen,
    description: "Retains deep character lore, emotional cadence, world-building rules, and nuanced prose style across novel manuscripts.",
  },
  {
    id: "vault",
    name: "Cipher-9",
    title: "Air-Gapped Vault",
    role: "Zero-Knowledge Personal Diary",
    archetype: "VAULT // MAXIMUM",
    turns: 34,
    cipher: "AES-256-GCM (scrypt 32K)",
    bytes: "1.9 KB",
    accent: "text-amber-300",
    glow: "rgba(245, 158, 11, 0.35)",
    border: "border-amber-500/40",
    icon: Lock,
    description: "Maximum paranoia tier. Confidential strategic reflections and encrypted keys. Strictly inaccessible without passkey.",
  },
];

function CartridgeCard({ cartridge }: { cartridge: Cartridge }) {
  const Icon = cartridge.icon;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl p-6 sm:p-7 bg-[#0C0B16] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-2xl group cursor-pointer"
    >
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 uppercase">
            {cartridge.archetype}
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${cartridge.accent}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Machine Stamp Header */}
        <div className="space-y-1 mb-4">
          <span className="text-xs font-mono text-neutral-400">
            COMPANION: <strong className="text-white">{cartridge.name}</strong>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {cartridge.title}
          </h3>
          <p className="text-xs font-sans text-neutral-400">
            {cartridge.role}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-300 leading-relaxed mb-6 font-sans">
          {cartridge.description}
        </p>
      </div>

      {/* Cartridge Technical Spec Strip */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] font-mono text-neutral-400 block">MEMORY</span>
            <span className="text-xs font-mono font-bold text-white">{cartridge.turns} turns</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] font-mono text-neutral-400 block">CIPHER</span>
            <span className="text-xs font-mono font-bold text-white">AES-256</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] font-mono text-neutral-400 block">PAYLOAD</span>
            <span className="text-xs font-mono font-bold text-white">{cartridge.bytes}</span>
          </div>
        </div>

        {/* Mount in Studio CTA */}
        <Link
          href={`/studio`}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#8243D9]/60 transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Mount in Studio</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function MemoryCardCollectionSection() {
  return (
    <section
      id="collection"
      className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#07060D] text-white border-b border-white/[0.08] overflow-hidden"
    >
      {/* Ambient background glow */}
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
            05 · MEMORY-CARD COLLECTION
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#C084FC] text-[11px] font-mono">4 ARCHETYPES</span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
            A library of sentient companions.{" "}
            <ShinyText
              text="Ready to mount."
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-400"
              speed={4}
            />
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Every cartridge is an isolated memory vessel. Hover to engage 3D spring tilt physics, or click to mount the companion directly in OCTOMEM Studio.
          </p>
        </div>

        {/* 4 Cartridge Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARTRIDGES.map((c) => (
            <CartridgeCard key={c.id} cartridge={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
