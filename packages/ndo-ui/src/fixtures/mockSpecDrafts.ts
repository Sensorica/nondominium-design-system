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
