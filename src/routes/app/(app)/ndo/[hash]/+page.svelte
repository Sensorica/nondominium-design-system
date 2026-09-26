<script lang="ts">
  // Mirrors ui/src/routes/ndo/[id]/+page.svelte, where a load function decodes
  // the param into specHashB64.
  //
  // One addition, wiring only: NdoView is remounted when `?state=` changes. In
  // the prototype a different `?state=` is a different conductor answering, so
  // the screen map's ndo-loading and ndo-error keys, which share this route and
  // hash with ndo-resources, must start from a fresh first visit. The app has no
  // such param, and keeps the instance across a hash change exactly as here.
  import NdoView from '$lib/replica/ndo/NdoView.svelte';
  import { page } from '$app/state';
  import { urlParam } from '$lib/replica/url-state.svelte';

  const specHashB64 = $derived(decodeURIComponent(page.params.hash ?? ''));
  const dataState = $derived(urlParam('state'));
</script>

{#key dataState}
  <NdoView {specHashB64} />
{/key}
