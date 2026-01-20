import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze Document | REXI - Secure Document Review",
  description: "Securely upload and analyze your freelance documents. Identify problematic clauses and get negotiation advice instantly.",
  robots: {
    index: false, // Don't index the actual analysis tool page for privacy/utility
    follow: true,
  },
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
