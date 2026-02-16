import { HomeTool } from '@/components/HomeTool';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { CITY_BY_SLUG, type City } from '@/data/cities';

export default function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const raw = typeof searchParams?.cities === 'string' ? searchParams?.cities : undefined;
  const slugs = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const selected: City[] = [];
  for (const slug of slugs) {
    const c = CITY_BY_SLUG[slug.toLowerCase()];
    if (c) selected.push(c);
  }

  const fallback = [CITY_BY_SLUG['london'], CITY_BY_SLUG['new-york']].filter(Boolean) as City[];

  const initial = selected.length >= 2 ? selected : fallback;

  return (
    <>
      <HomeTool initialCities={initial} />
      <AdPlaceholder />
    </>
  );
}
