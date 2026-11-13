"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(
  () => import("lottie-react").then((m: any) => m.default || m),
  { ssr: false }
) as React.ComponentType<any>;

interface LottieAnimationProps {
  src?: string | object;
  animationData?: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function LottieAnimation({
  src,
  animationData: directData,
  loop = true,
  autoplay = true,
  className = "",
  style,
}: LottieAnimationProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animationSource = directData || src;

  if (!isClient || !animationSource) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <div className="w-4 h-4 border-2 border-[#FF5500]/60 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Lottie
        animationData={animationSource}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full"
      />
    </div>
  );
}
