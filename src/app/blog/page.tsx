import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Calendar, User, Shield, BookOpen, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { SEED_POSTS } from "@/data/seed-posts";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Legal Safety Blog | REXI — Insurance, Salary & Contract Guides",
  description: "Expert guides on health insurance room rent traps, IDV in car insurance, CTC vs take-home salary, zero depreciation cover, and more. Real ₹ examples for Indian readers.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Legal Safety Blog | REXI",
    description: "In-depth guides on insurance policies, offer letters, and legal documents. Written for everyday Indians, not lawyers.",
    url: "https://rexi.pro/blog",
    type: "website",
  },
};

async function getPosts() {
  try {
    const supabase = await createClient();
    const { data: dbPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    // Merge: Supabase posts take priority; seeds fill gaps
    const supabaseSlugs = new Set((dbPosts || []).map((p: { slug: string }) => p.slug));
    const filteredSeeds = SEED_POSTS.filter(p => !supabaseSlugs.has(p.slug));
    return [...(dbPosts || []), ...filteredSeeds];
  } catch {
    // If Supabase is unavailable, serve seed posts so the blog is never empty
    return SEED_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Legal Safety Blog", url: "/blog" },
      ]} />
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center premium-shadow group-hover:rotate-12 transition-transform">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-neutral-900 tracking-tight">REXI</span>
            </div>
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors text-xs md:text-sm font-medium hidden sm:block">
              Home
            </Link>
            <Link href="/analyze">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-4 md:px-6 h-9 md:h-10 text-xs md:text-sm font-bold">
                Analyze Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-900 border border-slate-200 rounded-full mb-4 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3 md:w-3.5 md:h-3.5" />
              Legal Safety Blog
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Know Your Rights, <br className="hidden md:block" /> Protect Your Life
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Simple explanations for complex legal moments. From rent agreements to insurance policies, we help you stay safe.
            </p>
          </div>

          <div className="grid gap-6 md:gap-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="glass-card rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white/50 group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-[10px] md:text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {post.author}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-950 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm md:text-base text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>
                    <div className="pt-2">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" className="text-slate-900 hover:text-slate-950 p-0 h-auto font-bold group/btn text-sm">
                          Read Safety Guide
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                <p className="text-slate-500 max-w-sm mx-auto">We're writing legal safety guides to help you navigate everyday documents. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2026 REXI Legal. Empowering everyone with legal clarity.
          </p>
        </div>
      </footer>
    </div>
  );
}
