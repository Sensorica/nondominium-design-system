/**
 * Declarative Action Form Spec for Commitment / EconomicEvent Activity forms.
 *
 * Palette (`actionsForNdoContext`) decides *which* actions appear.
 * This module decides *which fields* for the chosen action + NDO context.
 *
 * Phase 1 maps onto today’s wire fields (provider/receiver, due_date or
 * event_time, resource hash, Measures, note). Phase 2 slots
 * (hasBeginning/hasEnd, targetLocation, multiResource) are listed for UX
 * hints but are not required by `validateCommitmentDraft`.
 */

import type { ActionPaletteContext, VfAction } from './vf-actions.js';

export type FieldPresence = 'hidden' | 'optional' | 'required';
export type AgentMode = 'bilateral' | 'unilateralSame';
export type TimeMode = 'punctual' | 'deadline' | 'intervalEnd';
export type FormSurface = 'commitment' | 'event';

export type Phase2SlotId = 'hasBeginning' | 'hasEnd' | 'targetLocation' | 'multiResource';

export type ActionFormSpecContext = ActionPaletteContext & {
  surface: FormSurface;
};

export type ActionFormSpec = {
  action: VfAction;
  surface: FormSurface;
  agents: {
    mode: AgentMode;
    providerLabel: string;
    receiverLabel: string;
    /** Single-field label when mode is unilateralSame. */
    singleLabel: string;
  };
  time: {
    mode: TimeMode;
    label: string;
    defaultToNow: boolean;
    /** Shown under intervalEnd until Phase 2 persists start–end. */
    helper?: string;
  };
  resourceHash: { presence: FieldPresence; label: string };
  resourceQuantity: { presence: FieldPresence; defaultUnit: string };
  effortQuantity: { presence: FieldPresence; defaultUnit: string };
  note: { presence: FieldPresence };
  phase2: Array<{ id: Phase2SlotId; label: string }>;
  summaryHint?: string;
};

export type CommitmentDraft = {
  provider?: string | null;
  receiver?: string | null;
  /** Local datetime string or empty. */
  timeLocal?: string | null;
  resourceHash?: string | null;
  resourceQuantity?: number | null;
  effortQuantity?: number | null;
};

type BaseRow = {
  agents: ActionFormSpec['agents'];
  time: Omit<ActionFormSpec['time'], 'helper'> & { helper?: string };
  resourceHash: ActionFormSpec['resourceHash'];
  resourceQuantity: ActionFormSpec['resourceQuantity'];
  effortQuantity: ActionFormSpec['effortQuantity'];
  phase2: ActionFormSpec['phase2'];
  summaryHint?: string;
};

const INTERVAL_HELPER =
  'Start–end interval persistence lands in Phase 2; for now this is the end / until time.';

const BASE: Record<VfAction, BaseRow> = {
  Cite: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Citer',
      receiverLabel: 'Citer',
      singleLabel: 'Citer'
    },
    time: { mode: 'punctual', label: 'When', defaultToNow: true },
    resourceHash: { presence: 'hidden', label: 'Economic resource' },
    resourceQuantity: { presence: 'hidden', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Citation of this NDO — no inventoriable quantity.'
  },
  Work: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'Worker',
      receiverLabel: 'Beneficiary',
      singleLabel: 'Worker'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'required', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Labour on this NDO — effort quantity is primary.'
  },
  Modify: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'Repairer',
      receiverLabel: 'Custodian',
      singleLabel: 'Repairer'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'hidden', defaultUnit: 'each' },
    effortQuantity: { presence: 'optional', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Change or repair the resource.'
  },
  Accept: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'Provider',
      receiverLabel: 'Acceptor',
      singleLabel: 'Acceptor'
    },
    time: { mode: 'punctual', label: 'When', defaultToNow: true },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Accept delivery or responsibility.'
  },
  Produce: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Producer',
      receiverLabel: 'Receiver',
      singleLabel: 'Producer'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'optional', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Create or produce output related to this NDO.'
  },
  Use: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'Custodian',
      receiverLabel: 'User',
      singleLabel: 'User'
    },
    time: {
      mode: 'intervalEnd',
      label: 'Until',
      defaultToNow: false,
      helper: INTERVAL_HELPER
    },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'optional', defaultUnit: 'hour' },
    phase2: [
      { id: 'hasBeginning', label: 'Start' },
      { id: 'hasEnd', label: 'End' }
    ],
    summaryHint: 'Use without consuming the resource.'
  },
  AccessForUse: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'Grantor',
      receiverLabel: 'Requester',
      singleLabel: 'Requester'
    },
    time: {
      mode: 'intervalEnd',
      label: 'Access until',
      defaultToNow: false,
      helper: INTERVAL_HELPER
    },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [
      { id: 'hasBeginning', label: 'Start' },
      { id: 'hasEnd', label: 'End' }
    ],
    summaryHint: 'Request access for a use window.'
  },
  Move: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Custodian',
      receiverLabel: 'Custodian',
      singleLabel: 'Custodian'
    },
    time: {
      mode: 'intervalEnd',
      label: 'Until',
      defaultToNow: false,
      helper: INTERVAL_HELPER
    },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'optional', defaultUnit: 'hour' },
    phase2: [{ id: 'targetLocation', label: 'Destination' }],
    summaryHint: 'Move location; custody stays the same.'
  },
  TransferCustody: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'From',
      receiverLabel: 'To',
      singleLabel: 'Custodian'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Hand custody to another agent.'
  },
  Transfer: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'From',
      receiverLabel: 'To',
      singleLabel: 'Agent'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'required', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Ownership/custody transfer.'
  },
  InitialTransfer: {
    agents: {
      mode: 'bilateral',
      providerLabel: 'From',
      receiverLabel: 'To',
      singleLabel: 'Agent'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'required', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'First transfer by a Simple Agent.'
  },
  Consume: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Custodian',
      receiverLabel: 'Custodian',
      singleLabel: 'Custodian'
    },
    time: { mode: 'punctual', label: 'When', defaultToNow: true },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'required', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Deplete or consume from stock.'
  },
  Lower: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Custodian',
      receiverLabel: 'Custodian',
      singleLabel: 'Custodian'
    },
    time: { mode: 'punctual', label: 'When', defaultToNow: true },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'required', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Decrease quantity without a full consume narrative.'
  },
  Raise: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Custodian',
      receiverLabel: 'Custodian',
      singleLabel: 'Custodian'
    },
    time: { mode: 'punctual', label: 'When', defaultToNow: true },
    resourceHash: { presence: 'required', label: 'Economic resource' },
    resourceQuantity: { presence: 'required', defaultUnit: 'each' },
    effortQuantity: { presence: 'hidden', defaultUnit: 'hour' },
    phase2: [],
    summaryHint: 'Increase stock quantity.'
  },
  Combine: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Operator',
      receiverLabel: 'Operator',
      singleLabel: 'Operator'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'optional', defaultUnit: 'hour' },
    phase2: [{ id: 'multiResource', label: 'Input / output resources' }],
    summaryHint: 'Combine resources (multi-resource UI is Phase 2).'
  },
  Separate: {
    agents: {
      mode: 'unilateralSame',
      providerLabel: 'Operator',
      receiverLabel: 'Operator',
      singleLabel: 'Operator'
    },
    time: { mode: 'deadline', label: 'Due', defaultToNow: false },
    resourceHash: { presence: 'optional', label: 'Economic resource' },
    resourceQuantity: { presence: 'optional', defaultUnit: 'each' },
    effortQuantity: { presence: 'optional', defaultUnit: 'hour' },
    phase2: [{ id: 'multiResource', label: 'Input / output resources' }],
    summaryHint: 'Separate a resource (multi-resource UI is Phase 2).'
  }
};

function isDigital(nature: string | null | undefined): boolean {
  return String(nature ?? '') === 'Digital';
}

function elevatePresence(p: FieldPresence, to: FieldPresence): FieldPresence {
  if (p === 'hidden') return to;
  if (p === 'optional' && to === 'required') return 'required';
  return p;
}

const INVENTORIABLE_HASH_ACTIONS: readonly VfAction[] = [
  'Use',
  'AccessForUse',
  'Modify',
  'Move',
  'TransferCustody',
  'Transfer',
  'InitialTransfer',
  'Consume',
  'Lower',
  'Raise'
];

/**
 * Build the form field profile for one VfAction in NDO + surface context.
 */
export function actionFormSpec(action: VfAction, ctx: ActionFormSpecContext): ActionFormSpec {
  const base = BASE[action];
  const digital = isDigital(ctx.resourceNature);
  const inventoriable = !!ctx.hasInventoriableResource;

  let resourceHash = { ...base.resourceHash };
  let resourceQuantity = { ...base.resourceQuantity };
  let effortQuantity = { ...base.effortQuantity };
  const time = { ...base.time };
  const agents = { ...base.agents };
  const phase2 = [...base.phase2];

  if (inventoriable && INVENTORIABLE_HASH_ACTIONS.includes(action)) {
    resourceHash = {
      ...resourceHash,
      presence: elevatePresence(resourceHash.presence, 'required')
    };
  }

  // Digital without inventoriable stock: no shelf unit fields.
  if (digital && !inventoriable) {
    resourceHash = { ...resourceHash, presence: 'hidden' };
    resourceQuantity = { ...resourceQuantity, presence: 'hidden' };
  }

  // Event surface: time still one field; effort is commitment-primary until schema gains it.
  if (ctx.surface === 'event') {
    if (effortQuantity.presence === 'required') {
      effortQuantity = { ...effortQuantity, presence: 'optional' };
    }
    if (inventoriable && resourceQuantity.presence === 'optional') {
      resourceQuantity = { ...resourceQuantity, presence: 'required' };
    }
    if (inventoriable && resourceHash.presence === 'optional') {
      resourceHash = { ...resourceHash, presence: 'required' };
    }
  }

  return {
    action,
    surface: ctx.surface,
    agents,
    time,
    resourceHash,
    resourceQuantity,
    effortQuantity,
    note: { presence: 'optional' },
    phase2,
    summaryHint: base.summaryHint
  };
}

function hasText(v: string | null | undefined): boolean {
  return typeof v === 'string' && v.trim().length > 0;
}

function hasNumber(v: number | null | undefined): boolean {
  return v != null && Number.isFinite(v);
}

/**
 * Phase 1 client-side required-field checks. Does not enforce Phase 2 slots.
 */
export function validateCommitmentDraft(
  spec: ActionFormSpec,
  draft: CommitmentDraft
): string[] {
  const errors: string[] = [];

  if (spec.agents.mode === 'unilateralSame') {
    if (!hasText(draft.provider) && !hasText(draft.receiver)) {
      errors.push(`${spec.agents.singleLabel} is required.`);
    }
  } else {
    if (!hasText(draft.provider)) {
      errors.push(`${spec.agents.providerLabel} is required.`);
    }
    if (!hasText(draft.receiver)) {
      errors.push(`${spec.agents.receiverLabel} is required.`);
    }
  }

  if (!hasText(draft.timeLocal)) {
    errors.push(`${spec.time.label} is required.`);
  }

  if (spec.resourceHash.presence === 'required' && !hasText(draft.resourceHash)) {
    errors.push(`${spec.resourceHash.label} is required.`);
  }

  if (spec.resourceQuantity.presence === 'required' && !hasNumber(draft.resourceQuantity)) {
    errors.push('Resource quantity is required.');
  }

  if (spec.effortQuantity.presence === 'required' && !hasNumber(draft.effortQuantity)) {
    errors.push('Effort quantity is required.');
  }

  return errors;
}
