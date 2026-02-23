import { getAnalysis } from '@/lib/insurance/database';
import { VitalsHeader } from '@/components/insurance/VitalsHeader';
import { MetricCards } from '@/components/insurance/MetricCards';
import { RiskRadarCompact } from '@/components/insurance/RiskRadarCompact';
import { ScenarioTabs } from '@/components/insurance/ScenarioTabs';
import { CoverageGrid } from '@/components/insurance/CoverageGrid';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ArrowLeft } from 'lucide-react';
import { RexiChatWidget } from '@/components/insurance/RexiChatWidget';

export default async function InsuranceDashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const analysis = await getAnalysis(id);

    if (analysis.documentType === 'brochure') {
        // TODO: Implement BrochureDashboard component
        return <div className="p-8">Brochure dashboard coming soon...</div>;
    }

    const { policyData, scenarios, riskFlags, extractedPerils } = analysis;

    if (!policyData) {
        return <div className="p-8">Invalid analysis data</div>;
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
                    <button className="h-10 px-6 text-xs font-bold text-white bg-slate-950 rounded-full hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest flex items-center gap-2">
                        Share Analysis
                    </button>
                </div>
            </div>

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
