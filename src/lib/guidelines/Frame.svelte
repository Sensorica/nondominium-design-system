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
  }
</style>
