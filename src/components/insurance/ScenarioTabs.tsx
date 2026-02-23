'use client';

import { useState } from 'react';
import { ClaimScenario, PolicyData } from '@/lib/insurance/types';
import { TrendingUp, FileText, Shield, CheckCircle2 } from 'lucide-react';

interface ScenarioTabsProps {
    scenarios: ClaimScenario[];
    policyData: PolicyData;
    extractedPerils?: { covered: string[]; exclusions: string[] };
}

export function ScenarioTabs({ scenarios, policyData, extractedPerils }: ScenarioTabsProps) {
    const [activeTab, setActiveTab] = useState('scenarios');

    const tabs = [
        { id: 'scenarios', label: 'Claim Scenarios', icon: TrendingUp },
        { id: 'coverage', label: 'What\'s Covered', icon: Shield },
    ];

    return (
        <div className="glass-panel-heavy rounded-[2rem] overflow-hidden shadow-dreamy border-white/60">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-100 bg-white/40 backdrop-blur-md">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id
                                ? 'text-slate-950 translate-y-0'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                }`}
                        >
                            <Icon className="w-5 h-5 font-bold" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-950 animate-in fade-in slide-in-from-bottom-1" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-10">
                {activeTab === 'scenarios' && (
                    <div className="space-y-6">
                        <p className="text-slate-500 font-medium mb-6 flex items-center gap-2">
                            Interactive claim simulation based on your unique policy terms.
                        </p>
                        {scenarios.map((scenario, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group"
                            >
                                <h4 className="font-serif font-bold text-slate-950 text-2xl mb-3">{scenario.scenarioName}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8">{scenario.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Repair Estimate</div>
                                        <div className="text-xl font-serif font-bold text-slate-950">
                                            ₹{scenario.repairCost.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 px-4 py-4 rounded-2xl border border-green-100 shadow-sm">
                                        <div className="text-[10px] text-green-600 uppercase tracking-widest font-bold mb-1">Company Coverage</div>
                                        <div className="text-xl font-serif font-bold text-green-700">
                                            ₹{scenario.insurerPays.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-red-50 px-4 py-4 rounded-2xl border border-red-100 shadow-sm">
                                        <div className="text-[10px] text-red-600 uppercase tracking-widest font-bold mb-1">Your Liability</div>
                                        <div className="text-xl font-serif font-bold text-red-700">
                                            ₹{scenario.youPay.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 rounded-2xl p-6 text-sm font-medium text-slate-600 border border-slate-100 leading-relaxed group-hover:bg-slate-950 group-hover:text-slate-300 transition-all duration-500">
                                    <span className="font-bold text-slate-900 group-hover:text-white block mb-1 uppercase tracking-tighter text-xs">Rexi Analysis:</span>
                                    {scenario.explanation}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'coverage' && (
                    <div className="space-y-10">
                        {extractedPerils ? (
                            <>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-serif font-bold text-2xl text-slate-950">Active Protection</h4>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {extractedPerils.covered.map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-medium text-slate-700 hover:bg-white transition-colors">
                                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 pt-4">
                                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-serif font-bold text-2xl text-slate-950">Risk Exclusions</h4>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {extractedPerils.exclusions.map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-medium text-slate-700 hover:bg-white transition-colors">
                                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 px-8 glass-panel-heavy rounded-[2rem]">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Policy Details Loading...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
