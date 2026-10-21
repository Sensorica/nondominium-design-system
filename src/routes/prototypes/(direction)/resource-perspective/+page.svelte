<script lang="ts">
  // Layer 0, full-bleed. Lobby, then a group as a Perspective host, then one
  // NDO in the Resource Perspective. State lives in the module singleton so
  // edits survive moving between these views.
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import {
    advanceStage,
    applyPatch,
    associate,
    clearFilters,
    createGroup,
    createNdo,
    groupIdFromInvite,
    hasGroup,
    historyFor,
    initiatorName,
    joinNdo,
    MOCK_NDOS,
    MY_KEY,
    OPERATIONAL,
    rp,
    saveProfile,
    setFilters
  } from '$lib/prototypes/resource-perspective/state.svelte';
  import {
    AppShell,
    Breadcrumb,
    getAssociatedGroupIds,
    getMockGroupMembers,
    getMockInitiatorName,
    MOCK_AGENT_NAMES,
    GroupPerspectivesView,
    NdoBrowser,
    ResourceNdoView,
    UserProfileForm,
    applyNdoFilters,
    type NdoInput
  } from '@nondominium/ndo-ui';

  let profileOpen = $state(false);

  const here = paths.protoResource();
  const lobbyUrl = here;
  const groupUrl = (id: string) => paths.protoResourceGroup(id);
  const ndoUrl = (hash: string, id?: string | null) => paths.protoResourceNdo(hash, id);
  const createUrl = (id: string) => paths.protoResourceCreate(id);
  const absolute = (path: string) => `${page.url.origin}${path}`;

  const allNdos = $derived([...MOCK_NDOS, ...rp.created].map(applyPatch));
  const groupId = $derived(page.url.searchParams.get('group'));
  const ndoHash = $derived(page.url.searchParams.get('ndo'));
  const view = $derived(page.url.searchParams.get('view'));
  const group = $derived(rp.groups.find((g) => g.id === groupId) ?? null);
  const descriptor = $derived(
    view === 'ndo' ? (allNdos.find((d) => d.hash === ndoHash) ?? null) : null
  );
  const groupNdos = $derived(allNdos.filter((d) => group?.ndoHashes?.includes(d.hash)));
  const lobbyNdos = $derived(
    applyNdoFilters(
      allNdos.filter((d) => rp.groups.some((g) => g.ndoHashes?.includes(d.hash))),
      rp.filters
    )
  );

  const groupBreadcrumb = $derived(
    group
      ? [
          { label: 'Lobby', href: lobbyUrl },
          { label: group.name, href: groupUrl(group.id) },
          { label: 'Resource' }
        ]
      : []
  );
  const ndoBreadcrumb = $derived(
    descriptor
      ? [
          { label: 'Lobby', href: lobbyUrl },
          ...(group ? [{ label: group.name, href: groupUrl(group.id) }] : []),
          { label: 'Resource', href: group ? groupUrl(group.id) : lobbyUrl },
          { label: descriptor.name }
        ]
      : []
  );

  const SEEDED_GROUPS = new Set(['grp_sensorica', 'grp_opensourceecology', 'grp_waterfrance']);

  function membersOf(id: string, createdBy?: string) {
    if (!SEEDED_GROUPS.has(id)) {
      return [{ id: 'lynn', name: createdBy ?? MOCK_AGENT_NAMES.lynn, role: 'Creator' }];
    }
    return getMockGroupMembers(id, createdBy);
  }

  function handleCreate(input: NdoInput) {
    if (!group) return;
    const hash = createNdo(group.id, input);
    goto(ndoUrl(hash, group.id));
  }

  async function handleCreateGroup(name: string) {
    const id = createGroup(name);
    await goto(groupUrl(id));
  }

  async function handleJoinGroup(code: string) {
    const id = groupIdFromInvite(code);
    if (!id || !hasGroup(id)) throw new Error('Unknown group');
    await goto(groupUrl(id));
  }
</script>

<svelte:head>
  <title>Resource Perspective · Nondominium prototypes</title>
  <style>
    :root {
      --proto-exit-left: 224px;
    }
  </style>
</svelte:head>

<div class="rp">
  <AppShell
    groups={rp.groups}
    activePath={group ? groupUrl(group.id) : lobbyUrl}
    profileNickname={rp.profile.nickname}
    browseHref={lobbyUrl}
    groupHref={groupUrl}
    oncreategroup={handleCreateGroup}
    onjoingroup={handleJoinGroup}
    onprofileclick={() => (profileOpen = true)}
  >
    {#if descriptor}
      <ResourceNdoView
        {descriptor}
        breadcrumb={ndoBreadcrumb}
        initiatorName={initiatorName(descriptor, getMockInitiatorName(descriptor.hash))}
        isInitiator={descriptor.initiator === MY_KEY}
        members={rp.members[descriptor.hash] ?? []}
        joined={rp.joined.includes(descriptor.hash)}
        onjoin={() => joinNdo(descriptor.hash)}
        groups={rp.groups}
        associatedGroupIds={getAssociatedGroupIds(rp.groups, descriptor.hash)}
        onassociate={(ids) => associate(descriptor.hash, ids)}
        onlifecycleconfirm={(payload) => advanceStage(descriptor.hash, descriptor, payload)}
        candidateNdos={allNdos}
        ndoLink={absolute(ndoUrl(descriptor.hash, groupId))}
        operationalState={OPERATIONAL[descriptor.hash] ?? null}
        transitionHistory={historyFor(descriptor.hash)}
        oncreatendo={group ? () => goto(createUrl(group.id)) : undefined}
      />
    {:else if view === 'group' && group}
      <GroupPerspectivesView
        {group}
        groupId={group.id}
        ndos={groupNdos}
        members={membersOf(group.id, group.createdBy)}
        myAgentKey={MY_KEY}
        joinedHashes={rp.joined}
        allNdosForDuplicateCheck={allNdos}
        breadcrumb={groupBreadcrumb}
        autoOpenCreateModal={page.url.searchParams.get('createNdo') === '1'}
        ndoHref={(hash) => ndoUrl(hash, group.id)}
        ndoLink={(hash) => absolute(ndoUrl(hash, group.id))}
        oncreatendo={handleCreate}
      />
    {:else if view === 'group'}
      <div class="rp-missing">
        <Breadcrumb items={[{ label: 'Lobby', href: lobbyUrl }, { label: 'Unknown group' }]} />
        <h1>This group is not in the session</h1>
        <p>The invite does not match a group loaded here. <a href={lobbyUrl}>Back to the lobby</a>.</p>
      </div>
    {:else}
      <div class="rp-lobby">
        <div class="rp-lobby__crumb"><Breadcrumb items={[{ label: 'Lobby' }]} /></div>
        <h1>Lobby</h1>
        <NdoBrowser
          descriptors={lobbyNdos}
          activeFilters={rp.filters}
          ndoHref={(hash) => ndoUrl(hash)}
          onfilterchange={(f) => setFilters(f)}
          onclearfilters={clearFilters}
        />
      </div>
    {/if}
  </AppShell>

  {#if profileOpen}
    <UserProfileForm
      profile={rp.profile}
      onclose={() => (profileOpen = false)}
      onsave={(profile) => {
        saveProfile(profile);
        profileOpen = false;
      }}
    />
  {/if}
</div>

<style>
  .rp {
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .rp :global(.min-h-screen) {
    height: 100%;
    min-height: 0;
  }
  .rp-lobby {
    padding: 24px;
  }
  .rp-lobby__crumb {
    margin-bottom: 12px;
  }
  .rp-lobby h1 {
    margin: 0 0 16px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }
  .rp-missing {
    padding: 24px;
  }
  .rp-missing h1 {
    margin: 12px 0 8px;
    font-size: 1.25rem;
    color: #111827;
  }
  .rp-missing p {
    margin: 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
</style>
