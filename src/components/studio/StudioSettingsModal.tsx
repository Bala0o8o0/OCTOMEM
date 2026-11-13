"use client";

import React, { useState } from "react";
import {
  X,
  Sliders,
  Check,
  ExternalLink,
  Key,
  Cpu,
  Globe,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";
import { ModelProviderConfig, PROVIDER_PRESETS } from "@/lib/ai/provider";

interface StudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModelProviderConfig;
  onSaveConfig: (newConfig: ModelProviderConfig) => void;
}

const QUICK_PRESETS = {
  nvidia: [
    { label: "Llama 3.3 70B", id: "meta/llama-3.3-70b-instruct" },
    { label: "Mistral Nemo", id: "mistralai/mistral-nemo-12b-instruct" },
    { label: "DeepSeek R1", id: "deepseek-ai/deepseek-r1" },
  ],
  openrouter: [
    { label: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet" },
    { label: "Llama 3.3 70B", id: "meta-llama/llama-3.3-70b-instruct" },
    { label: "DeepSeek R1", id: "deepseek/deepseek-r1" },
  ],
  custom: [
    { label: "Ollama Local", url: "http://localhost:11434/v1", model: "llama3.2" },
    { label: "vLLM Local", url: "http://localhost:8000/v1", model: "default" },
    { label: "LM Studio", url: "http://localhost:1234/v1", model: "default" },
  ],
};

export const StudioSettingsModal: React.FC<StudioSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [provider, setProvider] = useState<"nvidia" | "openrouter" | "custom">(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [model, setModel] = useState(config.model || PROVIDER_PRESETS.nvidia.defaultModel);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || PROVIDER_PRESETS.nvidia.baseUrl);
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen) return null;

  const handleProviderChange = (p: "nvidia" | "openrouter" | "custom") => {
    setProvider(p);
    if (p === "nvidia") {
      setBaseUrl(PROVIDER_PRESETS.nvidia.baseUrl);
      setModel(PROVIDER_PRESETS.nvidia.defaultModel);
    } else if (p === "openrouter") {
      setBaseUrl(PROVIDER_PRESETS.openrouter.baseUrl);
      setModel(PROVIDER_PRESETS.openrouter.defaultModel);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      model: model.trim(),
      baseUrl: baseUrl.trim(),
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl font-matrix animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#080808] border border-white/[0.12] p-6 sm:p-7 shadow-[0_24px_90px_rgba(0,0,0,0.98)] space-y-6"
      >
        {/* Top Specular Line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center text-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.25)]">
              <Sliders className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-base sm:text-lg text-white tracking-wide">
                CLOUD AI PROVIDER CONFIG
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono tracking-wide">
                HARDWARE INFERENCE BUS • CLIENT-SIDE DIRECT STREAMING
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="space-y-5 relative z-10">
          
          {/* Segmented Provider Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              <span>Select Inference Provider</span>
              <span className="text-[#FF5500] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
                BYOK PRIVACY ENABLED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* NVIDIA NIM */}
              <button
                type="button"
                onClick={() => handleProviderChange("nvidia")}
                className={`p-3 border text-left transition-all relative cursor-pointer group ${
                  provider === "nvidia"
                    ? "bg-[#121212] border-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.25)]"
                    : "bg-[#0D0D0D] border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                {provider === "nvidia" && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className={`w-3.5 h-3.5 ${provider === "nvidia" ? "text-[#FF5500]" : "text-neutral-500"}`} />
                  <span className="font-orbitron text-xs font-bold tracking-wider">NVIDIA NIM</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  Free Tier (1K reqs)
                </div>
              </button>

              {/* OPENROUTER */}
              <button
                type="button"
                onClick={() => handleProviderChange("openrouter")}
                className={`p-3 border text-left transition-all relative cursor-pointer group ${
                  provider === "openrouter"
                    ? "bg-[#121212] border-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.25)]"
                    : "bg-[#0D0D0D] border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                {provider === "openrouter" && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe className={`w-3.5 h-3.5 ${provider === "openrouter" ? "text-[#FF5500]" : "text-neutral-500"}`} />
                  <span className="font-orbitron text-xs font-bold tracking-wider">OPENROUTER</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  500+ Multi-LLMs
                </div>
              </button>

              {/* CUSTOM */}
              <button
                type="button"
                onClick={() => handleProviderChange("custom")}
                className={`p-3 border text-left transition-all relative cursor-pointer group ${
                  provider === "custom"
                    ? "bg-[#121212] border-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.25)]"
                    : "bg-[#0D0D0D] border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                {provider === "custom" && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <Cpu className={`w-3.5 h-3.5 ${provider === "custom" ? "text-[#FF5500]" : "text-neutral-500"}`} />
                  <span className="font-orbitron text-xs font-bold tracking-wider">CUSTOM</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  Local / Ollama / vLLM
                </div>
              </button>
            </div>
          </div>

          {/* Provider HUD Summary & Quick Model Presets */}
          <div className="p-3.5 bg-[#0D0D0D] border border-white/[0.08] relative space-y-2.5">
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#FF5500] font-semibold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {provider === "nvidia" && "NVIDIA NIM HARDWARE ACCELERATION"}
                  {provider === "openrouter" && "OPENROUTER GLOBAL ROUTING"}
                  {provider === "custom" && "PRIVATE INFERENCE ENDPOINT"}
                </span>
              </span>

              {provider === "nvidia" && (
                <a
                  href="https://build.nvidia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-neutral-300 hover:text-[#FF5500] transition-colors"
                >
                  <span>Get 1,000 Free Credits</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {provider === "openrouter" && (
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-neutral-300 hover:text-[#FF5500] transition-colors"
                >
                  <span>OpenRouter API Keys</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Quick Model Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Quick Select:</span>
              {provider === "nvidia" &&
                QUICK_PRESETS.nvidia.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setModel(p.id)}
                    className={`px-2.5 py-1 text-[10px] font-mono tracking-wider border transition-colors cursor-pointer ${
                      model === p.id
                        ? "bg-[#FF5500]/15 border-[#FF5500] text-[#FF5500]"
                        : "bg-[#141414] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              {provider === "openrouter" &&
                QUICK_PRESETS.openrouter.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setModel(p.id)}
                    className={`px-2.5 py-1 text-[10px] font-mono tracking-wider border transition-colors cursor-pointer ${
                      model === p.id
                        ? "bg-[#FF5500]/15 border-[#FF5500] text-[#FF5500]"
                        : "bg-[#141414] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              {provider === "custom" &&
                QUICK_PRESETS.custom.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setBaseUrl(p.url);
                      setModel(p.model);
                    }}
                    className="px-2.5 py-1 text-[10px] font-mono tracking-wider border bg-[#141414] border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Form Fields Chassis */}
          <div className="space-y-3.5">
            {/* API Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="uppercase">
                  API Key {provider !== "custom" && "(Optional if backend key configured)"}
                </span>
                <span className="text-neutral-500">BROWSER-ONLY LOCALSTORAGE</span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Key className="w-4 h-4 text-[#FF5500]" />
                </div>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="nvapi-... or sk-or-v1-..."
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] pl-9 pr-9 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
                  title={showApiKey ? "Hide Key" : "Show Key"}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Model Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                Model Identifier
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Cpu className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. meta/llama-3.3-70b-instruct"
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Base URL */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                Endpoint Base URL
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Globe className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://integrate.api.nvidia.com/v1"
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Credentials remain client-side only. Zero central database logging.</span>
          </div>
        </div>

        {/* ── Modal Footer Controls ── */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#FF6611] text-black font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,85,0,0.4)] hover:shadow-[0_0_35px_rgba(255,85,0,0.6)] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
