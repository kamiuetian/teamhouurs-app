import type { City } from '@/data/cities';

export function FAQJsonLd({
  cityA,
  cityB,
  timeDiffText,
  bestTimeText,
}: {
  cityA: City;
  cityB: City;
  timeDiffText: string;
  bestTimeText: string;
}) {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the time difference between ${cityA.name} and ${cityB.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: timeDiffText,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best time to schedule a meeting between ${cityA.name} and ${cityB.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: bestTimeText,
        },
      },
      {
        '@type': 'Question',
        name: 'Do daylight saving time changes affect the overlap?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Some time zones shift seasonally. TeamHouurs calculates offsets using IANA time zones, so recommended times adjust automatically when DST changes.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
    />
  );
}
