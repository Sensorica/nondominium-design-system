<script lang="ts">
  // The resource drawer (D.jsx SbDrawer): one NDO's classification, its
  // actions, its requests, the signals it emits, its trail and the resources
  // linked to it. It slides over the board from the right; the backdrop,
  // the close button and Escape all close it.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { fmtAgo, freshness, type Signal } from '$lib/prototypes/store/logic';
  import { plain, stageLabel } from '$lib/prototypes/plain';
  import { AgentAvatar, ErrorNote, modals, type ModalRequest } from '$lib/prototypes/ui';
  import { ROW_FADE } from './lanes';

  let { id, onclose }: { id: string; onclose: () => void } = $props();

  const n = $derived(proto.q.ndo(id));
  const group = $derived(n ? proto.q.group(n.group) : undefined);
  const commitments = $derived(proto.q.commitmentsOf(id));
  const signals = $derived(proto.q.signalsOf(id));
  const trail = $derived(proto.q.tracesOf(id));
  const links = $derived(proto.q.hardLinksOf(id));

  // An error belongs to the NDO it was raised on: switching NDO drops it.
  let failed = $state<{ id: string; error: string } | null>(null);
  const error = $derived(failed && failed.id === id ? failed.error : null);

  function pickUp(sig: Signal) {
    const r = proto.actions.pickUp(sig);
    failed = r.ok ? null : { id, error: r.error };
  }

  const open = (req: ModalRequest) => () => modals.open(req);

  // Labels are D.jsx's own words for its dact row, verbatim (its FlowMenu
  // entries phrase a couple of these differently; the drawer button is the
  // source of truth here).
  const actions = $derived<{ label: string; req: ModalRequest; primary?: boolean }[]>([
    { label: 'Log work', req: { type: 'note', ndo: id }, primary: true },
    { label: 'Link NDO', req: { type: 'attach', ndo: id } },
    { label: 'Lifecycle', req: { type: 'advance', ndo: id } },
    { label: 'Items', req: { type: 'resources', ndo: id } },
    { label: 'Ask to borrow', req: { type: 'commit', ndo: id } },
    { label: '+ Rule', req: { type: 'rule', ndo: id } }
  ]);

  function onkeydown(e: KeyboardEvent) {
    // A shared modal on top of the drawer handles its own Escape.
    if (e.key === 'Escape' && !modals.current) onclose();
  }
</script>

<svelte:window {onkeydown} />

{#if n}
  <div class="wrap">
    <button type="button" class="backdrop" aria-label="Close the resource" onclick={onclose}></button>
    <aside class="drawer" aria-label={n.name}>
      <button type="button" class="x" aria-label="Close" onclick={onclose}>✕</button>
      <div class="res">{group?.name ?? ''}{proto.dev ? ' · ' + n.hash : ''}</div>
      <h2>{n.name}</h2>
      <div class="pills">
        <span class="pill">{plain(n.stage)}</span>
        <span class="pill">{plain(n.regime)}</span>
        <span class="pill">{plain(n.nature)}</span>
        <span class="pill">{plain(n.rivalry)}</span>
      </div>
      {#if n.desc}<p class="desc">{n.desc}</p>{/if}
      <div class="dact">
        {#each actions as a (a.label)}
          <button type="button" class="take" class:ghost={!a.primary} onclick={open(a.req)}>{a.label}</button>
        {/each}
      </div>

      <h4>Requests</h4>
      {#each commitments as c (c.id)}
        <div class="drow" class:done={c.status !== 'open'}>
          <span><b>{plain(c.action)}</b> {proto.q.agent(c.provider)} → {proto.q.agent(c.receiver)}</span>
          {#if c.status === 'open'}
            <button type="button" class="take" onclick={open({ type: 'commitments', ndo: id })}>Mark done</button>
          {:else}
            <span class="muted">claimed</span>
          {/if}
        </div>
      {:else}
        <div class="muted">No requests.</div>
      {/each}

      <h4>Signals from this resource</h4>
      {#each signals as g (g.id)}
        <div class="drow">
          <span>{g.title}</span>
          <button type="button" class="take" onclick={() => pickUp(g)}>{g.verb}</button>
        </div>
      {:else}
        <div class="muted">Quiet. No open signals.</div>
      {/each}
      <ErrorNote {error} />

      <h4>Trail</h4>
      {#each trail as t (t.id)}
        <div class="drow" style:opacity={ROW_FADE[freshness(t.ago)]}>
          <span class="who">
            <AgentAvatar id={t.agent} size={18} />
            <span><b>{proto.q.agent(t.agent)}</b> {t.text}{#if t.note}<em> “{t.note}”</em>{/if}</span>
          </span>
          <span class="muted mono when">{t.status === 'validated' ? fmtAgo(t.ago) : stageLabel(t.status, proto.dev)}</span>
        </div>
      {/each}

      <h4>Linked resources</h4>
      {#if links.length}
        <div class="pills">
          {#each links as h, i (i)}
            <span class="pill">{plain(h.type)} {h.from === id ? '→' : '←'} {proto.q.ndo(h.from === id ? h.to : h.from)?.name ?? ''}</span>
          {/each}
        </div>
      {:else}
        <div class="muted">None.</div>
      {/if}
    </aside>
  </div>
{/if}

<style>
  .wrap {
    position: fixed;
    inset: 0;
    z-index: 30;
  }
  .backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: rgba(16, 20, 24, 0.25);
    cursor: default;
  }
  .drawer {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 440px;
    max-width: 100vw;
    overflow: auto;
    padding: 26px 26px 72px;
    background: #fff;
    color: var(--ink);
    box-shadow: -20px 0 40px -20px rgba(0, 0, 0, 0.3);
    animation: slide 250ms ease;
  }
  @keyframes slide {
    from {
      transform: translateX(40px);
      opacity: 0;
    }
  }
  .x {
    position: absolute;
    right: 18px;
    top: 18px;
    border: 0;
    background: none;
    font-size: 16px;
    color: var(--mute);
    cursor: pointer;
    border-radius: 4px;
  }
  .x:hover {
    color: var(--ink);
  }
  .x:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
  .res {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--ink2);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding-right: 28px;
    overflow-wrap: anywhere;
  }
  h2 {
    margin: 6px 0 10px;
    font-size: 28px;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .desc {
    /* The original never sets a margin on this <p>, relying on the
     * browser's UA default (1em top and bottom). The design system's global
     * reset (UnoCSS's Tailwind preflight) zeroes every <p>'s margin, so it
     * has to be restored explicitly here to keep the original's spacing. */
    margin: 1em 0;
    color: var(--ink2);
    font-size: 14px;
  }
  h4 {
    margin: 20px 0 8px;
    font-size: 14px;
  }
  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  /* One uniform pill in the original: no per-kind tint or dashed variant. */
  .pill {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 9px;
    border-radius: 999px;
    background: var(--bg);
    border: 1px solid var(--line);
  }
  .dact {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .drow {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--line);
    font-size: 13px;
  }
  .drow.done {
    opacity: 0.5;
  }
  .who {
    display: inline-flex;
    gap: 6px;
    align-items: flex-start;
  }
  em {
    color: var(--ink2);
  }
  .muted {
    color: var(--mute);
    font-size: 12px;
  }
  .mono {
    font-family: 'DM Mono', monospace;
  }
  .when {
    flex-shrink: 0;
    text-align: right;
    max-width: 45%;
  }
</style>
