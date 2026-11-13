"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function KineticScrollEffects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Kinetic multi-layer parallax scrubbing
    const ctx = gsap.context(() => {
      // Parallax on floating CAD particles
      const particles = gsap.utils.toArray<HTMLElement>(".kinetic-particle");
      particles.forEach((el, i) => {
        const speed = (i + 1) * 35;
        gsap.to(el, {
          y: -speed,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });
      });

      // Subtle velocity skew on cards while scrolling
      let proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(".kinetic-card", "skewY", "deg");
      const clamp = gsap.utils.clamp(-3, 3);

      ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -400);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Floating Kinetic HUD Matrix Nodes that drift with Lenis kinetic scroll */}
      <div className="kinetic-particle absolute top-[18%] left-[5%] font-matrix text-[9px] text-[#FF5500]/25 tracking-widest">
        +042.84
      </div>
      <div className="kinetic-particle absolute top-[35%] right-[6%] font-matrix text-[9px] text-[#FFA000]/20 tracking-widest">
        100% LOSSLESS
      </div>
      <div className="kinetic-particle absolute top-[55%] left-[8%] font-matrix text-[9px] text-[#FF5500]/20 tracking-widest">
        LOCAL DRIVE
      </div>
      <div className="kinetic-particle absolute top-[72%] right-[7%] font-matrix text-[9px] text-[#FFA000]/25 tracking-widest">
        PNG METADATA
      </div>
      <div className="kinetic-particle absolute top-[88%] left-[6%] font-matrix text-[9px] text-[#FF5500]/20 tracking-widest">
        STANDBY
      </div>
    </div>
  );
}