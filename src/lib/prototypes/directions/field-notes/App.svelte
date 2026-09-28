<script lang="ts">
  // B · Field Notes. A searchable register (300px index grouped by group), a
  // centre page for one NDO with four tabs, and a 290px side column for
  // "Left here for you" and receipts. Port of the handoff's B.jsx; the paper
  // register is rendered with design-system neutrals only.
  //
  // State lives in the URL so every page and tab is linkable: the tab is the
  // direction's view (`?view=`), the open entry is `?ndo=`.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { ModalHost, Toasts, Onboarding } from '$lib/prototypes/ui';
  import { currentRecord, currentView, goView } from '$lib/prototypes/url.svelte';
  import { EXAMPLE_NDO } from '$lib/prototypes/store/logic';
  import type { ViewOf } from '$lib/prototypes/directions';
  import Index from './Index.svelte';
  import Entry from './Entry.svelte';
  import Side from './Side.svelte';

  // The original's own webfonts (ISA Phase 9, D8/D9), self-hosted so nothing
  // is fetched from Google Fonts at runtime. The original loads:
  //   Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400
  //   IBM+Plex+Mono:wght@400;500
  //   IBM+Plex+Sans:wght@400;500;600
  // Fontsource's variable Newsreader build spans the same weight (200-800)
  // and optical-size range in one @font-face per script, upright and italic.
  import '@fontsource-variable/newsreader/opsz.css';
  import '@fontsource-variable/newsreader/opsz-italic.css';
  import '@fontsource/ibm-plex-sans/latin-400.css';
  import '@fontsource/ibm-plex-sans/latin-500.css';
  import '@fontsource/ibm-plex-sans/latin-600.css';
  import '@fontsource/ibm-plex-mono/latin-400.css';
  import '@fontsource/ibm-plex-mono/latin-500.css';

  type Tab = ViewOf<'field-notes'>;

  const view = $derived(currentView('field-notes'));
  const record = $derived(currentRecord());

  // The handoff opens on the example NDO, then falls back to the first entry.
  const sel = $derived.by(() => {
    if (record.ndo && proto.q.ndo(record.ndo)) return record.ndo;
    if (proto.q.ndo(EXAMPLE_NDO)) return EXAMPLE_NDO;
    return proto.s.ndos[0]?.id ?? null;
  });

  // A stale or bogus `?ndo=` (after "Start over", say) must not show another
  // entry under its URL: rewrite the URL to the entry actually shown, as D
  // does for its drawer. A bare URL stays bare.
  $effect(() => {
    if (record.ndo && record.ndo !== sel) goView('field-notes', view, sel ? { ndo: sel } : undefined, { replace: true });
  });

  // Opening an entry starts on its trail, as in the handoff.
  function select(id: string) {
    goView('field-notes', 'trail', { ndo: id });
  }

  function setTab(tab: Tab) {
    goView('field-notes', tab, sel ? { ndo: sel } : undefined);
  }

  // The layout's exit chip sits bottom-left by default, exactly where the
  // index's own footer (reset / join group / browse) lives, which would
  // force extra bottom padding the original does not have. Move the chip
  // into the centre page's corner instead, clear of the 300px index column.
  $effect(() => {
    const root = document.documentElement.style;
    root.setProperty('--proto-exit-left', '316px');
    return () => {
      root.removeProperty('--proto-exit-left');
    };
  });
</script>

<div class="fn">
  <Index {sel} onselect={select} />
  <Entry id={sel} {view} onview={setTab} />
  <Side id={sel} />
  <ModalHost />
  <Toasts />
  <Onboarding onndo={select} />
</div>

<style>
  .fn {
    /* The original's own paper register palette (ISA Phase 9, D8): its
     * :root literally declares --paper/--paper2/--ink/--ink2/--mute/--rule/
     * --teal/--rust plus the --pb/--pi/--pm/--pl/--pa/--pac/--pr/--prb/--pmono
     * set ui.jsx reads. Scoped to this root; the design system's own pages
     * keep tokens only. */
    --fn-paper: #f6f2ea;
    --fn-paper2: #efe9dd;
    --fn-ink: #1d2321;
    --fn-ink2: #4a534f;
    --fn-mute: #857f73;
    --fn-rule: #d9d0bf;
    --fn-teal: #137a70;
    --fn-rust: #b4532a;
    --fn-serif: 'Newsreader Variable', 'Newsreader', serif;
    --fn-sans: 'IBM Plex Sans', sans-serif;
    --fn-mono: 'IBM Plex Mono', monospace;

    /* Theme for the shared kit (modals, menu, onboarding, toasts): the
     * original's --pb/--pi/--pm/--pl/--pa/--pac/--pr/--prb/--pmono, mapped
     * to --proto-* per src/lib/prototypes/README.md so shared components
     * render like ui.jsx. The original has no hover treatment for pBtn, so
     * --proto-accent-hover repeats --proto-accent (no visible change). */
    --proto-bg: var(--fn-paper);
    --proto-ink: var(--fn-ink);
    --proto-muted: var(--fn-mute);
    --proto-line: var(--fn-rule);
    --proto-accent: var(--fn-ink);
    --proto-accent-hover: var(--fn-ink);
    --proto-accent-ink: var(--fn-paper);
    --proto-radius: 4px;
    --proto-control-radius: 2px;
    --proto-font: var(--fn-sans);
    --proto-mono: var(--fn-mono);

    display: grid;
    grid-template-columns: 300px minmax(0, 1fr) 290px;
    height: 100%;
    background: var(--fn-paper);
    color: var(--fn-ink);
    font-family: var(--fn-sans);
    /* The design system's own base style sets line-height:1.5 (inherited);
     * the original sets none, so every text element defaults to the font's
     * own metrics ("normal"). Reset it here so it cascades to every
     * descendant that does not declare its own (h1, .lede and .margin still
     * carry the original's explicit 1.05/1.45/1.4). Without this, block
     * siblings following inline text (small→b in .stamp, h4→.when in .ev)
     * get a taller anonymous-block strut than the original and drift the
     * whole page down. */
    line-height: normal;
    overflow: hidden;
  }

  .fn :global(a) {
    color: var(--fn-teal);
  }
  .fn :global(a:hover) {
    color: var(--fn-ink);
  }

  @media (max-width: 1180px) {
    .fn {
      grid-template-columns: 240px minmax(0, 1fr);
      grid-template-rows: auto auto;
      overflow: auto;
    }
  }
</style>
