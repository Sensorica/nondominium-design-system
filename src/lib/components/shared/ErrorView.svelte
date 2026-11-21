<script lang="ts">
  // The one error page of the design system, rendered by src/routes/+error.svelte
  // inside the rail chrome. It answers every status the site can produce:
  //
  //   404   an unknown URL. Both hosts (GitHub Pages and Cloudflare Pages) serve
  //         the SPA fallback build/404.html with a 404 status, the client router
  //         finds no route and lands here. A load that throws error(404) for a
  //         missing meeting, board or release lands here too.
  //   401   sign-in needed, 403 access refused (nothing throws these today; the
  //         review drawer handles its own GitHub sign-in).
  //   5xx   a render or load failure. SvelteKit replaces the message of an
  //         unexpected error with a generic one, so nothing internal reaches
  //         this page; only a message a load chose to throw is shown.
  //
  // No $effect anywhere: a page painted from the 404.html fallback is client
  // rendered rather than hydrated, and effects are not scheduled there (see
  // src/routes/app/+layout.ts). Everything below is markup and $derived.
  import { paths } from '$lib/paths';

  let { status, message, path }: { status: number; message?: string; path: string } = $props();

  type Copy = { label: string; title: string; body: string };

  const copy = $derived.by((): Copy => {
    if (status === 404)
      return {
        label: 'Not found',
        title: 'This page does not exist',
        body: 'Nothing in the design system lives at this address. The link may be mistyped, or the page moved when the routes were reorganised.',
      };
    if (status === 401)
      return {
        label: 'Sign-in needed',
        title: 'You need to sign in to see this',
        body: 'This page is only shown to signed-in reviewers. Sign in, then open the link again.',
      };
    if (status === 403)
      return {
        label: 'Access refused',
        title: 'You do not have access to this page',
        body: 'Your account is signed in but is not allowed to open this page. If you think it should be, ask a maintainer of the design system.',
      };
    if (status >= 500)
      return {
        label: 'Server error',
        title: 'Something broke on our side',
        body: 'The page failed to load. Reloading usually helps; if it keeps happening, the issue tracker is the place to say so.',
      };
    return {
      label: 'Error',
      title: 'Something went wrong',
      body: 'The page could not be shown. Try again, or go back to a section that works.',
    };
  });

  // SvelteKit's own default texts add nothing to the heading; a message a load
  // chose to throw ("No such meeting") does, so only that one is shown.
  const GENERIC = new Set(['Not Found', 'Internal Error', 'Error', '']);
  const detail = $derived(message && !GENERIC.has(message) ? message : '');

  const sections = [
    { href: paths.tokens(), title: 'Tokens', body: 'Palette, scale and radii' },
    { href: paths.patterns(), title: 'Patterns', body: "The app's own class strings" },
    { href: paths.ndoUiPlaybook(), title: 'ndo-ui library', body: 'Component sheets and screens' },
    { href: paths.appHome(), title: 'Current app', body: 'The replica on mock data' },
    { href: paths.prototypes(), title: 'Prototype directions', body: 'Six directions for v0.1' },
    { href: paths.meetings(), title: 'Meetings', body: 'Journals of every meeting' },
    { href: paths.architecture(), title: 'Architecture', body: 'Boards of how it fits' },
    { href: paths.releaseCurrent(), title: 'Release board', body: 'Where v0.1.0 stands' },
  ];

  const ISSUES = 'https://github.com/Sensorica/nondominium-design-system/issues';
</script>

<div class="ndo-shell__content err">
  <section class="err__card" aria-labelledby="err-title">
    <div class="err__mark" aria-hidden="true">
      <!-- The logo's three linked nodes, with the third link broken: a dashed
           line is this system's sign for something missing. -->
      <svg viewBox="0 0 120 96" width="120" height="96">
        <line x1="24" y1="70" x2="60" y2="22" class="err__link" />
        <line x1="60" y1="22" x2="96" y2="70" class="err__link err__link--broken" />
        <circle cx="24" cy="70" r="13" class="err__node err__node--teal" />
        <circle cx="60" cy="22" r="13" class="err__node err__node--violet" />
        <circle cx="96" cy="70" r="13" class="err__node err__node--missing" />
      </svg>
    </div>

    <div class="err__text">
      <p class="err__code">
        <span class="err__status">{status}</span>
        <span class="ndo-label">{copy.label}</span>
      </p>
      <h1 id="err-title" class="ndo-h1">{copy.title}</h1>
      <p class="ndo-p">{copy.body}</p>

      <dl class="err__facts">
        <div>
          <dt class="ndo-label">Address</dt>
          <dd><code>{path}</code></dd>
        </div>
        {#if detail}
          <div>
            <dt class="ndo-label">Reason</dt>
            <dd>{detail}</dd>
          </div>
        {/if}
      </dl>

      <div class="err__actions">
        <a class="ndo-btn ndo-btn--primary err__primary" href={paths.home()}>Back to the design system</a>
        {#if status >= 500}
          <a class="ndo-btn ndo-btn--ghost" href={ISSUES}>Report it</a>
        {/if}
      </div>
    </div>
  </section>

  <section aria-labelledby="err-sections">
    <h2 id="err-sections" class="ndo-h3">Or go straight to a section</h2>
    <ul class="err__doors">
      {#each sections as s (s.href)}
        <li>
          <a class="ndo-card ndo-card--interactive err__door" href={s.href}>
            <span class="err__door-title">{s.title} →</span>
            <span class="ndo-small">{s.body}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .err { padding-top: var(--ndo-spacing-12); }

  .err__card {
    position: relative;
    overflow: hidden;
    display: flex;
    gap: var(--ndo-spacing-8);
    align-items: flex-start;
    padding: var(--ndo-spacing-8);
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-xl);
    box-shadow: var(--ndo-shadow-md);
  }
  /* The mark's gradient along the top edge, as on the hub's doors. */
  .err__card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: var(--ndo-brand-gradient);
  }

  .err__mark { flex-shrink: 0; padding-top: var(--ndo-spacing-2); }
  .err__link { stroke: var(--ndo-color-border-strong); stroke-width: 4; stroke-linecap: round; }
  .err__link--broken { stroke-dasharray: 6 8; }
  .err__node--teal { fill: rgb(var(--ndo-brand-teal-500)); }
  .err__node--violet { fill: rgb(var(--ndo-brand-violet-500)); }
  .err__node--missing {
    fill: none;
    stroke: rgb(var(--ndo-brand-blue-500));
    stroke-width: 3;
    stroke-dasharray: 5 5;
  }

  .err__text { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); min-width: 0; }

  .err__code { display: flex; align-items: baseline; gap: var(--ndo-spacing-3); margin: 0; }
  .err__status {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-3xl);
    font-weight: var(--ndo-weight-bold);
    line-height: 1;
    background: var(--ndo-brand-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .err__facts {
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-2);
    margin: var(--ndo-spacing-2) 0 0;
    padding: var(--ndo-spacing-3) var(--ndo-spacing-4);
    background: var(--ndo-color-surface);
    border: 1px dashed var(--ndo-color-border-strong);
    border-radius: var(--ndo-radius-lg);
  }
  .err__facts div { display: flex; gap: var(--ndo-spacing-3); align-items: baseline; min-width: 0; }
  .err__facts dt { flex-shrink: 0; width: 4.5rem; }
  .err__facts dd { margin: 0; min-width: 0; color: var(--ndo-color-text-primary); font-size: var(--ndo-text-sm); }
  .err__facts code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-sm); overflow-wrap: anywhere; }

  .err__actions { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-3); margin-top: var(--ndo-spacing-2); }
  /* White in both themes: the dark token for text on a fill is dark ink, which
     is too faint on blue-600. */
  .ndo-btn.err__primary { color: rgb(255 255 255); }

  .err__doors {
    list-style: none;
    margin: var(--ndo-spacing-3) 0 0;
    padding: 0;
    display: grid;
    gap: var(--ndo-spacing-3);
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .err__door { display: flex; flex-direction: column; gap: var(--ndo-spacing-1); height: 100%; }
  .err__door-title { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); color: var(--ndo-color-link); }

  a:focus-visible {
    outline: 2px solid rgb(var(--ndo-primary-500));
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    .err { padding-top: var(--ndo-spacing-6); }
    .err__card { flex-direction: column; gap: var(--ndo-spacing-4); padding: var(--ndo-spacing-6) var(--ndo-spacing-5); }
    .err__mark svg { width: 84px; height: 67px; }
    .err__doors { grid-template-columns: 1fr 1fr; }
  }
</style>
