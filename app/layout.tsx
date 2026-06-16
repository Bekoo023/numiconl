import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThreeScene from "@/components/ThreeScene";

// Zelf-gehoste lettertypes (geen externe requests bij het laden)
import "@fontsource-variable/fraunces";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./globals.css"; // <- dit moet hier staan, anders laadt er geen styling

export const metadata: Metadata = {
  title: "Numico — van bonnetje naar boeking",
  description:
    "Maak een foto van je bonnetje en Numico boekt het automatisch in. Geautomatiseerde boekhouding voor Nederlandse ondernemers.",
  icons: {
    icon: "/logo-trans.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <div className="min-h-screen flex flex-col bg-[#0b1018] relative overflow-hidden text-white">
          {/* Three.js-achtergrond — één keer voor de hele app */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            <ThreeScene />
          </div>

          {/* Leesbaarheids-waas: houdt tekst scherp over het bewegende deeltjesveld */}
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
      </body>
    </html>
  );
}