import type {
  Accessibility,
  PropertyRegime,
  ResourceNature,
  ResourceScope,
  ResourceSource,
  Rivalry,
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
    description: 'Software, data files, design files — copyable at near-zero cost.',
    suggestedRivalry: 'NonRivalrous'
  },
  {
    id: 'Information',
    label: 'Knowledge or documentation',
    description: 'Methods, protocols, research, structured knowledge.',
    suggestedRivalry: 'NonRivalrous'
  },
  {
    id: 'Service',
    label: 'Service or capability',
    description: 'Time-based provision of skill, API access, or maintenance.',
    suggestedRivalry: 'Rivalrous'
  },
  {
    id: 'Hybrid',
    label: 'Physical + digital twin',
    description: 'A material resource with an essential digital specification layer.',
    suggestedRivalry: 'Rivalrous'
  }
];

export const RIVALRY_QUESTION = {
  id: 'rivalry',
  question: 'When someone uses this, does it block others from using it at the same time?',
  options: [
    {
      id: 'Rivalrous' as Rivalry,
      label: 'Yes — use by one can exclude others',
      description: 'Tools, machines, consumables, scheduled access.'
    },
    {
      id: 'NonRivalrous' as Rivalry,
      label: 'No — many can use it simultaneously',
      description: 'Designs, methods, documentation, broadcast knowledge.'
    }
  ]
};

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
  const resolvedRivalry =
    rivalry ?? NATURE_CHOICES.find((c) => c.id === nature)?.suggestedRivalry ?? 'Rivalrous';

  return {
    property_regime: regime,
    rivalry: resolvedRivalry,
    scope: 'Network',
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

  if (refinement.property_regime === 'Nondominium') {
    lines.push('No agent can claim ownership or enclose this resource.');
    lines.push('Access is earned through contribution and governance participation.');
  } else if (refinement.property_regime === 'Commons') {
    lines.push('Open sharing with attribution; copy-left style governance expected.');
  } else if (refinement.property_regime === 'CommonPool') {
    lines.push('Subtractable access — quotas or scheduling may apply.');
  } else if (refinement.property_regime === 'Private') {
    lines.push('Full rights bundle; custodian controls access decisions.');
  }

  if (refinement.rivalry === 'Rivalrous') {
    lines.push('Rivalrous: access scheduling and custody tracking recommended.');
  } else if (refinement.rivalry === 'NonRivalrous') {
    lines.push('Non-rivalrous: open access preferred; versioning and attribution matter.');
  }

  if (nature === 'Physical' || nature === 'Hybrid') {
    lines.push('Physical resources typically require maintenance and custody protocols.');
  }
  if (nature === 'Digital' || nature === 'Information') {
    lines.push('Digital resources benefit from integrity manifests and license clarity.');
  }

  return lines;
}
