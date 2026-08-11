import type { NdoDescriptor } from '../domain/types.js';
import { MOCK_AGENT_NAMES } from './mockAgents.js';

export const MOCK_SOURCE_NDO: NdoDescriptor = {
  hash: 'uhC0kSourceNdoRiverExample01',
  name: 'Mill Creek Watershed',
  description:
    'Generative hydrological source stewarded by WaterFrance. Yields water, receives loading events, conditions downstream sources.',
  lifecycle_stage: 'Specification',
  resource_nature: 'Physical',
  property_regime: 'Nondominium',
  initiator: 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa',
  created_at: 1710500000000000,
  successor_ndo_hash: null,
  hibernation_origin: null,
  ndo_archetype: 'source_ndo',
  rivalry: 'Rivalrous',
  scope: 'Network',
  source_profile: {
    source_type: 'Hydrological',
    regime_state: 'Stable',
    stewarded_by: [MOCK_AGENT_NAMES.sacha, MOCK_AGENT_NAMES.lynn],
    current_stock: 850000,
    flux_rate: 12000,
    assimilation_capacity: 450,
    resilience: 0.72,
    tipping_threshold: 0.35,
    complex_interior: true,
    ecological_values: {
      Sustenance: 8,
      Regeneration: 6,
      Resilience: 7,
      AdaptiveCapacity: 5,
      GenerativeCapacity: 7,
      CommonsValue: 9,
      LearningValue: 4
    }
  }
};
