<!-- Replica of docs/prototypes/original/ds/guidelines/type-scale.html -->
<script lang="ts">
  const rows = [
    {
      m: '24/32 bold · page title',
      text: 'Browse NDOs',
      size: '--ndo-text-2xl',
      lh: '--ndo-lh-2xl',
      weight: 'var(--ndo-weight-bold)'
    },
    {
      m: '20/28 bold · NDO title',
      text: 'Community Solar Array',
      size: '--ndo-text-xl',
      lh: '--ndo-lh-xl',
      weight: 'var(--ndo-weight-bold)'
    },
    {
      m: '18/28 semibold · section / card name',
      text: 'NDO browser',
      size: '--ndo-text-lg',
      lh: '--ndo-lh-lg',
      weight: 'var(--ndo-weight-semibold)'
    },
    {
      m: '16/24 semibold · subsection',
      text: 'Economic resources',
      size: '--ndo-text-base',
      lh: '--ndo-lh-base',
      weight: 'var(--ndo-weight-semibold)'
    },
    {
      m: '14/20 · body',
      text: 'Shared photovoltaic infrastructure governed under nondominium principles.',
      size: '--ndo-text-sm',
      lh: '--ndo-lh-sm',
      weight: '400'
    },
    {
      m: '12/16 · meta',
      text: 'By uhCAk2vMp8… · 3/9/2024',
      size: '--ndo-text-xs',
      lh: '--ndo-lh-xs',
      weight: 'var(--ndo-weight-medium)'
    }
  ];
</script>

{#each rows as row (row.m)}
  <div class="row">
    <span class="m">{row.m}</span>
    <span style="font-size:var({row.size});line-height:var({row.lh});font-weight:{row.weight};color:rgb(var(--ndo-gray-900))">
      {row.text}
    </span>
  </div>
{/each}

<style>
  .row { display: flex; align-items: baseline; gap: 16px; margin-bottom: 6px; }
  .m { width: 150px; flex-shrink: 0; font-family: var(--ndo-font-mono); font-size: 11px; color: rgb(var(--ndo-gray-500)); }
</style>
