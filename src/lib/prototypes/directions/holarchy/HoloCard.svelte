<script lang="ts">
  // The right card. With nothing selected it introduces the level and offers
  // what you can start from there. With an NDO selected (group level) or
  // entered (NDO level) it summarises each ring, what needs attention, the
  // recent activity, and the actions for it.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { plain, stageLabel } from '$lib/prototypes/plain';
  import { fmtAgo } from '$lib/prototypes/store/logic';
  import { modals, AgentAvatar, ErrorNote } from '$lib/prototypes/ui';
  import { RING_COLOR, type Ring } from './geometry';

  interface Props {
    at: { group?: string; ndo?: string };
    sel: string | null;
    focus: Ring | null;
    onfocus: (ring: Ring | null) => void;
    /** Enter an NDO (its group is looked up). */
    onndo: (ndoId: string) => void;
    /** Open a group. */
    ongroup: (groupId: string) => void;
  }

  let { at, sel, focus, onfocus, onndo, ongroup }: Props = $props();

  const id = $derived(at.ndo ?? sel);
  const group = $derived(proto.q.group(at.group));
  const n = $derived(proto.q.ndo(id));

  // An error belongs to the NDO it was raised on: switching NDO drops it.
  let failed = $state<{ id: string | null | undefined; error: string } | null>(null);
  const error = $derived(failed && failed.id === id ? failed.error : null);
  let copied = $state(false);

  const sg = $derived(id ? proto.q.signalsOf(id) : []);
  const rules = $derived(id ? (proto.s.rules[id] ?? []) : []);
  const inst = $derived(id ? (proto.s.instances[id] ?? []) : []);
  const links = $derived(
    id
      ? proto.q.hardLinksOf(id).map((h, i) => {
          const out = h.from === id;
          const other = proto.q.ndo(out ? h.to : h.from)?.name ?? '';
          return {
            key: i,
            dir: out ? 'outgoing' : 'incoming',
            text: out
              ? 'This ' + plain(h.type) + ' ' + other
              : other + ' ' + plain(h.type) + ' this'
          };
        })
      : []
  );
  const traces = $derived(id ? proto.q.tracesOf(id).slice(0, 3) : []);

  const rows = $derived<{ k: Ring; title: string; sub: string; layer: string }[]>(
    n
      ? [
          {
            k: 'id',
            title: 'What it is',
            sub: `${plain(n.stage)} · ${plain(n.regime)} · ${plain(n.nature)}`,
            layer: 'L0'
          },
          {
            k: 'rules',
            title: rules.length + ' rules go with it',
            sub: rules.map((r) => plain(r[0])).join(' · ') || 'none',
            layer: 'L1'
          },
          {
            k: 'inst',
            title: inst.length + (inst.length === 1 ? ' item' : ' items'),
            sub: inst.map((i) => i[0] + ' · ' + plain(i[1])).join(', ') || 'none',
            layer: 'L2'
          },
          {
            k: 'slots',
            title: links.length + (links.length === 1 ? ' linked resource' : ' linked resources'),
            sub: links.map((x) => x.text).join(' · ') || 'none',
            layer: 'links'
          }
        ]
      : []
  );

  function createNdo() {
    modals.open({ type: 'create', after: onndo });
  }

  function copyInvite() {
    if (!group) return;
    navigator.clipboard?.writeText(group.invite).then(
      () => {
        copied = true;
        setTimeout(() => (copied = false), 1600);
      },
      () => {}
    );
  }

  function pickUp(sig: (typeof sg)[number]) {
    const r = proto.actions.pickUp(sig);
    failed = r.ok ? null : { id, error: r.error };
  }
</script>

<aside class="card" aria-label="Summary">
  {#if !n}
    <p class="k">{at.group ? 'Group' : 'Lobby'}</p>
    <h2>{at.group ? group?.name : 'Your holarchy'}</h2>
    <p class="p">
      {at.group
        ? 'Click a resource once to inspect it, twice to enter it.'
        : 'Each circle is a group you belong to. Click one to zoom in.'}
    </p>
    <div class="cta">
      <button type="button" class="pbtn" onclick={createNdo}>+ Add resource</button>
      {#if !at.group}
        <button
          type="button"
          class="gbtn"
          onclick={() => modals.open({ type: 'group', after: ongroup })}>+ New group</button
        >
        <button
          type="button"
          class="gbtn"
          onclick={() => modals.open({ type: 'join', after: ongroup })}>→ Join group</button
        >
      {:else}
        <button type="button" class="gbtn" onclick={copyInvite}
          >{copied ? '✓ Copied' : '⎘ Copy invite link'}</button
        >
      {/if}
    </div>
  {:else}
    <p class="k">Shared resource</p>
    <h2>{n.name}</h2>

    {#each rows as r (r.k)}
      {#if at.ndo}
        <button
          type="button"
          class="ring"
          class:on={focus === r.k}
          aria-pressed={focus === r.k}
          onclick={() => onfocus(focus === r.k ? null : r.k)}
        >
          <i style:border-color={RING_COLOR[r.k]}></i>
          <span><b>{r.title}</b><br /><small>{r.sub}</small></span>
          {#if proto.dev}<small class="mono">{r.layer}</small>{/if}
        </button>
      {:else}
        <div class="ring static">
          <i style:border-color={RING_COLOR[r.k]}></i>
          <span><b>{r.title}</b><br /><small>{r.sub}</small></span>
          {#if proto.dev}<small class="mono">{r.layer}</small>{/if}
        </div>
      {/if}
      {#if at.ndo && focus === r.k && r.k !== 'id'}
        <div class="detail">
          {#if r.k === 'slots'}
            {#each links as x (x.key)}
              <div><span>{x.text}</span><small>{x.dir}</small></div>
            {:else}
              <div><small>No linked resources yet.</small></div>
            {/each}
          {:else if r.k === 'rules'}
            {#each rules as [type, summary], i (i)}
              <div><span>{plain(type)}</span><small>{plain(summary)}</small></div>
            {:else}
              <div><small>No rules yet.</small></div>
            {/each}
          {:else}
            {#each inst as [label, state, holder], i (i)}
              <div><span>{label}</span><small>{plain(state)} · {proto.q.agent(holder)}</small></div>
            {:else}
              <div><small>No items yet.</small></div>
            {/each}
          {/if}
        </div>
      {/if}
    {/each}

    {#if sg.length}
      <p class="k sub-k">Needs attention · {sg.length}</p>
      {#each sg as g (g.id)}
        <div class="sgr">
          <span>{g.title}</span>
          <button type="button" class="mini" onclick={() => pickUp(g)}>{g.verb}</button>
          <button
            type="button"
            class="mini quiet"
            title="Why am I seeing this?"
            aria-label="Why am I seeing this?"
            onclick={() => n && modals.open({ type: 'why', sig: g, ndo: n.id })}>?</button
          >
        </div>
      {/each}
      <ErrorNote {error} />
    {/if}

    {#if at.ndo}
      <p class="k sub-k">Recent activity</p>
      {#each traces as t (t.id)}
        <div class="sgr" class:pending={t.status !== 'validated'}>
          <span class="who">
            <AgentAvatar id={t.agent} size={16} />
            <span><b>{proto.q.agent(t.agent)}</b> {t.text}</span>
          </span>
          <small>{t.status === 'validated' ? fmtAgo(t.ago) : stageLabel(t.status, proto.dev)}</small>
        </div>
      {:else}
        <p class="p small">Nothing has happened here yet.</p>
      {/each}
    {/if}

    <div class="cta">
      {#if at.ndo}
        <button
          type="button"
          class="pbtn"
          onclick={() => modals.open({ type: 'attach', ndo: n.id })}>Link resource</button
        >
      {:else}
        <button type="button" class="pbtn" onclick={() => onndo(n.id)}>Enter this holon</button>
      {/if}
      <button type="button" class="gbtn" onclick={() => modals.open({ type: 'note', ndo: n.id })}
        >Log work</button
      >
      {#if at.ndo}
        <button
          type="button"
          class="gbtn"
          onclick={() => modals.open({ type: 'advance', ndo: n.id })}>Lifecycle</button
        >
        <button
          type="button"
          class="gbtn"
          onclick={() => modals.open({ type: 'resources', ndo: n.id })}>Items</button
        >
        <button
          type="button"
          class="gbtn"
          onclick={() => modals.open({ type: 'commitments', ndo: n.id })}>Requests</button
        >
        <button type="button" class="gbtn" onclick={() => modals.open({ type: 'rule', ndo: n.id })}
          >+ Rule</button
        >
      {/if}
    </div>
  {/if}
</aside>

<style>
  .card {
    position: absolute;
    right: 28px;
    top: 86px;
    width: 340px;
    max-height: calc(100% - 170px);
    overflow: auto;
    background: rgb(var(--ndo-color-card-bg));
    color: var(--ndo-color-text-primary);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-xl);
    padding: 22px;
    box-shadow: var(--ndo-shadow-xl);
    z-index: 2;
  }
  .k {
    margin: 0;
    font-size: 11px;
    font-weight: var(--ndo-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ndo-color-text-muted);
  }
  .sub-k {
    margin: 12px 0 6px;
  }
  h2 {
    font-size: var(--ndo-text-2xl);
    font-weight: var(--ndo-weight-bold);
    letter-spacing: -0.02em;
    margin: 6px 0 12px;
    line-height: 1.1;
  }
  .p {
    margin: 0;
    font-size: var(--ndo-text-sm);
    color: var(--ndo-color-text-secondary);
    line-height: 1.5;
  }
  .p.small {
    font-size: var(--ndo-text-xs);
    padding: 4px 0;
  }
  .ring {
    display: grid;
    grid-template-columns: 14px 1fr auto;
    gap: 10px;
    align-items: center;
    width: 100%;
    padding: 10px 6px;
    border: none;
    border-top: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: none;
    font: inherit;
    font-size: 13px;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .ring.static {
    cursor: default;
  }
  .ring:not(.static):hover,
  .ring.on {
    background: var(--ndo-color-bg-app);
  }
  .ring:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .ring i {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 3px solid;
  }
  .ring small {
    color: var(--ndo-color-text-muted);
    font-size: 12px;
  }
  .ring b {
    font-weight: var(--ndo-weight-bold);
  }
  .mono {
    font-family: var(--ndo-font-mono);
  }
  .detail {
    background: var(--ndo-color-bg-app);
    border-radius: var(--ndo-radius-lg);
    padding: 8px 10px;
    margin: 4px 0 6px;
    font-size: 12px;
  }
  .detail div {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 4px 0;
  }
  .detail small {
    color: var(--ndo-color-text-muted);
    text-align: right;
  }
  .sgr {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 13px;
    padding: 6px 0;
    border-bottom: 1px solid var(--ndo-color-border);
  }
  .sgr > span:first-child {
    flex: 1;
  }
  .sgr small {
    color: var(--ndo-color-text-muted);
    font-size: 11px;
    white-space: nowrap;
  }
  .sgr.pending {
    opacity: 0.7;
  }
  .who {
    display: flex;
    gap: 6px;
    align-items: flex-start;
  }
  .mini {
    font: inherit;
    font-size: 12px;
    font-weight: var(--ndo-weight-bold);
    background: rgb(var(--ndo-amber-100));
    color: rgb(var(--ndo-amber-800));
    padding: 4px 9px;
    border: none;
    border-radius: var(--ndo-radius-pill);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .mini:hover {
    background: rgb(var(--ndo-amber-50));
    box-shadow: inset 0 0 0 1px rgb(var(--ndo-amber-600));
  }
  .mini.quiet {
    background: var(--ndo-color-bg-app);
    color: var(--ndo-color-text-secondary);
  }
  .mini.quiet:hover {
    box-shadow: inset 0 0 0 1px var(--ndo-color-border-strong);
  }
  .mini:focus-visible,
  .pbtn:focus-visible,
  .gbtn:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .cta {
    display: flex;
    gap: 8px;
    margin-top: 14px;
    flex-wrap: wrap;
  }
  .cta button {
    flex: 1;
    font: inherit;
    font-size: 13px;
    font-weight: var(--ndo-weight-bold);
    padding: 10px;
    border: none;
    border-radius: var(--ndo-radius-lg);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .pbtn {
    background: var(--proto-accent, rgb(var(--ndo-blue-600)));
    color: rgb(255 255 255);
  }
  .pbtn:hover {
    background: var(--proto-accent-hover, rgb(var(--ndo-blue-700)));
  }
  .gbtn {
    background: var(--ndo-color-bg-app);
    color: var(--ndo-color-text-primary);
  }
  .gbtn:hover {
    background: var(--ndo-color-border);
  }
</style>
