"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  titleText?: string;
  subText?: string;
  accentColor?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
  className?: string;
}

export default function TiltedCard({
  imageSrc,
  altText = "Card",
  captionText = "",
  titleText = "",
  subText = "",
  accentColor = "#FF5500",
  containerHeight = "360px",
  containerWidth = "100%",
  rotateAmplitude = 10,
  scaleOnHover = 1.03,
  overlayContent,
  className = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]), {
    stiffness: 120,
    damping: 20,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);

    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none perspective-[1000px] cursor-pointer ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          // Sci-Fi Mecha Chamfered Cut Corners
          clipPath:
            "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{ duration: 0.25 }}
        className="relative w-full h-full overflow-hidden bg-[#07070A] border border-white/10 group shadow-[0_16px_40px_rgba(0,0,0,0.9)]"
      >
        {/* HUD Corner Ticks */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#FF5500]/70 z-30 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#FF5500]/70 z-30 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#FF5500]/70 z-30 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#FF5500]/70 z-30 pointer-events-none" />

        {/* Card Artwork Image */}
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Obsidian dark gradient overlay (Zero blue) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />
        </div>

        {/* ReactBits Dynamic Orange Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered ? 0.45 : 0,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 85, 0, 0.3), transparent 70%)`,
          }}
        />

        {/* Card HUD Overlay Details */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between z-20 pointer-events-none">
          {/* Top Tag */}
          <div className="flex items-center justify-between">
            <span className="font-matrix text-[10px] tracking-widest text-[#FF5500] uppercase bg-black/75 px-2.5 py-1 border border-[#FF5500]/30 backdrop-blur-md">
              {captionText || "MEMORY CARD"}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
          </div>

          {/* Bottom Info */}
          <div>
            {titleText && (
              <h4 className="text-lg font-bold text-white tracking-tight drop-shadow-md mb-1 font-orbitron">
                {titleText}
              </h4>
            )}
            {subText && (
              <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed font-matrix">
                {subText}
              </p>
            )}
            {overlayContent}
          </div>
        </div>
      </motion.div>
    </div>
  );
}