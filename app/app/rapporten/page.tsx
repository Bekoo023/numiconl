import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const eur = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

type Row = { category: string; booked_on: string; amount: number | string; vat: number | string };

export default async function RapportenPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("bookings").select("category, booked_on, amount, vat");
  const rows = (data ?? []) as Row[];
  const num = (v: number | string) => Number(v) || 0;

  const year = new Date().getFullYear();
  const yearRows = rows.filter((r) => new Date(r.booked_on).getFullYear() === year);

  const quarters = [0, 1, 2, 3].map((q) => {
    const qRows = yearRows.filter((r) => Math.floor(new Date(r.booked_on).getMonth() / 3) === q);
    return {
      label: `Q${q + 1}`,
      amount: qRows.reduce((a, r) => a + num(r.amount), 0),
      vat: qRows.reduce((a, r) => a + num(r.vat), 0),
      count: qRows.length,
    };
  });

  const totalAmount = yearRows.reduce((a, r) => a + num(r.amount), 0);
  const totalVat = yearRows.reduce((a, r) => a + num(r.vat), 0);

  const catMap = new Map<string, { amount: number; vat: number; count: number }>();
  yearRows.forEach((r) => {
    const cur = catMap.get(r.category) ?? { amount: 0, vat: 0, count: 0 };
    cur.amount += num(r.amount); cur.vat += num(r.vat); cur.count += 1;
    catMap.set(r.category, cur);
  });
  const cats = [...catMap.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.amount - a.amount);

  return (
    <main className="px-5 py-7 lg:px-9 lg:py-9 max-w-[1080px]">
      <div className="mb-7">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Rapporten</p>
        <h1 className="display text-white text-3xl sm:text-4xl leading-tight">Overzicht {year}</h1>
        <p className="text-sm text-slate-500 mt-1">Je uitgaven en btw, samengevat per kwartaal en categorie.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-[11px] text-slate-500 mb-1">Totale uitgaven {year}</p>
          <p className="num text-2xl lg:text-3xl text-white font-semibold">{eur(totalAmount)}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-[11px] text-slate-500 mb-1">Te verrekenen btw {year}</p>
          <p className="num text-2xl lg:text-3xl text-white font-semibold">{eur(totalVat)}</p>
        </div>
      </div>

      {/* Btw per kwartaal */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-4">
        <h2 className="display text-white text-lg mb-5">Btw per kwartaal</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[440px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Kwartaal</th>
                <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Bonnetjes</th>
                <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Uitgaven</th>
                <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3">Btw</th>
              </tr>
            </thead>
            <tbody>
              {quarters.map((q) => (
                <tr key={q.label} className="border-b border-white/[0.04] last:border-0">
                  <td className="text-white font-medium py-3.5 pr-4">{q.label}</td>
                  <td className="num text-slate-400 py-3.5 pr-4 text-right">{q.count}</td>
                  <td className="num text-slate-300 py-3.5 pr-4 text-right">{eur(q.amount)}</td>
                  <td className="num text-white font-semibold py-3.5 text-right">{eur(q.vat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per categorie */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
        <h2 className="display text-white text-lg mb-5">Uitgaven per categorie</h2>
        {cats.length === 0 ? (
          <p className="text-sm text-slate-500">Nog geen gegevens dit jaar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[440px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Categorie</th>
                  <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Aantal</th>
                  <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Uitgaven</th>
                  <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3">Btw</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c.name} className="border-b border-white/[0.04] last:border-0">
                    <td className="text-white py-3.5 pr-4">{c.name}</td>
                    <td className="num text-slate-400 py-3.5 pr-4 text-right">{c.count}</td>
                    <td className="num text-slate-300 py-3.5 pr-4 text-right">{eur(c.amount)}</td>
                    <td className="num text-slate-400 py-3.5 text-right">{eur(c.vat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
