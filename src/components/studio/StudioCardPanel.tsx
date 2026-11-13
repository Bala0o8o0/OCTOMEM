"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import DitherVeil from "@/components/ui/DitherVeil";
import {
  UploadCloud,
  Download,
  Trash2,
  X,
  Edit2,
  RefreshCw,
  Database,
  Lock,
  MousePointer2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Search,
  Terminal,
  HardDrive,
} from "lucide-react";

interface StudioCardPanelProps {
  customCoverUrl: string | null;
  cardTitle: string;
  onCardTitleChange: (val: string) => void;
  agentName: string;
  onAgentNameChange: (val: string) => void;
  messagesCount: number;
  worldState?: string;
  coreFacts?: string[];
  onUploadClick: () => void;
  onOpenSaveModal: () => void;
  onEjectCard?: () => void;
  onFileDrop: (file: File) => void;
  onClose?: () => void;
  isMounted?: boolean;
  mountedCardTitle?: string;
  mountedTurnCount?: number;
  onScrollToChatTop?: () => void;
  onCopyPayloadSize?: () => void;
  onShowCipherDetails?: () => void;
}

export const StudioCardPanel: React.FC<StudioCardPanelProps> = ({
  customCoverUrl,
  cardTitle,
  onCardTitleChange,
  messagesCount,
  onUploadClick,
  onOpenSaveModal,
  onEjectCard,
  onFileDrop,
  onClose,
  isMounted = false,
  mountedCardTitle,
  mountedTurnCount = 0,
  onScrollToChatTop,
  onCopyPayloadSize,
  onShowCipherDetails,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files[0]);
    }
  };

  // GSAP Organic Equalizer Bars Config (clamped to prevent exponential height compounding)
  const EQ_BAR_CONFIGS = [
    { base: 6, min: 3, max: 12, dur: 0.55 },
    { base: 10, min: 4, max: 14, dur: 0.75 },
    { base: 4, min: 2, max: 8, dur: 0.45 },
    { base: 8, min: 3, max: 13, dur: 0.65 },
    { base: 6, min: 2, max: 10, dur: 0.8 },
  ];
  const eqBarsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const eqTimelinesRef = useRef<Array<gsap.core.Timeline>>([]);

  useEffect(() => {
    if (typeof window === "undefined" || eqBarsRef.current.length === 0) return;

    // Kill existing timelines
    eqTimelinesRef.current.forEach((tl) => tl.kill());
    eqTimelinesRef.current = [];

    // Create bounded organic pulsing for each bar
    eqBarsRef.current.forEach((bar, index) => {
      if (!bar) return;
      const cfg = EQ_BAR_CONFIGS[index] || { base: 6, min: 3, max: 12, dur: 0.6 };
      gsap.set(bar, { height: `${cfg.base}px` });

      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.fromTo(
        bar,
        { height: `${cfg.min}px` },
        {
          height: `${cfg.max}px`,
          duration: cfg.dur,
          ease: "sine.inOut",
        }
      );
      // Stagger start
      tl.progress(Math.random());
      eqTimelinesRef.current.push(tl);
    });

    return () => {
      eqTimelinesRef.current.forEach((tl) => tl.kill());
      eqTimelinesRef.current = [];
    };
  }, []);

  // Pulse faster on message updates without modifying target heights
  useEffect(() => {
    if (messagesCount === 0 || eqTimelinesRef.current.length === 0) return;
    eqTimelinesRef.current.forEach((tl) => tl.timeScale(2.2));
    const timer = setTimeout(() => {
      eqTimelinesRef.current.forEach((tl) => tl.timeScale(1.0));
    }, 1200);
    return () => clearTimeout(timer);
  }, [messagesCount]);

  const activeImage = customCoverUrl || "/images/octo-hero.png";

  // Drag affordance: show subtle hint when not dragging and no card mounted
  const showDropHint = !isDragging && !isMounted && !customCoverUrl;

  // Payload size calculation
  const payloadKB = Math.max(messagesCount * 1.6, 0.4).toFixed(1);

  return (
    <aside
      className="w-full lg:w-[350px] xl:w-[380px] shrink-0 h-full border-l border-white/[0.08] bg-[#000000] flex flex-col z-20 font-matrix select-none overflow-hidden relative"
    >
      {/* ── Top Header Strip ── */}
      <div className="px-4 py-2.5 border-b border-white/[0.08] bg-[#080808] flex items-center justify-between gap-3 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500] animate-pulse" />
          <span className="font-orbitron text-[11px] tracking-wider text-white font-bold">
            MEMORY CARTRIDGE
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* State Badge: MOUNTED & SYNCED | ARTWORK ONLY | DEFAULT */}
          <div
            className={`text-[9px] px-2 py-0.5 border font-mono tracking-widest uppercase flex items-center gap-1.5 ${
              isMounted
                ? "bg-[#0A1A0A] border-[#34D399]/50 text-[#34D399]"
                : customCoverUrl
                ? "bg-[#1A120A] border-[#FFA000]/50 text-[#FFA000]"
                : "bg-[#0F0F0F] border-white/10 text-neutral-400"
            }`}
            title={
              isMounted
                ? `Memory synced: ${mountedCardTitle || "card"} • ${mountedTurnCount} turns`
                : customCoverUrl
                ? "Artwork uploaded — click Bake & Download to save memory"
                : "Default artwork — drop an image or bake a new card"
            }
          >
            {isMounted ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_6px_#34D399]" />
                <span>MOUNTED & SYNCED</span>
              </>
            ) : customCoverUrl ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFA000] animate-pulse shadow-[0_0_6px_#FFA000]" />
                <span>ARTWORK ONLY</span>
              </>
            ) : (
              <span>DEFAULT</span>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Main Dock Body (DitherVeil Card + Actions) ── */}
      <div
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col justify-between p-3.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-colors relative ${
          isDragging ? "bg-[#FF5500]/10 ring-1 ring-inset ring-[#FF5500]" : ""
        }`}
      >
        {/* Drop overlay feedback */}
        {isDragging && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-3 z-30 pointer-events-none">
            <UploadCloud className="w-8 h-8 text-[#FF5500] animate-bounce mb-1.5" />
            <span className="text-[11px] font-orbitron text-white uppercase tracking-wider">
              Drop image to mount
            </span>
          </div>
        )}

        {/* Persistent drag affordance when idle */}
        {showDropHint && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none opacity-30 transition-opacity hover:opacity-50 z-10">
            <MousePointer2 className="w-6 h-6 text-[#FF5500] mb-1.5 animate-bounce" />
            <span className="text-[10px] font-orbitron text-neutral-500 uppercase tracking-wider">
              Drop image to mount memory
            </span>
            <span className="text-[9px] text-neutral-600 font-mono mt-0.5">
              or click to upload
            </span>
          </div>
        )}

        {/* ── Center Stage: The 3D DitherVeil Memory Card with DroneOS Reticles ── */}
        <div className="flex-1 flex flex-col items-center justify-center py-1 space-y-3">
          
          {/* Interactive DitherVeil Stage */}
          <div
            id="studio-card-dock"
            className="relative w-full max-w-[280px] xl:max-w-[300px] aspect-square flex items-center justify-center cursor-pointer group p-1.5"
            onClick={onUploadClick}
            title="Click to mount or replace artwork"
          >
            {/* Tether Wire Receiving Port Terminal */}
            <div
              id="studio-card-port"
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#080808] border border-[#FF5500] rounded-full flex items-center justify-center z-30 shadow-[0_0_8px_#FF5500]"
              title="Cartridge Data Ingestion Port"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
            </div>

            {/* 4 Optical Corner Reticle Ticks framing the card */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/30 pointer-events-none" />

            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <DitherVeil
                src={activeImage}
                fit="contain"
                pattern="floyd"
                pixelSize={2}
                levels={2}
                palette="rgb"
                inkColor="#000000"
                paperColor="#ffffff"
                contrast={1.15}
                revealRadius={220}
                softness={0.6}
                linger={1.2}
                rimColor="#FF5500"
                rim={0}
                wander={false}
                clickBurst={true}
                className="w-full h-full"
              />
            </div>

            {/* Hover Indicator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#080808] border border-white/20 px-2.5 py-1 text-[9px] font-orbitron text-white flex items-center gap-1 shadow-[0_0_12px_rgba(0,0,0,0.9)] pointer-events-none tracking-wider uppercase whitespace-nowrap z-20">
              <UploadCloud className="w-3 h-3 text-[#FF5500]" />
              <span>Change Art</span>
            </div>
          </div>

          {/* ── Animated Cybernetic Stegano Buffer Module ── */}
          <div className="w-full max-w-[280px] xl:max-w-[300px] bg-[#080808]/90 border border-white/[0.10] p-2.5 space-y-1.5 relative shadow-[0_6px_20px_rgba(0,0,0,0.8)]">
            {/* Top Specular Line */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Stegano Buffer Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-[#FF5500] animate-pulse" />
                <span className="font-orbitron text-[9px] font-bold text-white tracking-wider">
                  STEGANO BUFFER
                </span>
              </div>

              {/* Live Equalizer Activity Waveform */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[1.5px] h-5 max-h-5 overflow-hidden">
                  {EQ_BAR_CONFIGS.map((cfg, idx) => (
                    <span
                      key={idx}
                      ref={(el) => {
                        eqBarsRef.current[idx] = el;
                      }}
                      className="w-0.5 bg-[#FF5500] rounded-t-[1px]"
                      style={{ height: `${cfg.base}px` }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onScrollToChatTop}
                  disabled={!onScrollToChatTop}
                  className="text-[#FF5500] font-mono font-bold text-[9px] tracking-wider hover:text-white hover:underline transition-colors cursor-pointer flex items-center gap-1"
                  title="Scroll to conversation start"
                >
                  {messagesCount} TURNS
                  <Terminal className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Animated Laser Progress Bar */}
            <div className="relative w-full h-1.5 bg-[#121212] border border-white/[0.08] overflow-hidden">
              {/* Dynamic Fill */}
              <div
                className="h-full bg-gradient-to-r from-[#FF5500] via-[#FFA000] to-[#FF5500] transition-all duration-500 shadow-[0_0_8px_#FF5500] relative"
                style={{ width: `${Math.min(Math.max(messagesCount * 10, 12), 100)}%` }}
              >
                {/* Continuous Laser Pulse Scan */}
                <div className="absolute inset-0 bg-white/25 animate-pulse" />
              </div>

              {/* Segmented Optical Reticle Ticks */}
              <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
                <span className="w-[1px] h-full bg-black/40" />
                <span className="w-[1px] h-full bg-black/40" />
                <span className="w-[1px] h-full bg-black/40" />
                <span className="w-[1px] h-full bg-black/40" />
              </div>
            </div>

            {/* Stegano Telemetry Matrix */}
            <div className="flex items-center justify-between text-[8.5px] font-mono text-neutral-400 pt-0.5">
              <button
                type="button"
                onClick={onShowCipherDetails}
                disabled={!onShowCipherDetails}
                className="flex items-center gap-1 text-neutral-300 hover:text-white hover:underline transition-colors cursor-pointer"
                title="View cipher specifications"
              >
                <Lock className="w-2.5 h-2.5 text-[#FF5500]" />
                <span>AES-256-GCM CIPHER</span>
                <Terminal className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />
              </button>
              <button
                type="button"
                onClick={onCopyPayloadSize}
                disabled={!onCopyPayloadSize}
                className="text-neutral-500 hover:text-[#FF5500] hover:underline transition-colors cursor-pointer flex items-center gap-1"
                title="Copy payload size to clipboard"
              >
                <HardDrive className="w-2.5 h-2.5" />
                <span>~{payloadKB} KB tEXt</span>
                <Copy className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Actions Deck ── */}
        <div className="space-y-2 pt-2.5 border-t border-white/[0.08]">
          {/* Card Title Chassis */}
          <div className="relative flex items-center justify-between gap-2 px-2.5 py-1.5 bg-[#080808] border border-white/[0.10] focus-within:border-white/25 transition-colors">
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="flex-1 relative">
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 64);
                  onCardTitleChange(val);
                }}
                placeholder="Cartridge Title..."
                maxLength={64}
                className="w-full bg-transparent text-[11px] font-orbitron font-semibold text-white focus:outline-none py-0.5 pr-20 truncate tracking-wide"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-neutral-500">
                {cardTitle.length}/64
              </span>
            </div>
            <Edit2 className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
          </div>

          {/* Primary Bake & Download Button */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="w-full py-3 px-4 bg-[#FF5500] hover:bg-[#FF6611] active:bg-[#E04400] text-black text-[11px] font-bold font-orbitron tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,85,0,0.35)] hover:shadow-[0_0_28px_rgba(255,85,0,0.55)] active:shadow-[0_0_15px_rgba(255,85,0,0.45)] flex items-center justify-center gap-2 cursor-pointer relative group"
            title="Creates your encrypted PNG memory card with full conversation history"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Bake & Download Card</span>
            {/* Subtle pulse indicator when there's unsaved data */}
            {messagesCount > 0 && !isMounted && (
              <span className="absolute right-3 w-2 h-2 rounded-full bg-white/30 animate-pulse" title="Unsaved conversation data" />
            )}
          </button>

          {/* Secondary Controls */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={onUploadClick}
              className="py-1.5 px-2 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white text-[9.5px] font-mono tracking-wider uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3 h-3 text-[#FF5500]" />
              <span>{customCoverUrl ? "Replace Art" : "Upload Art"}</span>
            </button>

            {customCoverUrl && onEjectCard ? (
              <button
                type="button"
                onClick={onEjectCard}
                className="py-1.5 px-2 bg-[#0F0F0F] hover:bg-red-950/40 border border-white/[0.08] hover:border-red-500/40 text-neutral-400 hover:text-red-400 text-[9.5px] font-mono tracking-wider uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Reset to default artwork"
              >
                <Trash2 className="w-3 h-3" />
                <span>Eject Memory</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onCardTitleChange("OCTOMEM • " + new Date().toLocaleDateString())}
                className="py-1.5 px-2 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/[0.08] text-neutral-400 hover:text-white text-[9.5px] font-mono tracking-wider uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5 text-neutral-500" />
                <span>Reset Title</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
};
