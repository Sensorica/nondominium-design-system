<script lang="ts">
  // Create a group, then show its invite link. zome_group::create_group → lobby::announce_group
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { focusOnMount } from './attach';
  import { proto } from '../store/store.svelte';

  interface Props {
    onclose: () => void;
    /** Called with the new group's id when the person opens it. */
    after?: (groupId: string) => void;
  }

  let { onclose, after }: Props = $props();

  let name = $state('');
  let desc = $state('');
  let error = $state<string | null>(null);
  let done = $state<{ id: string; invite: string; name: string } | null>(null);
  let copied = $state(false);

  function submit() {
    const r = proto.actions.createGroup({ name, desc });
    if (!r.ok) error = r.error;
    else done = { ...r.value, name: name.trim() };
  }

  async function copy() {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done.invite);
      copied = true;
    } catch {
      copied = false;
    }
  }
</script>

{#if done}
  <Modal title="Group created" sub={done.name + ' is its own shared space. Share the invite link so others can join.'} {onclose}>
    <p class="invite pu-mono">{done.invite}</p>
    <div class="pu-row pu-row--end">
      <button type="button" class="pu-btn pu-btn--ghost" onclick={copy}>{copied ? '✓ Copied' : '⎘ Copy invite link'}</button>
      <button
        type="button"
        class="pu-btn"
        onclick={() => {
          after?.(done!.id);
          onclose();
        }}>Open group</button
      >
    </div>
  </Modal>
{:else}
  <Modal title="Create a group" sub="A group is a community that shares resources. You can invite people with a link." {onclose}>
    <Call c="zome_group::create_group → lobby::announce_group" />
    <Field label="Name *">
      <input class="pu-input" bind:value={name} placeholder="e.g. FabLab Montréal" {@attach focusOnMount} />
    </Field>
    <Field label="Description"><input class="pu-input" bind:value={desc} /></Field>
    <ErrorNote {error} />
    <ModalActions {onclose} onok={submit} label="Create group" disabled={!name.trim()} />
  </Modal>
{/if}

<style>
  .invite {
    margin: 0;
    font-size: 13px;
    padding: 10px 12px;
    border: 1px dashed var(--_line);
    border-radius: var(--_field-radius);
    word-break: break-all;
  }
</style>
