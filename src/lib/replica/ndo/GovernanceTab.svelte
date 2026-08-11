<script lang="ts">
  // Copy of ui/src/lib/components/ndo/GovernanceTab.svelte.
  import { onMount } from 'svelte';
  import type { GovernanceRule, PersonRole } from '../types';
  import { appContext, personService, resourceService } from '../stores.svelte';

  interface Props {
    specActionHash: string;
  }

  let { specActionHash }: Props = $props();

  let rules = $state<GovernanceRule[]>([]);
  let roles = $state<PersonRole[]>([]);
  let myAgent = $state<string | null>(null);

  onMount(() => {
    rules = resourceService.getGovernanceRules(specActionHash);
    myAgent = appContext.myAgentPubKey;
    roles = myAgent ? personService.getPersonRoles() : [];
  });
</script>

<div class="space-y-6">
  <section>
    <h3 class="mb-2 text-base font-semibold text-gray-900">Governance rules (resource zome)</h3>
    {#if rules.length === 0}
      <p class="text-sm text-gray-500">No governance rules linked to this specification.</p>
    {:else}
      <ul class="space-y-2">
        {#each rules as rule, i (i)}
          <li class="rounded border border-gray-200 bg-white p-3 text-sm">
            <div class="font-medium text-gray-800">{rule.rule_type}</div>
            <pre class="mt-1 overflow-x-auto text-xs text-gray-600">{rule.rule_data}</pre>
            {#if rule.enforced_by}
              <div class="mt-1 text-xs text-gray-500">Enforced by: {rule.enforced_by}</div>
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
