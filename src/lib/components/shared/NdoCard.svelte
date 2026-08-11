<script lang="ts">
  // The canonical NDO card: name, one-line description, the three domain
  // badges, and the truncated hash. It is the unit the lobby and every group
  // view are built out of, so its recipe is documented in the playbook.
  import { paths } from '$lib/paths';
  import { shortHash } from '$lib/ndo-ui';
  import { agentLabel } from '$lib/state.svelte';
  import type { NdoDescriptor } from '$lib/types';
  import NdoBadge from './NdoBadge.svelte';

  let { ndo, showInitiator = true }: { ndo: NdoDescriptor; showInitiator?: boolean } = $props();
</script>

<a class="ndo-card ndo-card--interactive" href={paths.ndoDetail(ndo.id)}>
  <div class="flex items-start justify-between gap-3">
    <h3 class="ndo-h3">{ndo.name}</h3>
    <NdoBadge stage={ndo.lifecycle_stage} />
  </div>

  {#if ndo.description}
    <p class="ndo-small mt-2 line-clamp-2">{ndo.description}</p>
  {/if}

  <div class="mt-3 flex flex-wrap gap-1.5">
    <NdoBadge regime={ndo.property_regime} />
    <NdoBadge nature={ndo.resource_nature} />
  </div>

  <div class="mt-3 flex items-center justify-between gap-3">
    <span class="ndo-mono">{shortHash(ndo.hash)}</span>
    {#if showInitiator}
      <span class="ndo-small">{agentLabel(ndo.initiator)}</span>
    {/if}
  </div>
</a>
