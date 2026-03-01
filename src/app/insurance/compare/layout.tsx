import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compare Motor Insurance Policies | REXI — AI Side-by-Side Breakdown",
    description:
        "Upload 2–4 motor insurance documents and get a precise AI comparison: IDV, premiums, add-ons, claim scenarios, and a winner recommendation — all in one report.",
    keywords: [
        "compare motor insurance",
        "car insurance comparison",
        "motor insurance policy comparison",
        "best car insurance India",
        "motor insurance AI compare",
        "IDV comparison",
        "zero dep comparison",
        "motor insurance add-ons comparison",
    ],
    alternates: { canonical: "/insurance/compare" },
    openGraph: {
        title: "Compare Motor Insurance Policies | REXI",
        description: "AI side-by-side comparison of up to 4 motor insurance policies. See the real difference before you buy.",
        url: "https://rexi.pro/insurance/compare",
        images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: "REXI Motor Insurance Compare" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Compare Motor Insurance | REXI",
        description: "Upload up to 4 motor policies. Get an AI comparison of IDV, add-ons, and claim scenarios instantly.",
        images: ["https://rexi.pro/og-image.svg"],
    },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
