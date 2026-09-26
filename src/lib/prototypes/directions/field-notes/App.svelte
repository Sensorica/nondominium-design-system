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
    /* The paper register, on design-system neutrals. */
    --fn-paper: rgb(var(--ndo-color-card-bg));
    --fn-paper2: var(--ndo-color-surface);
    --fn-ink: var(--ndo-color-text-primary);
    --fn-ink2: var(--ndo-color-text-secondary);
    --fn-mute: var(--ndo-color-text-muted);
    --fn-rule: var(--ndo-color-border);
    --fn-teal: rgb(var(--ndo-teal-700));
    --fn-rust: rgb(var(--ndo-orange-700));

    /* Theme for the shared kit (modals, menu, onboarding, toasts). */
    --proto-bg: var(--fn-paper);
    --proto-ink: var(--fn-ink);
    --proto-muted: var(--fn-mute);
    --proto-line: var(--fn-rule);
    --proto-accent: rgb(var(--ndo-gray-900));
    --proto-accent-hover: rgb(var(--ndo-teal-700));
    --proto-accent-ink: rgb(255 255 255);
    --proto-radius: var(--ndo-radius-sm);
    --proto-control-radius: var(--ndo-radius-sm);
    --proto-field-radius: var(--ndo-radius-sm);

    display: grid;
    grid-template-columns: 300px minmax(0, 1fr) 290px;
    height: 100%;
    background: var(--fn-paper);
    color: var(--fn-ink);
    font-family: var(--ndo-font-sans);
    overflow: hidden;
  }

  @media (max-width: 1180px) {
    .fn {
      grid-template-columns: 240px minmax(0, 1fr);
      grid-template-rows: auto auto;
      overflow: auto;
    }
  }
</style>
