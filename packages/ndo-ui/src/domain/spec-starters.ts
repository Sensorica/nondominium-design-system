/**
 * Context starters for the Layer 1 “kind of item” / Source specification form.
 * Plain language; keyed off nature + regime + Source archetype (+ NDO name for hints).
 * Seeds VF foreshadow: inventory intent, identification, default unit, SourceSpecification.
 */
import type {
  DigitalLocatorKind,
  IdentificationPattern,
  InventoryIntent,
  NdoArchetypeId,
  PropertyRegime,
  ResourceNature,
  ResourceScope,
  SourceType
} from './types.js';
import { resolveScope } from './layer1.js';
import { isSourceNdoDescriptor } from './spec-profiles.js';

export interface SpecStarter {
  id: string;
  /** Short card title shown to the user. */
  label: string;
  /** One-line why this starter fits. */
  blurb: string;
  name: string;
  description: string;
  /** Primary browse classification (Rust `category`). */
  category: string;
  scope: ResourceScope;
  tags?: string[];
  inventory_intent: InventoryIntent;
  identification_pattern: IdentificationPattern | null;
  default_unit: string | null;
  substitutable: boolean | null;
  digital_locator_kind?: DigitalLocatorKind | null;
  digital_locator?: string | null;
  boundary_description?: string | null;
  monitoring_plan?: string | null;
  stakeholder_map?: string | null;
  restoration_obligations?: string | null;
}

function shortName(ndoName: string | null | undefined): string {
  const n = (ndoName ?? '').trim();
  if (!n) return 'this resource';
  return n.length > 40 ? `${n.slice(0, 37)}…` : n;
}

function sourceNotApplicable(
  partial: Omit<
    SpecStarter,
    | 'inventory_intent'
    | 'identification_pattern'
    | 'default_unit'
    | 'substitutable'
    | 'digital_locator_kind'
    | 'digital_locator'
  > & {
    digital_locator_kind?: DigitalLocatorKind | null;
  }
): SpecStarter {
  return {
    ...partial,
    inventory_intent: 'NotApplicable',
    identification_pattern: null,
    default_unit: null,
    substitutable: null,
    digital_locator_kind: partial.digital_locator_kind ?? null,
    digital_locator: null,
    boundary_description: partial.boundary_description ?? null,
    monitoring_plan: partial.monitoring_plan ?? null,
    stakeholder_map: partial.stakeholder_map ?? null,
    restoration_obligations: partial.restoration_obligations ?? null
  };
}

function startersForSource(
  label: string,
  withScope: (s: ResourceScope) => ResourceScope,
  sourceType: SourceType | string | null | undefined
): SpecStarter[] {
  const type = String(sourceType ?? 'Hydrological');

  if (type === 'Biological') {
    return [
      sourceNotApplicable({
        id: 'forest-system',
        label: 'Forest / stand',
        blurb: 'Biological system — yields timber, habitat; conditions water.',
        name: `${label} — forest system`,
        description: `Boundary and stewardship for the forest side of ${label}.`,
        category: 'forest',
        scope: withScope('Public'),
        tags: ['biological', 'forest'],
        boundary_description: `Spatial and ecological boundary of ${label} (stand, canopy, soil).`,
        monitoring_plan: 'Canopy cover, regeneration, biodiversity indicators.',
        stakeholder_map: 'Stewards, harvesters, downstream water users.',
        restoration_obligations: 'Reforestation / remediation after harvest or damage.'
      }),
      sourceNotApplicable({
        id: 'fishery',
        label: 'Fishery / stock',
        blurb: 'Rivalrous biological yield — quotas and monitoring.',
        name: `${label} — fishery`,
        description: `Stock and catch governance for ${label}.`,
        category: 'fishery',
        scope: withScope('Network'),
        tags: ['biological', 'fishery'],
        boundary_description: `Geographic and stock boundary for ${label}.`,
        monitoring_plan: 'Landings, biomass estimates, seasonal surveys.',
        stakeholder_map: 'Fishers, stewards, regulators.',
        restoration_obligations: 'Restocking or habitat restoration when stock is stressed.'
      }),
      sourceNotApplicable({
        id: 'soil-system',
        label: 'Soil / biome',
        blurb: 'Regenerative capacity — not a shelf unit.',
        name: `${label} — soil system`,
        description: `Soil and biome condition framework for ${label}.`,
        category: 'soil',
        scope: withScope('Project'),
        tags: ['biological', 'soil'],
        boundary_description: `Soil / biome extent under stewardship for ${label}.`,
        monitoring_plan: 'Organic matter, erosion, contamination.',
        stakeholder_map: 'Land stewards, farmers, researchers.',
        restoration_obligations: 'Remediation and regenerative practices.'
      })
    ];
  }

  if (type === 'Atmospheric') {
    return [
      sourceNotApplicable({
        id: 'air-shed',
        label: 'Airshed / climate cell',
        blurb: 'Assimilation capacity — loading and monitoring.',
        name: `${label} — airshed`,
        description: `Atmospheric assimilation and loading rules for ${label}.`,
        category: 'atmospheric',
        scope: withScope('Public'),
        tags: ['atmospheric'],
        boundary_description: `Airshed or climate cell boundary for ${label}.`,
        monitoring_plan: 'Emissions, concentration, assimilation capacity.',
        stakeholder_map: 'Emitters, stewards, affected communities.',
        restoration_obligations: 'Emission cuts and remediation when stressed.'
      }),
      sourceNotApplicable({
        id: 'carbon-sink',
        label: 'Carbon / sink capacity',
        blurb: 'Sink accounting linked to boundary events.',
        name: `${label} — sink capacity`,
        description: `Sink and sequestration framing for ${label}.`,
        category: 'carbon',
        scope: withScope('Network'),
        tags: ['atmospheric', 'carbon'],
        boundary_description: `Sink geography and accounting boundary for ${label}.`,
        monitoring_plan: 'Sequestration rate, leakage, verification.',
        stakeholder_map: 'Project stewards, verifiers, dependent agents.',
        restoration_obligations: 'Protection and restoration of sink function.'
      }),
      sourceNotApplicable({
        id: 'climate-commons',
        label: 'Climate commons frame',
        blurb: 'Shared atmospheric commons — stewardship, not ownership.',
        name: `${label} — climate commons`,
        description: `Commons governance frame for atmospheric Source ${label}.`,
        category: 'climate',
        scope: withScope('Public'),
        tags: ['atmospheric', 'commons'],
        boundary_description: `Shared atmospheric commons scope for ${label}.`,
        monitoring_plan: 'Regional indicators and tipping watch.',
        stakeholder_map: 'Network of dependent agents and stewards.',
        restoration_obligations: 'Collective mitigation and adaptation obligations.'
      })
    ];
  }

  if (type === 'KnowledgeCommons') {
    return [
      sourceNotApplicable({
        id: 'knowledge-commons',
        label: 'Knowledge commons',
        blurb: 'Generative knowledge system — not inventoriable stock.',
        name: `${label} — knowledge commons`,
        description: `Boundary and contribution rules for the knowledge commons ${label}.`,
        category: 'knowledge',
        scope: withScope('Public'),
        tags: ['knowledge-commons'],
        digital_locator_kind: 'Repository',
        boundary_description: `What knowledge corpus ${label} covers and who may contribute.`,
        monitoring_plan: 'Contribution quality, completeness, reuse.',
        stakeholder_map: 'Maintainers, contributors, dependent projects.',
        restoration_obligations: 'Curation and integrity repair when degraded.'
      }),
      sourceNotApplicable({
        id: 'design-commons',
        label: 'Design / OSH commons',
        blurb: 'Open design corpus that yields artifacts.',
        name: `${label} — design commons`,
        description: `Open hardware / design commons under ${label}.`,
        category: 'design-commons',
        scope: withScope('Public'),
        tags: ['knowledge-commons', 'design'],
        digital_locator_kind: 'Repository',
        boundary_description: `Design domains and licenses under ${label}.`,
        monitoring_plan: 'Manifest completeness, fork health.',
        stakeholder_map: 'Maintainers, fabricators, documenters.',
        restoration_obligations: 'Upstream sync and documentation repair.'
      }),
      sourceNotApplicable({
        id: 'scientific-commons',
        label: 'Scientific commons',
        blurb: 'Data and methods as a generative Source.',
        name: `${label} — scientific commons`,
        description: `Scientific data / methods commons for ${label}.`,
        category: 'science',
        scope: withScope('Network'),
        tags: ['knowledge-commons', 'science'],
        digital_locator_kind: 'Url',
        boundary_description: `Datasets and methods governed as Source ${label}.`,
        monitoring_plan: 'Citation, quality, access metrics.',
        stakeholder_map: 'Researchers, stewards, partner networks.',
        restoration_obligations: 'Correction and re-publication obligations.'
      })
    ];
  }

  if (type === 'SocialCommons') {
    return [
      sourceNotApplicable({
        id: 'community-commons',
        label: 'Community commons',
        blurb: 'Social fabric as Source — stewardship, not ownership.',
        name: `${label} — community commons`,
        description: `Community / trust-fabric Source specification for ${label}.`,
        category: 'social',
        scope: withScope('Network'),
        tags: ['social-commons'],
        boundary_description: `Membership and care boundary of community Source ${label}.`,
        monitoring_plan: 'Participation health, conflict signals.',
        stakeholder_map: 'Core stewards, active affiliates, partners.',
        restoration_obligations: 'Conflict repair and re-engagement practices.'
      }),
      sourceNotApplicable({
        id: 'network-commons',
        label: 'Network commons',
        blurb: 'Cross-group network as a generative Source.',
        name: `${label} — network commons`,
        description: `Network-level Source frame for ${label}.`,
        category: 'network',
        scope: withScope('Public'),
        tags: ['social-commons', 'network'],
        boundary_description: `Which groups and protocols compose ${label}.`,
        monitoring_plan: 'Bridge nodes, affiliation depth, load.',
        stakeholder_map: 'Group stewards and bridge agents.',
        restoration_obligations: 'Repair of trust and coordination after stress.'
      }),
      sourceNotApplicable({
        id: 'trust-fabric',
        label: 'Trust fabric',
        blurb: 'Reputation / care infrastructure — never shelf stock.',
        name: `${label} — trust fabric`,
        description: `Trust and care infrastructure under Source ${label}.`,
        category: 'trust',
        scope: withScope('Network'),
        tags: ['social-commons', 'trust'],
        boundary_description: `What trust relations ${label} governs.`,
        monitoring_plan: 'Dispute rate, vouch density, PPR health.',
        stakeholder_map: 'Validators, stewards, affiliates.',
        restoration_obligations: 'Mediation and re-affiliation pathways.'
      })
    ];
  }

  // Hydrological (default ecological Physical Source)
  return [
    sourceNotApplicable({
      id: 'watershed',
      label: 'Watershed system',
      blurb: 'Parent black box — yields rivers and conditions sub-Sources.',
      name: `${label} — watershed`,
      description: `Watershed-scale Source specification for ${label}: boundaries, monitoring, stewards.`,
      category: 'watershed',
      scope: withScope('Public'),
      tags: ['hydrological', 'watershed'],
      boundary_description: `Drainage basin boundary for ${label} (spatial extent, outlets).`,
      monitoring_plan: 'Flow, quality, withdrawals, discharge loads.',
      stakeholder_map: 'Upstream/downstream stewards, extractors, communities.',
      restoration_obligations: 'Riparian repair and load reduction when stressed.'
    }),
    sourceNotApplicable({
      id: 'river-reach',
      label: 'River / reach',
      blurb: 'Sub-Source that yields water units at the boundary.',
      name: `${label} — river reach`,
      description: `River or reach under ${label}: extraction and loading endpoints.`,
      category: 'river',
      scope: withScope('Network'),
      tags: ['hydrological', 'river'],
      boundary_description: `Reach length, banks, and flow endpoints for ${label}.`,
      monitoring_plan: 'Stage, discharge, quality samples.',
      stakeholder_map: 'Riparian stewards, abstractors, dischargers.',
      restoration_obligations: 'Habitat and water-quality restoration.'
    }),
    sourceNotApplicable({
      id: 'groundwater',
      label: 'Groundwater body',
      blurb: 'Stock + flux — quotas, not inventoriable equipment.',
      name: `${label} — groundwater`,
      description: `Groundwater Source under ${label}: stock, recharge, extraction limits.`,
      category: 'groundwater',
      scope: withScope('Network'),
      tags: ['hydrological', 'groundwater'],
      boundary_description: `Aquifer / well-field extent for ${label}.`,
      monitoring_plan: 'Water table, recharge, extraction meters.',
      stakeholder_map: 'Well operators, stewards, dependent users.',
      restoration_obligations: 'Recharge and contamination remediation.'
    }),
    sourceNotApplicable({
      id: 'wetland',
      label: 'Wetland',
      blurb: 'Buffering and assimilation capacity.',
      name: `${label} — wetland`,
      description: `Wetland Source under ${label}: assimilation and habitat functions.`,
      category: 'wetland',
      scope: withScope('Public'),
      tags: ['hydrological', 'wetland'],
      boundary_description: `Wetland extent and hydroperiod for ${label}.`,
      monitoring_plan: 'Hydroperiod, water quality, biodiversity.',
      stakeholder_map: 'Stewards, adjacent land users, regulators.',
      restoration_obligations: 'Hydrology restoration and pollution control.'
    })
  ];
}

/**
 * Starters for the open NDO. Source-NDOs get SourceSpecification patterns by SourceType.
 */
export function startersForNdo(opts: {
  name?: string | null;
  resource_nature?: ResourceNature | string | null;
  property_regime?: PropertyRegime | string | null;
  ndo_archetype?: NdoArchetypeId | string | null;
  source_type?: SourceType | string | null;
  source_profile?: { source_type?: SourceType | string | null } | null;
}): SpecStarter[] {
  const nature = String(opts.resource_nature ?? 'Physical');
  const regime = opts.property_regime ?? null;
  const label = shortName(opts.name);
  const isSource = isSourceNdoDescriptor({
    ndo_archetype: opts.ndo_archetype,
    source_profile: opts.source_profile ?? (opts.source_type ? { source_type: opts.source_type } : null)
  });
  const sourceType =
    opts.source_type ?? opts.source_profile?.source_type ?? 'Hydrological';

  const withScope = (chosen: ResourceScope): ResourceScope =>
    resolveScope(regime, chosen);

  let raw: SpecStarter[];

  if (isSource) {
    raw = startersForSource(label, withScope, sourceType);
  } else if (nature === 'Digital') {
    raw = [
      {
        id: 'design-package',
        label: 'Design package',
        blurb: 'Locate by content hash or repository.',
        name: `${label} — design package`,
        description: `The shareable design for ${label}: formats, version, and how to use it.`,
        category: 'design',
        scope: withScope('Public'),
        tags: ['design'],
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: 'ContentAddressed',
        digital_locator: null
      },
      {
        id: 'software',
        label: 'Software / application',
        blurb: 'Runnable program — usually a source repository or release.',
        name: `${label} — software`,
        description: `The software for ${label}: what it does, how to build or run it, and where the code lives.`,
        category: 'software',
        scope: withScope('Public'),
        tags: ['software'],
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: 'Repository',
        digital_locator: null
      },
      {
        id: 'docs',
        label: 'Documentation',
        blurb: 'Usually a URL or repository.',
        name: `${label} — documentation`,
        description: `How to understand and work with ${label}.`,
        category: 'docs',
        scope: withScope('Network'),
        tags: ['docs'],
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: 'Url',
        digital_locator: null
      },
      {
        id: 'method',
        label: 'Method / protocol',
        blurb: 'Versioned steps — typically in a repository.',
        name: `${label} — method`,
        description: `Steps and reporting for working with ${label}.`,
        category: 'method',
        scope: withScope('Public'),
        tags: ['method'],
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: 'Repository',
        digital_locator: null
      }
    ];
  } else if (nature === 'Hybrid') {
    raw = [
      {
        id: 'digital-twin',
        label: 'Digital twin kind',
        blurb: 'Digital side — usually not inventoried as units.',
        name: `${label} — digital twin`,
        description: `Digital representation linked to the physical side of ${label}.`,
        category: 'hybrid',
        scope: withScope('Network'),
        tags: ['twin'],
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: 'ContentAddressed',
        digital_locator: null
      },
      {
        id: 'physical-unit',
        label: 'Physical unit kind',
        blurb: 'Serialized units you can create or borrow.',
        name: `${label} — physical unit`,
        description: `A concrete unit under ${label}: size, location, and care notes.`,
        category: 'equipment',
        scope: withScope('Project'),
        tags: ['physical'],
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        digital_locator_kind: null,
        digital_locator: null
      },
      {
        id: 'kit',
        label: 'Kit / assembly',
        blurb: 'Parts kit tracked as stock or lots.',
        name: `${label} — kit`,
        description: `Bill of materials and assembly notes for ${label}.`,
        category: 'kit',
        scope: withScope('Network'),
        tags: ['kit'],
        inventory_intent: 'Inventoried',
        identification_pattern: 'LotControlled',
        default_unit: 'kit',
        substitutable: true,
        digital_locator_kind: null,
        digital_locator: null
      }
    ];
  } else {
    raw = [
      {
        id: 'equipment',
        label: 'Equipment kind',
        blurb: 'Serialized tools people schedule or borrow.',
        name: `${label} — equipment type`,
        description: `A type of equipment under ${label}: what it is and how it is used.`,
        category: 'equipment',
        scope: withScope('Project'),
        tags: ['equipment'],
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        digital_locator_kind: null,
        digital_locator: null
      },
      {
        id: 'consumable',
        label: 'Consumable / supply',
        blurb: 'Stock by count or volume — interchangeable units.',
        name: `${label} — consumable`,
        description: `A supply kind for ${label}: unit, replenishment, and safe use.`,
        category: 'consumable',
        scope: withScope('Project'),
        tags: ['consumable'],
        inventory_intent: 'Inventoried',
        identification_pattern: 'Stock',
        default_unit: 'kg',
        substitutable: true,
        digital_locator_kind: null,
        digital_locator: null
      },
      {
        id: 'shareable-unit',
        label: 'Shareable unit',
        blurb: 'Serialized unit others can hold in custody.',
        name: `${label} — shareable unit`,
        description: `What a single tracked unit of ${label} looks like.`,
        category: 'general',
        scope: withScope('Network'),
        tags: ['unit'],
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        digital_locator_kind: null,
        digital_locator: null
      }
    ];
  }

  if (regime === 'Nondominium' || regime === 'Public') {
    raw = raw.map((s, i) =>
      i === 0
        ? {
            ...s,
            scope: 'Public' as ResourceScope,
            blurb: `${s.blurb} Stays publicly findable.`
          }
        : { ...s, scope: withScope(s.scope) }
    );
  }

  if (isSource) return raw.slice(0, 4);
  return nature === 'Digital' ? raw : raw.slice(0, 3);
}

/** Browse-classification chips for the form, by nature or SourceType. */
export function categoryChipsForNature(
  nature: ResourceNature | string | null | undefined,
  opts?: {
    isSource?: boolean;
    source_type?: SourceType | string | null;
  }
): string[] {
  if (opts?.isSource) {
    switch (String(opts.source_type ?? 'Hydrological')) {
      case 'Biological':
        return ['forest', 'fishery', 'soil', 'biodiversity', 'general'];
      case 'Atmospheric':
        return ['atmospheric', 'carbon', 'climate', 'general'];
      case 'KnowledgeCommons':
        return ['knowledge', 'design-commons', 'science', 'data', 'general'];
      case 'SocialCommons':
        return ['social', 'network', 'trust', 'general'];
      default:
        return ['watershed', 'river', 'groundwater', 'wetland', 'general'];
    }
  }
  switch (String(nature ?? 'Physical')) {
    case 'Digital':
      return ['design', 'software', 'docs', 'method', 'data', 'general'];
    case 'Hybrid':
      return ['hybrid', 'equipment', 'design', 'kit', 'general'];
    default:
      return ['equipment', 'consumable', 'tooling', 'space', 'general'];
  }
}
