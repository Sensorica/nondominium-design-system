<script lang="ts">
  // The zome call behind a form, shown only with Developer details on
  // (ui.jsx PCall).
  import './proto.css';
  import { developer } from '../plain';

  let { c }: { c: string } = $props();
</script>

{#if $developer}<p class="pu call pu-mono">{c}</p>{/if}

<style>
  .call {
    margin: -6px 0 0;
    font-size: 11px;
    color: var(--_muted);
  }
</style>
