"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

export default function KeepContextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Phase 1: Centered Editorial Hero
  const editorialHeroRef = useRef<HTMLDivElement>(null);

  // Phase 2: Centered Graphics & HUD
  const centerGraphicsRef = useRef<HTMLDivElement>(null);
  const telemetryHudRef = useRef<HTMLDivElement>(null);

  // SVG Layer References
  const upperShellRef = useRef<SVGGElement>(null);
  const internalLayerRef = useRef<SVGGElement>(null);
  const lowerShellRef = useRef<SVGGElement>(null);
  const constructionLinesRef = useRef<SVGGElement>(null);
  const fragmentsGroupRef = useRef<SVGGElement>(null);
  const whiteSilhouetteLinesRef = useRef<SVGGElement>(null);
  const orangeContourLinesRef = useRef<SVGGElement>(null);
  const lockFlashRef = useRef<SVGPolygonElement>(null);
  const siliconPulseRef = useRef<SVGCircleElement>(null);

  // Dynamic Telemetry State (Human-friendly story mapped directly to OCTOMEM image card)
  const [currentStep, setCurrentStep] = useState(1);
  const [telemetryState, setTelemetryState] = useState("01 // THE ANATOMY OF A MEMORY — Good ideas deserve to stay");

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // If user prefers reduced motion, display static assembled view without scroll trapping
    if (prefersReduced) {
      if (editorialHeroRef.current) gsap.set(editorialHeroRef.current, { opacity: 0, display: "none" });
      if (centerGraphicsRef.current) gsap.set(centerGraphicsRef.current, { opacity: 1, scale: 1 });
      if (whiteSilhouetteLinesRef.current) gsap.set(whiteSilhouetteLinesRef.current, { opacity: 1 });
      if (orangeContourLinesRef.current) gsap.set(orangeContourLinesRef.current, { opacity: 1 });
      if (upperShellRef.current) gsap.set(upperShellRef.current, { y: 0 });
      if (lowerShellRef.current) gsap.set(lowerShellRef.current, { y: 0, opacity: 1 });
      if (internalLayerRef.current) gsap.set(internalLayerRef.current, { opacity: 1 });
      if (lockFlashRef.current) gsap.set(lockFlashRef.current, { opacity: 0.35 });
      setTelemetryState("06 // PORTABLE MEMORY CARD SEALED — Drop into any LLM to resume instantly");
      return;
    }

    const ctx = gsap.context(() => {
      // Master Scroll-Linked Choreography Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3200",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.22) {
              setCurrentStep(1);
              setTelemetryState("01 // THE ANATOMY OF A MEMORY — Good ideas deserve to stay");
            } else if (p < 0.40) {
              setCurrentStep(2);
              setTelemetryState("02 // THE CARD FILE — A portable image holding your AI thinking");
            } else if (p < 0.54) {
              setCurrentStep(3);
              setTelemetryState("03 // METADATA BLUEPRINT — Encoded schema ready for any LLM");
            } else if (p < 0.72) {
              setCurrentStep(4);
              setTelemetryState("04 // 3-LAYER CARD DECONSTRUCTION — Image on the outside, conversation inside");
            } else if (p < 0.88) {
              setCurrentStep(5);
              setTelemetryState("05 // CONTEXT INGESTION — Dialogue & prompts embedded into the image");
            } else {
              setCurrentStep(6);
              setTelemetryState("06 // PORTABLE MEMORY CARD SEALED — Drop into any LLM to resume instantly");
            }
          },
        },
      });

      // ── Initial State Setup ──
      // Silhouette paths
      const whitePaths = whiteSilhouetteLinesRef.current?.querySelectorAll("path, polygon, polyline");
      if (whitePaths) {
        gsap.set(whitePaths, { strokeDasharray: 1400, strokeDashoffset: 1400, opacity: 0.2 });
      }

      // Orange contour paths
      const orangePaths = orangeContourLinesRef.current?.querySelectorAll("path, polygon, polyline, line");
      if (orangePaths) {
        gsap.set(orangePaths, { strokeDasharray: 900, strokeDashoffset: 900, opacity: 0 });
      }

      // Editorial hero starts visible in center
      gsap.set(editorialHeroRef.current, { opacity: 1, y: 0, scale: 1 });

      // Center graphics container starts completely hidden
      gsap.set(centerGraphicsRef.current, { scale: 0.92, opacity: 0 });
      gsap.set(telemetryHudRef.current, { opacity: 0, y: -12 });

      // Assembled geometry: internal layers and lower tray start hidden so NO duplicate ghost card exists
      gsap.set(upperShellRef.current, { y: 0 });
      gsap.set(lowerShellRef.current, { y: 0, opacity: 0 });
      gsap.set(internalLayerRef.current, { opacity: 0 });
      gsap.set(constructionLinesRef.current, { opacity: 0, scaleY: 0, transformOrigin: "500px 400px" });

      // Fragments
      const fragments = fragmentsGroupRef.current?.querySelectorAll(".convo-fragment");
      if (fragments) {
        gsap.set(fragments, { opacity: 0, scale: 1 });
      }

      // Silicon pulse & Lock Flash
      gsap.set(siliconPulseRef.current, { attr: { r: 16 }, opacity: 0 });
      gsap.set(lockFlashRef.current, { opacity: 0 });

      // ══════════════════════════════════════════════════════════════
      // TIMELINE STEP 1: CENTERED EDITORIAL HERO HIDES ON SCROLL
      // ══════════════════════════════════════════════════════════════
      tl.to(
        editorialHeroRef.current,
        {
          opacity: 0,
          y: -45,
          scale: 0.96,
          duration: 1.6,
          ease: "power2.inOut",
        },
        0.5
      );

      // ══════════════════════════════════════════════════════════════
      // TIMELINE STEP 2: CENTER GRAPHICS ENTERS ("THEN AT LAST THE GRAPHICS")
      // Silhouette wireframe drawing from scratch (Single clean CAD unit)
      // ══════════════════════════════════════════════════════════════
      tl.to(
        centerGraphicsRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        1.7
      );

      tl.to(
        telemetryHudRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power1.out",
        },
        1.9
      );

      if (whitePaths) {
        tl.to(
          whitePaths,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 2.2,
            ease: "power2.inOut",
            stagger: 0.08,
          },
          1.9
        );
      }

      // ══════════════════════════════════════════════════════════════
      // TIMELINE STEP 3: ORANGE CONTOUR TRACING
      // ══════════════════════════════════════════════════════════════
      if (orangePaths) {
        tl.to(
          orangePaths,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.8,
            ease: "power2.out",
            stagger: 0.06,
          },
          3.8
        );
      }

      // ══════════════════════════════════════════════════════════════
      // TIMELINE STEP 4: VERTICAL AXIS SEPARATION (EXPLODED TEARDOWN)
      // Upper Shell UP (-140px), Lower Shell DOWN (+140px), Core CENTER
      // ══════════════════════════════════════════════════════════════
      tl.to(
        upperShellRef.current,
        {
          y: -140,
          duration: 2.4,
          ease: "power2.out",
        },
        5.6
      );

      tl.to(
        lowerShellRef.current,
        {
          y: 140,
          opacity: 1,
          duration: 2.4,
          ease: "power2.out",
        },
        5.6
      );

      tl.to(
        internalLayerRef.current,
        {
          opacity: 1,
          duration: 2.0,
          ease: "power1.out",
        },
        5.8
      );

      tl.to(
        constructionLinesRef.current,
        {
          opacity: 1,
          scaleY: 1,
          duration: 2.0,
          ease: "power2.out",
        },
        5.8
      );

      // ══════════════════════════════════════════════════════════════
      // TIMELINE STEP 5: SAVING CONTEXT (CONVERSATION FRAGMENTS FLY IN)
      // ══════════════════════════════════════════════════════════════
      if (fragments && fragments.length >= 4) {
        // Fragment 1 (from left)
        tl.fromTo(
          fragments[0],
          { x: -200, y: -40, opacity: 0, scale: 1 },
          { x: 90, y: 10, opacity: 1, duration: 1.4, ease: "power1.out" },
          7.8
        ).to(
          fragments[0],
          { x: 260, y: 40, opacity: 0, scale: 0.55, duration: 0.9, ease: "power2.in" },
          9.0
        );

        // Fragment 2 (from right)
        tl.fromTo(
          fragments[1],
          { x: 200, y: -30, opacity: 0, scale: 1 },
          { x: -80, y: 15, opacity: 1, duration: 1.4, ease: "power1.out" },
          8.2
        ).to(
          fragments[1],
          { x: -240, y: 35, opacity: 0, scale: 0.55, duration: 0.9, ease: "power2.in" },
          9.4
        );

        // Fragment 3 (from left)
        tl.fromTo(
          fragments[2],
          { x: -200, y: 30, opacity: 0, scale: 1 },
          { x: 85, y: -10, opacity: 1, duration: 1.4, ease: "power1.out" },
          8.6
        ).to(
          fragments[2],
          { x: 250, y: -30, opacity: 0, scale: 0.55, duration: 0.9, ease: "power2.in" },
          9.8
        );

        // Fragment 4 (from right)
        tl.fromTo(
          fragments[3],
          { x: 210, y: 40, opacity: 0, scale: 1 },
          { x: -90, y: -5, opacity: 1, duration: 1.4, ease: "power1.out" },
          9.0
        ).to(
          fragments[3],
          { x: -250, y: -25, opacity: 0, scale: 0.55, duration: 0.9, ease: "power2.in" },
          10.2
        );
      }

      // Silicon pulse ripple during conversation ingestion (animates radius directly)
      tl.to(
        siliconPulseRef.current,
        {
          attr: { r: 52 },
          opacity: 0.95,
          duration: 1.0,
          repeat: 2,
          yoyo: true,
          ease: "power2.out",
        },
        8.6
      );

      // ══════════════════════════════════════════════════════════════
      // TIMELINE STEP 6: COMPONENTS SNAP TO ALIGNMENT & SOLID STATE LOCK
      // ══════════════════════════════════════════════════════════════
      tl.to(
        constructionLinesRef.current,
        {
          opacity: 0,
          scaleY: 0,
          duration: 1.6,
          ease: "power2.inOut",
        },
        10.6
      );

      tl.to(
        upperShellRef.current,
        {
          y: 0,
          duration: 2.0,
          ease: "power2.inOut",
        },
        10.8
      );

      tl.to(
        lowerShellRef.current,
        {
          y: 0,
          opacity: 0,
          duration: 2.0,
          ease: "power2.inOut",
        },
        10.8
      );

      tl.to(
        internalLayerRef.current,
        {
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut",
        },
        10.8
      );

      // Final lock outline flash
      tl.to(
        lockFlashRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power1.out",
        },
        12.6
      ).to(
        lockFlashRef.current,
        {
          opacity: 0.35,
          duration: 0.8,
          ease: "power2.out",
        },
        13.0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="anatomy"
      className="relative w-full h-screen bg-[#000000] text-white overflow-hidden select-none border-t border-white/[0.06]"
      aria-label="The Anatomy of a Memory"
    >
      {/* ── Background Precision CAD Blueprint Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />

      {/* Subtle CAD Crosshair Watermarks */}
      <div className="absolute top-14 left-8 sm:left-12 font-mono text-[9px] text-[#444444] pointer-events-none hidden md:block">
        [OCTOMEM // CARD-SCHEMA: PORTABLE-CONTEXT // FORMAT: .PNG]
      </div>
      <div className="absolute top-14 right-8 sm:right-12 font-mono text-[9px] text-[#444444] pointer-events-none hidden md:block">
        METADATA: ISO/IEC 15948 PNG • OFFLINE CONTEXT
      </div>

      {/* ── Main Pinned Stage Container ── */}
      <div
        ref={stageRef}
        className="w-full h-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10 flex flex-col justify-between"
      >
        {/* ═══════════════════════════════════════════════════════════
            PHASE 1: CENTERED EDITORIAL HERO (SHOWN FIRST IN CENTER, HIDES ON SCROLL)
           ═══════════════════════════════════════════════════════════ */}
        <div
          ref={editorialHeroRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 sm:px-12 max-w-4xl mx-auto pointer-events-none"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#0A0A0C] border border-white/[0.12] mb-6 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7438] animate-pulse shadow-[0_0_10px_#FF7438]" />
            <span className="font-matrix text-[#AAAAAA] uppercase text-[11px] tracking-[0.25em]">
              THE ANATOMY OF A MEMORY
            </span>
          </div>

          {/* Centered Heading */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.08] mb-6 font-sans">
            Good ideas <br />
            <span className="font-normal text-white">deserve to stay.</span>
          </h2>

          <div className="w-16 h-[2px] bg-[#FF7438] mb-6" />

          {/* Centered Human-Friendly Description */}
          <p className="text-base sm:text-lg lg:text-xl text-[#999999] font-light leading-relaxed max-w-2xl font-sans mb-8">
            Most AI conversations vanish the moment you close the tab. OCTOMEM turns your best chats into a portable PNG memory card that belongs to you forever—an image on the outside, your conversation inside.
          </p>

          {/* Scroll Prompt */}
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#FF7438] tracking-[0.2em] uppercase animate-pulse">
            <span>↓ SCROLL TO EXPLORE THE MEMORY CARD</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            PHASE 2: CENTER GRAPHICS (DEAD CENTER IN THE VIEWPORT)
            Appears after text hides on scroll; Human-friendly CAD labels
           ═══════════════════════════════════════════════════════════ */}
        <div
          ref={centerGraphicsRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          {/* Top Story HUD Telemetry Bar (Clear, user-understandable status) */}
          <div
            ref={telemetryHudRef}
            className="absolute top-16 sm:top-20 z-20 flex items-center gap-3 bg-[#0A0A0C]/90 border border-white/[0.12] px-4 py-1.5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF7438] animate-pulse shadow-[0_0_8px_#FF7438]" />
            <span className="font-mono text-[10.5px] text-[#CCCCCC] tracking-wider uppercase">
              {telemetryState}
            </span>
            <div className="w-px h-3 bg-white/[0.15]" />
            <span className="font-mono text-[10px] text-[#FF7438]">
              STEP {currentStep} / 06
            </span>
          </div>

          {/* Precision SVG Canvas (Centered, 1000 x 800) */}
          <svg
            className="w-full h-full max-w-[900px] max-h-[480px] sm:max-h-[520px] lg:max-h-[580px] overflow-visible drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            viewBox="0 0 1000 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Silicon Core Glow Filter */}
              <filter id="siliconGlowCentered" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Orange Contour Edge Shadow */}
              <filter id="orangeEdgeGlowCentered" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF7438" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* ──────────────────────────────────────────────────────────
                A. CONSTRUCTION LINES & CLEAR EXPLODED-VIEW LABELS (STEP 4)
               ────────────────────────────────────────────────────────── */}
            <g ref={constructionLinesRef} className="pointer-events-none">
              {/* Corner 0 vertical projection line */}
              <line x1="456.7" y1="120.5" x2="456.7" y2="400.5" stroke="#777777" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              
              {/* Corner 1 vertical projection line */}
              <line x1="231.5" y1="237.5" x2="231.5" y2="517.5" stroke="#777777" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              
              {/* Corner 2 vertical projection line */}
              <line x1="543.3" y1="399.5" x2="543.3" y2="705.5" stroke="#777777" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              
              {/* Corner 3 vertical projection line */}
              <line x1="720.8" y1="307.2" x2="720.8" y2="613.2" stroke="#777777" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              
              {/* Corner 4 chamfer vertical projection line */}
              <line x1="720.8" y1="257.8" x2="720.8" y2="563.8" stroke="#777777" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

              {/* Card Deconstruction Indicator on Left */}
              <line x1="175.0" y1="237.5" x2="175.0" y2="517.5" stroke="#FF7438" strokeWidth="1" strokeOpacity="0.75" />
              <line x1="167.0" y1="237.5" x2="183.0" y2="237.5" stroke="#FF7438" strokeWidth="1" />
              <line x1="167.0" y1="377.5" x2="183.0" y2="377.5" stroke="#FF7438" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="167.0" y1="517.5" x2="183.0" y2="517.5" stroke="#FF7438" strokeWidth="1" />
              
              <text x="163" y="381" fill="#FF7438" fontSize="10" fontFamily="monospace" textAnchor="end" letterSpacing="0.1em">
                CARD DECONSTRUCTION
              </text>

              {/* 3 Real Product Component Leaders */}
              <g>
                {/* 1. Upper Visual Layer Leader */}
                <line x1="456.7" y1="120.5" x2="310" y2="90" stroke="#777777" strokeWidth="0.9" strokeDasharray="3 3" />
                <circle cx="456.7" cy="120.5" r="3" fill="#FF7438" />
                <text x="300" y="86" textAnchor="end" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily="sans-serif">
                  01 // VISUAL COVER ARTWORK
                </text>
                <text x="300" y="99" textAnchor="end" fill="#888888" fontSize="9.5" fontFamily="sans-serif">
                  Front-facing image you can preview &amp; share anywhere
                </text>

                {/* 2. Embedded Context Core Leader */}
                <line x1="558.9" y1="400.0" x2="750" y2="400.0" stroke="#777777" strokeWidth="0.9" strokeDasharray="3 3" />
                <circle cx="558.9" cy="400.0" r="3" fill="#FF7438" />
                <text x="760" y="396" fill="#FF7438" fontSize="11" fontWeight="500" fontFamily="sans-serif">
                  02 // EMBEDDED CONTEXT DATA
                </text>
                <text x="760" y="409" fill="#888888" fontSize="9.5" fontFamily="sans-serif">
                  Full chat logs, prompt history &amp; model parameters inside
                </text>

                {/* 3. Drag & Drop Interface Base Leader */}
                <line x1="543.3" y1="705.5" x2="750" y2="730" stroke="#777777" strokeWidth="0.9" strokeDasharray="3 3" />
                <circle cx="543.3" cy="705.5" r="3" fill="#FF7438" />
                <text x="760" y="726" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily="sans-serif">
                  03 // DRAG &amp; DROP RELOAD
                </text>
                <text x="760" y="739" fill="#888888" fontSize="9.5" fontFamily="sans-serif">
                  Drop into ChatGPT, Claude, or local AI to resume
                </text>
              </g>
            </g>

            {/* ──────────────────────────────────────────────────────────
                B. LOWER SHELL (BASE TRAY & 8-PIN GOLD INTERFACE)
                Fades in and separates downward (+140px) only during Stage 4
               ────────────────────────────────────────────────────────── */}
            <g ref={lowerShellRef} id="svg-lower-shell">
              {/* Base Tray Floor Silhouette */}
              <polygon
                points="456.7,286.5 231.5,403.5 543.3,565.5 720.8,473.2 720.8,423.8"
                fill="rgba(8, 8, 10, 0.95)"
                stroke="#444444"
                strokeWidth="0.9"
              />

              {/* Base Tray Front-Left Wall */}
              <polygon
                points="231.5,377.5 543.3,539.5 543.3,565.5 231.5,403.5"
                fill="#0D0E12"
                stroke="#666666"
                strokeWidth="0.9"
              />

              {/* Base Tray Front-Right Wall */}
              <polygon
                points="543.3,539.5 720.8,447.2 720.8,473.2 543.3,565.5"
                fill="#090A0D"
                stroke="#666666"
                strokeWidth="0.9"
              />

              {/* Chamfer Side Wall */}
              <polygon
                points="720.8,447.2 720.8,397.8 720.8,423.8 720.8,473.2"
                fill="#060709"
                stroke="#666666"
                strokeWidth="0.9"
              />

              {/* 8 Gold Contact Interface Pins (Arrayed along Front-Right Edge) */}
              <g id="gold-pins-array">
                <polygon points="546.6,537.8 562.2,529.7 544.8,520.7 529.3,528.8" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="568.8,526.2 584.4,518.2 567.0,509.2 551.5,517.2" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="591.0,514.7 606.5,506.6 589.2,497.6 573.7,505.7" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="613.2,503.2 628.7,495.1 611.4,486.1 595.9,494.2" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="635.4,491.6 650.9,483.6 633.6,474.6 618.1,482.6" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="657.6,480.1 673.1,472.0 655.8,463.0 640.3,471.1" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="679.8,468.6 695.3,460.5 678.0,451.5 662.5,459.6" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
                <polygon points="702.0,457.1 717.5,449.0 700.2,440.0 684.6,448.1" fill="#FFA000" fillOpacity="0.45" stroke="#FF7438" strokeWidth="0.9" />
              </g>

              {/* Base Tray Guide Ribs */}
              <line x1="280" y1="380" x2="490" y2="490" stroke="#444444" strokeWidth="0.7" strokeDasharray="3 3" />
              <line x1="330" y1="355" x2="540" y2="465" stroke="#444444" strokeWidth="0.7" strokeDasharray="3 3" />
              <line x1="380" y1="330" x2="590" y2="440" stroke="#444444" strokeWidth="0.7" strokeDasharray="3 3" />

              {/* Base Lower Orange Contour Lip */}
              <polyline
                points="231.5,403.5 543.3,565.5 720.8,473.2"
                fill="none"
                stroke="#FF7438"
                strokeWidth="1.2"
                filter="url(#orangeEdgeGlowCentered)"
              />
            </g>

            {/* ──────────────────────────────────────────────────────────
                C. INTERNAL LAYER (COGNITIVE SUBSTRATE & SILICON DIE)
                Remains centered at Y=0, revealed only during Stage 4
               ────────────────────────────────────────────────────────── */}
            <g ref={internalLayerRef} id="svg-internal-layer">
              {/* PCB Substrate Plane */}
              <polygon
                points="456.7,268.5 241.5,381.5 536.3,534.5 707.8,444.2 707.8,401.8"
                fill="#0B0E11"
                stroke="#555555"
                strokeWidth="0.8"
              />

              {/* Circuit Bus Lines (45-degree CAD routing) */}
              <g stroke="#888888" strokeWidth="0.7" strokeOpacity="0.6">
                <path d="M 500 430 L 500 460 L 555 490 L 555 520" fill="none" />
                <path d="M 515 425 L 525 455 L 575 480 L 575 510" fill="none" />
                <path d="M 530 415 L 545 440 L 595 470 L 595 500" fill="none" />
                <path d="M 545 405 L 565 430 L 615 460 L 615 485" fill="none" />
                <path d="M 441 400 L 400 380 L 400 350" fill="none" />
                <path d="M 450 390 L 420 370 L 420 340" fill="none" />
                <path d="M 460 380 L 440 360 L 440 330" fill="none" />
                <path d="M 500 369 L 500 335 L 540 315 L 575 315" fill="none" />
                <path d="M 515 375 L 525 345 L 555 325" fill="none" />
              </g>

              {/* Solder Micro-Vias */}
              <g fill="#FF7438" fillOpacity="0.8">
                <circle cx="500" cy="460" r="1.5" />
                <circle cx="525" cy="455" r="1.5" />
                <circle cx="545" cy="440" r="1.5" />
                <circle cx="565" cy="430" r="1.5" />
                <circle cx="400" cy="380" r="1.5" />
                <circle cx="420" cy="370" r="1.5" />
                <circle cx="500" cy="335" r="1.5" />
                <circle cx="525" cy="345" r="1.5" />
              </g>

              {/* Chat Payload Package */}
              <polygon
                points="575,380 545,395 595,420 625,405"
                fill="#12161B"
                stroke="#777777"
                strokeWidth="0.8"
              />
              <text x="585" y="403" fill="#888888" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
                CHAT-PAYLOAD
              </text>

              {/* Prompt Metadata Package */}
              <polygon
                points="415,370 390,385 425,405 450,390"
                fill="#101418"
                stroke="#777777"
                strokeWidth="0.8"
              />
              <text x="420" y="390" fill="#888888" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
                PROMPT-DATA
              </text>

              {/* Central Context Die (OCTOMEM EMBEDDED CORE) */}
              <polygon
                points="500.0,369.4 441.1,400.0 500.0,430.6 558.9,400.0"
                fill="#151A22"
                stroke="#FF7438"
                strokeWidth="1.6"
                filter="url(#orangeEdgeGlowCentered)"
              />

              {/* Silicon Core Inner Die Mesh */}
              <polygon
                points="500.0,380.0 460.0,400.0 500.0,420.0 540.0,400.0"
                fill="#1B222C"
                stroke="#D0D0D0"
                strokeWidth="0.8"
              />

              {/* Central Micro-Core Node */}
              <circle
                cx="500.0"
                cy="400.0"
                r="6"
                fill="#FF7438"
                stroke="#FFFFFF"
                strokeWidth="1"
                filter="url(#siliconGlowCentered)"
              />

              {/* Pulsing Energy Ring (Fires when fragments absorb) */}
              <circle
                ref={siliconPulseRef}
                cx="500.0"
                cy="400.0"
                r="16"
                fill="none"
                stroke="#FF7438"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0"
              />

              {/* Core Label */}
              <text x="500" y="394" fill="#FFFFFF" fontSize="8" fontFamily="sans-serif" fontWeight="500" textAnchor="middle" letterSpacing="0.08em">
                CONTEXT-CORE
              </text>
            </g>

            {/* ──────────────────────────────────────────────────────────
                D. UPPER SHELL (TOP HOUSING & TITANIUM BEZEL)
                Translates -140px upward along Y axis during separation
               ────────────────────────────────────────────────────────── */}
            <g ref={upperShellRef} id="svg-upper-shell">
              {/* Upper Shell Extrusion Side Wall (Front-Left) */}
              <polygon
                points="231.5,377.5 543.3,539.5 543.3,519.5 231.5,357.5"
                fill="#111216"
                stroke="#555555"
                strokeWidth="0.8"
              />

              {/* Upper Shell Extrusion Side Wall (Front-Right) */}
              <polygon
                points="543.3,539.5 720.8,447.2 720.8,427.2 543.3,519.5"
                fill="#0D0E12"
                stroke="#555555"
                strokeWidth="0.8"
              />

              {/* Upper Shell Chamfer Face Wall */}
              <polygon
                points="720.8,447.2 720.8,397.8 720.8,377.8 720.8,427.2"
                fill="#090A0E"
                stroke="#555555"
                strokeWidth="0.8"
              />

              {/* Upper Shell Top Face Outer Perimeter */}
              <polygon
                points="456.7,260.5 231.5,377.5 543.3,539.5 720.8,447.2 720.8,397.8"
                fill="rgba(10, 11, 15, 0.95)"
                stroke="#E0E0E0"
                strokeWidth="1.2"
              />

              {/* Upper Shell Inner Beveled Rim */}
              <polygon
                points="456.7,274.9 259.3,377.5 543.3,525.1 701.4,442.9 701.4,402.1"
                fill="rgba(14, 16, 22, 0.85)"
                stroke="#777777"
                strokeWidth="0.8"
              />

              {/* ── Triangulated CAD Wireframe Polygon Mesh Lines ── */}
              <g id="triangulated-mesh-facets">
                <line x1="456.7" y1="260.5" x2="423.8" y2="292.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="456.7" y1="274.9" x2="419.2" y2="280.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="419.2" y1="280.0" x2="390.9" y2="309.1" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="423.8" y1="292.0" x2="381.6" y2="299.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="381.6" y1="299.5" x2="358.0" y2="326.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="390.9" y1="309.1" x2="344.1" y2="319.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="344.1" y1="319.0" x2="325.1" y2="343.3" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="358.0" y1="326.2" x2="306.6" y2="338.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="306.6" y1="338.5" x2="292.2" y2="360.4" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="325.1" y1="343.3" x2="269.1" y2="358.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="269.1" y1="358.0" x2="259.3" y2="377.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="292.2" y1="360.4" x2="231.5" y2="377.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="231.5" y1="377.5" x2="294.8" y2="395.9" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="259.3" y1="377.5" x2="270.5" y2="397.8" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="270.5" y1="397.8" x2="330.3" y2="414.4" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="294.8" y1="395.9" x2="309.5" y2="418.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="309.5" y1="418.0" x2="365.8" y2="432.9" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="330.3" y1="414.4" x2="348.5" y2="438.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="348.5" y1="438.2" x2="401.3" y2="451.3" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="365.8" y1="432.9" x2="387.4" y2="458.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="387.4" y1="458.5" x2="436.8" y2="469.8" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="401.3" y1="451.3" x2="426.4" y2="478.8" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="426.4" y1="478.8" x2="472.3" y2="488.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="436.8" y1="469.8" x2="465.4" y2="499.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="465.4" y1="499.0" x2="507.8" y2="506.7" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="472.3" y1="488.2" x2="504.3" y2="519.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="504.3" y1="519.2" x2="543.3" y2="525.1" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="507.8" y1="506.7" x2="543.3" y2="539.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="543.3" y1="539.5" x2="574.9" y2="508.7" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="543.3" y1="525.1" x2="578.8" y2="521.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="578.8" y1="521.0" x2="606.5" y2="477.8" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="574.9" y1="508.7" x2="614.4" y2="502.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="614.4" y1="502.5" x2="638.1" y2="447.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="606.5" y1="477.8" x2="650.0" y2="484.0" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="650.0" y1="484.0" x2="669.7" y2="416.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="638.1" y1="447.0" x2="685.5" y2="465.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="685.5" y1="465.5" x2="701.4" y2="442.9" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="669.7" y1="416.2" x2="720.8" y2="447.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="720.8" y1="447.2" x2="701.4" y2="422.5" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="701.4" y1="442.9" x2="720.8" y2="430.7" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="720.8" y1="430.7" x2="701.4" y2="402.1" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="701.4" y1="422.5" x2="720.8" y2="414.2" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="720.8" y1="414.2" x2="701.4" y2="402.1" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="701.4" y1="402.1" x2="720.8" y2="397.8" stroke="#555555" strokeWidth="0.8" strokeOpacity="0.5" />
              </g>

              {/* 3 Precision Heat Dissipation Vents */}
              <g stroke="#FF7438" strokeWidth="0.9" fill="rgba(255, 116, 56, 0.18)">
                <polygon points="487.0,357.2 417.7,393.2 426.4,397.8 495.7,361.8" />
                <polygon points="507.8,368.1 438.5,404.1 447.2,408.6 516.5,372.6" />
                <polygon points="528.6,378.9 459.3,414.9 468.0,419.4 537.2,383.4" />
              </g>
            </g>

            {/* ──────────────────────────────────────────────────────────
                E. PROGRESSIVE WHITE SILHOUETTE DRAWING LINES (STEP 1)
               ────────────────────────────────────────────────────────── */}
            <g ref={whiteSilhouetteLinesRef} className="pointer-events-none">
              <polygon
                points="456.7,260.5 231.5,377.5 543.3,539.5 720.8,447.2 720.8,397.8"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <polyline
                points="231.5,377.5 543.3,539.5 720.8,447.2"
                fill="none"
                stroke="#E0E0E0"
                strokeWidth="1.2"
              />
            </g>

            {/* ──────────────────────────────────────────────────────────
                F. PROGRESSIVE ORANGE CONTOUR TRACING LINES (STEP 2)
               ────────────────────────────────────────────────────────── */}
            <g ref={orangeContourLinesRef} className="pointer-events-none">
              {/* 45° Chamfered Facet Highlight */}
              <line
                x1="720.8"
                y1="447.2"
                x2="720.8"
                y2="397.8"
                stroke="#FF7438"
                strokeWidth="2.2"
                filter="url(#orangeEdgeGlowCentered)"
              />

              {/* Lower Perimeter Bevel Accent */}
              <polyline
                points="231.5,377.5 543.3,539.5 720.8,447.2"
                fill="none"
                stroke="#FF7438"
                strokeWidth="1.8"
                filter="url(#orangeEdgeGlowCentered)"
              />

              {/* Top Chamfer Corner Highlight */}
              <line
                x1="456.7"
                y1="260.5"
                x2="720.8"
                y2="397.8"
                stroke="#FF7438"
                strokeWidth="1.4"
                filter="url(#orangeEdgeGlowCentered)"
              />
            </g>

            {/* ──────────────────────────────────────────────────────────
                G. REAL CONVERSATION FRAGMENTS SAVING INTO CARD (STEP 5)
                Human-understandable context memories absorbed by the chip
               ────────────────────────────────────────────────────────── */}
            <g ref={fragmentsGroupRef} className="pointer-events-none font-sans">
              {/* Fragment 1 (Left Top): Architecture Context */}
              <g className="convo-fragment">
                <rect x="180" y="315" width="245" height="34" rx="4" fill="#0D0E12" stroke="#FF7438" strokeWidth="1" />
                <circle cx="198" cy="332" r="3" fill="#FF7438" />
                <text x="210" y="336" fill="#FFFFFF" fontSize="10.5" fontWeight="400">
                  &ldquo;Keep this React &amp; TypeScript architecture&rdquo;
                </text>
              </g>

              {/* Fragment 2 (Right Top): Brand Guidelines */}
              <g className="convo-fragment">
                <rect x="580" y="325" width="250" height="34" rx="4" fill="#0D0E12" stroke="#888888" strokeWidth="1" />
                <circle cx="598" cy="342" r="3" fill="#FF7438" />
                <text x="610" y="346" fill="#FFFFFF" fontSize="10.5" fontWeight="400">
                  &ldquo;Remember brand design guidelines&rdquo;
                </text>
              </g>

              {/* Fragment 3 (Left Bottom): Solved Bugs & Decisions */}
              <g className="convo-fragment">
                <rect x="190" y="455" width="240" height="34" rx="4" fill="#0D0E12" stroke="#FF7438" strokeWidth="1" />
                <circle cx="208" cy="472" r="3" fill="#FF7438" />
                <text x="220" y="476" fill="#FFFFFF" fontSize="10.5" fontWeight="400">
                  &ldquo;Key decisions &amp; bug resolutions&rdquo;
                </text>
              </g>

              {/* Fragment 4 (Right Bottom): Custom Persona */}
              <g className="convo-fragment">
                <rect x="575" y="465" width="255" height="34" rx="4" fill="#0D0E12" stroke="#888888" strokeWidth="1" />
                <circle cx="593" cy="482" r="3" fill="#FF7438" />
                <text x="605" y="486" fill="#FFFFFF" fontSize="10.5" fontWeight="400">
                  &ldquo;Custom persona &amp; tone instructions&rdquo;
                </text>
              </g>
            </g>

            {/* ──────────────────────────────────────────────────────────
                H. FINAL ASSEMBLY LOCK FLASH (STEP 6)
               ────────────────────────────────────────────────────────── */}
            <polygon
              ref={lockFlashRef}
              points="456.7,260.5 231.5,377.5 543.3,539.5 720.8,447.2 720.8,397.8"
              fill="none"
              stroke="#FF7438"
              strokeWidth="3.5"
              filter="url(#orangeEdgeGlowCentered)"
              className="pointer-events-none"
            />
          </svg>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            ZONE 3: Minimal Supporting Annotation (Bottom Edge)
           ═══════════════════════════════════════════════════════════ */}
        <div className="absolute bottom-4 inset-x-6 sm:inset-x-12 lg:inset-x-14 pt-3 pb-1 border-t border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-matrix text-xs text-[#777777] z-20">
          {/* Main Annotation Statement */}
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#FF7438] shrink-0" />
            <span className="text-[#EDEDED] font-normal text-xs sm:text-[13px] tracking-wide font-sans">
              OCTOMEM embeds your complete AI conversation context inside a portable PNG memory card.
            </span>
          </div>

          {/* Minimal Engineering Footnote Metrics */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#666666]">
            <span className="text-[#999999]">STANDALONE PNG</span>
            <span>•</span>
            <span className="text-[#999999]">ZERO CLOUD LOCK-IN</span>
            <span>•</span>
            <span className="text-[#FF7438]">DRAG &amp; DROP RELOAD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
