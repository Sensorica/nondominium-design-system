<svelte:head><title>Group View — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    AppShell,
    GroupView,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    getMockGroupMembers,
    getMockGroups
  } from '@nondominium/ndo-ui';

  const groupId = $derived(
    browser ? (page.url.searchParams.get('id') ?? getMockGroups()[0].id) : getMockGroups()[0].id
  );

  let groups = $state(getMockGroups());
  const group = $derived(groups.find((g) => g.id === groupId) ?? groups[0]);
  const groupNdos = $derived(
    MOCK_NDOS.filter((d) => group.ndoHashes?.includes(d.hash))
  );

  const members = $derived(getMockGroupMembers(group.id, group.createdBy));

  let showProfileModal = $state(false);
  let autoOpenCreateModal = $derived(
    browser && page.url.searchParams.get('createNdo') === '1'
  );
</script>

<AppShell
  {groups}
  activePath={`${base}/ui-kit/group`}
  profileNickname={MOCK_LOBBY_PROFILE.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  <GroupView
    {group}
    {groupId}
    ndos={groupNdos}
    {members}
    lobbyProfile={MOCK_LOBBY_PROFILE}
    allNdosForDuplicateCheck={MOCK_NDOS}
    {autoOpenCreateModal}
    {showProfileModal}
    ndoHref={(hash) => `${base}/ui-kit/ndo-detail?hash=${encodeURIComponent(hash)}`}
    oncloseprofile={() => { showProfileModal = false; }}
    onsaveprofile={() => { showProfileModal = false; }}
  />
</AppShell>
