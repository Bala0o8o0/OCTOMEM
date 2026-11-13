"use client";

import React from "react";
import { Plus, Home, Layers, UploadCloud, Sliders, MessageSquare, ArrowRight } from "lucide-react";

interface SidebarProps {
  activeChatTitle: string;
  onNewChat: () => void;
  onImportClick: () => void;
  onSettingsClick: () => void;
  onSaveCardClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeChatTitle,
  onNewChat,
  onImportClick,
  onSettingsClick,
  onSaveCardClick,
}) => {
  const recentChats = [
    { id: "1", title: "Autonomous Sentinel Concept", time: "2m ago", active: true },
    { id: "2", title: "Syndicate Suits Brand", time: "1h ago", active: false },
    { id: "3", title: "Kokooi Rolling Papers", time: "3h ago", active: false },
    { id: "4", title: "AI Terminal Idea", time: "5h ago", active: false },
    { id: "5", title: "Inbox Kingdom Game", time: "1d ago", active: false },
    { id: "6", title: "Video to UI SaaS", time: "2d ago", active: false },
  ];

  return (
    <aside className="w-64 shrink-0 h-screen flex flex-col justify-between p-4 bg-[#0E0A18] border-r border-white/5 select-none overflow-y-auto">
      {/* Top Branding & Main Actions */}
      <div className="space-y-5">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-chrono-pink to-purple-600 p-0.5 flex items-center justify-center shadow-pinkSm">
            <div className="w-full h-full bg-[#0E0A18] rounded-[10px] flex items-center justify-center">
              {/* Hexagon C Icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-chrono-pink fill-current">
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 3.2L18.5 8 12 11.8 5.5 8 12 5.2zM5 9.7l6 3.5v6.5l-6-3.3V9.7zm8 10v-6.5l6-3.5v6.7l-6 3.3z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wider text-white">CHRONOCARD AI</h1>
            <p className="text-[10px] tracking-widest uppercase text-chrono-muted font-medium">
              MEMORY LIVES IN CARDS
            </p>
          </div>
        </div>

        {/* New Chat Primary Button */}
        <button
          onClick={onNewChat}
          className="chrono-btn w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-chrono-pink to-pink-600 hover:brightness-110 text-white font-medium text-xs flex items-center justify-between shadow-pink cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/20 text-white/80 font-mono">
            Ctrl N
          </span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1 text-xs">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white bg-white/5 font-medium transition cursor-pointer">
            <Home className="w-4 h-4 text-chrono-pink" />
            <span>Home</span>
          </button>

          <button
            onClick={onSaveCardClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-chrono-muted hover:text-white hover:bg-white/[0.03] transition cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>My Cards</span>
          </button>

          <button
            onClick={onImportClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-chrono-muted hover:text-white hover:bg-white/[0.03] transition cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Card</span>
          </button>

          <button
            onClick={onSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-chrono-muted hover:text-white hover:bg-white/[0.03] transition cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Recent Chats Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-semibold tracking-wider text-chrono-muted/70 uppercase">
            <span>Recent Chats</span>
          </div>

          <div className="space-y-1">
            {recentChats.map((c) => (
              <button
                key={c.id}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition group cursor-pointer ${
                  c.title === activeChatTitle || (c.active && activeChatTitle === "Autonomous Sentinel Concept")
                    ? "bg-chrono-pink/15 text-white border border-chrono-pink/30 font-medium"
                    : "text-chrono-muted hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-chrono-pink/20 text-chrono-pink flex items-center justify-center text-[10px] shrink-0">
                    🐙
                  </div>
                  <div className="truncate">
                    <div className="truncate leading-tight">{c.title}</div>
                    <div className="text-[10px] text-chrono-muted/60">{c.time}</div>
                  </div>
                </div>
                {(c.title === activeChatTitle || (c.active && activeChatTitle === "Autonomous Sentinel Concept")) && (
                  <span className="w-2 h-2 rounded-full bg-chrono-pink shadow-pinkSm shrink-0"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Promo Card: "Save your best chats" */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1C122C] to-[#120B20] border border-white/5 space-y-2 mt-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-10 rounded-lg bg-chrono-pink/20 border border-chrono-pink/40 flex items-center justify-center text-chrono-pink text-xs shadow-pinkSm">
            🎴
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white">Save your best chats</h4>
            <p className="text-[10px] text-chrono-muted leading-tight mt-0.5">
              Turn conversations into collectible memory cards.
            </p>
          </div>
        </div>

        <button
          onClick={onSaveCardClick}
          className="chrono-btn w-full mt-1 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-chrono-pink hover:text-pink-300 border border-chrono-pink/20 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Create Card</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
