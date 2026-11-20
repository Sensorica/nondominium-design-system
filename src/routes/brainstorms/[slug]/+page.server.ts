import { error, redirect } from '@sveltejs/kit';
import { brainstorms, brainstormBySlug } from '$lib/brainstorms';
import { architectureBoards, architectureBySlug } from '$lib/architecture';
import { paths } from '$lib/paths';

// 'auto', not the layout's `true`: with no board in content/brainstorms/ there is
// no slug to prerender, and `true` fails the build over a route it found no link
// to. 'auto' prerenders every slug in `entries` and lets the empty case pass.
export const prerender = 'auto';

// Architecture boards lived here before they got /architecture. Their old slugs
// stay prerendered as redirects (a static page: GitHub Pages has no _redirects),
// so every link ever shared still lands on the board.
export const entries = () => [...brainstorms, ...architectureBoards].map((b) => ({ slug: b.slug }));

export const load = ({ params }) => {
  if (architectureBySlug(params.slug)) redirect(308, paths.architectureBoard(params.slug));
  const b = brainstormBySlug(params.slug);
  if (!b) error(404, 'No such brainstorm');
  const { haystack: _, ...brainstorm } = b;
  return { brainstorm };
};
