import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

// Zelf-gehoste lettertypes (geen externe requests bij het laden)
import "@fontsource-variable/fraunces";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./globals.css";

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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}