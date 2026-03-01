import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/insurance/dashboard/',
          '/insurance/health/dashboard/',
          '/shared/',
          '/analyze/result',
          '/contracts/',
        ],
      },
    ],
    sitemap: 'https://rexi.pro/sitemap.xml',
    host: 'https://rexi.pro',
  }
}
