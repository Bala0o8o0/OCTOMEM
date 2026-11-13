"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerColor?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
  shimmerColor = "rgba(255, 255, 255, 0.85)",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`relative inline-block overflow-hidden ${
        disabled
          ? "text-neutral-300"
          : "bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 via-white to-neutral-400"
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? "none"
          : `linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, ${shimmerColor} 50%, rgba(255, 255, 255, 0.4) 100%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: disabled ? "inherit" : "transparent",
        animation: disabled ? "none" : `shinyTextSweep ${animationDuration} linear infinite`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shinyTextSweep {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </span>
  );
}
