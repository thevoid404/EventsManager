/**
 * Format an ISO date string to a readable date.
 * e.g. "Jul 15, 2025"
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Returns a human-readable deadline label and whether it's urgent.
 */
export function getDeadlineLabel(deadline: string): {
  text: string;
  urgent: boolean;
} {
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return { text: 'Registration closed', urgent: false };
  if (diffDays === 0) return { text: 'Closes today', urgent: true };
  if (diffDays === 1) return { text: 'Closes tomorrow', urgent: true };
  if (diffDays <= 3) return { text: `${diffDays} days left`, urgent: true };
  if (diffDays <= 7) return { text: `${diffDays} days left`, urgent: false };
  return { text: `Deadline: ${formatDate(deadline)}`, urgent: false };
}
