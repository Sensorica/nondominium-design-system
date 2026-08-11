// Screen-map glue: the shared open state ('m' and the sidebar both touch it)
// plus the grouped catalogue the overlay renders.
//
// Key resolution lives in surface-keys.ts. This module owns presentation of the
// catalogue and the representative URL for each key, so the comments pack and
// the screen map never depend on each other.
import { paths } from './paths';
import { labelForKey, screenKeyForUrl } from './surface-keys';

export const screenMap = $state({ open: false });

/** Representative records, chosen so every entry lands on a fully rendered
 *  screen. The solar array is mature (resources, rules, events, a transition
 *  trail) but was initiated by someone else, so its identity bar has no
 *  transition button; the router cell was initiated by the prototype's agent,
 *  which is why the lifecycle modal points there. */
const NDO = 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h';
const MY_NDO = 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6';
const GROUP = 'sensorica-lab-7f3a';
const AGENT = 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2';

export const SCREEN_KEY_TO_URL: Record<string, string> = {
  connecting: paths.connecting(),
  'connection-error': paths.connectionError(),
  disconnected: paths.disconnected(),

  lobby: paths.appHome(),
  'lobby-profile-setup': paths.lobbyProfileSetup(),
  'lobby-edit-profile': paths.lobbyEditProfile(),
  'lobby-create-group': paths.lobbyCreateGroup(),
  'lobby-join-group': paths.lobbyJoinGroup(),

  'group-detail': paths.groupDetail(GROUP),
  'group-create-ndo': paths.groupCreateNdo(GROUP),
  'group-profile': paths.groupProfile(GROUP),

  'ndo-new': paths.ndoNew(),
  'ndo-resources': paths.ndoDetail(NDO),
  'ndo-governance': paths.ndoTab(NDO, 'governance'),
  'ndo-composition': paths.ndoTab(NDO, 'composition'),
  'ndo-activity': paths.ndoTab(NDO, 'activity'),
  'ndo-lifecycle': paths.ndoModal(MY_NDO, 'lifecycle'),
  'ndo-fork': paths.ndoModal(NDO, 'fork'),
  'ndo-associate': paths.ndoModal(NDO, 'associate'),
  'ndo-join': paths.ndoJoin(NDO),

  'agent-profile': paths.agentProfile(AGENT)
};

export type ScreenMapGroup = { title: string; keys: string[] };

/** Grouped the way the app itself is grouped. Every key here must exist in
 *  SCREEN_KEY_TO_URL. */
export const SCREEN_MAP_GROUPS: ScreenMapGroup[] = [
  { title: 'Connection', keys: ['connecting', 'connection-error', 'disconnected'] },
  {
    title: 'Lobby',
    keys: ['lobby', 'lobby-profile-setup', 'lobby-edit-profile', 'lobby-create-group', 'lobby-join-group']
  },
  { title: 'Groups', keys: ['group-detail', 'group-create-ndo', 'group-profile'] },
  {
    title: 'NDO',
    keys: [
      'ndo-new',
      'ndo-resources',
      'ndo-governance',
      'ndo-composition',
      'ndo-activity',
      'ndo-lifecycle',
      'ndo-fork',
      'ndo-associate',
      'ndo-join'
    ]
  },
  { title: 'Agents', keys: ['agent-profile'] }
];

export function urlForKey(key: string): string | undefined {
  return SCREEN_KEY_TO_URL[key];
}

export { labelForKey, screenKeyForUrl };
