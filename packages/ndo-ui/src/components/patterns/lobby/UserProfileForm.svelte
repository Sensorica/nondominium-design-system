<script lang="ts">
  import type { LobbyUserProfile } from '../../../domain/types.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    mode?: 'modal' | 'page';
    profile?: LobbyUserProfile | null;
    onclose?: () => void;
    onsave?: (profile: LobbyUserProfile) => void;
  }

  let { mode = 'modal', profile = null, onclose, onsave }: Props = $props();

  let nickname = $state(profile?.nickname ?? '');
  let realName = $state(profile?.realName ?? '');
  let bio = $state(profile?.bio ?? '');
  let email = $state(profile?.email ?? '');
  let phone = $state(profile?.phone ?? '');
  let address = $state(profile?.address ?? '');
  let nicknameError = $state('');

  $effect(() => {
    nickname = profile?.nickname ?? '';
    realName = profile?.realName ?? '';
    bio = profile?.bio ?? '';
    email = profile?.email ?? '';
    phone = profile?.phone ?? '';
    address = profile?.address ?? '';
  });

  function validate(): boolean {
    if (!nickname.trim()) {
      nicknameError = 'Nickname is required.';
      return false;
    }
    nicknameError = '';
    return true;
  }

  function save() {
    if (!validate()) return;
    const next: LobbyUserProfile = {
      nickname: nickname.trim(),
      ...(realName.trim() && { realName: realName.trim() }),
      ...(bio.trim() && { bio: bio.trim() }),
      ...(email.trim() && { email: email.trim() }),
      ...(phone.trim() && { phone: phone.trim() }),
      ...(address.trim() && { address: address.trim() })
    };
    onsave?.(next);
    onclose?.();
  }
</script>

{#snippet formBody()}
  <div class="space-y-3">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700" for="lup-nickname">
        Nickname <span class="text-red-500">*</span>
      </label>
      <input
        id="lup-nickname"
        type="text"
        bind:value={nickname}
        placeholder="How you appear in the Lobby"
        class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        oninput={() => {
          if (nicknameError) validate();
        }}
      />
      {#if nicknameError}
        <p class="mt-1 text-xs text-red-600">{nicknameError}</p>
      {/if}
    </div>

    <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Optional fields</p>

    <div>
      <label class="mb-1 block text-sm text-gray-600" for="lup-realname">Real name</label>
      <input
        id="lup-realname"
        type="text"
        bind:value={realName}
        placeholder="Your full name (optional)"
        class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="mb-1 block text-sm text-gray-600" for="lup-bio">Bio</label>
      <textarea
        id="lup-bio"
        bind:value={bio}
        placeholder="Short bio (optional)"
        rows="2"
        class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      ></textarea>
    </div>

    <div>
      <label class="mb-1 block text-sm text-gray-600" for="lup-email">Email</label>
      <input
        id="lup-email"
        type="email"
        bind:value={email}
        placeholder="email@example.com (optional)"
        class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="mb-1 block text-sm text-gray-600" for="lup-phone">Phone</label>
      <input
        id="lup-phone"
        type="tel"
        bind:value={phone}
        placeholder="+1 555 000 0000 (optional)"
        class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="mb-1 block text-sm text-gray-600" for="lup-address">Address</label>
      <input
        id="lup-address"
        type="text"
        bind:value={address}
        placeholder="Location (optional)"
        class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>
{/snippet}

{#if mode === 'modal'}
  <Modal
    title={profile?.nickname ? 'Edit profile' : 'Set up your Lobby profile'}
    subtitle="Your Lobby profile is stored locally. Only your nickname is required."
    maxWidth="md"
  >
    {#snippet children()}
      {@render formBody()}
    {/snippet}
    {#snippet footer()}
      {#if profile?.nickname}
        <NdoButton variant="ghost" onclick={() => onclose?.()}>Cancel</NdoButton>
      {/if}
      <NdoButton onclick={save}>Save</NdoButton>
    {/snippet}
  </Modal>
{:else}
  <div class="max-w-md space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Edit Lobby profile</h2>
    {@render formBody()}
    <div class="flex gap-2">
      <NdoButton onclick={save}>Save</NdoButton>
      {#if onclose}
        <NdoButton variant="ghost" onclick={() => onclose?.()}>Cancel</NdoButton>
      {/if}
    </div>
  </div>
{/if}
