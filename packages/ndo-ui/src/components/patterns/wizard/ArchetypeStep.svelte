<script lang="ts">
  import { NDO_ARCHETYPES } from '../../../domain/wizard-archetypes.js';
  import type { NdoArchetypeId } from '../../../domain/types.js';

  interface Props {
    selected: NdoArchetypeId;
    onselect: (id: NdoArchetypeId) => void;
  }

  let { selected, onselect }: Props = $props();
</script>

<div class="space-y-3">
  <p class="text-sm text-gray-600">
    What are you trying to do? There is no wrong answer — you can enrich details later.
  </p>
  <div class="grid gap-2 sm:grid-cols-2">
    {#each NDO_ARCHETYPES as archetype}
      <button
        type="button"
        class="rounded-lg border px-4 py-3 text-left transition-colors {selected === archetype.id
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}"
        onclick={() => onselect(archetype.id)}
      >
        <span class="text-xl" aria-hidden="true">{archetype.icon}</span>
        <p class="mt-1 text-sm font-semibold text-gray-900">{archetype.title}</p>
        <p class="mt-0.5 text-xs text-gray-500">{archetype.subtitle}</p>
        <p class="mt-2 text-xs text-gray-400">
          {archetype.tier} path · {archetype.defaultLifecycleStage}
        </p>
      </button>
    {/each}
  </div>
</div>
