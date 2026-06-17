"use client";

import { useState } from "react";

export type Booking = {
  date: string;
  vendor: string;
  cat: string;
  vat: string;
  amount: string;
  status: string;
};

const avatarPalette = [
  "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981",
  "#ef4444", "#06b6d4", "#ec4899", "#f97316",
];
const avatarColor = (name: string) =>
  avatarPalette[name.charCodeAt(0) % avatarPalette.length];

const filters = ["Alle", "Geboekt", "In behandeling"] as const;
type Filter = (typeof filters)[number];

export function TransactionsTable({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Alle");

  const filtered = bookings.filter((b) => {
    const matchesQuery = `${b.vendor} ${b.cat}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter === "Alle" || b.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="display text-white text-lg">Recente transacties</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {filtered.length} van {bookings.length} transacties
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoeken */}
          <div className="relative">
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoeken…"
              className="w-36 sm:w-44 rounded-lg bg-white/[0.04] border border-white/[0.08] pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Statusfilters */}
      <div className="flex items-center gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              filter === f
                ? "bg-accent/15 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Leverancier</th>
              <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Categorie</th>
              <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Datum</th>
              <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Btw</th>
              <th className="text-right text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Bedrag</th>
              <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr
                key={i}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 pr-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: `${avatarColor(b.vendor)}18`,
                        color: avatarColor(b.vendor),
                      }}
                    >
                      {b.vendor.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{b.vendor}</span>
                  </div>
                </td>
                <td className="text-slate-400 py-3.5 pr-4 whitespace-nowrap text-sm">{b.cat}</td>
                <td className="num text-slate-500 py-3.5 pr-4 whitespace-nowrap text-xs">{b.date}</td>
                <td className="num text-slate-500 py-3.5 pr-4 text-right whitespace-nowrap text-xs">{b.vat}</td>
                <td className="num text-white font-semibold py-3.5 pr-4 text-right whitespace-nowrap">{b.amount}</td>
                <td className="py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full ${
                      b.status === "Geboekt"
                        ? "bg-accent/10 text-accent"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        b.status === "Geboekt" ? "bg-accent" : "bg-amber-400"
                      }`}
                    />
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            Geen transacties gevonden.
          </div>
        )}
      </div>
    </div>
  );
}