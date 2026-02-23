"use client";

import { useState } from 'react';
import { RiskFlag } from '@/lib/insurance/types';
import { ChevronDown, ChevronRight, Shield, ArrowRight, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface RiskRadarCompactProps {
    riskFlags: RiskFlag[];
    policyNumber?: string;
    vehicleModel?: string;
}

export function RiskRadarCompact({ riskFlags, policyNumber, vehicleModel }: RiskRadarCompactProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getSeverityStyles = (severity: RiskFlag['severity']) => {
        switch (severity) {
            case 'HIGH': return { dot: 'bg-red-500', text: 'text-red-500', badge: 'bg-red-50 text-red-700' };
            case 'MEDIUM': return { dot: 'bg-amber-500', text: 'text-amber-500', badge: 'bg-amber-50 text-amber-700' };
            case 'LOW': return { dot: 'bg-blue-500', text: 'text-blue-500', badge: 'bg-blue-50 text-blue-700' };
        }
    };

    const generateActionScript = (flag: RiskFlag) => {
        const policyRef = policyNumber ? `policy #${policyNumber}` : "my policy";
        const vehicleRef = vehicleModel ? `for my ${vehicleModel}` : "";

        let script = "";
        if (flag.id.includes('zero-dep')) {
            script = `Hi, I noticed ${policyRef} ${vehicleRef} is missing Zero Depreciation cover. Please send me a quote to add this add-on immediately.`;
        } else if (flag.id.includes('engine')) {
            script = `Hi, I need to add Engine Protection cover to ${policyRef} ${vehicleRef} to protect against water damage. Please provide the cost.`;
        } else if (flag.id.includes('return-to-invoice') || flag.id.includes('rti')) {
            script = `Hi, I would like to upgrade ${policyRef} ${vehicleRef} with Return to Invoice (RTI) cover. Please share the additional premium amount.`;
        } else {
            script = `Hi, regarding ${policyRef} ${vehicleRef}: ${flag.recommendation || "I need to fix a coverage gap."} Please advise on how to proceed.`;
        }

        return script;
    };

    const handleCopyAction = (flag: RiskFlag, e: React.MouseEvent) => {
        e.stopPropagation();
        const script = generateActionScript(flag);
        navigator.clipboard.writeText(script);
        setCopiedId(flag.id);
        toast.success("Action script copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="glass-panel-heavy rounded-[2.5rem] p-8 border-white/60 sticky top-12 shadow-dreamy relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-400/5 rounded-full blur-3xl group-hover:bg-red-400/10 transition-colors" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-slate-950 font-serif font-bold text-xl leading-tight">Risk Radar</h3>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">Automated Auditing</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{riskFlags.length} Flaws Detected</span>
                </div>
            </div>

            {/* Risk List */}
            <div className="space-y-4">
                {riskFlags.map((flag) => {
                    const styles = getSeverityStyles(flag.severity);
                    const isExpanded = expandedId === flag.id;

                    return (
                        <div
                            key={flag.id}
                            onClick={() => toggleExpand(flag.id)}
                            className={`rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer border ${isExpanded ? 'bg-white shadow-xl translate-x-2 border-slate-200 translate-y-[-4px]' : 'bg-slate-50/50 border-slate-100/50 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:translate-x-1'
                                }`}
                        >
                            {/* Card Header */}
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className={`w-3 h-3 rounded-full ${styles.dot} shadow-[0_0_12px_rgba(239,68,68,0.4)] flex-shrink-0`} />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-950 text-sm truncate uppercase tracking-tight">{flag.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${styles.badge}`}>
                                                {flag.severity}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                )}
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-4 duration-500">
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                                            {flag.description}
                                        </p>

                                        {flag.recommendation && (
                                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 mb-4 group/rec">
                                                <div className="flex gap-3">
                                                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-xs shadow-sm border border-slate-100 group-hover/rec:bg-slate-950 group-hover/rec:text-white transition-colors">💡</div>
                                                    <p className="text-xs font-bold text-slate-700 leading-normal">
                                                        {flag.recommendation}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={(e) => handleCopyAction(flag, e)}
                                            className="w-full bg-slate-950 hover:bg-black text-white py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                                        >
                                            {copiedId === flag.id ? (
                                                <>
                                                    <Check className="w-4 h-4" /> Copied Script
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" /> Copy Agent Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {riskFlags.length === 0 && (
                <div className="text-center py-16 px-6">
                    <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                        <Shield className="w-10 h-10 text-green-500" />
                    </div>
                    <p className="text-slate-950 font-serif font-bold text-xl uppercase tracking-tighter">Solid Terms</p>
                    <p className="text-slate-400 font-medium text-xs mt-2 uppercase tracking-widest">No critical risks detected</p>
                </div>
            )}
        </div>
    );
}
