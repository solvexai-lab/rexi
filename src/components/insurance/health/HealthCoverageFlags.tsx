"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { HealthPolicyData } from "@/lib/insurance/types";

interface HealthCoverageFlagsProps {
    coverages: HealthPolicyData["coverages"];
}

export function HealthCoverageFlags({ coverages }: HealthCoverageFlagsProps) {
    const items = [
        { label: "Inpatient Hospitalisation", covered: coverages.inpatientHospitalization },
        { label: "Daycare Procedures", covered: coverages.dayCare },
        { label: "Ambulance Cover", covered: coverages.ambulance },
        { label: "Maternity", covered: coverages.maternity },
        { label: "Newborn Cover", covered: coverages.newbornCover },
        { label: "AYUSH Treatments", covered: coverages.ayush },
        { label: "OPD", covered: coverages.opd },
        { label: "Critical Illness", covered: coverages.criticalIllness },
        { label: "Organ Donor", covered: coverages.organDonor },
        { label: "Mental Health", covered: coverages.mentalHealth },
        { label: "Domiciliary Hospitalisation", covered: coverages.domiciliaryHospitalization },
        { label: "International Cover", covered: coverages.internationalCover },
    ];

    return (
        <div className="glass-panel-heavy squircle-soft shadow-sm p-6 md:p-8 border border-white/60">
            <h3 className="font-serif font-bold text-lg text-slate-950 mb-4 tracking-tight">Coverage Flags</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 sm:even:border-b sm:last:border-b-0">
                        {item.covered ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${item.covered ? "text-slate-900" : "text-slate-400"}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
