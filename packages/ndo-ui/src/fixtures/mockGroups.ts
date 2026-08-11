import type { GroupDescriptor } from '../domain/types.js';
import { MOCK_AGENT_NAMES } from './mockAgents.js';

export const MOCK_GROUPS: GroupDescriptor[] = [
  {
    id: 'grp_sensorica',
    name: 'Sensorica',
    createdBy: MOCK_AGENT_NAMES.tibi,
    createdAt: 1700000000000,
    ndoHashes: [
      'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm',
      'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
      'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9'
    ]
  },
  {
    id: 'grp_opensourceecology',
    name: 'OpenSourceEcology',
    createdBy: MOCK_AGENT_NAMES.bauwens,
    createdAt: 1699000000000,
    ndoHashes: ['uhC0k1234abcdefghijklmnopqrstuvwx', 'uhC0kIdeationOnlyHashExample00001']
  },
  {
    id: 'grp_waterfrance',
    name: 'WaterFrance',
    createdBy: MOCK_AGENT_NAMES.sacha,
    createdAt: 1698500000000,
    ndoHashes: ['uhC0kSourceNdoRiverExample01']
  }
];
