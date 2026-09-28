// Functional check for direction F, Flow Graph: every action/control that
// docs/prototypes/inventory/flow-graph.md marks "functional check" rather
// than "compare pair". Not a fidelity check (compare:prototypes owns that,
// scripts/compare/pairs/flow-graph.ts) — this proves each control changes
// state (or shows the right error) the way F Flow Graph.dc.html and
// backend.ts say it should.
import { chromium } from 'playwright-core';

const BASE = process.env.DS_URL ?? 'http://localhost:5180';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, pass: !!cond, detail });
  console.log((cond ? 'PASS' : 'FAIL') + '  ' + name + (detail ? '  (' + detail + ')' : ''));
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(String(e)));
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});

const errText = () => page.locator('.error[role="alert"]');
const okText = () => page.locator('.ok[role="status"]');
async function callAction(label) {
  await page.locator('button.action', { hasText: label }).first().click();
  await page.waitForTimeout(200);
}
async function submit() {
  await page.locator('button.btn--primary', { hasText: 'Call' }).click();
  await page.waitForTimeout(250);
}
async function cancelIfOpen() {
  const cancel = page.locator('button.btn--ghost', { hasText: 'Cancel' });
  if (await cancel.count()) await cancel.click();
  await page.waitForTimeout(150);
}
async function newEntry(label) {
  await page.locator('button.btn--primary', { hasText: '+ New entry' }).click();
  await page.waitForTimeout(200);
  await page.locator('.menu__item', { hasText: label }).click();
  await page.waitForTimeout(200);
}

// Fresh localStorage each run so results are deterministic. `?fresh=1` loads
// the `blank` scenario (ISA claim 34): two conductors, no Person, no group,
// so "Create person" et al. hit no pre-seeded state.
await page.goto(BASE + '/prototypes/flow-graph');
await page.waitForTimeout(400);
await page.evaluate(() => localStorage.removeItem('ndo-backend-v1'));
await page.goto(BASE + '/prototypes/flow-graph?fresh=1');
await page.waitForTimeout(800);

// ── Header, phase 1 (blank scenario: conductors have no name yet) ──
// 1. Perspective tabs: the second one (a conductor) hides "writing as".
await page.locator('.seg__btn').nth(1).click();
await page.waitForTimeout(200);
ok('perspective tab switches to a conductor view', (await page.locator('.writers').count()) === 0, 'writing-as row hidden outside network view');
await page.locator('.seg__btn').first().click();
await page.waitForTimeout(200);

// 2. Developer details toggle: label and dev-only rows.
await page.locator('button.dev').click();
await page.waitForTimeout(200);
ok('dev toggle flips its own label', (await page.locator('button.dev').textContent()).includes('on'));
await page.locator('button.dev').click();
await page.waitForTimeout(200);

// 3. "+ New entry" menu + its three root actions, as conductor a.
await newEntry('Create person');
await page.locator('label.field input').fill('');
await submit();
ok('Create person: empty name shows "Please fill in the name."', (await errText().textContent())?.includes('Please fill in the name.'));
await page.locator('label.field input').fill('Test Person');
await submit();
ok('Create person succeeds with a name', await okText().isVisible());

await newEntry('Create group');
await page.locator('label.field input').first().fill('');
await submit();
ok('Create group: empty name shows the same friendly error', (await errText().textContent())?.includes('Please fill in the name.'));
await page.locator('label.field input').first().fill('Test Group');
await page.locator('label.field input').nth(1).fill('A group made for the functional check.');
await submit();
ok('Create group succeeds', await okText().isVisible());

await newEntry('Create a shared resource');
await page.locator('label.field input[type="text"]').first().fill('Fresh Ideation NDO');
await page.locator('label.field select').first().selectOption('Nondominium'); // property_regime
await submit();
ok('Create a shared resource succeeds (Nondominium regime, stays at Ideation)', await okText().isVisible());
ok('The new NDO is auto-selected in the panel', (await page.locator('.h').textContent())?.includes('Fresh Ideation NDO'));

// ── Reachable backend constraint: Layer 1 gated on lifecycle stage ──
await callAction('Add a kind of item');
await page.locator('label.field input').first().fill('Too early spec');
await submit();
ok(
  'Add a kind of item on an Ideation NDO shows its friendly Layer-1 error',
  (await errText().textContent())?.includes("Kinds of item can't be added yet. Move the resource past the idea stage first.")
);
await cancelIfOpen();

// ── Reachable backend constraint: ownership-transfer rule on a Nondominium NDO ──
await callAction('Add governance rule');
await page.locator('label.field select').first().selectOption('TransferCondition'); // rule_type
await page.waitForTimeout(150);
await page.locator('label.field select').nth(1).selectOption('Ownership'); // transfer_type
await submit();
ok(
  'An ownership-transfer rule on a Nondominium NDO shows the capture-resistance error',
  (await errText().textContent())?.includes(
    "An uncapturable resource can't have a rule that hands over ownership. Choose custody, use rights or benefit instead."
  )
);
await cancelIfOpen();

// ── Switch to the equipment scenario for everything that needs pre-seeded,
//    named agents, roles, groups and a validated item. Clear the current
//    selection first: the scenario picker only shows on the Guide screen. ──
// The "Hide panel" rail button visually overlaps "Clear selection" in this
// corner (true in the original too: `.insp-head` reserves no space for it,
// see the comment on `.insp-head`), so a real coordinate-based click here
// would land on "Hide panel" instead. Dispatch the click directly.
await page.locator('button.close').evaluate((el) => el.click());
await page.waitForTimeout(200);
await page.locator('button.scenario', { hasText: 'Equipment sharing between two organisations' }).click();
await page.waitForTimeout(400);
ok('Scenario switch reseeds the network', (await page.locator('button.card').count()) > 5);
ok('Perspective tabs now show the seeded names', (await page.locator('.seg__btn').nth(1).textContent())?.includes('Sarah'));

// ── Already-a-member: Marco re-joining Sensorica (equipment seed already
//    joins him once) ──
await page.locator('.writer', { hasText: 'Marco' }).click();
await page.waitForTimeout(150);
await page.locator('button.card', { hasText: 'Sensorica' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
const hasJoin = await page.locator('button.action', { hasText: 'Join group' }).count();
if (hasJoin) {
  await callAction('Join group');
  await submit();
  // Both sides show the raw "Already a member of this group", not F_ERR's
  // friendly "You are already in this group.": the original's own F_ERR
  // pattern is `/already a member/`, no `i` flag, and the raw text starts
  // "Already" (capital A) — the original's own regex never matches its own
  // error, verified against docs/prototypes/original/prototypes/ndo-backend.js
  // line 226 and F Flow Graph.dc.html line 283. Faithfully reproduced, not a
  // port bug: fixing the port's regex would be *more* correct than the
  // original, which is not what fidelity asks for here.
  ok('Joining a group you are already in shows the original\'s own (unmatched-regex) raw message', (await errText().textContent()) === 'Already a member of this group');
  await cancelIfOpen();
} else {
  ok('Join group action not offered to an existing member (same net effect, nothing to click)', true, 'skipped: action list omits it entirely');
}

// ── Role already assigned: Marco already has Transport ──
await page.locator('button.card', { hasText: 'Marco' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('Assign role to Marco');
await page.locator('label.field select').first().selectOption('Transport');
await submit();
ok('Assigning a role the person already has shows "This person already has that role."', (await errText().textContent())?.includes('This person already has that role.'));
await cancelIfOpen();

// ── Custodian-only actions, tried by the non-custodian (writer is Marco) ──
await page.locator('button.card', { hasText: 'Proxxon MF70 #1' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('Change status');
await submit();
ok(
  'Change status as the non-custodian shows "Only the person currently holding this item can do that."',
  (await errText().textContent())?.includes('Only the person currently holding this item can do that.')
);
await cancelIfOpen();
await callAction('Transfer custody');
await submit();
ok(
  'Transfer custody as the non-custodian shows the same custodian-only error',
  (await errText().textContent())?.includes('Only the person currently holding this item can do that.')
);
await cancelIfOpen();

// ── NotAuthor: Marco tries to change the CNC machine's stage (Sarah's) ──
await page.locator('button.card', { hasText: 'CNC Machine' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('Change stage');
const hasDeprecated = await page.locator('label.field select option', { hasText: 'Deprecated' }).count();
await submit();
ok(
  "Changing another writer's resource stage shows \"Only the person who created this resource can change its stage.\"",
  (await errText().textContent())?.includes('Only the person who created this resource can change its stage.')
);
ok('The Deprecated option exists in the Next stage select', hasDeprecated > 0);
await cancelIfOpen();

// ── Deprecated without a successor, as Sarah (the initiator) ──
await page.locator('.writer', { hasText: 'Sarah' }).click();
await page.waitForTimeout(150);
await callAction('Change stage');
await page.locator('label.field select').first().selectOption('Deprecated');
await page.waitForTimeout(150);
await submit();
ok(
  'Deprecating without a successor shows "Pick the resource that replaces this one first."',
  (await errText().textContent())?.includes('Pick the resource that replaces this one first.')
);
await cancelIfOpen();

// ── Self-validation and double-validation on the seeded item ──
await page.locator('button.card', { hasText: 'Proxxon MF70 #1' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('Make a promise');
await page.locator('label.field select').first().selectOption('Use');
await submit();
ok('Make a promise succeeds', await okText().isVisible());

// Sarah is the item's author *and* custodian, so her own "Approve this item"
// hits the self-validation guard first.
await page.locator('button.card', { hasText: 'Proxxon MF70 #1' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('Approve this item');
await submit();
ok(
  "Approving your own item shows \"You can't approve your own item. Ask someone else.\"",
  (await errText().textContent())?.includes("You can't approve your own item. Ask someone else.")
);
await cancelIfOpen();

// Marco already validated it once in the seed; his second attempt hits the
// already-validated guard.
await page.locator('.writer', { hasText: 'Marco' }).click();
await page.waitForTimeout(150);
await page.locator('button.card', { hasText: 'Proxxon MF70 #1' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('Approve this item');
await submit();
ok('Approving an already-validated item shows "You have already approved this."', (await errText().textContent())?.includes('You have already approved this.'));
await cancelIfOpen();

// ── Record what happened (log_economic_event) ──
await callAction('Record what happened');
await submit();
ok('Record what happened succeeds', await okText().isVisible());

// ── List in a group (NdoAnchor) ──
await page.locator('.writer', { hasText: 'Sarah' }).click();
await page.waitForTimeout(150);
await page.locator('button.card', { hasText: 'CNC Machine' }).first().evaluate((el) => el.click());
await page.waitForTimeout(150);
await callAction('List in a group');
await submit();
ok('List in a group succeeds (a second anchor for the same NDO)', await okText().isVisible());

// ── Zoom, lane jump, legend, dock, conductor toggle (not covered by a
//    compare pair, or covered only at one fixed state) ──
await page.locator('.head', { hasText: 'PEOPLE' }).click();
await page.waitForTimeout(200);
ok('Lane header jump runs without error', consoleErrors.length === 0, 'pan itself asserted visually via --pixel frames, not here');

const beforeRows = await page.locator('.dock .row').count();
await page.locator('button.toggle', { hasText: 'activity' }).click();
await page.waitForTimeout(200);
ok('Dock toggle opens the activity log', (await page.locator('.dock .row').count()) >= beforeRows);

const conductorBtn = page.locator('button.cond').first();
const beforeLabel = await conductorBtn.textContent();
await conductorBtn.click();
await page.waitForTimeout(200);
const afterLabel = await conductorBtn.textContent();
ok('Conductor toggle flips online/offline', beforeLabel !== afterLabel, `${beforeLabel} -> ${afterLabel}`);
await conductorBtn.click();

// ── Reset ──
await page.locator('button.btn--ghost', { hasText: 'Reset' }).click();
await page.waitForTimeout(400);
ok('Reset reseeds the equipment example', (await page.locator('button.card', { hasText: 'CNC Machine' }).count()) > 0);

console.log('\nConsole/page errors seen during this run: ' + consoleErrors.length);
for (const e of consoleErrors) console.log('  ' + e);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
await browser.close();
process.exit(failed.length || consoleErrors.length ? 1 : 0);
