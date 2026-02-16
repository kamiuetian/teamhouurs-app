export type City = {
  slug: string;
  name: string;
  country: string;
  timeZone: string; // IANA time zone ID
};

// Curated list of major global hubs (used for search + programmatic SEO pages).
// You can expand this list any time — the sitemap + static params will update automatically.
export const TOP_CITIES: City[] = [
  // North America
  { slug: 'new-york', name: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { slug: 'san-francisco', name: 'San Francisco', country: 'United States', timeZone: 'America/Los_Angeles' },
  { slug: 'los-angeles', name: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles' },
  { slug: 'seattle', name: 'Seattle', country: 'United States', timeZone: 'America/Los_Angeles' },
  { slug: 'denver', name: 'Denver', country: 'United States', timeZone: 'America/Denver' },
  { slug: 'phoenix', name: 'Phoenix', country: 'United States', timeZone: 'America/Phoenix' },
  { slug: 'chicago', name: 'Chicago', country: 'United States', timeZone: 'America/Chicago' },
  { slug: 'austin', name: 'Austin', country: 'United States', timeZone: 'America/Chicago' },
  { slug: 'miami', name: 'Miami', country: 'United States', timeZone: 'America/New_York' },
  { slug: 'boston', name: 'Boston', country: 'United States', timeZone: 'America/New_York' },
  { slug: 'washington-dc', name: 'Washington, DC', country: 'United States', timeZone: 'America/New_York' },
  { slug: 'toronto', name: 'Toronto', country: 'Canada', timeZone: 'America/Toronto' },
  { slug: 'montreal', name: 'Montreal', country: 'Canada', timeZone: 'America/Toronto' },
  { slug: 'vancouver', name: 'Vancouver', country: 'Canada', timeZone: 'America/Vancouver' },
  { slug: 'mexico-city', name: 'Mexico City', country: 'Mexico', timeZone: 'America/Mexico_City' },
  { slug: 'honolulu', name: 'Honolulu', country: 'United States', timeZone: 'Pacific/Honolulu' },

  // South America
  { slug: 'sao-paulo', name: 'São Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { slug: 'rio-de-janeiro', name: 'Rio de Janeiro', country: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { slug: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires' },
  { slug: 'santiago', name: 'Santiago', country: 'Chile', timeZone: 'America/Santiago' },
  { slug: 'lima', name: 'Lima', country: 'Peru', timeZone: 'America/Lima' },
  { slug: 'bogota', name: 'Bogotá', country: 'Colombia', timeZone: 'America/Bogota' },

  // Europe
  { slug: 'london', name: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { slug: 'dublin', name: 'Dublin', country: 'Ireland', timeZone: 'Europe/Dublin' },
  { slug: 'lisbon', name: 'Lisbon', country: 'Portugal', timeZone: 'Europe/Lisbon' },
  { slug: 'madrid', name: 'Madrid', country: 'Spain', timeZone: 'Europe/Madrid' },
  { slug: 'barcelona', name: 'Barcelona', country: 'Spain', timeZone: 'Europe/Madrid' },
  { slug: 'paris', name: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { slug: 'brussels', name: 'Brussels', country: 'Belgium', timeZone: 'Europe/Brussels' },
  { slug: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', timeZone: 'Europe/Amsterdam' },
  { slug: 'berlin', name: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin' },
  { slug: 'munich', name: 'Munich', country: 'Germany', timeZone: 'Europe/Berlin' },
  { slug: 'zurich', name: 'Zurich', country: 'Switzerland', timeZone: 'Europe/Zurich' },
  { slug: 'vienna', name: 'Vienna', country: 'Austria', timeZone: 'Europe/Vienna' },
  { slug: 'prague', name: 'Prague', country: 'Czechia', timeZone: 'Europe/Prague' },
  { slug: 'warsaw', name: 'Warsaw', country: 'Poland', timeZone: 'Europe/Warsaw' },
  { slug: 'stockholm', name: 'Stockholm', country: 'Sweden', timeZone: 'Europe/Stockholm' },
  { slug: 'copenhagen', name: 'Copenhagen', country: 'Denmark', timeZone: 'Europe/Copenhagen' },
  { slug: 'oslo', name: 'Oslo', country: 'Norway', timeZone: 'Europe/Oslo' },
  { slug: 'helsinki', name: 'Helsinki', country: 'Finland', timeZone: 'Europe/Helsinki' },
  { slug: 'rome', name: 'Rome', country: 'Italy', timeZone: 'Europe/Rome' },
  { slug: 'milan', name: 'Milan', country: 'Italy', timeZone: 'Europe/Rome' },
  { slug: 'athens', name: 'Athens', country: 'Greece', timeZone: 'Europe/Athens' },
  { slug: 'istanbul', name: 'Istanbul', country: 'Turkey', timeZone: 'Europe/Istanbul' },
  { slug: 'moscow', name: 'Moscow', country: 'Russia', timeZone: 'Europe/Moscow' },
  { slug: 'kyiv', name: 'Kyiv', country: 'Ukraine', timeZone: 'Europe/Kyiv' },

  // Middle East
  { slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { slug: 'abu-dhabi', name: 'Abu Dhabi', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { slug: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', timeZone: 'Asia/Riyadh' },
  { slug: 'doha', name: 'Doha', country: 'Qatar', timeZone: 'Asia/Qatar' },
  { slug: 'kuwait-city', name: 'Kuwait City', country: 'Kuwait', timeZone: 'Asia/Kuwait' },
  { slug: 'manama', name: 'Manama', country: 'Bahrain', timeZone: 'Asia/Bahrain' },
  { slug: 'muscat', name: 'Muscat', country: 'Oman', timeZone: 'Asia/Muscat' },
  { slug: 'tehran', name: 'Tehran', country: 'Iran', timeZone: 'Asia/Tehran' },
  { slug: 'baghdad', name: 'Baghdad', country: 'Iraq', timeZone: 'Asia/Baghdad' },
  { slug: 'tel-aviv', name: 'Tel Aviv', country: 'Israel', timeZone: 'Asia/Jerusalem' },
  { slug: 'amman', name: 'Amman', country: 'Jordan', timeZone: 'Asia/Amman' },

  // Africa
  { slug: 'cairo', name: 'Cairo', country: 'Egypt', timeZone: 'Africa/Cairo' },
  { slug: 'casablanca', name: 'Casablanca', country: 'Morocco', timeZone: 'Africa/Casablanca' },
  { slug: 'tunis', name: 'Tunis', country: 'Tunisia', timeZone: 'Africa/Tunis' },
  { slug: 'lagos', name: 'Lagos', country: 'Nigeria', timeZone: 'Africa/Lagos' },
  { slug: 'accra', name: 'Accra', country: 'Ghana', timeZone: 'Africa/Accra' },
  { slug: 'nairobi', name: 'Nairobi', country: 'Kenya', timeZone: 'Africa/Nairobi' },
  { slug: 'addis-ababa', name: 'Addis Ababa', country: 'Ethiopia', timeZone: 'Africa/Addis_Ababa' },
  { slug: 'johannesburg', name: 'Johannesburg', country: 'South Africa', timeZone: 'Africa/Johannesburg' },
  { slug: 'cape-town', name: 'Cape Town', country: 'South Africa', timeZone: 'Africa/Johannesburg' },

  // South Asia
  { slug: 'karachi', name: 'Karachi', country: 'Pakistan', timeZone: 'Asia/Karachi' },
  { slug: 'islamabad', name: 'Islamabad', country: 'Pakistan', timeZone: 'Asia/Karachi' },
  { slug: 'lahore', name: 'Lahore', country: 'Pakistan', timeZone: 'Asia/Karachi' },
  { slug: 'delhi', name: 'Delhi', country: 'India', timeZone: 'Asia/Kolkata' },
  { slug: 'mumbai', name: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata' },
  { slug: 'bengaluru', name: 'Bengaluru', country: 'India', timeZone: 'Asia/Kolkata' },
  { slug: 'chennai', name: 'Chennai', country: 'India', timeZone: 'Asia/Kolkata' },
  { slug: 'kolkata', name: 'Kolkata', country: 'India', timeZone: 'Asia/Kolkata' },
  { slug: 'dhaka', name: 'Dhaka', country: 'Bangladesh', timeZone: 'Asia/Dhaka' },
  { slug: 'colombo', name: 'Colombo', country: 'Sri Lanka', timeZone: 'Asia/Colombo' },
  { slug: 'kathmandu', name: 'Kathmandu', country: 'Nepal', timeZone: 'Asia/Kathmandu' },
  { slug: 'kabul', name: 'Kabul', country: 'Afghanistan', timeZone: 'Asia/Kabul' },

  // Central Asia
  { slug: 'tashkent', name: 'Tashkent', country: 'Uzbekistan', timeZone: 'Asia/Tashkent' },
  { slug: 'almaty', name: 'Almaty', country: 'Kazakhstan', timeZone: 'Asia/Almaty' },

  // Southeast Asia
  { slug: 'singapore', name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', timeZone: 'Asia/Kuala_Lumpur' },
  { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', timeZone: 'Asia/Bangkok' },
  { slug: 'jakarta', name: 'Jakarta', country: 'Indonesia', timeZone: 'Asia/Jakarta' },
  { slug: 'ho-chi-minh-city', name: 'Ho Chi Minh City', country: 'Vietnam', timeZone: 'Asia/Ho_Chi_Minh' },
  { slug: 'hanoi', name: 'Hanoi', country: 'Vietnam', timeZone: 'Asia/Ho_Chi_Minh' },
  { slug: 'manila', name: 'Manila', country: 'Philippines', timeZone: 'Asia/Manila' },
  { slug: 'phnom-penh', name: 'Phnom Penh', country: 'Cambodia', timeZone: 'Asia/Phnom_Penh' },
  { slug: 'yangon', name: 'Yangon', country: 'Myanmar', timeZone: 'Asia/Yangon' },

  // East Asia
  { slug: 'tokyo', name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { slug: 'osaka', name: 'Osaka', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { slug: 'seoul', name: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul' },
  { slug: 'beijing', name: 'Beijing', country: 'China', timeZone: 'Asia/Shanghai' },
  { slug: 'shanghai', name: 'Shanghai', country: 'China', timeZone: 'Asia/Shanghai' },
  { slug: 'shenzhen', name: 'Shenzhen', country: 'China', timeZone: 'Asia/Shanghai' },
  { slug: 'hong-kong', name: 'Hong Kong', country: 'China', timeZone: 'Asia/Hong_Kong' },
  { slug: 'taipei', name: 'Taipei', country: 'Taiwan', timeZone: 'Asia/Taipei' },

  // Oceania
  { slug: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { slug: 'melbourne', name: 'Melbourne', country: 'Australia', timeZone: 'Australia/Melbourne' },
  { slug: 'brisbane', name: 'Brisbane', country: 'Australia', timeZone: 'Australia/Brisbane' },
  { slug: 'perth', name: 'Perth', country: 'Australia', timeZone: 'Australia/Perth' },
  { slug: 'auckland', name: 'Auckland', country: 'New Zealand', timeZone: 'Pacific/Auckland' }
];

export const CITY_BY_SLUG: Record<string, City> = Object.fromEntries(
  TOP_CITIES.map((c) => [c.slug, c])
);

export function findCityByName(input: string): City | undefined {
  const q = input.trim().toLowerCase();
  if (!q) return undefined;

  // 1) Exact match (name)
  const exact = TOP_CITIES.find((c) => c.name.toLowerCase() === q);
  if (exact) return exact;

  // 2) Exact match (slug)
  const bySlug = CITY_BY_SLUG[q];
  if (bySlug) return bySlug;

  // 3) Starts-with (name)
  const starts = TOP_CITIES.find((c) => c.name.toLowerCase().startsWith(q));
  if (starts) return starts;

  return undefined;
}
