"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_PAYLOAD = {
  format: "octomem",
  version: 2.4,
  entityId: "octo-alpha-09",
  name: "OCTOMEM Sentinel",
  timestamp: "2026-10-22T13:42:00Z",
  memoryState: {
    coreFacts: [
      "User specializes in autonomous agent architecture",
      "Cryptographic sovereignty strictly required",
      "Target latency threshold: < 24ms",
    ],
    lastConversationTopic: "Quantum-resistant stego encoding in lossless PNGs",
    personalityMatrix: {
      analytical: 0.94,
      tactical: 0.88,
      loyalty: 1.0,
    },
  },
  encryptionSpec: {
    algorithm: "AES-256-GCM",
    kdf: "scrypt (N=32768, r=8, p=1)",
    tagLength: 128,
  },
};

const CIPHER_STREAM = `U2FsdGVkX1+vGz7R8L2mK9...[256-BIT ENCRYPTED STREAM]...
IV: 7f3a9b1c4e20d85a
TAG: 99a14c6e2b8f01de
SALT: e4c9a871032f5b61
STATUS: ZERO_KNOWLEDGE_VERIFIED`;

const PNG_CHUNK_FLOW = [
  { name: "IHDR", desc: "Image header (640x400 RGBA 8-bit)", color: "text-[#64748B] border-[#E2E8F0]" },
  { name: "IDAT", desc: "Compressed pixel scanlines (Cover Artwork)", color: "text-[#64748B] border-[#E2E8F0]" },
  { name: "tEXt (octomem_state)", desc: "Encrypted memory chunk (Steganographic Carrier)", color: "text-[#8243D9] border-[#8243D9] bg-[#8243D9]/5 font-bold" },
  { name: "IEND", desc: "Lossless end marker", color: "text-[#64748B] border-[#E2E8F0]" },
];

export default function StegoInteractiveLab() {
  const [activeTab, setActiveTab] = useState<"json" | "cipher" | "png">("json");
  const [passphraseInput, setPassphraseInput] = useState("octomem-sovereign-2026");
  const [isUnlocked, setIsUnlocked] = useState(true);

  const handleTestPassphrase = () => {
    if (passphraseInput.trim().length > 3) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFC]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
            <span className="w-3 h-3 rounded-full bg-[#10B981]/80" />
          </div>
          <span className="text-xs font-mono font-bold text-[#09090B] tracking-wider uppercase">
            OCTOMEM STEGO INSPECTOR
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#E2E8F0]/50 border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === "json"
                ? "bg-white text-[#8243D9] font-bold shadow-sm"
                : "text-[#64748B] hover:text-[#09090B]"
            }`}
          >
            01. JSON STATE
          </button>
          <button
            onClick={() => setActiveTab("cipher")}
            className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === "cipher"
                ? "bg-white text-[#8243D9] font-bold shadow-sm"
                : "text-[#64748B] hover:text-[#09090B]"
            }`}
          >
            02. AES CIPHER
          </button>
          <button
            onClick={() => setActiveTab("png")}
            className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === "png"
                ? "bg-white text-[#8243D9] font-bold shadow-sm"
                : "text-[#64748B] hover:text-[#09090B]"
            }`}
          >
            03. PNG CHUNKS
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "json" && (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>STRUCTURED NEURAL COMPANION MANIFEST</span>
                <span className="text-emerald-600 font-semibold">● AES READY</span>
              </div>
              <pre className="p-5 rounded-xl bg-[#09090B] text-[#E2E8F0] font-mono text-xs overflow-x-auto leading-relaxed border border-[#27272A] shadow-inner max-h-[300px]">
                {JSON.stringify(SAMPLE_PAYLOAD, null, 2)}
              </pre>
            </motion.div>
          )}

          {activeTab === "cipher" && (
            <motion.div
              key="cipher"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>ENCRYPTED CIPHERTEXT VECTOR (ZERO-KNOWLEDGE)</span>
                <span className="text-[#8243D9] font-bold">256-BIT ENTROPY</span>
              </div>
              <div className="p-5 rounded-xl bg-[#09090B] text-emerald-400 font-mono text-xs leading-relaxed border border-[#27272A] shadow-inner font-mono">
                <p className="text-gray-400 mb-2">// Scrypt Key Derivation + AES-256-GCM authenticated tag</p>
                <p className="break-all tracking-wider">{CIPHER_STREAM}</p>
              </div>

              {/* Interactive Passphrase Simulation */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <input
                  type="text"
                  value={passphraseInput}
                  onChange={(e) => setPassphraseInput(e.target.value)}
                  placeholder="Enter client passphrase..."
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] font-mono text-xs text-[#09090B] focus:border-[#8243D9] focus:outline-none"
                />
                <button
                  onClick={handleTestPassphrase}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#09090B] hover:bg-[#8243D9] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  SIMULATE AUTH
                </button>
              </div>
              {isUnlocked ? (
                <p className="text-[11px] font-mono text-emerald-600 font-semibold">
                  ✓ Verified: Envelope successfully unpacked in memory with 0ms cloud roundtrip.
                </p>
              ) : (
                <p className="text-[11px] font-mono text-red-500 font-semibold">
                  ✗ Passphrase required to decrypt autonomous memory state.
                </p>
              )}
            </motion.div>
          )}

          {activeTab === "png" && (
            <motion.div
              key="png"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>ISO/IEC 15948 PNG CHUNK SEQUENCE</span>
                <span className="text-[#8243D9] font-semibold">ZERO ARTIFACTS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {PNG_CHUNK_FLOW.map((chunk, i) => (
                  <div
                    key={chunk.name}
                    className={`p-4 rounded-xl border ${chunk.color} bg-[#FAFAFC] flex flex-col justify-between`}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block mb-1">
                        CHUNK 0{i + 1}
                      </span>
                      <span className="text-xs font-mono font-bold block mb-2">
                        {chunk.name}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-[#475569] leading-snug">
                      {chunk.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#8243D9]/5 border border-[#8243D9]/20 text-[#09090B] text-xs font-sans leading-relaxed">
                <span className="font-bold text-[#8243D9] font-mono">PARITY GUARANTEE: </span>
                Standard image viewers render only the visual artwork. The encrypted AI state lives completely intact in the ancillary stego chunk, surviving direct file transfers, AirDrop, and USB drives.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
