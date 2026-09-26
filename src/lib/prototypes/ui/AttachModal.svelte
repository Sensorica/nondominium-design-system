<script lang="ts">
  // Link to another resource. log_economic_event(Cite) → zome_gouvernance::create_ndo_hard_link
  // (Component / DerivedFrom / Supersedes)
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { proto } from '../store/store.svelte';
  import { LINK_TYPES, type Ndo } from '../store/logic';

  let { ndo, onclose }: { ndo: Ndo; onclose: () => void } = $props();

  const others = $derived(proto.s.ndos.filter((n) => n.id !== ndo.id));
  let to = $state(proto.s.ndos.find((n) => n.id !== ndo.id)?.id ?? '');
  let type = $state<string>('Component');
  let error = $state<string | null>(null);

  const HINT: Record<string, string> = {
    Component: 'This NDO is a component of the target.',
    DerivedFrom: 'This NDO was derived from the target (fork, adaptation).',
    Supersedes: 'This NDO replaces the target.'
  };

  function submit() {
    const r = proto.actions.hardLink(ndo.id, to, type);
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal
  title="Link to another resource"
  sub={'Typed hard link from ' + ndo.name + '. It is backed by an economic event, so it survives across groups.'}
  {onclose}
>
  <Call c="log_economic_event(Cite) → zome_gouvernance::create_ndo_hard_link" />
  <Field label="How they relate" hint={HINT[type]}>
    <Choice options={LINK_TYPES} value={type} onchange={(v) => (type = v)} />
  </Field>
  <Field label="Target resource">
    <select class="pu-select" bind:value={to}>
      {#each others as n (n.id)}<option value={n.id}>{n.name}</option>{/each}
    </select>
  </Field>
  {#if !others.length}<p class="pu-muted">No other resource to link to yet.</p>{/if}
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Create link" disabled={!to} />
</Modal>
