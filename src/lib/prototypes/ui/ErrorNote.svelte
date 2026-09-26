<script lang="ts">
  // A backend error, in friendly words (ui.jsx PErr).
  import './proto.css';
  import { friendly } from '../plain';

  let { error }: { error: string | null | undefined } = $props();
  const text = $derived(friendly(error));
</script>

{#if text}<p class="pu pu-err" role="alert">{text}</p>{/if}
