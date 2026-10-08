/**
 * "Coming next" registry — the single source of copy for every feature that is
 * visible in the Layer 0 UI but not live yet.
 *
 * Why a registry rather than strings at call sites: the same explanation must
 * read identically wherever it appears (a tab, a button, a perspective entry),
 * and it must be reviewable in one file. A call site passes an id, never prose.
 *
 * Normative sources: documentation/requirements/ui_design.md § Perspectives,
 * requirements.md (REQ-RES-08, REQ-USER-A-04/A-05, REQ-GOV-04, REQ-PPR-07),
 * ndo_prima_materia.md (lifecycle, REQ-NDO-LC-07).
 */

export type ComingNextGroup =
  | 'perspective'
  | 'tab'
  | 'action'
  | 'process'
  | 'lifecycle'
  | 'navigation'
  | 'fork'
  | 'source';

export interface ComingNextFeature {
  id: string;
  group: ComingNextGroup;
  icon: string;
  /** Short name, used as the popup title and the button tooltip lead. */
  title: string;
  /** One line, used as the tooltip. */
  tooltip: string;
  /** One paragraph: what this feature is, in the product's own words. */
  summary: string;
  /** Optional bullets: how it will work. */
  details?: string[];
  /** Optional: where the requirement lives, shown as plain text. */
  docRef?: string;
}

const STATUS_LINE = 'Under development — coming next.';

export { STATUS_LINE as COMING_NEXT_STATUS };

const LIFECYCLE_NOTE =
  'It does not change the NDO lifecycle stage: transport, storage and maintenance are processes acting on the resource, not maturity transitions.';

const PROCESS_COMMON = [
  'Starts from a commitment that another agent can accept.',
  'Recorded as economic events on the NDO.',
  'Every agent involved earns a participation receipt (PPR).',
  LIFECYCLE_NOTE
];

export const COMING_NEXT: Record<string, ComingNextFeature> = {
  // ── Perspectives ─────────────────────────────────────────────────────────
  'perspective-agent': {
    id: 'perspective-agent',
    group: 'perspective',
    icon: '👥',
    title: 'Agent Perspective',
    tooltip: 'Find agents by skill and explore their connections.',
    summary:
      'An agent-centric view of the network. Find agents with specific skills, open a profile to see communities, projects, skills and reputation, then hop from link to link through the relationship graph. Groups appear here too, since a group is a kind of agent.',
    details: [
      'Ask someone to collaborate on a project.',
      'Find groups and decide whether to join them.',
      'Map and chat tools can be opened from here.'
    ],
    docRef: 'ui_design.md § Agent Perspective'
  },
  'perspective-intelligence': {
    id: 'perspective-intelligence',
    group: 'perspective',
    icon: '🧭',
    title: 'Intelligence Perspective',
    tooltip: 'Decide where to put your time and resources.',
    summary:
      'A strategic view that looks beyond your current activity. It filters what it finds by your role, skills, reputation and past interactions, and helps you discover and assess groups and projects before you join them.',
    details: [
      'An assistant that knows your profile suggests projects that fit.',
      'Weigh expected benefit and impact by project stage.',
      'Simulate how you split your time across projects.',
      'Subscribe to a community, become a member, attach to a project.'
    ],
    docRef: 'ui_design.md § Intelligence Perspective'
  },
  'perspective-work': {
    id: 'perspective-work',
    group: 'perspective',
    icon: '🛠️',
    title: 'Work Perspective',
    tooltip: 'Engage in the processes of the projects you belong to.',
    summary:
      'Where you work. It lists the project NDOs you subscribed to or contributed to. Open one to see its tasks and planning, commit to work, take a task and log contributions, together with the other agents.',
    details: [
      'A kanban board per project.',
      'Signals across projects: what is active, what needs attention, invitations to contribute.',
      'Different from Intelligence: Work is what you are doing now, Intelligence is where to go next.'
    ],
    docRef: 'ui_design.md § Work Perspective'
  },

  // ── NDO tabs ─────────────────────────────────────────────────────────────
  'tab-resources': {
    id: 'tab-resources',
    group: 'tab',
    icon: '📦',
    title: 'Resources (Layer 1 specifications)',
    tooltip: 'Specify what this NDO is made of and how it is used.',
    summary:
      'Layer 1 adds resource specifications to an NDO: the design files, bill of materials, documentation and licensing that make it reproducible or usable by others.',
    details: [
      'Create and version specifications.',
      'Content is referenced, not copied into the identity.'
    ],
    docRef: 'ndo_prima_materia.md § Layer 1'
  },
  'tab-governance': {
    id: 'tab-governance',
    group: 'tab',
    icon: '⚖️',
    title: 'Governance',
    tooltip: 'Rules for access, use and transfer of this NDO.',
    summary:
      'Governance rules decide who may do what with this NDO, and which roles are needed (for example accountable agent, or a validated Transport, Repair or Storage role).',
    details: [
      'Create and edit rules; rules are applied when someone asks to act.',
      'See your own roles for this NDO.'
    ],
    docRef: 'governance.md'
  },
  'tab-composition': {
    id: 'tab-composition',
    group: 'tab',
    icon: '🧩',
    title: 'Composition',
    tooltip: 'See what this NDO is made of or part of.',
    summary:
      'A graph of how NDOs relate: components, derived-from and supersedes links. It lets you see an NDO inside the larger things it belongs to.',
    docRef: 'resources.md'
  },
  'tab-activity': {
    id: 'tab-activity',
    group: 'tab',
    icon: '📜',
    title: 'Activity',
    tooltip: 'Commitments and economic events on this NDO.',
    summary:
      'The history of what happened to this resource: commitments made by agents and the economic events that fulfilled them.',
    details: ['Propose a commitment.', 'Record an economic event.'],
    docRef: 'governance.md'
  },

  // ── Lifecycle ────────────────────────────────────────────────────────────
  'governed-transitions': {
    id: 'governed-transitions',
    group: 'lifecycle',
    icon: '🔒',
    title: 'Governed transitions',
    tooltip: 'Today only the creator can advance the stage. Governed transitions are coming next.',
    summary:
      'Today only the agent who created this NDO can advance its lifecycle stage. This is a deliberate simplification, and the backend enforces it.',
    details: [
      'Next, a stage change will be proposed and approved according to the NDO’s own governance rules (REQ-NDO-LC-07).',
      'Any participant holding the right role will be able to take part.',
      'Each transition will be linked to an economic event.'
    ],
    docRef: 'ndo_prima_materia.md § Lifecycle (REQ-NDO-LC-07)'
  },

  // ── Access actions ───────────────────────────────────────────────────────
  'action-use': {
    id: 'action-use',
    group: 'action',
    icon: '🔧',
    title: 'Use',
    tooltip: 'Use this resource.',
    summary:
      'Signal that you want to use this resource for a while. The request is checked against the NDO’s governance rules, then recorded as a commitment and an economic event.',
    details: [
      'While in use, the resource shows as “in use”.',
      'Both you and the custodian earn a participation receipt.'
    ],
    docRef: 'requirements.md § REQ-USER-A-04'
  },
  'action-borrow': {
    id: 'action-borrow',
    group: 'action',
    icon: '🤲',
    title: 'Borrow',
    tooltip: 'Borrow this resource and give it back.',
    summary:
      'Ask the custodian for access to the resource for a defined period. Custody moves to you and returns when you are done.',
    details: [
      'Access depends on the property regime and governance rules.',
      'Both sides earn a participation receipt when it goes well.'
    ],
    docRef: 'requirements.md § REQ-USER-A-04'
  },
  'action-offer': {
    id: 'action-offer',
    group: 'action',
    icon: '🎁',
    title: 'Offer',
    tooltip: 'Offer a resource of your own.',
    summary:
      'To offer a resource, you create a new NDO from within a group. Dedicated offer flows (offering an existing resource for use, with terms) are coming next.',
    docRef: 'ui_design.md § Resource Perspective'
  },
  'action-transfer': {
    id: 'action-transfer',
    group: 'action',
    icon: '🔀',
    title: 'Transfer',
    tooltip: 'Transfer ownership or rights.',
    summary:
      'Transfer ownership, or the rights attached to it, to another agent. Not every NDO allows it: a Commons or Nondominium NDO cannot be captured, so ownership cannot be transferred.',
    details: [
      'Availability depends on the property regime of the NDO.',
      'Recorded as an economic event; both agents earn a participation receipt.'
    ],
    docRef: 'resources.md'
  },
  'action-transfer-custody': {
    id: 'action-transfer-custody',
    group: 'action',
    icon: '🤝',
    title: 'Transfer custody',
    tooltip: 'Hand over care of the resource; rights stay where they are.',
    summary:
      'Hand over physical or operational care of the resource to another agent, while ownership and rights stay where they are. This is how a resource moves between custodians.',
    details: [
      'The new custodian accepts the handover.',
      'Recorded as an economic event; both agents earn a participation receipt.'
    ],
    docRef: 'governance.md'
  },

  // ── Service processes ────────────────────────────────────────────────────
  'process-transport': {
    id: 'process-transport',
    group: 'process',
    icon: '🚚',
    title: 'Transport',
    tooltip: 'Have this resource moved somewhere.',
    summary:
      'Transport moves a resource from one place or custodian to another. While it is moving, the resource shows as “in transit”; when it arrives, it is available again.',
    details: [
      'A Transport role is required; roles are validated by existing role holders.',
      'Puts the resource in the “In transit” state.',
      ...PROCESS_COMMON
    ],
    docRef: 'requirements.md § REQ-RES-08, REQ-GOV-04'
  },
  'process-store': {
    id: 'process-store',
    group: 'process',
    icon: '🏠',
    title: 'Store',
    tooltip: 'Have this resource kept safely for a while.',
    summary:
      'Storage entrusts a resource to an agent who keeps it safe. While it is stored, the resource shows as “in storage”.',
    details: [
      'A Storage role is required; roles are validated by existing role holders.',
      'Puts the resource in the “In storage” state.',
      ...PROCESS_COMMON
    ],
    docRef: 'requirements.md § REQ-RES-08, REQ-GOV-04'
  },
  'process-repair': {
    id: 'process-repair',
    group: 'process',
    icon: '🛠️',
    title: 'Repair',
    tooltip: 'Have this resource repaired or maintained.',
    summary:
      'Repair and maintenance restore or keep a resource in working order. While it is being worked on, the resource shows as “in maintenance”.',
    details: [
      'A Repair role is required; roles are validated by existing role holders.',
      'Puts the resource in the “In maintenance” state.',
      ...PROCESS_COMMON
    ],
    docRef: 'requirements.md § REQ-RES-08, REQ-GOV-04'
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  'jump-agent': {
    id: 'jump-agent',
    group: 'navigation',
    icon: '↗️',
    title: 'Open this agent in the Agent Perspective',
    tooltip: 'Open this agent’s profile and connections.',
    summary:
      'Clicking an agent takes you to the Agent Perspective, where you see their profile and the agents connected to them. A Back control brings you to where you were, so you can pick up your exploration of the resource.',
    details: [
      'The jump keeps what you were looking at.',
      'Back returns you here with filters and scroll restored.'
    ],
    docRef: 'ui_design.md § Cross-Perspective Navigation'
  },

  // ── Fork ─────────────────────────────────────────────────────────────────
  'fork-unyt-stake': {
    id: 'fork-unyt-stake',
    group: 'fork',
    icon: '🪙',
    title: 'Fork with a stake',
    tooltip: 'Full forking requires negotiation, consensus and a stake.',
    summary:
      'Forking an NDO will require a claim, a vote of the NDO’s participants and a stake, so that forks stay intentional and do not fragment shared resources.',
    docRef: 'post-mvp/unyt-integration.md'
  },

  // ── Sources ──────────────────────────────────────────────────────────────
  'source-view': {
    id: 'source-view',
    group: 'source',
    icon: '💧',
    title: 'Source view',
    tooltip: 'See the source a resource comes from.',
    summary:
      'Some resources come from a Source, such as a gallon of water from a river. A Source view gathers what is known about it in one place: studies, flow and planned withdrawals, so that everyone looks at the same information.',
    docRef: 'post-mvp/source-ndo-requirements.md'
  }
};

export function getComingNext(id: string): ComingNextFeature | null {
  return COMING_NEXT[id] ?? null;
}

/** Ids shown in the NDO view's action row, in display order. */
export const ACCESS_ACTION_IDS = [
  'action-use',
  'action-borrow',
  'action-offer',
  'action-transfer',
  'action-transfer-custody'
] as const;

export const PROCESS_ACTION_IDS = ['process-transport', 'process-store', 'process-repair'] as const;

export const PERSPECTIVE_IDS = ['resource', 'agent', 'intelligence', 'work'] as const;
export type PerspectiveId = (typeof PERSPECTIVE_IDS)[number];

export interface PerspectiveMeta {
  id: PerspectiveId;
  label: string;
  icon: string;
  /** Question it answers (ui_design.md § Perspectives). */
  question: string;
  /** False for the placeholders. */
  live: boolean;
  /** Registry id for the popup, when not live. */
  comingNextId?: string;
}

export const PERSPECTIVES: PerspectiveMeta[] = [
  {
    id: 'resource',
    label: 'Resource',
    icon: '📦',
    question: 'What can I use, borrow, offer or manage?',
    live: true
  },
  {
    id: 'agent',
    label: 'Agent',
    icon: '👥',
    question: 'Who can I connect or collaborate with?',
    live: false,
    comingNextId: 'perspective-agent'
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: '🧭',
    question: 'Where should I allocate my time and resources?',
    live: false,
    comingNextId: 'perspective-intelligence'
  },
  {
    id: 'work',
    label: 'Work',
    icon: '🛠️',
    question: 'What do I engage in today, and with whom?',
    live: false,
    comingNextId: 'perspective-work'
  }
];

/** Operational states a resource can be in (OperationalState, read-only badge). */
export type OperationalStateLabel =
  | 'Available'
  | 'Reserved'
  | 'InTransit'
  | 'InStorage'
  | 'InMaintenance'
  | 'InUse';
