/**
 * Participation grammar — derives agent slots for Commitment / Event forms
 * from nature × regime × action family × surface × initiation.
 *
 * Normative: nondominium documentation/specifications/participation-grammar.md
 *
 * Wire: provider/receiver remain AgentPubKey (performer + witness).
 * Beneficiary = this NDO (derived; not on wire). NDO is not an agent.
 */

import type { VfAction } from './vf-actions.js';

/** Duplicated lightly to avoid a cycle with action-form-spec. */
export type FormSurface = 'commitment' | 'event';
export type AgentMode = 'bilateral' | 'unilateralSame';

export type ParticipationInitiation = 'self_allocate' | 'publish_request';

export type ActionFamily =
  | 'Labour'
  | 'Location'
  | 'AccessUse'
  | 'Custody'
  | 'Stock'
  | 'Remix'
  | 'Cite';

export type WireField = 'provider' | 'receiver';
export type RoleSlot = 'performer' | 'witness';

export type ParticipationGrammarInput = {
  action: VfAction;
  surface: FormSurface;
  resourceNature?: string | null;
  propertyRegime?: string | null;
  /** Defaults: commitment → publish_request; event → self_allocate. */
  initiation?: ParticipationInitiation | null;
};

export type ParticipationGrammar = {
  action: VfAction;
  family: ActionFamily;
  surface: FormSurface;
  initiation: ParticipationInitiation;
  agents: {
    mode: AgentMode;
    providerLabel: string;
    receiverLabel: string;
    singleLabel: string;
  };
  /** Which semantic slot maps to Commitment.provider / .receiver. */
  performerWire: WireField;
  witnessWire: WireField;
  /**
   * Which semantic slot the proposing author is prefilled into.
   * The other wire field starts empty when requireDistinctAgents.
   */
  authorSeed: RoleSlot;
  /** Commitment closure via fulfill_commitment_closure needs two agents. */
  requireDistinctAgents: boolean;
  /** Shared vs private stewardship (witness copy / Soft hints). */
  sharedStewardship: boolean;
  summaryHint?: string;
};

const FAMILY_BY_ACTION: Record<VfAction, ActionFamily> = {
  Work: 'Labour',
  Modify: 'Labour',
  Produce: 'Labour',
  Move: 'Location',
  Accept: 'Location',
  Use: 'AccessUse',
  AccessForUse: 'AccessUse',
  TransferCustody: 'Custody',
  Transfer: 'Custody',
  InitialTransfer: 'Custody',
  Consume: 'Stock',
  Lower: 'Stock',
  Raise: 'Stock',
  Combine: 'Remix',
  Separate: 'Remix',
  Cite: 'Cite'
};

/** Event leaves that may be self-performed (provider === receiver). */
const EVENT_UNILATERAL_OK: ReadonlySet<VfAction> = new Set([
  'Cite',
  'Produce',
  'Move',
  'Consume',
  'Lower',
  'Raise',
  'Combine',
  'Separate'
]);

type LabelRow = {
  providerLabel: string;
  receiverLabel: string;
  singleLabel: string;
  performerWire: WireField;
  witnessWire: WireField;
  /** Author seed under publish_request. */
  publishAuthorSeed: RoleSlot;
  /** Author seed under self_allocate. */
  selfAuthorSeed: RoleSlot;
  summaryHint?: string;
};

const LABELS: Record<VfAction, LabelRow> = {
  Work: {
    providerLabel: 'Worker',
    receiverLabel: 'Witness',
    singleLabel: 'Worker',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Labour on this NDO — effort quantity is primary. Beneficiary is this NDO.'
  },
  Modify: {
    providerLabel: 'Repairer',
    receiverLabel: 'Witness',
    singleLabel: 'Repairer',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Change or repair the resource. Beneficiary is this NDO.'
  },
  Produce: {
    providerLabel: 'Producer',
    receiverLabel: 'Witness',
    singleLabel: 'Producer',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Create or produce output related to this NDO.'
  },
  Use: {
    providerLabel: 'Custodian',
    receiverLabel: 'User',
    singleLabel: 'User',
    performerWire: 'receiver',
    witnessWire: 'provider',
    publishAuthorSeed: 'performer',
    selfAuthorSeed: 'performer',
    summaryHint: 'Use without consuming the resource. Beneficiary is this NDO when shared.'
  },
  AccessForUse: {
    providerLabel: 'Grantor',
    receiverLabel: 'Requester',
    singleLabel: 'Requester',
    performerWire: 'receiver',
    witnessWire: 'provider',
    publishAuthorSeed: 'performer',
    selfAuthorSeed: 'performer',
    summaryHint: 'Request access for a use window.'
  },
  Move: {
    providerLabel: 'Custodian',
    receiverLabel: 'Requestor',
    singleLabel: 'Custodian',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Move / transport; custody may be temporary with the transporter.'
  },
  Accept: {
    providerLabel: 'Provider',
    receiverLabel: 'Acceptor',
    singleLabel: 'Acceptor',
    performerWire: 'receiver',
    witnessWire: 'provider',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Accept delivery or responsibility (pairs with transport).'
  },
  TransferCustody: {
    providerLabel: 'From',
    receiverLabel: 'To',
    singleLabel: 'Custodian',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'performer',
    selfAuthorSeed: 'performer',
    summaryHint: 'Hand custody / responsibility to another agent.'
  },
  Transfer: {
    providerLabel: 'From',
    receiverLabel: 'To',
    singleLabel: 'Agent',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'performer',
    selfAuthorSeed: 'performer',
    summaryHint: 'Ownership/custody transfer.'
  },
  InitialTransfer: {
    providerLabel: 'From',
    receiverLabel: 'To',
    singleLabel: 'Agent',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'performer',
    selfAuthorSeed: 'performer',
    summaryHint: 'First transfer by a Simple Agent.'
  },
  Consume: {
    providerLabel: 'Custodian',
    receiverLabel: 'Witness',
    singleLabel: 'Custodian',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Deplete or consume from stock.'
  },
  Lower: {
    providerLabel: 'Custodian',
    receiverLabel: 'Witness',
    singleLabel: 'Custodian',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Decrease quantity without a full consume narrative.'
  },
  Raise: {
    providerLabel: 'Supplier',
    receiverLabel: 'Witness',
    singleLabel: 'Supplier',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Increase stock quantity.'
  },
  Combine: {
    providerLabel: 'Operator',
    receiverLabel: 'Witness',
    singleLabel: 'Operator',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Combine resources (multi-resource UI is Phase 2).'
  },
  Separate: {
    providerLabel: 'Operator',
    receiverLabel: 'Witness',
    singleLabel: 'Operator',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Separate a resource (multi-resource UI is Phase 2).'
  },
  Cite: {
    providerLabel: 'Citer',
    receiverLabel: 'Witness',
    singleLabel: 'Citer',
    performerWire: 'provider',
    witnessWire: 'receiver',
    publishAuthorSeed: 'witness',
    selfAuthorSeed: 'performer',
    summaryHint: 'Citation of this NDO — no inventoriable quantity.'
  }
};

export function actionFamily(action: VfAction): ActionFamily {
  return FAMILY_BY_ACTION[action];
}

export function isSharedStewardshipRegime(regime: string | null | undefined): boolean {
  const r = String(regime ?? '');
  return (
    r === 'Pool' ||
    r === 'CommonPool' ||
    r === 'Nondominium' ||
    r === 'Commons' ||
    r === 'Collective' ||
    r === 'Public'
  );
}

function defaultInitiation(
  surface: FormSurface,
  initiation: ParticipationInitiation | null | undefined
): ParticipationInitiation {
  if (initiation === 'self_allocate' || initiation === 'publish_request') {
    return initiation;
  }
  return surface === 'commitment' ? 'publish_request' : 'self_allocate';
}

/**
 * Derive participation slots and agent mode for one action + context.
 */
export function participationGrammar(input: ParticipationGrammarInput): ParticipationGrammar {
  const family = actionFamily(input.action);
  const initiation = defaultInitiation(input.surface, input.initiation);
  const labels = LABELS[input.action];
  const sharedStewardship = isSharedStewardshipRegime(input.propertyRegime);

  const eventUnilateral =
    input.surface === 'event' && EVENT_UNILATERAL_OK.has(input.action);
  const requireDistinctAgents = !eventUnilateral;
  const mode: AgentMode = requireDistinctAgents ? 'bilateral' : 'unilateralSame';

  const authorSeed =
    initiation === 'self_allocate' ? labels.selfAuthorSeed : labels.publishAuthorSeed;

  // Private: prefer "Custodian" wording for labour witness when not shared.
  let receiverLabel = labels.receiverLabel;
  let providerLabel = labels.providerLabel;
  if (
    !sharedStewardship &&
    (input.action === 'Work' || input.action === 'Modify') &&
    labels.receiverLabel === 'Witness'
  ) {
    receiverLabel = 'Custodian';
  }

  return {
    action: input.action,
    family,
    surface: input.surface,
    initiation,
    agents: {
      mode,
      providerLabel,
      receiverLabel,
      singleLabel: labels.singleLabel
    },
    performerWire: labels.performerWire,
    witnessWire: labels.witnessWire,
    authorSeed,
    requireDistinctAgents,
    sharedStewardship,
    summaryHint: labels.summaryHint
  };
}

/** Map authorSeed semantic slot → which wire field to prefill. */
export function authorSeedWireField(g: ParticipationGrammar): WireField {
  return g.authorSeed === 'performer' ? g.performerWire : g.witnessWire;
}

/**
 * Actions whose commitments must name two distinct agents (zome + UI Hard).
 * Matches requireDistinctAgents for commitment surface.
 */
export function commitmentRequiresDistinctAgents(action: VfAction): boolean {
  return participationGrammar({
    action,
    surface: 'commitment'
  }).requireDistinctAgents;
}
