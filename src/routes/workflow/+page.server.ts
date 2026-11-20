import { brainstorms, STAGES } from '$lib/brainstorms';
import { architectureBoards } from '$lib/architecture';
import { paths } from '$lib/paths';

// Each stage of the V with the published boards whose `lifecycle:` is that stage,
// newest first, from both surfaces (brainstorms and architecture). Each board
// carries the link to its own page. Only the card fields travel to the page, never
// the sources.
const boards = [
  ...brainstorms.map((b) => ({ ...b, href: paths.brainstorm(b.slug) })),
  ...architectureBoards.map((b) => ({ ...b, href: paths.architectureBoard(b.slug) })),
].sort((a, b) => b.slug.localeCompare(a.slug));

export const load = () => ({
  stages: STAGES.map((stage) => ({
    stage,
    boards: boards
      .filter((b) => b.lifecycle === stage)
      .map(({ slug, date, title, status, lang, href }) => ({ slug, date, title, status, lang, href })),
  })),
});
