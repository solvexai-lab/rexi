import { Loader2, GitCompareArrows } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen mesh-gradient px-4 py-10 md:py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header Skeleton */}
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-5 w-96 bg-slate-100 rounded animate-pulse" />
                </div>

                {/* Upload zone skeleton */}
                <div className="glass-panel-heavy squircle-soft shadow-dreamy p-6 md:p-10 space-y-6 animate-pulse">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl h-48" />
                    <div className="h-14 bg-slate-200 rounded-2xl" />
                </div>
            </div>

            {/* Central spinner */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white flex flex-col items-center gap-4">
                    <div className="relative">
                        <GitCompareArrows className="w-12 h-12 text-slate-200" />
                        <div className="absolute inset-0">
                            <Loader2 className="w-12 h-12 text-slate-950 animate-spin" />
                        </div>
                    </div>
                    <p className="text-slate-900 font-bold tracking-tight">Loading Compare...</p>
                </div>
            </div>
        </div>
    );
}
