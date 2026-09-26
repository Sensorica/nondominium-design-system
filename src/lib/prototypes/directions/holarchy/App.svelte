<script lang="ts">
  // E Holarchy: zoom from the lobby into a group and into a resource, as
  // nested rings. Handoff: E.jsx and "E Holarchy.html". Contract:
  // src/lib/prototypes/README.md.
  //
  // Where you are lives in the URL, so every level is linkable:
  //   lobby                     all your groups
  //   ?view=group&group=G       one group; &ndo=N marks the inspected NDO
  //   ?view=ndo&group=G&ndo=N   one NDO as concentric rings
  // A record that no longer exists (after "Start over", say) falls back one
  // level, and the URL is corrected to match.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { FlowMenu, ModalHost, Toasts, Onboarding, modals } from '$lib/prototypes/ui';
  import { paths } from '$lib/paths';
  import { currentView, currentRecord, goView } from '$lib/prototypes/url.svelte';
  import type { ViewOf } from '$lib/prototypes/directions';
  import LobbyLevel from './LobbyLevel.svelte';
  import GroupLevel from './GroupLevel.svelte';
  import NdoLevel from './NdoLevel.svelte';
  import HoloCard from './HoloCard.svelte';
  import { RING_COLOR, type Ring } from './geometry';

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
    const g = proto.q.group(rec.group)?.id;
    if (view === 'ndo') {
      const n = proto.q.ndo(rec.ndo);
      if (n && proto.q.group(n.group))
        return { view: 'ndo', at: { group: n.group, ndo: n.id }, sel: null };
      return g ? { view: 'group', at: { group: g }, sel: null } : lobby;
    }
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

  // Scrolling down on the canvas goes up a level. One level per gesture: a
  // trackpad fires many wheel events, so the next one waits out the zoom.
  let lastUp = 0;
  function onwheel(e: WheelEvent) {
    if (modals.current || e.deltaY <= 30) return;
    const now = Date.now();
    if (now - lastUp < 500) return;
    lastUp = now;
    up();
  }

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
    <img class="mark" src={paths.logoMark()} alt="Nondominium" width="32" height="32" />
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
      <i class="status" class:off={proto.s.offline}></i>
      {#if proto.s.offline}
        {proto.dev
          ? 'offline · traces queue locally'
          : 'offline · your changes are saved and will be shared later'}
      {:else}
        {proto.dev ? '23 peers hold this holon' : 'online · shared with 23 people'}
      {/if}
    </button>
    ·
    <button type="button" onclick={() => modals.open({ type: 'receipts' })}
      >{proto.s.receipts.length} receipts</button
    >
    ·
    <button type="button" class="reset" onclick={proto.actions.reset}>reset</button>
  </p>

  <ModalHost />
  <Toasts />
  <Onboarding onndo={toNdo} ongroup={toGroup} />
</div>

<style>
  .holarchy {
    position: relative;
    height: 100%;
    overflow: hidden;
    background: var(--ndo-color-bg-app);
    color: var(--ndo-color-text-primary);
    font-family: var(--ndo-font-sans);
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
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-semibold);
    padding: 6px 12px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    color: var(--ndo-color-text-secondary);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .crumbs button:hover {
    border-color: var(--ndo-color-text-primary);
  }
  .crumbs button.on {
    background: var(--ndo-color-text-primary);
    border-color: var(--ndo-color-text-primary);
    color: rgb(var(--ndo-color-card-bg));
  }
  .crumbs button:focus-visible,
  .peers button:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .crumbs em {
    color: var(--ndo-color-text-muted);
    font-style: normal;
  }
  .menu {
    margin-left: auto;
  }
  .zoom {
    margin: 0;
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-muted);
    white-space: nowrap;
  }
  .zoom b {
    font-family: var(--ndo-font-mono);
    font-weight: var(--ndo-weight-normal);
    color: var(--ndo-color-text-secondary);
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
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-xl);
    padding: 12px 16px;
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-secondary);
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

  /* Right of the card's bottom edge, clear of the comments button. */
  .peers {
    position: absolute;
    right: 92px;
    bottom: 40px;
    margin: 0;
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-muted);
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
    color: var(--ndo-color-text-primary);
  }
  .peers .reset {
    text-decoration: underline;
  }
  .status {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
    background: rgb(var(--ndo-green-600));
    border: 1.5px solid rgb(var(--ndo-green-600));
    vertical-align: 0;
  }
  .status.off {
    background: transparent;
    border-color: var(--ndo-color-text-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .zoom-in {
      animation: none;
    }
  }
</style>
