/**
 * Prototype foreshadow of ValueFlows inventory + identification on a kind.
 * Not yet on the Rust ResourceSpecification entry — see resources.md §2.1.
 *
 * Digital artifacts are never inventoriable: they do not sit on a shelf.
 * They are identified by digital location (URI, content hash, repo, store, host).
 */
import type {
  DigitalLocatorKind,
  IdentificationPattern,
  InventoryIntent,
  ResourceNature,
  SpecForeshadow
} from './types.js';

export const INVENTORY_INTENT_OPTIONS: {
  id: InventoryIntent;
  label: string;
  description: string;
}[] = [
  {
    id: 'Inventoried',
    label: 'Track units as inventory',
    description: 'Keep quantity and custody in the system (tools, stock, serial items).'
  },
  {
    id: 'NotInventoried',
    label: 'Could track, but we won’t',
    description: 'Inventoriable in principle; looking at the shelf is enough for now.'
  },
  {
    id: 'NotApplicable',
    label: 'Not inventoriable',
    description: 'Knowledge, methods, or work — no shelf units to count.'
  }
];

export const IDENTIFICATION_PATTERN_OPTIONS: {
  id: IdentificationPattern;
  label: string;
  description: string;
}[] = [
  {
    id: 'Serialized',
    label: 'Serialized',
    description: 'Each instance has its own id (a car, a document, one printer).'
  },
  {
    id: 'LotControlled',
    label: 'Lot / batch',
    description: 'A lot id covers many instances inside the batch.'
  },
  {
    id: 'Stock',
    label: 'Stock / count / volume',
    description: 'Instances are interchangeable — count, kg, litres, etc.'
  }
];

/** Digital reachability — not inventory identification. */
export const DIGITAL_LOCATOR_OPTIONS: {
  id: DigitalLocatorKind;
  label: string;
  description: string;
  placeholder: string;
}[] = [
  {
    id: 'ContentAddressed',
    label: 'Content-addressed',
    description: 'Fixed by hash (IPFS CID, git blob, checksum). One of a kind by content.',
    placeholder: 'e.g. bafybei… or sha256:…'
  },
  {
    id: 'Url',
    label: 'URL / web address',
    description: 'Reachable at an HTTP(S) or similar URI.',
    placeholder: 'https://…'
  },
  {
    id: 'Repository',
    label: 'Source repository',
    description: 'Version-controlled project (git remote + path/ref).',
    placeholder: 'e.g. github.com/org/repo#main/path'
  },
  {
    id: 'DistributedStore',
    label: 'Distributed storage',
    description: 'Holochain DHT entry, Holochain DNA asset, or similar network store.',
    placeholder: 'e.g. action hash, entry address, or store URI'
  },
  {
    id: 'HostedService',
    label: 'Hosted service / database',
    description: 'Record in an application or DB (table key, object id).',
    placeholder: 'e.g. service://db/collection/id'
  },
  {
    id: 'LocalHost',
    label: 'Local host / path',
    description: 'File or folder on a named machine (not a network inventory unit).',
    placeholder: 'e.g. host:lab-pc-1 path:/data/designs/v3'
  }
];

export function isDigitalNature(
  nature: ResourceNature | string | null | undefined
): boolean {
  return String(nature ?? '') === 'Digital';
}

/** Whether physical identification + default unit apply for this inventory intent. */
export function trackingFieldsApply(intent: InventoryIntent): boolean {
  return intent === 'Inventoried' || intent === 'NotInventoried';
}

const emptySourceFields = {
  boundary_description: null as string | null,
  monitoring_plan: null as string | null,
  stakeholder_map: null as string | null,
  restoration_obligations: null as string | null
};

/** Defaults for a Source-NDO Layer 1 SourceSpecification (never inventoriable). */
export function defaultForeshadowForSource(): SpecForeshadow {
  return {
    inventory_intent: 'NotApplicable',
    identification_pattern: null,
    default_unit: null,
    substitutable: null,
    digital_locator_kind: null,
    digital_locator: null,
    ...emptySourceFields
  };
}

/**
 * Nature-based defaults for a new kind (before starters override).
 * Digital is always NotApplicable for inventory and uses a digital locator.
 */
export function defaultForeshadowForNature(
  nature: ResourceNature | string | null | undefined,
  opts?: { isSource?: boolean }
): SpecForeshadow {
  if (opts?.isSource) return defaultForeshadowForSource();
  if (isDigitalNature(nature)) {
    return {
      inventory_intent: 'NotApplicable',
      identification_pattern: null,
      default_unit: null,
      substitutable: null,
      digital_locator_kind: 'ContentAddressed',
      digital_locator: null,
      ...emptySourceFields
    };
  }
  switch (String(nature ?? 'Physical')) {
    case 'Hybrid':
      return {
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        digital_locator_kind: null,
        digital_locator: null,
        ...emptySourceFields
      };
    default:
      return {
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        digital_locator_kind: null,
        digital_locator: null,
        ...emptySourceFields
      };
  }
}

export type ForeshadowValidation =
  | { ok: true; foreshadow: SpecForeshadow }
  | { ok: false; error: string };

function trimOrNull(v: string | null | undefined): string | null {
  const t = (v ?? '').trim();
  return t || null;
}

/**
 * Normalize and validate foreshadow fields.
 * Digital nature and Source-NDOs force NotApplicable inventory.
 */
export function validateForeshadow(
  raw: SpecForeshadow,
  nature?: ResourceNature | string | null,
  opts?: { isSource?: boolean }
): ForeshadowValidation {
  const sourceFields = {
    boundary_description: trimOrNull(raw.boundary_description),
    monitoring_plan: trimOrNull(raw.monitoring_plan),
    stakeholder_map: trimOrNull(raw.stakeholder_map),
    restoration_obligations: trimOrNull(raw.restoration_obligations)
  };

  if (opts?.isSource || isDigitalNature(nature) || raw.inventory_intent === 'NotApplicable') {
    const forcedDigital = isDigitalNature(nature) && !opts?.isSource;
    const keepLocator = forcedDigital || opts?.isSource || !!raw.digital_locator_kind;
    return {
      ok: true,
      foreshadow: {
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: forcedDigital
          ? (raw.digital_locator_kind ?? 'ContentAddressed')
          : keepLocator
            ? (raw.digital_locator_kind ?? null)
            : null,
        digital_locator: keepLocator ? trimOrNull(raw.digital_locator) : null,
        ...sourceFields
      }
    };
  }

  const pattern = raw.identification_pattern;
  const unit = (raw.default_unit ?? '').trim();
  const intent = raw.inventory_intent;

  if (intent === 'Inventoried') {
    if (!pattern) {
      return {
        ok: false,
        error: 'Choose how units are identified (serialized, lot, or stock).'
      };
    }
    if (!unit) {
      return {
        ok: false,
        error: 'Enter a default unit for this kind (e.g. each, kg, L).'
      };
    }
  }

  return {
    ok: true,
    foreshadow: {
      inventory_intent: intent,
      identification_pattern: pattern,
      default_unit: unit || null,
      substitutable: raw.substitutable ?? null,
      digital_locator_kind: null,
      digital_locator: null,
      ...emptySourceFields
    }
  };
}

/** Short badge text for the kinds list. */
export function foreshadowBadge(f: SpecForeshadow | null | undefined): string | null {
  if (!f) return null;
  if (f.inventory_intent === 'NotApplicable') {
    if (f.boundary_description || f.monitoring_plan) {
      return 'Source specification';
    }
    if (f.digital_locator_kind) {
      const label =
        DIGITAL_LOCATOR_OPTIONS.find((o) => o.id === f.digital_locator_kind)?.label ??
        f.digital_locator_kind;
      return `Digital · ${label}`;
    }
    return 'Not inventoried';
  }
  if (f.inventory_intent === 'NotInventoried') {
    if (f.identification_pattern && f.default_unit) {
      return `${f.identification_pattern} · ${f.default_unit} (untracked)`;
    }
    return 'Could be inventoried · untracked';
  }
  if (f.identification_pattern && f.default_unit) {
    return `${f.identification_pattern} · ${f.default_unit}`;
  }
  if (f.identification_pattern) return f.identification_pattern;
  return 'Inventoried';
}
