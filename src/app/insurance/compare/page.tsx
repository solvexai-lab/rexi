"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitCompareArrows, Loader2, RotateCcw } from "lucide-react";

import { CompareUploadZone } from "@/components/insurance/compare/CompareUploadZone";
import { CompareProgress, type ProgressEntry } from "@/components/insurance/compare/CompareProgress";
import { CompareWinners } from "@/components/insurance/compare/CompareWinners";
import { CompareTable } from "@/components/insurance/compare/CompareTable";
import { CompareRiskMatrix } from "@/components/insurance/compare/CompareRiskMatrix";
import { CompareClaimScenarios } from "@/components/insurance/compare/CompareClaimScenarios";

import type { ExtractedInsurer, InsuranceCompareResult } from "@/lib/insurance/types";

interface FileEntry {
    file: File;
    id: string;
}

type Stage = "upload" | "extracting" | "analysing" | "results";

const SESSION_KEY = "rexi_compare_result";

export default function ComparePage() {
    const router = useRouter();
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [stage, setStage] = useState<Stage>("upload");
    const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
    const [extractedInsurers, setExtractedInsurers] = useState<ExtractedInsurer[]>([]);
    const [compareResult, setCompareResult] = useState<InsuranceCompareResult | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Restore results from sessionStorage on mount (back-button safe)
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            if (saved) {
                const { result, insurers } = JSON.parse(saved);
                setCompareResult(result);
                setExtractedInsurers(insurers);
                setStage("results");
            }
        } catch {
            // ignore
        }
    }, []);

    const updateProgress = useCallback((index: number, update: Partial<ProgressEntry>) => {
        setProgressEntries((prev) =>
            prev.map((e) => (e.index === index ? { ...e, ...update } : e))
        );
    }, []);

    const startCompare = async () => {
        if (files.length < 2) {
            setError("Please upload at least 2 insurance documents.");
            return;
        }

        setError(null);
        setWarning(null);
        sessionStorage.removeItem(SESSION_KEY);

        // Initialise progress cards
        setProgressEntries(
            files.map(({ file }, i) => ({
                index: i,
                fileName: file.name,
                status: "waiting",
            }))
        );
        setStage("extracting");

        // ── Phase 1: SSE extraction ────────────────────────────────────────────────
        const formData = new FormData();
        files.forEach(({ file }, i) => formData.append(`file${i}`, file));

        let extracted: ExtractedInsurer[] = [];

        try {
            const res = await fetch("/api/insurance/compare-extract", {
                method: "POST",
                body: formData,
            });

            if (!res.ok || !res.body) {
                const text = await res.text().catch(() => "Unknown error");
                throw new Error(text || "Extraction failed");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buf = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });

                const lines = buf.split("\n");
                buf = lines.pop()!; // keep incomplete line

                for (const line of lines) {
                    if (!line.startsWith("data:")) continue;
                    try {
                        const event = JSON.parse(line.slice(5).trim());

                        if (event.type === "complete") {
                            extracted = event.extracted || [];
                        } else if (event.type === "warning") {
                            setWarning(event.message);
                        } else if (event.index !== undefined) {
                            if (event.status === "done") {
                                extracted.push(event.insurer);
                                updateProgress(event.index, {
                                    status: "done",
                                    insurerName: event.insurer?.insurerName,
                                    premium: event.insurer?.premium,
                                });
                            } else if (event.status === "error") {
                                updateProgress(event.index, { status: "error", message: event.message });
                            } else if (event.status === "extracting") {
                                updateProgress(event.index, { status: "extracting", stage: event.stage });
                            }
                        }
                    } catch {
                        // malformed SSE line — skip
                    }
                }
            }
        } catch (err: any) {
            setStage("upload");
            setError(err.message || "Network error during extraction. Please try again.");
            return;
        }

        const validExtracted = extracted.filter((e) => !e.extractionError);
        setExtractedInsurers(validExtracted);

        if (validExtracted.length < 2) {
            setStage("upload");
            setError("Not enough documents could be read. Please check your files and try again.");
            return;
        }

        // ── Phase 2: Gemini comparison ─────────────────────────────────────────────
        setStage("analysing");

        try {
            const res2 = await fetch("/api/insurance/compare-analyse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ insurers: validExtracted }),
            });
            const data = await res2.json();
            if (!res2.ok) throw new Error(data.error || "Comparison failed");

            setCompareResult(data);
            // Persist so back-button works
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ result: data, insurers: validExtracted }));
            setStage("results");
        } catch (err: any) {
            setStage("upload");
            setError(err.message || "AI comparison failed. Please try again.");
        }
    };

    const reset = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setFiles([]);
        setStage("upload");
        setProgressEntries([]);
        setExtractedInsurers([]);
        setCompareResult(null);
        setError(null);
        setWarning(null);
    };

    const isProcessing = stage === "extracting" || stage === "analysing";

    return (
        <div className="min-h-screen mesh-gradient px-4 py-10 md:py-20 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/20 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="space-y-4">
                    <Link
                        href="/insurance"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Insurance Hub
                    </Link>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight">
                                Compare Policies
                            </h1>
                            <p className="text-lg text-slate-500 font-medium mt-2">
                                Upload 2–4 motor insurance documents for an AI side-by-side breakdown.
                            </p>
                        </div>
                        {stage === "results" && (
                            <button
                                onClick={reset}
                                className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-900 rounded-2xl text-sm font-bold text-slate-700 hover:text-slate-950 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                                New Compare
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Upload State ──────────────────────────────────────────────────────── */}
                {stage === "upload" && (
                    <div className="glass-panel-heavy squircle-soft shadow-dreamy p-6 md:p-10 space-y-6">
                        <CompareUploadZone
                            files={files}
                            onFilesChange={setFiles}
                            disabled={isProcessing}
                            warning={warning}
                        />

                        {error && (
                            <div className="flex items-center gap-3 text-red-600 bg-red-50/60 border border-red-100 px-5 py-4 rounded-2xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={startCompare}
                            disabled={files.length < 2 || isProcessing}
                            className="w-full py-5 bg-slate-950 hover:bg-black text-white font-bold text-lg rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <GitCompareArrows className="w-5 h-5" />
                            Compare {files.length > 0 ? `${files.length} Documents` : "Policies"}
                        </button>
                    </div>
                )}

                {/* ── Extraction progress ───────────────────────────────────────────────── */}
                {stage === "extracting" && (
                    <div className="glass-panel-heavy rounded-3xl p-6 md:p-10 shadow-dreamy">
                        <CompareProgress entries={progressEntries} />
                    </div>
                )}

                {/* ── Analysing spinner ─────────────────────────────────────────────────── */}
                {stage === "analysing" && (
                    <div className="glass-panel-heavy rounded-3xl p-10 shadow-dreamy flex flex-col items-center gap-5">
                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-serif font-bold text-2xl text-slate-950">Running AI Comparison…</h3>
                            <p className="text-slate-500 text-sm mt-2">Analysing coverage gaps, risks, and scenarios</p>
                        </div>
                    </div>
                )}

                {/* ── Results ───────────────────────────────────────────────────────────── */}
                {stage === "results" && compareResult && (
                    <div className="space-y-8">
                        {warning && (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-5 py-4 rounded-2xl text-sm text-amber-700 font-medium">
                                ⚠️ {warning}
                            </div>
                        )}

                        {/* AI Summary */}
                        {compareResult.summary && (
                            <div className="glass-panel-heavy rounded-3xl p-6 shadow-dreamy">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">AI Summary</p>
                                <p className="text-lg text-slate-700 font-medium leading-relaxed">{compareResult.summary}</p>
                            </div>
                        )}

                        <CompareWinners winners={compareResult.winners} insurers={extractedInsurers} />
                        <CompareTable rows={compareResult.comparisonRows} insurers={extractedInsurers} />
                        <CompareRiskMatrix riskMatrix={compareResult.riskMatrix} insurers={extractedInsurers} />
                        <CompareClaimScenarios scenarios={compareResult.claimScenarios} insurers={extractedInsurers} />

                        {/* Detailed AI narrative */}
                        {compareResult.detailedAnalysis && (
                            <div className="glass-panel-heavy rounded-3xl p-6 md:p-8 shadow-dreamy prose prose-slate max-w-none">
                                <h2 className="font-serif font-bold text-2xl text-slate-950 mb-4 not-prose">
                                    Detailed Analysis
                                </h2>
                                <div
                                    className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap"
                                >
                                    {compareResult.detailedAnalysis}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={reset}
                            className="w-full py-4 border-2 border-slate-200 hover:border-slate-900 rounded-2xl font-bold text-slate-700 hover:text-slate-950 transition-all text-sm"
                        >
                            Start a New Comparison
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
