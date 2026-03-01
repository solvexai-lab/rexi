/**
 * Health Insurance Dashboard
 * Route: /insurance/health/dashboard/[id]
 *
 * Server component — fetches from health_insurance_analyses (never motor table).
 * Renders health-specific UI components (stubbed as placeholders where not yet built —
 * real components will be wired in Steps 4–6 of the build order).
 */

import { getHealthAnalysis } from "@/lib/insurance/health/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
    ArrowLeft,
    GitCompareArrows,
    HeartPulse,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ShieldAlert,
    Clock,
    CircleDollarSign,
} from "lucide-react";
import { RexiChatWidget } from "@/components/insurance/RexiChatWidget";
import type { HealthPolicyData, HealthRiskFlag, HealthClaimScenario } from "@/lib/insurance/types";

import { HealthVitalsHeader } from "@/components/insurance/health/HealthVitalsHeader";
import { HealthMetricCards } from "@/components/insurance/health/HealthMetricCards";
import { WaitingPeriodTimeline } from "@/components/insurance/health/WaitingPeriodTimeline";
import { HealthClaimScenariosPanel } from "@/components/insurance/health/HealthClaimScenariosPanel";
import { HealthRiskPanel } from "@/components/insurance/health/HealthRiskPanel";
import { HealthCoverageFlags } from "@/components/insurance/health/HealthCoverageFlags";
import { HealthBrochureFeatures } from "@/components/insurance/health/HealthBrochureFeatures";
import { HealthBrochureExclusions } from "@/components/insurance/health/HealthBrochureExclusions";
import { DashboardActions } from "@/components/insurance/health/DashboardActions";
import { MessageSquare, Sparkles } from "lucide-react";

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default async function HealthInsuranceDashboard({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let analysis;
    try {
        analysis = await getHealthAnalysis(id);
    } catch {
        notFound();
    }

    if (!analysis) {
        return (
            <div className="min-h-screen flex items-center justify-center mesh-gradient">
                <div className="text-center glass-panel-heavy squircle-soft p-12">
                    <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-slate-950 mb-2">Analysis Not Found</h2>
                    <p className="text-slate-500 font-medium mb-6">This analysis may have expired or been deleted.</p>
                    <Link
                        href="/insurance/health"
                        className="inline-flex items-center gap-2 font-bold text-sm text-white bg-slate-950 px-6 py-3 rounded-full hover:bg-black transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Upload New Policy
                    </Link>
                </div>
            </div>
        );
    }

    const { policyData, scenarios, riskFlags } = analysis;

    if (!policyData) {
        return (
            <div className="min-h-screen flex items-center justify-center mesh-gradient">
                <p className="text-slate-500">Invalid analysis data.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen mesh-gradient relative">
            {/* Glass Header */}
            <div className="glass-nav sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <Logo className="w-10 h-10" iconOnly />
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-slate-950 leading-tight">
                                    Rexi Studio
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                                    Health Division
                                </span>
                            </div>
                        </div>
                        <div className="h-px w-12 bg-slate-200 hidden sm:block opacity-20" />
                        {/* Exit Studio links to /insurance/health — not /insurance */}
                        <Link
                            href="/insurance/health"
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-950 transition-all font-bold group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs uppercase tracking-widest">Exit Studio</span>
                        </Link>
                    </div>
                    <DashboardActions />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
                {/* Vitals Header */}
                <HealthVitalsHeader policyData={policyData} />

                {/* Metric Cards - Only show for policies or if brochure has some specific metrics */}
                {(policyData.documentType !== "brochure" || policyData.sumInsured > 0) && (
                    <HealthMetricCards policyData={policyData} />
                )}

                {/* Live Insight Banner - Making Rexi Chat prominent */}
                <div className="mb-8 p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
                            <Sparkles className="w-5 h-5 fill-white/20" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">Rexi Live Analysis Active</p>
                            <p className="text-xs text-indigo-600 font-medium mt-1">Found complex tables. Ask Rexi to summarize specific claim illustrations or compare room caps.</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest animate-pulse">
                        <MessageSquare className="w-3 h-3" />
                        Chat Enabled
                    </div>
                </div>



                {policyData.documentType === "brochure" ? (
                    /* BROCHURE VIEW: Highlights & Exclusions focus */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <HealthBrochureFeatures
                                    features={analysis.extractedConditions?.covered ?? []}
                                />
                                <HealthBrochureExclusions
                                    exclusions={analysis.extractedConditions?.excluded ?? []}
                                />
                            </div>
                            <HealthCoverageFlags coverages={policyData.coverages} />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <HealthRiskPanel riskFlags={riskFlags ?? []} />
                            {/* For brochures, only show timeline if we have specific values or it's a common plan */}
                            <WaitingPeriodTimeline policyData={policyData} />
                        </div>
                    </div>
                ) : (
                    /* POLICY VIEW: Scenarios & Timeline focus */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Claim Scenarios + Coverage Flags */}
                        <div className="lg:col-span-2 space-y-8">
                            <WaitingPeriodTimeline policyData={policyData} />
                            <HealthClaimScenariosPanel scenarios={scenarios ?? []} />
                            <HealthCoverageFlags coverages={policyData.coverages} />
                        </div>

                        {/* Sidebar: Risk Radar */}
                        <div className="lg:col-span-1">
                            <HealthRiskPanel riskFlags={riskFlags ?? []} />
                        </div>
                    </div>
                )}
            </div>

            {/* Rexi Chat Widget — health-specific endpoint */}
            <RexiChatWidget
                analysisId={id}
                context="health-insurance"
                chatEndpoint="/api/insurance/health/chat"
                initialMessage={`I've read your ${policyData.insurerName} health policy. Ask me anything — room rent traps, waiting periods, specific claim payouts, or coverage gaps.`}
            />
        </div>
    );
}
