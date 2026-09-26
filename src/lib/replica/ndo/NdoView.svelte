<script lang="ts">
  // Copy of ui/src/lib/components/ndo/NdoView.svelte. Two differences, both
  // allowances, and neither reaches the markup beyond event handlers:
  //   1. tab, modal and join-panel state is mirrored into the query string, so
  //      every one of those states is a deep-linkable, commentable surface.
  //      Production keeps them purely local, which is right for the app and
  //      useless for a review tool.
  //   2. the Effect service calls become lookups against the mock layer, which
  //      serves the slow and failed reads from `?state=` (see stores.svelte.ts).
  //      Hash types alias to base64 strings here, so decodeHashFromBase64 is
  //      identity; it is shimmed so the parse step stays the app's.
  import { page } from '$app/state';
  import { replaceState } from '$app/navigation';
  import type { ActionHash, CellId, NdoDescriptor } from '../types';
  import { urlFlag, urlParam } from '../url-state.svelte';
  import { appContext, ndoService, ndoDescriptorCache } from '../stores.svelte';
  import MemberList from '../group/MemberList.svelte';
  import ResourcesTab from './ResourcesTab.svelte';
  import GovernanceTab from './GovernanceTab.svelte';
  import ActivityTab from './ActivityTab.svelte';
  import CompositionTab from './CompositionTab.svelte';
  import NdoIdentityLayer from './NdoIdentityLayer.svelte';
  import ForkNdoModal from './ForkNdoModal.svelte';
  import AssociateNdoModal from './AssociateNdoModal.svelte';

  const decodeHashFromBase64 = (s: string): string => s;

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

  // The app decodes the hash in an $effect and writes it to $state. Here the
  // same decode derives, because an effect does not run while this route is
  // prerendered and the first paint would carry a null hash and render nothing.
  // decodeURIComponent is the step that can throw, as in the app.
  const parsed = $derived.by((): { hash: ActionHash | null; error: string | null } => {
    try {
      return {
        hash: decodeHashFromBase64(decodeURIComponent(specHashB64)) as ActionHash,
        error: null
      };
    } catch {
      return { hash: null, error: 'Could not decode resource specification hash from the URL.' };
    }
  });
  const specActionHash = $derived(parsed.hash);
  const parseError = $derived(parsed.error);
  let tab = $state<TabId>('resources');
  let ndoDescriptor = $state<NdoDescriptor | null>(null);
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);
  let showForkModal = $state(false);
  let showAssociateModal = $state(false);
  let showTransitionModal = $state(false);
  let showJoinPanel = $state(false);
  let joinMessage = $state<string | null>(null);
  let joinError = $state<string | null>(null);
  let joinLoading = $state(false);
  let ndoMembers = $state<{ id: string; name: string; role?: string }[]>([]);
  let membersLoading = $state(false);
  let membersError = $state<string | null>(null);
  /**
   * The app resolves the cloned `ndo` cell holding this NDO's Layer 0 identity
   * through NdoService.resolveCellIdForNdo and addresses every Layer 1 and
   * Layer 2 call to it. The mock layer has one store and no cells, so this is
   * always the value the app uses for a legacy NDO in the shared cell: null.
   */
  const ndoCellId: CellId | null = null;

  // Each of the four creation modals lives inside a tab, so a key that names the
  // modal has to select its tab too. Without this, ?modal=rule-edit resolves to
  // the Resources tab with nothing open, and the screen map would count the
  // surface as covered while showing the wrong one.
  const MODAL_TAB: Record<string, TabId> = {
    'spec-create': 'resources',
    'rule-edit': 'governance',
    commitment: 'activity',
    event: 'activity'
  };

  // URL to state (deep links and the screen map land here).
  $effect(() => {
    tab = (paramModal && MODAL_TAB[paramModal]) || paramTab;
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
    // write, param, state, write cycle. See url-state.svelte.ts.
    if (url.search === page.url.search) return;
    replaceState(url, {});
  }

  $effect(() => {
    if (specActionHash) {
      appContext.currentView = 'ndo';
      appContext.selectedNdoId = specActionHash;
    } else if (parseError) {
      appContext.selectedNdoId = null;
    }
    // Seed immediately from the in-memory cache (populated by NdoCard click).
    const cached = ndoDescriptorCache.get(specHashB64);
    if (cached) ndoDescriptor = cached;
  });

  async function loadDescriptor(hash: ActionHash) {
    // Only show spinner if we don't already have cached data to display.
    if (!ndoDescriptor) isLoading = true;
    loadError = null;
    // `?state=loading`: the conductor has not answered, and nothing resolves.
    if (ndoService.isLoading) return;
    // null is the failed read: `?state=error`, or no such record.
    const descriptor = ndoService.getDescriptor(hash);
    isLoading = false;
    if (descriptor) {
      ndoDescriptor = descriptor;
      // Keep cache up to date with the latest on-chain version.
      ndoDescriptorCache.set(specHashB64, descriptor);
    } else if (!ndoDescriptor) {
      // Only show the error banner if we have nothing else to display.
      loadError = 'Could not refresh NDO details from the chain. Data shown may be cached.';
    }
  }

  $effect(() => {
    if (!specActionHash) return;
    const hash = specActionHash;
    void loadDescriptor(hash);
  });

  function handleRefresh() {
    if (specActionHash) void loadDescriptor(specActionHash);
  }

  async function loadNdoMembers() {
    membersLoading = true;
    membersError = null;
    const members = ndoService.getNdoMembers(specHashB64);
    membersLoading = false;
    if (ndoService.loadError) {
      membersError = 'Could not load members. They may not have reached this node yet.';
      ndoMembers = [];
    } else {
      ndoMembers = members.map((m) => ({ ...m, role: 'Member' }));
    }
  }

  async function handleJoinNdo() {
    joinLoading = true;
    joinMessage = null;
    joinError = null;
    const ok = await ndoService.joinNdo(specHashB64);
    joinLoading = false;
    if (!ok) {
      joinError = 'Could not join this NDO. Please try again.';
    } else {
      joinMessage = 'You have joined this NDO.';
      void loadNdoMembers();
    }
    showJoinPanel = true;
    syncUrl({ join: true });
  }

  $effect(() => {
    if (showJoinPanel && ndoMembers.length === 0 && !membersLoading && !membersError) {
      void loadNdoMembers();
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
            if (next) void loadNdoMembers();
          }}
          class="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {joinLoading ? 'Joining…' : 'Join NDO'}
        </button>

        <!-- Associate with group: writes an NdoAnchor (clone coordinates) on the target group DHT -->
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
          <p data-testid="ndo-lifecycle-stage" class="mt-1 text-sm font-medium text-gray-800">
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
          {joinLoading ? 'Joining…' : 'Join this NDO'}
        </button>
      </div>
      {#if joinMessage}
        <p class="mt-2 text-xs text-gray-600">{joinMessage}</p>
      {/if}
      {#if joinError}
        <p class="mt-2 text-xs text-amber-700">{joinError}</p>
      {/if}
      <div class="mt-4">
        <MemberList members={ndoMembers} />
        {#if membersLoading}
          <p class="mt-2 text-xs text-gray-400 italic">Loading members…</p>
        {:else if membersError}
          <p class="mt-2 text-xs text-amber-700">{membersError}</p>
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
      <ResourcesTab
        {specActionHash}
        {ndoCellId}
        lifecycleStage={ndoDescriptor?.lifecycle_stage ?? null}
        propertyRegime={ndoDescriptor?.property_regime ?? null}
      />
    {:else if tab === 'governance'}
      <GovernanceTab
        {specActionHash}
        {ndoCellId}
        propertyRegime={ndoDescriptor?.property_regime ?? null}
        resourceNature={ndoDescriptor?.resource_nature ?? null}
        rivalryOverride={ndoDescriptor?.rivalry_override ?? null}
      />
    {:else if tab === 'composition'}
      <CompositionTab />
    {:else}
      <ActivityTab
        {specActionHash}
        {ndoCellId}
        propertyRegime={ndoDescriptor?.property_regime ?? null}
        resourceNature={ndoDescriptor?.resource_nature ?? null}
        rivalryOverride={ndoDescriptor?.rivalry_override ?? null}
      />
    {/if}
  </div>
{/if}
