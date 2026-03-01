import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Scale, ArrowLeft, Calendar, User, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { SEED_POSTS } from "@/data/seed-posts";
import { BlogContent } from "@/components/blog/BlogContent";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render seed article pages at build time for instant Google indexability
export async function generateStaticParams() {
  return SEED_POSTS.map(post => ({ slug: post.slug }));
}

async function getPost(slug: string) {
  // Check seed posts first (always available, no DB dependency)
  const seedPost = SEED_POSTS.find(p => p.slug === slug);

  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    // Supabase post takes priority over seed (allows overriding seed content)
    return post || seedPost || null;
  } catch {
    return seedPost || null;
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Safety Guide Not Found" };

  return {
    title: `${post.title} | REXI Safety Guides`,
    description: post.excerpt,
    keywords: (post as { keywords?: string[] }).keywords || [],
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.created_at,
      authors: [post.author],
      url: `https://rexi.pro/blog/${slug}`,
      images: [{ url: "https://rexi.pro/og-image.svg", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author || "REXI Legal Team"
    },
    "datePublished": post.created_at,
    "url": `https://rexi.pro/blog/${slug}`
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Safety Guides", url: "/blog" },
        { name: post.title, url: `/blog/${slug}` },
      ]} />
      <Script
        id="article-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="w-6 h-6 md:w-7 md:h-7 text-slate-900" />
            <span className="font-serif text-xl md:text-2xl font-bold text-slate-900">REXI</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors text-xs md:text-sm font-medium">
              Safety Guides
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
        <article className="max-w-3xl mx-auto bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-sm border border-slate-200">
          <header className="mb-8 md:mb-12">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6 md:mb-8 p-0 h-auto text-slate-500 hover:text-slate-900 group text-xs md:text-sm font-medium">
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to all guides
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-[10px] md:text-sm text-slate-500 mb-4 md:mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {post.author}
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-5xl font-bold text-slate-900 leading-tight mb-4 md:mb-6 tracking-tight">
              {post.title}
            </h1>
            <p className="text-base md:text-xl text-slate-600 italic leading-relaxed font-medium">
              {post.excerpt}
            </p>
          </header>

          <div className="mt-2">
            <BlogContent content={post.content} />
          </div>

          <footer className="mt-12 md:mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" size="sm" className="rounded-full text-[10px] md:text-xs h-8 md:h-10 px-4">
              <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Share Safety Guide
            </Button>
          </footer>
        </article>

        <section className="max-w-3xl mx-auto mt-12 md:mt-16 p-6 md:p-12 bg-slate-900 rounded-2xl md:rounded-[3rem] text-white relative overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-5 h-5 md:w-8 md:h-8 text-white" />
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4">Don't sign without scanning</h2>
            <p className="text-slate-300 text-sm md:text-lg mb-8 max-w-md mx-auto font-medium">
              Use REXI's AI to analyze your next rent agreement, insurance policy, or offer letter in seconds.
            </p>
            <Link href="/analyze">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 md:px-12 h-14 md:h-16 text-base md:text-xl rounded-full font-bold w-full sm:w-auto transition-transform hover:scale-105 active:scale-95">
                Analyze My Document for Free
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-2xl md:blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-2xl md:blur-3xl" />
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2026 REXI Legal. Empowering everyone with legal clarity.
          </p>
        </div>
      </footer>
    </div>
  );
}
