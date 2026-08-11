<script lang="ts">
  // Layer 1 governance: the benefit redistribution agreement and who is
  // accountable for it. Clauses are shown as a bar because the thing a reader
  // wants to know first is proportion, not percentage arithmetic.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentLabel, agreementFor, ndoById } from '$lib/state.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import { REGIME_VOCAB } from '$lib/ndo-ui';

  const id = $derived(page.params.id ?? '');
  const ndo = $derived(ndoById(id));
  const agreement = $derived(agreementFor(id));
</script>

{#if ndo}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Property regime</h2></div>
    <div class="ndo-panel__body">
      <p class="ndo-p">
        {REGIME_VOCAB[ndo.property_regime].icon} <strong>{ndo.property_regime}</strong> — {REGIME_VOCAB[ndo.property_regime].hint}
      </p>
      {#if ndo.property_regime === 'Nondominium'}
        <p class="ndo-small mt-2">
          Under this regime no governance rule may assign or transfer ownership. Custody moves; title
          does not exist to move. That constraint is enforced at the protocol level, not by
          agreement between the parties.
        </p>
      {/if}
    </div>
  </section>
{/if}

{#if !agreement}
  <EmptyState icon="⚖️" title="No agreement yet" body="Benefit redistribution is defined when there is benefit to redistribute." />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">Benefit redistribution</h2>
      <span class="ndo-field__hint">version {agreement.version}</span>
    </div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <div class="bar" aria-hidden="true">
        {#each agreement.clauses as clause, i (clause.id)}
          <span class="seg" style="width:{clause.share * 100}%;background:rgb(var(--ndo-primary-{300 + i * 200}))"></span>
        {/each}
      </div>
      <ul class="list">
        {#each agreement.clauses as clause (clause.id)}
          <li>
            <span>
              <strong class="ndo-small">{clause.label}</strong>
              <span class="ndo-field__hint block">{clause.beneficiary}</span>
            </span>
            <span class="share">{Math.round(clause.share * 100)}%</span>
          </li>
        {/each}
      </ul>
      <div>
        <p class="ndo-label mb-2">Primary accountable</p>
        <p class="ndo-small">
          {#each agreement.primary_accountable as agent, i (agent)}
            <a href={paths.agentProfile(agent)}>{agentLabel(agent)}</a>{i < agreement.primary_accountable.length - 1 ? ', ' : ''}
          {/each}
        </p>
      </div>
    </div>
  </section>
{/if}

<style>
  .bar { display: flex; height: 12px; border-radius: var(--ndo-radius-pill); overflow: hidden; }
  .seg { display: block; height: 100%; }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .share { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); }
  .block { display: block; }
  a { color: var(--ndo-color-link); }
</style>
