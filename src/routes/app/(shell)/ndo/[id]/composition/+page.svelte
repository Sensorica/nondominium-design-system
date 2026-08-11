<script lang="ts">
  // Typed cross-NDO relations. These are hard links in the governance zome, each
  // backed by an EconomicEvent — not soft associations like a group's SoftLinks.
  // Three types carry the whole composability story: what this is made of, what
  // it came from, and what it replaced.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { linksFor, ndoById } from '$lib/state.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';

  const id = $derived(page.params.id ?? '');
  const links = $derived(linksFor(id));

  const MEANING: Record<string, string> = {
    Component: 'is a component of',
    DerivedFrom: 'is derived from',
    Supersedes: 'supersedes',
  };
</script>

{#if links.length === 0}
  <EmptyState icon="🧩" title="No hard links" body="This NDO neither composes nor derives from another." />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">{links.length} relations</h2></div>
    <div class="ndo-panel__body">
      <ul class="list">
        {#each links as link (link.id)}
          {@const outgoing = link.from === id}
          {@const other = ndoById(outgoing ? link.to : link.from)}
          <li>
            <p class="ndo-small">
              {#if outgoing}
                <strong>This NDO</strong> {MEANING[link.link_type]}
                <a href={other ? paths.ndoDetail(other.id) : '#'}>{other?.name ?? 'an NDO on another DHT'}</a>
              {:else}
                <a href={other ? paths.ndoDetail(other.id) : '#'}>{other?.name ?? 'An NDO on another DHT'}</a>
                {MEANING[link.link_type]} <strong>this NDO</strong>
              {/if}
            </p>
            <div class="mt-1 flex items-center gap-2 flex-wrap">
              <NdoBadge variant="neutral" label={link.link_type} icon={false} />
              {#if other}<NdoBadge stage={other.lifecycle_stage} />{/if}
            </div>
            {#if link.note}<p class="ndo-field__hint mt-1">{link.note}</p>{/if}
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

<style>
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-4); }
  .list li { padding-bottom: var(--ndo-spacing-4); border-bottom: 1px solid var(--ndo-color-border-subtle); }
  .list li:last-child { border-bottom: none; padding-bottom: 0; }
  a { color: var(--ndo-color-link); }
</style>
