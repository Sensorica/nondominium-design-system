<script lang="ts">
  // The conductor handshake. Nothing an agent can do here but wait, which is
  // exactly why it needs a reviewable screen: it is the first thing anyone sees
  // and the easiest one to leave unpolished.
  import { paths } from '$lib/paths';
  import { joining } from '$lib/guards/joining.svelte';
  import StatusDot from '$lib/components/shared/StatusDot.svelte';
</script>

<div class="flex flex-col items-center text-center gap-4 py-6">
  <span class="spin" aria-hidden="true">🧿</span>
  <h1 class="ndo-h2">Connecting to your conductor</h1>
  <p class="ndo-p" style="max-width:44ch">
    Your source chain lives on your own machine. Nothing loads until the local conductor answers.
  </p>
  <StatusDot status="pending" label="Handshake in progress" />
  <button class="ndo-btn ndo-btn--primary mt-2" onclick={() => joining.to('no-lobby-profile')}>
    Simulate connected
  </button>
  <a class="ndo-small" href={paths.appHome()}>Skip to the lobby</a>
</div>

<style>
  .spin { font-size: 2.5rem; animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
</style>
