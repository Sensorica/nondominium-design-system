// Screen-map glue: the shared open state ('m' and the sidebar both touch it)
// plus the grouped catalogue the overlay renders.
//
// Key resolution lives in surface-keys.ts. This module owns presentation of the
// catalogue and the representative URL for each key, so the comments pack and
// the screen map never depend on each other.
import { paths } from './paths';
import {
  AGENT,
  BARE_NDO,
  DEPRECATED_NDO,
  GROUP,
  HIBERNATING_NDO,
  MISSING_NDO,
  MY_NDO,
  NDO,
  TERMINAL_NDO
} from './records';
import { labelForKey, screenKeyForUrl } from './surface-keys';

export const screenMap = $state({ open: false });

export const SCREEN_KEY_TO_URL: Record<string, string> = {
  connecting: paths.connecting(),
  'connection-error': paths.connectionError(),
  disconnected: paths.disconnected(),

  lobby: paths.appHome(),
  'lobby-profile-setup': paths.lobbyProfileSetup(),
  'lobby-edit-profile': paths.lobbyEditProfile(),
  'lobby-create-group': paths.lobbyCreateGroup(),
  'lobby-join-group': paths.lobbyJoinGroup(),
  'lobby-invite': paths.lobbyInvite(GROUP),
  'lobby-loading': paths.lobbyState('loading'),
  'lobby-error': paths.lobbyState('error'),
  'lobby-empty': paths.lobbyState('empty'),
  'lobby-onboarding': paths.lobbyState('onboarding'),
  'lobby-filtered': paths.lobbyState('filtered'),
  'lobby-filtered-empty': paths.lobbyState('filtered-empty'),
  'lobby-no-profile': paths.lobbyState('no-profile'),

  'group-detail': paths.groupDetail(GROUP),
  'group-create-ndo': paths.groupCreateNdo(GROUP),
  'group-profile': paths.groupProfile(GROUP),
  'group-loading': paths.groupState(GROUP, 'loading'),
  'group-error': paths.groupState(GROUP, 'error'),
  'group-empty': paths.groupState(GROUP, 'empty'),

  'ndo-new': paths.ndoNew(),
  'ndo-resources': paths.ndoDetail(NDO),
  'ndo-governance': paths.ndoTab(NDO, 'governance'),
  'ndo-composition': paths.ndoTab(NDO, 'composition'),
  'ndo-activity': paths.ndoTab(NDO, 'activity'),
  'ndo-lifecycle': paths.ndoModal(MY_NDO, 'lifecycle'),
  'ndo-fork': paths.ndoModal(NDO, 'fork'),
  'ndo-associate': paths.ndoModal(NDO, 'associate'),
  'ndo-join': paths.ndoJoin(NDO),
  'ndo-hibernating': paths.ndoDetail(HIBERNATING_NDO),
  'ndo-deprecated': paths.ndoDetail(DEPRECATED_NDO),
  'ndo-terminal': paths.ndoDetail(TERMINAL_NDO),
  'ndo-bare': paths.ndoDetail(BARE_NDO),
  'ndo-missing': paths.ndoDetail(MISSING_NDO),
  'ndo-loading': paths.ndoState(NDO, 'loading'),
  'ndo-error': paths.ndoState(NDO, 'error'),
  'ndo-anonymous': paths.ndoState(NDO, 'anonymous'),

  'agent-profile': paths.agentProfile(AGENT)
};

export type ScreenMapGroup = { title: string; keys: string[] };

/** Grouped the way the app itself is grouped. Every key here must exist in
 *  SCREEN_KEY_TO_URL. */
export const SCREEN_MAP_GROUPS: ScreenMapGroup[] = [
  { title: 'Connection', keys: ['connecting', 'connection-error', 'disconnected'] },
  {
    title: 'Lobby',
    keys: [
      'lobby',
      'lobby-profile-setup',
      'lobby-edit-profile',
      'lobby-create-group',
      'lobby-join-group',
      'lobby-invite'
    ]
  },
  {
    title: 'Lobby — data states',
    keys: [
      'lobby-loading',
      'lobby-error',
      'lobby-empty',
      'lobby-onboarding',
      'lobby-filtered',
      'lobby-filtered-empty',
      'lobby-no-profile'
    ]
  },
  {
    title: 'Groups',
    keys: [
      'group-detail',
      'group-create-ndo',
      'group-profile',
      'group-loading',
      'group-error',
      'group-empty'
    ]
  },
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
  {
    title: 'NDO — lifecycle and data states',
    keys: [
      'ndo-hibernating',
      'ndo-deprecated',
      'ndo-terminal',
      'ndo-bare',
      'ndo-missing',
      'ndo-loading',
      'ndo-error',
      'ndo-anonymous'
    ]
  },
  { title: 'Agents', keys: ['agent-profile'] }
];

export function urlForKey(key: string): string | undefined {
  return SCREEN_KEY_TO_URL[key];
}

export { labelForKey, screenKeyForUrl };
