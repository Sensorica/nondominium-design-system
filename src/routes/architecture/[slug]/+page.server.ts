import { error } from '@sveltejs/kit';
import { architectureBoards, architectureBySlug } from '$lib/architecture';

// 'auto', not the layout's `true`: with no board in content/architecture/ there is
// no slug to prerender, and `true` fails the build over a route it found no link
// to. 'auto' prerenders every slug in `entries` and lets the empty case pass.
export const prerender = 'auto';

export const entries = () => architectureBoards.map((b) => ({ slug: b.slug }));

export const load = ({ params }) => {
  const b = architectureBySlug(params.slug);
  if (!b) error(404, 'No such architecture board');
  const { haystack: _, ...board } = b;
  return { board };
};
