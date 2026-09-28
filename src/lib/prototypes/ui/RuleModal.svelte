<script lang="ts">
  // Add a rule, or change one. zome_resource::create_governance_rule with typed
  // RuleData (AccessRequirement, UsageLimit, TransferCondition,
  // MaintenanceSchedule) always adds a new rule, whoever you are;
  // update_governance_rule changes an existing one and only its author may.
  // The original (ui.jsx RuleModal) only adds, and shows raw RuleData field
  // names and values; this port keeps that screen exactly, and offers "Save as"
  // only when the current agent authored one of the NDO's rules, so the
  // author-only change the zome allows stays reachable without altering the
  // original's default screen.
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import { proto } from '../store/store.svelte';
  import { ENUM, type Ndo, type RuleType } from '../store/logic';

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
  /** '' adds a new rule; otherwise the index of the rule to change. */
  let target = $state('');

  const existing = $derived(proto.s.rules[ndo.id] ?? []);
  const mine = $derived(existing.map((r, i) => [r, i] as const).filter(([r]) => r[2] === proto.me.id));

  /** Changing a rule starts from its type. */
  function pick(v: string) {
    target = v;
    error = null;
    if (v !== '' && existing[+v]) type = existing[+v][0];
  }

  const summary = $derived(
    {
      AccessRequirement: accessibility + (role ? ' · ' + role : ''),
      UsageLimit: hours + ' h / ' + days + ' d',
      TransferCondition: transfer + (validated === 'true' ? ' · validated' : ''),
      MaintenanceSchedule: interval + ' d' + (role ? ' · ' + role : '')
    }[type]
  );

  function submit() {
    if (type === 'MaintenanceSchedule' && !(+interval > 0)) {
      error = 'MaintenanceSchedule.interval_days must be > 0';
      return;
    }
    const r = target === '' ? proto.actions.addRule(ndo.id, type, summary) : proto.actions.updateRule(ndo.id, +target, type, summary);
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal title={target === '' ? 'Add a rule' : 'Change a rule'} sub={'Rules travel with ' + ndo.name + ' across groups.'} {onclose}>
  <Call c={target === '' ? 'zome_resource::create_governance_rule (RuleData)' : 'zome_resource::update_governance_rule (author only)'} />
  {#if mine.length}
    <Field label="Save as" hint="Anyone can add a rule. Only the person who added a rule can change it.">
      <select class="pu-select" value={target} onchange={(e) => pick(e.currentTarget.value)}>
        <option value="">A new rule</option>
        {#each mine as [[t, sum], i] (i)}
          <option value={String(i)}>Change: {t} · {sum}</option>
        {/each}
      </select>
    </Field>
  {/if}
  <Field label="RuleData">
    <Choice options={ENUM.rule} value={type} onchange={(v) => (type = v as RuleType)} />
  </Field>
  {#if type === 'AccessRequirement'}
    <Field label="accessibility">
      <select class="pu-select" bind:value={accessibility}>
        {#each ENUM.accessibility as o (o)}<option value={o}>{o}</option>{/each}
      </select>
    </Field>
    <Field label="required_role">
      <select class="pu-select" bind:value={role}>
        <option value="">— none</option>
        {#each ENUM.role as o (o)}<option value={o}>{o}</option>{/each}
      </select>
    </Field>
  {/if}
  {#if type === 'UsageLimit'}
    <div class="pu-grid pair">
      <Field label="max_duration_hours"><input class="pu-input" type="number" bind:value={hours} /></Field>
      <Field label="period_days"><input class="pu-input" type="number" bind:value={days} /></Field>
    </div>
  {/if}
  {#if type === 'TransferCondition'}
    <Field label="transfer_type">
      <select class="pu-select" bind:value={transfer}>
        {#each ENUM.transfer as o (o)}<option value={o}>{o}</option>{/each}
      </select>
    </Field>
    <Field label="requires_validation">
      <select class="pu-select" bind:value={validated}>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </Field>
  {/if}
  {#if type === 'MaintenanceSchedule'}
    <Field label="interval_days"><input class="pu-input" type="number" bind:value={interval} /></Field>
    <Field label="required_role">
      <select class="pu-select" bind:value={role}>
        <option value="">— none</option>
        {#each ENUM.role as o (o)}<option value={o}>{o}</option>{/each}
      </select>
    </Field>
  {/if}
  <p class="pu-muted pu-mono rule-summary">{type} · {summary}</p>
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label={target === '' ? 'Add rule' : 'Change rule'} />
</Modal>

<style>
  .pair {
    grid-template-columns: 1fr 1fr;
  }
  /* ui.jsx: fontSize 12 and no line-height, where .pu-muted is 13px at 1.5.
   * Named .rule-summary, not .summary: a class literally named .summary
   * collides with the native <summary> element and Svelte's compiler
   * silently drops the rule (verified via the compiled
   * ?svelte&type=style&lang.css output, which held everything except this
   * one rule) even though the paragraph carries the class correctly. */
  .rule-summary {
    font-size: 12px;
    line-height: normal;
  }
</style>
