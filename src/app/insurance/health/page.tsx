/**
 * Health Insurance Upload Page
 * Route: /insurance/health
 *
 * Mirrors /insurance/kb-builder but uses:
 * - /api/insurance/analyze-health endpoint
 * - Emerald accent colour instead of blue
 * - Health-specific copy and accepted file types
 * - Recent health scans from localStorage (key: rexi_recent_health_scans)
 */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Upload,
    HeartPulse,
    XCircle,
    Loader2,
    Clock,
    ArrowRight,
    ArrowLeft,
    Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface RecentHealthScan {
    id: string;
    insurerName: string;
    productName: string;
    sumInsured: number;
    date: string;
}

const RECENT_KEY = "rexi_recent_health_scans";

export default function HealthInsuranceUploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentScans, setRecentScans] = useState<RecentHealthScan[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [progressStep, setProgressStep] = useState(0);

    const progressSteps = [
        "Uploading Policy...",
        "Extracting Clauses...",
        "Identifying Risks...",
        "Finalizing Report..."
    ];

    useEffect(() => {
        let interval: any;
        if (analyzing) {
            interval = setInterval(() => {
                setProgressStep((prev) => (prev < 3 ? prev + 1 : prev));
            }, 8000);
        } else {
            setProgressStep(0);
        }
        return () => clearInterval(interval);
    }, [analyzing]);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem(RECENT_KEY);
        if (saved) {
            try {
                setRecentScans(JSON.parse(saved));
            } catch {
                /* ignore corrupt data */
            }
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 4.5 * 1024 * 1024) {
                setError("File too large. Please upload files smaller than 4.5MB.");
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 4.5 * 1024 * 1024) {
                setError("File too large. Please upload files smaller than 4.5MB.");
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/insurance/analyze-health", {
                method: "POST",
                body: formData,
            });

            const contentType = response.headers.get("content-type");
            let data: any;
            if (contentType?.includes("application/json")) {
                data = await response.json();
            } else {
                throw new Error(`Server Error: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            if (data.redirectTo) {
                router.push(data.redirectTo);
            }
        } catch (err: any) {
            console.error("[Health Upload] Error:", err);
            if (err.message === "Failed to fetch") {
                setError(
                    "Connection issue. Please check your internet and try again."
                );
            } else {
                setError(err.message || "Rexi couldn't process this file. Please try again or use a different file.");
            }
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen mesh-gradient px-6 py-12 md:py-24 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[130px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Link
                        href="/insurance"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Hub</span>
                    </Link>

                    {/* Domain Badge */}
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                        <HeartPulse className="w-3.5 h-3.5" />
                        Health Insurance Studio
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 tracking-tight">
                        Health Policy<br />Reality Check
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Upload your health insurance policy. Rexi reveals room rent traps,
                        waiting periods, sub-limit shocks, and real claim scenarios.
                    </p>
                </div>

                {/* Upload Card */}
                <div
                    className={cn(
                        "glass-panel-heavy squircle-soft shadow-dreamy p-8 md:p-16 relative overflow-hidden group transition-all duration-300",
                        isDragging && "ring-4 ring-slate-900/5 bg-slate-50/50 scale-[1.01]"
                    )}
                    onDrop={(e) => {
                        setIsDragging(false);
                        handleDrop(e);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                >
                    {/* Decorative Watermark */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.025] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <Heart className="w-64 h-64" />
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
                        {/* Upload Icon */}
                        <div
                            className={`w-24 h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${analyzing
                                ? "scale-110 rotate-12 bg-emerald-600"
                                : "group-hover:rotate-3 group-hover:scale-105"
                                }`}
                        >
                            {analyzing ? (
                                <Loader2 className="w-12 h-12 text-white animate-spin" />
                            ) : (
                                <Upload className="w-12 h-12 text-white" />
                            )}
                        </div>

                        {/* File Name / Prompt */}
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-950">
                                {selectedFile ? selectedFile.name : "Select Health Policy"}
                            </h3>
                            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">
                                {selectedFile
                                    ? "Document ready for analysis"
                                    : "PDF · JPG · PNG · HEIC — up to 4.5 MB"}
                            </p>
                        </div>

                        {/* File Selector */}
                        <div className="w-full max-w-sm">
                            <input
                                type="file"
                                accept="application/pdf,image/jpeg,image/jpg,image/png,image/heic,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="health-file-upload"
                            />
                            {!selectedFile ? (
                                <label
                                    htmlFor="health-file-upload"
                                    className="block w-full py-5 px-8 bg-slate-950 hover:bg-black text-white text-center rounded-2xl font-bold cursor-pointer transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95"
                                >
                                    Select Document
                                </label>
                            ) : (
                                <div className="flex gap-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSelectedFile(null)}
                                        className="h-14 flex-1 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50"
                                        disabled={analyzing}
                                    >
                                        Change
                                    </Button>
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                        className="h-14 flex-1 bg-slate-950 hover:bg-black text-white rounded-2xl font-bold shadow-xl hover:-translate-y-0.5"
                                    >
                                        {analyzing ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Analyzing…
                                            </span>
                                        ) : (
                                            "Run Check"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 text-red-600 bg-red-50/50 backdrop-blur-sm border border-red-100 px-6 py-4 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2 max-w-sm text-left">
                                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                {error}
                            </div>
                        )}

                        {/* Processing Status */}
                        {analyzing && (
                            <div className="flex flex-col items-center gap-4 text-sm text-slate-500 animate-in fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-500",
                                                    i <= progressStep ? "bg-slate-900 scale-110" : "bg-slate-200"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="font-bold text-slate-900 min-w-[140px]">
                                        {progressSteps[progressStep]}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Decoding insurance jargon...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* What Rexi Checks Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Room Rent Trap", desc: "Proportionate deduction risk" },
                        { label: "Waiting Periods", desc: "PED, maternity, specific disease" },
                        { label: "Co-pay Shock", desc: "% you bear on every claim" },
                        { label: "Claim Scenarios", desc: "Real ₹ outcomes simulated" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="glass-panel-heavy squircle-soft p-5 border border-white/60"
                        >
                            <p className="text-sm font-bold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Legal Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-amber-800">
                    <span className="font-bold shrink-0">⚠️ Disclaimer:</span>
                    <span className="leading-relaxed">
                        REXI provides <strong>informational analysis only</strong>. This is not legal or financial advice. Policy terms vary by insurer. Always read your full policy document before making any insurance decision.
                    </span>
                </div>

                {/* Compare Shortcut */}
                <div className="text-center">
                    <Link
                        href="/insurance/health/compare"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors group"
                    >
                        <span>Compare two health policies instead</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Recent Health Scans */}
                {recentScans.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-slate-400" />
                            Recent Analyses
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentScans.map((scan) => (
                                <Link key={scan.id} href={`/insurance/health/dashboard/${scan.id}`}>
                                    <div className="glass-panel-heavy p-6 rounded-[2rem] hover:shadow-dreamy transition-all hover:-translate-y-1 flex items-center justify-between group cursor-pointer border-white/60">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-900 group-hover:scale-110 transition-transform">
                                                {scan.insurerName?.[0] || "H"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base leading-tight">
                                                    {scan.insurerName}
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                                    {scan.productName} • ₹
                                                    {(scan.sumInsured / 100000).toFixed(0)}L
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(scan.date).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
