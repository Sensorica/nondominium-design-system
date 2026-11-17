import { error } from '@sveltejs/kit';
import { releases, releaseBySlug } from '$lib/releases';

// Server load, as for the meetings: the board's data is read at build time and never
// ships in the client bundle. 'auto' prerenders every slug in `entries`.
export const prerender = 'auto';

export const entries = () => releases.map((r) => ({ slug: r.slug }));

export const load = ({ params }) => {
  const board = releaseBySlug(params.slug);
  if (!board) error(404, 'No such release board');
  return { board };
};
