"use client";

import React from "react";
import { Sparkles, Sliders, HardDrive, Plus, ShieldCheck } from "lucide-react";

interface HeaderProps {
  mountedCardName?: string;
  isEncrypted?: boolean;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mountedCardName,
  isEncrypted,
  onOpenSettings,
  onOpenExport,
  onNewChat,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 apple-glass border-b border-apple-border flex items-center justify-between gap-4">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 shadow-lg shadow-orange-500/10">
          <img
            src="/octomem_logo.png"
            alt="OCTOMEM Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,85,0,0.5)]"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-white">
              OCTOMEM AI
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-apple-subtext font-medium border border-white/5">
              v2.1
            </span>
          </div>
          <p className="text-[11px] text-apple-subtext hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-apple-green" />
            <span>Zero Cloud DB • Portable PNG Context</span>
          </p>
        </div>
      </div>

      {/* Center: Mounted Card Pill */}
      {mountedCardName && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full apple-glass-card text-xs text-apple-text">
          <HardDrive className="w-3.5 h-3.5 text-apple-blue" />
          <span className="text-apple-subtext">Mounted:</span>
          <span className="font-medium text-white max-w-[180px] truncate">
            {mountedCardName}
          </span>
          {isEncrypted && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-apple-green/10 text-apple-green border border-apple-green/20">
              AES-256
            </span>
          )}
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNewChat}
          title="New Conversation"
          className="apple-button px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-apple-text border border-apple-border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          onClick={onOpenExport}
          title="Export Memory Card"
          className="apple-button px-3.5 py-1.5 rounded-xl bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md shadow-apple-blue/25"
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Save Card</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="Cloud AI Provider Settings"
          className="apple-button p-2 rounded-xl bg-white/5 hover:bg-white/10 text-apple-subtext hover:text-white border border-apple-border cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
