<!--
  Replica of docs/prototypes/original/ds/components/card/card.card.html,
  built on the real `<ndo-card>` custom element (registry/ndo-card.svelte),
  which renders its badges through `<ndo-badge>` internally, exactly as
  Claude Design's Card.jsx renders through its own Badge.

  NOTE: the two `regime-*` badges below (Nondominium, Commons) inherit the
  Badge disagreement documented in BadgeCard.svelte's note: this card will
  show a small colour mismatch on those two chips (Claude Design outlines
  them blue-700 / cyan-700; ours is uniformly dashed gray). Everything else
  on the card (name, description, hash, lifecycle and nature badges, shadow,
  radius, background) matches Claude Design's Card.jsx byte for byte.
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
