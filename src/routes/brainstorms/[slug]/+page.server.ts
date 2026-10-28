import { error } from '@sveltejs/kit';
import { brainstorms, brainstormBySlug } from '$lib/brainstorms';

// 'auto', not the layout's `true`: with no board in content/brainstorms/ there is
// no slug to prerender, and `true` fails the build over a route it found no link
// to. 'auto' prerenders every slug in `entries` and lets the empty case pass.
export const prerender = 'auto';

export const entries = () => brainstorms.map((b) => ({ slug: b.slug }));

export const load = ({ params }) => {
  const b = brainstormBySlug(params.slug);
  if (!b) error(404, 'No such brainstorm');
  const { haystack: _, ...brainstorm } = b;
  return { brainstorm };
};
