<script lang="ts">
  import type { GroupDescriptor } from '../../../domain/types.js';

  interface Props {
    groups: GroupDescriptor[];
    activePath?: string;
    profileNickname?: string | null;
    browseHref?: string;
    groupHref?: (id: string) => string;
    oncreategroup?: (name: string) => void | Promise<void>;
    onjoingroup?: (inviteCode: string) => void | Promise<void>;
    onprofileclick?: () => void;
  }

  let {
    groups,
    activePath = '/',
    profileNickname = null,
    browseHref = '/',
    groupHref = (id) => `/group/${id}`,
    oncreategroup,
    onjoingroup,
    onprofileclick
  }: Props = $props();

  let showCreateForm = $state(false);
  let showJoinForm = $state(false);
  let createName = $state('');
  let joinCode = $state('');
  let createError = $state('');
  let joinError = $state('');
  let isCreating = $state(false);
  let isJoining = $state(false);

  function isActive(href: string): boolean {
    if (href === browseHref) return activePath === browseHref || activePath === `${browseHref}/`;
    return activePath.startsWith(href);
  }

  async function handleCreate() {
    if (!createName.trim()) {
      createError = 'Group name is required.';
      return;
    }
    isCreating = true;
    createError = '';
    try {
      await oncreategroup?.(createName.trim());
      createName = '';
      showCreateForm = false;
    } catch {
      createError = 'Failed to create group.';
    } finally {
      isCreating = false;
    }
  }

  async function handleJoin() {
    if (!joinCode.trim()) {
      joinError = 'Paste an invite link or code.';
      return;
    }
    isJoining = true;
    joinError = '';
    try {
      await onjoingroup?.(joinCode.trim());
      joinCode = '';
      showJoinForm = false;
    } catch {
      joinError = 'Invalid invite code.';
    } finally {
      isJoining = false;
    }
  }
</script>

<nav
  class="flex w-52 shrink-0 flex-col border-r border-gray-200 bg-gray-50 p-3"
  aria-label="Primary"
>
  <a
    href={browseHref}
    class="mb-3 block rounded px-2 py-1.5 text-sm font-medium transition-colors {isActive(browseHref)
      ? 'bg-white text-gray-900 shadow-sm'
      : 'text-gray-600 hover:bg-white hover:text-gray-900'}"
  >
    Browse NDOs
  </a>

  <div class="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Groups</div>

  {#if groups.length > 0}
    <ul class="mb-2 space-y-0.5">
      {#each groups as g (g.id)}
        <li>
          <a
            href={groupHref(g.id)}
            class="block truncate rounded px-2 py-1 text-sm transition-colors {isActive(groupHref(g.id))
              ? 'bg-white font-medium text-gray-900 shadow-sm'
              : 'text-gray-700 hover:bg-white hover:text-gray-900'}"
          >
            {g.name}
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="mb-2 text-xs text-gray-400 italic">No groups yet.</p>
  {/if}

  {#if showCreateForm}
    <div class="mb-2 rounded border border-gray-200 bg-white p-2">
      <p class="mb-1.5 text-xs font-medium text-gray-700">New group</p>
      <input
        type="text"
        bind:value={createName}
        placeholder="Group name"
        class="mb-1.5 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
        onkeydown={(e) => {
          if (e.key === 'Enter') void handleCreate();
        }}
      />
      {#if createError}
        <p class="mb-1 text-xs text-red-600">{createError}</p>
      {/if}
      <div class="flex gap-1">
        <button
          type="button"
          disabled={isCreating}
          onclick={() => void handleCreate()}
          class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? 'Creating…' : 'Create'}
        </button>
        <button
          type="button"
          onclick={() => {
            showCreateForm = false;
            createName = '';
            createError = '';
          }}
          class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <button
      type="button"
      onclick={() => {
        showCreateForm = true;
        showJoinForm = false;
      }}
      class="mb-1 flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs text-blue-600 hover:bg-white"
    >
      <span class="font-bold">+</span> New Group
    </button>
  {/if}

  {#if showJoinForm}
    <div class="mb-2 rounded border border-gray-200 bg-white p-2">
      <p class="mb-1.5 text-xs font-medium text-gray-700">Join group</p>
      <input
        type="text"
        bind:value={joinCode}
        placeholder="Paste invite link"
        class="mb-1.5 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
        onkeydown={(e) => {
          if (e.key === 'Enter') void handleJoin();
        }}
      />
      {#if joinError}
        <p class="mb-1 text-xs text-red-600">{joinError}</p>
      {/if}
      <div class="flex gap-1">
        <button
          type="button"
          disabled={isJoining}
          onclick={() => void handleJoin()}
          class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isJoining ? 'Joining…' : 'Join'}
        </button>
        <button
          type="button"
          onclick={() => {
            showJoinForm = false;
            joinCode = '';
            joinError = '';
          }}
          class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <button
      type="button"
      onclick={() => {
        showJoinForm = true;
        showCreateForm = false;
      }}
      class="flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs text-gray-600 hover:bg-white"
    >
      <span class="font-bold">→</span> Join Group
    </button>
  {/if}

  <div class="mt-auto border-t border-gray-200 pt-3">
    <button
      type="button"
      onclick={() => onprofileclick?.()}
      class="w-full rounded px-2 py-1.5 text-left text-xs text-gray-500 hover:bg-white hover:text-gray-700"
    >
      {#if profileNickname}
        <span class="font-medium text-gray-700">{profileNickname}</span>
        <span class="ml-1 text-gray-400">· Edit profile</span>
      {:else}
        Set up profile
      {/if}
    </button>
  </div>
</nav>
