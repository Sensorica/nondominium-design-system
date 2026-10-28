// Every brainstorm board in content/brainstorms/, read once at build time, newest first.
// Adding a board = dropping its Niceboard source there as YYYY-MM-DD-<slug>.md with the
// index frontmatter (title, date, lifecycle, project, status, summary, lang), and its
// compiled page beside the site as static/brainstorms/boards/<same name>.html (docs/BRAINSTORMS.md).
// An empty directory is a valid state: the list page renders its empty message.

import { paths } from '$lib/paths';

const files = import.meta.glob('/content/brainstorms/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface Brainstorm {
  slug: string;
  date: string; // YYYY-MM-DD
  title: string;
  /** Where the board sits on the iterative V: brainstorm ... deployments. */
  lifecycle: string;
  project: string;
  status: string;
  summary: string;
  lang: string;
  /** The compiled board, served from static/brainstorms/. */
  board: string;
  /** Lowercased text the index searches: the frontmatter plus the source's prose. */
  haystack: string;
}

/** The flat `key: value` frontmatter Board.ts reads, quotes stripped. */
function frontmatter(src: string): Record<string, string> {
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(src);
  if (!fm) return {};
  return Object.fromEntries(
    [...fm[1].matchAll(/^([A-Za-z][\w-]*):[ \t]*(.*?)[ \t]*$/gm)].map((m) => [m[1], m[2].replace(/^(["'])(.*)\1$/, '$2')])
  );
}

/** The source without frontmatter or board fences' syntax, for full-text search. */
function prose(src: string): string {
  return src
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^```.*$/gm, '')
    .replace(/[#*_`>|[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function parse(file: string, src: string): Brainstorm {
  const slug = file.split('/').pop()!.replace(/\.md$/, '');
  const fm = frontmatter(src);
  const date = fm.date ?? slug.slice(0, 10);
  const title = fm.title ?? /^#\s+(.+)$/m.exec(src)?.[1]?.replace(/[*_`]/g, '') ?? slug;
  const b = {
    slug,
    date,
    title,
    lifecycle: fm.lifecycle ?? 'brainstorm',
    project: fm.project ?? 'nondominium',
    status: fm.status ?? 'open',
    summary: fm.summary ?? '',
    lang: fm.lang ?? 'en',
    board: paths.brainstormBoard(slug),
  };
  return { ...b, haystack: `${title} ${b.summary} ${b.lifecycle} ${b.project} ${b.status} ${prose(src)}`.toLowerCase() };
}

export const brainstorms: Brainstorm[] = Object.entries(files)
  .map(([file, src]) => parse(file, src))
  .sort((a, b) => b.slug.localeCompare(a.slug));

export function brainstormBySlug(slug: string): Brainstorm | undefined {
  return brainstorms.find((b) => b.slug === slug);
}

export { STAGES, STAGE_LABEL, STATUS_LABEL, LANG_LABEL } from './labels';
