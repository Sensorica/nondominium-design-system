// The representative records every keyed screen points at.
//
// Two modules need these and neither may import the other: surface-keys.ts
// resolves a URL to a key, screen-map.svelte.ts builds a URL from a key. They
// meet here.
//
// The choices are not arbitrary. A screen key earns its place only if it renders
// markup no other screen renders, and for the lifecycle screens that markup is a
// property of the record, not of the route — so the record is part of the key's
// identity. The hashes are the mock ones from replica/mock.ts.

/** Mature: resources, governance rules, events, and a six-step transition
 *  trail. Initiated by another agent, so its identity bar has no Advance
 *  button — which is why the lifecycle modal points elsewhere. */
export const NDO = 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h';

/** Initiated by the prototype's own agent, so transitions are offered. */
export const MY_NDO = 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6';

/** Hibernating, carrying `hibernation_origin: 'Active'` — the only record that
 *  renders the dormancy panel and names the stage it will resume to. */
export const HIBERNATING_NDO = 'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF';

/** Deprecated with a `successor_ndo_hash` — the only record that renders the
 *  successor panel and its link. */
export const DEPRECATED_NDO = 'uhC0kRq8d5zT2bE6fH1jL4nQ8sV3wY7aC0dG4hK';

/** EndOfLife, initiated by the prototype's agent. The only screen where the
 *  initiator is shown no Advance button, because the terminal stage is the one
 *  case `canTransition` excludes by stage rather than by authorship. */
export const TERMINAL_NDO = 'uhC0kYv1e7aU4cF9gJ3kM7pR1tW5xZ8bD2eH6jN';

/** Ideation, nothing attached: no resources, no rules, no events, no history.
 *  Renders the empty branch of all four tabs at once. */
export const BARE_NDO = 'uhC0kJh2b6vR9xZ4aC8dF1gJ5kM9nP3qS7tV0wY';

/** Deliberately absent from mock.ts. NdoView renders its not-found state, which
 *  the app reaches whenever a link outlives the record it points at. */
export const MISSING_NDO = 'uhC0kZzMissingRecord00000000000000000000';

/** The group with members, NDOs and a work log. */
export const GROUP = 'sensorica-lab-7f3a';

/** An agent with a Person entry, so the initiator link resolves to a name. */
export const AGENT = 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2';
