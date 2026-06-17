import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const eur = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const colors = ["#3b82f6", "#a855f7", "#f97316", "#14b8a6", "#ec4899", "#64748b", "#10b981", "#f59e0b"];

type Row = { category: string; amount: number | string; vat: number | string };

export default async function CategorieenPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("bookings").select("category, amount, vat");
  const rows = (data ?? []) as Row[];
  const num = (v: number | string) => Number(v) || 0;

  const map = new Map<string, { amount: number; vat: number; count: number }>();
  rows.forEach((r) => {
    const cur = map.get(r.category) ?? { amount: 0, vat: 0, count: 0 };
    cur.amount += num(r.amount); cur.vat += num(r.vat); cur.count += 1;
    map.set(r.category, cur);
  });
  const total = [...map.values()].reduce((a, b) => a + b.amount, 0) || 1;
  const cats = [...map.entries()]
    .map(([name, v]) => ({ name, ...v, pct: Math.round((v.amount / total) * 100) }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <main className="px-5 py-7 lg:px-9 lg:py-9 max-w-[1080px]">
      <div className="mb-7">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Categorieën</p>
        <h1 className="display text-white text-3xl sm:text-4xl leading-tight">Uitgaven per categorie</h1>
        <p className="text-sm text-slate-500 mt-1">Waar je geld naartoe gaat, in één oogopslag.</p>
      </div>

      {cats.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-6 py-14 text-center">
          <p className="text-white font-medium mb-1">Nog geen categorieën</p>
          <p className="text-slate-500 text-sm">Zodra je bonnetjes toevoegt, verschijnen ze hier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cats.map((c, i) => (
            <div key={c.name} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-white font-medium">{c.name}</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${colors[i % colors.length]}18`, color: colors[i % colors.length] }}>{c.pct}%</span>
              </div>
              <p className="num text-2xl text-white font-semibold mb-3">{eur(c.amount)}</p>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: colors[i % colors.length] }} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="num">{c.count} {c.count === 1 ? "boeking" : "boekingen"}</span>
                <span className="num">btw {eur(c.vat)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
