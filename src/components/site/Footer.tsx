"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#000000] text-white px-6 sm:px-10 lg:px-12 py-16 select-none font-matrix">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Brand identity */}
        <div className="flex flex-col gap-2 max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg
              className="w-5 h-5 text-[#FF5500] transform group-hover:rotate-45 transition-transform duration-300 shadow-[0_0_10px_#FF5500]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span className="font-semibold text-white text-base tracking-wider font-orbitron">
              OCTOMEM
            </span>
          </Link>
          <p className="text-xs text-neutral-400 font-matrix leading-relaxed">
            Portable AI conversation memory cards. Save your discussions directly into standard image files on your computer.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-neutral-400 uppercase tracking-wider">
          <a href="#how-it-works" className="hover:text-[#FF5500] transition-colors">
            How It Works
          </a>
          <a href="#the-card" className="hover:text-[#FF5500] transition-colors">
            The Card
          </a>
          <a href="#collection" className="hover:text-[#FF5500] transition-colors">
            Showcase
          </a>
          <a href="#pricing" className="hover:text-[#FF5500] transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[#FF5500] transition-colors">
            FAQ
          </a>
          <Link href="/studio" className="text-[#FF5500] hover:text-white transition-colors font-semibold">
            Launch Studio ↗
          </Link>
        </div>

      </div>

      {/* Bottom Subtext */}
      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral-500 gap-3">
        <span>STANDARD PNG FORMAT • 100% PRIVATE • ZERO CLOUD LOCK-IN</span>
        <span>© 2026 OCTOMEM. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
}
