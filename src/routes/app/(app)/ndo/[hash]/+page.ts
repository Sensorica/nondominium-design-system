import { INITIAL_NDOS } from '$lib/replica/mock';

/** Every NDO in the mock set, so each detail page prerenders and hydrates. */
export const entries = () => INITIAL_NDOS.map((n) => ({ hash: encodeURIComponent(n.hash) }));
