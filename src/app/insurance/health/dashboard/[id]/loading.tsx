import { HeartPulse, Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Header Skeleton */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 h-20 flex items-center px-4 sm:px-8">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                            <div className="h-2 w-16 bg-slate-100 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-10 w-24 bg-slate-100 rounded-full animate-pulse" />
                        <div className="h-10 w-24 bg-slate-900/10 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Vitals Skeleton */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse" />
                    <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-4 w-48 bg-slate-100 rounded-lg animate-pulse" />
                </div>

                {/* Metrics Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 h-32 animate-pulse">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl mb-4" />
                            <div className="h-4 w-16 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 h-96 animate-pulse" />
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 h-64 animate-pulse" />
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 h-80 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Central Spinner for extra feedback */}
            <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-[100]">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white flex flex-col items-center gap-4 scale-90 sm:scale-100">
                    <div className="relative">
                        <HeartPulse className="w-12 h-12 text-slate-200" />
                        <div className="absolute inset-0">
                            <Loader2 className="w-12 h-12 text-slate-950 animate-spin" />
                        </div>
                    </div>
                    <p className="text-slate-900 font-bold tracking-tight">Preparing your Studio...</p>
                </div>
            </div>
        </div>
    );
}
