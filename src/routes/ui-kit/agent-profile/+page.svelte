<svelte:head><title>Agent Profile — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';

  type Tab = 'reputation' | 'identity' | 'commitments' | 'affiliations';

  let activeTab = $state<Tab>('reputation');
  let showEmptyRep = $state(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'reputation',   label: 'Reputation' },
    { id: 'identity',     label: 'Identity' },
    { id: 'commitments',  label: 'Commitments' },
    { id: 'affiliations', label: 'Affiliations' }
  ];

  const metrics = [
    { label: 'Timeliness',    score: 0.82, color: 'rgb(var(--ndo-emerald-700))' },
    { label: 'Quality',       score: 0.85, color: 'rgb(var(--ndo-emerald-700))' },
    { label: 'Reliability',   score: 0.88, color: 'rgb(var(--ndo-emerald-700))' },
    { label: 'Communication', score: 0.76, color: 'rgb(var(--ndo-blue-600))' }
  ];

  const pprCounts = [
    { type: 'CustodyTransfer',        count: 12 },
    { type: 'ResourceCreation',       count: 8 },
    { type: 'ValidationActivity',     count: 7 },
    { type: 'TransportFulfillment',   count: 6 },
    { type: 'MaintenanceFulfillment', count: 6 },
    { type: 'GoodFaithTransfer',      count: 5 },
    { type: 'GovernanceCompliance',   count: 3 }
  ];

  const commitments = [
    { action: 'transport_custody', resource: 'Community Solar Array',    detail: 'Due: 2026-05-15 · You → Bob K.',         status: 'active' as const },
    { action: 'maintenance',       resource: 'Open Hardware CNC Bed',    detail: 'Due: 2026-05-20 · Accepted commitment',   status: 'pending' as const },
    { action: 'validation',        resource: 'Distributed Sensor Design', detail: 'Validator in 2-of-3 ResourceValidation', status: 'active' as const }
  ];
</script>

<!-- Profile header -->
<div class="profile-header">
  <nav class="breadcrumb">
    <a href="{base}/ui-kit/group">← Lobby</a>
    <span>/</span>
    <span>My Profile</span>
  </nav>

  <div class="identity-row">
    <div class="avatar">SA</div>
    <div class="identity-info">
      <h1 class="nickname">SoushAI</h1>
      <div class="agent-key">uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVaWx9…</div>
      <div class="role-badges">
        <ndo-badge variant="lifecycle-active"      label="Accountable Agent"></ndo-badge>
        <ndo-badge variant="nature-physical"       label="Transport"></ndo-badge>
        <ndo-badge variant="lifecycle-distributed" label="ActiveAffiliate"></ndo-badge>
      </div>
    </div>
    <ndo-button variant="ghost">Edit profile</ndo-button>
  </div>

  <!-- Tabs -->
  <nav class="tab-nav" aria-label="Profile sections">
    {#each tabs as t}
      <button
        class="tab-btn"
        class:is-active={activeTab === t.id}
        onclick={() => (activeTab = t.id)}
      >{t.label}</button>
    {/each}
  </nav>
</div>

<!-- Content area -->
<div class="profile-content">

  <!-- ── REPUTATION ── -->
  {#if activeTab === 'reputation'}
    <div class="two-col">
      <!-- Reputation summary -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Reputation Summary</span>
          <button class="text-btn" onclick={() => (showEmptyRep = !showEmptyRep)}>
            Toggle empty state
          </button>
        </div>

        {#if !showEmptyRep}
          <div class="rep-count-row">
            <span class="rep-count">47</span>
            <span class="rep-label">total interactions</span>
          </div>
          {#each metrics as m}
            <div class="metric-row">
              <span class="metric-name">{m.label}</span>
              <div class="metric-track">
                <div class="metric-fill" style="width:{m.score * 100}%; background:{m.color};"></div>
              </div>
              <span class="metric-score">{m.score.toFixed(2)}</span>
            </div>
          {/each}
          <p class="hint-text">PPRs are stored as private entries on your source chain. Only you can derive this summary.</p>
        {:else}
          <div class="empty-rep">
            <div class="empty-rep-icon">📋</div>
            <p>No interactions yet. Complete your first economic process to start building your reputation.</p>
          </div>
        {/if}
      </div>

      <!-- PPR distribution -->
      <div class="card">
        <div class="card-title" style="margin-bottom: 0.75rem;">PPR Distribution</div>
        {#each pprCounts as p}
          <div class="ppr-row">
            <span class="ppr-type">{p.type}</span>
            <span class="ppr-count">{p.count}</span>
          </div>
        {/each}
        <p class="hint-text" style="margin-top:0.75rem; padding-top:0.5rem; border-top: 1px solid rgb(var(--ndo-gray-100));">
          47 total · 14 claim categories available
        </p>
      </div>
    </div>

    <!-- Promotion block -->
    <div class="promo-block">
      <div>
        <div class="promo-title">🎖 Eligible for role promotion</div>
        <p class="promo-desc">
          You have 47 completed interactions and a governance_claims count of 10.
          You can request promotion to <strong>Primary Accountable Agent</strong>.
          An existing PrimaryAccountable must approve your request.
        </p>
      </div>
      <ndo-button variant="primary">Request Promotion →</ndo-button>
    </div>

  <!-- ── IDENTITY ── -->
  {:else if activeTab === 'identity'}
    <div class="two-col">
      <div class="card">
        <div class="card-title" style="margin-bottom: 0.75rem;">Three-Tier Identity Model</div>
        {#each [
          { level: 'L1', cls: 'l1', name: 'Lobby Profile', desc: 'Stored in localStorage. Never written to DHT. Nickname: SoushAI. Email: not shared. Permissionless — exists before any DHT action.' },
          { level: 'L2', cls: 'l2', name: 'Group Profile',  desc: 'Per-group disclosure preferences in localStorage. Sensorica: anonymous. OVN: nickname + bio. No DHT entry required for group membership.' },
          { level: 'L3', cls: 'l3', name: 'Agent (DHT)',    desc: 'Person entry on the DHT — created on first economic action. Public: name, avatar. Private: legal name, email (capability-gated, 30-day max). Permanent: cannot be deleted.' }
        ] as tier}
          <div class="tier-item">
            <div class="tier-level {tier.cls}">{tier.level}</div>
            <div>
              <div class="tier-name">{tier.name}</div>
              <div class="tier-desc">{tier.desc}</div>
            </div>
          </div>
        {/each}
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom: 0.75rem;">Devices &amp; Keys</div>
        <div class="device-card primary">
          <div class="device-header">
            <span>💻 Desktop (Primary)</span>
            <ndo-badge variant="lifecycle-active" label="active"></ndo-badge>
          </div>
          <div class="device-key">uhCAk2vMp8X3n…</div>
        </div>
        <div class="device-card" style="margin-top:0.5rem;">
          <div class="device-header">
            <span>📱 Mobile (Secondary)</span>
            <ndo-badge variant="lifecycle-hibernating" label="inactive"></ndo-badge>
          </div>
          <div class="device-key" style="color:rgb(var(--ndo-gray-500));">uhCAk9Rp7Yq2m…</div>
        </div>
        <div style="margin-top:0.75rem;">
          <ndo-status-dot status="coming-soon" label="Flowsta identity linking (post-MVP)"></ndo-status-dot>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1rem;">
      <div class="card-title" style="margin-bottom:0.75rem;">Private Data (capability-gated)</div>
      <div class="private-data-grid">
        {#each [
          { label: 'Legal name', value: '••••••••• (private)' },
          { label: 'Email',      value: '••••••••• (private)' },
          { label: 'Location',   value: 'Montréal, QC (granted)' }
        ] as f}
          <div class="private-field">
            <div class="private-label">{f.label}</div>
            <div class="private-value">{f.value}</div>
          </div>
        {/each}
      </div>
      <p class="hint-text" style="margin-top:0.75rem;">Private entries stored only on your source chain. Shared via capability grants with 30-day maximum expiry.</p>
    </div>

  <!-- ── COMMITMENTS ── -->
  {:else if activeTab === 'commitments'}
    <div class="card">
      <div class="card-title" style="margin-bottom:0.75rem;">Active Commitments (3)</div>
      {#each commitments as c}
        <div class="commitment-row">
          <ndo-badge variant="nature-physical" label={c.action}></ndo-badge>
          <div class="commitment-info">
            <div class="commitment-resource">{c.resource}</div>
            <div class="commitment-detail">{c.detail}</div>
          </div>
          <ndo-status-dot status={c.status} label={c.status === 'active' ? 'In progress' : 'Pending'}></ndo-status-dot>
        </div>
      {/each}
    </div>

  <!-- ── AFFILIATIONS ── -->
  {:else if activeTab === 'affiliations'}
    <div class="two-col">
      <div class="card">
        <div class="card-title" style="margin-bottom:0.75rem;">Network Affiliations</div>
        {#each [
          { network: 'Sensorica',          state: 'CoreAffiliate',   cls: 'core' },
          { network: 'Open Value Network', state: 'ActiveAffiliate', cls: 'active' },
          { network: 'Fablab Montréal',    state: 'CloseAffiliate',  cls: 'close' }
        ] as a}
          <div class="affiliation-row">
            <span class="affiliation-network">{a.network}</span>
            <span class="affiliation-state {a.cls}">{a.state}</span>
          </div>
        {/each}
        <p class="hint-text" style="margin-top:0.75rem;">
          AffiliationState is derived — not stored. Computed from PPR activity, recency, and contribution history.
        </p>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:0.75rem;">Affiliation Record</div>
        <div class="affiliation-signed">
          <div class="signed-title">✓ Sensorica — Terms signed</div>
          <div class="signed-docs">
            Nondominium &amp; Custodian agreement · Benefit Redistribution Algorithm · ToP v1.2
          </div>
          <div class="signed-date">Signed: 2025-11-14</div>
        </div>
        <div style="margin-top:0.75rem;">
          <ndo-status-dot status="coming-soon" label="AffiliationRecord entry (post-MVP)"></ndo-status-dot>
        </div>
      </div>
    </div>
  {/if}

</div>

<style>
  /* Profile header */
  .profile-header {
    background: #fff;
    border-bottom: 1px solid rgb(var(--ndo-gray-200));
    padding: 1.5rem 1.5rem 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--ndo-text-sm);
    color: rgb(var(--ndo-gray-500));
    margin-bottom: 1.25rem;
  }
  .breadcrumb a { color: rgb(var(--ndo-gray-500)); text-decoration: none; }
  .breadcrumb a:hover { color: rgb(var(--ndo-gray-800)); }

  .identity-row {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }
  .avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, rgb(var(--ndo-blue-600)), rgb(var(--ndo-indigo-700)));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .identity-info { flex: 1; min-width: 0; }
  .nickname {
    font-size: var(--ndo-text-xl);
    font-weight: var(--ndo-weight-bold);
    color: rgb(var(--ndo-gray-900));
    margin: 0 0 0.1rem;
  }
  .agent-key {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-500));
    margin-bottom: 0.5rem;
  }
  .role-badges { display: flex; flex-wrap: wrap; gap: 0.375rem; }

  /* Tab nav */
  .tab-nav { display: flex; gap: 0.25rem; }
  .tab-btn {
    padding: 0.375rem 0.75rem;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    border: 1px solid transparent;
    border-radius: var(--ndo-radius-sm) var(--ndo-radius-sm) 0 0;
    background: transparent;
    color: rgb(var(--ndo-gray-500));
    cursor: pointer;
    transition: color 150ms, background-color 150ms;
    border-bottom: none;
  }
  .tab-btn:hover { color: rgb(var(--ndo-gray-800)); }
  .tab-btn.is-active {
    border-color: rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-gray-100));
    color: rgb(var(--ndo-gray-900));
  }

  /* Content */
  .profile-content {
    padding: 1.5rem;
    background: rgb(var(--ndo-gray-100));
    min-height: calc(100vh - 13rem);
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }

  /* Card */
  .card {
    background: #fff;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    padding: 1rem;
    box-shadow: var(--ndo-shadow-sm);
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
  .card-title { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); color: rgb(var(--ndo-gray-800)); }
  .text-btn { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-blue-600)); background: none; border: none; cursor: pointer; padding: 0; }
  .text-btn:hover { text-decoration: underline; }

  /* Reputation */
  .rep-count-row { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.75rem; }
  .rep-count { font-size: var(--ndo-text-2xl); font-weight: var(--ndo-weight-bold); color: rgb(var(--ndo-gray-900)); }
  .rep-label { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-500)); }

  .metric-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
  .metric-name { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-600)); width: 5.5rem; flex-shrink: 0; }
  .metric-track { flex: 1; height: 0.4rem; background: rgb(var(--ndo-gray-200)); border-radius: 999px; overflow: hidden; }
  .metric-fill { height: 100%; border-radius: 999px; }
  .metric-score { font-size: var(--ndo-text-xs); font-family: var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); width: 2.5rem; text-align: right; flex-shrink: 0; }

  .empty-rep { text-align: center; padding: 1.5rem 1rem; border: 1px dashed rgb(var(--ndo-gray-300)); border-radius: var(--ndo-radius-md); }
  .empty-rep-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .empty-rep p { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-500)); margin: 0; }

  /* PPR */
  .ppr-row { display: flex; align-items: center; justify-content: space-between; padding: 0.375rem 0.5rem; border-radius: var(--ndo-radius-sm); background: rgb(var(--ndo-gray-50)); margin-bottom: 0.25rem; }
  .ppr-type { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-700)); }
  .ppr-count { font-size: var(--ndo-text-xs); font-weight: 600; color: rgb(var(--ndo-gray-600)); background: rgb(var(--ndo-gray-200)); padding: 0.1rem 0.4rem; border-radius: 999px; }

  /* Promotion */
  .promo-block {
    background: rgb(var(--ndo-blue-50));
    border: 1px solid rgb(var(--ndo-blue-100));
    border-radius: var(--ndo-radius-lg);
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .promo-title { font-size: var(--ndo-text-sm); font-weight: 600; color: rgb(var(--ndo-blue-800)); margin: 0 0 0.25rem; }
  .promo-desc { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-blue-700)); margin: 0; }

  /* Identity tiers */
  .tier-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.5rem; border-radius: var(--ndo-radius-sm); border: 1px solid rgb(var(--ndo-gray-100)); background: rgb(var(--ndo-gray-50)); margin-bottom: 0.5rem; }
  .tier-level { width: 1.375rem; height: 1.375rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 700; flex-shrink: 0; }
  .tier-level.l1 { background: rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); }
  .tier-level.l2 { background: rgb(var(--ndo-blue-100)); color: rgb(var(--ndo-blue-700)); }
  .tier-level.l3 { background: rgb(var(--ndo-emerald-100)); color: rgb(var(--ndo-emerald-700)); }
  .tier-name { font-size: var(--ndo-text-xs); font-weight: 600; color: rgb(var(--ndo-gray-700)); }
  .tier-desc { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-500)); margin-top: 0.1rem; line-height: 1.5; }

  /* Devices */
  .device-card { padding: 0.5rem; background: rgb(var(--ndo-gray-50)); border-radius: var(--ndo-radius-sm); border: 1px solid rgb(var(--ndo-gray-200)); }
  .device-card.primary { background: rgb(var(--ndo-blue-50)); border-color: rgb(var(--ndo-blue-100)); }
  .device-header { display: flex; align-items: center; justify-content: space-between; font-size: var(--ndo-text-xs); font-weight: 600; color: rgb(var(--ndo-gray-700)); }
  .device-card.primary .device-header { color: rgb(var(--ndo-blue-800)); }
  .device-key { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: rgb(var(--ndo-blue-700)); margin-top: 0.25rem; }

  /* Private data */
  .private-data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: 0.5rem; }
  .private-field { padding: 0.5rem; background: rgb(var(--ndo-gray-50)); border-radius: var(--ndo-radius-sm); border: 1px solid rgb(var(--ndo-gray-200)); }
  .private-label { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-500)); }
  .private-value { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-700)); }

  /* Commitments */
  .commitment-row { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; border: 1px solid rgb(var(--ndo-gray-200)); border-radius: var(--ndo-radius-md); margin-bottom: 0.5rem; }
  .commitment-info { flex: 1; min-width: 0; }
  .commitment-resource { font-size: var(--ndo-text-sm); font-weight: 600; color: rgb(var(--ndo-gray-900)); }
  .commitment-detail { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-500)); margin-top: 0.125rem; }

  /* Affiliations */
  .affiliation-row { display: flex; align-items: center; justify-content: space-between; padding: 0.375rem 0; border-bottom: 1px solid rgb(var(--ndo-gray-100)); }
  .affiliation-row:last-of-type { border-bottom: none; }
  .affiliation-network { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-800)); }
  .affiliation-state { padding: 0.1rem 0.4rem; border-radius: var(--ndo-radius-sm); font-size: var(--ndo-text-xs); font-weight: 600; }
  .affiliation-state.core   { background: rgb(var(--ndo-amber-100));   color: rgb(var(--ndo-amber-700)); }
  .affiliation-state.active { background: rgb(var(--ndo-emerald-100)); color: rgb(var(--ndo-emerald-700)); }
  .affiliation-state.close  { background: rgb(var(--ndo-blue-50));     color: rgb(var(--ndo-blue-600)); }
  .affiliation-signed { padding: 0.75rem; background: rgb(var(--ndo-emerald-100) / 0.4); border: 1px solid rgb(var(--ndo-emerald-100)); border-radius: var(--ndo-radius-md); }
  .signed-title { font-size: var(--ndo-text-xs); font-weight: 600; color: rgb(var(--ndo-emerald-700)); }
  .signed-docs  { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-600)); margin-top: 0.25rem; }
  .signed-date  { font-size: var(--ndo-text-xs); font-family: var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); margin-top: 0.25rem; }

  /* Shared */
  .hint-text { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-500)); margin: 0; line-height: 1.5; }
</style>
