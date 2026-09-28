<!--
  Replica of docs/prototypes/original/ds/components/card/card.card.html,
  built on the real `<ndo-card>` custom element (registry/ndo-card.svelte),
  which renders its badges through `<ndo-badge>` internally, exactly as
  Claude Design's Card.jsx renders through its own Badge.

  Until 2026-09-28, the two `regime-*` badges below (Nondominium, Commons)
  showed a small colour mismatch against Claude Design's Card.jsx (which
  outlines them blue-700 / cyan-700; the registry rendered uniformly dashed
  gray). registry/ndo-badge.svelte's `regime-*` variant now matches Claude
  Design's per-hue outline exactly, so this card matches Card.jsx byte for
  byte: name, description, hash, lifecycle, nature and regime badges, shadow,
  radius, background.
-->
<script lang="ts">
  import { paths } from '$lib/paths';
</script>

<svelte:head>
  <script type="module" src={paths.registryBundle()}></script>
</svelte:head>

<div class="g">
  <ndo-card
    name="Community Solar Array"
    description="Shared photovoltaic infrastructure governed under nondominium principles."
    hash="uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF"
    badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical"
  ></ndo-card>
  <ndo-card
    name="Distributed Sensor Design v3"
    description="Open-source IoT sensor design file for environmental monitoring in urban commons."
    hash="uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9"
    badges="lifecycle-distributed:Distributed;regime-commons:Commons;nature-digital:Digital"
  ></ndo-card>
</div>

<style>
  .g { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
</style>
