import Link from "next/link";
import type { Metadata } from "next";
import { Briefcase, ArrowRight, CheckCircle, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "Guide to Offer Letters & Employment Contracts Globally (2026) | REXI",
    description: "Understand your CTC, in-hand salary, variable pay, notice periods, and non-compete clauses. A complete guide for employees Globally.",
    keywords: [
        "employment contract guide india",
        "ctc vs in hand salary calculation",
        "offer letter components india",
        "notice period laws india",
        "non-compete clause validity india",
    ],
    alternates: { canonical: "/employment/guide" },
};

const chapters = [
    { id: "salary", title: "CTC & Salary Breakup", icon: "💰" },
    { id: "components", title: "Offer Letter Components", icon: "📄" },
    { id: "legal", title: "Key Legal Clauses", icon: "⚖️" },
    { id: "negotiation", title: "Negotiation Strategies", icon: "🤝" },
    { id: "leaving", title: "Resignation & Exit", icon: "🚪" },
];

export default function EmploymentGuidePage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Employment Guide", url: "/employment/guide" },
            ]} />

            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <Link href="/offers">
                        <Button className="bg-slate-900 text-white rounded-full px-6 font-bold flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Analyze My Offer
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Briefcase className="w-3.5 h-3.5" />
                        Employment & Career Guide 2026
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        Decoding Your Offer Letter & Employment Contract
                    </h1>
                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                        Don't just look at the CTC. Understand your actual in-hand pay, the variable pay traps, and the legal clauses that could restrict your future career.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/offers">
                            <Button className="bg-slate-900 text-white rounded-full px-8 py-6 text-lg font-bold flex items-center gap-2 hover:bg-slate-800">
                                Analyze My Offer Letter
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <h2 className="font-serif text-xl font-bold text-slate-900 mb-6">Master Guide Index</h2>
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
                    <section id="salary">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">1. CTC vs. Take-Home Salary</h2>
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            CTC (Cost to Company) includes many things you don't see. Your actual in-hand salary is what remains after statutory deductions (PF, Tax) and non-cash components (Insurance, Gratuity).
                        </p>
                        <div className="bg-slate-900 text-white rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold mb-4">The Real Math (₹12 LPA Example)</h3>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="flex justify-between border-b border-slate-700 pb-2">
                                    <span>Annual CTC</span>
                                    <span>₹12,00,000</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>- Gratuity (4.81% of Basic)</span>
                                    <span>(₹23,000)</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>- Employer PF (12% of Basic)</span>
                                    <span>(₹57,000)</span>
                                </div>
                                <div className="flex justify-between text-slate-400 border-b border-slate-700 pb-2">
                                    <span>- Variable Pay (10% of CTC)</span>
                                    <span>(₹1,20,000)</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span>Fixed Gross</span>
                                    <span>₹10,00,000</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-4 italic">
                                    *Monthly In-hand (after Tax & Employee PF): ≈ ₹68,000 - ₹72,000
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="components">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">2. Essential Offer Letter Components</h2>
                        <div className="grid gap-4">
                            {[
                                { title: "Basic Salary", desc: "The core taxable part. All other benefits (PF, Gratuity) are calculated as a % of this." },
                                { title: "HRA", desc: "House Rent Allowance. Fully or partially tax-exempt if you are renting a house." },
                                { title: "Joining Bonus", desc: "A one-time payment. Always check for 'Clawback' clauses (recovery if you leave early)." },
                                { title: "Stock Options (ESOPs)", desc: "Right to buy company shares. Check the 'Vesting Schedule' (when you can actually sell them)." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="legal">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">3. Key Legal Clauses to Watch For</h2>
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                                <h4 className="font-bold text-red-900 mb-2">Non-Compete Clause</h4>
                                <p className="text-sm text-red-800 leading-relaxed">
                                    Claims you cannot work for a competitor for X months after leaving. 
                                    <strong>Legal Reality:</strong> Globally, Section 27 of the Indian Contract Act makes post-employment non-competes mostly unenforceable, but they are still used to intimidate.
                                </p>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                                <h4 className="font-bold text-amber-900 mb-2">Notice Period</h4>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Usually 1-3 months. Check if 'Buy-out' (paying rent to leave early) is allowed. Some companies have 'Asymmetric Notice' (Company 1 month, You 3 months) — try to negotiate this to be mutual.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="negotiation">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">4. How to Negotiate Your Offer</h2>
                        <ul className="space-y-4 text-slate-700 font-medium">
                            <li className="flex gap-3">
                                <span className="text-blue-500">•</span>
                                <div><strong>Focus on Fixed:</strong> Don't let recruiters inflate the offer with high variable pay. Insist on a higher Fixed Base.</div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-500">•</span>
                                <div><strong>HRA vs Special Allowance:</strong> If you don't pay rent, ask for more 'Special Allowance' as HRA tax benefits won't apply to you.</div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-500">•</span>
                                <div><strong>Joining Bonus as a Buffer:</strong> If they won't budge on annual salary, ask for a one-time joining bonus to bridge the gap.</div>
                            </li>
                        </ul>
                    </section>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <p className="font-bold text-slate-900 mb-2">Need a dynamic review?</p>
                        <p className="text-sm text-slate-600 mb-4">Upload your PDF offer letter to REXI. Our AI identifies hidden clauses and calculates your real in-hand salary in seconds.</p>
                        <Link href="/offers">
                            <Button className="bg-slate-900 text-white rounded-full">Analyze My Offer Now</Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
