export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TeamHouurs';
const inferredFromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || inferredFromVercel || 'https://teamhouurs.app').replace(
  /\/$/,
  ''
);

export function absoluteUrl(path: string) {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${SITE_URL}${path}`;
}
