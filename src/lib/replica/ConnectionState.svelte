<script lang="ts">
  // The three states of ui/src/lib/components/HolochainProvider.svelte, which
  // nobody can demo in a running app because they only appear when the
  // conductor is missing or slow. Markup and copy are the app's.
  interface Props {
    status: 'connecting' | 'error' | 'disconnected';
  }
  let { status }: Props = $props();

  const errorMessage = 'Could not connect to ws://localhost:8888 (ECONNREFUSED)';
  const hints = [
    'Is the conductor running? Try `bun run start` from the repo root.',
    'Check that UI_PORT and the app websocket port match.',
    'If you are running a custom network, confirm the .happ is installed.'
  ];
</script>

{#if status === 'connecting'}
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div class="mb-4 animate-pulse text-6xl">⚡</div>
      <p class="text-lg text-gray-600">Connecting to Holochain...</p>
    </div>
  </div>
{:else if status === 'error'}
  <div class="flex min-h-screen items-center justify-center">
    <div class="max-w-md text-center">
      <div class="mb-4 text-6xl">❌</div>
      <h2 class="mb-2 text-xl font-semibold text-red-600">Connection Failed</h2>
      <p class="mb-4 text-gray-600">
        Unable to connect to Holochain conductor: {errorMessage}
      </p>
      <ul class="mb-4 list-disc space-y-1 pl-5 text-left text-sm text-gray-600">
        {#each hints as hint}
          <li>{hint}</li>
        {/each}
      </ul>
      <button
        class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Retry Connection
      </button>
      <details class="mt-4 text-left">
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Connection Details
        </summary>
        <div class="mt-2 rounded bg-gray-100 p-3 font-mono text-xs">
          <p><strong>URL:</strong> ws://localhost:8888</p>
          <p><strong>Mode:</strong> manifest</p>
          <p><strong>Error:</strong> {errorMessage}</p>
        </div>
      </details>
    </div>
  </div>
{:else}
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div class="mb-4 text-6xl">🔌</div>
      <p class="text-lg text-gray-600">Holochain not connected.</p>
    </div>
  </div>
{/if}
