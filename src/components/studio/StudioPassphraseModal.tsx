"use client";

import React, { useState } from "react";
import { Lock, X, Eye, EyeOff, ShieldAlert, Unlock, KeyRound } from "lucide-react";

interface StudioPassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passphrase: string) => void;
  error?: string | null;
}

export const StudioPassphraseModal: React.FC<StudioPassphraseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  error,
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;
    onSubmit(passphrase.trim());
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl font-matrix animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#080808] border border-white/[0.12] p-6 sm:p-7 shadow-[0_24px_90px_rgba(0,0,0,0.98)] space-y-5"
      >
        {/* Top Specular Line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative w-10 h-10 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(255,85,0,0.25)]">
              <img
                src="/octomem_logo.png"
                alt="OCTOMEM Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
              />
              <span className="absolute -bottom-1 -right-1 bg-black p-0.5 border border-[#FF5500]/60 rounded-full">
                <Lock className="w-2.5 h-2.5 text-[#FF5500]" />
              </span>
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-base sm:text-lg text-white tracking-wide">
                UNLOCK ENCRYPTED CARTRIDGE
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono tracking-wide">
                AES-256-GCM HARDWARE CIPHER DECRYPTION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="space-y-4 relative z-10">
          <p className="text-xs text-neutral-300 leading-relaxed font-matrix bg-[#0D0D0D] p-3 border border-white/[0.08]">
            This memory card is protected by client-side AES-256-GCM steganography. Enter your private passphrase to authenticate and unpack your dialogue memory.
          </p>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                Cryptographic Keyphrase
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <KeyRound className="w-4 h-4 text-[#FF5500]" />
                </div>
                <input
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter decrypt keyphrase..."
                  autoFocus
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] pl-9 pr-9 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
                  title={showPassphrase ? "Hide Key" : "Show Key"}
                >
                  {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/10 text-neutral-300 font-mono uppercase tracking-wider text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!passphrase.trim()}
                className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#FF6611] disabled:opacity-40 text-black font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4 stroke-[2.5]" />
                <span>DECRYPT & MOUNT</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
