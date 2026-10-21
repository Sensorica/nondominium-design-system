// Every meeting journal in content/meetings/, parsed once at build time, newest first.
// Adding a meeting = dropping its journal there as YYYY-MM-DD-<kind>.md, in English (the
// default). A journal written in another language keeps its original beside it as
// YYYY-MM-DD-<kind>.fr.md, which the meeting page offers as "Original (français)".
// An empty directory is a valid state: the list page renders its empty message.

import { parseMeeting, type Meeting } from './parse';

const files = import.meta.glob('/content/meetings/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const isOriginal = (file: string) => /\.fr\.md$/.test(file);
const parsed = Object.entries(files).map(([file, src]) => ({ original: isOriginal(file), meeting: parseMeeting(file, src) }));

/** The French originals, by slug. */
const originals = new Map(parsed.filter((p) => p.original).map((p) => [p.meeting.slug, p.meeting]));

/** One entry per meeting: its English journal, or its original when no translation exists yet. */
export const meetings: Meeting[] = [
  ...parsed.filter((p) => !p.original).map((p) => p.meeting),
  ...parsed.filter((p) => p.original && !parsed.some((q) => !q.original && q.meeting.slug === p.meeting.slug)).map((p) => p.meeting),
].sort((a, b) => b.slug.localeCompare(a.slug));

export function meetingBySlug(slug: string): Meeting | undefined {
  return meetings.find((m) => m.slug === slug);
}

/** The original journal kept beside a translation, if any (the same object when only the original exists is not returned). */
export function originalBySlug(slug: string): Meeting | undefined {
  const o = originals.get(slug);
  return o && meetingBySlug(slug) !== o ? o : undefined;
}

export { KIND_LABEL } from './labels';
