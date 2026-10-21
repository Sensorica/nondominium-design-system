// Every meeting journal in content/meetings/, parsed once at build time, newest first.
// Adding a meeting = dropping its journal there as YYYY-MM-DD-<kind>.md.
// An empty directory is a valid state: the list page renders its empty message.

import { parseMeeting, type Meeting } from './parse';

const files = import.meta.glob('/content/meetings/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const meetings: Meeting[] = Object.entries(files)
  .map(([file, src]) => parseMeeting(file, src))
  .sort((a, b) => b.slug.localeCompare(a.slug));

export function meetingBySlug(slug: string): Meeting | undefined {
  return meetings.find((m) => m.slug === slug);
}

export { KIND_LABEL } from './labels';
