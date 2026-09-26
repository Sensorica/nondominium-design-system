#!/usr/bin/env bun
/**
 * Prototype rules check: the shared A to E store must enforce what the hApp
 * enforces, or a reviewer can approve a flow that cannot ship.
 *
 *   bun run check:prototypes
 *
 * It runs the store's pure logic (src/lib/prototypes/store/logic.ts) and F's
 * mock backend (directions/flow-graph/backend.ts), and fails unless:
 *   1. every (from, to) lifecycle pair, for every hibernation origin, is
 *      accepted exactly when the integrity zome accepts it, both in
 *      allowedStages() and through the advance() action;
 *   2. the hApp's rules hold: initiator-only lifecycle, custodian-only custody
 *      transfer and operational state, a successor for Deprecated, rules that
 *      only their author may change, and the Hard constraints of
 *      crates/shared/src/constraints.rs (no ownership-transfer rule on a
 *      Nondominium NDO; in F, no Layer 1 before the NDO leaves Ideation and no
 *      Transfer, Consume or Lower on a Nondominium NDO);
 *   3. two rules the handoff adds, which the hApp does NOT enforce yet at
 *      3cbebf0, still hold as prototype rules: no self-validation
 *      (create_validation_receipt has no validator check) and one claim per
 *      commitment (claim_commitment leaves it as a Phase 2 TODO);
 *   4. saved state heals: links stay unique on (from, to, kind), so A's keyed
 *      field cannot crash, older saves are repaired on load, and F's activity
 *      ids stay unique across page loads;
 *   5. every error the checks expect has a friendly wording in plain.ts.
 *
 * The expected lifecycle table below is written from the zome, not from the
 * store: validate_update_nondominium_identity in
 * dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs at
 * Sensorica/nondominium@3cbebf0. If the zome changes, change it here first.
 */

import * as L from '../src/lib/prototypes/store/logic';
import { friendly } from '../src/lib/prototypes/plain';
import type * as FB from '../src/lib/prototypes/directions/flow-graph/backend';

/** F's backend as a fresh module, the way each page load evaluates it anew:
 *  module-level counters restart, only localStorage carries over. */
let loads = 0;
const loadF = (): Promise<typeof FB> => import(`../src/lib/prototypes/directions/flow-graph/backend.ts?load=${++loads}`);

type Stage = L.LifecycleStage;

const STAGES: Stage[] = ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'];
const NEXT: Partial<Record<Stage, Stage>> = {
  Ideation: 'Specification',
  Specification: 'Development',
  Development: 'Prototype',
  Prototype: 'Stable',
  Stable: 'Distributed',
  Distributed: 'Active'
};

/** The zome's decision for one update, with the fields the coordinator sets
 *  correctly (origin recorded on suspend, successor on Deprecated). */
function zomeAccepts(from: Stage, to: Stage, origin: Stage | null): boolean {
  if (from === 'EndOfLife') return false; // terminal
  if (from === 'Deprecated') return to === 'EndOfLife'; // only exit
  if (to === 'Deprecated' || to === 'EndOfLife') return true; // any non-terminal source
  if (to === 'Hibernating') return from !== 'Hibernating'; // suspend
  if (from === 'Hibernating') return origin !== null && to === origin; // resume to origin only
  return NEXT[from] === to; // forward chain, no skipping
}

const failures: string[] = [];
const check = (ok: boolean, what: string) => {
  if (!ok) failures.push(what);
};

let n = 0;
const ctxAs = (me: string): L.Ctx => ({ me, id: (p) => p + 'x' + n++, hash: () => 'uhC0test' + n++ });
const TIB = L.ME_ID;

// ── 1. Lifecycle table ────────────────────────────────────────────────────
const ORIGINS: (Stage | null)[] = [...(Object.keys(NEXT) as Stage[]), 'Active', null];
let pairs = 0;
for (const from of STAGES) {
  const origins = from === 'Hibernating' ? ORIGINS : [null];
  for (const origin of origins) {
    for (const to of STAGES) {
      pairs++;
      const want = zomeAccepts(from, to, origin);
      const label = `${from}${from === 'Hibernating' ? `(origin ${origin ?? 'missing'})` : ''} → ${to}`;
      const offered = L.allowedStages({ stage: from, hibernation_origin: origin }).includes(to);
      check(offered === want, `allowedStages: ${label} is ${offered ? 'offered' : 'not offered'}, zome ${want ? 'accepts' : 'rejects'} it`);

      const s = L.exampleState();
      s.ndos = [...s.ndos, { id: 'probe', name: 'Probe', group: 'sen', stage: from, regime: 'Pool', nature: 'Physical', rivalry: 'Rivalrous', initiator: TIB, desc: '', hash: 'uhC0probe', hibernation_origin: origin }];
      const r = L.advance(s, ctxAs(TIB), 'probe', to, to === 'Deprecated' ? 'sol' : undefined);
      check(r.ok === want, `advance: ${label} ${r.ok ? 'succeeded' : 'failed (' + (r as L.Fail).error + ')'}, zome ${want ? 'accepts' : 'rejects'} it`);
      if (r.ok && to === 'Hibernating') {
        const after = r.state.ndos.find((x) => x.id === 'probe')!;
        check(after.hibernation_origin === from, `advance: ${label} must record hibernation_origin ${from}, got ${after.hibernation_origin}`);
      }
    }
  }
}

// ── 2 and 3. Who may do what ──────────────────────────────────────────────
/** A store Outcome or an F CallResult: both fail as { ok: false, error }. */
type Tried = { ok: true } | { ok: false; error: string };

function expectError(what: string, r: Tried, error: string) {
  if (r.ok) failures.push(`${what}: accepted, expected "${error}"`);
  else check(r.error === error, `${what}: error "${r.error}", expected "${error}"`);
  if (friendly(error) === error) failures.push(`${what}: "${error}" has no friendly wording in plain.ts`);
}
function expectOk(what: string, r: Tried) {
  if (!r.ok) failures.push(`${what}: rejected with "${r.error}", expected success`);
}

const S = L.exampleState();

// Initiator-only lifecycle. 'sns' was started by Tiberius, 'sol' by Sarah.
expectError('lifecycle by a non-initiator', L.advance(S, ctxAs('mar'), 'sns', 'Active'), 'NotAuthor: only the initiator (Tiberius) may change the lifecycle stage.');
expectError('lifecycle on someone else\'s NDO', L.advance(S, ctxAs(TIB), 'sol', 'Hibernating'), 'NotAuthor: only the initiator (Sarah) may change the lifecycle stage.');
expectOk('lifecycle by the initiator', L.advance(S, ctxAs(TIB), 'sns', 'Active'));

// Deprecated needs a successor.
expectError('Deprecated without a successor', L.advance(S, ctxAs(TIB), 'sns', 'Deprecated'), 'Transitioning to Deprecated requires successor_ndo_hash (REQ-NDO-LC-06).');
expectOk('Deprecated with a successor', L.advance(S, ctxAs(TIB), 'sns', 'Deprecated', 'las'));

// Custodian-only custody transfer. Sarah holds 'sol' item 0.
expectError('custody transfer by a non-custodian', L.transferCustody(S, ctxAs(TIB), 'sol', 0, 'mar'), 'NotCustodian: only the current custodian (Sarah) can transfer custody.');
expectOk('custody transfer by the custodian', L.transferCustody(S, ctxAs('sar'), 'sol', 0, 'mar'));

// Custodian-only operational state.
expectError('operational state by a non-custodian', L.setOpState(S, ctxAs(TIB), 'sol', 0, 'Available'), 'NotCustodian: only the current custodian (Sarah) can update operational state.');
expectOk('operational state by the custodian', L.setOpState(S, ctxAs('sar'), 'sol', 0, 'Available'));

// ── Prototype rules the hApp does not enforce yet (3cbebf0) ──────────────
// Kept because the handoff specifies them; the zome has no such check today.

// No self-validation. Maya holds the pending 'cnc' item 0.
expectError('self-validation', L.validate(S, ctxAs('may'), 'cnc:0', 'cnc'), 'An agent cannot validate their own resource.');
expectOk('validation by someone else', L.validate(S, ctxAs(TIB), 'cnc:0', 'cnc'));

// Single claim per commitment. c4: Tiberius hands the sensor batch he holds to Dr. Mitchell.
const first = L.fulfil(S, ctxAs(TIB), 'c4');
expectOk('first claim of a commitment', first);
if (first.ok) expectError('second claim of the same commitment', L.fulfil(first.state, ctxAs(TIB), 'c4'), 'Commitment already claimed.');
expectError('claim by someone outside the commitment', L.fulfil(S, ctxAs('dk'), 'c1'), 'You are neither provider nor receiver of this commitment.');

// Items cannot be added at Ideation (the zome refuses Layer 1 there).
{
  const s = L.exampleState();
  s.ndos = [...s.ndos, { id: 'idea', name: 'Idea', group: 'sen', stage: 'Ideation', regime: 'Pool', nature: 'Physical', rivalry: 'Rivalrous', initiator: TIB, desc: '', hash: 'uhC0idea' }];
  expectError('item at Ideation', L.addInstance(s, ctxAs(TIB), 'idea', 'Probe'), 'Instances cannot be added at stage Ideation.');
}

// ── Rules: create adds, only the author changes ──────────────────────────
// create_governance_rule adds a rule whoever calls it; update_governance_rule
// is author-only (zome_resource governance_rule.rs, ResourceError::NotAuthor).
{
  const before = S.rules.sol.length;
  const added = L.addRule(S, ctxAs(TIB), 'sol', 'UsageLimit', '10 h / 7 d');
  expectOk('a non-author adds a rule of an existing type', added);
  if (added.ok) {
    const list = added.state.rules.sol;
    check(list.length === before + 1, `addRule must add, not replace: ${before} rules became ${list.length}`);
    check(list.some((r) => r[0] === 'UsageLimit' && r[1] === '336 h / 30 d' && r[2] === 'sar'), "addRule by Tiberius removed Sarah's UsageLimit rule");
    check(list[list.length - 1][2] === TIB, `a new rule's author must be the caller, got ${list[list.length - 1][2]}`);
  }
  const sarahsLimit = S.rules.sol.findIndex((r) => r[0] === 'UsageLimit');
  expectError("changing someone else's rule", L.updateRule(S, ctxAs(TIB), 'sol', sarahsLimit, 'UsageLimit', '1 h / 1 d'), "NotAuthor: only the rule's author (Sarah) can change this rule.");
  const changed = L.updateRule(S, ctxAs('sar'), 'sol', sarahsLimit, 'UsageLimit', '200 h / 30 d');
  expectOk("changing one's own rule", changed);
  if (changed.ok) check(changed.state.rules.sol[sarahsLimit][1] === '200 h / 30 d' && changed.state.rules.sol.length === before, 'updateRule must replace the rule in place');
}

// ── Hard constraints (crates/shared/src/constraints.rs) ──────────────────
// check_rule_data_permitted: an ownership-transfer rule is Hard on Nondominium
// only; Soft (accepted) on the other regimes that do not permit it.
const OWNERSHIP_HARD = '[ownership_transfer_not_permitted_by_regime] Nondominium does not permit ownership-transfer rules.';
{
  const s = L.exampleState();
  s.ndos = [
    ...s.ndos,
    { id: 'nd', name: 'Uncapturable', group: 'sen', stage: 'Active', regime: 'Nondominium', nature: 'Physical', rivalry: 'Rivalrous', initiator: TIB, desc: '', hash: 'uhC0nd' },
    { id: 'cm', name: 'Commons', group: 'sen', stage: 'Active', regime: 'Commons', nature: 'Digital', rivalry: 'NonRivalrous', initiator: TIB, desc: '', hash: 'uhC0cm' }
  ];
  s.rules = { ...s.rules, nd: [['TransferCondition', 'Custody · validated', TIB]] };
  expectError('ownership-transfer rule on Nondominium', L.addRule(s, ctxAs(TIB), 'nd', 'TransferCondition', 'Ownership · validated'), OWNERSHIP_HARD);
  expectError('ownership-transfer rule on Nondominium, by update', L.updateRule(s, ctxAs(TIB), 'nd', 0, 'TransferCondition', 'Ownership'), OWNERSHIP_HARD);
  expectOk('custody-transfer rule on Nondominium', L.addRule(s, ctxAs(TIB), 'nd', 'TransferCondition', 'Custody · validated'));
  expectOk('ownership-transfer rule on Commons (Soft, accepted)', L.addRule(s, ctxAs(TIB), 'cm', 'TransferCondition', 'Ownership'));
}

// ── Links stay unique, and saved state heals ─────────────────────────────
// The field (A) keys each trail on (from, to, kind). The seed already has a
// 'hard' fw → sol link; a second hard link type between the same NDOs used to
// append another one, and Svelte threw each_key_duplicate.
const dupKeys = (links: L.Link[]) => {
  const keys = links.map(L.linkKey);
  return keys.filter((k, i) => keys.indexOf(k) !== i);
};
{
  const linked = L.hardLink(S, ctxAs(TIB), 'fw', 'sol', 'DerivedFrom');
  expectOk('a second hard link type between two NDOs', linked);
  if (linked.ok) {
    const d = dupKeys(linked.state.links);
    check(d.length === 0, `hardLink left repeated links: ${d.join(', ')}`);
    check(linked.state.hardLinks.filter((h) => h.from === 'fw' && h.to === 'sol').length === 2, 'hardLink must still record both hard-link types');
  }
  // A state saved by the old build, with the repeat already in it.
  const saved = L.exampleState();
  saved.links = [...saved.links, ['fw', 'sol', 'hard']];
  saved.rules = { ...saved.rules, sol: saved.rules.sol.map((r) => [r[0], r[1]] as unknown as L.Rule) };
  saved.invites['ndo-invite:food-7k2p'].links = [['seed', 'sol', 'use'], ['seed', 'sol', 'use']];
  const healed = L.normalizeLoaded(JSON.parse(JSON.stringify(saved)), (p) => p + 'h' + n++);
  check(!!healed, 'normalizeLoaded rejected a saved state with a repeated link');
  if (healed) {
    const d = dupKeys(healed.links);
    check(d.length === 0, `normalizeLoaded kept repeated links: ${d.join(', ')}`);
    check(dupKeys(healed.invites['ndo-invite:food-7k2p'].links).length === 0, 'normalizeLoaded kept repeated links in an invite');
    check(healed.rules.sol.every((r) => r[2] === 'sar'), 'normalizeLoaded must give an authorless rule its NDO initiator as author');
  }
}

// ── F: its own mock backend ───────────────────────────────────────────────
// A minimal localStorage, so each simulated page load sees what the last one
// saved.
{
  const F = await loadF();
  const store = new Map<string, string>();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k)
  };
  const B1 = F.createBackend({ gossipMs: 0 });
  B1.reset('blank');
  const c1 = (fn: string, zome: string, input: FB.Data, as: FB.AgentKey = 'a') => B1.call<string>(zome, fn, input, as);
  c1('create_person', 'zome_person', { name: 'A' });
  const g = c1('create_group', 'zome_group', { name: 'G' });
  const nd = c1('create_ndo', 'zome_resource', { name: 'N', property_regime: 'Nondominium', resource_nature: 'Physical', lifecycle_stage: 'Ideation' });
  check(g.ok && nd.ok, 'F blank scenario: could not create a person, a group and an NDO');
  if (nd.ok) {
    const n0 = nd.value;
    const spec = c1('create_resource_specification', 'zome_resource', { name: 'Kind', description: 'd', ndo_identity_hash: n0 });
    expectError('F: kind of item at Ideation', spec, 'Cannot activate Layer 1 while the NDO is Ideation.');
    expectOk('F: move past Ideation', c1('update_lifecycle_stage', 'zome_resource', { original_action_hash: n0, new_stage: 'Specification' }));
    const spec2 = c1('create_resource_specification', 'zome_resource', { name: 'Kind', description: 'd', ndo_identity_hash: n0 });
    expectOk('F: kind of item once past Ideation', spec2);
    expectError('F: ownership-transfer rule on Nondominium', c1('create_governance_rule', 'zome_resource', { ndo_identity_hash: n0, rule_data: { type: 'TransferCondition', transfer_type: 'Ownership', requires_validation: false, validator_role: null } }), OWNERSHIP_HARD);
    expectOk('F: custody-transfer rule on Nondominium', c1('create_governance_rule', 'zome_resource', { ndo_identity_hash: n0, rule_data: { type: 'TransferCondition', transfer_type: 'Custody', requires_validation: true, validator_role: null } }));
    if (spec2.ok) {
      const r = c1('create_economic_resource', 'zome_resource', { spec_hash: spec2.value, label: 'I', quantity: 1, unit: 'u' });
      if (r.ok) {
        expectError('F: Transfer event on Nondominium', c1('log_economic_event', 'zome_gouvernance', { action: 'Transfer', provider: 'a', receiver: 'a', resource_inventoried_as: r.value }), '[nondominium_no_unilateral_capture] Transfer is not permitted on a Nondominium resource (REQ-RES-03).');
        expectOk('F: Use event on Nondominium', c1('log_economic_event', 'zome_gouvernance', { action: 'Use', provider: 'a', receiver: 'a', resource_inventoried_as: r.value }));
      } else failures.push('F: could not create an item: ' + r.error);
    }
  }
  const ids1 = B1.state.log.map((r) => r.id);
  B1.dispose();
  // Two more page loads that each restore the saved DHT (no seeding, so the
  // counters are where a fresh module leaves them) and make the same calls.
  // The reviewer's crash: the second load's ids repeated the first's.
  // Read the log inside the session, as the Activity dock does, not after a
  // reload (which heals it).
  const repeated = new Set<string>();
  for (let load = 0; load < 2; load++) {
    const Bn = (await loadF()).createBackend({ gossipMs: 0 });
    Bn.call('zome_group', 'create_group', { name: 'H' + load }, 'a');
    Bn.call('zome_group', 'create_group', { name: 'I' + load }, 'a');
    const ids = Bn.state.log.map((r) => r.id);
    ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => repeated.add(id));
    Bn.dispose();
  }
  check(ids1.length > 0 && repeated.size === 0, `F: activity ids repeat across page loads: ${[...repeated].join(', ')}`);
  const B2 = (await loadF()).createBackend({ gossipMs: 0 });
  // And a log saved by an older build, ids restarting at c0, heals on load.
  const raw = JSON.parse(store.get(F.KEY)!);
  raw.log = [{ ...raw.log[0], id: 'c0' }, { ...raw.log[1], id: 'c0' }, ...raw.log.slice(2)];
  store.set(F.KEY, JSON.stringify(raw));
  const B3 = (await loadF()).createBackend({ gossipMs: 0 });
  const ids3 = B3.state.log.map((r) => r.id);
  check(new Set(ids3).size === ids3.length, 'F: a saved log with repeated ids is not healed on load');
  B2.dispose();
  B3.dispose();
}

// ── Report ────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`check:prototypes FAILED, ${failures.length} problem${failures.length > 1 ? 's' : ''}:`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(
  `check:prototypes passed: ${pairs} lifecycle pairs match the integrity zome at 3cbebf0; the hApp's authorization, successor, rule-author and Hard constraint rules hold, in the shared store and in F; ` +
    'saved state heals (unique links, rule authors, F activity ids). ' +
    'Also holding: two prototype rules the hApp does not enforce yet at 3cbebf0 (no self-validation, one claim per commitment).'
);
