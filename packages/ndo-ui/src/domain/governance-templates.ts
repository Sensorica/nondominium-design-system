import type { GovernanceRuleTemplate, PropertyRegime, ResourceNature } from './types.js';

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
  },
];

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

export function getGovernanceTemplatesForNdo(
  regime: PropertyRegime,
  nature: ResourceNature,
  isSourceNdo = false
): GovernanceRuleTemplate[] {
  if (isSourceNdo) {
    return SOURCE_NDO_TEMPLATE_IDS.map((id) => getTemplateById(id)).filter(
      Boolean
    ) as GovernanceRuleTemplate[];
  }

  const ids =
    REGIME_NATURE_MATRIX[regime]?.[nature] ?? REGIME_NATURE_MATRIX[regime]?.Physical ?? [];
  return ids.map((id) => getTemplateById(id)).filter(Boolean) as GovernanceRuleTemplate[];
}

export function getTemplateById(id: string): GovernanceRuleTemplate | undefined {
  return BASE_TEMPLATES.find((t) => t.id === id);
}

export function getAllTemplates(): GovernanceRuleTemplate[] {
  return [...BASE_TEMPLATES];
}
