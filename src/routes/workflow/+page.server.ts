import { brainstorms, STAGES } from '$lib/brainstorms';

// Each stage of the V with the published boards whose `lifecycle:` is that stage,
// newest first. Only the card fields travel to the page, never the sources.
export const load = () => ({
  stages: STAGES.map((stage) => ({
    stage,
    boards: brainstorms
      .filter((b) => b.lifecycle === stage)
      .map(({ slug, date, title, status, lang }) => ({ slug, date, title, status, lang })),
  })),
});
