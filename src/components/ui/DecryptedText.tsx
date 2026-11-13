"use client";

import React, { useEffect, useState, useRef } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: "mount" | "hover" | "view";
  sequential?: boolean;
}

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 14,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
  className = "",
  parentClassName = "",
  animateOn = "mount",
  sequential = true,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const isMounted = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let currentIteration = 0;
    const textLength = text.length;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            
            if (sequential) {
              const charProgress = (currentIteration / maxIterations) * textLength;
              if (index < charProgress) {
                return text[index];
              }
            } else {
              if (currentIteration >= maxIterations) {
                return text[index];
              }
            }

            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");
      });

      currentIteration++;

      if (currentIteration > maxIterations + (sequential ? textLength : 0)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  };

  useEffect(() => {
    isMounted.current = true;
    if (animateOn === "mount" || animateOn === "view") {
      startAnimation();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const handleMouseEnter = () => {
    if (animateOn === "hover") {
      setIsHovering(true);
      startAnimation();
    }
  };

  return (
    <span
      className={`inline-block font-mono ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
}
