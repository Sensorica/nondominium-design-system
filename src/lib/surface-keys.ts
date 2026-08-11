// Surface keys: the stable identity of every commentable / navigable surface.
//
// A surface is anything something else needs to point at by name rather than by
// URL: the screen-map catalogue, a comment thread, the parity inventory. URLs
// change; keys must not.
//
// Two namespaces, one resolver:
//   screen keys     'ndo-governance'          (prototype app states)
//   scenario keys   'scenario:lobby-browse'   (composed showcase pages)
//
// Resolution is URL-aware, not pathname-aware, because in this prototype a
// modal, a tab and a panel are query-param states of the same route. Keeping
// them out of the path is what lets the replica components stay byte-identical
// to the app's, which is the whole point.
import { paths } from './paths';

/** A surface's shape: a route pattern with `:id` for any single segment, plus
 *  the query params that must be present for the key to match. */
type Shape = { path: string; params?: Record<string, string> };

const shapeOf = (url: string): Shape => {
  const [path, query] = url.split('?');
  if (!query) return { path };
  const params: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(query)) params[k] = v;
  return { path, params };
};

const withId = (url: string, sentinel: string): Shape => {
  const s = shapeOf(url);
  return { ...s, path: s.path.replace(encodeURIComponent(sentinel), ':id') };
};

const ID = '__ID__';

/** Screen key → the shape that identifies it. */
export const SCREEN_SHAPE: Record<string, Shape> = {
  // Connection states — the screens nobody can demo in a running app.
  connecting: shapeOf(paths.connecting()),
  'connection-error': shapeOf(paths.connectionError()),
  disconnected: shapeOf(paths.disconnected()),

  // Lobby
  lobby: shapeOf(paths.appHome()),
  'lobby-profile-setup': shapeOf(paths.lobbyProfileSetup()),
  'lobby-edit-profile': shapeOf(paths.lobbyEditProfile()),
  'lobby-create-group': shapeOf(paths.lobbyCreateGroup()),
  'lobby-join-group': shapeOf(paths.lobbyJoinGroup()),

  // Groups
  'group-detail': withId(paths.groupDetail(ID), ID),
  'group-create-ndo': withId(paths.groupCreateNdo(ID), ID),
  'group-profile': withId(paths.groupProfile(ID), ID),

  // NDO — one route, seven states
  'ndo-new': shapeOf(paths.ndoNew()),
  'ndo-resources': withId(paths.ndoDetail(ID), ID),
  'ndo-governance': withId(paths.ndoTab(ID, 'governance'), ID),
  'ndo-composition': withId(paths.ndoTab(ID, 'composition'), ID),
  'ndo-activity': withId(paths.ndoTab(ID, 'activity'), ID),
  'ndo-lifecycle': withId(paths.ndoModal(ID, 'lifecycle'), ID),
  'ndo-fork': withId(paths.ndoModal(ID, 'fork'), ID),
  'ndo-associate': withId(paths.ndoModal(ID, 'associate'), ID),
  'ndo-join': withId(paths.ndoJoin(ID), ID),

  // Agents
  'agent-profile': withId(paths.agentProfile(ID), ID)
};

/** Scenario route → scenario key. Exact path match. */
export const SCENARIO_KEY: Record<string, string> = {
  [paths.scenarioLobbyBrowse()]: 'scenario:lobby-browse',
  [paths.scenarioNdoCreation()]: 'scenario:ndo-creation',
  [paths.scenarioNdoLifecycle()]: 'scenario:ndo-lifecycle',
  [paths.scenarioGroupCollaboration()]: 'scenario:group-collaboration',
  [paths.scenarioAgentIdentity()]: 'scenario:agent-identity',
  [paths.scenarioGovernanceReview()]: 'scenario:governance-review'
};

/** Human labels, for drawer headers and catalogue entries. */
export const KEY_LABEL: Record<string, string> = {
  connecting: 'Connecting to the conductor',
  'connection-error': 'Connection failed',
  disconnected: 'Not connected',
  lobby: 'Lobby — Browse NDOs',
  'lobby-profile-setup': 'Lobby profile setup (first launch)',
  'lobby-edit-profile': 'Edit Lobby profile',
  'lobby-create-group': 'Create group (sidebar)',
  'lobby-join-group': 'Join group (sidebar)',
  'group-detail': 'Group view',
  'group-create-ndo': 'Create NDO',
  'group-profile': 'Group disclosure choice',
  'ndo-new': 'New NDO without a group',
  'ndo-resources': 'NDO — Resources tab',
  'ndo-governance': 'NDO — Governance tab',
  'ndo-composition': 'NDO — Composition tab',
  'ndo-activity': 'NDO — Activity tab',
  'ndo-lifecycle': 'Advance lifecycle stage',
  'ndo-fork': 'Fork this NDO',
  'ndo-associate': 'Associate with a group',
  'ndo-join': 'NDO membership panel',
  'agent-profile': 'Agent profile (not implemented in the app)',
  'scenario:lobby-browse': 'Lobby browse scenario',
  'scenario:ndo-creation': 'NDO creation scenario',
  'scenario:ndo-lifecycle': 'NDO lifecycle scenario',
  'scenario:group-collaboration': 'Group collaboration scenario',
  'scenario:agent-identity': 'Agent identity scenario',
  'scenario:governance-review': 'Governance review scenario'
};

function pathMatches(pathname: string, pattern: string): boolean {
  const a = pathname.split('/');
  const b = pattern.split('/');
  if (a.length !== b.length) return false;
  return b.every((seg, i) => (seg === ':id' ? a[i].length > 0 : seg === a[i]));
}

function paramsMatch(search: URLSearchParams, want: Record<string, string> | undefined): boolean {
  if (!want) return true;
  return Object.entries(want).every(([k, v]) => search.get(k) === v);
}

/**
 * Screen key for a URL. Exact path arity, then required query params. The most
 * specific match wins: more concrete path segments first, then more required
 * params — so `/app/ndo/x?modal=fork` is `ndo-fork` rather than `ndo-resources`,
 * and `/app/ndo/new` is `ndo-new` rather than `ndo-resources`.
 *
 * '' means "not a keyed surface": no catalogue entry, no comment thread.
 */
export function screenKeyForUrl(url: URL): string {
  let bestKey = '';
  let bestScore = -1;
  for (const [key, shape] of Object.entries(SCREEN_SHAPE)) {
    if (!pathMatches(url.pathname, shape.path)) continue;
    if (!paramsMatch(url.searchParams, shape.params)) continue;
    const concrete = shape.path.split('/').filter((s) => s !== ':id').length;
    const score = concrete * 10 + Object.keys(shape.params ?? {}).length;
    if (score > bestScore) {
      bestKey = key;
      bestScore = score;
    }
  }
  return bestKey;
}

/** Unified resolver across both namespaces. Scenario paths match exactly and
 *  win, because they are the more specific namespace. */
export function surfaceKeyForUrl(url: URL): string {
  const scenario = SCENARIO_KEY[url.pathname];
  if (scenario) return scenario;
  return screenKeyForUrl(url);
}

/** Label for a resolved key; falls back to the key itself. */
export function labelForKey(key: string): string {
  return KEY_LABEL[key] ?? key;
}
