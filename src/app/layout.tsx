import type { Metadata } from "next";
import { Instrument_Sans, Orbitron, JetBrains_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-matrix",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://octomem.ai"),
  title: "OCTOMEM — Portable AI Conversation Memory Cards",
  description:
    "Preserve your AI conversation context in beautiful, portable PNG memory cards. Load them whenever you want to pick up right where you left off.",
  icons: {
    icon: [
      { url: "/octomem_logo.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/octomem_logo.png",
    apple: "/octomem_logo.png",
  },
  openGraph: {
    title: "OCTOMEM — Portable AI Conversation Memory Cards",
    description:
      "Preserve your AI conversation context in beautiful, portable PNG memory cards.",
    images: [{ url: "/octomem_logo.png", width: 1306, height: 1213, alt: "OCTOMEM Logo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSans.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${shareTechMono.variable}`}
    >
      <body className="font-matrix bg-[#000000] text-[#EDEDF0] min-h-screen selection:bg-[#FF5500] selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}