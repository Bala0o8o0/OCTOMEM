"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Plus, Sliders, ArrowLeft, Image as ImageIcon, X } from "lucide-react";

interface StudioNavbarProps {
  mountedCardTitle?: string;
  hasCustomCover?: boolean;
  isChatActive: boolean;
  showRightPanel?: boolean;
  onToggleRightPanel?: () => void;
  onNewChat: () => void;
  onOpenSaveModal: () => void;
  onOpenSettings: () => void;
  onUploadClick?: () => void;
}

export const StudioNavbar: React.FC<StudioNavbarProps> = ({
  mountedCardTitle,
  hasCustomCover,
  isChatActive,
  showRightPanel = true,
  onToggleRightPanel,
  onNewChat,
  onOpenSaveModal,
  onOpenSettings,
  onUploadClick,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]/95 backdrop-blur-2xl border-b border-white/[0.08] select-none font-matrix relative">
      {/* Specular Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Station Identity */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/octomem_logo.png"
              alt="OCTOMEM Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain filter drop-shadow-[0_0_12px_rgba(255,85,0,0.5)] group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-white font-medium text-base sm:text-lg tracking-wider font-orbitron">
              OCTOMEM
            </span>
          </Link>

          {/* Studio Station Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#080808] border border-white/[0.10] text-[11px] text-neutral-300 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_6px_#FF5500]" />
            <span className="text-[#FF5500] font-semibold font-orbitron text-[10px]">STUDIO</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 text-[10px]">WORKSPACE</span>
          </div>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors tracking-wide uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-500 group-hover:-translate-x-0.5 group-hover:text-[#FF5500] transition-all" />
            <span>Overview</span>
          </Link>
        </div>

        {/* Center: Active Card Status Pill */}
        {mountedCardTitle ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#080808] border border-white/[0.12] text-xs text-white max-w-[280px] lg:max-w-[380px] truncate shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500] shrink-0" />
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider shrink-0 font-orbitron">CARD:</span>
            <span className="font-medium text-neutral-100 truncate">{mountedCardTitle}</span>
          </div>
        ) : null}

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Right-Panel Toggle Button */}
          {onToggleRightPanel && (
            <button
              type="button"
              onClick={onToggleRightPanel}
              className={`lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 border text-xs tracking-wider transition-all cursor-pointer ${
                showRightPanel
                  ? "bg-[#121212] border-[#FF5500] text-[#FF5500]"
                  : "bg-[#080808] border-white/10 text-neutral-300 hover:text-white"
              }`}
              title="Toggle Card Image Panel"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase">{showRightPanel ? "Hide Card" : "View Card"}</span>
              {hasCustomCover && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />}
            </button>
          )}

          {/* New Chat Button */}
          {isChatActive && (
            <>
              {showClearConfirm ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono tracking-wider">
                  <span>Clear all messages?</span>
                  <button
                    type="button"
                    onClick={() => { onNewChat(); setShowClearConfirm(false); }}
                    className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-black text-[10px] font-bold font-orbitron tracking-wider"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-neutral-300 text-[10px] font-bold font-orbitron tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#080808] hover:bg-[#121212] border border-white/[0.10] hover:border-white/20 text-neutral-300 hover:text-white text-xs font-medium tracking-wide transition-all cursor-pointer"
                  title="Reset conversation and start fresh session"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span className="hidden sm:inline uppercase text-[11px]">New Session</span>
                </button>
              )}
            </>
          )}

          {/* Save Card Button */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-[#FF5500] hover:bg-[#FF6611] text-black text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,85,0,0.35)] hover:shadow-[0_0_25px_rgba(255,85,0,0.55)] cursor-pointer"
            title="Bake and save memory into PNG card"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Card</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Configure Cloud AI Model & Providers (NVIDIA / OpenRouter)"
            className="p-2 bg-[#080808] hover:bg-[#121212] border border-white/[0.10] hover:border-white/20 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
