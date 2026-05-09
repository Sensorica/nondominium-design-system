<svelte:head><title>NDO Create — UI Kit</title></svelte:head>

<script lang="ts">
  const EXISTING_NAMES = ['Community Solar Array', 'Open Hardware CNC Bed', 'Distributed Sensor Design v3', 'Collective Laser Cutter'];

  const REGIME_HINTS: Record<string, string> = {
    nondominium: '🔵 Uncapturable by design — no agent or group can assert ownership or enclose this resource. Governance rules are cryptographically embedded.',
    commons:     '🩵 Non-rivalrous shared resource governed by licensing and attribution. Can theoretically be enclosed through governance capture.',
    collective:  '🟣 Cooperative ownership where decisions are made collectively. Members share both governance rights and benefit streams.',
    pool:        '🩵 Pool of shareable physical resources requiring custody transfers, scheduling, and maintenance governance.',
    'common-pool': '🌹 Rivalrous consumable resource governed by quota and depletion rules. Community-managed replenishment cycles.',
    private:     '⬜ Full rights bundle with individual or organisational ownership. Fully alienable.'
  };

  const NATURE_HINTS: Record<string, string> = {
    physical:    'Material object — tools, equipment, spaces, consumable stocks. Requires custody chain management.',
    digital:     'Software, data, design files, documents. Non-rivalrous: can be copied at zero marginal cost.',
    service:     'Ongoing capability provided by agents. Defined by process commitments and performance metrics.',
    hybrid:      'Digital twin of a physical resource — a design file linked to a specific manufactured instance.',
    information: 'Data, research outputs, sensor streams. Non-rivalrous and typically governed under attribution or commons regimes.'
  };

  const REGIME_CHIPS = [
    { value: 'nondominium', label: 'Nondominium', color: 'rgb(var(--ndo-blue-700))' },
    { value: 'commons',     label: 'Commons',     color: 'rgb(var(--ndo-cyan-700))' },
    { value: 'collective',  label: 'Collective',  color: 'rgb(var(--ndo-violet-700))' },
    { value: 'pool',        label: 'Pool',        color: 'rgb(var(--ndo-teal-700))' },
    { value: 'common-pool', label: 'CommonPool',  color: 'rgb(var(--ndo-rose-700))' },
    { value: 'private',     label: 'Private',     color: 'rgb(var(--ndo-gray-500))' },
  ];

  let name       = $state('');
  let regime     = $state('');
  let nature     = $state('');
  let lifecycle  = $state('');
  let description = $state('');
  let submitted  = $state(false);

  let isDupe = $derived(
    name.trim() !== '' &&
    EXISTING_NAMES.some(n => n.toLowerCase() === name.trim().toLowerCase())
  );
  let canSubmit = $derived(name.trim().length > 0);

  function selectRegime(value: string) {
    regime = value;
  }

  function submit() {
    if (!canSubmit) return;
    submitted = true;
  }
</script>

<div class="page">
  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/ui-kit/group">← Sensorica</a>
    <span>/</span>
    <span>New NDO</span>
  </nav>

  {#if !submitted}
    <!-- Create form -->
    <div class="form-card">
      <div class="form-header">
        <h1 class="form-title">New NDO</h1>
        <p class="form-subtitle">Creating in group: <strong>Sensorica</strong></p>
      </div>

      <div class="form-body">
        <!-- Name -->
        <fieldset class="field-group">
          <label for="ndo-name">Name<span class="required-mark">*</span></label>
          <input
            id="ndo-name"
            type="text"
            bind:value={name}
            placeholder="e.g., Community Solar Array"
            autocomplete="off"
          />
          {#if isDupe}
            <div class="name-warning">
              ⚠ An NDO named "<strong>{name}</strong>" already exists in this group.
              You can continue, but consider a more specific name.
            </div>
          {/if}
        </fieldset>

        <hr class="form-divider" />

        <!-- Property regime -->
        <fieldset class="field-group">
          <label for="property-regime">Property Regime</label>
          <select id="property-regime" bind:value={regime}>
            <option value="">Select a regime…</option>
            <option value="nondominium">Nondominium</option>
            <option value="commons">Commons</option>
            <option value="collective">Collective</option>
            <option value="pool">Pool</option>
            <option value="common-pool">CommonPool</option>
            <option value="private">Private</option>
          </select>
          {#if regime && REGIME_HINTS[regime]}
            <div class="field-hint blue">{REGIME_HINTS[regime]}</div>
          {/if}
          <div class="regime-chips">
            {#each REGIME_CHIPS as chip}
              <button
                class="regime-chip"
                style="border-color: {chip.color}; color: {chip.color};"
                title={REGIME_HINTS[chip.value]}
                onclick={() => selectRegime(chip.value)}
              >{chip.label}</button>
            {/each}
          </div>
        </fieldset>

        <!-- Resource nature -->
        <fieldset class="field-group">
          <label for="resource-nature">Resource Nature</label>
          <select id="resource-nature" bind:value={nature}>
            <option value="">Select a nature…</option>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
            <option value="service">Service</option>
            <option value="hybrid">Hybrid</option>
            <option value="information">Information</option>
          </select>
          {#if nature && NATURE_HINTS[nature]}
            <div class="field-hint">💡 {NATURE_HINTS[nature]}</div>
          {/if}
        </fieldset>

        <!-- Lifecycle stage -->
        <fieldset class="field-group">
          <label for="lifecycle-stage">Lifecycle Stage</label>
          <select id="lifecycle-stage" bind:value={lifecycle}>
            <option value="">Select a stage…</option>
            <option value="ideation">Ideation — concept declared, not yet specified</option>
            <option value="specification">Specification — form defined, not yet built</option>
            <option value="development">Development — being built or prototyped</option>
            <option value="stable">Stable — ready for distribution</option>
            <option value="hibernating">Hibernating — temporarily inactive</option>
          </select>
          <div class="field-hint">
            NDOs advance through: Ideation → Specification → Development → Prototype → Stable → Distributed → Active.
            <em>Deprecated</em> and <em>EndOfLife</em> are reached via lifecycle transitions after creation.
          </div>
        </fieldset>

        <hr class="form-divider" />

        <!-- Description -->
        <fieldset class="field-group">
          <label for="description">
            Description
            <span class="optional-mark">(optional)</span>
          </label>
          <textarea
            id="description"
            bind:value={description}
            placeholder="Describe this NDO's purpose, governance intent, or usage context…"
            maxlength="500"
            rows="4"
          ></textarea>
          <div class="char-counter">{description.length} / 500</div>
        </fieldset>
      </div>

      <div class="form-footer">
        <ndo-button variant="ghost" href="/ui-kit/group">Cancel</ndo-button>
        <ndo-button
          variant="primary"
          disabled={!canSubmit || undefined}
          onclick={submit}
        >Create NDO</ndo-button>
      </div>
    </div>

  {:else}
    <!-- Success state -->
    <div class="success-card">
      <div class="success-icon">✅</div>
      <h2 class="success-name">{name}</h2>
      <p class="success-subtitle">NDO created and anchored on the DHT. Its action hash is your stable identity anchor.</p>
      <div class="success-hash">
        <span>🔗</span>
        <span>uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJ…</span>
      </div>
      <div class="success-actions">
        <ndo-button variant="ghost" href="/ui-kit/group">← Back to Sensorica</ndo-button>
        <ndo-button variant="primary" href="/ui-kit/ndo-detail">View NDO →</ndo-button>
      </div>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 42rem;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    min-height: calc(100vh - 3.5rem);
    background: rgb(var(--ndo-gray-100));
  }

  /* Breadcrumb */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--ndo-text-sm);
    color: rgb(var(--ndo-gray-500));
    margin-bottom: 1.5rem;
  }
  .breadcrumb a { color: rgb(var(--ndo-gray-500)); text-decoration: none; }
  .breadcrumb a:hover { color: rgb(var(--ndo-gray-800)); }

  /* Form card */
  .form-card {
    background: #fff;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-xl);
    box-shadow: var(--ndo-shadow-sm);
    overflow: hidden;
  }
  .form-header {
    padding: 1.5rem 1.5rem 0;
    margin-bottom: 0;
  }
  .form-title {
    font-size: var(--ndo-text-xl);
    font-weight: var(--ndo-weight-bold);
    color: rgb(var(--ndo-gray-900));
    margin: 0 0 0.25rem;
  }
  .form-subtitle {
    font-size: var(--ndo-text-sm);
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 1.25rem;
  }
  .form-body { padding: 1.5rem; }
  .form-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgb(var(--ndo-gray-100));
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    align-items: center;
  }

  /* Fields */
  .field-group {
    margin-bottom: 1.25rem;
    border: none;
    padding: 0;
    min-width: 0;
  }
  label {
    display: block;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    color: rgb(var(--ndo-gray-700));
    margin-bottom: 0.375rem;
  }
  .required-mark { color: rgb(var(--ndo-red-700)); margin-left: 0.1rem; }
  .optional-mark { font-size: var(--ndo-text-xs); font-weight: 400; color: rgb(var(--ndo-gray-500)); margin-left: 0.25rem; }

  input[type='text'],
  select,
  textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgb(var(--ndo-gray-300));
    border-radius: var(--ndo-radius-md);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-sm);
    color: rgb(var(--ndo-gray-900));
    background: #fff;
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  input[type='text']:focus,
  select:focus,
  textarea:focus {
    border-color: rgb(var(--ndo-blue-600));
    box-shadow: 0 0 0 3px rgb(var(--ndo-blue-600) / 0.12);
  }
  textarea { resize: vertical; }

  .form-divider {
    border: none;
    border-top: 1px solid rgb(var(--ndo-gray-100));
    margin: 1.25rem 0;
  }

  /* Hints */
  .field-hint {
    margin-top: 0.375rem;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-500));
    line-height: 1.5;
  }
  .field-hint.blue {
    padding: 0.5rem 0.75rem;
    background: rgb(var(--ndo-blue-50));
    border-radius: var(--ndo-radius-sm);
    color: rgb(var(--ndo-blue-700));
  }

  /* Duplicate name warning */
  .name-warning {
    margin-top: 0.375rem;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-amber-700));
    background: rgb(var(--ndo-amber-50));
    border: 1px solid rgb(var(--ndo-amber-100));
    border-radius: var(--ndo-radius-sm);
    padding: 0.375rem 0.625rem;
  }

  /* Char counter */
  .char-counter {
    display: flex;
    justify-content: flex-end;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-400));
    margin-top: 0.25rem;
  }

  /* Regime chips */
  .regime-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-top: 0.5rem;
  }
  .regime-chip {
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.6875rem;
    font-weight: 500;
    border: 1px dashed;
    background: transparent;
    cursor: pointer;
    transition: opacity 150ms;
  }
  .regime-chip:hover { opacity: 0.7; }

  /* Success */
  .success-card {
    background: #fff;
    border: 1px solid rgb(var(--ndo-emerald-100));
    border-radius: var(--ndo-radius-xl);
    box-shadow: var(--ndo-shadow-md);
    padding: 2.5rem;
    text-align: center;
  }
  .success-icon { font-size: 3rem; margin-bottom: 1rem; }
  .success-name { font-size: var(--ndo-text-xl); font-weight: var(--ndo-weight-bold); color: rgb(var(--ndo-gray-900)); margin: 0 0 0.5rem; }
  .success-subtitle { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-600)); margin: 0 0 1.25rem; }
  .success-hash {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgb(var(--ndo-gray-50));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-md);
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-700));
    margin-bottom: 1.5rem;
  }
  .success-actions { display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
</style>
