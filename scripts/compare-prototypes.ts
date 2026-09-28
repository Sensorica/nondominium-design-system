// Compares each prototype direction against the Claude Design original it was
// ported from, one (direction, view) pair at a time, in a headless browser.
//
//   bun run compare:prototypes                  every pair
//   bun run compare:prototypes field-notes      one direction
//   bun run compare:prototypes field-notes:trail  one pair
//
// For every pair it writes `<name>.orig.png`, `<name>.port.png`, `<name>.diff.png`
// and `<name>.side.png` (all three side by side) under `.local/compare/<slug>/`,
// then a report at `.local/compare/report.md`. It exits non-zero when any pair's
// mismatch ratio is above its threshold, or when the port logs a console error.
//
// The originals are served from `docs/prototypes/original/` on ORIG_PORT. The
// port is read from DS_URL (default http://localhost:5180, a `bun run dev`
// server); when nothing answers there, a dev server is started for the run.
//
// This is the builders' iteration instrument. Appearance claims in the ISA still
// close on pixel frames from the real browser (ISA Phase 9, D10).

import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium, type Browser, type Page } from 'playwright-core';
import { PAIRS, type Pair, type Side, type Step } from './compare/pairs';

const ROOT = resolve(import.meta.dir, '..');
const ORIGINALS = join(ROOT, 'docs/prototypes/original');
const OUT = join(ROOT, '.local/compare');
const ORIG_PORT = Number(process.env.ORIG_PORT ?? 8791);
const VIEWPORT = { width: 1440, height: 900 };
const DEFAULT_THRESHOLD = 0.01;

/** Prototype-only chrome the port adds over the original (ISA claim 41). It is
 *  hidden before the port frame is taken so it never counts as a difference. */
const PORT_CHROME = ['.exit', 'button.fab'];

/** Freeze motion, not layout: every animation and transition jumps to its end
 *  state, so both frames show where things settle rather than a random phase. */
const STILL_CSS =
  '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important}';

/** Both sides get the same seeded Math.random, so layouts that scatter from it
 *  start from the same numbers. */
const SEEDED_RANDOM = `(() => { let s = 0x2f6b; Math.random = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; })();`;

function browserPath(): string {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/brave-browser'
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error('No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.');
  return found;
}

function serveOriginals() {
  return Bun.serve({
    port: ORIG_PORT,
    async fetch(req) {
      const path = decodeURIComponent(new URL(req.url).pathname);
      const file = Bun.file(join(ORIGINALS, path.endsWith('/') ? path + 'index.html' : path));
      return (await file.exists())
        ? new Response(file)
        : new Response('not found', { status: 404 });
    }
  });
}

async function reachable(url: string): Promise<boolean> {
  try {
    return (await fetch(url)).status < 500;
  } catch {
    return false;
  }
}

async function ensurePort(): Promise<{ base: string; child?: ChildProcess }> {
  const base = process.env.DS_URL ?? 'http://localhost:5180';
  if (await reachable(base)) return { base };
  const port = 5199;
  const child = spawn('bunx', ['vite', 'dev', '--port', String(port), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
    env: { ...process.env, DEV: 'true' }
  });
  const started = `http://localhost:${port}`;
  for (let i = 0; i < 60; i++) {
    if (await reachable(started)) return { base: started, child };
    await Bun.sleep(500);
  }
  child.kill();
  throw new Error(`No design-system server at ${base}, and one started on ${port} never answered.`);
}

async function runSteps(page: Page, steps: readonly Step[] = []) {
  for (const step of steps) {
    if ('click' in step) await page.locator(step.click).first().click();
    else if ('dblclick' in step) await page.locator(step.dblclick).first().dblclick();
    else if ('hover' in step) await page.locator(step.hover).first().hover();
    else if ('fill' in step) await page.locator(step.fill[0]).first().fill(step.fill[1]);
    else if ('press' in step) await page.keyboard.press(step.press);
    else if ('wheel' in step) await page.mouse.wheel(0, step.wheel);
    else if ('wait' in step) await page.waitForTimeout(step.wait);
    else if ('eval' in step) await page.evaluate(step.eval);
    await page.waitForTimeout(250);
  }
}

async function frame(
  browser: Browser,
  url: string,
  side: Side,
  hide: readonly string[]
): Promise<{ png: PNG; errors: string[] }> {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  await context.addInitScript(SEEDED_RANDOM);
  if (side.storage) {
    await context.addInitScript(
      `(() => { const s = ${JSON.stringify(side.storage)}; for (const k in s) localStorage.setItem(k, s[k]); })();`
    );
  }
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.addStyleTag({ content: STILL_CSS });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(side.settle ?? 800);
  await runSteps(page, side.steps);
  const hidden = [...hide, ...(side.mask ?? [])];
  if (hidden.length)
    await page.addStyleTag({ content: `${hidden.join(',')}{visibility:hidden!important}` });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const png = PNG.sync.read(await page.screenshot({ type: 'png' }));
  await context.close();
  return { png, errors };
}

function sideBySide(images: PNG[]): PNG {
  const { width, height } = images[0];
  const out = new PNG({ width: width * images.length, height });
  images.forEach((img, i) => PNG.bitblt(img, out, 0, 0, width, height, i * width, 0));
  return out;
}

interface Result {
  id: string;
  ratio: number;
  threshold: number;
  pass: boolean;
  errors: string[];
  note?: string;
}

async function main() {
  const filters = process.argv.slice(2);
  const pairs = PAIRS.filter(
    (p) => !filters.length || filters.some((f) => f === p.slug || f === `${p.slug}:${p.name}`)
  );
  if (!pairs.length) throw new Error(`No pair matches ${filters.join(', ')}.`);

  const originals = serveOriginals();
  const { base, child } = await ensurePort();
  const browser = await chromium.launch({ executablePath: browserPath(), headless: true });
  const results: Result[] = [];

  try {
    for (const pair of pairs) {
      const id = `${pair.slug}:${pair.name}`;
      const dir = join(OUT, pair.slug);
      mkdirSync(dir, { recursive: true });
      const origUrl = `http://localhost:${ORIG_PORT}/prototypes/${pair.original.path}`;
      const portUrl = `${base}${pair.port.path}`;
      let orig: PNG, port: PNG, errors: string[];
      try {
        orig = (await frame(browser, origUrl, pair.original, [])).png;
        ({ png: port, errors } = await frame(browser, portUrl, pair.port, PORT_CHROME));
      } catch (e) {
        results.push({ id, ratio: 1, threshold: 0, pass: false, errors: [`capture failed: ${e}`] });
        console.log(`✗ ${id}  capture failed: ${e}`);
        continue;
      }
      const { width, height } = VIEWPORT;
      const diff = new PNG({ width, height });
      const changed = pixelmatch(orig.data, port.data, diff.data, width, height, {
        threshold: 0.03
      });
      const ratio = changed / (width * height);
      const threshold = pair.threshold ?? DEFAULT_THRESHOLD;
      const pass = ratio <= threshold && errors.length === 0;
      for (const [suffix, img] of [
        ['orig', orig],
        ['port', port],
        ['diff', diff],
        ['side', sideBySide([orig, port, diff])]
      ] as const) {
        writeFileSync(join(dir, `${pair.name}.${suffix}.png`), PNG.sync.write(img));
      }
      results.push({ id, ratio, threshold, pass, errors, note: pair.note });
      console.log(
        `${pass ? '✓' : '✗'} ${id}  ${(ratio * 100).toFixed(2)}% (max ${(threshold * 100).toFixed(1)}%)` +
          (errors.length ? `  ${errors.length} console error(s)` : '')
      );
    }
  } finally {
    await browser.close();
    originals.stop(true);
    child?.kill();
  }

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'report.json'), JSON.stringify(results, null, 2));
  const rows = results.map(
    (r) =>
      `| ${r.pass ? '✓' : '✗'} | \`${r.id}\` | ${(r.ratio * 100).toFixed(2)}% | ${(r.threshold * 100).toFixed(1)}% | ${r.errors.length ? r.errors.map((e) => e.replaceAll('|', '/')).join('<br>') : ''} | ${r.note ?? ''} |`
  );
  writeFileSync(
    join(OUT, 'report.md'),
    [
      '| | Pair | Mismatch | Max | Port console errors | Why the max is not the default |',
      '|---|---|---|---|---|---|',
      ...rows
    ].join('\n') + '\n'
  );
  const failed = results.filter((r) => !r.pass);
  console.log(
    `\n${results.length - failed.length}/${results.length} pairs within threshold. Report: .local/compare/report.md`
  );
  process.exit(failed.length ? 1 : 0);
}

await main();
