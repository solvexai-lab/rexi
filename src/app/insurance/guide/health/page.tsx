import Link from "next/link";
import type { Metadata } from "next";
import { HeartPulse, ArrowRight, CheckCircle, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "Complete Guide to Health Insurance Globally (2026) | REXI",
    description: "The definitive guide to health insurance Globally — room rent traps, waiting periods, proportionate deduction, co-payment, and how to compare plans. Real ₹ examples.",
    keywords: [
        "health insurance guide india 2026",
        "how to choose health insurance india",
        "health insurance explained india",
        "room rent trap proportionate deduction",
        "ped waiting period irdai",
    ],
    alternates: { canonical: "/insurance/guide/health" },
    openGraph: {
        title: "Complete Guide to Health Insurance Globally (2026)",
        description: "Room rent traps, waiting periods, co-payment, proportionate deduction — everything explained with real ₹ examples for Indian families.",
        url: "https://rexi.pro/insurance/guide/health",
        type: "article",
    },
};

const schema = [
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Complete Guide to Health Insurance Globally (2026)",
        "author": { "@type": "Organization", "name": "REXI Legal" },
        "publisher": { "@type": "Organization", "name": "REXI Legal", "url": "https://rexi.pro" },
        "datePublished": "2026-02-24",
        "dateModified": "2026-02-24",
        "url": "https://rexi.pro/insurance/guide/health",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the room rent trap in health insurance?",
                "acceptedAnswer": { "@type": "Answer", "text": "The room rent trap occurs when your policy has a daily room rent limit (e.g., 1% of sum insured). If you choose a room above this limit, the insurer applies proportionate deduction to your entire bill — not just the room. A ₹1 lakh bill can become ₹62,500 reimbursed." }
            },
            {
                "@type": "Question",
                "name": "How do I choose between floater and individual health insurance?",
                "acceptedAnswer": { "@type": "Answer", "text": "A family floater shares one sum insured across all members — cheaper but risky if two family members are hospitalized in the same year. Individual plans give each person their own separate sum insured. For families with elderly parents or members with pre-existing conditions, individual plans are safer; floaters work better for young families with low hospitalization risk." }
            },
            {
                "@type": "Question",
                "name": "What is the PED waiting period after IRDAI's 2024 changes?",
                "acceptedAnswer": { "@type": "Answer", "text": "After IRDAI's 2024 Master Circular, the maximum PED (pre-existing disease) waiting period for new policies is 36 months (reduced from 48 months previously). Existing policies are not retroactively changed — new rules apply to new policies or at renewal for compliant insurers." }
            },
        ]
    }
];

const chapters = [
    { id: "basics", title: "Health Insurance Basics", icon: "📋" },
    { id: "room-rent", title: "The Room Rent Trap", icon: "⚠️" },
    { id: "waiting", title: "Waiting Periods Explained", icon: "⏳" },
    { id: "copay", title: "Co-payment & Sub-limits", icon: "💳" },
    { id: "floater", title: "Floater vs Individual", icon: "👨‍👩‍👧" },
    { id: "restoration", title: "Restoration & Recharge", icon: "🔄" },
    { id: "claims", title: "Cashless vs Reimbursement", icon: "🏥" },
    { id: "compare", title: "How to Compare Plans", icon: "⚖️" },
];

export default function HealthInsuranceGuidePage() {
    return (
        <div className="min-h-screen bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Insurance", url: "/insurance" },
                { name: "Health Insurance Guide", url: "/insurance/guide/health" },
            ]} />

            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <Link href="/insurance/health">
                        <Button className="bg-slate-900 text-white rounded-full px-6 font-bold flex items-center gap-2">
                            <HeartPulse className="w-4 h-4" />
                            Analyze My Policy
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <HeartPulse className="w-3.5 h-3.5" />
                        Health Insurance Guide 2026
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        The Complete Guide to Health Insurance Globally
                    </h1>
                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                        Room rent traps, waiting periods, co-payment, proportionate deduction, floater vs individual — every concept that determines what you actually receive at claim time. With real ₹ examples.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/insurance/health">
                            <Button className="bg-slate-900 text-white rounded-full px-6 font-bold flex items-center gap-2 hover:bg-slate-800">
                                Analyze My Policy
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/insurance/health/compare">
                            <Button variant="outline" className="rounded-full px-6 font-bold border-slate-300">
                                Compare Plans
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <h2 className="font-serif text-xl font-bold text-slate-900 mb-6">In This Guide</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {chapters.map((ch, i) => (
                                <a key={i} href={`#${ch.id}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all group">
                                    <span className="text-2xl">{ch.icon}</span>
                                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{ch.title}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 space-y-20">
                    <section id="basics">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">1. Health Insurance Basics</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            Health insurance Globally reimburses your hospitalization costs when you or a covered family member is admitted to hospital. But "reimbursement" is rarely 100% — the actual payout depends on your room choice, coverage limits, waiting periods, and a dozen other factors baked into your policy wording.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["Term", "What It Means"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["Sum Insured", "The maximum annual payout limit. Separate for individual; shared for floater."],
                                        ["Premium", "Annual amount you pay. Increases with age, sum insured, and claims history."],
                                        ["TPA", "Third Party Administrator — the middleman that processes your cashless claims."],
                                        ["Network Hospital", "Hospitals with a direct billing arrangement with your insurer for cashless claims."],
                                        ["Day Care", "Procedures that require less than 24 hours of hospitalization (e.g., cataract surgery)."],
                                        ["OPD", "Out-Patient Department — doctor visits and pharmacy bills, usually NOT covered by base plans."],
                                    ].map(([term, def], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-semibold text-slate-800">{term}</td>
                                            <td className="px-5 py-3 text-slate-600">{def}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="room-rent">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">2. The Room Rent Trap — The Biggest Hidden Risk</h2>
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                            <p className="font-bold text-red-900 mb-2 text-lg">What it is:</p>
                            <p className="text-red-800 font-medium leading-relaxed">
                                When your policy has a room rent limit (e.g., 1% of sum insured per day) and you choose a room above this limit, the insurer applies a proportionate deduction to your <strong>entire bill</strong> — surgeon fees, medicines, and diagnostics are all reduced by the same ratio.
                            </p>
                        </div>
                        <p className="text-base text-slate-700 font-medium leading-relaxed mb-6">
                            On a ₹5 lakh policy, the 1% limit = ₹5,000/day. A standard room in Apollo or Fortis in most Indian cities costs ₹6,000–₹10,000/day. Choosing any of those rooms triggers the trap.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-red-900 text-white">
                                    <tr>
                                        {["Item", "Actual Bill", "After Proportionate Deduction (62.5%)"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-50 bg-white">
                                    {[
                                        ["Room (5 nights at ₹8,000)", "₹40,000", "₹25,000"],
                                        ["Surgeon Fees", "₹30,000", "₹18,750"],
                                        ["Anaesthesia", "₹10,000", "₹6,250"],
                                        ["Medicines", "₹15,000", "₹9,375"],
                                        ["Lab Tests", "₹5,000", "₹3,125"],
                                        ["Total", "₹1,00,000", "₹62,500 (you pay ₹37,500)"],
                                    ].map(([a, b, c], i) => (
                                        <tr key={i} className={`${i === 5 ? "font-bold bg-red-50" : ""} hover:bg-slate-50`}>
                                            <td className="px-5 py-3 text-slate-800">{a}</td>
                                            <td className="px-5 py-3 text-slate-600">{b}</td>
                                            <td className="px-5 py-3 text-red-700">{c}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link href="/blog/room-rent-trap-health-insurance-india">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between group hover:border-slate-400 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Read the Full Room Rent Trap Guide</p>
                                    <p className="text-sm text-slate-500">Complete walkthrough with the formula, worked example, and how to avoid it</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                            </div>
                        </Link>
                    </section>

                    <section id="waiting">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">3. Waiting Periods — The Clock Before Coverage Activates</h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["Waiting Period", "Duration", "What's Excluded"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["Initial / Cooling-off", "30–90 days", "All illnesses except accidents"],
                                        ["Pre-existing Disease (PED)", "12–36 months", "Conditions diagnosed before policy start"],
                                        ["Specific Disease", "1–2 years", "Named conditions (hernia, cataract, kidney stones)"],
                                        ["Maternity", "9 months – 3 years", "Normal and C-section delivery costs"],
                                    ].map(([type, dur, ex], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-semibold text-slate-800">{type}</td>
                                            <td className="px-5 py-3 text-amber-700 font-medium">{dur}</td>
                                            <td className="px-5 py-3 text-slate-600">{ex}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800 font-medium">
                            <strong>2024 IRDAI Update (Circular No. IRDAI/HLT/CIR/MISC/170/09/2024):</strong> Maximum PED waiting period reduced to 36 months for all new policies issued after October 2024 (down from 48 months). The moratorium period (after which claims cannot be denied for non-disclosure) was also reduced to 5 years. <a href="https://irdai.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Source: IRDAI.gov.in</a>
                        </div>
                    </section>

                    <section id="copay">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">4. Co-payment and Sub-limits</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            Co-payment means you share a percentage of every claim with the insurer. A 20% co-payment on a ₹5 lakh claim means you pay ₹1 lakh — always. Sub-limits cap specific claim components (like cataract surgery at ₹40,000, regardless of actual cost).
                        </p>
                        <div className="space-y-4">
                            {[
                                { type: "Age-based co-pay", ex: "20% for members aged 61+", impact: "On a ₹5L claim: you pay ₹1 lakh regardless of room rent or treatment type" },
                                { type: "Hospital type co-pay", ex: "10% if treated at non-network hospital", impact: "Incentive to use network hospitals; avoid reimbursement claims where possible" },
                                { type: "Disease sub-limit", ex: "Cataract: ₹40,000 per eye", impact: "Actual cataract surgery in a private hospital can cost ₹60,000–₹1L. Sub-limit = you pay difference" },
                                { type: "Room rent sub-limit", ex: "1% of SI per day", impact: "Triggers proportionate deduction (see Chapter 2)" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                                    <p className="font-bold text-slate-900 mb-1">{item.type}</p>
                                    <p className="text-xs text-slate-500 font-medium mb-2">Example: {item.ex}</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">Impact: {item.impact}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="floater">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">5. Floater vs Individual Plans</h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["", "Family Floater", "Individual Plans"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["Sum Insured", "Shared by all members", "Separate per person"],
                                        ["Premium", "Lower (one policy)", "Higher (multiple policies)"],
                                        ["Risk", "Two members claiming same year = sum depleted", "No risk — separate pots"],
                                        ["Best For", "Young families, no chronic conditions", "Senior members, anyone with chronic illness"],
                                    ].map(([feat, fl, ind], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-semibold text-slate-800">{feat}</td>
                                            <td className="px-5 py-3 text-slate-600">{fl}</td>
                                            <td className="px-5 py-3 text-slate-600">{ind}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 font-medium">
                            <strong>Rule of thumb:</strong> Buy a floater for your young family (spouse + children). Buy individual policies for your parents — do NOT add parents to a family floater. Their higher hospitalization risk will exhaust the floater sum insured and leave you with nothing for the rest of the year.
                        </div>
                    </section>

                    <section id="restoration">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">6. Restoration and Recharge Features</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-4">
                            If your entire sum insured is consumed in one hospitalization, restoration/recharge automatically replenishes it for future claims in the same year. This is one of the most valuable features — especially for floater policies.
                        </p>
                        <div className="space-y-3">
                            {[
                                { name: "Basic Restoration", desc: "Replenishes the sum insured once per year, typically only for a different illness or different family member. Most plans offer this." },
                                { name: "Unlimited Restoration", desc: "Restores the sum insured an unlimited number of times per year. Available in premium plans from Care Health (Care Supreme Plus) and Niva Bupa." },
                                { name: "Recharge (₹ top-up)", desc: "Some plans add a fixed extra amount (e.g., 50% of SI as recharge) after the base SI is exhausted. Different from restoration — the amount is fixed, not equal to SI." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                                    <p className="font-bold text-slate-900 mb-1">{item.name}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="claims">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">7. Cashless vs Reimbursement Claims</h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["", "Cashless", "Reimbursement"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["How it works", "Hospital bills insurer directly", "You pay hospital; insurer reimburses later"],
                                        ["Pre-auth needed?", "Yes — pre-authorization required before admission", "No — claim after discharge"],
                                        ["Available at", "Network hospitals only", "Any hospital (India/abroad)"],
                                        ["Your out-of-pocket", "Deductible + non-covered items only", "Full bill upfront; wait for reimbursement"],
                                        ["Time to settlement", "Instantaneous at discharge", "15–30 working days typically"],
                                        ["Risk", "Pre-auth denial can strand you", "You need the cash float while claim processes"],
                                    ].map(([feat, cash, reimb], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-semibold text-slate-800">{feat}</td>
                                            <td className="px-5 py-3 text-slate-600">{cash}</td>
                                            <td className="px-5 py-3 text-slate-600">{reimb}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="compare">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">8. How to Compare Health Insurance Plans</h2>
                        <div className="space-y-3 mb-8">
                            {[
                                ["1. Room Rent Limit", "No limit is always better. If there is a limit, calculate your city's hospital room costs vs. the limit."],
                                ["2. Sum Insured vs. Cost of Care", "In metro cities, a hospitalization for major surgery can exceed ₹5–8L. Choose a sum insured that reflects actual costs."],
                                ["3. Waiting Periods", "Compare PED and specific disease waiting periods across plans. Shorter = better."],
                                ["4. Co-payment", "Zero co-pay is best. Any co-pay means you share every claim forever."],
                                ["5. Claim Settlement Ratio", "Above 90% from IRDAI annual report. Not marketing material."],
                                ["6. Network Hospital Size", "Check hospitals specifically in your city — not the aggregate national number."],
                                ["7. Restoration Feature", "Unlimited restoration > limited restoration > no restoration."],
                                ["8. Premium", "Compare only after making items 1–7 equivalent across plans."],
                            ].map(([label, detail], i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{label}</p>
                                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/insurance/health/compare">
                            <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between group cursor-pointer hover:opacity-90 transition-opacity">
                                <div>
                                    <p className="font-bold text-lg mb-1">Compare Your Health Plans with REXI</p>
                                    <p className="text-slate-300 text-sm">Upload 2–4 health insurance documents — AI comparison with room rent trap check</p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                            </div>
                        </Link>
                    </section>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 font-medium leading-relaxed">
                        <strong>Disclaimer:</strong> This guide is for informational purposes only. Insurance terms vary significantly by plan and insurer. Always read the full policy document before purchasing. This is not legal or financial advice.
                        Regulatory data sourced from: <strong>IRDAI Master Circular on Health Insurance — Circular No. IRDAI/HLT/CIR/MISC/170/09/2024</strong> and <strong>IRDAI Annual Report 2022–23</strong> (claim settlement ratios). <a href="https://irdai.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold">irdai.gov.in</a>
                    </div>

                    <div>
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Related Guides</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { href: "/blog/room-rent-trap-health-insurance-india", title: "Room Rent Trap: Full Explanation", icon: "⚠️" },
                                { href: "/blog/pre-existing-disease-waiting-period-health-insurance-india", title: "PED Waiting Period: 2024 IRDAI Rules", icon: "⏳" },
                                { href: "/review/health/star-health-family-health-optima", title: "Star Health Family Optima Review", icon: "⭐" },
                                { href: "/review/health/care-health-supreme", title: "Care Health Supreme Review", icon: "⭐" },
                            ].map((item, i) => (
                                <Link key={i} href={item.href}
                                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all group">
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 leading-snug">{item.title}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
