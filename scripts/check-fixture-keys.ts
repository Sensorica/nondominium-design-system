#!/usr/bin/env bun
/**
 * Fixture key-collision audit.
 *
 * WHY THIS EXISTS. On 2026-09-08 a real defect in `ActivityTab` survived every
 * instrument this repo has. The walk asked for resources by NDO hash where the
 * app asks by specification hash, and it returned identical rows, so
 * `svelte-check` passed, `check:fidelity` passed, and the browser passed. None
 * of those instruments was weak. They were being asked a question the data could
 * not answer: every specification in the mock had been seeded with `action_hash`
 * equal to its `ndo_identity_hash`, and the resources map was keyed by those same
 * values, so a query keyed on either one was indistinguishable from a query keyed
 * on the other.
 *
 * That is the general shape, and it is worth a tool rather than a memory. A mock
 * is built to make screens render, so its keys get chosen for convenience, and
 * every value shared between two roles silently retires a parity question. The
 * kit does not announce which questions have been retired, which is exactly what
 * makes the resulting green untrustworthy: it cannot go red.
 *
 * So this walks the seed data, groups every key by the ROLE it plays, and reports
 * any value appearing in more than one role. A collision is not automatically a
 * bug. Some are load-bearing, and those are declared below with the reason. What
 * a collision always is, is a question the fixture can no longer be asked, and
 * the point of the report is that the list is visible instead of implicit.
 *
 *   bun run check:fixture
 */

import { readFileSync, writeFileSync } from 'node:fs';
import {
  INITIAL_EVENTS,
  INITIAL_GROUPS,
  INITIAL_GROUP_MEMBERS,
  INITIAL_GROUP_NDOS,
  INITIAL_NDOS,
  INITIAL_NDO_MEMBERS,
  INITIAL_PERSONS,
  INITIAL_RESOURCES,
  INITIAL_RULES,
  INITIAL_SPEC_LISTINGS,
  INITIAL_TRANSITIONS
} from '../src/lib/replica/mock';

/** Every distinct role a hash plays in the seed data. */
type Role =
  | 'ndo.hash'
  | 'spec.action_hash'
  | 'spec.ndo_identity_hash'
  | 'resource.key'
  | 'resource.actionHash'
  | 'event.key'
  | 'event.resource_inventoried_as'
  | 'event.ndo_identity_hash'
  | 'rule.key'
  | 'rule.ndo_identity_hash'
  | 'transition.key'
  | 'ndoMembers.key'
  | 'group.id'
  | 'groupNdos.key'
  | 'groupNdos.value'
  | 'groupMembers.key'
  | 'person.agent_pub_key';

const has = (flag: string) => process.argv.includes(`--${flag}`);

const roles = new Map<Role, Set<string>>();
const note = (role: Role, value: string | null | undefined) => {
  if (!value) return;
  if (!roles.has(role)) roles.set(role, new Set());
  roles.get(role)!.add(value);
};

for (const n of INITIAL_NDOS) note('ndo.hash', n.hash);
for (const l of INITIAL_SPEC_LISTINGS) {
  note('spec.action_hash', l.action_hash);
  note('spec.ndo_identity_hash', l.specification.ndo_identity_hash);
}
for (const [k, rows] of Object.entries(INITIAL_RESOURCES)) {
  note('resource.key', k);
  for (const r of rows) note('resource.actionHash', r.actionHash);
}
for (const [k, evs] of Object.entries(INITIAL_EVENTS)) {
  note('event.key', k);
  for (const e of evs) {
    note('event.resource_inventoried_as', e.resource_inventoried_as);
    note('event.ndo_identity_hash', e.ndo_identity_hash);
  }
}
for (const [k, rules] of Object.entries(INITIAL_RULES)) {
  note('rule.key', k);
  for (const r of rules) note('rule.ndo_identity_hash', r.ndo_identity_hash);
}
for (const k of Object.keys(INITIAL_TRANSITIONS)) note('transition.key', k);
for (const k of Object.keys(INITIAL_NDO_MEMBERS)) note('ndoMembers.key', k);
for (const g of INITIAL_GROUPS) note('group.id', g.id);
for (const [k, hashes] of Object.entries(INITIAL_GROUP_NDOS)) {
  note('groupNdos.key', k);
  for (const h of hashes) note('groupNdos.value', h);
}
for (const k of Object.keys(INITIAL_GROUP_MEMBERS)) note('groupMembers.key', k);
for (const p of INITIAL_PERSONS) note('person.agent_pub_key', p.agent_pub_key);

/**
 * Collisions that are correct by construction, with the reason. A pair is listed
 * as `roleA|roleB`, sorted. Anything not here is reported as undeclared, which is
 * the whole output of the tool: not "these are wrong" but "nobody has said why
 * these are the same".
 */
const DECLARED: Record<string, string> = {
  'ndo.hash|spec.ndo_identity_hash':
    'A specification names the NDO it specifies. Same value by definition.',
  'event.ndo_identity_hash|ndo.hash':
    'An event is tagged with the NDO it belongs to. Same value by definition.',
  'ndo.hash|rule.ndo_identity_hash':
    'A governance rule names the NDO it governs. Same value by definition.',
  'event.ndo_identity_hash|spec.ndo_identity_hash':
    'Both name the same NDO, transitively. Definitional.',
  'rule.ndo_identity_hash|spec.ndo_identity_hash':
    'Both name the same NDO, transitively. Definitional.',
  'event.ndo_identity_hash|rule.ndo_identity_hash':
    'Both name the same NDO, transitively. Definitional.',
  'event.key|event.resource_inventoried_as':
    'The events map is keyed by the resource the event is inventoried as. Definitional.',
  'event.key|resource.actionHash':
    'Events are keyed by resource action hash, which is what getEventsByResource looks up. Definitional.',
  'event.resource_inventoried_as|resource.actionHash':
    'Definitional, same as above.',
  'group.id|groupMembers.key':
    'Group members are keyed by group id.',
  'group.id|groupNdos.key':
    'Group NDO lists are keyed by group id.',
  'groupMembers.key|groupNdos.key':
    'Both are group ids, transitively.',
  'groupNdos.value|ndo.hash':
    'A group points at NDOs by hash.',
  'groupNdos.value|spec.ndo_identity_hash':
    'Transitively an NDO hash.',
  'event.ndo_identity_hash|groupNdos.value':
    'Transitively an NDO hash.',
  'groupNdos.value|rule.ndo_identity_hash':
    'Transitively an NDO hash.',
  'ndo.hash|transition.key':
    'Transition history is keyed by NDO hash.',
  'spec.ndo_identity_hash|transition.key':
    'Transitively an NDO hash.',
  'event.ndo_identity_hash|transition.key':
    'Transitively an NDO hash.',
  'rule.ndo_identity_hash|transition.key':
    'Transitively an NDO hash.',
  'groupNdos.value|transition.key':
    'Transitively an NDO hash.',
  'ndoMembers.key|ndo.hash':
    'NDO membership is keyed by NDO hash.',
  'ndoMembers.key|spec.ndo_identity_hash':
    'Transitively an NDO hash.',
  'event.ndo_identity_hash|ndoMembers.key':
    'Transitively an NDO hash.',
  'ndoMembers.key|rule.ndo_identity_hash':
    'Transitively an NDO hash.',
  'groupNdos.value|ndoMembers.key':
    'Transitively an NDO hash.',
  'ndoMembers.key|transition.key':
    'Transitively an NDO hash.'
};

const roleList = [...roles.entries()];
const collisions: Array<{ pair: string; values: string[]; separating: number }> = [];

for (let i = 0; i < roleList.length; i++) {
  for (let j = i + 1; j < roleList.length; j++) {
    const [ra, va] = roleList[i];
    const [rb, vb] = roleList[j];
    const shared = [...va].filter((v) => vb.has(v));
    if (!shared.length) continue;
    // Separating instances: values one role holds and the other does not. One is
    // enough. A pair with zero of them is a question that cannot be posed; a pair
    // with one is a question that has an answer, and the separating row is the
    // proof. Counting only collisions makes those two look identical in the
    // report, which under-states the fixture's own progress: `ndo.hash` and
    // `spec.action_hash` collide four times and are separated once, by "Solar
    // Array Mounting Rig", so that query is now demonstrably answerable.
    const separating =
      [...va].filter((v) => !vb.has(v)).length + [...vb].filter((v) => !va.has(v)).length;
    collisions.push({ pair: [ra, rb].sort().join('|'), values: shared, separating });
  }
}

console.log('Fixture key-collision audit: src/lib/replica/mock.ts');
console.log('='.repeat(72));
console.log('A collision means two roles share a value, so a query keyed on either one');
console.log('returns the same answer and the fixture cannot tell the two apart. Some are');
console.log('definitional. The undeclared ones are parity questions nobody can ask.');
console.log('');

const undeclared = collisions.filter((c) => !(c.pair in DECLARED));
const unposable = undeclared.filter((c) => c.separating === 0);
const answerable = undeclared.filter((c) => c.separating > 0);

for (const c of collisions.filter((c) => c.pair in DECLARED)) {
  console.log(`  declared    ${c.pair}  (${c.values.length} colliding)`);
}
console.log('');

for (const c of answerable) {
  console.log(
    `  separated   ${c.pair}  (${c.values.length} colliding, ${c.separating} separating)`
  );
}
if (answerable.length) {
  console.log('      Undeclared, but at least one value distinguishes the two roles, so a query');
  console.log('      keyed on either is falsifiable against this fixture.');
  console.log('');
}

if (unposable.length === 0) {
  console.log('No unposable pairs. Every undeclared collision has a separating instance.');
} else {
  for (const c of unposable) {
    console.log(`  UNPOSABLE   ${c.pair}`);
    for (const v of c.values) console.log(`      ${v}`);
    console.log('      Every value in one role is in the other, so a query keyed on either is');
    console.log('      indistinguishable. Seed a discriminating row, or declare the pair.');
  }
}

console.log('');
console.log(
  `${roleList.length} key roles, ${collisions.length} colliding pairs: ` +
    `${collisions.length - undeclared.length} declared, ${answerable.length} separated, ${unposable.length} unposable`
);
/**
 * The ratchet.
 *
 * Two obvious designs are both wrong. A tool that fails on every undeclared pair
 * gets its list declared away within a week and the finding disappears. A tool
 * that can never fail gets ignored, which is the same death more slowly.
 *
 * So: exit 0 on everything in the baseline, non-zero only on a pair that is NEW.
 * Nobody is asked to retrofit the existing set, and nobody can add another
 * without writing down why at the moment they create it, which is the one moment
 * the reason is actually known. Declaring away a new pair then costs a sentence
 * somebody has to believe, rather than a line added to silence a build.
 */
const BASELINE_PATH = new URL('./fixture-keys.baseline.json', import.meta.url);
let baseline: string[] = [];
try {
  baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
} catch {
  baseline = [];
}

// `--write-baseline` records the current undeclared set as accepted. Run it
// deliberately, never to clear a red: the point of the ratchet is that a new pair
// costs a written reason at the moment it is created.
if (has('write-baseline')) {
  const pairs = [...new Set(undeclared.map((c) => c.pair))].sort();
  writeFileSync(BASELINE_PATH, JSON.stringify(pairs, null, 2) + '\n');
  console.log('');
  console.log(`Baseline written: ${pairs.length} pairs recorded as accepted.`);
  process.exit(0);
}

const known = new Set(baseline);
const novel = undeclared.filter((c) => !known.has(c.pair));

console.log('');
if (novel.length === 0) {
  console.log('Ratchet: no collision pairs beyond the recorded baseline.');
} else {
  console.log('Ratchet: NEW collision pairs, absent from the baseline.');
  for (const c of novel) {
    console.log(`  NEW  ${c.pair}  (${c.values.length} colliding, ${c.separating} separating)`);
  }
  console.log('');
  console.log('A new pair means two roles that used to be distinguishable no longer are, or a');
  console.log('new role was added onto existing values. Seed a row that separates them, add the');
  console.log('pair to DECLARED with a reason, or record it in the baseline deliberately.');
  console.log(`Baseline: ${BASELINE_PATH.pathname}`);
}

if (novel.length > 0) process.exit(1);
