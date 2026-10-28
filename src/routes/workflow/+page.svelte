<script lang="ts">
  // The iterative V: the eight stages a piece of Nondominium work goes through,
  // with the published boards at each one. Implementation is the vertex and the
  // axis of symmetry; the design stages descend on the left, proofs and
  // deployments rise on the right. Under 860px the V becomes a vertical list.
  import { paths } from '$lib/paths';
  import { STAGE_LABEL, STATUS_LABEL, LANG_LABEL } from '$lib/brainstorms/labels';

  let { data } = $props();

  // Row on the V for each stage (0 = top). The right arm mirrors the left:
  // proofs faces project management, deployments faces interfaces.
  const DEPTH: Record<string, number> = {
    brainstorm: 0,
    requirements: 1,
    architecture: 2,
    interfaces: 3,
    'project-management': 4,
    implementation: 5,
    proofs: 4,
    deployments: 3,
  };
  const ROWS = 6;
  const COLS = $derived(data.stages.length);
  // The V line through the centre of every stage cell, in a 0..100 box.
  const points = $derived(
    data.stages.map((s, i) => `${((i + 0.5) / COLS) * 100},${((DEPTH[s.stage] + 0.5) / ROWS) * 100}`).join(' ')
  );
  const axis = $derived(((data.stages.findIndex((s) => s.stage === 'implementation') + 0.5) / COLS) * 100);
  const total = $derived(data.stages.reduce((t, s) => t + s.boards.length, 0));
</script>

<svelte:head><title>Workflow — Nondominium Design System</title></svelte:head>

<main class="workflow">
  <header>
    <h1 class="ndo-h1">Workflow</h1>
    <p class="lede">
      Nondominium's work runs down an iterative V. It starts as a brainstorm and descends through requirements, architecture, interfaces and project management to implementation, the point of the V. It then climbs back through proofs and deployments, which check what the left arm decided. A board moves down the V as the work advances, and a later stage can send the work back up to an earlier one. Each stage lists the boards published at it.
    </p>
    <p class="summary"><b>{total}</b> {total === 1 ? 'board' : 'boards'} across <b>{data.stages.filter((s) => s.boards.length).length}</b> of {COLS} stages · <a href={paths.brainstorms()}>all brainstorms</a></p>
  </header>

  <div class="vwrap">
  <svg class="line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <line class="axis" x1={axis} y1="0" x2={axis} y2="100" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="6 6" vector-effect="non-scaling-stroke" />
    <polyline {points} fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  </svg>
  <ol class="v" style="--cols:{COLS};--rows:{ROWS}" aria-label="The stages of the V, in order">
    {#each data.stages as s, i (s.stage)}
      <li
        class="stage"
        class:vertex={s.stage === 'implementation'}
        class:right={i > data.stages.findIndex((x) => x.stage === 'implementation')}
        style="grid-column:{i + 1};grid-row:{DEPTH[s.stage] + 1}"
      >
        <div class="head">
          <span class="n">{i + 1}</span>
          <h2>{STAGE_LABEL[s.stage] ?? s.stage}</h2>
          {#if s.boards.length}<span class="count">{s.boards.length}</span>{/if}
        </div>
        {#if s.boards.length}
          <ul class="boards">
            {#each s.boards as b (b.slug)}
              <li>
                <a href={paths.brainstorm(b.slug)} lang={b.lang}>{b.title}</a>
                <span class="meta">{b.date} · {STATUS_LABEL[b.status] ?? b.status}{b.lang !== 'en' ? ` · ${LANG_LABEL[b.lang] ?? b.lang}` : ''}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty">No board at this stage yet.</p>
        {/if}
        {#if s.stage === 'implementation'}<p class="axis-note">Axis of the V</p>{/if}
      </li>
    {/each}
  </ol>
  </div>
</main>

<style>
  .workflow { max-width: 1280px; margin: 0 auto; padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 5rem; color: var(--ndo-color-text-primary); font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); }
  .lede { color: var(--ndo-color-text-secondary); max-width: 720px; margin: var(--ndo-spacing-1) 0 var(--ndo-spacing-3); }
  .summary { color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); margin: 0 0 var(--ndo-spacing-6); }
  .summary b { color: var(--ndo-color-text-primary); }
  .summary a { color: var(--ndo-color-link); }

  .vwrap { position: relative; }
  .v { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-template-rows: repeat(var(--rows), minmax(7.5rem, auto)); gap: var(--ndo-spacing-2); }
  .line { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
  .line polyline { stroke: rgb(var(--ndo-primary-500)); opacity: 0.55; }
  .line .axis { stroke: var(--ndo-color-border-strong); }

  .stage { position: relative; z-index: 1; align-self: center; background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-top: 3px solid rgb(var(--ndo-primary-500)); border-radius: var(--ndo-radius-lg); padding: var(--ndo-spacing-2) var(--ndo-spacing-3); box-shadow: var(--ndo-shadow-sm); min-width: 0; }
  .stage.right { border-top-color: rgb(var(--ndo-green-600)); }
  .stage.vertex { border-top-color: rgb(var(--ndo-brand-violet-500)); }
  .head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 var(--ndo-spacing-1-5); }
  .n { flex-basis: 100%; font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  h2 { margin: 0; font-size: var(--ndo-text-sm); line-height: var(--ndo-lh-sm); font-weight: var(--ndo-weight-bold); overflow-wrap: normal; word-break: normal; hyphens: manual; }
  .count { margin-left: auto; align-self: center; font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); color: rgb(var(--ndo-color-text-inverse)); background: rgb(var(--ndo-primary-600)); border-radius: var(--ndo-radius-pill); padding: 0 7px; }
  .boards { list-style: none; margin: var(--ndo-spacing-2) 0 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-2); }
  .boards a { display: block; color: var(--ndo-color-link); font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); font-weight: var(--ndo-weight-semibold); text-decoration: none; overflow-wrap: anywhere; }
  .boards a:hover { text-decoration: underline; }
  .meta { display: block; font-size: 0.6875rem; color: var(--ndo-color-text-muted); font-family: var(--ndo-font-mono); }
  .empty { margin: var(--ndo-spacing-2) 0 0; font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); font-style: italic; }
  .axis-note { margin: var(--ndo-spacing-2) 0 0; font-size: 0.6875rem; font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: rgb(var(--ndo-brand-violet-500)); }

  /* Narrow: the V becomes the ordered list it is, read top to bottom. */
  @media (max-width: 860px) {
    .workflow { padding: var(--ndo-spacing-6) var(--ndo-spacing-4) 4rem; }
    .v { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); padding-left: var(--ndo-spacing-4); border-left: 3px solid rgb(var(--ndo-primary-500) / 0.55); }
    .line { display: none; }
    .stage { align-self: stretch; }
    .stage.vertex { margin-left: var(--ndo-spacing-4); }
    h2 { font-size: var(--ndo-text-base); }
    .boards a { font-size: var(--ndo-text-sm); }
  }
</style>
