import type { LifecycleStage, PropertyRegime, ResourceNature } from './types.js';

export const ALL_LIFECYCLE_STAGES: LifecycleStage[] = [
  'Ideation',
  'Specification',
  'Development',
  'Prototype',
  'Stable',
  'Distributed',
  'Active',
  'Hibernating',
  'Deprecated',
  'EndOfLife'
];

export const MVP_REGIMES: PropertyRegime[] = ['Private', 'Commons', 'Nondominium', 'CommonPool'];

export const ALL_RESOURCE_NATURES: ResourceNature[] = [
  'Physical',
  'Digital',
  'Service',
  'Hybrid',
  'Information'
];

export const CREATABLE_NDO_LIFECYCLE_STAGES = [
  'Ideation',
  'Specification',
  'Development',
  'Prototype',
  'Stable',
  'Distributed',
  'Active'
] as const satisfies readonly LifecycleStage[];

export type CreatableNdoLifecycleStage = (typeof CREATABLE_NDO_LIFECYCLE_STAGES)[number];

export const CARD_ACTIVE_LIFECYCLE_STAGES: LifecycleStage[] = [
  'Active',
  'Stable',
  'Distributed',
  'Development',
  'Prototype'
];
