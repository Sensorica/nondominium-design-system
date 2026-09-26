<script lang="ts">
  // The register's index (FnIndex in B.jsx): search, then one collapsible
  // section per group listing its NDOs with their ink bars.
  import { paths } from '$lib/paths';
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { FlowMenu, modals } from '$lib/prototypes/ui';
  import { plain } from '$lib/prototypes/plain';
  import type { Ndo } from '$lib/prototypes/store/logic';
  import InkBars from './InkBars.svelte';

  let { sel, onselect }: { sel: string | null; onselect: (id: string) => void } = $props();

  let q = $state('');
  let shut = $state<Record<string, boolean>>({});

  const QUIET = ['Hibernating', 'Deprecated', 'EndOfLife'];

  // The handoff matched the raw enums; the plain words the index shows match too.
  function match(n: Ndo): boolean {
    if (!q) return true;
    const hay = [n.name, n.regime, n.stage, n.nature, plain(n.regime), plain(n.stage), plain(n.nature)].join(' ');
    return hay.toLowerCase().includes(q.toLowerCase());
  }

  const sections = $derived(
    proto.s.groups.map((g) => ({ group: g, list: proto.s.ndos.filter((n) => n.group === g.id && match(n)) }))
  );

  function toggle(id: string) {
    shut = { ...shut, [id]: !shut[id] };
  }
</script>

<aside class="index">
  <div class="brand">
    <img class="mark" src={paths.logoMark()} alt="" width="30" height="30" />
    <span class="name">Nondominium</span>
    <div class="menu">
      <FlowMenu ndo={sel} onOpen={onselect} align="left" label="Flows" />
    </div>
  </div>

  <input class="search" type="search" placeholder="Search the commons register…" aria-label="Search the register" bind:value={q} />

  {#each sections as { group, list } (group.id)}
    <button type="button" class="idxh" aria-expanded={!shut[group.id]} onclick={() => toggle(group.id)}>
      <span>{group.name} · register</span>
      <span>{list.length} {shut[group.id] ? '▸' : '▾'}</span>
    </button>
    {#if !shut[group.id]}
      {#each list as n (n.id)}
        {@const signals = proto.q.signalsOf(n.id).length}
        <button type="button" class="entry" class:on={sel === n.id} onclick={() => onselect(n.id)}>
          <b class:quiet={QUIET.includes(n.stage)}>{n.name}</b>
          <small>
            {plain(n.stage)} · {plain(n.regime)}{#if signals}<span class="left"> · {signals} left for you</span>{/if}
          </small>
          <InkBars traces={proto.q.tracesOf(n.id)} />
        </button>
      {:else}
        <p class="foot empty">{q ? 'No entries match.' : 'No NDOs in this group yet.'}</p>
      {/each}
    {/if}
  {/each}

  <div class="idxfoot">
    <button type="button" class="btn" onclick={() => modals.open({ type: 'create', after: onselect })}>Open a new entry</button>
    <span class="links">
      <button type="button" class="link" onclick={() => modals.open({ type: 'group' })}>+ New group</button>
      <button type="button" class="link" onclick={() => modals.open({ type: 'join' })}>→ Join group</button>
      <button type="button" class="link" onclick={() => modals.open({ type: 'browse', onOpen: onselect })}>Browse</button>
    </span>
    <span class="foot">Ink bars show traces per 4 days, newest on the right.</span>
  </div>
</aside>

<style>
  .index {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: auto;
    /* Bottom padding keeps the footer clear of the prototype exit chip. */
    padding: 22px 20px 64px;
    border-right: 1px solid var(--fn-rule);
    background: var(--fn-paper2);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 22px;
  }
  .mark {
    display: block;
    width: 30px;
    height: 30px;
  }
  .name {
    font-size: var(--ndo-text-xl);
    font-weight: var(--ndo-weight-medium);
    letter-spacing: -0.01em;
  }
  .menu {
    margin-left: auto;
  }

  .search {
    width: 100%;
    margin-bottom: 10px;
    padding: 6px 0;
    border: 0;
    border-bottom: 1px solid var(--fn-ink2);
    border-radius: 0;
    background: transparent;
    color: var(--fn-ink);
    font: italic var(--ndo-text-base) var(--ndo-font-sans);
    outline: none;
  }
  .search:focus-visible {
    border-bottom-color: var(--fn-teal);
    box-shadow: 0 1px 0 var(--fn-teal);
  }

  .idxh {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 16px 0 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--fn-mute);
    font-family: inherit;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: left;
    cursor: pointer;
  }
  .idxh:hover {
    color: var(--fn-ink);
  }

  .entry {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 10px;
    width: 100%;
    padding: 9px 0;
    border: 0;
    border-bottom: 1px solid var(--fn-rule);
    background: none;
    color: inherit;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
  }
  .entry b {
    font-size: var(--ndo-text-base);
    font-weight: var(--ndo-weight-medium);
  }
  .entry b.quiet {
    color: var(--fn-mute);
  }
  .entry:hover b,
  .entry.on b {
    color: var(--fn-teal);
  }
  .entry.on {
    border-bottom-color: var(--fn-teal);
  }
  .entry small {
    grid-column: 1;
    font-size: 11px;
    color: var(--fn-mute);
  }
  .left {
    color: var(--fn-rust);
  }

  .idxfoot {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
    padding-top: 18px;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--fn-teal);
    font: inherit;
    font-size: 13px;
    text-decoration: underline;
    cursor: pointer;
  }
  .link:hover {
    color: var(--fn-ink);
  }

  .btn {
    padding: 9px 14px;
    border: 0;
    border-radius: var(--ndo-radius-sm);
    background: rgb(var(--ndo-gray-900));
    color: rgb(255 255 255);
    font-family: inherit;
    font-size: 13px;
    font-weight: var(--ndo-weight-medium);
    white-space: nowrap;
    cursor: pointer;
  }
  .btn:hover {
    background: var(--fn-teal);
  }

  button:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  .foot {
    font-size: 11px;
    line-height: 1.6;
    color: var(--fn-mute);
  }
  .empty {
    margin: 6px 0;
  }

  @media (max-width: 1180px) {
    .index {
      grid-row: 1 / 3;
      grid-column: 1;
    }
  }
</style>
