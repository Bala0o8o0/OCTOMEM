"use client";

import React, { useState } from "react";
import { Lock, X, Key, Eye, EyeOff } from "lucide-react";

interface PassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passphrase: string) => void;
  error?: string | null;
}

export const PassphraseModal: React.FC<PassphraseModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl apple-glass border border-apple-border p-6 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-apple-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-apple-green/20 text-apple-green flex items-center justify-center border border-apple-green/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-white">Unlock ChronoCard</h3>
              <p className="text-[11px] text-apple-subtext">AES-256-GCM Encrypted</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-apple-subtext hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-apple-subtext leading-relaxed">
          This PNG memory card is protected by a cryptographic passphrase. Enter it below to authenticate and unpack your dialogue memory.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter card passphrase..."
              autoFocus
              className="w-full bg-white/5 border border-apple-border rounded-xl pl-8 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-apple-blue"
            />
            <Key className="w-3.5 h-3.5 text-apple-subtext absolute left-2.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute right-3 top-3 text-apple-subtext hover:text-white"
            >
              {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {error && (
            <div className="text-apple-red text-xs bg-apple-red/10 border border-apple-red/20 p-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={!passphrase.trim()}
              className="apple-button w-full py-2.5 bg-apple-blue hover:bg-apple-blueHover disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-apple-blue/20"
            >
              Authenticate & Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
