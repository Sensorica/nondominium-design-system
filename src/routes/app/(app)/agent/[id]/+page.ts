import { INITIAL_PERSONS } from '$lib/replica/mock';

/** The agent keys the prototype links to: every Person, plus the one initiator
 *  that deliberately has no Person entry. */
export const entries = () => [
  ...INITIAL_PERSONS.map((p) => ({ id: encodeURIComponent(p.agent_pub_key) })),
  { id: encodeURIComponent('uhCAkB2n6yP9cX3vZ7aD1fG5hJ8kM2nQ6sT9wY4bE7') }
];
