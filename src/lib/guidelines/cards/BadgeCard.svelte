<!--
  Replica of docs/prototypes/original/ds/components/badge/badge.card.html,
  built on the real `<ndo-badge>` custom element (registry/ndo-badge.svelte),
  not a reimplementation.

  NOTE (report this, do not silently fix): the Claude Design Badge.jsx
  component this card was authored against disagrees with our own
  `ndo-badge` on every row below except Lifecycle and Nature. Using our own
  component (as this builder was told to) means this card will show those
  disagreements as real pixel differences rather than paper over them. Full
  comparison in the report:
    - variant prefix: Claude Design's op-state variants are `opstate-*`; ours
      are `op-*`. Names below use ours, since that is what the custom element
      actually accepts.
    - op-state colour: Claude Design fills each state's own hue (green/amber/
      blue/indigo/orange/teal/gray backgrounds); ours is a neutral gray chip
      with only the leading dot coloured, by deliberate design (see the
      comment block above `.badge[class*='op-']` in registry/ndo-badge.svelte).
    - regime: Claude Design outlines each regime in its own hue (blue/cyan/
      violet/teal/rose/gray); ours is uniformly dashed gray-400 / gray-700 for
      every regime in card style (colour lives only in the `-filter` variants,
      which this card does not demonstrate). The shipped app's own
      NdoCard.svelte also renders regimes uniformly gray, so this is Claude
      Design diverging from the app, not the registry.
    - rule: same four names on both sides, but Claude Design fills a coloured
      background per rule and rounds only the right corners; ours is a square
      gray-50 chip with a coloured left edge only (transfer-condition is rose
      here, violet there; maintenance-schedule is teal here, orange there).
    - rivalry: Claude Design fills rose/cyan; ours outlines orange/cyan with
      small-caps text.
    - scope: `scope-project` matches (gray/gray); `scope-network` is sky here
      vs blue there; `scope-public` is teal here vs green there.
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
