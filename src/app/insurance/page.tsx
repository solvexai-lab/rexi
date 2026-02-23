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
            description: "Medical coverage analysis. Detect waiting periods and room rent limits.",
            icon: HeartPulse,
            active: false,
            comingSoon: true,
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
        </div>
    );
}
