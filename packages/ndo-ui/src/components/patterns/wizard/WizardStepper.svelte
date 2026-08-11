<script lang="ts">
  import type { WizardStepMeta } from '../../../domain/wizard-state.js';

  interface Props {
    steps: WizardStepMeta[];
    currentIndex: number;
  }

  let { steps, currentIndex }: Props = $props();
</script>

<nav aria-label="Wizard progress" class="mb-4 flex items-center gap-1">
  {#each steps as step, i}
    <div class="flex items-center gap-1">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold {i <=
        currentIndex
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-500'}"
      >
        {step.shortLabel}
      </span>
      <span
        class="hidden text-xs font-medium sm:inline {i === currentIndex
          ? 'text-gray-900'
          : 'text-gray-500'}"
      >
        {step.label}
      </span>
      {#if i < steps.length - 1}
        <span class="mx-1 hidden h-px w-6 bg-gray-200 sm:block" aria-hidden="true"></span>
      {/if}
    </div>
  {/each}
</nav>
