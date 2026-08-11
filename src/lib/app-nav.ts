// Routing glue between the joining guard's status machine and the URL tree.
//
// The guard speaks in route KEYS (`routeForStatus` → 'profile-setup', 'lobby', …);
// the router speaks in URLs. These two maps are inverse-consistent: forward maps
// a status's route key to a URL (used by the app layout's redirect effect),
// reverse maps a gate URL back to the status it demonstrates (used by the gate
// layout to seed a cold load). Because `routeForStatus` is a fixed point,
// seeding a status on a gate page and then redirecting on that status lands on
// the same URL — no loop.
//
// All URLs come from `paths`. A route restructure changes that module, not this
// one.
import { paths } from './paths';
import type { JoiningStatus } from './guards/useJoiningGuard.svelte';

/** Guard route key → URL. Keys are exactly the values `routeForStatus` returns. */
export const ROUTE_KEY_TO_URL: Record<string, string> = {
  connecting: paths.connecting(),
  'profile-setup': paths.profileSetup(),
  'invite-landing': paths.inviteLanding('gr2'),
  'group-profile': paths.groupProfile('gr1'),
  'profile-guard': paths.profileGuard(),
  lobby: paths.appHome(),
};

/** Gate URL (pathname) → the JoiningStatus that page demonstrates. Used by the
 *  (gate) layout so a cold-loaded or deep-linked gate renders fully. Only gate
 *  URLs appear here: `lobby` is where the ladder stops steering, so it has no
 *  single status to seed. */
export const PATH_TO_STATUS: Record<string, JoiningStatus> = {
  [paths.connecting()]: 'connecting',
  [paths.profileSetup()]: 'no-lobby-profile',
  [paths.inviteLanding('gr2').split('?')[0]]: 'invited',
  [paths.profileGuard()]: 'needs-person',
  [paths.groupProfile('gr1')]: 'group-undisclosed',
};
