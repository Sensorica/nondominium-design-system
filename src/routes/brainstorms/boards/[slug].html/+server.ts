import { redirect } from '@sveltejs/kit';
import { architectureBoards, architectureBySlug } from '$lib/architecture';
import { paths } from '$lib/paths';

// The compiled architecture boards used to sit at /brainstorms/boards/<slug>.html.
// Each old file name stays prerendered as a redirect page to the board's new full
// page. Every other compiled brainstorm is a plain static file and never reaches
// this route.
export const prerender = true;

export const entries = () => architectureBoards.map((b) => ({ slug: b.slug }));

export const GET = ({ params }) => {
  if (architectureBySlug(params.slug)) redirect(308, paths.architectureBoardFile(params.slug));
  return new Response('Not found', { status: 404 });
};
