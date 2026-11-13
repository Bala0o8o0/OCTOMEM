"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import HolographicCard from "@/components/ui/HolographicCard";
import ScrambledText from "@/components/ui/ScrambledText";

interface Step {
  id: number;
  stepNum: string;
  title: string;
  tagline: string;
  description: string;
  specs: string[];
  image: string;
}

const steps: Step[] = [
  {
    id: 1,
    stepNum: "Step 01",
    title: "1. Talk Freely",
    tagline: "Chat naturally with your AI companion",
    description:
      "Have open conversations inside the Studio. Work through creative writing, design ideas, or project plans without worrying about losing your train of thought.",
    specs: ["No Cloud Logs", "Private in Browser", "Favorite AI Models"],
    image: "/images/workflow-step-1-icon.png",
  },
  {
    id: 2,
    stepNum: "Step 02",
    title: "2. Save to an Image",
    tagline: "Save the conversation into a standard picture file",
    description:
      "When you finish, click Save. OCTOMEM packs your conversation history and notes directly inside a standard image file that downloads to your computer.",
    specs: ["Standard PNG File", "Custom Cover Art", "Optional Password"],
    image: "/images/workflow-step-2-icon.png",
  },
  {
    id: 3,
    stepNum: "Step 03",
    title: "3. Drop in & Resume",
    tagline: "Pick up right where you left off anytime",
    description:
      "Whenever you want to continue, simply drop the image back into the Studio. Your conversation wakes up immediately, ready to keep talking.",
    specs: ["Offline Ready", "No Subscriptions", "Continue Instantly"],
    image: "/images/workflow-step-3-icon.png",
  },
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(1);
  const current = steps[activeStep - 1];

  return (
    <section
      id="how-it-works"
      className="py-28 sm:py-36 relative overflow-hidden bg-[#000000] text-white border-t border-white/[0.08] font-matrix select-none"
    >
      {/* Background CAD Grid (Pure Black, Zero BG Gradient) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Header (Clean, No '//') */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D0D0D] border border-white/[0.12] text-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
              <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider">
                Simple 3-Step Workflow
              </span>
            </div>

            <ScrambledText
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12] font-orbitron"
              duration={1.2}
            >
              Three simple steps to save your chat.
            </ScrambledText>
          </div>

          <ScrambledText
            as="p"
            className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl font-matrix"
            duration={1.4}
          >
            No complicated account setup or monthly subscriptions. Just straightforward software that turns your conversations into pictures you own.
          </ScrambledText>
        </div>

        {/* ── Step Switcher Row (Clean Drone Cards with Wireframe CAD Thumbnails) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((step) => {
            const isActive = activeStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`p-5 sm:p-6 text-left transition-all duration-300 relative border cursor-pointer backdrop-blur-xl ${
                  isActive
                    ? "bg-[#110E0C] border-[#FF5500]/60 shadow-[0_8px_24px_rgba(255,85,0,0.18)]"
                    : "bg-[#080808]/90 border-white/[0.08] hover:bg-[#101010] hover:border-white/[0.18]"
                }`}
              >
                {/* Active Top Glow Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeStepGlowOrange"
                    className="absolute -top-[1px] left-4 right-4 h-[2px] bg-[#FF5500] shadow-[0_0_10px_#FF5500]"
                  />
                )}

                {/* Drone UI Optical Corner Ticks */}
                <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${isActive ? "border-[#FF5500]" : "border-white/20"}`} />
                <span className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${isActive ? "border-[#FF5500]" : "border-white/20"}`} />
                <span className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${isActive ? "border-[#FF5500]" : "border-white/20"}`} />
                <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${isActive ? "border-[#FF5500]" : "border-white/20"}`} />

                <div className="flex items-center justify-between mb-3">
                  <span className="font-matrix text-[11px] text-[#FF5500] tracking-wider uppercase font-semibold">
                    {step.stepNum}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#FF5500] shadow-[0_0_8px_#FF5500]" : "bg-white/20"}`} />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 flex-shrink-0 bg-[#000000] border border-white/[0.12] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white tracking-tight mb-1 font-orbitron truncate">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-matrix">
                      {step.tagline}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active Step Interactive Graphic Stage (Holographic Card Box) ── */}
        <HolographicCard glyphVariant={4} className="p-8 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Detailed Step Explanation & Specs */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
                  <span className="font-matrix text-xs text-[#FF5500] tracking-widest uppercase font-semibold">
                    Stage 0{activeStep} of 03
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-3 font-orbitron">
                  {current.title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed mb-6 font-matrix">
                  {current.description}
                </p>

                {/* Human Specs Pills (Clean Drone UI) */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {current.specs.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-white/[0.04] border border-white/[0.09] text-[11px] font-matrix text-neutral-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Indicator Dots */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/[0.08]">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setActiveStep(num)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeStep === num ? "w-8 bg-[#FF5500] shadow-[0_0_8px_#FF5500]" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: High-End Sci-Fi Mecha CAD Blueprint Viewport */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="w-full relative bg-[#000000] border border-white/[0.12] overflow-hidden aspect-square max-w-[500px] mx-auto flex items-center justify-center p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                
                {/* Precision CAD Corner Reticles */}
                <span className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#FF5500] pointer-events-none z-20" />
                <span className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#FF5500] pointer-events-none z-20" />
                <span className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#FF5500] pointer-events-none z-20" />
                <span className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#FF5500] pointer-events-none z-20" />

                {/* Center CAD Crosshair Marker */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-20 flex items-center justify-center">
                  <div className="w-6 h-[1px] bg-white" />
                  <div className="h-6 w-[1px] bg-white absolute" />
                </div>

                {/* Single Centered 3D Wireframe Icon Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                      className="object-contain pointer-events-none select-none drop-shadow-[0_0_35px_rgba(255,85,0,0.18)]"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </HolographicCard>

      </div>
    </section>
  );
}
