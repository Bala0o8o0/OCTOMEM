"use client";

import React from "react";
import { Sparkles, Sliders, Download, Plus, HardDrive, ShieldCheck } from "lucide-react";

interface AppleNavbarProps {
  mountedCardTitle?: string;
  isChatActive: boolean;
  onNewChat: () => void;
  onOpenSaveModal: () => void;
  onOpenSettings: () => void;
}

export const AppleNavbar: React.FC<AppleNavbarProps> = ({
  mountedCardTitle,
  isChatActive,
  onNewChat,
  onOpenSaveModal,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-4 z-40 w-full max-w-5xl mx-auto px-4 select-none">
      <nav className="glass-pill px-4 sm:px-6 py-3 rounded-full flex items-center justify-between gap-4 transition-all duration-300">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center p-1 shadow-md shadow-orange-500/20">
            <img
              src="/octomem_logo.png"
              alt="OCTOMEM Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
            />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              OCTOMEM
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-apple-subtext font-medium">
                AI
              </span>
            </span>
          </div>
        </div>

        {/* Center: Mounted Card Pill */}
        {mountedCardTitle && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white">
            <HardDrive className="w-3.5 h-3.5 text-apple-emerald" />
            <span className="text-apple-subtext">Mounted:</span>
            <span className="font-medium max-w-[160px] truncate">{mountedCardTitle}</span>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {isChatActive && (
            <button
              onClick={onNewChat}
              className="apple-btn px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-apple-text text-xs font-medium flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {isChatActive && (
            <button
              onClick={onOpenSaveModal}
              className="apple-btn px-4 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-apple-blueGlow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Card</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            title="Cloud AI Settings"
            className="apple-btn p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-apple-subtext hover:text-white border border-white/10 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
};
