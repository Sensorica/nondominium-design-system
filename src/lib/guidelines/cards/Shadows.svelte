<!-- Replica of docs/prototypes/original/ds/guidelines/shadows.html -->
<script lang="ts"></script>

<div class="row">
  <div>
    <div class="box" style="box-shadow:var(--ndo-shadow-sm)"></div>
    <div class="n">shadow-sm</div>
  </div>
  <div>
    <div class="box" style="box-shadow:var(--ndo-shadow-md)"></div>
    <div class="n">shadow-md</div>
  </div>
  <div>
    <div class="box" style="box-shadow:var(--ndo-shadow-lg)"></div>
    <div class="n">shadow-lg</div>
  </div>
  <div>
    <div class="ring" style="box-shadow:var(--ndo-focus-ring)"></div>
    <div class="n ring-n">focus ring</div>
  </div>
</div>

<style>
  .row {
    display: flex;
    gap: 28px;
    padding: 10px;
    background: rgb(var(--ndo-gray-100));
    border-radius: 8px;
  }
  .box {
    width: 150px;
    height: 72px;
    background: #fff;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: 8px;
  }
  .ring {
    width: 150px;
    height: 34px;
    margin-top: 19px;
    background: #fff;
    border: 1px solid rgb(var(--ndo-blue-600));
    border-radius: 6px;
  }
  .n { font-size: 11px; font-weight: 600; margin-top: 4px; color: rgb(var(--ndo-gray-800)); }
  .ring-n { margin-top: 23px; }
</style>
