import type {
  EconomicMode,
  GovernanceRuleTemplate,
  PropertyRegime,
  ResourceNature,
  UseKind
} from './types.js';

const BASE_TEMPLATES: GovernanceRuleTemplate[] = [
  {
    id: 'access_accountable',
    rule_type: 'access_requirement',
    label: 'Accountable Agent access',
    rationale:
      'Only agents with validated identity can initiate access — appropriate for rivalrous shared resources.',
    rule_data: { min_role: 'AccountableAgent' },
    enforced_by: 'AccountableAgent'
  },
  {
    id: 'access_attribution',
    rule_type: 'access_requirement',
    label: 'Attribution on share',
    rationale: 'Commons resources require attribution when copied or remixed.',
    rule_data: { require_attribution: true },
    enforced_by: 'SimpleAgent'
  },
  {
    id: 'no_ownership_transfer',
    rule_type: 'transfer_conditions',
    label: 'No ownership transfer',
    rationale: 'Nondominium regime prohibits alienation — custody may transfer, ownership cannot.',
    rule_data: { allow_ownership_transfer: false },
    enforced_by: 'PrimaryAccountableAgent'
  },
  {
    id: 'capacity_limit',
    rule_type: 'usage_limit',
    label: 'Capacity at one time',
    rationale:
      'A place stays rivalrous. Several people can use it together until the capacity is reached.',
    rule_data: { max_concurrent_users: 8 },
    enforced_by: 'AccountableAgent'
  },
  {
    id: 'quota_extraction',
    rule_type: 'usage_limit',
    label: 'Extraction quota per period',
    rationale: 'CommonPool resources need subtractability limits to prevent depletion.',
    rule_data: { max_quantity_per_period: 100, unit: 'units' },
    enforced_by: 'AccountableAgent'
  },
  {
    id: 'max_per_agent',
    rule_type: 'usage_limit',
    label: 'Max items per agent',
    rationale: 'Caps how many units one agent may take from a depleting batch at a time.',
    rule_data: { max_quantity_per_agent: 3 },
    enforced_by: 'AccountableAgent'
  },
  {
    id: 'maintenance_schedule',
    rule_type: 'access_requirement',
    label: 'Maintenance obligation',
    rationale: 'Physical pool resources require scheduled maintenance commitments.',
    rule_data: { require_maintenance_role: true },
    enforced_by: 'PrimaryAccountableAgent'
  },
  {
    id: 'integrity_manifest',
    rule_type: 'access_requirement',
    label: 'Digital integrity manifest',
    rationale: 'Digital resources should verify content hash before distribution.',
    rule_data: { require_integrity_manifest: true },
    enforced_by: 'AccountableAgent'
  },
  {
    id: 'source_monitoring',
    rule_type: 'monitoring_obligation',
    label: 'Monitoring obligation',
    rationale: 'Source-NDO stewards must submit condition data before continued extraction.',
    rule_data: { monitoring_interval_days: 30, min_validators: 1 },
    enforced_by: 'Steward'
  },
  {
    id: 'source_extraction_limit',
    rule_type: 'usage_limit',
    label: 'Boundary extraction limit',
    rationale: 'Adaptive governance caps extraction based on source condition indicators.',
    rule_data: { max_extraction_per_period: 1000, unit: 'm³', precautionary: true },
    enforced_by: 'Steward'
  },
  {
    id: 'source_precautionary',
    rule_type: 'access_requirement',
    label: 'Precautionary governance at stress',
    rationale: 'Blocks high-impact events when source regime is Stressed or worse.',
    rule_data: { block_when_regime: ['Stressed', 'Degraded', 'Critical'] },
    enforced_by: 'Steward'
  }
];

/** Legacy regime × nature matrix — used for Digital and as regime accents. */
const REGIME_NATURE_MATRIX: Record<PropertyRegime, Partial<Record<ResourceNature, string[]>>> = {
  Private: {
    Physical: ['access_accountable'],
    Digital: ['access_accountable', 'integrity_manifest'],
    Hybrid: ['access_accountable', 'maintenance_schedule']
  },
  Commons: {
    Physical: ['access_attribution'],
    Digital: ['access_attribution', 'integrity_manifest'],
    Hybrid: ['access_attribution']
  },
  Nondominium: {
    Physical: ['no_ownership_transfer', 'access_accountable', 'maintenance_schedule'],
    Digital: ['no_ownership_transfer', 'access_attribution', 'integrity_manifest'],
    Hybrid: ['no_ownership_transfer', 'access_accountable']
  },
  CommonPool: {
    Physical: ['quota_extraction', 'access_accountable', 'maintenance_schedule'],
    Digital: ['quota_extraction'],
    Hybrid: ['quota_extraction', 'maintenance_schedule']
  }
};

export const SOURCE_NDO_TEMPLATE_IDS = [
  'source_monitoring',
  'source_extraction_limit',
  'source_precautionary',
  'no_ownership_transfer'
];

export interface GovernanceTemplateQuery {
  regime: PropertyRegime;
  nature: ResourceNature;
  isSourceNdo?: boolean;
  economicMode?: EconomicMode | null;
  useKind?: UseKind | null;
  /** Override capacity_limit rule_data when known from the wizard. */
  maxConcurrentUsers?: number | null;
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

/**
 * Decision-table rows for inventoriable packs (Physical/Hybrid + economic mode).
 * First matching row wins. Regime accents are applied after the base pack.
 */
type PackRow = {
  mode: 'consume' | 'use';
  useKind?: 'unit' | 'capacity' | null;
  base: string[];
  /** Extra ids keyed by regime (merged onto base). */
  byRegime?: Partial<Record<PropertyRegime, string[]>>;
  /** Full override for a regime (replaces base instead of merging). */
  regimeReplace?: Partial<Record<PropertyRegime, string[]>>;
};

const ECONOMIC_PACK_TABLE: PackRow[] = [
  {
    mode: 'consume',
    base: ['quota_extraction', 'max_per_agent'],
    byRegime: {
      Private: ['access_accountable'],
      Commons: ['access_attribution'],
      Nondominium: ['access_accountable', 'no_ownership_transfer'],
      CommonPool: ['access_accountable', 'maintenance_schedule']
    }
  },
  {
    mode: 'use',
    useKind: 'capacity',
    base: ['capacity_limit', 'access_accountable'],
    regimeReplace: {
      Commons: ['capacity_limit', 'access_attribution']
    },
    byRegime: {
      Nondominium: ['no_ownership_transfer']
    }
  },
  {
    mode: 'use',
    useKind: 'unit',
    base: ['access_accountable', 'maintenance_schedule'],
    regimeReplace: {
      Commons: ['access_attribution', 'maintenance_schedule']
    },
    byRegime: {
      Nondominium: ['no_ownership_transfer']
    }
  }
];

function packFromTable(query: GovernanceTemplateQuery): string[] | null {
  if (!query.economicMode) return null;
  const useKind = query.useKind ?? 'unit';
  for (const row of ECONOMIC_PACK_TABLE) {
    if (row.mode !== query.economicMode) continue;
    if (row.mode === 'use' && row.useKind && row.useKind !== useKind) continue;
    const replaced = row.regimeReplace?.[query.regime];
    if (replaced) return uniqueIds(replaced);
    const extras = row.byRegime?.[query.regime] ?? [];
    return uniqueIds([...row.base, ...extras]);
  }
  return null;
}

function resolveIds(query: GovernanceTemplateQuery): string[] {
  if (query.isSourceNdo) {
    return [...SOURCE_NDO_TEMPLATE_IDS];
  }

  if (query.nature === 'Digital') {
    return (
      REGIME_NATURE_MATRIX[query.regime]?.Digital ??
      REGIME_NATURE_MATRIX[query.regime]?.Physical ??
      []
    );
  }

  const fromTable = packFromTable(query);
  if (fromTable) return fromTable;

  // Fallback: legacy regime × nature (no economic mode yet)
  return (
    REGIME_NATURE_MATRIX[query.regime]?.[query.nature] ??
    REGIME_NATURE_MATRIX[query.regime]?.Physical ??
    []
  );
}

function materialize(
  ids: string[],
  query: GovernanceTemplateQuery
): GovernanceRuleTemplate[] {
  return ids
    .map((id) => getTemplateById(id))
    .filter(Boolean)
    .map((t) => {
      const template = t as GovernanceRuleTemplate;
      if (
        template.id === 'capacity_limit' &&
        query.maxConcurrentUsers != null &&
        query.maxConcurrentUsers >= 2
      ) {
        return {
          ...template,
          rule_data: {
            ...template.rule_data,
            max_concurrent_users: query.maxConcurrentUsers
          }
        };
      }
      return template;
    });
}

/**
 * Recommended governance templates for an NDO.
 * Prefer the object form; the legacy (regime, nature, isSourceNdo) signature remains.
 */
export function getGovernanceTemplatesForNdo(
  regimeOrQuery: PropertyRegime | GovernanceTemplateQuery,
  nature?: ResourceNature,
  isSourceNdo = false
): GovernanceRuleTemplate[] {
  const query: GovernanceTemplateQuery =
    typeof regimeOrQuery === 'string'
      ? { regime: regimeOrQuery, nature: nature!, isSourceNdo }
      : regimeOrQuery;

  return materialize(resolveIds(query), query);
}

export function getTemplateById(id: string): GovernanceRuleTemplate | undefined {
  return BASE_TEMPLATES.find((t) => t.id === id);
}

export function getAllTemplates(): GovernanceRuleTemplate[] {
  return [...BASE_TEMPLATES];
}
