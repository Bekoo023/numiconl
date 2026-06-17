"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Phase = "idle" | "form" | "saving" | "done";

const CATEGORIES = [
  "Boodschappen",
  "Reiskosten",
  "Software",
  "Kantoor",
  "Horeca",
  "Overig",
];

export function UploadReceiptButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("Boodschappen");
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [vat, setVat] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function reset() {
    setPhase("idle");
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError("");
    setVendor("");
    setCategory("Boodschappen");
    setDate(today);
    setAmount("");
    setVat("");
  }

  function close() {
    setOpen(false);
    setTimeout(reset, 200);
  }

  function handleFile(f: File) {
    setFile(f);
    if (f.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl(null);
    setPhase("form");
  }

  const toNumber = (s: string) => Number(s.replace(",", ".")) || 0;

  async function handleSave() {
    setError("");
    if (!vendor.trim()) {
      setError("Vul de leverancier in.");
      return;
    }
    if (!amount) {
      setError("Vul het bedrag in.");
      return;
    }

    setPhase("saving");
    const supabase = createClient();

    try {
      let receipt_path: string | null = null;

      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `${userId}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;
        receipt_path = path;
      }

      const { error: insertError } = await supabase.from("bookings").insert({
        user_id: userId,
        vendor: vendor.trim(),
        category,
        booked_on: date,
        amount: toNumber(amount),
        vat: toNumber(vat),
        status: "Geboekt",
        receipt_path,
      });

      if (insertError) throw insertError;

      setPhase("done");
      router.refresh(); // ververst de dashboard-data op de achtergrond
      setTimeout(close, 1100);
    } catch (err) {
      setError(
        "Opslaan mislukt: " +
          (err instanceof Error ? err.message : "onbekende fout") +
          ". Heb je de SQL-setup gedraaid?"
      );
      setPhase("form");
    }
  }

  const inputCls =
    "w-full rounded-xl bg-white/[0.04] border border-white/[0.1] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-accent transition-colors";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="self-start sm:self-auto inline-flex items-center gap-2 bg-accent text-ink px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5fe0ad] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Bonnetje uploaden
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Bonnetje uploaden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-md bg-[#11141f] border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="display text-white text-xl">Bonnetje toevoegen</h2>
              <button onClick={close} className="text-slate-400 hover:text-white transition-colors" aria-label="Sluiten">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {phase === "idle" && (
              <>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-white/12 hover:border-white/25"}`}
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5 7.5 12M12 7.5v9" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">Sleep je bonnetje hierheen</p>
                  <p className="text-slate-500 text-xs">of klik om te bladeren · JPG, PNG of PDF</p>
                </div>
                <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </>
            )}

            {(phase === "form" || phase === "saving") && (
              <div className="space-y-4">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Voorbeeld" className="max-h-36 mx-auto rounded-lg object-contain border border-white/10" />
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 text-sm justify-center py-3 rounded-lg border border-white/10">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <span className="truncate max-w-[220px]">{file?.name}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Leverancier</label>
                  <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="bijv. Albert Heijn" className={inputCls} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Categorie</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#11141f]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Datum</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Bedrag (€)</label>
                    <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="27,45" className={`${inputCls} num`} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Btw (€)</label>
                    <input inputMode="decimal" value={vat} onChange={(e) => setVat(e.target.value)} placeholder="2,31" className={`${inputCls} num`} />
                  </div>
                </div>

                {error && <p className="text-sm text-rose-400">{error}</p>}

                <div className="flex gap-3 pt-1">
                  <button onClick={reset} disabled={phase === "saving"} className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/12 hover:border-white/25 transition-colors disabled:opacity-50">
                    Ander bestand
                  </button>
                  <button onClick={handleSave} disabled={phase === "saving"} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent text-ink hover:bg-[#5fe0ad] transition-colors disabled:opacity-60">
                    {phase === "saving" ? "Opslaan…" : "Opslaan"}
                  </button>
                </div>
              </div>
            )}

            {phase === "done" && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">Boeking toegevoegd!</p>
                <p className="text-slate-500 text-xs mt-1">Je dashboard is bijgewerkt.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}