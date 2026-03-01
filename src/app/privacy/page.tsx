import Link from "next/link";
import { ArrowLeft, Shield, Lock, Database, Eye, Mail, Scale, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | REXI",
  description: "Learn how REXI protects your privacy and handles your data. We use a zero-retention architecture - your documents are never stored.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center premium-shadow group-hover:rotate-12 transition-transform">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">REXI</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 font-medium">
              Last updated: March 1, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Our Core Promise</h3>
                  <p className="text-slate-600 text-sm">
                    REXI operates on a zero-retention architecture. Your documents are processed in volatile memory and permanently deleted the moment your analysis is complete.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Database className="w-6 h-6" />
                Information We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We collect minimal information necessary to provide our service:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>Document Content:</strong> Temporarily processed for analysis only. Never stored permanently.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>Usage Analytics:</strong> Anonymous, aggregated data about feature usage to improve our service.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>Technical Data:</strong> Browser type, device info for compatibility and debugging.</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6" />
                How We Use Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Your information is used exclusively to:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Analyze documents and generate risk reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Improve our AI models (using only anonymized patterns, never your actual documents)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Ensure service reliability and security</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                Data Security
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We implement industry-leading security measures:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "256-bit Encryption", desc: "All data in transit is encrypted" },
                  { title: "Zero Retention", desc: "Documents deleted after analysis" },
                  { title: "No Ad Tracking", desc: "Your data is never sold or shared" },
                  { title: "GDPR Compliant", desc: "Privacy by design architecture" },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use select third-party services to power our platform:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>AI Processing:</strong> Google Gemini and Mistral AI for document analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>Infrastructure:</strong> Vercel for hosting, Supabase for secure data storage</span>
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                All third-party providers are contractually bound to protect your data and comply with applicable privacy laws.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Your Rights
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Access any personal data we hold about you</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Opt out of analytics collection</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Lodge a complaint with a supervisory authority</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6" />
                Global Privacy Compliance (GDPR, CCPA, LGPD)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                REXI operates internationally and strictly complies with major data protection frameworks:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>EU/UK GDPR:</strong> We operate strictly as a Data Processor. We enforce Standard Contractual Clauses (SCCs) for any cross-border data transfers to the United States.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>CCPA/CPRA (California):</strong> We do not "sell" or "share" your personal information. You have the absolute right to request deletion and opt-out of analytics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span><strong>LGPD (Brazil):</strong> We ensure robust, lawful processing of data for Brazilian residents under the explicit consent and legitimate interest bases.</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-sm text-slate-900 font-bold">Data Protection Officer (DPO)</p>
                <p className="text-sm text-slate-600 mt-1">To execute your Right to Erasure or request an SCC Data Processing Addendum (DPA), contact: <a href="mailto:dpo@rexi.pro" className="underline text-slate-900">dpo@rexi.pro</a></p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6" />
                Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <p className="text-slate-900 font-bold mt-2">
                privacy@rexi.pro
              </p>
            </section>

            <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl font-bold mb-3">Changes to This Policy</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
