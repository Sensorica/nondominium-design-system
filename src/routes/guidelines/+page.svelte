<!--
  The Claude Design cards, replicated on this repo's own tokens and its own
  ndo-* custom elements (ISA Phase 9, claim 44). One card per file under
  docs/prototypes/original/ds/guidelines/*.html and
  docs/prototypes/original/ds/components/{badge,button,card,status}/*.card.html,
  grouped exactly as Claude Design groups them (Brand, Colors, Type, Spacing,
  Components), each shown at its own declared viewport size via an iframe onto
  its isolated frame route (paths.guidelineCard). Every card also has its own
  frame URL for pixel comparison — see scripts/compare/pairs/ds.ts.
-->
<script lang="ts">
  import { paths } from '$lib/paths';
  import { GUIDELINE_GROUPS, cardsInGroup } from '$lib/guidelines/registry';
</script>

<svelte:head><title>Guidelines — Claude Design cards</title></svelte:head>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">Claude Design cards</h1>
    <p class="ndo-p mt-2">
      Every card from the Claude Design project "Nondominium Design System", rendered here on this
      repo's own <code>static/tokens.css</code> and its own <code>ndo-*</code> custom elements
      (<code>registry/</code>) rather than on the original's React bundle. Grouped and sized exactly
      as Claude Design groups and sizes them. Each card's name links to its isolated frame — the same
      URL <code>scripts/compare/pairs/ds.ts</code> screenshots against the original.
    </p>
  </header>

  {#each GUIDELINE_GROUPS as group (group)}
    <section class="ndo-panel">
      <div class="ndo-panel__head"><h2 class="ndo-h3">{group}</h2></div>
      <div class="ndo-panel__body cards">
        {#each cardsInGroup(group) as card (card.id)}
          <div class="card">
            <a class="card__title" href={paths.guidelineCard(card.id)}>{card.name}</a>
            <p class="card__subtitle">{card.subtitle}</p>
            <div
              class="card__frame"
              style="width:{card.viewport.width}px;height:{card.viewport.height}px"
            >
              <iframe
                title={card.name}
                src={paths.guidelineCard(card.id)}
                width={card.viewport.width}
                height={card.viewport.height}
              ></iframe>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .cards { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-6); align-items: flex-start; }
  .card { display: flex; flex-direction: column; gap: var(--ndo-spacing-1); }
  .card__title {
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-semibold);
    color: rgb(var(--ndo-gray-900));
    text-decoration: none;
  }
  .card__title:hover { color: rgb(var(--ndo-blue-600)); }
  .card__subtitle { margin: 0; font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-500)); }
  .card__frame {
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    overflow: hidden;
    box-shadow: var(--ndo-shadow-sm);
  }
  iframe { border: 0; display: block; }
</style>
