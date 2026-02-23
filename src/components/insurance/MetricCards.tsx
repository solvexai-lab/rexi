"use client";

import { PolicyData, ClaimScenario } from '@/lib/insurance/types';
import { DollarSign, Shield, TrendingUp, Calendar } from 'lucide-react';

interface MetricCardsProps {
    policyData: PolicyData;
    scenarios: ClaimScenario[];
}

export function MetricCards({ policyData, scenarios }: MetricCardsProps) {
    const { idv, premium, ncb, expiryDate } = policyData;

    // Calculate days until expiry
    const daysRemaining = expiryDate ? Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* IDV */}
            <div className="glass-panel-heavy p-6 rounded-[2rem] hover:shadow-dreamy transition-all hover:-translate-y-1 group border-white/60">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-bold">Max Payout (IDV)</div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1">
                    ₹{(idv / 100000).toFixed(2)}L
                </div>
            </div>

            {/* Premium */}
            <div className="glass-panel-heavy p-6 rounded-[2rem] hover:shadow-dreamy transition-all hover:-translate-y-1 group border-white/60">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-bold">Yearly Cost</div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1">
                    {premium > 0 ? `₹${premium.toLocaleString()}` : (
                        <div className="flex flex-col">
                            <span className="text-amber-600">~₹{(idv * 0.025).toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Estimated Base</span>
                        </div>
                    )}
                </div>
            </div>

            {/* NCB */}
            <div className="glass-panel-heavy p-6 rounded-[2rem] hover:shadow-dreamy transition-all hover:-translate-y-1 group border-white/60">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Shield className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-bold">No Claim Bonus</div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1">
                    {ncb}%
                </div>
            </div>

            {/* Expiry */}
            <div className="glass-panel-heavy p-6 rounded-[2rem] hover:shadow-dreamy transition-all hover:-translate-y-1 group border-white/60">
                <div className="flex items-center gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${daysRemaining && daysRemaining < 30
                        ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                        : 'bg-slate-50 text-slate-600 group-hover:bg-slate-950 group-hover:text-white'
                        }`}>
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-bold">Renewal Due</div>
                <div className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${daysRemaining && daysRemaining < 30 ? 'text-red-600 animate-pulse' : 'text-slate-950'
                    }`}>
                    {daysRemaining ? `${daysRemaining} Days` : 'Unknown'}
                </div>
            </div>
        </div>
    );
}
