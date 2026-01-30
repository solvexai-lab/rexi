"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  ArrowLeft,
  Scale,
  Shield,
  Lock,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  Lightbulb,
  Zap,
  ChevronDown,
  Plus,
  X,
  TrendingUp,
  Heart,
  ShieldCheck,
  Building2,
  DollarSign,
  MapPin,
  Calendar,
  Star,
  Award,
  BarChart3,
  AlertOctagon,
  GitCompare,
  CheckCircle2,
  Minus,
  Sparkles,
  ArrowUpRight,
  Wallet,
  PieChart,
  Receipt,
  Gavel,
  TrendingDown,
  Home,
  Briefcase,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { OfferAnalysisResponse, OfferComparisonResponse, OfferRisk, EconomicAnalysis } from "@/lib/types/offer-analysis";
import {
  calculateEconomicAnalysis,
  calculateDeterministicSalaryBreakdown,
  calculateTaxForRegime,
  formatINR,
  getLivabilityColor,
  getClawbackRiskColor,
} from "@/lib/salary-engine";
import { ShareOfferButton } from "@/components/share-offer-button";

type ViewMode = "upload" | "single" | "compare";

const INFO_TOOLTIPS: Record<string, string> = {
  livabilityIndex: "Shows how many times your take-home covers basic living costs. 2.5x+ is comfortable, while below 1.5x may be challenging for savings.",
  year1CTC: "Includes one-time payments (Joining Bonus, Relocation). Year 2 shows your steady recurring salary without these one-offs.",
  clawbackRisk: "Financial liability if you leave early. You may need to return bonuses. High risk means a large portion of your Year 1 pay is tied to staying.",
  taxDeductions: "Includes PF (Employee), Prof. Tax, and Income Tax. Note: PF Employer contribution is part of CTC but goes directly to your PF account.",
  takeHome: "The actual amount credited to your bank account monthly. Calculated after all taxes and statutory deductions.",
  salaryPercentile: "Where your offer stands in the market. 75th percentile means you're earning more than 75% of peers in similar roles and cities.",
  cityEconomics: "Adjusted cost of living based on your city cluster. Metro cities have higher rent and transport costs than Tier-2 hubs.",
  savingsRate: "The percentage of your take-home pay remaining after estimated basic expenses in your target city.",
  pfContribution: "Statutory 12% contribution from both you and your employer towards your retirement fund (EPFO).",
  overallScore: "A weighted score across Pay (30%), Benefits (20%), Risks (25%), WLB (15%), and Growth (10%).",
};

function InfoTooltip({ tooltipKey, className = "", variant = "light" }: { tooltipKey: keyof typeof INFO_TOOLTIPS; className?: string; variant?: "light" | "dark" }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110 shrink-0 outline-none focus:ring-2 focus:ring-indigo-500/50 ${variant === "dark"
              ? "bg-white/10 hover:bg-white/20 border border-white/10"
              : "bg-slate-100/80 hover:bg-slate-200 border border-slate-200/50"
            } ${className}`}
          aria-label="More information"
        >
          <Info className={`w-3 h-3 ${variant === "dark" ? "text-white/70" : "text-slate-500"}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-80 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 z-[100] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="relative">
          <p className="leading-relaxed font-medium text-slate-100 text-[13px] normal-case tracking-normal">
            {INFO_TOOLTIPS[tooltipKey]}
          </p>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("## ")) {
          return <h2 key={i} className="text-base font-semibold text-slate-900 mt-6 mb-3 tracking-tight">{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith("### ")) {
          return <h3 key={i} className="text-sm font-semibold text-slate-800 mt-4 mb-2">{trimmed.slice(4)}</h3>;
        }
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return <p key={i} className="font-semibold text-slate-900 mt-3 mb-1 text-sm">{trimmed.slice(2, -2)}</p>;
        }
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const text = trimmed.slice(2);
          const formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900">$1</strong>');
          return (
            <div key={i} className="flex items-start gap-3 ml-2 my-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
            </div>
          );
        }
        if (trimmed === "") return <div key={i} className="h-2" />;
        const formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900">$1</strong>');
        return <p key={i} className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
}

export default function OffersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("upload");
  const [offers, setOffers] = useState<OfferAnalysisResponse[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferAnalysisResponse | null>(null);
  const [comparison, setComparison] = useState<OfferComparisonResponse | null>(null);
  const [perspective, setPerspective] = useState<"balanced" | "money" | "stability" | "growth">("balanced");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("realvalue");
  const [selectedRisk, setSelectedRisk] = useState<OfferRisk | null>(null);
  const [breakdownPeriod, setBreakdownPeriod] = useState<"annual" | "monthly">("annual");
  const [allowDataContribution, setAllowDataContribution] = useState(true);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("new");
  const [commuteTime, setCommuteTime] = useState<number>(1); // hours per day
  const [simulatedValues, setSimulatedValues] = useState<Record<string, { base: number, bonus: number }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSimulation = (offerId: string, type: 'base' | 'bonus', value: number) => {
    setSimulatedValues(prev => ({
      ...prev,
      [offerId]: {
        ...prev[offerId],
        [type]: value
      }
    }));
  };

  const calculateTaxSavings = (income: number, regime: "old" | "new") => {
    return calculateTaxForRegime(income, regime);
  };

  const calculateCommuteTax = (hourlyRate: number, hours: number) => {
    return hourlyRate * hours * 22; // 22 working days
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  // Sync selected risk when offer changes
  useEffect(() => {
    if (selectedOffer?.risks && selectedOffer.risks.length > 0) {
      setSelectedRisk(selectedOffer.risks[0]);
    } else {
      setSelectedRisk(null);
    }
  }, [selectedOffer]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    try {
      let extractedText = "";
      const isBinaryFile = file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".pdf") || file.name.endsWith(".docx");

      if (isBinaryFile) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/parse-file", { method: "POST", body: formData });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to parse file");
        }
        const data = await response.json();
        extractedText = data.text || "";
      } else {
        extractedText = await file.text();
      }

      if (!extractedText.trim()) throw new Error("Could not extract text from file");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      let analyzeResponse;
      try {
        analyzeResponse = await fetch("/api/analyze-offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: extractedText, fileName: file.name }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error("Analysis is taking longer than expected. Please try again with a smaller document.");
        }
        throw new Error("Network error. Please check your connection and try again.");
      }

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze offer. The document might be too complex or in an unsupported format.");
      }

      const analysisResult: OfferAnalysisResponse = await analyzeResponse.json();

      // Phase 1: Data Contribution
      if (allowDataContribution) {
        try {
          await fetch("/api/contribute-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: analysisResult.offer.role,
              company: analysisResult.offer.company,
              location: analysisResult.offer.location,
              base_salary: analysisResult.offer.baseSalary,
              total_ctc: analysisResult.offer.salaryBreakdown?.totalCTC || analysisResult.offer.baseSalary,
              bonus: analysisResult.offer.bonus || 0,
              equity_value: analysisResult.offer.equity?.amount || 0,
              currency: analysisResult.offer.currency,
              confidence_score: 1.0 // Verified from real document
            }),
          });
        } catch (contribError) {
          console.error("Failed to contribute data:", contribError);
        }
      }

      fetch("/api/store-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "offers",
          rawText: extractedText,
          analysisResult: analysisResult,
          fileName: file.name,
          documentType: "Offer Letter",
          metadata: {
            fileSize: file.size,
            fileType: file.type,
            company: analysisResult.offer.company,
            role: analysisResult.offer.role,
          },
        }),
      }).catch(console.error);

      setOffers((prev) => [...prev, analysisResult]);
      setSelectedOffer(analysisResult);
      setViewMode("single");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Failed to process offer letter");
    } finally {
      setIsAnalyzing(false);
    }
  }, [allowDataContribution]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file).catch(console.error);
  }, [handleFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file).catch(console.error);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [handleFileUpload]);

  const handleCompare = useCallback(async (selectedPerspective?: "balanced" | "money" | "stability" | "growth") => {
    if (offers.length < 2) {
      alert("Please upload at least 2 offer letters to compare");
      return;
    }
    const activePerspective = typeof selectedPerspective === "string" ? selectedPerspective : perspective;
    setIsComparing(true);
    try {
      const response = await fetch("/api/compare-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offers, perspective: activePerspective }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to compare offers");
      }
      const comparisonResult: OfferComparisonResponse = await response.json();
      setComparison(comparisonResult);
      setViewMode("compare");
    } catch (error: any) {
      console.error("Comparison error:", error);
      alert(error.message || "Failed to compare offers");
    } finally {
      setIsComparing(false);
    }
  }, [offers, perspective]);

  const changePerspective = (newPerspective: "balanced" | "money" | "stability" | "growth") => {
    setPerspective(newPerspective);
    handleCompare(newPerspective);
  };

  const removeOffer = useCallback((offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.offer.id !== offerId));
    if (selectedOffer?.offer.id === offerId) setSelectedOffer(null);
  }, [selectedOffer]);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "INR") {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} LPA`;
      return `₹${amount.toLocaleString("en-IN")}`;
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical": return { icon: AlertOctagon, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", dot: "bg-rose-500", shadow: "shadow-rose-100/50" };
      case "high": return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", dot: "bg-orange-500", shadow: "shadow-orange-100/50" };
      case "medium": return { icon: Info, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-500", shadow: "shadow-amber-100/50" };
      case "low": return { icon: Info, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-400", shadow: "shadow-slate-100/50" };
      default: return { icon: Info, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-400", shadow: "shadow-slate-100/50" };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    if (score >= 40) return "text-orange-500";
    return "text-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-rose-500";
  };

  const getCompanyFromOfferId = (offerId: string) => {
    const fromOffers = offers.find((o) => o.offer.id === offerId)?.offer.company;
    if (fromOffers) return fromOffers;
    const fromComparison = comparison?.offers.find((o) => o.offerId === offerId)?.company;
    if (fromComparison && fromComparison !== "Unknown Company") return fromComparison;
    return comparison?.offers[0]?.company || "N/A";
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Premium Studio Navigation - Mobile Optimized */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-2 sm:px-4 pt-2 sm:pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 tracking-tight text-sm sm:text-base">REXI <span className="text-indigo-500">STUDIO</span></span>
            </Link>
            <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block" />
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 hidden sm:flex">
              <ArrowLeft className="w-3 h-3" />
              Exit
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold hidden xs:inline">Encrypted</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold xs:hidden">
                <Lock className="w-3 h-3 text-emerald-500" />
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-20">
        {/* Hidden file input - always rendered */}
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />

        {/* Breadcrumbs / Multi-offer Toggle - Mobile Optimized */}
        {offers.length > 0 && (
          <div className="mb-6 sm:mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Offer Pills - Horizontal Scroll on Mobile */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
                {offers.map((offer, index) => (
                  <div
                    key={offer.offer.id}
                    onClick={() => { setSelectedOffer(offer); setViewMode("single"); }}
                    className={`group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer shrink-0 ${selectedOffer?.offer.id === offer.offer.id && viewMode === "single"
                        ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105 z-10"
                        : "bg-white border-slate-100 hover:border-slate-300 text-slate-600 hover:translate-y-[-2px]"
                      }`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center ${selectedOffer?.offer.id === offer.offer.id && viewMode === "single" ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}>0{index + 1}</div>
                    <span className="text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">{offer.offer.company}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeOffer(offer.offer.id); }}
                      className={`p-0.5 sm:p-1 rounded-full hover:bg-white/20 transition-colors ${selectedOffer?.offer.id === offer.offer.id && viewMode === "single" ? "text-white/60" : "text-slate-300"
                        }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all hover:rotate-90 shrink-0"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Compare Button - Full Width on Mobile */}
              {offers.length >= 2 && (
                <button
                  onClick={() => handleCompare()}
                  disabled={isComparing}
                  className={`relative overflow-hidden group px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl font-semibold text-sm transition-all w-full sm:w-auto sm:self-end ${viewMode === "compare"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-slate-900 border border-slate-200 hover:border-indigo-200 hover:shadow-lg shadow-slate-100"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {isComparing ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <GitCompare className="w-4 h-4" />
                    )}
                    Compare All Offers
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Views */}
        {viewMode === "upload" && offers.length === 0 && !isAnalyzing ? (
          <div className="max-w-4xl mx-auto pt-4 sm:pt-10">
            <div className="text-center mb-8 sm:mb-16 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-1000">
                <Sparkles className="w-3 h-3" /> Gemini 2.0 Engine
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 px-2">
                Analyze your offer <br className="hidden sm:block" /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Studio Precision.</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-lg max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
                Upload any employment document or offer letter. We'll reveal hidden risks and prepare your negotiation strategy.
              </p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`group relative rounded-2xl sm:rounded-[2rem] p-1 text-center transition-all duration-500 ${isDragging ? "bg-gradient-to-r from-indigo-500 to-violet-500 scale-[1.02]" : "bg-slate-100 hover:bg-slate-200"
                }`}
            >
              <div className="bg-white rounded-xl sm:rounded-[1.85rem] p-8 sm:p-16 border border-white/40 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />

                <div className="relative z-10 space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Drop your document</h3>
                    <p className="text-slate-400 mt-1 sm:mt-2 text-sm">PDF, DOCX, and TXT supported</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 sm:px-10 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl shadow-slate-200 hover:translate-y-[-2px] transition-all active:scale-95 w-full sm:w-auto"
                    >
                      Browse Files
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => setAllowDataContribution(!allowDataContribution)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${allowDataContribution ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300 group-hover:border-indigo-400"
                          }`}
                      >
                        {allowDataContribution && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                        Anonymously contribute offer data to REXI benchmarks
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-500">
                      <Lock className="w-3 h-3 text-emerald-500" /> Private
                    </div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-500">
                      <Zap className="w-3 h-3 text-amber-500" /> Instant
                    </div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-500">
                      <ShieldCheck className="w-3 h-3 text-indigo-500" /> Secure
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Not an offer letter?{" "}
                <Link href="/analyze" className="text-indigo-600 font-semibold hover:text-indigo-700 underline underline-offset-2">
                  Use Document Studio
                </Link>
                {" "}for NDAs, leases, and general documents.
              </p>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="max-w-md mx-auto text-center py-16 sm:py-32 space-y-6 sm:space-y-8 animate-pulse">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Studying Offer Details</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Parsing clauses, calculating benchmarks, and detecting red flags...</p>
            </div>
          </div>
        ) : viewMode === "single" && selectedOffer ? (
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Main Insights Column */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-8">
              {/* Top Summary Card - Mobile Optimized */}
              <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                {/* Share Button */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                  <ShareOfferButton analysis={selectedOffer} variant="compact" />
                </div>
                {/* Score Circle - Repositioned for mobile */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
                  <div className="relative z-10 sm:max-w-[70%]">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900" />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">{selectedOffer.offer.company}</h1>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">{selectedOffer.offer.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm sm:text-lg leading-relaxed font-medium">
                      {selectedOffer.summary}
                    </p>
                  </div>

                  {/* Score Circle */}
                  <div className="self-end sm:self-start sm:p-0">
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="35%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                        <circle cx="50%" cy="50%" r="35%" stroke="currentColor" strokeWidth="8" fill="transparent"
                          strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * selectedOffer.overallScore) / 100}
                          className={`${getScoreColor(selectedOffer.overallScore)} transition-all duration-1000 ease-out`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-2xl font-black text-slate-900 leading-none">{selectedOffer.overallScore}</span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-0.5">
                          Score
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <InfoTooltip tooltipKey="overallScore" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compensation Dashboard - Mobile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                {[
                  { label: "Base Salary", value: formatCurrency(selectedOffer.offer.baseSalary, selectedOffer.offer.currency), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
                  {
                    label: "Bonus",
                    value: (() => {
                      const bonusPct = selectedOffer.offer.bonusPercentage;
                      const bonusAmt = selectedOffer.offer.bonus;
                      const baseSalary = selectedOffer.offer.baseSalary;
                      const isVariable = selectedOffer.offer.bonusIsVariable;

                      if (bonusPct && bonusPct > 0) {
                        const calculatedBonus = bonusAmt && bonusAmt > 0 ? bonusAmt : Math.round(baseSalary * bonusPct / 100);
                        const prefix = isVariable ? "Up to " : "";
                        return `${prefix}${formatCurrency(calculatedBonus, selectedOffer.offer.currency)}`;
                      }
                      if (bonusAmt && bonusAmt > 0) {
                        const prefix = isVariable ? "Up to " : "";
                        return `${prefix}${formatCurrency(bonusAmt, selectedOffer.offer.currency)}`;
                      }
                      return "Not Disclosed";
                    })(),
                    subValue: (() => {
                      const bonusCondition = selectedOffer.offer.bonusCondition;
                      const bonusPct = selectedOffer.offer.bonusPercentage;
                      const isVariable = selectedOffer.offer.bonusIsVariable;

                      if (bonusCondition) {
                        return bonusCondition;
                      }
                      if (bonusPct) {
                        return isVariable ? `${bonusPct}% (performance-based)` : `${bonusPct}% of base`;
                      }
                      return undefined;
                    })(),
                    icon: TrendingUp,
                    color: "text-indigo-500",
                    bg: "bg-indigo-50"
                  },
                  { label: "Equity", value: selectedOffer.offer.equity ? selectedOffer.offer.equity.type : "None", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Location", value: selectedOffer.offer.location || "Remote", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
                ].map((item: { label: string; value: string; subValue?: string; icon: any; color: string; bg: string }, i) => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${item.bg} ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">{item.label}</div>
                    <div className="text-sm sm:text-xl font-bold text-slate-900">{item.value}</div>
                    {item.subValue && <div className="text-[9px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2">{item.subValue}</div>}
                  </div>
                ))}
              </div>

              {/* Deep Analysis Tabs - Mobile Optimized */}
              <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {/* Horizontal scroll tabs on mobile */}
                <div className="flex border-b border-slate-50 px-1 sm:px-2 pt-1 sm:pt-2 overflow-x-auto scrollbar-hide">
                  {[
                    { id: "realvalue", label: "Real Value", fullLabel: "Real Value Analysis", icon: TrendingUp },
                    { id: "breakdown", label: "Breakdown", fullLabel: "Salary Breakdown", icon: Wallet },
                    { id: "benefits", label: "Benefits", fullLabel: "Benefits & Perks", icon: Heart },
                    { id: "equity", label: "Equity", fullLabel: "Equity Breakdown", icon: BarChart3, hidden: !selectedOffer.offer.equity },
                    { id: "covenants", label: "Clauses", fullLabel: "Restrictive Clauses", icon: Lock },
                    { id: "strategy", label: "Negotiate", fullLabel: "Negotiation Plan", icon: Zap },
                  ].filter(t => !t.hidden).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setExpandedSection(tab.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap shrink-0 ${expandedSection === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="sm:hidden">{tab.label}</span>
                      <span className="hidden sm:inline">{tab.fullLabel}</span>
                      {expandedSection === tab.id && (
                        <div className="absolute bottom-0 left-3 right-3 sm:left-6 sm:right-6 h-0.5 sm:h-1 bg-indigo-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 sm:p-8">
                  {expandedSection === "realvalue" && (
                    <div className="space-y-6">
                      {selectedOffer.offer.economicAnalysis ? (
                        <>
                          {/* Year 1 vs Year 2 Comparison */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-16 h-16" />
                              </div>
                              <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest">
                                  <Calendar className="w-4 h-4" /> Year 1 (with bonuses)
                                  <InfoTooltip tooltipKey="year1CTC" variant="dark" />
                                </div>
                                <div className="text-3xl font-black">
                                  {formatINR(selectedOffer.offer.economicAnalysis.year1EffectiveCTC)}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div>
                                    <div className="text-indigo-200 text-[10px] uppercase tracking-wider">Monthly</div>
                                    <div className="font-bold">{formatINR(selectedOffer.offer.economicAnalysis.year1MonthlyEffective)}</div>
                                  </div>
                                  <div className="h-8 w-px bg-indigo-400/30" />
                                  <div>
                                    <div className="text-indigo-200 text-[10px] uppercase tracking-wider">Savings Rate</div>
                                    <div className="font-bold">{selectedOffer.offer.economicAnalysis.savingsRateYear1}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <TrendingDown className="w-16 h-16" />
                              </div>
                              <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                  <Calendar className="w-4 h-4" /> Year 2+ (Steady State)
                                </div>
                                <div className="text-3xl font-black">
                                  {formatINR(selectedOffer.offer.economicAnalysis.year2SteadyCTC)}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div>
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider">Monthly</div>
                                    <div className="font-bold">{formatINR(selectedOffer.offer.economicAnalysis.year2MonthlyEffective)}</div>
                                  </div>
                                  <div className="h-8 w-px bg-slate-700" />
                                  <div>
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider">Savings Rate</div>
                                    <div className="font-bold">{selectedOffer.offer.economicAnalysis.savingsRateYear2}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* One-Time Benefits Breakdown */}
                          {selectedOffer.offer.oneTimeBenefits && (selectedOffer.offer.oneTimeBenefits.joiningBonus > 0 || selectedOffer.offer.oneTimeBenefits.relocationAllowance > 0) && (
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                              <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" /> One-Time Benefits (Year 1 Only)
                              </h4>
                              <div className="grid sm:grid-cols-3 gap-4">
                                {selectedOffer.offer.oneTimeBenefits.joiningBonus > 0 && (
                                  <div className="bg-white rounded-xl p-4 border border-amber-100">
                                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Joining Bonus</div>
                                    <div className="text-lg font-black text-slate-900">{formatINR(selectedOffer.offer.oneTimeBenefits.joiningBonus)}</div>
                                    <div className="text-[10px] text-amber-700 mt-1">Clawback: {selectedOffer.offer.oneTimeBenefits.joiningBonusClawbackMonths} months</div>
                                  </div>
                                )}
                                {selectedOffer.offer.oneTimeBenefits.relocationAllowance > 0 && (
                                  <div className="bg-white rounded-xl p-4 border border-amber-100">
                                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Relocation</div>
                                    <div className="text-lg font-black text-slate-900">{formatINR(selectedOffer.offer.oneTimeBenefits.relocationAllowance)}</div>
                                    <div className="text-[10px] text-amber-700 mt-1 capitalize">{selectedOffer.offer.oneTimeBenefits.relocationType?.replace('_', ' ') || 'Lump sum'}</div>
                                  </div>
                                )}
                                {selectedOffer.offer.oneTimeBenefits.noticeBuyout > 0 && (
                                  <div className="bg-white rounded-xl p-4 border border-amber-100">
                                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Notice Buyout</div>
                                    <div className="text-lg font-black text-slate-900">{formatINR(selectedOffer.offer.oneTimeBenefits.noticeBuyout)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* City Economics & Livability */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* City Cost Card */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Home className="w-4 h-4 text-indigo-500" /> City Economics
                                <InfoTooltip tooltipKey="cityEconomics" className="ml-1" />
                              </h4>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                      <MapPin className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900">{selectedOffer.offer.economicAnalysis.cityEconomics.city}</div>
                                      <div className="text-[10px] text-slate-500">Cluster {selectedOffer.offer.economicAnalysis.cityEconomics.cluster} • {selectedOffer.offer.economicAnalysis.cityEconomics.clusterName}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-slate-50 rounded-xl p-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Cost</div>
                                    <div className="text-sm font-bold text-slate-900">{formatINR(selectedOffer.offer.economicAnalysis.cityEconomics.baseMonthlyCost)}/mo</div>
                                  </div>
                                  <div className="bg-slate-50 rounded-xl p-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adjusted Cost</div>
                                    <div className="text-sm font-bold text-slate-900">{formatINR(selectedOffer.offer.economicAnalysis.cityEconomics.adjustedMonthlyCost)}/mo</div>
                                  </div>
                                  <div className="bg-slate-50 rounded-xl p-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inflation</div>
                                    <div className="text-sm font-bold text-slate-900">{selectedOffer.offer.economicAnalysis.cityEconomics.inflationRate}%</div>
                                  </div>
                                  <div className="bg-slate-50 rounded-xl p-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Mode</div>
                                    <div className="text-sm font-bold text-slate-900">{selectedOffer.offer.workMode || 'Office'}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Livability Meter */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" /> Livability Index
                                <InfoTooltip tooltipKey="livabilityIndex" className="ml-1" />
                              </h4>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="text-4xl font-black text-slate-900">
                                    {selectedOffer.offer.economicAnalysis.livabilityIndex.toFixed(2)}x
                                  </div>
                                  <div className={`px-4 py-2 rounded-xl font-bold text-sm ${selectedOffer.offer.economicAnalysis.livabilityGrade === 'Comfortable' ? 'bg-emerald-50 text-emerald-700' :
                                      selectedOffer.offer.economicAnalysis.livabilityGrade === 'Manageable' ? 'bg-amber-50 text-amber-700' :
                                        selectedOffer.offer.economicAnalysis.livabilityGrade === 'Tight' ? 'bg-orange-50 text-orange-700' :
                                          'bg-rose-50 text-rose-700'
                                    }`}>
                                    {selectedOffer.offer.economicAnalysis.livabilityGrade}
                                  </div>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-1000 ${selectedOffer.offer.economicAnalysis.livabilityGrade === 'Comfortable' ? 'bg-emerald-500' :
                                        selectedOffer.offer.economicAnalysis.livabilityGrade === 'Manageable' ? 'bg-amber-500' :
                                          selectedOffer.offer.economicAnalysis.livabilityGrade === 'Tight' ? 'bg-orange-500' :
                                            'bg-rose-500'
                                      }`}
                                    style={{ width: `${Math.min(100, (selectedOffer.offer.economicAnalysis.livabilityIndex / 3) * 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                  <span>Challenging (&lt;1.5x)</span>
                                  <span>Comfortable (&gt;2.5x)</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                  <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>Analysis Mode:</strong> {selectedOffer.offer.economicAnalysis.analysisMode}
                                    <br />
                                    Your take-home is <strong>{selectedOffer.offer.economicAnalysis.livabilityIndex.toFixed(2)}x</strong> the estimated monthly cost of living in {selectedOffer.offer.economicAnalysis.cityEconomics.city}.
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tax Optimization Engine */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                  <Receipt className="w-4 h-4 text-emerald-500" /> Tax Optimization
                                </h4>
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                                  <button
                                    onClick={() => setTaxRegime("old")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${taxRegime === "old" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                                  >
                                    Old
                                  </button>
                                  <button
                                    onClick={() => setTaxRegime("new")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${taxRegime === "new" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                                  >
                                    New
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-4">
                                {(() => {
                                  const annualCTC = selectedOffer.offer.salaryBreakdown?.totalCTC || selectedOffer.offer.baseSalary;
                                  const taxNew = calculateTaxSavings(annualCTC, "new");
                                  const taxOld = calculateTaxSavings(annualCTC, "old");
                                  const savings = taxOld - taxNew;
                                  const betterRegime = savings > 0 ? "New Regime" : "Old Regime";

                                  return (
                                    <>
                                      <div className="flex items-end justify-between">
                                        <div>
                                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Annual Tax</div>
                                          <div className="text-2xl font-black text-slate-900">{formatINR(taxRegime === "new" ? taxNew : taxOld)}</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-bold ${savings > 0 ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
                                          {betterRegime} is better
                                        </div>
                                      </div>
                                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                          Switching to the <strong>{betterRegime}</strong> could save you <strong>{formatINR(Math.abs(savings))}</strong> annually in taxes.
                                        </p>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Hidden Costs (Commute Time Tax) */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-500" /> The "Time Tax" (Commute)
                              </h4>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-600">Daily Commute</span>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="range" min="0" max="4" step="0.5"
                                      value={commuteTime}
                                      onChange={(e) => setCommuteTime(parseFloat(e.target.value))}
                                      className="w-24 accent-indigo-600"
                                    />
                                    <span className="text-xs font-black text-slate-900 w-12 text-right">{commuteTime} hrs</span>
                                  </div>
                                </div>

                                {(() => {
                                  const annualCTC = selectedOffer.offer.salaryBreakdown?.totalCTC || selectedOffer.offer.baseSalary;
                                  const hourlyRate = annualCTC / (22 * 8 * 12); // Assuming 22 days, 8 hours
                                  const monthlyTimeTax = calculateCommuteTax(hourlyRate, commuteTime);
                                  const effectiveTakeHome = (selectedOffer.offer.salaryBreakdown?.monthlyTakeHome || (annualCTC * 0.7 / 12)) - monthlyTimeTax;

                                  return (
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Time Cost</span>
                                        <span className="text-sm font-bold text-rose-600">-{formatINR(monthlyTimeTax)}</span>
                                      </div>
                                      <div className="h-px bg-slate-50" />
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Effective Monthly Value</span>
                                        <span className="text-lg font-black text-slate-900">{formatINR(effectiveTakeHome)}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                                        Your commute is equivalent to a <strong>{((monthlyTimeTax / (annualCTC / 12)) * 100).toFixed(1)}% tax</strong> on your gross monthly income.
                                      </p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          {/* Clawback Risk Warning */}
                          {selectedOffer.offer.economicAnalysis.clawbackRisk && (
                            <div className={`rounded-2xl p-6 border ${selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'high' ? 'bg-rose-50 border-rose-200' :
                                selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'medium' ? 'bg-amber-50 border-amber-200' :
                                  'bg-emerald-50 border-emerald-200'
                              }`}>
                              <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'high' ? 'bg-rose-100 text-rose-600' :
                                    selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' :
                                      'bg-emerald-100 text-emerald-600'
                                  }`}>
                                  <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h4 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'high' ? 'text-rose-900' :
                                        selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'medium' ? 'text-amber-900' :
                                          'text-emerald-900'
                                      }`}>
                                      Clawback Risk: {selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel.toUpperCase()}
                                      <InfoTooltip tooltipKey="clawbackRisk" />
                                    </h4>
                                    <p className={`text-sm mt-1 ${selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'high' ? 'text-rose-700' :
                                        selectedOffer.offer.economicAnalysis.clawbackRisk.riskLevel === 'medium' ? 'text-amber-700' :
                                          'text-emerald-700'
                                      }`}>
                                      {selectedOffer.offer.economicAnalysis.clawbackRisk.warningMessage}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedOffer.offer.economicAnalysis.clawbackRisk.exitScenarios.slice(0, 4).map((scenario, idx) => (
                                      <div key={idx} className="bg-white rounded-lg px-3 py-2 text-xs">
                                        <span className="font-bold">Month {scenario.month}:</span>{' '}
                                        <span className="text-rose-600">Owe {formatINR(scenario.owed)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="text-xs font-bold">
                                    Full freedom after: <span className="text-indigo-600">{selectedOffer.offer.economicAnalysis.clawbackRisk.freedomMonth} months</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-12 text-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                            <TrendingUp className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                            Economic analysis not available. Ensure the offer includes location and salary information.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {expandedSection === "breakdown" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => setBreakdownPeriod("annual")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${breakdownPeriod === "annual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                          >
                            Annual
                          </button>
                          <button
                            onClick={() => setBreakdownPeriod("monthly")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${breakdownPeriod === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                          >
                            Monthly
                          </button>
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-indigo-500" /> Calculated Estimate
                        </div>
                      </div>

                      {selectedOffer.offer.salaryBreakdown ? (
                        <div className="grid lg:grid-cols-2 gap-8">
                          {/* Components List */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                              <Receipt className="w-4 h-4 text-indigo-500" /> Line Items
                            </h4>
                            <div className="space-y-2">
                              {selectedOffer.offer.salaryBreakdown.components.map((comp, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${comp.type === "fixed" ? "bg-emerald-50 text-emerald-600" :
                                        comp.type === "variable" ? "bg-indigo-50 text-indigo-600" :
                                          comp.type === "deduction" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                                      }`}>
                                      {comp.type === "fixed" ? <DollarSign className="w-4 h-4" /> :
                                        comp.type === "variable" ? <TrendingUp className="w-4 h-4" /> :
                                          comp.type === "deduction" ? <Minus className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-slate-900">{comp.name}</div>
                                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                        <span className="uppercase">{comp.type}</span>
                                        {comp.isNegotiable && (
                                          <>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-indigo-500 font-bold">Negotiable</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-sm font-bold text-slate-900">
                                    {formatCurrency(breakdownPeriod === "annual" ? comp.annual : comp.monthly, selectedOffer.offer.currency)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Summary & Take-Home */}
                          <div className="space-y-6">
                            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <Wallet className="w-20 h-20" />
                              </div>
                              <div className="relative z-10 space-y-4">
                                <div>
                                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    Estimated Take-Home
                                    <InfoTooltip tooltipKey="takeHome" variant="dark" />
                                  </div>
                                  <div className="text-3xl font-black">
                                    {formatCurrency(
                                      breakdownPeriod === "annual" ? selectedOffer.offer.salaryBreakdown.annualTakeHome : selectedOffer.offer.salaryBreakdown.monthlyTakeHome,
                                      selectedOffer.offer.currency
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-1">* Post PF and estimated standard tax deductions</div>
                                </div>
                                <div className="h-px bg-slate-800" />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross CTC</div>
                                    <div className="text-base font-bold">
                                      {formatCurrency(
                                        breakdownPeriod === "annual" ? selectedOffer.offer.salaryBreakdown.totalCTC : selectedOffer.offer.salaryBreakdown.totalCTC / 12,
                                        selectedOffer.offer.currency
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                      Total Deductions
                                      <InfoTooltip tooltipKey="taxDeductions" variant="dark" />
                                    </div>
                                    <div className="text-base font-bold text-rose-400">
                                      {formatCurrency(
                                        breakdownPeriod === "annual" ? selectedOffer.offer.salaryBreakdown.taxDeductions : selectedOffer.offer.salaryBreakdown.taxDeductions / 12,
                                        selectedOffer.offer.currency
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Gavel className="w-4 h-4 text-emerald-500" /> Compliance & Safety
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { label: "Provident Fund (PF)", status: selectedOffer.offer.salaryBreakdown.complianceInfo.pfEnabled ? "Active" : "Not Found", icon: ShieldCheck },
                                  { label: "Gratuity", status: selectedOffer.offer.salaryBreakdown.complianceInfo.gratuityEnabled ? "Eligible" : "Standard Policy", icon: Award },
                                  { label: "ESI Health", status: selectedOffer.offer.salaryBreakdown.complianceInfo.esiEnabled ? "Applicable" : "Not Applicable", icon: Heart },
                                  { label: "Prof. Tax", status: formatCurrency(selectedOffer.offer.salaryBreakdown.complianceInfo.professionalTax, selectedOffer.offer.currency), icon: Receipt },
                                ].map((item, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                    <item.icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</div>
                                      <div className="text-xs font-bold text-slate-900">{item.status}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                            <Receipt className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                            No detailed CTC breakdown table detected in the document. Upload a version with the compensation annexure for a deeper analysis.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {expandedSection === "benefits" && (
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {selectedOffer.offer.benefits?.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-indigo-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                          <div className="text-[8px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5 sm:mb-1">Notice</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{selectedOffer.offer.noticePeriod || "N/A"}</div>
                        </div>
                        <div className="bg-indigo-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                          <div className="text-[8px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5 sm:mb-1">Probation</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{selectedOffer.offer.probationPeriod || "N/A"}</div>
                        </div>
                        <div className="bg-indigo-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                          <div className="text-[8px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5 sm:mb-1">PTO</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{selectedOffer.offer.pto || "Standard"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {expandedSection === "equity" && selectedOffer.offer.equity && (
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl text-white">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Total Value</div>
                          <div className="text-xl sm:text-3xl font-black">{selectedOffer.offer.equity.amount.toLocaleString()} <span className="text-sm sm:text-lg font-medium text-slate-400">{selectedOffer.offer.equity.type}s</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                            <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Vesting</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">{selectedOffer.offer.equity.vestingSchedule}</div>
                          </div>
                          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                            <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Cliff</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">{selectedOffer.offer.equity.cliffPeriod}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">Analysis</h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          The equity package follows a standard 4-year vesting cycle with a 1-year cliff. This is competitive for the current market stage of {selectedOffer.offer.company}.
                        </p>
                      </div>
                    </div>
                  )}

                  {expandedSection === "covenants" && (
                    <div className="space-y-4 sm:space-y-6">
                      {selectedOffer.offer.nonCompete ? (
                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="p-4 sm:p-6 bg-rose-50 border border-rose-100 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs sm:text-sm">
                              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Non-Compete Details
                            </div>
                            <div className="text-lg sm:text-2xl font-black text-rose-900">{selectedOffer.offer.nonCompete.duration}</div>
                            <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">{selectedOffer.offer.nonCompete.scope}</p>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Potential Concerns</h4>
                            <div className="space-y-2">
                              {selectedOffer.offer.nonCompete.concerns.map((c, i) => (
                                <div key={i} className="flex items-start gap-2 p-2.5 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold text-slate-600">
                                  <AlertTriangle className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" />
                                  {c}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 sm:py-12 text-center space-y-3 sm:space-y-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">No Restrictive Covenants Detected</h4>
                          <p className="text-slate-500 text-xs sm:text-sm">We couldn't find any aggressive non-compete clauses.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {expandedSection === "strategy" && (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" /> Strategic Levers
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {selectedOffer.negotiationPoints?.map((point, i) => (
                              <div key={i} className="group flex items-start gap-3 p-4 bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all rounded-xl sm:rounded-2xl">
                                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0">0{i + 1}</span>
                                <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" /> Actionable Scripts
                          </h4>
                          <div className="space-y-3">
                            {[
                              {
                                id: "script-base",
                                title: "Negotiating Base Salary",
                                content: `Subject: Discussion regarding Offer Letter - ${selectedOffer.offer.role}

Hi [Name],

Thank you for the offer to join ${selectedOffer.offer.company}. I'm very excited about the role and the team.

After reviewing the compensation details and comparing them with current market benchmarks for ${selectedOffer.offer.role} roles in ${selectedOffer.offer.location}, I noticed that the base salary is slightly below the 75th percentile for similar roles. Given my experience and the value I aim to bring, would there be room to adjust the base salary to [Target Amount]?

I'm committed to this role and would love to find a middle ground.`,
                              },
                              {
                                id: "script-bonus",
                                title: "Negotiating Joining Bonus",
                                content: `Subject: Regarding Joining Formalities - ${selectedOffer.offer.role}

Hi [Name],

I've reviewed the offer and am thrilled about the opportunity.

One point I'd like to discuss is the one-time joining bonus. Considering the ${selectedOffer.offer.oneTimeBenefits?.joiningBonusClawbackMonths || 12}-month clawback period and my current commitments, I was wondering if we could increase the joining bonus to [Amount] to better align with the transition costs?

Looking forward to your thoughts.`,
                              },
                              {
                                id: "script-risk",
                                title: "Address High-Risk Clause",
                                content: `Subject: Clarification on Document Clauses - ${selectedOffer.offer.role}

  Hi [Name],

  While reviewing the document, I noticed a clause regarding "${selectedRisk?.title || 'Restrictive Covenants'}".

  The current language seems a bit broad, specifically [mention clause]. To ensure a mutually beneficial partnership, would you be open to narrowing the scope to [proposed change] or adding a carve-out for [specific area]?

  I want to ensure absolute clarity as I transition into the team.`,
                              }
                            ].map((script) => (
                              <div key={script.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900">{script.title}</span>
                                  <Button
                                    onClick={() => copyToClipboard(script.content, script.id)}
                                    size="sm"
                                    variant="ghost"
                                    className={`h-7 px-2 text-[10px] font-bold uppercase tracking-widest ${copiedScript === script.id ? "text-emerald-500" : "text-indigo-600 hover:text-indigo-700"
                                      }`}
                                  >
                                    {copiedScript === script.id ? "Copied!" : "Copy Draft"}
                                  </Button>
                                </div>
                                <div className="text-[10px] text-slate-500 line-clamp-3 leading-relaxed font-mono italic">
                                  {script.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Strengths & Weaknesses Grid - Mobile Optimized */}
              <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                <div className="bg-emerald-50/50 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-emerald-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-emerald-900">Offer Strengths</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-4">
                    {selectedOffer.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-emerald-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 sm:mt-2 shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/50 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-rose-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-rose-900">Critical Concerns</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-4">
                    {selectedOffer.concerns.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-rose-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 sm:mt-2 shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar Column - Mobile Optimized */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-8">
              {/* Risks Navigator */}
              <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-2 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-white font-bold tracking-tight flex items-center gap-2 text-sm sm:text-base">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                    Risk Radar
                  </span>
                  <span className="bg-slate-800 text-slate-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                    {selectedOffer.risks.length} Detected
                  </span>
                </div>
                <div className="max-h-[240px] sm:max-h-[320px] overflow-y-auto custom-scrollbar">
                  {selectedOffer.risks.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center space-y-3 sm:space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-emerald-400">Zero Red Flags Detected</p>
                    </div>
                  ) : (
                    <div className="p-1.5 sm:p-2 space-y-1.5 sm:space-y-2">
                      {selectedOffer.risks.map((risk, index) => {
                        const config = getSeverityConfig(risk.severity);
                        const isSelected = selectedRisk?.id === risk.id;
                        return (
                          <button
                            key={risk.id || `risk-${index}`}
                            onClick={() => setSelectedRisk(risk)}
                            className={`group w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl sm:rounded-3xl text-left transition-all duration-300 ${isSelected
                                ? "bg-white text-slate-900 shadow-xl"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
                              }`}
                          >
                            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 ${config.dot} ${isSelected ? "animate-pulse" : "opacity-60"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs sm:text-sm font-bold truncate tracking-tight ${isSelected ? "text-slate-900" : ""}`}>{risk.title}</p>
                              <p className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest opacity-60">{risk.severity}</p>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isSelected ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Risk Detail Panel - Mobile Optimized */}
              {selectedRisk && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  {(() => {
                    const config = getSeverityConfig(selectedRisk.severity);
                    const Icon = config.icon;
                    return (
                      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                        <div className={`px-4 sm:px-8 py-4 sm:py-6 ${config.bg} border-b ${config.border} flex items-center justify-between`}>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${config.bg} rounded-xl sm:rounded-2xl flex items-center justify-center border ${config.border}`}>
                              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.color}`} />
                            </div>
                            <div>
                              <h4 className={`text-xs sm:text-sm font-bold ${config.color} tracking-tight`}>{selectedRisk.title}</h4>
                              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60">{selectedRisk.severity} Risk</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed italic border-l-2 border-slate-100 pl-3 sm:pl-4">
                            "{selectedRisk.description}"
                          </p>

                          {selectedRisk.clause && (
                            <div className="space-y-1.5 sm:space-y-2">
                              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Found in Clause</span>
                              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-mono text-slate-500 break-words leading-relaxed">
                                {selectedRisk.clause}
                              </div>
                            </div>
                          )}

                          <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1.5 sm:space-y-2">
                              <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Recommendation</span>
                              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{selectedRisk.suggestion}</p>
                            </div>

                            {selectedRisk.negotiationTip && (
                              <div className="p-3 sm:p-5 bg-indigo-50 rounded-xl sm:rounded-[2rem] border border-indigo-100 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:scale-125 transition-transform">
                                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" />
                                </div>
                                <div className="relative z-10 flex items-start gap-2 sm:gap-3">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest">Pro-Tip</span>
                                    <p className="text-xs sm:text-sm font-bold text-indigo-900 mt-0.5 sm:mt-1 leading-relaxed">{selectedRisk.negotiationTip}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* How Does This Compare? - User-Friendly Market Context */}
              {selectedOffer.marketComparison && (
                <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-slate-100 shadow-sm space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">How Does This Compare?</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500">vs. similar jobs in your area</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Simple Salary Position Explanation */}
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl sm:rounded-2xl border border-indigo-100/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                          Your offer pays better than
                          <InfoTooltip tooltipKey="salaryPercentile" />
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-indigo-600">{selectedOffer.marketComparison.salaryPercentile}</span>
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                        {(() => {
                          const percentile = parseInt(selectedOffer.marketComparison.salaryPercentile);
                          if (percentile >= 75) return "Great news! This salary is higher than most offers for similar roles. You're in the top 25% of earners.";
                          if (percentile >= 50) return "This is a fair offer. About half the people in similar roles earn less than this.";
                          if (percentile >= 25) return "This offer is on the lower side. Most people in similar roles earn more than this.";
                          return "This is below average. You might want to negotiate or compare with other offers.";
                        })()}
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200 relative">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000"
                          style={{ width: selectedOffer.marketComparison.salaryPercentile }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-1 text-[7px] font-bold text-slate-400">
                          <span>Low</span>
                          <span>Average</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>

                    {selectedOffer.marketComparison.benchmarks && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">What others are getting paid</span>
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${selectedOffer.marketComparison.benchmarks.confidence === 'High' ? 'bg-emerald-50 text-emerald-600' :
                              selectedOffer.marketComparison.benchmarks.confidence === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                            }`}>
                            <Info className="w-3 h-3" />
                            {selectedOffer.marketComparison.benchmarks.confidence === 'High' ? 'Reliable data' :
                              selectedOffer.marketComparison.benchmarks.confidence === 'Medium' ? 'Some data available' :
                                'Limited data'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-slate-50 p-3 rounded-xl text-center space-y-1 border border-slate-100">
                            <div className="text-[9px] font-bold text-slate-500">Entry Level</div>
                            <div className="text-xs font-black text-slate-700">{formatCurrency(selectedOffer.marketComparison.benchmarks.percentile25, selectedOffer.marketComparison.benchmarks.currency)}</div>
                            <div className="text-[8px] text-slate-400">Bottom 25%</div>
                          </div>
                          <div className="bg-indigo-50 p-3 rounded-xl text-center space-y-1 border-2 border-indigo-200 relative">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[7px] font-bold px-2 py-0.5 rounded-full">TYPICAL</div>
                            <div className="text-[9px] font-bold text-indigo-600 pt-1">Average Pay</div>
                            <div className="text-xs font-black text-indigo-700">{formatCurrency(selectedOffer.marketComparison.benchmarks.percentile50, selectedOffer.marketComparison.benchmarks.currency)}</div>
                            <div className="text-[8px] text-indigo-500">Middle 50%</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl text-center space-y-1 border border-slate-100">
                            <div className="text-[9px] font-bold text-slate-500">Top Earners</div>
                            <div className="text-xs font-black text-slate-700">{formatCurrency(selectedOffer.marketComparison.benchmarks.percentile75, selectedOffer.marketComparison.benchmarks.currency)}</div>
                            <div className="text-[8px] text-slate-400">Top 25%</div>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] sm:text-[11px] text-amber-800 leading-relaxed">
                              {selectedOffer.marketComparison.benchmarks.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-5 bg-slate-900 rounded-xl sm:rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Bottom Line</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
                        {selectedOffer.marketComparison.overallCompetitiveness}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Global Legal Disclaimer - Mobile Optimized */}
            <div className="lg:col-span-12 pt-4 sm:pt-8">
              <div className="p-4 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-[2.5rem] flex items-start gap-3 sm:gap-4 border border-slate-100">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest mb-1 sm:mb-2">Notice</h5>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                    {selectedOffer.metadata.disclaimer} Rexi uses experimental AI models which may occasionally misinterpret specific legal terminology. Please consult with a professional attorney for final document reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === "compare" && comparison ? (
          /* High-Impact Comparison View - Mobile Optimized */
          <div className="space-y-6 sm:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">The Showdown</h1>
              <p className="text-slate-500 font-medium text-sm sm:text-base">Side-by-side comparison of your offers.</p>
            </div>

            {/* Studio Perspective Switcher - Horizontal Scroll on Mobile */}
            <div className="flex justify-center overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
              <div className="inline-flex p-1.5 sm:p-2 bg-slate-100 rounded-2xl sm:rounded-3xl gap-1">
                {[
                  { id: "balanced", label: "Balanced", icon: Scale },
                  { id: "money", label: "Money", icon: DollarSign },
                  { id: "stability", label: "Stable", icon: ShieldCheck },
                  { id: "growth", label: "Growth", icon: TrendingUp },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => changePerspective(p.id as any)}
                    disabled={isComparing}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${perspective === p.id
                        ? "bg-white text-slate-900 shadow-xl scale-105"
                        : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                      } ${isComparing ? "opacity-50" : ""}`}
                  >
                    <p.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* What-If Simulator - New Section */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">"What-If" Simulator</h3>
                    <p className="text-xs text-slate-500 font-medium">Model salary negotiations and see the impact on REXI scores.</p>
                  </div>
                </div>
                <Button
                  onClick={() => setSimulatedValues({})}
                  variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest h-8"
                >
                  Reset
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
                {comparison.offers.map((offer) => {
                  const currentSim = simulatedValues[offer.offerId] || { base: offer.baseSalary, bonus: offer.bonus };
                  const basePercent = ((currentSim.base - offer.baseSalary) / offer.baseSalary) * 100;
                  const bonusPercent = offer.bonus > 0 ? ((currentSim.bonus - offer.bonus) / offer.bonus) * 100 : 0;

                  return (
                    <div key={offer.offerId} className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">{offer.company}</span>
                        <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-50">
                          {Math.round(offer.overallScore + (basePercent * 0.5) + (bonusPercent * 0.1))}% Score
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Base Salary</span>
                            <span className={basePercent > 0 ? "text-emerald-500" : basePercent < 0 ? "text-rose-500" : ""}>
                              {basePercent > 0 ? "+" : ""}{basePercent.toFixed(0)}%
                            </span>
                          </div>
                          <input
                            type="range" min={offer.baseSalary * 0.8} max={offer.baseSalary * 1.5} step={50000}
                            value={currentSim.base}
                            onChange={(e) => updateSimulation(offer.offerId, 'base', parseInt(e.target.value))}
                            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                          />
                          <div className="text-xs font-black text-slate-700">{formatCurrency(currentSim.base, "INR")}</div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Annual Bonus</span>
                            <span className={bonusPercent > 0 ? "text-emerald-500" : bonusPercent < 0 ? "text-rose-500" : ""}>
                              {bonusPercent > 0 ? "+" : ""}{bonusPercent.toFixed(0)}%
                            </span>
                          </div>
                          <input
                            type="range" min={0} max={offer.baseSalary * 0.5} step={25000}
                            value={currentSim.bonus}
                            onChange={(e) => updateSimulation(offer.offerId, 'bonus', parseInt(e.target.value))}
                            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                          />
                          <div className="text-xs font-black text-slate-700">{formatCurrency(currentSim.bonus, "INR")}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REXI'S CHOICE CARD */}
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
              {(() => {
                const winnerId = comparison.recommendation.bestOverall;
                const winnerOffer = offers.find(o => o.offer.id === winnerId);
                const reason = perspective === "money" ? "Highest financial return over 2 years." :
                  perspective === "stability" ? "Lowest risk profile and best job security." :
                    perspective === "growth" ? "Superior equity upside and role trajectory." :
                      "Best balance of compensation, risks, and quality of life.";

                return (
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-white/10 group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                      <Sparkles className="w-24 h-24 text-indigo-400" />
                    </div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
                          REXI's Choice
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter">
                          Take <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">{winnerOffer?.offer.company || "Company A"}</span>
                        </h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          {reason} Based on your **{perspective}** preference, this offer outperforms the others by {Math.round(comparison.offers.find(o => o.offerId === winnerId)?.overallScore || 0) - Math.round(Math.min(...comparison.offers.map(o => o.overallScore)))} points.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <Button
                            onClick={() => { setSelectedOffer(winnerOffer || null); setViewMode("single"); }}
                            className="bg-white text-slate-900 hover:bg-indigo-50 h-12 px-8 rounded-2xl font-bold transition-all"
                          >
                            View Plan
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Score</div>
                          <div className="text-2xl font-black text-indigo-400">{Math.round(comparison.offers.find(o => o.offerId === winnerId)?.overallScore || 0)}/100</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Real Value</div>
                          <div className="text-sm font-bold truncate">{formatINR(winnerOffer?.offer.economicAnalysis?.year1EffectiveCTC || 0)}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Risk Level</div>
                          <div className="text-sm font-bold text-emerald-400 capitalize">{winnerOffer?.offer.economicAnalysis?.clawbackRisk?.riskLevel || 'Low'}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Livability</div>
                          <div className="text-sm font-bold">{winnerOffer?.offer.economicAnalysis?.livabilityGrade || 'Comfortable'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Winner Spotlight - 2x2 Grid on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { label: "Best Overall", offerId: comparison.recommendation.bestOverall, icon: Award, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                { label: "Max Comp", offerId: comparison.recommendation.bestCompensation, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                { label: "Best WLB", offerId: comparison.recommendation.bestWorkLife, icon: Heart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                { label: "Safest", offerId: comparison.recommendation.lowestRisk, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
              ].map((item, i) => (
                <div key={i} className="group relative bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${item.bg} ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 border ${item.border} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2">{item.label}</div>
                  <div className="text-sm sm:text-2xl font-black text-slate-900 truncate">
                    {getCompanyFromOfferId(item.offerId)}
                  </div>
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-slate-200 group-hover:text-indigo-500 transition-colors">
                    <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Grid - Mobile Optimized with Horizontal Scroll */}
            <div className="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[500px]">
                  <thead>
                    <tr>
                      <th className="px-4 sm:px-8 py-6 sm:py-10 text-left bg-white sticky left-0 z-20 border-r border-slate-100">
                        <div className="text-lg sm:text-3xl font-black text-slate-900 tracking-tighter">Categories</div>
                        <div className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest hidden sm:block">Weighted Criteria</div>
                      </th>
                      {comparison.offers.map((offer, idx) => (
                        <th key={offer.offerId} className="px-4 sm:px-8 py-6 sm:py-10 text-left border-l border-slate-100 min-w-[180px] sm:min-w-[200px] bg-white">
                          <div className="flex flex-col gap-2 sm:gap-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-900 text-white rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-black flex items-center justify-center shrink-0">0{idx + 1}</span>
                              <span className="text-sm sm:text-xl font-bold text-slate-900 tracking-tight truncate">{offer.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${getScoreBg(offer.overallScore)} text-white`}>
                                {Math.round(offer.overallScore)}%
                              </span>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {comparison.comparisonMatrix.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm font-bold text-slate-900 bg-white group-hover:bg-slate-50 transition-colors sticky left-0 z-10 border-r border-slate-100">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300 shrink-0" />
                            <span>{row.category}</span>
                          </div>
                        </td>
                        {row.values.map((val, j) => (
                          <td key={j} className="px-4 sm:px-8 py-4 sm:py-6 border-l border-slate-50">
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                              <span className={`text-xs sm:text-sm font-semibold ${val.winner ? "text-indigo-600 font-bold" : "text-slate-500"}`}>
                                {val.value}
                              </span>
                              {val.winner && (
                                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-indigo-50 border border-indigo-100 shrink-0">
                                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-500" />
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-slate-900 text-white">
                      <td className="px-4 sm:px-8 py-6 sm:py-10 font-black text-sm sm:text-xl tracking-tighter sticky left-0 z-10 bg-slate-900">Verdict</td>
                      {comparison.offers.map((offer) => (
                        <td key={offer.offerId} className="px-4 sm:px-8 py-6 sm:py-10 border-l border-slate-800">
                          <div className="space-y-2 sm:space-y-4">
                            <div className="flex items-end justify-between">
                              <span className="text-2xl sm:text-4xl font-black">{Math.round(offer.overallScore)}<span className="text-sm sm:text-xl text-slate-500 ml-0.5 sm:ml-1">/100</span></span>
                            </div>
                            <div className="h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreBg(offer.overallScore)}`}
                                style={{ width: `${offer.overallScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Report - Mobile Optimized */}
            <div className="grid lg:grid-cols-12 gap-4 sm:gap-8 items-start">
              <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-10 border border-slate-100 shadow-sm space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  Studio Narrative
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tighter leading-tight">Summary</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-xs sm:text-base">
                  {comparison.summary}
                </p>
                <div className="pt-4 sm:pt-6 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 text-emerald-700 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold border border-emerald-100">
                    <DollarSign className="w-3 h-3" /> Max Value: {getCompanyFromOfferId(comparison.recommendation.bestCompensation)}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-50 text-rose-700 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold border border-rose-100">
                    <ShieldCheck className="w-3 h-3" /> Low Risk: {getCompanyFromOfferId(comparison.recommendation.lowestRisk)}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-50 rounded-2xl sm:rounded-[3rem] p-5 sm:p-10 border border-slate-100 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-8">
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" /> Score Breakdown
                  </h3>
                  <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Per weighted rubric</div>
                </div>
                <div className="max-h-[300px] sm:max-h-[500px] overflow-y-auto pr-4 sm:pr-6 custom-scrollbar">
                  <SimpleMarkdown content={comparison.detailedAnalysis} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Global Status Bar - Mobile Optimized (Simpler on mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 z-[60] p-2 sm:p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-3 sm:gap-8 pointer-events-auto">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">Ready</span>
            </div>
            <div className="h-3 sm:h-4 w-px bg-slate-700 hidden sm:block" />
            <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              Gemini 2.0 <span className="text-indigo-400 ml-1">On</span>
            </div>
            <div className="h-3 sm:h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center">
                  <Lock className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center">
                  <Shield className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
