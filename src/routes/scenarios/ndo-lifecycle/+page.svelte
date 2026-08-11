<script lang="ts">
  // Scenario: the lifecycle ladder end to end. This page exists because the
  // transition table is the one piece of the prototype that must match the Rust
  // integrity zome exactly, and a reviewer needs to be able to read it in one
  // place rather than by clicking through ten NDOs.
  import { paths } from '$lib/paths';
  import { LIFECYCLE_STAGES } from '$lib/types';
  import type { LifecycleStage } from '$lib/types';
  import { allowedTransitions, STAGE_MEANING, requirementFor } from '$lib/guards/useLifecycleFlow.svelte';
  import { STAGE_VOCAB } from '$lib/ndo-ui';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';

  let current = $state<LifecycleStage>('Prototype');
  let hibernationOrigin = $state<LifecycleStage>('Active');

  const options = $derived(allowedTransitions(current, hibernationOrigin));
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">🔄 NDO lifecycle</h1>
    <p class="ndo-p mt-2" style="max-width:64ch">
      Ten stages, one forward chain, two escapes available from anywhere, and one stage that
      remembers where it came from. Coordination overhead is meant to grow with the stage: an
      Ideation object is somebody's declared intent and needs almost no governance, while an Active
      one carries custody, maintenance and benefit redistribution.
    </p>
  </header>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">The ladder</h2></div>
    <div class="ndo-panel__body">
      <ol class="ladder">
        {#each LIFECYCLE_STAGES as stage (stage)}
          <li class:on={stage === current}>
            <button onclick={() => (current = stage)}>
              <NdoBadge {stage} />
              <span class="ndo-small">{STAGE_MEANING[stage]}</span>
            </button>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">From {current}, the zome accepts</h2>
      {#if current === 'Hibernating'}
        <label class="ndo-small">
          resumes to
          <select class="ndo-select" style="width:auto;display:inline-block" bind:value={hibernationOrigin}>
            {#each LIFECYCLE_STAGES.slice(0, 7) as s (s)}<option value={s}>{s}</option>{/each}
          </select>
        </label>
      {/if}
    </div>
    <div class="ndo-panel__body flex flex-col gap-3">
      {#if options.length === 0}
        <p class="ndo-small">Nothing. EndOfLife is terminal; the anchor stays as a tombstone.</p>
      {:else}
        <div class="flex flex-wrap gap-2">
          {#each options as option (option)}
            <span class="opt">
              <NdoBadge stage={option} />
              {#if requirementFor(option) === 'successor'}
                <span class="ndo-field__hint">needs a successor</span>
              {:else if requirementFor(option) === 'confirmation'}
                <span class="ndo-field__hint">needs confirmation</span>
              {/if}
            </span>
          {/each}
        </div>
      {/if}
      <p class="ndo-small">
        Every other target is rejected. Prototype cannot jump to Active; Deprecated cannot be undone;
        Hibernating returns only to the stage it paused from. The prototype offers exactly this set
        because offering more would let a reviewer approve a flow that cannot ship.
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Two special cases</h2></div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        <strong>{STAGE_VOCAB.Deprecated.icon} Deprecated requires a successor.</strong> Deprecating
        without naming what replaces the object would strand everything that depends on it, so the
        successor hash is committed in the same transition.
      </p>
      <p class="ndo-small">
        <strong>{STAGE_VOCAB.Hibernating.icon} Hibernating records its origin.</strong> A seasonal
        kiln pausing from Active resumes to Active, not to the top of the ladder. The origin is
        stored on the entry and cleared on resume.
      </p>
    </div>
  </section>

  <p class="ndo-small">
    Live version: <a href={paths.ndoLifecycle('ndo4')}>the transition screen on a Prototype-stage NDO</a>,
    and <a href={paths.ndoHistory('ndo1')}>the transition trail on a mature one</a>.
  </p>
</div>

<style>
  .ladder { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  .ladder button {
    display: flex; align-items: center; gap: var(--ndo-spacing-3);
    width: 100%; text-align: left; padding: 6px 8px; border-radius: var(--ndo-radius-md);
    border: 1px solid transparent; background: none; font: inherit; cursor: pointer;
  }
  .ladder button:hover { background: var(--ndo-color-surface); }
  .ladder .on button { background: rgb(var(--ndo-primary-50)); border-color: rgb(var(--ndo-primary-300)); }
  .opt { display: inline-flex; align-items: center; gap: 6px; }
  a { color: var(--ndo-color-link); }
</style>
