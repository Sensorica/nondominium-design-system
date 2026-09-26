<svelte:options namespace="svg" />

<script lang="ts">
  // Level 3: one NDO as concentric rings. From the centre out: the resource
  // itself (Layer 0), its rules (Layer 1), its items (Layer 2), and the
  // resources it is linked to. Signal dots pulse between rules and items.
  // Clicking a ring focuses it (the others dim, the card opens its detail);
  // clicking the centre clears the focus.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { plain } from '$lib/prototypes/plain';
  import { modals } from '$lib/prototypes/ui';
  import { ringPts, RING_COLOR, itemColor, activate, type Ring } from './geometry';

  interface Props {
    id: string;
    focus: Ring | null;
    onfocus: (ring: Ring | null) => void;
  }

  let { id, focus, onfocus }: Props = $props();

  const n = $derived(proto.q.ndo(id));
  const rules = $derived(proto.s.rules[id] ?? []);
  const inst = $derived(proto.s.instances[id] ?? []);
  const slots = $derived(
    proto.q
      .hardLinksOf(id)
      .map((h) => ({ type: h.type, label: proto.q.ndo(h.from === id ? h.to : h.from)?.name ?? '' }))
  );
  const sigs = $derived(proto.q.signalsOf(id));

  const slotPts = $derived(ringPts(slots.length + 1, 250));
  const instPts = $derived(ringPts(inst.length, 170, -Math.PI / 4));
  const rulePts = $derived(ringPts(rules.length, 100, Math.PI * 0.75));
  const sigPts = $derived(ringPts(sigs.length, 134, Math.PI * 0.15));

  const dim = (k: Ring) => (focus && focus !== k ? 0.25 : 1);
  const toggle = (k: Ring) => () => onfocus(focus === k ? null : k);
  const attach = () => modals.open({ type: 'attach', ndo: id });
</script>

{#if n}
  <g transform="translate(480 420)">
    <g class="layer" opacity={dim('slots')}>
      <circle
        class="band"
        r="250"
        stroke-width="34"
        stroke-opacity="0.16"
        style:stroke={RING_COLOR.slots}
        role="button"
        tabindex="0"
        aria-label="Linked resources"
        onclick={toggle('slots')}
        onkeydown={activate(toggle('slots'))}
      />
      {#each slotPts as [x, y], i (i)}
        {#if i < slots.length}
          <g
            class="hit"
            role="button"
            tabindex="-1"
            onclick={toggle('slots')}
            onkeydown={activate(toggle('slots'))}
          >
            <circle class="slot" cx={x} cy={y} r="16" style:stroke={RING_COLOR.slots}
              ><title>{slots[i].label}</title></circle
            >
            <text
              class="slot-label"
              {x}
              y={y + (y < 0 ? -26 : 34)}
              text-anchor="middle"
              style:fill={RING_COLOR.slots}
            >
              {plain(slots[i].type)}
            </text>
          </g>
        {:else}
          <g
            class="hit add"
            role="button"
            tabindex="0"
            aria-label="Link another resource"
            onclick={attach}
            onkeydown={activate(attach)}
          >
            <circle cx={x} cy={y} r="16" />
            <text {x} y={y + 5} text-anchor="middle">+</text>
          </g>
        {/if}
      {/each}
    </g>

    <g
      class="layer hit"
      opacity={dim('inst')}
      role="button"
      tabindex="0"
      aria-label="Items"
      onclick={toggle('inst')}
      onkeydown={activate(toggle('inst'))}
    >
      <circle
        class="band"
        r="170"
        stroke-width="28"
        stroke-opacity="0.14"
        style:stroke={RING_COLOR.inst}
      />
      {#each instPts as [x, y], i (i)}
        <circle cx={x} cy={y} r="10" style:fill={itemColor(inst[i][1])} />
        <text class="item-label" x={x + 16} y={y + 4} style:fill={itemColor(inst[i][1])}>
          {inst[i][0].split(' · ')[0]} · {plain(inst[i][1])}
        </text>
      {/each}
      {#if !inst.length}
        <text class="none" y="-162" text-anchor="middle">no items</text>
      {/if}
    </g>

    <g
      class="layer hit"
      opacity={dim('rules')}
      role="button"
      tabindex="0"
      aria-label="Rules"
      onclick={toggle('rules')}
      onkeydown={activate(toggle('rules'))}
    >
      <circle
        class="band"
        r="100"
        stroke-width="22"
        stroke-opacity="0.2"
        style:stroke={RING_COLOR.rules}
      />
      {#each rulePts as [x, y], i (i)}
        <text class="rule-label" {x} y={y + 4} text-anchor="middle" style:fill={RING_COLOR.rules}
          >{plain(rules[i][0])}</text
        >
      {/each}
    </g>

    {#each sigs as g, i (g.id)}
      {@const why = () => modals.open({ type: 'why', sig: g, ndo: id })}
      <circle
        class="signal"
        cx={sigPts[i][0]}
        cy={sigPts[i][1]}
        r="7"
        style:fill={RING_COLOR.sig}
        role="button"
        tabindex="0"
        aria-label="Why am I seeing this? {g.title}"
        onclick={why}
        onkeydown={activate(why)}><title>{g.title}</title></circle
      >
    {/each}

    <g
      class="hit"
      role="button"
      tabindex="0"
      aria-label="Clear focus"
      onclick={() => onfocus(null)}
      onkeydown={activate(() => onfocus(null))}
    >
      <circle class="core" r="54" />
      <text class="core-name" y="-4" text-anchor="middle"
        >{n.name.split(' ').slice(-2).join(' ')}</text
      >
      <text class="core-sub" y="14" text-anchor="middle">{plain(n.stage)} · {plain(n.regime)}</text>
    </g>
  </g>
{/if}

<style>
  .layer {
    transition: opacity 300ms;
  }
  .hit,
  .band,
  .signal {
    cursor: pointer;
    outline: none;
  }
  .band {
    fill: none;
  }
  .band:focus-visible,
  .hit:focus-visible .band {
    stroke-opacity: 0.4;
  }
  .slot {
    fill: rgb(var(--ndo-color-card-bg));
    stroke-width: 2;
  }
  .slot-label,
  .item-label,
  .rule-label {
    font-size: 11px;
    font-weight: var(--ndo-weight-bold);
  }
  .item-label {
    font-weight: var(--ndo-weight-semibold);
  }
  .rule-label {
    font-size: 10px;
  }
  .add circle {
    fill: rgb(var(--ndo-color-card-bg));
    stroke: var(--ndo-color-text-muted);
    stroke-dasharray: 3 3;
    stroke-width: 2;
  }
  .add text {
    fill: var(--ndo-color-text-muted);
    font-size: 15px;
  }
  .add:hover circle,
  .add:focus-visible circle {
    stroke: var(--ndo-color-text-primary);
  }
  .none {
    fill: var(--ndo-color-text-muted);
    font-size: 11px;
  }
  .signal {
    transform-box: fill-box;
    transform-origin: center;
    animation: pulse 1.8s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      transform: scale(1.43);
    }
  }
  .core {
    fill: rgb(var(--ndo-brand-ink));
  }
  .hit:focus-visible .core {
    stroke: rgb(var(--ndo-brand-teal-300));
    stroke-width: 3;
  }
  .core-name {
    fill: rgb(var(--ndo-gray-50));
    font-size: 12px;
    font-weight: var(--ndo-weight-bold);
  }
  .core-sub {
    fill: rgb(var(--ndo-gray-300));
    font-size: 10px;
  }
  @media (prefers-reduced-motion: reduce) {
    .signal {
      animation: none;
    }
    .layer {
      transition: none;
    }
  }
</style>
