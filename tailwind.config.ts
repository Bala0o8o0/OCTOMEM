import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        apple: {
          bg: "#000000",
          canvas: "#0A0006",
          glass: "rgba(255, 255, 255, 0.05)",
          glassHover: "rgba(255, 255, 255, 0.08)",
          glassActive: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.1)",
          borderHover: "rgba(255, 255, 255, 0.2)",
          blue: "#0071E3",
          blueHover: "#0077ED",
          blueGlow: "rgba(0, 113, 227, 0.35)",
          purple: "#9333EA",
          pink: "#EC4899",
          emerald: "#34D399",
          text: "#F5F5F7",
          subtext: "#86868B",
          muted: "#6E6E73",
        },
        // White Slate base palette
        slate: {
          canvas: "#FAFAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          borderHover: "#CBD5E1",
          muted: "#64748B",
          subtext: "#475569",
          heading: "#09090B",
        },
        // ChronoCard brand palette — purple spectrum
        brand: {
          violet: "#8243D9",
          violetHover: "#9355E8",
          purple: "#4811BF",
          purpleHover: "#5520D4",
          indigo: "#5144A6",
          navy: "#3C4473",
          glow: "rgba(130, 67, 217, 0.45)",
          glowSoft: "rgba(130, 67, 217, 0.18)",
          dark: "#0D0D0D",
          darker: "#000000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "var(--font-instrument)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          "system-ui",
          "sans-serif",
        ],
        matrix: ["var(--font-matrix)", '"Share Tech Mono"', "monospace"],
        orbitron: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
        mono: ["var(--font-mono)", '"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        appleGlass: "0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        appleCard: "0 30px 60px -20px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        appleGlow: "0 0 50px -10px rgba(0, 113, 227, 0.25)",
        brandGlow: "0 0 60px -10px rgba(130, 67, 217, 0.5)",
        brandCard: "0 30px 80px -20px rgba(72, 17, 191, 0.3), 0 0 0 1px rgba(130, 67, 217, 0.2)",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "ambient-1": "ambient-glow 14s ease-in-out infinite",
        "ambient-2": "ambient-glow 18s ease-in-out infinite reverse",
        "scan": "scan 3s linear infinite",
        "marquee": "marquee 32s linear infinite",
        "marquee-reverse": "marquee-reverse 32s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "ambient-glow": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.28" },
          "33%": { transform: "translate(30px, -25px) scale(1.08)", opacity: "0.38" },
          "66%": { transform: "translate(-25px, 20px) scale(0.95)", opacity: "0.32" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;