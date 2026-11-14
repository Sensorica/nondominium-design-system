<script lang="ts">
  import { PERSPECTIVES, getComingNext, type PerspectiveId } from '../../../domain/coming-next.js';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';
  import SoonBadge from '../../primitives/SoonBadge.svelte';

  interface Props {
    /** The Perspective currently shown. At Layer 0 only `resource` is live. */
    active?: PerspectiveId;
    onselect?: (id: PerspectiveId) => void;
    /** Fired when a placeholder is clicked, after its popup has opened. */
    onsoon?: (id: PerspectiveId) => void;
  }

  let { active = 'resource', onselect, onsoon }: Props = $props();

  let soonFeatureId = $state<string | null>(null);

  function choose(id: PerspectiveId) {
    const meta = PERSPECTIVES.find((p) => p.id === id);
    if (!meta) return;
    if (meta.live) {
      onselect?.(id);
      return;
    }
    soonFeatureId = meta.comingNextId ?? null;
    onsoon?.(id);
  }
</script>

{#if soonFeatureId}
  <ComingNextPopup
    featureId={soonFeatureId}
    onclose={() => {
      soonFeatureId = null;
    }}
  />
{/if}

<div
  role="tablist"
  aria-label="Perspectives"
  data-testid="perspective-switcher"
  class="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
>
  {#each PERSPECTIVES as p (p.id)}
    {@const soon = getComingNext(p.comingNextId ?? '')}
    <button
      type="button"
      role="tab"
      aria-selected={active === p.id}
      data-perspective={p.id}
      title={p.live ? p.question : (soon?.tooltip ?? p.question)}
      onclick={() => choose(p.id)}
      class="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors {active ===
      p.id
        ? 'bg-blue-50 text-blue-700 shadow-sm'
        : p.live
          ? 'text-gray-700 hover:bg-gray-50'
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}"
    >
      <span aria-hidden="true">{p.icon}</span>
      {p.label}
      {#if !p.live}
        <SoonBadge />
      {/if}
    </button>
  {/each}
</div>
