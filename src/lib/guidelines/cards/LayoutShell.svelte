<!-- Replica of docs/prototypes/original/ds/guidelines/layout-shell.html -->
<script lang="ts"></script>

<div class="shell">
  <div class="sidebar">
    <div class="active-item">Browse NDOs</div>
    <div class="section-label">Groups</div>
    <div class="group-item">Sensorica</div>
    <div class="new-group"><b>+</b> New Group</div>
  </div>
  <div class="main">
    <div class="m">main · p-6 (24px) · min-w-0 · overflow auto</div>
    <div class="card"></div>
  </div>
</div>

<style>
  .shell {
    display: flex;
    height: 180px;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: 8px;
    overflow: hidden;
    background: rgb(var(--ndo-gray-100));
  }
  .sidebar {
    width: 13rem;
    background: rgb(var(--ndo-gray-50));
    border-right: 1px solid rgb(var(--ndo-gray-200));
    padding: 12px;
    font-size: 14px;
  }
  .active-item {
    background: #fff;
    box-shadow: var(--ndo-shadow-sm);
    border-radius: 4px;
    padding: 6px 8px;
    font-weight: 500;
  }
  .section-label {
    margin: 12px 0 4px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-400));
  }
  .group-item { padding: 4px 8px; color: rgb(var(--ndo-gray-700)); }
  .new-group { padding: 6px 8px; font-size: 12px; color: rgb(var(--ndo-blue-600)); }
  .main { flex: 1; padding: 24px; }
  .m { font-family: var(--ndo-font-mono); font-size: 11px; color: rgb(var(--ndo-gray-500)); }
  .card {
    margin-top: 12px;
    height: 90px;
    background: #fff;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: 8px;
    box-shadow: var(--ndo-shadow-sm);
  }
</style>
