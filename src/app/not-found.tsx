import Link from "next/link";
import { FileQuestion, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo />
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-8 md:mb-10">
            <FileQuestion className="w-12 h-12 md:w-16 md:h-16 text-slate-400" />
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-bold text-slate-900 mb-4">
            404
          </h1>

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-700 mb-4">
            Page Not Found
          </h2>

          <p className="text-slate-500 text-lg mb-10 font-medium">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-slate-900 hover:bg-black text-white rounded-full px-8 h-12 font-bold w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/analyze">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 font-bold border-2 w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Analyze Document
              </Button>
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-sm font-medium mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/analyze" className="text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                Document Analysis
              </Link>
              <Link href="/offers" className="text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                Offer Letters
              </Link>
              <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                Legal Blog
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
