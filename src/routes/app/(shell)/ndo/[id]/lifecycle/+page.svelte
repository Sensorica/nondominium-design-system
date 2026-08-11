<script lang="ts">
  // The lifecycle transition screen. It offers exactly the transitions the Rust
  // integrity zome would accept — no more. Offering one it would reject means a
  // reviewer signs off on a flow that cannot ship, which is the one failure mode
  // this screen exists to prevent.
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { appState, ME_ID, ndoById, recordTransition, showToast } from '$lib/state.svelte';
  import {
    STAGE_MEANING,
    allowedTransitions,
    requirementFor,
  } from '$lib/guards/useLifecycleFlow.svelte';
  import { lifecycle } from '$lib/guards/lifecycle.svelte';
  import { STAGE_VOCAB } from '$lib/ndo-ui';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';

  const id = $derived(page.params.id ?? '');
  const ndo = $derived(ndoById(id));
  const isInitiator = $derived(ndo?.initiator === ME_ID);
  const options = $derived(ndo ? allowedTransitions(ndo.lifecycle_stage, ndo.hibernation_origin) : []);
  const requirement = $derived(lifecycle.draftStage ? requirementFor(lifecycle.draftStage) : null);

  // Successor candidates for a Deprecated transition: any other NDO that is not
  // itself terminal.
  const successors = $derived(
    appState.ndos.filter((n) => n.id !== id && n.lifecycle_stage !== 'EndOfLife')
  );

  $effect(() => {
    if (id && lifecycle.targetId !== id) lifecycle.open(id);
  });

  function commit() {
    if (!ndo || !lifecycle.draftStage || !lifecycle.ready) return;
    recordTransition(id, lifecycle.draftStage, { successorHash: lifecycle.draftSuccessorHash });
    showToast('success', `${ndo.name} is now ${lifecycle.draftStage}`);
    lifecycle.close();
    goto(paths.ndoHistory(id));
  }
</script>

{#if !ndo}
  <EmptyState icon="🫥" title="No such NDO" />
{:else if options.length === 0}
  <EmptyState
    icon="🪦"
    title="This NDO is at end of life"
    body="The identity anchor stays as a permanent tombstone. There is nowhere left to go."
  />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">🔄 Transition lifecycle stage</h2>
      <NdoBadge stage={ndo.lifecycle_stage} />
    </div>
    <div class="ndo-panel__body flex flex-col gap-4">
      {#if !isInitiator}
        <p class="ndo-field__hint">
          ⚠️ Only the initiator may transition an NDO in the MVP. Role-based authorization is
          REQ-NDO-LC-07, deferred to the governance operator.
        </p>
      {/if}

      <div class="options">
        {#each options as option (option)}
          <button
            class="option"
            class:option--on={lifecycle.draftStage === option}
            onclick={() => lifecycle.select(option)}
          >
            <span class="option__head">
              <span aria-hidden="true">{STAGE_VOCAB[option].icon}</span>
              <strong>{option}</strong>
            </span>
            <span class="ndo-small">{STAGE_MEANING[option]}</span>
          </button>
        {/each}
      </div>

      {#if requirement === 'successor'}
        <label class="ndo-field">
          <span class="ndo-field__label">Successor NDO (required)</span>
          <select class="ndo-select" onchange={(e) => lifecycle.setSuccessor(e.currentTarget.value)}>
            <option value="">Choose the NDO that replaces this one…</option>
            {#each successors as candidate (candidate.id)}
              <option value={candidate.hash}>{candidate.name}</option>
            {/each}
          </select>
          <span class="ndo-field__hint">
            Deprecating without naming a successor would strand everything that depends on this
            object. REQ-NDO-LC-06 makes the link mandatory.
          </span>
        </label>
      {:else if requirement === 'confirmation'}
        <label class="toggle">
          <input
            type="checkbox"
            checked={lifecycle.confirmed}
            onchange={(e) => lifecycle.confirm(e.currentTarget.checked)}
          />
          <span class="ndo-small">
            {#if lifecycle.draftStage === 'Hibernating'}
              I understand this pauses the NDO. It will resume to <strong>{ndo.lifecycle_stage}</strong>.
            {:else}
              I understand this is terminal. The anchor remains, permanently, as a tombstone.
            {/if}
          </span>
        </label>
      {/if}
    </div>
    <div class="ndo-modal__foot">
      <a class="ndo-btn ndo-btn--ghost" href={paths.ndoDetail(id)}>Cancel</a>
      <button
        class="ndo-btn {lifecycle.draftStage === 'EndOfLife' ? 'ndo-btn--destructive' : 'ndo-btn--primary'}"
        onclick={commit}
        disabled={!lifecycle.ready}
      >
        {lifecycle.draftStage ? `Transition to ${lifecycle.draftStage}` : 'Choose a stage'}
      </button>
    </div>
  </section>
{/if}

<style>
  .options { display: grid; gap: var(--ndo-spacing-2); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .option {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;
    padding: var(--ndo-spacing-3);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-color-card-bg));
    font: inherit;
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .option:hover { border-color: rgb(var(--ndo-primary-300)); }
  .option--on { border-color: rgb(var(--ndo-primary-500)); background: rgb(var(--ndo-primary-50)); }
  .option__head { display: flex; align-items: center; gap: 6px; font-size: var(--ndo-text-sm); }
  .toggle { display: flex; align-items: flex-start; gap: var(--ndo-spacing-3); cursor: pointer; }
</style>
