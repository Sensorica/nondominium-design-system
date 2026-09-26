<script lang="ts">
  // The right panel. Nothing selected: the scenario picker and its guided
  // steps. A card selected: what it is in plain words, who holds it, what it
  // is connected to, its history, and what the current person can do with it.
  // Every form maps one to one onto a zome call's input.
  import { friendly } from '$lib/prototypes/plain';
  import { focusOnMount } from '$lib/prototypes/ui';
  import Badge from './Badge.svelte';
  import { CONDUCTORS, SCENARIO_ORDER, TYPES, type AgentKey } from './backend';
  import {
    HIDE,
    LANE_COL,
    aname,
    badges,
    fieldLabel,
    fieldsOf,
    hhmm,
    laneOf,
    optionLabel,
    short,
    sub,
    title,
    tok,
    typeWord,
    type ActionDef,
    type Ctx,
    type Entry,
    type Persp
  } from './model';

  interface Props {
    ctx: Ctx;
    persp: Persp;
    writer: AgentKey;
    sel: Entry | null;
    vis: Entry[];
    actions: ActionDef[];
    current: ActionDef | null;
    vals: Record<string, string>;
    err: string | null;
    ok: string | null;
    onpick: (hash: string) => void;
    onclear: () => void;
    onaction: (id: string) => void;
    onval: (k: string, v: string) => void;
    oncancel: () => void;
    onsubmit: () => void;
    onscenario: (id: string) => void;
    onhide: () => void;
  }

  let { ctx, persp, writer, sel, vis, actions, current, vals, err, ok, onpick, onclear, onaction, onval, oncancel, onsubmit, onscenario, onhide }: Props = $props();

  const B = $derived(ctx.B);
  const dev = $derived(ctx.dev);
  const s = $derived(ctx.B.state);
  const who = (a: string) => aname(ctx.B, a);
  const writerName = $derived(who(writer));

  // ── Guide ──
  const sc = $derived(B.scenarios[s.scenario ?? 'equipment']);
  const perspTitle = $derived(
    dev
      ? persp === 'network'
        ? 'Whole network · ' + Object.keys(CONDUCTORS).length + ' conductors'
        : who(persp) + "'s conductor · :" + CONDUCTORS[persp].port
      : persp === 'network'
        ? "Seeing everyone's view"
        : 'Seeing what ' + who(persp) + ' sees'
  );
  const tries = $derived([...sc.tries, 'Any time · switch to the other conductor right after a call to watch entries arrive by gossip, or take one offline.']);
  const rep = $derived.by(() => {
    const r = B.derive_reputation_summary(writer);
    return [
      ['total_claims', r.total_claims],
      ['custody_claims', r.custody_claims],
      ['service_claims', r.service_claims],
      ['governance_claims', r.governance_claims]
    ] as const;
  });

  // ── Inspector ──
  function fmt(k: string, v: unknown): [string, string | null] {
    if (v == null || v === '') return ['none', null];
    if (typeof v === 'string' && s.entries[v]) return [short(v) + ' · ' + title(ctx, s.entries[v]), v];
    if (typeof v === 'string' && CONDUCTORS[v]) return [who(v) + ' · ' + CONDUCTORS[v].pubkey.slice(0, 10) + '…', null];
    if (typeof v === 'number' && /(_at|_time|due_date)$/.test(k)) return [new Date(v).toLocaleString(), null];
    if (typeof v === 'object') return [JSON.stringify(v), null];
    return [String(v), null];
  }
  const isMono = (k: string) => /hash|_as|conforms|fulfil|validated_item|signature/.test(k);

  const insp = $derived.by(() => {
    if (!sel) return null;
    const d = sel.data;
    const fields = Object.entries(d)
      .filter(([k]) => !HIDE.has(k))
      .map(([k, v]) => {
        const [txt, link] = fmt(k, v);
        return { k, v: txt, link };
      });
    const links: { dir: string; field: string; title: string; to: string }[] = [];
    for (const [f] of TYPES[sel.type].refs) {
      const t = d[f] as string | undefined;
      if (t && s.entries[t] && !HIDE.has(f)) links.push({ dir: '→', field: dev ? f : '', title: typeWord(s.entries[t].type, dev) + ' · ' + title(ctx, s.entries[t]), to: t });
    }
    for (const e of vis)
      for (const [f] of TYPES[e.type].refs)
        if (e.data[f] === sel.hash && !HIDE.has(f)) links.push({ dir: '←', field: dev ? f : '', title: typeWord(e.type, dev) + ' · ' + title(ctx, e), to: e.hash });

    const notes: string[] = [];
    if (dev) {
      if (sel.type === 'Claim') notes.push('Backend gap: claim_commitment sets fulfilled_by to the commitment hash, not the EconomicEvent (TODO in commitment.rs). The event is linked through the PPRs instead.');
      if (sel.type === 'EconomicEvent' && d.action === 'TransferCustody') notes.push('transfer_custody does not log this event itself. The UI calls log_economic_event right after it.');
      if (sel.private) notes.push('Private entry. It stays on ' + who(sel.author) + "'s source chain and never gossips.");
      if (sel.type === 'NondominiumIdentity') notes.push('Only the initiator (' + who(d.initiator) + ') may call update_lifecycle_stage in the MVP.');
    } else {
      if (sel.private) notes.push('Only ' + who(sel.author) + ' can see this receipt. It is never shared.');
      if (sel.type === 'NondominiumIdentity') notes.push('Only ' + who(d.initiator) + ', who created it, can change its stage.');
    }

    const held = Object.keys(CONDUCTORS).map((a) => {
      const hv = sel.held[a];
      const own = sel.author === a;
      const text = !dev
        ? own
          ? 'Created by ' + who(a)
          : sel.private
            ? 'Hidden from ' + who(a)
            : hv
              ? who(a) + ' has it'
              : who(a) + ' will get it soon'
        : own
          ? 'on ' + who(a) + "'s chain"
          : sel.private
            ? 'not shared with ' + who(a)
            : hv
              ? 'held by ' + who(a)
              : 'not yet at ' + who(a);
      return { text, has: own || !!hv };
    });

    const show = (v: unknown) =>
      v == null ? 'none' : CONDUCTORS[v as string] ? who(v as string) : typeof v === 'string' && s.entries[v] ? short(v) : String(v);
    const history = sel.updates.map((u) => ({
      time: hhmm(u.ts).slice(0, 5),
      fn: u.fn,
      text:
        Object.keys(u.patch)
          .filter((k) => !HIDE.has(k))
          .map((k) => k + ': ' + show(u.before[k]) + ' → ' + show(u.patch[k]))
          .join(', ') +
        ' · ' +
        who(u.author)
    }));

    return {
      type: typeWord(sel.type, dev),
      title: title(ctx, sel),
      summary: sub(ctx, sel),
      dot: tok(LANE_COL[laneOf(sel)]),
      badges: badges(ctx, sel),
      call: sel.zome + '::' + sel.fn,
      author: who(sel.author),
      time: hhmm(sel.ts),
      fields,
      links,
      notes,
      held,
      history
    };
  });

  // ── Form ──
  const form = $derived(current ? { a: current, ...fieldsOf(current, vals) } : null);
  const errText = $derived(err ? (dev ? err : friendly(err, { stripCallPrefix: true })) : '');
</script>

<aside class="panel">
  <button type="button" class="hide" title="Hide panel" aria-label="Hide panel" onclick={onhide}>›</button>

  {#if !insp && !form}
    <div class="stack">
      <div class="kicker">{perspTitle}</div>
      <div class="h">{sc.title}</div>
      <p class="p">{sc.summary}</p>
      <div class="small">{Object.values(CONDUCTORS).map((a) => a.name + ' · ' + a.org).join('  ·  ')}</div>
      {#if sc.story}
        <div class="small">From <span class="mono">documentation/Applications/user-story/{sc.story}</span></div>
      {/if}
      <div class="kicker kicker--gap">Scenario</div>
      <div class="scenarios">
        {#each SCENARIO_ORDER as id (id)}
          {@const x = B.scenarios[id]}
          <button type="button" class="scenario" class:scenario--on={x.id === s.scenario} aria-pressed={x.id === s.scenario} onclick={() => onscenario(x.id)}>{x.title}</button>
        {/each}
      </div>
      <p class="note">Switching scenario resets the mock DHT. Each card is an entry written by a zome call; dashed cards have not reached this conductor yet.</p>
      <div class="kicker kicker--gap">Try</div>
      {#each tries as t, i (i)}
        <div class="try"><span class="mono muted">{i + 1}</span><span>{t}</span></div>
      {/each}
      <div class="rep">
        <div class="kicker">derive_reputation_summary · {writerName}</div>
        <div class="rep__grid">
          {#each rep as [k, v] (k)}
            <span class="rep__k">{k}</span><span class="mono">{v}</span>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if insp && sel}
    <div class="stack">
      <div class="insp-head">
        <span class="dot" style:background={insp.dot}></span>
        <span class="kicker">{insp.type}</span>
        <button type="button" class="close" aria-label="Clear selection" onclick={onclear}>✕</button>
      </div>
      <div class="h">{insp.title}</div>
      {#if insp.badges.length}
        <div class="badges">
          {#each insp.badges as b, i (i)}<Badge variant={b.variant} label={b.label} />{/each}
        </div>
      {/if}
      <div class="p p--tight">{insp.summary}</div>
      {#if dev}
        <div class="meta">
          <span class="mono hash">#{sel.hash}</span>
          <span><span class="mono">{insp.call}</span> · {insp.author} · {insp.time}</span>
        </div>
      {/if}
      <div class="held">
        {#each insp.held as h, i (i)}<span class="pill" class:pill--has={h.has}>{h.text}</span>{/each}
      </div>
      {#each insp.notes as w, i (i)}
        <div class="warn">⚠ {w}</div>
      {/each}

      {#if dev}
        <div class="kicker kicker--gap">Entry</div>
        <div class="fields">
          {#each insp.fields as f (f.k)}
            <span class="mono fields__k">{f.k}</span>
            {#if f.link}
              {@const to = f.link}
              <button type="button" class="fields__v fields__v--link" class:mono={isMono(f.k)} onclick={() => onpick(to)}>{f.v}</button>
            {:else}
              <span class="fields__v" class:mono={isMono(f.k)}>{f.v}</span>
            {/if}
          {/each}
        </div>
      {/if}

      {#if insp.links.length}
        <div class="kicker kicker--gap">{dev ? 'Linked entries' : 'Connected to'}</div>
        <div class="links">
          {#each insp.links as k, i (i)}
            <button type="button" class="link" onclick={() => onpick(k.to)}>
              <span class="mono muted">{k.dir}</span>
              {#if k.field}<span class="mono link__f">{k.field}</span>{/if}
              <span class="link__t">{k.title}</span>
            </button>
          {/each}
        </div>
      {/if}

      {#if insp.history.length}
        <div class="kicker kicker--gap">{dev ? 'Update chain' : 'History'}</div>
        {#each insp.history as u, i (i)}
          <div class="hist"><span class="mono muted">{u.time}</span><span><span class="mono">{u.fn}</span> · {u.text}</span></div>
        {/each}
      {/if}
    </div>
  {/if}

  {#if sel && actions.length && !form}
    <div class="actions">
      <div class="kicker">{dev ? 'Zome calls as' : 'What you can do as'} {writerName}</div>
      {#each actions as a (a.id)}
        <button type="button" class="action" onclick={() => onaction(a.id)}>
          <span class="action__l">{a.label}</span>
          {#if dev}<span class="mono action__c">{a.call}</span>{/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if form}
    <form
      class="form"
      onsubmit={(e) => {
        e.preventDefault();
        onsubmit();
      }}
    >
      <div class="form__head">
        <span class="form__l">{form.a.label}</span>
        {#if dev}<span class="mono action__c">{form.a.call}</span>{/if}
        {#if !sel}<span class="form__as">as {writerName}</span>{/if}
      </div>
      {#each form.fields as [k, l, kind, options], i (k)}
        <label class="field">
          <span class:mono={dev}>{fieldLabel(l, dev)}</span>
          {#if kind === 'select'}
            <select class="control" value={form.v[k] ?? ''} onchange={(e) => onval(k, e.currentTarget.value)}>
              {#each options ?? [] as [ov, ol] (ov)}
                <option value={ov}>{optionLabel(ov, ol, dev)}</option>
              {/each}
            </select>
          {:else if i === 0}
            <input class="control" type={kind === 'number' ? 'number' : 'text'} value={form.v[k] ?? ''} oninput={(e) => onval(k, e.currentTarget.value)} {@attach focusOnMount} />
          {:else}
            <input class="control" type={kind === 'number' ? 'number' : 'text'} value={form.v[k] ?? ''} oninput={(e) => onval(k, e.currentTarget.value)} />
          {/if}
        </label>
      {/each}
      {#if errText}
        <div class="error" role="alert">{errText}</div>
      {/if}
      <div class="form__foot">
        <button type="button" class="btn btn--ghost" onclick={oncancel}>Cancel</button>
        <button type="submit" class="btn btn--primary">Call</button>
      </div>
    </form>
  {/if}

  {#if ok && !form}
    <div class="ok" role="status">✓ {ok}</div>
  {/if}
</aside>

<style>
  .panel {
    width: 360px;
    flex-shrink: 0;
    background: rgb(var(--ndo-color-card-bg));
    border-left: 1px solid rgb(var(--ndo-gray-200));
    overflow: auto;
    overscroll-behavior: contain;
    padding: 20px 20px 72px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    font-family: var(--ndo-font-sans);
    color: rgb(var(--ndo-gray-900));
  }
  .hide.hide {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
    width: 28px;
    height: 28px;
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    border-radius: var(--ndo-radius-md);
    cursor: pointer;
    color: rgb(var(--ndo-gray-600));
    font-size: 14px;
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .kicker {
    font-size: 12px;
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-500));
  }
  .kicker--gap {
    margin-top: 4px;
  }
  .h {
    font-size: 20px;
    font-weight: var(--ndo-weight-bold);
    line-height: 1.3;
    padding-right: 32px;
    overflow-wrap: anywhere;
  }
  .p {
    margin: 0;
    font-size: 14px;
    line-height: 1.55;
    color: rgb(var(--ndo-gray-600));
  }
  .p--tight {
    line-height: 1.5;
  }
  .small {
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
  }
  .note {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: rgb(var(--ndo-gray-500));
  }
  .mono {
    font-family: var(--ndo-font-mono);
  }
  .muted {
    color: rgb(var(--ndo-gray-400));
  }
  .scenarios {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .scenario.scenario {
    text-align: left;
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    color: rgb(var(--ndo-gray-700));
    border-radius: var(--ndo-radius-md);
    padding: 6px 10px;
    font: inherit;
    font-size: 12px;
    font-weight: var(--ndo-weight-medium);
    cursor: pointer;
  }
  .scenario--on.scenario--on {
    border-color: rgb(var(--ndo-blue-600));
    background: rgb(var(--ndo-blue-50));
    color: rgb(var(--ndo-blue-700));
  }
  .try {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: rgb(var(--ndo-gray-700));
  }
  .rep {
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    padding: 12px 16px;
    background: rgb(var(--ndo-gray-50));
  }
  .rep__grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 12px;
    font-size: 14px;
    margin-top: 8px;
  }
  .rep__k {
    color: rgb(var(--ndo-gray-600));
  }

  .insp-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 36px;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .close.close {
    margin-left: auto;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: rgb(var(--ndo-gray-400));
    font-size: 16px;
    padding: 2px 6px;
    border-radius: var(--ndo-radius-sm);
  }
  .close.close:hover {
    background: rgb(var(--ndo-gray-100));
  }
  .badges {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
  }
  .hash {
    color: rgb(var(--ndo-gray-700));
    word-break: break-all;
  }
  .held {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .pill {
    font-size: 12px;
    white-space: nowrap;
    padding: 2px 8px;
    border-radius: 12px;
    background: rgb(var(--ndo-gray-100));
    color: rgb(var(--ndo-gray-500));
    border: 1px dashed rgb(var(--ndo-gray-300));
  }
  .pill--has {
    background: rgb(var(--ndo-green-50));
    color: rgb(var(--ndo-green-700));
    border: 1px solid rgb(var(--ndo-green-100));
  }
  .warn {
    font-size: 12px;
    line-height: 1.5;
    background: rgb(var(--ndo-amber-50));
    color: rgb(var(--ndo-amber-800));
    border: 1px solid rgb(var(--ndo-amber-100));
    border-radius: var(--ndo-radius-md);
    padding: 8px 10px;
  }
  .fields {
    display: grid;
    grid-template-columns: 128px minmax(0, 1fr);
    gap: 6px 12px;
    font-size: 12px;
  }
  .fields__k {
    color: rgb(var(--ndo-gray-500));
    word-break: break-all;
  }
  .fields__v {
    color: rgb(var(--ndo-gray-900));
    word-break: break-word;
  }
  .fields__v--link.fields__v--link {
    color: rgb(var(--ndo-blue-600));
    cursor: pointer;
    border: 0;
    background: none;
    padding: 0;
    font-size: 12px;
    text-align: left;
  }
  .fields__v--link.fields__v--link:not(.mono) {
    font-family: inherit;
  }
  .fields__v--link.fields__v--link:hover {
    text-decoration: underline;
    color: rgb(var(--ndo-blue-700));
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .link.link {
    display: flex;
    gap: 8px;
    align-items: center;
    text-align: left;
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    border-radius: var(--ndo-radius-md);
    padding: 6px 10px;
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    min-width: 0;
  }
  .link.link:hover {
    background: rgb(var(--ndo-gray-50));
  }
  .link__f {
    color: rgb(var(--ndo-gray-500));
  }
  .link__t {
    color: rgb(var(--ndo-gray-900));
    font-weight: var(--ndo-weight-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hist {
    display: grid;
    grid-template-columns: 60px minmax(0, 1fr);
    gap: 8px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-600));
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid rgb(var(--ndo-gray-100));
    padding-top: 16px;
  }
  .action.action {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    border-radius: var(--ndo-radius-md);
    padding: 8px 10px;
    cursor: pointer;
    font: inherit;
  }
  .action.action:hover {
    border-color: rgb(var(--ndo-blue-600));
    background: rgb(var(--ndo-blue-50));
  }
  .action__l,
  .form__l {
    font-size: 14px;
    font-weight: var(--ndo-weight-medium);
    color: rgb(var(--ndo-gray-900));
  }
  .form__l {
    font-size: 16px;
    font-weight: var(--ndo-weight-semibold);
  }
  .action__c {
    font-size: 11px;
    color: rgb(var(--ndo-gray-500));
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-xl);
    padding: 16px;
    background: rgb(var(--ndo-gray-50));
  }
  .form__head {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .form__as {
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    font-weight: var(--ndo-weight-medium);
    color: rgb(var(--ndo-gray-700));
  }
  .control.control {
    font: inherit;
    font-size: 14px;
    font-weight: var(--ndo-weight-normal);
    padding: 6px 8px;
    border: 1px solid rgb(var(--ndo-gray-300));
    border-radius: var(--ndo-radius-md);
    background: rgb(var(--ndo-color-card-bg));
    color: rgb(var(--ndo-gray-900));
    outline: none;
  }
  .control.control:focus {
    border-color: rgb(var(--ndo-blue-600));
    box-shadow: 0 0 0 3px rgb(var(--ndo-blue-600) / 0.12);
  }
  .error {
    font-size: 12px;
    line-height: 1.5;
    color: rgb(var(--ndo-red-700));
    background: rgb(var(--ndo-red-50));
    border: 1px solid rgb(var(--ndo-red-200));
    border-radius: var(--ndo-radius-md);
    padding: 8px 10px;
    font-family: var(--ndo-font-mono);
  }
  .form__foot {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .btn.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 72px;
    height: 32px;
    padding: 0 14px;
    border-radius: var(--ndo-radius-md);
    font: inherit;
    font-size: 14px;
    font-weight: var(--ndo-weight-medium);
    cursor: pointer;
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
  .btn.btn:focus-visible,
  .action.action:focus-visible,
  .scenario.scenario:focus-visible,
  .link.link:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .ok {
    font-size: 12px;
    line-height: 1.5;
    color: rgb(var(--ndo-green-700));
    background: rgb(var(--ndo-green-50));
    border: 1px solid rgb(var(--ndo-green-100));
    border-radius: var(--ndo-radius-md);
    padding: 8px 10px;
  }
</style>
