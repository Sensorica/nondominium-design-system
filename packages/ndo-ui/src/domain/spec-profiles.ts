import type { ResourceNature, SpecProfileField } from './types.js';

const PHYSICAL_FIELDS: SpecProfileField[] = [
  {
    id: 'dimensions',
    label: 'Dimensions / size',
    placeholder: 'e.g. 1200×800×400 mm',
    inputType: 'text'
  },
  {
    id: 'location',
    label: 'Default location',
    placeholder: 'Where is this resource usually kept?',
    inputType: 'text'
  },
  {
    id: 'custodian_notes',
    label: 'Custody notes',
    placeholder: 'Who holds it and under what terms?',
    inputType: 'textarea'
  },
  {
    id: 'bom_ref',
    label: 'Bill of materials',
    placeholder: 'Link or reference to BOM',
    inputType: 'url'
  },
  { id: 'maintenance_interval', label: 'Maintenance interval (days)', inputType: 'number' }
];

const DIGITAL_FIELDS: SpecProfileField[] = [
  {
    id: 'repository',
    label: 'Source repository',
    placeholder: 'https://…',
    inputType: 'url',
    required: true
  },
  {
    id: 'license',
    label: 'License',
    placeholder: 'e.g. CERN-OHL-S, AGPL-3.0',
    inputType: 'text',
    required: true
  },
  { id: 'format', label: 'Primary format', placeholder: 'e.g. STEP, SVG, JSON', inputType: 'text' },
  {
    id: 'integrity_hash',
    label: 'Content hash (SHA-256)',
    placeholder: 'Optional manifest hash',
    inputType: 'text'
  },
  { id: 'documentation', label: 'Documentation link', inputType: 'url' }
];

const SERVICE_FIELDS: SpecProfileField[] = [
  {
    id: 'endpoint',
    label: 'Service endpoint',
    placeholder: 'URL or contact method',
    inputType: 'url'
  },
  {
    id: 'availability',
    label: 'Availability window',
    placeholder: 'e.g. Mon–Fri 9–17',
    inputType: 'text'
  },
  { id: 'sla', label: 'SLA summary', inputType: 'textarea' },
  {
    id: 'required_role',
    label: 'Required role to initiate',
    placeholder: 'e.g. AccountableAgent',
    inputType: 'text'
  }
];

const HYBRID_FIELDS: SpecProfileField[] = [
  ...PHYSICAL_FIELDS.slice(0, 3),
  ...DIGITAL_FIELDS.slice(0, 3)
];

const INFORMATION_FIELDS: SpecProfileField[] = [
  {
    id: 'method_summary',
    label: 'Method / protocol summary',
    inputType: 'textarea',
    required: true
  },
  { id: 'version', label: 'Version', placeholder: 'e.g. 1.2.0', inputType: 'text' },
  { id: 'license', label: 'License / ToS', inputType: 'text' },
  { id: 'upstream_ref', label: 'Upstream reference', inputType: 'url' },
  { id: 'quality_criteria', label: 'Quality criteria', inputType: 'textarea' }
];

const SOURCE_FIELDS: SpecProfileField[] = [
  {
    id: 'boundary_description',
    label: 'Ecological boundary',
    placeholder: 'Describe the source boundary',
    inputType: 'textarea',
    required: true
  },
  { id: 'monitoring_plan', label: 'Monitoring plan', inputType: 'textarea' },
  { id: 'stakeholder_map', label: 'Key stakeholders', inputType: 'textarea' },
  { id: 'restoration_obligations', label: 'Restoration obligations', inputType: 'textarea' }
];

export function getSpecProfileFields(
  nature: ResourceNature,
  isSourceNdo = false
): SpecProfileField[] {
  if (isSourceNdo) {
    return [...SOURCE_FIELDS, ...getBaseFieldsForNature(nature)];
  }
  return getBaseFieldsForNature(nature);
}

function getBaseFieldsForNature(nature: ResourceNature): SpecProfileField[] {
  switch (nature) {
    case 'Physical':
      return PHYSICAL_FIELDS;
    case 'Digital':
      return DIGITAL_FIELDS;
    case 'Service':
      return SERVICE_FIELDS;
    case 'Hybrid':
      return HYBRID_FIELDS;
    case 'Information':
      return INFORMATION_FIELDS;
    default:
      return DIGITAL_FIELDS;
  }
}

export const ECOLOGICAL_VALUE_DIMENSIONS = [
  {
    id: 'Sustenance' as const,
    label: 'Sustenance',
    description: 'Ongoing provision of economic resources'
  },
  {
    id: 'Regeneration' as const,
    label: 'Regeneration',
    description: 'Capacity to restore itself and other sources'
  },
  { id: 'Resilience' as const, label: 'Resilience', description: 'Stabilisation under shock' },
  {
    id: 'AdaptiveCapacity' as const,
    label: 'Adaptive capacity',
    description: 'Ability to evolve into new configurations'
  },
  {
    id: 'GenerativeCapacity' as const,
    label: 'Generative capacity',
    description: 'Future resources not yet known'
  },
  {
    id: 'CommonsValue' as const,
    label: 'Commons value',
    description: 'Shared infrastructure significance'
  },
  {
    id: 'LearningValue' as const,
    label: 'Learning value',
    description: 'Knowledge from observation and interaction'
  }
];

export const SOURCE_TYPE_OPTIONS = [
  {
    id: 'Hydrological' as const,
    label: 'Hydrological',
    description: 'Watershed, river, groundwater, wetland'
  },
  {
    id: 'Biological' as const,
    label: 'Biological',
    description: 'Forest, fishery, soil, biodiversity'
  },
  { id: 'Atmospheric' as const, label: 'Atmospheric', description: 'Atmosphere, climate system' },
  {
    id: 'KnowledgeCommons' as const,
    label: 'Knowledge commons',
    description: 'Open repository, scientific commons'
  },
  { id: 'SocialCommons' as const, label: 'Social commons', description: 'Community, trust fabric' }
];

export const SOURCE_REGIME_STATE_OPTIONS = [
  { id: 'Pristine' as const, label: 'Pristine', description: 'Minimal anthropogenic impact' },
  { id: 'Stable' as const, label: 'Stable', description: 'Functioning within normal variability' },
  {
    id: 'Stressed' as const,
    label: 'Stressed',
    description: 'Measurable degradation; precaution active'
  },
  { id: 'Degraded' as const, label: 'Degraded', description: 'Significant loss of function' },
  { id: 'Critical' as const, label: 'Critical', description: 'Near tipping threshold' },
  { id: 'Transformed' as const, label: 'Transformed', description: 'Post-regime-shift state' }
];
