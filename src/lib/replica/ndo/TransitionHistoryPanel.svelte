<script lang="ts">
  // Copy of ui/src/lib/components/ndo/TransitionHistoryPanel.svelte.
  // The markup below is byte-identical; only the data source changes: the
  // Effect service call becomes a synchronous lookup against mock state.
  import { onMount } from 'svelte';
  import type { NdoTransitionHistoryEvent } from '../types';
  import { ndoService } from '../stores.svelte';

  interface Props {
    /** Base64 NDO hash. Production passes a decoded ActionHash. */
    ndoHash: string;
  }

  let { ndoHash }: Props = $props();

  let history = $state<NdoTransitionHistoryEvent[]>([]);
  let isLoading = $state(true);

  onMount(() => {
    history = ndoService.getTransitionHistory(ndoHash);
    isLoading = false;
  });

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
</script>

<details class="mt-3 rounded border border-gray-200 bg-gray-50">
  <summary
    class="cursor-pointer select-none px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
  >
    Lifecycle history · {isLoading
      ? '…'
      : `${history.length} transition${history.length !== 1 ? 's' : ''}`}
  </summary>

  <div class="border-t border-gray-200 px-3 py-2">
    {#if isLoading}
      <p class="text-xs text-gray-400 italic">Loading history…</p>
    {:else if history.length === 0}
      <p class="text-xs text-gray-400 italic">
        No transitions recorded. Backend <code>get_ndo_transition_history</code> is not yet
        implemented in <code>zome_resource</code>.
      </p>
    {:else}
      <ul class="space-y-2">
        {#each history as event}
          <li class="rounded border border-gray-100 bg-white px-3 py-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">{event.from_stage}</span>
              <span class="text-gray-400">→</span>
              <span class="font-medium text-gray-700">{event.to_stage}</span>
            </div>
            <div class="mt-1 text-gray-500">
              By <span class="font-mono">{event.agent.slice(0, 10)}…</span>
              · {new Date(event.timestamp / 1000).toLocaleString()}
            </div>
            <div class="mt-0.5 flex items-center gap-1">
              <span class="font-mono text-gray-400">{event.event_hash.slice(0, 12)}…</span>
              <button
                type="button"
                onclick={() => copyToClipboard(event.event_hash)}
                class="text-gray-400 hover:text-gray-700"
                title="Copy event hash"
              >
                ⧉
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</details>
