<script lang="ts">
  // The spec sheet: the left column of C Instrument. Stage, ownership, type
  // and use; the rules; the items with their holders; what needs attention;
  // and the requests on this resource.
  //
  // LEDs: the handoff's InSpec hardcodes the stage LED to teal regardless of
  // the actual stage (C.jsx line "stage" row: style={{background:'#119C8F'}}),
  // and only the item LED varies, from C.jsx's own LED map. Reproduced as is.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import type { Signal } from '$lib/prototypes/store/logic';
  import { plain } from '$lib/prototypes/plain';
  import { AgentAvatar, ErrorNote, modals } from '$lib/prototypes/ui';

  let { id }: { id: string } = $props();

  const n = $derived(proto.q.ndo(id)!);
  const rules = $derived(proto.s.rules[id] ?? []);
  const items = $derived(proto.s.instances[id] ?? []);
  const signals = $derived(proto.q.signalsOf(id));
  const requests = $derived(proto.q.commitmentsOf(id));
  const openRequests = $derived(requests.filter((c) => c.status === 'open').length);

  // C.jsx's LED map (const LED = {...}); items outside it fall back to mute.
  const ITEM_LED: Record<string, string> = {
    InUse: '#2E5FD1',
    Available: '#119C8F',
    InMaintenance: '#E0A21A',
    InStorage: '#7C8886',
    InTransit: '#E0A21A',
    Reserved: '#7445E0',
    PendingValidation: '#D8452F'
  };

  /** The last failed pick-up, shown under the list it came from. */
  let failed = $state<{ ndo: string; error: string } | null>(null);
  const error = $derived(failed?.ndo === id ? failed.error : null);

  function pickUp(sig: Signal) {
    const r = proto.actions.pickUp(sig);
    failed = r.ok ? null : { ndo: id, error: r.error };
  }
</script>

<aside class="spec">
  <p class="lbl">Shared resource</p>
  <h1>{n.name}</h1>
  {#if proto.dev}<p class="hash">#{n.hash}…</p>{/if}

  <table>
    <tbody>
      <tr>
        <td>stage</td>
        <td><span class="led"></span><b>{plain(n.stage)}</b> <button type="button" class="lnk" onclick={() => modals.open({ type: 'advance', ndo: id })}>change</button></td>
      </tr>
      <tr><td>ownership</td><td><b>{plain(n.regime)}</b></td></tr>
      <tr><td>type</td><td><b>{plain(n.nature)}</b></td></tr>
      <tr><td>use</td><td>{plain(n.rivalry)}</td></tr>
    </tbody>
  </table>

  <p class="lbl" style:margin-bottom="8px">Rules</p>
  <table>
    <tbody>
      {#each rules as [type, summary], i (i)}
        <tr><td>{plain(type)}</td><td>{plain(summary)}</td></tr>
      {:else}
        <tr><td>—</td><td>no rules</td></tr>
      {/each}
    </tbody>
  </table>
  <button type="button" class="lnk" onclick={() => modals.open({ type: 'rule', ndo: id })}>+ add rule</button>

  <p class="lbl" style:margin="12px 0 8px">Items <button type="button" class="lnk" onclick={() => modals.open({ type: 'resources', ndo: id })}>who holds them</button></p>
  {#each items as [label, state, holder], i (i)}
    <div class="inst">
      <span>{label}<br /><small class="holder"><AgentAvatar id={holder} size={14} />custodian {proto.q.agent(holder)}</small></span>
      <small><span class="led" style:background={ITEM_LED[state] ?? '#7C8886'}></span>{plain(state)}</small>
    </div>
  {/each}
  {#if !items.length}<div class="hash">no instances</div>{/if}

  <p class="lbl" style:margin="16px 0 8px">Needs attention · {signals.length}</p>
  {#each signals as g (g.id)}
    <div class="sg">
      <!-- The trailing space in "0/2 · " is load-bearing: it's what the
           original's text reads (verified: its own text node is "0/1 · ",
           not "0/1 ·"), and losing it changes where this line wraps
           against the "why?" button that follows (measured: on the "cnc"
           NDO's longer title, that shifted the whole card from 3 lines to
           2). Written as `{' · '}` rather than literal template whitespace
           because Svelte trims literal whitespace immediately before a
           block's `{/if}`. -->
      <div><b>{g.title}</b><small>{#if g.progress}{g.progress[0]}/{g.progress[1]}{' · '}{/if}<button type="button" class="lnk" onclick={() => modals.open({ type: 'why', sig: g, ndo: id })}>why?</button></small></div>
      <button type="button" class="btn sm" onclick={() => pickUp(g)}>{g.verb}</button>
    </div>
  {/each}
  <ErrorNote {error} />

  <p class="lbl" style:margin="16px 0 8px">Requests · {openRequests} open</p>
  {#each requests as c (c.id)}
    <div class="sg">
      <div><b>{plain(c.action)}</b><small>{proto.q.agent(c.provider)} → {proto.q.agent(c.receiver)} · {c.status === 'open' ? 'waiting' : 'done'}</small></div>
      {#if c.status === 'open'}<button type="button" class="btn sm" onclick={() => modals.open({ type: 'commitments', ndo: id })}>Mark done</button>{/if}
    </div>
  {/each}

  <div class="actions">
    <button type="button" class="btn ghost" onclick={() => modals.open({ type: 'commit', ndo: id })}>Ask to borrow</button>
    <button type="button" class="btn ghost" onclick={() => modals.open({ type: 'note', ndo: id })}>Log work</button>
  </div>
</aside>

<style>
  .spec {
    /* No font-size here: the original's `.spec` (`aside`) sets none either
       and inherits the page default (16px), and every visible text inside
       already carries its own explicit font (h1, table, .lbl, .lnk, .hash,
       .inst, .sg). A stray `font-size: 13px` here had no visible effect on
       any of that styled text, but it did change the invisible line-box
       "strut" used for the one bit of bare inline content in this
       component ("+ add rule", the sole content of its own line right
       after the rules table): a smaller ambient font here means a smaller
       strut, which lands that link 3px higher than the original (measured
       via boundingBox()) and drags every row below it up by the same
       amount. Removing the override restores the 16px strut the original
       gets for free. */
    background: #fff;
    border-right: 1px solid var(--grid);
    padding: 18px;
    overflow: auto;
  }
  .lbl {
    /* No margin of its own: the handoff sets it per instance inline
       (unset, 8, "12 0 8" or "16 0 8"), matched at each call site above. */
    margin: 0;
    font: 10px 'Space Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--mute);
  }
  h1 {
    margin: 6px 0 4px;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .hash {
    margin: 0 0 16px;
    font: 11px 'Space Mono', monospace;
    color: var(--mute);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 18px;
  }
  td {
    padding: 7px 0;
    border-top: 1px solid var(--grid);
  }
  td:first-child {
    font: 11px 'Space Mono', monospace;
    color: var(--mute);
    width: 42%;
  }
  td b {
    font-weight: 600;
  }

  .lnk {
    font: 11px 'Space Mono', monospace;
    color: var(--teal);
    cursor: pointer;
    text-decoration: underline;
    margin-left: 4px;
    padding: 0;
    border: none;
    background: none;
    /* The original's equivalent link is a <span>, which freely inherits
       ambient text properties. This is a <button> for accessibility, and
       the design system's own reset sets `button { appearance: button }`,
       which is the browser's native push-button widget: it silently drops
       inherited `text-transform` (the "who holds them" link should render
       "WHO HOLDS THEM" inside `.lbl`) and `letter-spacing` (measured 1px on
       the original's span, 'normal' on the unpatched button, which also
       narrowed the rendered text by 14px). `appearance: none` restores a
       plain box that inheritance actually applies to; `display: inline`
       matches the span's outer type (a bare button always computes
       `inline-block` regardless of the declared value, per the CSS Display
       spec's handling of native form controls, confirmed empirically:
       `appearance: button` forces it back even when `display: inline` is
       the last rule in the cascade). Verified via boundingBox(): both links
       now match the original exactly (position, width, text-transform). */
    appearance: none;
    text-transform: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
    display: inline;
  }

  .inst {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 8px 10px;
    border: 1px solid var(--grid);
    border-radius: 4px;
    margin-bottom: 6px;
    font-size: 12px;
  }
  .inst small {
    font: 11px 'Space Mono', monospace;
    color: var(--mute);
  }
  .holder {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .sg {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border: 1px solid #f0d48a;
    background: #fff8e6;
    border-radius: 4px;
    margin-bottom: 6px;
    font-size: 12px;
  }
  /* The original's `.sg>b{display:block;font-weight:600}` targets a direct
     child, but its markup nests <b> one level deeper (`.sg > div > b`), so
     the selector never matches and NEITHER declaration ever applies: title
     and progress render inline (wrapping together, e.g. "in0/1 · why?" on
     one line), and the weight falls back to the browser default for <b>
     (bold, 700), not the sheet's stated 600. A computed-style check on the
     served original confirms 700. Matching the actual rendered behaviour,
     not the unreachable rule, by leaving `<b>` here with no font-weight
     override at all (its own default is bold). A real 700-vs-600 gap was
     caught this way: on "Check and approve Urban Rhythms..." it was enough
     to change the wrap point (2 lines here vs 3 in the original), shifting
     every row below by a full line height. */
  .sg small {
    font: 11px 'Space Mono', monospace;
    color: var(--mute);
  }
  .sg .btn {
    margin-left: auto;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
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
  .btn.sm {
    padding: 5px 9px;
    font-size: 11px;
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

  /* The stage LED is always teal (C.jsx hardcodes it); items vary by
     operational state, set inline above from the LED map. */
  .led {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background: var(--teal);
  }
</style>
