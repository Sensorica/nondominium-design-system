<script lang="ts">
  // The playbook index. Every category documents patterns that exist in
  // ui/src/lib/components today — not an idealised set. Where the app has no
  // component, the pattern is a recurring class string, and the page says so
  // and cites the file it was lifted from.
  import { paths } from '$lib/paths';

  const categories = [
    { href: paths.patternsButtons(), title: 'Buttons', body: 'Five button treatments, all UnoCSS class strings. There is no Button component in the app.' },
    { href: paths.patternsBadges(), title: 'Badges', body: 'The stage / nature / regime colour maps, duplicated across three files in the app.' },
    { href: paths.patternsCards(), title: 'Cards', body: 'The NDO card, the section panel, and the dashed placeholder.' },
    { href: paths.patternsInputs(), title: 'Inputs', body: 'Two input treatments that differ by whether a field is required.' },
    { href: paths.patternsNavigation(), title: 'Navigation', body: 'Sidebar items, group rows, and the folder-style tab bar.' },
    { href: paths.patternsStatus(), title: 'Status', body: 'Loading, error, empty and coming-soon states.' },
    { href: paths.patternsShell(), title: 'Shell', body: 'The two-column frame and the modal envelope every dialog shares.' }
  ];
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Playbook</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Nondominium has no component library. It styles entirely with UnoCSS utility classes written
    inline, so a "component" here is a class string that recurs. Each page below shows the pattern
    as the app actually renders it and names the file it came from, so a change made here can be
    traced back to the code that has to change with it.
  </p>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Where the same value is written out in more than one file, the page says so. Those duplications
    are the strongest argument this design system has for existing.
  </p>
</header>

<div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {#each categories as category (category.href)}
    <a
      href={category.href}
      class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <h2 class="text-lg font-semibold text-gray-900">{category.title}</h2>
      <p class="mt-1 text-sm text-gray-600">{category.body}</p>
    </a>
  {/each}
</div>
