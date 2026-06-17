"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function ProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");

  async function save() {
    setError("");
    setStatus("saving");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (updateError) {
      setError(updateError.message);
      setStatus("idle");
      return;
    }
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div>
      <label htmlFor="name" className="block text-sm text-slate-300 mb-2">Naam</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.1] px-4 py-3 text-sm text-white outline-none focus:border-accent transition-colors"
        />
        <button
          onClick={save}
          disabled={status === "saving"}
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-accent text-ink hover:bg-[#5fe0ad] transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Opslaan…" : status === "done" ? "Opgeslagen ✓" : "Opslaan"}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}
    </div>
  );
}
