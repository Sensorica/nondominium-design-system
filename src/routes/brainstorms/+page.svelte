<script lang="ts">
  // Every published brainstorm board, newest first, with full-text search and
  // filters by V stage, status, project and language. Each opens at
  // /brainstorms/<slug> inside the site chrome. An empty content/brainstorms/
  // renders the empty message.
  import { paths } from '$lib/paths';
  import { STAGES, STAGE_LABEL, STATUS_LABEL, LANG_LABEL } from '$lib/brainstorms/labels';

  let { data } = $props();
  let query = $state('');
  let stage = $state('');
  let status = $state('');
  let project = $state('');
  let lang = $state('');

  const all = $derived(data.brainstorms);
  const present = (key: 'lifecycle' | 'status' | 'project' | 'lang') => [...new Set(all.map((b) => b[key]))];
  // Stages in V order, then any unknown word at the end.
  const stages = $derived([...STAGES.filter((s) => all.some((b) => b.lifecycle === s)), ...present('lifecycle').filter((s) => !(STAGES as readonly string[]).includes(s))]);
  const statuses = $derived(present('status'));
  const projects = $derived(present('project'));
  const langs = $derived(present('lang'));

  const terms = $derived(query.trim().toLowerCase().split(/\s+/).filter(Boolean));
  const shown = $derived(
    all.filter(
      (b) =>
        (!stage || b.lifecycle === stage) &&
        (!status || b.status === status) &&
        (!project || b.project === project) &&
        (!lang || b.lang === lang) &&
        terms.every((t) => b.haystack.includes(t))
    )
  );
  const months = $derived(
    shown.reduce<{ month: string; items: typeof shown }[]>((acc, b) => {
      const month = new Date(`${b.date}T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      const last = acc.at(-1);
      if (last?.month === month) last.items.push(b);
      else acc.push({ month, items: [b] });
      return acc;
    }, [])
  );
  const count = (key: 'lifecycle' | 'status' | 'project' | 'lang', v: string) => all.filter((b) => b[key] === v).length;
  const filtered = $derived(!!(query || stage || status || project || lang));
  function reset() {
    query = stage = status = project = lang = '';
  }

  const day = (d: string) => new Date(`${d}T12:00:00`).getDate();
  const weekday = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short' });
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<svelte:head><title>Brainstorms — Nondominium Design System</title></svelte:head>

<main class="brainstorms">
  <header>
    <h1 class="ndo-h1">Brainstorms</h1>
    <p class="lede">
      The boards where Nondominium's design is worked out, from the first brainstorm down the V to deployment. Open one to read it, answer its decision cards, and comment for the team.
    </p>
    {#if all.length}
      <div class="summary">
        <span><b>{all.length}</b> boards</span>
        <span><b>{count('status', 'open')}</b> open</span>
        <span><b>{count('status', 'decided')}</b> decided</span>
        <span><b>{stages.length}</b> {stages.length === 1 ? 'stage' : 'stages'} of the V</span>
      </div>

      <div class="tools">
        <input type="search" bind:value={query} placeholder="Search titles, summaries and board text…" aria-label="Search brainstorms" />
        <div class="filters">
          {#if stages.length > 1}
            <div class="filter" role="group" aria-label="Stage">
              <span class="label">Stage</span>
              <button class:on={!stage} aria-pressed={!stage} onclick={() => (stage = '')}>all</button>
              {#each stages as s}<button class:on={stage === s} aria-pressed={stage === s} onclick={() => (stage = stage === s ? '' : s)}>{STAGE_LABEL[s] ?? s} <i>{count('lifecycle', s)}</i></button>{/each}
            </div>
          {/if}
          {#if statuses.length > 1}
            <div class="filter" role="group" aria-label="Status">
              <span class="label">Status</span>
              <button class:on={!status} aria-pressed={!status} onclick={() => (status = '')}>all</button>
              {#each statuses as s}<button class:on={status === s} aria-pressed={status === s} onclick={() => (status = status === s ? '' : s)}>{STATUS_LABEL[s] ?? s} <i>{count('status', s)}</i></button>{/each}
            </div>
          {/if}
          {#if projects.length > 1}
            <div class="filter" role="group" aria-label="Project">
              <span class="label">Project</span>
              <button class:on={!project} aria-pressed={!project} onclick={() => (project = '')}>all</button>
              {#each projects as p}<button class:on={project === p} aria-pressed={project === p} onclick={() => (project = project === p ? '' : p)}>{cap(p)} <i>{count('project', p)}</i></button>{/each}
            </div>
          {/if}
          {#if langs.length > 1}
            <div class="filter" role="group" aria-label="Language">
              <span class="label">Language</span>
              <button class:on={!lang} aria-pressed={!lang} onclick={() => (lang = '')}>all</button>
              {#each langs as l}<button class:on={lang === l} aria-pressed={lang === l} onclick={() => (lang = lang === l ? '' : l)}>{LANG_LABEL[l] ?? l} <i>{count('lang', l)}</i></button>{/each}
            </div>
          {/if}
        </div>
        {#if filtered}
          <p class="shown" aria-live="polite">{shown.length} of {all.length} boards <button class="reset" onclick={reset}>clear</button></p>
        {/if}
      </div>
    {/if}
  </header>

  {#if all.length === 0}
    <p class="empty">No brainstorm board has been published yet. A Niceboard source dropped into <code>content/brainstorms/</code> as <code>YYYY-MM-DD-&lt;slug&gt;.md</code>, with its compiled page in <code>static/brainstorms/boards/</code>, appears here on the next build.</p>
  {:else if shown.length === 0}
    <p class="empty">No board matches. <button class="reset" onclick={reset}>Clear the search and filters</button></p>
  {/if}

  {#each months as group (group.month)}
    <h2>{group.month}</h2>
    <div class="list">
      {#each group.items as b (b.slug)}
        <a class="item status-{b.status}" href={paths.brainstorm(b.slug)} lang={b.lang}>
          <div class="date"><span class="d">{day(b.date)}</span><span class="w">{weekday(b.date)}</span></div>
          <div class="body">
            <div class="top">
              <span class="badge">{STAGE_LABEL[b.lifecycle] ?? b.lifecycle}</span>
              <span class="status">{STATUS_LABEL[b.status] ?? b.status}</span>
              {#if b.lang !== 'en'}<span class="lang">{LANG_LABEL[b.lang] ?? b.lang}</span>{/if}
            </div>
            <div class="title">{b.title}</div>
            {#if b.summary}<p class="summary-text">{b.summary}</p>{/if}
            <div class="foot"><span>{cap(b.project)}</span><span>{b.date}</span></div>
          </div>
        </a>
      {/each}
    </div>
  {/each}
</main>

<style>
  .brainstorms { max-width: 860px; margin: 0 auto; padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 5rem; color: var(--ndo-color-text-primary); font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); }
  .lede { color: var(--ndo-color-text-secondary); max-width: 640px; margin: var(--ndo-spacing-1) 0 var(--ndo-spacing-4); }
  .summary { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-5); color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); }
  .summary b { color: var(--ndo-color-text-primary); font-size: var(--ndo-text-lg); margin-right: 2px; }
  .tools { margin-top: var(--ndo-spacing-5); display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  input[type='search'] { font: inherit; font-size: var(--ndo-text-sm); width: 100%; box-sizing: border-box; padding: var(--ndo-spacing-2) var(--ndo-spacing-3); color: var(--ndo-color-text-primary); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border-strong); border-radius: var(--ndo-radius-md); }
  input[type='search']:focus { outline: 2px solid rgb(var(--ndo-primary-500)); outline-offset: 1px; }
  .filters { display: flex; flex-direction: column; gap: var(--ndo-spacing-2); }
  .filter { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ndo-spacing-1-5); }
  .filter .label { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-text-muted); min-width: 5.5rem; }
  .filter button { font: inherit; font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-medium); color: var(--ndo-color-text-primary); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 3px 12px; cursor: pointer; }
  .filter button i { font-style: normal; color: var(--ndo-color-text-muted); margin-left: 2px; }
  .filter button.on { background: rgb(var(--ndo-primary-600)); border-color: rgb(var(--ndo-primary-600)); color: rgb(var(--ndo-color-text-inverse)); }
  .filter button.on i { color: inherit; opacity: 0.85; }
  .shown { margin: 0; font-size: var(--ndo-text-xs); color: var(--ndo-color-text-secondary); }
  .reset { font: inherit; font-size: inherit; color: var(--ndo-color-link); background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; }
  .empty { margin-top: var(--ndo-spacing-8); padding: var(--ndo-spacing-5); border: 1px dashed var(--ndo-color-border-strong); border-radius: var(--ndo-radius-lg); color: var(--ndo-color-text-secondary); }
  .empty code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-sm); }
  h2 { font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-text-secondary); margin: var(--ndo-spacing-8) 0 var(--ndo-spacing-2); }
  .list { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .item { display: grid; grid-template-columns: 64px 1fr; gap: var(--ndo-spacing-4); padding: var(--ndo-spacing-4) var(--ndo-spacing-5); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-left: 4px solid rgb(var(--ndo-primary-500)); border-radius: var(--ndo-radius-lg); color: inherit; text-decoration: none; transition: var(--ndo-transition-shadow); }
  .item:hover { box-shadow: var(--ndo-shadow-md); }
  .item.status-decided { border-left-color: rgb(var(--ndo-green-600)); }
  .item.status-archived { border-left-color: var(--ndo-color-border-strong); }
  .date { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
  .date .d { font-size: var(--ndo-text-3xl); line-height: var(--ndo-lh-3xl); font-weight: var(--ndo-weight-bold); }
  .date .w { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-semibold); text-transform: uppercase; letter-spacing: 0.08em; color: var(--ndo-color-text-muted); }
  .top { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-3); align-items: center; }
  .badge { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-link); }
  .status { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-semibold); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 0 8px; color: var(--ndo-color-text-secondary); }
  .status-decided .status { border-color: rgb(var(--ndo-green-600)); color: rgb(var(--ndo-green-600)); }
  .lang { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .title { font-size: var(--ndo-text-lg); line-height: var(--ndo-lh-lg); font-weight: var(--ndo-weight-bold); margin: 2px 0 var(--ndo-spacing-1); }
  .summary-text { margin: 0; color: var(--ndo-color-text-secondary); font-size: var(--ndo-text-sm); line-height: var(--ndo-lh-sm); }
  .foot { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-3) var(--ndo-spacing-4); margin-top: var(--ndo-spacing-2); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  @media (max-width: 520px) {
    .brainstorms { padding: var(--ndo-spacing-6) var(--ndo-spacing-4) 4rem; }
    .item { grid-template-columns: 44px 1fr; gap: var(--ndo-spacing-3); padding: var(--ndo-spacing-3) var(--ndo-spacing-4); }
    .date .d { font-size: var(--ndo-text-2xl); line-height: var(--ndo-lh-2xl); }
    .filter .label { min-width: 100%; }
  }
</style>
