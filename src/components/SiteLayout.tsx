"use client";

import React from "react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#F5F5F7] selection:bg-[#8243D9] selection:text-white font-sans antialiased overflow-x-hidden">
      <LandingNavbar />
      <main className="flex-1 flex flex-col pt-24 sm:pt-28 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
