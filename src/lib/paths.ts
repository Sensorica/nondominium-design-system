// Centralized routing module — the ONLY place route segments live.
//
// Every page imports `paths` and calls a typed function instead of hand-writing
// a template literal (`paths.ndoDetail(n.id)`, never `${base}/app/ndo/${n.id}`).
// The repo previously prefixed `{base}` by hand in twelve pages, which produced
// three separate "fix base path" commits; this module ends that class of bug.
//
// The four prefix helpers are file-private. External code only sees `paths.*`.

import { base } from '$app/paths';

const app = (suffix = '') => `${base}/app${suffix}`;
const scenarios = (suffix = '') => `${base}/scenarios${suffix}`;
const playbook = (suffix = '') => `${base}/playbook${suffix}`;

export const paths = {
  // ── Design-system hub ──
  home: () => base || '/',
  tokens: () => `${base}/tokens`,

  // ── Static assets (base-prefixed; served under the deployment sub-path) ──
  /** The built custom-element bundle, loaded by the playbook. */
  registryBundle: () => `${base}/registry/bundle.js`,
  /** The token stylesheet, linked from app.html and documented in the playbook. */
  tokenSheet: () => `${base}/tokens.css`,

  // ── App: the prototype's entry surface ──
  appHome: () => app(),
  connecting: () => app('/connecting'),

  // ── App: gates (identity ladder) ──
  profileSetup: () => app('/profile-setup'),
  profileGuard: () => app('/profile-guard'),
  inviteLanding: (code = 'demo') => app(`/invite?group=${code}`),

  // ── App: the agent's own identity ──
  profile: () => app('/profile'),
  profileEdit: () => app('/profile/edit'),

  // ── App: agents ──
  agents: () => app('/agents'),
  agentProfile: (id: string) => app(`/agents/${id}`),

  // ── App: groups ──
  groups: () => app('/groups'),
  groupCreate: () => app('/groups/create'),
  groupJoin: () => app('/groups/join'),
  groupDetail: (id: string) => app(`/groups/${id}`),
  groupMembers: (id: string) => app(`/groups/${id}/members`),
  groupWorkLog: (id: string) => app(`/groups/${id}/work-log`),
  groupLinks: (id: string) => app(`/groups/${id}/links`),
  groupProfile: (id: string) => app(`/groups/${id}/profile`),

  // ── App: NDOs ──
  ndoCreate: (groupId?: string) => app(`/ndo/create${groupId ? `?group=${groupId}` : ''}`),
  ndoDetail: (id: string) => app(`/ndo/${id}`),
  ndoActivity: (id: string) => app(`/ndo/${id}/activity`),
  ndoComposition: (id: string) => app(`/ndo/${id}/composition`),
  ndoGovernance: (id: string) => app(`/ndo/${id}/governance`),
  ndoResources: (id: string) => app(`/ndo/${id}/resources`),
  ndoLifecycle: (id: string) => app(`/ndo/${id}/lifecycle`),
  ndoHistory: (id: string) => app(`/ndo/${id}/history`),
  ndoFork: (id: string) => app(`/ndo/${id}/fork`),
  ndoAssociate: (id: string) => app(`/ndo/${id}/associate`),

  // ── Scenarios (composed showcase pages) ──
  scenarios: () => scenarios(),
  scenarioLobbyBrowse: () => scenarios('/lobby-browse'),
  scenarioNdoCreation: () => scenarios('/ndo-creation'),
  scenarioNdoLifecycle: () => scenarios('/ndo-lifecycle'),
  scenarioGroupCollaboration: () => scenarios('/group-collaboration'),
  scenarioAgentIdentity: () => scenarios('/agent-identity'),
  scenarioGovernanceReview: () => scenarios('/governance-review'),

  // ── Playbook (component docs) ──
  playbook: () => playbook(),
  playbookButtons: () => playbook('/buttons'),
  playbookBadges: () => playbook('/badges'),
  playbookCards: () => playbook('/cards'),
  playbookInputs: () => playbook('/inputs'),
  playbookNavigation: () => playbook('/navigation'),
  playbookStatus: () => playbook('/status'),
  playbookShell: () => playbook('/shell'),
} as const;
