<!-- Replica of docs/prototypes/original/ds/guidelines/type-labels.html -->
<script lang="ts"></script>

<div class="cols">
  <div>
    <p class="label">Property regime</p>
    <p class="value">Nondominium</p>
    <p class="m">12px 600 caps · gray-400</p>
  </div>
  <div>
    <p class="label">Groups</p>
    <p class="m">sidebar heading</p>
  </div>
  <div>
    <p class="label2">Stage:</p>
    <p class="m">filter row label · gray-500</p>
  </div>
</div>

<style>
  .cols { display: flex; gap: 40px; }
  p { margin: 0; }
  .label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    color: rgb(var(--ndo-gray-400));
  }
  .value {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    color: rgb(var(--ndo-gray-800));
  }
  .label2 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-500));
  }
  .m { margin-top: 8px; font-family: var(--ndo-font-mono); font-size: 11px; color: rgb(var(--ndo-gray-500)); }
</style>
