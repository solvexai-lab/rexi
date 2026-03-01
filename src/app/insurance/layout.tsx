import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Insurance Studio | REXI — Motor & Health Policy Review",
    description:
        "Upload your motor or health insurance document. REXI's AI decodes your policy in seconds — revealing hidden exclusions, IDV gaps, room-rent traps, and real claim scenarios in plain English.",
    keywords: [
        "insurance policy review",
        "motor insurance analysis",
        "health insurance review",
        "insurance document checker",
        "car insurance IDV check",
        "health policy waiting period",
        "insurance claim calculator",
        "insurance AI",
    ],
    alternates: { canonical: "/insurance" },
    openGraph: {
        title: "Insurance Studio | REXI",
        description:
            "Decode your motor or health insurance policy in seconds. See what your policy really covers — and what it doesn't.",
        url: "https://rexi.pro/insurance",
        images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: "REXI Insurance Studio" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Insurance Studio | REXI",
        description: "AI analysis of your motor and health insurance policies. Know your real coverage before you claim.",
        images: ["https://rexi.pro/og-image.svg"],
    },
};

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
