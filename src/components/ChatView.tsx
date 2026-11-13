"use client";

import React, { useRef, useEffect } from "react";
import { Send, Sparkles, Square, User } from "lucide-react";
import { MessageTurn } from "@/lib/card/schema";

interface ChatViewProps {
  messages: MessageTurn[];
  input: string;
  isStreaming: boolean;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStopStreaming: () => void;
  worldState?: string;
  coreFacts?: string[];
  agentName?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  input,
  isStreaming,
  onInputChange,
  onSubmit,
  onStopStreaming,
  worldState,
  coreFacts,
  agentName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-[580px] rounded-3xl apple-glass border border-apple-border overflow-hidden">
      {/* Context Banner if rehydrated memory exists */}
      {(worldState || (coreFacts && coreFacts.length > 0)) && (
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-apple-border/60 text-xs text-apple-subtext flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-apple-blue"></span>
            <span>
              Memory Context: <strong className="text-apple-text">{worldState || "Active State"}</strong>
            </span>
          </div>
          {coreFacts && coreFacts.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-apple-subtext">
              {coreFacts.length} Facts Indexed
            </span>
          )}
        </div>
      )}

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-apple-subtext space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-apple-border flex items-center justify-center text-apple-blue">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-white">
              Start Conversation with {agentName || "AI Partner"}
            </h3>
            <p className="text-xs max-w-sm leading-relaxed">
              Every message stays strictly in this session until you export your portable PNG memory card.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 items-start ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role !== "user" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-apple-blue to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div
                className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-apple-blue text-white rounded-tr-sm shadow-md"
                    : "apple-glass-card text-apple-text rounded-tl-sm border border-apple-border/80"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-apple-subtext text-xs shrink-0 border border-apple-border">
                  <User className="w-3.5 h-3.5 text-apple-text" />
                </div>
              )}
            </div>
          ))
        )}

        {isStreaming && (
          <div className="flex gap-3 items-start justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-apple-blue to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="p-3.5 rounded-2xl apple-glass-card rounded-tl-sm text-xs text-apple-subtext flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-apple-blue animate-ping"></div>
              <span>Generating response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={onSubmit} className="p-3 sm:p-4 bg-apple-bg/80 border-t border-apple-border">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-apple-border rounded-2xl pl-4 pr-24 py-3 text-xs sm:text-sm text-white placeholder-apple-subtext focus:outline-none focus:border-apple-blue/80 transition-all shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="apple-button p-2 rounded-xl bg-apple-red/20 text-apple-red hover:bg-apple-red/30 text-xs font-medium cursor-pointer"
                title="Stop Streaming"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="apple-button px-4 py-2 bg-apple-blue hover:bg-apple-blueHover disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
