<script lang="ts">
  interface Props {
    label?: string;
    class?: string;
  }

  let { label = 'Soon', class: className = '' }: Props = $props();
</script>

<span
  class="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-600 uppercase {className}"
  >{label}</span
>
