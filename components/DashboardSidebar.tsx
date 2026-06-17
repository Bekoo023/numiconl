"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

const navItems = [
  { label: "Overzicht", href: "/app", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
  { label: "Bonnetjes", href: "/app/bonnetjes", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /> },
  { label: "Rapporten", href: "/app/rapporten", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /> },
  { label: "Categorieën", href: "/app/categorieen", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /> },
  { label: "Instellingen", href: "/app/instellingen", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /> },
];

function avatarColor(name: string) {
  const palette = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];
  return palette[(name.charCodeAt(0) || 0) % palette.length];
}

export function DashboardSidebar({
  fullName,
  email,
  pending,
  total,
}: {
  fullName: string;
  email: string;
  pending: number;
  total: number;
}) {
  const pathname = usePathname();
  const firstName = fullName.split(" ")[0] || "daar";
  const initials =
    fullName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 fixed inset-y-0 border-r border-white/[0.06] bg-[#0d0f1e] z-30">
        <div className="px-5 pt-6 pb-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="display text-white text-lg tracking-tight">Numico</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                  active ? "bg-accent/10 text-white" : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className={active ? "text-accent" : "text-slate-500 group-hover:text-slate-300"} style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    {item.icon}
                  </svg>
                  <span>{item.label}</span>
                </div>
                {item.label === "Bonnetjes" && total > 0 && (
                  <span className="text-[10px] font-semibold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">{total}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {pending > 0 && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-xs text-amber-400 font-medium leading-snug">{pending} bonnetjes wachten</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Nog te verwerken</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ backgroundColor: `${avatarColor(firstName)}20`, color: avatarColor(firstName) }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white truncate leading-tight">{fullName || firstName}</p>
              <p className="text-[11px] text-slate-500 truncate leading-tight">{email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* ── Mobile topbar ── */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0d0f1e]">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="display text-white text-lg">Numico</span>
        </Link>
        <SignOutButton />
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0f1e]/95 backdrop-blur border-t border-white/[0.06] flex justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${active ? "text-accent" : "text-slate-500"}`}>
              <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                {item.icon}
              </svg>
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
