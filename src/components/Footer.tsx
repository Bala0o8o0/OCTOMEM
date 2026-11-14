"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#000000] px-6 sm:px-12 py-10 mt-auto select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Identity & Protocol Spec */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/octomem_logo.png"
              alt="OCTOMEM Logo"
              className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-white text-sm tracking-wider font-mono">
              OCTOMEM
            </span>
          </Link>
          <span className="hidden sm:inline-block text-neutral-600">|</span>
          <span className="text-xs font-mono text-neutral-400">
            ISO/IEC 15948:2004 Conformance • AES-256-GCM Client Crypto
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/studio" className="hover:text-white transition-colors">
            Studio
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="hover:text-white transition-colors">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Micro-Telemetry Bottom Subtext */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-3 text-center sm:text-left">
        <span>ZERO CLOUD DATABASE • 100% CLIENT RAM PRIVACY • BUILT FOR SOVEREIGN AGENTS</span>
        <span>© 2026 OCTOMEM PROTOCOL. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
}
