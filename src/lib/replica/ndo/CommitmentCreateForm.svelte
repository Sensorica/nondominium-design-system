<script lang="ts">
  // Copy of ui/src/lib/components/ndo/CommitmentCreateForm.svelte from the app at
  // 20adb117219de3e7a1a45b53d8a02fc0602feb7e. Markup and logic are the app's.
  //
  // Two documented substitutions, both forced by the replica's type surface and
  // neither changing behaviour. Holochain's hash types alias to base64 strings
  // here, so encodeHashToBase64 and decodeHashFromBase64 are identity: they are
  // shimmed rather than deleted so every call site below stays byte-identical to
  // the app, which is what makes a later diff meaningful. And the app reads its
  // own key through holochainClientService, which the prototype has no conductor
  // for, so appContext.myAgentPubKey stands in.
  import type {
    ActionHash,
    AgentPubKey,
    CellId,
    ConstraintViolation,
    PropertyRegime,
    ResourceNature,
    Rivalry,
    VfAction
  } from '../types';
  import { appContext, governanceStore } from '../stores.svelte';

  const encodeHashToBase64 = (h: string): string => h;
  const decodeHashFromBase64 = (s: string): string => s;

  interface Props {
    ndoActionHash: ActionHash;
    /** The NDO's own clone cell; null for legacy NDOs in the shared cell. */
    ndoCellId?: CellId | null;
    propertyRegime: PropertyRegime;
    resourceNature: ResourceNature;
    rivalryOverride?: Rivalry;
    onclose: () => void;
    oncreated?: () => void;
  }

  let {
    ndoActionHash,
    ndoCellId = null,
    propertyRegime,
    resourceNature,
    rivalryOverride,
    onclose,
    oncreated
  }: Props = $props();

  const actions: VfAction[] = [
    'Transfer',
    'Move',
    'Use',
    'Consume',
    'Produce',
    'Work',
    'Modify',
    'Combine',
    'Separate',
    'Raise',
    'Lower',
    'Cite',
    'Accept',
    'InitialTransfer',
    'AccessForUse',
    'TransferCustody'
  ];

  let action = $state<VfAction>('Use');
  let providerB64 = $state('');
  let dueDateLocal = $state('');
  let note = $state('');
  let isSubmitting = $state(false);
  let errorMessage = $state('');
  let violations = $state<ConstraintViolation[]>([]);
  let dryRunPending = $state(false);

  const hardViolations = $derived(violations.filter((v) => v.severity === 'Hard'));
  const softViolations = $derived(violations.filter((v) => v.severity === 'Soft'));

  function ensureProvider() {
    if (!providerB64) {
      // The app throws here when it cannot reach a conductor and deliberately
      // leaves the field empty. In the replica the same fact arrives as null,
      // because appContext.myAgentPubKey is null under ?state=anonymous, which
      // is the keyed ndo-anonymous screen. So the null branch IS that screen,
      // not a typecheck nuisance, and the field must stay empty exactly as the
      // app leaves it.
      const me = appContext.myAgentPubKey;
      if (me) providerB64 = encodeHashToBase64(me);
    }
  }

  $effect(() => {
    ensureProvider();
  });

  async function runDryRun() {
    dryRunPending = true;
    violations = await governanceStore.checkActionConstraints(
      {
        property_regime: propertyRegime,
        resource_nature: resourceNature,
        ...(rivalryOverride && { rivalry_override: rivalryOverride }),
        action
      },
      ndoCellId ?? undefined
    );
    dryRunPending = false;
  }

  $effect(() => {
    void action;
    void runDryRun();
  });

  async function handleSubmit() {
    await runDryRun();
    if (hardViolations.length > 0) {
      errorMessage = 'Resolve Hard action constraints before submitting.';
      return;
    }
    if (!providerB64 || !dueDateLocal) {
      errorMessage = 'Provider and due date are required.';
      return;
    }
    let provider: AgentPubKey;
    try {
      provider = decodeHashFromBase64(providerB64) as AgentPubKey;
    } catch {
      errorMessage = 'Invalid provider pubkey (base64).';
      return;
    }
    isSubmitting = true;
    errorMessage = '';
    const dueMs = new Date(dueDateLocal).getTime();
    const out = await governanceStore.proposeCommitment(
      {
        action,
        provider,
        due_date: dueMs * 1000,
        note: note.trim() || null,
        ndo_identity_hash: ndoActionHash
      },
      ndoCellId ?? undefined
    );
    isSubmitting = false;
    if (out) {
      oncreated?.();
      onclose();
    } else {
      errorMessage = governanceStore.errorMessage ?? 'Failed to propose commitment.';
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div
    class="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl"
    role="dialog"
    aria-modal="true"
    aria-labelledby="commitment-create-title"
  >
    <div class="border-b border-gray-100 px-6 py-4">
      <h2 id="commitment-create-title" class="text-lg font-semibold text-gray-900">
        Propose commitment
      </h2>
      <p class="mt-1 text-sm text-gray-500">
        Dry-runs <code class="text-xs">check_action_constraints</code> before write.
      </p>
    </div>

    <div class="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="c-action">Action</label>
        <select
          id="c-action"
          bind:value={action}
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        >
          {#each actions as a}
            <option value={a}>{a}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="c-provider"
          >Provider (agent pubkey b64)</label
        >
        <input
          id="c-provider"
          type="text"
          bind:value={providerB64}
          class="w-full rounded border border-gray-300 px-3 py-2 font-mono text-xs"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="c-due">Due date</label>
        <input
          id="c-due"
          type="datetime-local"
          bind:value={dueDateLocal}
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm text-gray-600" for="c-note">Note</label>
        <textarea
          id="c-note"
          rows="2"
          bind:value={note}
          class="w-full rounded border border-gray-200 px-3 py-2 text-sm"
        ></textarea>
      </div>

      {#if hardViolations.length > 0}
        <ul class="space-y-1 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {#each hardViolations as v (v.rule_id + v.message)}
            <li><span class="font-medium">[{v.rule_id}]</span> {v.message}</li>
          {/each}
        </ul>
      {/if}
      {#if softViolations.length > 0}
        <ul class="space-y-1 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {#each softViolations as v (v.rule_id + v.message)}
            <li><span class="font-medium">[{v.rule_id}]</span> {v.message}</li>
          {/each}
        </ul>
      {/if}
      {#if errorMessage}
        <p class="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{errorMessage}</p>
      {/if}
    </div>

    <div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
      <button type="button" onclick={onclose} class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >Cancel</button
      >
      <button
        type="button"
        disabled={isSubmitting || dryRunPending || hardViolations.length > 0}
        onclick={handleSubmit}
        class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting…' : 'Propose'}
      </button>
    </div>
  </div>
</div>
