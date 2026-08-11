import type { NdoDescriptor } from '../domain/types.js';
import { MOCK_AGENT_NAMES } from './mockAgents.js';

export const MOCK_NDOS: NdoDescriptor[] = [
  {
    hash: 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm',
    name: 'Community Solar Array',
    description:
      'Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective.',
    lifecycle_stage: 'Active',
    resource_nature: 'Physical',
    property_regime: 'Nondominium',
    initiator: 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa',
    created_at: 1710000000000000,
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
    name: 'Open Hardware CNC Bed',
    description: 'Community-maintained CNC router available for approved fabrication tasks.',
    lifecycle_stage: 'Stable',
    resource_nature: 'Physical',
    property_regime: 'Commons',
    initiator: 'uhCAk9Rp7Yq2mNwsQzLtYd4uJcFe7gHiKoNbPmVb',
    created_at: 1709000000000000,
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
    name: 'Distributed Sensor Design v3',
    description:
      'Open-source IoT sensor design file for environmental monitoring in urban commons.',
    lifecycle_stage: 'Distributed',
    resource_nature: 'Digital',
    property_regime: 'Commons',
    initiator: 'uhCAk3vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVc',
    created_at: 1708000000000000,
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0k1234abcdefghijklmnopqrstuvwx',
    name: 'Collective Laser Cutter',
    description: 'Shared laser cutter maintained by OpenSourceEcology.',
    lifecycle_stage: 'Prototype',
    resource_nature: 'Physical',
    property_regime: 'CommonPool',
    initiator: 'uhCAk4vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVd',
    created_at: 1707000000000000,
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kIdeationOnlyHashExample00001',
    name: 'Neighborhood Tool Library (planned)',
    description: 'Emerging concept for a hyperlocal shareable tool pool.',
    lifecycle_stage: 'Ideation',
    resource_nature: 'Physical',
    property_regime: 'Private',
    initiator: 'uhCAk5vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVe',
    created_at: 1706000000000000,
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kSourceNdoRiverExample01',
    name: 'Mill Creek Watershed',
    description: 'Generative hydrological source stewarded by WaterFrance.',
    lifecycle_stage: 'Specification',
    resource_nature: 'Physical',
    property_regime: 'Nondominium',
    initiator: 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa',
    created_at: 1710500000000000,
    successor_ndo_hash: null,
    hibernation_origin: null,
    ndo_archetype: 'source_ndo',
    source_profile: {
      source_type: 'Hydrological',
      regime_state: 'Stable',
      stewarded_by: [MOCK_AGENT_NAMES.sacha, MOCK_AGENT_NAMES.lynn],
      current_stock: 850000,
      flux_rate: 12000,
      assimilation_capacity: 450,
      resilience: 0.72,
      complex_interior: true
    }
  }
];
