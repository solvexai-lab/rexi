import { INSURER_DATA } from "@/data/insurers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Star, ArrowLeft, ArrowRight, Shield, Car, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

interface Props {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
    return INSURER_DATA.map(insurer => ({
        category: insurer.category,
        slug: insurer.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, slug } = await params;
    const insurer = INSURER_DATA.find(i => i.slug === slug && i.category === category);
    if (!insurer) return { title: "Insurer Not Found" };

    return {
        title: `${insurer.name} Review: Is It Worth It? (2026 AI Analysis)`,
        description: `${insurer.tagline} Detailed review of ${insurer.name} — coverages, exclusions, claim settlement ratio (${insurer.claimSettlementRatio}), and our verdict. Powered by REXI.`,
        alternates: { canonical: `/review/${category}/${slug}` },
        openGraph: {
            title: `${insurer.name} Review (2026)`,
            description: insurer.tagline,
            url: `https://rexi.pro/review/${category}/${slug}`,
            type: "article",
        },
    };
}

export default async function InsurerReviewPage({ params }: Props) {
    const { category, slug } = await params;
    const insurer = INSURER_DATA.find(i => i.slug === slug && i.category === category);
    if (!insurer) notFound();

    const isHealth = insurer.category === "health";
    const toolLink = isHealth ? "/insurance/health" : "/insurance/kb-builder";
    const toolLabel = isHealth ? "Analyze Your Health Policy" : "Analyze Your Motor Policy";
    const categoryLabel = isHealth ? "Health Insurance" : "Motor Insurance";

    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
                "@type": "Product",
                "name": insurer.name,
                "description": insurer.description,
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": insurer.rating.toString(),
                "bestRating": "5",
            },
            "author": { "@type": "Organization", "name": "REXI Legal" },
            "reviewBody": insurer.description,
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": insurer.name,
            "description": insurer.description,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": insurer.rating.toString(),
                "reviewCount": insurer.ratingCount.toString(),
                "bestRating": "5",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `Is ${insurer.name} good?`,
                    "acceptedAnswer": { "@type": "Answer", "text": `${insurer.tagline} — ${insurer.bestFor}` }
                },
                {
                    "@type": "Question",
                    "name": `What is the claim settlement ratio of ${insurer.name}?`,
                    "acceptedAnswer": { "@type": "Answer", "text": `${insurer.name} has a claim settlement ratio of ${insurer.claimSettlementRatio}.` }
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Insurance Reviews", url: "/review" },
                { name: categoryLabel, url: `/review/${category}` },
                { name: insurer.name, url: `/review/${category}/${slug}` },
            ]} />

            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/"><Logo /></Link>
                    <div className="flex items-center gap-4">
                        <Link href="/insurance" className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5">
                            {isHealth ? <HeartPulse className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                            Insurance Studio
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back */}
                    <Link href={`/blog`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        All Guides
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {categoryLabel} Review
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                REXI Analysis 2026
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                            {insurer.name}
                        </h1>
                        <p className="text-lg text-slate-600 font-medium mb-6 leading-relaxed italic">
                            {insurer.tagline}
                        </p>

                        {/* Rating Row */}
                        <div className="flex flex-wrap items-center gap-6 py-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(insurer.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                                    ))}
                                </div>
                                <span className="font-bold text-slate-900">{insurer.rating}/5</span>
                                <span className="text-sm text-slate-500">({insurer.ratingCount} reviews)</span>
                            </div>
                            {insurer.claimSettlementRatio && (
                                <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                    Claim Ratio: {insurer.claimSettlementRatio}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
                        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                        <p className="text-slate-700 leading-relaxed text-lg font-medium">{insurer.description}</p>
                    </div>

                    {/* Key Spec Highlight */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {isHealth && insurer.roomRentLimit && (
                            <div className={`rounded-2xl p-6 border ${insurer.hasPropDeduction ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Room Rent Limit</p>
                                <p className={`font-bold text-lg ${insurer.hasPropDeduction ? "text-amber-800" : "text-green-800"}`}>
                                    {insurer.roomRentLimit}
                                </p>
                                {insurer.hasPropDeduction && (
                                    <p className="text-xs text-amber-700 mt-1 font-medium">⚠ Proportionate deduction applies if exceeded</p>
                                )}
                            </div>
                        )}
                        {!isHealth && insurer.idvFlexibility && (
                            <div className="rounded-2xl p-6 border bg-blue-50 border-blue-200">
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">IDV Flexibility</p>
                                <p className="font-bold text-lg text-blue-800">{insurer.idvFlexibility}</p>
                            </div>
                        )}
                        <div className="rounded-2xl p-6 border bg-slate-50 border-slate-200">
                            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Best For</p>
                            <p className="font-semibold text-slate-800 text-sm leading-relaxed">{insurer.bestFor}</p>
                        </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm">
                            <h2 className="font-serif text-xl font-bold text-emerald-900 mb-5 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                What We Like
                            </h2>
                            <ul className="space-y-3">
                                {insurer.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 text-sm font-medium leading-relaxed">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-sm">
                            <h2 className="font-serif text-xl font-bold text-red-900 mb-5 flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                Watch Out For
                            </h2>
                            <ul className="space-y-3">
                                {insurer.cons.map((con, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 text-sm font-medium leading-relaxed">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
                        <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">Products Offered</h2>
                        <div className="flex flex-wrap gap-3">
                            {insurer.products.map((product, i) => (
                                <span key={i} className="px-4 py-2 bg-slate-100 text-slate-800 rounded-full text-sm font-semibold">
                                    {product}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-sm text-amber-800 font-medium leading-relaxed">
                        <strong>Disclaimer:</strong> This review is based on publicly available information, IRDAI data, and REXI's policy analysis. Ratings are our editorial opinion. This is not financial advice — always read the full policy document before purchasing. Claim settlement ratios are sourced from IRDAI Annual Reports.
                    </div>

                    {/* Internal Guide Links for SEO */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Expert Resources</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link href="/insurance/guide/motor" className="group">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-300 transition-all flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">Motor Insurance Masterclass</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            <Link href="/insurance/guide/health" className="group">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-300 transition-all flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">Health Insurance Secrets</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center">
                        <Shield className="w-10 h-10 mx-auto mb-4 text-slate-400" />
                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                            Already have {insurer.name.split("—")[0].trim()}?
                        </h2>
                        <p className="text-slate-300 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                            Upload your policy document for a personalized analysis — we'll extract your exact IDV, room rent limit, waiting periods, and real claim scenarios.
                        </p>
                        <Link href={toolLink}>
                            <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-3 font-bold text-base flex items-center gap-2 mx-auto">
                                {toolLabel}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
