<script lang="ts" module>
  export interface BreadcrumbItem {
    label: string;
    href?: string;
    onclick?: () => void;
  }
</script>

<script lang="ts">
  interface Props {
    items: BreadcrumbItem[];
  }

  let { items }: Props = $props();
</script>

<nav aria-label="Breadcrumb" data-testid="breadcrumb" class="text-xs text-gray-500">
  <ol class="flex flex-wrap items-center gap-1">
    {#each items as item, i (i)}
      {@const last = i === items.length - 1}
      <li class="flex items-center gap-1">
        {#if last}
          <span class="font-medium text-gray-800" aria-current="page">{item.label}</span>
        {:else if item.href}
          <a href={item.href} onclick={item.onclick} class="text-blue-600 hover:underline"
            >{item.label}</a
          >
        {:else}
          <button type="button" onclick={item.onclick} class="text-blue-600 hover:underline"
            >{item.label}</button
          >
        {/if}
        {#if !last}
          <span class="text-gray-300" aria-hidden="true">›</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
