import { error } from '@sveltejs/kit';
import { meetings, meetingBySlug, originalBySlug } from '$lib/meetings';

// 'auto', not the layout's `true`: with no journal in content/meetings/ there is
// no slug to prerender, and `true` fails the build over a route it found no link
// to. 'auto' prerenders every slug in `entries` and lets the empty case pass.
export const prerender = 'auto';

// Server load, so the journals are read at build time and never ship in the client bundle.
export const entries = () => meetings.map((m) => ({ slug: m.slug }));

export const load = ({ params }) => {
  const meeting = meetingBySlug(params.slug);
  if (!meeting) error(404, 'No such meeting');
  return { meeting, original: originalBySlug(params.slug) ?? null };
};
