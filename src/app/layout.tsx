import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Global time zone overlap grid for remote meetings`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Find the best meeting times between cities worldwide. Visual working-hours overlap grid, recommended slots, and shareable city-pair pages.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${SITE_NAME} | Global time zone overlap grid`,
    description:
      'Stop guessing time zones. See working-hours overlap and pick the best meeting time in seconds.',
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Global time zone overlap grid`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Global time zone overlap grid`,
    description:
      'Visual meeting planner for distributed teams. Find golden hours across time zones.',
    images: [absoluteUrl('/opengraph-image')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?cities={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a href="/" className="group inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card ring-1 ring-white/10">
                <span aria-hidden className="text-accent">⏱️</span>
              </div>
              <div>
                <div className="text-lg font-semibold leading-tight text-accent">
                  {SITE_NAME}.app
                </div>
                <div className="text-xs text-white/60">The work-from-anywhere overlap grid</div>
              </div>
            </a>

            <nav className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              <a className="hover:text-white" href="/">Tool</a>
              <a className="hover:text-white" href="/meeting">City pairs</a>
              <a className="hover:text-white" href="/meeting/london-to-new-york">Popular pair</a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} {SITE_NAME}. Built for remote teams.
              </p>
              <p>
                <a className="hover:text-white" href="/sitemap.xml">Sitemap</a>
                <span aria-hidden className="px-2">·</span>
                <a className="hover:text-white" href="/robots.txt">Robots</a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
