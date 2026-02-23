"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, XCircle, Loader2, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

interface RecentScan {
    id: string;
    make: string;
    model: string;
    regNo: string;
    insurer: string;
    date: string;
}

export default function InsuranceStudio() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
    const router = useRouter();

    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const res = await fetch('/api/health');
                if (res.ok) setIsConnected(true);
                else setIsConnected(false);
            } catch (e) {
                console.error("Health check failed:", e);
                setIsConnected(false);
            }
        };
        checkConnection();
        // Load recent scans...
        const saved = localStorage.getItem('rexi_recent_scans');
        if (saved) {
            try {
                setRecentScans(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load recent scans", e);
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

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            console.log("Starting upload to: /api/insurance/analyze");
            const response = await fetch("/api/insurance/analyze", {
                method: "POST",
                body: formData,
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                // Handle non-JSON response errors
                const text = await response.text();
                throw new Error(`Server Error: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            if (data.redirectTo) {
                router.push(data.redirectTo);
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            if (err.message === "Failed to fetch") {
                setError(`Network Error: ${window.location.origin} unreachable. ${isConnected === false ? '(Health Check Failed)' : ''}
                Try renaming your file to 'debug.pdf' to test connection.`);
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
            setAnalyzing(false);
        }
        setAnalyzing(false);
    }

    return (
        <div className="min-h-screen mesh-gradient px-6 py-12 md:py-24 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/20 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <Link href="/insurance" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Hub</span>
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 tracking-tight">
                        Policy Reality Check
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Upload your insurance policy to reveal hidden risks, claim gaps, and predatory premium hikes.
                    </p>
                </div>

                {/* Main Upload Card */}
                <div className="glass-panel-heavy squircle-soft shadow-dreamy p-8 md:p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <FileText className="w-64 h-64" />
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
                        <div className={`w-24 h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${analyzing ? 'scale-110 rotate-12 bg-blue-600' : 'group-hover:rotate-3 group-hover:scale-105'}`}>
                            {analyzing ? (
                                <Loader2 className="w-12 h-12 text-white animate-spin" />
                            ) : (
                                <Upload className="w-12 h-12 text-white" />
                            )}
                        </div>

                        <div className="text-center space-y-3">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-950">
                                {selectedFile ? selectedFile.name : "Select Policy PDF"}
                            </h3>
                            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">
                                {selectedFile ? "Document ready for analysis" : "Drag & drop or browse your files"}
                            </p>
                        </div>

                        <div className="w-full max-w-sm">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            {!selectedFile ? (
                                <label
                                    htmlFor="file-upload"
                                    className="block w-full py-5 px-8 bg-slate-950 hover:bg-black text-white text-center rounded-2xl font-bold cursor-pointer transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95"
                                >
                                    Select PDF
                                </label>
                            ) : (
                                <div className="flex gap-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSelectedFile(null)}
                                        className="h-14 flex-1 rounded-2xl border-2 border-slate-100 font-bold hover:bg-slate-50"
                                        disabled={analyzing}
                                    >
                                        Change
                                    </Button>
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                        className="h-14 flex-1 bg-slate-950 hover:bg-black text-white rounded-2xl font-bold shadow-xl hover:-translate-y-0.5"
                                    >
                                        {analyzing ? "Analyzing..." : "Run Check"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 text-red-600 bg-red-50/50 backdrop-blur-sm border border-red-100 px-6 py-4 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                <XCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Scans */}
                {recentScans.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                                <Clock className="w-6 h-6 text-slate-400" />
                                Recent Analysis
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentScans.map((scan) => (
                                <Link key={scan.id} href={`/insurance/dashboard/${scan.id}`}>
                                    <div className="glass-panel-heavy p-6 rounded-[2rem] hover:shadow-dreamy transition-all hover:-translate-y-1 flex items-center justify-between group cursor-pointer border-white/60">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-900 group-hover:scale-110 transition-transform">
                                                {scan.make?.[0] || 'P'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight">
                                                    {scan.make} {scan.model}
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium mt-1">
                                                    {scan.insurer || 'Policy Scan'} • {new Date(scan.date).toLocaleDateString()}
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
