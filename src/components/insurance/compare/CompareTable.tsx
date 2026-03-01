"use client";

import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Crown } from "lucide-react";
import type { CompareRow, ExtractedInsurer } from "@/lib/insurance/types";

interface CompareTableProps {
    rows: CompareRow[];
    insurers: ExtractedInsurer[];
}

function CoverageCell({
    value,
    covered,
    isWinner,
}: {
    value: string;
    covered: boolean | null;
    isWinner: boolean;
}) {
    return (
        <div className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${isWinner ? "bg-amber-50 text-amber-800 font-bold" : ""
            }`}>
            {covered === true && <Check className="w-4 h-4 text-green-500 shrink-0" />}
            {covered === false && <X className="w-4 h-4 text-red-400 shrink-0" />}
            <span className={`text-sm font-semibold ${covered === false ? "text-slate-400" : "text-slate-800"}`}>
                {value}
            </span>
            {isWinner && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
        </div>
    );
}

// ── Mobile: Accordion ─────────────────────────────────────────────────────────
function MobileTable({ rows, insurers }: CompareTableProps) {
    const [open, setOpen] = useState<string | null>(null);

    return (
        <div className="divide-y divide-slate-100">
            {rows.map((row) => {
                const isOpen = open === row.feature;
                return (
                    <div key={row.feature}>
                        <button
                            onClick={() => setOpen(isOpen ? null : row.feature)}
                            className="w-full flex items-center justify-between py-3.5 px-1 text-left group"
                        >
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{row.feature}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{row.description}</p>
                            </div>
                            {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="pb-3 space-y-2 animate-in slide-in-from-top-1 duration-150">
                                {row.values.map((v) => {
                                    const insurer = insurers[v.insurerIndex];
                                    return (
                                        <div
                                            key={v.insurerIndex}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl ${v.isWinner ? "bg-amber-50 border border-amber-100" : "bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                                                    {v.insurerIndex + 1}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 truncate">
                                                    {insurer?.insurerName || `Insurer ${v.insurerIndex + 1}`}
                                                </span>
                                            </div>
                                            <CoverageCell value={v.value} covered={v.covered} isWinner={v.isWinner} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Desktop: Side-by-side table ───────────────────────────────────────────────
function DesktopTable({ rows, insurers }: CompareTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th className="text-left py-3 px-4 font-bold text-slate-500 text-xs uppercase tracking-widest w-52">
                            Feature
                        </th>
                        {insurers.map((ins, i) => (
                            <th key={i} className="py-3 px-4 font-bold text-slate-900 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-xl bg-slate-950 text-white text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm">{ins.insurerName}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {rows.map((row) => (
                        <tr key={row.feature} className="hover:bg-slate-50/60 transition-colors group">
                            <td className="py-3 px-4">
                                <p className="font-bold text-slate-900 text-sm">{row.feature}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{row.description}</p>
                            </td>
                            {row.values.map((v) => (
                                <td
                                    key={v.insurerIndex}
                                    className={`py-2 px-4 text-center border-l border-slate-50 ${v.isWinner ? "bg-amber-50/40" : ""
                                        }`}
                                >
                                    <CoverageCell value={v.value} covered={v.covered} isWinner={v.isWinner} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function CompareTable({ rows, insurers }: CompareTableProps) {
    return (
        <div className="glass-panel-heavy rounded-3xl border-white/60 overflow-hidden shadow-dreamy">
            <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-serif font-bold text-xl text-slate-950">Coverage Comparison</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Tap a row to expand on mobile</p>
                </div>
            </div>

            {/* Mobile */}
            <div className="block sm:hidden px-4 pb-4">
                <MobileTable rows={rows} insurers={insurers} />
            </div>

            {/* Desktop */}
            <div className="hidden sm:block p-2">
                <DesktopTable rows={rows} insurers={insurers} />
            </div>
        </div>
    );
}
