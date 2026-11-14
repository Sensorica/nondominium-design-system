<script lang="ts">
  import {
    ACCESS_ACTION_IDS,
    PROCESS_ACTION_IDS,
    getComingNext
  } from '../../../domain/coming-next.js';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';
  import SoonBadge from '../../primitives/SoonBadge.svelte';

  interface Props {
    /** "Offer" points at Create NDO, which is live; shown as a shortcut in its popup. */
    oncreatendo?: () => void;
  }

  let { oncreatendo }: Props = $props();

  let featureId = $state<string | null>(null);

  const groups = [
    {
      label: 'Access',
      hint: 'What you can do with this resource',
      ids: ACCESS_ACTION_IDS as readonly string[]
    },
    {
      label: 'Processes',
      hint: 'Services that act on this resource',
      ids: PROCESS_ACTION_IDS as readonly string[]
    }
  ];
</script>

{#if featureId}
  <ComingNextPopup
    {featureId}
    onclose={() => {
      featureId = null;
    }}
    actionLabel={featureId === 'action-offer' && oncreatendo ? 'Create an NDO' : undefined}
    onaction={featureId === 'action-offer' ? oncreatendo : undefined}
  />
{/if}

<section
  data-testid="ndo-action-row"
  class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
  aria-label="Actions and processes"
>
  <div class="space-y-3">
    {#each groups as g (g.label)}
      <div class="flex flex-wrap items-center gap-2">
        <div class="mr-2 w-24 shrink-0">
          <p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">{g.label}</p>
        </div>
        {#each g.ids as id (id)}
          {@const f = getComingNext(id)}
          {#if f}
            <button
              type="button"
              data-action={id}
              title={f.tooltip}
              onclick={() => (featureId = id)}
              class="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-700"
            >
              <span aria-hidden="true">{f.icon}</span>
              {f.title}
              <SoonBadge />
            </button>
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</section>
