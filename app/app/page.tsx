import { createClient } from "@/utils/supabase/server";
import { UploadReceiptButton } from "@/components/UploadReceiptButton";
import { TransactionsTable } from "@/components/TransactionsTable";

export const dynamic = "force-dynamic";

const eur = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const catColors = ["#3b82f6", "#a855f7", "#f97316", "#14b8a6", "#ec4899", "#64748b"];

type BookingRow = {
  vendor: string; category: string; booked_on: string;
  amount: number | string; vat: number | string; status: string;
};

const statIcons = {
  spend: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />,
  vat: <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  count: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
  pending: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

function nextVatDeadline(now: Date) {
  const y = now.getFullYear();
  const c = [new Date(y, 0, 31), new Date(y, 3, 30), new Date(y, 6, 31), new Date(y, 9, 31), new Date(y + 1, 0, 31)];
  const next = c.find((d) => d >= now) ?? c[c.length - 1];
  return { next, days: Math.max(0, Math.ceil((next.getTime() - now.getTime()) / 86_400_000)) };
}

function pctDelta(cur: number, prev: number) {
  if (prev <= 0) return null;
  const p = Math.round(((cur - prev) / prev) * 100);
  return { delta: `${p >= 0 ? "+" : "−"}${Math.abs(p)}%`, up: p >= 0 };
}

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("bookings")
    .select("vendor, category, booked_on, amount, vat, status")
    .order("booked_on", { ascending: false });

  const rows = (data ?? []) as BookingRow[];
  const num = (v: number | string) => Number(v) || 0;

  const now = new Date();
  const tM = now.getMonth(), tY = now.getFullYear();
  const prev = new Date(tY, tM - 1, 1);
  const inMonth = (r: BookingRow, m: number, y: number) => {
    const d = new Date(r.booked_on); return d.getMonth() === m && d.getFullYear() === y;
  };

  const monthRows = rows.filter((r) => inMonth(r, tM, tY));
  const prevRows = rows.filter((r) => inMonth(r, prev.getMonth(), prev.getFullYear()));
  const spend = monthRows.reduce((a, r) => a + num(r.amount), 0);
  const prevSpend = prevRows.reduce((a, r) => a + num(r.amount), 0);
  const vatSum = monthRows.reduce((a, r) => a + num(r.vat), 0);
  const prevVat = prevRows.reduce((a, r) => a + num(r.vat), 0);
  const count = monthRows.length;
  const pending = rows.filter((r) => r.status === "In behandeling").length;

  const stats = [
    { label: "Uitgaven deze maand", value: eur(spend), trend: pctDelta(spend, prevSpend), icon: statIcons.spend },
    { label: "Te verrekenen btw", value: eur(vatSum), trend: pctDelta(vatSum, prevVat), icon: statIcons.vat },
    { label: "Bonnetjes deze maand", value: String(count), trend: pctDelta(count, prevRows.length), icon: statIcons.count },
    { label: "In behandeling", value: String(pending), trend: null, icon: statIcons.pending },
  ];

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(tY, tM - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, m: d.toLocaleDateString("nl-NL", { month: "short" }), v: 0 };
  });
  rows.forEach((r) => {
    const d = new Date(r.booked_on);
    const slot = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (slot) slot.v += num(r.amount);
  });
  const maxV = Math.max(1, ...months.map((d) => d.v));
  const totalSpend = months.reduce((a, d) => a + d.v, 0);

  const catMap = new Map<string, number>();
  rows.forEach((r) => catMap.set(r.category, (catMap.get(r.category) ?? 0) + num(r.amount)));
  const totalCat = [...catMap.values()].reduce((a, b) => a + b, 0) || 1;
  const categories = [...catMap.entries()]
    .map(([name, value]) => ({ name, value, pct: Math.round((value / totalCat) * 100) }))
    .sort((a, b) => b.value - a.value).slice(0, 6);

  const tableRows = rows.slice(0, 10).map((r) => ({
    date: new Date(r.booked_on).toLocaleDateString("nl-NL", { day: "2-digit", month: "short" }),
    vendor: r.vendor, cat: r.category, vat: eur(num(r.vat)), amount: eur(num(r.amount)), status: r.status,
  }));

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";
  const firstName = fullName.split(" ")[0] || "daar";
  const hour = now.getHours();
  const greeting = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedenavond";
  const today = now.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
  const vat = nextVatDeadline(now);
  const vatLabel = vat.next.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="px-5 py-7 lg:px-9 lg:py-9 max-w-[1080px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">{today}</p>
          <h1 className="display text-white text-3xl sm:text-4xl leading-tight">{greeting}, {firstName}.</h1>
        </div>
        {user && <UploadReceiptButton userId={user.id} />}
      </div>

      {rows.length === 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-6 py-8 text-center mb-5">
          <p className="text-white font-medium mb-1">Nog geen boekingen</p>
          <p className="text-slate-500 text-sm">Klik op &ldquo;Bonnetje uploaden&rdquo; om je eerste uitgave toe te voegen.</p>
        </div>
      )}

      <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <svg className="text-accent" style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white">Volgende btw-aangifte <span className="text-slate-500">· {vatLabel}</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Zorg dat al je bonnetjes op tijd verwerkt zijn.</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="num text-2xl text-white font-semibold">{vat.days}</span>
          <span className="text-xs text-slate-500 ml-1">dagen</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 lg:p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="text-accent" style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">{s.icon}</svg>
              </div>
              {s.trend && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${s.trend.up ? "bg-accent/10 text-accent" : "bg-rose-500/10 text-rose-400"}`}>{s.trend.delta}</span>}
            </div>
            <p className="num text-2xl lg:text-3xl text-white font-semibold mb-1">{s.value}</p>
            <p className="text-[11px] text-slate-500 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mb-4">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 lg:col-span-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="display text-white text-lg">Uitgaven per maand</h2>
              <p className="text-xs text-slate-500 mt-0.5">Laatste 6 maanden: <span className="num text-slate-300">{eur(totalSpend)}</span></p>
            </div>
            <span className="text-[11px] text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">{tY}</span>
          </div>
          <div className="mt-6">
            <div className="flex items-end gap-2 h-40">
              {months.map((d, i) => {
                const isLast = i === months.length - 1;
                return (
                  <div key={d.key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    {isLast && d.v > 0 && <span className="num text-[10px] text-accent font-semibold">{eur(d.v)}</span>}
                    <div className="w-full flex items-end" style={{ height: "100%" }}>
                      <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.round((d.v / maxV) * 100)}%`, background: isLast ? "linear-gradient(180deg, #46d39a 0%, rgba(70,211,154,0.35) 100%)" : "rgba(255,255,255,0.06)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2">
              {months.map((d) => (<div key={d.key} className="flex-1 text-center"><span className="num text-[11px] text-slate-500">{d.m}</span></div>))}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 lg:col-span-2">
          <h2 className="display text-white text-lg mb-5">Per categorie</h2>
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen gegevens.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((c, i) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColors[i % catColors.length] }} />
                      <span className="text-sm text-slate-300">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="num text-xs text-slate-500">{eur(c.value)}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${catColors[i % catColors.length]}18`, color: catColors[i % catColors.length] }}>{c.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.pct}%`, backgroundColor: catColors[i % catColors.length] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionsTable bookings={tableRows} />
    </main>
  );
}
