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
// NETWORK DEPENDENCY: the reference/original side is not hermetic. The
// original HTML files under docs/prototypes/original load real Google Fonts
// (fonts.googleapis.com/fonts.gstatic.com) and the React/ReactDOM/Babel
// standalone builds (unpkg.com) over the network at runtime — nothing in this
// repo serves or vendors them. A compare run therefore needs working internet
// access to the original side; offline or when either host is unreachable,
// the original frame renders in fallback fonts (or not at all), and a pair
// can fail or drift for a reason that has nothing to do with the port.
//
// This is the builders' iteration instrument. Appearance claims in the ISA still
// close on pixel frames from the real browser (ISA Phase 9, D10).

import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium, type Browser, type Page } from 'playwright-core';
import { DIRECTION_LIST } from '../src/lib/prototypes/directions';
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
  slug: string;
  ratio: number;
  threshold: number;
  pass: boolean;
  errors: string[];
  note?: string;
}

/**
 * Claim 37: a view registered in `src/lib/prototypes/directions.ts` must have
 * at least one pair that actually visits it, in every direction's own
 * `pairs/*.ts` file (each owned by that direction's builder, never this
 * script). A pair's `name` is not reliable ground truth here — the six
 * pairs/*.ts files pick their own names for the same view (`ndo`, `default`,
 * `bench`...) — so this checks the actual port URL instead, against the one
 * convention every one of those files already follows: a direction's FIRST
 * view is reached at the bare port path (no `?view=` at all), and every other
 * view at `?view=<id>` (optionally followed by more query params). That is
 * the same URL shape `paths.ts` and each direction's own route produce, so a
 * missing or renamed view shows up here as a real hole, not a naming quibble.
 */
function missingViewCoverage(pairs: readonly Pair[]): string[] {
  const missing: string[] = [];
  for (const direction of DIRECTION_LIST) {
    const slugPairs = pairs.filter((p) => p.slug === direction.slug);
    direction.views.forEach((view, i) => {
      const covered =
        i === 0
          ? slugPairs.some((p) => !/[?&]view=/.test(p.port.path))
          : slugPairs.some((p) => new RegExp(`[?&]view=${view.id}(&|$)`).test(p.port.path));
      if (!covered) missing.push(`${direction.slug}:${view.id} ("${view.label}")`);
    });
  }
  return missing;
}

async function main() {
  // Claim 37 holds against the whole registry, not just what this run was
  // filtered to, and needs no browser: fail fast, before anything is served
  // or launched.
  const missing = missingViewCoverage(PAIRS);
  if (missing.length) {
    console.error('compare:prototypes failed: these registered views have no pair at all:');
    for (const m of missing) console.error(`  ${m}`);
    console.error('Add a pair for each in that direction\'s own pairs/*.ts file.');
    process.exit(1);
  }

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
        results.push({
          id,
          slug: pair.slug,
          ratio: 1,
          threshold: 0,
          pass: false,
          errors: [`capture failed: ${e}`]
        });
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
      results.push({ id, slug: pair.slug, ratio, threshold, pass, errors, note: pair.note });
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

  // A filtered run (e.g. `compare:prototypes ds`) only ever sees a slice of
  // PAIRS. Overwriting the top-level report.json/report.md with just that
  // slice would erase every other slug's last-known results. Each run always
  // writes its own slice's per-slug report, `.local/compare/<slug>/report.json`
  // (every slug in `results` this run touched); the combined, top-level report
  // is only rewritten on an unfiltered run, where `results` really is
  // everything.
  const bySlug = new Map<string, Result[]>();
  for (const r of results) {
    if (!bySlug.has(r.slug)) bySlug.set(r.slug, []);
    bySlug.get(r.slug)!.push(r);
  }
  for (const [slug, slugResults] of bySlug) {
    writeFileSync(join(OUT, slug, 'report.json'), JSON.stringify(slugResults, null, 2));
  }

  if (!filters.length) {
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
  }

  const failed = results.filter((r) => !r.pass);
  const reportPath = filters.length
    ? `.local/compare/${[...bySlug.keys()].join(', ')}/report.json`
    : '.local/compare/report.md';
  console.log(`\n${results.length - failed.length}/${results.length} pairs within threshold. Report: ${reportPath}`);
  process.exit(failed.length ? 1 : 0);
}

await main();
