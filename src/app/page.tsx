"use client";

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

import SmoothScroll from "@/components/site/SmoothScroll";
const KineticScrollEffects = dynamic(
  () => import("@/components/ui/KineticScrollEffects"),
  { ssr: false },
);

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#000000] text-[#EDEDF0] selection:bg-[#FF5500] selection:text-white font-matrix antialiased overflow-x-hidden relative">
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
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
