// Shared harness for the scripts/verify scripts (ISA Phase 9 claim 40, D11).
// Real Chrome via playwright-core, headless, a fresh context per scenario so
// no scenario can see another's storage or modal state.
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright-core';

export const CHROME_PATH = '/usr/bin/google-chrome';
export const ORIG_BASE = process.env.ORIG_BASE ?? 'http://localhost:8797/prototypes';
export const PORT_BASE = process.env.DS_URL ?? 'http://localhost:5180';

export async function launch(): Promise<Browser> {
  return chromium.launch({ executablePath: CHROME_PATH, headless: true });
}

export async function freshPage(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  return { context, page };
}

export async function goto(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

export interface Check {
  name: string;
  pass: boolean;
  detail: string;
}

let checks: Check[] = [];

export function assert(name: string, cond: boolean, detail: string) {
  checks.push({ name, pass: cond, detail });
  console.log(`${cond ? '✓' : '✗'} ${name}${detail ? '  ' + detail : ''}`);
}

export function summarize(label: string): number {
  const pass = checks.filter((c) => c.pass).length;
  const total = checks.length;
  console.log(`\n${label}: ${pass}/${total} checks passed.`);
  const failed = checks.filter((c) => !c.pass);
  if (failed.length) {
    console.log('Failed:');
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  }
  const code = failed.length ? 1 : 0;
  checks = [];
  return code;
}
