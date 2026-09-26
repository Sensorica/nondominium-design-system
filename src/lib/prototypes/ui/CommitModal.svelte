<script lang="ts">
  // Ask to borrow or receive. zome_gouvernance::propose_commitment (the
  // receiver is you).
  import { untrack } from 'svelte';
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { proto } from '../store/store.svelte';
  import { AGENTS, ENUM, type Ndo } from '../store/logic';
  import { plain } from '../plain';

  let { ndo, onclose }: { ndo: Ndo; onclose: () => void } = $props();

  const items = $derived(proto.s.instances[ndo.id] ?? []);
  // Default provider: whoever holds the first item, else the initiator. Read
  // once; the modal is keyed on the NDO (ModalHost).
  const initialProvider = untrack(() => {
    const first = proto.s.instances[ndo.id]?.[0];
    const me = proto.me.id;
    return first && first[2] !== me ? first[2] : ndo.initiator !== me ? ndo.initiator : 'sar';
  });
  let action = $state<string>('AccessForUse');
  let inst = $state(0);
  let provider = $state(initialProvider);
  let note = $state('');
  let error = $state<string | null>(null);

  function submit() {
    const r = proto.actions.propose({ ndo: ndo.id, action, inst, provider, note });
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal title="Ask to borrow or receive" sub="Send a request to the person holding the item. They complete it by handing it over." {onclose}>
  <Call c="zome_gouvernance::propose_commitment" />
  <Field label="What">
    <Choice options={ENUM.action} value={action} onchange={(v) => (action = v)} />
  </Field>
  {#if items.length}
    <Field label="Item">
      <select class="pu-select" bind:value={inst}>
        {#each items as r, i (i)}<option value={i}>{r[0]} · {plain(r[1])}</option>{/each}
      </select>
    </Field>
  {/if}
  <Field label="From">
    <select class="pu-select" bind:value={provider}>
      {#each Object.keys(AGENTS) as a (a)}<option value={a}>{proto.q.agent(a)}</option>{/each}
    </select>
  </Field>
  <Field label="Note">
    <input class="pu-input" bind:value={note} placeholder="e.g. 2 weeks, 48 h transport notice" />
  </Field>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Send request" />
</Modal>
