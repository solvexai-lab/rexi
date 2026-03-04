import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle, XCircle, FileText, Shield, Zap, Globe, Star, AlertTriangle, Scale, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LegalDisclaimer } from "@/components/legal-disclaimer";

export const metadata: Metadata = {
    title: "Freelance Contract Analyzer — Review Any Client Contract Free | REXI",
    description: "Upload your freelance contract and REXI's smart analyzer instantly flags red flags: IP grabs, non-competes, payment traps, and unfair termination clauses. Used by freelancers worldwide.",
    keywords: [
        "freelance contract analyzer",
        "freelance contract review",
        "freelance contract red flags",
        "nda freelancer review",
        "non-compete clause freelancer",
        "ip ownership freelance contract",
        "client contract review tool",
        "freelance agreement checker",
    ],
    alternates: { canonical: "/freelancers" },
    openGraph: {
        title: "Freelance Contract Analyzer — Free Smart Review for Freelancers",
        description: "Stop signing contracts you don't understand. REXI instantly surfaces hidden clauses, IP traps, and unfair payment terms in any freelance agreement.",
        url: "https://rexi.pro/freelancers",
        type: "website",
    },
};

const schema = [
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is a freelance contract IP assignment clause?",
                "acceptedAnswer": { "@type": "Answer", "text": "An IP assignment clause transfers the ownership of all work you create for the client — including future work — to them. A broad clause can mean you can't use that code, design, or content in your portfolio. Always negotiate to limit IP assignment to work specifically paid for." }
            },
            {
                "@type": "Question",
                "name": "Can a client enforce a non-compete clause on a freelancer?",
                "acceptedAnswer": { "@type": "Answer", "text": "In most jurisdictions, overly broad non-compete clauses are unenforceable. However, narrow, time-limited non-solicitation clauses (preventing you from approaching their specific clients) may be enforceable. Always have any non-compete reviewed before signing." }
            },
            {
                "@type": "Question",
                "name": "How do I check if my freelance contract has red flags?",
                "acceptedAnswer": { "@type": "Answer", "text": "Upload your contract to REXI's free smart analyzer. It instantly checks for: unlimited IP assignment, unilateral termination without pay, non-compete clauses, late payment penalties on your side but not the client's, and scope creep enablers." }
            }
        ]
    },
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "REXI Freelance Contract Analyzer",
        "applicationCategory": "LegalTech",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Automated tool that instantly analyzes freelance contracts to surface red flags, unfair clauses, and IP traps.",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "320" }
    }
];

const redFlags = [
    {
        clause: "Unlimited IP Assignment",
        risk: "Critical",
        example: '"All work product, inventions, and developments… including those created outside working hours… are assigned to the Company."',
        what: "You lose ownership of everything you create — even unrelated side projects if there's ambiguity.",
        safe: "Limit to: 'IP assignment applies only to deliverables specifically listed in this contract and fully paid for.'"
    },
    {
        clause: "Unilateral Termination Without Pay",
        risk: "Critical",
        example: '"Client may terminate this agreement at any time, for any reason, with or without notice."',
        what: "Client can fire you mid-project after 3 months of work and owe you nothing for completed milestones.",
        safe: "Add: 'Upon termination, Client shall pay for all work completed to date within 14 days.'"
    },
    {
        clause: "Broad Non-Compete",
        risk: "High",
        example: '"Freelancer shall not engage in any work for competitors in the same industry for 24 months."',
        what: "If they're in 'tech', you can't work for any tech company for 2 years. Almost unenforceable but expensive to fight.",
        safe: "Replace with: 'Freelancer shall not solicit this Client's direct customers for 6 months.'"
    },
    {
        clause: "No Portfolio Rights",
        risk: "High",
        example: '"Freelancer shall not display, publish, or reference any work created under this agreement."',
        what: "You can't show the work in your portfolio. Your best work becomes invisible to future clients.",
        safe: "Add: 'Freelancer may list the engagement in their portfolio as a general reference without showing confidential content.'"
    },
    {
        clause: "Unlimited Revisions",
        risk: "Medium",
        example: '"Freelancer shall make revisions until Client is satisfied."',
        what: "This is a scope creep clause. 'Satisfied' is subjective and can mean infinite free work.",
        safe: "Define: 'Up to 3 rounds of revisions per deliverable. Additional revisions billed at ₹X/hour.'"
    },
    {
        clause: "Liability Without Cap",
        risk: "High",
        example: '"Freelancer shall be liable for all damages arising from any breach of this agreement."',
        what: "If a client claims your code caused them to lose business, you could owe millions.",
        safe: "Add: 'Total liability shall not exceed the fees paid by Client in the 3 months preceding the claim.'"
    },
];

const benefits = [
    { icon: Zap, title: "Instant Results", desc: "30-second analysis. No waiting for a lawyer." },
    { icon: Globe, title: "Works Globally", desc: "Contracts from any country, any jurisdiction." },
    { icon: Shield, title: "Never Stored", desc: "Your document is processed and never saved." },
    { icon: FileText, title: "Any Format", desc: "PDF, DOCX, or paste the text directly." },
];

const testimonials = [
    { quote: "Found an unlimited IP clause I had completely missed. Would have signed away rights to all my code.", author: "Arjun S.", role: "Full-stack Developer, Bangalore" },
    { quote: "The non-compete analysis alone saved me from 2 years of restricted work. Absolutely worth it.", author: "Sarah K.", role: "UX Designer, London" },
    { quote: "I use it for every new client engagement. Caught a 'no portfolio rights' clause in a UK contract.", author: "Marco R.", role: "Copywriter, Milan" },
];

const contractTypes = [
    "Freelance Service Agreement",
    "Independent Contractor Agreement",
    "NDA / Non-Disclosure Agreement",
    "Work-for-Hire Agreement",
    "Software Development Contract",
    "Design Brief & Contract",
    "Consulting Agreement",
    "Agency Contract",
];

export default function FreelancersPage() {
    return (
        <div className="min-h-screen bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "For Freelancers", url: "/freelancers" },
            ]} />

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <div className="flex items-center gap-4">
                        <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden md:block">Guides</Link>
                        <Link href="/analyze">
                            <Button className="bg-slate-900 text-white rounded-full px-5 font-bold text-sm flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Analyze Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main id="main-content">
                {/* Hero */}
                <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            1 in 3 freelance contracts has a dangerous clause
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                            Your Client Wants You to Sign.<br />
                            <span className="shimmer-text italic">Read It First.</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                            REXI analyzes any freelance contract in 30 seconds — surfacing IP grabs, non-competes, unlimited revision traps, and payment gotchas before you sign.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/analyze">
                                <Button size="lg" className="bg-slate-900 hover:bg-black text-white rounded-full px-10 h-14 text-lg font-bold shadow-xl hover:-translate-y-1 transition-all group w-full sm:w-auto">
                                    Analyze My Contract — Free
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#red-flags">
                                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg font-bold border-slate-300 hover:border-slate-900 w-full sm:w-auto">
                                    See What We Catch
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-slate-400 mt-4 font-medium">No account needed · 100% free · Works worldwide</p>
                    </div>
                </section>

                {/* Contract types we handle */}
                <section className="py-12 px-6 bg-slate-900">
                    <div className="max-w-5xl mx-auto">
                        <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">We analyze all contract types</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {contractTypes.map((type, i) => (
                                <span key={i} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium border border-white/10 hover:bg-white/20 transition-colors">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {benefits.map((b, i) => (
                                <div key={i} className="text-center p-6">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <b.icon className="w-6 h-6 text-slate-900" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Red Flags Section */}
                <section id="red-flags" className="py-20 px-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                                6 Contract Clauses That Will Cost You
                            </h2>
                            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                                These are the clauses that freelancers most commonly overlook — and regret.
                            </p>
                        </div>
                        <div className="space-y-6">
                            {redFlags.map((flag, i) => (
                                <div key={i} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${flag.risk === "Critical" ? "bg-red-100 text-red-700" : flag.risk === "High" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"}`}>
                                            {flag.risk} Risk
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-slate-900">{flag.clause}</h3>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Typical Wording</p>
                                        <p className="text-sm text-slate-700 font-medium italic leading-relaxed">{flag.example}</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 bg-red-50 rounded-2xl p-4 border border-red-100">
                                            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">What It Actually Means</p>
                                                <p className="text-sm text-red-800 font-medium leading-relaxed">{flag.what}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Safer Alternative</p>
                                                <p className="text-sm text-green-800 font-medium leading-relaxed">{flag.safe}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Mid-page */}
                <section className="py-16 px-6 bg-slate-900">
                    <div className="max-w-2xl mx-auto text-center">
                        <Scale className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                            Is your contract fair?
                        </h2>
                        <p className="text-slate-300 mb-8 font-medium leading-relaxed">
                            Upload it now. REXI checks for all 6 red flags above — plus payment terms, confidentiality scope, and jurisdiction traps. Free, instant, no signup.
                        </p>
                        <Link href="/analyze">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 h-14 text-lg font-bold transition-all hover:-translate-y-1 group">
                                Analyze My Contract Now
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 text-center mb-12">
                            From Freelancers Worldwide
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((t, i) => (
                                <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{t.author}</p>
                                        <p className="text-slate-400 text-xs font-medium">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Blog links */}
                <section className="py-20 px-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8 text-center">Freelancer Legal Guides</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { href: "/blog/freelance-contract-red-flags", title: "5 Freelance Contract Clauses That Will Cost You Money", icon: "⚠️" },
                                { href: "/blog/what-is-ip-assignment-clause-freelancer", title: "IP Assignment Clauses: What Every Freelancer Must Know", icon: "📋" },
                                { href: "/blog/non-compete-clause-freelancer-guide", title: "Non-Compete Clauses for Freelancers: Enforceable or Not?", icon: "🔒" },
                                { href: "/blog/how-to-review-client-contract-freelancer", title: "How to Review a Client Contract in 10 Minutes", icon: "⏱️" },
                                { href: "/blog/freelance-nda-guide-what-to-sign", title: "Freelance NDA Guide: What to Sign and What to Refuse", icon: "🛡️" },
                            ].map((item, i) => (
                                <Link key={i} href={item.href}
                                    className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all group">
                                    <span className="text-2xl shrink-0">{item.icon}</span>
                                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 leading-snug">{item.title}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-3xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                        <div className="relative z-10">
                            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-6" />
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                                Never sign blind again.
                            </h2>
                            <p className="text-slate-300 font-medium mb-8 max-w-md mx-auto leading-relaxed">
                                Join thousands of freelancers worldwide who use REXI to protect their work, their rights, and their income before signing any contract.
                            </p>
                            <Link href="/analyze">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-12 h-14 text-lg font-bold transition-all hover:-translate-y-1 group">
                                    Analyze My Contract — Free
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <p className="text-slate-500 text-sm mt-4">No login · No credit card · Works in 30 seconds</p>
                        </div>
                    </div>
                </section>
            </main>

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
                                <li><Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Home</Link></li>
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
                                <Shield className="w-3.5 h-3.5" />
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
