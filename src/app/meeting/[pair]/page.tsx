import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CITY_BY_SLUG, TOP_CITIES } from '@/data/cities';
import { TimeGrid } from '@/components/TimeGrid';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { CurrentTimeCards } from '@/components/CurrentTimeCards';
import { MeetingRecommendations } from '@/components/MeetingRecommendations';
import { SEOContentBlock } from '@/components/SEOContentBlock';
import { FAQJsonLd } from '@/components/FAQJsonLd';
import {
  formatOffsetDiff,
  formatOverlapSummary,
  parsePairSlug,
  recommendMeetingSlots,
} from '@/lib/meeting';
import { SITE_NAME, absoluteUrl } from '@/lib/site';
import { doesObserveDST } from '@/lib/time';

export const revalidate = 60 * 60; // re-generate at most once per hour (keeps DST/current offsets fresh)
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ pair: string }> = [];
  for (const a of TOP_CITIES) {
    for (const b of TOP_CITIES) {
      if (a.slug === b.slug) continue;
      params.push({ pair: `${a.slug}-to-${b.slug}` });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { pair: string };
}): Promise<Metadata> {
  const parsed = parsePairSlug(params.pair);
  if (!parsed) return { title: `Meeting time planner | ${SITE_NAME}` };

  const a = CITY_BY_SLUG[parsed.aSlug];
  const b = CITY_BY_SLUG[parsed.bSlug];
  if (!a || !b) return { title: `Meeting time planner | ${SITE_NAME}` };

  const title = `Best meeting time: ${a.name} ↔ ${b.name}`;
  const description = `Find the best overlap for a call between ${a.name} and ${b.name}. Visual time zone grid, current time difference, and recommended golden hours.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/meeting/${params.pair}`,
    },
    openGraph: {
      type: 'website',
      title: `🕒 Working hours overlap: ${a.name} & ${b.name}`,
      description,
      url: absoluteUrl(`/meeting/${params.pair}`),
      images: [
        {
          url: absoluteUrl(`/meeting/${params.pair}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: `${a.name} ↔ ${b.name} meeting time`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `TeamHouurs: ${a.name} ↔ ${b.name}`,
      description: 'Visual meeting planner for remote teams. Find the perfect overlap in seconds.',
      images: [absoluteUrl(`/meeting/${params.pair}/opengraph-image`)],
    },
  };
}

export default function MeetingPage({ params }: { params: { pair: string } }) {
  const parsed = parsePairSlug(params.pair);
  if (!parsed) return notFound();

  const cityA = CITY_BY_SLUG[parsed.aSlug];
  const cityB = CITY_BY_SLUG[parsed.bSlug];
  if (!cityA || !cityB) return notFound();
  if (cityA.slug === cityB.slug) return notFound();

  const now = new Date();
  const diff = formatOffsetDiff(cityA, cityB, now);

  const overlap = formatOverlapSummary(cityA, cityB, now);
  const slots = recommendMeetingSlots(cityA, cityB, now, { limit: 3, stepMinutes: 30, durationMinutes: 60 });

  const aDST = doesObserveDST(cityA.timeZone);
  const bDST = doesObserveDST(cityB.timeZone);

  const best = slots[0];
  const bestTimeText = best
    ? `A safe default is ${best.aLocalLabel} in ${cityA.name}, which corresponds to ${best.bLocalLabel} in ${cityB.name}.`
    : `Use the overlap grid to pick a time when both teams are online.`;

  const shareUrl = absoluteUrl(`/meeting/${params.pair}`);

  const related = TOP_CITIES.filter((c) => c.slug !== cityA.slug && c.slug !== cityB.slug).slice(0, 6);

  return (
    <>
      <FAQJsonLd cityA={cityA} cityB={cityB} timeDiffText={diff.text} bestTimeText={bestTimeText} />

      <section className="mt-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold text-white">
              Best meeting times: {cityA.name} ↔ {cityB.name}
            </h1>
            <p className="mt-3 text-white/70">
              {diff.text} Use the grid to find overlapping working hours and pick a time that respects both teams.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                {cityA.name}: {cityA.timeZone} {aDST ? '(DST)' : ''}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                {cityB.name}: {cityB.timeZone} {bDST ? '(DST)' : ''}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                Updated hourly
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CopyLinkButton url={shareUrl} />
            <a
              className="rounded-lg bg-card px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:text-white"
              href={`/meeting/${cityB.slug}-to-${cityA.slug}`}
            >
              Reverse
            </a>
          </div>
        </div>

        <div className="mt-6">
          <CurrentTimeCards cityA={cityA} cityB={cityB} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Time difference</div>
            <div className="mt-2 text-sm font-semibold text-white">{diff.text}</div>
            <p className="mt-2 text-xs text-white/50">
              Tip: if one office starts late, try the other office’s early morning shoulder hours.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Quick recommendation</div>
            <div className="mt-2 text-sm text-white">
              {best ? (
                <>
                  <span className="font-semibold">{best.aLocalLabel}</span> ({cityA.name}){' '}
                  <span className="text-white/50">→</span>{' '}
                  <span className="font-semibold">{best.bLocalLabel}</span> ({cityB.name})
                </>
              ) : (
                <>Use the overlap grid below to pick a green-green slot.</>
              )}
            </div>
            <p className="mt-2 text-xs text-white/50">Based on 60-minute meetings and 09:00–17:00 work hours.</p>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <TimeGrid cities={[cityA, cityB]} />
      </div>

      <MeetingRecommendations
        cityA={cityA}
        cityB={cityB}
        slots={slots}
        overlapSummary={overlap.summary}
        overlapSegments={overlap.segments}
      />

      <AdPlaceholder />

      <SEOContentBlock
        cityA={cityA}
        cityB={cityB}
        timeDiffSentence={diff.text}
        overlapSummary={overlap.summary}
        slots={slots}
      />

      <section className="mx-auto mt-12 max-w-5xl">
        <h3 className="text-lg font-semibold text-white">Popular comparisons</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {related.map((c) => (
            <a
              key={c.slug}
              className="rounded-xl bg-card px-4 py-3 text-sm text-white/80 ring-1 ring-white/10 hover:text-white"
              href={`/meeting/${cityA.slug}-to-${c.slug}`}
            >
              {cityA.name} → {c.name}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl text-xs text-white/50">
        <p>
          Disclaimer: TeamHouurs assumes a default 09:00–17:00 workday for each city and does not account for individual
          company policies, local holidays, or personal schedules.
        </p>
      </section>
    </>
  );
}
