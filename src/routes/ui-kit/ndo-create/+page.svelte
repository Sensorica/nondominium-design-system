<svelte:head><title>NDO Create — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import {
    AppShell,
    NdoCreateModal,
    MOCK_GROUPS,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    type NdoInput
  } from '@nondominium/ndo-ui';

  let submitted = $state(false);
  let lastInput = $state<NdoInput | null>(null);

  function handleSubmit(input: NdoInput) {
    lastInput = input;
    submitted = true;
  }
</script>

<AppShell
  groups={MOCK_GROUPS}
  activePath={`${base}/ui-kit/ndo-create`}
  profileNickname={MOCK_LOBBY_PROFILE.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  <div class="p-6">
    {#if submitted && lastInput}
      <div class="mx-auto max-w-lg rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
        <h1 class="text-lg font-semibold text-gray-900">NDO created (mock)</h1>
        <p class="mt-2 text-sm text-gray-600">{lastInput.name} · {lastInput.lifecycle_stage}</p>
        <a href="{base}/ui-kit/group" class="mt-4 inline-block text-sm text-blue-600 hover:underline">← Back to group</a>
      </div>
    {:else}
      <NdoCreateModal
        groupId={MOCK_GROUPS[0].id}
        groupName={MOCK_GROUPS[0].name}
        existingNdos={MOCK_NDOS}
        onclose={() => goto(`${base}/ui-kit/group?id=${MOCK_GROUPS[0].id}`)}
        onsubmit={handleSubmit}
      />
    {/if}
  </div>
</AppShell>
