import { MISSING_NDO } from '$lib/records';
import { INITIAL_NDOS } from '$lib/replica/mock';

/** Every NDO in the mock set, so each detail page prerenders and hydrates, plus
 *  one hash with no record behind it — the not-found screen needs a page to
 *  render on, and by definition its hash is not in the mock set. */
export const entries = () => [
  ...INITIAL_NDOS.map((n) => ({ hash: encodeURIComponent(n.hash) })),
  { hash: encodeURIComponent(MISSING_NDO) }
];
