// Behaviour-only functional check for direction B · Field Notes.
//
// Not a fidelity check (compare:prototypes / scripts/compare/pairs/field-notes.ts
// own that, and are already passing under threshold). This proves that every
// interactive control in B.jsx has a port counterpart with the SAME EFFECT ON
// STATE: for each control, the same action is driven on the original
// (docs/prototypes/original/prototypes/B Field Notes.html) and the port
// (/prototypes/field-notes), and the resulting state change is asserted equal
// on both sides (counts, visibility, derived numbers), not exact label text.
// Every scenario runs in a brand-new browser context on each side
// (playwright-core, real Chrome, headless), so no scenario can see another's
// localStorage or modal state, and a fresh context already starts at the
// seeded example network on both sides (store/store.svelte.ts `load()` and
// core.jsx `useProto()`: no profile/no persisted key -> SEED).
import { launch, freshPage, assert, summarize } from './lib.ts';

const ORIG_BASE = process.env.ORIG_BASE ?? 'http://127.0.0.1:8799/prototypes';
const PORT_BASE = process.env.DS_URL ?? 'http://localhost:5180';
const ORIG_URL = `${ORIG_BASE}/B%20Field%20Notes.html`;
const PORT_URL = `${PORT_BASE}/prototypes/field-notes`;
const MY_ORIG_URL = `${ORIG_BASE}/A%20Mycelium.html`;
const MY_PORT_URL = `${PORT_BASE}/prototypes/mycelium`;

const browser = await launch();
const consoleErrors = [];

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
 *  the control that opens it), verified against every ui/*.svelte
 *  `title=`/`sub=` literal before use — several of B's own trigger labels are
 *  byte-identical to the shared modal's title ("Add a rule", "Items & holders"
 *  vs "Items and who holds them" is fine, but "Add a rule" collides exactly),
 *  so every marker here is deliberately body copy, not the title. */
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

// ── Default entry (sol, the CNC machine) on both sides ──
await run('the register opens on the same default entry on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const o = (await orig.locator('h1:has-text("CNC Machine")').count()) > 0;
  const p = (await port.locator('h1:has-text("CNC Machine")').count()) > 0;
  assert('the register opens on the same default entry on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Search narrows the index the same way on both sides ──
await run('search narrows the index to the same count on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oAll = await orig.locator('.entry').count();
  const pAll = await port.locator('.entry').count();
  await orig.locator('.search').fill('sensor');
  await port.locator('.search').fill('sensor');
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oFiltered = await orig.locator('.entry').count();
  const pFiltered = await port.locator('.entry').count();
  assert(
    'search narrows the index to the same count on both sides',
    oAll === pAll && oFiltered === pFiltered && oFiltered < oAll,
    `all: orig=${oAll} port=${pAll}; "sensor": orig=${oFiltered} port=${pFiltered}`
  );
  await close();
});

// ── Group section header collapses the register the same way on both sides ──
await run('collapsing a group section hides its entries on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oAll = await orig.locator('.entry').count();
  const pAll = await port.locator('.entry').count();
  await orig.locator('text=Sensorica · register').click();
  await port.locator('text=Sensorica · register').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oCollapsed = await orig.locator('.entry').count();
  const pCollapsed = await port.locator('.entry').count();
  assert(
    'collapsing a group section hides its entries on both sides',
    oAll === pAll && oCollapsed === pCollapsed && oCollapsed < oAll,
    `all: orig=${oAll} port=${pAll}; collapsed: orig=${oCollapsed} port=${pCollapsed}`
  );
  await close();
});

// ── Clicking a register entry opens it on the page ──
await run('clicking a register entry opens it on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.entry', { hasText: 'Environmental Sensor Design' }).click();
  await port.locator('.entry', { hasText: 'Environmental Sensor Design' }).click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const o = (await orig.locator('.page h1:has-text("Environmental Sensor Design v3")').count()) > 0;
  const p = (await port.locator('.page h1:has-text("Environmental Sensor Design v3")').count()) > 0;
  assert('clicking a register entry opens it on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Index footer: Open a new entry, + New group, → Join group, Browse ──
await run('"Open a new entry" opens the create-resource modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Open a new entry').click();
  await port.locator('text=Open a new entry').click();
  const o = await opened(orig, MARK.create);
  const p = await opened(port, MARK.create);
  assert('"Open a new entry" opens the create-resource modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"+ New group" opens the create-group modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.idxfoot >> text=+ New group').click();
  await port.locator('.idxfoot >> text=+ New group').click();
  const o = await opened(orig, MARK.group);
  const p = await opened(port, MARK.group);
  assert('"+ New group" opens the create-group modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"→ Join group" opens the join-group modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.idxfoot >> text=→ Join group').click();
  await port.locator('.idxfoot >> text=→ Join group').click();
  const o = await opened(orig, MARK.join);
  const p = await opened(port, MARK.join);
  assert('"→ Join group" opens the join-group modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Browse" opens the find-resources modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.idxfoot >> text=Browse').click();
  await port.locator('.idxfoot >> text=Browse').click();
  const o = await opened(orig, MARK.browse);
  const p = await opened(port, MARK.browse);
  assert('"Browse" opens the find-resources modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── FlowMenu ("Flows"): open, an item, and Ctrl/Cmd+K ──
await run('the "Flows" button opens FlowMenu on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Flows').click();
  await port.locator('text=Flows').click();
  const o = (await orig.locator('text=How this works').count()) > 0;
  const p = (await port.locator('text=How this works').count()) > 0;
  assert('the "Flows" button opens FlowMenu on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('FlowMenu "Your profile" opens the profile modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Flows').click();
  await orig.locator('text=Your profile').click();
  await port.locator('text=Flows').click();
  await port.locator('text=Your profile').click();
  const o = await opened(orig, MARK.profile);
  const p = await opened(port, MARK.profile);
  assert('FlowMenu "Your profile" opens the profile modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('FlowMenu "How this works" opens the help modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Flows').click();
  await orig.locator('text=How this works').click();
  await port.locator('text=Flows').click();
  await port.locator('text=How this works').click();
  const o = await opened(orig, MARK.help);
  const p = await opened(port, MARK.help);
  assert('FlowMenu "How this works" opens the help modal on both sides', o && p, `orig=${o} port=${p}`);
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

// ── Tabs: The trail / Rules & items / Requests / Linked ──
await run('"Rules & items" tab shows the rules-in-force heading on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Rules & items').click();
  await port.locator('text=Rules & items').click();
  const o = (await orig.locator('text=Rules in force').count()) > 0;
  const p = (await port.locator('text=Rules in force').count()) > 0;
  assert('"Rules & items" tab shows the rules-in-force heading on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Requests" tab shows the ask-to-borrow action on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.tabs >> text=Requests').click();
  await port.locator('.tabs >> text=Requests').click();
  const o = (await orig.locator('text=Ask to borrow or receive').count()) > 0;
  const p = (await port.locator('text=Ask to borrow or receive').count()) > 0;
  assert('"Requests" tab shows the ask-to-borrow action on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Linked" tab shows the link-to-another-NDO action on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Linked').click();
  await port.locator('text=Linked').click();
  const o = (await orig.locator('text=Link to another NDO').count()) > 0;
  const p = (await port.locator('text=Link to another NDO').count()) > 0;
  assert('"Linked" tab shows the link-to-another-NDO action on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Tab-row actions: Log work, Turn the page (lifecycle) ──
await run('"Log work" opens the log-work modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Log work').click();
  await port.locator('text=Log work').click();
  const o = await opened(orig, MARK.note);
  const p = await opened(port, MARK.note);
  assert('"Log work" opens the log-work modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Turn the page (lifecycle)" opens the advance modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Turn the page (lifecycle)').click();
  await port.locator('text=Turn the page (lifecycle)').click();
  const o = await opened(orig, MARK.advance);
  const p = await opened(port, MARK.advance);
  assert('"Turn the page (lifecycle)" opens the advance modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Rules tab: Add a rule, Items & holders ──
await run('"Add a rule" (rules tab) opens the rule modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Rules & items').click();
  await port.locator('text=Rules & items').click();
  await orig.locator('text=Add a rule').click();
  await port.locator('text=Add a rule').click();
  const o = await opened(orig, MARK.rule);
  const p = await opened(port, MARK.rule);
  assert('"Add a rule" (rules tab) opens the rule modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Items & holders" opens the resources modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Rules & items').click();
  await port.locator('text=Rules & items').click();
  await orig.locator('text=Items & holders').click();
  await port.locator('text=Items & holders').click();
  const o = await opened(orig, MARK.resources);
  const p = await opened(port, MARK.resources);
  assert('"Items & holders" opens the resources modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Requests tab: Ask to borrow or receive, Mark done… ──
await run('"Ask to borrow or receive" (requests tab) opens the commit modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.tabs >> text=Requests').click();
  await port.locator('.tabs >> text=Requests').click();
  await orig.locator('text=Ask to borrow or receive').click();
  await port.locator('text=Ask to borrow or receive').click();
  const o = await opened(orig, MARK.commit);
  const p = await opened(port, MARK.commit);
  assert('"Ask to borrow or receive" (requests tab) opens the commit modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('"Mark done…" opens the commitments modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.tabs >> text=Requests').click();
  await port.locator('.tabs >> text=Requests').click();
  await orig.locator('text=Mark done').click();
  await port.locator('text=Mark done').click();
  const o = await opened(orig, MARK.commitments);
  const p = await opened(port, MARK.commitments);
  assert('"Mark done…" opens the commitments modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Linked tab: Link to another NDO ──
await run('"Link to another NDO" opens the attach modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Linked').click();
  await port.locator('text=Linked').click();
  await orig.locator('text=Link to another NDO').click();
  await port.locator('text=Link to another NDO').click();
  const o = await opened(orig, MARK.attach);
  const p = await opened(port, MARK.attach);
  assert('"Link to another NDO" opens the attach modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Margin notes: a trace's own note renders as a blockquote on the trail ──
await run('a trace note renders as a margin quote, identically, on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  // sol's trace t1 carries a note in the seed data.
  const o = (await orig.locator('.margin', { hasText: 'Prototype run at the FabLab' }).count()) > 0;
  const p = (await port.locator('.margin', { hasText: 'Prototype run at the FabLab' }).count()) > 0;
  assert('a trace note renders as a margin quote, identically, on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Side column: "Left here for you" pick-up and why, and "elsewhere" ──
await run('the side column\'s "why?" link opens the why modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('.side >> text=why?').first().click();
  await port.locator('.side >> text=why?').first().click();
  const o = await opened(orig, MARK.why);
  const p = await opened(port, MARK.why);
  assert('the side column\'s "why?" link opens the why modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

await run('picking up the "Left here for you" signal empties that section on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  // sol's only "here" signal in the seed is a validate request on Marco's
  // commitment; the empty-state note ("Nothing left here...") is itself a
  // `.note` div, so counting `.note` before/after would not move (the
  // placeholder replaces the entry 1-for-1) — the real state change is which
  // text is showing, not the div count.
  const oBefore = (await orig.locator("text=Approve Marco's request").count()) > 0;
  const pBefore = (await port.locator("text=Approve Marco's request").count()) > 0;
  await orig.locator('.side .note .act').first().click();
  await port.locator('.side .note .act').first().click();
  await orig.waitForTimeout(400);
  await port.waitForTimeout(400);
  const oAfter = (await orig.locator('text=Nothing left here. The entry is quiet.').count()) > 0;
  const pAfter = (await port.locator('text=Nothing left here. The entry is quiet.').count()) > 0;
  assert(
    'picking up the "Left here for you" signal empties that section on both sides',
    oBefore && pBefore && oAfter && pAfter,
    `before (signal present): orig=${oBefore} port=${pBefore}; after (empty state): orig=${oAfter} port=${pAfter}`
  );
  await close();
});

await run('"Your receipts →" opens the receipts modal on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  await orig.locator('text=Your receipts').click();
  await port.locator('text=Your receipts').click();
  const o = await opened(orig, MARK.receipts);
  const p = await opened(port, MARK.receipts);
  assert('"Your receipts →" opens the receipts modal on both sides', o && p, `orig=${o} port=${p}`);
  await close();
});

// ── Conductor line: offline toggle, reset ──
await run('the offline toggle flips the conductor line the same way on both sides', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oBefore = (await orig.locator('text=23 peers hold this entry').count()) > 0;
  const pBefore = (await port.locator('text=23 peers hold this entry').count()) > 0;
  await orig.locator('text=23 peers hold this entry').click();
  await port.locator('text=23 peers hold this entry').click();
  await orig.waitForTimeout(200);
  await port.waitForTimeout(200);
  const oAfter = (await orig.locator('text=offline · writing locally').count()) > 0;
  const pAfter = (await port.locator('text=offline · writing locally').count()) > 0;
  assert(
    'the offline toggle flips the conductor line the same way on both sides',
    oBefore && pBefore && oAfter && pAfter,
    `before (online label present): orig=${oBefore} port=${pBefore}; after (offline label present): orig=${oAfter} port=${pAfter}`
  );
  await close();
});

await run('reset reseeds the register to 6 entries on both sides after one is declared', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const oBefore = await orig.locator('.entry').count();
  const pBefore = await port.locator('.entry').count();
  await orig.locator('text=Open a new entry').click();
  await orig.locator('input[placeholder="e.g. Shared Bike Fleet"]').fill('Verify Reset Probe');
  await orig.locator('button:text-is("Declare NDO")').click();
  await port.locator('text=Open a new entry').click();
  await port.locator('input[placeholder="e.g. Shared Bike Fleet"]').fill('Verify Reset Probe');
  await port.locator('button:text-is("Declare NDO")').click();
  await orig.waitForTimeout(300);
  await port.waitForTimeout(300);
  const oAdded = await orig.locator('.entry').count();
  const pAdded = await port.locator('.entry').count();
  await orig.locator('text=reset prototype').click();
  await port.locator('text=reset prototype').click();
  await orig.waitForTimeout(400);
  await port.waitForTimeout(400);
  const oReset = await orig.locator('.entry').count();
  const pReset = await port.locator('.entry').count();
  assert(
    'reset reseeds the register to 6 entries on both sides after one is declared',
    oBefore === pBefore && oAdded > oBefore && pAdded > pBefore && oReset === oBefore && pReset === pBefore,
    `before: orig=${oBefore} port=${pBefore}; +1: orig=${oAdded} port=${pAdded}; after reset: orig=${oReset} port=${pReset}`
  );
  await close();
});

// ── Cross-direction flow: a request proposed in Field Notes shows up in Mycelium ──
await run('proposing a request in Field Notes shows the same trace in Mycelium (shared store)', async () => {
  const { orig, port, close } = await pair();
  await nav(orig, port);
  const NOTE = 'verify cross-direction flow ' + Date.now();
  // sol (the CNC machine) is the default entry on both sides.
  await orig.locator('.tabs >> text=Requests').click();
  await orig.locator('text=Ask to borrow or receive').click();
  await orig.locator('input[placeholder*="transport notice"]').fill(NOTE);
  await orig.locator('button:text-is("Propose")').click();
  await orig.waitForTimeout(300);
  await port.locator('.tabs >> text=Requests').click();
  await port.locator('text=Ask to borrow or receive').click();
  await port.locator('input[placeholder*="transport notice"]').fill(NOTE);
  await port.locator('button:text-is("Propose")').click();
  await port.waitForTimeout(300);

  // Navigate the SAME context/page to Mycelium: same origin, same
  // localStorage key, so the trace must already be there if the store is
  // truly shared.
  await orig.goto(MY_ORIG_URL, { waitUntil: 'domcontentloaded' });
  await orig.waitForTimeout(500);
  await port.goto(MY_PORT_URL, { waitUntil: 'domcontentloaded' });
  await port.waitForTimeout(500);

  const o = (await orig.locator(`text=${NOTE}`).count()) > 0;
  const p = (await port.locator(`text=${NOTE}`).count()) > 0;
  assert('proposing a request in Field Notes shows the same trace in Mycelium (shared store)', o && p, `orig=${o} port=${p}`);
  await close();
});

await browser.close();

assert('zero console errors on the port side', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

process.exit(summarize('Field Notes'));
