import type { PropertyRegime, ResourceNature } from './types.js';

export const REGIME_TOOLTIPS: Record<PropertyRegime, string> = {
  Private: 'Owned and controlled by a single agent.',
  Commons: 'Shared, self-governed resource open to a defined community.',
  Nondominium: 'Cannot be captured or exclusively owned; maximally open.',
  CommonPool: 'A commons with a defined boundary and subtractable access.'
};

export const NATURE_TOOLTIPS: Record<ResourceNature, string> = {
  Physical: 'A tangible, material resource.',
  Digital: 'An intangible, bit-based resource (software, data, etc.).',
  Service: 'A time-based provision of capability or skill.',
  Hybrid: 'A resource with both physical and digital dimensions.',
  Information: 'Knowledge, documentation, or structured data.'
};
