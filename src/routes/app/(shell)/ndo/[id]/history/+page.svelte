<script lang="ts">
  // The transition trail (REQ-UI-NDO-04). Each row is from-stage, to-stage,
  // actor, timestamp and the triggering event hash. The event hash is null in
  // the MVP: automatic EconomicEvent generation is backend Phase 2.3, and
  // showing an honest null is better than inventing a hash.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentLabel, transitionsFor } from '$lib/state.svelte';
  import { STAGE_VOCAB } from '$lib/ndo-ui';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const history = $derived(transitionsFor(id));
</script>

{#if history.length === 0}
  <EmptyState icon="🕓" title="No transitions recorded" body="This NDO is still at the stage it was registered at." />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">{history.length} transitions</h2></div>
    <div class="ndo-panel__body">
      <ol class="trail">
        {#each history as event (event.timestamp + event.to_stage)}
          <li>
            <span class="dot" aria-hidden="true">{STAGE_VOCAB[event.to_stage].icon}</span>
            <div>
              <p class="ndo-small">
                <strong>{event.from_stage}</strong> → <strong>{event.to_stage}</strong>
              </p>
              <p class="ndo-field__hint">
                {agentLabel(event.agent)} · {event.timestamp} ·
                {#if event.event_hash}
                  <span class="ndo-mono">{event.event_hash}</span>
                {:else}
                  <span title="Automatic EconomicEvent generation is backend Phase 2.3">no event hash yet</span>
                {/if}
              </p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>
{/if}

<style>
  .trail { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-4); }
  .trail li { display: flex; gap: var(--ndo-spacing-3); align-items: flex-start; }
  .dot {
    width: 28px;
    height: 28px;
    border-radius: var(--ndo-radius-pill);
    background: var(--ndo-color-surface);
    border: 1px solid var(--ndo-color-border);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
</style>
