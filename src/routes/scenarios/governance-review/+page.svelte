<script lang="ts">
  // What the Governance tab actually shows today, and what it does not.
  import { paths } from '$lib/paths';
  import { INITIAL_NDOS, INITIAL_RULES, INITIAL_RULE_VIOLATIONS } from '$lib/replica/mock';
  import type { RuleData } from '$lib/replica/types';

  const ndo = INITIAL_NDOS[0];
  const rules = INITIAL_RULES[ndo.hash] ?? [];

  /** The single key of a `RuleData` tagged union is its discriminant. */
  const kindOf = (d: RuleData) => Object.keys(d)[0];
  const payloadOf = (d: RuleData) => Object.values(d)[0] as Record<string, unknown>;
  const violationsFor = (i: number) => INITIAL_RULE_VIOLATIONS[`${ndo.hash}#${i}`] ?? [];
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
      A rule used to be a free type string plus a JSON blob, and this page used to say so. PR #132
      replaced that with a tagged <code class="font-mono text-xs">RuleData</code> union of exactly
      four discriminants, and each one now carries its own fields rather than a payload nobody could
      validate. The tab still prints the payload raw, which is the design question to answer here:
      an <code class="font-mono text-xs">AccessRequirement</code> and a
      <code class="font-mono text-xs">MaintenanceSchedule</code> are different kinds of thing and
      they should not look alike.
    </p>
    <ul class="mt-3 space-y-2">
      {#each rules as rule, i (i)}
        <li class="rounded border border-gray-200 bg-white p-3 text-sm">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {kindOf(rule.rule_data)}
            </span>
            <span class="text-xs text-gray-400">
              {rule.property_regime} · {rule.resource_nature}{rule.rivalry_override
                ? ` · ${rule.rivalry_override}`
                : ''}
            </span>
          </div>
          <dl class="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
            {#each Object.entries(payloadOf(rule.rule_data)) as [key, value] (key)}
              <div class="flex gap-2">
                <dt class="text-gray-500">{key}</dt>
                <dd class="font-mono text-gray-800">{String(value)}</dd>
              </div>
            {/each}
          </dl>
          {#if rule.enforced_by}
            <div class="mt-1 text-xs text-gray-500">Enforced by: {rule.enforced_by}</div>
          {/if}
          {#each violationsFor(i) as v (v.rule_id)}
            <p class="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
              <span class="font-semibold">{v.severity} · {v.rule_id}</span>
              {v.message}
            </p>
          {/each}
        </li>
      {/each}
    </ul>
    <p class="mt-3 text-sm text-gray-600">
      The third rule is incoherent on purpose. A
      <code class="font-mono text-xs">TransferCondition</code> of type
      <code class="font-mono text-xs">Ownership</code> is attached to a
      <code class="font-mono text-xs">Nondominium</code> resource, and the regime permits no
      alienation, so there is no ownership to transfer. A seed with only valid rules can never render
      the screen where a rule gets refused, and refusal is the half of the constraint story worth
      designing.
    </p>
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
