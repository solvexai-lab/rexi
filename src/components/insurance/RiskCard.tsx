import { RiskFlag } from '@/lib/insurance/types';
import { AlertTriangle } from 'lucide-react';

export function RiskCard({ flag }: { flag: RiskFlag }) {
    const severityColors = {
        HIGH: 'border-red-500 bg-red-50',
        MEDIUM: 'border-amber-500 bg-amber-50',
        LOW: 'border-blue-500 bg-blue-50'
    };

    const badgeColors = {
        HIGH: 'bg-red-100 text-red-700',
        MEDIUM: 'bg-amber-100 text-amber-700',
        LOW: 'bg-blue-100 text-blue-700'
    };

    return (
        <div className={`glass-card w-full rounded-2xl p-6 border-l-4 ${severityColors[flag.severity]}`}>
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-slate-900">{flag.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${badgeColors[flag.severity]}`}>
                            {flag.severity}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        {flag.description}
                    </p>
                    {flag.recommendation && (
                        <p className="text-sm font-semibold text-slate-900">
                            💡 {flag.recommendation}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
