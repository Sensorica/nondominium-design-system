<script lang="ts">
  // Join a group with an invite link. zome_group::join_group
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { focusOnMount } from './attach';
  import { proto } from '../store/store.svelte';

  interface Props {
    onclose: () => void;
    after?: (groupId: string) => void;
  }

  let { onclose, after }: Props = $props();

  let code = $state('');
  let error = $state<string | null>(null);
  const pending = $derived(Object.keys(proto.s.invites ?? {})[0]);

  function submit() {
    const r = proto.actions.joinGroup(code);
    if (!r.ok) {
      error = r.error;
      return;
    }
    after?.(r.value.id);
    onclose();
  }
</script>

<Modal title="Join a group" sub="Paste the invite link someone sent you." {onclose}>
  <Call c="zome_group::join_group" />
  <Field label="Invite link" hint={pending ? 'Pending invite in this prototype: ' + pending : null}>
    <input
      class="pu-input pu-mono"
      bind:value={code}
      oninput={() => (error = null)}
      placeholder="ndo-invite:…"
      {@attach focusOnMount}
    />
  </Field>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Join group" disabled={!code.trim()} />
</Modal>
