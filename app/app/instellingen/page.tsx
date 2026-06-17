import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";
import { SignOutButton } from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function InstellingenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <main className="px-5 py-7 lg:px-9 lg:py-9 max-w-[680px]">
      <div className="mb-7">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Instellingen</p>
        <h1 className="display text-white text-3xl sm:text-4xl leading-tight">Account</h1>
      </div>

      {/* Profiel */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-4">
        <h2 className="display text-white text-lg mb-5">Profiel</h2>
        <ProfileForm initialName={fullName} />
      </div>

      {/* Accountgegevens */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-4">
        <h2 className="display text-white text-lg mb-5">Accountgegevens</h2>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">E-mailadres</span>
            <span className="text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-slate-400">Lid sinds</span>
            <span className="num text-white">{memberSince}</span>
          </div>
        </div>
      </div>

      {/* Sessie */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <h2 className="display text-white text-lg mb-1">Sessie</h2>
        <p className="text-sm text-slate-500 mb-4">Uitloggen op dit apparaat.</p>
        <SignOutButton />
      </div>
    </main>
  );
}
