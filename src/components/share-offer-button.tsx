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
import type { OfferAnalysisResponse } from "@/lib/types/offer-analysis";
import {
  openOfferPDFReport,
  downloadOfferHTMLReport,
  shareOfferViaWhatsApp,
  shareOfferViaEmail,
  shareOfferViaTelegram,
  copyOfferShareText,
  nativeShareOffer,
  isNativeShareSupported,
} from "@/lib/offer-report-generator";
import { ShareableLinkButton } from "@/components/shareable-link-button";

interface ShareOfferButtonProps {
  analysis: OfferAnalysisResponse;
  variant?: "default" | "compact";
}

export function ShareOfferButton({ analysis, variant = "default" }: ShareOfferButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setShareNotice(message);
    setTimeout(() => setShareNotice(null), 4000);
  };

  const handleCopy = async () => {
    const success = await copyOfferShareText(analysis);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const success = await nativeShareOffer(analysis);
    if (success) {
      setIsOpen(false);
    }
  };

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      openOfferPDFReport(analysis);
      setIsGenerating(false);
    }, 100);
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      downloadOfferHTMLReport(analysis);
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
        const result = await shareOfferViaWhatsApp(analysis);
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
        const result = await shareOfferViaTelegram(analysis);
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
      onClick: () => shareOfferViaEmail(analysis),
    },
  ];

  if (variant === "compact") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Share Report</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Notice for desktop users */}
            {shareNotice && (
              <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[10px] text-amber-800">{shareNotice}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${option.bgColor}`}
                >
                  <option.icon className={`h-5 w-5 ${option.color}`} />
                  <span className="text-[10px] text-slate-600">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t pt-2 mt-2 space-y-1">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-slate-100 transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-500" />
                )}
                <span>{copied ? "Copied!" : "Copy Summary"}</span>
              </button>

              {/* Shareable Link in compact view */}
              <div className="p-2 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-700">Get shareable link</span>
                  <ShareableLinkButton
                    reportType="offer"
                    reportData={analysis}
                    variant="compact"
                  />
                </div>
              </div>

              <button
                onClick={handlePrint}
                disabled={isGenerating}
                className="w-full flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <Printer className="h-4 w-4 text-slate-500" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <FileDown className="h-4 w-4 text-slate-500" />
                <span>Download HTML</span>
              </button>
            </div>

            {isNativeShareSupported() && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>More Options</span>
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span>Share Report</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">Share Offer Analysis</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {analysis.offer.company} - {analysis.offer.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Share via Apps */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">SHARE VIA</p>

            {/* Notice for desktop users */}
            {shareNotice && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">{shareNotice}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${option.bgColor} border border-transparent hover:border-slate-200`}
                >
                  <option.icon className={`h-6 w-6 ${option.color}`} />
                  <span className="text-xs font-medium text-slate-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shareable Link Section */}
          <div className="border-t pt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">SHAREABLE LINK</p>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-indigo-700 text-sm">Get a link to share</p>
                  <p className="text-[11px] text-indigo-500">Anyone with the link can view</p>
                </div>
                <ShareableLinkButton
                  reportType="offer"
                  reportData={analysis}
                  variant="compact"
                />
              </div>
            </div>
          </div>

          {/* Download/Export Options */}
          <div className="border-t pt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">EXPORT OPTIONS</p>
            <div className="space-y-2">
              <button
                onClick={handlePrint}
                disabled={isGenerating}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Printer className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">Print / Save as PDF</p>
                  <p className="text-xs text-slate-500">Open print dialog to save PDF</p>
                </div>
              </button>

              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FileDown className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">Download Report</p>
                  <p className="text-xs text-slate-500">Save as HTML file</p>
                </div>
              </button>

              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-600" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">
                    {copied ? "Copied!" : "Copy Summary"}
                  </p>
                  <p className="text-xs text-slate-500">Copy text summary to clipboard</p>
                </div>
              </button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {isNativeShareSupported() && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              <Share2 className="h-4 w-4" />
              <span>More Sharing Options</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
