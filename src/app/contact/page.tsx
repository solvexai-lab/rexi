import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MessageSquare, Scale, ArrowLeft, Shield, FileText, HeartPulse, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
    title: "Contact REXI | Get in Touch",
    description: "Questions about your document analysis, privacy concerns, or partnership inquiries? Reach the REXI Legal team — we respond within 24 hours.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="group"><Logo /></Link>
                    <Link href="/">
                        <Button variant="ghost" className="rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Get in Touch
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                            We'd Love to <span className="shimmer-text italic">Hear from You</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                            Whether you have a question about your document analysis, a partnership inquiry, or feedback — the REXI team reads every message.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <a
                            href="mailto:legal@rexi.pro"
                            className="group glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col gap-4"
                        >
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">General Inquiries</h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                    Document questions, feedback, feature requests, or anything else.
                                </p>
                                <span className="font-bold text-slate-900 text-sm group-hover:text-slate-600 transition-colors">
                                    legal@rexi.pro
                                </span>
                            </div>
                        </a>

                        <a
                            href="mailto:privacy@rexi.pro"
                            className="group glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col gap-4"
                        >
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">Privacy & Data Requests</h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                    Data deletion, privacy policy questions, or GDPR/DPDP requests.
                                </p>
                                <span className="font-bold text-slate-900 text-sm group-hover:text-slate-600 transition-colors">
                                    privacy@rexi.pro
                                </span>
                            </div>
                        </a>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-12">
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Frequently Asked Before Contacting</h2>
                        <div className="space-y-6">
                            {[
                                {
                                    q: "How long does REXI store my documents?",
                                    a: "REXI does not permanently store your uploaded documents. Files are processed in memory for analysis and discarded immediately after. Only the structured analysis result (not the document) is stored for your dashboard."
                                },
                                {
                                    q: "Can REXI review a document in a language other than English?",
                                    a: "REXI currently works best with English-language documents. Hindi and bilingual documents (common Globallyn insurance policies) may have partial analysis accuracy. We are actively improving multilingual support."
                                },
                                {
                                    q: "Is REXI's analysis legal advice?",
                                    a: "No. REXI is an AI-powered informational tool. Our analysis helps you understand your documents better but does not constitute legal advice. For legal disputes, consult a qualified lawyer."
                                },
                            ].map((item, i) => (
                                <div key={i} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                                    <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center">
                        <Scale className="w-10 h-10 mx-auto mb-4 text-slate-400" />
                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Try REXI Now</h2>
                        <p className="text-slate-300 mb-6 max-w-md mx-auto">
                            Upload your insurance policy, offer letter, or rent agreement and get an instant AI analysis.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/analyze">
                                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 font-bold flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Analyze a Document
                                </Button>
                            </Link>
                            <Link href="/insurance">
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 font-bold flex items-center gap-2">
                                    <Car className="w-4 h-4" />
                                    Insurance Studio
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
