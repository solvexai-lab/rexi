import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, Shield, Zap, Users, Target, Sparkles, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | REXI",
  description: "Learn about REXI's mission to make legal document understanding accessible to everyone through smart analysis backed by legal databases.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center premium-shadow group-hover:rotate-12 transition-transform">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">REXI</span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Making Legal Safety <span className="shimmer-text italic">Accessible</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              We believe everyone deserves to understand what they're signing, regardless of legal expertise or financial resources.
            </p>
          </div>

          <div className="mb-20">
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">Our Story</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  REXI was born from a simple frustration: why should understanding a rental agreement require a law degree?
                </p>
                <p>
                    We watched friends sign leases with hidden fees, family members accept insurance policies with exclusions they didn't understand, and countless people locked into documents they regretted.
                </p>
                <p>
                  The legal system wasn't built for everyday people. So we decided to build something that was.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8 text-center">What We Stand For</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Transparency",
                  description: "No hidden agendas. We exist solely to help you understand documents better.",
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  description: "Your documents are never stored. We process and forget. Your data is yours alone.",
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  description: "Legal understanding shouldn't be a privilege. REXI is free for personal use.",
                },
              ].map((value, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 md:p-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-slate-900" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8 text-center">How REXI Helps</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Instant Analysis",
                  description: "Upload any document and get a comprehensive risk assessment in seconds, not hours.",
                },
                {
                  icon: Sparkles,
                  title: "Plain English",
                  description: "We translate complex legal jargon into language anyone can understand.",
                },
                {
                  icon: Shield,
                  title: "Risk Detection",
                  description: "We identify predatory clauses, hidden fees, and unfair terms using our legal pattern database.",
                },
                {
                  icon: Users,
                  title: "Compare Offers",
                  description: "Side-by-side comparison of job offers, rental agreements, and more.",
                },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <feature.icon className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                To ensure no one ever signs a document they don't fully understand.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Upload your first document and see how REXI can help you understand what you're signing.
            </p>
            <Link href="/analyze">
              <Button size="lg" className="bg-slate-900 hover:bg-black text-white rounded-full px-10 h-14 text-lg font-bold shadow-2xl shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-1 transition-all group">
                Analyze a Document
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
