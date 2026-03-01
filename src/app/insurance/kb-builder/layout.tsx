import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Motor Insurance Analyser | REXI — Know What Your Policy Really Covers",
    description:
        "Upload your motor insurance policy or quotation. REXI reveals your actual IDV, zero-depreciation cover, NCB, deductibles, and simulates real claim outcomes — in plain English, in seconds.",
    keywords: [
        "motor insurance policy review",
        "car insurance analysis",
        "IDV check online",
        "zero depreciation cover",
        "motor insurance claim simulator",
        "NCB protection",
        "engine protection cover",
        "car insurance India",
        "motor insurance AI",
    ],
    alternates: { canonical: "/insurance/kb-builder" },
    openGraph: {
        title: "Motor Insurance Analyser | REXI",
        description:
            "Upload your car insurance document and get instant AI analysis: IDV, exclusions, real claim scenarios, and risk flags.",
        url: "https://rexi.pro/insurance/kb-builder",
        images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: "REXI Motor Insurance Analysis" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Motor Insurance Analyser | REXI",
        description: "Know your car insurance IDV, exclusions, and real claim value before you need it.",
        images: ["https://rexi.pro/og-image.svg"],
    },
};

export default function KbBuilderLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
