<script lang="ts">
  import type { NdoDescriptor } from '../../domain/types.js';
  import { truncateHash } from '../../domain/format.js';
  import NdoBadge from './NdoBadge.svelte';

  interface Props {
    descriptor: NdoDescriptor;
    href?: string;
    onclick?: (e: MouseEvent) => void;
  }

  let { descriptor, href = '#', onclick }: Props = $props();
</script>

<a
  {href}
  {onclick}
  class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
>
  <div class="mb-2 flex flex-wrap items-center gap-2">
    {#if descriptor.lifecycle_stage}
      <NdoBadge kind="lifecycle" value={descriptor.lifecycle_stage} mode="card-lifecycle" />
    {/if}
    {#if descriptor.property_regime}
      <NdoBadge kind="regime" value={descriptor.property_regime} mode="card-regime" />
    {/if}
    {#if descriptor.resource_nature}
      <NdoBadge kind="nature" value={descriptor.resource_nature} mode="identity" />
    {/if}
  </div>
  <h3 class="text-lg font-semibold text-gray-900">{descriptor.name}</h3>
  {#if descriptor.description}
    <p class="mt-1 line-clamp-2 text-sm text-gray-600">{descriptor.description}</p>
  {/if}
  <p class="mt-1 font-mono text-xs text-gray-400">#{truncateHash(descriptor.hash)}</p>
</a>
