"use client";

import React, { useState } from "react";
import { X, Sliders, Cloud, Key, Check } from "lucide-react";
import { ModelProviderConfig, PROVIDER_PRESETS } from "@/lib/ai/provider";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModelProviderConfig;
  onSaveConfig: (newConfig: ModelProviderConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl apple-glass border border-apple-border p-6 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-apple-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-apple-blue flex items-center justify-center text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-white">Cloud AI Settings</h3>
              <p className="text-[11px] text-apple-subtext">100% online cloud free providers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-apple-subtext hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Provider Switcher */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-apple-subtext mb-1.5 font-medium">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleProviderChange("nvidia")}
                className={`p-3 rounded-2xl border text-left transition ${
                  provider === "nvidia"
                    ? "border-apple-blue bg-apple-blue/10 text-white"
                    : "border-apple-border bg-white/[0.02] text-apple-subtext hover:text-white"
                }`}
              >
                <div className="font-medium text-white flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-apple-blue" />
                  NVIDIA NIM
                </div>
                <div className="text-[11px] text-apple-subtext mt-0.5">GLM-5.3 Flash Cloud</div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange("openrouter")}
                className={`p-3 rounded-2xl border text-left transition ${
                  provider === "openrouter"
                    ? "border-apple-blue bg-apple-blue/10 text-white"
                    : "border-apple-border bg-white/[0.02] text-apple-subtext hover:text-white"
                }`}
              >
                <div className="font-medium text-white flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-purple-400" />
                  OpenRouter
                </div>
                <div className="text-[11px] text-apple-subtext mt-0.5">Free Uncensored Hermes 3</div>
              </button>
            </div>
          </div>

          {/* Model ID */}
          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Cloud Model ID</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. z-ai/glm-5.3-flash or nousresearch/hermes-3-llama-3.1-405b:free"
              className="w-full bg-white/5 border border-apple-border rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-apple-blue"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-apple-subtext mb-1 font-medium flex items-center justify-between">
              <span>API Key</span>
              <span className="text-[10px] text-apple-green">Stored only in your browser</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your free API key..."
                className="w-full bg-white/5 border border-apple-border rounded-xl pl-8 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-apple-blue"
              />
              <Key className="w-3.5 h-3.5 text-apple-subtext absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Base URL (Advanced) */}
          <div>
            <label className="block text-apple-subtext mb-1 font-medium">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-apple-border rounded-xl px-3 py-2 text-apple-subtext font-mono text-[11px] focus:outline-none focus:border-apple-blue"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="apple-button w-full py-2.5 bg-apple-blue hover:bg-apple-blueHover text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-apple-blue/20"
          >
            <Check className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
