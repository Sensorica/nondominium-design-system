<!-- Replica of docs/prototypes/original/ds/guidelines/brand-layers.html -->
<script lang="ts"></script>

<div class="k-grid">
  <div>
    <p class="l">Layer 0 · identity</p>
    <span class="pill">Active</span> <span class="k-outline">Nondominium</span>
    <p>Filled tint = lifecycle & nature. Dashed outline = regime. Never change after creation.</p>
  </div>
  <div>
    <p class="l">Layer 1 · governance</p>
    <span class="rule">UsageLimit</span>
    <p>Solid left rule + mono face = a typed rule. Reads as code, not classification.</p>
  </div>
  <div>
    <p class="l">Layer 2 · operation</p>
    <span class="op"><span class="dot"></span>Available</span>
    <p>Pill + leading dot = transient state of one EconomicResource instance.</p>
  </div>
</div>

<style>
  .k-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-600));
  }
  .l {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 6px;
  }
  .pill {
    background: rgb(var(--ndo-emerald-100));
    color: rgb(var(--ndo-emerald-700));
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
  }
  .k-outline {
    border: 1px dashed rgb(var(--ndo-blue-700));
    color: rgb(var(--ndo-blue-700));
    padding: 1px 8px;
    border-radius: 4px;
    font-weight: 500;
  }
  .rule {
    background: rgb(var(--ndo-amber-50));
    color: rgb(var(--ndo-amber-800));
    border-left: 3px solid rgb(var(--ndo-amber-700));
    padding: 2px 8px;
    border-radius: 0 4px 4px 0;
    font: 500 12px var(--ndo-font-mono);
  }
  .op {
    background: rgb(var(--ndo-green-50));
    color: rgb(var(--ndo-green-700));
    padding: 2px 8px 2px 6px;
    border-radius: 12px;
    font-weight: 500;
    display: inline-block;
  }
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    margin-right: 6px;
  }
</style>
