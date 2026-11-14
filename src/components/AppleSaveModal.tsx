"use client";

import React, { useState } from "react";
import { X, Lock, Download, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { MessageTurn } from "@/lib/card/schema";

interface AppleSaveModalProps {
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

export const AppleSaveModal: React.FC<AppleSaveModalProps> = ({
  isOpen,
  onClose,
  messages,
  worldState,
  coreFacts = [],
  initialAgentName = "AI Companion",
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

  if (!isOpen) return null;

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
          agentName: agentName.trim() || "Companion",
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

      // Download PNG file directly
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to download card";
      setError(message);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-semibold text-base text-white">Save Memory Card</h3>
            <p className="text-xs text-apple-subtext">Embeds your conversation into the image</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-apple-subtext hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-xs">
          {/* Cover Art Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            {customCoverUrl ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/15 bg-black shrink-0 shadow">
                <img src={customCoverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-md shadow-orange-500/10">
                <img
                  src="/octomem_logo.png"
                  alt="OCTOMEM Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-white">
                {customCoverUrl ? "Custom Image Attached" : "Default Apple Glass Card"}
              </div>
              <p className="text-[11px] text-apple-subtext">
                Your entire conversation memory will be baked into this file.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="e.g. Creative Project Notes"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-apple-blue"
            />
          </div>

          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Persona Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Aria"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-apple-blue"
            />
          </div>

          {/* Optional Password Protection */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-apple-emerald" />
                <span className="font-medium text-white">Password Protection (AES-256)</span>
              </div>
              <input
                type="checkbox"
                checked={enableEncryption}
                onChange={(e) => setEnableEncryption(e.target.checked)}
                className="w-4 h-4 rounded accent-apple-blue cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-apple-subtext leading-relaxed">
              Without the password, no one else can read or restore this memory card.
            </p>

            {enableEncryption && (
              <div className="relative pt-1">
                <input
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter secret password..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 pr-10 py-2 text-white focus:outline-none focus:border-apple-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-3 text-apple-subtext hover:text-white"
                >
                  {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-[11px] text-apple-subtext px-1">
            <span>Turns to embed: <strong className="text-white">{messages.length}</strong></span>
            <span>Zero cloud storage</span>
          </div>

          {error && (
            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="pt-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="apple-btn w-full py-2.5 bg-apple-blue hover:bg-apple-blueHover disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-apple-blueGlow"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Bake & Download Image Card ↓</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
