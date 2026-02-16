import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { TOP_CITIES } from '@/data/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/meeting`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // City-pair pages (programmatic SEO)
  for (const a of TOP_CITIES) {
    for (const b of TOP_CITIES) {
      if (a.slug === b.slug) continue;
      urls.push({
        url: `${SITE_URL}/meeting/${a.slug}-to-${b.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
