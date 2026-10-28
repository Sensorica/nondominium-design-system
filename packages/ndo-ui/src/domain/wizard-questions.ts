import type {
  Accessibility,
  PropertyRegime,
  ResourceNature,
  ResourceScope,
  ResourceSource,
  Rivalry,
  SourceType,
  SubtractionKind,
  Transferability,
  WizardRefinementState
} from './types.js';

export interface NarrativeOption<T extends string = string> {
  id: T;
  label: string;
  description?: string;
}

export interface NatureChoice {
  id: ResourceNature;
  label: string;
  description: string;
  suggestedRivalry: Rivalry;
}

export const NATURE_CHOICES: NatureChoice[] = [
  {
    id: 'Physical',
    label: 'Physical thing',
    description: 'Tools, equipment, spaces, materials — tangible objects.',
    suggestedRivalry: 'Rivalrous'
  },
  {
    id: 'Digital',
    label: 'Digital artifact',
    description: 'Software, data, designs, documents, datasets, and methods.',
    suggestedRivalry: 'NonRivalrous'
  },
  {
    id: 'Hybrid',
    label: 'Physical + digital twin',
    description: 'A material resource with an essential digital specification layer.',
    suggestedRivalry: 'Rivalrous'
  }
];

/** Nature default. Matches `ResourceNature::default_rivalry`. */
export function rivalryForNature(nature: ResourceNature): Rivalry {
  return NATURE_CHOICES.find((choice) => choice.id === nature)?.suggestedRivalry ?? 'Rivalrous';
}

/** Ecological sources are physical. Knowledge and social commons are digital. */
export function natureForSourceType(sourceType: SourceType): ResourceNature {
  return sourceType === 'KnowledgeCommons' || sourceType === 'SocialCommons' ? 'Digital' : 'Physical';
}

/** Source-NDO meaning of the stages a registration may use. Prototype and Distributed are fabrication stages. */
export const SOURCE_STAGE_GLOSS: Record<string, string> = {
  Specification: 'Boundary and who is affected are named. A monitoring plan can still be a draft.',
  Development: 'Stewards are named and monitoring is starting. Rules are still being written.',
  Stable: 'Monitoring is running and the rules are in use.',
  Active: 'The stewardship loop is running: events, readings, and rule revision.'
};

export const SOURCE_RIVALRY_STATEMENT: Record<Rivalry, { label: string; detail: string }> = {
  Rivalrous: {
    label: 'Rivalrous',
    detail: 'What is taken leaves less for others. A quota is a usage rule.'
  },
  NonRivalrous: {
    label: 'Non-rivalrous',
    detail: 'Many people can draw on it at once. A limit on copies is an access rule.'
  }
};

export const SOURCE_ARRANGEMENTS: {
  regime: PropertyRegime;
  label: string;
  description: string;
}[] = [
  {
    regime: 'Nondominium',
    label: 'No one can own it',
    description: 'Uncapturable. Stewards carry obligations, not title.'
  },
  {
    regime: 'CommonPool',
    label: 'A quota limits what can be taken',
    description: 'The yield is subtractable. Extraction stays inside a limit.'
  }
];

export const RIVALRY_STATEMENT: Record<Rivalry, { label: string; detail: string }> = {
  Rivalrous: {
    label: 'Rivalrous',
    detail:
      'Use subtracts from what is available. A shared place can hold several people until its capacity is reached. That capacity is a usage rule.'
  },
  NonRivalrous: {
    label: 'Non-rivalrous',
    detail:
      'Many people can use this at the same time. A limit on seats or downloads is an access rule.'
  }
};

export const SUBTRACTION_OPTIONS: {
  id: SubtractionKind;
  label: string;
  description: string;
  ruleId: string;
}[] = [
  {
    id: 'unit',
    label: 'One holder at a time',
    description: 'A tool or machine. Scheduling and custody apply.',
    ruleId: 'maintenance_schedule'
  },
  {
    id: 'capacity',
    label: 'Room for several people at once',
    description: 'A place stays rivalrous. Capacity is a usage limit.',
    ruleId: 'capacity_limit'
  },
  {
    id: 'consumable',
    label: 'It is used up',
    description: 'Materials or stock. A quota limits how fast it is depleted.',
    ruleId: 'quota_extraction'
  }
];

export function subtractionOption(kind: SubtractionKind) {
  return SUBTRACTION_OPTIONS.find((option) => option.id === kind);
}

export const ACCESS_CONTROL_QUESTION = {
  id: 'access_control',
  question: 'Who should control access to this resource?',
  options: [
    {
      id: 'private' as const,
      label: 'One agent or organisation',
      description: 'Individual stewardship with full rights bundle.',
      suggestedRegime: 'Private' as PropertyRegime
    },
    {
      id: 'community_share' as const,
      label: 'A defined community shares it',
      description: 'Shared stewardship — attribution and community rules apply.',
      suggestedRegime: 'Commons' as PropertyRegime
    },
    {
      id: 'uncapturable' as const,
      label: 'No one should be able to own or enclose it',
      description: 'Contribution-based access; no alienation permitted.',
      suggestedRegime: 'Nondominium' as PropertyRegime
    },
    {
      id: 'bounded_pool' as const,
      label: 'A bounded pool with subtractable access',
      description: 'Rivalrous commons — quotas, scheduling, depletion rules.',
      suggestedRegime: 'CommonPool' as PropertyRegime
    }
  ]
};

/** Access choices that fit this nature. A bounded pool is for rivalrous resources. */
export function accessOptionsForNature(
  nature: ResourceNature,
  allowedRegimes: readonly PropertyRegime[] | null = null
) {
  const regimes = allowedRegimes ?? ACCESS_CONTROL_QUESTION.options.map((option) => option.suggestedRegime);
  return ACCESS_CONTROL_QUESTION.options.filter((option) => {
    if (!regimes.includes(option.suggestedRegime)) return false;
    if (rivalryForNature(nature) === 'NonRivalrous' && option.id === 'bounded_pool') return false;
    return true;
  });
}

/** Regimes offered for this nature, including a source's restricted list. */
export function regimesForNature(
  nature: ResourceNature,
  allowedRegimes: readonly PropertyRegime[] | null
): PropertyRegime[] {
  const base =
    allowedRegimes ??
    (['Private', 'Commons', 'Nondominium', 'CommonPool'] as PropertyRegime[]);
  if (rivalryForNature(nature) === 'NonRivalrous') {
    return base.filter((regime) => regime !== 'CommonPool');
  }
  return [...base];
}

/**
 * Mirrors `check_scope_coherence`: a Nondominium registration implies Public
 * scope. Narrower scope would hide an uncapturable resource from everyone
 * outside one project or network. The wizard does not offer the Public regime.
 */
export function scopePermitted(regime: PropertyRegime, scope: ResourceScope): boolean {
  return regime === 'Nondominium' ? scope === 'Public' : true;
}

export function withCoherentScope<
  T extends { property_regime: PropertyRegime; scope: ResourceScope | null }
>(state: T): T {
  if (state.property_regime !== 'Nondominium') return state;
  if (state.scope === 'Public') return state;
  return { ...state, scope: 'Public' };
}

export const SCOPE_OPTIONS: NarrativeOption<ResourceScope>[] = [
  {
    id: 'Project',
    label: 'This project or group only',
    description: 'Visible primarily to group members.'
  },
  {
    id: 'Network',
    label: 'The whole network',
    description: 'Discoverable across affiliated groups.'
  },
  {
    id: 'Public',
    label: 'Public commons',
    description: 'Globally discoverable; open participation.'
  }
];

export const SOURCE_OPTIONS: NarrativeOption<ResourceSource>[] = [
  { id: 'Network', label: 'Created here', description: 'Originated within this network.' },
  {
    id: 'Partner',
    label: 'Contributed by a partner',
    description: 'Allied network with possible use restrictions.'
  },
  { id: 'Purchased', label: 'Acquired externally', description: 'Market or external acquisition.' },
  { id: 'Donated', label: 'Gifted with conditions', description: 'Donated with stated terms.' }
];

export function inferRegimeFromRivalryAndAccess(
  rivalry: Rivalry,
  accessId: (typeof ACCESS_CONTROL_QUESTION.options)[number]['id']
): PropertyRegime {
  const accessOption = ACCESS_CONTROL_QUESTION.options.find((o) => o.id === accessId);
  if (accessOption) return accessOption.suggestedRegime;

  if (rivalry === 'NonRivalrous') return 'Commons';
  return 'CommonPool';
}

export function inferTransferability(regime: PropertyRegime): Transferability {
  switch (regime) {
    case 'Private':
      return 'Transferable';
    case 'Nondominium':
    case 'Commons':
    case 'CommonPool':
      return 'Shareable';
    default:
      return 'Shareable';
  }
}

export function inferAccessibility(regime: PropertyRegime, rivalry: Rivalry): Accessibility {
  if (regime === 'Private') return 'Gated';
  if (regime === 'Nondominium' || regime === 'Commons')
    return rivalry === 'NonRivalrous' ? 'Free' : 'Credentialed';
  return 'Credentialed';
}

export function buildDefaultRefinement(
  nature: ResourceNature,
  regime: PropertyRegime,
  rivalry: Rivalry | null = null
): WizardRefinementState {
  const resolvedRivalry = rivalry ?? rivalryForNature(nature);

  return {
    property_regime: regime,
    rivalry: resolvedRivalry,
    subtraction: null,
    scope: regime === 'Nondominium' ? 'Public' : 'Network',
    source: 'Network',
    transferability: inferTransferability(regime),
    accessibility: inferAccessibility(regime, resolvedRivalry),
    regime_not_sure: false,
    source_profile: null
  };
}

export function getGovernanceImplications(
  refinement: WizardRefinementState,
  nature: ResourceNature
): string[] {
  const lines: string[] = [];

  const isSource = refinement.source_profile != null;
  if (refinement.property_regime === 'Nondominium') {
    lines.push(`No agent can claim ownership or enclose this ${isSource ? 'source' : 'resource'}.`);
    lines.push('Access is earned through contribution and governance participation.');
  } else if (refinement.property_regime === 'Commons') {
    lines.push('Open sharing with attribution; copy-left style governance expected.');
  } else if (refinement.property_regime === 'CommonPool') {
    lines.push('Subtractable access — quotas or scheduling may apply.');
  } else if (refinement.property_regime === 'Private') {
    lines.push('Full rights bundle; custodian controls access decisions.');
  }

  if (isSource) {
    lines.push('Stewards carry obligations. No one holds title.');
  } else if (refinement.subtraction) {
    const chosen = subtractionOption(refinement.subtraction);
    if (chosen) lines.push(chosen.description);
  } else if (refinement.rivalry === 'Rivalrous') {
    lines.push('Rivalrous: say whether use is one holder, a capacity, or a consumable.');
  } else if (refinement.rivalry === 'NonRivalrous') {
    lines.push('Non-rivalrous: many people can use it at once. Limits are access rules.');
  }

  if (nature === 'Digital' && !isSource) {
    lines.push('Digital resources benefit from integrity manifests and license clarity.');
  }

  return lines;
}
