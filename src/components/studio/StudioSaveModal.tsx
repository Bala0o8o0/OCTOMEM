"use client";

import React, { useState } from "react";
import { X, Lock, Download, ShieldCheck, Eye, EyeOff, Sparkles, Database } from "lucide-react";
import { MessageTurn } from "@/lib/card/schema";
import { useToastHelpers } from "@/components/ui/Toast";

interface StudioSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageTurn[];
  worldState?: string;
  coreFacts?: string[];
  initialAgentName?: string;
  initialCardTitle?: string;
  customCoverBase64?: string | null;
  customCoverUrl?: string | null;
}

export const StudioSaveModal: React.FC<StudioSaveModalProps> = ({
  isOpen,
  onClose,
  messages,
  worldState,
  coreFacts = [],
  initialAgentName = "OCTOBOT",
  initialCardTitle = "Saved Memory Card",
  customCoverBase64,
  customCoverUrl,
}) => {
  const [cardTitle, setCardTitle] = useState(initialCardTitle);
  const [agentName, setAgentName] = useState(initialAgentName);
  const [enableEncryption, setEnableEncryption] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { success, error: showError } = useToastHelpers();

  if (!isOpen) return null;

  const activeImage = customCoverUrl || "/images/octo-hero.png";

  const handleExport = async () => {
    if (enableEncryption && (!passphrase || passphrase.length < 4)) {
      setError("Passphrase must be at least 4 characters long.");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const res = await fetch("/api/card/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "agent-custom",
          agentName: agentName.trim() || "OCTOBOT",
          cardTitle: cardTitle.trim() || "ChronoCard Memory",
          messages,
          worldState,
          coreFacts,
          passphrase: enableEncryption ? passphrase.trim() : undefined,
          customImageBase64: customCoverBase64 || undefined,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Export failed.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeFilename = (cardTitle.trim() || "ChronoCard").replace(/[^a-zA-Z0-9_-]/g, "_");
      a.download = `ChronoCard_${safeFilename}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsExporting(false);
      onClose();

      // Success toast with stats
      const turnCount = messages.length;
      const factCount = coreFacts.length;
      const hasWorldState = worldState && worldState.trim().length > 0;
      const isEncrypted = enableEncryption;
      const fileSizeKB = (blob.size / 1024).toFixed(1);

      success(
        "ChronoCard Saved",
        `${turnCount} turns • ${factCount} facts ${hasWorldState ? "• world state" : ""} • ${fileSizeKB} KB ${isEncrypted ? "• AES-256 encrypted" : "• plaintext"}`,
        6000
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to download card";
      setError(message);
      showError("Export Failed", message);
      setIsExporting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl font-matrix animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl lg:max-w-3xl bg-[#080808] border border-white/[0.12] p-5 sm:p-7 shadow-[0_24px_90px_rgba(0,0,0,0.98)] space-y-6"
      >
        {/* Top Specular Line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center text-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.25)]">
              <Download className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-base sm:text-lg text-white tracking-wide">
                BAKE & EXPORT MEMORY CARTRIDGE
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono tracking-wide">
                CLIENT-SIDE PNG STEGANOGRAPHY • ZERO-CLOUD PERSISTENCE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Body: 2-Column Responsive Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Left Column (5 Cols): High-Res Card Artwork Preview & Specs */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            <div className="relative w-full aspect-square bg-[#000000] border border-white/[0.10] p-2 flex items-center justify-center overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <img
                src={activeImage}
                alt="Cartridge artwork"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
              />

              {/* Tag overlay */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#080808]/90 border border-white/10 text-[9px] font-orbitron text-neutral-300 uppercase tracking-widest backdrop-blur-sm">
                {customCoverUrl ? "CUSTOM ART" : "OCTOMEM v1"}
              </div>
            </div>

            {/* Cartridge Specs Matrix */}
            <div className="p-3 bg-[#0D0D0D] border border-white/[0.08] space-y-1.5 text-[10px] font-mono">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-neutral-500 uppercase">PAYLOAD CAPACITY</span>
                <span className="text-white font-semibold">{messages.length} TURNS READY</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-neutral-500 uppercase">CHUNK TARGET</span>
                <span className="text-neutral-300">PNG tEXt BLOCK</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-neutral-500 uppercase">CIPHER ENCODING</span>
                <span className={enableEncryption ? "text-[#FF5500] font-semibold" : "text-neutral-400"}>
                  {enableEncryption ? "AES-256-GCM" : "PLAINTEXT JSON"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Settings & Passphrase Form */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
                [ERROR]: {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Cartridge Title */}
              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                  Cartridge Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    placeholder="My Conversation Memory"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors font-matrix"
                  />
                </div>
              </div>

              {/* AI Agent Designation */}
              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                  AI Agent Designation
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="OCTOBOT"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors font-matrix"
                  />
                </div>
              </div>

              {/* Cryptographic Encryption Option */}
              <div className="p-3.5 bg-[#0D0D0D] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF5500]" />
                    <div>
                      <span className="text-xs font-semibold text-white font-orbitron block">
                        AES-256-GCM PASSPHRASE
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Hardware-grade client-side encryption
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableEncryption(!enableEncryption)}
                    className={`w-11 h-6 border transition-colors flex items-center p-0.5 cursor-pointer ${
                      enableEncryption
                        ? "bg-[#FF5500] border-[#FF5500] justify-end"
                        : "bg-[#141414] border-white/20 justify-start"
                    }`}
                  >
                    <div className={`w-4 h-4 ${enableEncryption ? "bg-black" : "bg-neutral-400"}`} />
                  </button>
                </div>

                {enableEncryption && (
                  <div className="pt-2.5 border-t border-white/5 space-y-2">
                    {/* Passphrase Warning Banner */}
                    <div className="p-2.5 bg-[#1A0A0A] border border-[#FF5500]/30 rounded text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-[#FFA000] mb-1.5">
                        <span className="w-3.5 h-3.5 bg-[#FFA000]/20 border border-[#FFA000]/40 rounded flex items-center justify-center text-[10px]">!</span>
                        <span className="font-orbitron tracking-wider">PASSPHRASE REQUIRED TO REOPEN</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        This card will be encrypted with AES-256-GCM. <strong className="text-white">You must enter this exact passphrase to mount the card later.</strong> ChronoCard's zero-cloud architecture means <strong className="text-[#FF5500]">there is no recovery option</strong> if the passphrase is lost.
                      </p>
                    </div>
                    <label className="block text-neutral-400 font-mono text-[10px] uppercase">
                      Private Keyphrase
                    </label>
                    <div className="relative">
                      <input
                        type={showPassphrase ? "text" : "password"}
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        placeholder="Enter private unlock password..."
                        className="w-full bg-[#121212] border border-white/20 focus:border-[#FF5500] px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none font-matrix pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassphrase(!showPassphrase)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                      >
                        {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      * ChronoCard zero-cloud architecture cannot recover forgotten keys.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Guarantee Pill */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              <span>Embedded directly into the image file. Fully usable offline.</span>
            </div>
          </div>
        </div>

        {/* ── Modal Footer Controls ── */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#FF6611] disabled:opacity-40 text-black font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,85,0,0.4)] hover:shadow-[0_0_35px_rgba(255,85,0,0.6)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExporting ? "BAKING STEGO CHUNK..." : "DOWNLOAD CHRONOCARD PNG"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
