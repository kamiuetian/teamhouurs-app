import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}.app`,
    short_name: SITE_NAME,
    description: 'Find the best meeting times between cities worldwide with a visual time zone overlap grid.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
    ],
    scope: '/',
  };
}
