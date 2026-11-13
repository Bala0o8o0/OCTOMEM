"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function AlienPixelGlyphs({
  variant = 1,
  className = "",
}: {
  variant?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}) {
  // Authentic 4x4 Alien Pixel Matrix Runes
  const glyphsByVariant: Record<number, number[][][]> = {
    1: [
      [[1, 0, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 0, 1]],
      [[0, 1, 0, 1], [1, 1, 0, 0], [0, 0, 1, 1], [1, 0, 1, 0]],
      [[1, 1, 0, 1], [0, 0, 1, 0], [1, 0, 0, 1], [0, 1, 1, 1]],
    ],
    2: [
      [[1, 1, 0, 0], [0, 1, 0, 1], [1, 0, 1, 1], [0, 0, 1, 0]],
      [[0, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]],
      [[1, 0, 0, 1], [1, 1, 1, 0], [0, 1, 0, 1], [0, 0, 1, 1]],
    ],
    3: [
      [[0, 1, 1, 0], [1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 0, 1]],
      [[1, 0, 1, 1], [0, 1, 0, 0], [1, 0, 0, 1], [0, 1, 1, 0]],
      [[1, 1, 0, 1], [0, 0, 1, 1], [0, 1, 1, 0], [1, 0, 0, 1]],
    ],
    4: [
      [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 0, 1], [1, 0, 1, 1]],
      [[0, 1, 1, 1], [1, 0, 0, 0], [1, 1, 0, 1], [0, 0, 1, 1]],
      [[1, 1, 0, 0], [1, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1]],
    ],
    5: [
      [[1, 0, 1, 0], [1, 1, 0, 1], [0, 0, 1, 1], [1, 0, 0, 1]],
      [[0, 1, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [0, 1, 1, 1]],
      [[1, 1, 1, 0], [0, 1, 0, 1], [1, 0, 0, 1], [0, 0, 1, 1]],
    ],
  };

  const glyphs = glyphsByVariant[variant] || glyphsByVariant[1];

  return (
    <div
      className={`inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity select-none ${className}`}
      title="Decrypted memory steganography block"
    >
      <span className="w-1 h-1 bg-[#FF5500] rounded-full shadow-[0_0_6px_#FF5500]" />
      <div className="flex items-center gap-1">
        {glyphs.map((matrix, gIdx) => (
          <svg
            key={gIdx}
            width="10"
            height="10"
            viewBox="0 0 4 4"
            className="fill-neutral-400 hover:fill-neutral-200 transition-colors"
          >
            {matrix.map((row, rIdx) =>
              row.map((val, cIdx) =>
                val === 1 ? (
                  <rect
                    key={`${rIdx}-${cIdx}`}
                    x={cIdx}
                    y={rIdx}
                    width="0.85"
                    height="0.85"
                    rx="0.1"
                  />
                ) : null
              )
            )}
          </svg>
        ))}
      </div>
    </div>
  );
}

interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  showReticles?: boolean;
  showGlyphs?: boolean;
  glyphVariant?: 1 | 2 | 3 | 4 | 5;
}

export default function HolographicCard({
  children,
  className = "",
  hoverScale = 1.008,
  showReticles = true,
  showGlyphs = true,
  glyphVariant = 1,
  ...props
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 140,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 140,
    damping: 24,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);

    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-[1200px] select-none group"
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? hoverScale : 1,
        }}
        transition={{ duration: 0.22 }}
        className={`relative overflow-hidden bg-[#080808]/92 backdrop-blur-2xl border transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] ${
          isHovered
            ? "border-white/[0.22] shadow-[0_24px_60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.18)]"
            : "border-white/[0.09]"
        } ${className}`}
      >
        {/* Soft Specular Light Sheen Tracking Cursor (Warm Laser White & Amber, Zero Navy) */}
        <div
          className="pointer-events-none absolute -inset-[1px] transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? 0.35 : 0.05,
            background: `radial-gradient(380px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 120, 30, 0.28) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`,
          }}
        />

        {/* Minimal FUI Top Specular Bevel Line */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Clean Drone UI Precision Optical Corner Ticks */}
        {showReticles && (
          <>
            <div
              className={`absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-colors duration-200 z-30 pointer-events-none ${
                isHovered ? "border-[#FF5500]/80" : "border-white/30"
              }`}
            />
            <div
              className={`absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-colors duration-200 z-30 pointer-events-none ${
                isHovered ? "border-[#FF5500]/80" : "border-white/30"
              }`}
            />
            <div
              className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-colors duration-200 z-30 pointer-events-none ${
                isHovered ? "border-[#FF5500]/80" : "border-white/30"
              }`}
            />
            <div
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-colors duration-200 z-30 pointer-events-none ${
                isHovered ? "border-[#FF5500]/80" : "border-white/30"
              }`}
            />
          </>
        )}

        {/* Top-Right Cryptic Alien Pixel Glyphs */}
        {showGlyphs && (
          <div className="absolute top-3.5 right-4 z-30 pointer-events-none">
            <AlienPixelGlyphs variant={glyphVariant} />
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
