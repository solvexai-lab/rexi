"use client";

import { Trophy, Shield, ShieldCheck } from "lucide-react";
import type { CompareWinners as CompareWinnersType, ExtractedInsurer } from "@/lib/insurance/types";

interface CompareWinnersProps {
    winners: CompareWinnersType;
    insurers: ExtractedInsurer[];
}

const badges = [
    {
        key: "bestValue" as const,
        label: "Best Value",
        Icon: Trophy,
        bg: "from-amber-50 to-yellow-50",
        border: "border-amber-100",
        iconBg: "bg-amber-400",
        text: "text-amber-800",
        sub: "text-amber-600",
    },
    {
        key: "bestCovered" as const,
        label: "Best Covered",
        Icon: Shield,
        bg: "from-blue-50 to-indigo-50",
        border: "border-blue-100",
        iconBg: "bg-blue-500",
        text: "text-blue-900",
        sub: "text-blue-600",
    },
    {
        key: "lowestRisk" as const,
        label: "Lowest Risk",
        Icon: ShieldCheck,
        bg: "from-emerald-50 to-teal-50",
        border: "border-emerald-100",
        iconBg: "bg-emerald-500",
        text: "text-emerald-900",
        sub: "text-emerald-600",
    },
] as const;

export function CompareWinners({ winners, insurers }: CompareWinnersProps) {
    return (
        <div>
            <h2 className="font-serif font-bold text-2xl text-slate-950 mb-4">Top Picks</h2>
            {/* Mobile: horizontal scroll — Desktop: grid */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:snap-none">
                {badges.map(({ key, label, Icon, bg, border, iconBg, text, sub }) => {
                    const winner = winners[key];
                    const insurer = insurers[winner.insurerIndex];
                    return (
                        <div
                            key={key}
                            className={`shrink-0 w-[72vw] max-w-[260px] snap-start sm:w-auto bg-gradient-to-br ${bg} border ${border} rounded-3xl p-5 flex flex-col gap-3`}
                        >
                            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${sub}`}>{label}</p>
                                <p className={`font-serif font-bold text-xl ${text} mt-1 leading-tight`}>
                                    {insurer?.insurerName || `Insurer ${winner.insurerIndex + 1}`}
                                </p>
                            </div>
                            <p className={`text-sm ${sub} leading-snug`}>{winner.reason}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
