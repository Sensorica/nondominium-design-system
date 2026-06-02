<script lang="ts">
  import {
    STAGE_IDENTITY_COLORS,
    NATURE_IDENTITY_COLORS,
    REGIME_IDENTITY_COLORS,
    STAGE_FILTER_COLORS,
    NATURE_COLORS,
    REGIME_FILTER_COLORS,
    CARD_REGIME_CLASS
  } from '../../domain/variants.js';
  import type { LifecycleStage, PropertyRegime, ResourceNature } from '../../domain/types.js';
  import { CARD_ACTIVE_LIFECYCLE_STAGES } from '../../domain/enums.js';

  interface Props {
    kind: 'lifecycle' | 'nature' | 'regime';
    value: string;
    mode?: 'identity' | 'filter' | 'card-lifecycle' | 'card-regime';
  }

  let { kind, value, mode = 'identity' }: Props = $props();

  function badgeClass(): string {
    if (mode === 'card-regime') return CARD_REGIME_CLASS;
    if (mode === 'card-lifecycle') {
      const active = CARD_ACTIVE_LIFECYCLE_STAGES.includes(value as LifecycleStage);
      return `rounded px-2 py-0.5 text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`;
    }
    if (kind === 'lifecycle') {
      const map = mode === 'filter' ? STAGE_FILTER_COLORS : STAGE_IDENTITY_COLORS;
      return `rounded px-2 py-0.5 text-xs font-semibold border ${map[value as LifecycleStage] ?? 'bg-gray-100 text-gray-600 border-gray-300'}`;
    }
    if (kind === 'nature') {
      const map = mode === 'filter' ? NATURE_COLORS : NATURE_IDENTITY_COLORS;
      const c = map[value as ResourceNature] ?? 'bg-gray-100 text-gray-600 border-gray-300';
      return `rounded px-2 py-0.5 text-xs font-medium ${mode === 'filter' ? `border ${c}` : c}`;
    }
    const map = mode === 'filter' ? REGIME_FILTER_COLORS : REGIME_IDENTITY_COLORS;
    const c = map[value as PropertyRegime] ?? 'bg-gray-100 text-gray-600 border-gray-300';
    if (mode === 'filter') {
      return `rounded border border-dashed px-2 py-0.5 text-xs font-medium ${c}`;
    }
    return `rounded border border-dashed px-2 py-0.5 text-xs font-medium ${c}`;
  }
</script>

<span class={badgeClass()}>{value}</span>
