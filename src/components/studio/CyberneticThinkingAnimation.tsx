"use client";

import React from "react";
import { motion } from "framer-motion";

interface CyberneticThinkingAnimationProps {
  className?: string;
}

/**
 * Cybernetic Thinking Animation for OCTOBOT
 * Sleek, text-less, high-tech animated state indicator inspired by ChatGPT & Claude,
 * styled to fit OCTOMEM's DroneOS cyber-physical aesthetic.
 */
export const CyberneticThinkingAnimation: React.FC<CyberneticThinkingAnimationProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-3.5 px-3.5 py-2.5 bg-[#080808]/95 border border-white/[0.12] shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,85,0,0.15)] backdrop-blur-xl relative overflow-hidden select-none ${className}`}
      aria-label="OCTOBOT is thinking"
    >
      {/* Top subtle specular edge */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/50 to-transparent" />

      {/* Sweeping laser shimmer beam */}
      <motion.div
        animate={{
          x: ["-100%", "250%"],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      {/* ── 1. The Luminous Quantum Core (Rotating Reticle + 4-Point Star) ── */}
      <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
        {/* Soft Radial Neon Aura Glow */}
        <motion.div
          animate={{
            scale: [1, 1.45, 1],
            opacity: [0.25, 0.75, 0.25],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-[#FF5500]/30 blur-sm pointer-events-none"
        />

        {/* Counter-Clockwise Outer Orbital Arc */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 border border-[#FF5500]/30 rounded-full border-t-[#FF5500] border-l-transparent pointer-events-none"
        />

        {/* Clockwise Dashed Telemetry Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0.5 border border-[#FF5500]/20 rounded-full border-b-[#FF5500] border-r-transparent pointer-events-none"
        />

        {/* Center Glowing Logo Insignia */}
        <motion.div
          animate={{
            scale: [0.85, 1.15, 0.85],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 relative z-10 flex items-center justify-center"
        >
          <img
            src="/octomem_logo.png"
            alt="OCTOBOT"
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_#FF5500]"
          />
        </motion.div>
      </div>

      {/* ── 2. Harmonic Waveform Frequency Nodes (5 fluid rhythmic bars) ── */}
      <div className="flex items-center gap-1.5 h-4 px-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            animate={{
              height: ["4px", "16px", "4px"],
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              duration: 1.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
            className="w-1 rounded-full bg-gradient-to-t from-[#FF5500]/40 via-[#FF5500] to-white shadow-[0_0_8px_#FF5500]"
          />
        ))}
      </div>

      {/* ── 3. Trailing Quantum Ember Dots ── */}
      <div className="flex items-center gap-1 shrink-0">
        <motion.span
          animate={{
            scale: [0.8, 1.25, 0.8],
            opacity: [0.3, 0.95, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_10px_#FF5500]"
        />
        <motion.span
          animate={{
            scale: [0.8, 1.25, 0.8],
            opacity: [0.3, 0.95, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.25,
          }}
          className="w-1 h-1 rounded-full bg-[#FF5500]/80 shadow-[0_0_8px_#FF5500]"
        />
      </div>
    </div>
  );
};
