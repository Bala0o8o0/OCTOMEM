"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
}

export default function BlurText({
  text = "",
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "-50px",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: rootMargin as any });

  const defaultFrom =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,-20px,0)" }
      : { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,20px,0)" };

  const defaultTo = {
    filter: "blur(0px)",
    opacity: 1,
    transform: "translate3d(0,0,0)",
  };

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          initial={defaultFrom}
          animate={inView ? defaultTo : defaultFrom}
          transition={{
            duration: 0.45,
            delay: (i * delay) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {element === " " ? "\u00A0" : element}
          {animateBy === "words" && i < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
}
