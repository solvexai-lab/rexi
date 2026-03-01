"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
    ArrowLeft,
    Car,
    HeartPulse,
    Home,
    ShieldCheck,
    GitCompareArrows,
    ArrowRight
} from "lucide-react";

export default function InsuranceHubPage() {
    const router = useRouter();

    const insuranceTypes = [
        {
            id: "motor",
            title: "Motor Insurance",
            description: "Car & Two-Wheeler policies. Check IDV, Zero Dep, and hidden exclusions.",
            icon: Car,
            active: true,
            path: "/insurance/kb-builder",
            color: "blue"
        },
        {
            id: "health",
            title: "Health Insurance",
            description: "Medical coverage analysis. Detect waiting periods, room rent traps, and PED exclusions.",
            icon: HeartPulse,
            active: true,
            path: "/insurance/health",
            color: "emerald"
        },
        {
            id: "life",
            title: "Life Insurance",
            description: "Term & Endowment plans. Understand death benefits and maturity clauses.",
            icon: ShieldCheck,
            active: false,
            comingSoon: true,
            color: "purple"
        },
        {
            id: "home",
            title: "Home Insurance",
            description: "Protect your property. Analyze fire, theft, and natural calamity coverage.",
            icon: Home,
            active: false,
            comingSoon: true,
            color: "amber"
        },
        {
            id: "compare",
            title: "Compare Motor Policies",
            description: "Upload 2–4 motor policies side-by-side. AI ranks best value, coverage, and risk.",
            icon: GitCompareArrows,
            active: true,
            path: "/insurance/compare",
            color: "violet"
        },
        {
            id: "health-compare",
            title: "Compare Health Policies",
            description: "Upload 2–4 health policies. AI compares room rent, co-pay, and claim scenarios.",
            icon: HeartPulse,
            active: true,
            path: "/insurance/health/compare",
            color: "emerald"
        }
    ];

    return (
        <div className="min-h-screen mesh-gradient">
            {/* Glass Header */}
            <div className="glass-nav sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-bold group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </Link>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                        <div className="flex items-center gap-3">
                            <Logo className="w-10 h-10" iconOnly />
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-slate-950 leading-tight">Rexi Studio</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Insurance Division</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
                <div className="max-w-3xl mb-16 space-y-4">
                    <h1 className="text-4xl md:text-7xl font-serif font-bold text-slate-950 tracking-tight leading-none">
                        Choose Your <br /> Policy Check
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                        Rexi uses specialized AI models for different insurance types to find hidden risks and coverage gaps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {insuranceTypes.map((type) => {
                        const Icon = type.icon;

                        return (
                            <div
                                key={type.id}
                                onClick={() => {
                                    if (type.active) router.push(type.path!);
                                }}
                                className={`
                                    group relative glass-panel-heavy squircle-soft p-8 md:p-10 transition-all duration-500
                                    ${type.active
                                        ? "cursor-pointer hover:shadow-dreamy hover:-translate-y-2 border-white/60"
                                        : "grayscale opacity-60 border-slate-100 bg-slate-50/50"
                                    }
                                `}
                            >
                                {/* Decorative Background Icon */}
                                <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                                    <Icon className="w-40 h-40" />
                                </div>

                                {/* Icon Holder */}
                                <div className={`
                                    w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-10 shadow-lg transition-all duration-500 group-hover:rotate-6
                                    ${type.active
                                        ? "bg-slate-950 text-white shadow-slate-900/20"
                                        : "bg-slate-100 text-slate-400 shadow-none grayscale"
                                    }
                                `}>
                                    <Icon className="w-8 h-8" />
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <h3 className={`text-2xl font-serif font-bold ${type.active ? "text-slate-950" : "text-slate-500"}`}>
                                        {type.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed font-medium min-h-[4rem]">
                                        {type.description}
                                    </p>
                                </div>

                                {/* Status/Action */}
                                <div className="mt-12">
                                    {type.comingSoon ? (
                                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-sm text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                                            Coming Soon
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
                                            <div className="h-0.5 w-6 bg-slate-900 group-hover:w-12 transition-all duration-300"></div>
                                            <span className="text-sm font-bold text-slate-950 uppercase tracking-widest leading-none">
                                                Analyze Now
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-amber-50 border-t border-b border-amber-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-amber-800">
                    <span className="font-bold shrink-0">⚠️ Disclaimer:</span>
                    <span className="leading-relaxed">
                        REXI provides <strong>informational analysis only</strong>. This is not legal or financial advice. Insurance policy terms vary by insurer and are subject to change. Always read your full policy document and consult a licensed insurance advisor before making a purchase decision.
                    </span>
                </div>
            </div>

            {/* Learning Hub Integration */}
            <div className="bg-slate-900 py-24 px-6 overflow-hidden relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Learning Guides</h2>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Master the math and logic behind insurance before you buy or claim.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/insurance/guide/motor" className="group">
                            <div className="bg-white/5 border border-blue-500/20 p-8 rounded-3xl hover:bg-white/10 transition-all">
                                <Car className="w-10 h-10 text-blue-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">Motor Insurance Masterclass</h3>
                                <p className="text-sm text-slate-400 mb-6">IDV calculations, Zero-Depreciation trade-offs, and NCB transfer rules explained.</p>
                                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Read Guide <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/insurance/guide/health" className="group">
                            <div className="bg-white/5 border border-emerald-500/20 p-8 rounded-3xl hover:bg-white/10 transition-all">
                                <HeartPulse className="w-10 h-10 text-emerald-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">Health Insurance Secrets</h3>
                                <p className="text-sm text-slate-400 mb-6">How to spot room rent traps, understand waiting periods, and IRDAI 2024 updates.</p>
                                <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Read Guide <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
