"use client";

import Link from "next/link";
import { useState } from "react";

// ── data ──────────────────────────────────────────────────────

const plans = [
  {
    name: "Starter",
    monthlyPrice: 9,
    yearlyPrice: 7,
    yearlyTotal: 84,
    description: "Voor wie net begint met digitale administratie.",
    features: [
      "Tot 100 bonnetjes per maand",
      "Basis AI-categorisatie",
      "Standaard maandrapport",
      "Email ondersteuning",
    ],
    cta: "Begin gratis",
    ctaHref: "/app",
    popular: false,
  },
  {
    name: "Professional",
    monthlyPrice: 19,
    yearlyPrice: 16,
    yearlyTotal: 192,
    description: "Onbeperkt verwerken, slimme koppeling met je boekhouding.",
    features: [
      "Onbeperkt bonnetjes",
      "Geavanceerde AI-functies",
      "Uitgebreide rapporten & exports",
      "Exact & Twinfield koppeling",
      "Prioriteit ondersteuning",
    ],
    cta: "Begin gratis",
    ctaHref: "/app",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 49,
    yearlyPrice: 41,
    yearlyTotal: 492,
    description: "Voor teams met meerdere gebruikers en maatwerk koppelingen.",
    features: [
      "Alles in Professional",
      "Multi-user accounts",
      "Custom integraties",
      "Dedicated accountmanager",
      "SLA garantie",
    ],
    cta: "Neem contact op",
    ctaHref: "/contact",
    popular: false,
  },
];

const comparison: { feature: string; values: (string | boolean)[] }[] = [
  { feature: "Bonnetjes per maand", values: ["100", "Onbeperkt", "Onbeperkt"] },
  { feature: "AI-categorisatie", values: ["Basis", "Geavanceerd", "Geavanceerd"] },
  { feature: "Rapportages", values: ["Standaard", "Uitgebreid", "Uitgebreid"] },
  { feature: "Exact / Twinfield", values: [false, true, true] },
  { feature: "Multi-user", values: [false, false, true] },
  { feature: "Custom integraties", values: [false, false, true] },
  { feature: "SLA garantie", values: [false, false, true] },
];

const faqs = [
  {
    q: "Kan ik op elk moment opzeggen?",
    a: "Ja. Maandabonnementen zijn per direct opzegbaar zonder kosten of vragen. Jaarabonnementen lopen tot het einde van de periode.",
  },
  {
    q: "Wat telt als één bonnetje?",
    a: "Elke verwerkte upload — foto, PDF of scan — telt als één bonnetje. Duplicaten die wij automatisch herkennen, tellen niet mee.",
  },
  {
    q: "Werkt Numico met mijn boekhoudpakket?",
    a: "Numico koppelt met Exact Online en Twinfield. Andere koppelingen zijn onderweg. Enterprise-klanten kunnen maatwerk aanvragen.",
  },
  {
    q: "Is mijn data veilig?",
    a: "Alle data staat versleuteld opgeslagen op servers in Nederland (ISO 27001-gecertificeerd). We delen nooit gegevens met derden.",
  },
  {
    q: "Geldt de proefperiode voor alle plannen?",
    a: "Ja, elk plan is 14 dagen gratis te proberen — zonder creditcard. Daarna kies je zelf of en welk plan je wilt voortzetten.",
  },
];

// ── component ─────────────────────────────────────────────────

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="relative z-10">

      {/* ══════════ HEADER ══════════ */}
      <section className="px-6 pt-36 pb-16 md:pt-44 md:pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="eyebrow text-accent reveal">Transparante prijzen</span>

          <h1
            className="display text-white text-4xl md:text-6xl mt-4 mb-5 leading-[1.05] reveal"
            style={{ animationDelay: "0.06s" }}
          >
            Kies het plan dat
            <br />
            <span className="italic text-accent">bij jou past.</span>
          </h1>

          <p
            className="text-lg text-slate-300/90 max-w-xl mx-auto mb-10 reveal"
            style={{ animationDelay: "0.12s" }}
          >
            Geen verborgen kosten. Op elk moment opzegbaar.
          </p>

          {/* billing toggle */}
          <div
            className="inline-flex items-center surface rounded-full p-1 reveal"
            style={{ animationDelay: "0.18s" }}
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                !yearly ? "bg-accent text-ink" : "text-slate-400 hover:text-white"
              }`}
            >
              Per maand
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                yearly ? "bg-accent text-ink" : "text-slate-400 hover:text-white"
              }`}
            >
              Per jaar
              <span
                className={`eyebrow text-[9px] px-1.5 py-0.5 rounded-full transition-all ${
                  yearly ? "bg-ink/20 text-ink" : "bg-accent/15 text-accent"
                }`}
              >
                −22%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ PLAN CARDS ══════════ */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5 lg:gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-[#0d1a14] border border-accent/25 shadow-[0_0_80px_rgba(70,211,154,0.07)]"
                  : "bg-[#0d1320] border border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 eyebrow text-[9px] text-ink bg-accent px-3.5 py-1 rounded-full whitespace-nowrap">
                  Meest populair
                </div>
              )}

              {/* name + description */}
              <div className="mb-7">
                <h2
                  className={`display text-2xl mb-2 ${
                    plan.popular ? "text-accent" : "text-white"
                  }`}
                >
                  {plan.name}
                </h2>
                <p className="text-slate-400 text-[15px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* price */}
              <div className="mb-7">
                <div className="flex items-end gap-1.5">
                  <span className="num text-white text-5xl font-semibold leading-none">
                    €{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-slate-400 text-sm pb-1">/maand</span>
                </div>
                <p className="num text-slate-500 text-xs mt-1.5 min-h-[1rem]">
                  {yearly
                    ? `Gefactureerd als €${plan.yearlyTotal}/jaar`
                    : " "}
                </p>
              </div>

              {/* features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <svg
                      className="w-4 h-4 text-accent flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`group w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-accent text-ink hover:bg-[#5fe0ad]"
                    : "border border-white/[0.12] text-slate-200 hover:border-white/[0.25] hover:text-white"
                }`}
              >
                {plan.cta}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ TRUST STRIP ══════════ */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="surface rounded-2xl px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x divide-white/[0.08]">
            {[
              { label: "14 dagen gratis", sub: "Geen creditcard nodig" },
              { label: "Altijd opzegbaar", sub: "Maand-tot-maand" },
              { label: "Data in Nederland", sub: "ISO 27001-gecertificeerd" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:px-6 first:pl-0 last:pr-0"
              >
                <svg
                  className="w-5 h-5 text-accent flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-white text-sm font-medium">{item.label}</div>
                  <div className="text-slate-400 text-xs">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ COMPARISON TABLE ══════════ */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-white text-3xl md:text-4xl text-center mb-10 leading-tight">
            Wat zit er in
            <br />
            <span className="italic text-accent">elk plan?</span>
          </h2>

          <div className="surface rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left p-5 w-[40%]" />
                  {plans.map((p, i) => (
                    <th key={i} className="p-5 text-center border-l border-white/[0.08]">
                      <span
                        className={`text-sm font-semibold ${
                          p.popular ? "text-accent" : "text-white"
                        }`}
                      >
                        {p.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b last:border-0 border-white/[0.06] ${
                      i % 2 !== 0 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="px-5 py-4 text-slate-400 text-sm">{row.feature}</td>
                    {row.values.map((val, j) => (
                      <td
                        key={j}
                        className="px-5 py-4 text-center border-l border-white/[0.06]"
                      >
                        {typeof val === "boolean" ? (
                          val ? (
                            <svg
                              className="w-5 h-5 text-accent mx-auto"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-slate-700 text-xl leading-none">–</span>
                          )
                        ) : (
                          <span className="num text-slate-200 text-sm">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="px-6 pb-24 md:pb-28">
        <div className="max-w-2xl mx-auto">
          <span className="eyebrow text-accent">Veelgestelde vragen</span>
          <h2 className="display text-white text-3xl md:text-4xl mt-4 mb-10 leading-tight">
            Alles wat je
            <br />
            wilt weten.
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-white/[0.08] rounded-xl overflow-hidden open:border-white/[0.14]"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-white text-sm font-medium hover:text-accent transition-colors duration-150 [list-style:none] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <svg
                    className="w-4 h-4 text-slate-500 flex-shrink-0 ml-4 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pt-3 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/[0.08]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="px-6 pb-28 md:pb-36">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="display text-white text-4xl md:text-5xl leading-[1.05] mb-6">
            Klaar om te beginnen?
            <br />
            <span className="italic text-accent">Gratis.</span>
          </h2>
          <p className="text-lg text-slate-300/90 max-w-md mx-auto mb-10">
            14 dagen alle functies. Daarna kies je zelf. Geen creditcard nodig.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/app"
              className="group inline-flex items-center justify-center gap-2.5 bg-accent text-ink px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:bg-[#5fe0ad] hover:-translate-y-0.5"
            >
              Begin gratis
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-medium text-slate-200 border border-white/15 transition-colors duration-300 hover:border-white/30 hover:text-white"
            >
              Stel een vraag
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
