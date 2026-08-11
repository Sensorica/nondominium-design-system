<script lang="ts">
  import { ECOLOGICAL_VALUE_DIMENSIONS } from '../../../domain/spec-profiles.js';
  import type { EcologicalValueDimension, SourceProfile } from '../../../domain/types.js';

  interface Props {
    profile: SourceProfile;
    readonly?: boolean;
    onchange?: (values: Partial<Record<EcologicalValueDimension, number>>) => void;
  }

  let { profile, readonly = false, onchange }: Props = $props();

  function getValue(dim: EcologicalValueDimension): number {
    return profile.ecological_values?.[dim] ?? 0;
  }

  function setValue(dim: EcologicalValueDimension, value: number) {
    if (readonly || !onchange) return;
    onchange({ ...profile.ecological_values, [dim]: value });
  }
</script>

<div class="space-y-3">
  <p class="text-sm text-gray-600">
    Multidimensional ecological value — cannot be collapsed to a single metric. Optional at
    enrichment time.
  </p>
  {#each ECOLOGICAL_VALUE_DIMENSIONS as dim}
    <div>
      <div class="flex items-center justify-between gap-2">
        <label class="text-sm font-medium text-gray-800" for="eco-{dim.id}">{dim.label}</label>
        <span class="text-xs text-gray-500">{getValue(dim.id)}/10</span>
      </div>
      <p class="text-xs text-gray-500">{dim.description}</p>
      <input
        id="eco-{dim.id}"
        type="range"
        min="0"
        max="10"
        step="1"
        value={getValue(dim.id)}
        disabled={readonly}
        class="mt-1 w-full"
        oninput={(e) => setValue(dim.id, Number(e.currentTarget.value))}
      />
    </div>
  {/each}
</div>
