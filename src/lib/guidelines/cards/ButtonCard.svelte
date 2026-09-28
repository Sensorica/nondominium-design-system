<!--
  Replica of docs/prototypes/original/ds/components/button/button.card.html,
  built on the real `<ndo-button>` custom element (registry/ndo-button.svelte).
  No disagreement found: Claude Design's Button.jsx VARIANTS object matches
  registry/ndo-button.svelte variant-for-variant (primary blue-600/700, ghost
  gray-700/gray-300, destructive red-700), so this card should reach a very
  low mismatch on its own.
-->
<script lang="ts">
  import { paths } from '$lib/paths';
</script>

<svelte:head>
  <script type="module" src={paths.registryBundle()}></script>
</svelte:head>

<div class="row">
  <ndo-button>Create NDO</ndo-button>
  <ndo-button>+ New NDO</ndo-button>
  <ndo-button variant="ghost">Cancel</ndo-button>
  <ndo-button variant="destructive">Deprecate</ndo-button>
</div>
<div class="row">
  <ndo-button disabled>Create NDO</ndo-button>
  <ndo-button variant="ghost" disabled>Cancel</ndo-button>
  <ndo-button variant="destructive" disabled>Deprecate</ndo-button>
  <ndo-button variant="ghost" href="#">View NDO →</ndo-button>
</div>

<style>
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px; }
</style>
