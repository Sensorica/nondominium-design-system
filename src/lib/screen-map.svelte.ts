// Screen-map glue: the shared open state ('m' and the sidebar both touch it)
// plus the grouped catalogue the overlay renders.
//
// Key resolution lives in surface-keys.ts. This module owns presentation of the
// catalogue and the representative URL for each key, so the comments pack and
// the screen map never depend on each other.
import { paths } from './paths';
import * as RECORDS from './records';
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
import { labelForKey, protoKey, SCREEN_SHAPE, screenKeyForUrl } from './surface-keys';
// The registry only: importing the store's logic here would pull its seed
// into every page that shows the map, the /app replica included.
import {
  DIRECTION_LIST,
  EXAMPLE_GROUP,
  EXAMPLE_NDO,
  type Direction,
  type DirectionSlug,
  type ViewOf
} from './prototypes/directions';

/** Representative URLs for the direction surfaces: the index, each direction's
 *  default view, and each other view pinned to an example record when it
 *  needs one. */
const PROTOTYPE_KEY_TO_URL: Record<string, string> = {
  prototypes: paths.prototypes(),
  ...Object.fromEntries(
    DIRECTION_LIST.flatMap((d) => {
      const slug = d.slug as DirectionSlug;
      return [
        [protoKey(slug), paths.protoDirection(slug)],
        ...d.views.slice(1).map((v) => [
          protoKey(slug, v.id),
          paths.protoView(slug, v.id as ViewOf<DirectionSlug>, {
            group: v.needs?.includes('group') ? EXAMPLE_GROUP : undefined,
            ndo: v.needs?.includes('ndo') ? EXAMPLE_NDO : undefined
          })
        ])
      ];
    })
  )
};

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
  'ndo-rule-edit': paths.ndoModal(NDO, 'rule-edit'),
  'ndo-spec-create': paths.ndoModal(NDO, 'spec-create'),
  'ndo-commitment': paths.ndoModal(NDO, 'commitment'),
  'ndo-event': paths.ndoModal(NDO, 'event'),
  'ndo-join': paths.ndoJoin(NDO),
  'ndo-hibernating': paths.ndoDetail(HIBERNATING_NDO),
  'ndo-deprecated': paths.ndoDetail(DEPRECATED_NDO),
  'ndo-terminal': paths.ndoDetail(TERMINAL_NDO),
  'ndo-bare': paths.ndoDetail(BARE_NDO),
  'ndo-missing': paths.ndoDetail(MISSING_NDO),
  'ndo-loading': paths.ndoState(NDO, 'loading'),
  'ndo-error': paths.ndoState(NDO, 'error'),
  'ndo-anonymous': paths.ndoState(NDO, 'anonymous'),

  'agent-profile': paths.agentProfile(AGENT),

  ...PROTOTYPE_KEY_TO_URL
};

/** The two halves of the catalogue: the replica of the running app at /app,
 *  and the six v0.1 UI directions under /prototypes. */
export type ScreenMapSection = 'app' | 'prototypes';

export const SECTION_TITLE: Record<ScreenMapSection, string> = {
  app: 'Current app',
  prototypes: 'Prototype directions'
};

export type ScreenMapGroup = {
  title: string;
  section: ScreenMapSection;
  keys: string[];
  /** Set on the prototype groups that are one direction each. */
  direction?: Direction;
};

/** Grouped the way the app itself is grouped, then the direction index and one
 *  group per direction. Every key here must exist in SCREEN_KEY_TO_URL. */
export const SCREEN_MAP_GROUPS: ScreenMapGroup[] = [
  { title: 'Connection', section: 'app', keys: ['connecting', 'connection-error', 'disconnected'] },
  {
    title: 'Lobby',
    section: 'app',
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
    title: 'Lobby · data states',
    section: 'app',
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
    section: 'app',
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
    section: 'app',
    keys: [
      'ndo-new',
      'ndo-resources',
      'ndo-governance',
      'ndo-composition',
      'ndo-activity',
      'ndo-lifecycle',
      'ndo-fork',
      'ndo-associate',
      'ndo-rule-edit',
      'ndo-spec-create',
      'ndo-commitment',
      'ndo-event',
      'ndo-join'
    ]
  },
  {
    title: 'NDO · lifecycle and data states',
    section: 'app',
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
  { title: 'Agents', section: 'app', keys: ['agent-profile'] },
  { title: 'Index', section: 'prototypes', keys: ['prototypes'] },
  ...DIRECTION_LIST.map(
    (d): ScreenMapGroup => ({
      title: `${d.id} ${d.name}`,
      section: 'prototypes',
      direction: d,
      keys: [protoKey(d.slug), ...d.views.slice(1).map((v) => protoKey(d.slug, v.id))]
    })
  )
];

export function sectionForKey(key: string): ScreenMapSection {
  return key === 'prototypes' || key.startsWith('proto:') ? 'prototypes' : 'app';
}

/** What kind of surface a key is, read off its URL so a new key is tagged for
 *  free. Not a list of keys: a list of the app's query params, and what each
 *  one opens. */
export type ScreenKind = 'page' | 'tab' | 'modal' | 'panel' | 'state' | 'record' | 'view';

export const KIND_LABEL: Record<ScreenKind, string> = {
  page: 'page',
  tab: 'tab',
  modal: 'modal',
  panel: 'panel',
  state: 'data state',
  record: 'record',
  view: 'view'
};

/** Checked in this order, so `?state=` wins over anything it is combined with. */
const PARAM_KIND: [param: string, kind: ScreenKind][] = [
  ['state', 'state'],
  ['modal', 'modal'],
  ['profile', 'modal'],
  ['editProfile', 'modal'],
  ['createNdo', 'modal'],
  ['groupProfile', 'modal'],
  // The sidebar's inline forms and the NDO membership panel open in place,
  // not over the page.
  ['openCreateGroup', 'panel'],
  ['openJoinGroup', 'panel'],
  ['group', 'panel'],
  ['join', 'panel'],
  ['tab', 'tab']
];

const RECORD_IDS = new Set<string>(Object.values(RECORDS));

/** True when the key's shape names one record rather than matching any id:
 *  the lifecycle screens, whose markup is a property of the record. */
const pinsRecord = (key: string): boolean =>
  SCREEN_SHAPE[key]?.path.split('/').some((seg) => RECORD_IDS.has(decodeURIComponent(seg))) ?? false;

export function kindForKey(key: string): ScreenKind {
  if (sectionForKey(key) === 'prototypes') return key === 'prototypes' ? 'page' : 'view';
  const url = SCREEN_KEY_TO_URL[key];
  if (!url) return 'page';
  const search = new URLSearchParams(url.split('?')[1] ?? '');
  for (const [param, kind] of PARAM_KIND) if (search.has(param)) return kind;
  return pinsRecord(key) ? 'record' : 'page';
}

export function urlForKey(key: string): string | undefined {
  return SCREEN_KEY_TO_URL[key];
}

export { labelForKey, screenKeyForUrl };
