import { getAnalysis } from '@/lib/insurance/database';
import { VitalsHeader } from '@/components/insurance/VitalsHeader';
import { MetricCards } from '@/components/insurance/MetricCards';
import { RiskRadarCompact } from '@/components/insurance/RiskRadarCompact';
import { ScenarioTabs } from '@/components/insurance/ScenarioTabs';
import { CoverageGrid } from '@/components/insurance/CoverageGrid';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/logo';
import { ArrowLeft, GitCompareArrows, CheckCircle2, XCircle, Building2 } from 'lucide-react';
import { RexiChatWidget } from '@/components/insurance/RexiChatWidget';

export default async function InsuranceDashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let analysis;
    try {
        analysis = await getAnalysis(id);
    } catch {
        notFound();
    }

    const Nav = () => (
        <div className="glass-nav sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Logo className="w-10 h-10" iconOnly />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-slate-950 leading-tight">Rexi Studio</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Insurance Division</span>
                        </div>
                    </div>
                    <div className="shimmer-text h-px w-12 bg-slate-200 hidden sm:block opacity-20" />
                    <Link href="/insurance" className="flex items-center gap-2 text-slate-400 hover:text-slate-950 transition-all font-bold group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs uppercase tracking-widest">Exit Studio</span>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/insurance/compare"
                        className="h-10 px-4 text-xs font-bold text-slate-700 border-2 border-slate-200 hover:border-slate-950 hover:text-slate-950 rounded-full transition-all flex items-center gap-2"
                    >
                        <GitCompareArrows className="w-4 h-4" />
                        <span className="hidden sm:block">Compare</span>
                    </Link>
                </div>
            </div>
        </div>
    );

    // ─── Brochure Dashboard ───────────────────────────────────────────────────
    if (analysis.documentType === 'brochure') {
        const brochure = analysis.brochureData;
        const features: string[] = brochure?.featuresOffered ?? [];
        const exclusions: string[] = brochure?.exclusions ?? [];
        const garages: number | null = brochure?.cashlessGarages ?? null;

        return (
            <div className="min-h-screen mesh-gradient relative">
                <Nav />
                <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
                    {/* Header */}
                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Brochure Analysis</p>
                        <h1 className="text-3xl font-serif font-bold text-slate-950">
                            {brochure?.insurerName ?? 'Unknown Insurer'}
                        </h1>
                        {brochure?.productName && (
                            <p className="text-slate-500 font-medium mt-1">{brochure.productName}</p>
                        )}
                        {garages && (
                            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                <Building2 className="w-3.5 h-3.5" />
                                {garages.toLocaleString('en-IN')} Cashless Garages
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Features */}
                        <div className="glass-panel-heavy squircle-soft p-6">
                            <h2 className="font-bold text-slate-950 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                What's Covered
                            </h2>
                            {features.length > 0 ? (
                                <ul className="space-y-2">
                                    {features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-400">No feature information extracted. Ask Rexi below.</p>
                            )}
                        </div>

                        {/* Exclusions */}
                        <div className="glass-panel-heavy squircle-soft p-6">
                            <h2 className="font-bold text-slate-950 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-400" />
                                What's Excluded
                            </h2>
                            {exclusions.length > 0 ? (
                                <ul className="space-y-2">
                                    {exclusions.map((e, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-400">No exclusion information extracted. Ask Rexi below.</p>
                            )}
                        </div>
                    </div>

                    {/* Brochure note */}
                    <div className="mt-6 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl text-sm text-amber-800">
                        <strong>This is a brochure document.</strong> Premium, IDV, and claim scenarios are not available — those figures vary by vehicle and are confirmed at the time of policy purchase. Upload your actual policy to get a full analysis.
                    </div>
                </div>

                <RexiChatWidget analysisId={id} context="insurance" />
            </div>
        );
    }

    // ─── Policy / Quotation Dashboard ─────────────────────────────────────────
    const { policyData, scenarios, riskFlags, extractedPerils } = analysis;

    if (!policyData) {
        return <div className="p-8">Invalid analysis data</div>;
    }

    return (
        <div className="min-h-screen mesh-gradient relative">
            <Nav />

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
                {/* Vehicle Header */}
                <VitalsHeader policyData={policyData} analysisId={id} />

                {/* Metric Cards Grid */}
                <MetricCards policyData={policyData} scenarios={scenarios || []} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs for Scenarios and Coverage */}
                        <ScenarioTabs
                            scenarios={scenarios || []}
                            policyData={policyData}
                            extractedPerils={extractedPerils}
                        />

                        {/* Coverage Grid */}
                        <CoverageGrid coverages={policyData.coverages} />
                    </div>

                    {/* Sidebar - Risk Radar */}
                    <div className="lg:col-span-1">
                        <RiskRadarCompact
                            riskFlags={riskFlags || []}
                            policyNumber={policyData.policyNumber}
                            vehicleModel={`${policyData.vehicleInfo.make} ${policyData.vehicleInfo.model}`}
                        />
                    </div>
                </div>
            </div>

            {/* Rexi Chat Widget */}
            <RexiChatWidget analysisId={id} context="insurance" />
        </div>
    );
}
