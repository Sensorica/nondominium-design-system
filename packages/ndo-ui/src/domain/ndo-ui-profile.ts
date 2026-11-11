/**
 * Single derived UI capability model for an NDO.
 *
 * Screens (wizard review, Resources, Activity, Governance) should read this
 * object instead of re-deriving nature × regime × mode exceptions locally.
 */
import { getGovernanceTemplatesForNdo } from './governance-templates.js';
import type { GovernanceRuleTemplate } from './types.js';
import type { EconomicMode, UseKind } from './types.js';
import {
  allowsManualEconomicResourceCreate,
  allowsManualKindOfItemCreate,
  needsEconomicMode
} from './wizard-state.js';
import {
  actionsForNdoContext,
  type ActionPalette,
  type VfAction
} from './vf-actions.js';

export type EconomicFork = 'none' | 'use_unit' | 'use_capacity' | 'consume';

export type NdoUiProfileInput = {
  resourceNature?: string | null;
  propertyRegime?: string | null;
  economicMode?: string | null;
  useKind?: string | null;
  isSource?: boolean;
  /** Linked ResourceSpecification count — gates initial Specify. */
  existingSpecCount?: number;
  /** Whether an inventoriable EconomicResource already exists. */
  hasInventoriableResource?: boolean;
  maxConcurrentUsers?: number | null;
  /**
   * Host maturity: template ids the host can persist today.
   * Null = all recommended templates treated as creatable (prototype).
   */
  creatableRuleIds?: readonly string[] | Set<string> | null;
  /** Template ids already represented by on-chain rules. */
  appliedRuleIds?: readonly string[] | Set<string> | null;
};

export type NdoUiProfile = {
  isSource: boolean;
  isDigital: boolean;
  /** Layer 0 must choose Use vs Consume (Physical/Hybrid non-Source). */
  needsEconomicMode: boolean;
  economicFork: EconomicFork;
  resources: {
    allowSpecCreate: boolean;
    allowInstanceCreate: boolean;
  };
  actionPalette: ActionPalette;
  governance: {
    recommendedIds: string[];
    recommended: GovernanceRuleTemplate[];
    creatableIds: string[];
    appliedIds: string[];
    /** Creatable and not yet applied — safe to select / Apply. */
    applyableIds: string[];
  };
  activity: {
    defaultAction: VfAction;
    /** Bilateral fulfill_commitment_closure; one Claim closes the commitment. */
    fulfillPolicy: 'bilateral_once';
  };
};

function toSet(ids: readonly string[] | Set<string> | null | undefined): Set<string> | null {
  if (ids == null) return null;
  return ids instanceof Set ? ids : new Set(ids);
}

function normalizeMode(mode: string | null | undefined): EconomicMode | null {
  if (!mode) return null;
  const m = String(mode).toLowerCase();
  if (m === 'use') return 'use';
  if (m === 'consume') return 'consume';
  return null;
}

function normalizeUseKind(kind: string | null | undefined): UseKind | null {
  if (!kind) return null;
  const k = String(kind).toLowerCase();
  if (k === 'unit') return 'unit';
  if (k === 'capacity') return 'capacity';
  return null;
}

function natureOf(n: string | null | undefined): string {
  return String(n ?? '');
}

export function deriveEconomicFork(input: {
  resourceNature?: string | null;
  isSource?: boolean;
  economicMode?: string | null;
  useKind?: string | null;
}): EconomicFork {
  const isSource = !!input.isSource;
  const nature = natureOf(input.resourceNature);
  if (isSource || nature === 'Digital') return 'none';
  const mode = normalizeMode(input.economicMode);
  if (!mode) return 'none';
  if (mode === 'consume') return 'consume';
  const useKind = normalizeUseKind(input.useKind);
  if (useKind === 'capacity') return 'use_capacity';
  return 'use_unit';
}

/**
 * Derive UI capabilities from Layer 0 classification + live counts / host maturity.
 */
export function deriveNdoUiProfile(input: NdoUiProfileInput): NdoUiProfile {
  const isSource = !!input.isSource;
  const nature = natureOf(input.resourceNature);
  const isDigital = nature === 'Digital';
  const economicMode = normalizeMode(input.economicMode);
  const useKind = normalizeUseKind(input.useKind);
  const needsMode = needsEconomicMode(
    (nature || 'Physical') as 'Physical' | 'Digital' | 'Hybrid',
    isSource
  );
  const economicFork = deriveEconomicFork({
    resourceNature: nature,
    isSource,
    economicMode,
    useKind
  });

  const resources = {
    allowSpecCreate: allowsManualKindOfItemCreate({
      economicMode,
      resourceNature: nature || null,
      isSource,
      existingSpecCount: input.existingSpecCount ?? 0
    }),
    allowInstanceCreate: allowsManualEconomicResourceCreate({
      economicMode,
      resourceNature: nature || null,
      isSource,
      existingSpecCount: input.existingSpecCount ?? 0
    })
  };

  const actionPalette = actionsForNdoContext({
    resourceNature: nature || null,
    propertyRegime: input.propertyRegime ?? null,
    economicMode,
    hasInventoriableResource: input.hasInventoriableResource
  });

  // Narrow hApp's 7 regimes to the 4-regime recommendation matrix.
  const rawRegime = String(input.propertyRegime ?? 'Commons');
  const regime = (
    rawRegime === 'Pool'
      ? 'CommonPool'
      : rawRegime === 'Collective' || rawRegime === 'Public'
        ? 'Commons'
        : rawRegime === 'Private' ||
            rawRegime === 'Commons' ||
            rawRegime === 'Nondominium' ||
            rawRegime === 'CommonPool'
          ? rawRegime
          : 'Commons'
  ) as 'Private' | 'Commons' | 'Nondominium' | 'CommonPool';
  const resourceNature = (nature || 'Physical') as 'Physical' | 'Digital' | 'Hybrid';

  const recommended = getGovernanceTemplatesForNdo({
    regime,
    nature: resourceNature,
    isSourceNdo: isSource,
    economicMode,
    useKind,
    maxConcurrentUsers: input.maxConcurrentUsers ?? null
  });
  const recommendedIds = recommended.map((t) => t.id);

  const creatableSet = toSet(input.creatableRuleIds);
  const appliedSet = toSet(input.appliedRuleIds) ?? new Set<string>();
  const creatableIds =
    creatableSet == null
      ? [...recommendedIds]
      : recommendedIds.filter((id) => creatableSet.has(id));
  const appliedIds = recommendedIds.filter((id) => appliedSet.has(id));
  const applyableIds = creatableIds.filter((id) => !appliedSet.has(id));

  return {
    isSource,
    isDigital,
    needsEconomicMode: needsMode,
    economicFork,
    resources,
    actionPalette,
    governance: {
      recommendedIds,
      recommended,
      creatableIds,
      appliedIds,
      applyableIds
    },
    activity: {
      defaultAction: actionPalette.defaultAction,
      fulfillPolicy: 'bilateral_once'
    }
  };
}
