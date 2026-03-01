import Link from "next/link";
import type { Metadata } from "next";
import { FileText, ArrowRight, CheckCircle, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "Guide to Legal Documents & Agreements Globally (2026) | REXI",
    description: "Your ultimate guide to common legal documents Globally — Rent agreements, Service contracts, Freelance agreements, and NDAs. Know your rights.",
    keywords: [
        "legal document guide india",
        "rent agreement rules india",
        "service level agreement sla guide",
        "freelance contract clauses india",
        "how to sign a contract safely",
    ],
    alternates: { canonical: "/legal/guide" },
};

const chapters = [
    { id: "rent", title: "Rent Agreements (11-Month Rule)", icon: "🏠" },
    { id: "freelance", title: "Freelance & Service Contracts", icon: "💻" },
    { id: "nda", title: "NDAs & Confidentiality", icon: "🤫" },
    { id: "signing", title: "Safe Signing Checklist", icon: "✍️" },
];

export default function LegalGuidePage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Legal Document Guide", url: "/legal/guide" },
            ]} />

            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <Link href="/analyze">
                        <Button className="bg-slate-900 text-white rounded-full px-6 font-bold flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Analyze Any Document
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Legal Compliance Guide 2026
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        The Legal Document Playbook for India
                    </h1>
                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                        From renting a house to taking a freelance gig — don't sign until you know what's in the fine print. We break down the most common agreements used Globally.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/analyze">
                            <Button className="bg-slate-900 text-white rounded-full px-8 py-6 text-lg font-bold flex items-center gap-2 hover:bg-slate-800">
                                Review My Document
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <h2 className="font-serif text-xl font-bold text-slate-900 mb-6">Chapter Navigation</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {chapters.map((ch, i) => (
                                <a key={i} href={`#${ch.id}`}
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all group">
                                    <span className="text-2xl">{ch.icon}</span>
                                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{ch.title}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 space-y-20">
                    <section id="rent">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">1. Rent Agreements & The 11-Month Standard</h2>
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            Most rent agreements Globally are for 11 months to avoid mandatory registration under the Registration Act of 1908. While convenient, it offers less legal protection than a registered lease.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-8">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        <th className="px-5 py-3 text-left">Feature</th>
                                        <th className="px-5 py-3 text-left">11-Month Agmt.</th>
                                        <th className="px-5 py-3 text-left">Registered Lease</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-5 py-3 font-semibold">Registration</td>
                                        <td className="px-5 py-3">Not required</td>
                                        <td className="px-5 py-3">Mandatory</td>
                                    </tr>
                                    <tr>
                                        <td className="px-5 py-3 font-semibold">Legal Value</td>
                                        <td className="px-5 py-3">Evidence only</td>
                                        <td className="px-5 py-3">Public Record</td>
                                    </tr>
                                    <tr>
                                        <td className="px-5 py-3 font-semibold">Stamp Duty</td>
                                        <td className="px-5 py-3">Small amount</td>
                                        <td className="px-5 py-3">1% of total rent</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="freelance">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">2. Freelance & Service Contracts (SLAs)</h2>
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            If you are providing services, your contract should focus on three things: **Scope, Payment Timeline, and Intellectual Property (IP).**
                        </p>
                        <div className="space-y-4">
                            {[
                                { title: "Payment Terms", detail: "Avoid 'Payment on Acceptance'. Use 'Payment within X days of Invoice Delivery'." },
                                { title: "Deliverables", detail: "Be specific. Instead of 'Logo Design', say '3 Logo Concepts with 2 revisions each'." },
                                { title: "IP Transfer", detail: "Ensure IP only transfers to the client once the full payment is received." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-sm text-slate-600 mt-1">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="signing">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">3. Safe Signing Checklist</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-400">01</span>
                                <p className="text-sm font-medium italic text-slate-700">Read every page. Never assume two versions are identical unless you've run a diff check.</p>
                            </li>
                            <li className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-400">02</span>
                                <p className="text-sm font-medium italic text-slate-700">Initial every page. Sign the final page, but initial the bottom of all other pages to prevent swapping.</p>
                            </li>
                            <li className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-400">03</span>
                                <p className="text-sm font-medium italic text-slate-700">Get a countersigned copy. Never leave a signing session without your own copy signed by the other party.</p>
                            </li>
                        </ul>
                    </section>

                    <Link href="/analyze">
                        <div className="bg-emerald-900 rounded-3xl p-8 text-white flex items-center justify-between group cursor-pointer hover:bg-emerald-950 transition-colors">
                            <div className="max-w-md">
                                <h3 className="text-2xl font-bold mb-2">Review Any Legal Doc</h3>
                                <p className="text-emerald-200 text-sm">Upload a Rent Agreement, SLA, or Freelance Contract. REXI flags risks and missing clauses instantly.</p>
                            </div>
                            <ArrowRight className="w-8 h-8 text-emerald-400 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
