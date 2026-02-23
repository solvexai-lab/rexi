"use client";

import { useState, useEffect } from 'react';
import { PolicyData } from '@/lib/insurance/types';
import { Edit2, Shield } from 'lucide-react';
import { EditPolicyModal } from './EditPolicyModal';

interface VitalsHeaderProps {
    policyData: PolicyData;
    analysisId: string;
}

export function VitalsHeader({ policyData, analysisId }: VitalsHeaderProps) {
    const { vehicleInfo, insurerName } = policyData;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const scan = {
                id: analysisId,
                make: vehicleInfo.make,
                model: vehicleInfo.model,
                regNo: vehicleInfo.registrationNo,
                insurer: insurerName,
                date: new Date().toISOString()
            };

            const existing = JSON.parse(localStorage.getItem('rexi_recent_scans') || '[]');
            const filtered = existing.filter((s: any) => s.id !== analysisId);
            const updated = [scan, ...filtered].slice(0, 10); // Keep last 10
            localStorage.setItem('rexi_recent_scans', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save to history:', e);
        }
    }, [analysisId, vehicleInfo, insurerName]);

    return (
        <div className="glass-panel-heavy p-8 rounded-[2rem] shadow-dreamy mb-8 relative group border-white/60">
            <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm border border-slate-100"
                title="Edit Policy Details"
            >
                <Edit2 className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-white text-3xl font-serif font-bold shadow-2xl group-hover:rotate-3 transition-transform">
                        {vehicleInfo.make?.[0] || 'P'}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-950 tracking-tight">
                                {vehicleInfo.make || 'Policy'} {vehicleInfo.model || 'Analysis'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                                {vehicleInfo.registrationNo ? 'Verified Asset' : 'Unregistered'}
                            </span>
                            <p className={`text-sm font-bold tracking-widest uppercase ${vehicleInfo.registrationNo ? 'text-slate-400' : 'text-amber-600'}`}>
                                {vehicleInfo.registrationNo || 'MISSING REGISTRATION NO'}
                            </p>
                            {!vehicleInfo.registrationNo && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="text-[10px] font-bold px-2 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm"
                                >
                                    ADD NOW
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50/50 backdrop-blur-sm px-6 py-4 rounded-[1.5rem] border border-slate-100 self-start md:self-center group-hover:bg-white transition-colors">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Risk Carrier</div>
                        <div className={`text-lg font-serif font-bold ${insurerName ? 'text-slate-950' : 'text-slate-400'}`}>
                            {insurerName || 'Undetected'}
                        </div>
                    </div>
                </div>
            </div>

            <EditPolicyModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                policyData={policyData}
                analysisId={analysisId}
            />
        </div>
    );
}
