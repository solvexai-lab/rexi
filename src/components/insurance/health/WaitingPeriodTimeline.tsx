"use client";

import { Clock } from "lucide-react";
import type { HealthPolicyData } from "@/lib/insurance/types";

interface WaitingPeriodTimelineProps {
    policyData: HealthPolicyData;
}

export function WaitingPeriodTimeline({ policyData }: WaitingPeriodTimelineProps) {
    const start = policyData.policyStart ? new Date(policyData.policyStart) : null;
    const periods = [
        { label: "Initial Waiting", days: policyData.waitingPeriods.initialDays, unit: "days", durationDays: policyData.waitingPeriods.initialDays },
        { label: "Specific Diseases", months: policyData.waitingPeriods.specificDiseaseMonths, unit: "months", durationDays: policyData.waitingPeriods.specificDiseaseMonths * 30 },
        { label: "Pre-existing Diseases", months: policyData.waitingPeriods.pedMonths, unit: "months", durationDays: policyData.waitingPeriods.pedMonths * 30 },
        ...(policyData.waitingPeriods.maternityMonths && policyData.waitingPeriods.maternityMonths > 0 ? [{
            label: "Maternity", months: policyData.waitingPeriods.maternityMonths, unit: "months", durationDays: policyData.waitingPeriods.maternityMonths * 30
        }] : []),
    ];

    const unlockDate = (daysFromStart: number) => {
        if (!start) return "Start date unknown";
        const d = new Date(start);
        d.setDate(d.getDate() + daysFromStart);
        const now = new Date();
        const elapsed = now > d;
        return `${elapsed ? "✅ Unlocked" : "🔒"} ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
    };

    return (
        <div className="glass-panel-heavy squircle-soft shadow-sm p-6 md:p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg text-slate-950">Waiting Periods</h3>
                    <p className="text-xs text-slate-500 font-medium">Claims are blocked until these dates</p>
                </div>
            </div>
            <div className="space-y-4">
                {periods.map((p) => (
                    <div key={p.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div>
                            <p className="font-bold text-sm text-slate-900">{p.label}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{unlockDate(p.durationDays)}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-serif font-bold text-slate-950">
                                {p.unit === "days" ? `${p.days}d` : `${p.months}m`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
