"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Upload,
    ArrowLeft,
    Shield,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InsuranceAnalyzePage() {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback(async (file: File) => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/insurance/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            // Redirect to dashboard
            router.push(`/insurance/dashboard/${data.id}`);

        } catch (err: any) {
            setError(err.message || "Failed to analyze document");
            setIsAnalyzing(false);
        }
    }, [router]);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                R
                            </div>
                            <span className="font-semibold text-slate-900">REXI <span className="text-blue-600">STUDIO</span></span>
                        </div>
                        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Home</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700">END-TO-END ENCRYPTED</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200">
                            <Shield className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Insurance Policy</span>
                        </div>
                    </div>

                    {/* Hero Text */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                            Understand your{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                insurance policy.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Upload any insurance document. We'll break down coverage, show claim scenarios, and highlight gaps.
                        </p>
                    </div>

                    {/* Upload Card */}
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 md:p-12">
                        <div
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            className={`relative border-2 border-dashed rounded-2xl p-16 transition-all ${isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={onFileSelect}
                                className="hidden"
                                disabled={isAnalyzing}
                            />

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-blue-600" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Drop your document
                                </h3>
                                <p className="text-slate-600 mb-6">
                                    Policies, Quotations, Brochures, Offer Letters
                                </p>

                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 text-base rounded-xl font-semibold shadow-sm"
                                >
                                    {isAnalyzing ? "Analyzing..." : "Browse Files"}
                                </Button>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Features below card */}
                    <div className="mt-8 text-center text-sm text-slate-500">
                        Policies, Quotations, Brochures, Offer Letters
                    </div>
                </div>
            </div>
        </div>
    );
}
