"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import ScrambledText from "@/components/ui/ScrambledText";
import { AlienPixelGlyphs } from "@/components/ui/HolographicCard";

interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    number: "01",
    question: "How can a normal picture file store my conversation?",
    answer:
      "OCTOMEM uses the built-in metadata space inside standard PNG images. When you save a card, your conversation history and notes are securely bundled inside the image file. To any regular photo app or viewer, it displays normally as a picture. But when you drag it into OCTOMEM Studio, your conversation reloads instantly.",
  },
  {
    number: "02",
    question: "Do I need a monthly subscription to view or keep my cards?",
    answer:
      "No. There are no ongoing subscriptions. When you export a memory card, the file downloads to your computer and belongs to you permanently. You can open, view, and continue your conversations anytime for free.",
  },
  {
    number: "03",
    question: "Can someone else read my chat if I send them the picture?",
    answer:
      "If you set an optional password before saving, your conversation is locked. Anyone with the file can see the cover photo, but only someone with your secret password can unlock and read the chat in the Studio.",
  },
  {
    number: "04",
    question: "What happens if I lose my internet connection?",
    answer:
      "Because the conversation is saved directly inside the image file on your computer, you never lose your data. The memory card reader works right in your browser, even without an internet connection.",
  },
  {
    number: "05",
    question: "Which AI models can I use?",
    answer:
      "In the Studio, you can plug in your own API keys for providers like OpenAI, Anthropic, or OpenRouter to chat with whichever model you prefer.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="py-28 sm:py-36 relative bg-[#000000] text-white overflow-hidden border-t border-white/[0.08] font-matrix select-none"
    >
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-white/[0.12] text-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shadow-[0_0_8px_#FF5500]" />
            <span className="font-matrix text-[#FF5500] uppercase text-[11px] tracking-wider">
              Questions &amp; Answers
            </span>
          </div>

          <ScrambledText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12] mb-4 justify-center font-orbitron"
            duration={1.2}
          >
            Frequently Asked Questions
          </ScrambledText>

          <ScrambledText
            as="p"
            className="text-sm sm:text-base text-neutral-300 leading-relaxed font-matrix"
            duration={1.4}
          >
            Everything you need to know about saving AI chats as memory cards.
          </ScrambledText>
        </div>

        {/* Accordion Stack (Clean Drone UI) */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`border transition-all duration-200 overflow-hidden relative ${
                  isOpen
                    ? "bg-[#0E0E0E] border-[#FF5500]/50 shadow-[0_8px_24px_rgba(255,85,0,0.14)]"
                    : "bg-[#080808]/90 border-white/[0.08] hover:border-white/[0.18]"
                }`}
              >
                {/* Drone Optical Corner Ticks */}
                <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${isOpen ? "border-[#FF5500]" : "border-white/20"}`} />
                <span className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${isOpen ? "border-[#FF5500]" : "border-white/20"}`} />
                <span className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${isOpen ? "border-[#FF5500]" : "border-white/20"}`} />
                <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${isOpen ? "border-[#FF5500]" : "border-white/20"}`} />

                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-matrix text-xs text-[#FF5500] font-semibold">
                      {faq.number}
                    </span>
                    <span className="font-medium text-sm sm:text-base text-white font-orbitron">
                      {faq.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <AlienPixelGlyphs variant={((idx % 5) + 1) as any} />
                    <div
                      className={`w-7 h-7 flex items-center justify-center shrink-0 border transition-colors ${
                        isOpen
                          ? "bg-[#FF5500] text-white border-[#FF5500] shadow-[0_0_10px_#FF5500]"
                          : "bg-white/[0.04] text-neutral-400 border-white/[0.08]"
                      }`}
                    >
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/[0.06] font-matrix">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}