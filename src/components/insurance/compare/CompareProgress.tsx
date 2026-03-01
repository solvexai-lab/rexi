"use client";

import { CheckCircle, XCircle, Loader2, FileText } from "lucide-react";
import { formatCurrencyCompact } from "@/lib/utils/currency";

export interface ProgressEntry {
    index: number;
    fileName: string;
    status: "waiting" | "extracting" | "done" | "error";
    stage?: string;
    insurerName?: string;
    premium?: number;
    message?: string;
}

interface CompareProgressProps {
    entries: ProgressEntry[];
}

function formatINR(n: number) {
    return n > 0 ? formatCurrencyCompact(n) : "—";
}

const stageLabels: Record<string, string> = {
    "Reading document…": "Reading document",
    "Classifying document…": "Classifying type",
    "Reading coverages…": "Reading coverages",
};

export function CompareProgress({ entries }: CompareProgressProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-xl text-slate-950">Analysing Documents</h3>
                    <p className="text-sm text-slate-500">Processing each insurer — this takes 15–30 seconds</p>
                </div>
            </div>

            {entries.map((entry) => (
                <div
                    key={entry.index}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${entry.status === "done"
                        ? "bg-green-50 border-green-100"
                        : entry.status === "error"
                            ? "bg-red-50 border-red-100"
                            : entry.status === "extracting"
                                ? "bg-blue-50 border-blue-100"
                                : "bg-slate-50 border-slate-100 opacity-50"
                        }`}
                >
                    {/* Status Icon */}
                    <div className="shrink-0">
                        {entry.status === "done" && (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        )}
                        {entry.status === "error" && (
                            <XCircle className="w-8 h-8 text-red-400" />
                        )}
                        {entry.status === "extracting" && (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        )}
                        {entry.status === "waiting" && (
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-slate-300" />
                            </div>
                        )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">{entry.fileName}</p>
                        {entry.status === "done" && entry.insurerName && (
                            <p className="text-sm text-green-700 font-semibold mt-0.5">
                                {entry.insurerName}
                                {entry.premium && entry.premium > 0
                                    ? ` · Premium: ${formatINR(entry.premium)}`
                                    : ""}
                            </p>
                        )}
                        {entry.status === "extracting" && entry.stage && (
                            <p className="text-sm text-blue-600 font-medium mt-0.5 animate-pulse">
                                {stageLabels[entry.stage] || entry.stage}
                            </p>
                        )}
                        {entry.status === "error" && (
                            <p className="text-sm text-red-500 font-medium mt-0.5">{entry.message || "Failed to process"}</p>
                        )}
                        {entry.status === "waiting" && (
                            <p className="text-sm text-slate-400 mt-0.5">Waiting…</p>
                        )}
                    </div>

                    {/* Index badge */}
                    <div
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${entry.status === "done"
                            ? "bg-green-100 text-green-700"
                            : entry.status === "error"
                                ? "bg-red-100 text-red-500"
                                : "bg-white text-slate-500"
                            }`}
                    >
                        {entry.index + 1}
                    </div>
                </div>
            ))}
        </div>
    );
}
