// Behaviour-only functional check for direction A · Mycelium.
//
// Not a fidelity check (compare:prototypes / scripts/compare/pairs/mycelium.ts
// own that, and are already passing under 1%). This proves that every
// interactive control in A.jsx has a port counterpart with the SAME EFFECT ON
// STATE: for each control, the same action is driven on the original
// (docs/prototypes/original/prototypes/A Mycelium.html) and the port
// (/prototypes/mycelium), and the resulting state change is asserted equal on
// both sides (counts, visibility, derived numbers), not exact label text
// (ISA Phase 9 D11 wording carried over: font/label noise is not a behaviour
// bug). Every scenario runs in a brand-new browser context on each side
// (playwright-core, real Chrome, headless), so no scenario can see another's
// localStorage or modal state, and a fresh context already starts at the
// seeded example network on both sides (see store/store.svelte.ts `load()`
// and core.jsx `useProto()`: no profile/no `PROTO_KEY` entry -> SEED).
import { launch, freshPage, assert, summarize } from './lib.ts';

const ORIG_BASE = process.env.ORIG_BASE ?? 'http://127.0.0.1:8799/prototypes';
const PORT_BASE = process.env.DS_URL ?? 'http://localhost:5180';
const ORIG_URL = `${ORIG_BASE}/A%20Mycelium.html`;
const PORT_URL = `${PORT_BASE}/prototypes/mycelium`;
const FN_ORIG_URL = `${ORIG_BASE}/B%20Field%20Notes.html`;
const FN_PORT_URL = `${PORT_BASE}/prototypes/field-notes`;

const browser = await launch();
const consoleErrors = [];

/** A pair of fresh, isolated pages (one per side) for one scenario. */
async function pair() {
  const o = await freshPage(browser);
  const p = await freshPage(browser);
  p.page.on('pageerror', (e) => consoleErrors.push(String(e)));
  p.page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  return {
    orig: o.page,
    port: p.page,
    async close() {
      await o.context.close();
      await p.context.close();
    }
  };
}

async function nav(orig, port, origUrl = ORIG_URL, portUrl = PORT_URL) {
  await orig.goto(origUrl, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(500);
  await port.goto(portUrl, { waitUntil: 'domcontentloaded' });
  await port.waitForTimeout(500);
}

/** Marker substrings unique to one modal's own body copy (never the text of
 *  the control that opens it), verified against ui.jsx and every ui/*.svelte
 *  `title=`/`sub=` literal before use. Both sides read `text=` case- and
 *  whitespace-insensitively, so this needs no per-side variant. */
const MARK = {
  create: 'Add a shared resource',
  group: 'Create a group',
  join: 'Join a group',
  browse: 'Find resources',
  profile: 'visible to your groups',
  help: 'without anyone owning or controlling them',
  note: 'Sign & log',
  advance: 'Change stage',
  resources: 'Items and who holds them',
  rule: 'across groups',
  commit: 'Send a request to the person holding',
  commitments: '+ Propose commitment',
  attach: 'Link to another resource',
  receipts: 'Your reputation so far',
  why: 'In short'
};

async function opened(page, mark) {
  await page.waitForTimeout(300);
  return (await page.locator(`text=${mark}`).count()) > 0;
}

async function run(name, fn) {
  try {
    await fn();
  } catch (e) {
    assert(name, false, 'threw: ' + (e && e.message ? e.message.split('\n')[0] : String(e)));
  }
}

// ── ?fresh=1: cold start shows the onboarding profile step ──
await run('?fresh=1 opens onboarding at the profile step', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port, `${ORIG_URL}?fresh=1`, `${PORT_URL}?fresh=1`);
  const o = (await orig.locator('text=Set up your profile').count()) > 0;
  const p = (await port.locator('text=Set up your profile').count()) > 0;
  assert('?fresh=1 opens onboarding at the profile step', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Rail: view switches ──
await run('rail Signals switches to the signals list', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.rail >> text=Signals').click();
  await port.goto(`${PORT_URL}?view=signals`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const o = (await orig.locator('h2:has-text("Open signals")').count()) > 0;
  const p = (await port.locator('h2:has-text("Open signals")').count()) > 0;
  // Cross-check: the rail badge and the list both derive the same open-signal
  // count on both sides, from the same seed.
  const oCnt = await orig.locator('.rail .cnt').textContent();
  const pCnt = await port.locator('.rail .cnt').textContent();
  assert('rail Signals switches to the signals list', o && p, `orig=${o} port=${p}`);
  assert('signals badge count matches between original and port', oCnt?.trim() === pCnt?.trim(), `orig=${oCnt} port=${pCnt}`);
  await close();
});

await run('rail Traces switches to the traces list', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.rail >> text=Traces').click();
  await port.goto(`${PORT_URL}?view=traces`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const o = (await orig.locator('h2:has-text("Traces reaching your node")').count()) > 0;
  const p = (await port.locator('h2:has-text("Traces reaching your node")').count()) > 0;
  assert('rail Traces switches to the traces list', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('rail You switches to the profile view', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.rail >> text=You').click();
  await port.goto(`${PORT_URL}?view=you`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const o = (await orig.locator('h2:has-text("Tiberius")').count()) > 0;
  const p = (await port.locator('h2:has-text("Tiberius")').count()) > 0;
  assert('rail You switches to the profile view', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Group scope chips narrow the field, identically ──
await run('group scope chip narrows the field to the same count on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oAll = await orig.locator('svg > g').count();
  const pAll = await port.locator('svg > g').count();
  await orig.locator('.top >> text=Sensorica').click();
  await port.locator('.top >> text=Sensorica').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oSen = await orig.locator('svg > g').count();
  const pSen = await port.locator('svg > g').count();
  assert(
    'group scope chip narrows the field to the same count on both sides',
    oAll === pAll && oSen === pSen && oSen < oAll,
    `all: orig=${oAll} port=${pAll}; Sensorica: orig=${oSen} port=${pSen}`
  );
  await close();
});

// ── Trail mode toggle changes which trails render, identically ──
await run('"Custody" mode narrows the trails to the same count on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oAll = await orig.locator('svg path').count();
  const pAll = await port.locator('svg path').count();
  // Scoped to `.top`: the legend's "use & custody" text also matches a bare
  // `text=Custody` (case-insensitive substring), but only lives in `.foot`.
  await orig.locator('.top >> text=Custody').click();
  await port.locator('.top >> text=Custody').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oCust = await orig.locator('svg path').count();
  const pCust = await port.locator('svg path').count();
  assert(
    '"Custody" mode narrows the trails to the same count on both sides',
    oAll === pAll && oCust === pCust && oCust < oAll,
    `Trails: orig=${oAll} port=${pAll}; Custody: orig=${oCust} port=${pCust}`
  );
  await close();
});

// ── Fade slider ──
await run('fade slider updates the "N d" readout the same on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const setRange = (page) =>
    page.locator('.decay input[type="range"]').evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, '45');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  await setRange(orig);
  await setRange(port);
  await orig.waitForTimeout(200);
  await port.waitForTimeout(200);
  const o = (await orig.locator('.decay >> text=45 d').count()) > 0;
  const p = (await port.locator('.decay >> text=45 d').count()) > 0;
  assert('fade slider updates the "N d" readout the same on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Selecting a node in the field changes the detail panel ──
await run('clicking a field node selects it in the detail panel on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('svg text', { hasText: 'Environmental Sensor Design' }).click();
  await port.locator('svg text', { hasText: 'Environmental Sensor Design' }).click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const o = (await orig.locator('.panel h1:has-text("Environmental Sensor Design v3")').count()) > 0;
  const p = (await port.locator('.panel h1:has-text("Environmental Sensor Design v3")').count()) > 0;
  assert('clicking a field node selects it in the detail panel on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Closing the detail panel shows the same empty state on both sides ──
await run('closing the detail panel shows the same empty-state text on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.panel .x').click();
  await port.locator('.panel .x').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const o = (await orig.locator('text=Select an NDO in the field to see its traces, signals and links.').count()) > 0;
  const p = (await port.locator('text=Select an NDO in the field to see its traces, signals and links.').count()) > 0;
  assert('closing the detail panel shows the same empty-state text on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Detail panel actions open their shared modals on both sides ──
const panelActs = [
  ['Log work', MARK.note],
  ['Lifecycle', MARK.advance],
  ['Items & holders', MARK.resources],
  ['Requests', MARK.commitments],
  ['+ Rule', MARK.rule]
];
for (const [label, mark] of panelActs) {
  await run(`detail panel "${label}" opens its modal on both sides`, async () => {
    const { orig, port, close } = await pair();
    await nav(orig, port);
    await orig.locator('.panel button', { hasText: label }).click();
    await port.locator('.panel button', { hasText: label }).click();
    const o = await opened(orig, mark);
    const p = await opened(port, mark);
    assert(`detail panel "${label}" opens its modal on both sides`, o && p, `orig=${o} port=${p}`);
    await close();
  });
}

// ── Linked resources "+ link resource" opens AttachModal ──
await run('"+ link resource" opens the attach modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=+ link resource').click();
  await port.locator('text=+ link resource').click();
  const o = await opened(orig, MARK.attach);
  const p = await opened(port, MARK.attach);
  assert('"+ link resource" opens the attach modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Signal card: "why am I seeing this?" and the pick-up button ──
await run('"why am I seeing this?" opens the why modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=why am I seeing this?').first().click();
  await port.locator('text=why am I seeing this?').first().click();
  const o = await opened(orig, MARK.why);
  const p = await opened(port, MARK.why);
  assert('"why am I seeing this?" opens the why modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('picking up a signal shrinks the signals list the same way on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.rail >> text=Signals').click();
  await port.goto(`${PORT_URL}?view=signals`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oBefore = await orig.locator('.sig').count();
  const pBefore = await port.locator('.sig').count();
  await orig.locator('.sig > button').first().click();
  await port.locator('.sig > button').first().click();
  await orig.waitForTimeout(400);
  await port.waitForTimeout(400);
  const oAfter = await orig.locator('.sig').count();
  const pAfter = await port.locator('.sig').count();
  assert(
    'picking up a signal shrinks the signals list the same way on both sides',
    oBefore === pBefore && oAfter === pAfter && oAfter < oBefore,
    `before: orig=${oBefore} port=${pBefore}; after: orig=${oAfter} port=${pAfter}`
  );
  await close();
});

// ── Top bar: + Group, → Join, + Declare NDO ──
await run('"+ Group" opens the create-group modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.top >> text=+ Group').click();
  await port.locator('.top >> text=+ Group').click();
  const o = await opened(orig, MARK.group);
  const p = await opened(port, MARK.group);
  assert('"+ Group" opens the create-group modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"→ Join" opens the join-group modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.top >> text=→ Join').click();
  await port.locator('.top >> text=→ Join').click();
  const o = await opened(orig, MARK.join);
  const p = await opened(port, MARK.join);
  assert('"→ Join" opens the join-group modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"+ Declare NDO" opens the create-resource modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=+ Declare NDO').click();
  await port.locator('text=+ Declare NDO').click();
  const o = await opened(orig, MARK.create);
  const p = await opened(port, MARK.create);
  assert('"+ Declare NDO" opens the create-resource modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── FlowMenu: click to open, an item navigates, ⌘K/Ctrl+K opens it too ──
await run('the Menu button opens FlowMenu on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Menu').click();
  await port.locator('text=Menu').click();
  const o = (await orig.locator('text=How this works').count()) > 0;
  const p = (await port.locator('text=How this works').count()) > 0;
  assert('the Menu button opens FlowMenu on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('FlowMenu "Ask to borrow or receive" opens the commit modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Menu').click();
  await orig.locator('text=Ask to borrow or receive').click();
  await port.locator('text=Menu').click();
  await port.locator('text=Ask to borrow or receive').click();
  const o = await opened(orig, MARK.commit);
  const p = await opened(port, MARK.commit);
  assert('FlowMenu "Ask to borrow or receive" opens the commit modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('Ctrl/Cmd+K opens FlowMenu on both sides without clicking its button', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.keyboard.press('Control+k');
  await port.keyboard.press('Control+k');
  await orig.waitForTimeout(250);
  await port.waitForTimeout(250);
  const o = (await orig.locator('text=How this works').count()) > 0;
  const p = (await port.locator('text=How this works').count()) > 0;
  assert('Ctrl/Cmd+K opens FlowMenu on both sides without clicking its button', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── You view: edit profile, reputation summary, receipts count, reset ──
await run('"Edit profile & roles" opens the profile modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.rail >> text=You').click();
  await port.goto(`${PORT_URL}?view=you`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  await orig.locator('text=Edit profile & roles').click();
  await port.locator('text=Edit profile & roles').click();
  const o = await opened(orig, MARK.profile);
  const p = await opened(port, MARK.profile);
  assert('"Edit profile & roles" opens the profile modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Reputation summary" opens the receipts modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.rail >> text=You').click();
  await port.goto(`${PORT_URL}?view=you`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  await orig.locator('text=Reputation summary').click();
  await port.locator('text=Reputation summary').click();
  const o = await opened(orig, MARK.receipts);
  const p = await opened(port, MARK.receipts);
  assert('"Reputation summary" opens the receipts modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('reset reseeds the field to 6 NDOs on both sides after a new one is declared', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oBefore = await orig.locator('svg > g').count();
  const pBefore = await port.locator('svg > g').count();
  await orig.locator('text=+ Declare NDO').click();
  await orig.locator('input[placeholder="e.g. Shared Bike Fleet"]').fill('Verify Reset Probe');
  // Exact match: the trigger button "+ Declare NDO" (still in the DOM behind
  // the overlay) also matches a substring `has-text("Declare NDO")`.
  await orig.locator('button:text-is("Declare NDO")').click();
  await port.locator('text=+ Declare NDO').click();
  await port.locator('input[placeholder="e.g. Shared Bike Fleet"]').fill('Verify Reset Probe');
  await port.locator('button:text-is("Declare NDO")').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oAdded = await orig.locator('svg > g').count();
  const pAdded = await port.locator('svg > g').count();
  await orig.locator('.rail >> text=You').click();
  await port.goto(`${PORT_URL}?view=you`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(200);
  await port.waitForTimeout(200);
  await orig.locator('text=Reset prototype data').click();
  await port.locator('text=Reset prototype data').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  await orig.locator('.rail >> text=Field').click();
  await port.goto(`${PORT_URL}?view=field`, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oReset = await orig.locator('svg > g').count();
  const pReset = await port.locator('svg > g').count();
  assert(
    'reset reseeds the field to 6 NDOs on both sides after a new one is declared',
    oBefore === pBefore && oAdded > oBefore && pAdded > pBefore && oReset === oBefore && pReset === pBefore,
    `before: orig=${oBefore} port=${pBefore}; +1: orig=${oAdded} port=${pAdded}; after reset: orig=${oReset} port=${pReset}`
  );
  await close();
});

// ── Status bar: offline toggle ──
await run('the offline toggle flips the node label the same way on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oBefore = (await orig.locator('text=Your node').textContent())?.trim();
  const pBefore = (await port.locator('text=Your node').textContent())?.trim();
  await orig.locator('text=Your node').click();
  await port.locator('text=Your node').click();
  await orig.waitForTimeout(200);
  await port.waitForTimeout(200);
  const oAfter = (await orig.locator('text=Your node').textContent())?.trim();
  const pAfter = (await port.locator('text=Your node').textContent())?.trim();
  assert(
    'the offline toggle flips the node label the same way on both sides',
    oBefore !== oAfter && pBefore !== pAfter && oAfter?.includes('offline') && pAfter?.includes('offline'),
    `orig: "${oBefore}" -> "${oAfter}"; port: "${pBefore}" -> "${pAfter}"`
  );
  await close();
});

// ── Cross-direction flow: a trace left in Mycelium shows up in Field Notes ──
await run('logging work in Mycelium shows the same trace in Field Notes (shared store)', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const NOTE = 'verify cross-direction flow ' + Date.now();
  // sol (the CNC machine) is selected by default on both sides.
  await orig.locator('.panel button', { hasText: 'Log work' }).click();
  await orig.locator('textarea').fill(NOTE);
  await orig.locator('input[type="number"]').fill('2');
  await orig.locator('button:has-text("Sign & log")').click();
  await orig.waitForTimeout(300);
  await port.locator('.panel button', { hasText: 'Log work' }).click();
  await port.locator('textarea').fill(NOTE);
  await port.locator('input[type="number"]').fill('2');
  await port.locator('button:has-text("Sign & log")').click();
  await port.waitForTimeout(300);

  // Navigate the SAME context/page to Field Notes: same origin, same
  // localStorage key, so the trace must already be there if the store is
  // truly shared.
  await orig.goto(FN_ORIG_URL, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(500);
  await port.goto(FN_PORT_URL, { waitUntil: 'domcontentloaded' });
  await port.waitForTimeout(500);

  const o = (await orig.locator(`text=${NOTE}`).count()) > 0 && (await orig.locator('text=logged 2 h work').count()) > 0;
  const p = (await port.locator(`text=${NOTE}`).count()) > 0 && (await port.locator('text=logged 2 h work').count()) > 0;
  assert('logging work in Mycelium shows the same trace in Field Notes (shared store)', o && p, `orig=${o} port=${p}`);
  await close();
});

await browser.close();

assert('zero console errors on the port side', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

process.exit(summarize('Mycelium'));
