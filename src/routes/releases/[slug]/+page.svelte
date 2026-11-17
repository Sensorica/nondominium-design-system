<script lang="ts">
  // A release board: where a release stands, derived from GitHub when its data was
  // generated (content/releases/<slug>.json, see $lib/releases/types.ts and
  // docs/RELEASE_BOARD.md). The items, their workstreams, states, holders and numbers are
  // derived; the plan, rules, calls and notes are the team's, from <slug>.release.yaml.
  // Everything is rendered from typed data on the Nondominium tokens (static/tokens.css)
  // and its component classes (ndo-card, ndo-panel, ndo-badge), and follows the light
  // theme and [data-theme='dark'].
  import RichText from '$lib/components/releases/RichText.svelte';
  import { paths } from '$lib/paths';
  import type { Tone } from '$lib/releases/types';

  let { data } = $props();
  const b = $derived(data.board);

  // The plan's "today" is read in the board's time zone: at build time from the
  // measurement, then in the browser from the clock, so the timeline stays right
  // between two regenerations.
  const ymd = (d: Date, timeZone: string) => new Intl.DateTimeFormat('en-CA', { timeZone }).format(d);
  let now = $state<Date | null>(null);
  $effect(() => {
    now = new Date();
  });
  const today = $derived(ymd(now ?? new Date(b.measuredAt), b.timeZone));

  const noon = (d: string) => new Date(`${d}T12:00:00Z`);
  const dayName = (d: string) => new Intl.DateTimeFormat('en-CA', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(noon(d));
  const weekend = (d: string) => [0, 6].includes(noon(d).getUTCDay());
  const col = (d: string) => b.days.indexOf(d) + 1;
  const stepState = (from: string, to: string) => (today > to ? 'rb-done' : today >= from ? 'rb-now' : '');
  const tone = (t: Tone) => `rb-t-${t}`;
</script>

<svelte:head><title>{b.title} · Nondominium DS</title></svelte:head>

<div class="rb-board">
  <header class="rb-top">
    <div>
      <div class="rb-kicker">Release board</div>
      <h1 class="ndo-h1 rb-title">{b.title}</h1>
      <p class="rb-meta">{b.version} · <a class="rb-a" href={b.milestone.href}>{b.milestone.text}</a></p>
    </div>
    <p class="rb-stamp">Measured from GitHub on {b.measuredLine}, Montreal time</p>
  </header>

  <section class="rb-kpis" aria-label="Where the release stands">
    {#each b.kpis as k}
      <div class="ndo-card rb-kpi {tone(k.tone)}">
        <div class="rb-n">{k.n}{#if k.unit}<small>{k.unit}</small>{/if}</div>
        {#if k.bar !== undefined}<div class="rb-meter"><i style="width:{Math.round(k.bar * 100)}%"></i></div>{/if}
        <div class="rb-l"><RichText runs={k.label} /></div>
        <div class="rb-src">{k.src}</div>
      </div>
    {/each}
  </section>

  <h2 class="ndo-label rb-h2" id="workstreams">Workstreams</h2>
  <section class="rb-grid">
    {#each b.streams as s (s.id)}
      <article class="ndo-card rb-stream {tone(s.tone)}" id={s.id}>
        <header class="rb-head"><h3 class="ndo-h3">{s.title}</h3><span class="ndo-badge rb-tag">{s.tag}</span></header>
        <p class="rb-why"><RichText runs={s.why} /></p>
        <ul class="rb-chips">
          {#each s.chips as c}
            <li class="rb-chip rb-k-{c.kind}">
              {#if c.href}<a class="rb-num" href={c.href} title={c.title}>{c.label}</a>{:else}<span class="rb-num">{c.label}</span>{/if}
              <span class="rb-st" title={c.stateTitle}>{c.state}</span>
              {#if c.heavy}<span class="rb-hv rb-hv-{c.heavy.result}" title={c.heavy.title}>H</span>{/if}
              {#if c.who}<span class="rb-who">{c.who}</span>{/if}
            </li>
          {/each}
        </ul>
        {#if s.pairing}
          <div class="rb-pairing {tone(s.pairing.tone)}">
            <p class="rb-verdict"><RichText runs={s.pairing.verdict} /></p>
            <dl>
              {#each s.pairing.rows as row}
                <dt class={tone(row.tone)}>{row.label}</dt><dd><RichText runs={row.value} /></dd>
              {/each}
            </dl>
          </div>
        {/if}
        <dl>
          <dt>Holds it</dt><dd><RichText runs={s.holds} /></dd>
          {#if s.next.length}<dt>Next</dt><dd><RichText runs={s.next} /></dd>{/if}
        </dl>
      </article>
    {:else}
      <p class="rb-empty">Nothing open on the {b.milestone.text}.</p>
    {/each}
  </section>
  <p class="rb-legend"><RichText runs={b.legend} /></p>

  {#if b.plan.length}
  <h2 class="ndo-label rb-h2" id="plan">The plan to the tag</h2>
  <div class="ndo-panel rb-panel">
    <div class="rb-tl" style="--n:{b.days.length}">
      <div class="rb-tl-days">
        {#each b.days as d}
          <div class="rb-tl-day" class:rb-we={weekend(d)} class:rb-today={d === today} class:rb-past={d < today}>
            <b>{dayName(d)}</b>{#if d === today}<em>today</em>{/if}
          </div>
        {/each}
      </div>
      <div class="rb-tl-grid">
        {#each b.days as d, i}
          <div class="rb-tl-bg" class:rb-we={weekend(d)} class:rb-today={d === today} style="grid-column:{i + 1};grid-row:1 / span {b.plan.length}"></div>
        {/each}
        {#each b.plan as st, k}
          {@const pos = `grid-column:${col(st.from)} / ${col(st.to) + 1};grid-row:${k + 1}`}
          {#if st.kind === 'milestone'}
            <div class="rb-tl-ms {tone(st.tone)} {stepState(st.from, st.to)}" class:rb-edge-start={col(st.from) === 1} class:rb-edge-end={col(st.to) === b.days.length && b.days.length > 1} style={pos}><i></i><b><RichText runs={st.title} /></b></div>
          {:else}
            <div class="rb-tl-bar {tone(st.tone)} {stepState(st.from, st.to)}" style={pos}>
              <b><RichText runs={st.title} /></b>{#if st.who}<small>{st.who}</small>{/if}
              <span><RichText runs={st.what} /></span>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
  {/if}

  <section class="rb-lower">
    <div>
      {#if b.decided.length || b.rules.length}
      <h2 class="ndo-label rb-h2" id="rules">Rules we hold</h2>
      <div class="ndo-panel rb-panel">
        {#if b.decided.length}<p class="rb-decided"><RichText runs={b.decided} /></p>{/if}
        <ul class="rb-rules">
          {#each b.rules as r}<li><RichText runs={r} /></li>{/each}
        </ul>
      </div>
      {/if}
    </div>
    <div>
      {#if b.calls.length}
      <h2 class="ndo-label rb-h2" id="calls">Open calls</h2>
      <div class="ndo-panel rb-panel">
        <ul class="rb-calls">
          {#each b.calls as c}<li><RichText runs={c} /></li>{/each}
        </ul>
      </div>
      {/if}
      <h2 class="ndo-label rb-h2" id="landed">Landed since {b.landedSince}</h2>
      <div class="ndo-panel rb-panel">
        <ul class="rb-landed">
          {#each b.landed as p (p.n)}
            <li><time datetime={p.at}>{p.when}</time> <a class="rb-a" href={p.href}>#{p.n}</a> <span>{p.title}</span> <em>{p.who}</em></li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <h2 class="ndo-label rb-h2" id="links">Links</h2>
  <p class="rb-links">
    {#each b.links as l}
      <a class="rb-a" href={l.meeting ? `${paths.meeting(l.meeting)}${l.anchor ? `#${l.anchor}` : ''}` : l.href}>{l.text}</a>
    {/each}
  </p>
  <footer class="rb-foot">{b.footer}</footer>
</div>

<style>
  /* Every value is a Nondominium token (static/tokens.css). The surfaces, borders and
     text use the semantic layer, which flips under [data-theme='dark']; the tones use
     the numbered scales, a darker step for text in light mode and a lighter one in dark
     mode, so tone text holds AA on the card background in both themes. Class names
     carry an rb- prefix so none of them is also a UnoCSS utility. */
  .rb-board {
    --rb-ok-ink: var(--ndo-green-700); --rb-warn-ink: var(--ndo-amber-800); --rb-bad-ink: var(--ndo-red-700); --rb-accent-ink: var(--ndo-primary-700);
    --rb-ok-edge: var(--ndo-green-600); --rb-warn-edge: var(--ndo-amber-600); --rb-bad-edge: var(--ndo-red-600); --rb-accent-edge: var(--ndo-primary-500);
    --rb-ok-tint: var(--ndo-green-100); --rb-warn-tint: var(--ndo-amber-100); --rb-bad-tint: var(--ndo-red-100); --rb-accent-tint: var(--ndo-primary-100);
    max-width: 104rem;
    margin: 0 auto;
    padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 96px;
    color: var(--ndo-color-text-primary);
    font: var(--ndo-weight-normal) var(--ndo-text-sm) / 1.45 var(--ndo-font-sans);
  }
  :global([data-theme='dark']) .rb-board {
    --rb-ok-ink: var(--ndo-green-300); --rb-warn-ink: var(--ndo-amber-300); --rb-bad-ink: var(--ndo-red-300); --rb-accent-ink: var(--ndo-primary-300);
    --rb-accent-edge: var(--ndo-primary-400);
  }
  .rb-t-ok { --ink: var(--rb-ok-ink); --edge: var(--rb-ok-edge); --tint: var(--rb-ok-tint); --tint-ink: var(--ndo-green-700); }
  .rb-t-warn { --ink: var(--rb-warn-ink); --edge: var(--rb-warn-edge); --tint: var(--rb-warn-tint); --tint-ink: var(--ndo-amber-800); }
  .rb-t-bad { --ink: var(--rb-bad-ink); --edge: var(--rb-bad-edge); --tint: var(--rb-bad-tint); --tint-ink: var(--ndo-red-700); }
  .rb-t-accent { --ink: var(--rb-accent-ink); --edge: var(--rb-accent-edge); --tint: var(--rb-accent-tint); --tint-ink: var(--ndo-primary-700); }

  .rb-a { color: var(--ndo-color-link); }

  .rb-top { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 6px 24px; margin-bottom: var(--ndo-spacing-5); }
  .rb-kicker {
    font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.1em; text-transform: uppercase;
    color: rgb(var(--ndo-brand-teal-700));
  }
  :global([data-theme='dark']) .rb-kicker { color: rgb(var(--ndo-brand-teal-300)); }
  .rb-title { margin: 6px 0 4px; }
  .rb-meta, .rb-stamp { margin: 0; color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); }

  /* ndo-card and ndo-panel give the surface, border, radius and shadow; these set the rest. */
  .rb-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: var(--ndo-spacing-3); }
  .rb-kpi.ndo-card { padding: var(--ndo-spacing-3) 14px; border-top: 3px solid rgb(var(--edge)); }
  .rb-n { font-size: var(--ndo-text-3xl); line-height: 1.05; font-weight: var(--ndo-weight-bold); color: rgb(var(--ink)); }
  .rb-n small { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); margin-left: 5px; color: var(--ndo-color-text-secondary); }
  .rb-l { margin: 4px 0 5px; font-size: var(--ndo-text-sm); }
  .rb-src { font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .rb-meter { height: 6px; border-radius: 3px; background: var(--ndo-color-border); margin: 6px 0 5px; overflow: hidden; }
  .rb-meter i { display: block; height: 100%; background: rgb(var(--edge)); }

  .rb-h2 { display: block; margin: 28px 0 10px; scroll-margin-top: 16px; color: var(--ndo-color-text-secondary); }

  .rb-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr)); gap: var(--ndo-spacing-3); }
  .rb-stream.ndo-card { border-left: 4px solid rgb(var(--edge)); padding: var(--ndo-spacing-3) 15px 11px; display: flex; flex-direction: column; gap: var(--ndo-spacing-2); }
  .rb-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 5px 8px; }
  /* The design system's badge, in the card's tone: a badge variant sets only --b and --f. */
  .rb-tag.ndo-badge { --b: var(--tint); --f: var(--tint-ink); font-weight: var(--ndo-weight-bold); }
  .rb-why { margin: 0; color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); }
  .rb-stream dl { display: grid; grid-template-columns: auto 1fr; gap: 3px 11px; margin: 2px 0 0; font-size: var(--ndo-text-sm); }
  .rb-stream dt { color: var(--ndo-color-text-secondary); font-weight: var(--ndo-weight-semibold); }
  .rb-stream dd { margin: 0; }

  .rb-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .rb-chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 2px 7px; font-size: 13px;
    border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-md); background: var(--ndo-color-surface);
  }
  .rb-num { font-family: var(--ndo-font-mono); font-weight: var(--ndo-weight-bold); font-size: 13px; text-decoration: none; color: var(--ndo-color-link); }
  .rb-st { color: var(--pc, var(--ndo-color-text-secondary)); font-weight: var(--ndo-weight-semibold); }
  .rb-who { color: var(--ndo-color-text-secondary); }
  .rb-k-changes { --pc: rgb(var(--rb-bad-ink)); }
  .rb-k-draft, .rb-k-wip { --pc: rgb(var(--rb-warn-ink)); }
  .rb-k-ready, .rb-k-ok { --pc: rgb(var(--rb-ok-ink)); }
  .rb-k-merged, .rb-k-none { --pc: var(--ndo-color-text-secondary); }
  .rb-k-issue { --pc: var(--ndo-color-text-primary); }
  .rb-hv { font-family: var(--ndo-font-mono); font-weight: var(--ndo-weight-bold); font-size: 11px; border-radius: var(--ndo-radius-sm); padding: 0 4px; border: 1px solid currentColor; }
  .rb-hv-ok { color: rgb(var(--rb-ok-ink)); }
  .rb-hv-bad { color: rgb(var(--rb-bad-ink)); }
  .rb-hv-none { color: var(--ndo-color-text-secondary); border-style: dashed; }

  /* The desktop pairing: a verdict in the stream's tone, then one line per thing checked. */
  .rb-pairing { border: 1px solid rgb(var(--edge) / 0.6); border-radius: var(--ndo-radius-md); padding: 7px 10px; background: rgb(var(--edge) / 0.08); font-size: 13px; }
  .rb-verdict { margin: 0 0 4px; color: var(--ndo-color-text-primary); }
  .rb-pairing dl { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font-size: 13px; }
  .rb-pairing dt { font-weight: var(--ndo-weight-semibold); color: rgb(var(--ink)); }
  .rb-pairing dd { margin: 0; color: var(--ndo-color-text-secondary); overflow-wrap: anywhere; }
  .rb-empty { margin: 0; color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); }

  .rb-legend { font-size: 13px; color: var(--ndo-color-text-secondary); margin: 10px 0 0; }

  .rb-panel.ndo-panel { padding: 14px var(--ndo-spacing-4); }
  /* A little inline room, so a diamond on the first or last day does not touch the scroll edge. */
  .rb-tl { display: grid; gap: 6px; overflow-x: auto; padding: 0 6px; }
  .rb-tl-days, .rb-tl-grid { display: grid; grid-template-columns: repeat(var(--n), minmax(2.4rem, 1fr)); column-gap: 4px; }
  .rb-tl-day { text-align: center; font-size: 12px; color: var(--ndo-color-text-secondary); padding: 3px 0; border-bottom: 2px solid var(--ndo-color-border); }
  .rb-tl-day b { color: var(--ndo-color-text-primary); font-weight: var(--ndo-weight-semibold); }
  .rb-tl-day.rb-we b { color: var(--ndo-color-text-muted); }
  .rb-tl-day.rb-past { opacity: 0.6; }
  .rb-tl-day.rb-today { border-bottom-color: rgb(var(--rb-accent-edge)); }
  .rb-tl-day.rb-today b, .rb-tl-day em { color: var(--ndo-color-link); }
  .rb-tl-day em { display: block; font-family: var(--ndo-font-mono); font-weight: var(--ndo-weight-bold); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; font-style: normal; }
  .rb-tl-grid { row-gap: 7px; grid-auto-rows: minmax(2.2rem, auto); }
  .rb-tl-bg { border-radius: var(--ndo-radius-md); }
  .rb-tl-bg.rb-we { background: rgb(var(--ndo-gray-400) / 0.12); }
  .rb-tl-bg.rb-today { background: rgb(var(--ndo-primary-500) / 0.1); box-shadow: inset 2px 0 0 rgb(var(--rb-accent-edge)); }
  .rb-tl-bar { position: relative; z-index: 1; border-radius: var(--ndo-radius-md); padding: 7px 10px; background: rgb(var(--edge) / 0.14); border-left: 4px solid rgb(var(--edge)); font-size: 13px; line-height: 1.35; }
  .rb-tl-bar b { color: var(--ndo-color-text-primary); margin-right: 6px; }
  .rb-tl-bar small { font-family: var(--ndo-font-mono); font-weight: var(--ndo-weight-semibold); font-size: 11px; color: rgb(var(--ink)); text-transform: uppercase; letter-spacing: 0.04em; }
  .rb-tl-bar span { display: block; color: var(--ndo-color-text-secondary); margin-top: 2px; }
  .rb-tl-bar.rb-now { box-shadow: 0 0 0 1px rgb(var(--edge)); }
  .rb-done { opacity: 0.55; }
  /* A milestone sits on one day; its label may be wider than the column, so it centres over it. */
  .rb-tl-ms { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-align: center; font-size: 13px; }
  .rb-tl-ms i { width: 14px; height: 14px; background: rgb(var(--edge)); transform: rotate(45deg); border-radius: 2px; box-shadow: 0 0 0 3px rgb(var(--edge) / 0.25); }
  /* On the first or last day the label hangs inward, so it never leaves the panel. */
  .rb-tl-ms.rb-edge-start { align-items: flex-start; text-align: left; }
  .rb-tl-ms.rb-edge-end { align-items: flex-end; text-align: right; }
  .rb-tl-ms b { width: max-content; max-width: 16rem; color: rgb(var(--ink)); font-weight: var(--ndo-weight-bold); }

  .rb-lower { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: var(--ndo-spacing-3); }
  .rb-decided { margin: 0; font-size: var(--ndo-text-sm); }
  .rb-rules { margin: 5px 0 0; padding-left: 18px; font-size: var(--ndo-text-sm); list-style: disc; }
  .rb-rules li, .rb-calls li { margin: 4px 0; }
  .rb-calls { margin: 0; padding-left: 18px; font-size: var(--ndo-text-sm); list-style: disc; }
  .rb-landed { list-style: none; margin: 0; padding: 0; columns: 20rem; column-gap: 20px; font-size: 13px; }
  .rb-landed li { break-inside: avoid; margin: 3px 0; }
  .rb-landed time { font-family: var(--ndo-font-mono); font-size: 12px; color: var(--ndo-color-text-secondary); }
  .rb-landed a { font-family: var(--ndo-font-mono); font-weight: var(--ndo-weight-bold); font-size: 13px; text-decoration: none; }
  .rb-landed em { font-style: normal; color: var(--ndo-color-text-secondary); font-size: 12px; }

  .rb-links { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: var(--ndo-text-sm); margin: 0; }
  .rb-links a { text-decoration: none; font-weight: var(--ndo-weight-semibold); }
  .rb-links a:hover { text-decoration: underline; }
  .rb-foot { margin-top: 28px; color: var(--ndo-color-text-secondary); font-size: 13px; }

  @media (max-width: 70rem) { .rb-lower { grid-template-columns: 1fr; } }
  @media (max-width: 40rem) {
    .rb-board { padding: 20px 16px 64px; }
    .rb-tl-bar span { display: none; }
  }
</style>
