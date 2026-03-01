"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Briefcase, ShieldCheck, HeartPulse, X, ArrowRight, Loader2, type LucideIcon } from "lucide-react";
import { LeadCaptureModal, shouldShowLeadCapture } from "@/components/ui/LeadCaptureModal";

interface StudioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StudioCardProps {
  id: string;
  path: string;
  context: string;
  title: string;
  description: string;
  tags: [string, string];
  icon: LucideIcon;
  theme: "indigo" | "blue" | "purple" | "emerald";
  loadingOption: string | null;
  hoveredOption: string | null;
  onSelect: (path: string, context: string) => void;
  onHover: (id: string | null) => void;
}

function StudioCard({
  id,
  path,
  context,
  title,
  description,
  tags,
  icon: Icon,
  theme,
  loadingOption,
  hoveredOption,
  onSelect,
  onHover,
}: StudioCardProps) {
  const isPending = loadingOption === id;
  const isHovered = hoveredOption === id;
  const isActive = isPending || isHovered;
  const isDisabled = !!loadingOption;

  const themeColors = {
    indigo: "text-indigo-200",
    blue: "text-blue-200",
    purple: "text-purple-200",
    emerald: "text-emerald-200",
  };

  return (
    <button
      onClick={() => onSelect(path, context)}
      onMouseEnter={() => !isDisabled && onHover(id)}
      onFocus={() => !isDisabled && onHover(id)}
      onMouseLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      disabled={isDisabled}
      aria-busy={isPending}
      className={`group relative p-6 rounded-[2rem] border transition-all duration-500 text-left flex flex-col h-full disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${isActive
        ? "bg-slate-950 border-slate-900 shadow-2xl -translate-y-2"
        : loadingOption
          ? "opacity-40 scale-[0.98]"
          : "bg-white/60 border-white/40 hover:bg-white/80"
        }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${isActive ? "bg-white text-slate-950 rotate-6" : "bg-slate-950 text-white"
          }`}
      >
        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
      </div>

      <div className="flex-1">
        <h3
          className={`text-lg font-serif font-bold mb-2 transition-colors ${isActive ? "text-white" : "text-slate-950"
            }`}
        >
          {title}
        </h3>
        <p
          className={`text-xs font-medium leading-relaxed mb-4 transition-colors ${isActive ? "text-slate-400" : "text-slate-500"
            }`}
        >
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border transition-colors ${isActive
              ? `bg-white/10 border-white/20 ${themeColors[theme]}`
              : "bg-slate-100 border-slate-200 text-slate-500"
              }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className={`mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isPending
          ? "text-white"
          : isHovered
            ? "text-white translate-x-1"
            : "text-slate-400 opacity-60"
          }`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Entering Studio...
          </>
        ) : (
          <>
            Enter Studio <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </div>
    </button>
  );
}

export function StudioSelector({ isOpen, onClose }: StudioSelectorProps) {
  const router = useRouter();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility & Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      // Focus close button on mount
      setTimeout(() => closeBtnRef.current?.focus(), 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !loadingOption) onClose();
      };

      // Basic focus trap
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === "Tab" && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener("keydown", handleEscape);
      window.addEventListener("keydown", handleTab);
      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleEscape);
        window.removeEventListener("keydown", handleTab);
      };
    }
  }, [isOpen, onClose, loadingOption]);

  if (!isOpen) return null;

  const handleSelect = (path: string, contextKey: string) => {
    if (loadingOption) return; // Prevent double-clicks

    if (shouldShowLeadCapture()) {
      setPendingPath(`${path}?ctx=${contextKey}`);
    } else {
      // Show loading state immediately — keep modal open for visual continuity
      setLoadingOption(contextKey);
      startTransition(() => {
        router.push(path);
      });
      // Close modal after a short delay so the user sees the loading feedback
      setTimeout(() => {
        onClose();
        setLoadingOption(null);
      }, 600);
    }
  };

  const handleLeadContinue = () => {
    if (!pendingPath) return;
    const cleanPath = pendingPath.split("?")[0];
    setPendingPath(null);
    router.push(cleanPath);
    onClose();
  };

  const handleLeadClose = () => {
    setPendingPath(null);
  };

  return (
    <>
      {/* Lead Capture Modal — shown before navigating */}
      {pendingPath && (
        <LeadCaptureModal
          sourceContext={pendingPath.split("ctx=")[1] ?? "studio-selector"}
          onContinue={handleLeadContinue}
          onClose={handleLeadClose}
        />
      )}

      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        ref={modalRef}
      >
        {/* Premium Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-700"
          onClick={loadingOption ? undefined : onClose}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-4xl glass-panel-heavy squircle-soft shadow-dreamy max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border-white/60">
          {/* Decorative Mesh Background */}
          <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />

          {/* Mobile Handle */}
          <div className="h-1.5 w-12 bg-slate-200/50 rounded-full mx-auto mt-4 mb-2 sm:hidden relative z-20" aria-hidden="true" />

          <button
            ref={closeBtnRef}
            onClick={onClose}
            disabled={!!loadingOption}
            aria-label="Close studio selector"
            className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-950 transition-all rounded-2xl hover:bg-white/80 hover:shadow-sm z-30 group focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="p-8 md:p-10 text-center shrink-0 relative z-20">
            <h2 id="modal-title" className="text-2xl md:text-4xl font-serif font-bold text-slate-950 mb-3 tracking-tight">
              Select Your <span className="italic">Analysis Studio</span>
            </h2>
            <p id="modal-desc" className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
              Rexi uses specialized AI models for document types to provide maximum accuracy.
            </p>
          </div>

          <div className="px-8 md:px-14 pb-10 overflow-y-auto flex-1 custom-scrollbar relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StudioCard
                id="job-offer"
                path="/offers"
                context="job-offer"
                title="Employment Offer"
                description="Analyze salary, benefits, and hidden clauses in your job offer."
                tags={["Salary Analysis", "Tax Insights"]}
                icon={Briefcase}
                theme="indigo"
                loadingOption={loadingOption}
                hoveredOption={hoveredOption}
                onSelect={handleSelect}
                onHover={setHoveredOption}
              />

              <StudioCard
                id="general-document"
                path="/analyze"
                context="general-document"
                title="General Document"
                description="NDAs, leases, agreements - risk detection and clause analysis."
                tags={["Risk Detection", "Clause Review"]}
                icon={FileText}
                theme="blue"
                loadingOption={loadingOption}
                hoveredOption={hoveredOption}
                onSelect={handleSelect}
                onHover={setHoveredOption}
              />

              <StudioCard
                id="motor-insurance"
                path="/insurance"
                context="motor-insurance"
                title="Motor Insurance"
                description="IDV, Zero Dep, and hidden exclusions."
                tags={["Coverage Check", "Risk Radar"]}
                icon={ShieldCheck}
                theme="purple"
                loadingOption={loadingOption}
                hoveredOption={hoveredOption}
                onSelect={handleSelect}
                onHover={setHoveredOption}
              />

              <StudioCard
                id="health-insurance"
                path="/insurance/health"
                context="health-insurance"
                title="Health Insurance"
                description="Room rent traps, waiting periods, and claim scenarios."
                tags={["Room Rent Trap", "Claim Simulator"]}
                icon={HeartPulse}
                theme="emerald"
                loadingOption={loadingOption}
                hoveredOption={hoveredOption}
                onSelect={handleSelect}
                onHover={setHoveredOption}
              />
            </div>
          </div>

          <div className="p-4 md:p-6 text-center shrink-0 border-t border-slate-100 bg-white/40 backdrop-blur-md relative z-20">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]" aria-hidden="true">
              You can always switch between studios later
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
