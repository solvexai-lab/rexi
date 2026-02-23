import { ClaimScenario } from '@/lib/insurance/types';
import { AlertTriangle } from 'lucide-react';

export function ScenarioCard({ scenario }: { scenario: ClaimScenario }) {
    return (
        <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>

            <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-2">
                {scenario.scenarioName}
            </h3>
            <p className="text-sm text-slate-600 mb-6">{scenario.description}</p>

            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Repair Cost</span>
                    <span className="font-bold text-slate-900">₹{scenario.repairCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Insurer Pays</span>
                    <span className="font-bold text-emerald-600">₹{scenario.insurerPays.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                    <span className="text-sm font-bold text-slate-900">You Pay</span>
                    <span className="text-2xl font-bold text-red-600">₹{scenario.youPay.toLocaleString()}</span>
                </div>
            </div>

            <div className="w-full bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5">
                <p className="text-sm text-slate-700 text-center">{scenario.explanation}</p>
            </div>
        </div>
    );
}
