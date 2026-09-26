// The registry of the six UI directions from the v0.1 prototype handoff.
//
// CHOOSING A DIRECTION IS EDITING ONE FIELD. To pick the direction Tibi
// implements against the real hApp, set its `status` to 'target'. To shelve
// one, set it to 'archived'. Change nothing else: the index page, the route
// banners and the "Current app versus target" section all read this field. At most
// one direction should be 'target' at a time.
//
// Everything else here is descriptive and comes from the handoff README
// (docs/prototypes/HANDOFF.md) and the direction sources it describes.

export type DirectionStatus = 'candidate' | 'target' | 'archived';
export type Fidelity = 'mid' | 'high';

/** Where a direction keeps its state. 'shared' directions (A to E) run on the
 *  one store in src/lib/prototypes/store, so an action taken in one shows up in
 *  the others. 'own' (F) ports its own mock backend into its folder. */
export type StoreKind = 'shared' | 'own';

export interface DirectionView {
  /** The value of the `view` query param. The first view is the default and
   *  is served at the bare direction URL, with no param. */
  id: string;
  label: string;
  /** Extra query params the view needs to say which record it shows. */
  needs?: readonly ('ndo' | 'group')[];
}

export interface Direction {
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  slug: string;
  name: string;
  pitch: string;
  fidelity: Fidelity;
  tries: string;
  store: StoreKind;
  views: readonly DirectionView[];
  status: DirectionStatus;
}

export const DIRECTIONS = [
  {
    id: 'A',
    slug: 'mycelium',
    name: 'Mycelium',
    pitch: 'A living field of resources that glow with recent activity, with trails you can fade.',
    fidelity: 'mid',
    tries:
      'A 64px icon rail, a fluid field of NDO nodes that glow with recent activity, and a 380px detail panel. Links show use, citations and hard links, and a fade slider (1 to 90 days) sets how long trails stay visible. A status bar shows peers, the offline toggle and queued traces.',
    store: 'shared',
    views: [
      { id: 'field', label: 'Field' },
      { id: 'signals', label: 'Signals' },
      { id: 'traces', label: 'Traces' },
      { id: 'you', label: 'You' }
    ],
    status: 'candidate'
  },
  {
    id: 'B',
    slug: 'field-notes',
    name: 'Field Notes',
    pitch: 'A searchable register where each resource reads like a page in a shared notebook.',
    fidelity: 'mid',
    tries:
      'A 300px searchable index grouped by group, a centre page for the NDO, and a side column for "Left here for you" and receipts. The page has four tabs: the trail, rules and items, requests, and linked resources.',
    store: 'shared',
    views: [
      { id: 'trail', label: 'The trail' },
      { id: 'rules', label: 'Rules & items' },
      { id: 'requests', label: 'Requests' },
      { id: 'linked', label: 'Linked' }
    ],
    status: 'candidate'
  },
  {
    id: 'C',
    slug: 'instrument',
    name: 'Instrument',
    pitch: 'A technical bench: one resource at a time, with everything attached to it wired in.',
    fidelity: 'mid',
    tries:
      'Every NDO in a scrolling top bar plus Browse. A spec sheet on the left (stage, ownership, type, use, rules, items with holders, needs attention, requests) and a bench diagram of everything attached to the NDO, with a 30-day activity chart below it.',
    store: 'shared',
    views: [{ id: 'bench', label: 'Bench and spec sheet' }],
    status: 'candidate'
  },
  {
    id: 'D',
    slug: 'signal-board',
    name: 'Signal Board',
    pitch: 'A board of what needs doing, derived from the data, never assigned by anyone.',
    fidelity: 'mid',
    tries:
      'Columns for Needs hands, Available now and Needs eyes, all derived from real data, plus a "Just happened" activity column. Group scope chips for the first three groups and a select for the rest. A card opens a drawer for its resource with requests, activity and linked resources.',
    store: 'shared',
    views: [
      { id: 'board', label: 'Board' },
      { id: 'drawer', label: 'Resource drawer', needs: ['ndo'] }
    ],
    status: 'candidate'
  },
  {
    id: 'E',
    slug: 'holarchy',
    name: 'Holarchy',
    pitch: 'Zoom from the lobby into a group and into a resource, as nested rings.',
    fidelity: 'mid',
    tries:
      'Zoomable Lobby, Group and NDO rings. Groups are laid out on a grid for any number; a group with more than 12 NDOs uses two rings; scrolling down goes up a level. The NDO view shows concentric rings for identity, rules, items and linked resources, with a summary card for each ring.',
    store: 'shared',
    views: [
      { id: 'lobby', label: 'Lobby level' },
      { id: 'group', label: 'Group level', needs: ['group'] },
      { id: 'ndo', label: 'Resource level', needs: ['group', 'ndo'] }
    ],
    status: 'candidate'
  },
  {
    id: 'F',
    slug: 'flow-graph',
    name: 'Flow Graph',
    pitch: 'The DHT itself, laid out in ValueFlows lanes, seen from the whole network or one conductor.',
    fidelity: 'high',
    tries:
      'Eight columns in ValueFlows order (groups, people, shared resources, rules, items, promises, what happened, receipts), each card a source-chain entry and each arrow a reference. The header switches between the whole network and each of two conductors; entries that have not arrived show dashed, and private receipts appear only on their owner\'s conductor. Every action is a real zome call on its own mock backend.',
    store: 'own',
    views: [
      { id: 'network', label: 'Whole network' },
      { id: 'conductor-a', label: 'Conductor a' },
      { id: 'conductor-b', label: 'Conductor b' }
    ],
    status: 'candidate'
  }
] as const satisfies readonly Direction[];

export type DirectionSlug = (typeof DIRECTIONS)[number]['slug'];
export type DirectionId = (typeof DIRECTIONS)[number]['id'];
export type ViewOf<S extends DirectionSlug> = Extract<
  (typeof DIRECTIONS)[number],
  { slug: S }
>['views'][number]['id'];

/** The registry widened to the plain interface, so status comparisons type-check. */
export const DIRECTION_LIST: readonly Direction[] = DIRECTIONS;

export const directionBySlug = (slug: string): Direction | undefined =>
  DIRECTION_LIST.find((d) => d.slug === slug);

export const defaultView = (slug: DirectionSlug): string => directionBySlug(slug)!.views[0].id;

/** The chosen direction, if any. More than one 'target' is a registry error;
 *  the first one wins and the index says so. */
export const targets = (): Direction[] => DIRECTION_LIST.filter((d) => d.status === 'target');
