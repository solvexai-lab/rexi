"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Scale,
  Home,
  DollarSign,
  Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SAMPLE_RISKS = [
  {
    id: 1,
    type: "critical",
    title: "Excessive Security Deposit",
    clause: "Section 3.1: Tenant shall pay a security deposit equal to three (3) months' rent upon signing.",
    analysis: "Many states limit security deposits to 1-2 months' rent. A 3-month deposit may be illegal in your jurisdiction and is financially burdensome.",
    recommendation: "Check your state laws. In CA, NY, and many others, this exceeds legal limits. Negotiate to 1-2 months."
  },
  {
    id: 2,
    type: "critical",
    title: "Unreasonable Entry Clause",
    clause: "Section 7.2: Landlord reserves the right to enter the premises at any time without prior notice for inspections.",
    analysis: "This violates tenant privacy rights. Most states require 24-48 hours notice except for emergencies.",
    recommendation: "Demand this be changed to '24-48 hours written notice' with emergency exceptions only."
  },
  {
    id: 3,
    type: "warning",
    title: "Vague Repair Responsibility",
    clause: "Section 5.4: Tenant is responsible for 'general maintenance and minor repairs' during tenancy.",
    analysis: "'Minor repairs' is not defined. This could be used to charge you for appliance repairs, plumbing issues, or HVAC maintenance.",
    recommendation: "Request specific dollar threshold (e.g., 'repairs under $50') and list of included items."
  },
  {
    id: 4,
    type: "safe",
    title: "Standard Lease Duration",
    clause: "Section 1.1: This lease agreement is for a term of twelve (12) months beginning on the 1st of the month.",
    analysis: "This is a standard 12-month lease term with clear start date. No concerns.",
    recommendation: "No action needed."
  }
];

export function DemoModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    try {
      setOpen(false);
      router.push('/analyze');
    } catch (err) {
      console.error("Navigation failed:", err);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white border-slate-200">
          <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                  Sample Rental Agreement Analysis
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  See how REXI identifies risks in a real apartment lease — no upload required.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Sample Document */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Apartment_Lease_2024.pdf
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100 uppercase">
                    Scanned
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 font-mono text-sm leading-relaxed border border-slate-100 relative">
                  <div className="absolute top-4 right-4 opacity-10">
                    <Home className="w-12 h-12" />
                  </div>
                  
                  <div className="mb-4 pb-3 border-b border-slate-200">
                    <p className="text-slate-800 font-bold text-center">RESIDENTIAL LEASE AGREEMENT</p>
                    <p className="text-slate-500 text-xs text-center mt-1">123 Main Street, Apt 4B</p>
                  </div>
                  
                  <div 
                    className="mb-6 p-2 rounded bg-emerald-50 border-l-4 border-emerald-400 cursor-help transition-all"
                  >
                    <p className="text-slate-800 font-medium italic text-xs">
                      "Section 1.1: This lease agreement is for a term of twelve (12) months..."
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Safe</span>
                    </div>
                  </div>
                  
                  <div 
                    className="mb-6 p-2 rounded bg-red-50 border-l-4 border-red-400 group cursor-help transition-all"
                  >
                    <p className="text-slate-800 font-medium italic text-xs">
                      "Section 3.1: Tenant shall pay a security deposit equal to three (3) months' rent..."
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">Critical Risk</span>
                    </div>
                  </div>

                  <div 
                    className="mb-6 p-2 rounded bg-amber-50 border-l-4 border-amber-400 cursor-help transition-all"
                  >
                    <p className="text-slate-800 font-medium italic text-xs">
                      "Section 5.4: Tenant is responsible for 'general maintenance and minor repairs'..."
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">Warning</span>
                    </div>
                  </div>

                  <div 
                    className="p-2 rounded bg-red-50 border-l-4 border-red-400 cursor-help transition-all"
                  >
                    <p className="text-slate-800 font-medium italic text-xs">
                      "Section 7.2: Landlord reserves the right to enter the premises at any time..."
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">Critical Risk</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 mt-6 text-xs">... (signature block omitted)</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-900">This is a sample document</p>
                      <p className="text-xs text-blue-700 mt-1">Upload your own lease to get personalized analysis with state-specific legal guidance.</p>
                    </div>
                  </div>
                </div>
              </div>

            {/* Right Column: Analysis Report */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  Risk Analysis
                </span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
              </div>

              <div className="space-y-4">
                {SAMPLE_RISKS.map((risk) => (
                  <div
                    key={risk.id}
                    className={`p-5 rounded-2xl border ${
                      risk.type === 'critical' ? 'bg-red-50/50 border-red-100' :
                      risk.type === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                      'bg-emerald-50/50 border-emerald-100'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`mt-1 ${
                        risk.type === 'critical' ? 'text-red-600' :
                        risk.type === 'warning' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {risk.type === 'critical' && <XCircle className="w-5 h-5" />}
                        {risk.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                        {risk.type === 'safe' && <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{risk.title}</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {risk.analysis}
                        </p>
                      </div>
                    </div>
                    <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${
                      risk.type === 'critical' ? 'border-red-100' :
                      risk.type === 'warning' ? 'border-amber-100' :
                      'border-emerald-100'
                    }`}>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                        <span className="text-slate-900">REXI Rec:</span> {risk.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Home className="w-20 h-20" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 relative z-10">Lease Safety Score</h4>
                  <div className="flex items-end gap-3 mb-4 relative z-10">
                    <span className="text-4xl font-bold text-red-400">42</span>
                    <span className="text-slate-400 font-bold mb-1">/ 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-red-400 w-[42%]" />
                  </div>
                  <p className="text-xs text-slate-400 mt-4 font-medium leading-relaxed relative z-10">
                    <span className="text-red-400 font-bold">High Risk:</span> This lease has 2 critical issues that may violate tenant rights. Do not sign without negotiation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold">Zero Data Stored</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium">Powered by Google Gemini</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-slate-900" onClick={handleNavigate}>
                Upload Your Lease
              </Button>
              <Button className="bg-slate-900 hover:bg-black text-white px-8 rounded-full font-bold shadow-lg" onClick={handleNavigate}>
                Analyze Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
