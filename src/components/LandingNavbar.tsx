"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-3 sm:pt-4 pointer-events-auto transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Floating Futuristic Glass Navigation Dock */}
        <div
          className={`w-full flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-[#090814]/85 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(130,67,217,0.2)]"
              : "bg-[#090814]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* Brand Emblem & Identity */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            {/* Sentinel Core Icon */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#160e26] via-[#2d1254] to-[#8243D9] p-[1px] shadow-[0_0_15px_rgba(130,67,217,0.4)] group-hover:shadow-[0_0_22px_rgba(168,85,247,0.7)] transition-all duration-300">
              <div className="w-full h-full rounded-[7px] bg-[#0A0815] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse shadow-[0_0_8px_#A855F7]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-black tracking-tight text-sm sm:text-base font-sans">
                  OCTOMEM
                </span>
                <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">
                  Private Memory
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-300">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/studio"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Studio
            </Link>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Sign Up
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* System Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>100% Private</span>
            </div>

            <Link
              href="/studio"
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-[#8243D9]/50 hover:border-[#A855F7] shadow-[0_0_20px_rgba(130,67,217,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)]"
              style={{
                background: "linear-gradient(135deg, #1C1233 0%, #351366 50%, #1a0b36 100%)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC] group-hover:rotate-12 transition-transform" />
              <ShinyText text="Launch Studio" speed={3} className="font-sans font-bold" />
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="md:hidden max-w-sm mx-auto mt-2 p-5 rounded-3xl bg-[#090814]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-3 pointer-events-auto"
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/studio"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              Studio
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              Sign Up
            </Link>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/studio"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 rounded-full bg-gradient-to-r from-[#8243D9] to-[#5520D4] text-white text-xs font-semibold text-center shadow-lg"
              >
                Launch Studio
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
