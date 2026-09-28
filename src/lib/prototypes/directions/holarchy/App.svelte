<script lang="ts">
  // E Holarchy: zoom from the lobby into a group and into a resource, as
  // nested rings. Handoff: E.jsx and "E Holarchy.html". Contract:
  // src/lib/prototypes/README.md.
  //
  // Where you are lives in the URL, so every level is linkable:
  //   (bare)                    where the handoff opens: the CNC machine's
  //                             rings (EXAMPLE_NDO in EXAMPLE_GROUP)
  //   ?group=G&ndo=N            one NDO as concentric rings (the default view)
  //   ?view=group&group=G       one group; &ndo=N marks the inspected NDO
  //   ?view=lobby               all your groups
  // A record that no longer exists (after "Start over", say) falls back one
  // level, and the URL is corrected to match.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { FlowMenu, ModalHost, Toasts, Onboarding, modals } from '$lib/prototypes/ui';
  import { paths } from '$lib/paths';
  import { currentView, currentRecord, goView } from '$lib/prototypes/url.svelte';
  import { EXAMPLE_GROUP, EXAMPLE_NDO, type ViewOf } from '$lib/prototypes/directions';
  import LobbyLevel from './LobbyLevel.svelte';
  import GroupLevel from './GroupLevel.svelte';
  import NdoLevel from './NdoLevel.svelte';
  import HoloCard from './HoloCard.svelte';
  import { RING_COLOR, type Ring } from './geometry';

  // ISA Phase 9, D8/D9: the original's own webfonts, self-hosted (no CDN
  // request). "E Holarchy.html" loaded Manrope 400/500/600/700/800 and Fira
  // Code 400/500 from Google Fonts; these are the same families and weights.
  import '@fontsource/manrope/400.css';
  import '@fontsource/manrope/500.css';
  import '@fontsource/manrope/600.css';
  import '@fontsource/manrope/700.css';
  import '@fontsource/manrope/800.css';
  import '@fontsource/fira-code/400.css';
  import '@fontsource/fira-code/500.css';

  type View = ViewOf<'holarchy'>;
  interface Loc {
    view: View;
    at: { group?: string; ndo?: string };
    sel: string | null;
  }

  const view = $derived(currentView('holarchy'));
  const rec = $derived(currentRecord());

  const loc = $derived.by((): Loc => {
    const lobby: Loc = { view: 'lobby', at: {}, sel: null };
    if (view === 'lobby') return lobby;
    if (view === 'ndo') {
      // The bare URL opens where the handoff's HolarchyApp opens, and falls
      // back the same way: to the group, then the Lobby.
      const bare = !rec.group && !rec.ndo;
      const n = proto.q.ndo(bare ? EXAMPLE_NDO : rec.ndo);
      if (n && proto.q.group(n.group))
        return { view: 'ndo', at: { group: n.group, ndo: n.id }, sel: null };
      const g = proto.q.group(bare ? EXAMPLE_GROUP : rec.group)?.id;
      return g ? { view: 'group', at: { group: g }, sel: null } : lobby;
    }
    const g = proto.q.group(rec.group)?.id;
    if (!g) return lobby;
    const s = proto.q.ndo(rec.ndo);
    return { view: 'group', at: { group: g }, sel: s && s.group === g ? s.id : null };
  });

  // Keep the URL in step with what is shown.
  $effect(() => {
    const group = loc.at.group ?? null;
    const ndo = loc.at.ndo ?? loc.sel ?? null;
    if (loc.view !== view || group !== rec.group || ndo !== rec.ndo) {
      goView(
        'holarchy',
        loc.view,
        { group: group ?? undefined, ndo: ndo ?? undefined },
        { replace: true }
      );
    }
  });

  const depth = $derived(loc.at.ndo ? 3 : loc.at.group ? 2 : 1);
  const locKey = $derived(`${loc.view}|${loc.at.group ?? ''}|${loc.at.ndo ?? ''}`);

  // Ring focus belongs to the place it was set in: moving clears it.
  let focusState = $state<{ key: string; ring: Ring | null }>({ key: '', ring: null });
  const focus = $derived(focusState.key === locKey ? focusState.ring : null);
  const setFocus = (ring: Ring | null) => (focusState = { key: locKey, ring });

  // ── Moving between levels ──
  const toLobby = () => goView('holarchy', 'lobby');
  const toGroup = (group: string) => goView('holarchy', 'group', { group });
  function toNdo(id: string) {
    const n = proto.q.ndo(id);
    if (n) goView('holarchy', 'ndo', { group: n.group, ndo: n.id });
  }
  const select = (ndo: string) => {
    if (loc.at.group) goView('holarchy', 'group', { group: loc.at.group, ndo }, { replace: true });
  };
  function up() {
    if (loc.at.ndo && loc.at.group) toGroup(loc.at.group);
    else if (loc.at.group) toLobby();
  }

  // Scrolling down on the canvas goes up a level, one level per gesture. A
  // trackpad gesture is a stream of wheel events whose inertia can outlast any
  // fixed delay, so the first strong event climbs and the rest of the stream
  // is swallowed: the gesture only ends after GESTURE_GAP ms with no wheel
  // event at all, and only then can the next one climb.
  const GESTURE_GAP = 250;
  let inGesture = false;
  let gestureEnd: ReturnType<typeof setTimeout> | undefined;
  function onwheel(e: WheelEvent) {
    clearTimeout(gestureEnd);
    gestureEnd = setTimeout(() => (inGesture = false), GESTURE_GAP);
    if (inGesture || modals.current || e.deltaY <= 30) return;
    inGesture = true;
    up();
  }
  $effect(() => () => clearTimeout(gestureEnd));

  // The legend sits in the bottom-left corner, where the layout's exit chip
  // lives: lift the chip above it.
  let legendHeight = $state(40);
  $effect(() => {
    const style = document.documentElement.style;
    style.setProperty('--proto-exit-left', '28px');
    style.setProperty('--proto-exit-bottom', `${22 + legendHeight + 10}px`);
    return () => {
      style.removeProperty('--proto-exit-left');
      style.removeProperty('--proto-exit-bottom');
    };
  });

  const LEVEL = ['', 'all groups', 'inside a group', 'inside a resource'];
  const LEGEND: [keyof typeof RING_COLOR, string][] = [
    ['id', 'the resource'],
    ['rules', 'rules'],
    ['inst', 'items'],
    ['slots', 'linked resources'],
    ['sig', 'needs attention']
  ];

  const groupName = $derived(proto.q.group(loc.at.group)?.name ?? '');
  const ndoName = $derived(proto.q.ndo(loc.at.ndo)?.name ?? '');
</script>

<div class="holarchy">
  <header class="top">
    <img class="mark" src={paths.logoMark()} alt="Nondominium" width="40" height="40" />
    <nav class="crumbs" aria-label="Level">
      <button
        type="button"
        class:on={depth === 1}
        aria-current={depth === 1 ? 'location' : undefined}
        onclick={toLobby}>Lobby</button
      >
      {#if loc.at.group}
        <em>›</em>
        <button
          type="button"
          class:on={depth === 2}
          aria-current={depth === 2 ? 'location' : undefined}
          onclick={() => loc.at.group && toGroup(loc.at.group)}>{groupName}</button
        >
      {/if}
      {#if loc.at.ndo}
        <em>›</em>
        <button type="button" class="on" aria-current="location">{ndoName}</button>
      {/if}
    </nav>
    <div class="menu">
      <FlowMenu ndo={loc.at.ndo ?? loc.sel} onOpen={toNdo} onGroup={toGroup} />
    </div>
    <p class="zoom">scroll down to go back up · <b>{LEVEL[depth]}</b></p>
  </header>

  <svg
    class="stage"
    {onwheel}
    viewBox="0 0 1000 840"
    preserveAspectRatio="xMinYMid meet"
    role="group"
    aria-label="Holarchy, {LEVEL[depth]}"
  >
    {#key locKey}
      <g class="zoom-in">
        {#if loc.view === 'ndo' && loc.at.ndo}
          <NdoLevel id={loc.at.ndo} {focus} onfocus={setFocus} />
        {:else if loc.view === 'group' && loc.at.group}
          <GroupLevel
            gid={loc.at.group}
            sel={loc.sel}
            onselect={select}
            onenter={toNdo}
            oncreate={() => modals.open({ type: 'create', after: toNdo })}
          />
        {:else}
          <LobbyLevel onenter={toGroup} />
        {/if}
      </g>
    {/key}
  </svg>

  <HoloCard at={loc.at} sel={loc.sel} {focus} onfocus={setFocus} onndo={toNdo} ongroup={toGroup} />

  <ul class="legend" bind:clientHeight={legendHeight} aria-label="Legend">
    {#each LEGEND as [k, label] (k)}
      <li><i style:background={RING_COLOR[k]}></i>{label}</li>
    {/each}
  </ul>

  <p class="peers">
    <button
      type="button"
      onclick={proto.actions.toggleOffline}
      title="Go {proto.s.offline ? 'online' : 'offline'}"
    >
      {#if proto.s.offline}
        {proto.dev
          ? '○ offline · traces queue locally'
          : '○ offline · your changes are saved and will be shared later'}
      {:else}
        {proto.dev ? '● 23 peers hold this holon' : '● online · shared with 23 people'}
      {/if}
    </button>
    ·
    <button type="button" onclick={() => modals.open({ type: 'receipts' })}
      >◆ {proto.s.receipts.length} receipts</button
    >
    ·
    <button type="button" class="reset" onclick={proto.actions.reset}>reset</button>
  </p>

  <ModalHost />
  <Toasts />
  <Onboarding onndo={toNdo} ongroup={toGroup} />
</div>

<style>
  /* ISA Phase 9, D8: the original's own theme variables, scoped to this
   * direction's root, with their original values ("E Holarchy.html" :root).
   * --ho-* are local to this file tree; --proto-* theme the shared modal /
   * menu / onboarding / toast kit the same way ui.jsx's --pb/--pi/--pm/--pl/
   * --pa/--pac/--pr/--prb/--pmono did (mapping in
   * src/lib/prototypes/README.md). */
  .holarchy {
    --ho-bg: #f3f6f8;
    --ho-ink: #0f1a2a;
    --ho-ink2: #48566a;
    --ho-mute: #8592a3;
    --ho-line: #dde4eb;
    --ho-card-bg: #fff;
    --ho-font: 'Manrope', sans-serif;
    --ho-mono: 'Fira Code', monospace;

    --proto-bg: var(--ho-card-bg);
    --proto-ink: var(--ho-ink);
    --proto-muted: var(--ho-mute);
    --proto-line: var(--ho-line);
    --proto-accent: var(--ho-ink);
    --proto-accent-hover: #3f6fdb;
    --proto-accent-ink: #fff;
    --proto-radius: 20px;
    --proto-control-radius: 12px;
    --proto-field-radius: 8px;
    --proto-font: var(--ho-font);
    --proto-mono: var(--ho-mono);
    --proto-danger: #d8452f;
    --proto-overlay: rgba(0, 0, 0, 0.45);
    --proto-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
    --proto-toast-bg: #131a1c;
    --proto-toast-ink: #fff;
    --proto-progress: #2ec4b6;
    --proto-queued: #e0a21a;

    position: relative;
    height: 100%;
    overflow: hidden;
    background: var(--ho-bg);
    color: var(--ho-ink);
    font-family: var(--ho-font);
    /* The design system's own reset sets line-height:1.5 at the document
     * root; the original never sets one outside .card h2 (1.1) and .p
     * (1.5), so it renders each element at the browser's own metric
     * line-height. Falling back to that here keeps every row (card rings,
     * crumbs, legend, peers) the original's height instead of taller. */
    line-height: normal;
  }

  .top {
    position: absolute;
    left: 28px;
    top: 22px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 3;
    flex-wrap: wrap;
    pointer-events: none;
  }
  .top > * {
    pointer-events: auto;
  }
  .mark {
    display: block;
  }
  .crumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .crumbs button {
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--ho-card-bg);
    border: 1px solid var(--ho-line);
    color: var(--ho-ink2);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .crumbs button:hover {
    border-color: var(--ho-ink);
  }
  .crumbs button.on {
    background: var(--ho-ink);
    border-color: var(--ho-ink);
    color: var(--ho-card-bg);
  }
  .crumbs button:focus-visible,
  .peers button:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .crumbs em {
    color: var(--ho-mute);
    font-style: normal;
  }
  .menu {
    margin-left: auto;
  }
  .zoom {
    /* The original gives both the menu and this label their own auto
     * margin, so the free space splits between them (a visible gap
     * between "Menu" and this text, not the two flush together). */
    margin: 0 0 0 auto;
    font-size: 12px;
    color: var(--ho-mute);
    white-space: nowrap;
  }
  .zoom b {
    font-family: var(--ho-mono);
    font-weight: 400;
    color: var(--ho-ink2);
  }

  .stage {
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% - 380px);
    height: 100%;
  }
  .zoom-in {
    animation: zoom-in 450ms cubic-bezier(0.2, 0.8, 0.2, 1);
    transform-box: fill-box;
    transform-origin: center;
  }
  @keyframes zoom-in {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
  }

  .legend {
    position: absolute;
    left: 28px;
    bottom: 22px;
    max-width: calc(100% - 380px - 56px);
    margin: 0;
    list-style: none;
    background: var(--ho-card-bg);
    border: 1px solid var(--ho-line);
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 12px;
    color: var(--ho-ink2);
    display: flex;
    gap: 6px 18px;
    flex-wrap: wrap;
    z-index: 2;
  }
  .legend li {
    white-space: nowrap;
  }
  .legend i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: -1px;
  }

  /* Right of the card's bottom edge, clear of the comments button (the
   * original sits at right:28px/bottom:22px; this offset is the named,
   * legitimate accommodation for that design-system chrome addition). */
  .peers {
    position: absolute;
    right: 92px;
    bottom: 40px;
    margin: 0;
    font-family: var(--ho-mono);
    font-size: 12px;
    color: var(--ho-mute);
    white-space: nowrap;
    z-index: 2;
  }
  .peers button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: var(--ndo-radius-sm);
  }
  .peers button:hover {
    color: var(--ho-ink);
  }
  .peers .reset {
    text-decoration: underline;
  }

  @media (prefers-reduced-motion: reduce) {
    .zoom-in {
      animation: none;
    }
  }
</style>
