<script lang="ts">
  // Economic resources under this NDO's specification: the concrete instances,
  // who holds each one, and what state it is in. Custody is a responsibility
  // here, not a title — the custodian column names who is answerable, not who
  // owns.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentLabel, resourcesFor } from '$lib/state.svelte';
  import { RESOURCE_STATE_STATUS } from '$lib/ndo-ui';
  import StatusDot from '$lib/components/shared/StatusDot.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const resources = $derived(resourcesFor(id));
</script>

{#if resources.length === 0}
  <EmptyState icon="📦" title="No resource instances" body="This NDO has no concrete instances under custody yet." />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">{resources.length} resources</h2></div>
    <div class="ndo-panel__body">
      <table class="table">
        <thead>
          <tr><th>Resource</th><th>Quantity</th><th>Custodian</th><th>Location</th><th>State</th></tr>
        </thead>
        <tbody>
          {#each resources as resource (resource.id)}
            <tr>
              <td><strong>{resource.label}</strong></td>
              <td>{resource.quantity} {resource.unit}</td>
              <td><a href={paths.agentProfile(resource.custodian)}>{agentLabel(resource.custodian)}</a></td>
              <td>{resource.location ?? '—'}</td>
              <td><StatusDot status={RESOURCE_STATE_STATUS[resource.state] ?? 'pending'} label={resource.state} /></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
{/if}

<style>
  .table { width: 100%; border-collapse: collapse; font-size: var(--ndo-text-sm); }
  th {
    text-align: left;
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ndo-color-text-muted);
    padding: 0 var(--ndo-spacing-3) var(--ndo-spacing-2) 0;
    border-bottom: 1px solid var(--ndo-color-border);
  }
  td { padding: var(--ndo-spacing-3) var(--ndo-spacing-3) var(--ndo-spacing-3) 0; border-bottom: 1px solid var(--ndo-color-border-subtle); }
  tbody tr:last-child td { border-bottom: none; }
  a { color: var(--ndo-color-link); }
</style>
