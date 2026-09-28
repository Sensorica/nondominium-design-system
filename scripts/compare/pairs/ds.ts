// Pairs for the Claude Design "Nondominium Design System" project's cards
// (ISA Phase 9, claim 44): one pair per file under
// docs/prototypes/original/ds/guidelines/*.html and
// docs/prototypes/original/ds/components/{badge,button,card,status}/*.card.html,
// against this repo's own /guidelines/<id> isolated frame.
//
// The original side is served by scripts/compare-prototypes.ts's
// serveOriginals(), which roots everything at docs/prototypes/original and
// always prefixes the pair's `path` with `/prototypes/`. `../ds/...` resolves
// back out of that prefix to `docs/prototypes/original/ds/...`, which is where
// the ds/ tree actually lives (a sibling of docs/prototypes/original/prototypes/,
// not under it).
import type { Pair } from '../pairs';

const slug = 'ds';

const guideline = (file: string) => `../ds/guidelines/${file}.html`;
const component = (kind: string) => `../ds/components/${kind}/${kind}.card.html`;
const port = (id: string) => `/guidelines/${id}`;

const pairs: Pair[] = [
  // ── Brand ──
  // brand-logo and brand-favicon render on this repo's OWN brand assets
  // (paths.logo(), paths.favicon()), not the original's PNG/SVG: importing
  // the original directly (docs/prototypes/original/ds/assets/...) as a Vite
  // asset builds fine but 403s under `vite dev` (SvelteKit's dev server
  // restricts `server.fs.allow` to src/, .svelte-kit/, node_modules — docs/
  // is outside it, and vite.config.ts is outside this builder's ownership).
  // See BrandLogo.svelte / BrandFavicon.svelte for the full note. The
  // resulting mismatch is a real, different image, not rendering noise.
  {
    slug,
    name: 'brand-logo',
    original: { path: guideline('brand-logo') },
    port: { path: port('brand-logo') }
    // Until 2026-09-28 this rendered static/assets/nondominium-logo.png (696x536, a
    // different crop from the original's 1024x1024), because the original's own
    // PNG was believed absent from this repo. It is not: A's instrument direction
    // already committed the identical file (sha256-verified) at
    // src/lib/prototypes/directions/instrument/nondominium_logo.png, which is
    // under src/ and so importable under `vite dev`. BrandLogo.svelte now imports
    // it directly; the pair matches at 0%.
  },
  {
    slug,
    name: 'brand-favicon',
    original: { path: guideline('brand-favicon') },
    port: { path: port('brand-favicon') },
    note:
      'Different file format by design: the original shows the stock SvelteKit favicon.svg; this repo has no SVG ' +
      'favicon, only static/favicon.png (256x256 raster), rendered here via paths.favicon(). Visually similar ' +
      'enough at 64px that the ratio is close to default already; reported rather than fabricating a matching SVG.'
  },
  {
    slug,
    name: 'brand-layers',
    original: { path: guideline('brand-layers') },
    port: { path: port('brand-layers') }
    // Was misdiagnosed as sub-pixel font anti-aliasing and given a 1.7% ceiling.
    // The real cause, found under ISA Phase 9's review: the isolated Frame every
    // guideline card mounts in did not carry the original's fixed
    // `line-height: var(--ndo-lh-base)` (1.5rem, absolute), so UnoCSS's unitless
    // `line-height: 1.5` preflight recomputed per element's own font-size instead,
    // drifting the three stacked prose columns down a little more with every row.
    // Frame.svelte now sets the same fixed line-height the original's body does;
    // the pair sits at 0.71%, under the default 1% ceiling.
  },

  // ── Colors ──
  {
    slug,
    name: 'colors-neutral',
    original: { path: guideline('colors-neutral') },
    port: { path: port('colors-neutral') }
  },
  {
    slug,
    name: 'colors-action',
    original: { path: guideline('colors-action') },
    port: { path: port('colors-action') }
  },
  {
    slug,
    name: 'colors-lifecycle',
    original: { path: guideline('colors-lifecycle') },
    port: { path: port('colors-lifecycle') }
  },
  {
    slug,
    name: 'colors-nature',
    original: { path: guideline('colors-nature') },
    port: { path: port('colors-nature') }
  },
  // This card is a literal copy of the original's inline HTML/CSS (it does not
  // use the ndo-badge custom element), so it matches at 0%. Until 2026-09-28 it
  // documented a registry/app vs Claude Design disagreement (Claude Design
  // outlines each PropertyRegime in its own hue; registry/ndo-badge.svelte and
  // the shipped app's NdoCard.svelte both rendered every regime with a uniform
  // gray-400 dashed border). registry/ndo-badge.svelte's `regime-*` variant now
  // matches Claude Design's per-hue outline (see its own comment); the shipped
  // app's NdoCard.svelte, a separate codebase, still renders uniform gray.
  {
    slug,
    name: 'colors-regime',
    original: { path: guideline('colors-regime') },
    port: { path: port('colors-regime') }
  },
  {
    slug,
    name: 'colors-semantic',
    original: { path: guideline('colors-semantic') },
    port: { path: port('colors-semantic') }
  },

  // ── Type ──
  {
    slug,
    name: 'type-scale',
    original: { path: guideline('type-scale') },
    port: { path: port('type-scale') }
  },
  {
    slug,
    name: 'type-labels',
    original: { path: guideline('type-labels') },
    port: { path: port('type-labels') }
  },
  {
    slug,
    name: 'type-mono',
    original: { path: guideline('type-mono') },
    port: { path: port('type-mono') }
  },

  // ── Spacing ──
  {
    slug,
    name: 'spacing-scale',
    original: { path: guideline('spacing-scale') },
    port: { path: port('spacing-scale') }
  },
  { slug, name: 'radii', original: { path: guideline('radii') }, port: { path: port('radii') } },
  {
    slug,
    name: 'shadows',
    original: { path: guideline('shadows') },
    port: { path: port('shadows') }
  },
  {
    slug,
    name: 'layout-shell',
    original: { path: guideline('layout-shell') },
    port: { path: port('layout-shell') }
    // Was misdiagnosed as a one-pixel rounding difference in the .card box's
    // shadow/border bands and given a 2.2% ceiling. The real cause was the same
    // missing fixed line-height documented on brand-layers above: the sidebar's
    // GROUPS/Sensorica rows and the main column both sat progressively lower
    // than the original, growing with each stacked row. Frame.svelte's fix
    // brings this pair to 0%.
  },

  // ── Components (the real ndo-* custom elements) ──
  {
    slug,
    name: 'badge',
    original: { path: component('badge') },
    port: { path: port('badge') }
    // Until 2026-09-28 this disagreed with Claude Design's Badge.jsx on every row
    // except Lifecycle and Nature, and carried a 3% ceiling for it. Soushi
    // ratified Claude Design as this repo's fidelity source that evening;
    // registry/ndo-badge.svelte was rewritten to match Badge.jsx's colours,
    // shapes and fills exactly (opstate-* accepted as an alias of the existing
    // op-* names). The pair matches at 0%.
  },
  { slug, name: 'button', original: { path: component('button') }, port: { path: port('button') } },
  {
    slug,
    name: 'card',
    original: { path: component('card') },
    port: { path: port('card') }
    // Card.jsx matches registry/ndo-card.svelte exactly; until 2026-09-28 its two
    // regime chips (Nondominium, Commons) carried the badge pair's colour
    // disagreement at small area. Fixed alongside the badge pair above; matches
    // at 0%.
  },
  { slug, name: 'status', original: { path: component('status') }, port: { path: port('status') } }
];

export default pairs;
