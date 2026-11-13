"use client";

import React, { useState, useRef } from "react";
import { X, Lock, Download, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { MessageTurn } from "@/lib/card/schema";
import { convertImageToPngBase64 } from "@/lib/card/image-utils";

interface SaveCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageTurn[];
  worldState?: string;
  coreFacts?: string[];
  initialAgentName?: string;
  initialCardTitle?: string;
  initialCoverBase64?: string | null;
  initialCoverUrl?: string | null;
}

export const SaveCardModal: React.FC<SaveCardModalProps> = ({
  isOpen,
  onClose,
  messages,
  worldState,
  coreFacts = [],
  initialAgentName = "ChronoCard Archivist",
  initialCardTitle = "Saved Dialogue",
  initialCoverBase64,
  initialCoverUrl,
}) => {
  const [cardTitle, setCardTitle] = useState(initialCardTitle);
  const [agentName, setAgentName] = useState(initialAgentName);
  const [enableEncryption, setEnableEncryption] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [coverBase64, setCoverBase64] = useState<string | null>(initialCoverBase64 || null);
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl || null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const pngBase64 = await convertImageToPngBase64(file);
      setCoverBase64(pngBase64);
      setCoverUrl(URL.createObjectURL(file));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process image";
      setError(msg);
    }
  };

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
          agentName: agentName.trim() || "Archivist",
          cardTitle: cardTitle.trim() || "ChronoCard Memory",
          messages,
          worldState,
          coreFacts,
          passphrase: enableEncryption ? passphrase.trim() : undefined,
          customImageBase64: coverBase64 || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl apple-glass border border-apple-border p-6 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-apple-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-apple-blue flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-white">Export Memory Card</h3>
              <p className="text-[11px] text-apple-subtext">Embeds conversation into a PNG file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-apple-subtext hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-xs">
          {/* Cover Art Preview & Selector */}
          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Card Cover Artwork</label>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-apple-border">
              {coverUrl ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 shadow">
                  <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-apple-border flex items-center justify-center text-apple-subtext shrink-0">
                  <ImageIcon className="w-5 h-5 text-apple-subtext" />
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-white">
                  {coverUrl ? "Custom Image Selected" : "Default Apple Glass Card"}
                </div>
                <p className="text-[11px] text-apple-subtext">
                  {coverUrl
                    ? "Your memory will be baked into this exact image."
                    : "Upload any custom photo, anime art, or wallpaper."}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="apple-button px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-apple-text border border-apple-border text-[11px] font-medium cursor-pointer"
              >
                {coverUrl ? "Change" : "Upload"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="e.g. Orbital Defense Strategy"
              className="w-full bg-white/5 border border-apple-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-apple-blue"
            />
          </div>

          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Persona / Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Kaelen, Neural Archivist"
              className="w-full bg-white/5 border border-apple-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-apple-blue"
            />
          </div>

          {/* Encryption Toggle */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-apple-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-apple-green" />
                <span className="font-medium text-white">AES-256-GCM Encryption</span>
              </div>
              <input
                type="checkbox"
                checked={enableEncryption}
                onChange={(e) => setEnableEncryption(e.target.checked)}
                className="w-4 h-4 rounded accent-apple-blue cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-apple-subtext">
              Derives a 256-bit key via scrypt. Without the passphrase, the card cannot be read.
            </p>

            {enableEncryption && (
              <div className="relative pt-1">
                <input
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter secret passphrase..."
                  className="w-full bg-black/40 border border-apple-border rounded-xl px-3 pr-10 py-2 text-white focus:outline-none focus:border-apple-blue"
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

          {/* Stats Preview */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-apple-border/60 text-[11px] text-apple-subtext flex justify-between">
            <span>Turns to package: <strong className="text-white">{messages.length}</strong></span>
            <span>Zero-DB portable export</span>
          </div>

          {error && (
            <div className="text-apple-red text-xs bg-apple-red/10 border border-apple-red/20 p-2.5 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="apple-button w-full py-2.5 bg-apple-blue hover:bg-apple-blueHover disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-apple-blue/20"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Bake & Download PNG Card</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
