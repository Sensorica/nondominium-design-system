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
  <Field label="What did you do? *">
    <textarea
      class="pu-textarea"
      bind:value={description}
      placeholder="What did you do? What should the next person know?"
      {@attach focusOnMount}
    ></textarea>
  </Field>
  <Field label="Hours *">
    <input class="pu-input" style:width="120px" type="number" min="0" step="0.5" bind:value={hours} />
  </Field>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Sign & log" disabled={!description.trim()} />
</Modal>
