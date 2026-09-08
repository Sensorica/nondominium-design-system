<script lang="ts">
  // Copy of ui/src/lib/components/ndo/GovernanceTab.svelte.
  import { onMount } from 'svelte';
  import type {
    CellId,
    GovernanceRule,
    PersonRole,
    PropertyRegime,
    ResourceNature,
    Rivalry,
    RuleData
  } from '../types';
  import { appContext, personService, resourceService, resourceStore } from '../stores.svelte';
  import { urlParam } from '../url-state.svelte';
  import RuleEditorModal from './RuleEditorModal.svelte';

  interface Props {
    /** NDO Layer 0 action hash. */
    specActionHash: string;
    /** The NDO's own clone cell; null for legacy NDOs in the shared cell. */
    ndoCellId?: CellId | null;
    propertyRegime?: string | null;
    resourceNature?: string | null;
    rivalryOverride?: string | null;
  }

  let {
    specActionHash,
    ndoCellId = null,
    propertyRegime = null,
    resourceNature = null,
    rivalryOverride = null
  }: Props = $props();

  type RuleWithSpec = { rule: GovernanceRule; specName: string; specHash: string };

  // Both helpers are the app's, copied unchanged from
  // ui/src/lib/components/ndo/GovernanceTab.svelte at 20adb11. RuleData is a
  // tagged union whose discriminant is its single key, so the label is that key
  // and the payload is the value under it. The replica previously rendered
  // `rule.rule_type` beside a JSON blob; #132 replaced both with this shape.
  function ruleTypeLabel(ruleData: RuleData): string {
    return Object.keys(ruleData)[0] ?? 'Unknown';
  }

  function rulePayload(ruleData: RuleData): Record<string, unknown> {
    const key = Object.keys(ruleData)[0];
    if (!key) return {};
    const payload = (ruleData as unknown as Record<string, unknown>)[key];
    if (payload && typeof payload === 'object') {
      return payload as Record<string, unknown>;
    }
    return {};
  }

  let rules = $state<RuleWithSpec[]>([]);
  let roles = $state<PersonRole[]>([]);
  let myAgent = $state<string | null>(null);
  let loadMessage = $state<string | null>(null);
  let showRuleEditor = $state(false);
  let editorSpecHash = $state<string | undefined>(undefined);

  // The app calls resourceStore.fetchSpecificationsForNdo, then asks the
  // resource service for each listing's rules and pairs them with the spec name.
  // Both halves are available here already: ResourceSpecification carries
  // ndo_identity_hash, so the filter IS the fetch, and no new store method is
  // needed. Same shape, one less seam.
  function specsForNdo() {
    return resourceStore.resourceSpecificationListings.filter(
      (l) => l.specification.ndo_identity_hash === specActionHash
    );
  }

  function loadRules() {
    const listings = specsForNdo();
    if (listings.length === 0) {
      rules = [];
      loadMessage =
        'No Layer 1 specifications yet - create one on the Resources tab before adding rules.';
      return;
    }
    const collected: RuleWithSpec[] = [];
    for (const listing of listings) {
      for (const rule of resourceService.getGovernanceRules(listing.action_hash)) {
        collected.push({
          rule,
          specName: listing.specification.name,
          specHash: listing.action_hash
        });
      }
    }
    rules = collected;
    loadMessage =
      collected.length === 0 ? 'No governance rules linked to this NDO\u2019s specifications.' : null;
  }

  // The screen map addresses this modal by key, so it must open from the URL as
  // well as from the button. Without this the key resolves to a page that
  // renders the tab with the modal shut, and the screen would be listed as
  // covered while showing nothing.
  $effect(() => {
    if (urlParam('modal') === 'rule-edit') showRuleEditor = true;
  });

  onMount(() => {
    loadRules();
    myAgent = appContext.myAgentPubKey;
    roles = myAgent ? personService.getPersonRoles() : [];
  });

  // A rule is written against a classification pair, so both must be known
  // before the editor can build one. The app gates on exactly this.
  const canCreateRule = $derived(propertyRegime != null && resourceNature != null);
</script>

{#if showRuleEditor && canCreateRule}
  <RuleEditorModal
    ndoIdentityHash={specActionHash}
    {ndoCellId}
    propertyRegime={propertyRegime as PropertyRegime}
    resourceNature={resourceNature as ResourceNature}
    rivalryOverride={(rivalryOverride as Rivalry | null) ?? undefined}
    specActionHash={editorSpecHash}
    onclose={() => {
      showRuleEditor = false;
      editorSpecHash = undefined;
    }}
    oncreated={() => {
      loadRules();
    }}
  />
{/if}

<div class="space-y-6">
  <section>
    <div class="mb-2 flex items-center justify-between gap-3">
      <h3 class="text-base font-semibold text-gray-900">Governance rules</h3>
      <button
        type="button"
        disabled={!canCreateRule}
        onclick={() => {
          const listings = specsForNdo();
          // A rule with no specification_hash is written but never linked, so no
          // read path can surface it again. Refuse rather than orphan it.
          if (listings.length === 0) {
            loadMessage =
              'No Layer 1 specifications yet - create one on the Resources tab before adding rules.';
            return;
          }
          editorSpecHash = listings[0]?.action_hash;
          showRuleEditor = true;
        }}
        class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        + New rule
      </button>
    </div>

    {#if loadMessage && rules.length === 0}
      <p class="text-sm text-gray-500">{loadMessage}</p>
    {:else if rules.length === 0}
      <p class="text-sm text-gray-500">No governance rules linked to this NDO’s specifications.</p>
    {:else}
      <ul class="space-y-2">
        {#each rules as item, i (i)}
          {@const kind = ruleTypeLabel(item.rule.rule_data)}
          {@const payload = rulePayload(item.rule.rule_data)}
          <li class="rounded border border-gray-200 bg-white p-3 text-sm">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="font-medium text-gray-800">{kind}</div>
              <div class="text-xs text-gray-500">spec: {item.specName}</div>
            </div>
            <dl class="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-600 sm:grid-cols-2">
              {#each Object.entries(payload) as [k, v] (k)}
                <div>
                  <span class="font-medium text-gray-700">{k}:</span>
                  {v === undefined || v === null || v === '' ? '—' : String(v)}
                </div>
              {/each}
            </dl>
            {#if item.rule.enforced_by}
              <div class="mt-1 text-xs text-gray-500">Enforced by: {item.rule.enforced_by}</div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section>
    <h3 class="mb-2 text-base font-semibold text-gray-900">My roles (person zome)</h3>
    {#if !myAgent}
      <p class="text-sm text-gray-500">No person profile loaded for this agent.</p>
    {:else if roles.length === 0}
      <p class="text-sm text-gray-500">No roles returned for your agent.</p>
    {:else}
      <ul class="space-y-2">
        {#each roles as role, i (i)}
          <li class="rounded border border-gray-200 bg-white px-3 py-2 text-sm">
            <span class="font-medium text-gray-800">{role.role_name}</span>
          </li>
        {/each}
      </ul>
      <button type="button" class="mt-3 rounded bg-amber-100 px-3 py-1.5 text-xs text-amber-800" disabled>
        AccountableAgent (governance-gated)
      </button>
    {/if}
  </section>
</div>
