"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface AppleHeroCardProps {
  customCoverUrl: string | null;
  cardTitle: string;
  onImageSelected: (file: File) => void;
  onStartChat: () => void;
  onQuickPreset: (name: string, title: string) => void;
}

export const AppleHeroCard: React.FC<AppleHeroCardProps> = ({
  customCoverUrl,
  cardTitle,
  onImageSelected,
  onStartChat,
  onQuickPreset,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onImageSelected(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelected(files[0]);
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto text-center space-y-8 py-6 sm:py-10">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Hero Typography */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs text-apple-emerald font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Cloud Database • 100% Client-Side Privacy</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Your thoughts. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-apple-blue via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Saved inside your image.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-apple-subtext max-w-xl mx-auto leading-relaxed">
          Upload any photo to start an AI conversation. When you save, your chat is baked directly into the image. Drop the image back anytime to continue where you left off.
        </p>
      </div>

      {/* Interactive Glass Dropzone / Card Showcase */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass-panel p-6 sm:p-8 rounded-3xl transition-all duration-300 relative overflow-hidden ${
          isDragging ? "ring-2 ring-apple-blue bg-white/[0.08] scale-[1.01]" : ""
        }`}
      >
        {customCoverUrl ? (
          /* Active Image Card Preview */
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-48 sm:w-56 aspect-[4/3] mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black group">
              <img
                src={customCoverUrl}
                alt="Selected Card"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-apple-emerald flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Image Attached
                </span>
                <div className="text-xs font-semibold text-white truncate">{cardTitle}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="apple-btn px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium border border-white/10 cursor-pointer"
              >
                Change Picture
              </button>
              <button
                onClick={onStartChat}
                className="apple-btn px-6 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-semibold flex items-center gap-2 shadow-xl shadow-apple-blueGlow cursor-pointer"
              >
                <span>Start Conversation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Clean Empty Dropzone */
          <div className="space-y-4 py-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 mx-auto rounded-3xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-apple-subtext hover:text-white hover:scale-105 transition cursor-pointer shadow-lg"
            >
              <UploadCloud className="w-8 h-8 text-apple-blue" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Drag & drop your picture here
              </h3>
              <p className="text-xs text-apple-subtext">
                Supports JPG, PNG, WebP — or drop a previously saved ChronoCard PNG to resume
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="apple-btn px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium border border-white/10 flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-apple-blue" />
                <span>Choose Image from Computer</span>
              </button>

              <button
                onClick={onStartChat}
                className="apple-btn px-5 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-apple-blueGlow cursor-pointer"
              >
                <span>Start with Default Persona</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 Quick Starter Suggestions */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-medium text-apple-muted uppercase tracking-wider">
          Or try a starter persona
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onQuickPreset("Aria • Creative Author", "Fantasy Novel Project")}
            className="glass-panel glass-panel-hover p-3.5 rounded-2xl text-left space-y-1 transition apple-btn cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <span className="font-semibold text-xs text-white">Creative Partner</span>
            </div>
            <p className="text-[11px] text-apple-subtext leading-snug">
              Co-write chapters, dialogue, and lore.
            </p>
          </button>

          <button
            onClick={() => onQuickPreset("Kaelen • Code Architect", "Systems Architecture")}
            className="glass-panel glass-panel-hover p-3.5 rounded-2xl text-left space-y-1 transition apple-btn cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="font-semibold text-xs text-white">Systems Architect</span>
            </div>
            <p className="text-[11px] text-apple-subtext leading-snug">
              Brainstorm code, schemas, and logic.
            </p>
          </button>

          <button
            onClick={() => onQuickPreset("Marcus • Deep Thinker", "Life & Philosophy")}
            className="glass-panel glass-panel-hover p-3.5 rounded-2xl text-left space-y-1 transition apple-btn cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🌿</span>
              <span className="font-semibold text-xs text-white">Mindful Advisor</span>
            </div>
            <p className="text-[11px] text-apple-subtext leading-snug">
              Reflective questions and clarity.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
