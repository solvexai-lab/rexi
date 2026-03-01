"use client";

import { AlertTriangle } from "lucide-react";
import type { HealthPolicyData } from "@/lib/insurance/types";
import { formatCurrencyCompact } from "@/lib/utils/currency";

interface HealthMetricCardsProps {
    policyData: HealthPolicyData;
}

export function HealthMetricCards({ policyData }: HealthMetricCardsProps) {
    const cards = [
        {
            label: "Room Rent Limit",
            value: policyData.roomRentLimitType === "none"
                ? "No Limit"
                : policyData.roomRentLimitType === "percentage"
                    ? `${policyData.roomRentPercent}% of SI`
                    : `${formatCurrencyCompact(policyData.roomRentLimit || 0)}/day`,
            sub: policyData.roomRentLimitType === "none" ? "Any room category" : "⚠ Cap may trigger proportionate deduction",
            warn: policyData.roomRentLimitType !== "none",
        },
        {
            label: "Co-payment",
            value: `${policyData.coPay}%`,
            sub: policyData.coPay === 0 ? "Zero co-pay — insurer bears full bill" : `You bear ${policyData.coPay}% of every claim`,
            warn: policyData.coPay >= 20,
        },
        {
            label: "PED Waiting",
            value: `${policyData.waitingPeriods.pedMonths} months`,
            sub: "Pre-existing diseases waiting period",
            warn: policyData.waitingPeriods.pedMonths > 24,
        },
        {
            label: "Deductible",
            value: formatCurrencyCompact(policyData.deductible),
            sub: policyData.deductible === 0 ? "No per-claim deductible" : "Fixed amount you pay per claim",
            warn: policyData.deductible > 50000,
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
                <div key={c.label} className={`glass-panel-heavy squircle-soft p-6 border ${c.warn ? "border-amber-200/60" : "border-white/60"}`}>
                    {c.warn && <AlertTriangle className="w-4 h-4 text-amber-500 mb-2" />}
                    <p className="text-2xl font-serif font-bold text-slate-950">{c.value}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{c.label}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-snug">{c.sub}</p>
                </div>
            ))}
        </div>
    );
}
