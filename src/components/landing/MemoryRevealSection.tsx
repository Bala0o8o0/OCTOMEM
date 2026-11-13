"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, HardDrive, Terminal, X, ShieldCheck } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";
import ShinyText from "@/components/ui/ShinyText";

export default function MemoryRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const artifactWrapperRef = useRef<HTMLDivElement>(null);
  const linesSvgRef = useRef<SVGSVGElement>(null);
  const labelConversationRef = useRef<HTMLDivElement>(null);
  const labelContextRef = useRef<HTMLDivElement>(null);
  const labelPngRef = useRef<HTMLDivElement>(null);

  // Inspection mode state for the memory artifact
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Framer Motion 3D Spring Tilt for the single memory card artifact
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apple-grade critically damped spring physics for tactile pointer feel
  const springConfig = { damping: 22, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, 90]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, 90]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // GSAP ScrollTrigger Sequence
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion: ensure all elements are immediately and fully visible
        gsap.set(
          [
            headlineRef.current,
            copyRef.current,
            artifactWrapperRef.current,
            linesSvgRef.current,
            labelConversationRef.current,
            labelContextRef.current,
            labelPngRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Initial GSAP setup (Outer wrappers only — never animating Framer Motion properties)
      gsap.set(headlineRef.current, { opacity: 0, y: 40 });
      gsap.set(copyRef.current, { opacity: 0, y: 25 });
      gsap.set(artifactWrapperRef.current, { opacity: 0, scale: 0.88, y: 45 });
      gsap.set(
        [
          labelConversationRef.current,
          labelContextRef.current,
          labelPngRef.current,
        ],
        { opacity: 0, y: 20, scale: 0.96 }
      );

      // SVG connecting lines stroke animation setup
      const paths = linesSvgRef.current?.querySelectorAll("path, polyline") || [];
      paths.forEach((path) => {
        const svgPath = path as SVGPathElement;
        const length = svgPath.getTotalLength ? svgPath.getTotalLength() : 300;
        gsap.set(svgPath, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      // Master Scroll-Driven Reveal Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      tl
        // 1. Reveal Headline
        .to(headlineRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        })
        // 2. Reveal Supporting Copy
        .to(
          copyRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5"
        )
        // 3. Bring the 3D Artwork Forward
        .to(
          artifactWrapperRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.4"
        )
        // 4. Reveal thin technical connecting lines
        .to(
          paths,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.inOut",
          },
          "-=0.6"
        )
        // 5. Reveal Callout Labels
        .to(
          [
            labelConversationRef.current,
            labelContextRef.current,
            labelPngRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="archive"
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 sm:py-32 md:py-36 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#000000] text-white flex flex-col items-center justify-center overflow-hidden border-b border-white/[0.08] selection:bg-[#8243D9] selection:text-white"
    >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ── ATMOSPHERIC PURE-BLACK BACKGROUND GRADIENTS & SUBSTRATE ──────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Subtle radial purple illumination bloom centered directly behind the memory card */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[340px] sm:w-[620px] md:w-[820px] h-[340px] sm:h-[620px] md:h-[820px] rounded-full bg-[radial-gradient(circle,rgba(130,67,217,0.18)_0%,rgba(72,17,191,0.06)_45%,transparent_75%)] blur-[90px]" />
      </div>

      {/* Technical Micro-Grid Substrate */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:36px_36px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── SECTION IDENTIFIER BADGE ─────────────────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 mb-6 sm:mb-8 shadow-[0_0_24px_rgba(130,67,217,0.2)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse shadow-[0_0_8px_#A855F7]" />
          <span className="font-bold tracking-[0.22em] uppercase text-[11px] text-neutral-200">
            03 · THE MEMORY REVEAL
          </span>
          <span className="text-white/20">|</span>
          <DecryptedText
            text="ISO/IEC 15948 ARTIFACT"
            className="text-[#C084FC] text-[11px] tracking-wider font-semibold"
            speed={30}
            animateOn="view"
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── OVERSIZED TYPOGRAPHIC COMPOSITION ────────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="text-center max-w-5xl mx-auto mb-10 sm:mb-14">
          <h2
            ref={headlineRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] font-black tracking-[-0.04em] leading-[0.92] uppercase font-sans select-none"
          >
            <span className="block text-white opacity-95">DON&apos;T JUST SAVE</span>
            <span className="block text-white/90">THE CHAT.</span>
            <span className="block mt-2 sm:mt-3">
              <ShinyText
                text="SAVE THE CONTEXT."
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] via-white to-[#A855F7] drop-shadow-[0_0_35px_rgba(168,85,247,0.45)]"
                shimmerColor="rgba(255, 255, 255, 0.95)"
                speed={3.6}
              />
            </span>
          </h2>

          {/* Supporting Copy */}
          <p
            ref={copyRef}
            className="text-sm sm:text-base md:text-lg text-neutral-400 font-sans max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed font-normal px-4"
          >
            “Preserve the important context from your AI conversation. Export it as a PNG memory card. Bring it back when you&apos;re ready to continue.”
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ── THE 3D PRODUCT ARTIFACT STAGE WITH TECHNICAL LABELS ──────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-2 sm:my-4">
          
          {/* GSAP Outer Wrapper (Handles scroll entrance: opacity, scale, translateY) */}
          <div
            ref={artifactWrapperRef}
            className="relative w-full flex items-center justify-center"
          >
            {/* SVG Connecting Lines Canvas (Visible on Tablet/Desktop) */}
            <svg
              ref={linesSvgRef}
              className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 1000 600"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="lineVioletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#8243D9" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Line 1: From Top-Left CONVERSATION to Top Horizon of Memory Card */}
              <polyline
                points="240,110 330,110 420,185"
                stroke="url(#lineVioletGrad)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <circle cx="420" cy="185" r="3.5" fill="#C084FC" />
              <circle cx="240" cy="110" r="3" fill="#8243D9" />

              {/* Line 2: From SAVED CONTEXT on Right to Internal Neural Stego Core */}
              <polyline
                points="760,250 670,250 580,295"
                stroke="url(#lineVioletGrad)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <circle cx="580" cy="295" r="4" fill="#C084FC" />
              <circle cx="760" cy="250" r="3" fill="#8243D9" />

              {/* Line 3: From Bottom-Left PORTABLE PNG to Machined Edge Connector */}
              <polyline
                points="250,460 340,460 440,395"
                stroke="url(#lineVioletGrad)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <circle cx="440" cy="395" r="3.5" fill="#C084FC" />
              <circle cx="250" cy="460" r="3" fill="#8243D9" />
            </svg>

            {/* ── DESKTOP ANNOTATION LABEL 1: CONVERSATION (Top-Left) ────────── */}
            <div
              ref={labelConversationRef}
              className="hidden md:flex absolute -left-2 lg:left-6 top-8 lg:top-12 z-20 flex-col items-start text-left max-w-[210px] bg-[#0A0A10]/85 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#A855F7] uppercase">
                  01 // INTAKE
                </span>
              </div>
              <span className="text-sm font-black font-sans tracking-wide text-white">
                CONVERSATION
              </span>
              <p className="text-[11px] text-neutral-400 font-sans mt-1 leading-snug">
                Volatile dialogue context and user intent distilled in client RAM.
              </p>
            </div>

            {/* ── DESKTOP ANNOTATION LABEL 2: SAVED CONTEXT (Center-Right) ────── */}
            <div
              ref={labelContextRef}
              className="hidden md:flex absolute -right-2 lg:right-6 top-48 lg:top-52 z-20 flex-col items-start text-left max-w-[230px] bg-[#0E0C18]/90 backdrop-blur-xl border border-[#8243D9]/40 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(130,67,217,0.22)]"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#C084FC] uppercase">
                    02 // NEURAL CORE
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#C084FC] bg-[#8243D9]/20 px-1.5 py-0.5 rounded border border-[#8243D9]/40">
                  AES-256-GCM
                </span>
              </div>
              <span className="text-sm font-black font-sans tracking-wide text-white flex items-center gap-1.5">
                SAVED CONTEXT
                <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              </span>
              <p className="text-[11px] text-neutral-300 font-sans mt-1 leading-snug">
                Deep cognitive state &amp; persona sealed in ISO ancillary chunks.
              </p>
            </div>

            {/* ── DESKTOP ANNOTATION LABEL 3: PORTABLE PNG (Bottom-Left) ──────── */}
            <div
              ref={labelPngRef}
              className="hidden md:flex absolute -left-2 lg:left-6 bottom-10 lg:bottom-16 z-20 flex-col items-start text-left max-w-[220px] bg-[#0A0A10]/85 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  03 // MEDIUM
                </span>
              </div>
              <span className="text-sm font-black font-sans tracking-wide text-white">
                PORTABLE PNG
              </span>
              <p className="text-[11px] text-neutral-400 font-sans mt-1 leading-snug">
                Standard ISO/IEC 15948 image file. Opens anywhere, zero cloud rent.
              </p>
            </div>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* ── MOTION FOR REACT: 3D SPRING TILT & SPECULAR GLARE ─────────── */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative cursor-pointer select-none group perspective-[1200px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setInspectMode((prev) => !prev);
              }}
            >
              {/* Outer machined metallic chassis container */}
              <div className="relative w-[300px] xs:w-[350px] sm:w-[460px] md:w-[540px] lg:w-[600px] aspect-square rounded-3xl p-1 sm:p-2 transition-transform duration-500 group-hover:scale-[1.015]">
                
                {/* 3D Realistic PNG Memory Card Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <Image
                    src="/assets/memory-card-artifact.png"
                    alt="OCTOMEM Sovereign Memory Card Artifact — Isolated 3D Machined Metal Physical Hardware Cartridge"
                    width={1024}
                    height={1024}
                    priority
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_60px_rgba(130,67,217,0.35)]"
                  />

                  {/* Dynamic Specular Lighting Glare that follows pointer coordinates */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
                    style={{
                      background: useTransform(
                        [glareX, glareY],
                        ([x, y]) =>
                          `radial-gradient(circle 320px at ${x}% ${y}%, rgba(255, 255, 255, 0.16) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 80%)`
                      ),
                    }}
                  />

                  {/* Interactive Inspect Payload Overlay (Tactile Click Toggle) */}
                  <AnimatePresence>
                    {inspectMode && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 font-mono text-left z-30 border border-white/10 rounded-2xl"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#A855F7]" />
                            <span className="text-xs font-bold text-white tracking-widest uppercase">
                              ISO/IEC 15948 TELEMETRY
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectMode(false);
                            }}
                            className="text-neutral-400 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2.5 text-xs text-neutral-300">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">FORMAT:</span>
                            <span className="text-white">Portable Network Graphics (.png)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">CHUNK IDENTIFIER:</span>
                            <span className="text-[#C084FC]">tEXt // chronocard_state</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">CIPHER ALGORITHM:</span>
                            <span className="text-white">AES-256-GCM (128-bit Auth Tag)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">KDF ITERATIONS:</span>
                            <span className="text-white">scrypt (N=32768, r=8, p=1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">CLOUD TELEMETRY:</span>
                            <span className="text-emerald-400 font-bold">ZERO // AIR-GAPPED RAM</span>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-neutral-400">
                          <span>Click to close telemetry</span>
                          <span className="text-[#A855F7] font-semibold">STUDIO READY</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tactile interaction prompt button */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#111118]/95 border border-white/15 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all group-hover:border-[#A855F7]/50 group-hover:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                  <span>{inspectMode ? "CLICK TO CLOSE TELEMETRY" : "CLICK ARTIFACT TO INSPECT STEGO CHUNK"}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── MOBILE ADAPTIVE LABELS (VISIBLE ON SCREENS < MD) ───────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div className="flex md:hidden flex-col sm:flex-row gap-3 w-full mt-10 px-2">
            {/* Mobile Label 1: CONVERSATION */}
            <div className="flex-1 bg-[#0A0A10]/90 border border-white/10 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#A855F7]">
                  01 // INTAKE
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">CONVERSATION</h4>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Volatile dialogue context distilled in client RAM.
              </p>
            </div>

            {/* Mobile Label 2: SAVED CONTEXT */}
            <div className="flex-1 bg-[#100D1C]/90 border border-[#8243D9]/40 rounded-xl p-4 text-left shadow-[0_4px_20px_rgba(130,67,217,0.15)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C084FC] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#C084FC]">
                  02 // NEURAL CORE
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                SAVED CONTEXT
                <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              </h4>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                AES-256-GCM encrypted state in ISO chunks.
              </p>
            </div>

            {/* Mobile Label 3: PORTABLE PNG */}
            <div className="flex-1 bg-[#0A0A10]/90 border border-white/10 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400">
                  03 // MEDIUM
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">PORTABLE PNG</h4>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Lossless ISO/IEC 15948 image file. Opens anywhere.
              </p>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── ACTION TELEMETRY CALLOUT ───────────────────────────────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#8243D9] to-[#6021C7] hover:from-[#9355E8] hover:to-[#7131D8] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(130,67,217,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] group"
            >
              <span>MOUNT ARTIFACT IN STUDIO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <span className="text-xs font-mono text-neutral-400 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>ZERO DATABASE // CLIENT-SIDE RUNTIME</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
