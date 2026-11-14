"use client";

import React, { useState } from "react";
import {
  Globe,
  ExternalLink,
  Search,
  BookOpen,
  Cpu,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Radio,
  Copy,
  Check,
  Save,
} from "lucide-react";
import type { ToolInvocation } from "ai";

interface GenerativeUICardProps {
  toolInvocation: ToolInvocation;
  onOpenSaveModal?: () => void;
}

export const GenerativeUICard: React.FC<GenerativeUICardProps> = ({
  toolInvocation,
  onOpenSaveModal,
}) => {
  const { toolName, state } = toolInvocation;
  const isComplete = state === "result";
  const result = isComplete ? (toolInvocation as any).result : null;
  const args = (toolInvocation as any).args || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. IN-FLIGHT / CALLING STATE (Active Radar HUD)
  // ─────────────────────────────────────────────────────────────
  if (!isComplete) {
    return (
      <div className="my-2.5 relative bg-[#080808] border border-white/[0.12] p-3 text-xs font-mono shadow-[0_6px_20px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Specular line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-[#FF5500] font-orbitron tracking-wider text-[10px]">
            <Radio className="w-3 h-3 animate-pulse text-[#FF5500]" />
            <span>AGENT TOOL EXECUTING</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-neutral-400">
            <span className="w-1 h-1 rounded-full bg-[#FF5500] animate-ping" />
            <span className="uppercase">{toolName}</span>
          </div>
        </div>

        <div className="bg-[#0D0D0D] border border-white/[0.06] p-2 flex items-center justify-between text-neutral-300 text-[11px]">
          <div className="flex items-center gap-2 truncate">
            {toolName === "browseWeb" && <Search className="w-3 h-3 text-[#FF5500] shrink-0" />}
            {toolName === "fetchWebPage" && <Globe className="w-3 h-3 text-[#FF5500] shrink-0" />}
            {toolName === "inspectMemoryState" && <Cpu className="w-3 h-3 text-[#FF5500] shrink-0" />}
            {toolName === "updateCompanionMemory" && <Sparkles className="w-3 h-3 text-[#FF5500] shrink-0" />}
            <span className="truncate">
              {toolName === "browseWeb" && `Searching web: "${args?.query || "..."}"`}
              {toolName === "fetchWebPage" && `Reading: ${args?.url || "..."}`}
              {toolName === "inspectMemoryState" && "Analyzing memory cartridge..."}
              {toolName === "updateCompanionMemory" && "Staging fact to cartridge..."}
              {toolName === "getSystemTelemetry" && "Querying clock telemetry..."}
              {!["browseWeb", "fetchWebPage", "inspectMemoryState", "updateCompanionMemory", "getSystemTelemetry"].includes(toolName) &&
                `Dispatching ${toolName}...`}
            </span>
          </div>

          <div className="flex items-center gap-0.5 shrink-0 pl-2">
            <span className="w-1 h-2.5 bg-[#FF5500] animate-[pulse_0.6s_infinite]" />
            <span className="w-1 h-2.5 bg-[#FF5500] animate-[pulse_0.9s_infinite]" />
            <span className="w-1 h-2.5 bg-[#FF5500] animate-[pulse_0.7s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. RESOLVED: browseWeb Tool (Generative Search Results Card)
  // ─────────────────────────────────────────────────────────────
  if (toolName === "browseWeb") {
    const results: Array<{ title: string; url: string; domain: string; snippet: string }> =
      result?.results || [];

    return (
      <div className="my-2.5 relative bg-[#080808]/95 border border-white/[0.12] p-3 sm:p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.85)] font-matrix space-y-2.5">
        {/* Specular line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center text-[#FF5500] shadow-[0_0_10px_rgba(255,85,0,0.25)]">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-semibold text-[11px] tracking-wider text-white">
                  WEB SCOUT INTELLIGENCE
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30 font-mono">
                  {results.length} SOURCES
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono truncate max-w-xs sm:max-w-md">
                Query: &quot;{args?.query || result?.query}&quot;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
              className="p-1 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Copy results JSON"
            >
              {copied ? <Check className="w-2.5 h-2.5 text-[#FF5500]" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-1.5 py-0.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-white/10 text-[9px] text-neutral-400 hover:text-white font-mono flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? "COMPACT" : "VIEW ALL"}</span>
              {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-1.5">
          {(isExpanded ? results : results.slice(0, 3)).map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-2.5 bg-[#0D0D0D] hover:bg-[#121212] border border-white/[0.08] hover:border-white/20 transition-all text-left relative"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#FF5500] uppercase tracking-wider bg-[#080808] px-1 py-0.2 border border-white/[0.08]">
                      {item.domain}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">#{idx + 1}</span>
                  </div>
                  <h4 className="text-[12px] sm:text-[12.5px] font-semibold text-white group-hover:text-[#FF5500] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-[#FF5500] shrink-0 transition-colors mt-1" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-0.5 flex items-center justify-between text-[9px] font-mono text-neutral-500">
          <span>SOURCE: {result?.source || "DuckDuckGo Web Index"}</span>
          <span>AUTONOMOUS SCOUT COMPLETE</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. RESOLVED: fetchWebPage Tool (Deep Page Reader Card)
  // ─────────────────────────────────────────────────────────────
  if (toolName === "fetchWebPage") {
    return (
      <div className="my-2.5 relative bg-[#080808]/95 border border-white/[0.12] p-3 sm:p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.85)] font-matrix space-y-2">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center text-[#FF5500]">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-semibold text-[11px] tracking-wider text-white">
                  SOURCE INSPECTOR
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30 font-mono">
                  HTTP {result?.status || 200}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono truncate max-w-xs sm:max-w-sm">
                {result?.domain || args?.url}
              </p>
            </div>
          </div>

          <a
            href={result?.url || args?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-white/10 text-[9.5px] font-mono text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>VISIT SITE</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="p-2.5 bg-[#0D0D0D] border border-white/[0.06] space-y-1.5">
          <h4 className="text-[11.5px] font-semibold text-white font-orbitron">{result?.title || "Page Excerpt"}</h4>
          <p className="text-[11.5px] text-neutral-300 font-matrix leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
            {result?.excerpt || "No text available."}
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. RESOLVED: inspectMemoryState Tool (Stego Diagnostic Card)
  // ─────────────────────────────────────────────────────────────
  if (toolName === "inspectMemoryState") {
    return (
      <div className="my-2.5 relative bg-[#080808]/95 border border-white/[0.12] p-3 sm:p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.85)] font-matrix space-y-2.5">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center p-1">
              <img
                src="/octomem_logo.png"
                alt="OCTOMEM"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
              />
            </div>
            <div>
              <span className="font-orbitron font-semibold text-[11px] tracking-wider text-white">
                OCTOMEM TELEMETRY
              </span>
              <p className="text-[10px] text-neutral-400 font-mono">
                {result?.stegoFormat || "ISO/IEC 15948:2004 PNG chunk"}
              </p>
            </div>
          </div>

          <div className="text-[9px] px-2 py-0.5 bg-[#121212] text-[#FF5500] border border-white/[0.10] font-orbitron">
            {result?.cipher || "AES-256-GCM"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
          <div className="p-2 bg-[#0D0D0D] border border-white/[0.06] space-y-0.5">
            <span className="text-[9px] text-neutral-500 uppercase">World State:</span>
            <p className="text-white truncate">{result?.worldState || "Active Conversation"}</p>
          </div>
          <div className="p-2 bg-[#0D0D0D] border border-white/[0.06] space-y-0.5">
            <span className="text-[9px] text-neutral-500 uppercase">Active Core Facts:</span>
            <p className="text-[#FF5500] font-bold">{result?.coreFactsCount ?? 0} Facts Loaded</p>
          </div>
        </div>

        {Array.isArray(result?.coreFacts) && result.coreFacts.length > 0 && (
          <div className="p-2.5 bg-[#0D0D0D] border border-white/[0.06] space-y-1">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Established Facts:</span>
            <ul className="space-y-0.5 text-[11px] text-neutral-300 font-mono">
              {result.coreFacts.map((fact: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-[#FF5500]">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[9px] font-mono text-neutral-500 flex items-center justify-between">
          <span>ZERO CLOUD RETENTION • CLIENT RAM ONLY</span>
          <span>STATUS: SECURE</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 5. RESOLVED: updateCompanionMemory Tool (Memory Update Card)
  // ─────────────────────────────────────────────────────────────
  if (toolName === "updateCompanionMemory") {
    return (
      <div className="my-2.5 relative bg-[#080808]/95 border border-[#FF5500]/40 p-3 sm:p-3.5 shadow-[0_8px_24px_rgba(255,85,0,0.15)] font-matrix space-y-2">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/40 to-transparent" />

        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#121212] border border-[#FF5500]/50 flex items-center justify-center text-[#FF5500]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-orbitron font-semibold text-[11px] tracking-wider text-white">
                MEMORY CARTRIDGE STAGED
              </span>
              <p className="text-[10px] text-neutral-400 font-mono">
                {result?.action === "add_fact" ? "New Core Fact Retained" : "World State Updated"}
              </p>
            </div>
          </div>

          {onOpenSaveModal && (
            <button
              type="button"
              onClick={onOpenSaveModal}
              className="px-2 py-0.5 bg-[#FF5500] hover:bg-[#FF6611] text-black text-[9.5px] font-orbitron font-bold flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(255,85,0,0.3)] cursor-pointer"
            >
              <Save className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>SAVE TO PNG</span>
            </button>
          )}
        </div>

        <div className="p-2 bg-[#0D0D0D] border border-white/[0.08] text-[11px] font-mono text-neutral-200 space-y-0.5">
          {result?.fact && (
            <p>
              <span className="text-[#FF5500] font-semibold">FACT: </span>
              {result.fact}
            </p>
          )}
          {result?.newWorldState && (
            <p>
              <span className="text-[#FF5500] font-semibold">WORLD STATE: </span>
              {result.newWorldState}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 6. RESOLVED: getSystemTelemetry Tool (System Telemetry Card)
  // ─────────────────────────────────────────────────────────────
  if (toolName === "getSystemTelemetry") {
    return (
      <div className="my-2.5 relative bg-[#080808]/95 border border-white/[0.12] p-3 font-matrix space-y-1.5 text-[11px] font-mono">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 text-white font-orbitron text-[11px]">
            <Clock className="w-3 h-3 text-[#FF5500]" />
            <span>SYSTEM CHRONO TELEMETRY</span>
          </div>
          <span className="text-[9px] text-[#FF5500]">{result?.entropyStatus || "CSPRNG OK"}</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-neutral-300 text-[10.5px]">
          <div>Time: {result?.localTime}</div>
          <div>Date: {result?.localDate}</div>
          <div>Zone: {result?.timezone}</div>
          <div>Core: {result?.architecture}</div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 7. GENERIC TOOL FALLBACK
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="my-2.5 relative bg-[#080808]/95 border border-white/[0.12] p-3 text-[11px] font-mono space-y-1.5">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="flex items-center justify-between text-white font-orbitron">
        <span>TOOL RESULT: {toolName}</span>
        <span className="text-[#FF5500] text-[9px]">RESOLVED</span>
      </div>
      <pre className="p-2 bg-[#0D0D0D] border border-white/[0.06] overflow-x-auto text-neutral-300 text-[10px]">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};
