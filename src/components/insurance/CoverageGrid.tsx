"use client";
import { Coverage } from '@/lib/insurance/types';
import { Check, X, Shield, Zap, Car, Anchor, LifeBuoy, AlertCircle, Award } from 'lucide-react';

interface CoverageGridProps {
    coverages: Coverage;
}

export function CoverageGrid({ coverages }: CoverageGridProps) {
    const coverageItems = [
        {
            key: 'hasOwnDamage',
            label: 'Own Damage',
            description: 'Accidents, fire, theft',
            icon: Car
        },
        {
            key: 'hasThirdPartyLiability',
            label: 'Third Party',
            description: 'Legal liability for others',
            icon: Anchor
        },
        {
            key: 'hasZeroDepreciation',
            label: 'Zero Depreciation',
            description: 'Full claim without depreciation',
            icon: Shield
        },
        {
            key: 'hasEngineProtection',
            label: 'Engine Protect',
            description: 'Water/Oil logging cover',
            icon: Zap
        },
        {
            key: 'hasReturnToInvoice',
            label: 'Return to Invoice',
            description: 'Full invoice value in total loss',
            icon: AlertCircle
        },
        {
            key: 'hasNCBProtection',
            label: 'NCB Protect',
            description: 'Keep bonus after claim',
            icon: Award
        },
        {
            key: 'hasRoadsideAssistance',
            label: 'Roadside Assist',
            description: 'Towing, jumpstart support',
            icon: LifeBuoy
        }
    ];

    return (
        <div className="glass-panel-heavy p-8 rounded-[2rem] border-white/60 shadow-dreamy">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-950">Add-on Verification</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coverageItems.map((item) => {
                    // @ts-ignore - Indexing with string key
                    const isIncluded = coverages[item.key as keyof Coverage];
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.key}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 overflow-hidden relative group ${isIncluded
                                ? 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                                : 'bg-slate-50/50 border-slate-100 opacity-60 grayscale'
                                }`}
                        >
                            {isIncluded && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                            )}

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isIncluded ? 'bg-slate-50 text-slate-950 group-hover:bg-slate-950 group-hover:text-white group-hover:rotate-6' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className={`text-base font-bold leading-tight ${isIncluded ? 'text-slate-950' : 'text-slate-500'}`}>
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium mt-1">
                                        {item.description}
                                    </div>
                                </div>
                            </div>

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isIncluded ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-100 text-slate-300'
                                }`}>
                                {isIncluded ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
