"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "preview" | "processing" | "done";

export function UploadReceiptButton() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
  }

  function close() {
    setOpen(false);
    setTimeout(reset, 200);
  }

  function handleFile(f: File) {
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
    setPhase("preview");
  }

  function onProcess() {
    setPhase("processing");
    // TODO: hier het bestand naar Supabase Storage uploaden en door OCR halen.
    // Nu gesimuleerd voor de demo.
    setTimeout(() => setPhase("done"), 1700);
  }

  const extracted = [
    { label: "Leverancier", value: "Albert Heijn" },
    { label: "Datum", value: "18 jun 2026" },
    { label: "Categorie", value: "Boodschappen" },
    { label: "Btw (9%)", value: "€ 2,31" },
    { label: "Bedrag", value: "€ 27,45" },
  ];

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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Bonnetje uploaden"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative w-full max-w-md bg-[#11141f] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="display text-white text-xl">Bonnetje toevoegen</h2>
              <button
                onClick={close}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Sluiten"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* IDLE — dropzone */}
            {phase === "idle" && (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFile(f);
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                    dragOver ? "border-accent bg-accent/5" : "border-white/12 hover:border-white/25"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5 7.5 12M12 7.5v9" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">
                    Sleep je bonnetje hierheen
                  </p>
                  <p className="text-slate-500 text-xs">of klik om te bladeren · JPG, PNG of PDF</p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </>
            )}

            {/* PREVIEW */}
            {phase === "preview" && (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 mb-4">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Voorbeeld van bonnetje"
                      className="max-h-56 mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-6 justify-center text-slate-300">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l2.25 2.25L15 13.5m-3-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm truncate max-w-[200px]">{file?.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/12 hover:border-white/25 transition-colors"
                  >
                    Ander bestand
                  </button>
                  <button
                    onClick={onProcess}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent text-ink hover:bg-[#5fe0ad] transition-colors"
                  >
                    Verwerken
                  </button>
                </div>
              </>
            )}

            {/* PROCESSING */}
            {phase === "processing" && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                <p className="text-white text-sm font-medium">Numico leest je bonnetje…</p>
                <p className="text-slate-500 text-xs mt-1">Datum, bedrag en btw worden herkend.</p>
              </div>
            )}

            {/* DONE */}
            {phase === "done" && (
              <>
                <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0z" clipRule="evenodd" />
                  </svg>
                  Herkend
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5 mb-2">
                  {extracted.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="text-white num">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mb-4">
                  Voorbeeldherkenning — koppel OCR + Supabase Storage voor echte gegevens.
                </p>
                <button
                  onClick={close}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-accent text-ink hover:bg-[#5fe0ad] transition-colors"
                >
                  In administratie zetten
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}