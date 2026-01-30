"use client";

import { useState } from "react";
import {
  Share2,
  Download,
  MessageCircle,
  Mail,
  Send,
  Copy,
  Check,
  FileDown,
  Printer,
  X,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ContractAnalysisResult } from "@/lib/types/contract-analysis";
import {
  openPDFReport,
  downloadHTMLReport,
  shareViaWhatsApp,
  shareViaEmail,
  shareViaTelegram,
  copyShareText,
  nativeShare,
  isNativeShareSupported,
} from "@/lib/report-generator";
import { ShareableLinkButton } from "@/components/shareable-link-button";

interface ShareReportButtonProps {
  analysis: ContractAnalysisResult;
  variant?: "default" | "compact";
}

export function ShareReportButton({ analysis, variant = "default" }: ShareReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setShareNotice(message);
    setTimeout(() => setShareNotice(null), 4000);
  };

  const handleCopy = async () => {
    const success = await copyShareText(analysis);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const success = await nativeShare(analysis);
    if (success) {
      setIsOpen(false);
    }
  };

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      openPDFReport(analysis);
      setIsGenerating(false);
    }, 100);
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      downloadHTMLReport(analysis);
      setIsGenerating(false);
    }, 100);
  };

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      onClick: async () => {
        setIsGenerating(true);
        const result = await shareViaWhatsApp(analysis);
        setIsGenerating(false);
        if (result.success && !result.fileShared) {
          showNotice("📱 To share the PDF, use this on your mobile device or use 'Print / Save PDF' to get the file first.");
        }
      },
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: Send,
      color: "text-blue-500",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      onClick: async () => {
        setIsGenerating(true);
        const result = await shareViaTelegram(analysis);
        setIsGenerating(false);
        if (result.success && !result.fileShared) {
          showNotice("📱 To share the PDF, use this on your mobile device or use 'Print / Save PDF' to get the file first.");
        }
      },
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      color: "text-slate-600",
      bgColor: "bg-slate-100 hover:bg-slate-200",
      onClick: () => shareViaEmail(analysis),
    },
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy Summary",
      icon: copied ? Check : Copy,
      color: copied ? "text-emerald-600" : "text-slate-600",
      bgColor: copied ? "bg-emerald-50" : "bg-slate-100 hover:bg-slate-200",
      onClick: handleCopy,
    },
  ];

  const downloadOptions = [
    {
      id: "print",
      label: "Print / Save as PDF",
      description: "Open print dialog to save as PDF",
      icon: Printer,
      onClick: handlePrint,
    },
    {
      id: "download",
      label: "Download Report",
      description: "Download as HTML file",
      icon: FileDown,
      onClick: handleDownload,
    },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === "compact" ? (
          <button
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 text-indigo-600 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-indigo-100 transition-all"
            title="Share Report"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        ) : (
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
          >
            <Share2 className="w-4 h-4" />
            Share Report
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-72 sm:w-80 p-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm">Share Report</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Share via Apps */}
        <div className="p-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Share Summary
          </p>

          {/* Notice for desktop users */}
          {shareNotice && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800">{shareNotice}</p>
            </div>
          )}

          {/* Native Share Button (Mobile) */}
          {isNativeShareSupported() && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 p-3 mb-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-indigo-700 text-sm">Share via...</p>
                <p className="text-xs text-indigo-500">Use system share menu</p>
              </div>
            </button>
          )}

          <div className="grid grid-cols-4 gap-2">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${option.bgColor}`}
              >
                <option.icon className={`w-5 h-5 ${option.color}`} />
                <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Shareable Link Section */}
        <div className="p-3 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Shareable Link
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-700 text-sm">Get a link to share</p>
                <p className="text-[11px] text-indigo-500">Anyone with the link can view</p>
              </div>
              <ShareableLinkButton
                reportType="contract"
                reportData={analysis}
                variant="compact"
              />
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Download Report
          </p>
          <div className="space-y-2">
            {downloadOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                disabled={isGenerating}
                className="w-full flex items-center gap-3 p-3 bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                  <option.icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{option.label}</p>
                  <p className="text-[11px] text-slate-500">{option.description}</p>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
          <p className="text-[10px] text-amber-700 leading-relaxed">
            💡 <strong>Tip:</strong> Use "Print / Save as PDF" for the best quality PDF report that you can share with others.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
