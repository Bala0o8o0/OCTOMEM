"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  ArrowUp,
  Image as ImageIcon,
  Square,
  Copy,
  Check,
  Globe,
  Sparkles,
  Paperclip,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import type { Message, ToolInvocation } from "ai";
import { MessageTurn } from "@/lib/card/schema";
import { GenerativeUICard } from "./GenerativeUICard";
import { CyberneticThinkingAnimation } from "./CyberneticThinkingAnimation";

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: "image" | "document";
  contentType: string;
  previewUrl?: string; // Data URL for images
  extractedText?: string; // Text extracted from PDF, DOCX, TXT
  pageCount?: number;
  status: "parsing" | "ready" | "error";
  errorMessage?: string;
}

// Support both standard AI SDK Message and ChronoCard MessageTurn
export type ChatItem = (Message | MessageTurn) & {
  toolInvocations?: Array<ToolInvocation>;
  attachments?: any[];
  experimental_attachments?: any[];
};

interface StudioChatConsoleProps {
  messages: ChatItem[];
  input: string;
  attachedFiles: AttachedFile[];
  isStreaming: boolean;
  agentName: string;
  cardTitle: string;
  customCoverUrl?: string | null;
  worldState?: string;
  coreFacts?: string[];
  providerName?: string;
  modelName?: string;
  onInputChange: (val: string) => void;
  onAttachFiles: (files: FileList | File[]) => void;
  onRemoveAttachedFile: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStopStreaming: () => void;
  onUploadImageClick?: () => void;
  onOpenSaveModal: () => void;
  onOpenSettings: () => void;
  onClearChat?: () => void;
  onQuickPrompt?: (prompt: string) => void;
  recentCards?: Array<{
    title: string;
    coverUrl: string;
    turnCount: number;
    timestamp: number;
    cardId: string;
  }>;
  onMountRecentCard?: (card: { title: string; coverUrl: string; turnCount: number; cardId: string }) => void;
}

export const StudioChatConsole: React.FC<StudioChatConsoleProps> = ({
  messages,
  input,
  attachedFiles,
  isStreaming,
  agentName,
  cardTitle,
  customCoverUrl,
  worldState,
  coreFacts = [],
  providerName = "nvidia",
  modelName = "meta/llama-3.1-70b-instruct",
  onInputChange,
  onAttachFiles,
  onRemoveAttachedFile,
  onSubmit,
  onStopStreaming,
  onOpenSaveModal,
  onOpenSettings,
  onClearChat,
  onQuickPrompt,
  recentCards = [],
  onMountRecentCard,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDraggingOverConsole, setIsDraggingOverConsole] = useState(false);

  // Auto-scroll to bottom on new messages or streaming tokens
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, attachedFiles]);

  // Auto-adjust textarea height up to 130px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 130)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const hasParsingFiles = attachedFiles.some((f) => f.status === "parsing");
      if ((input.trim() || attachedFiles.length > 0) && !isStreaming && !hasParsingFiles) {
        onSubmit(e);
      }
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMessageTimestamp = (m: ChatItem): string => {
    const timeVal =
      (m as any).createdAt instanceof Date
        ? (m as any).createdAt
        : (m as any).createdAt
        ? new Date((m as any).createdAt)
        : (m as any).timestamp
        ? new Date((m as any).timestamp)
        : new Date();

    return timeVal.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Drag and drop handler for chat console
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverConsole(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverConsole(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverConsole(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAttachFiles(e.dataTransfer.files);
    }
  };

  const hasParsingAttachments = attachedFiles.some((f) => f.status === "parsing");
  const canSubmit = (input.trim().length > 0 || attachedFiles.length > 0) && !isStreaming && !hasParsingAttachments;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent font-matrix text-[13px]"
    >
      {/* Hidden File Attachment Picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.docx,.txt,.md,.json,.csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAttachFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {/* Drag Over Visual Indicator */}
      {isDraggingOverConsole && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center border-2 border-dashed border-[#FF5500] p-5 pointer-events-none animate-in fade-in duration-100">
          <Paperclip className="w-10 h-10 text-[#FF5500] animate-bounce mb-2" />
          <p className="font-orbitron font-bold text-base text-white tracking-wider">
            ATTACH DOCUMENT OR IMAGE
          </p>
          <p className="text-neutral-400 text-[11px] font-mono mt-1">
            Drop PDFs, Word Docs (.docx), Images, or Code files directly into your prompt
          </p>
        </div>
      )}

      {/* ── 1. Top Rehydration Notice (If restored from card) ── */}
      {(worldState || coreFacts.length > 0) && (
        <div className="w-full bg-[#080808] border-b border-white/[0.08] px-4 sm:px-6 py-2 flex items-center justify-between text-[11px] text-neutral-300 font-mono z-10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 truncate max-w-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
            <span className="text-[#FF5500] font-orbitron text-[10px] tracking-wider uppercase">
              RESTORED CONTEXT:
            </span>
            <span className="truncate text-white font-normal">
              {worldState || "Previous dialogue state loaded"}
            </span>
          </div>
          {coreFacts.length > 0 && (
            <div className="text-[9px] px-2 py-0.5 bg-[#121212] text-[#FF5500] border border-white/[0.10] shrink-0 font-orbitron tracking-wider">
              {coreFacts.length} FACTS ACTIVE
            </div>
          )}
        </div>
      )}

      {/* ── 2. Message Thread Viewport (Crisp, High-Density Proportions) ── */}
      <div
        ref={scrollRef}
        data-chat-scroll-area
        className="flex-1 overflow-y-auto px-4 sm:px-6 select-text relative"
      >
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full py-4 sm:py-5 space-y-4">
          {messages.length === 0 ? (
            /* ── DroneOS Minimal Landing (Crisp & Compact) ── */
            <div className="min-h-[38vh] flex flex-col justify-center items-center text-center py-8 sm:py-14 select-none">
              {/* Electric Orange Star Insignia */}
              <div className="w-10 h-10 bg-[#080808] border border-white/[0.12] flex items-center justify-center text-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.2)] mb-4 relative">
                <svg
                  className="w-5 h-5 text-[#FF5500]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-[28px] font-orbitron font-bold text-white tracking-wide mb-2">
                OCTOMEM STUDIO
              </h1>

              <p className="text-xs sm:text-[13px] text-neutral-400 max-w-md font-matrix leading-relaxed mb-6">
                Type your message below or attach a document or image to analyze. All research and conversation will be baked into your 3D memory card.
              </p>

              {/* Recent Cards Carousel */}
              {recentCards.length > 0 && (
                <div className="w-full max-w-2xl mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-orbitron text-[10px] text-[#FF5500] tracking-wider uppercase">
                      Recent Memory Cards
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">
                      Click to resume
                    </span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: "none" }}>
                    {recentCards.map((card) => (
                      <button
                        key={card.cardId}
                        onClick={() => onMountRecentCard?.(card)}
                        className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 bg-[#080808] border border-white/[0.10] hover:border-[#FF5500]/50 rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-all cursor-pointer group snap-center"
                        title={`Resume: ${card.title} (${card.turnCount} turns)`}
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={card.coverUrl}
                            alt={card.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-left">
                            <p className="text-[10px] font-orbitron text-white truncate">{card.title}</p>
                            <p className="text-[9px] text-neutral-400 font-mono">{card.turnCount} turns</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Minimal Capability Status Line */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Paperclip className="w-3 h-3 text-[#FF5500]" />
                  <span>PDF &amp; Word Docs Ready</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Globe className="w-3 h-3 text-[#FF5500]" />
                  <span>Live Web Scout</span>
                </span>
                <span>•</span>
                <span className="text-neutral-400">Vercel AI SDK</span>
              </div>
            </div>
          ) : (
            /* ── Active Conversation Stream ── */
            messages.map((m, mIdx) => {
              const isUser = m.role === "user";
              const timestampStr = getMessageTimestamp(m);
              const toolInvocations: ToolInvocation[] = (m as any).toolInvocations || [];
              const rawAttachments = (m as any).attachments || (m as any).experimental_attachments || [];
              const isLatestMessage = mIdx === messages.length - 1;
              const isActivelyStreaming = isStreaming && isLatestMessage;

              // Strip prepended document contexts for clean UI readability if present
              const cleanContent = m.content.includes("[USER INQUIRY]\n")
                ? m.content.split("[USER INQUIRY]\n").slice(1).join("[USER INQUIRY]\n")
                : m.content;

              if (isUser) {
                return (
                  <div key={m.id} className="flex justify-end group">
                    <div className="max-w-[88%] sm:max-w-[80%] flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-neutral-400 px-1">
                        <span className="text-[#FF5500] font-orbitron tracking-wider">OPERATOR</span>
                        <span>•</span>
                        <span>{timestampStr}</span>
                      </div>

                      {/* Attached Items Badges for User Message */}
                      {rawAttachments.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1.5 mb-1">
                          {rawAttachments.map((att: any, idx: number) => {
                            const isImg =
                              att.type === "image" ||
                              att.contentType?.startsWith("image/") ||
                              att.url?.startsWith("data:image/");

                            if (isImg && att.url) {
                              return (
                                <div
                                  key={idx}
                                  className="relative group rounded border border-white/20 bg-[#080808] overflow-hidden max-w-[180px] shadow-[0_6px_16px_rgba(0,0,0,0.8)]"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name || "Attachment"}
                                    className="max-h-28 w-auto object-cover rounded"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-black/85 px-1.5 py-0.5 text-[8.5px] font-mono text-neutral-300 truncate">
                                    {att.name || "image"}
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] border border-white/[0.14] text-[11px] font-mono text-neutral-200 shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                              >
                                <FileText className="w-3 h-3 text-[#FF5500] shrink-0" />
                                <span className="text-white text-[10.5px] font-medium truncate max-w-[150px]">
                                  {att.name || "Document"}
                                </span>
                                {att.size && (
                                  <span className="text-[8.5px] text-neutral-400 font-mono">
                                    {(att.size / 1024).toFixed(0)} KB
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* User Text Bubble */}
                      {cleanContent && cleanContent.trim().length > 0 && (
                        <div className="relative bg-[#0D0D0D] border border-white/[0.12] text-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_6px_20px_rgba(0,0,0,0.6)] leading-relaxed text-[13px] sm:text-[13.5px] font-sans" data-message-content={m.id}>
                          {/* Top specular line */}
                          <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                          <div className="whitespace-pre-wrap">{cleanContent}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              /* Assistant Message */
              return (
                <div key={m.id} className="flex gap-2.5 sm:gap-3 items-start max-w-full group">
                  <div className="w-7 h-7 bg-[#080808] border border-white/[0.12] flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,85,0,0.2)]">
                    <svg
                      className="w-3.5 h-3.5 text-[#FF5500]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-300 font-orbitron">
                      <span className="text-[#FF5500] font-orbitron tracking-wider">[OCTOBOT]</span>
                      {agentName &&
                        agentName.trim().toUpperCase() !== "OCTOBOT" &&
                        !agentName.includes("Ã") &&
                        !agentName.toLowerCase().includes("companion") && (
                          <span className="text-white font-mono text-[10.5px]">({agentName})</span>
                        )}
                      {isActivelyStreaming && (
                        <span className="flex items-center gap-0.5 ml-1" title="Generating transmission">
                          <span className="w-1 h-2 rounded-full bg-[#FF5500] animate-pulse" />
                          <span className="w-1 h-3 rounded-full bg-[#FF5500] animate-[pulse_0.8s_infinite]" />
                          <span className="w-1 h-2 rounded-full bg-[#FF5500] animate-[pulse_0.6s_infinite]" />
                        </span>
                      )}
                      <span className="text-[9.5px] text-neutral-500 font-mono">
                        {timestampStr}
                      </span>
                    </div>

                    {/* ── Generative UI Inline Cards (For Tool Calls / Results) ── */}
                    {toolInvocations.length > 0 && (
                      <div className="space-y-1.5">
                        {toolInvocations.map((toolInv) => (
                          <GenerativeUICard
                            key={toolInv.toolCallId}
                            toolInvocation={toolInv}
                            onOpenSaveModal={onOpenSaveModal}
                          />
                        ))}
                      </div>
                    )}

                    {/* ── Cybernetic Thinking Animation (When waiting for initial stream tokens) ── */}
                    {isActivelyStreaming &&
                      (!m.content || m.content.trim().length === 0) &&
                      toolInvocations.length === 0 && (
                        <div className="pt-1">
                          <CyberneticThinkingAnimation />
                        </div>
                      )}

                    {/* ── Assistant Text Stream ── */}
                    {m.content && m.content.trim().length > 0 && (
                      <div className="relative bg-[#080808]/92 border border-white/[0.08] p-3 sm:p-4 text-neutral-200 text-[13px] sm:text-[13.5px] leading-relaxed font-sans whitespace-pre-wrap shadow-[0_6px_24px_rgba(0,0,0,0.5)]" data-message-content={m.id}>
                        {/* Top specular line */}
                        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                        {m.content}
                        {isActivelyStreaming && (
                          <span className="inline-block w-1.5 h-3.5 ml-1.5 bg-[#FF5500] shadow-[0_0_8px_#FF5500] animate-pulse align-middle" />
                        )}
                      </div>
                    )}

                    {m.content && (
                      <div className="pt-0.5 flex items-center gap-2 text-neutral-400">
                        <button
                          type="button"
                          onClick={() => copyMessage(m.id, m.content)}
                          className="px-2 py-0.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-white/[0.10] hover:border-white/20 text-[9.5px] text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Copy message text"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-[#FF5500]" />
                              <span className="text-[#FF5500] text-[9px] font-mono tracking-wider">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span className="text-[9px] font-mono tracking-wider">COPY TEXT</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* ── Pending Assistant Response (When user just asked, before stream chunk arrives) ── */}
          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="flex gap-2.5 sm:gap-3 items-start max-w-full group">
              <div className="w-7 h-7 bg-[#080808] border border-white/[0.12] flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,85,0,0.2)]">
                <svg
                  className="w-3.5 h-3.5 text-[#FF5500]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-300 font-orbitron">
                  <span className="text-[#FF5500] font-orbitron tracking-wider">[OCTOBOT]</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-2 rounded-full bg-[#FF5500] animate-pulse" />
                    <span className="w-1 h-3 rounded-full bg-[#FF5500] animate-[pulse_0.8s_infinite]" />
                    <span className="w-1 h-2 rounded-full bg-[#FF5500] animate-[pulse_0.6s_infinite]" />
                  </span>
                </div>

                <div className="pt-0.5">
                  <CyberneticThinkingAnimation />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. DroneOS Floating Command Chassis (Compact, Zero Artwork Clutter) ── */}
      <footer className="p-3 sm:p-3.5 pt-1.5 bg-gradient-to-t from-black via-black/95 to-transparent shrink-0 relative z-20">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full space-y-2">
          <form
            id="studio-chat-dock"
            onSubmit={onSubmit}
            className="relative bg-[#080808]/95 backdrop-blur-2xl border border-white/[0.10] focus-within:border-white/[0.22] p-2 sm:p-2.5 transition-all flex flex-col gap-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {/* Tether Wire Transmit Port Terminal */}
            <div
              id="studio-chat-port"
              className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#080808] border border-[#FF5500] rounded-full items-center justify-center z-30 shadow-[0_0_8px_#FF5500]"
              title="Chat Pipeline Output Port"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
            </div>

            {/* Top Specular Line */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* ── Attached Files Preview Strip ── */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1 pt-0.5 pb-1.5 border-b border-white/[0.06]">
                {attachedFiles.map((att) => (
                  <div
                    key={att.id}
                    className="relative flex items-center gap-1.5 px-2 py-1 bg-[#121212] border border-white/[0.12] text-[11px] font-mono text-neutral-200 shadow-[0_4px_10px_rgba(0,0,0,0.5)] group"
                  >
                    {att.type === "image" ? (
                      att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="w-4 h-4 object-cover rounded border border-white/20"
                        />
                      ) : (
                        <ImageIcon className="w-3 h-3 text-[#FF5500] shrink-0" />
                      )
                    ) : (
                      <FileText className="w-3 h-3 text-[#FF5500] shrink-0" />
                    )}

                    <div className="flex flex-col min-w-0 max-w-[130px]">
                      <span className="truncate text-white text-[10px] font-medium">{att.name}</span>
                      <span className="text-[8.5px] text-neutral-400 font-mono">
                        {att.status === "parsing" ? (
                          <span className="text-[#FF5500] flex items-center gap-1">
                            <Loader2 className="w-2 h-2 animate-spin inline" />
                            <span>Reading...</span>
                          </span>
                        ) : att.status === "error" ? (
                          <span className="text-red-400">{att.errorMessage || "Parse error"}</span>
                        ) : (
                          `${(att.size / 1024).toFixed(0)} KB${att.pageCount ? ` • ${att.pageCount} pgs` : ""}`
                        )}
                      </span>
                      
                      {/* Parsing Progress Bar for Documents */}
                      {att.status === "parsing" && att.type === "document" && (
                        <div className="w-full h-1 bg-[#0D0D0D] border border-white/10 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF5500] via-[#FFA000] to-[#FF5500] animate-[pulse_1s_ease-in-out_infinite]"
                            style={{ width: "50%" }}
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveAttachedFile(att.id)}
                      className="p-0.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors ml-0.5 cursor-pointer"
                      title="Remove attachment"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                attachedFiles.length > 0
                  ? "Ask anything about the attached files (summarize, extract facts, details)..."
                  : "Ask anything, attach a PDF/Doc/Image, search web, or inspect memory..."
              }
              className="w-full bg-transparent border-none text-white text-xs sm:text-[13px] placeholder-neutral-500 focus:outline-none resize-none px-1.5 py-1 font-matrix leading-relaxed min-h-[36px] max-h-[130px]"
            />

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-1 px-1 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-neutral-400">
                {/* 📎 Attach Document or Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach PDF, Word doc (.docx), image, or text file"
                  className="px-2 py-1 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10.5px] font-mono group"
                >
                  <Paperclip className="w-3 h-3 text-[#FF5500] group-hover:rotate-45 transition-transform" />
                  <span className="hidden sm:inline uppercase text-[9px] tracking-wider">Attach File</span>
                  {attachedFiles.length > 0 && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5500] text-black font-bold text-[8.5px] flex items-center justify-center font-mono">
                      {attachedFiles.length}
                    </span>
                  )}
                </button>

                {/* Model Selector Pill */}
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-2 py-1 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/[0.08] hover:border-white/20 text-neutral-400 hover:text-white text-[9px] font-mono flex items-center gap-1.5 transition-all cursor-pointer group"
                  title="Click to switch AI Model / Provider"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                  {(() => {
                    const provider = providerName || "nvidia";
                    const model = modelName || "";
                    const providerLabels: Record<string, string> = {
                      nvidia: "NVIDIA",
                      openrouter: "OpenRouter",
                      openrouter_llama: "OpenRouter",
                      openai: "OpenAI",
                      custom: "Custom",
                    };
                    const readableModel = model
                      .split("/")
                      .pop()
                      ?.replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Model";
                    return (
                      <>
                        <span className="text-[8px] bg-[#FF5500]/20 text-[#FF5500] px-1.5 py-0.5 rounded font-bold tracking-wider">
                          {providerLabels[provider] || provider.toUpperCase()}
                        </span>
                        <span className="uppercase tracking-wider truncate max-w-[120px]">
                          {readableModel}
                        </span>
                      </>
                    );
                  })()}
                </button>
              </div>

              <div>
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={onStopStreaming}
                    className="px-3 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-200 flex items-center gap-1.5 text-[10px] font-orbitron tracking-wider transition-all cursor-pointer"
                    title="Halt active transmission"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>HALT</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`px-3.5 py-1 flex items-center gap-1 text-[10.5px] font-orbitron font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      canSubmit
                        ? "bg-[#FF5500] hover:bg-[#FF6611] text-black shadow-[0_0_16px_rgba(255,85,0,0.35)] hover:shadow-[0_0_20px_rgba(255,85,0,0.55)]"
                        : "bg-white/10 text-neutral-500 cursor-not-allowed opacity-50"
                    }`}
                    title="Transmit prompt [Enter]"
                  >
                    <span>Transmit</span>
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
};
