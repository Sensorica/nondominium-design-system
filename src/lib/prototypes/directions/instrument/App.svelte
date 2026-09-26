<script lang="ts">
  // C Instrument: a technical bench, one shared resource at a time.
  //
  // Layout from the handoff's C.jsx and "C Instrument.html": a 52px top bar
  // with every NDO in a scrolling strip plus Browse, a 310px spec sheet on the
  // left, and the bench on the right (a diagram of everything attached to the
  // NDO, with a 30-day activity chart under it). Restyled on design-system
  // tokens; the handoff's own palette is not carried over.
  //
  // The NDO on the bench is part of the URL (`?ndo=`), so a reviewer can link
  // to the bench for a given resource. The direction has one view, `bench`.
  import { paths } from '$lib/paths';
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { EXAMPLE_NDO } from '$lib/prototypes/store/logic';
  import { currentRecord, goView } from '$lib/prototypes/url.svelte';
  import { AgentAvatar, FlowMenu, ModalHost, Onboarding, Toasts, modals } from '$lib/prototypes/ui';
  import SpecSheet from './SpecSheet.svelte';
  import Bench from './Bench.svelte';

  const requested = $derived(currentRecord().ndo);
  const id = $derived.by(() => {
    if (requested && proto.q.ndo(requested)) return requested;
    if (proto.q.ndo(EXAMPLE_NDO)) return EXAMPLE_NDO;
    return proto.s.ndos[0]?.id ?? null;
  });

  function select(ndo: string) {
    goView('instrument', 'bench', { ndo });
  }

  /** The strip shows the first three words of a name, as in the handoff. */
  const short = (name: string) => name.split(' ').slice(0, 3).join(' ');
</script>

<div class="instrument">
  <header class="bar">
    <span class="brand">
      <img src={paths.logoMark()} alt="" width="26" height="26" />
      <span>Nondominium</span>
    </span>
    <button type="button" class="me" title="Your profile" onclick={() => modals.open({ type: 'profile' })}>
      <AgentAvatar id={proto.me.id} size={24} />
    </button>

    <nav class="strip" aria-label="Shared resources">
      {#each proto.s.ndos as n (n.id)}
        <button
          type="button"
          class="tab"
          class:on={n.id === id}
          title={n.name}
          aria-current={n.id === id ? 'page' : undefined}
          onclick={() => select(n.id)}
        >
          {short(n.name)}
          {#if proto.q.signalsOf(n.id).length}<i class="dot" aria-label="needs attention"></i>{/if}
        </button>
      {/each}
      <button type="button" class="tab" onclick={() => modals.open({ type: 'create', after: select })}>+ new</button>
      <button type="button" class="tab" onclick={() => modals.open({ type: 'browse', onOpen: select })}>
        browse {proto.s.ndos.length}
      </button>
    </nav>

    <div class="peer">
      <FlowMenu ndo={id} onOpen={select} />
      <button type="button" class="stat" onclick={() => proto.actions.toggleOffline()} title="Go online or offline">
        node <b class:off={proto.s.offline}>● {proto.s.offline ? 'offline' : 'online'}</b>
      </button>
      <span class="stat">peers <b>{proto.s.offline ? 0 : 23}</b></span>
      <button type="button" class="stat" onclick={() => modals.open({ type: 'receipts' })} title="Your private receipts">
        receipts <b>{proto.s.receipts.length}</b>
      </button>
      <button type="button" class="stat reset" onclick={() => proto.actions.reset()} title="Reload the example">reset</button>
    </div>
  </header>

  {#if id}
    <div class="wrap">
      <SpecSheet {id} />
      <Bench {id} />
    </div>
  {:else}
    <div class="wrap wrap--empty">
      <div class="empty">
        <p class="lbl">No NDO on the bench</p>
        <p>NDOs are scoped to groups. Declare one, or join a group with an invite link.</p>
        <div class="empty__actions">
          <button type="button" class="btn" onclick={() => modals.open({ type: 'create', after: select })}>+ Declare NDO</button>
          <button type="button" class="btn btn--ghost" onclick={() => modals.open({ type: 'join' })}>→ Join group</button>
        </div>
      </div>
    </div>
  {/if}

  <ModalHost />
  <Toasts />
  <Onboarding onndo={select} />
</div>

<style>
  .instrument {
    --proto-accent: rgb(var(--ndo-primary-600));
    --proto-accent-hover: rgb(var(--ndo-primary-700));
    --proto-radius: var(--ndo-radius-lg);
    --proto-control-radius: var(--ndo-radius-sm);
    --proto-field-radius: var(--ndo-radius-sm);
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--ndo-color-bg-app);
    color: var(--ndo-color-text-primary);
    font-family: var(--ndo-font-sans);
    overflow: hidden;
  }

  /* ── Top bar ── */
  .bar {
    height: 52px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 0 20px;
    background: rgb(var(--ndo-brand-ink));
    color: rgb(var(--ndo-color-text-inverse));
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.02em;
  }
  .brand img {
    border-radius: var(--ndo-radius-md);
    background: rgb(var(--ndo-gray-50));
    padding: 2px;
  }
  .me {
    display: inline-flex;
    flex-shrink: 0;
    margin-left: -8px;
    padding: 0;
    border: none;
    background: none;
    border-radius: var(--ndo-radius-pill);
    cursor: pointer;
  }
  .me:focus-visible,
  .tab:focus-visible,
  .stat:focus-visible,
  .btn:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  .strip {
    display: flex;
    gap: 4px;
    margin-left: 10px;
    overflow-x: auto;
    flex: 1 1 auto;
    min-width: 0;
    scrollbar-width: thin;
  }
  .tab.tab {
    position: relative;
    flex-shrink: 0;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    padding: 6px 10px;
    border: none;
    border-radius: var(--ndo-radius-sm);
    background: transparent;
    color: rgb(var(--ndo-gray-400));
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .tab.tab:hover {
    color: rgb(var(--ndo-color-text-inverse));
  }
  .tab.tab.on {
    background: rgb(var(--ndo-brand-ink-soft));
    color: rgb(var(--ndo-color-text-inverse));
  }
  .dot {
    position: absolute;
    top: 3px;
    right: 2px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgb(var(--ndo-amber-600));
  }

  .peer {
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    white-space: nowrap;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: rgb(var(--ndo-gray-400));
  }
  .stat.stat {
    font: inherit;
    color: inherit;
    padding: 0;
    border: none;
    background: none;
  }
  button.stat.stat {
    cursor: pointer;
  }
  button.stat.stat:hover {
    color: rgb(var(--ndo-color-text-inverse));
  }
  .stat b {
    font-weight: var(--ndo-weight-normal);
    color: rgb(var(--ndo-brand-teal-300));
  }
  .stat b.off {
    color: rgb(var(--ndo-amber-600));
  }
  .reset {
    text-decoration: underline;
  }

  /* ── Body ── */
  .wrap {
    display: grid;
    grid-template-columns: 310px minmax(0, 1fr);
    flex: 1;
    min-height: 0;
  }
  .wrap--empty {
    grid-template-columns: 1fr;
    place-items: center;
  }
  .empty {
    text-align: center;
    max-width: 420px;
    padding: var(--ndo-spacing-6);
  }
  .empty p {
    font-size: var(--ndo-text-sm);
    color: var(--ndo-color-text-secondary);
  }
  .lbl {
    font-family: var(--ndo-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ndo-color-text-muted);
  }
  .empty__actions {
    display: flex;
    justify-content: center;
    gap: var(--ndo-spacing-2);
  }
  .btn.btn {
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-semibold);
    padding: 8px 12px;
    border: 1px solid rgb(var(--ndo-primary-600));
    border-radius: var(--ndo-radius-sm);
    background: rgb(var(--ndo-primary-600));
    color: rgb(var(--ndo-color-text-inverse));
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .btn.btn:hover {
    background: rgb(var(--ndo-primary-700));
    border-color: rgb(var(--ndo-primary-700));
  }
  .btn.btn--ghost {
    background: rgb(var(--ndo-color-card-bg));
    color: var(--ndo-color-text-primary);
    border-color: var(--ndo-color-border-strong);
  }
  .btn.btn--ghost:hover {
    background: var(--ndo-color-surface);
    border-color: var(--ndo-color-border-strong);
  }
</style>
