import { architectureBoards } from '$lib/architecture';

// The index needs each board's card and its search text, not the source itself.
export const load = () => ({
  boards: architectureBoards.map(({ slug, date, title, lifecycle, project, status, summary, lang, haystack }) => ({
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
