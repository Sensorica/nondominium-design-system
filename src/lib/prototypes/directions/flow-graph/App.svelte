<script lang="ts">
  // Direction F · Flow Graph: the DHT itself, laid out in ValueFlows lanes,
  // seen from the whole network or from one conductor. A port of the handoff's
  // "F Flow Graph.dc.html" onto its own mock backend (./backend.ts).
  //
  // The perspective is the view in the URL (?view=network | conductor-a |
  // conductor-b), so each is linkable and commentable. `?fresh=1` empties the
  // DHT (the "Start from nothing" scenario) and `?example=1` reloads the
  // equipment-sharing scenario; both flags are dropped once honoured.
  import { onDestroy, onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { developer } from '$lib/prototypes/plain';
  import { currentView, dropParams, goView } from '$lib/prototypes/url.svelte';
  import { CONDUCTORS, LANES, createBackend, type AgentKey } from './backend';
  import {
    HEAD,
    LW,
    MIN_ZOOM,
    NH,
    NW,
    actionsFor,
    aname,
    badges,
    edgesOf,
    fieldsOf,
    layout,
    sub,
    title,
    type ActionDef,
    type Call,
    type Ctx,
    type NodeView,
    type Persp,
    type View
  } from './model';
  import Canvas from './Canvas.svelte';
  import Panel from './Panel.svelte';
  import Dock from './Dock.svelte';

  const UI_KEY = 'ndo-f-ui';
  const SLUG = 'flow-graph';

  // ── Backend: its own mock of the zome API. `rev` bumps on every write and
  //    every gossip arrival, so everything derived from it re-renders. ──
  const B = createBackend();
  let rev = $state(0);
  const unsub = B.subscribe(() => rev++);
  onDestroy(() => {
    unsub();
    B.dispose();
  });

  // ── UI preferences kept per viewer (the perspective lives in the URL) ──
  interface Prefs {
    writer: AgentKey;
    showAgents: boolean;
    showStruct: boolean;
    dock: boolean;
  }
  function loadPrefs(): Prefs {
    const base: Prefs = { writer: 'a', showAgents: false, showStruct: true, dock: false };
    try {
      return { ...base, ...JSON.parse(localStorage.getItem(UI_KEY) || '{}') };
    } catch {
      return base;
    }
  }
  let prefs = $state(loadPrefs());
  function savePrefs(p: Partial<Prefs>) {
    prefs = { ...prefs, ...p };
    try {
      localStorage.setItem(UI_KEY, JSON.stringify(prefs));
    } catch {
      // Storage unavailable: the preference lasts for this page only.
    }
  }

  const view$ = $derived(currentView(SLUG));
  const persp: Persp = $derived(view$ === 'conductor-a' ? 'a' : view$ === 'conductor-b' ? 'b' : 'network');
  const writer: AgentKey = $derived(persp !== 'network' ? persp : prefs.writer === 'b' ? 'b' : 'a');

  let sel = $state<string | null>(null);
  let act = $state<{ id: string; root?: boolean } | null>(null);
  let vals = $state<Record<string, string>>({});
  let err = $state<string | null>(null);
  let ok = $state<string | null>(null);
  let menu = $state(false);
  let sideClosed = $state(false);
  let view = $state<View>({ x: 20, y: HEAD, k: 0.8 });
  let canvasEl = $state<HTMLDivElement>();
  let dockHeight = $state(0);

  const ctx: Ctx = $derived.by(() => {
    void rev;
    return { B, dev: $developer };
  });

  const lay = $derived.by(() => {
    void ctx;
    return layout(B, persp);
  });
  const selEntry = $derived(sel && lay.pos[sel] ? (ctx.B.state.entries[sel] ?? null) : null);
  const graph = $derived(edgesOf(lay.vis, lay.pos, selEntry, prefs.showAgents, prefs.showStruct));
  const nodes: NodeView[] = $derived(
    lay.vis.map((e) => ({
      e,
      title: title(ctx, e),
      sub: sub(ctx, e),
      badges: badges(ctx, e).slice(0, 2),
      author: { id: CONDUCTORS[e.author]?.pubkey ?? e.author, name: aname(ctx.B, e.author) }
    }))
  );
  const selActions: ActionDef[] = $derived(selEntry ? actionsFor(ctx, selEntry, writer) : []);
  const rootActions: ActionDef[] = $derived(actionsFor(ctx, null, writer));
  const current: ActionDef | null = $derived(
    act ? (act.root ? rootActions.find((x) => x.id === act!.id) : selActions.find((x) => x.id === act!.id)) ?? null : null
  );

  // ── Pan and zoom helpers ──
  function fit() {
    const el = canvasEl;
    if (!el) return;
    const ps = Object.values(lay.pos);
    if (!ps.length) {
      view = { k: 1, x: 20, y: HEAD };
      return;
    }
    const w = LANES.length * LW;
    const h = Math.max(...ps.map((p) => p.y)) + NH + 20;
    const k = Math.min(1, Math.max(MIN_ZOOM, Math.min((el.clientWidth - 40) / w, (el.clientHeight - HEAD - 20) / h)));
    view = { k, x: 20, y: HEAD };
  }
  function reveal(hash: string) {
    const el = canvasEl;
    const p = lay.pos[hash];
    if (!el || !p) return;
    const v = view;
    const sx = v.x + p.x * v.k;
    const sy = v.y + p.y * v.k;
    const w = el.clientWidth;
    const hh = el.clientHeight;
    const inX = sx > 10 && sx + NW * v.k < w - 10;
    const inY = sy > HEAD && sy + NH * v.k < hh - 10;
    if (inX && inY) return;
    view = { ...v, x: inX ? v.x : w * 0.35 - p.x * v.k, y: inY ? v.y : Math.min(HEAD, hh * 0.4 - p.y * v.k) };
  }
  const fitSoon = () => setTimeout(fit, 30);

  // ── Selection and forms ──
  function pick(hash: string) {
    sel = hash;
    act = null;
    err = null;
    tick().then(() => reveal(hash));
  }
  function selectCard(hash: string) {
    sel = hash;
    act = null;
    err = null;
    ok = null;
    menu = false;
    sideClosed = false;
  }
  function clearSel() {
    sel = null;
    act = null;
    err = null;
  }
  function chooseAction(id: string, root = false) {
    act = { id, root };
    vals = {};
    err = null;
    ok = null;
    if (root) {
      sel = null;
      menu = false;
      sideClosed = false;
    }
  }

  function submit() {
    const a = current;
    if (!a) return;
    const { v } = fieldsOf(a, vals);
    const w = writer;
    const done: string[] = [];
    const c: Call = (z, f, i) => {
      const r = B.call<string | string[]>(z, f, i, w);
      if (!r.ok) throw new Error(f + ': ' + r.error + (done.length ? '  (already committed: ' + done.join(', ') + ')' : ''));
      done.push(f);
      return r.value;
    };
    try {
      const out = a.run(v, c);
      const nh = Array.isArray(out) ? out[0] : out;
      act = null;
      vals = {};
      err = null;
      ok = ctx.dev
        ? done.length + ' zome call' + (done.length > 1 ? 's' : '') + ' · ' + done.join(' → ')
        : 'Done. ' + (done.length > 1 ? done.length + ' steps saved and shared.' : 'Saved and shared.');
      if (nh && B.state.entries[nh]) sel = nh;
      const target = sel;
      if (target) tick().then(() => reveal(target));
    } catch (e) {
      err = e instanceof Error ? e.message : String(e);
    }
  }

  function switchScenario(id: string) {
    B.reset(id);
    sel = null;
    act = null;
    ok = null;
    err = null;
    savePrefs({ writer: 'a' });
    fitSoon();
  }
  function reset() {
    B.reset();
    sel = null;
    act = null;
    ok = null;
    err = null;
  }
  function setPersp(p: Persp) {
    sel = null;
    act = null;
    goView(SLUG, p === 'network' ? 'network' : p === 'a' ? 'conductor-a' : 'conductor-b');
  }

  // ── ?fresh=1 / ?example=1, then fit once the canvas has a size ──
  onMount(() => {
    developer.refresh();
    const q = page.url.searchParams;
    const consumed: string[] = [];
    if (q.get('fresh') === '1') {
      B.reset('blank');
      savePrefs({ writer: 'a' });
      consumed.push('fresh');
    } else if (q.get('example') === '1') {
      B.reset('equipment');
      savePrefs({ writer: 'a' });
      consumed.push('example');
    }
    if (consumed.length) dropParams(consumed);
    const t = setTimeout(fit, 40);
    return () => clearTimeout(t);
  });

  // The layout's exit chip sits bottom left, where the canvas legend is:
  // lift it above the legend, clear of the Activity bar however tall it is.
  $effect(() => {
    const root = document.documentElement.style;
    root.setProperty('--proto-exit-left', '12px');
    root.setProperty('--proto-exit-bottom', dockHeight + 60 + 'px');
    return () => {
      root.removeProperty('--proto-exit-left');
      root.removeProperty('--proto-exit-bottom');
    };
  });

  const persps = $derived.by((): { id: Persp; label: string; port: string | null; online: boolean }[] => {
    const { B: b } = ctx;
    return [
      { id: 'network', label: 'Whole network', port: null, online: true },
      ...(Object.keys(CONDUCTORS) as AgentKey[]).map((k) => ({ id: k, label: aname(b, k), port: ':' + CONDUCTORS[k].port, online: b.state.online[k] }))
    ];
  });
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape' && menu) menu = false;
  }}
/>

<div class="root">
  <header class="top">
    <div class="crumb">
      <a class="brand" href={paths.prototypes()}>NDO</a>
      <span class="slash">/</span>
      <span class="name">Flow graph</span>
    </div>

    <div class="seg" role="group" aria-label="Perspective">
      {#each persps as p (p.id)}
        <button type="button" class="seg__btn" class:seg__btn--on={persp === p.id} aria-pressed={persp === p.id} title={p.port ? 'Conductor ' + p.id + ' ' + p.port : undefined} onclick={() => setPersp(p.id)}>
          {#if p.port}<span class="dot" class:dot--on={p.online}></span>{/if}{p.label}
        </button>
      {/each}
    </div>

    {#if persp === 'network'}
      <div class="writers">
        writing as
        {#each Object.keys(CONDUCTORS) as a (a)}
          <button type="button" class="writer writer--{a}" class:writer--on={prefs.writer === a} aria-pressed={prefs.writer === a} onclick={() => savePrefs({ writer: a as AgentKey })}>{aname(ctx.B, a)}</button>
        {/each}
      </div>
    {/if}

    <div class="grow"></div>

    <button type="button" class="dev" class:dev--on={$developer} aria-pressed={$developer} onclick={() => developer.toggle()}>
      {$developer ? 'Developer details: on' : 'Developer details: off'}
    </button>
    <button type="button" class="btn btn--ghost" onclick={reset}>Reset</button>
    <button type="button" class="btn btn--primary" aria-expanded={menu} aria-haspopup="menu" onclick={() => (menu = !menu)}>+ New entry</button>

    {#if menu}
      <div class="menu" role="menu">
        <div class="menu__as">Written as {aname(ctx.B, writer)}</div>
        {#each rootActions as a (a.id)}
          <button type="button" class="menu__item" role="menuitem" onclick={() => chooseAction(a.id, true)}>
            <span class="menu__l">{a.label}</span>
            {#if ctx.dev}<span class="menu__c">{a.call}</span>{/if}
          </button>
        {/each}
      </div>
    {/if}
  </header>

  <div class="body">
    <Canvas
      {nodes}
      pos={lay.pos}
      edges={graph.edges}
      linked={graph.linked}
      sel={selEntry ? selEntry.hash : null}
      {persp}
      dev={ctx.dev}
      bind:view
      bind:el={canvasEl}
      {sideClosed}
      showAgents={prefs.showAgents}
      showStruct={prefs.showStruct}
      onpick={selectCard}
      onbackground={clearSel}
      ontoggleagents={() => savePrefs({ showAgents: !prefs.showAgents })}
      ontogglestruct={() => savePrefs({ showStruct: !prefs.showStruct })}
      onfit={fit}
    />

    {#if sideClosed}
      <aside class="rail">
        <button type="button" class="rail__btn" title="Show panel" aria-label="Show panel" onclick={() => ((sideClosed = false), fitSoon())}>‹</button>
        <button type="button" class="rail__label" onclick={() => ((sideClosed = false), fitSoon())}>{selEntry ? 'Details' : 'Guide'}</button>
      </aside>
    {:else}
      <Panel
        {ctx}
        {persp}
        {writer}
        sel={selEntry}
        vis={lay.vis}
        actions={selActions}
        {current}
        {vals}
        {err}
        {ok}
        onpick={pick}
        onclear={clearSel}
        onaction={(id) => chooseAction(id)}
        onval={(k, v) => {
          vals = { ...vals, [k]: v };
          err = null;
        }}
        oncancel={() => {
          act = null;
          err = null;
        }}
        onsubmit={submit}
        onscenario={switchScenario}
        onhide={() => ((sideClosed = true), fitSoon())}
      />
    {/if}
  </div>

  <Dock {ctx} open={prefs.dock} bind:height={dockHeight} ontoggle={() => savePrefs({ dock: !prefs.dock })} />
</div>

<style>
  .root {
    display: grid;
    grid-template-rows: 52px minmax(0, 1fr) auto;
    grid-template-columns: minmax(0, 1fr);
    height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    background: rgb(var(--ndo-gray-100));
    font-family: var(--ndo-font-sans);
    color: rgb(var(--ndo-gray-900));
  }

  .top {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    background: rgb(var(--ndo-color-card-bg));
    border-bottom: 1px solid rgb(var(--ndo-gray-200));
    min-width: 0;
    position: relative;
    z-index: 10;
  }
  .crumb {
    display: flex;
    align-items: baseline;
    gap: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .brand {
    font-weight: var(--ndo-weight-bold);
    letter-spacing: 0.06em;
    color: rgb(var(--ndo-blue-700));
    font-size: 14px;
    text-decoration: none;
  }
  .brand:hover {
    text-decoration: underline;
  }
  .slash {
    color: rgb(var(--ndo-gray-400));
  }
  .name {
    font-weight: var(--ndo-weight-semibold);
    font-size: 14px;
  }

  .seg {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: rgb(var(--ndo-gray-100));
    border-radius: var(--ndo-radius-md);
    flex-shrink: 0;
  }
  .seg__btn.seg__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 0;
    border-radius: var(--ndo-radius-sm);
    padding: 5px 10px;
    font: inherit;
    font-size: 12px;
    font-weight: var(--ndo-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    background: transparent;
    color: rgb(var(--ndo-gray-600));
  }
  .seg__btn--on.seg__btn--on {
    background: rgb(var(--ndo-color-card-bg));
    color: rgb(var(--ndo-gray-900));
    box-shadow: var(--ndo-shadow-sm);
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    display: inline-block;
    background: rgb(var(--ndo-amber-600));
  }
  .dot--on {
    background: rgb(var(--ndo-green-700));
  }

  .writers {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    white-space: nowrap;
  }
  .writer.writer {
    display: inline-flex;
    align-items: center;
    height: 22px;
    padding: 2px 8px;
    border: 0;
    border-radius: 4px;
    font: inherit;
    font-size: 11px;
    font-weight: var(--ndo-weight-bold);
    cursor: pointer;
    opacity: 0.45;
    outline-offset: 1px;
  }
  .writer--a.writer--a {
    background: rgb(var(--ndo-blue-100));
    color: rgb(var(--ndo-blue-700));
  }
  .writer--b.writer--b {
    background: rgb(var(--ndo-amber-100));
    color: rgb(var(--ndo-amber-800));
  }
  .writer--on.writer--on {
    opacity: 1;
    outline: 2px solid currentColor;
  }
  .grow {
    flex: 1 1 0;
    min-width: 0;
  }

  .dev.dev {
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    color: rgb(var(--ndo-gray-600));
    border-radius: var(--ndo-radius-md);
    padding: 4px 10px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .dev--on.dev--on {
    border-color: rgb(var(--ndo-blue-600));
    background: rgb(var(--ndo-blue-50));
    color: rgb(var(--ndo-blue-700));
  }

  .btn.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 14px;
    border-radius: var(--ndo-radius-md);
    font: inherit;
    font-size: 14px;
    font-weight: var(--ndo-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: var(--ndo-transition-colors);
  }
  .btn--primary.btn--primary {
    border: 1px solid rgb(var(--ndo-blue-600));
    background: rgb(var(--ndo-blue-600));
    color: rgb(255 255 255);
  }
  .btn--primary.btn--primary:hover {
    background: rgb(var(--ndo-blue-700));
    border-color: rgb(var(--ndo-blue-700));
  }
  .btn--ghost.btn--ghost {
    border: 1px solid rgb(var(--ndo-gray-300));
    background: transparent;
    color: rgb(var(--ndo-gray-600));
  }
  .btn--ghost.btn--ghost:hover {
    background: rgb(var(--ndo-gray-50));
  }
  .seg__btn.seg__btn:focus-visible,
  .writer.writer:focus-visible,
  .dev.dev:focus-visible,
  .btn.btn:focus-visible,
  .menu__item.menu__item:focus-visible,
  .rail__btn.rail__btn:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  .menu {
    position: absolute;
    right: 16px;
    top: 48px;
    width: 260px;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    box-shadow: var(--ndo-shadow-md);
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .menu__as {
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    padding: 6px 8px;
  }
  .menu__item.menu__item {
    text-align: left;
    border: 0;
    background: transparent;
    border-radius: var(--ndo-radius-md);
    padding: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font: inherit;
  }
  .menu__item.menu__item:hover {
    background: rgb(var(--ndo-gray-50));
  }
  .menu__l {
    font-size: 14px;
    font-weight: var(--ndo-weight-medium);
    color: rgb(var(--ndo-gray-900));
  }
  .menu__c {
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: rgb(var(--ndo-gray-500));
  }

  .body {
    display: flex;
    min-height: 0;
    min-width: 0;
  }
  .rail {
    width: 44px;
    flex-shrink: 0;
    background: rgb(var(--ndo-color-card-bg));
    border-left: 1px solid rgb(var(--ndo-gray-200));
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    gap: 10px;
  }
  .rail__btn.rail__btn {
    width: 30px;
    height: 30px;
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    border-radius: var(--ndo-radius-md);
    cursor: pointer;
    color: rgb(var(--ndo-gray-600));
    font-size: 14px;
  }
  .rail__label.rail__label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    border: 0;
    background: none;
    padding: 0;
    font: inherit;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-500));
    cursor: pointer;
  }
</style>
