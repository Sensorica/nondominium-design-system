/**
 * Context starters for the Simple Layer 1 “kind of item” form.
 * Plain language; keyed off nature + regime (+ NDO name for hints).
 */
import type {
  PropertyRegime,
  ResourceNature,
  ResourceScope
} from './types.js';
import { resolveScope } from './layer1.js';

export interface SpecStarter {
  id: string;
  /** Short card title shown to the user. */
  label: string;
  /** One-line why this starter fits. */
  blurb: string;
  name: string;
  description: string;
  category: string;
  scope: ResourceScope;
  tags?: string[];
}

function shortName(ndoName: string | null | undefined): string {
  const n = (ndoName ?? '').trim();
  if (!n) return 'this resource';
  return n.length > 40 ? `${n.slice(0, 37)}…` : n;
}

/**
 * Up to three starters for the open NDO. Scope is already regime-coherent.
 */
export function startersForNdo(opts: {
  name?: string | null;
  resource_nature?: ResourceNature | string | null;
  property_regime?: PropertyRegime | string | null;
}): SpecStarter[] {
  const nature = String(opts.resource_nature ?? 'Physical');
  const regime = opts.property_regime ?? null;
  const label = shortName(opts.name);

  const withScope = (chosen: ResourceScope): ResourceScope =>
    resolveScope(regime, chosen);

  let raw: SpecStarter[];

  if (nature === 'Digital') {
    raw = [
      {
        id: 'design-package',
        label: 'Design package',
        blurb: 'Files or drawings others can copy or improve.',
        name: `${label} — design package`,
        description: `The shareable design for ${label}: formats, version, and how to use it.`,
        category: 'design',
        scope: withScope('Public'),
        tags: ['design']
      },
      {
        id: 'docs',
        label: 'Documentation',
        blurb: 'Guides, manuals, or method notes.',
        name: `${label} — documentation`,
        description: `How to understand and work with ${label}.`,
        category: 'docs',
        scope: withScope('Network'),
        tags: ['docs']
      },
      {
        id: 'method',
        label: 'Method / protocol',
        blurb: 'A repeatable way of doing the work.',
        name: `${label} — method`,
        description: `Steps and reporting for working with ${label}.`,
        category: 'method',
        scope: withScope('Public'),
        tags: ['method']
      }
    ];
  } else if (nature === 'Hybrid') {
    raw = [
      {
        id: 'digital-twin',
        label: 'Digital twin kind',
        blurb: 'The digital side that mirrors the physical thing.',
        name: `${label} — digital twin`,
        description: `Digital representation linked to the physical side of ${label}.`,
        category: 'hybrid',
        scope: withScope('Network'),
        tags: ['twin']
      },
      {
        id: 'physical-unit',
        label: 'Physical unit kind',
        blurb: 'What someone can create or borrow in the world.',
        name: `${label} — physical unit`,
        description: `A concrete unit under ${label}: size, location, and care notes.`,
        category: 'equipment',
        scope: withScope('Project'),
        tags: ['physical']
      },
      {
        id: 'kit',
        label: 'Kit / assembly',
        blurb: 'Parts and instructions together.',
        name: `${label} — kit`,
        description: `Bill of materials and assembly notes for ${label}.`,
        category: 'kit',
        scope: withScope('Network'),
        tags: ['kit']
      }
    ];
  } else {
    // Physical (default), including Source-style Physical NDOs
    raw = [
      {
        id: 'equipment',
        label: 'Equipment kind',
        blurb: 'A tool or machine people schedule or borrow.',
        name: `${label} — equipment type`,
        description: `A type of equipment under ${label}: what it is and how it is used.`,
        category: 'equipment',
        scope: withScope('Project'),
        tags: ['equipment']
      },
      {
        id: 'consumable',
        label: 'Consumable / supply',
        blurb: 'Things that get used up and need restocking.',
        name: `${label} — consumable`,
        description: `A supply kind for ${label}: unit, replenishment, and safe use.`,
        category: 'consumable',
        scope: withScope('Project'),
        tags: ['consumable']
      },
      {
        id: 'shareable-unit',
        label: 'Shareable unit',
        blurb: 'A unit others can hold in custody or share.',
        name: `${label} — shareable unit`,
        description: `What a single tracked unit of ${label} looks like.`,
        category: 'general',
        scope: withScope('Network'),
        tags: ['unit']
      }
    ];
  }

  // Nondominium / Public: prefer open discovery wording on the first card
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

  return raw.slice(0, 3);
}

/** Category chips for the Simple form, by nature. */
export function categoryChipsForNature(
  nature: ResourceNature | string | null | undefined
): string[] {
  switch (String(nature ?? 'Physical')) {
    case 'Digital':
      return ['design', 'docs', 'method', 'data', 'general'];
    case 'Hybrid':
      return ['hybrid', 'equipment', 'design', 'kit', 'general'];
    default:
      return ['equipment', 'consumable', 'tooling', 'space', 'general'];
  }
}
