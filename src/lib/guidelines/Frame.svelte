<!--
  The isolated frame every guideline card route wraps its content in.

  Covers the whole viewport regardless of the compare instrument's fixed
  1440x900 shot (scripts/compare-prototypes.ts), the same way the original's
  own `<body>{background;padding;margin:0}` does at any window width: content
  sits top-left, unconstrained, over a background that fills the rest.

  `position: fixed` rather than styling `:global(body)` directly, because the
  root layout already owns a `:global(body)` rule (font, color, app
  background) for the design-system chrome, and this frame must paint over
  that rather than race it for cascade order.

  `line-height: var(--ndo-lh-base)` mirrors the original's own
  `tokens/base.css` (`body { line-height: var(--ndo-lh-base) }`, 1.5rem). That
  rule matters more than it looks: an absolute-unit line-height (`1.5rem`)
  cascades to every descendant as the SAME computed 24px regardless of that
  descendant's own font-size, where UnoCSS's preflight sets the unitless
  `line-height: 1.5` on `html`, which instead recomputes per element
  (1.5 * that element's own font-size). For a single line of body text the two
  are close enough to pass; for several stacked rows of smaller type (a label,
  a caption, a legend) the per-row gap keeps compounding downward, one card
  drifting further from its original with every row. That is what
  ISA Phase 9 measured as a real defect, not antialiasing, in three cards fed
  through this same Frame: layout-shell (row y-positions off by 6 to 10px by
  the fourth row), type-scale (every row below the page title shifted down),
  and shadows (the whole caption row shifted down by roughly one line height).
  Setting the original's fixed line-height here, once, fixes all three at the
  source instead of patching each card's own CSS.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { background, padding, children }: { background: string; padding: string; children: Snippet } =
    $props();
</script>

<div class="frame" style="background:{background};padding:{padding}">
  {@render children()}
</div>

<style>
  .frame {
    position: fixed;
    inset: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: auto;
    font-family: var(--ndo-font-sans);
    line-height: var(--ndo-lh-base);
  }
</style>
