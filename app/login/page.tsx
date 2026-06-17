"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const benefits = [
  "Al je bonnetjes op één plek",
  "Automatisch gecategoriseerd",
  "Altijd klaar voor je aangifte",
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vul je e-mailadres en wachtwoord in.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Dat lijkt geen geldig e-mailadres.");
      return;
    }

    setStatus("loading");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Inloggen mislukt: controleer je e-mailadres en wachtwoord.");
      setStatus("idle");
      return;
    }

    window.location.href = "/app";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 surface rounded-[28px] overflow-hidden shadow-2xl shadow-black/40">
        {/* Merk-paneel */}
        <aside
          className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(165deg, rgba(70,211,154,0.14) 0%, rgba(15,18,30,0.25) 55%, rgba(15,18,30,0.5) 100%)",
          }}
          aria-hidden="true"
        >
          <div
            className="absolute -top-24 -right-20 w-72 h-72 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #46d39a55, transparent 70%)", filter: "blur(20px)" }}
          />
          <div className="relative flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="display text-white text-xl tracking-tight">Numico</span>
          </div>

          <div className="relative">
            <h2 className="display text-white text-3xl leading-snug mb-7">
              Weer terug naar rust in je boekhouding.
            </h2>
            <ul className="space-y-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-slate-200/90 text-[15px]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="num relative text-xs text-slate-400">
            Werkt met Exact en Twinfield
          </p>
        </aside>

        {/* Formulier */}
        <div className="p-8 sm:p-11">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Terug naar home
          </Link>

          <span className="eyebrow text-accent">Welkom terug</span>
          <h1 className="display text-white text-3xl sm:text-4xl mt-3 mb-2">
            Log in op Numico
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Nog geen account?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Maak er gratis een aan
            </Link>
            .
          </p>

          {status === "done" ? (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm text-slate-200">
              Je bent ingelogd.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm text-slate-300 mb-2">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jij@bedrijf.nl"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/12 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-accent focus:bg-white/[0.05] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm text-slate-300">
                    Wachtwoord
                  </label>
                  <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-accent transition-colors">
                    Vergeten?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/12 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none focus:border-accent focus:bg-white/[0.05] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.1A9.5 9.5 0 0112 5c5 0 9 4 9 7a10.8 10.8 0 01-2.5 3.3M6.2 6.2A10.9 10.9 0 003 12c0 3 4 7 9 7a9.3 9.3 0 003.4-.6" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.03] accent-[#46d39a]"
                />
                Ingelogd blijven
              </label>

              {error && (
                <p className="text-sm text-rose-400" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent text-ink py-3.5 rounded-xl font-semibold transition-all duration-300 hover:bg-[#5fe0ad] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Bezig…" : "Inloggen"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}