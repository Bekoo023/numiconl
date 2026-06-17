"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const benefits = [
  "14 dagen gratis proberen",
  "Geen creditcard nodig",
  "Werkt met Exact & Twinfield",
];

function passwordScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

const strengthLabels = ["", "Zwak", "Redelijk", "Goed", "Sterk"];
const strengthColors = ["", "#f43f5e", "#f59e0b", "#84cc16", "#46d39a"];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const score = passwordScore(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Vul je naam, e-mailadres en wachtwoord in.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Dat lijkt geen geldig e-mailadres.");
      return;
    }
    if (password.length < 8) {
      setError("Kies een wachtwoord van minimaal 8 tekens.");
      return;
    }
    if (!agreed) {
      setError("Ga akkoord met de voorwaarden om verder te gaan.");
      return;
    }

    setStatus("loading");

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (signUpError) {
      setError("Aanmaken mislukt: " + signUpError.message);
      setStatus("idle");
      return;
    }

    setStatus("done");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 surface rounded-[28px] overflow-hidden shadow-2xl shadow-black/40">
        {/* Merk-paneel */}
        <aside
          className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden order-last"
          style={{
            background:
              "linear-gradient(200deg, rgba(70,211,154,0.14) 0%, rgba(15,18,30,0.25) 55%, rgba(15,18,30,0.5) 100%)",
          }}
          aria-hidden="true"
        >
          <div
            className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #46d39a55, transparent 70%)", filter: "blur(20px)" }}
          />
          <div className="relative flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="display text-white text-xl tracking-tight">Numico</span>
          </div>

          <div className="relative">
            <h2 className="display text-white text-3xl leading-snug mb-7">
              Begin vandaag met slimmer boekhouden.
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
            Sluit je aan bij 2.000+ ondernemers
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

          <span className="eyebrow text-accent">Aan de slag</span>
          <h1 className="display text-white text-3xl sm:text-4xl mt-3 mb-2">
            Maak je account aan
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Al een account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Inloggen
            </Link>
            .
          </p>

          {status === "done" ? (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm text-slate-200">
              Bijna klaar! We hebben een bevestigingsmail naar{" "}
              <span className="text-white font-medium">{email}</span> gestuurd.
              Klik op de link in die mail om je account te activeren.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm text-slate-300 mb-2">
                  Naam
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Voor- en achternaam"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/12 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-accent focus:bg-white/[0.05] transition-colors"
                />
              </div>

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
                <label htmlFor="password" className="block text-sm text-slate-300 mb-2">
                  Wachtwoord
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimaal 8 tekens"
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

                {/* Sterktemeter */}
                {password.length > 0 && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className="h-1 flex-1 rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor:
                              i <= score ? strengthColors[score] : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Wachtwoordsterkte:{" "}
                      <span style={{ color: strengthColors[score] || "#94a3b8" }}>
                        {strengthLabels[score] || "Te kort"}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2.5 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/[0.03] accent-[#46d39a]"
                />
                <span>
                  Ik ga akkoord met de{" "}
                  <Link href="/terms" className="text-accent hover:underline">
                    voorwaarden
                  </Link>{" "}
                  en het{" "}
                  <Link href="/privacy" className="text-accent hover:underline">
                    privacybeleid
                  </Link>
                  .
                </span>
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
                {status === "loading" ? "Bezig…" : "Account aanmaken"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}