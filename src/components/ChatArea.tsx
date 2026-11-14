"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Send,
  Paperclip,
  Moon,
  Sliders,
  MoreVertical,
  Sparkles,
  Maximize2,
  Globe,
  Image as ImageIcon,
  Code2,
  Square,
  Check,
} from "lucide-react";
import { MessageTurn } from "@/lib/card/schema";

interface ChatAreaProps {
  messages: MessageTurn[];
  input: string;
  isStreaming: boolean;
  agentName: string;
  category?: string;
  customCoverUrl?: string | null;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStopStreaming: () => void;
  onUploadImageClick: () => void;
  onSettingsClick: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  input,
  isStreaming,
  agentName,
  category = "Creative • Design • Build",
  customCoverUrl,
  onInputChange,
  onSubmit,
  onStopStreaming,
  onUploadImageClick,
  onSettingsClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePill, setActivePill] = useState<string>("image");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  return (
    <section className="flex-1 h-screen flex flex-col bg-[#0B0813] select-text">
      {/* Center Header Bar */}
      <header className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0E0A18]/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-chrono-pink to-purple-600 p-0.5 shadow-pinkSm shrink-0">
            <div className="w-full h-full bg-[#120B20] rounded-full flex items-center justify-center p-1.5">
              <img
                src="/octomem_logo.png"
                alt="OCTOMEM"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white tracking-wide">
                {agentName || "Autonomous Sentinel Concept"}
              </h2>
              <Sparkles className="w-3.5 h-3.5 text-chrono-pink" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-chrono-pink/15 text-chrono-pink border border-chrono-pink/30 font-medium">
                Active
              </span>
            </div>
            <p className="text-[11px] text-chrono-muted">{category}</p>
          </div>
        </div>

        {/* Right Header Action Icons */}
        <div className="flex items-center gap-2 text-chrono-muted">
          <button
            title="Theme Toggle"
            className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={onSettingsClick}
            title="Settings"
            className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            title="More Options"
            className="p-2 rounded-xl hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id || idx} className="flex gap-3 items-start max-w-3xl">
              {/* Avatar */}
              {isUser ? (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-chrono-pink/20 border border-chrono-pink/40 shrink-0 mt-0.5">
                  <img src="/assets/avatar_user.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-chrono-pink to-purple-600 p-0.5 shrink-0 mt-0.5 shadow-pinkSm">
                  <div className="w-full h-full bg-[#120B20] rounded-full flex items-center justify-center p-1">
                    <img
                      src="/octomem_logo.png"
                      alt="OCTOMEM"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
                    />
                  </div>
                </div>
              )}

              {/* Message Bubble Card */}
              <div className="flex-1 space-y-3">
                <div className="p-4 rounded-2xl bg-[#161024]/90 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-sm">
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* If this is the featured assistant response, render the cinematic card artwork! */}
                  {!isUser && idx === 1 && (
                    <div className="mt-3.5 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl group">
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <img
                          src={customCoverUrl || "/assets/memory-card-artifact.jpg"}
                          alt="Autonomous Sentinel Guardian"
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-3 bg-[#110B1E] flex items-center justify-between text-xs text-chrono-muted border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            Autonomous Sentinel – Guardian of Sovereign Memory
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-1 text-chrono-pink">
                            <Sparkles className="w-3 h-3" />
                            AI Generated
                          </span>
                          <span>•</span>
                          <span>10:26 AM</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp and Delivery Checkmark */}
                  <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-chrono-muted/60">
                    <span>
                      {new Date(m.timestamp || Date.now()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isUser && <Check className="w-3 h-3 text-chrono-pink" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Streaming State */}
        {isStreaming && (
          <div className="flex gap-3 items-start max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-chrono-pink to-purple-600 p-0.5 shrink-0 animate-pulse shadow-pink">
              <div className="w-full h-full bg-[#120B20] rounded-full flex items-center justify-center text-xs">
                🐙
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#161024]/90 border border-chrono-pink/30 text-xs text-chrono-muted flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chrono-pink animate-ping"></div>
              <span>Sentinel is formulating synaptic thoughts...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chat Input Form Area */}
      <footer className="p-4 sm:p-5 border-t border-white/5 bg-[#0E0A18]/95 backdrop-blur-md shrink-0">
        <form onSubmit={onSubmit} className="space-y-2.5 max-w-4xl mx-auto">
          {/* Main Input Box */}
          <div className="p-2.5 rounded-2xl bg-[#161024] border border-white/10 flex items-center gap-2 shadow-inner focus-within:border-chrono-pink/50 transition">
            {/* Paperclip Button for Custom Image Upload */}
            <button
              type="button"
              onClick={onUploadImageClick}
              title="Upload Custom Image to bake into Memory Card"
              className="p-2 rounded-xl text-chrono-muted hover:text-chrono-pink hover:bg-white/5 transition cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-chrono-muted/60 focus:outline-none"
            />

            {/* Expand / Maximize Icon */}
            <button
              type="button"
              className="p-2 text-chrono-muted hover:text-white transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Send / Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="w-9 h-9 rounded-xl bg-chrono-pink/20 text-chrono-pink hover:bg-chrono-pink/30 flex items-center justify-center cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-chrono-pink to-pink-600 hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shadow-pink cursor-pointer transition"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mode Pill Selectors & Character Counter */}
          <div className="flex items-center justify-between text-xs text-chrono-muted px-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActivePill("think")}
                className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                  activePill === "think"
                    ? "bg-chrono-pink/20 text-chrono-pink border border-chrono-pink/30 font-medium"
                    : "bg-white/5 hover:bg-white/10 text-chrono-muted"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>DeepThink</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePill("search")}
                className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                  activePill === "search"
                    ? "bg-chrono-pink/20 text-chrono-pink border border-chrono-pink/30 font-medium"
                    : "bg-white/5 hover:bg-white/10 text-chrono-muted"
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Web Search</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePill("image")}
                className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                  activePill === "image"
                    ? "bg-chrono-pink/20 text-chrono-pink border border-chrono-pink/30 font-medium"
                    : "bg-white/5 hover:bg-white/10 text-chrono-muted"
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Image Gen</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePill("code")}
                className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                  activePill === "code"
                    ? "bg-chrono-pink/20 text-chrono-pink border border-chrono-pink/30 font-medium"
                    : "bg-white/5 hover:bg-white/10 text-chrono-muted"
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Code</span>
              </button>
            </div>

            <span className="text-[11px] text-chrono-muted/60 font-mono">
              {input.length} / 4000
            </span>
          </div>
        </form>
      </footer>
    </section>
  );
};
