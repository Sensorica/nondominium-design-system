<script lang="ts">
  // One menu with every v0.1 flow, the same in every direction. Opened by its
  // button or by Cmd/Ctrl+K. Three sections: you and your groups, the
  // Prototype controls (start over, reload the example, Developer details),
  // and, when an NDO is in focus, what you can do with it.
  import './proto.css';
  import AgentAvatar from './AgentAvatar.svelte';
  import { modals, type ModalRequest } from './modals.svelte';
  import { proto } from '../store/store.svelte';
  import { developer } from '../plain';

  interface Props {
    /** The NDO in focus, if any. */
    ndo?: string | null;
    /** Selects an NDO (after browsing or creating one). */
    onOpen?: (ndoId: string) => void;
    /** Selects a group (after creating or joining one). */
    onGroup?: (groupId: string) => void;
    align?: 'left' | 'right';
    label?: string;
  }

  let { ndo = null, onOpen, onGroup, align = 'right', label = 'Menu' }: Props = $props();

  let open = $state(false);
  let button: HTMLButtonElement | null = null;
  const captureButton = (node: HTMLButtonElement) => {
    button = node;
    return () => {
      button = null;
    };
  };
  let rect = $state<DOMRect | null>(null);

  const focus = $derived(proto.q.ndo(ndo));
  const openCount = $derived(proto.q.openCommitments().length);

  type Item = { label: string; run: () => void };
  const m = (req: ModalRequest) => () => modals.open(req);

  const sections = $derived<{ title: string; items: Item[] }[]>([
    {
      title: 'You and your groups',
      items: [
        { label: 'How this works', run: m({ type: 'help' }) },
        { label: 'Your profile', run: m({ type: 'profile' }) },
        { label: '+ Create a group', run: m({ type: 'group', after: onGroup }) },
        { label: '→ Join a group with a link', run: m({ type: 'join', after: onGroup }) },
        { label: '+ Add a shared resource', run: m({ type: 'create', after: onOpen }) },
        { label: 'Find resources', run: m({ type: 'browse', onOpen }) },
        { label: 'Requests · ' + openCount + ' open', run: m({ type: 'commitments' }) },
        { label: 'Your receipts · ' + proto.s.receipts.length, run: m({ type: 'receipts' }) }
      ]
    },
    {
      title: 'Prototype',
      items: [
        { label: 'Start over as a new person', run: () => proto.actions.startFresh() },
        { label: 'Reload the example', run: () => proto.actions.reset() },
        { label: ($developer ? '✓ ' : '') + 'Developer details', run: () => developer.toggle() }
      ]
    },
    ...(focus
      ? [
          {
            title: focus.name,
            items: [
              { label: 'Change its stage', run: m({ type: 'advance', ndo: focus.id }) },
              { label: 'Add a rule', run: m({ type: 'rule', ndo: focus.id }) },
              { label: 'Items and who holds them', run: m({ type: 'resources', ndo: focus.id }) },
              { label: 'Ask to borrow or receive', run: m({ type: 'commit', ndo: focus.id }) },
              { label: 'Requests on this resource', run: m({ type: 'commitments', ndo: focus.id }) },
              { label: 'Link to another resource', run: m({ type: 'attach', ndo: focus.id }) },
              { label: 'Log work', run: m({ type: 'note', ndo: focus.id }) }
            ]
          }
        ]
      : [])
  ]);

  function toggle() {
    open = !open;
    if (open && button) rect = button.getBoundingClientRect();
  }

  function choose(item: Item) {
    open = false;
    item.run();
  }

  function onkeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'Escape') {
      open = false;
    }
  }

  const top = $derived(rect ? Math.min(rect.bottom + 6, window.innerHeight - 120) : 0);
  const left = $derived(
    rect ? Math.max(8, Math.min(align === 'left' ? rect.left : rect.right - 260, window.innerWidth - 268)) : 0
  );
</script>

<svelte:window {onkeydown} onresize={() => (open = false)} />

<div class="pu wrap">
  <button
    {@attach captureButton}
    type="button"
    class="trigger"
    onclick={toggle}
    title="Everything you can do (Ctrl+K)"
    aria-haspopup="menu"
    aria-expanded={open}
  >
    <AgentAvatar id={proto.me.id} size={22} />
    <span>{label}</span>
    <span class="caret">▾</span>
  </button>

  {#if open && rect}
    <!-- A click outside closes the menu; Escape does the same from the keyboard. -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="scrim" onclick={() => (open = false)}></div>
    <div class="menu" role="menu" style:top="{top}px" style:left="{left}px" style:max-height="calc(100vh - {Math.round(top + 12)}px)">
      {#each sections as s (s.title)}
        <div class="section">
          <p class="head">{s.title}</p>
          {#each s.items as item (item.label)}
            <button type="button" role="menuitem" class="item" onclick={() => choose(item)}>{item.label}</button>
          {/each}
        </div>
      {/each}
      <p class="tip">Tip: press Ctrl+K (⌘K on a Mac) to open this menu</p>
    </div>
  {/if}
</div>

<style>
  .wrap {
    position: relative;
  }
  .trigger {
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: inherit;
    background: transparent;
    border: 1px solid currentColor;
    border-radius: var(--_control-radius);
    padding: 4px 12px 4px 4px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    white-space: nowrap;
  }
  .caret {
    opacity: 0.7;
  }
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 45;
  }
  .menu {
    position: fixed;
    z-index: 46;
    width: 260px;
    overflow: auto;
    background: var(--_bg);
    color: var(--_ink);
    border: 1px solid var(--_line);
    border-radius: var(--_radius);
    box-shadow: var(--_shadow);
    padding: 6px;
  }
  .section {
    padding: 4px 0;
  }
  .head {
    margin: 0;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--_muted);
    padding: 6px 10px 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item {
    display: block;
    width: 100%;
    text-align: left;
    font: inherit;
    font-size: 13px;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: var(--_field-radius);
    padding: 7px 10px;
    cursor: pointer;
  }
  .item:hover,
  .item:focus-visible {
    background: var(--_hover);
    outline: none;
  }
  .tip {
    margin: 0;
    font-size: 10px;
    color: var(--_muted);
    padding: 6px 10px;
  }
</style>
