"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
  Zap,
  Plus,
  CheckCircle2,
  Sparkles,
  Gavel,
  BookOpen,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertOctagon,
  FileSearch,
  Layers,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareReportButton } from "@/components/share-report-button";
import type { ContractAnalysisResult, ContractClause, LegalCitation } from "@/lib/types/contract-analysis";

type ViewMode = "upload" | "workspace";
type MobileTab = "document" | "analysis";

export default function AnalyzePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("upload");
  const [analysis, setAnalysis] = useState<ContractAnalysisResult | null>(null);
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(55);
  const [isResizing, setIsResizing] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("document");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const filteredClauses = useMemo(() => {
    if (!analysis) return [];
    if (!filterSeverity) return analysis.clauses;
    return analysis.clauses.filter(c => c.severity === filterSeverity);
  }, [analysis, filterSeverity]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    try {
      let extractedText = "";
      const isBinaryFile = file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".docx");

      if (isBinaryFile) {
        const formData = new FormData();
        formData.append("file", file);
        let response;
        try {
          response = await fetch("/api/parse-file", { method: "POST", body: formData });
        } catch (networkError) {
          throw new Error("Network error: Please check your internet connection and try again.");
        }
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to parse file (Status: ${response.status})`);
        }
        const data = await response.json();
        extractedText = data.text || "";
      } else {
        extractedText = await file.text();
      }

      if (!extractedText.trim()) throw new Error("Could not extract text from file");

      let analyzeResponse;
      try {
        analyzeResponse = await fetch("/api/analyze-contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: extractedText, fileName: file.name }),
        });
      } catch (networkError) {
        throw new Error("Network error: Please check your internet connection and try again.");
      }

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to analyze document (Status: ${analyzeResponse.status})`);
      }

      const result: ContractAnalysisResult = await analyzeResponse.json();
      setAnalysis(result);
      if (result.clauses.length > 0) {
        setSelectedClause(result.clauses[0]);
      }
      setViewMode("workspace");

      fetch("/api/store-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "analyze",
          rawText: extractedText,
          analysisResult: result,
          fileName: file.name,
          documentType: result.summary?.type || "unknown",
          metadata: { fileSize: file.size, fileType: file.type },
        }),
      }).catch(console.error);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Failed to process document");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

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

  const scrollToClause = useCallback((clause: ContractClause) => {
    setSelectedClause(clause);
    setMobileTab("analysis"); // Switch to analysis tab on mobile when selecting a clause
    if (documentRef.current && analysis) {
      const highlightEl = documentRef.current.querySelector(`[data-clause-id="${clause.id}"]`);
      if (highlightEl) {
        highlightEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [analysis]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const container = document.getElementById('split-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setLeftPanelWidth(Math.min(Math.max(30, newWidth), 70));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical": return { icon: AlertOctagon, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500", highlight: "bg-rose-100/80 border-rose-300" };
      case "high": return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500", highlight: "bg-orange-100/80 border-orange-300" };
      case "medium": return { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", highlight: "bg-amber-100/80 border-amber-300" };
      case "low": return { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400", highlight: "bg-blue-100/80 border-blue-300" };
      case "safe": return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", highlight: "bg-emerald-100/80 border-emerald-300" };
      default: return { icon: Info, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400", highlight: "bg-slate-100/80 border-slate-300" };
    }
  };

  const getImplicationConfig = (implication: LegalCitation["implication"]) => {
    switch (implication) {
      case "violation": return { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" };
      case "concern": return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
      case "protection": return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
      case "standard": return { color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" };
      default: return { color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" };
    }
  };

  const renderHighlightedDocument = () => {
    if (!analysis) return null;

    const text = analysis.rawText;
    if (!showHighlights) {
      return <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed text-slate-700">{text}</div>;
    }

    const sortedClauses = [...analysis.clauses].sort((a, b) => a.startIndex - b.startIndex);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedClauses.forEach((clause) => {
      if (clause.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`} className="text-slate-600">
            {text.slice(lastIndex, clause.startIndex)}
          </span>
        );
      }

      const config = getSeverityConfig(clause.severity);
      const isSelected = selectedClause?.id === clause.id;

      elements.push(
        <span
          key={clause.id}
          data-clause-id={clause.id}
          onClick={() => scrollToClause(clause)}
          className={`inline cursor-pointer rounded px-0.5 transition-all duration-200 border-b-2 ${isSelected
              ? `${config.highlight} ring-2 ring-offset-1 ring-indigo-400 border-indigo-500`
              : `hover:${config.bg} border-transparent hover:border-current ${config.color}`
            }`}
          title={clause.title}
        >
          {clause.text}
        </span>
      );

      lastIndex = clause.endIndex;
    });

    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lastIndex}`} className="text-slate-600">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">{elements}</div>;
  };

  // Mobile Analysis Panel Content
  const renderAnalysisContent = () => (
    <div className="space-y-4">
      {!selectedClause ? (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100">
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Pick a Clause to Review</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs">Tap highlighted text in the contract or choose from the list below</p>
          </div>

          <div className="mt-4 sm:mt-6 space-y-2">
            {filteredClauses.map((clause) => {
              const config = getSeverityConfig(clause.severity);
              return (
                <button
                  key={clause.id}
                  onClick={() => scrollToClause(clause)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 truncate flex-1">{clause.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className={`rounded-2xl p-4 sm:p-5 border ${getSeverityConfig(selectedClause.severity).border} ${getSeverityConfig(selectedClause.severity).bg}`}>
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                {(() => {
                  const config = getSeverityConfig(selectedClause.severity);
                  const Icon = config.icon;
                  return (
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${config.bg} border ${config.border}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.color}`} />
                    </div>
                  );
                })()}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{selectedClause.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${getSeverityConfig(selectedClause.severity).color}`}>
                      {selectedClause.severity} Risk
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 capitalize">{selectedClause.category}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(selectedClause.text, selectedClause.id)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/50 transition-colors shrink-0"
                title="Copy clause text"
              >
                {copiedText === selectedClause.id ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

            <div className="bg-white/60 rounded-xl p-3 sm:p-4 border border-white">
              <p className="text-xs sm:text-sm text-slate-700 font-mono leading-relaxed">"{selectedClause.text}"</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100">
            <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">In Simple Words</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedClause.aiAnalysis}</p>
          </div>

          {selectedClause.legalCitations.length > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Legal Citations
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {selectedClause.legalCitations.map((citation, i) => {
                  const implConfig = getImplicationConfig(citation.implication);
                  return (
                    <div key={i} className={`p-3 sm:p-4 rounded-xl border ${implConfig.border} ${implConfig.bg}`}>
                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Gavel className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${implConfig.color}`} />
                          <span className={`text-xs sm:text-sm font-bold ${implConfig.color}`}>{citation.lawName}</span>
                        </div>
                        <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full ${implConfig.bg} ${implConfig.color} border ${implConfig.border}`}>
                          {citation.implication}
                        </span>
                      </div>
                      {citation.section && (
                        <p className="text-[10px] sm:text-xs text-slate-600 font-medium mb-2">{citation.section}</p>
                      )}
                      <p className="text-xs sm:text-sm text-slate-600">{citation.relevance}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedClause.suggestion && (
            <div className="bg-indigo-50 rounded-2xl p-4 sm:p-5 border border-indigo-100">
              <h4 className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Suggested Fix
              </h4>
              <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">{selectedClause.suggestion}</p>
            </div>
          )}

          {selectedClause.negotiationTip && (
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Negotiation Script
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">"{selectedClause.negotiationTip}"</p>
              <button
                onClick={() => copyToClipboard(selectedClause.negotiationTip!, `script-${selectedClause.id}`)}
                className="mt-2 sm:mt-3 flex items-center gap-2 text-[10px] sm:text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {copiedText === `script-${selectedClause.id}` ? (
                  <>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Copy Script
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {filteredClauses.map((clause, index) => {
              const config = getSeverityConfig(clause.severity);
              const isSelected = clause.id === selectedClause.id;
              return (
                <button
                  key={clause.id}
                  onClick={() => scrollToClause(clause)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all ${isSelected
                      ? `${config.bg} ${config.color} ring-2 ring-offset-1 ring-current`
                      : "bg-white border border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  title={clause.title}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </>
      )}

      {analysis && (
        <>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 mt-4 sm:mt-6">
            <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">Document Summary</h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Type</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">{analysis.summary.type}</div>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Parties</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">{analysis.summary.parties.length || "N/A"}</div>
              </div>
              {analysis.summary.duration && (
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">{analysis.summary.duration}</div>
                </div>
              )}
              {analysis.summary.totalValue && (
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Value</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">{analysis.summary.totalValue}</div>
                </div>
              )}
            </div>
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-slate-50 rounded-xl">
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-2">Assessment</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{analysis.summary.overallAssessment}</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-slate-100 rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed">{analysis.metadata.disclaimer}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="fixed top-0 left-0 right-0 z-[60] px-3 sm:px-4 pt-2 sm:pt-3 pointer-events-none">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 tracking-tight text-sm sm:text-base">REXI <span className="text-indigo-500">STUDIO</span></span>
            </Link>
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Home
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] uppercase tracking-wider font-bold hidden sm:inline">End-to-End Encrypted</span>
              <Lock className="w-3 h-3 text-emerald-500 sm:hidden" />
            </div>
          </div>
        </div>
      </nav>

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />

      <main className="pt-16 sm:pt-20 pb-8">
        {viewMode === "upload" && !isAnalyzing ? (
          <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-16">
            <div className="text-center mb-10 sm:mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
                <FileSearch className="w-3.5 h-3.5" /> Legal Review
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Read documents like <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">a lawyer would.</span>
              </h1>
              <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
                Upload any legal document. We'll highlight every clause, cite relevant laws, and give you negotiation scripts.
              </p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`group relative rounded-2xl sm:rounded-[2rem] p-1 transition-all duration-500 ${isDragging ? "bg-gradient-to-r from-indigo-500 to-violet-500 scale-[1.02]" : "bg-slate-200/60 hover:bg-slate-200"
                }`}
            >
              <div className="bg-white rounded-xl sm:rounded-[1.85rem] p-8 sm:p-16 border border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner border border-slate-100">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Drop your document</h3>
                    <p className="text-slate-400 mt-2 text-sm">Agreements, NDAs, Leases, Insurance Policies, Offer Letters</p>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:translate-y-[-2px] transition-all active:scale-95"
                    >
                      Browse Files
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-6 pt-6 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 flex-wrap">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-emerald-500" /> Private
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block" />
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> ~30 seconds
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block" />
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Gavel className="w-3.5 h-3.5 text-indigo-500" /> Legal Citations
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Analyzing a job offer letter?{" "}
                <Link href="/offers" className="text-indigo-600 font-semibold hover:text-indigo-700 underline underline-offset-2">
                  Use Offer Studio
                </Link>
                {" "}for salary breakdowns and tax insights.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {[
                { icon: Layers, title: "Clause-by-Clause", desc: "Every significant term highlighted and explained" },
                { icon: BookOpen, title: "Legal Citations", desc: "Indian Contract Act, Consumer Protection Act references" },
                { icon: MessageSquare, title: "Negotiation Scripts", desc: "Ready-to-use scripts to push back on bad terms" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="max-w-md mx-auto text-center py-32 space-y-8 px-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center shadow-xl">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">Analyzing Document</h2>
              <p className="text-slate-500 text-sm">Parsing clauses, checking Indian laws, and identifying risks...</p>
            </div>
          </div>
        ) : viewMode === "workspace" && analysis ? (
          <div className="h-[calc(100vh-5rem)] flex flex-col">
            {/* Header Bar */}
            <div className="bg-white border-b border-slate-100 px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-bold text-slate-900 truncate text-sm sm:text-base">{analysis.fileName}</h1>
                    <p className="text-[10px] sm:text-xs text-slate-500">{analysis.summary.type} • {analysis.clauses.length} clauses analyzed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 rounded-lg sm:rounded-xl">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 hidden sm:inline">Score:</span>
                    <span className={`text-xs sm:text-sm font-black ${analysis.overallScore >= 70 ? "text-emerald-600" :
                        analysis.overallScore >= 50 ? "text-amber-600" : "text-rose-600"
                      }`}>{analysis.overallScore}/100</span>
                  </div>

                  <button
                    onClick={() => setShowHighlights(!showHighlights)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${showHighlights ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-500"
                      }`}
                  >
                    {showHighlights ? <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    <span className="hidden sm:inline">Highlights</span>
                  </button>

                  <ShareReportButton analysis={analysis} variant="compact" />

                  <button
                    onClick={() => { setAnalysis(null); setSelectedClause(null); setViewMode("upload"); }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-900 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-slate-800 transition-all"
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">New</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-2">
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setMobileTab("document")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${mobileTab === "document"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  Contract
                </button>
                <button
                  onClick={() => setMobileTab("analysis")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${mobileTab === "analysis"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  <Gavel className="w-4 h-4" />
                  Legal Review
                  {selectedClause && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* Desktop: Split Pane / Mobile: Single View */}
            <div id="split-container" className="flex-1 flex overflow-hidden">
              {/* Document Panel */}
              <div
                style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${leftPanelWidth}%` : '100%' }}
                className={`flex-col border-r border-slate-100 bg-white ${mobileTab === "document" ? "flex" : "hidden lg:flex"
                  } lg:!w-auto`}
              >
                <div className="p-3 sm:p-4 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" /> Document
                    </h2>
                    <div className="flex items-center gap-1">
                      {["critical", "high", "medium", "low", "safe"].map((sev) => {
                        const config = getSeverityConfig(sev);
                        const count = analysis.clauses.filter(c => c.severity === sev).length;
                        if (count === 0) return null;
                        return (
                          <button
                            key={sev}
                            onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold uppercase transition-all ${filterSeverity === sev
                                ? `${config.bg} ${config.color} ring-1 ring-current`
                                : "bg-white text-slate-400 hover:bg-slate-100"
                              }`}
                          >
                            {count}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400">Click highlighted text to see analysis</p>
                </div>

                <div ref={documentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                  {renderHighlightedDocument()}
                </div>
              </div>

              {/* Resizer - Desktop only */}
              <div
                className="hidden lg:flex w-1 bg-slate-100 hover:bg-indigo-200 cursor-col-resize transition-colors items-center justify-center group"
                onMouseDown={() => setIsResizing(true)}
              >
                <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-indigo-400 rounded-full transition-colors" />
              </div>

              {/* Analysis Panel */}
              <div
                style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - leftPanelWidth}%` : '100%' }}
                className={`flex-col bg-slate-50/50 ${mobileTab === "analysis" ? "flex" : "hidden lg:flex"
                  } lg:!w-auto`}
              >
                <div className="p-3 sm:p-4 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Gavel className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900">Legal Review</h2>
                      <p className="text-[9px] sm:text-[10px] text-slate-400">{selectedClause ? "Clause breakdown" : "Select a clause to review"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
                  {renderAnalysisContent()}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
      `}</style>
    </div>
  );
}
