<script lang="ts">
  // Copy of ui/src/lib/components/ndo/NdoView.svelte.
  //
  // Markup is the app's, unchanged. Two prototype-only additions, both outside
  // the markup:
  //   1. local tab / modal / join-panel state is mirrored into the query string,
  //      so every one of those states is a deep-linkable, commentable surface.
  //      Production keeps them purely local, which is right for the app and
  //      useless for a review tool.
  //   2. the Effect service calls resolve synchronously against mock state.
  import { page } from '$app/state';
  import { replaceState } from '$app/navigation';
  import { paths } from '$lib/paths';
  import type { NdoDescriptor } from '../types';
  import { urlFlag, urlParam } from '../url-state.svelte';
  import { appContext, ndoService } from '../stores.svelte';
  import MemberList from '../group/MemberList.svelte';
  import ResourcesTab from './ResourcesTab.svelte';
  import GovernanceTab from './GovernanceTab.svelte';
  import ActivityTab from './ActivityTab.svelte';
  import CompositionTab from './CompositionTab.svelte';
  import NdoIdentityLayer from './NdoIdentityLayer.svelte';
  import ForkNdoModal from './ForkNdoModal.svelte';
  import AssociateNdoModal from './AssociateNdoModal.svelte';

  interface Props {
    specHashB64: string;
  }

  let { specHashB64 }: Props = $props();

  type TabId = 'resources' | 'governance' | 'composition' | 'activity';
  const TAB_IDS: TabId[] = ['resources', 'governance', 'composition', 'activity'];

  const paramTab = $derived.by(() => {
    const t = urlParam('tab');
    return TAB_IDS.includes(t as TabId) ? (t as TabId) : 'resources';
  });
  const paramModal = $derived(urlParam('modal'));
  const paramJoin = $derived(urlFlag('join'));

  // Production decodes the base64 hash into an ActionHash here and reports a
  // parse error when that fails. The prototype routes on the base64 string, so
  // the only failure mode left is "no such NDO".
  // Production decodes the base64 hash in an $effect and stores it; here the
  // hash IS the route param, so it derives. Keeping it as effect-written state
  // would leave the first paint with a null hash and render nothing.
  const specActionHash = $derived(specHashB64 || null);
  const parseError = $derived(specHashB64 ? null : 'No NDO hash in the URL.');
  let tab = $state<TabId>('resources');
  // Production loads the descriptor asynchronously into $state and shows a
  // spinner while it is in flight. Against mock state the lookup is
  // synchronous, so it derives — which also means a lifecycle transition is
  // reflected here the moment it is written, with no refresh call.
  const ndoDescriptor = $derived<NdoDescriptor | null>(ndoService.getDescriptor(specHashB64));
  // Production writes these two in the async load; nothing in a mock lookup can
  // be slow or fail, so the mock layer serves them from `?state=` instead. Both
  // screens are the app's — see stores.svelte.ts.
  const isLoading = $derived(ndoService.isLoading);
  const loadError = $derived(ndoService.loadError);
  let showForkModal = $state(false);
  let showAssociateModal = $state(false);
  let showTransitionModal = $state(false);
  let showJoinPanel = $state(false);
  let joinMessage = $state<string | null>(null);
  let joinLoading = $state(false);
  let ndoMembers = $state<{ id: string; name: string; role?: string }[]>([]);
  let membersLoading = $state(false);
  let membersStubMessage = $state<string | null>(null);

  // URL → state (deep links and the screen map land here).
  $effect(() => {
    tab = paramTab;
    showForkModal = paramModal === 'fork';
    showAssociateModal = paramModal === 'associate';
    showTransitionModal = paramModal === 'lifecycle';
    showJoinPanel = paramJoin;
  });

  function syncUrl(next: { tab?: TabId; modal?: string | null; join?: boolean }) {
    const url = new URL(page.url);
    const t = next.tab ?? tab;
    if (t === 'resources') url.searchParams.delete('tab');
    else url.searchParams.set('tab', t);
    const modal = next.modal === undefined ? paramModal : next.modal;
    if (modal) url.searchParams.set('modal', modal);
    else url.searchParams.delete('modal');
    const join = next.join ?? showJoinPanel;
    if (join) url.searchParams.set('join', '1');
    else url.searchParams.delete('join');
    // Idempotent: a handler that fires spuriously must not start a
    // write → param → state → write cycle. See url-state.svelte.ts.
    if (url.search === page.url.search) return;
    replaceState(url, {});
  }

  $effect(() => {
    appContext.currentView = 'ndo';
    appContext.selectedNdoId = specHashB64;
  });

  // Kept because the markup binds it to the error banner's Retry button. With a
  // derived descriptor there is nothing to re-fetch.
  function handleRefresh() {}

  function loadNdoMembers() {
    membersLoading = true;
    // Production returns a stub failure here; the screen shows that message
    // verbatim, which is the honest thing for a feature that is not built.
    membersStubMessage =
      'NDO member listing is not yet implemented on the DHT. See documentation/zomes/resource_zome.md § NDO membership (planned).';
    ndoMembers = ndoService.getNdoMembers();
    membersLoading = false;
  }

  function handleJoinNdo() {
    joinLoading = true;
    joinMessage =
      'NDO membership is not yet implemented on the DHT. See documentation/zomes/resource_zome.md § NDO membership (planned).';
    joinLoading = false;
    showJoinPanel = true;
    syncUrl({ join: true });
  }

  $effect(() => {
    if (showJoinPanel && ndoMembers.length === 0 && !membersLoading && !membersStubMessage) {
      loadNdoMembers();
    }
  });

  const tabs = [
    { id: 'resources' as const, label: 'Resources' },
    { id: 'governance' as const, label: 'Governance' },
    { id: 'composition' as const, label: 'Composition' },
    { id: 'activity' as const, label: 'Activity' }
  ];

  const isAuthenticated = $derived(appContext.myAgentPubKey != null);
</script>

{#if parseError}
  <div class="p-6">
    <p class="text-red-600">{parseError}</p>
  </div>
{:else if specActionHash}
  {#if showForkModal && ndoDescriptor}
    <ForkNdoModal
      descriptor={ndoDescriptor}
      onclose={() => {
        syncUrl({ modal: null });
      }}
    />
  {/if}

  {#if showAssociateModal}
    <AssociateNdoModal
      ndoHashB64={specHashB64}
      ndoName={ndoDescriptor?.name ?? 'this NDO'}
      onclose={() => {
        syncUrl({ modal: null });
      }}
    />
  {/if}

  <div class="border-b border-gray-200 bg-white px-6 pt-4">
    <div class="flex items-start justify-between">
      <div>
        {#if isLoading}
          <div class="mb-1 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
        {:else if loadError}
          <h1 class="text-xl font-bold text-red-600">Failed to load NDO</h1>
        {:else}
          <h1 class="text-xl font-bold text-gray-900">{ndoDescriptor?.name ?? 'NDO'}</h1>
        {/if}
        <p class="mt-1 font-mono text-xs text-gray-400">{specHashB64.slice(0, 20)}…</p>
      </div>
      <div class="ml-4 flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled={joinLoading}
          onclick={() => {
            const next = !showJoinPanel;
            syncUrl({ join: next });
            if (next) loadNdoMembers();
          }}
          class="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {joinLoading ? 'Joining…' : 'Join NDO'}
        </button>

        <!-- Associate with group: writes SoftLink on group DHT -->
        <button
          type="button"
          onclick={() => {
            syncUrl({ modal: 'associate' });
          }}
          class="rounded border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          Associate with a group
        </button>

        <!-- Fork: requires live Holochain connection -->
        {#if isAuthenticated}
          <button
            type="button"
            onclick={() => {
              syncUrl({ modal: 'fork' });
            }}
            class="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Fork this NDO
          </button>
        {/if}
      </div>
    </div>
    <nav class="mt-4 flex gap-2" aria-label="NDO sections">
      {#each tabs as t}
        <button
          type="button"
          class="rounded-t border border-b-0 px-3 py-2 text-sm font-medium transition-colors {tab ===
          t.id
            ? 'border-gray-200 bg-gray-50 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-800'}"
          onclick={() => {
            syncUrl({ tab: t.id });
          }}
        >
          {t.label}
        </button>
      {/each}
    </nav>
  </div>

  {#if loadError}
    <div class="mx-6 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {loadError}
      <button type="button" onclick={handleRefresh} class="ml-3 underline hover:text-red-900"
        >Retry</button
      >
    </div>
  {/if}

  <!-- NDO detail card -->
  {#if ndoDescriptor}
    <div class="mx-6 mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {#if ndoDescriptor.description}
          <div class="sm:col-span-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Description</p>
            <p class="mt-1 text-sm text-gray-800">{ndoDescriptor.description}</p>
          </div>
        {/if}
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Property regime</p>
          <p class="mt-1 text-sm font-medium text-gray-800">
            {ndoDescriptor.property_regime ?? '—'}
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Resource nature</p>
          <p class="mt-1 text-sm font-medium text-gray-800">
            {ndoDescriptor.resource_nature ?? '—'}
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Lifecycle stage</p>
          <p class="mt-1 text-sm font-medium text-gray-800">
            {ndoDescriptor.lifecycle_stage ?? '—'}
          </p>
        </div>
        {#if ndoDescriptor.created_at}
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Created</p>
            <p class="mt-1 text-sm text-gray-600">
              {new Date(ndoDescriptor.created_at / 1000).toLocaleString()}
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if showJoinPanel}
    <div class="mx-6 mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h2 class="text-sm font-semibold text-gray-800">NDO membership</h2>
      <p class="mt-1 text-xs text-gray-500">
        Joining an NDO records your participation on the DHT. This is distinct from associating the
        NDO with a group (a curated short list for group members).
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={joinLoading}
          onclick={handleJoinNdo}
          class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {joinLoading ? 'Requesting…' : 'Request to join'}
        </button>
      </div>
      {#if joinMessage}
        <p
          class="mt-2 text-xs {joinMessage.includes('not yet implemented')
            ? 'text-amber-700'
            : 'text-gray-600'}"
        >
          {joinMessage}
        </p>
      {/if}
      <div class="mt-4">
        <MemberList members={ndoMembers} />
        {#if membersLoading}
          <p class="mt-2 text-xs text-gray-400 italic">Loading members…</p>
        {:else if membersStubMessage}
          <p class="mt-2 text-xs text-amber-700">{membersStubMessage}</p>
        {/if}
      </div>
    </div>
  {/if}

  <NdoIdentityLayer
    descriptor={ndoDescriptor}
    onrefresh={handleRefresh}
    transitionOpen={showTransitionModal}
    onTransitionOpenChange={(open) => syncUrl({ modal: open ? 'lifecycle' : null })}
  />

  <div class="p-6">
    {#if tab === 'resources'}
      <ResourcesTab specActionHash={specActionHash!} />
    {:else if tab === 'governance'}
      <GovernanceTab specActionHash={specActionHash!} />
    {:else if tab === 'composition'}
      <CompositionTab />
    {:else}
      <ActivityTab specActionHash={specActionHash!} />
    {/if}
  </div>
{/if}
