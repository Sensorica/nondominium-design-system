<script lang="ts">
  // Mirrors ui/src/routes/ndo/[id]/+page.svelte, where a load function decodes
  // the param into specHashB64.
  import NdoView from '$lib/replica/ndo/NdoView.svelte';
  import { page } from '$app/state';

  const specHashB64 = $derived(decodeURIComponent(page.params.hash ?? ''));
</script>

<NdoView {specHashB64} />
