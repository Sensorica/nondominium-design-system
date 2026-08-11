<script lang="ts">
  // Creating an NDO commits the Layer 0 identity anchor: name, regime, nature
  // and starting stage. Everything except the stage is immutable afterwards,
  // which is why this form explains each choice rather than just listing
  // options — a wrong regime cannot be corrected later.
  //
  // Creation is group-scoped (REQ-UI-NAV-02). Reaching this page without a group
  // gets the explanation, not a broken form.
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { appState, createNdo, groupById, showToast } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';
  import { CREATABLE_STAGES, PROPERTY_REGIMES, RESOURCE_NATURES } from '$lib/types';
  import type { LifecycleStage, PropertyRegime, ResourceNature } from '$lib/types';
  import { NATURE_VOCAB, REGIME_VOCAB, STAGE_VOCAB } from '$lib/ndo-ui';
  import Field from '$lib/components/shared/Field.svelte';

  const groupId = $derived(page.url.searchParams.get('group'));
  const group = $derived(groupId ? groupById(groupId) : null);

  let name = $state('');
  let description = $state('');
  let regime = $state<PropertyRegime>('Nondominium');
  let nature = $state<ResourceNature>('Physical');
  let stage = $state<LifecycleStage>('Ideation');

  // Name uniqueness is a warning, not a block: two groups may legitimately name
  // their own thing the same way (REQ-UI-NDO-01).
  const nameTaken = $derived(
    name.trim().length > 0 &&
      appState.ndos.some((n) => n.name.toLowerCase() === name.trim().toLowerCase())
  );

  function create() {
    if (!name.trim()) return;
    if (!joining.can.canWriteToDht) {
      joining.blockOn(`create the NDO "${name.trim()}"`);
      return;
    }
    const ndo = createNdo(
      {
        name: name.trim(),
        description: description.trim(),
        property_regime: regime,
        resource_nature: nature,
        lifecycle_stage: stage,
      },
      groupId
    );
    showToast('success', `Created ${ndo.name}`);
    goto(paths.ndoDetail(ndo.id));
  }
</script>

<header>
  <h1 class="ndo-h1">➕ New NDO</h1>
  <p class="ndo-p mt-2" style="max-width:60ch">
    A Nondominium Object begins as a Layer 0 identity anchor. Everything below except the lifecycle
    stage is permanent once committed.
  </p>
</header>

{#if !group}
  <section class="ndo-card" style="background:rgb(var(--ndo-amber-50));border-color:rgb(var(--ndo-amber-100))">
    <h2 class="ndo-h3">NDOs are created inside a group</h2>
    <p class="ndo-small mt-2">
      There is no global create flow. A group is a cloned DNA cell with its own DHT; an NDO created
      there is announced to its members and soft-linked from that cell. Pick a group first.
    </p>
    <div class="mt-4 flex gap-2 flex-wrap">
      {#each appState.groups as g (g.id)}
        <a class="ndo-btn ndo-btn--ghost ndo-btn--sm" href={paths.ndoCreate(g.id)}>{g.name}</a>
      {/each}
      <a class="ndo-btn ndo-btn--primary ndo-btn--sm" href={paths.groupCreate()}>＋ Create a group</a>
    </div>
  </section>
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">In {group.name}</h2>
      <span class="ndo-mono">{group.networkSeed}</span>
    </div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <Field
        label="Name"
        required
        hint={nameTaken ? '' : 'Permanent. This is how the network refers to it.'}
        error={nameTaken ? 'Another NDO already uses this name. Allowed, but confusing.' : ''}
      >
        {#snippet control()}
          <input class="ndo-input" bind:value={name} placeholder="Community Solar Array" />
        {/snippet}
      </Field>

      <Field label="Description" hint="One or two sentences. What is it, and who is it for?">
        {#snippet control()}<textarea class="ndo-textarea" bind:value={description}></textarea>{/snippet}
      </Field>

      <Field label="Property regime" required hint={REGIME_VOCAB[regime].hint}>
        {#snippet control()}
          <select class="ndo-select" bind:value={regime}>
            {#each PROPERTY_REGIMES as r (r)}
              <option value={r}>{REGIME_VOCAB[r].icon} {r}</option>
            {/each}
          </select>
        {/snippet}
      </Field>

      <Field label="Resource nature" required hint={NATURE_VOCAB[nature].hint}>
        {#snippet control()}
          <select class="ndo-select" bind:value={nature}>
            {#each RESOURCE_NATURES as n (n)}
              <option value={n}>{NATURE_VOCAB[n].icon} {n}</option>
            {/each}
          </select>
        {/snippet}
      </Field>

      <Field
        label="Starting lifecycle stage"
        required
        hint={`${STAGE_VOCAB[stage].hint} — Hibernating, Deprecated and EndOfLife are transition-only.`}
      >
        {#snippet control()}
          <select class="ndo-select" bind:value={stage}>
            {#each CREATABLE_STAGES as s (s)}
              <option value={s}>{STAGE_VOCAB[s].icon} {s}</option>
            {/each}
          </select>
        {/snippet}
      </Field>

      {#if !joining.can.canWriteToDht}
        <p class="ndo-field__hint">
          ⚠️ This writes to the DHT, so it needs a Person entry. You will be asked for one.
        </p>
      {/if}
    </div>
    <div class="ndo-modal__foot">
      <a class="ndo-btn ndo-btn--ghost" href={paths.groupDetail(group.id)}>Cancel</a>
      <button class="ndo-btn ndo-btn--primary" onclick={create} disabled={!name.trim()}>Create NDO</button>
    </div>
  </section>
{/if}
