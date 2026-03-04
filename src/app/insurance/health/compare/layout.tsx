import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compare Health Insurance Plans | REXI — Smart Side-by-Side Analysis",
    description:
        "Upload 2–4 health insurance policies and get a smart side-by-side comparison: room rent limits, co-payments, waiting periods, sub-limits, and real claim scenarios for each plan — so you pick the right one.",
    keywords: [
        "compare health insurance plans India",
        "health insurance comparison",
        "best health insurance India",
        "mediclaim comparison",
        "health insurance smart compare",
        "room rent limit comparison",
        "health insurance waiting period comparison",
        "floater plan comparison",
    ],
    alternates: { canonical: "/insurance/health/compare" },
    openGraph: {
        title: "Compare Health Insurance Plans | REXI",
        description: "Smart comparison of your health insurance policies. Room rent, waiting periods, sub-limits — see the real difference.",
        url: "https://rexi.pro/insurance/health/compare",
        images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: "REXI Health Insurance Compare" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Compare Health Insurance | REXI",
        description: "Upload 2–4 health policies. REXI's smart analyzer tells you which one actually covers you best.",
        images: ["https://rexi.pro/og-image.svg"],
    },
};

export default function HealthCompareLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
