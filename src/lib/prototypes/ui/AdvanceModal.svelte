<script lang="ts">
  // Change a resource's stage. zome_resource::update_lifecycle_stage (initiator
  // only; Deprecated needs a successor). The options are exactly what the
  // integrity zome accepts from the current stage.
  import { untrack } from 'svelte';
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { proto } from '../store/store.svelte';
  import { allowedStages, type Ndo } from '../store/logic';
  import { plain } from '../plain';

  let { ndo, onclose }: { ndo: Ndo; onclose: () => void } = $props();

  const options = $derived(allowedStages(ndo));
  // The modal is keyed on the NDO (ModalHost), so the first option is read once.
  let to = $state<string>(untrack(() => allowedStages(ndo)[0] ?? ''));
  let successor = $state('');
  let error = $state<string | null>(null);
  const others = $derived(proto.s.ndos.filter((n) => n.id !== ndo.id));

  function submit() {
    const r = proto.actions.advance(ndo.id, to, successor || undefined);
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal
  title="Change stage"
  sub={ndo.name + ' is ' + plain(ndo.stage) + '. Started by ' + proto.q.agent(ndo.initiator) + '.'}
  {onclose}
  width={420}
>
  <Call c="zome_resource::update_lifecycle_stage" />
  {#if options.length}
    <Choice {options} value={to} onchange={(v) => { to = v; error = null; }} />
  {:else}
    <p class="pu-muted">Retired is final. No further stage changes.</p>
  {/if}
  {#if to === 'Hibernating'}
    <p class="pu-muted">Pauses the resource. Resuming returns it to {plain(ndo.stage)}.</p>
  {/if}
  {#if to === 'Deprecated'}
    <Field label="The resource that replaces it (required)">
      <select class="pu-select" bind:value={successor}>
        <option value="">Pick a successor</option>
        {#each others as n (n.id)}<option value={n.id}>{n.name}</option>{/each}
      </select>
    </Field>
  {/if}
  <ErrorNote {error} />
  {#if options.length}
    <ModalActions {onclose} onok={submit} label={'Move to ' + plain(to)} />
  {/if}
</Modal>
