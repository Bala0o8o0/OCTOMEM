"use client";

import React, { useState } from "react";
import { X, Cloud, Key, Check } from "lucide-react";
import { ModelProviderConfig, PROVIDER_PRESETS } from "@/lib/ai/provider";

interface AppleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModelProviderConfig;
  onSaveConfig: (newConfig: ModelProviderConfig) => void;
}

export const AppleSettingsModal: React.FC<AppleSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [provider, setProvider] = useState<"nvidia" | "openrouter" | "custom">(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [model, setModel] = useState(config.model || PROVIDER_PRESETS.nvidia.defaultModel);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || PROVIDER_PRESETS.nvidia.baseUrl);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 shadow shadow-orange-500/10">
              <img
                src="/octomem_logo.png"
                alt="OCTOMEM Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]"
              />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">AI Provider Settings</h3>
              <p className="text-xs text-apple-subtext">Direct browser inference settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-apple-subtext hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          {/* Provider Selectors */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleProviderChange("nvidia")}
              className={`p-3 rounded-2xl border text-left transition apple-btn cursor-pointer ${
                provider === "nvidia"
                  ? "border-apple-blue bg-apple-blue/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-apple-subtext hover:text-white"
              }`}
            >
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-apple-blue" />
                NVIDIA NIM
              </div>
              <div className="text-[11px] text-apple-subtext mt-0.5">GLM-5.3 Flash Cloud</div>
            </button>

            <button
              type="button"
              onClick={() => handleProviderChange("openrouter")}
              className={`p-3 rounded-2xl border text-left transition apple-btn cursor-pointer ${
                provider === "openrouter"
                  ? "border-apple-blue bg-apple-blue/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-apple-subtext hover:text-white"
              }`}
            >
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-purple-400" />
                OpenRouter
              </div>
              <div className="text-[11px] text-apple-subtext mt-0.5">Free Hermes 3 405B</div>
            </button>
          </div>

          {/* Model ID */}
          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Model ID</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. z-ai/glm-5.3-flash"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-apple-blue"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-apple-subtext mb-1 font-medium flex items-center justify-between">
              <span>API Key</span>
              <span className="text-[10px] text-apple-emerald">Saved only in your browser</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your free API key..."
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-apple-blue"
              />
              <Key className="w-3.5 h-3.5 text-apple-muted absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="apple-btn w-full py-2.5 bg-apple-blue hover:bg-apple-blueHover text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-apple-blueGlow"
          >
            <Check className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
