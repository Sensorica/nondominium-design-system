<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'ghost' | 'destructive';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    href?: string;
    onclick?: (e: MouseEvent) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    type = 'button',
    disabled = false,
    href,
    onclick,
    class: className = '',
    children
  }: Props = $props();

  const base =
    'inline-flex items-center justify-center gap-1.5 rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
    destructive: 'bg-red-700 text-white hover:bg-red-800'
  };
</script>

{#if href}
  <a {href} class="{base} {variants[variant]} {className}" aria-disabled={disabled || undefined}>
    {@render children?.()}
  </a>
{:else}
  <button {type} {disabled} {onclick} class="{base} {variants[variant]} {className}">
    {@render children?.()}
  </button>
{/if}
