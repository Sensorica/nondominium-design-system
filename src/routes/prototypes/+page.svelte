<script lang="ts">
  // The index of the six v0.1 UI directions, inside the design-system chrome.
  // Everything here reads src/lib/prototypes/directions.ts: choosing a
  // direction is flipping its `status` there, and this page regroups itself.
  import { paths } from '$lib/paths';
  import { DIRECTION_LIST, type Direction, type DirectionSlug } from '$lib/prototypes/directions';

  const slug = (d: Direction) => d.slug as DirectionSlug;
  const byStatus = (s: Direction['status']) => DIRECTION_LIST.filter((d) => d.status === s);

  const target = byStatus('target');
  const candidates = byStatus('candidate');
  const archived = byStatus('archived');
  const chosen = target[0];
</script>

<svelte:head>
  <title>Prototype directions · Nondominium Design System</title>
</svelte:head>

{#snippet card(d: Direction)}
  <article class="ndo-card dcard" class:dcard--target={d.status === 'target'} class:dcard--archived={d.status === 'archived'}>
    <header class="dcard__head">
      <span class="dcard__id">{d.id}</span>
      <h3 class="ndo-h3">{d.name}</h3>
      <span class="fidelity" class:fidelity--high={d.fidelity === 'high'}>{d.fidelity} fidelity</span>
    </header>
    <p class="dcard__pitch">{d.pitch}</p>
    <p class="ndo-small">{d.tries}</p>
    <p class="ndo-small dcard__type">{d.typeNote}</p>
    <p class="ndo-small dcard__views">
      Views: {d.views.map((v) => v.label).join(' · ')}{d.store === 'own' ? ' · runs on its own mock backend' : ''}
    </p>
    <div class="dcard__actions">
      <a class="ndo-btn ndo-btn--primary ndo-btn--sm" href={paths.protoDirection(slug(d))}>Open</a>
      <a class="ndo-btn ndo-btn--ghost ndo-btn--sm" href={paths.protoFresh(slug(d))}>Start as a new person</a>
    </div>
  </article>
{/snippet}

<div class="ndo-shell__content">
  <header class="hero">
    <h1 class="ndo-h1">Prototype directions</h1>
    <p class="ndo-p mt-3" style="max-width:68ch">
      Six working UI directions for the Nondominium v0.1 release, from the prototype handoff. Each one covers the whole
      journey: create a profile, create or join a group, declare a shared resource, then manage it (stages, rules, items and
      who holds them, requests, approvals, private receipts, offline). One of them gets chosen and implemented against the
      real hApp; the rest are archived here for reference.
    </p>
    <p class="ndo-small mt-2" style="max-width:68ch">
      A to E run on one shared mock store, so what you do in one shows up in the others: pick up a suggestion in D Signal
      Board, then find its trace in A Mycelium. F runs on its own mock of the real zome calls. A to E share one menu
      (Ctrl+K) with "Start over as a new person", "Reload the example" and "Developer details". F has no such menu: its
      header carries a scenario picker (with "Start from nothing" for a new person), a Reset button and its own
      Developer details switch.
    </p>
    <p class="ndo-small mt-2" style="max-width:68ch">
      One trade-off to keep in mind when comparing: the handoff gave each direction its own typefaces (a serif notebook for
      B, a different sans and mono for each of A, C, D and E). The ports use design-system tokens only, so all six are set
      in the design-system sans and mono. Judge layout, flow and interaction; the lettering is not the handoff's. Each card
      below names what it lost.
    </p>
  </header>

  <section class="block">
    <h2 class="ndo-h2">Target</h2>
    {#if target.length}
      {#if target.length > 1}
        <p class="ndo-small warn">More than one direction is marked 'target' in directions.ts. Only one should be.</p>
      {/if}
      <div class="cards">
        {#each target as d (d.slug)}{@render card(d)}{/each}
      </div>
    {:else}
      <p class="ndo-small empty">No target chosen yet.</p>
    {/if}
  </section>

  {#if candidates.length}
    <section class="block">
      <h2 class="ndo-h2">Candidates</h2>
      <div class="cards">
        {#each candidates as d (d.slug)}{@render card(d)}{/each}
      </div>
    </section>
  {/if}

  {#if archived.length}
    <section class="block">
      <h2 class="ndo-h2">Archived</h2>
      <div class="cards">
        {#each archived as d (d.slug)}{@render card(d)}{/each}
      </div>
    </section>
  {/if}

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">Current app versus target</h2>
    </div>
    <div class="ndo-panel__body">
      {#if chosen}
        <p class="ndo-small mb-3">
          On the left, the current app: a replica of the app exactly as it is today. On the right, {chosen.id}
          {chosen.name}, the direction it is moving to.
        </p>
        <div class="compare">
          <figure>
            <figcaption class="ndo-label">Current app · the replica at /app</figcaption>
            <iframe src={paths.appHome()} title="The app as it is (replica)" loading="lazy"></iframe>
            <a class="ndo-small" href={paths.appHome()}>Open the current app</a>
          </figure>
          <figure>
            <figcaption class="ndo-label">Target · {chosen.id} {chosen.name}</figcaption>
            <iframe src={paths.protoDirection(slug(chosen))} title="{chosen.name}, the chosen target" loading="lazy"></iframe>
            <a class="ndo-small" href={paths.protoDirection(slug(chosen))}>Open {chosen.name}</a>
          </figure>
        </div>
      {:else}
        <p class="ndo-small">
          This fills in once a direction is chosen: the current app (<a href={paths.appHome()}>the app as it is</a>) side by side
          with the target direction, so the gap between the two is visible in one place.
        </p>
      {/if}
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">How to choose</h2>
    </div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        Open the direction you want and leave a comment on it: press <kbd>c</kbd>. Each direction and each of its views has
        its own thread. Once the choice is made, the <code>status</code> field of that direction in
        <code>src/lib/prototypes/directions.ts</code> is flipped to <code>'target'</code>, and the others to
        <code>'archived'</code>. That one field is the whole procedure: this page, the rail and the banners on each direction
        follow it.
      </p>
      <p class="ndo-small">
        The handoff's original standalone builds are not committed: they are about 10 MB of bundled React. The handoff asked
        for A to E to be restyled onto the design system rather than copied, so these ports use the design-system tokens and
        keep each direction's layout, flow and interaction; F was already built on the design system and is ported close to
        its original. The handoff notes, the backend map and the seven user stories are in
        <a href={paths.protoHandoffDocs()}>docs/prototypes/</a>.
      </p>
    </div>
  </section>
</div>

<style>
  .hero {
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-2);
  }
  .block {
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-3);
  }
  .cards {
    display: grid;
    gap: var(--ndo-spacing-4);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  .dcard {
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-2);
  }
  .dcard--target {
    border-color: rgb(var(--ndo-blue-600));
    box-shadow: 0 0 0 1px rgb(var(--ndo-blue-600));
  }
  .dcard--archived {
    opacity: 0.75;
  }
  .dcard__head {
    display: flex;
    align-items: center;
    gap: var(--ndo-spacing-2);
  }
  .dcard__id {
    display: inline-grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--ndo-radius-md);
    background: rgb(var(--ndo-brand-ink));
    color: rgb(255 255 255);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-bold);
  }
  .fidelity {
    margin-left: auto;
    padding: 1px 8px;
    border-radius: var(--ndo-radius-pill);
    border: 1px dashed rgb(var(--ndo-gray-400));
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-600));
    white-space: nowrap;
  }
  .fidelity--high {
    border-style: solid;
    border-color: rgb(var(--ndo-blue-600));
    color: rgb(var(--ndo-blue-700));
  }
  .dcard__pitch {
    margin: 0;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    color: var(--ndo-color-text-primary);
  }
  .dcard__views,
  .dcard__type {
    color: var(--ndo-color-text-muted);
  }
  .dcard__type {
    font-style: italic;
  }
  .dcard__actions {
    margin-top: auto;
    display: flex;
    gap: var(--ndo-spacing-2);
    flex-wrap: wrap;
  }
  .empty {
    padding: var(--ndo-spacing-4);
    border: 1px dashed var(--ndo-color-border-strong);
    border-radius: var(--ndo-radius-lg);
  }
  .warn {
    color: rgb(var(--ndo-red-700));
  }
  .compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ndo-spacing-4);
  }
  figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-2);
  }
  iframe {
    width: 100%;
    height: 520px;
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-color-card-bg));
  }
  @media (max-width: 960px) {
    .compare {
      grid-template-columns: 1fr;
    }
  }
  kbd {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    background: var(--ndo-color-surface);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-sm);
    padding: 0 4px;
  }
  code {
    font-family: var(--ndo-font-mono);
    font-size: 0.92em;
  }
  .ndo-panel__body a:not(.ndo-btn) {
    color: var(--ndo-color-link);
  }
</style>
