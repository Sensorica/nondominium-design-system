/**
 * Context-aware ValueFlows action palettes for Activity forms.
 * Primary shortlist first; Hard-illegal / ontology-nonsense omitted; rest under “More”.
 */

export type VfAction =
  | 'Transfer'
  | 'Move'
  | 'Use'
  | 'Consume'
  | 'Produce'
  | 'Work'
  | 'Modify'
  | 'Combine'
  | 'Separate'
  | 'Raise'
  | 'Lower'
  | 'Cite'
  | 'Accept'
  | 'InitialTransfer'
  | 'AccessForUse'
  | 'TransferCustody';

export const ALL_VF_ACTIONS: readonly VfAction[] = [
  'Transfer',
  'Move',
  'Use',
  'Consume',
  'Produce',
  'Work',
  'Modify',
  'Combine',
  'Separate',
  'Raise',
  'Lower',
  'Cite',
  'Accept',
  'InitialTransfer',
  'AccessForUse',
  'TransferCustody'
] as const;

export type ActionPaletteContext = {
  resourceNature?: string | null;
  propertyRegime?: string | null;
  /** hApp `Use`/`Consume` or design-system `use`/`consume`. */
  economicMode?: string | null;
  hasInventoriableResource?: boolean;
};

export type ActionPalette = {
  primary: VfAction[];
  more: VfAction[];
  defaultAction: VfAction;
  /** Omitted from both lists (Hard-illegal or nonsensical for this NDO). */
  omitted: VfAction[];
};

function normalizeMode(mode: string | null | undefined): 'use' | 'consume' | null {
  if (!mode) return null;
  const m = String(mode).toLowerCase();
  if (m === 'use') return 'use';
  if (m === 'consume') return 'consume';
  return null;
}

function isDigital(nature: string | null | undefined): boolean {
  return String(nature ?? '') === 'Digital';
}

function isUncapturable(regime: string | null | undefined): boolean {
  return String(regime ?? '') === 'Nondominium';
}

/**
 * Actions that must not appear for this NDO (Hard capture rules + nature nonsense).
 * Aligns with crates/shared check_capture_resistance / check_transport_applicability,
 * plus inventoriable-fork UX (Digital never stock; Use≠Consume primary conflict).
 */
export function omittedActionsForContext(ctx: ActionPaletteContext): Set<VfAction> {
  const out = new Set<VfAction>();
  const digital = isDigital(ctx.resourceNature);
  const mode = normalizeMode(ctx.economicMode);

  if (isUncapturable(ctx.propertyRegime)) {
    out.add('Transfer');
    out.add('Consume');
    out.add('Lower');
  }

  if (digital) {
    out.add('Move');
    out.add('TransferCustody');
    out.add('Consume');
    out.add('Raise');
    out.add('Lower');
    out.add('InitialTransfer');
    // Shelf Use without inventoriable stock is misleading for Digital — prefer Cite/Work.
    if (!ctx.hasInventoriableResource) {
      out.add('Use');
      out.add('AccessForUse');
    }
  }

  if (mode === 'use') {
    out.add('Consume');
  }
  if (mode === 'consume') {
    // Batch depletes; open-ended Use is the wrong primary peer.
    out.add('Use');
  }

  return out;
}

function primaryCandidates(ctx: ActionPaletteContext): VfAction[] {
  const digital = isDigital(ctx.resourceNature);
  const mode = normalizeMode(ctx.economicMode);

  if (digital) {
    return ['Cite', 'Work', 'Modify', 'Accept', 'Produce'];
  }
  if (mode === 'consume') {
    return ['Consume', 'Lower', 'TransferCustody', 'Accept', 'Work', 'Modify'];
  }
  if (mode === 'use') {
    return ['Use', 'AccessForUse', 'TransferCustody', 'Work', 'Modify', 'Move'];
  }
  // Physical / Hybrid without inventoriable fork
  return ['Use', 'AccessForUse', 'Work', 'Modify', 'Move', 'TransferCustody', 'Cite'];
}

/**
 * Build primary + more action lists for Commitment / EconomicEvent forms.
 */
export function actionsForNdoContext(ctx: ActionPaletteContext): ActionPalette {
  const omitted = omittedActionsForContext(ctx);
  const primary = primaryCandidates(ctx).filter((a) => !omitted.has(a));
  const primarySet = new Set(primary);
  const more = ALL_VF_ACTIONS.filter((a) => !omitted.has(a) && !primarySet.has(a));
  const defaultAction = primary[0] ?? more[0] ?? 'Work';
  return {
    primary,
    more,
    defaultAction,
    omitted: ALL_VF_ACTIONS.filter((a) => omitted.has(a))
  };
}
