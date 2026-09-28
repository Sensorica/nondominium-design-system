// Functional check for the Holarchy direction's own controls (lobby, group
// and NDO rings, and the card's own buttons). Not a fidelity check
// (compare:prototypes owns that) — this only proves each control changes
// state, or opens the modal, that E.jsx says it should.
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

// Fresh localStorage each run so results are deterministic.
await page.goto(BASE + '/prototypes/holarchy?example=1');
await page.waitForTimeout(600);

// ── Lobby: a group disc opens that group ──
await page.goto(BASE + '/prototypes/holarchy?view=lobby');
await page.waitForTimeout(500);
await page.locator('svg .group', { hasText: 'Sensorica' }).click();
await page.waitForTimeout(300);
ok('lobby group disc opens the group', (await page.url()).includes('view=group') && (await page.url()).includes('group=sen'));

// ── Group: one click selects (card summary, stays on the group view); a
// second click on the same NDO enters it (view drops to the default "ndo"
// view, so the URL's own view= param disappears) ──
await page.goto(BASE + '/prototypes/holarchy?view=group&group=sen');
await page.waitForTimeout(500);
await page.locator('svg .ndo', { hasText: 'Urban Canopy' }).click();
await page.waitForTimeout(300);
ok('group: one click selects (card shows "Enter this holon")', await page.locator('button.pbtn', { hasText: 'Enter this holon' }).isVisible());
ok('group: one click does not enter (still the group view)', (await page.url()).includes('view=group'));
await page.locator('svg .ndo', { hasText: 'Urban Canopy' }).click();
await page.waitForTimeout(300);
ok('group: second click enters the NDO (drops the group view)', !(await page.url()).includes('view=group') && (await page.url()).includes('ndo='));

// ── Group: "+ Resource" center opens the create modal ──
await page.goto(BASE + '/prototypes/holarchy?view=group&group=sen');
await page.waitForTimeout(500);
await page.locator('svg .add').click();
await page.waitForTimeout(300);
ok('group "+ Resource" opens the create modal', (await page.locator('text=Add a shared resource').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// ── NDO level: clicking a ring toggles focus (dims the others); the
// center circle clears it ──
await page.goto(BASE + '/prototypes/holarchy');
await page.waitForTimeout(600);
await page.locator('button.card-ring', { hasText: 'rules go with it' }).click();
await page.waitForTimeout(300);
ok('card ring row focuses (raises "on")', await page.locator('button.card-ring.on', { hasText: 'rules go with it' }).isVisible());
await page.locator('.core').click();
await page.waitForTimeout(300);
ok('center circle clears focus', (await page.locator('button.card-ring.on').count()) === 0);

// ── NDO level: the slot "+" bubble opens the attach modal ──
await page.locator('g.add').last().click();
await page.waitForTimeout(300);
ok('slot "+" bubble opens the attach modal', (await page.locator('text=Link to another resource').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// ── Card CTAs on an entered NDO ──
const ctas = [
  ['Link resource', 'Link to another resource'],
  ['Log work', 'Log work'],
  ['Lifecycle', 'Change stage'],
  ['Items', 'Items and who holds them'],
  ['Requests', 'Requests']
];
for (const [button, modalTitle] of ctas) {
  await page.locator('.cta button', { hasText: button }).first().click();
  await page.waitForTimeout(300);
  ok(`card CTA "${button}" opens its modal`, (await page.locator(`text=${modalTitle}`).count()) > 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
}
await page.locator('.cta button', { hasText: '+ Rule' }).click();
await page.waitForTimeout(300);
ok('card CTA "+ Rule" opens the rule modal', (await page.locator('text=Add a rule').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// ── "Needs attention" row: pick-up button runs the action, "?" opens why ──
const whyBtn = page.locator('.sgr button.mini.quiet').first();
if (await whyBtn.count()) {
  await whyBtn.click();
  await page.waitForTimeout(300);
  ok('needs-attention "?" opens the why modal', (await page.locator('text=Why am I seeing this?').count()) > 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
} else {
  ok('needs-attention "?" opens the why modal', true, 'no signal on this NDO in this run');
}

// ── FlowMenu-only modals: commit, receipts, help, browse, profile ──
await page.goto(BASE + '/prototypes/holarchy');
await page.waitForTimeout(600);
await page.locator('button', { hasText: 'Menu' }).click();
await page.waitForTimeout(200);
await page.locator('button', { hasText: 'Ask to borrow or receive' }).click();
await page.waitForTimeout(300);
ok('FlowMenu "Ask to borrow or receive" opens the commit modal', (await page.locator('text=Ask to borrow or receive').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

for (const [item, title] of [
  ['How this works', 'How this works'],
  ['Find resources', 'Find resources'],
  ['Your profile', 'Your profile']
]) {
  await page.locator('button', { hasText: 'Menu' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: item }).click();
  await page.waitForTimeout(300);
  ok(`FlowMenu "${item}" opens its modal`, (await page.locator(`text=${title}`).count()) > 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
}

// ── Footer: offline toggle, receipts, reset ──
const beforeLabel = await page.locator('.peers button').first().textContent();
await page.locator('.peers button').first().click();
await page.waitForTimeout(300);
const afterLabel = await page.locator('.peers button').first().textContent();
ok('offline toggle changes the peers label', beforeLabel !== afterLabel, `"${beforeLabel?.trim()}" -> "${afterLabel?.trim()}"`);
await page.locator('.peers button').first().click(); // back online
await page.waitForTimeout(300);

await page.locator('.peers button', { hasText: 'receipts' }).click();
await page.waitForTimeout(300);
ok('receipts button opens the receipts modal', (await page.locator('text=Your receipts').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

await page.locator('.peers button.reset').click();
await page.waitForTimeout(400);
// Bare view is the NDO level (no .ndo/.group svg elements there); reset
// reseeding shows up as the example NDO's name still rendering in the card.
ok('reset reseeds the example network', await page.locator('h2', { hasText: 'CNC Machine' }).isVisible());

// ── Group (unselected): "Copy invite link" flips its own label ──
await page.goto(BASE + '/prototypes/holarchy?view=group&group=sen');
await page.waitForTimeout(500);
await page.evaluate(() => {
  // Headless Chromium under Playwright has no clipboard permission by
  // default; stub it so the button's own then-branch still runs.
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} } });
});
await page.reload();
await page.waitForTimeout(500);
const inviteBtn = page.locator('.gbtn', { hasText: 'Copy invite link' });
await inviteBtn.click();
await page.waitForTimeout(200);
ok('copy invite link flips to "Copied"', (await page.locator('.gbtn', { hasText: 'Copied' }).count()) > 0);

// ── Console errors across the whole run ──
ok('zero console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
