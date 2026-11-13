"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plate, Solid, Line, Dots, Wire } from "./draw";
import {
  WIDTH,
  HEIGHT,
  BASE_ART,
  PILLARS_ART,
  DOCK_ART,
  DIAL_ART,
  BOTTOM_CHASSIS_ART,
  SILICON_ART,
  TOP_CASING_ART,
  at,
  P,
} from "./geometry";
import "./iso.css";

export interface AnatomyFigureProps {
  onStageChange?: (stage: number) => void;
}

export default function MemoryCardAnatomyFigure({ onStageChange }: AnatomyFigureProps) {
  // Stages:
  // 0: Assembled PNG (Single solid-state card)
  // 1: Casing Lift (Protective housing elevates on guide pillars)
  // 2: Context Enclave (Silicon substrate & 4 memory banks illuminate)
  // 3: 8-Pin Offline Reload (Interface bus active for LLM reload)
  const [stage, setStage] = useState<number>(1);
  const [sliderValue, setSliderValue] = useState<number>(33);

  // Eased spring positions
  const [topLift, setTopLift] = useState<number>(38);
  const [siliconLift, setSiliconLift] = useState<number>(18);
  const [needleAngle, setNeedleAngle] = useState<number>(85);

  // Target elevations based on stage
  const getTargets = (s: number) => {
    switch (s) {
      case 0:
        return { top: 0, silicon: 0, needle: 0 };
      case 1:
        return { top: 38, silicon: 0, needle: 85 };
      case 2:
        return { top: 54, silicon: 22, needle: 135 };
      case 3:
        return { top: 48, silicon: 20, needle: 170 };
      default:
        return { top: 38, silicon: 0, needle: 85 };
    }
  };

  const setStageByIndex = (index: number) => {
    setStage(index);
    setSliderValue(index * 33.33);
    onStageChange?.(index);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    if (val < 20) setStage(0);
    else if (val < 55) setStage(1);
    else if (val < 85) setStage(2);
    else setStage(3);
  };

  // Calm eased spring motion
  useEffect(() => {
    const targets = getTargets(stage);
    let animId: number;

    const animate = () => {
      setTopLift((cur) => {
        const diff = targets.top - cur;
        return Math.abs(diff) < 0.1 ? targets.top : cur + diff * 0.14;
      });
      setSiliconLift((cur) => {
        const diff = targets.silicon - cur;
        return Math.abs(diff) < 0.1 ? targets.silicon : cur + diff * 0.14;
      });
      setNeedleAngle((cur) => {
        const diff = targets.needle - cur;
        return Math.abs(diff) < 0.5 ? targets.needle : cur + diff * 0.14;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  // Screen Y translation corresponding to Z world lifts:
  // In iso projection (azimuth 45, elevation 30):
  // screenY delta = -z * cosE * scale = -z * 0.866 * 1.84 = -z * 1.593
  const topScreenY = -topLift * 1.593;
  const siliconScreenY = -siliconLift * 1.593;

  // Dial indicator needle line
  const dialRad = (needleAngle * Math.PI) / 180;
  const needleLength = 8.5;
  const dialTip: [number, number] = [
    DIAL_ART.centerPin[0] + Math.cos(dialRad) * needleLength,
    DIAL_ART.centerPin[1] - Math.sin(dialRad) * needleLength,
  ];

  // Dynamic Readout text
  const getReadoutText = () => {
    switch (stage) {
      case 0:
        return "CARRIER: LOSSLESS .PNG · ISO/IEC 15948 · STATUS: ASSEMBLED";
      case 1:
        return `HOUSING LIFT: +${topLift.toFixed(1)} mm · EXPOSING SILICON CONTEXT ENCLAVE`;
      case 2:
        return "CONTEXT ENCLAVE: 4 BANKS ACTIVE · AES-256-GCM · LOSSLESS";
      case 3:
        return "OFFLINE 8-PIN BUS: READY · ZERO CLOUD LOCK-IN · DRAG & DROP";
      default:
        return "OCTOMEM // SOLID STATE CONTEXT • 64MB QUANTUM CHIP";
    }
  };

  return (
    <div className="iso w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* ── Inspection Controls Strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
        {/* Stage Selector Pills */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-[#121214] border border-white/[0.08] rounded-md text-[11px] font-mono">
          {[
            { id: 0, label: "01. ASSEMBLED PNG" },
            { id: 1, label: "02. CASING LIFT" },
            { id: 2, label: "03. CONTEXT ENCLAVE" },
            { id: 3, label: "04. 8-PIN RELOAD" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStageByIndex(item.id)}
              className={`px-2.5 py-1 transition-all duration-200 rounded-sm cursor-pointer ${
                stage === item.id
                  ? "bg-[#FF7438] text-black font-semibold shadow-[0_0_12px_rgba(255,116,56,0.35)]"
                  : "text-[#888888] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Continuous Micro-Scrubber Slider */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#666666] tracking-wider uppercase hidden sm:inline">
            MICROMETER STROKE:
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            aria-label="Deconstruction Stroke Slider"
            className="w-32 sm:w-40 h-1.5 bg-[#222226] rounded-lg appearance-none cursor-pointer accent-[#FF7438]"
          />
          <span className="font-mono text-xs text-[#FF7438] tabular-nums min-w-[48px]">
            {topLift.toFixed(1)} mm
          </span>
        </div>
      </div>

      {/* ── Anatomy Framed Plate ── */}
      <Plate
        fig="FIG 02"
        title="THE ANATOMY OF A MEMORY"
        hint="CLICK STAGES OR DRAG SLIDER TO INSPECT"
        readout={getReadoutText()}
        keys={[
          { mark: "lit", label: "Top Housing & Faceplate (Standard shareable image carrier)" },
          { mark: "raised", label: "Quantum Silicon Core (System persona & prompt vectors)" },
          { mark: "dim", label: "Context Memory Banks (Architecture, schemas & bug history)" },
          { mark: "edge", label: "Offline 8-Pin Interface Bus (Instant drag-and-drop LLM reload)" },
        ]}
        caption="OCTOMEM turns AI conversations into a physical-format memory card encoded inside a standard PNG file. To your computer, it is a normal picture file you can preview in any app. To OCTOMEM, it is a complete, lossless conversation context with token-perfect recall, ready to continue in Claude, Cursor, ChatGPT, or local LLMs without cloud lock-in."
      >
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="The Anatomy of an OCTOMEM Portable Memory Card"
        >
          {/* ══════════════════════════════════════════════════════════════
              1. BASE MACHINE BENCH PLATE ON FEET
             ══════════════════════════════════════════════════════════════ */}
          <g id="bench-base">
            {/* Halo Shadow */}
            <path className="iso-halo" d={BASE_ART.halo} />

            {/* 4 Flanged Feet */}
            {BASE_ART.feet.map((parts, index) => (
              <g key={index}>
                {parts.map((paths, part) => (
                  <Solid key={part} paths={paths} tone={part ? "mid" : "lo"} crease="faint" />
                ))}
              </g>
            ))}

            {/* Base Slab */}
            <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
            <Line d={BASE_ART.groove} tone="lo" />
            <Line d={BASE_ART.screwRings} tone="lo" />
            <Dots points={BASE_ART.screws} size={0.5} tone="mid" />

            {/* Millimeter Ruler Strip along front edge */}
            <Solid paths={BASE_ART.rulerSlab} tone="lo" crease="none" />
            <Line d={BASE_ART.rulerMinor} tone="lo" />
            <Line d={BASE_ART.rulerMajor} tone="mid" />
            <Dots points={BASE_ART.rulerPins} size={0.45} tone="mid" />

            {/* Machine Spec Plate */}
            <Solid paths={BASE_ART.specSlab} tone="lo" crease="none" />
            <Line d={BASE_ART.specOutline} tone="faint" />
            <Line d={BASE_ART.specLines} tone="lo" free={true} />
            <Dots points={BASE_ART.specPins} size={0.4} tone="mid" />

            {/* Knurled Grounding Terminal */}
            <Solid paths={BASE_ART.groundBase} tone="mid" crease="faint" />
            <Line d={BASE_ART.groundKnurl} tone="lo" />
            <Solid paths={BASE_ART.groundCap} tone="hi" crease="faint" />
            <Dots points={[BASE_ART.groundDot]} size={0.5} tone="hi" />
          </g>

          {/* ══════════════════════════════════════════════════════════════
              2. CARD DOCKING CARRIAGE & GUIDE PILLARS
             ══════════════════════════════════════════════════════════════ */}
          <g id="dock-carriage">
            {/* Dock Bed */}
            <Solid paths={DOCK_ART.bed} tone="mid" crease="faint" />
            <Solid paths={DOCK_ART.well} tone="lo" crease="none" />
            <Line d={DOCK_ART.recessOutline} tone="lo" />

            {/* 4 Linear Guide Pillars */}
            {PILLARS_ART.map((pillar, idx) => (
              <g key={idx}>
                <Solid paths={pillar.collar} tone="lo" crease="faint" />
                <Solid paths={pillar.pillar} tone="mid" crease="none" />
                <Solid paths={pillar.cap} tone="hi" crease="faint" />
                <Dots points={[pillar.topDot]} size={0.45} tone="hi" />
              </g>
            ))}
          </g>

          {/* ══════════════════════════════════════════════════════════════
              3. DIAL DEPTH INDICATOR GAUGE (RIGHT RAIL)
             ══════════════════════════════════════════════════════════════ */}
          <g id="dial-gauge">
            <Solid paths={DIAL_ART.clampPost} tone="mid" crease="faint" />
            <Solid paths={DIAL_ART.bracket} tone="hi" crease="faint" />
            <Solid paths={DIAL_ART.gaugeBody} tone="mid" crease="faint" />
            <Solid paths={DIAL_ART.bezelRim} tone="hi" crease="faint" />

            {/* Dial Gauge Needle */}
            <Line
              d={`M ${DIAL_ART.centerPin[0]} ${DIAL_ART.centerPin[1]} L ${dialTip[0]} ${dialTip[1]}`}
              tone={stage > 0 ? "lit" : "mid"}
            />
            <Dots points={[DIAL_ART.centerPin]} size={0.65} tone="hi" />
          </g>

          {/* ══════════════════════════════════════════════════════════════
              4. TIER 1: BOTTOM CHASSIS & 8-PIN GOLD INTERFACE BUS
             ══════════════════════════════════════════════════════════════ */}
          <g id="tier-1-bottom-chassis">
            {/* Chassis Body */}
            <Solid
              paths={BOTTOM_CHASSIS_ART.casing}
              tone="mid"
              lit={stage === 3}
              crease="faint"
            />
            <Line d={BOTTOM_CHASSIS_ART.recessInner} tone="lo" />

            {/* 8 Precision Gold Connector Pins */}
            {BOTTOM_CHASSIS_ART.goldPins.map((item, idx) => (
              <g key={idx}>
                <Solid
                  paths={item.pin}
                  tone="hi"
                  lit={stage === 3}
                  crease="none"
                  className={stage === 3 ? "fill-[#FFB300]" : undefined}
                />
                <Dots points={[item.viaDot]} size={0.4} tone={stage === 3 ? "hi" : "mid"} />
              </g>
            ))}

            {/* Bus Trace Lines */}
            {BOTTOM_CHASSIS_ART.busLines.map((d, idx) => (
              <Line key={idx} d={d} tone={stage === 3 ? "lit" : "lo"} flow={stage === 3} />
            ))}
          </g>

          {/* ══════════════════════════════════════════════════════════════
              5. TIER 2: SILICON SUBSTRATE & QUANTUM CONTEXT ENCLAVE
                 (Translates vertically along guide pillars)
             ══════════════════════════════════════════════════════════════ */}
          <g
            id="tier-2-silicon-substrate"
            style={{ transform: `translate(0px, ${siliconScreenY}px)` }}
            className="transition-transform duration-75 ease-out"
          >
            {/* Silicon PCB Wafer */}
            <Solid
              paths={SILICON_ART.wafer}
              tone={stage === 2 ? "hi" : "mid"}
              crease="faint"
            />
            <Line d={SILICON_ART.waferGroove} tone="faint" />

            {/* Circuit Traces */}
            {SILICON_ART.circuitTraces.map((d, idx) => (
              <Line key={idx} d={d} tone={stage === 2 ? "lit" : "lo"} flow={stage === 2} />
            ))}
            <Dots points={SILICON_ART.vias} size={0.45} tone={stage === 2 ? "hi" : "mid"} />

            {/* Central Quantum Neural Core (Multi-Tier Ceramic Package) */}
            <Solid paths={SILICON_ART.coreBase} tone="mid" crease="faint" />
            <Solid paths={SILICON_ART.coreDie} tone="hi" lit={stage === 2} crease="faint" />
            <Solid paths={SILICON_ART.coreResonator} tone="hi" lit={true} crease="none" />
            <Dots points={[SILICON_ART.coreDot]} size={0.6} tone="hi" pulse={stage === 2} />

            {/* 4 Context Memory Banks (Stacked Quartz / Sapphire Dies) */}
            {/* Bank A: Architecture & Schemas */}
            <Solid paths={SILICON_ART.bankA} tone="hi" lit={stage === 2} crease="faint" />
            {/* Bank B: System Persona & Guidelines */}
            <Solid paths={SILICON_ART.bankB} tone="hi" lit={stage === 2} crease="faint" />
            {/* Bank C: Resolved Bug History & Fixes */}
            <Solid paths={SILICON_ART.bankC} tone="hi" lit={stage === 2} crease="faint" />
            {/* Bank D: Multi-turn Chat Transcript Recall */}
            <Solid paths={SILICON_ART.bankD} tone="hi" lit={stage === 2} crease="faint" />
          </g>

          {/* ══════════════════════════════════════════════════════════════
              6. TIER 3: TOP HOUSING CASING & FACEPLATE (SURFACE CARRIER)
                 (Elevates on guide pillars to expose internal payload)
             ══════════════════════════════════════════════════════════════ */}
          <g
            id="tier-3-top-casing"
            style={{ transform: `translate(0px, ${topScreenY}px)` }}
            className="transition-transform duration-75 ease-out"
          >
            {/* Top Casing Slab */}
            <Solid
              paths={TOP_CASING_ART.casing}
              tone="hi"
              lit={stage === 1}
              crease="faint"
            />
            <Line d={TOP_CASING_ART.chamferAccent} tone="hi" />

            {/* Inset Faceplate Screen */}
            <Solid paths={TOP_CASING_ART.faceplate} tone="mid" crease="none" />
            <Line d={TOP_CASING_ART.faceplateBezel} tone="faint" />

            {/* Laser-Etched Octopus Insignia */}
            <Solid paths={TOP_CASING_ART.octopusDome} tone="hi" lit={stage === 0} crease="none" />
            <Dots points={[TOP_CASING_ART.octopusEyeL, TOP_CASING_ART.octopusEyeR]} size={0.45} tone="lo" />

            {/* 3 Tactical Data Stripes */}
            {TOP_CASING_ART.stripes.map((d, idx) => (
              <Line key={idx} d={d} tone={stage === 0 ? "lit" : "mid"} />
            ))}

            {/* Corner Alignment Reticles */}
            {TOP_CASING_ART.cornerBrackets.map((d, idx) => (
              <Line key={idx} d={d} tone="faint" />
            ))}
          </g>
        </svg>
      </Plate>
    </div>
  );
}
