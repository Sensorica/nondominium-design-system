<script lang="ts">
  // Log work. zome_group::log_work: a WorkLog in the NDO's group (description + hours).
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { focusOnMount } from './attach';
  import { proto } from '../store/store.svelte';
  import type { Ndo } from '../store/logic';

  let { ndo, onclose }: { ndo: Ndo; onclose: () => void } = $props();

  let description = $state('');
  let hours = $state('1');
  let error = $state<string | null>(null);

  function submit() {
    const r = proto.actions.logWork(ndo.id, description, hours);
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal
  title="Log work"
  sub={'Recorded as a WorkLog in ' + (proto.q.group(ndo.group)?.name ?? 'its group') + " and shown on " + ndo.name + "'s trail."}
  {onclose}
>
  <Call c="zome_group::log_work" />
  <Field label="description *">
    <textarea
      class="pu-textarea desc"
      bind:value={description}
      placeholder="What did you do? What should the next agent know?"
      {@attach focusOnMount}
    ></textarea>
  </Field>
  <Field label="hours *">
    <input class="pu-input" style:width="120px" type="number" min="0" step="0.5" bind:value={hours} />
  </Field>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Sign & log" disabled={!description.trim()} />
</Modal>

<style>
  /* ui.jsx's work-log description textarea has minHeight: 80, not
   * .pu-textarea's shared default of 72 (which matches neither this nor
   * CreateNdoModal's "What is it?" textarea, which needs 64). */
  .desc {
    min-height: 80px;
  }
</style>
