"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Briefcase, ShieldCheck, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudioSelector({ isOpen, onClose }: StudioSelectorProps) {
  const router = useRouter();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-700"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl glass-panel-heavy squircle-soft shadow-dreamy max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border-white/60">
        {/* Decorative Mesh Background */}
        <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />

        {/* Mobile Handle */}
        <div className="h-1.5 w-12 bg-slate-200/50 rounded-full mx-auto mt-4 mb-2 sm:hidden relative z-20" />

        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-950 transition-all rounded-2xl hover:bg-white/80 hover:shadow-sm z-30 group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-8 md:p-10 text-center shrink-0 relative z-20">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-950 mb-3 tracking-tight">
            Select Your <span className="italic">Analysis Studio</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Rexi uses specialized AI models for document types to provide maximum accuracy.
          </p>
        </div>

        <div className="px-8 md:px-14 pb-10 overflow-y-auto flex-1 custom-scrollbar relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Job Offer Letter */}
            <button
              onClick={() => handleSelect("/offers")}
              onMouseEnter={() => setHoveredOption("offer")}
              onMouseLeave={() => setHoveredOption(null)}
              className={`group relative p-6 rounded-[2rem] border transition-all duration-500 text-left flex flex-col h-full ${hoveredOption === "offer"
                ? "bg-slate-950 border-slate-900 shadow-2xl -translate-y-2"
                : "bg-white/60 border-white/40 hover:bg-white/80"
                }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${hoveredOption === "offer" ? "bg-white text-slate-950 rotate-6" : "bg-slate-950 text-white"
                }`}>
                <Briefcase className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className={`text-lg font-serif font-bold mb-2 transition-colors ${hoveredOption === "offer" ? "text-white" : "text-slate-950"}`}>
                  Employment Offer
                </h3>
                <p className={`text-xs font-medium leading-relaxed mb-4 transition-colors ${hoveredOption === "offer" ? "text-slate-400" : "text-slate-500"}`}>
                  Analyze salary, benefits, and hidden clauses in your job offer.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${hoveredOption === "offer" ? "bg-white/10 border-white/20 text-indigo-200" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  Salary Analysis
                </span>
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${hoveredOption === "offer" ? "bg-white/10 border-white/20 text-indigo-200" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  Tax Insights
                </span>
              </div>

              <div className={`mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${hoveredOption === "offer" ? "text-white translate-x-1" : "text-slate-400 opacity-60"}`}>
                Enter Studio <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* General Document */}
            <button
              onClick={() => handleSelect("/analyze")}
              onMouseEnter={() => setHoveredOption("document")}
              onMouseLeave={() => setHoveredOption(null)}
              className={`group relative p-6 rounded-[2rem] border transition-all duration-500 text-left flex flex-col h-full ${hoveredOption === "document"
                ? "bg-slate-950 border-slate-900 shadow-2xl -translate-y-2"
                : "bg-white/60 border-white/40 hover:bg-white/80"
                }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${hoveredOption === "document" ? "bg-white text-slate-950 rotate-6" : "bg-slate-950 text-white"
                }`}>
                <FileText className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className={`text-lg font-serif font-bold mb-2 transition-colors ${hoveredOption === "document" ? "text-white" : "text-slate-950"}`}>
                  General Document
                </h3>
                <p className={`text-xs font-medium leading-relaxed mb-4 transition-colors ${hoveredOption === "document" ? "text-slate-400" : "text-slate-500"}`}>
                  NDAs, leases, agreements - risk detection and clause analysis.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${hoveredOption === "document" ? "bg-white/10 border-white/20 text-blue-200" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  Risk Detection
                </span>
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${hoveredOption === "document" ? "bg-white/10 border-white/20 text-blue-200" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  Clause Review
                </span>
              </div>

              <div className={`mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${hoveredOption === "document" ? "text-white translate-x-1" : "text-slate-400 opacity-60"}`}>
                Enter Studio <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Insurance Policy */}
            <button
              onClick={() => handleSelect("/insurance")}
              onMouseEnter={() => setHoveredOption("insurance")}
              onMouseLeave={() => setHoveredOption(null)}
              className={`group relative p-6 rounded-[2rem] border transition-all duration-500 text-left flex flex-col h-full ${hoveredOption === "insurance"
                ? "bg-slate-950 border-slate-900 shadow-2xl -translate-y-2"
                : "bg-white/60 border-white/40 hover:bg-white/80"
                }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${hoveredOption === "insurance" ? "bg-white text-slate-950 rotate-6" : "bg-slate-950 text-white"
                }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className={`text-lg font-serif font-bold mb-2 transition-colors ${hoveredOption === "insurance" ? "text-white" : "text-slate-950"}`}>
                  Insurance Policy
                </h3>
                <p className={`text-xs font-medium leading-relaxed mb-4 transition-colors ${hoveredOption === "insurance" ? "text-slate-400" : "text-slate-500"}`}>
                  Understand coverage, gaps, and claim scenarios.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${hoveredOption === "insurance" ? "bg-white/10 border-white/20 text-purple-200" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  Coverage Check
                </span>
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${hoveredOption === "insurance" ? "bg-white/10 border-white/20 text-purple-200" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  Risk Radar
                </span>
              </div>

              <div className={`mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${hoveredOption === "insurance" ? "text-white translate-x-1" : "text-slate-400 opacity-60"}`}>
                Enter Studio <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 text-center shrink-0 border-t border-slate-100 bg-white/40 backdrop-blur-md relative z-20">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            You can always switch between studios later
          </p>
        </div>
      </div>
    </div>
  );
}
