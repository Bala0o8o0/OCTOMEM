"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/site/Navbar";
import HeroSection from "@/components/site/HeroSection";
import KeepContextSection from "@/components/site/KeepContextSection";
import WorkflowSection from "@/components/site/WorkflowSection";
import PortableMemoryCardSection from "@/components/site/PortableMemoryCardSection";
import CardCollectionSection from "@/components/site/CardCollectionSection";
import ComparisonSection from "@/components/site/ComparisonSection";
import PricingSection from "@/components/site/PricingSection";
import FaqSection from "@/components/site/FaqSection";
import CtaBanner from "@/components/site/CtaBanner";
import Footer from "@/components/site/Footer";
import OctoAsciiMatrix from "@/components/OctoAsciiMatrix";
import GlitchDottedLogoLoader from "@/components/ui/GlitchDottedLogoLoader";

import SmoothScroll from "@/components/site/SmoothScroll";
const KineticScrollEffects = dynamic(
  () => import("@/components/ui/KineticScrollEffects"),
  { ssr: false },
);

export default function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#000000] text-[#EDEDF0] selection:bg-[#FF5500] selection:text-white font-matrix antialiased overflow-x-hidden relative">
        {/* Fullscreen Glitch Dotted Logo Loading Screen */}
        {showLoader && (
          <GlitchDottedLogoLoader
            isLoading={showLoader}
            onComplete={() => setShowLoader(false)}
            minDuration={2600}
            autoDismiss={true}
            glitchIntensity={1.2}
            dotDensity="balanced"
            colorTheme="brand"
            allowSkip={true}
          />
        )}

        {/* Kinetic Parallax Particles */}
        <KineticScrollEffects />

        {/* Navigation */}
        <Navbar />

        {/* Main Landing Sections */}
        <main>
          {/* 1. Hero with 3D Memory Card Product Artwork */}
          <HeroSection />

          {/* 2. Keep Your Context (The Problem in Everyday Language) */}
          <KeepContextSection />

          {/* 3. Three-Step Workflow */}
          <WorkflowSection />

          {/* 3. Section 03: Your Portable Memory Card */}
          <PortableMemoryCardSection />

          {/* 4. Interactive Card Collection Showcase */}
          {/* <CardCollectionSection /> */}

          {/* 5. Why Cards Beat Chat Logs */}
          <ComparisonSection />

          {/* 6. Honest Transparent Pricing */}
          {/* <PricingSection /> */}

          {/* 7. Frequently Asked Questions */}
          <FaqSection />

          {/* 8. Closing Call to Action */}
          <CtaBanner />

          {/* Renders the octo-chip in animated #FF5500 ASCII matrix (or pass imageSrc="/octomem-2nd.jpg") */}
          <OctoAsciiMatrix color="#D3D3D3" cellSize={6} speed={1.1} />
        </main>

        {/* Floating Replay Loader HUD Pill */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setShowLoader(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#090814]/90 border border-white/15 hover:border-[#FF5500]/60 text-neutral-300 hover:text-white backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_15px_rgba(255,85,0,0.2)] transition-all hover:scale-105 active:scale-95 group font-matrix text-xs tracking-wider"
            title="Replay Glitch Dotted Logo Loading Screen"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span className="group-hover:text-[#FF5500] transition-colors">REPLAY LOADER</span>
          </button>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
