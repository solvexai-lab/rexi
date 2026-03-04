"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Shield,
  Database,
  Check,
  FileText,
  Lock,
  ArrowRight,
  Scale,
  AlertTriangle,
  Gavel,
  Home,
  Briefcase,
  HeartPulse,
  Star,
  Clock,
  Eye,
  ShieldCheck,
  ZapOff,
  Menu,
  X,
  FileSearch,
  BadgeCheck,
  ScanLine,
  FileCheck,
  Landmark,
  Car,
  Users,
  TrendingUp,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { DemoModal } from "@/components/demo-modal";
import { StudioSelector } from "@/components/StudioSelector";
import { Logo } from "@/components/logo";
import { LeadCaptureModal, shouldShowLeadCapture } from "@/components/ui/LeadCaptureModal";

const scanSteps = [
  { title: "Analyzing Clauses...", progress: 30 },
  { title: "Checking for Predatory Language...", progress: 60 },
  { title: "Risk Report Generated", progress: 100 },
];

function ScanAnimation() {
  const [activeScanIndex, setActiveScanIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScanIndex((prev) => (prev + 1) % scanSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeScanIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-3 md:space-y-4"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs md:text-sm font-bold text-slate-700">{scanSteps[activeScanIndex].title}</span>
          <span className="text-xs md:text-sm font-bold text-slate-900">{scanSteps[activeScanIndex].progress}%</span>
        </div>
        <div className="h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-slate-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${scanSteps[activeScanIndex].progress}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const router = useRouter();

  const handleNavigate = (path: string, context: string) => {
    if (shouldShowLeadCapture()) {
      setPendingPath(`${path}?ctx=${context}`);
    } else {
      router.push(path);
    }
  };

  const handleLeadContinue = () => {
    if (!pendingPath) return;
    const cleanPath = pendingPath.split("?")[0];
    setPendingPath(null);
    router.push(cleanPath);
  };

  const handleLeadClose = () => {
    setPendingPath(null);
  };

  const schemas = [
    // WebSite schema — enables Google Sitelinks Search Box
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "REXI",
      "alternateName": "REXI Legal",
      "url": "https://rexi.pro",
      "description": "Smart legal document review for everyone. Analyze insurance policies, rent agreements, employment contracts, and offer letters.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://rexi.pro/blog?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    // Organization schema — Google Knowledge Panel
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "REXI Legal",
      "url": "https://rexi.pro",
      "logo": "https://rexi.pro/logo.svg",
      "description": "Smart everyday legal document review. We help ordinary people understand what they are signing.",
      "foundingDate": "2025",
      "email": "legal@rexi.pro",
      "areaServed": "Worldwide",
      "sameAs": []
    },
    // SoftwareApplication schema — App-like listings in search
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "REXI",
      "operatingSystem": "Web",
      "applicationCategory": "LegalApplication",
      "description": "Smart legal, insurance and employment document review for everyone. Analyze any document to see if it is safe to sign in seconds.",
      "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "INR" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      },
      "featureList": [
        "Motor Insurance Policy Analysis",
        "Health Insurance Review",
        "Offer Letter & CTC Breakdown",
        "Insurance Policy Comparison",
        "Contract Risk Detection",
        "Plain English Legal Explanation"
      ]
    },
    // FAQPage schema — wins featured snippets / position-zero
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is REXI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "REXI is a free smart legal document review tool. It analyzes insurance policies, rent agreements, offer letters, and employment contracts — explaining them in plain English and highlighting risks, hidden clauses, and what you should negotiate before signing."
          }
        },
        {
          "@type": "Question",
          "name": "How does REXI analyze insurance policies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You upload your motor or health insurance PDF. REXI extracts your IDV, premium, coverages, exclusions, deductibles, and waiting periods, then simulates real claim scenarios so you understand exactly what you'd actually receive in a claim — not just what the brochure says."
          }
        },
        {
          "@type": "Question",
          "name": "What is IDV in car insurance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IDV (Insured Declared Value) is the maximum amount your insurer will pay if your car is stolen or totalled. It is essentially your car's current market value minus depreciation. A low IDV means a lower payout in case of total loss. REXI checks your IDV against your vehicle's actual market value and flags if it is underinsured."
          }
        },
        {
          "@type": "Question",
          "name": "What is the room rent trap in health insurance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The room rent trap occurs when your health insurance policy has a room rent limit (e.g., 1% of sum insured per day). If you choose a room above this limit, the insurer applies a proportionate deduction — reducing ALL your claim components, not just the room cost. This can reduce total claim reimbursement by 40–60%. REXI identifies this trap in your policy."
          }
        },
        {
          "@type": "Question",
          "name": "How do I check if my health insurance has a waiting period?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your health insurance policy to REXI. It extracts all waiting periods — initial waiting period (30–90 days), pre-existing disease waiting period (typically 2–4 years), maternity waiting period (9 months to 3 years), and specific disease waiting periods. These are critical to know before you claim."
          }
        },
        {
          "@type": "Question",
          "name": "Can REXI review my offer letter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Upload your offer letter and REXI calculates your actual take-home pay from the CTC, identifies risky components like variable pay and joining bonus clawbacks, flags non-compete and notice period clauses, and compares your offer to market rates for your role and city."
          }
        },
        {
          "@type": "Question",
          "name": "Can REXI compare multiple insurance policies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. REXI's Compare tool lets you upload 2–4 motor or health insurance documents simultaneously. It produces a side-by-side comparison of coverage, premiums, add-ons, claim scenarios, and declares an overall winner based on value — helping you make an informed buying decision."
          }
        },
        {
          "@type": "Question",
          "name": "Is my document safe with REXI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Documents uploaded to REXI are processed in real-time for analysis and are not permanently stored. REXI uses industry-standard encryption in transit and at rest. Only metadata required to show your analysis results is retained."
          }
        },
        {
          "@type": "Question",
          "name": "Is REXI free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, REXI is free for personal use. You can analyze insurance policies, offer letters, and legal documents without any payment. There is no sign-up required to start your first analysis."
          }
        }
      ]
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white mesh-gradient selection:bg-neutral-200">
      <StudioSelector isOpen={showSelector} onClose={() => setShowSelector(false)} />
      {pendingPath && (
        <LeadCaptureModal
          sourceContext={pendingPath.split("ctx=")[1] ?? "home-page"}
          onContinue={handleLeadContinue}
          onClose={handleLeadClose}
        />
      )}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide">
              How it Works
            </a>
            <a href="#what-we-cover" className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide">
              What We Cover
            </a>
            <div onClick={() => handleNavigate("/analyze", "general-document")} className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide cursor-pointer">
              Documents
            </div>
            <div onClick={() => handleNavigate("/offers", "job-offer")} className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide cursor-pointer">
              Offer Letters
            </div>
            <Link href="/freelancers" className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide cursor-pointer">
              Freelancers
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide">
              Blog
            </Link>
            <a href="#learning-hub" className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide cursor-pointer">
              Resources
            </a>
            <a href="#security" className="text-slate-600 hover:text-black transition-colors text-sm font-semibold tracking-wide">
              Security
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div onClick={() => setShowSelector(true)} className="hidden sm:block cursor-pointer">
              <Button className="bg-slate-900 hover:bg-black text-white rounded-full px-8 h-11 font-bold shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Analyze Now
              </Button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-xl"
            >
              <div className="px-6 py-6 space-y-1">
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Navigation</p>
                </div>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  How it Works
                </a>
                <a href="#what-we-cover" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  What We Cover
                </a>
                <div onClick={() => { setMobileMenuOpen(false); handleNavigate("/analyze", "general-document"); }} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group cursor-pointer">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  Documents
                </div>
                <Link href="/freelancers" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group cursor-pointer">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Scale className="w-4 h-4" />
                  </div>
                  Freelancers
                </Link>
                <div onClick={() => { setMobileMenuOpen(false); handleNavigate("/offers", "job-offer"); }} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group cursor-pointer">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  Offer Letters
                </div>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Star className="w-4 h-4" />
                  </div>
                  Blog
                </Link>
                <a href="#learning-hub" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group cursor-pointer">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Database className="w-4 h-4" />
                  </div>
                  Resources
                </a>
                <a href="#security" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  Security
                </a>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div onClick={() => { setMobileMenuOpen(false); setShowSelector(true); }} className="cursor-pointer">
                    <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-12 font-bold shadow-lg">
                      <Scale className="w-4 h-4 mr-2" />
                      Analyze Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-neutral-200/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-neutral-100/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Background Logo Symbol */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-12 flex flex-col items-center">
            <div className="w-[600px] h-[600px] md:w-[900px] md:h-[900px] flex items-center justify-center rounded-[6rem] md:rounded-[10rem] overflow-hidden">
              <img
                src="/logo.svg"
                alt="REXI"
                className="w-full h-full"
              />
            </div>
            <span className="font-serif text-6xl md:text-9xl font-bold uppercase tracking-[0.5em] text-neutral-900 mt-[-50px]">REXI</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white/60 backdrop-blur-md border border-slate-200 rounded-full mb-6 md:mb-10 shadow-sm">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-900 flex items-center justify-center ring-2 ring-white">
                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-[0.2em]">Smarter Legal Review</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold text-slate-900 leading-[1.1] md:leading-[0.95] mb-6 md:mb-10 tracking-tight">
                Automated Legal Document Review: Know <span className="shimmer-text">exactly</span> what you're signing.
              </motion.h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                Stop guessing what the fine print means. REXI uses advanced analysis to scan your contracts, policies, and offers to expose hidden risks in plain English—instantly.
              </p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 md:gap-5">
                <div onClick={() => setShowSelector(true)} className="cursor-pointer">
                  <Button size="lg" className="bg-slate-900 hover:bg-black text-white px-10 md:px-12 h-14 md:h-16 rounded-full text-lg md:text-xl font-bold shadow-2xl shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-1 transition-all group w-full sm:w-auto">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Scan Document for Free
                  </Button>
                </div>
                <DemoModal>
                  <Button size="lg" variant="outline" className="border-2 border-slate-200 bg-white/50 text-slate-700 hover:bg-white px-8 md:px-10 h-14 md:h-16 rounded-full text-base md:text-lg font-bold hover:shadow-lg hover:-translate-y-1 transition-all w-full sm:w-auto">
                    <Eye className="w-5 h-5 mr-2" />
                    Try Demo
                  </Button>
                </DemoModal>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-full w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] md:text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Zero Data Retention Guarantee — GDPR & CCPA Ready
                </span>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                <div className="flex -space-x-3 md:-space-x-4">
                  {[
                    { initials: "SP", gradient: "from-violet-500 to-purple-600" },
                    { initials: "MK", gradient: "from-emerald-500 to-teal-600" },
                    { initials: "JR", gradient: "from-rose-500 to-pink-600" },
                    { initials: "DT", gradient: "from-blue-500 to-indigo-600" },
                    { initials: "AL", gradient: "from-amber-500 to-orange-600" },
                  ].map((user, i) => (
                    <div key={i} className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-white bg-gradient-to-br ${user.gradient} flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer`}>
                      <span className="text-white font-bold text-xs md:text-sm">{user.initials}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 font-bold text-xs md:text-sm">Trusted by 1,000+ users</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-widest text-center sm:text-left">
                Securing contracts for employees at global tech companies & renters worldwide
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative mt-10 lg:mt-0"
            >
              <div className="absolute -inset-6 md:-inset-10 bg-slate-900/5 rounded-[2rem] md:rounded-[3rem] blur-2xl md:blur-3xl opacity-50"></div>

              <article className="glass-card rounded-[2rem] md:rounded-[3rem] p-1 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 shimmer"></div>

                <div className="p-6 md:p-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center premium-shadow">
                        <FileText className="w-5 h-5 md:w-7 md:h-7 text-slate-900" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base md:text-lg">Insurance_Policy.pdf</h3>
                        <p className="text-xs md:text-sm text-slate-500 font-medium">Auto-detected: Health Insurance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 rounded-full border border-slate-100">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-900 rounded-full animate-pulse"></div>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-700 uppercase tracking-widest">Processing</span>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                    <ScanAnimation />

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="h-20 md:h-24 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 p-3 md:p-4 flex flex-col justify-between">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-900" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Latency</span>
                      </div>
                      <div className="h-20 md:h-24 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 p-3 md:p-4 flex flex-col justify-between">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Database className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-900" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Knowledge</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] text-white">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-slate-300">Security Alert</span>
                    </div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
                      "Section 4.2 contains a <span className="text-white font-bold underline decoration-slate-400">hidden cancellation fee</span> that contradicts the primary agreement."
                    </p>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-white"></div>
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              How REXI <span className="shimmer-text italic">Works</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Three simple steps to understand any legal document
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload Your Document",
                description: "Drag and drop any PDF, image, or document. We support insurance policies, rent agreements, employment documents, and more.",
              },
              {
                step: "02",
                icon: ScanLine,
                title: "Smart Review",
                description: "We scan every clause against 5,000+ known predatory patterns from our legal database, identifying risks and hidden terms in seconds.",
              },
              {
                step: "03",
                icon: FileCheck,
                title: "Get Your Report",
                description: "Receive a plain-English breakdown with risk scores, flagged clauses, and actionable recommendations.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-3xl p-8 md:p-10 h-full relative overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="absolute top-6 right-6 font-serif text-6xl md:text-7xl font-bold text-slate-100 group-hover:text-slate-200 transition-colors">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform premium-shadow">
                      <item.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 md:mt-16"
          >
            <div onClick={() => setShowSelector(true)} className="inline-block cursor-pointer">
              <Button size="lg" className="bg-slate-900 hover:bg-black text-white px-10 md:px-12 h-14 md:h-16 rounded-full text-lg font-bold shadow-2xl shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-1 transition-all group">
                Try It Now — Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="what-we-cover" className="py-20 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-20 text-center"
          >
            <h2 className="font-serif text-4xl md:text-7xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">
              Upload Once. <span className="shimmer-text italic">Sign with Absolute Confidence.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              REXI covers the documents that define your lifestyle, protecting you from hidden traps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[auto] md:auto-rows-[320px]">
            {/* Main Feature - Bento 1: Insurance */}
            <div
              onClick={() => handleNavigate("/insurance", "motor-insurance")}
              className="md:col-span-8 md:row-span-2 group cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="glass-panel-heavy squircle-soft p-10 md:p-14 flex flex-col justify-between h-full relative overflow-hidden border-white/60 shadow-dreamy"
              >
                {/* Decorative Mesh Background */}
                <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700" />

                <div className="absolute top-0 right-0 -mr-24 -mt-24 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12 group-hover:rotate-0 hidden md:block">
                  <HeartPulse className="w-[600px] h-[600px] text-slate-950" />
                </div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl group-hover:rotate-6 transition-transform">
                    <HeartPulse className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-serif text-4xl md:text-6xl font-bold text-slate-950 mb-6 tracking-tight leading-none">
                    Insurance <br /> Hub
                  </h3>
                  <p className="text-lg md:text-2xl text-slate-600 max-w-lg leading-relaxed font-medium mb-10">
                    Decode complex policies, find hidden exclusions, and run claim simulations before you sign.
                  </p>

                  <div className="inline-flex items-center gap-4 text-slate-950 font-bold group/btn">
                    <span className="text-xl uppercase tracking-widest border-b-2 border-slate-950 pb-1">Enter Studio</span>
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-12 md:mt-auto relative z-10">
                  <div className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm text-xs md:text-sm font-bold text-slate-950 uppercase tracking-widest">Health</div>
                  <div className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm text-xs md:text-sm font-bold text-slate-950 uppercase tracking-widest">Motor</div>
                  <div className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm text-xs md:text-sm font-bold text-slate-950 uppercase tracking-widest">Travel</div>
                </div>
              </motion.div>
            </div>

            {/* Feature 2 - Housing */}
            <motion.div
              whileHover={{ y: -8 }}
              className="md:col-span-4 md:row-span-1 bg-slate-950 squircle-soft p-10 flex flex-col justify-between group text-white min-h-[300px] md:min-h-0 shadow-dreamy"
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-slate-950 transition-all shadow-xl">
                  <Home className="w-8 h-8" />
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis Studio</div>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold mb-3 tracking-tight">Rent & Housing</h3>
                <p className="text-slate-400 font-medium text-base text-balance leading-relaxed">Spot unfair deposit rules and hidden landlord fees instantly.</p>
              </div>
            </motion.div>

            {/* Feature 3 - Freelancers */}
            <div
              onClick={() => handleNavigate("/freelancers", "freelancers-page")}
              className="md:col-span-4 md:row-span-1 group cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-panel-heavy squircle-soft p-10 flex flex-col justify-between min-h-[300px] md:min-h-0 h-full cursor-pointer shadow-dreamy border-white/60"
              >
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:bg-emerald-500 transition-all">
                    <FileSearch className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-slate-950 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold text-slate-950 mb-3 tracking-tight">Freelancers</h3>
                  <p className="text-slate-500 font-medium text-base text-balance leading-relaxed">Risk detection for NDAs, client contracts, and IP clauses.</p>
                </div>
              </motion.div>
            </div>

            {/* Feature 4 - Work */}
            <div
              onClick={() => handleNavigate("/offers", "job-offer")}
              className="md:col-span-4 md:row-span-1 group cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-panel-heavy squircle-soft p-10 flex flex-col justify-between min-h-[300px] md:min-h-0 h-full cursor-pointer shadow-dreamy border-white/60"
              >
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:bg-indigo-500 transition-all">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-slate-950 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold text-slate-950 mb-3 tracking-tight">Work & Offers</h3>
                  <p className="text-slate-500 font-medium text-base text-balance leading-relaxed">Salary breakdown, benefits analysis, and market comparison.</p>
                </div>
              </motion.div>
            </div>

            {/* Feature 5 - Patterns */}
            <motion.div
              whileHover={{ y: -8 }}
              className="md:col-span-12 md:row-span-1 glass-panel-heavy squircle-soft p-12 flex flex-col md:flex-row items-start md:items-center justify-between group overflow-hidden gap-8 shadow-dreamy border-white/60"
            >
              <div className="absolute inset-0 mesh-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
              <div className="flex items-center gap-10 relative z-10">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform shrink-0 border border-slate-100">
                  <Database className="w-10 h-10 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl md:text-5xl font-bold text-slate-950 mb-3 tracking-tight">5,000+ Risk Patterns</h3>
                  <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Our legal database is updated daily with the latest predatory clauses used by global corporations.</p>
                </div>
              </div>
              <Link href="/about" className="relative z-10 w-full md:w-auto">
                <Button className="rounded-full px-12 h-16 text-lg font-bold bg-slate-950 hover:bg-black text-white shadow-xl hover:-translate-y-1 transition-all w-full md:w-auto uppercase tracking-widest">
                  View Insights <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Hub Section */}
      <section id="learning-hub" className="py-20 md:py-32 px-6 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-6">
                Knowledge Hub 2026
              </div>
              <h2 className="font-serif text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-none">
                Master the <span className="text-slate-400 italic">Fine Print.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 font-medium">
                Deep-dive guides into the most complex legal and insurance documents Globally.
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-full px-8 h-14 font-bold flex items-center gap-2">
                All Articles <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Motor Insurance Guide",
                desc: "IDV math, Zero-Dep costs, and NCB transfer secrets.",
                path: "/insurance/guide/motor",
                color: "border-blue-500/30",
                icon: Car,
                tag: "Auto"
              },
              {
                title: "Health Insurance Hub",
                desc: "Room rent traps, IRDAI 2024 rules, and PED waiting periods.",
                path: "/insurance/guide/health",
                color: "border-emerald-500/30",
                icon: HeartPulse,
                tag: "Health"
              },
              {
                title: "Offer Letter Playbook",
                desc: "CTC breakdown, ESOP vesting, and non-compete validity.",
                path: "/employment/guide",
                color: "border-indigo-500/30",
                icon: Briefcase,
                tag: "Career"
              },
              {
                title: "Legal Doc Masterclass",
                desc: "11-month rent agreements and freelancer SLA traps.",
                path: "/legal/guide",
                color: "border-amber-500/30",
                icon: Landmark,
                tag: "Legal"
              },
            ].map((guide, i) => (
              <Link key={i} href={guide.path} className="group">
                <div className={`h-full bg-white/5 border ${guide.color} p-8 rounded-[2rem] hover:bg-white/10 transition-all duration-500 group-hover:-translate-y-2`}>
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                      <guide.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{guide.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">{guide.desc}</p>
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group/link">
                    Read Guide <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-20 md:py-32 px-6 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Transparency</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              How We <span className="shimmer-text italic">Protect</span> You
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              We believe you deserve to know exactly how your documents are analyzed and what powers our system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20"
          >
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">Your Document's Journey</h3>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Upload</h4>
                  <p className="text-sm text-slate-500">256-bit encrypted transfer</p>
                </div>

                <div className="hidden md:flex items-center">
                  <div className="w-16 h-0.5 bg-slate-200"></div>
                  <ArrowRight className="w-5 h-5 text-slate-300 mx-2" />
                  <div className="w-16 h-0.5 bg-slate-200"></div>
                </div>
                <div className="md:hidden h-8 w-0.5 bg-slate-200"></div>

                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <ScanLine className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Analyze</h4>
                  <p className="text-sm text-slate-500">Volatile memory only</p>
                </div>

                <div className="hidden md:flex items-center">
                  <div className="w-16 h-0.5 bg-slate-200"></div>
                  <ArrowRight className="w-5 h-5 text-slate-300 mx-2" />
                  <div className="w-16 h-0.5 bg-slate-200"></div>
                </div>
                <div className="md:hidden h-8 w-0.5 bg-slate-200"></div>

                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Report</h4>
                  <p className="text-sm text-slate-500">Delivered to you</p>
                </div>

                <div className="hidden md:flex items-center">
                  <div className="w-16 h-0.5 bg-slate-200"></div>
                  <ArrowRight className="w-5 h-5 text-slate-300 mx-2" />
                  <div className="w-16 h-0.5 bg-slate-200"></div>
                </div>
                <div className="md:hidden h-8 w-0.5 bg-slate-200"></div>

                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <ZapOff className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Delete</h4>
                  <p className="text-sm text-slate-500">Instant file deletion</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <span className="text-sm font-bold text-slate-700">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <CircleDot className="w-4 h-4 text-slate-700" />
                  <span className="text-sm font-bold text-slate-700">No Storage</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <span className="text-sm font-bold text-slate-700">Zero Retention</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Landmark className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Landmark className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Enterprise-Grade Engine</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  We use Google's enterprise-grade Gemini engine via secure API. Your data is processed in real-time and <span className="font-bold text-slate-900">never stored or used for training</span>.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="Gemini" className="w-5 h-5" />
                  <span className="font-bold text-slate-500">Google Gemini 1.5</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">5,000+ Legal Patterns</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  Our system matches clauses against a curated database of <span className="font-bold text-slate-900">verified predatory patterns</span> from real court cases and consumer protection agencies.
                </p>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-700">Updated Daily</span>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-600">Court-Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Lock className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Zero Data Retention</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  Your document is analyzed in volatile memory and <span className="font-bold text-slate-900">deleted instantly</span> after your report is generated. We never store your files.
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">GDPR & CCPA Compliant</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16"
          >
            <div className="glass-card rounded-3xl p-8 md:p-10 bg-gradient-to-br from-slate-50 to-white border border-slate-100">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-6 text-center">Security & Compliance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">256-bit AES</span>
                  <span className="text-xs text-slate-500">Encryption</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">GDPR</span>
                  <span className="text-xs text-slate-500">Compliant</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                    <BadgeCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">CCPA</span>
                  <span className="text-xs text-slate-500">Ready</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                    <ZapOff className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Zero Storage</span>
                  <span className="text-xs text-slate-500">Policy</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 p-6 md:p-8 bg-slate-900 rounded-3xl text-white text-center"
          >
            <p className="text-lg md:text-xl font-medium text-slate-300 max-w-3xl mx-auto">
              <span className="text-white font-bold">"Backed by 5,000+ Verified Legal Patterns & Enterprise-Grade Security"</span>
              <br className="hidden md:block" />
              <span className="text-slate-400 text-base">— Rule-based analysis meets specialized legal knowledge</span>
            </p>
          </motion.div>
        </div>
      </section>


      {/* Trust & Security */}
      <section id="security" className="py-20 md:py-32 px-6 relative overflow-hidden">
        {/* Section Background Scale */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 opacity-[0.02] -rotate-12 pointer-events-none">
          <Scale className="w-[500px] h-[500px] md:w-[800px] md:h-[800px] text-neutral-900" strokeWidth={0.5} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 premium-shadow">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">Your data. <span className="italic text-slate-500">Untouched.</span></h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-10 md:mb-12">
                We believe legal safety shouldn't come at the cost of your privacy. REXI is built on a "zero-retention" architecture. Your documents are analyzed in a volatile memory and wiped the second your report is generated.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {[
                  { icon: Lock, label: "256-bit Encryption", desc: "Bank-grade security" },
                  { icon: Database, label: "Zero Retention", desc: "We never store files" },
                  { icon: ZapOff, label: "No Ad Tracking", desc: "Your data is not a product" },
                  { icon: Gavel, label: "GDPR Ready", desc: "Privacy by design" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 md:gap-3">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-slate-900" />
                      <span className="font-bold text-slate-900 text-sm md:text-base">{item.label}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-slate-900 rounded-[2rem] md:rounded-[4rem] p-10 md:p-16 flex items-center justify-center relative overflow-hidden group max-w-md mx-auto lg:max-w-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl mb-6 md:mb-10 group-hover:scale-110 transition-transform">
                    <Shield className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter">100%</div>
                    <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm">Encrypted & Private</div>
                  </div>
                </div>
                {/* Decorative particles */}
                <div className="absolute top-10 md:top-20 left-10 md:left-20 w-1.5 md:w-2 h-1.5 md:h-2 bg-slate-500 rounded-full animate-ping"></div>
                <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-1.5 md:w-2 h-1.5 md:h-2 bg-slate-100 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-dark rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 bg-slate-950 text-white relative overflow-hidden text-center shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)]">
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-slate-800/20 rounded-full blur-[80px] md:blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-slate-900/10 rounded-full blur-[80px] md:blur-[120px]"></div>

            <div className="relative z-10">
              <h2 className="font-serif text-4xl md:text-8xl font-bold mb-6 md:mb-10 tracking-tight leading-[1.1] md:leading-[0.9]">
                Sign with <span className="italic text-slate-400">Confidence.</span>
              </h2>
              <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed">
                Join thousands of people who use REXI to protect their interests, their finances, and their peace of mind.
              </p>

              <div onClick={() => setShowSelector(true)} className="inline-block w-full sm:w-auto cursor-pointer">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 px-10 md:px-16 h-16 md:h-20 rounded-full text-xl md:text-2xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                  Analyze Now — It's Free
                </Button>
              </div>

              <p className="mt-8 md:mt-10 text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3">
                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                No Credit Card Required
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-16 md:py-20 px-6 relative border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-8 mb-12 md:mb-16">
            <div className="md:col-span-5">
              <Link href="/" className="inline-block mb-6 group">
                <Logo variant="light" />
              </Link>
              <p className="text-slate-400 font-medium max-w-xs leading-relaxed text-sm md:text-base">
                Smart legal document review for everyone. Know what you're signing before you sign.
              </p>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-5">Product</h4>
              <ul className="space-y-3">
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">How it Works</a></li>
                <li><Link href="/freelancers" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">For Freelancers</Link></li>
                <li><Link href="/analyze" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Document Analysis</Link></li>
                <li><Link href="/offers" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Offer Letters</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-5">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">About</Link></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Blog</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-5">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              © 2026 REXI Legal Safety. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-500 text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                GDPR Compliant
              </span>
              <span className="w-px h-4 bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                256-bit Encrypted
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <LegalDisclaimer />
          </div>
        </div>
      </footer>
    </div>
  );
}
