// Deterministic date formatting. Intl and toLocale* depend on the runtime
// locale and can cause hydration mismatches, so month names are fixed here.

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
}

/** "2025-04" becomes "Apr 2025" */
export function formatMonth(value: string) {
  const { year, month } = parseMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

/**
 * Time between two "YYYY-MM" months, counting both months (so "2025-04" to
 * "2026-09" is 18 months), as "1 yr 6 mo".
 */
export function formatDuration(start: string, end: string) {
  const from = parseMonth(start);
  const to = parseMonth(end);
  const total = (to.year - from.year) * 12 + (to.month - from.month) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;

  return [years > 0 ? `${years} yr` : "", months > 0 ? `${months} mo` : ""]
    .filter(Boolean)
    .join(" ");
}

/**
 * Whole years from the earliest start to the latest end across `jobs`,
 * counting both months. Computed from /data so the number is never typed by hand.
 */
export function yearsOfExperience(jobs: { start: string; end: string }[]) {
  const earliest = jobs.map((job) => job.start).sort()[0];
  const latest = jobs
    .map((job) => job.end)
    .sort()
    .reverse()[0];
  const from = parseMonth(earliest);
  const to = parseMonth(latest);
  const total = (to.year - from.year) * 12 + (to.month - from.month) + 1;
  return Math.floor(total / 12);
}
