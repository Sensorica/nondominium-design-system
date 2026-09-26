<script lang="ts">
  // Add a rule. zome_resource::create_governance_rule with typed RuleData
  // (AccessRequirement, UsageLimit, TransferCondition, MaintenanceSchedule).
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { proto } from '../store/store.svelte';
  import { ENUM, type Ndo, type RuleType } from '../store/logic';
  import { FIELD_WORD, plain, developer } from '../plain';

  let { ndo, onclose }: { ndo: Ndo; onclose: () => void } = $props();

  let type = $state<RuleType>('AccessRequirement');
  let accessibility = $state('Credentialed');
  let role = $state('AccountableAgent');
  let hours = $state('40');
  let days = $state('7');
  let transfer = $state('Custody');
  let validated = $state('true');
  let interval = $state('90');
  let error = $state<string | null>(null);

  const summary = $derived(
    {
      AccessRequirement: accessibility + (role ? ' · ' + role : ''),
      UsageLimit: hours + ' h / ' + days + ' d',
      TransferCondition: transfer + (validated === 'true' ? ' · validated' : ''),
      MaintenanceSchedule: interval + ' d' + (role ? ' · ' + role : '')
    }[type]
  );

  const label = (field: string) => ($developer ? field : (FIELD_WORD[field] ?? field));

  function submit() {
    if (type === 'MaintenanceSchedule' && !(+interval > 0)) {
      error = 'MaintenanceSchedule.interval_days must be > 0';
      return;
    }
    const r = proto.actions.addRule(ndo.id, type, summary);
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal title="Add a rule" sub={'Rules travel with ' + ndo.name + ' across groups.'} {onclose}>
  <Call c="zome_resource::create_governance_rule (RuleData)" />
  <Field label={label('RuleData')}>
    <Choice options={ENUM.rule} value={type} onchange={(v) => (type = v as RuleType)} />
  </Field>
  {#if type === 'AccessRequirement'}
    <Field label={label('accessibility')}>
      <select class="pu-select" bind:value={accessibility}>
        {#each ENUM.accessibility as o (o)}<option value={o}>{plain(o)}</option>{/each}
      </select>
    </Field>
  {/if}
  {#if type === 'AccessRequirement' || type === 'MaintenanceSchedule'}
    <Field label={label('required_role')}>
      <select class="pu-select" bind:value={role}>
        <option value="">None</option>
        {#each ENUM.role as o (o)}<option value={o}>{plain(o)}</option>{/each}
      </select>
    </Field>
  {/if}
  {#if type === 'UsageLimit'}
    <div class="pu-grid pair">
      <Field label={label('max_duration_hours')}><input class="pu-input" type="number" bind:value={hours} /></Field>
      <Field label={label('period_days')}><input class="pu-input" type="number" bind:value={days} /></Field>
    </div>
  {/if}
  {#if type === 'TransferCondition'}
    <Field label={label('transfer_type')}>
      <select class="pu-select" bind:value={transfer}>
        {#each ENUM.transfer as o (o)}<option value={o}>{plain(o)}</option>{/each}
      </select>
    </Field>
    <Field label={label('requires_validation')}>
      <select class="pu-select" bind:value={validated}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </Field>
  {/if}
  {#if type === 'MaintenanceSchedule'}
    <Field label={label('interval_days')}><input class="pu-input" type="number" bind:value={interval} /></Field>
  {/if}
  <p class="pu-muted pu-mono">{$developer ? type + ' · ' + summary : plain(type) + ' · ' + plain(summary)}</p>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Add rule" />
</Modal>

<style>
  .pair {
    grid-template-columns: 1fr 1fr;
  }
</style>
