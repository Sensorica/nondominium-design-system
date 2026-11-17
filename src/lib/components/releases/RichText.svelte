<script lang="ts">
  // Inline text of a release board: plain runs, bold runs, GitHub links (absolute),
  // and meeting links resolved inside the site through paths.meeting, so they follow
  // the deployment's base. No HTML is injected: every run is a typed value.
  import { paths } from '$lib/paths';
  import type { Rich } from '$lib/releases/types';

  let { runs }: { runs: Rich } = $props();
  const meetingHref = (slug: string, anchor?: string) => `${paths.meeting(slug)}${anchor ? `#${anchor}` : ''}`;
</script>

{#each runs as r}{#if typeof r === 'string'}{r}{:else if 'strong' in r}<b>{r.text}</b>{:else if 'meeting' in r}{#if r.cite}{' '}{/if}<a class="rb-link" class:rb-src={r.cite} href={meetingHref(r.meeting, r.anchor)}>{r.text}{#if r.cite}&nbsp;›{/if}</a>{:else}<a class="rb-link" href={r.href} title={r.title}>{r.text}</a>{/if}{/each}

<style>
  .rb-link { color: var(--ndo-color-link); }
  .rb-src { font-size: 0.78em; white-space: nowrap; text-decoration: none; font-weight: var(--ndo-weight-semibold); }
  .rb-src:hover { text-decoration: underline; }
</style>
