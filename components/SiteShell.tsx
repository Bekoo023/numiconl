"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ThreeScene from "./ThreeScene";

// Bepaalt de "chrome" rond de pagina:
// - marketing-pagina's krijgen de header, footer en Three.js-achtergrond
// - /app (dashboard) krijgt een schone, rustige omgeving zonder dat alles
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/app") ?? false;

  if (isApp) {
    return <div className="min-h-screen bg-[#0b1018] text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1018] relative overflow-hidden text-white">
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <ThreeScene />
      </div>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(11,16,24,0) 40%, rgba(11,16,24,0.65) 100%)",
        }}
      />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}