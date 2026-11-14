import type { NdoSpecificationDraft } from '../domain/types.js';

export const MOCK_SPEC_DRAFT: NdoSpecificationDraft = {
  category: 'Hydrology / Commons',
  tags: ['watershed', 'monitoring', 'nondominium'],
  fields: [
    {
      fieldId: 'boundary_description',
      value: 'Upper Mill Creek basin including riparian buffer zone (~42 km²).'
    },
    {
      fieldId: 'monitoring_plan',
      value: 'Monthly flow gauging; quarterly water quality sampling at 3 stations.'
    }
  ],
  governance_rule_ids: ['source_monitoring', 'source_extraction_limit', 'no_ownership_transfer']
};

export const MOCK_SPEC_DRAFT_DIGITAL: NdoSpecificationDraft = {
  category: 'Open Design',
  tags: ['sensor', 'iot', 'commons'],
  fields: [
    { fieldId: 'repository', value: 'https://github.com/example/sensor-design' },
    { fieldId: 'license', value: 'CERN-OHL-S-2.0' },
    { fieldId: 'format', value: 'KiCad, STEP' }
  ],
  governance_rule_ids: ['access_attribution', 'integrity_manifest']
};

/** Use/unit Physical enrichment fixture. */
export const MOCK_SPEC_DRAFT_USE_UNIT: NdoSpecificationDraft = {
  category: 'Shared tools',
  tags: ['printer', 'lab', 'use'],
  fields: [
    { fieldId: 'unique_id', value: 'PRINTER-LAB-01' },
    { fieldId: 'maintenance_notes', value: 'Nozzle check every 30 days.' }
  ],
  governance_rule_ids: ['access_accountable', 'maintenance_schedule']
};

/** Use/capacity Physical enrichment fixture. */
export const MOCK_SPEC_DRAFT_USE_CAPACITY: NdoSpecificationDraft = {
  category: 'Spaces',
  tags: ['workshop', 'capacity'],
  fields: [{ fieldId: 'max_concurrent_users', value: '8' }],
  governance_rule_ids: ['capacity_limit', 'access_accountable']
};

/** Consume batch Physical enrichment fixture. */
export const MOCK_SPEC_DRAFT_CONSUME: NdoSpecificationDraft = {
  category: 'Harvest / stock',
  tags: ['batch', 'consume', 'lot'],
  fields: [
    { fieldId: 'default_unit', value: 'kg' },
    { fieldId: 'initial_quantity', value: '250' },
    { fieldId: 'identification_pattern', value: 'LotControlled' }
  ],
  governance_rule_ids: ['quota_extraction', 'max_per_agent', 'access_accountable', 'maintenance_schedule']
};
