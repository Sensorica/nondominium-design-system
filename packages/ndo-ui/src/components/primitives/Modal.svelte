<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    onclose?: () => void;
    maxWidth?: 'sm' | 'md' | 'lg';
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    title,
    subtitle,
    onclose,
    maxWidth = 'md',
    children,
    footer
  }: Props = $props();

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }[maxWidth];
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div
    class="relative w-full {maxWidthClass} rounded-xl border border-gray-200 bg-white shadow-xl"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="border-b border-gray-100 px-6 py-4">
      <h2 id="modal-title" class="text-lg font-semibold text-gray-900">{title}</h2>
      {#if subtitle}
        <p class="mt-1 text-sm text-gray-500">{subtitle}</p>
      {/if}
    </div>

    <div class="max-h-[70vh] overflow-y-auto px-6 py-4">
      {@render children?.()}
    </div>

    {#if footer}
      <div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
        {@render footer()}
      </div>
    {/if}
  </div>
</div>
