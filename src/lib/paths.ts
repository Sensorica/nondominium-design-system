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
const scenarios = (suffix = '') => `${base}/scenarios${suffix}`;
const playbook = (suffix = '') => `${base}/playbook${suffix}`;

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
  ndoModal: (hash: string, modal: 'fork' | 'associate' | 'lifecycle') =>
    app(`/ndo/${encodeURIComponent(hash)}?modal=${modal}`),
  ndoJoin: (hash: string) => app(`/ndo/${encodeURIComponent(hash)}?join=1`),
  ndoState: (hash: string, state: NdoState) =>
    app(`/ndo/${encodeURIComponent(hash)}?state=${state}`),

  // ── Prototype: agents ──
  agentProfile: (key: string) => app(`/agent/${encodeURIComponent(key)}`),

  // ── Scenarios ──
  scenarios: () => scenarios(),
  scenarioLobbyBrowse: () => scenarios('/lobby-browse'),
  scenarioNdoCreation: () => scenarios('/ndo-creation'),
  scenarioNdoLifecycle: () => scenarios('/ndo-lifecycle'),
  scenarioGroupCollaboration: () => scenarios('/group-collaboration'),
  scenarioAgentIdentity: () => scenarios('/agent-identity'),
  scenarioGovernanceReview: () => scenarios('/governance-review'),

  // ── Playbook ──
  playbook: () => playbook(),
  playbookButtons: () => playbook('/buttons'),
  playbookBadges: () => playbook('/badges'),
  playbookCards: () => playbook('/cards'),
  playbookInputs: () => playbook('/inputs'),
  playbookNavigation: () => playbook('/navigation'),
  playbookStatus: () => playbook('/status'),
  playbookShell: () => playbook('/shell'),
} as const;
