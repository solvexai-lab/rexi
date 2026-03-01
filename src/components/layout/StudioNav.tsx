import Link from "next/link";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import { Logo } from "@/components/logo";

interface StudioNavProps {
    exitPath?: string;
    exitLabel?: string;
    maxWidthClass?: string;
    paddingClass?: string;
}

export function StudioNav({
    exitPath = "/",
    exitLabel = "Exit",
    maxWidthClass = "max-w-7xl",
    paddingClass = "px-2 sm:px-4",
}: StudioNavProps) {
    return (
        <nav className={`fixed top-0 left-0 right-0 z-[60] pt-2 sm:pt-4 pointer-events-none ${paddingClass}`}>
            <div className={`${maxWidthClass} mx-auto flex items-center justify-between pointer-events-auto`}>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo className="w-7 h-7 sm:w-8 sm:h-8" iconOnly />
                        <span className="font-semibold text-slate-900 tracking-tight text-sm sm:text-base">
                            REXI <span className="text-indigo-500">STUDIO</span>
                        </span>
                    </Link>
                    <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block" />
                    <Link href={exitPath} className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" />
                        {exitLabel}
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
                        <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold hidden sm:inline">End-to-End Encrypted</span>
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold sm:hidden">
                            <Lock className="w-3 h-3 text-emerald-500" />
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
