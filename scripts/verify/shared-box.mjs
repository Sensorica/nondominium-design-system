// Measures the box model of every shared prototype modal (src/lib/prototypes/ui/**)
// against its Claude Design original (docs/prototypes/original/prototypes/ui.jsx),
// through the mycelium direction (the only shared-owning direction whose rail
// reaches every ModalHost type — see scripts/compare/pairs/shared.ts's note on
// field-notes not mounting <FlowMenu/>).
//
// For each modal: opens both sides, finds the modal panel (the fixed, z-index:50
// overlay's first child — true on both the plain-JSX original and the Svelte
// port's Modal.svelte), and compares
//   1. the panel's getBoundingClientRect().height
//   2. the top (relative to the panel) of every <label> element inside it, in
//      DOM order — each PField/Field.svelte renders one, so index i on one side
//      is the same field as index i on the other, even where the copy differs
//      (deliberate plain-language translation, out of scope here).
//
// Run: bun scripts/verify/shared-box.mjs
// Env: ORIG_PORT (default 8795), DS_URL (default http://localhost:5180)

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const ROOT = resolve(import.meta.dir, '../..');
const ORIGINALS = join(ROOT, 'docs/prototypes/original');
const ORIG_PORT = Number(process.env.ORIG_PORT ?? 8795);
const DS_URL = process.env.DS_URL ?? 'http://localhost:5180';
const CHROME = existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const VIEWPORT = { width: 1440, height: 900 };
const TOLERANCE = 2; // px

const MYCELIUM_ORIGINAL = 'A%20Mycelium.html';
const MYCELIUM_PORT = '/prototypes/mycelium';

const modals = [
  { name: 'create', steps: [{ click: 'text=+ Declare NDO' }] },
  { name: 'advance', steps: [{ click: 'button:has-text("Lifecycle")' }] },
  { name: 'resources', steps: [{ click: 'button:has-text("Items & holders")' }] },
  { name: 'rule', steps: [{ click: 'button:has-text("+ Rule")' }] },
  { name: 'commitments', steps: [{ click: 'button:has-text("Requests")' }] },
  { name: 'note', steps: [{ click: 'button:has-text("Log work")' }] },
  { name: 'attach', steps: [{ click: 'text=+ link resource' }] },
  { name: 'group', steps: [{ click: '.top >> text=+ Group' }] },
  { name: 'join', steps: [{ click: '.top >> text=→ Join' }] },
  { name: 'commit', steps: [{ click: 'text=Menu' }, { click: 'text=Ask to borrow or receive' }] },
  { name: 'browse', steps: [{ click: 'text=Menu' }, { click: 'text=Find resources' }] },
  { name: 'receipts', steps: [{ click: 'text=Menu' }, { click: 'text=Your receipts' }] },
  { name: 'profile', steps: [{ click: 'text=Menu' }, { click: 'text=Your profile' }] },
  { name: 'help', steps: [{ click: 'text=Menu' }, { click: 'text=How this works' }] },
  { name: 'why', steps: [{ click: 'text=why am I seeing this?' }] }
];

function serveOriginals() {
  return Bun.serve({
    port: ORIG_PORT,
    async fetch(req) {
      const path = decodeURIComponent(new URL(req.url).pathname);
      const file = Bun.file(join(ORIGINALS, path.endsWith('/') ? path + 'index.html' : path));
      return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
    }
  });
}

async function runSteps(page, steps) {
  for (const step of steps) {
    if (step.click) await page.locator(step.click).first().click();
    await page.waitForTimeout(250);
  }
}

async function measure(browser, url, steps) {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(500);
  await runSteps(page, steps);
  await page.waitForTimeout(400);

  const result = await page.evaluate(() => {
    const overlays = [...document.querySelectorAll('div')].filter((d) => {
      const cs = getComputedStyle(d);
      return cs.position === 'fixed' && cs.zIndex === '50';
    });
    const overlay = overlays[overlays.length - 1];
    const panel = overlay && overlay.firstElementChild;
    if (!panel) return null;
    const pr = panel.getBoundingClientRect();
    const labels = [...panel.querySelectorAll('label')].map((l) => {
      const r = l.getBoundingClientRect();
      return { top: Math.round((r.top - pr.top) * 100) / 100, height: Math.round(r.height * 100) / 100, text: l.textContent.trim().slice(0, 40) };
    });
    return { height: Math.round(pr.height * 100) / 100, width: Math.round(pr.width * 100) / 100, labels };
  });

  await context.close();
  return result;
}

async function main() {
  const server = serveOriginals();
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });

  const report = [];
  let failures = 0;

  for (const modal of modals) {
    const origUrl = `http://localhost:${ORIG_PORT}/prototypes/${MYCELIUM_ORIGINAL}`;
    const portUrl = `${DS_URL}${MYCELIUM_PORT}`;
    let orig, port;
    try {
      orig = await measure(browser, origUrl, modal.steps);
      port = await measure(browser, portUrl, modal.steps);
    } catch (err) {
      report.push({ name: modal.name, error: String(err) });
      failures++;
      continue;
    }

    if (!orig || !port) {
      report.push({ name: modal.name, error: `panel not found (orig=${!!orig} port=${!!port})` });
      failures++;
      continue;
    }

    const heightDelta = Math.round((port.height - orig.height) * 100) / 100;
    const heightOk = Math.abs(heightDelta) <= TOLERANCE;
    const labelDeltas = orig.labels.map((o, i) => {
      const p = port.labels[i];
      const delta = p ? Math.round((p.top - o.top) * 100) / 100 : null;
      return { index: i, origText: o.text, portText: p ? p.text : null, origTop: o.top, portTop: p ? p.top : null, delta, ok: delta !== null && Math.abs(delta) <= TOLERANCE };
    });
    const labelsOk = labelDeltas.every((l) => l.ok) && orig.labels.length === port.labels.length;

    if (!heightOk || !labelsOk) failures++;

    report.push({
      name: modal.name,
      panel: { origHeight: orig.height, portHeight: port.height, delta: heightDelta, ok: heightOk },
      labelCountOrig: orig.labels.length,
      labelCountPort: port.labels.length,
      labels: labelDeltas,
      ok: heightOk && labelsOk
    });
  }

  await browser.close();
  server.stop();

  console.log('\n=== Shared prototype box-model report (mycelium) ===\n');
  for (const r of report) {
    if (r.error) {
      console.log(`✗ ${r.name}: ERROR ${r.error}`);
      continue;
    }
    const mark = r.ok ? '✓' : '✗';
    console.log(`${mark} ${r.name}: panel height orig=${r.panel.origHeight}px port=${r.panel.portHeight}px delta=${r.panel.delta}px${r.panel.ok ? '' : '  ** OVER 2px **'}`);
    if (r.labelCountOrig !== r.labelCountPort) {
      console.log(`    label count mismatch: orig=${r.labelCountOrig} port=${r.labelCountPort}`);
    }
    for (const l of r.labels) {
      if (!l.ok) {
        console.log(`    ✗ label[${l.index}] "${l.origText}" -> "${l.portText}"  orig y=${l.origTop} port y=${l.portTop} delta=${l.delta}px`);
      }
    }
  }
  console.log(`\n${report.length - failures}/${report.length} modals within tolerance (${TOLERANCE}px)\n`);

  // Generated evidence, not source: stays under .local/ even though the script
  // itself now lives in the committed scripts/verify/.
  await Bun.write('.local/verify/shared-box-report.json', JSON.stringify(report, null, 2));

  if (failures > 0) process.exit(1);
}

main();
