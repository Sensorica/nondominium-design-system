<script lang="ts">
  // Layer 2: peer-validated work against this NDO. A contribution is not a
  // claim about quality — it is a record that work happened and that at least
  // one accountable agent countersigned it.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentLabel, contributionsFor } from '$lib/state.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const contributions = $derived(contributionsFor(id));
  const totalHours = $derived(contributions.reduce((sum, c) => sum + (c.effort_hours ?? 0), 0));
</script>

{#if contributions.length === 0}
  <EmptyState icon="📈" title="No contributions recorded" body="Layer 2 activates when agents start coordinating around this object." />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">{contributions.length} contributions</h2>
      <span class="ndo-field__hint">{totalHours}h of recorded effort</span>
    </div>
    <div class="ndo-panel__body">
      <ul class="feed">
        {#each contributions as c (c.id)}
          <li>
            <div class="row">
              <span>
                <a href={paths.agentProfile(c.provider)}>{agentLabel(c.provider)}</a>
                <span class="ndo-badge ndo-badge--neutral ml-2">{c.action}</span>
              </span>
              <span class="ndo-field__hint">
                {c.at}{c.effort_hours ? ` · ${c.effort_hours}h` : ''}
              </span>
            </div>
            {#if c.note}<p class="ndo-small mt-1">{c.note}</p>{/if}
            <p class="ndo-field__hint mt-1">
              Validated by {c.validated_by.map((v) => agentLabel(v)).join(', ')}
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

<style>
  .feed { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-4); }
  .feed li { padding-bottom: var(--ndo-spacing-4); border-bottom: 1px solid var(--ndo-color-border-subtle); }
  .feed li:last-child { border-bottom: none; padding-bottom: 0; }
  .row { display: flex; align-items: baseline; justify-content: space-between; gap: var(--ndo-spacing-3); flex-wrap: wrap; }
  a { color: var(--ndo-color-link); font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-medium); }
</style>
