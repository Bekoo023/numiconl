"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0b1018]/85 backdrop-blur-md border-b border-white/8"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="display text-white text-xl tracking-tight">Numico</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/pricing"
            className="hidden sm:inline text-sm text-slate-300 hover:text-white transition-colors"
          >
            Prijzen
          </Link>
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors px-2 py-1"
          >
            Inloggen
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-accent text-ink px-5 py-2 rounded-full hover:bg-[#5fe0ad] transition-colors"
          >
            Aanmelden
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;