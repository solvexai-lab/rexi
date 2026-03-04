import { MetadataRoute } from 'next'
import { SEED_POSTS } from '@/data/seed-posts'
import { INSURER_DATA } from '@/data/insurers'

const BASE_URL = 'https://rexi.pro'
const NOW = new Date('2026-03-04')

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: NOW, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/analyze`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/insurance`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/insurance/kb-builder`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/insurance/health`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/insurance/compare`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/insurance/health/compare`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/offers`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/blog`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/about`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.5 },
    // Pillar content pages — topic hub anchors
    { url: `${BASE_URL}/insurance/guide/motor`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/insurance/guide/health`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/employment/guide`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/legal/guide`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
  ]

  // Seed blog article pages
  const blogPages: MetadataRoute.Sitemap = SEED_POSTS.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Programmatic insurer review pages
  const reviewPages: MetadataRoute.Sitemap = INSURER_DATA.map(insurer => ({
    url: `${BASE_URL}/review/${insurer.category}/${insurer.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...reviewPages]
}
