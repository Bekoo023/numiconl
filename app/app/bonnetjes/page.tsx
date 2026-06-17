import { createClient } from "@/utils/supabase/server";
import { UploadReceiptButton } from "@/components/UploadReceiptButton";

export const dynamic = "force-dynamic";

const eur = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

type Row = {
  id: string; vendor: string; category: string; booked_on: string;
  amount: number | string; vat: number | string; status: string; receipt_path: string | null;
};

export default async function BonnetjesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("bookings")
    .select("id, vendor, category, booked_on, amount, vat, status, receipt_path")
    .order("booked_on", { ascending: false });

  const rows = (data ?? []) as Row[];
  const num = (v: number | string) => Number(v) || 0;

  // Voor de privé-bucket: tijdelijke (ondertekende) links genereren
  const paths = rows.map((r) => r.receipt_path).filter((p): p is string => !!p);
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data: urls } = await supabase.storage.from("receipts").createSignedUrls(paths, 3600);
    urls?.forEach((u) => {
      if (u.signedUrl && u.path) signed[u.path] = u.signedUrl;
    });
  }

  return (
    <main className="px-5 py-7 lg:px-9 lg:py-9 max-w-[1080px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Bonnetjes</p>
          <h1 className="display text-white text-3xl sm:text-4xl leading-tight">Alle bonnetjes</h1>
          <p className="text-sm text-slate-500 mt-1">{rows.length} {rows.length === 1 ? "bonnetje" : "bonnetjes"}</p>
        </div>
        {user && <UploadReceiptButton userId={user.id} />}
      </div>

      {rows.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-6 py-14 text-center">
          <p className="text-white font-medium mb-1">Nog geen bonnetjes</p>
          <p className="text-slate-500 text-sm">Upload je eerste bonnetje om te beginnen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => {
            const url = r.receipt_path ? signed[r.receipt_path] : null;
            const isPdf = r.receipt_path?.toLowerCase().endsWith(".pdf");
            return (
              <div key={r.id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-colors">
                <div className="h-40 bg-black/30 flex items-center justify-center overflow-hidden">
                  {url && !isPdf ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={`Bonnetje ${r.vendor}`} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white font-medium truncate">{r.vendor}</span>
                    <span className="num text-white font-semibold">{eur(num(r.amount))}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{r.category}</span>
                    <span className="num text-slate-500">
                      {new Date(r.booked_on).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full ${r.status === "Geboekt" ? "bg-accent/10 text-accent" : "bg-amber-500/10 text-amber-400"}`}>
                      <span className={`w-1 h-1 rounded-full ${r.status === "Geboekt" ? "bg-accent" : "bg-amber-400"}`} />
                      {r.status}
                    </span>
                    <span className="num text-[11px] text-slate-500">btw {eur(num(r.vat))}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
