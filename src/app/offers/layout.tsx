import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Offer Letter Analyser | REXI — Know What Your Job Offer Really Pays",
    description:
        "Upload your job offer letter. REXI's AI breaks down take-home pay, variable pay risks, leave policy traps, non-compete clauses, and compares your offer to market rates — before you sign.",
    keywords: [
        "offer letter analysis",
        "job offer letter review",
        "salary breakdown calculator",
        "CTC vs take-home salary",
        "offer letter AI",
        "variable pay risk",
        "non-compete clause analysis",
        "employment contract review",
        "job offer comparison",
    ],
    alternates: { canonical: "/offers" },
    openGraph: {
        title: "Offer Letter Analyser | REXI",
        description:
            "Decode your job offer before you sign. CTC breakdown, hidden clauses, non-compete risks, and market salary comparison.",
        url: "https://rexi.pro/offers",
        images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: "REXI Offer Letter Analysis" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Offer Letter Analyser | REXI",
        description: "Upload your offer letter. Get a full salary breakdown and risk report before you accept.",
        images: ["https://rexi.pro/og-image.svg"],
    },
};

export default function OffersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
