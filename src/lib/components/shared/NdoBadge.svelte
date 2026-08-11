<script lang="ts">
  // The domain badge. One component for all three axes, because a lifecycle
  // stage, a resource nature and a property regime are the same visual object
  // with a different vocabulary lookup.
  //
  // The `variant` slugs match the `ndo-badge` custom element exactly, so an
  // embedded consumer and a prototype screen render the same badge.
  import { NATURE_VOCAB, REGIME_VOCAB, STAGE_VOCAB } from '$lib/ndo-ui';
  import type { LifecycleStage, PropertyRegime, ResourceNature } from '$lib/types';

  type Props =
    | { stage: LifecycleStage; nature?: never; regime?: never; variant?: never; label?: string; icon?: boolean }
    | { nature: ResourceNature; stage?: never; regime?: never; variant?: never; label?: string; icon?: boolean }
    | { regime: PropertyRegime; stage?: never; nature?: never; variant?: never; label?: string; icon?: boolean }
    | { variant: string; label: string; stage?: never; nature?: never; regime?: never; icon?: boolean };

  let { stage, nature, regime, variant, label, icon = true }: Props = $props();

  const vocab = $derived(
    stage ? STAGE_VOCAB[stage] : nature ? NATURE_VOCAB[nature] : regime ? REGIME_VOCAB[regime] : null
  );
  const slug = $derived(vocab?.variant ?? variant ?? 'neutral');
  const text = $derived(label ?? stage ?? nature ?? regime ?? '');
</script>

<span class="ndo-badge ndo-badge--{slug}" title={vocab?.hint}>
  {#if icon && vocab}<span aria-hidden="true">{vocab.icon}</span>{/if}{text}
</span>
