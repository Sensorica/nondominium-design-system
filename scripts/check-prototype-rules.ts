#!/usr/bin/env bun
/**
 * Prototype rules check: the shared A to E store must enforce what the hApp
 * enforces, or a reviewer can approve a flow that cannot ship.
 *
 *   bun run check:prototypes
 *
 * It runs the store's pure logic (src/lib/prototypes/store/logic.ts) and fails
 * unless:
 *   1. every (from, to) lifecycle pair, for every hibernation origin, is
 *      accepted exactly when the integrity zome accepts it, both in
 *      allowedStages() and through the advance() action;
 *   2. the initiator-only lifecycle, custodian-only custody transfer and
 *      operational-state change, no self-validation, and single claim per
 *      commitment each reject the wrong agent with the expected error, and
 *      accept the right one;
 *   3. Deprecated without a successor is rejected;
 *   4. every one of those errors has a friendly wording in plain.ts.
 *
 * The expected lifecycle table below is written from the zome, not from the
 * store: validate_update_nondominium_identity in
 * dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs at
 * Sensorica/nondominium@3cbebf0. If the zome changes, change it here first.
 */

import * as L from '../src/lib/prototypes/store/logic';
import { friendly } from '../src/lib/prototypes/plain';

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
function expectError(what: string, r: L.Outcome<unknown>, error: string) {
  if (r.ok) failures.push(`${what}: accepted, expected "${error}"`);
  else check(r.error === error, `${what}: error "${r.error}", expected "${error}"`);
  if (friendly(error) === error) failures.push(`${what}: "${error}" has no friendly wording in plain.ts`);
}
function expectOk(what: string, r: L.Outcome<unknown>) {
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

// No self-validation. Maya holds the pending 'cnc' item 0.
expectError('self-validation', L.validate(S, ctxAs('may'), 'cnc:0', 'cnc'), 'An agent cannot validate their own resource.');
expectOk('validation by someone else', L.validate(S, ctxAs(TIB), 'cnc:0', 'cnc'));

// Single claim per commitment. c4: Tiberius hands the sensor batch he holds to Dr. Mitchell.
const first = L.fulfil(S, ctxAs(TIB), 'c4');
expectOk('first claim of a commitment', first);
if (first.ok) expectError('second claim of the same commitment', L.fulfil(first.state, ctxAs(TIB), 'c4'), 'Commitment already claimed.');
expectError('claim by someone outside the commitment', L.fulfil(S, ctxAs('dk'), 'c1'), 'You are neither provider nor receiver of this commitment.');

// ── Report ────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`check:prototypes FAILED, ${failures.length} problem${failures.length > 1 ? 's' : ''}:`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`check:prototypes passed: ${pairs} lifecycle pairs match the integrity zome at 3cbebf0; authorization, successor and single-claim rules hold.`);
