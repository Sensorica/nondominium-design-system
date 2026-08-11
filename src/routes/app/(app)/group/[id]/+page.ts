import { INITIAL_GROUPS } from '$lib/replica/mock';

export const entries = () => INITIAL_GROUPS.map((g) => ({ id: g.id }));
