<script lang="ts" module>
  export interface ScopeChip {
    id: string;
    label: string;
    on: boolean;
    select: () => void;
  }
</script>

<script lang="ts">
  // Group scope that scales to any number of groups: an "all" chip, the first
  // `max` groups as chips, the rest in a select. Pass a `chip` snippet to draw
  // the chips in a direction's own style; the default is a small toggle button.
  import type { Snippet } from 'svelte';
  import './proto.css';
  import { proto } from '../store/store.svelte';

  interface Props {
    /** 'all' or a group id. */
    value: string;
    onchange: (v: string) => void;
    max?: number;
    allLabel?: string;
    chip?: Snippet<[ScopeChip]>;
  }

  let { value, onchange, max = 3, allLabel = 'All groups', chip }: Props = $props();

  const groups = $derived(proto.s.groups);
  const head = $derived(groups.slice(0, max));
  const rest = $derived(groups.slice(max));
  const inRest = $derived(rest.some((g) => g.id === value));
  const chips = $derived<ScopeChip[]>(
    [{ id: 'all', name: allLabel }, ...head].map((g) => ({
      id: g.id,
      label: g.name.length > 22 ? g.name.slice(0, 21) + '…' : g.name,
      on: value === g.id,
      select: () => onchange(g.id)
    }))
  );
</script>

{#each chips as c (c.id)}
  {#if chip}
    {@render chip(c)}
  {:else}
    <button type="button" class="pu pu-btn pu-btn--ghost pu-btn--sm" class:is-on={c.on} aria-pressed={c.on} onclick={c.select}>{c.label}</button>
  {/if}
{/each}
{#if rest.length}
  <select
    class="more"
    class:more--on={inRest}
    value={inRest ? value : ''}
    aria-label="More groups"
    onchange={(e) => {
      const v = e.currentTarget.value;
      if (v) onchange(v);
    }}
  >
    <option value="">+{rest.length} more groups</option>
    {#each rest as g (g.id)}<option value={g.id}>{g.name}</option>{/each}
  </select>
{/if}

<style>
  .more {
    font: inherit;
    font-size: 12px;
    background: transparent;
    color: inherit;
    border: 0;
    padding: 4px 6px;
    cursor: pointer;
    max-width: 170px;
  }
  .more--on {
    font-weight: 700;
  }
</style>
