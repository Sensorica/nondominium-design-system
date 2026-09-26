<script lang="ts">
  // Renders whichever shared modal is open (see modals.svelte.ts). Mount one
  // per direction, inside the direction's root so the --proto-* theme applies.
  // Only a modal opened on this route renders: one left over from another
  // direction carries that direction's callbacks.
  import { page } from '$app/state';
  import { modals } from './modals.svelte';
  import { proto } from '../store/store.svelte';
  import CreateNdoModal from './CreateNdoModal.svelte';
  import AttachModal from './AttachModal.svelte';
  import NoteModal from './NoteModal.svelte';
  import AdvanceModal from './AdvanceModal.svelte';
  import ProfileModal from './ProfileModal.svelte';
  import GroupModal from './GroupModal.svelte';
  import JoinModal from './JoinModal.svelte';
  import BrowseModal from './BrowseModal.svelte';
  import RuleModal from './RuleModal.svelte';
  import ResourcesModal from './ResourcesModal.svelte';
  import CommitModal from './CommitModal.svelte';
  import CommitmentsModal from './CommitmentsModal.svelte';
  import ReceiptsModal from './ReceiptsModal.svelte';
  import HelpModal from './HelpModal.svelte';
  import WhyModal from './WhyModal.svelte';

  const m = $derived(modals.current && modals.owner === page.url.pathname ? modals.current : null);
  const ndo = $derived(m && 'ndo' in m ? proto.q.ndo(m.ndo) : undefined);
  const close = () => modals.close();
</script>

{#if m}
  {#if m.type === 'create'}
    <CreateNdoModal onclose={close} after={m.after} />
  {:else if m.type === 'profile'}
    <ProfileModal onclose={close} />
  {:else if m.type === 'group'}
    <GroupModal onclose={close} after={m.after} />
  {:else if m.type === 'join'}
    <JoinModal onclose={close} after={m.after} />
  {:else if m.type === 'browse'}
    <BrowseModal onclose={close} onOpen={m.onOpen} />
  {:else if m.type === 'commitments'}
    <CommitmentsModal onclose={close} ndo={ndo ?? null} />
  {:else if m.type === 'receipts'}
    <ReceiptsModal onclose={close} />
  {:else if m.type === 'help'}
    <HelpModal onclose={close} />
  {:else if ndo}
    {#key ndo.id + m.type}
      {#if m.type === 'attach'}
        <AttachModal {ndo} onclose={close} />
      {:else if m.type === 'note'}
        <NoteModal {ndo} onclose={close} />
      {:else if m.type === 'advance'}
        <AdvanceModal {ndo} onclose={close} />
      {:else if m.type === 'rule'}
        <RuleModal {ndo} onclose={close} />
      {:else if m.type === 'resources'}
        <ResourcesModal {ndo} onclose={close} />
      {:else if m.type === 'commit'}
        <CommitModal {ndo} onclose={close} />
      {:else if m.type === 'why'}
        <WhyModal sig={m.sig} {ndo} onclose={close} />
      {/if}
    {/key}
  {/if}
{/if}
