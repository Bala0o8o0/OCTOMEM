"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Sparkles, Image as ImageIcon, Square, Download, HardDrive } from "lucide-react";
import { MessageTurn } from "@/lib/card/schema";

interface AppleChatProps {
  messages: MessageTurn[];
  input: string;
  isStreaming: boolean;
  agentName: string;
  cardTitle: string;
  customCoverUrl?: string | null;
  worldState?: string;
  coreFacts?: string[];
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStopStreaming: () => void;
  onUploadImageClick: () => void;
  onOpenSaveModal: () => void;
}

export const AppleChat: React.FC<AppleChatProps> = ({
  messages,
  input,
  isStreaming,
  agentName,
  cardTitle,
  customCoverUrl,
  worldState,
  coreFacts = [],
  onInputChange,
  onSubmit,
  onStopStreaming,
  onUploadImageClick,
  onOpenSaveModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  return (
    <section className="w-full max-w-3xl mx-auto flex flex-col h-[75vh] min-h-[520px] max-h-[720px] glass-panel rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Top Bar of the Card */}
      <header className="px-5 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Card Avatar / Image Thumbnail */}
          {customCoverUrl ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/15 bg-black shrink-0 shadow">
              <img src={customCoverUrl} alt="Card Cover" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-apple-blue to-purple-600 flex items-center justify-center text-white shrink-0 shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-white truncate">{cardTitle}</h2>
            <p className="text-[11px] text-apple-subtext truncate flex items-center gap-1.5">
              <span>{agentName}</span>
              {worldState && (
                <>
                  <span>•</span>
                  <span className="text-apple-emerald font-medium">Memory Active</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUploadImageClick}
            title="Change Card Picture"
            className="apple-btn px-2.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-apple-subtext hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-apple-blue" />
            <span className="hidden sm:inline">Image</span>
          </button>

          <button
            onClick={onOpenSaveModal}
            className="apple-btn px-3.5 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-apple-blueGlow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Card</span>
          </button>
        </div>
      </header>

      {/* Memory Context Banner (If rehydrated context exists) */}
      {(worldState || coreFacts.length > 0) && (
        <div className="px-5 py-2 bg-apple-blue/[0.08] border-b border-apple-blue/20 text-xs text-apple-subtext flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <HardDrive className="w-3.5 h-3.5 text-apple-blue shrink-0" />
            <span className="truncate">
              Restored Context: <strong className="text-white">{worldState || "Previous dialogue"}</strong>
            </span>
          </div>
          {coreFacts.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-apple-blue/20 text-blue-200 font-mono shrink-0">
              {coreFacts.length} Facts
            </span>
          )}
        </div>
      )}

      {/* Conversation Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 items-end ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3.5 sm:p-4 rounded-3xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-apple-blue text-white rounded-br-sm shadow-md"
                    : "glass-panel text-apple-text rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          );
        })}

        {/* Streaming State */}
        {isStreaming && (
          <div className="flex gap-2.5 items-end justify-start">
            <div className="p-3.5 rounded-3xl glass-panel rounded-bl-sm text-xs text-apple-subtext flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-apple-blue animate-ping"></div>
              <span>Formulating reply...</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Apple Messages Style Input Bar */}
      <footer className="p-3 sm:p-4 bg-white/[0.02] border-t border-white/10 shrink-0">
        <form onSubmit={onSubmit} className="relative flex items-center">
          {/* Photo Attachment Button */}
          <button
            type="button"
            onClick={onUploadImageClick}
            title="Upload or change image"
            className="apple-btn absolute left-2.5 p-2 rounded-full text-apple-subtext hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-apple-blue" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/[0.05] border border-white/10 rounded-full pl-11 pr-12 py-3 text-xs sm:text-sm text-white placeholder-apple-muted focus:outline-none focus:border-apple-blue/80 focus:bg-white/[0.08] transition-all shadow-inner"
          />

          {/* Send / Cancel Button */}
          <div className="absolute right-2 flex items-center">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="apple-btn w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center cursor-pointer"
                title="Stop streaming"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="apple-btn w-8 h-8 rounded-full bg-apple-blue hover:bg-apple-blueHover disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shadow-md shadow-apple-blueGlow cursor-pointer transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </footer>
    </section>
  );
};
