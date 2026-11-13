"use client";

import React, { useState, useRef } from "react";
import { HardDrive, UploadCloud, CheckCircle2, XCircle, Image as ImageIcon, Sparkles } from "lucide-react";
import { ChronoCardPayloadV1 } from "@/lib/card/schema";

interface CartridgeDockProps {
  mountedCard: ChronoCardPayloadV1 | null;
  coverImageUrl?: string | null;
  onMountCard: (card: ChronoCardPayloadV1, file: File) => void;
  onSetCustomCover: (file: File) => void;
  onEjectCard: () => void;
  onPassphraseNeeded: (file: File) => void;
}

export const CartridgeDock: React.FC<CartridgeDockProps> = ({
  mountedCard,
  coverImageUrl,
  onMountCard,
  onSetCustomCover,
  onEjectCard,
  onPassphraseNeeded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File, passphrase?: string) => {
    const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name);
    if (!isImage) {
      setError("Please drop an image file (.png, .jpg, .webp).");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    const formData = new FormData();
    formData.append("file", file);
    if (passphrase) {
      formData.append("passphrase", passphrase);
    }

    try {
      const res = await fetch("/api/card/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 401 && data.requiresPassphrase) {
        setLoading(false);
        onPassphraseNeeded(file);
        return;
      }

      if (res.status === 422) {
        // This is a normal image without an embedded memory chunk!
        // We set it as the custom cover art for their new memory card!
        onSetCustomCover(file);
        setNotice(`Custom artwork "${file.name}" set! When you click Save Card, your memory will be baked into this picture.`);
        setLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to parse memory card.");
        setLoading(false);
        return;
      }

      // Successfully restored previous memory card!
      onMountCard(data.payload, file);
      setLoading(false);
    } catch {
      setError("Network or file upload error.");
      setLoading(false);
    }
  };

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
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <section className="w-full space-y-2">
      {mountedCard || coverImageUrl ? (
        /* Mounted State Card with Custom Image Preview */
        <div className="p-4 sm:p-5 rounded-2xl apple-glass border border-apple-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {coverImageUrl ? (
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-lg bg-black relative">
                <img
                  src={coverImageUrl}
                  alt="Card Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-apple-blue to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-white">
                  {mountedCard ? mountedCard.metadata.cardTitle : "New Memory Card Session"}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green border border-apple-green/20 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {mountedCard ? "Context Rehydrated" : "Custom Art Loaded"}
                </span>
              </div>
              <p className="text-xs text-apple-subtext mt-0.5">
                {mountedCard ? (
                  <>
                    Persona: <strong className="text-apple-text">{mountedCard.metadata.agentName}</strong> •{" "}
                    {mountedCard.state.recentMessages.length} turns restored
                  </>
                ) : (
                  <>Your custom image is ready. Chat and click <strong>Save Card</strong> to bake memory into it.</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="apple-button px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-apple-text border border-apple-border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-apple-blue" />
              <span>Change Image</span>
            </button>
            <button
              onClick={onEjectCard}
              className="apple-button px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-apple-red border border-apple-border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Eject</span>
            </button>
          </div>
        </div>
      ) : (
        /* Unified Dropzone: Drop existing memory card OR drop fresh picture */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-200 text-center cursor-pointer ${
            isDragging
              ? "border-apple-blue bg-apple-blue/10 scale-[1.01]"
              : "border-apple-border hover:border-white/20 bg-apple-card"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="w-10 h-10 mx-auto rounded-2xl bg-white/5 border border-apple-border flex items-center justify-center text-apple-subtext mb-2.5">
            {loading ? (
              <div className="w-4 h-4 border-2 border-apple-blue border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <UploadCloud className="w-5 h-5 text-apple-subtext" />
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium text-apple-text">
            {loading ? "Inspecting Image Chunks..." : "Drop Any Image (Resume Chat or Set Custom Card Art)"}
          </div>
          <p className="text-[11px] text-apple-subtext mt-1">
            Drop a previously saved card to <strong>resume where you left off</strong>, or drop <strong>your own photo/art</strong> to create a new card cover.
          </p>

          {error && (
            <div className="mt-3 text-xs text-apple-red bg-apple-red/10 border border-apple-red/20 px-3 py-1.5 rounded-xl inline-block">
              {error}
            </div>
          )}
        </div>
      )}

      {notice && (
        <div className="text-xs text-apple-blue bg-apple-blue/10 border border-apple-blue/20 px-3.5 py-2 rounded-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}
    </section>
  );
};
