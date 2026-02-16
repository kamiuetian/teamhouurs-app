export type DayPart = 'work' | 'shoulder' | 'sleep';

export const WORK_START = 9 * 60;
export const WORK_END = 17 * 60;
export const SHOULDER_MORNING_START = 7 * 60;
export const SHOULDER_MORNING_END = 9 * 60;
export const SHOULDER_EVENING_START = 17 * 60;
export const SHOULDER_EVENING_END = 21 * 60;

export function clampMod(n: number, mod: number) {
  return ((n % mod) + mod) % mod;
}

/**
 * Returns the time zone offset (in minutes) for a given IANA zone at a given Date.
 * Positive means the zone is ahead of UTC.
 */
export function getTimeZoneOffsetMinutes(timeZone: string, date: Date): number {
  // Using Intl to compute the same instant formatted in the target timezone,
  // then interpreting that as UTC.
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }

  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  // Difference between the formatted "local" time interpreted as UTC vs real UTC.
  return Math.round((asUTC - date.getTime()) / 60000);
}

export function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTimeInZone(
  date: Date,
  timeZone: string,
  opts?: { hour12?: boolean }
): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: opts?.hour12 ?? false,
  });
  return fmt.format(date);
}

export function formatWeekdayAndDateInZone(date: Date, timeZone: string): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return fmt.format(date);
}

export function getMinutesOfDayInZone(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  return Number(map.hour) * 60 + Number(map.minute);
}

export function dayPartForLocalMinutes(localMinutes: number): DayPart {
  const m = clampMod(localMinutes, 1440);
  if (m >= WORK_START && m < WORK_END) return 'work';
  const inMorningShoulder = m >= SHOULDER_MORNING_START && m < SHOULDER_MORNING_END;
  const inEveningShoulder = m >= SHOULDER_EVENING_START && m < SHOULDER_EVENING_END;
  if (inMorningShoulder || inEveningShoulder) return 'shoulder';
  return 'sleep';
}

export function isWithinWorkWindow(startLocalMinutes: number, durationMinutes: number): boolean {
  const start = clampMod(startLocalMinutes, 1440);
  const end = start + durationMinutes;
  // We don't allow meetings that wrap past midnight in the local zone.
  if (end >= 1440) return false;
  return start >= WORK_START && end <= WORK_END;
}

export function doesObserveDST(timeZone: string, year = new Date().getUTCFullYear()): boolean {
  // Compare offsets in winter vs summer (works for both hemispheres: if offsets differ, DST exists).
  const jan = new Date(Date.UTC(year, 0, 15, 12, 0, 0));
  const jul = new Date(Date.UTC(year, 6, 15, 12, 0, 0));
  const o1 = getTimeZoneOffsetMinutes(timeZone, jan);
  const o2 = getTimeZoneOffsetMinutes(timeZone, jul);
  return o1 !== o2;
}
