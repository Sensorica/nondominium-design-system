// Centralized routing module — the ONLY place route segments live.
//
// The prototype's paths mirror the app's one for one, shifted under /app and a
// deployment base prefix:
//
//   app                     prototype
//   /                       {base}/app
//   /group/{id}             {base}/app/group/{id}
//   /ndo/{hash}             {base}/app/ndo/{hash}
//   /ndo/new                {base}/app/ndo/new
//   /agent/{key}            {base}/app/agent/{key}   (404s in the app; see the route)
//
// Modal, tab and panel states are query params rather than local component
// state, so each one is a surface a reviewer can link to and comment on. The
// param names are the app's own where it already has them (`createNdo`,
// `openCreateGroup`, `openJoinGroup`, `group`).

import { base } from '$app/paths';
import { defaultView, type DirectionSlug, type ViewOf } from './prototypes/directions';

/** Which data state a screen asks the mock layer for. The union per surface is
 *  narrowed to the variants that surface actually renders differently, so a
 *  meaningless combination cannot be linked. See replica/stores.svelte.ts. */
type LobbyState =
  | 'loading'
  | 'error'
  | 'empty'
  | 'onboarding'
  | 'filtered'
  | 'filtered-empty'
  | 'no-profile';
type GroupState = 'loading' | 'error' | 'empty';
type NdoState = 'loading' | 'error' | 'anonymous';

const app = (suffix = '') => `${base}/app${suffix}`;
const patterns = (suffix = '') => `${base}/patterns${suffix}`;
const prototypes = (suffix = '') => `${base}/prototypes${suffix}`;

/** Query string for a direction view: `view` first (omitted for the default
 *  view, which is the bare direction URL), then the record it shows. */
function viewQuery(slug: DirectionSlug, view: string, record: { group?: string; ndo?: string } = {}): string {
  const q = new URLSearchParams();
  if (view !== defaultView(slug)) q.set('view', view);
  if (record.group) q.set('group', record.group);
  if (record.ndo) q.set('ndo', record.ndo);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const paths = {
  // ── Design-system surfaces ──
  home: () => base || '/',
  tokens: () => `${base}/tokens`,
  registryBundle: () => `${base}/registry/bundle.js`,
  tokenSheet: () => `${base}/tokens.css`,
  /** The full logo: mark plus wordmark, white-keyed to transparent. */
  logo: () => `${base}/assets/nondominium-logo.png`,
  /** The mark alone, square. Used wherever the wordmark would not fit. */
  logoMark: () => `${base}/assets/nondominium-mark.png`,
  favicon: () => `${base}/favicon.png`,

  // ── Prototype: connection states ──
  connecting: () => app('/connecting'),
  connectionError: () => app('/connection-error'),
  disconnected: () => app('/disconnected'),

  // ── Prototype: lobby ──
  appHome: () => app(),
  lobbyProfileSetup: () => app('?profile=1'),
  lobbyCreateGroup: () => app('?openCreateGroup=1'),
  lobbyJoinGroup: () => app('?openJoinGroup=1'),
  lobbyEditProfile: () => app('?editProfile=1'),
  lobbyInvite: (groupId: string) => app(`?group=${encodeURIComponent(groupId)}`),
  /** Data states of the lobby: what the browser renders when the load is in
   *  flight, failed, empty, filtered, or the agent has no Level 1 profile. */
  lobbyState: (state: LobbyState) => app(`?state=${state}`),

  // ── Prototype: groups ──
  groupDetail: (id: string) => app(`/group/${encodeURIComponent(id)}`),
  groupCreateNdo: (id: string) => app(`/group/${encodeURIComponent(id)}?createNdo=1`),
  groupProfile: (id: string) => app(`/group/${encodeURIComponent(id)}?groupProfile=1`),
  groupState: (id: string, state: GroupState) =>
    app(`/group/${encodeURIComponent(id)}?state=${state}`),

  // ── Prototype: NDOs ──
  ndoNew: () => app('/ndo/new'),
  ndoDetail: (hash: string) => app(`/ndo/${encodeURIComponent(hash)}`),
  ndoTab: (hash: string, tab: 'governance' | 'composition' | 'activity') =>
    app(`/ndo/${encodeURIComponent(hash)}?tab=${tab}`),
  ndoModal: (
    hash: string,
    modal:
      | 'fork'
      | 'associate'
      | 'lifecycle'
      | 'rule-edit'
      | 'spec-create'
      | 'commitment'
      | 'event'
  ) =>
    app(`/ndo/${encodeURIComponent(hash)}?modal=${modal}`),
  ndoJoin: (hash: string) => app(`/ndo/${encodeURIComponent(hash)}?join=1`),
  ndoState: (hash: string, state: NdoState) =>
    app(`/ndo/${encodeURIComponent(hash)}?state=${state}`),

  // ── Prototype: agents ──
  agentProfile: (key: string) => app(`/agent/${encodeURIComponent(key)}`),

  // ── Prototypes ──
  // The Layer 0 app (Lobby › Group › Resource Perspective) is one standalone
  // route. Its views are query params, same as the direction views below, so
  // each is a linkable surface. It is not a direction: directions.ts stays the
  // registry of the six v0.1 explorations.
  /** The index: the Layer 0 app, then the six directions. Inside the design-system chrome. */
  prototypes: () => prototypes(),
  /** Layer 0 app, on the lobby. */
  protoResource: () => prototypes('/resource-perspective'),
  /** A group as a Perspective host. */
  protoResourceGroup: (id: string) =>
    prototypes(`/resource-perspective?view=group&group=${encodeURIComponent(id)}`),
  /** The create-NDO modal, open on a group. */
  protoResourceCreate: (id: string) =>
    prototypes(`/resource-perspective?view=group&group=${encodeURIComponent(id)}&createNdo=1`),
  /** One NDO inside the Resource Perspective. `group` is omitted when the NDO was opened from the lobby. */
  protoResourceNdo: (hash: string, groupId?: string | null) => {
    const q = new URLSearchParams();
    q.set('view', 'ndo');
    if (groupId) q.set('group', groupId);
    q.set('ndo', hash);
    return prototypes(`/resource-perspective?${q}`);
  },
  /** A direction, full-bleed, on its default view. */
  protoDirection: (slug: DirectionSlug) => prototypes(`/${slug}`),
  /** A named view of a direction, optionally pinned to a record. Views are
   *  query-param states of the direction route, so each is a linkable,
   *  commentable surface. The default view has no `view` param. */
  protoView: <S extends DirectionSlug>(slug: S, view: ViewOf<S>, record?: { group?: string; ndo?: string }) =>
    prototypes(`/${slug}${viewQuery(slug, view, record)}`),
  /** Start the direction as a new person: no profile, no groups. */
  protoFresh: (slug: DirectionSlug) => prototypes(`/${slug}?fresh=1`),
  /** Reload the example network, then open the direction. */
  protoExample: (slug: DirectionSlug) => prototypes(`/${slug}?example=1`),
  /** The handoff documents, copied verbatim, on GitHub. */
  protoHandoffDocs: () => 'https://github.com/Sensorica/nondominium-design-system/tree/master/docs/prototypes',

  // ── @nondominium/ndo-ui (Tibi's component library, on master) ──
  uiKit: () => `${base}/ui-kit`,
  ndoUiPlaybook: () => `${base}/playbook`,

  // ── Guidelines: the Claude Design cards, replicated on this repo's own
  //    tokens and its own ndo-* custom elements (ISA Phase 9, claim 44). ──
  guidelines: () => `${base}/guidelines`,
  /** A single card's isolated frame: the card body alone, no chrome, sized
   *  and backgrounded exactly like the original's own `<body>`. */
  guidelineCard: (id: string) => `${base}/guidelines/${id}`,

  // ── Meetings: the journals in content/meetings/, one Niceboard each ──
  meetings: () => `${base}/meetings`,
  meeting: (slug: string) => `${base}/meetings/${encodeURIComponent(slug)}`,

  // ── Branch previews: every pushed branch, linked to its Cloudflare preview ──
  previews: () => `${base}/previews`,

  // ── Patterns (this rewrite's playbook: the app's own classes) ──
  patterns: () => patterns(),
  patternsButtons: () => patterns('/buttons'),
  patternsBadges: () => patterns('/badges'),
  patternsCards: () => patterns('/cards'),
  patternsInputs: () => patterns('/inputs'),
  patternsNavigation: () => patterns('/navigation'),
  patternsStatus: () => patterns('/status'),
  patternsShell: () => patterns('/shell'),
} as const;
