// Pairs for the instrument direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
//
// A prior pass here carried every pair at a 1.5-3% ceiling, blamed on
// "font-hinting" between the original's Google Fonts build of Space
// Grotesk/Mono and the port's self-hosted @fontsource build (ISA D9). That
// diagnosis didn't hold up: boundingBox() measurements of the same text on
// both sides land at the sub-pixel level (differences under 0.02px on a
// 40-character string), so the two builds render identically here. The
// actual causes were three real, fixed bugs, all in SpecSheet.svelte:
//
//   1. `.spec` (the left column's <aside>) had an unnecessary
//      `font-size: 13px`, which the original never sets (it inherits the
//      page default, 16px). Every *styled* piece of text inside already
//      carries its own explicit font, so this had no visible effect
//      anywhere except the ambient line-box "strut" for the one bit of
//      bare inline content in the component: "+ add rule", the sole
//      content of its own line right after the rules table. A smaller
//      ambient font there means a smaller strut, landing that link (and
//      every row below it) 3px higher than the original.
//   2. `.sg b { font-weight: 600 }` reproduced the original's *stated*
//      rule (`.sg>b{font-weight:600}`) rather than its *rendered* one: that
//      selector's `>` targets a direct child, but the markup nests `<b>`
//      one level deeper (`.sg > div > b`), so it never matches in the
//      original either, and the browser's default bold (700) wins there
//      instead. On "Check and approve Urban Rhythms..." (the "cnc" NDO),
//      600 vs 700 was enough to change the wrap point: 2 lines in a
//      600-weight port against 3 in the original's 700, shifting
//      everything below the card up by a full line.
//   3. Svelte trims literal template whitespace immediately before a
//      block's `{/if}`, silently dropping the trailing space in
//      `{g.progress[1]} · {/if}`. The original's own text node reads
//      "0/1 · " (with the space); the port's read "0/1 ·" (without),
//      which (again, on "cnc") changed where "why?" wraps. Fixed by moving
//      the space into an interpolated `{' · '}`, which Svelte does not
//      trim.
//
// With those three fixed, every pair here measures 0.4-0.5%, well inside
// the 1% default, so none of them need a `threshold` or `note` at all.
import type { Pair } from '../pairs';

const slug = 'instrument';
const original = 'C%20Instrument.html';
const port = '/prototypes/instrument';

const pairs: Pair[] = [
  {
    slug,
    name: 'default',
    original: { path: original },
    port: { path: port }
  },
  // Each NDO selected: different regime, nature, rules, items and hard
  // links, so a different shape of spec sheet and bench.
  {
    slug,
    name: 'ndo-sns',
    original: { path: original, steps: [{ click: 'text=Environmental Sensor' }] },
    port: { path: port, steps: [{ click: 'text=Environmental Sensor' }] }
  },
  {
    slug,
    name: 'ndo-cnc',
    original: { path: original, steps: [{ click: 'text=Urban Rhythms' }] },
    port: { path: port, steps: [{ click: 'text=Urban Rhythms' }] }
    // The shared seed store's `cnc` UsageLimit literal was fixed in e39236b
    // (src/lib/prototypes/store/logic.ts:302 now reads '— / 90 d', the
    // original's own em dash), so this pair carries no note or threshold.
  },
  {
    slug,
    name: 'ndo-fw',
    original: { path: original, steps: [{ click: 'text=Urban Canopy' }] },
    port: { path: port, steps: [{ click: 'text=Urban Canopy' }] }
  },
  // Declaring an NDO defaults to the Nondominium regime (CreateNdoModal.svelte
  // and ui.jsx's own CreateNdoModal both seed `regime` as 'Nondominium'), so
  // this is the pair that reaches SpecSheet.svelte's ownership row with that
  // regime and proves the original's " · uncapturable" suffix is rendered
  // (ISA Phase 9 finding: the suffix was dropped entirely).
  {
    slug,
    name: 'create-nondominium',
    original: {
      path: original,
      steps: [
        { click: 'text=+ new' },
        { fill: ['input[placeholder="e.g. Shared Bike Fleet"]', 'Community Toolshed'] },
        { click: 'text=Declare NDO' }
      ]
    },
    port: {
      path: port,
      steps: [
        { click: 'text=+ new' },
        { fill: ['input[placeholder="e.g. Shared Bike Fleet"]', 'Community Toolshed'] },
        { click: 'text=Declare NDO' }
      ]
    }
  },
  // A capability socket picked: the centre popover, and the highlighted
  // (teal) wire and box for that socket.
  {
    slug,
    name: 'socket-picked',
    original: { path: original, steps: [{ click: 'text=Hand-over condition' }] },
    port: { path: port, steps: [{ click: 'text=Hand-over condition' }] }
  },
  // Hover states. The nav strip: the handoff's own CSS targets `.bar>nav`
  // (the strip, not each tab) for both the resting colour and the :hover
  // colour, so hovering anywhere in the strip turns every tab's inherited
  // text white at once, not just the one under the pointer. Reproduced as
  // observed against the served original, not "fixed".
  {
    slug,
    name: 'nav-hover',
    original: { path: original, steps: [{ hover: 'nav' }] },
    port: { path: port, steps: [{ hover: '.strip' }] }
  },
  // A filled .btn hover (turns teal).
  {
    slug,
    name: 'btn-hover',
    original: { path: original, steps: [{ hover: 'text=+ Link resource' }] },
    port: { path: port, steps: [{ hover: 'text=+ Link resource' }] }
  },
  // A ghost .btn hover (fills ink, text turns white).
  {
    slug,
    name: 'ghost-hover',
    original: { path: original, steps: [{ hover: 'text=Ask to borrow' }] },
    port: { path: port, steps: [{ hover: 'text=Ask to borrow' }] }
  },
  // Direction-specific modal: link another resource to this one.
  {
    slug,
    name: 'attach-modal',
    original: { path: original, steps: [{ click: 'text=+ Link resource' }] },
    port: { path: port, steps: [{ click: 'text=+ Link resource' }] }
  }
];

export default pairs;
