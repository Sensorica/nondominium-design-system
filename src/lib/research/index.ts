// Every research board in content/research/, read once at build time, newest first.
// Same format as a brainstorm board (docs/BRAINSTORMS.md, docs/RESEARCH_BOARDS.md): the
// source is dropped there as YYYY-MM-DD-<slug>.md with the index frontmatter, and its compiled
// page sits beside the site as static/research/boards/<same name>.html. A research board is not
// a stage of the V, so its source carries no `lifecycle:` (the compiler would refuse it) and
// this loader marks every board `research` instead.

import { paths } from '$lib/paths';
import { parseBoard, type Board } from '$lib/brainstorms';

const files = import.meta.glob('/content/research/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const researchBoards: Board[] = Object.entries(files)
  .map(([file, src]) => ({ ...parseBoard(file, src, paths.researchBoardFile), lifecycle: 'research' }))
  .sort((a, b) => b.slug.localeCompare(a.slug));

export function researchBySlug(slug: string): Board | undefined {
  return researchBoards.find((b) => b.slug === slug);
}
