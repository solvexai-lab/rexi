import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rexilegal.com"),
  title: "REXI | Smart Legal Document Review for Everyone",
  description: "Don't sign without scanning. REXI is your everyday legal companion. Analyze any document—insurance, rent, employment, or services—to see if it's safe to sign in seconds.",
  keywords: ["legal document analysis", "document safety review", "is it safe to sign", "contract review", "insurance document review", "rent agreement analysis", "document risk detection", "legal clarity for everyone"],
  authors: [{ name: "REXI Legal" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "REXI | Know If It's Safe To Sign Before You Do",
    description: "Everyday legal document review for everyone. From insurance to rent agreements, REXI tells you if it's safe to sign.",
    url: "https://rexilegal.com",
    siteName: "REXI",
    images: [
      {
        url: "https://rexilegal.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "REXI Document Safety Review",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REXI | Everyday Legal Safety",
    description: "Analyze any document instantly. Insurance, rent, or services—know what you sign with REXI.",
    images: ["https://rexilegal.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // User can update this
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

