import { type ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { CSPostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rexi.pro"),
  title: {
    default: "REXI | Smart Legal Document Review for Everyone",
    template: "%s | REXI",
  },
  description:
    "Don't sign without scanning. REXI is your AI-powered everyday legal companion. Analyze insurance policies, rent agreements, employment contracts, and offer letters to see if they're safe to sign — in seconds, for free.",
  keywords: [
    "legal document analysis",
    "document safety review",
    "is it safe to sign",
    "contract review AI",
    "insurance document review",
    "rent agreement analysis",
    "employment contract review",
    "offer letter analysis",
    "document risk detection",
    "legal AI software",
    "free legal document checker",
    "health insurance policy review",
    "motor insurance IDV check",
    "legal clarity for everyone",
    "daily life protection",
    "everyday legal assistance",
    "contract risk analyzer",
  ],
  authors: [{ name: "REXI Legal", url: "https://rexi.pro" }],
  creator: "REXI Legal",
  publisher: "REXI Legal",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "https://rexi.pro",
      "en-GB": "https://rexi.pro",
      "en-IN": "https://rexi.pro",
      "x-default": "https://rexi.pro",
    },
  },
  openGraph: {
    title: "REXI | Know If It's Safe To Sign Before You Do",
    description:
      "AI-powered legal document review for everyone. From insurance to rent agreements — REXI decodes the fine print in plain English.",
    url: "https://rexi.pro",
    siteName: "REXI",
    images: [
      {
        url: "https://rexi.pro/og-image.png",
        width: 1200,
        height: 630,
        alt: "REXI AI Legal Assistant screening an employment contract for hidden risks",
      }
    ],
    locale: "en_US",
    alternateLocale: ["en_IN", "en_GB"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REXI | Everyday Legal Safety",
    description:
      "Analyze any document instantly. Insurance, rent, or employment — know what you sign with REXI.",
    images: ["https://rexi.pro/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "REXI Legal",
    "url": "https://rexi.pro",
    "logo": "https://rexi.pro/favicon.svg",
    "sameAs": [
      "https://twitter.com/rexilegal",
      "https://linkedin.com/company/rexi-legal"
    ],
    "description": "AI-powered legal document analysis and safety guide for everyday documents."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <CSPostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main id="main-content">
              {children}
            </main>
            <Toaster />
            <CookieBanner />
          </ThemeProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}

