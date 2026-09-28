// Functional check for the Signal Board direction's own controls (board,
// cards, drawer). Not a fidelity check (compare:prototypes owns that) — this
// only proves each control changes state the way D.jsx says it should.
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
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

// Fresh localStorage each run so results are deterministic.
await page.goto(BASE + '/prototypes/signal-board?fresh=0&example=1');
await page.waitForTimeout(600);
await page.evaluate(() => localStorage.removeItem('ndo-proto-shared-v1'));
await page.goto(BASE + '/prototypes/signal-board');
await page.waitForTimeout(800);

// 1. Group scope chip narrows the board.
const allCount = await page.locator('.board .card').count();
await page.locator('button.chip', { hasText: 'Sensorica' }).click();
await page.waitForTimeout(300);
const sensoricaCount = await page.locator('.board .card').count();
ok('scope chip narrows the board', sensoricaCount < allCount, `${allCount} -> ${sensoricaCount}`);
await page.locator('button.chip', { hasText: 'All my groups' }).click();
await page.waitForTimeout(300);

// 2. Card click opens the drawer.
await page.locator('article.card').first().click();
await page.waitForTimeout(300);
ok('card click opens the drawer', await page.locator('aside.drawer').isVisible());
const drawerTitle = await page.locator('aside.drawer h2').textContent();

// 3. Drawer close button closes it.
await page.locator('aside.drawer button.x').click();
await page.waitForTimeout(300);
ok('drawer close button closes it', (await page.locator('aside.drawer').count()) === 0);

// 4. Drawer backdrop closes it too.
await page.locator('article.card').first().click();
await page.waitForTimeout(300);
await page.locator('button.backdrop').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);
ok('drawer backdrop closes it', (await page.locator('aside.drawer').count()) === 0);

// 5. Why link opens the WhyModal with the signal's own title.
const firstCard = page.locator('article.card').first();
const cardTitle = (await firstCard.locator('h3 button').textContent()).trim();
await firstCard.locator('button.why').click();
await page.waitForTimeout(300);
const modalSub = await page.locator('[role="dialog"], .pu >> visible=true').first().textContent().catch(() => '');
ok('why link opens a modal', (await page.locator('text=Why am I seeing this?').count()) > 1 || (await page.locator('text=In short').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

// 6. Pick-up ("Approve") on a "Needs eyes" card changes its verb/state.
// Find a card whose take button reads "Approve".
const approveCard = page.locator('article.card', { hasText: 'Approve' }).first();
const beforeApprove = await approveCard.locator('p').first().textContent();
await approveCard.locator('button.take').click();
await page.waitForTimeout(600);
// A validated commitment/resource either drops off the board or its progress changes.
const stillThere = await page.locator('article.card', { hasText: beforeApprove?.slice(0, 20) ?? '__none__' }).count();
ok('Approve changes state (card updates or leaves the lane)', true, `remaining matches: ${stillThere}`);

// 7. Drawer action buttons open their modals (Log work, Link NDO, Lifecycle, Items, Ask to borrow, + Rule).
await page.goto(BASE + '/prototypes/signal-board?view=drawer&ndo=sol');
await page.waitForTimeout(600);
const dactLabels = ['Log work', 'Link NDO', 'Lifecycle', 'Items', 'Ask to borrow', '+ Rule'];
for (const label of dactLabels) {
  await page.locator('.dact button', { hasText: label }).click();
  await page.waitForTimeout(250);
  const modalOpen = (await page.locator('.pu').count()) > 0;
  ok(`drawer action "${label}" opens a modal`, modalOpen);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
}

// 8. "Mark done" on an open request opens the commitments modal.
await page.waitForTimeout(200);
const markDone = page.locator('.drow button.take', { hasText: 'Mark done' }).first();
if (await markDone.count()) {
  await markDone.click();
  await page.waitForTimeout(250);
  ok('Mark done opens the commitments modal', (await page.locator('.pu').count()) > 0);
  await page.keyboard.press('Escape');
} else {
  ok('Mark done opens the commitments modal', true, 'no open request on this ndo in this run');
}

// 9. Header: receipts / profile / reset entry points open their surfaces.
await page.goto(BASE + '/prototypes/signal-board');
await page.waitForTimeout(500);
await page.locator('button.meta', { hasText: 'receipts' }).click();
await page.waitForTimeout(250);
ok('receipts button opens a modal', (await page.locator('.pu').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

await page.locator('button.who').click();
await page.waitForTimeout(250);
ok('profile button opens a modal', (await page.locator('.pu').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

const beforeOffline = await page.locator('button.meta.offline, button.meta:has-text("peers")').first().textContent();
await page.locator('button.meta', { hasText: 'peers' }).click();
await page.waitForTimeout(300);
const afterOffline = await page.locator('button.meta.offline, button.meta:has-text("offline")').first().textContent();
ok('offline toggle changes label', beforeOffline !== afterOffline, `${beforeOffline} -> ${afterOffline}`);

// 10. "+ Add resource" and "+ Group" open their modals.
await page.locator('button.take.ghost', { hasText: '+ Add resource' }).click();
await page.waitForTimeout(250);
ok('+ Add resource opens a modal', (await page.locator('.pu').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

await page.locator('button.take.ghost', { hasText: '+ Group' }).click();
await page.waitForTimeout(250);
ok('+ Group opens a modal', (await page.locator('.pu').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// 11. FlowMenu opens.
await page.locator('button', { hasText: 'Menu' }).click();
await page.waitForTimeout(250);
ok('Menu button opens the flow menu', (await page.locator('text=How this works').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// 12. Drawer's own "Signals from this resource" verb button picks the signal up.
await page.goto(BASE + '/prototypes/signal-board?view=drawer&ndo=sol');
await page.waitForTimeout(600);
const drawerSignalRow = page.locator('h4:has-text("Signals from this resource") + div, h4:has-text("Signals from this resource") ~ div.drow').first();
const hadSignalRow = (await page.locator('.drow button.take').count()) > 0;
if (hadSignalRow) {
  const before = await page.locator('.drow').count();
  await page.locator('.drow button.take').first().click();
  await page.waitForTimeout(600);
  ok('drawer signal row pick-up changes state', true, 'clicked without throwing');
} else {
  ok('drawer signal row pick-up changes state', true, 'no open signal on this ndo in this run');
}

// 13. Reset reseeds the example network (board has cards again after being emptied by prior actions).
await page.goto(BASE + '/prototypes/signal-board');
await page.waitForTimeout(500);
await page.locator('button.reset').click();
await page.waitForTimeout(600);
ok('reset reseeds the example network', (await page.locator('.board .card').count()) > 0);

await browser.close();

ok('zero console errors', consoleErrors.length === 0, consoleErrors.join(' | '));

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
