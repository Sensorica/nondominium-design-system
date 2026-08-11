<script lang="ts">
  // What the Governance tab actually shows today, and what it does not.
  import { paths } from '$lib/paths';
  import { INITIAL_NDOS, INITIAL_RULES } from '$lib/replica/mock';

  const ndo = INITIAL_NDOS[0];
  const rules = INITIAL_RULES[ndo.hash] ?? [];
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Governance review</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      The Governance tab is two lists: the rules attached to this specification, and the roles the
      viewing agent holds. Both are rendered raw.
    </p>
  </header>

  <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">Governance rules, as rendered</h2>
    <p class="mt-1 text-sm text-gray-600">
      A rule is a type string plus a JSON blob, and the tab prints the blob in a
      <code class="font-mono text-xs">&lt;pre&gt;</code>. That is honest about the data model —
      <code class="font-mono text-xs">rule_data</code> really is an untyped JSON string in the zome —
      and it puts the raw shape in front of whoever has to act on it.
    </p>
    <ul class="mt-3 space-y-2">
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
  </section>

  <section class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">Roles, and the disabled button</h2>
    <p class="mt-1 text-sm text-gray-600">
      Under the role list sits a permanently disabled amber button reading
      <em>AccountableAgent (governance-gated)</em>. It is a placeholder for role promotion, and it is
      the clearest statement in the app of something the protocol specifies and the UI has not built.
    </p>
    <div class="mt-3">
      <ul class="space-y-2">
        <li class="rounded border border-gray-200 bg-white px-3 py-2 text-sm">
          <span class="font-medium text-gray-800">AccountableAgent</span>
        </li>
        <li class="rounded border border-gray-200 bg-white px-3 py-2 text-sm">
          <span class="font-medium text-gray-800">Repair</span>
        </li>
      </ul>
      <button type="button" class="mt-3 rounded bg-amber-100 px-3 py-1.5 text-xs text-amber-800" disabled>
        AccountableAgent (governance-gated)
      </button>
    </div>
  </section>

  <section class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">Where reputation is not</h2>
    <p class="mt-2 text-sm text-gray-600">
      Nothing on this tab is a score, and that is deliberate. Private Participation Receipts are
      private entries on each agent's own source chain: bilaterally signed, non-transferable, and
      invisible to third parties by default. There is no aggregator to render and none to capture.
    </p>
  </section>

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open questions</h2>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
      <li>Rules render as raw JSON. Useful to a developer, opaque to the custodian the rule governs.</li>
      <li>The tab shows <em>my</em> roles rather than who is accountable for this NDO, which is the question the page's title implies.</li>
      <li>The disabled button has no explanation of what would enable it.</li>
    </ul>
  </section>

  <p class="mt-4 text-sm text-gray-500">
    Live: <a class="text-blue-600 hover:underline" href={paths.ndoTab(ndo.hash, 'governance')}>the Governance tab</a>.
  </p>
</div>
