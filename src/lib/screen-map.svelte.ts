// Screen-map glue: the shared open state (NavBar button and the 'm' shortcut
// both touch it) plus the grouped catalogue the overlay renders.
//
// Key resolution itself lives in surface-keys.ts. This module owns presentation
// of the catalogue and nothing else, so the comments pack and the screen map
// never depend on each other.
import { SCREEN_KEY_TO_URL, labelForKey, screenKeyForPath } from './surface-keys';

export const screenMap = $state({ open: false });

export type ScreenMapGroup = { title: string; icon: string; keys: string[] };

/** The catalogue, grouped the way the prototype's route groups are grouped.
 *  Every key here must exist in SCREEN_KEY_TO_URL; `Sync` checks that. */
export const SCREEN_MAP_GROUPS: ScreenMapGroup[] = [
  {
    title: 'Gates',
    icon: '🚪',
    keys: ['connecting', 'profile-setup', 'invite-landing', 'profile-guard'],
  },
  {
    title: 'Lobby',
    icon: '🏛️',
    keys: ['lobby', 'profile', 'profile-edit', 'agents', 'agent-profile'],
  },
  {
    title: 'Groups',
    icon: '👥',
    keys: [
      'groups',
      'group-create',
      'group-join',
      'group-detail',
      'group-members',
      'group-work-log',
      'group-links',
      'group-profile',
    ],
  },
  {
    title: 'NDOs',
    icon: '🧿',
    keys: [
      'ndo-create',
      'ndo-detail',
      'ndo-activity',
      'ndo-composition',
      'ndo-governance',
      'ndo-resources',
      'ndo-lifecycle',
      'ndo-history',
      'ndo-fork',
      'ndo-associate',
    ],
  },
];

export function urlForKey(key: string): string | undefined {
  return SCREEN_KEY_TO_URL[key];
}

export { labelForKey, screenKeyForPath };
