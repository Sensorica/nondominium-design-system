<svelte:head><title>Group View — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    AppShell,
    GroupView,
    MOCK_GROUPS,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    type GroupMember
  } from '@nondominium/ndo-ui';

  const groupId = $derived(
    browser ? (page.url.searchParams.get('id') ?? MOCK_GROUPS[0].id) : MOCK_GROUPS[0].id
  );
  const group = $derived(MOCK_GROUPS.find((g) => g.id === groupId) ?? MOCK_GROUPS[0]);
  const groupNdos = $derived(
    MOCK_NDOS.filter((d) => group.ndoHashes?.includes(d.hash))
  );

  const members = $derived<GroupMember[]>([
    { id: 'creator', name: group.createdBy ?? 'Creator', role: 'Creator' },
    { id: 'me', name: MOCK_LOBBY_PROFILE.nickname, role: 'Member' }
  ]);

  let showProfileModal = $state(false);
  let autoOpenCreateModal = $derived(
    browser && page.url.searchParams.get('createNdo') === '1'
  );
</script>

<AppShell
  groups={MOCK_GROUPS}
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
