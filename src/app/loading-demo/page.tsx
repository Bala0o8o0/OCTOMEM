"use client";

import React, { useState } from "react";
import Link from "next/link";
import GlitchDottedLogoLoader from "@/components/ui/GlitchDottedLogoLoader";
import { ArrowLeft, Play, RefreshCw, Sliders, Volume2, Sparkles, Terminal, Layers } from "lucide-react";

export default function LoadingDemoPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [glitchIntensity, setGlitchIntensity] = useState<number>(1.2);
  const [dotDensity, setDotDensity] = useState<"dense" | "balanced" | "chunky">("balanced");
  const [colorTheme, setColorTheme] = useState<"brand" | "orange" | "cyber" | "matrix">("brand");
  const [minDuration, setMinDuration] = useState<number>(3000);
  const [autoDismiss, setAutoDismiss] = useState<boolean>(true);
  const [key, setKey] = useState<number>(1);

  const handleRestart = () => {
    setKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-matrix relative overflow-hidden flex flex-col justify-between p-6 sm:p-12">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full border-b border-white/10 pb-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF5500]" />
          <span>BACK TO OCTOMEM</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
          <span className="text-xs font-orbitron tracking-widest text-[#FF5500]">
            GLITCH DOTTED LOGO LOADER LAB
          </span>
        </div>
      </header>

      {/* Control Console */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto py-12 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE TEST LAB & BENCHMARK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black tracking-wider text-white">
            DOTTED GLITCH <span className="text-[#FF5500]">LOGO ANIMATION</span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-lg">
            Procedurally samples the official <code className="text-white font-mono">/octomem_logo.png</code> into a high-DPI cyber dot matrix with RGB chromatic aberration, scanline slice tears, and interactive physics.
          </p>
        </div>

        {/* Control Panel Grid */}
        <div className="w-full bg-[#0a0815]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Glitch Intensity */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#FF5500]" />
                GLITCH INTENSITY
              </span>
              <span className="text-[#FF5500] font-bold">{glitchIntensity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.0"
              step="0.2"
              value={glitchIntensity}
              onChange={(e) => setGlitchIntensity(parseFloat(e.target.value))}
              className="w-full accent-[#FF5500] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>0.0 (Smooth)</span>
              <span>1.0 (Cyber)</span>
              <span>2.0 (Overdrive)</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#FF5500]" />
                BOOT DURATION
              </span>
              <span className="text-[#FF5500] font-bold">{(minDuration / 1000).toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="1500"
              max="6000"
              step="500"
              value={minDuration}
              onChange={(e) => setMinDuration(parseInt(e.target.value))}
              className="w-full accent-[#FF5500] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>1.5s (Fast)</span>
              <span>3.0s (Cinematic)</span>
              <span>6.0s (Showcase)</span>
            </div>
          </div>

          {/* Dot Density */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FF5500]" />
              DOT MATRIX DENSITY
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["chunky", "balanced", "dense"] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => setDotDensity(density)}
                  className={`py-2 px-3 rounded border text-xs font-mono uppercase transition-all ${
                    dotDensity === density
                      ? "bg-[#FF5500]/20 border-[#FF5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.3)]"
                      : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>

          {/* Palette Theme */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-neutral-300">COLOR PALETTE</span>
            <div className="grid grid-cols-4 gap-2">
              {(["brand", "orange", "cyber", "matrix"] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setColorTheme(theme)}
                  className={`py-2 px-2 rounded border text-[11px] font-mono uppercase transition-all ${
                    colorTheme === theme
                      ? "bg-white/20 border-white text-white font-bold"
                      : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Launch / Replay Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleRestart}
            className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#FF5500] to-[#FF7700] hover:from-[#FF6600] hover:to-[#FF8800] text-white font-orbitron font-bold tracking-widest text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(255,85,0,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY FULLSCREEN LOADER</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoDismiss(!autoDismiss)}
            className={`px-4 py-3 rounded-lg border text-xs font-mono tracking-wider transition-all ${
              autoDismiss
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                : "border-neutral-700 text-neutral-400 bg-neutral-900"
            }`}
          >
            AUTO-DISMISS: {autoDismiss ? "ON" : "OFF (STANDSTILL)"}
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 text-center text-xs font-mono text-neutral-500 border-t border-white/5 pt-4">
        OCTOMEM PRIVATE AI CONVERSATION CARDS // DOTTED MATRIX GLITCH RENDERER
      </footer>

      {/* Active Glitch Dotted Logo Loader Overlay */}
      {isPlaying && (
        <GlitchDottedLogoLoader
          key={key}
          isLoading={isPlaying}
          onComplete={() => setIsPlaying(false)}
          minDuration={minDuration}
          glitchIntensity={glitchIntensity}
          dotDensity={dotDensity}
          colorTheme={colorTheme}
          autoDismiss={autoDismiss}
          allowSkip={true}
        />
      )}
    </div>
  );
}
