"use client";

import React from "react";
import { Download, UploadCloud, Share2, Sparkles, ChevronDown } from "lucide-react";

interface CompanionPanelProps {
  agentName: string;
  customCoverUrl?: string | null;
  onSaveCardClick: () => void;
  onImportClick: () => void;
  onContinueWithCard: () => void;
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  agentName,
  customCoverUrl,
  onSaveCardClick,
  onImportClick,
  onContinueWithCard,
}) => {
  const artworkSrc = customCoverUrl || "/assets/memory-card-artifact.jpg";

  return (
    <aside className="w-80 lg:w-96 shrink-0 h-screen hidden lg:flex flex-col justify-between p-5 relative overflow-hidden select-none border-l border-white/5 bg-[#0B0813]">
      {/* Background Cinematic Artwork with Dark Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={artworkSrc}
          alt="AI Companion"
          className="w-full h-full object-cover object-center brightness-90 filter"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0813] via-[#0B0813]/40 to-[#0B0813]/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0813] via-transparent to-transparent"></div>
      </div>

      {/* Top Section: User Profile & Companion Title */}
      <div className="relative z-10 space-y-4">
        {/* Profile Dropdown Pill */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white shadow-lg">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-chrono-pink/20 border border-chrono-pink/40">
              <img src="/assets/avatar_user.jpg" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs leading-none">Bala Murugan</div>
              <div className="text-[10px] text-chrono-muted leading-tight">Card Collector</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-chrono-muted ml-1" />
          </div>
        </div>

        {/* AI Companion Typography */}
        <div className="space-y-1 pt-2">
          <div className="text-[11px] font-bold tracking-widest text-chrono-pink uppercase flex items-center gap-1.5">
            <span>AI COMPANION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
            {agentName || "AUTONOMOUS SENTINEL"}
          </h2>
          <p className="text-xs font-semibold tracking-wider text-chrono-muted uppercase">
            DEEPER THINKING. BIGGER IDEAS.
          </p>
        </div>
      </div>

      {/* Bottom Floating Cards: Quick Actions & Audio Status */}
      <div className="relative z-10 space-y-3 pt-6">
        {/* Quick Actions Glass Card */}
        <div className="p-3.5 rounded-2xl bg-[#140E24]/85 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
          <div className="text-[11px] font-bold tracking-wider text-chrono-muted/90 uppercase px-1">
            Quick Actions
          </div>

          <div className="space-y-1.5">
            <button
              onClick={onSaveCardClick}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-2.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-chrono-pink" />
              <span>Save as Card</span>
            </button>

            <button
              onClick={onImportClick}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-2.5 transition cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span>Import Card</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Chat link copied to clipboard!");
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-2.5 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-chrono-muted" />
              <span>Share Chat</span>
            </button>

            {/* Primary Action */}
            <button
              onClick={onContinueWithCard}
              className="chrono-btn w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-chrono-pink to-pink-600 hover:brightness-110 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-pink cursor-pointer mt-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue with Card</span>
            </button>
          </div>
        </div>

        {/* Bottom Audio / Status Card */}
        <div className="p-3 rounded-2xl bg-[#140E24]/80 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-chrono-pink to-purple-600 p-0.5 shrink-0">
              <div className="w-full h-full bg-[#120B20] rounded-[10px] flex items-center justify-center text-sm">
                🐙
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Autonomous Sentinel</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-[10px] text-chrono-muted truncate italic">
                &ldquo;The ocean is not just water... it&apos;s data, and I protect it.&rdquo;
              </p>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="w-1 bg-chrono-pink rounded-full wave-bar" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1 bg-chrono-pink rounded-full wave-bar" style={{ animationDelay: "200ms" }}></span>
            <span className="w-1 bg-chrono-pink rounded-full wave-bar" style={{ animationDelay: "400ms" }}></span>
            <span className="w-1 bg-chrono-pink rounded-full wave-bar" style={{ animationDelay: "100ms" }}></span>
            <span className="w-1 bg-chrono-pink rounded-full wave-bar" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>

        {/* Subtle Watermark */}
        <div className="flex items-center justify-end gap-1.5 pt-1 text-[10px] font-bold tracking-widest text-white/30 uppercase">
          <img
            src="/octomem_logo.png"
            alt="OCTOMEM"
            className="w-3.5 h-3.5 object-contain opacity-40"
          />
          <span>OCTOMEM AI</span>
        </div>
      </div>
    </aside>
  );
};
