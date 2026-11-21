<script lang="ts">
  // The root error boundary. No nested layout carries its own: every error,
  // including an unknown URL under a full-bleed subtree, walks up to here and
  // renders inside the rail (the root layout keeps the chrome when page.error
  // is set). ErrorView holds the copy per status.
  import { page } from '$app/state';
  import ErrorView from '$lib/components/shared/ErrorView.svelte';
</script>

<svelte:head>
  <title>{page.status} · Nondominium Design System</title>
</svelte:head>

<ErrorView status={page.status} message={page.error?.message} path={page.url.pathname} />
