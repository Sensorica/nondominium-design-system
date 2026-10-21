<script lang="ts">
  // Every Sensorica/Nondominium meeting resume, newest first. Each opens as a
  // Meeting Niceboard. An empty content/meetings/ renders the empty message.
  import { paths } from '$lib/paths';
  import { KIND_LABEL } from '$lib/meetings/labels';

  let { data } = $props();
  let kind = $state('');

  const kinds = $derived([...new Set(data.meetings.map((m) => m.kind))]);
  const shown = $derived(data.meetings.filter((m) => !kind || m.kind === kind));
  const months = $derived(
    shown.reduce<{ month: string; items: typeof shown }[]>((acc, m) => {
      const month = new Date(`${m.date}T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      const last = acc.at(-1);
      if (last?.month === month) last.items.push(m);
      else acc.push({ month, items: [m] });
      return acc;
    }, [])
  );
  const total = $derived(data.meetings.reduce((t, m) => t + (m.durationMin ?? 0), 0));

  const day = (d: string) => new Date(`${d}T12:00:00`).getDate();
  const weekday = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short' });
  const hm = (min: number | null) => (min === null ? '' : min >= 60 ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m` : `${min} min`);
  // The journals share a title, so a meeting is named by its TL;DR's first sentence.
  const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const headline = (html: string) => text(html).match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text(html);
  const excerpt = (html: string) => {
    const rest = text(html).slice(headline(html).length).trim();
    return rest.length > 240 ? `${rest.slice(0, 240).replace(/\s+\S*$/, '')}…` : rest;
  };
</script>

<svelte:head><title>Meetings — Nondominium Design System</title></svelte:head>

<main class="meetings">
  <header>
    <h1 class="ndo-h1">Meetings</h1>
    <p class="lede">
      Every resume of our meetings, written from the recording after the call. Open one to read it, comment on any paragraph for the team, and tick your actions.
    </p>
    {#if data.meetings.length}
      <div class="summary">
        <span><b>{data.meetings.length}</b> meetings</span>
        <span><b>{hm(total)}</b> recorded</span>
        <span><b>{data.meetings.reduce((t, m) => t + m.counts.decisions, 0)}</b> decisions</span>
        <span><b>{data.meetings.reduce((t, m) => t + m.counts.actions, 0)}</b> actions</span>
      </div>
    {/if}
    {#if kinds.length > 1}
      <div class="filter">
        <button class:on={!kind} onclick={() => (kind = '')}>all</button>
        {#each kinds as k}<button class:on={kind === k} onclick={() => (kind = k)}>{KIND_LABEL[k] ?? k}</button>{/each}
      </div>
    {/if}
  </header>

  {#if data.meetings.length === 0}
    <p class="empty">No meeting resume has been published yet. A journal dropped into <code>content/meetings/</code> as <code>YYYY-MM-DD-&lt;kind&gt;.md</code> appears here on the next build.</p>
  {/if}

  {#each months as group (group.month)}
    <h2>{group.month}</h2>
    <div class="list">
      {#each group.items as m (m.slug)}
        <a class="item kind-{m.kind}" href={paths.meeting(m.slug)}>
          <div class="date"><span class="d">{day(m.date)}</span><span class="w">{weekday(m.date)}</span></div>
          <div class="body">
            <div class="top">
              <span class="badge">{KIND_LABEL[m.kind] ?? m.kind}</span>
              {#if m.durationMin}<span class="dur">{hm(m.durationMin)}</span>{/if}
            </div>
            <div class="title">{headline(m.tldr)}</div>
            <p class="tldr">{excerpt(m.tldr)}</p>
            <div class="counts">
              {#if m.counts.decisions}<span>{m.counts.decisions} decided</span>{/if}
              {#if m.counts.open}<span>{m.counts.open} open</span>{/if}
              {#if m.counts.actions}<span>{m.counts.done ? `${m.counts.done}/${m.counts.actions} actions done` : `${m.counts.actions} actions`}</span>{/if}
              <span>{Math.round(m.counts.words / 230)} min read</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/each}
</main>

<style>
  .meetings { max-width: 860px; margin: 0 auto; padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 5rem; color: var(--ndo-color-text-primary); font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); }
  .lede { color: var(--ndo-color-text-secondary); max-width: 640px; margin: var(--ndo-spacing-1) 0 var(--ndo-spacing-4); }
  .summary { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-5); color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); }
  .summary b { color: var(--ndo-color-text-primary); font-size: var(--ndo-text-lg); margin-right: 2px; }
  .filter { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-1-5); margin-top: var(--ndo-spacing-4); }
  .filter button { font: inherit; font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-medium); color: var(--ndo-color-text-primary); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 3px 12px; cursor: pointer; }
  .filter button.on { background: rgb(var(--ndo-primary-600)); border-color: rgb(var(--ndo-primary-600)); color: rgb(var(--ndo-color-text-inverse)); }
  .empty { margin-top: var(--ndo-spacing-8); padding: var(--ndo-spacing-5); border: 1px dashed var(--ndo-color-border-strong); border-radius: var(--ndo-radius-lg); color: var(--ndo-color-text-secondary); }
  .empty code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-sm); }
  h2 { font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-text-secondary); margin: var(--ndo-spacing-8) 0 var(--ndo-spacing-2); }
  .list { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .item { display: grid; grid-template-columns: 64px 1fr; gap: var(--ndo-spacing-4); padding: var(--ndo-spacing-4) var(--ndo-spacing-5); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-left: 4px solid rgb(var(--ndo-primary-500)); border-radius: var(--ndo-radius-lg); color: inherit; text-decoration: none; transition: var(--ndo-transition-shadow); }
  .item:hover { box-shadow: var(--ndo-shadow-md); }
  .item.kind-lab { border-left-color: rgb(var(--ndo-green-600)); }
  .item.kind-team { border-left-color: rgb(var(--ndo-brand-violet-500)); }
  .date { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
  .date .d { font-size: var(--ndo-text-3xl); line-height: var(--ndo-lh-3xl); font-weight: var(--ndo-weight-bold); }
  .date .w { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-semibold); text-transform: uppercase; letter-spacing: 0.08em; color: var(--ndo-color-text-muted); }
  .top { display: flex; gap: var(--ndo-spacing-3); align-items: center; }
  .badge { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-link); }
  .dur { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .title { font-size: var(--ndo-text-lg); line-height: var(--ndo-lh-lg); font-weight: var(--ndo-weight-bold); margin: 2px 0 var(--ndo-spacing-1); }
  .tldr { margin: 0; color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); line-height: var(--ndo-lh-sm); }
  .counts { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-3) var(--ndo-spacing-4); margin-top: var(--ndo-spacing-2); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
</style>
