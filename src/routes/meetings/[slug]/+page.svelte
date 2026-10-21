<script lang="ts">
  // A Meeting Niceboard: the journal read as a page, with the interaction around
  // it. Comments go to the shared drawer (one thread per meeting, each comment
  // pointing at its paragraph and carrying its minute). Ticks, reactions and
  // notes stay in this browser; signed in, ticks on actions and settled
  // questions are shared through the thread.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { comments } from '$lib/comments/comments.svelte';
  import { timeFromHash, SEEK_EVENT } from '$lib/comments/timecode';
  import { ABOUT_EVENT, aboutCounts } from '$lib/comments/about';
  import { KIND_LABEL } from '$lib/meetings/labels';
  import { followState, followMarks, encodeFollow, fmtStamp } from '$lib/comments/follow';
  import { ensureDiscussion, addComment, updateComment } from '$lib/comments/github-client';
  import { labelForKey } from '$lib/surface-keys';
  import { isText, type TextBlock, type Span } from '$lib/meetings/parse';
  import MermaidFigure from '$lib/components/meetings/MermaidFigure.svelte';

  let { data } = $props();
  // English is the default; a journal recorded in French keeps its original one click away.
  // `?lang=fr` opens on the original (read on mount: the page is prerendered). Both versions
  // share block ids, so ticks, notes and pinned comments hold across the switch.
  let showOriginal = $state(false);
  $effect(() => {
    showOriginal = !!data.original && new URLSearchParams(location.search).get('lang') === data.original.lang;
  });
  function setOriginal(on: boolean) {
    showOriginal = on;
    const u = new URL(location.href);
    if (on && data.original) u.searchParams.set('lang', data.original.lang);
    else u.searchParams.delete('lang');
    history.replaceState(history.state, '', u);
  }
  const m = $derived(showOriginal && data.original ? data.original : data.meeting);
  const fr = $derived(m.lang === 'fr');

  // ── Reader state, per meeting, in this browser ──
  type Local = {
    reader: string;
    react: Record<string, 'agree' | 'question'>;
    notes: Record<string, string>;
    done: Record<string, boolean>;
    other: string;
  };
  const blank = (): Local => ({ reader: '', react: {}, notes: {}, done: {}, other: '' });
  const key = $derived(`ds-meeting:${m.slug}:v1`);
  let st: Local = $state(blank());
  let loaded = $state(false);

  $effect(() => {
    try {
      st = { ...blank(), ...JSON.parse(localStorage.getItem(key) ?? '{}') };
    } catch {
      st = blank();
    }
    loaded = true;
  });
  $effect(() => {
    const snapshot = JSON.stringify(st);
    if (!loaded) return;
    try { localStorage.setItem(key, snapshot); } catch { /* private window: keep in memory */ }
  });

  // ── Timeline ──
  const textBlocks = $derived(m.sections.flatMap((s) => s.blocks.filter(isText)));
  const length = $derived(m.durationMin ?? Math.max(1, ...textBlocks.flatMap((b) => b.spans.map((x) => x[1]))));
  const proseSections = $derived(m.sections.filter((s) => s.kind === 'prose'));
  const TONES = ['primary', 'warning', 'tertiary', 'secondary'];
  const toneOf = (sectionId: string) => TONES[Math.max(0, proseSections.findIndex((s) => s.id === sectionId)) % TONES.length];
  const segments = $derived(
    proseSections.flatMap((s) =>
      s.blocks.flatMap((b) => (isText(b) && b.spans.length ? [{ id: b.id, lead: b.lead, span: b.spans[0], tone: toneOf(s.id) }] : []))
    )
  );
  const pct = (min: number) => `${(min / length) * 100}%`;
  const ticks = $derived(Array.from({ length: Math.floor(length / 30) + 1 }, (_, i) => i * 30));
  const fmtSpans = (spans: Span[]) => spans.map(([a, b]) => (a === b ? `${a}m` : `${a}–${b}m`));

  // ── Comments: point the next comment in the shared drawer at the paragraph ──
  // Posted, the comment carries the paragraph's id (about.ts) and its first minute
  // when it has one, and shows as a count beside the paragraph for everyone.
  function commentOn(b: TextBlock) {
    const words = b.html.replace(/<[^>]+>/g, '').split(/\s+/).slice(0, 14).join(' ');
    const name = b.lead || `${words}…`;
    comments.about = { id: b.id, q: name };
    if (b.spans.length) comments.stamp = { t: b.spans[0][0] * 60, quote: name };
    comments.open = true;
  }
  const pins = $derived(aboutCounts(comments.thread?.comments ?? []));

  // A minute (from a comment's "at 62:00" line or a #t=3720 link) or a paragraph
  // (from a comment's "on ..." line): scroll to it and flash it.
  let flash = $state('');
  function showId(id: string) {
    // Clear then set, so the same paragraph flashes again on a second request.
    flash = '';
    setTimeout(() => {
      flash = id;
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 30);
  }
  function showMoment(t: number) {
    const min = t / 60;
    const hit = textBlocks.find((b) => b.spans.some(([a, z]) => min >= a && min <= z + 0.99));
    if (hit) showId(hit.id);
  }
  $effect(() => {
    const t = timeFromHash(page.url.hash);
    if (t !== null) showMoment(t);
  });
  $effect(() => {
    const onSeek = (e: Event) => showMoment((e as CustomEvent<number>).detail);
    const onAbout = (e: Event) => showId((e as CustomEvent<string>).detail);
    addEventListener(SEEK_EVENT, onSeek);
    addEventListener(ABOUT_EVENT, onAbout);
    return () => {
      removeEventListener(SEEK_EVENT, onSeek);
      removeEventListener(ABOUT_EVENT, onAbout);
    };
  });

  // ── Rail ──
  const toc = $derived([
    ...(m.tldr ? [{ id: 'tldr', label: 'TL;DR' }] : []),
    ...m.sections.filter((s) => s.kind !== 'tldr').map((s) => ({ id: s.id, label: s.title })),
  ]);
  let active = $state('');
  $effect(() => {
    const ids = toc.map((t) => t.id);
    const onScroll = () => {
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) cur = id;
      }
      active = cur;
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  });

  const openBlocks = $derived(m.sections.filter((s) => s.kind === 'open').flatMap((s) => s.blocks.filter(isText)));

  // ── Follow-up: done actions and settled questions, shared through the meeting's thread ──
  // Signed in, a tick writes this reader's follow-up mark (follow.ts) and everyone
  // sees the latest state per item. Signed out, ticks stay in this browser. A `[x]`
  // in the journal itself is done on the record and cannot be unticked here.
  const threadKey = $derived(`meeting:${m.slug}`);
  const signedIn = $derived(comments.enabled && !!comments.token);
  const shared = $derived(followState(comments.thread?.comments ?? []));
  const actionIds = $derived(new Set(m.actions.map((a) => a.id)));
  let optimistic: Record<string, boolean> = $state({});
  let followError = $state('');

  function isOn(id: string, recorded = false): boolean {
    if (recorded) return true;
    if (!signedIn) return !!st.done[id];
    return optimistic[id] ?? shared[id]?.v ?? false;
  }
  function whoOn(id: string, recorded = false): string {
    if (recorded) return 'Done on the record (ticked in the journal)';
    const e = shared[id];
    return e ? `${e.v ? 'Marked' : 'Reopened'} by ${e.by}, ${fmtStamp(e.at)}` : '';
  }

  // Writes run one after another, so two quick ticks never race to create two marks.
  let chain: Promise<void> = Promise.resolve();
  function setFollow(id: string, v: boolean) {
    if (!signedIn) {
      st.done[id] = v;
      return;
    }
    optimistic[id] = v;
    chain = chain.then(() => writeFollow(id, v));
  }
  async function writeFollow(id: string, v: boolean) {
    followError = '';
    const token = comments.token;
    const mine = followMarks(comments.thread?.comments ?? []).get(comments.viewerLogin);
    const mark = { ...(mine?.mark ?? {}), [id]: { v, at: new Date().toISOString() } };
    const body = encodeFollow(mark, (x) => actionIds.has(x));
    const r = mine
      ? await updateComment(mine.commentId, body, token)
      : await (async () => {
          const d = await ensureDiscussion(threadKey, labelForKey(threadKey), token);
          if (!d.ok) return d;
          if (!comments.thread) comments.thread = d.value;
          return addComment(d.value.id, body, token);
        })();
    if (!r.ok) {
      followError = 'message' in r.error ? `Not saved: ${r.error.message}` : 'Not saved: sign in again.';
    } else if (comments.thread) {
      // In place, so the drawer's thread cache sees the same object.
      const list = comments.thread.comments;
      const i = list.findIndex((c) => c.id === r.value.id);
      if (i >= 0) list[i] = r.value;
      else list.push(r.value);
    }
    delete optimistic[id];
  }

  const doneCount = $derived(m.actions.filter((a) => isOn(a.id, a.recorded)).length);
  const settledCount = $derived(openBlocks.filter((b) => isOn(b.id, b.type === 'item' && !!b.recorded)).length);
  let ownerFilter = $state('');

  function grow(e: Event) {
    const t = e.currentTarget as HTMLTextAreaElement;
    t.style.height = 'auto';
    t.style.height = `${t.scrollHeight}px`;
  }
</script>

<svelte:head><title>{m.date} {KIND_LABEL[m.kind] ?? 'Meeting'} — Nondominium Design System</title></svelte:head>

<div class="bar">
  <a class="back" href={paths.meetings()}>← Meetings</a>
</div>

<div class="wrap">
  <aside class="rail">
    <nav>
      {#each toc as t}
        <a href="#{t.id}" class:on={active === t.id}>{t.label}</a>
      {/each}
    </nav>
    <div class="stats">
      {#if m.actions.length}
        <div>Actions done <b>{doneCount}</b>/{m.actions.length}</div>
        <div class="meter"><i style="width:{(doneCount / m.actions.length) * 100}%"></i></div>
      {/if}
      {#if openBlocks.length}
        <div>Open questions settled <b>{settledCount}</b>/{openBlocks.length}</div>
        <div class="meter"><i style="width:{(settledCount / openBlocks.length) * 100}%"></i></div>
      {/if}
      {#if signedIn}
        <p class="hint shared">Ticks and settled questions are shared with the team. Comments go to the team thread (💬, or <kbd>c</kbd>).</p>
      {:else}
        <p class="hint">Sign in through the comments drawer (💬, or <kbd>c</kbd>) to share your ticks with the team. Until then they stay in this browser.</p>
      {/if}
      {#if followError}<p class="hint err">{followError}</p>{/if}
    </div>
  </aside>

  <main>
    <header>
      <div class="kicker">{KIND_LABEL[m.kind] ?? 'Meeting'}</div>
      <h1>{m.title}</h1>
      <div class="meta">
        <span>{m.dateLine}</span>
        {#if data.original}
          <span class="langs" role="group" aria-label="Language">
            <button type="button" class:on={!showOriginal} aria-pressed={!showOriginal} onclick={() => setOriginal(false)}>English</button>
            <button type="button" class:on={showOriginal} aria-pressed={showOriginal} onclick={() => setOriginal(true)} lang={data.original.lang}>Original (français)</button>
          </span>
        {/if}
      </div>
      {#if m.attendees}<p class="attendees"><strong>{fr ? 'Participants' : 'Attendees'}.</strong> {@html m.attendees}</p>{/if}
      {#if m.context}<p class="context">{@html m.context}</p>{/if}

      {#if segments.length}
        <div class="timeline" aria-label="The meeting, minute by minute">
          <div class="track">
            {#each m.breaks as [a, b]}
              <span class="seg brk" style="left:{pct(a)};width:{pct(b - a)}" title="break, {a}–{b}m"></span>
            {/each}
            {#each segments as s}
              <a class="seg tone-{s.tone}" href="#{s.id}" style="left:{pct(s.span[0])};width:max(6px, {pct(s.span[1] - s.span[0] + 1)})" title="{s.lead} · {s.span[0]}–{s.span[1]}m" aria-label={s.lead}></a>
            {/each}
          </div>
          <div class="ticks">
            {#each ticks as t}<span style="left:{pct(t)}">{t}m</span>{/each}
          </div>
          <div class="legend">
            {#each proseSections as s}<span><i class="tone-{toneOf(s.id)}"></i>{s.title}</span>{/each}
            {#if m.breaks.length}<span><i class="brk"></i>break</span>{/if}
            <span class="dim">click a block to jump to it</span>
          </div>
        </div>
      {/if}
    </header>

    {#if m.tldr}
      <h2 id="tldr">TL;DR</h2>
      <div class="tldr">{@html m.tldr}</div>
    {/if}

    {#each m.sections.filter((s) => s.kind !== 'tldr') as s (s.id)}
      <h2 id={s.id}>{s.title}</h2>
      {#if s.lede}<div class="lede">{@html s.lede}</div>{/if}

      {#if s.kind === 'actions'}
        {#if m.owners.length > 1}
          <div class="filter">
            <button class:on={!ownerFilter} onclick={() => (ownerFilter = '')}>everyone</button>
            {#each m.owners as o}<button class:on={ownerFilter === o} onclick={() => (ownerFilter = o)}>{o}</button>{/each}
          </div>
        {/if}
        <div class="owners">
          {#each m.owners.filter((o) => !ownerFilter || o === ownerFilter) as o}
            {@const mine = m.actions.filter((a) => a.owner === o)}
            <section class="owner">
              <h3>{o} <span class="dim">{mine.filter((a) => isOn(a.id, a.recorded)).length}/{mine.length}</span></h3>
              {#each mine as a (a.id)}
                <div class="act" class:done={isOn(a.id, a.recorded)} id={a.id} title={whoOn(a.id, a.recorded)}>
                  <label><input type="checkbox" checked={isOn(a.id, a.recorded)} disabled={a.recorded} onchange={(e) => setFollow(a.id, e.currentTarget.checked)} /><span>{@html a.html}</span></label>
                  {#each fmtSpans(a.spans) as c}<span class="chip">{c}</span>{/each}
                  <input class="act-note" placeholder="note" bind:value={st.notes[a.id]} />
                </div>
              {/each}
            </section>
          {/each}
        </div>
      {:else}
        {#each s.blocks as b (b.id)}
          {#if b.type === 'sub'}
            <h3 class="sub" id={b.id}>{b.title}</h3>
          {:else if b.type === 'figure'}
            <MermaidFigure id={b.id} n={b.n} source={b.source} caption={b.caption} />
          {:else if b.type === 'code'}
            <div class="code">{@html b.html}</div>
          {:else if s.kind === 'prose'}
            <article class="entry" class:flash={flash === b.id} id={b.id}>
              <div class="entry-head">
                {#if b.leadHtml}<h3>{@html b.leadHtml}</h3>{/if}
                <span class="chips">{#each fmtSpans(b.spans) as c}<span class="chip">{c}</span>{/each}</span>
              </div>
              <p>{@html b.html}</p>
              <button class="cm" class:has={pins[b.id]} onclick={() => commentOn(b)}>💬 {pins[b.id] ? pins[b.id] : 'comment'}</button>
            </article>
          {:else if s.kind === 'decisions'}
            <div class="card ok" class:flash={flash === b.id} id={b.id}>
              <div class="card-body">
                {#if b.leadHtml}<strong>{@html b.leadHtml}</strong>{/if} {@html b.html}
                {#each fmtSpans(b.spans) as c}<span class="chip">{c}</span>{/each}
              </div>
              <div class="react">
                <button class:on={st.react[b.id] === 'agree'} class="agree" onclick={() => (st.react[b.id] === 'agree' ? delete st.react[b.id] : (st.react[b.id] = 'agree'))}>✓ agree</button>
                <button class:on={st.react[b.id] === 'question'} class="question" onclick={() => (st.react[b.id] === 'question' ? delete st.react[b.id] : (st.react[b.id] = 'question'))}>? question</button>
                <button class="cm" class:has={pins[b.id]} onclick={() => commentOn(b)}>💬{pins[b.id] ? ` ${pins[b.id]}` : ''}</button>
              </div>
              {#if st.react[b.id] === 'question'}
                <textarea class="note" rows="1" placeholder="What's the question?" bind:value={st.notes[b.id]} oninput={grow}></textarea>
              {/if}
            </div>
          {:else if s.kind === 'open'}
            {@const settled = isOn(b.id, b.type === 'item' && !!b.recorded)}
            <div class="card warn" class:answered={settled} class:flash={flash === b.id} id={b.id}>
              <div class="card-body">
                {#if b.leadHtml}<strong>{@html b.leadHtml}</strong>{/if} {@html b.html}
                {#each fmtSpans(b.spans) as c}<span class="chip">{c}</span>{/each}
              </div>
              <div class="react">
                <button class="settle" class:on={settled} disabled={b.type === 'item' && !!b.recorded} title={whoOn(b.id, b.type === 'item' && !!b.recorded) || 'Mark this question as settled for everyone'} onclick={() => setFollow(b.id, !settled)}>{settled ? '✓ settled' : 'settle'}</button>
                <button class="cm" class:has={pins[b.id]} onclick={() => commentOn(b)} title="Answer it in the team thread">💬{pins[b.id] ? ` ${pins[b.id]}` : ''}</button>
              </div>
              <textarea class="note" rows="1" placeholder="Your view, or what it would take to decide…" bind:value={st.notes[b.id]} oninput={grow}></textarea>
            </div>
          {:else}
            <div class="card {s.kind === 'corrections' ? 'bad' : s.kind === 'outstanding' ? 'warn' : 'plain'}" class:flash={flash === b.id} id={b.id}>
              <div class="card-body">
                {#if b.leadHtml}<strong>{@html b.leadHtml}</strong>{/if} {@html b.html}
                {#each fmtSpans(b.spans) as c}<span class="chip">{c}</span>{/each}
                <button class="cm inline" class:has={pins[b.id]} onclick={() => commentOn(b)}>💬{pins[b.id] ? ` ${pins[b.id]}` : ''}</button>
              </div>
            </div>
          {/if}
        {/each}
      {/if}
    {/each}
  </main>
</div>


<style>
  /* Colours are the design system's own tokens; nothing here is a R&O hue. */
  .bar { position: sticky; top: 0; z-index: 5; display: flex; gap: var(--ndo-spacing-3); align-items: center; flex-wrap: wrap; padding: var(--ndo-spacing-3) var(--ndo-spacing-6); background: var(--ndo-color-surface); border-bottom: 1px solid var(--ndo-color-border); font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-medium); color: var(--ndo-color-text-secondary); }
  .bar .back { color: var(--ndo-color-link); text-decoration: none; font-weight: var(--ndo-weight-semibold); }
  .bar .primary { background: rgb(var(--ndo-primary-600)); border-color: rgb(var(--ndo-primary-600)); color: rgb(var(--ndo-color-text-inverse)); }

  .wrap { display: grid; grid-template-columns: 220px minmax(0, 720px); gap: 48px; justify-content: center; padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 6rem; }
  .rail { position: sticky; top: 64px; align-self: start; font-size: var(--ndo-text-sm); line-height: var(--ndo-lh-sm); }
  .rail nav a { display: block; padding: 4px 10px; color: var(--ndo-color-text-secondary); text-decoration: none; border-left: 2px solid var(--ndo-color-border); }
  .rail nav a.on { color: var(--ndo-color-text-primary); font-weight: var(--ndo-weight-semibold); border-left-color: rgb(var(--ndo-primary-600)); }
  .stats { margin-top: var(--ndo-spacing-5); color: var(--ndo-color-text-secondary); }
  .stats b { color: var(--ndo-color-text-primary); }
  .meter { height: 6px; background: var(--ndo-color-border); border-radius: 3px; margin: 4px 0 12px; overflow: hidden; }
  .meter i { display: block; height: 100%; background: rgb(var(--ndo-green-600)); transition: width 0.2s; }
  .hint { font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); }
  .hint.shared { color: rgb(var(--ndo-green-700)); }
  .hint.err { color: rgb(var(--ndo-red-600)); }
  kbd { font-family: var(--ndo-font-mono); font-size: 11px; border: 1px solid var(--ndo-color-border); border-radius: 3px; padding: 0 4px; }

  main { color: var(--ndo-color-text-primary); font-size: var(--ndo-text-base); line-height: 1.7; }
  .langs { display: inline-flex; margin-left: var(--ndo-spacing-3); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); overflow: hidden; vertical-align: middle; }
  .langs button { font: inherit; font-size: var(--ndo-text-xs); padding: 2px 10px; border: 0; background: none; color: var(--ndo-color-text-muted); cursor: pointer; }
  .langs button.on { background: rgb(var(--ndo-primary-50)); color: rgb(var(--ndo-primary-700)); font-weight: var(--ndo-weight-bold); }
  .kicker { font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--ndo-color-link); }
  h1 { font-size: var(--ndo-text-3xl); line-height: var(--ndo-lh-3xl); font-weight: var(--ndo-weight-bold); margin: 6px 0 10px; }
  .meta { color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); }
  .attendees, .context { font-size: var(--ndo-text-sm); line-height: 1.6; color: var(--ndo-color-text-secondary); margin: 10px 0 0; }
  .context { border-left: 3px solid var(--ndo-color-border-strong); padding-left: 12px; }

  .timeline { margin: var(--ndo-spacing-6) 0 4px; }
  .track { position: relative; height: 28px; background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-md); }
  .seg { position: absolute; top: 4px; bottom: 4px; border-radius: 3px; opacity: 0.8; }
  .seg:hover { opacity: 1; outline: 2px solid var(--ndo-color-text-primary); }
  .seg.brk, .legend i.brk { background: repeating-linear-gradient(45deg, var(--ndo-color-border-strong) 0 4px, transparent 4px 8px); top: 0; bottom: 0; opacity: 1; }
  .tone-primary { background: rgb(var(--ndo-primary-400)); }
  .tone-warning { background: rgb(var(--ndo-amber-600)); }
  .tone-tertiary { background: rgb(var(--ndo-brand-violet-500)); }
  .tone-secondary { background: rgb(var(--ndo-brand-teal-500)); }
  .ticks { position: relative; height: 18px; font-family: var(--ndo-font-mono); font-size: 11px; line-height: 18px; color: var(--ndo-color-text-muted); }
  .ticks span { position: absolute; transform: translateX(-50%); }
  .legend { display: flex; flex-wrap: wrap; gap: 14px; font-size: var(--ndo-text-xs); color: var(--ndo-color-text-secondary); }
  .legend i { display: inline-block; width: 12px; height: 12px; border-radius: 2px; margin-right: 5px; vertical-align: -1px; }
  .dim { color: var(--ndo-color-text-muted); font-weight: var(--ndo-weight-normal); }

  h2 { font-size: var(--ndo-text-xl); line-height: var(--ndo-lh-xl); font-weight: var(--ndo-weight-bold); margin: 48px 0 8px; padding-top: 12px; border-top: 1px solid var(--ndo-color-border); scroll-margin-top: 64px; }
  h3.sub { font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); font-weight: var(--ndo-weight-bold); margin: 24px 0 4px; color: var(--ndo-color-link); }
  .lede { color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); line-height: 1.6; margin-bottom: 8px; }
  .lede :global(table) { border-collapse: collapse; width: 100%; font-size: var(--ndo-text-sm); }
  .lede :global(td), .lede :global(th) { border-bottom: 1px solid var(--ndo-color-border); padding: 4px 8px; text-align: left; }
  .tldr { background: rgb(var(--ndo-primary-600) / 0.08); border: 1px solid rgb(var(--ndo-primary-600) / 0.3); border-radius: var(--ndo-radius-lg); padding: 16px 20px; }
  .code :global(pre) { overflow-x: auto; background: var(--ndo-color-surface); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-md); padding: 12px 14px; font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); line-height: 1.5; }

  .entry { padding: 14px 0; border-bottom: 1px dashed var(--ndo-color-border); scroll-margin-top: 80px; }
  .entry-head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
  .entry h3 { font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); font-weight: var(--ndo-weight-bold); margin: 0 0 2px; }
  .entry p { margin: 0; }
  .chips { white-space: nowrap; }
  .chip { display: inline-block; font-family: var(--ndo-font-mono); font-size: 11px; line-height: 18px; font-weight: var(--ndo-weight-semibold); color: var(--ndo-color-link); background: rgb(var(--ndo-primary-600) / 0.1); border-radius: var(--ndo-radius-pill); padding: 0 8px; margin-left: 4px; }
  .cm { font: inherit; font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); color: var(--ndo-color-text-muted); background: none; border: 0; padding: 4px 0 0; cursor: pointer; opacity: 0; transition: opacity 0.15s; }
  .entry:hover .cm, .card:hover .cm, .cm:focus-visible, .cm.has { opacity: 1; }
  .cm:hover { color: var(--ndo-color-link); }
  .cm.inline { padding: 0 0 0 6px; }
  .flash { animation: flash 2s ease-out; }
  @keyframes flash { from { background: rgb(var(--ndo-amber-300) / 0.45); } to { background: transparent; } }

  .card { display: grid; grid-template-columns: 1fr auto; gap: 6px 14px; padding: 12px 16px; margin: 8px 0; background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-left: 4px solid var(--ndo-color-border-strong); border-radius: var(--ndo-radius-lg); font-size: 15px; line-height: 24px; scroll-margin-top: 80px; }
  .card.ok { border-left-color: rgb(var(--ndo-green-600)); }
  .card.warn { border-left-color: rgb(var(--ndo-amber-600)); }
  .card.warn.answered { border-left-color: rgb(var(--ndo-green-600)); }
  .card.bad { border-left-color: rgb(var(--ndo-red-600)); }
  .card .note { grid-column: 1 / -1; }
  .react { display: flex; gap: 6px; align-items: flex-start; }
  .react button, .filter button { font: inherit; font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-medium); line-height: 18px; color: var(--ndo-color-text-primary); background: var(--ndo-color-surface); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 2px 10px; cursor: pointer; }
  .react .agree.on, .react .settle.on { background: rgb(var(--ndo-green-600)); border-color: rgb(var(--ndo-green-600)); color: #fff; }
  .react .question.on { background: rgb(var(--ndo-amber-600)); border-color: rgb(var(--ndo-amber-600)); color: #fff; }
  .react .cm { opacity: 0.6; padding: 2px 4px; border: 0; background: none; }
  .react .cm.has { opacity: 1; }
  .react button:disabled { cursor: default; opacity: 0.8; }

  textarea, .act-note { width: 100%; box-sizing: border-box; font: inherit; font-size: var(--ndo-text-sm); line-height: var(--ndo-lh-sm); color: var(--ndo-color-text-primary); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-md); padding: 6px 10px; resize: vertical; }

  .filter { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 12px; }
  .filter button.on { background: var(--ndo-color-text-primary); color: var(--ndo-color-bg-app); }
  .owners { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; }
  .owner { background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-lg); padding: 6px 14px 12px; }
  .owner h3 { font-size: 15px; line-height: 22px; font-weight: var(--ndo-weight-bold); margin: 8px 0; }
  .act { padding: 6px 0; border-top: 1px dashed var(--ndo-color-border); font-size: var(--ndo-text-sm); line-height: 21px; scroll-margin-top: 80px; }
  .act label { display: flex; gap: 8px; cursor: pointer; }
  .act input[type='checkbox'] { margin-top: 4px; accent-color: rgb(var(--ndo-green-600)); }
  .act.done label span { text-decoration: line-through; color: var(--ndo-color-text-muted); }
  .act-note { margin-top: 4px; padding: 2px 8px; font-size: var(--ndo-text-xs); opacity: 0; }
  .act:hover .act-note, .act-note:focus, .act-note:not(:placeholder-shown) { opacity: 1; }


  @media (max-width: 960px) {
    .wrap { grid-template-columns: 1fr; gap: 16px; }
    .rail { position: static; }
    .rail nav { display: flex; flex-wrap: wrap; gap: 4px; }
    .rail nav a { border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); }
  }
</style>
