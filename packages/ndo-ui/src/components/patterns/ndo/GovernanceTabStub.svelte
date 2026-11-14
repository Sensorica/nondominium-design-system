<script lang="ts">
  import type { EconomicMode, ResourceNature } from '../../../domain/types.js';

  interface Props {
    economicMode?: EconomicMode | null;
    resourceNature?: ResourceNature | string | null;
  }

  let { economicMode = null, resourceNature = null }: Props = $props();

  const digital = $derived(String(resourceNature ?? '') === 'Digital');
</script>

<div class="rounded-lg border border-dashed border-gray-300 bg-white p-6">
  <span class="mb-3 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Stub</span>
  <p class="text-sm text-gray-700">
    Governance tab — recommended templates (with Soon for schemas not yet creatable) and custom typed
    RuleData attach here when wired to Holochain.
  </p>
  {#if digital}
    <p class="mt-3 text-xs text-gray-600">
      Digital × Commons recommendations include attribution / integrity; attribution applies as a Free
      access stand-in until attribution is typed. Integrity stays Soon — use Custom rule for other
      typed RuleData now.
    </p>
  {:else if economicMode}
    <p class="mt-3 text-xs text-gray-600">
      Inventoriable mode ({economicMode}) drives which usage-limit templates are recommended.
    </p>
  {/if}
</div>
