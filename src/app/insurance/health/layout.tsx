import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Health Insurance Policy Review | REXI — Room Rent Traps & Claim Reality",
    description:
        "Upload your health insurance policy. REXI's AI reveals room-rent proportionate deduction traps, sub-limit shocks, waiting period gotchas, and real ₹ claim scenarios — so you know the truth before you need to claim.",
    keywords: [
        "health insurance review",
        "health insurance policy analysis",
        "room rent limit health insurance",
        "proportionate deduction trap",
        "waiting period health insurance India",
        "health insurance sub-limits",
        "health insurance AI",
        "mediclaim policy review",
        "co-payment health insurance",
        "floater vs individual health plan",
    ],
    alternates: { canonical: "/insurance/health" },
    openGraph: {
        title: "Health Insurance Policy Review | REXI",
        description:
            "Decode your health insurance policy. Room rent traps, waiting periods, sub-limits, claim scenarios — revealed in plain English.",
        url: "https://rexi.pro/insurance/health",
        images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: "REXI Health Insurance Review" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Health Insurance Reality Check | REXI",
        description: "Find out your real claim value before disaster strikes. Room rent, co-pay, and sub-limit risks revealed.",
        images: ["https://rexi.pro/og-image.svg"],
    },
};

export default function HealthInsuranceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
