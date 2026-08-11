// Surface keys: the stable identity of every commentable / navigable surface.
//
// A "surface" is a page something else needs to point at by name rather than by
// URL: the screen-map catalogue, a comment thread, the parity inventory. URLs
// change; keys must not.
//
// Two namespaces, one resolver:
//   screen keys     'ndo-detail'              (prototype app screens)
//   scenario keys   'scenario:lobby-browse'   (composed showcase pages)
//
// This module owns key resolution and NOTHING else. It must not import the
// screen-map overlay, the comments client, or any UI. Packs that need a key
// depend on this module, never on each other.
//
// All URLs come from `paths`, so keys resolve identically in dev and under the
// GitHub Pages base prefix.
import { paths } from './paths';

/** Screen key → canonical URL. Detail screens point at a representative record
 *  so every catalogue entry lands on a fully rendered page: `ndo-detail` at a
 *  mature NDO, `ndo-lifecycle` at one mid-ladder, `ndo-history` at the only NDO
 *  with a seeded transition trail. */
export const SCREEN_KEY_TO_URL: Record<string, string> = {
  // ── Gates (the identity ladder) ──
  connecting: paths.connecting(),
  'profile-setup': paths.profileSetup(),
  'profile-guard': paths.profileGuard(),
  'invite-landing': paths.inviteLanding('gr2'),

  // ── Lobby & self ──
  lobby: paths.appHome(),
  profile: paths.profile(),
  'profile-edit': paths.profileEdit(),

  // ── Agents ──
  agents: paths.agents(),
  'agent-profile': paths.agentProfile('ag3'),

  // ── Groups ──
  groups: paths.groups(),
  'group-create': paths.groupCreate(),
  'group-join': paths.groupJoin(),
  'group-detail': paths.groupDetail('gr1'),
  'group-members': paths.groupMembers('gr1'),
  'group-work-log': paths.groupWorkLog('gr1'),
  'group-links': paths.groupLinks('gr1'),
  'group-profile': paths.groupProfile('gr1'),

  // ── NDOs ──
  'ndo-create': paths.ndoCreate('gr1'),
  'ndo-detail': paths.ndoDetail('ndo1'),
  'ndo-activity': paths.ndoActivity('ndo1'),
  'ndo-composition': paths.ndoComposition('ndo3'),
  'ndo-governance': paths.ndoGovernance('ndo1'),
  'ndo-resources': paths.ndoResources('ndo1'),
  'ndo-lifecycle': paths.ndoLifecycle('ndo4'),
  'ndo-history': paths.ndoHistory('ndo1'),
  'ndo-fork': paths.ndoFork('ndo3'),
  'ndo-associate': paths.ndoAssociate('ndo7'),
};

/** Scenario route → scenario key. Exact match, base-prefixed. */
export const SCENARIO_KEY: Record<string, string> = {
  [paths.scenarioLobbyBrowse()]: 'scenario:lobby-browse',
  [paths.scenarioNdoCreation()]: 'scenario:ndo-creation',
  [paths.scenarioNdoLifecycle()]: 'scenario:ndo-lifecycle',
  [paths.scenarioGroupCollaboration()]: 'scenario:group-collaboration',
  [paths.scenarioAgentIdentity()]: 'scenario:agent-identity',
  [paths.scenarioGovernanceReview()]: 'scenario:governance-review',
};

/**
 * Screen key → route SHAPE, with `:id` standing in for any single segment.
 *
 * This exists because the catalogue above points at representative records
 * (`ndo-detail` → ndo1), and a reader on ndo5 is still on the ndo-detail screen.
 * Resolving by URL prefix alone would fail them twice over: `/app/ndo/ndo5`
 * does not start with `/app/ndo/ndo1`, and `lobby` — whose URL is `/app` — is a
 * prefix of every app path, so it would swallow the lot and file their comment
 * on the wrong thread.
 *
 * Shapes are built from `paths` with a sentinel id, so a route restructure
 * updates them for free.
 */
const shape = (url: string) => url.split('?')[0];

export const SCREEN_KEY_PATTERN: Record<string, string> = {
  connecting: shape(paths.connecting()),
  'profile-setup': shape(paths.profileSetup()),
  'profile-guard': shape(paths.profileGuard()),
  'invite-landing': shape(paths.inviteLanding()),

  lobby: shape(paths.appHome()),
  profile: shape(paths.profile()),
  'profile-edit': shape(paths.profileEdit()),

  agents: shape(paths.agents()),
  'agent-profile': shape(paths.agentProfile(':id')),

  groups: shape(paths.groups()),
  'group-create': shape(paths.groupCreate()),
  'group-join': shape(paths.groupJoin()),
  'group-detail': shape(paths.groupDetail(':id')),
  'group-members': shape(paths.groupMembers(':id')),
  'group-work-log': shape(paths.groupWorkLog(':id')),
  'group-links': shape(paths.groupLinks(':id')),
  'group-profile': shape(paths.groupProfile(':id')),

  'ndo-create': shape(paths.ndoCreate()),
  'ndo-detail': shape(paths.ndoDetail(':id')),
  'ndo-activity': shape(paths.ndoActivity(':id')),
  'ndo-composition': shape(paths.ndoComposition(':id')),
  'ndo-governance': shape(paths.ndoGovernance(':id')),
  'ndo-resources': shape(paths.ndoResources(':id')),
  'ndo-lifecycle': shape(paths.ndoLifecycle(':id')),
  'ndo-history': shape(paths.ndoHistory(':id')),
  'ndo-fork': shape(paths.ndoFork(':id')),
  'ndo-associate': shape(paths.ndoAssociate(':id')),
};

/** Human labels, for drawer headers and catalogue entries. */
export const KEY_LABEL: Record<string, string> = {
  connecting: 'Connecting to the conductor',
  'profile-setup': 'Lobby profile setup (level 1)',
  'profile-guard': 'Person entry required (level 3)',
  'invite-landing': 'Group invite landing',
  lobby: 'Lobby — NDO browser',
  profile: 'My lobby profile',
  'profile-edit': 'Edit lobby profile',
  agents: 'Agent directory',
  'agent-profile': 'Agent profile',
  groups: 'My groups',
  'group-create': 'Create a group',
  'group-join': 'Join a group',
  'group-detail': 'Group view',
  'group-members': 'Group members',
  'group-work-log': 'Group work log',
  'group-links': 'Group soft links',
  'group-profile': 'Group disclosure choice (level 2)',
  'ndo-create': 'Create an NDO',
  'ndo-detail': 'NDO identity panel',
  'ndo-activity': 'NDO activity tab',
  'ndo-composition': 'NDO composition tab',
  'ndo-governance': 'NDO governance tab',
  'ndo-resources': 'NDO resources tab',
  'ndo-lifecycle': 'NDO lifecycle transition',
  'ndo-history': 'NDO transition history',
  'ndo-fork': 'Fork an NDO',
  'ndo-associate': 'Associate an NDO with a group',
  'scenario:lobby-browse': 'Lobby browse scenario',
  'scenario:ndo-creation': 'NDO creation scenario',
  'scenario:ndo-lifecycle': 'NDO lifecycle scenario',
  'scenario:group-collaboration': 'Group collaboration scenario',
  'scenario:agent-identity': 'Agent identity scenario',
  'scenario:governance-review': 'Governance review scenario',
};

/** Does a pathname match a route shape, segment for segment? `:id` matches any
 *  single non-empty segment. Exact arity: no prefix matching, so `/app` cannot
 *  claim `/app/ndo/ndo5`. */
function matchesShape(pathname: string, pattern: string): boolean {
  const a = pathname.split('/');
  const b = pattern.split('/');
  if (a.length !== b.length) return false;
  return b.every((seg, i) => (seg === ':id' ? a[i].length > 0 : seg === a[i]));
}

/**
 * Screen key for a pathname. Shapes are matched with exact arity, so
 * `/app/ndo/ndo5/governance` resolves to `ndo-governance` for any id, and the
 * lobby claims only itself. Concrete segments beat `:id` when two shapes both
 * match — `/app/ndo/create` is `ndo-create`, not `ndo-detail`.
 *
 * '' means "not a keyed screen": no catalogue entry, no comment thread.
 */
export function screenKeyForPath(pathname: string): string {
  let bestKey = '';
  let bestScore = -1;
  for (const [key, pattern] of Object.entries(SCREEN_KEY_PATTERN)) {
    if (!matchesShape(pathname, pattern)) continue;
    // More concrete segments wins the tie.
    const score = pattern.split('/').filter((s) => s !== ':id').length;
    if (score > bestScore) {
      bestKey = key;
      bestScore = score;
    }
  }
  return bestKey;
}

/**
 * Unified resolver across both namespaces. Scenario routes match exactly and
 * win, because they are the more specific namespace. '' means this pathname has
 * no stable identity: no comment thread, no catalogue entry.
 */
export function surfaceKeyForPath(pathname: string): string {
  const scenario = SCENARIO_KEY[pathname];
  if (scenario) return scenario;
  return screenKeyForPath(pathname);
}

/** Label for a resolved key; falls back to the key itself. */
export function labelForKey(key: string): string {
  return KEY_LABEL[key] ?? key;
}
