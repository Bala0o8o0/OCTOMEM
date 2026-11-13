"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Heart,
  Languages,
  ArrowRight,
  Database,
  Cpu,
  Sparkles,
  Layers,
  MousePointerClick,
  SlidersHorizontal,
} from "lucide-react";
import ScrambledText from "@/components/ui/ScrambledText";
import HolographicCard, { AlienPixelGlyphs } from "@/components/ui/HolographicCard";
import FlexCarousel, {
  FlexCarouselItem,
  FlexCarouselPreset,
} from "@/components/ui/FlexCarousel";

interface CardArchetype extends FlexCarouselItem {
  id: string;
  code: string;
  role: string;
  tagline: string;
  accent: string;
  turns: number;
  lastUpdated: string;
  tags: string[];
  icon: React.ElementType;
}

const CARDS_DATA: CardArchetype[] = [
  {
    id: "aria",
    code: "CARD 01",
    title: "Aria",
    subtitle: "Creative Writing & Lore • 48 Messages",
    src: "/images/card-showcase-1.png",
    alt: "Aria — Creative Writing & Lore Memory Card",
    role: "Creative Writing & Lore",
    tagline: "Fantasy worldbuilding, character dialogue, and novel drafts.",
    accent: "#FF5500",
    turns: 48,
    lastUpdated: "2 hours ago",
    tags: ["Worldbuilding", "Story Drafts", "Character Lore"],
    icon: BookOpen,
  },
  {
    id: "atlas",
    code: "CARD 02",
    title: "Atlas",
    subtitle: "Software & System Design • 32 Messages",
    src: "/images/card-showcase-2.png",
    alt: "Atlas — Software & System Design Memory Card",
    role: "Software & System Design",
    tagline: "Database schemas, app architecture, and code planning.",
    accent: "#FF7700",
    turns: 32,
    lastUpdated: "Yesterday",
    tags: ["Architecture", "Databases", "App Roadmap"],
    icon: Code2,
  },
  {
    id: "sora",
    code: "CARD 03",
    title: "Sora",
    subtitle: "Personal Reflection & Journal • 56 Messages",
    src: "/images/card-showcase-3.png",
    alt: "Sora — Personal Reflection & Journal Memory Card",
    role: "Personal Reflection & Journal",
    tagline: "Weekly decision logs, thoughts, and personal priorities.",
    accent: "#FFA500",
    turns: 56,
    lastUpdated: "3 days ago",
    tags: ["Decisions", "Weekly Review", "Journal"],
    icon: Heart,
  },
  {
    id: "elena",
    code: "CARD 04",
    title: "Elena",
    subtitle: "Language Practice • 29 Messages",
    src: "/images/card-showcase-4.png",
    alt: "Elena — Language Practice Memory Card",
    role: "Language Practice",
    tagline: "Spanish conversation notes, vocabulary, and grammar practice.",
    accent: "#FF5500",
    turns: 29,
    lastUpdated: "Last week",
    tags: ["Spanish", "Vocabulary", "Speaking"],
    icon: Languages,
  },
  {
    id: "cipher",
    code: "CARD 05",
    title: "Cipher",
    subtitle: "Business & Strategy • 41 Messages",
    src: "/images/card-showcase-5.png",
    alt: "Cipher — Business & Strategy Memory Card",
    role: "Business & Strategy",
    tagline: "Product roadmaps, customer research, and launch plans.",
    accent: "#FF8800",
    turns: 41,
    lastUpdated: "Just now",
    tags: ["Strategy", "Pitch Notes", "Milestones"],
    icon: Database,
  },
  {
    id: "sentinel",
    code: "CARD 06",
    title: "OctoMem Core",
    subtitle: "3D Mecha Octopus Memory Card • 64 Messages",
    src: "/images/octo-hero.png",
    alt: "OctoMem Core — 3D Mecha Octopus Memory Card",
    role: "Mecha Octopus Core",
    tagline: "Tangible 3D memory cartridge with glowing mecha octopus emblem and permanent offline storage.",
    accent: "#FF5500",
    turns: 64,
    lastUpdated: "Just now",
    tags: ["Mecha Octopus", "3D Cartridge", "Permanent Memory"],
    icon: Cpu,
  },
  {
    id: "nexus",
    code: "CARD 07",
    title: "Nexus",
    subtitle: "Cross-Model Context • 52 Messages",
    src: "/images/holographic-mecha-card.png",
    alt: "Nexus — Cross-Model Context Memory Card",
    role: "Cross-Model Context",
    tagline: "Multi-agent orchestration state and context handoff vectors.",
    accent: "#FF7700",
    turns: 52,
    lastUpdated: "5 hours ago",
    tags: ["Multi-Agent", "Handoff", "Context"],
    icon: Sparkles,
  },
  {
    id: "valkyrie",
    code: "CARD 08",
    title: "Valkyrie",
    subtitle: "Research & Analysis • 38 Messages",
    src: "/images/mecha-card-v2.png",
    alt: "Valkyrie — Research & Analysis Memory Card",
    role: "Research & Analysis",
    tagline: "Academic paper breakdowns, synthesis, and citation trails.",
    accent: "#FFA500",
    turns: 38,
    lastUpdated: "1 day ago",
    tags: ["Research", "Synthesis", "Citations"],
    icon: BookOpen,
  },
];

const PRESETS: Array<{ id: FlexCarouselPreset; label: string }> = [
  { id: "liquid", label: "Liquid Lens" },
  { id: "ribbon", label: "Ribbon Flow" },
  { id: "vortex", label: "Vortex Bend" },
  { id: "arch", label: "Arch Prism" },
];

export default function CardCollectionSection() {
  const [activePreset, setActivePreset] = useState<FlexCarouselPreset>("liquid");
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCard = CARDS_DATA[activeIndex] || CARDS_DATA[0];
  const ActiveIcon = activeCard.icon;

  return (
    <section
      id="collection"
      className="relative w-full bg-[#000000] text-white overflow-hidden border-t border-white/[0.08] font-matrix select-none py-20 sm:py-28"
    >
      {/* Background CAD Grid (Pure Black, Zero BG Gradient) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0D0D0D] border border-white/[0.1] text-xs mb-4"
              style={{
                clipPath:
                  "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
              <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider font-semibold">
                Memory Card Showcase
              </span>
            </div>

            <ScrambledText
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12] font-orbitron"
              duration={1.2}
            >
              One memory card for every topic & companion.
            </ScrambledText>
            <ScrambledText
              as="p"
              className="text-sm text-neutral-400 mt-3 max-w-xl font-matrix"
              duration={1.4}
            >
              Encrypted neural cartridges that carry long-term companion context across any device, platform, or LLM runtime.
            </ScrambledText>
          </div>

          {/* Interactive Optical Lens Preset Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-matrix">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5500]" />
              <span className="uppercase text-[11px] tracking-wider text-neutral-400">Lens Preset:</span>
            </div>
            <div className="inline-flex p-1 bg-[#080808] border border-white/[0.1] gap-1">
              {PRESETS.map((p) => {
                const isCurrent = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p.id)}
                    className={`px-3 py-1.5 text-xs font-matrix transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? "bg-[#FF5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)] font-medium"
                        : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── React Bits WebGL FlexCarousel (Clean Drone UI) ── */}
        <div className="relative w-full border border-white/[0.12] bg-[#060606]/90 backdrop-blur-md overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Top Control Bar with Status & Interaction Tips */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
              <span className="font-matrix text-[11px] text-[#FF5500] tracking-wider uppercase font-semibold">
                Memory Card Collection
              </span>
              <AlienPixelGlyphs variant={4} />
            </div>

            <div className="flex items-center gap-3 text-neutral-400 text-xs font-matrix">
              <div className="hidden md:flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-[#FF5500]" />
                <span className="text-[11px] text-neutral-400">CLICK CARD TO EXPAND</span>
              </div>
              <span className="hidden md:inline-block text-neutral-600">|</span>
              <span className="text-[11px] text-neutral-400">DRAG OR SWIPE TO BROWSE</span>
            </div>
          </div>

          {/* FlexCarousel Canvas Container */}
          <div className="w-full relative" style={{ height: "560px" }}>
            <FlexCarousel
              items={CARDS_DATA}
              preset={activePreset}
              intro="rise"
              cardHeight={0.52}
              gap={14}
              radius={16}
              squeeze={0.2}
              focusOnClick={true}
              captions={true}
              captureWheel={false}
              onChange={(index) => setActiveIndex(index)}
            />
          </div>

          {/* Bottom Card Detail Telemetry HUD */}
          <div className="border-t border-white/[0.08] bg-[#080808] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Active Card Info */}
              <div className="flex items-start gap-4">
                <div
                  className="p-3 bg-white/[0.04] border border-white/[0.08] text-[#FF5500] shrink-0"
                  style={{
                    clipPath:
                      "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                  }}
                >
                  <ActiveIcon className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-matrix text-[11px] text-[#FF5500] font-semibold tracking-wider">
                      {activeCard.code}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-xs text-neutral-400 font-matrix">
                      {activeCard.turns} MESSAGES STORED
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-xs text-neutral-500 font-matrix uppercase">
                      UPDATED {activeCard.lastUpdated}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-orbitron tracking-tight mb-1">
                    {activeCard.title} — <span className="text-neutral-300 font-normal">{activeCard.role}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 font-matrix max-w-2xl">
                    {activeCard.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {activeCard.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-[10px] font-matrix text-neutral-300"
                        style={{
                          clipPath:
                            "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-matrix font-semibold transition-all shadow-[0_0_20px_rgba(255,85,0,0.35)] group"
                  style={{
                    clipPath:
                      "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
                  }}
                >
                  <span>OPEN IN STUDIO</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
