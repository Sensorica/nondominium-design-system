import type { CreatableNdoLifecycleStage } from './enums.js';
import type { NdoArchetypeId, PropertyRegime, WizardTier } from './types.js';

export interface NdoArchetype {
  id: NdoArchetypeId;
  title: string;
  subtitle: string;
  intentQuestion: string;
  defaultLifecycleStage: CreatableNdoLifecycleStage;
  tier: WizardTier;
  /** Which wizard steps to show after kernel */
  showRefinement: boolean;
  showSpecificationAtCreate: boolean;
  /** Constrained regimes; empty = all MVP regimes allowed */
  allowedRegimes: PropertyRegime[] | null;
  defaultRegime: PropertyRegime | null;
  isSourceNdo: boolean;
  icon: string;
}

export const NDO_ARCHETYPES: NdoArchetype[] = [
  {
    id: 'stub',
    title: 'Capture an idea',
    subtitle: 'Register intent with minimal friction — Layer 0 only.',
    intentQuestion: 'I am capturing an idea or intention.',
    defaultLifecycleStage: 'Ideation',
    tier: 'Simple',
    showRefinement: false,
    showSpecificationAtCreate: false,
    allowedRegimes: null,
    defaultRegime: 'Commons',
    isSourceNdo: false,
    icon: '💡'
  },
  {
    id: 'open_design',
    title: 'Share a design',
    subtitle: 'Open design or knowledge ready to share with others.',
    intentQuestion: 'I am designing something to share.',
    defaultLifecycleStage: 'Specification',
    tier: 'Guided',
    showRefinement: true,
    showSpecificationAtCreate: false,
    allowedRegimes: null,
    defaultRegime: 'Commons',
    isSourceNdo: false,
    icon: '📐'
  },
  {
    id: 'active_project',
    title: 'Activate for use',
    subtitle: 'Mature resource entering collaborative use.',
    intentQuestion: 'I am activating an existing resource for use.',
    defaultLifecycleStage: 'Active',
    tier: 'Expert',
    showRefinement: true,
    showSpecificationAtCreate: true,
    allowedRegimes: null,
    defaultRegime: null,
    isSourceNdo: false,
    icon: '⚡'
  },
  {
    id: 'source_ndo',
    title: 'Steward a source',
    subtitle: 'Ecological or knowledge commons that yields resources.',
    intentQuestion: 'I am registering a generative source (watershed, fishery, knowledge commons).',
    defaultLifecycleStage: 'Specification',
    tier: 'Guided',
    showRefinement: true,
    showSpecificationAtCreate: false,
    allowedRegimes: ['Nondominium', 'CommonPool'],
    defaultRegime: 'Nondominium',
    isSourceNdo: true,
    icon: '🌊'
  }
];

export function getArchetype(id: NdoArchetypeId): NdoArchetype {
  const found = NDO_ARCHETYPES.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown archetype: ${id}`);
  return found;
}
