"use client";

import { useState } from "react";
import type { CompareClaimScenario, ExtractedInsurer } from "@/lib/insurance/types";
import { Zap } from "lucide-react";
import { formatCurrencyCompact } from "@/lib/utils/currency";

interface CompareClaimScenariosProps {
    scenarios: CompareClaimScenario[];
    insurers: ExtractedInsurer[];
}

function formatINR(n: number) {
    if (n === 0) return formatCurrencyCompact(0);
    const abs = Math.abs(n);
    const formatted = formatCurrencyCompact(abs);
    return n < 0 ? `-${formatted}` : formatted;
}

const scenarioIcons: Record<string, string> = {
    "Fender Bender": "🚗",
    "Monsoon Nightmare": "🌧️",
    "Total Loss": "🔥",
};

export function CompareClaimScenarios({ scenarios, insurers }: CompareClaimScenariosProps) {
    const [activeIdx, setActiveIdx] = useState(0);
    const scenario = scenarios[activeIdx];
    if (!scenario) return null;

    const maxYouPay = Math.max(...scenario.costs.map((c) => c.youPay));
    const safeDivisor = maxYouPay > 0 ? maxYouPay : 1;

    return (
        <div className="glass-panel-heavy rounded-3xl border-white/60 overflow-hidden shadow-dreamy">
            <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-serif font-bold text-xl text-slate-950">Claim Scenarios</h2>
                    <p className="text-xs text-slate-400 mt-0.5">How much would YOU pay out-of-pocket?</p>
                </div>
            </div>

            {/* Scenario Tabs */}
            <div className="flex gap-2 p-4 overflow-x-auto border-b border-slate-100">
                {scenarios.map((s, i) => (
                    <button
                        key={s.scenarioName}
                        onClick={() => setActiveIdx(i)}
                        role="tab"
                        aria-selected={i === activeIdx}
                        aria-label={`View scenario: ${s.scenarioName}`}
                        className={`shrink-0 flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-2xl text-sm font-bold transition-all ${i === activeIdx
                            ? "bg-slate-950 text-white shadow-lg"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        <span>{scenarioIcons[s.scenarioName] || "📋"}</span>
                        <span>{s.scenarioName}</span>
                    </button>
                ))}
            </div>

            {/* Scenario Body */}
            <div className="p-4 sm:p-6">
                <p className="text-slate-500 text-sm mb-2">{scenario.description}</p>
                {scenario.repairCost > 0 && (
                    <p className="text-xs text-slate-400 mb-5">
                        Estimated repair cost: <strong className="text-slate-700">{formatINR(scenario.repairCost)}</strong>
                    </p>
                )}

                <div className="space-y-4">
                    {scenario.costs.map((cost) => {
                        const insurer = insurers[cost.insurerIndex];
                        const barPct = maxYouPay > 0 ? (cost.youPay / safeDivisor) * 100 : 0;
                        const minYouPay = Math.min(...scenario.costs.map((c) => c.youPay));
                        const isTied = scenario.costs.filter(c => c.youPay === minYouPay).length > 1;
                        const isWinner = cost.youPay === minYouPay;

                        return (
                            <div key={cost.insurerIndex}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                                            {cost.insurerIndex + 1}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">
                                            {insurer?.insurerName || `Insurer ${cost.insurerIndex + 1}`}
                                        </span>
                                        {isWinner && (
                                            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {isTied ? "Tied Best" : "Best"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-base font-bold ${isWinner ? "text-green-600" : "text-slate-900"}`}>
                                            {formatINR(cost.youPay)}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-1">you pay</span>
                                    </div>
                                </div>

                                {/* Bar */}
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${isWinner ? "bg-green-400" : barPct > 60 ? "bg-red-400" : "bg-amber-400"
                                            }`}
                                        style={{ width: `${Math.max(barPct, 3)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Insurer pays: {formatINR(cost.insurerPays)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
