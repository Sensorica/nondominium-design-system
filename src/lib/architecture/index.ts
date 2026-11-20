// Every architecture board in content/architecture/, read once at build time, newest first.
// Same format as a brainstorm board (docs/BRAINSTORMS.md, docs/ARCHITECTURE_BOARDS.md): the
// source is dropped there as YYYY-MM-DD-<slug>.md with the index frontmatter, and its compiled
// page sits beside the site as static/architecture/boards/<same name>.html. The parsing is
// shared with the brainstorms, so the two surfaces cannot drift apart.

import { paths } from '$lib/paths';
import { parseBoard, type Board } from '$lib/brainstorms';

const files = import.meta.glob('/content/architecture/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const architectureBoards: Board[] = Object.entries(files)
  .map(([file, src]) => parseBoard(file, src, paths.architectureBoardFile))
  .sort((a, b) => b.slug.localeCompare(a.slug));

export function architectureBySlug(slug: string): Board | undefined {
  return architectureBoards.find((b) => b.slug === slug);
}
