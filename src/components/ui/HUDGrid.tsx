"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HUDGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Precision CAD Matrix Grid */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Floating Orange HUD Glow Nodes */}
      <div className="absolute top-1/4 left-1/3 w-[520px] h-[360px] bg-[#FF5500]/[0.035] rounded-full blur-[160px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[480px] h-[320px] bg-[#FF7700]/[0.03] rounded-full blur-[140px]" />

      {/* Subtle Horizontal HUD Scanline Animation */}
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="w-full h-32 bg-gradient-to-b from-transparent via-[#FF5500]/[0.015] to-transparent pointer-events-none opacity-60"
      />
    </div>
  );
}
