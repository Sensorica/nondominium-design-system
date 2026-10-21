import { meetings, originalBySlug } from '$lib/meetings';

// The index needs a summary of each meeting, not its whole text.
export const load = () => ({
  meetings: meetings.map((m) => ({
    slug: m.slug,
    date: m.date,
    kind: m.kind,
    title: m.title,
    dateLine: m.dateLine,
    durationMin: m.durationMin,
    attendees: m.attendees,
    tldr: m.tldr,
    counts: m.counts,
    originalLang: originalBySlug(m.slug)?.lang ?? null,
  })),
});
