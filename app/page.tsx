import Link from "next/link";

/* ── Consistent line icons (no emoji) ── */
const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "w-6 h-6",
  "aria-hidden": true,
};

const features = [
  {
    title: "Foto en klaar",
    description:
      "Maak een foto van je bonnetje of sleep een PDF erin. Numico leest de rest.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h5l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <circle cx="12" cy="12.5" r="3.2" />
      </svg>
    ),
  },
  {
    title: "Slimme herkenning",
    description:
      "Datum, bedrag, btw en leverancier worden automatisch herkend — met 98,2% nauwkeurigheid.",
    icon: (
      <svg {...iconProps}>
        <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        <path d="M9 11h6M9 14.5h4" />
        <path d="m13.5 8 1 1 2-2" />
      </svg>
    ),
  },
  {
    title: "Rapportage",
    description:
      "Overzichten voor je accountant en de Belastingdienst, altijd actueel.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 19h14" />
        <path d="M7 19v-6M12 19V7M17 19v-9" />
      </svg>
    ),
  },
  {
    title: "Kostenbeheer",
    description:
      "Houd uitgaven per categorie en per project bij, in één rustig overzicht.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 7a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v1" />
        <path d="M4 7v10a2 2 0 0 0 2 2h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2z" />
        <circle cx="16" cy="12.5" r="1.2" />
      </svg>
    ),
  },
  {
    title: "Automatisch terugkerend",
    description:
      "Vaste lasten en abonnementen herkent Numico zelf en boekt ze maandelijks in.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 12a8 8 0 0 1 14-5.3L20 9" />
        <path d="M20 4v5h-5" />
        <path d="M20 12a8 8 0 0 1-14 5.3L4 15" />
        <path d="M4 20v-5h5" />
      </svg>
    ),
  },
  {
    title: "Overal bij de hand",
    description:
      "Op kantoor, thuis of onderweg. Numico werkt op je telefoon én je laptop.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="13" height="9" rx="1.5" />
        <path d="M3 17h10" />
        <rect x="16" y="9" width="5" height="10" rx="1.5" />
      </svg>
    ),
  },
];

const stats = [
  { number: "2.000+", label: "ondernemers" },
  { number: "120K+", label: "bonnetjes verwerkt" },
  { number: "98,2%", label: "herkend zonder correctie" },
  { number: "5 min", label: "bespaard per dag" },
];

const steps = [
  {
    num: "01",
    title: "Maak een foto",
    desc: "Snap je bonnetje of upload een scan. Een schoenendoos vol papier kan ook.",
  },
  {
    num: "02",
    title: "Numico leest mee",
    desc: "De gegevens worden uitgelezen, gecontroleerd en op de juiste grootboekrekening gezet.",
  },
  {
    num: "03",
    title: "Geboekt",
    desc: "Je uitgave staat gecategoriseerd in je administratie. Klaar voor je aangifte.",
  },
];

export default function Home() {
  return (
    <div className="relative z-10 flex flex-col">
      {/* ══════════ HERO ══════════ */}
      <section className="relative px-6 pt-36 pb-24 md:pt-44 md:pb-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center">
          {/* Left: words */}
          <div>
            <div className="reveal flex items-center gap-3 mb-7">
              <span className="eyebrow text-accent">Boekhouding op de automatische piloot</span>
            </div>

            <h1
              className="display text-white text-5xl md:text-6xl lg:text-[4.4rem] leading-[1.02] mb-7 reveal"
              style={{ animationDelay: "0.06s" }}
            >
              Van bonnetje
              <br />
              naar boeking.
              <br />
              <span className="italic text-accent">Vanzelf.</span>
            </h1>

            <p
              className="text-lg md:text-xl text-slate-300/90 max-w-xl leading-relaxed mb-9 reveal"
              style={{ animationDelay: "0.12s" }}
            >
              Maak een foto van je bonnetje. Numico leest het uit, bepaalt de btw
              en zet het op de juiste rekening — zodat jij geen schoenendoos meer
              hoeft te sorteren.
            </p>

            <div
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-9 reveal"
              style={{ animationDelay: "0.18s" }}
            >
              <Link
                href="/app"
                className="group inline-flex items-center justify-center gap-2.5 bg-accent text-ink px-7 py-3.5 rounded-full text-base font-semibold transition-all duration-300 hover:bg-[#5fe0ad] hover:-translate-y-0.5"
              >
                Begin gratis
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-medium text-slate-200 border border-white/15 transition-colors duration-300 hover:border-white/30 hover:text-white"
              >
                Bekijk demo
              </Link>
            </div>

            <p
              className="num text-xs text-slate-400 tracking-wide reveal"
              style={{ animationDelay: "0.24s" }}
            >
              Werkt samen met Exact en Twinfield · 14 dagen gratis
            </p>
          </div>

          {/* Right: the signature — receipt scanned into a ledger line */}
          <div
            className="reveal flex flex-col items-center"
            style={{ animationDelay: "0.2s" }}
            aria-hidden="true"
          >
            {/* Receipt */}
            <div className="relative w-[260px] sm:w-[280px]">
              <div className="receipt-tear relative bg-paper text-ink rounded-t-[10px] px-6 pt-6 pb-7 shadow-2xl shadow-black/40 rotate-[-2.2deg]">
                {/* scan beam */}
                <div className="scanbeam absolute left-3 right-3 h-[2px] bg-accent rounded-full shadow-[0_0_14px_3px_rgba(70,211,154,0.7)]" />

                <div className="num text-center text-[13px] font-medium tracking-tight mb-1">
                  ALBERT HEIJN 1043
                </div>
                <div className="num text-center text-[10px] text-ink/60 mb-4">
                  Amsterdam · 14-06-2026 · 17:42
                </div>

                <div className="border-t border-dashed border-ink/30 pt-3 space-y-1.5 num text-[11px]">
                  <div className="flex justify-between">
                    <span>Volkoren brood</span>
                    <span>2,49</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Halfvolle melk 2L</span>
                    <span>2,15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Koffiebonen 500g</span>
                    <span>8,99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Olijfolie extra</span>
                    <span>6,49</span>
                  </div>
                  <div className="flex justify-between text-ink/60">
                    <span>Diversen</span>
                    <span>7,33</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/30 mt-3 pt-2.5 num text-[11px]">
                  <div className="flex justify-between text-ink/60">
                    <span>btw 9%</span>
                    <span>2,31</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[13px] mt-1">
                    <span>TOTAAL</span>
                    <span>€ 27,45</span>
                  </div>
                </div>

                <div className="barcode h-8 mt-5 mx-1 opacity-80" />
              </div>
            </div>

            {/* connector */}
            <div className="flex flex-col items-center my-1 text-accent">
              <svg className="w-5 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v28M6 26l6 6 6-6" />
              </svg>
            </div>

            {/* Ledger line (the extracted result) */}
            <div className="surface w-full max-w-[330px] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="eyebrow text-slate-400">Boekingsregel</span>
                <span className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Geboekt
                </span>
              </div>

              <div className="space-y-2.5 text-sm">
                <Row label="Leverancier" value="Albert Heijn" />
                <Row label="Datum" value="14 jun 2026" mono />
                <Row label="Categorie" value="Boodschappen" />
                <Row label="Btw (9%)" value="€ 2,31" mono />
                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                  <span className="text-slate-400">Bedrag</span>
                  <span className="num text-white font-semibold text-base">€ 27,45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ LEDGER STAT STRIP ══════════ */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto surface rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-white/10 md:divide-y-0 md:divide-x">
            {stats.map((s, i) => (
              <div key={i} className="px-6 py-6 text-center">
                <div className="num text-2xl md:text-3xl text-white font-medium">
                  {s.number}
                </div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="px-6 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="eyebrow text-accent">Wat Numico doet</span>
            <h2 className="display text-white text-3xl md:text-5xl mt-4 leading-tight">
              Minder administratie,
              <br className="hidden sm:block" /> meer ondernemen.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-[#0d1320] p-8 transition-colors duration-300 hover:bg-[#111a2b]"
              >
                <div className="text-accent mb-5">{f.icon}</div>
                <h3 className="display text-white text-xl mb-2.5">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-[15px]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="px-6 py-24 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow text-accent">Zo werkt het</span>
            <h2 className="display text-white text-3xl md:text-5xl mt-4 leading-tight">
              Drie stappen. Geen handwerk.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="num text-accent text-sm mb-4">{step.num}</div>
                <div className="border-t border-white/12 pt-5">
                  <h3 className="display text-white text-2xl mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-[15px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="display text-white text-4xl md:text-6xl leading-[1.05] mb-6">
            Klaar met bonnetjes
            <br />
            <span className="italic text-accent">sorteren?</span>
          </h2>
          <p className="text-lg text-slate-300/90 max-w-md mx-auto mb-10">
            Probeer Numico veertien dagen gratis. Geen creditcard, geen
            verplichtingen.
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
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-medium text-slate-200 border border-white/15 transition-colors duration-300 hover:border-white/30 hover:text-white"
            >
              Praat met ons
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`text-slate-100 ${mono ? "num" : ""}`}>{value}</span>
    </div>
  );
}