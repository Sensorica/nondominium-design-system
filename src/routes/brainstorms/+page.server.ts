import { brainstorms } from '$lib/brainstorms';

// The index needs each board's card and its search text, not the source itself.
export const load = () => ({
  brainstorms: brainstorms.map(({ slug, date, title, lifecycle, project, status, summary, lang, haystack }) => ({
    slug,
    date,
    title,
    lifecycle,
    project,
    status,
    summary,
    lang,
    haystack,
  })),
});
