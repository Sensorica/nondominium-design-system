// The Claude Design "Nondominium Design System" project's cards, replicated
// on this repo's own tokens (static/tokens.css) and its own ndo-* custom
// elements (registry/). One entry per card in
// docs/prototypes/original/ds/guidelines/*.html and
// docs/prototypes/original/ds/components/{badge,button,card,status}/*.card.html.
//
// Every field below is copied verbatim from each file's leading
// `<!-- @dsCard group="…" viewport="…" name="…" subtitle="…" -->` comment,
// plus the `body{…}` declaration that opens its inline <style> block — the
// two things a byte-for-byte replica needs to know before it renders a single
// pixel. ISA Phase 9, claim 44.

export interface GuidelineCard {
  /** Route segment: `/guidelines/{id}`. Matches the source file's stem. */
  id: string;
  group: 'Brand' | 'Colors' | 'Type' | 'Spacing' | 'Components';
  name: string;
  subtitle: string;
  /** The card's own declared size, from `viewport="WxH"`. The index page
   *  frames its iframe at this size; the compare instrument always shoots at
   *  1440x900 regardless (scripts/compare-prototypes.ts VIEWPORT). */
  viewport: { width: number; height: number };
  /** The original's own `body{...}` declaration, reproduced so the isolated
   *  frame paints the same background and padding the original does. */
  body: { background: string; padding: string };
}

export const GUIDELINE_CARDS: readonly GuidelineCard[] = [
  // ── Brand ──
  {
    id: 'brand-logo',
    group: 'Brand',
    name: 'Logo',
    subtitle: 'nondominium_logo.png — mark + wordmark',
    viewport: { width: 700, height: 260 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'brand-favicon',
    group: 'Brand',
    name: 'Favicon',
    subtitle: 'Default SvelteKit favicon shipped in ui/',
    viewport: { width: 700, height: 120 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'brand-layers',
    group: 'Brand',
    name: 'Three visual layers',
    subtitle: 'How badge shape encodes the data layer',
    viewport: { width: 700, height: 200 },
    body: { background: '#fff', padding: '16px' }
  },

  // ── Colors ──
  {
    id: 'colors-neutral',
    group: 'Colors',
    name: 'Neutrals',
    subtitle: 'Gray scale — the whole UI chrome',
    viewport: { width: 700, height: 150 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'colors-action',
    group: 'Colors',
    name: 'Action & feedback',
    subtitle: 'Primary blue, error red, warning amber',
    viewport: { width: 700, height: 150 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'colors-lifecycle',
    group: 'Colors',
    name: 'Lifecycle stages',
    subtitle: 'Layer 0 · LifecycleStage — 10 stages',
    viewport: { width: 700, height: 210 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'colors-nature',
    group: 'Colors',
    name: 'Resource nature',
    subtitle: 'Layer 0 · ResourceNature',
    viewport: { width: 700, height: 130 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'colors-regime',
    group: 'Colors',
    name: 'Property regime',
    subtitle: 'Layer 0 · PropertyRegime — dashed outlines',
    viewport: { width: 700, height: 130 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'colors-semantic',
    group: 'Colors',
    name: 'Semantic tokens',
    subtitle: 'Surfaces, borders, text roles',
    viewport: { width: 700, height: 170 },
    body: { background: '#fff', padding: '16px' }
  },

  // ── Type ──
  {
    id: 'type-scale',
    group: 'Type',
    name: 'Type scale',
    subtitle: 'system-ui · 12 → 24px',
    viewport: { width: 700, height: 260 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'type-labels',
    group: 'Type',
    name: 'Labels & caps',
    subtitle: 'Uppercase tracked section labels',
    viewport: { width: 700, height: 150 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'type-mono',
    group: 'Type',
    name: 'Mono · hashes',
    subtitle: 'ui-monospace for agent keys & action hashes',
    viewport: { width: 700, height: 140 },
    body: { background: '#fff', padding: '16px' }
  },

  // ── Spacing ──
  {
    id: 'spacing-scale',
    group: 'Spacing',
    name: 'Spacing scale',
    subtitle: 'rem-based, Tailwind steps',
    viewport: { width: 700, height: 170 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'radii',
    group: 'Spacing',
    name: 'Corner radii',
    subtitle: '4 · 6 · 8 · 12px',
    viewport: { width: 700, height: 150 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'shadows',
    group: 'Spacing',
    name: 'Shadows',
    subtitle: 'Barely-there elevation; hover lifts sm → md',
    viewport: { width: 700, height: 170 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'layout-shell',
    group: 'Spacing',
    name: 'App shell',
    subtitle: '13rem sidebar + fluid main on gray-100',
    viewport: { width: 700, height: 220 },
    body: { background: '#fff', padding: '16px' }
  },

  // ── Components (the real ndo-* custom elements) ──
  {
    id: 'badge',
    group: 'Components',
    name: 'Badge',
    subtitle: 'Layer 0 / 1 / 2 domain badges',
    viewport: { width: 700, height: 360 },
    body: { background: '#fff', padding: '16px' }
  },
  {
    id: 'button',
    group: 'Components',
    name: 'Button',
    subtitle: 'primary · ghost · destructive · disabled',
    viewport: { width: 700, height: 200 },
    body: { background: '#fff', padding: '20px' }
  },
  {
    id: 'card',
    group: 'Components',
    name: 'Card',
    subtitle: 'NDO card in browser grid',
    viewport: { width: 700, height: 260 },
    body: { background: 'rgb(var(--ndo-gray-100))', padding: '16px' }
  },
  {
    id: 'status',
    group: 'Components',
    name: 'Status dot',
    subtitle: 'active · inactive · pending · coming-soon',
    viewport: { width: 700, height: 140 },
    body: { background: '#fff', padding: '24px' }
  }
];

/** Groups in the order Claude Design lists them. */
export const GUIDELINE_GROUPS = ['Brand', 'Colors', 'Type', 'Spacing', 'Components'] as const;

export function cardsInGroup(group: (typeof GUIDELINE_GROUPS)[number]): GuidelineCard[] {
  return GUIDELINE_CARDS.filter((c) => c.group === group);
}
