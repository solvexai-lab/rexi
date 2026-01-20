"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Briefcase, X, ArrowRight } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 pb-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            What would you like to analyze?
          </h2>
          <p className="text-slate-400">
            Choose the type of document for expert legal insights
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("/offers")}
            onMouseEnter={() => setHoveredOption("offer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 rounded-xl border transition-all duration-300 text-left ${
              hoveredOption === "offer"
                ? "bg-emerald-500/10 border-emerald-500/50 scale-[1.02]"
                : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              hoveredOption === "offer" ? "bg-emerald-500/20" : "bg-slate-700/50"
            }`}>
              <Briefcase className={`w-7 h-7 ${
                hoveredOption === "offer" ? "text-emerald-400" : "text-slate-400"
              }`} />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              Job Offer Letter
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Salary breakdown, benefits analysis, tax optimization, and market comparison
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Salary Analysis
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Tax Insights
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Benefits
              </span>
            </div>
            
            <div className={`absolute bottom-6 right-6 transition-opacity ${
              hoveredOption === "offer" ? "opacity-100" : "opacity-0"
            }`}>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </div>
          </button>
          
          <button
            onClick={() => handleSelect("/analyze")}
            onMouseEnter={() => setHoveredOption("document")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 rounded-xl border transition-all duration-300 text-left ${
              hoveredOption === "document"
                ? "bg-blue-500/10 border-blue-500/50 scale-[1.02]"
                : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              hoveredOption === "document" ? "bg-blue-500/20" : "bg-slate-700/50"
            }`}>
              <FileText className={`w-7 h-7 ${
                hoveredOption === "document" ? "text-blue-400" : "text-slate-400"
              }`} />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              General Document
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              NDAs, leases, agreements - risk detection and clause analysis
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Risk Detection
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Clause Review
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Legal Terms
              </span>
            </div>
            
            <div className={`absolute bottom-6 right-6 transition-opacity ${
              hoveredOption === "document" ? "opacity-100" : "opacity-0"
            }`}>
              <ArrowRight className="w-5 h-5 text-blue-400" />
            </div>
          </button>
        </div>
        
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-slate-500">
            Not sure? You can always switch between studios later.
          </p>
        </div>
      </div>
    </div>
  );
}
