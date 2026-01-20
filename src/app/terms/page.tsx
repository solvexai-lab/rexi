import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, Scale, CheckCircle, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | REXI",
  description: "Read the terms and conditions for using REXI's legal document analysis service.",
};

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-500 font-medium">
              Last updated: January 17, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">Important Notice</h3>
                  <p className="text-amber-800 text-sm">
                    REXI provides informational analysis only and does not constitute legal advice. Always consult a qualified attorney for legal matters.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6" />
                Acceptance of Terms
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                By accessing or using REXI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
              <p className="text-slate-600 leading-relaxed">
                These terms apply to all users, visitors, and others who access or use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Description of Service
              </h2>
<p className="text-slate-600 leading-relaxed mb-4">
                  REXI is a document analysis tool backed by legal databases that helps users understand legal documents by:
                </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Identifying potential risks and concerning clauses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Providing plain-language explanations of legal terminology</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Comparing offer letters and employment documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>Generating risk assessments and recommendations</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Permitted Uses
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You may use the Service to:
              </p>
              <div className="grid gap-3">
                {[
                  "Analyze personal legal documents for educational purposes",
                    "Better understand document terms before signing",
                  "Compare job offers and employment terms",
                  "Get plain-language explanations of legal jargon",
                  "Identify potential red flags in agreements",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3 border border-green-100">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                Prohibited Uses
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You may not use the Service to:
              </p>
              <div className="grid gap-3">
                {[
                  "Provide legal advice to third parties",
                  "Make binding legal decisions without consulting an attorney",
                  "Upload documents you don't have the right to analyze",
                  "Attempt to reverse-engineer our AI models",
                  "Use automated systems to overwhelm our servers",
                  "Violate any applicable laws or regulations",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Disclaimer of Warranties
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We do not warrant that:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>The Service will be uninterrupted, secure, or error-free</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>The analysis results will be complete or accurate</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                  <span>The Service is suitable for any particular purpose</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-slate-600 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, REXI AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Intellectual Property
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The Service, including its original content, features, and functionality, is owned by REXI and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-slate-600 leading-relaxed">
                You retain all rights to documents you upload. We do not claim ownership of your content.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Governing Law
              </h2>
              <p className="text-slate-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which REXI operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6" />
                Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="text-slate-900 font-bold mt-2">
                legal@rexilegal.com
              </p>
            </section>

            <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl font-bold mb-3">Changes to Terms</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new Terms on this page. Your continued use of the Service following any changes constitutes acceptance of the new Terms.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
