import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCTOMEM — Studio",
  description: "Create and manage your AI companion memory cards.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
