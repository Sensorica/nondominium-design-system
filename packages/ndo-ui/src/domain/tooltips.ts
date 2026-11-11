import type { PropertyRegime, ResourceNature } from './types.js';

export const REGIME_TOOLTIPS: Record<PropertyRegime, string> = {
  Private: 'Owned and controlled by a single agent.',
  Commons: 'Shared, self-governed resource open to a defined community.',
  Nondominium: 'Cannot be captured or exclusively owned; maximally open.',
  CommonPool: 'A commons with a defined boundary and subtractable access.'
};

export const NATURE_TOOLTIPS: Record<ResourceNature, string> = {
  Physical: 'A tangible, material resource — may be inventoriable (shelf units, custody).',
  Digital:
    'Software, data, designs, documents, datasets, and methods. Unique by content or address — not inventoriable stock (copies are trivial).',
  Hybrid:
    'A material resource with an essential digital twin. Inventory may track the physical face; the digital face is located by address, not shelf units.'
};
