<script lang="ts">
  import type { GroupMemberProfile, LobbyUserProfile } from '../../../domain/types.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    groupId: string;
    lobbyProfile?: LobbyUserProfile | null;
    onclose: () => void;
    onsave: (profile: GroupMemberProfile) => void;
  }

  let { groupId, lobbyProfile = null, onclose, onsave }: Props = $props();

  const optionalFields: (keyof Omit<LobbyUserProfile, 'nickname'>)[] = [
    'realName',
    'bio',
    'email',
    'phone',
    'address'
  ];
  const fieldLabels: Record<string, string> = {
    realName: 'Real name',
    bio: 'Bio',
    email: 'Email',
    phone: 'Phone',
    address: 'Address'
  };

  let isAnonymous = $state(false);
  let shownFields = $state<(keyof Omit<LobbyUserProfile, 'nickname'>)[]>([]);

  function toggleField(f: keyof Omit<LobbyUserProfile, 'nickname'>) {
    shownFields = shownFields.includes(f)
      ? shownFields.filter((x) => x !== f)
      : [...shownFields, f];
  }

  function save() {
    onsave({ isAnonymous, shownFields: isAnonymous ? [] : shownFields });
    onclose();
  }
</script>

<Modal
  title="Group profile"
  subtitle="Choose how you appear to other members in this group."
  maxWidth="sm"
>
  {#snippet children()}
    <div class="space-y-4">
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={isAnonymous} class="h-4 w-4 rounded" />
        <span class="text-sm text-gray-700">Appear anonymously (pseudonym only)</span>
      </label>

      {#if !isAnonymous && lobbyProfile}
        <div>
          <p class="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Also share from your Lobby profile:
          </p>
          <div class="space-y-1.5">
            {#each optionalFields as f}
              {#if lobbyProfile[f]}
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shownFields.includes(f)}
                    onchange={() => toggleField(f)}
                    class="h-4 w-4 rounded"
                  />
                  <span class="text-sm text-gray-700">
                    {fieldLabels[f]}: <span class="font-medium">{lobbyProfile[f]}</span>
                  </span>
                </label>
              {/if}
            {/each}
          </div>
        </div>
      {:else if !lobbyProfile}
        <p class="text-xs text-gray-400 italic">
          Set up a Lobby profile to share personal details.
        </p>
      {/if}
    </div>
  {/snippet}
  {#snippet footer()}
    <NdoButton variant="ghost" onclick={onclose}>Skip</NdoButton>
    <NdoButton onclick={save}>Save</NdoButton>
  {/snippet}
</Modal>
