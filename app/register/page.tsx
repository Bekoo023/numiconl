"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

function passwordScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
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
      setError("Vul alle velden in.");
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2.5 mb-10 group">
        <span className="w-2.5 h-2.5 rounded-full bg-accent" />
        <span className="display text-white text-xl tracking-tight group-hover:opacity-80 transition-opacity">
          Numico
        </span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="surface rounded-2xl p-8 border border-white/[0.06] shadow-2xl shadow-black/50">
          {status === "done" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="display text-white text-xl mb-2">Bijna klaar!</h2>
              <p className="text-slate-400 text-sm">
                We hebben een bevestigingsmail gestuurd naar{" "}
                <span className="text-white font-medium">{email}</span>.
                Klik op de link om je account te activeren.
              </p>
            </div>
          ) : (
            <>
              <h1 className="display text-white text-2xl mb-1">Account aanmaken</h1>
              <p className="text-slate-400 text-sm mb-7">
                Al een account?{" "}
                <Link href="/login" className="text-accent hover:underline">
                  Inloggen
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Naam
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Voor- en achternaam"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    E-mailadres
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jij@bedrijf.nl"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
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
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pr-11 text-white placeholder:text-slate-600 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 focus:bg-white/[0.06] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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

                  {password.length > 0 && (
                    <div className="mt-2.5">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors duration-300"
                            style={{ backgroundColor: i <= score ? strengthColors[score] : "rgba(255,255,255,0.08)" }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">
                        Sterkte:{" "}
                        <span style={{ color: strengthColors[score] || "#64748b" }}>
                          {strengthLabels[score] || "Te kort"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/[0.03] accent-[#46d39a] flex-shrink-0"
                  />
                  <span className="text-sm text-slate-400">
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
                  <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3">
                    <svg className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-sm text-rose-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-ink py-3 rounded-xl font-semibold text-sm transition-all hover:bg-[#5fe0ad] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Bezig…
                    </>
                  ) : (
                    <>
                      Account aanmaken
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          <Link href="/" className="hover:text-slate-400 transition-colors">
            ← Terug naar home
          </Link>
        </p>
      </div>
    </div>
  );
}
