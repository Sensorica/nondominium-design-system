<script lang="ts">
  // Scenario: governance on a mature NDO. The claim worth arguing with is that
  // reputation stays private while the events that would justify it stay public.
  import { paths } from '$lib/paths';
  import { INITIAL_AGENTS, INITIAL_AGREEMENTS, INITIAL_CONTRIBUTIONS, INITIAL_NDOS } from '$lib/mock';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';

  const ndo = INITIAL_NDOS[0];
  const agreement = INITIAL_AGREEMENTS.find((a) => a.ndoId === ndo.id)!;
  const contributions = INITIAL_CONTRIBUTIONS.filter((c) => c.ndoId === ndo.id);
  const label = (id: string) => INITIAL_AGENTS.find((a) => a.id === id)?.person?.name ?? id;
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">⚖️ Governance review</h1>
    <p class="ndo-p mt-2" style="max-width:64ch">
      What governance looks like on an object that people actually use: work recorded, work
      countersigned, and benefit split by a versioned agreement.
    </p>
  </header>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">{ndo.name}</h2>
      <span class="flex gap-1.5">
        <NdoBadge stage={ndo.lifecycle_stage} />
        <NdoBadge regime={ndo.property_regime} />
      </span>
    </div>
    <div class="ndo-panel__body">
      <p class="ndo-small">
        Under the Nondominium regime no rule may assign or transfer ownership. Custody moves between
        agents; title does not exist to move. That is a protocol constraint, not a clause the parties
        agreed to and could later agree away.
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Contributions and who countersigned them</h2></div>
    <div class="ndo-panel__body">
      <ul class="list">
        {#each contributions as c (c.id)}
          <li>
            <div>
              <strong class="ndo-small">{label(c.provider)}</strong>
              <span class="ndo-badge ndo-badge--neutral ml-2">{c.action}</span>
              {#if c.note}<p class="ndo-field__hint mt-1">{c.note}</p>{/if}
            </div>
            <span class="ndo-field__hint">
              {c.effort_hours ? `${c.effort_hours}h · ` : ''}validated by {c.validated_by.map(label).join(', ')}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">Benefit redistribution</h2>
      <span class="ndo-field__hint">version {agreement.version}</span>
    </div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <div class="bar" aria-hidden="true">
        {#each agreement.clauses as clause, i (clause.id)}
          <span style="width:{clause.share * 100}%;background:rgb(var(--ndo-primary-{300 + i * 200}))"></span>
        {/each}
      </div>
      <ul class="list">
        {#each agreement.clauses as clause (clause.id)}
          <li>
            <div><strong class="ndo-small">{clause.label}</strong><p class="ndo-field__hint">{clause.beneficiary}</p></div>
            <span class="share">{Math.round(clause.share * 100)}%</span>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Where reputation is not</h2></div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        Nothing above is a score. Private Participation Receipts are private entries on each agent's
        own source chain: bilaterally signed, non-transferable, and invisible to third parties by
        default. There is no aggregator to consult and none to capture.
      </p>
      <p class="ndo-small">
        What a reader gets instead is the evidence: events happened, and named accountable agents
        countersigned them. An agent may derive a summary from their own receipts and share it — that
        is their disclosure to make, not the network's to publish.
      </p>
    </div>
  </section>

  <p class="ndo-small">Live version: <a href={paths.ndoGovernance('ndo1')}>the governance tab</a>.</p>
</div>

<style>
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .list li { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--ndo-spacing-4); flex-wrap: wrap; }
  .bar { display: flex; height: 12px; border-radius: var(--ndo-radius-pill); overflow: hidden; }
  .bar span { display: block; height: 100%; }
  .share { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); }
  a { color: var(--ndo-color-link); }
</style>
