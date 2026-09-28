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
    port: { path: port('brand-logo') },
    threshold: 0.031,
    note:
      "Different bitmap by design: the original's 1024x1024 nondominium_logo.png does not exist in this repo; " +
      'this card renders static/assets/nondominium-logo.png (696x536, a different crop, no off-white background ' +
      'inset) via paths.logo(). Reported for a decision, not silently swapped for a pixel match.'
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
    port: { path: port('brand-layers') },
    threshold: 0.017,
    note:
      'Sub-pixel text anti-aliasing across the three columns of prose (same system-ui stack both sides; the diff ' +
      'is a one-pixel-wide outline around glyphs, never a wrong colour or a layout shift) — the same category of ' +
      'residual documented in pairs/instrument.ts and pairs/field-notes.ts for font rendering.'
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
  // use the ndo-badge custom element), so it matches at 0%. The interesting
  // fact it documents — Claude Design outlines each PropertyRegime in its own
  // hue, where registry/ndo-badge.svelte's `regime-*` variant and the shipped
  // app's NdoCard.svelte both render every regime with a uniform gray-400
  // dashed border — is a registry/app vs Claude Design disagreement, reported
  // in ColorsRegime.svelte's own comment and in the report, not something this
  // pair needs a raised threshold for.
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
    port: { path: port('layout-shell') },
    threshold: 0.022,
    note:
      "Confirmed by pixel-row analysis: the diff is two ~8px bands at the .card box's top and bottom edges " +
      "(box-shadow + border), each ~1150px wide — a one-pixel vertical rounding difference in that box's " +
      'position between the two page loads, not a layout or colour bug.'
  },

  // ── Components (the real ndo-* custom elements) ──
  {
    slug,
    name: 'badge',
    original: { path: component('badge') },
    port: { path: port('badge') },
    threshold: 0.03,
    note:
      "Claude Design's Badge.jsx disagrees with registry/ndo-badge.svelte on every row except Lifecycle and " +
      'Nature: op-state is `opstate-*` there vs `op-*` here, and filled per-state colour there vs a neutral chip ' +
      "with only the dot coloured here (a deliberate choice per the component's own comment); regime is per-hue " +
      'dashed there vs uniform gray dashed here (matches the shipped app); rule fills a coloured background and ' +
      'rounds the right corners there vs a square gray chip with a coloured left edge here, and two of the four ' +
      'rules use a different hue family; rivalry is filled there vs outlined here; scope-network and scope-public ' +
      'use different hue families. Full comparison in the report. This card intentionally uses the real custom ' +
      "element's actual variant names and colours rather than reproducing Claude Design's, per the brief."
  },
  { slug, name: 'button', original: { path: component('button') }, port: { path: port('button') } },
  {
    slug,
    name: 'card',
    original: { path: component('card') },
    port: { path: port('card') },
    note:
      "Card.jsx matches registry/ndo-card.svelte exactly, but it renders its badges through Claude Design's own " +
      'Badge, so the two regime chips (Nondominium, Commons) carry the same colour disagreement as the badge ' +
      'pair above, at small area.'
  },
  { slug, name: 'status', original: { path: component('status') }, port: { path: port('status') } }
];

export default pairs;
