<script lang="ts">
  // The group work log. Entries here are the raw material contributions are
  // built from: what happened, who did it, how long it took.
  import { page } from '$app/state';
  import { agentLabel, logWork, showToast, workLogFor } from '$lib/state.svelte';
  import Field from '$lib/components/shared/Field.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const entries = $derived(workLogFor(id));

  let summary = $state('');
  let hours = $state(1);

  function log() {
    if (!summary.trim()) return;
    logWork(id, summary.trim(), hours);
    showToast('success', 'Logged');
    summary = '';
    hours = 1;
  }
</script>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">Log work</h2></div>
  <div class="ndo-panel__body flex flex-col gap-4">
    <Field label="What did you do?" required>
      {#snippet control()}
        <input class="ndo-input" bind:value={summary} placeholder="Serviced the router spindle." />
      {/snippet}
    </Field>
    <Field label="Hours">
      {#snippet control()}<input class="ndo-input" type="number" min="0.5" step="0.5" bind:value={hours} />{/snippet}
    </Field>
    <div class="flex justify-end">
      <button class="ndo-btn ndo-btn--primary" onclick={log} disabled={!summary.trim()}>Log</button>
    </div>
  </div>
</section>

{#if entries.length === 0}
  <EmptyState icon="📓" title="Nothing logged yet" body="The first entry starts the record." />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">{entries.length} entries</h2></div>
    <div class="ndo-panel__body">
      <ul class="feed">
        {#each entries as entry (entry.id)}
          <li>
            <div class="flex items-baseline justify-between gap-3">
              <strong class="ndo-small">{agentLabel(entry.agent)}</strong>
              <span class="ndo-field__hint">{entry.at} · {entry.hours}h</span>
            </div>
            <p class="ndo-small mt-1">{entry.summary}</p>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

<style>
  .feed { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .feed li { padding-bottom: var(--ndo-spacing-3); border-bottom: 1px solid var(--ndo-color-border-subtle); }
  .feed li:last-child { border-bottom: none; padding-bottom: 0; }
</style>
