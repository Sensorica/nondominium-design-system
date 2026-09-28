<!--
  Replica of docs/prototypes/original/ds/components/badge/badge.card.html,
  built on the real `<ndo-badge>` custom element (registry/ndo-badge.svelte),
  not a reimplementation.

  Until 2026-09-28, this card disagreed with Claude Design's Badge.jsx on
  every row below except Lifecycle and Nature (op-state colour and variant
  prefix, regime hue, rule shape and hue, rivalry fill vs outline, two scope
  hues) — real pixel differences from using the registry's own component
  rather than reimplementing Claude Design's. Soushi ratified Claude Design as
  this repo's fidelity source that evening, so `registry/ndo-badge.svelte` was
  rewritten to match Badge.jsx's colours, shapes and fills exactly, keeping
  its existing variant names as the canonical ones and accepting Claude
  Design's `opstate-*` names as aliases for `op-*` (see that file's own
  comments for the per-block history and reasoning). This card's rows below
  still use the registry's own `op-*` names; they now render identically to
  Claude Design's `opstate-*` rows.
-->
<script lang="ts">
  import { paths } from '$lib/paths';

  const rows: [string, [string, string][]][] = [
    [
      'Lifecycle',
      [
        ['lifecycle-ideation', 'Ideation'],
        ['lifecycle-specification', 'Specification'],
        ['lifecycle-development', 'Development'],
        ['lifecycle-prototype', 'Prototype'],
        ['lifecycle-stable', 'Stable'],
        ['lifecycle-distributed', 'Distributed'],
        ['lifecycle-active', 'Active'],
        ['lifecycle-hibernating', 'Hibernating'],
        ['lifecycle-deprecated', 'Deprecated'],
        ['lifecycle-end-of-life', 'EndOfLife']
      ]
    ],
    [
      'Nature',
      [
        ['nature-physical', 'Physical'],
        ['nature-digital', 'Digital'],
        ['nature-service', 'Service'],
        ['nature-hybrid', 'Hybrid'],
        ['nature-information', 'Information']
      ]
    ],
    [
      'Regime',
      [
        ['regime-nondominium', 'Nondominium'],
        ['regime-commons', 'Commons'],
        ['regime-collective', 'Collective'],
        ['regime-pool', 'Pool'],
        ['regime-common-pool', 'CommonPool'],
        ['regime-private', 'Private']
      ]
    ],
    [
      'Rule',
      [
        ['rule-access-requirement', 'AccessRequirement'],
        ['rule-usage-limit', 'UsageLimit'],
        ['rule-transfer-condition', 'TransferCondition'],
        ['rule-maintenance-schedule', 'MaintenanceSchedule']
      ]
    ],
    [
      'Rivalry · Scope',
      [
        ['rivalry-rivalrous', 'Rivalrous'],
        ['rivalry-non-rivalrous', 'NonRivalrous'],
        ['scope-project', 'Project'],
        ['scope-network', 'Network'],
        ['scope-public', 'Public']
      ]
    ],
    [
      'Op state',
      [
        ['op-available', 'Available'],
        ['op-reserved', 'Reserved'],
        ['op-in-transit', 'InTransit'],
        ['op-in-storage', 'InStorage'],
        ['op-in-maintenance', 'InMaintenance'],
        ['op-in-use', 'InUse'],
        ['op-pending-validation', 'PendingValidation']
      ]
    ],
    [
      'Special',
      [
        ['coming-soon', 'Coming soon'],
        ['neutral', 'Neutral']
      ]
    ]
  ];
</script>

<svelte:head>
  <script type="module" src={paths.registryBundle()}></script>
</svelte:head>

<div>
  {#each rows as [k, vs] (k)}
    <div class="row">
      <span class="k">{k}</span>
      {#each vs as [variant, label] (variant)}
        <ndo-badge {variant} {label}></ndo-badge>
      {/each}
    </div>
  {/each}
</div>

<style>
  .row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 10px; }
  .k {
    width: 92px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-500));
  }
</style>
