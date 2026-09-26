<script lang="ts">
  // Declare a shared resource. zome_resource::create_ndo → zome_group::create_ndo_anchor
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { focusOnMount } from './attach';
  import { proto } from '../store/store.svelte';
  import { ENUM, type PropertyRegime, type ResourceNature } from '../store/logic';

  interface Props {
    onclose: () => void;
    /** Called with the new NDO's id. */
    after?: (ndoId: string) => void;
  }

  let { onclose, after }: Props = $props();

  const groups = $derived(proto.s.groups);
  let name = $state('');
  let desc = $state('');
  let nature = $state<ResourceNature>('Physical');
  let regime = $state<PropertyRegime>('Nondominium');
  let groupId = $state(proto.s.groups[0]?.id ?? '');
  let error = $state<string | null>(null);

  function submit() {
    const r = proto.actions.createNdo({ name, desc, nature, regime, group: groupId });
    if (!r.ok) {
      error = r.error;
      return;
    }
    after?.(r.value);
    onclose();
  }
</script>

<Modal title="Add a shared resource" sub="It starts as an idea. You can move it through its stages as it becomes real." {onclose}>
  <Call c="zome_resource::create_ndo → zome_group::create_ndo_anchor" />
  <Field label="Name *">
    <input class="pu-input" bind:value={name} placeholder="e.g. Shared Bike Fleet" {@attach focusOnMount} />
  </Field>
  <Field label="What is it?">
    <textarea class="pu-textarea" bind:value={desc}></textarea>
  </Field>
  <Field label="Nature">
    <Choice options={ENUM.nature} value={nature} onchange={(v) => (nature = v as ResourceNature)} />
  </Field>
  <Field label="Property regime" hint={regime === 'Nondominium' ? 'Uncapturable: no agent can take unilateral control.' : null}>
    <Choice options={ENUM.regime} value={regime} onchange={(v) => (regime = v as PropertyRegime)} />
  </Field>
  <Field label="Group">
    {#if groups.length}
      <Choice
        options={groups.map((g) => g.id)}
        value={groupId}
        format={(id) => groups.find((g) => g.id === id)?.name ?? id}
        onchange={(v) => (groupId = v)}
      />
    {:else}
      <p class="pu-muted">Resources live in a group. Create or join one first.</p>
    {/if}
  </Field>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Declare NDO" disabled={!name.trim() || !groups.length} />
</Modal>
