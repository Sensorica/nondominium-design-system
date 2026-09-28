<script lang="ts">
  // C Instrument: a technical bench, one shared resource at a time.
  //
  // Layout from the handoff's C.jsx and "C Instrument.html": a 52px top bar
  // with every NDO in a scrolling strip plus Browse, a 310px spec sheet on
  // the left, and the bench on the right (a diagram of everything attached
  // to the NDO, with a 30-day activity chart under it).
  //
  // ISA Phase 9, D8: this direction carries the handoff's own palette and
  // webfonts (Space Grotesk, Space Mono), scoped to `.instrument` below, not
  // the design system's tokens. D9: the fonts are self-hosted through the
  // already-installed @fontsource packages, at the exact weights the
  // handoff's Google Fonts link asked for (400/500/600 sans, 400/700 mono).
  //
  // The NDO on the bench is part of the URL (`?ndo=`), so a reviewer can link
  // to the bench for a given resource. The direction has one view, `bench`.
  import '@fontsource/space-grotesk/400.css';
  import '@fontsource/space-grotesk/500.css';
  import '@fontsource/space-grotesk/600.css';
  import '@fontsource/space-mono/400.css';
  import '@fontsource/space-mono/700.css';
  // The handoff's own mark asset, copied byte-for-byte from
  // docs/prototypes/original/prototypes/assets/ (not the design system's
  // static/assets copy, a different crop): importing it straight from docs/
  // 403s under Vite's dev server fs.allow in a worktree, so it lives here
  // instead, inside this direction's own folder.
  import logoMark from './nondominium_logo.png';
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { EXAMPLE_NDO } from '$lib/prototypes/store/logic';
  import { currentRecord, goView } from '$lib/prototypes/url.svelte';
  import { AgentAvatar, FlowMenu, ModalHost, Onboarding, Toasts, modals } from '$lib/prototypes/ui';
  import SpecSheet from './SpecSheet.svelte';
  import Bench from './Bench.svelte';

  const requested = $derived(currentRecord().ndo);
  const id = $derived.by(() => {
    if (requested && proto.q.ndo(requested)) return requested;
    if (proto.q.ndo(EXAMPLE_NDO)) return EXAMPLE_NDO;
    return proto.s.ndos[0]?.id ?? null;
  });

  function select(ndo: string) {
    goView('instrument', 'bench', { ndo });
  }

  /** The strip shows the first three words of a name, as in the handoff. */
  const short = (name: string) => name.split(' ').slice(0, 3).join(' ');
</script>

<div class="instrument">
  <header class="bar">
    <span class="mark" style:background-image="url({logoMark})"></span>
    <span class="nm">Nondominium</span>
    <button type="button" class="me" title="Your profile" onclick={() => modals.open({ type: 'profile' })}>
      <AgentAvatar id={proto.me.id} size={24} />
    </button>

    <!-- The handoff's own CSS targets `.bar>nav` (the strip itself, a direct
         child of .bar) for the tab look, and `.bar>nav.on` for the selected
         tab. Because the `on` class actually lands on each `<span>` tab, not
         on the `<nav>`, that rule never matches: the selected tab gets no
         highlight in the real handoff render (verified against the served
         original). Font and colour cascade from the strip by inheritance, so
         they still land on every tab; the highlight and per-tab pointer
         cursor do not. Kept as observed, not "fixed". -->
    <nav class="strip" aria-label="Shared resources">
      {#each proto.s.ndos as n (n.id)}
        <button
          type="button"
          class="tab"
          title={n.name}
          aria-current={n.id === id ? 'page' : undefined}
          onclick={() => select(n.id)}
        >
          {short(n.name)}
          {#if proto.q.signalsOf(n.id).length}<i class="dot" aria-label="needs attention"></i>{/if}
        </button>
      {/each}
      <button type="button" class="tab" onclick={() => modals.open({ type: 'create', after: select })}>+ new</button>
      <button type="button" class="tab" onclick={() => modals.open({ type: 'browse', onOpen: select })}>
        browse {proto.s.ndos.length}
      </button>
    </nav>

    <div class="peer">
      <FlowMenu ndo={id} onOpen={select} />
      <button type="button" class="stat" onclick={() => proto.actions.toggleOffline()} title="Go online or offline">
        node <b class:off={proto.s.offline}>● {proto.s.offline ? 'offline' : 'online'}</b>
      </button>
      <span class="stat">peers <b>{proto.s.offline ? 0 : 23}</b></span>
      <button type="button" class="stat" onclick={() => modals.open({ type: 'receipts' })} title="Your private receipts">
        receipts <b>{proto.s.receipts.length}</b>
      </button>
      <button type="button" class="stat reset" onclick={() => proto.actions.reset()} title="Reload the example">reset</button>
    </div>
  </header>

  {#if id}
    <div class="wrap">
      <SpecSheet {id} />
      <Bench {id} />
    </div>
  {:else}
    <div class="wrap wrap--empty">
      <div class="empty">
        <p class="lbl">No NDO on the bench</p>
        <p>NDOs are scoped to groups. Declare one, or join a group with an invite link.</p>
        <div class="empty__actions">
          <button type="button" class="btn" onclick={() => modals.open({ type: 'create', after: select })}>+ Declare NDO</button>
          <button type="button" class="btn ghost" onclick={() => modals.open({ type: 'join' })}>→ Join group</button>
        </div>
      </div>
    </div>
  {/if}

  <ModalHost />
  <Toasts />
  <Onboarding onndo={select} />
</div>

<style>
  .instrument {
    /* ── The handoff's own :root theme (C Instrument.html), literal ──
     * ISA Phase 9 D8 overrides the "tokens only" rule for A to E: these are
     * the exact values from C Instrument.html's <style> block, not tokens. */
    --bg: #eef1f0;
    --ink: #141a1c;
    --mute: #7c8886;
    --grid: #d6ddd9;
    --teal: #119c8f;

    /* ── The shared prototype UI kit's theming surface (ui.jsx --pb, --pi,
     * --pm, --pl, --pa, --pac, --pr, --prb, --pmono), mapped onto the same
     * values so every modal, the menu, onboarding and toasts render as
     * ui.jsx does. proto.css's own defaults already carry several of
     * ui.jsx's hardcoded literals pixel for pixel (the overlay, the error
     * red, --proto-shadow for FlowMenu, --proto-modal-shadow for Modal, the
     * toast progress colours), so only the ones still token-based below are
     * overridden here, to the same ui.jsx literal. */
    --proto-bg: #fff;
    --proto-ink: var(--ink);
    --proto-muted: var(--mute);
    --proto-line: var(--grid);
    --proto-accent: var(--ink);
    --proto-accent-hover: var(--teal);
    --proto-accent-ink: #fff;
    --proto-radius: 8px;
    --proto-control-radius: 4px;
    --proto-field-radius: 8px;
    --proto-font: 'Space Grotesk', sans-serif;
    --proto-mono: 'Space Mono', monospace;
    --proto-hover: rgba(127, 127, 127, 0.12);
    --proto-toast-bg: #131a1c;
    --proto-toast-ink: #fff;

    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Space Grotesk', sans-serif;
    /* The handoff sets no line-height anywhere (every element computes
       'normal'); the design system's own preflight sets one globally on
       plain tags (h1, td, table, ...), which this direction's markup uses
       unstyled. Left alone, that stacks roughly 40px of extra height onto
       this direction's denser NDOs (verified: 888px scrollHeight here
       against the original's 848px for the same NDO), clipping the spec
       sheet's last buttons. Reset it here, not in the shared stylesheet. */
    line-height: normal;
    overflow: hidden;
  }
  .instrument :global(*) {
    line-height: normal;
  }
  .instrument :global(a) {
    color: #2e5fd1;
  }
  .instrument :global(a:hover) {
    color: var(--ink);
  }

  /* ── Top bar ── */
  .bar {
    height: 52px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 0 20px;
    background: var(--ink);
    color: #fff;
  }
  .mark {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 6px;
    background-color: #f4f5f5;
    background-repeat: no-repeat;
    background-size: 70px;
    background-position: -20px -16px;
  }
  .nm {
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .me {
    display: inline-flex;
    flex-shrink: 0;
    margin-left: 8px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .strip {
    /* .bar nav: the strip's own layout. */
    display: flex;
    gap: 4px;
    margin-left: 10px;
    overflow-x: auto;
    flex: 1 1 auto;
    min-width: 0;
    scrollbar-width: thin;
    /* .bar>nav: font, colour, padding and radius land on the strip itself
       (not on each tab); font and colour are the only ones that visibly
       reach the tabs, by inheritance. See the template comment above. */
    position: relative;
    font: 12px 'Space Mono', monospace;
    padding: 6px 10px;
    border-radius: 4px;
    color: #9fb0ad;
    cursor: pointer;
    white-space: nowrap;
  }
  .strip:hover {
    /* .bar>nav:hover: hovering the strip (not one tab) turns every tab's
       inherited colour white at once. Observed in the served original. */
    color: #fff;
  }
  .tab {
    /* .bar nav>span. No position of its own on purpose: see the .dot and
       .strip comments above. */
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
    font: inherit;
    color: inherit;
    padding: 0;
    border: none;
    background: none;
    white-space: nowrap;
  }
  .dot {
    /* Absolute within .strip (the nearest positioned ancestor), not within
       the tab: the handoff's own span carrying `.dot` has no position of its
       own, so every dot lands at the strip's own top-right corner, whichever
       tab needs attention. Observed in the served original. */
    position: absolute;
    top: 3px;
    right: 2px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e0a21a;
  }

  .peer {
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    white-space: nowrap;
    font: 11px 'Space Mono', monospace;
    color: #9fb0ad;
  }
  .stat {
    font: inherit;
    color: inherit;
    padding: 0;
    border: none;
    background: none;
  }
  button.stat {
    cursor: pointer;
  }
  .stat b {
    font-weight: 400;
    color: #6ee7d8;
  }
  .stat b.off {
    color: #f2b84b;
  }
  .reset {
    text-decoration: underline;
  }

  /* ── Body ── */
  .wrap {
    display: grid;
    grid-template-columns: 310px minmax(0, 1fr);
    flex: 1;
    min-height: 0;
  }
  .wrap--empty {
    grid-template-columns: 1fr;
    place-items: center;
  }
  .empty {
    text-align: center;
    max-width: 420px;
  }
  .empty p {
    font-size: 14px;
    color: var(--mute);
  }
  .lbl {
    font: 10px 'Space Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--mute);
  }
  .empty__actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  .btn {
    font: 600 12px 'Space Grotesk', sans-serif;
    background: var(--ink);
    color: #fff;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
  }
  .btn:hover {
    background: var(--teal);
  }
  .btn.ghost {
    background: #fff;
    color: var(--ink);
    border: 1px solid var(--ink);
  }
  .btn.ghost:hover {
    background: var(--ink);
    color: #fff;
  }

  /* This direction's own brief hides the layout's exit chip and the root
     layout's comments button: the spec sheet's own ghost buttons ("Ask to
     borrow", "Log work") sit exactly in the exit chip's bottom-left corner,
     and the bench is a dense diagram the comments button would sit over.
     Both are rendered outside `.instrument` (the direction layout and the
     root layout respectively), so reaching them takes a bare :global()
     rule, scoped to this route by SvelteKit's own code-splitting rather
     than by DOM nesting. */
  :global(.exit),
  :global(.fab) {
    /* !important: both are rendered by a parent layout with their own
       scoped Svelte class (a hashed class beats this bare :global() one on
       specificity alone), and CSS load order between chunks is not
       something to rely on either. */
    display: none !important;
  }
</style>
