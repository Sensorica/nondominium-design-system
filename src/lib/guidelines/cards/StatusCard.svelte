<!--
  Replica of docs/prototypes/original/ds/components/status/status.card.html,
  built on the real `<ndo-status-dot>` custom element
  (registry/ndo-status-dot.svelte). No disagreement found: Claude Design's
  StatusDot.jsx matches ours state-for-state (active emerald-700, inactive
  gray-500/gray-400, pending amber-600, coming-soon amber-50 fill with a
  2px amber-600 border).
-->
<script lang="ts">
  import { paths } from '$lib/paths';
</script>

<svelte:head>
  <script type="module" src={paths.registryBundle()}></script>
</svelte:head>

<div class="row">
  <ndo-status-dot status="active" label="Active"></ndo-status-dot>
  <ndo-status-dot status="inactive" label="Inactive"></ndo-status-dot>
  <ndo-status-dot status="pending" label="Pending"></ndo-status-dot>
  <ndo-status-dot status="coming-soon" label="Coming soon"></ndo-status-dot>
</div>
<div class="row">
  <ndo-status-dot status="active"></ndo-status-dot>
  <ndo-status-dot status="inactive"></ndo-status-dot>
  <ndo-status-dot status="pending"></ndo-status-dot>
  <ndo-status-dot status="coming-soon"></ndo-status-dot>
</div>

<style>
  .row { display: flex; gap: 28px; align-items: center; margin-bottom: 18px; }
</style>
