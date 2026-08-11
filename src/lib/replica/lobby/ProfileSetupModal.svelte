<script lang="ts">
  // Copy of ui/src/lib/components/lobby/ProfileSetupModal.svelte, including its
  // Melt Dialog builder and the first-launch guard: the modal cannot be
  // dismissed until a nickname exists.
  import { tick } from 'svelte';
  import { Dialog } from 'melt/builders';
  import type { LobbyUserProfile } from '../types';
  import { appContext } from '../stores.svelte';
  import UserProfileForm from './UserProfileForm.svelte';

  interface Props {
    open: boolean;
    onclose?: () => void;
    onsave?: (profile: LobbyUserProfile) => void;
  }

  let { open = $bindable(), onclose, onsave }: Props = $props();

  const hasProfile = $derived(!!appContext.lobbyUserProfile?.nickname);

  const dialog = new Dialog({
    closeOnEscape: () => hasProfile,
    closeOnOutsideClick: () => hasProfile,
    onOpenChange: (value) => {
      open = value;
      if (!value) onclose?.();
    }
  });

  $effect(() => {
    dialog.open = open;
  });

  $effect(() => {
    if (open) {
      void tick().then(() => {
        document.getElementById('lup-nickname')?.focus();
      });
    }
  });

  function handleSave(profile: LobbyUserProfile) {
    onsave?.(profile);
    open = false;
  }
</script>

<dialog
  {...dialog.content}
  aria-modal="true"
  aria-label={hasProfile ? 'Edit your Lobby profile' : 'Set up your Lobby profile'}
  class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-0 shadow-xl"
>
  {#if open}
    <div class="px-6 py-6">
      <UserProfileForm
        mode="page"
        onsave={handleSave}
        onclose={hasProfile ? () => { open = false; } : undefined}
      />
    </div>
  {/if}
</dialog>

<style>
  dialog::backdrop {
    background-color: rgb(0 0 0 / 0.4);
    backdrop-filter: blur(2px);
  }
</style>
