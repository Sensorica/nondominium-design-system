import type { GroupDescriptor } from '../domain/types.js';

export const MOCK_GROUPS: GroupDescriptor[] = [
  {
    id: 'grp_sensorica',
    name: 'Sensorica',
    createdBy: 'Alice M.',
    createdAt: 1700000000000,
    ndoHashes: [
      'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm',
      'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
      'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
      'uhC0k1234abcdefghijklmnopqrstuvwx'
    ]
  },
  {
    id: 'grp_ovn',
    name: 'Open Value Network',
    createdBy: 'Bob K.',
    createdAt: 1699000000000,
    ndoHashes: ['uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9']
  }
];
