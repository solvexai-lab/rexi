import Link from "next/link";
import type { Metadata } from "next";
import { Shield, ArrowRight, Car, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "Complete Guide to Motor Insurance Globally (2026) | REXI",
    description: "Everything you need to know about car insurance Globally — IDV, zero depreciation, NCB, add-ons, exclusions, and how to compare policies. With real ₹ examples.",
    keywords: [
        "motor insurance guide india",
        "car insurance explained india",
        "comprehensive car insurance india 2026",
        "how to choose car insurance india",
        "idv ncb zero dep explained",
    ],
    alternates: { canonical: "/insurance/guide/motor" },
    openGraph: {
        title: "Complete Guide to Motor Insurance Globally (2026)",
        description: "The only motor insurance guide you need. IDV, Zero Dep, NCB, add-ons — all explained with real ₹ examples.",
        url: "https://rexi.pro/insurance/guide/motor",
        type: "article",
    },
};

const schema = [
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Complete Guide to Motor Insurance Globally (2026)",
        "author": { "@type": "Organization", "name": "REXI Legal" },
        "publisher": { "@type": "Organization", "name": "REXI Legal", "url": "https://rexi.pro" },
        "datePublished": "2026-02-24",
        "dateModified": "2026-02-24",
        "url": "https://rexi.pro/insurance/guide/motor",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the difference between third-party and comprehensive car insurance?",
                "acceptedAnswer": { "@type": "Answer", "text": "Third-party insurance is legally mandatory — it covers damage you cause to other people and their property, but does not cover your own car's damage. Comprehensive insurance adds Own Damage (OD) cover — protecting your own car against accidents, theft, natural calamities, and fire." }
            },
            {
                "@type": "Question",
                "name": "Is zero depreciation car insurance worth it?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, for cars under 4–5 years old. Without zero dep, insurers deduct 50% depreciation on plastic and rubber parts. On a ₹50,000 repair, you'd pay ₹20,000 out of pocket. With zero dep, you pay only the compulsory deductible (₹1,000–2,000)." }
            },
            {
                "@type": "Question",
                "name": "What happens to NCB (No Claim Bonus) if I claim?",
                "acceptedAnswer": { "@type": "Answer", "text": "Any own-damage claim resets your NCB to 0% the following year. NCB grows from 20% after year 1 to 50% after 5 claim-free years. At 50% NCB, your OD premium is halved. This is why many people avoid small claims — the NCB loss exceeds the claim value." }
            },
        ]
    }
];

const chapters = [
    { id: "types", title: "Types of Motor Insurance", icon: "📋" },
    { id: "idv", title: "IDV — The Most Important Number", icon: "💰" },
    { id: "addons", title: "Add-ons Worth Buying", icon: "🔧" },
    { id: "ncb", title: "NCB: Your Discount Engine", icon: "⭐" },
    { id: "exclusions", title: "What's NOT Covered", icon: "⚠️" },
    { id: "claims", title: "How Claims Work", icon: "📝" },
    { id: "compare", title: "Comparing Policies", icon: "⚖️" },
];

export default function MotorInsuranceGuidePage() {
    return (
        <div className="min-h-screen bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Insurance", url: "/insurance" },
                { name: "Motor Insurance Guide", url: "/insurance/guide/motor" },
            ]} />

            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <Link href="/insurance/kb-builder">
                        <Button className="bg-slate-900 text-white rounded-full px-6 font-bold flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            Analyze My Policy
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-28 pb-20">
                {/* Hero */}
                <div className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Car className="w-3.5 h-3.5" />
                        Motor Insurance Guide 2026
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        The Complete Guide to Motor Insurance Globally
                    </h1>
                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                        Everything you need to know — from the difference between third-party and comprehensive, to IDV, zero depreciation, NCB, and how to actually compare policies. With real ₹ examples throughout.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/insurance/kb-builder">
                            <Button className="bg-slate-900 text-white rounded-full px-6 font-bold flex items-center gap-2 hover:bg-slate-800">
                                Analyze My Policy
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/insurance/compare">
                            <Button variant="outline" className="rounded-full px-6 font-bold border-slate-300">
                                Compare Policies
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
                    {/* Chapter 1 */}
                    <section id="types">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">1. Types of Motor Insurance</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            There are two main categories of car insurance Globally. Third-party (TP) is mandatory by law. Comprehensive is optional — but without it, damage to your own car is entirely your expense.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["Feature", "Third-Party Only", "Comprehensive"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["Legally Mandatory?", "Yes", "No (includes TP)"],
                                        ["Covers damage to others?", "Yes", "Yes"],
                                        ["Covers damage to YOUR car?", "No", "Yes"],
                                        ["Covers theft of YOUR car?", "No", "Yes"],
                                        ["Add-ons available?", "Very limited", "Yes (Zero Dep, RTI, etc.)"],
                                        ["Typical annual cost", "₹2,000–₹4,000", "₹8,000–₹25,000+"],
                                    ].map(([a, b, c], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-semibold text-slate-800">{a}</td>
                                            <td className="px-5 py-3 text-slate-600">{b}</td>
                                            <td className="px-5 py-3 text-slate-600">{c}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 font-medium">
                            <strong>Pro tip:</strong> If your car is more than 7–10 years old and its market value is low (below ₹2–3 lakh), a third-party only policy may make financial sense — the own-damage premium plus add-ons may cost more than the car itself.
                        </div>
                    </section>

                    {/* Chapter 2 */}
                    <section id="idv">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">2. IDV — The Most Important Number in Your Policy</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            IDV (Insured Declared Value) is the maximum amount your insurer will pay if your car is stolen or declared a total loss. It is calculated as the manufacturer's ex-showroom price minus depreciation based on your car's age.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["Car Age", "Depreciation on IDV"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["Less than 6 months", "5%"],
                                        ["6 months – 1 year", "15%"],
                                        ["1 – 2 years", "20%"],
                                        ["2 – 3 years", "30%"],
                                        ["3 – 4 years", "40%"],
                                        ["4 – 5 years", "50%"],
                                        ["Beyond 5 years", "Mutually agreed"],
                                    ].map(([age, dep], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-medium text-slate-700">{age}</td>
                                            <td className="px-5 py-3 text-rose-600 font-bold">{dep}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                            Source: IRDAI Schedule of Rates — <strong>Circular No. IRDAI/NL/CIR/MISC/143/09/2022</strong>. IDV depreciation rates are mandated by IRDAI and apply uniformly across all licensed general insurers. <a href="https://irdai.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">irdai.gov.in</a>
                        </p>
                        <p className="text-base text-slate-700 font-medium leading-relaxed mb-4">
                            Some insurers artificially lower your IDV to offer a cheaper premium. A lower IDV = lower premium — but also lower payout in a total loss. Always verify your IDV matches the formula above before renewing.
                        </p>
                        <Link href="/insurance/kb-builder">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between group hover:border-slate-400 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Check Your Policy's IDV</p>
                                    <p className="text-sm text-slate-500">Upload your motor policy — REXI extracts your IDV and flags if it's below the IRDAI formula</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                            </div>
                        </Link>
                    </section>

                    {/* Chapter 3 */}
                    <section id="addons">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">3. Add-Ons Worth Buying</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    name: "Zero Depreciation",
                                    verdict: "✅ Almost always worth it for cars under 5 years",
                                    desc: "Removes depreciation deduction on replaced parts. Without it, 50% of plastic/rubber replacement cost is your expense. Cost: 15–25% extra on OD premium."
                                },
                                {
                                    name: "Return to Invoice (RTI)",
                                    verdict: "✅ Strongly recommended for cars under 2 years",
                                    desc: "On total loss, pays you the original invoice price — not the depreciated IDV. On a ₹10L car, this can mean ₹1.5–2L more in your pocket at claim time."
                                },
                                {
                                    name: "Engine Protection",
                                    verdict: "✅ Worth it in flood/monsoon-prone cities",
                                    desc: "Standard policies exclude engine damage from water ingress or oil leakage. Engine Protection covers this. Particularly valuable in Chennai, Mumbai, and Kolkata."
                                },
                                {
                                    name: "NCB Protection",
                                    verdict: "⚠️ Worth it only at 35%+ NCB",
                                    desc: "After a claim, your NCB does not reset if you have this add-on (limit: 1 claim/year). At 50% NCB (₹5,000+ savings), one claim would cost you ₹1,000+ in NCB loss — NCB Protection prevents this."
                                },
                                {
                                    name: "Roadside Assistance",
                                    verdict: "⚠️ Optional — check your credit card first",
                                    desc: "Covers towing, flat tyre, fuel delivery, and key lockout. Many premium credit cards include RSA free. Check before paying for it separately."
                                },
                                {
                                    name: "Consumables Cover",
                                    verdict: "✅ Recommended with Zero Dep",
                                    desc: "Standard policies don't cover oil, coolant, nuts, and bolts replaced during repair. This add-on does. Should be paired with Zero Dep for complete coverage."
                                },
                            ].map((addon, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="font-bold text-slate-900 mb-1 text-lg">{addon.name}</h3>
                                    <p className="text-sm font-bold text-slate-600 mb-2">{addon.verdict}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{addon.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Chapter 4 */}
                    <section id="ncb">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">4. NCB — Your Built-Up Discount</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            NCB (No Claim Bonus) is a discount on your own-damage premium for every claim-free year. It grows from 20% after year 1 to 50% after 5 consecutive claim-free years. Filing any own-damage claim resets it to 0%.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        {["Claim-Free Years", "NCB Discount", "On ₹10,000 OD Premium — Savings"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[
                                        ["1 year", "20%", "₹2,000"],
                                        ["2 years", "25%", "₹2,500"],
                                        ["3 years", "35%", "₹3,500"],
                                        ["4 years", "45%", "₹4,500"],
                                        ["5+ years", "50%", "₹5,000"],
                                    ].map(([yr, disc, save], i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-medium text-slate-800">{yr}</td>
                                            <td className="px-5 py-3 font-bold text-green-700">{disc}</td>
                                            <td className="px-5 py-3 text-slate-600">{save}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800 font-medium">
                            <strong>The NCB decision rule:</strong> If your repair cost is less than the NCB you'd lose by claiming (typically 20–50% of your OD premium), pay out of pocket and protect your NCB.
                        </div>
                    </section>

                    {/* Chapter 5 */}
                    <section id="exclusions">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">5. What's NOT Covered (Standard Exclusions)</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            Every comprehensive policy has a set of standard exclusions. Knowing these in advance prevents nasty surprises:
                        </p>
                        <div className="space-y-3">
                            {[
                                { ex: "Driving under the influence (DUI)", detail: "Any accident while intoxicated — no coverage at all" },
                                { ex: "No valid driving licence", detail: "If any driver (including family members) was driving without a valid DL" },
                                { ex: "Mechanical or electrical breakdown", detail: "Engine failure from wear and tear — not covered without add-on" },
                                { ex: "Tyre damage alone", detail: "Tyre punctures or burst tyres without bodily accident damage" },
                                { ex: "Consequential loss", detail: "Driving through a flooded road and the engine hydrolocks — excluded without Engine Protection add-on" },
                                { ex: "War, nuclear risk, radioactivity", detail: "Standard across all insurers globally" },
                                { ex: "Using private car for commercial purposes", detail: "Driving for Ola/Uber on a private car policy voids coverage" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 bg-red-50 border border-red-100 rounded-xl p-4">
                                    <span className="text-red-500 text-lg shrink-0">✗</span>
                                    <div>
                                        <p className="font-bold text-red-900 text-sm">{item.ex}</p>
                                        <p className="text-red-700 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Chapter 6 */}
                    <section id="claims">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">6. How to File a Motor Insurance Claim</h2>
                        <div className="space-y-4">
                            {[
                                { step: 1, title: "Notify the insurer immediately", desc: "Call your insurer's claims helpline or the TPA within 24 hours of the accident. Delayed notification can lead to claim rejection." },
                                { step: 2, title: "Do not move the vehicle until surveyed (major damage)", desc: "For accidents with significant damage, a spot surveyor may be dispatched. Moving the vehicle without documentation can complicate the survey." },
                                { step: 3, title: "File an FIR (for theft or third-party injury)", desc: "FIR is mandatory for theft claims. For accidents involving injury to others, file an FIR regardless." },
                                { step: 4, title: "Take the vehicle to a network garage for cashless", desc: "For cashless claim, the garage directly bills the insurer. You pay only the deductible and any non-covered amounts. For reimbursement, you pay the garage and claim later." },
                                { step: 5, title: "Submit claim documents", desc: "Policy copy, DL, RC book, FIR (if applicable), repair estimate, photographs of the damage, and the signed claim form." },
                                { step: 6, title: "Surveyor inspection and approval", desc: "The insurer appoints a surveyor who assesses the damage and approves the repair estimate. For cashless, approval comes to the garage directly." },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200">
                                    <span className="shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold flex items-center justify-center">{step}</span>
                                    <div>
                                        <p className="font-bold text-slate-900 mb-1">{title}</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Chapter 7 */}
                    <section id="compare">
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">7. How to Compare Motor Insurance Policies</h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                            Do not compare only premium. Premium is the price — but coverage is the value. A ₹5,000/year cheaper policy may cost you ₹30,000 more at claim time. Evaluate these in order:
                        </p>
                        <div className="space-y-3 mb-8">
                            {[
                                ["1. IDV", "Is the IDV fairly calculated? Verify against the IRDAI formula."],
                                ["2. Claim Settlement Ratio", "Above 95% is good. Check IRDAI annual report — not the insurer's marketing."],
                                ["3. Add-ons Included", "Zero Dep, Consumables, Engine Protection — are they bundled or separate?"],
                                ["4. Garage Network", "Check cashless garage count in your city specifically."],
                                ["5. Claim Process Reviews", "Look for real user reviews on claim experience — not overall company rating."],
                                ["6. Premium", "Compare after making IDV and add-ons equivalent across quotations."],
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
                        <Link href="/insurance/compare">
                            <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between group cursor-pointer hover:opacity-90 transition-opacity">
                                <div>
                                    <p className="font-bold text-lg mb-1">Compare Your Policies with REXI</p>
                                    <p className="text-slate-300 text-sm">Upload 2–4 policies and get a side-by-side AI comparison with claim scenarios</p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                            </div>
                        </Link>
                    </section>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 font-medium leading-relaxed">
                        <strong>Disclaimer:</strong> This guide is for informational purposes only. Insurance terms vary by policy and insurer. Always read your specific policy document or upload it to REXI for a tailored analysis. This is not legal or financial advice.
                        Regulatory data sourced from: <strong>IRDAI Schedule of Rates Circular No. IRDAI/NL/CIR/MISC/143/09/2022</strong> (IDV depreciation) and <strong>IRDAI Annual Report 2022–23</strong> (claim settlement ratios). <a href="https://irdai.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold">irdai.gov.in</a>
                    </div>

                    {/* See Also */}
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Related Guides</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { href: "/blog/idv-car-insurance-check-if-underinsured", title: "IDV: How to Check If You're Underinsured", icon: "💰" },
                                { href: "/blog/zero-depreciation-car-insurance-worth-it", title: "Zero Depreciation: Is It Worth It?", icon: "🔧" },
                                { href: "/review/motor/hdfc-ergo-car-insurance", title: "HDFC ERGO Review", icon: "⭐" },
                                { href: "/review/motor/icici-lombard-car-insurance", title: "ICICI Lombard Review", icon: "⭐" },
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
