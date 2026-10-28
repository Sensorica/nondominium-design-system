<script lang="ts">
  // The iterative V: the stages a piece of Nondominium work goes through, with
  // the published boards at each one. Five rungs per side, implementation at the
  // point and on the axis of symmetry. Each rung on the right checks the one it
  // faces on the left: deployments face the brainstorm, acceptance proofs the
  // requirements, integration proofs the architecture, unit proofs the
  // interfaces, and review and merge face project management. Under 860px the V
  // becomes a vertical list in the same order.
  import { onMount } from 'svelte';
  import { paths } from '$lib/paths';
  import { STAGE_LABEL, STATUS_LABEL, LANG_LABEL } from '$lib/brainstorms/labels';

  let { data } = $props();

  type Rung = {
    key: string;
    label: string;
    /** The `lifecycle:` stage whose boards this rung lists; null for a rung no board sits at. */
    stage: string | null;
    /** Row on the V, 0 at the top. */
    depth: number;
    side: 'left' | 'vertex' | 'right';
    sub?: string;
    note?: string;
  };
  const stageLabel = (s: string) => STAGE_LABEL[s] ?? s;
  const RUNGS: Rung[] = [
    { key: 'brainstorm', label: stageLabel('brainstorm'), stage: 'brainstorm', depth: 0, side: 'left' },
    { key: 'requirements', label: stageLabel('requirements'), stage: 'requirements', depth: 1, side: 'left' },
    { key: 'architecture', label: stageLabel('architecture'), stage: 'architecture', depth: 2, side: 'left' },
    { key: 'interfaces', label: stageLabel('interfaces'), stage: 'interfaces', depth: 3, side: 'left' },
    { key: 'project-management', label: stageLabel('project-management'), stage: 'project-management', depth: 4, side: 'left' },
    { key: 'implementation', label: stageLabel('implementation'), stage: 'implementation', depth: 5, side: 'vertex' },
    { key: 'review', label: 'Review and merge', stage: null, depth: 4, side: 'right', note: 'Pull requests close the issues opened at project management.' },
    { key: 'proofs-unit', label: stageLabel('proofs'), sub: 'Unit', stage: 'proofs', depth: 3, side: 'right' },
    { key: 'proofs-integration', label: stageLabel('proofs'), sub: 'Integration', stage: 'proofs', depth: 2, side: 'right' },
    { key: 'proofs-acceptance', label: stageLabel('proofs'), sub: 'Acceptance', stage: 'proofs', depth: 1, side: 'right' },
    { key: 'deployments', label: stageLabel('deployments'), stage: 'deployments', depth: 0, side: 'right' },
  ];
  const ROWS = 6;
  const COLS = RUNGS.length;
  const boardsAt = $derived(Object.fromEntries(data.stages.map((s) => [s.stage, s.boards])));
  // The V line through the centre of every rung cell, in a 0..100 box.
  // Before layout: the V through the centre of every grid cell, in a 0..100 box.
  // Rows are not equal (a rung with many boards is taller), so once the page is
  // laid out the line is redrawn through the measured centre of each card.
  const VERTEX = RUNGS.findIndex((r) => r.side === 'vertex');
  let line = $state({
    box: '0 0 100 100',
    scale: 'none',
    points: RUNGS.map((r, i) => `${((i + 0.5) / COLS) * 100},${((r.depth + 0.5) / ROWS) * 100}`).join(' '),
    axis: ((VERTEX + 0.5) / COLS) * 100,
    height: 100,
  });
  let wrap: HTMLDivElement;

  function measure() {
    const box = wrap.getBoundingClientRect();
    const cards = [...wrap.querySelectorAll<HTMLElement>('.v > li')].map((li) => li.getBoundingClientRect());
    if (cards.length !== COLS || !box.width) return;
    const centre = (r: DOMRect) => [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
    line = {
      box: `0 0 ${box.width} ${box.height}`,
      scale: 'xMidYMid meet',
      points: cards.map((r) => centre(r).map((n) => n.toFixed(1)).join(',')).join(' '),
      axis: centre(cards[VERTEX])[0],
      height: box.height,
    };
  }

  onMount(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  });
  const total = $derived(data.stages.reduce((t, s) => t + s.boards.length, 0));
</script>

<svelte:head><title>Workflow — Nondominium Design System</title></svelte:head>

<main class="workflow">
  <header>
    <h1 class="ndo-h1">Workflow</h1>
    <p class="lede">
      Nondominium's work runs down an iterative V. It starts as a brainstorm and descends through requirements, architecture, interfaces and project management to implementation, the point of the V. It then climbs back up the other arm, where each rung checks the one it faces: review and merge against project management, unit, integration and acceptance proofs against interfaces, architecture and requirements, and deployments against the brainstorm. A board moves down the V as the work advances, and a later stage can send the work back up to an earlier one. Each stage lists the boards published at it.
    </p>
    <p class="summary"><b>{total}</b> {total === 1 ? 'board' : 'boards'} across <b>{data.stages.filter((s) => s.boards.length).length}</b> of {data.stages.length} stages · <a href={paths.brainstorms()}>all brainstorms</a></p>
  </header>

  <div class="vscroll">
  <div class="vwrap" bind:this={wrap}>
  <svg class="line" viewBox={line.box} preserveAspectRatio={line.scale} aria-hidden="true">
    <line class="axis" x1={line.axis} y1="0" x2={line.axis} y2={line.height} fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="6 6" vector-effect="non-scaling-stroke" />
    <polyline points={line.points} fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  </svg>
  <ol class="v" style="--cols:{COLS};--rows:{ROWS}" aria-label="The rungs of the V, in order">
    {#each RUNGS as r, i (r.key)}
      {@const boards = r.stage ? (boardsAt[r.stage] ?? []) : []}
      <li class="stage {r.side}" class:gate={!r.stage} style="grid-column:{i + 1};grid-row:{r.depth + 1}">
        <div class="head">
          <span class="n">{i + 1}</span>
          <h2 lang="en">{r.label}{#if r.sub}<span class="sub">{r.sub}</span>{/if}</h2>
          {#if boards.length}<span class="count">{boards.length}</span>{/if}
        </div>
        {#if r.note}
          <p class="note">{r.note}</p>
        {:else if boards.length}
          <ul class="boards">
            {#each boards as b (b.slug)}
              <li>
                <a href={paths.brainstorm(b.slug)} lang={b.lang}>{b.title}</a>
                <span class="meta">{b.date} · {STATUS_LABEL[b.status] ?? b.status}{b.lang !== 'en' ? ` · ${LANG_LABEL[b.lang] ?? b.lang}` : ''}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty">No board at this stage yet.</p>
        {/if}
        {#if r.side === 'vertex'}<p class="axis-note">Axis of the V</p>{/if}
      </li>
    {/each}
  </ol>
  </div>
  </div>
</main>

<style>
  /* contain: the layout's main column is a bare 1fr, so without it the V's width would widen the page instead of scrolling inside .vscroll. */
  .workflow { contain: inline-size; max-width: 1440px; margin: 0 auto; padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 5rem; color: var(--ndo-color-text-primary); font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); }
  .lede { color: var(--ndo-color-text-secondary); max-width: 720px; margin: var(--ndo-spacing-1) 0 var(--ndo-spacing-3); }
  .summary { color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); margin: 0 0 var(--ndo-spacing-6); }
  .summary b { color: var(--ndo-color-text-primary); }
  .summary a { color: var(--ndo-color-link); }

  /* Eleven rungs need about 1200px; on a narrower screen the V scrolls sideways rather than squeezing its words. */
  .vscroll { overflow-x: auto; padding-bottom: var(--ndo-spacing-2); }
  .vwrap { position: relative; min-width: calc(var(--ndo-v-col, 104px) * 11 + var(--ndo-spacing-1) * 10); }
  .v { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(var(--cols), minmax(var(--ndo-v-col, 104px), 1fr)); grid-template-rows: repeat(var(--rows), minmax(7.5rem, auto)); gap: var(--ndo-spacing-1); }
  .line { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
  .line polyline { stroke: rgb(var(--ndo-primary-500)); opacity: 0.55; }
  .line .axis { stroke: var(--ndo-color-border-strong); }

  .stage { position: relative; z-index: 1; align-self: center; background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-top: 3px solid rgb(var(--ndo-primary-500)); border-radius: var(--ndo-radius-lg); padding: var(--ndo-spacing-2); box-shadow: var(--ndo-shadow-sm); min-width: 0; }
  .stage.right { border-top-color: rgb(var(--ndo-green-600)); }
  .stage.vertex { border-top-color: rgb(var(--ndo-brand-violet-500)); margin: 0 -12px; }
  @media (max-width: 860px) { .stage.vertex { margin: 0; } }
  .stage.gate { border-top-style: dashed; }
  .note { margin: var(--ndo-spacing-2) 0 0; font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); color: var(--ndo-color-text-secondary); }
  .head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 var(--ndo-spacing-1-5); }
  .n { flex-basis: 100%; font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  h2 { margin: 0; font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); font-weight: var(--ndo-weight-bold); overflow-wrap: normal; word-break: normal; hyphens: manual; min-width: 0; }
  .sub { display: block; font-weight: var(--ndo-weight-medium); color: var(--ndo-color-text-secondary); }
  .count { margin-left: auto; align-self: center; font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); color: rgb(var(--ndo-color-text-inverse)); background: rgb(var(--ndo-primary-600)); border-radius: var(--ndo-radius-pill); padding: 0 7px; }
  .boards { list-style: none; margin: var(--ndo-spacing-2) 0 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-2); }
  .boards a { display: block; color: var(--ndo-color-link); font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); font-weight: var(--ndo-weight-semibold); text-decoration: none; overflow-wrap: normal; word-break: normal; hyphens: manual; }
  .boards a:hover { text-decoration: underline; }
  .meta { display: block; font-size: 0.6875rem; color: var(--ndo-color-text-muted); font-family: var(--ndo-font-mono); }
  .empty { margin: var(--ndo-spacing-2) 0 0; font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); font-style: italic; }
  .axis-note { margin: var(--ndo-spacing-2) 0 0; font-size: 0.6875rem; font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: rgb(var(--ndo-brand-violet-500)); }

  /* Narrow: the V becomes the ordered list it is, read top to bottom. */
  @media (max-width: 860px) {
    .vwrap { min-width: 0; }
    .vscroll { overflow-x: visible; padding-bottom: 0; }
    .workflow { padding: var(--ndo-spacing-6) var(--ndo-spacing-4) 4rem; }
    .v { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); padding-left: var(--ndo-spacing-4); border-left: 3px solid rgb(var(--ndo-primary-500) / 0.55); }
    .line { display: none; }
    .stage { align-self: stretch; }
    .stage.vertex { margin-left: var(--ndo-spacing-4); }
    h2 { font-size: var(--ndo-text-base); }
    .boards a { font-size: var(--ndo-text-sm); }
  }
</style>
