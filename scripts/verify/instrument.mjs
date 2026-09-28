// Functional smoke test for the C Instrument direction's controls: every
// button that isn't already covered by a compare-prototypes pair (which
// screenshots layout/colour, not effect). Exercises each control and asserts
// the resulting state (a modal title, a store change, a URL change).
//
// Run: bun scripts/verify/instrument.mjs
// Requires the dev server up on http://localhost:5180 (bun run dev).
import { chromium } from 'playwright-core';

const BASE = process.env.DS_URL ?? 'http://localhost:5180';
const results = [];

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? '  ' + detail : ''}`);
}

async function modalTitle(page) {
  const el = await page.locator('[role="dialog"] h2').first();
  return (await el.count()) ? (await el.textContent())?.trim() : null;
}

async function closeModal(page) {
  const closeBtn = page.locator('[role="dialog"] button[aria-label="Close"]');
  if (await closeBtn.count()) await closeBtn.click();
  await page.locator('[role="dialog"]').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(150);
}

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/prototypes/instrument?fresh=0&example=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Reload the example cleanly (deterministic seed state) before testing.
  await page.evaluate(() => localStorage.removeItem('ndo-proto-shared-v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Profile avatar → ProfileModal
  await page.locator('button[title="Your profile"]').click();
  check('profile avatar opens ProfileModal', (await modalTitle(page)) === 'Your profile');
  await closeModal(page);

  // 2. NDO tab selects the resource (spec sheet h1 changes)
  const h1Before = await page.locator('h1').first().textContent();
  await page.locator('.tab', { hasText: 'Environmental Sensor' }).first().click();
  await page.waitForTimeout(200);
  const h1After = await page.locator('h1').first().textContent();
  check('NDO tab switches the bench', h1After !== h1Before && h1After.includes('Environmental Sensor'), `"${h1Before}" -> "${h1After}"`);
  const url = page.url();
  check('NDO tab updates the URL (?ndo=)', url.includes('ndo=sns'), url);

  // 3. + new tab → CreateNdoModal
  await page.locator('.tab', { hasText: '+ new' }).click();
  check('+ new opens CreateNdoModal', (await modalTitle(page)) === 'Add a shared resource');
  await closeModal(page);

  // 4. browse N tab → BrowseModal
  await page.locator('.tab', { hasText: 'browse' }).click();
  check('browse opens BrowseModal', (await modalTitle(page)) === 'Find resources');
  await closeModal(page);

  // 5. node online/offline toggle
  const before = await page.locator('.stat b').first().textContent();
  await page.locator('button[title="Go online or offline"]').click();
  await page.waitForTimeout(150);
  const after = await page.locator('.stat b').first().textContent();
  check('node toggle flips online/offline', before.includes('online') && after.includes('offline'), `"${before}" -> "${after}"`);
  await page.locator('button[title="Go online or offline"]').click(); // back online
  await page.waitForTimeout(150);

  // 6. receipts stat → ReceiptsModal
  await page.locator('button[title="Your private receipts"]').click();
  check('receipts stat opens ReceiptsModal', (await modalTitle(page)) === 'Your receipts');
  await closeModal(page);

  // 7. reset
  // (destructive on shared localStorage state; run last of the top-bar checks)

  // Go back to the CNC machine for the spec-sheet checks.
  await page.locator('.tab', { hasText: 'CNC Machine' }).first().click();
  await page.waitForTimeout(200);

  // 8. "change" (stage) → AdvanceModal
  await page.locator('.lnk', { hasText: 'change' }).click();
  check('stage "change" opens AdvanceModal', (await modalTitle(page)) === 'Change stage');
  await closeModal(page);

  // 9. "+ add rule" → RuleModal
  await page.locator('.lnk', { hasText: '+ add rule' }).click();
  check('"+ add rule" opens RuleModal', (await modalTitle(page)) === 'Add a rule');
  await closeModal(page);

  // 10. "who holds them" → ResourcesModal
  await page.locator('.lnk', { hasText: 'who holds them' }).click();
  check('"who holds them" opens ResourcesModal', (await modalTitle(page)) === 'Items and who holds them');
  await closeModal(page);

  // 11. "why?" → WhyModal
  const whyLink = page.locator('.lnk', { hasText: 'why?' }).first();
  if (await whyLink.count()) {
    await whyLink.click();
    check('"why?" opens WhyModal', (await modalTitle(page)) === 'Why am I seeing this?');
    await closeModal(page);
  } else {
    check('"why?" opens WhyModal', false, 'no signal present to test against');
  }

  // 12. signal verb button → pickUp (Approve on sol's validate signal)
  const approveBtn = page.locator('.sg button', { hasText: 'Approve' }).first();
  if (await approveBtn.count()) {
    const sigCountBefore = await page.locator('p.lbl', { hasText: 'Needs attention' }).textContent();
    await approveBtn.click();
    await page.waitForTimeout(200);
    const sigCountAfter = await page.locator('p.lbl', { hasText: 'Needs attention' }).textContent();
    check('signal verb button runs pickUp (count changes)', sigCountBefore !== sigCountAfter, `"${sigCountBefore}" -> "${sigCountAfter}"`);
  } else {
    check('signal verb button runs pickUp', false, 'no approvable signal present to test against');
  }

  // 13. "Mark done" → CommitmentsModal
  const markDone = page.locator('.sg button', { hasText: 'Mark done' }).first();
  if (await markDone.count()) {
    await markDone.click();
    check('"Mark done" opens CommitmentsModal', (await modalTitle(page)) === 'Requests');
    await closeModal(page);
  } else {
    check('"Mark done" opens CommitmentsModal', false, 'no open request present to test against');
  }

  // 14. "Ask to borrow" → CommitModal
  await page.locator('button', { hasText: 'Ask to borrow' }).click();
  check('"Ask to borrow" opens CommitModal', (await modalTitle(page)) === 'Ask to borrow or receive');
  await closeModal(page);

  // 15. "Log work" → NoteModal
  await page.locator('button', { hasText: 'Log work' }).click();
  check('"Log work" opens NoteModal', (await modalTitle(page)) === 'Log work');
  await closeModal(page);

  // 16. "+ Link resource" → AttachModal
  await page.locator('button', { hasText: '+ Link resource' }).click();
  check('"+ Link resource" opens AttachModal', (await modalTitle(page)) === 'Link to another resource');
  await closeModal(page);

  // 17. "+ Rule" (bench header) → RuleModal
  await page.locator('.bench button', { hasText: '+ Rule' }).click();
  check('bench "+ Rule" opens RuleModal', (await modalTitle(page)) === 'Add a rule');
  await closeModal(page);

  // 18. "+ Item" (bench header) → ResourcesModal
  await page.locator('.bench button', { hasText: '+ Item' }).click();
  check('bench "+ Item" opens ResourcesModal', (await modalTitle(page)) === 'Items and who holds them');
  await closeModal(page);

  // 19. socket click → popover
  const socketCount = await page.locator('.socket').count();
  console.log('  (debug) .socket count on page:', socketCount);
  await page.locator('.socket', { hasText: 'Hand-over condit' }).first().click({ timeout: 8000 });
  check('socket click opens the popover', (await page.locator('.pop').count()) === 1);

  // 20. popover "close" → clears the popover
  await page.locator('.pop button', { hasText: 'close' }).click();
  await page.waitForTimeout(150);
  check('popover "close" clears the popover', (await page.locator('.pop').count()) === 0);

  // 21. open socket click → AttachModal
  const openSocket = page.locator('.socket--open');
  if (await openSocket.count()) {
    await openSocket.click();
    check('open socket opens AttachModal', (await modalTitle(page)) === 'Link to another resource');
    await closeModal(page);
  } else {
    check('open socket opens AttachModal', false, 'no open socket present (11+ attachments)');
  }

  // 22. reset (destructive, run last)
  await page.on('dialog', (d) => d.accept());
  await page.locator('button', { hasText: 'reset' }).click();
  await page.waitForTimeout(300);
  check('reset reloads the example', page.url().includes('/prototypes/instrument'));

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} controls verified.`);
  process.exit(failed.length ? 1 : 0);
}

await main();
