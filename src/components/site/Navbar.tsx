"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    // Track hero section visibility — hide navbar once user scrolls past 100vh
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setHeroVisible(scrollY < heroHeight - 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "HOW IT WORKS", href: "#how-it-works" },
    { label: "THE CARD", href: "#the-card" },
    { label: "SHOWCASE", href: "#collection" },
    { label: "PRICING", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "LOADER", href: "/loading-demo" },
  ];

  return (
    <AnimatePresence>
      {heroVisible && (
        <motion.header
          key="navbar"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div
            className={`w-full transition-all duration-300 ${
              scrolled
                ? "bg-[#000000]/90 backdrop-blur-xl border-b border-white/[0.08] py-2.5 sm:py-3 px-6 sm:px-10 lg:px-12 shadow-[0_12px_36px_rgba(0,0,0,0.85)]"
                : "bg-[#000000]/60 backdrop-blur-md py-2.5 sm:py-3 px-6 sm:px-10 lg:px-12 border-b border-white/[0.04]"
            }`}
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
              
              {/* ── Brand Logo: OCTOMEM ── */}
              <Link href="/" className="flex items-center gap-2.5 group select-none">
                <img
                  src="/octomem_logo.png"
                  alt="OCTOMEM Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain filter drop-shadow-[0_0_12px_rgba(255,85,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                />
                <span className="text-white font-medium text-base sm:text-lg tracking-wider font-orbitron">
                  OCTOMEM
                </span>
              </Link>

              {/* ── Desktop Navigation Links ── */}
              <div className="hidden lg:flex items-center gap-8 font-matrix">
                <nav className="flex items-center gap-6 text-[12px] tracking-widest text-neutral-400">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="hover:text-[#FF5500] transition-colors uppercase"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>

                {/* Launch Studio Action Link */}
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1.5 text-[12px] tracking-widest text-white hover:text-[#FF5500] uppercase transition-colors group"
                >
                  <span className="text-[#FF5500] transition-transform group-hover:translate-x-0.5">▸</span>
                  <span>LAUNCH STUDIO</span>
                </Link>
              </div>

              {/* ── Mobile Menu Trigger ── */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none"
                style={{
                  clipPath:
                    "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── Mobile Drawer ── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="lg:hidden mx-4 mt-2 p-6 bg-[#080808]/98 backdrop-blur-2xl border border-white/[0.12] shadow-2xl flex flex-col gap-4 font-mono text-xs"
                style={{
                  clipPath:
                    "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
                }}
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                  <img
                    src="/octomem_logo.png"
                    alt="OCTOMEM Logo"
                    className="w-6 h-6 object-contain filter drop-shadow-[0_0_8px_rgba(255,85,0,0.5)]"
                  />
                  <span className="font-orbitron text-sm font-semibold tracking-wider text-white">
                    OCTOMEM
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-neutral-300 hover:text-[#FF5500] transition-colors uppercase tracking-wider font-matrix"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-1 text-neutral-400 hover:text-white uppercase tracking-wider font-matrix"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href="/studio"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 bg-[#121212] border border-[#FF5500]/40 text-[#FF5500] text-center font-medium hover:bg-[#FF5500] hover:text-black transition-all flex items-center justify-center gap-2 font-matrix"
                    style={{
                      clipPath:
                        "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                    }}
                  >
                    <span>LAUNCH STUDIO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
