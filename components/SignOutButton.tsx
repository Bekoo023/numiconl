"use client";

import { createClient } from "@/utils/supabase/client";

export function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-slate-300 hover:text-white border border-white/15 hover:border-white/30 px-5 py-2 rounded-full transition-colors"
    >
      Uitloggen
    </button>
  );
}