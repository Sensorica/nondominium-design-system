// D11 proof: for a pair whose measured mismatch sits above the 1% default,
// checks that the same texts sit within 1px on both sides via boundingBox().
// Run: bun scripts/verify/bbox-proof.ts
import { launch, freshPage, goto, ORIG_BASE, PORT_BASE } from './lib';

interface Scene {
  label: string;
  origUrl: string;
  origSteps: string[];
  portUrl: string;
  portSteps: string[];
  texts: string[];
}

const scenes: Scene[] = [
  {
    label: 'field-notes:rules heading',
    origUrl: `${ORIG_BASE}/B%20Field%20Notes.html`,
    origSteps: ['text=Rules & items'],
    portUrl: `${PORT_BASE}/prototypes/field-notes?view=rules`,
    portSteps: [],
    texts: ['text=CNC Machine · Proxxon MF70', 'text=Rules in force', 'text=Usage limit']
  },
  {
    label: 'field-notes:modal-rule fields',
    origUrl: `${ORIG_BASE}/B%20Field%20Notes.html`,
    origSteps: ['text=Rules & items', 'text=Add a rule'],
    portUrl: `${PORT_BASE}/prototypes/field-notes?view=rules`,
    portSteps: ['text=Add a rule'],
    texts: ['text=Add a rule', 'text=RuleData', 'text=required_role']
  },
  {
    label: 'field-notes:modal-resources fields',
    origUrl: `${ORIG_BASE}/B%20Field%20Notes.html`,
    origSteps: ['text=Rules & items', 'text=Items & holders'],
    portUrl: `${PORT_BASE}/prototypes/field-notes?view=rules`,
    portSteps: ['text=Items & holders'],
    texts: ['text=Items and who holds them', 'text=New resource']
  },
  {
    label: 'mycelium:modal-browse fields',
    origUrl: `${ORIG_BASE}/A%20Mycelium.html`,
    origSteps: ['text=Menu', 'text=Find resources'],
    portUrl: `${PORT_BASE}/prototypes/mycelium`,
    portSteps: ['text=Menu', 'text=Find resources']
  }
];

async function measure(browser: import('playwright-core').Browser, url: string, steps: string[], texts: string[]) {
  const { context, page } = await freshPage(browser);
  await goto(page, url);
  for (const s of steps) {
    await page.locator(s).first().click();
    await page.waitForTimeout(250);
  }
  const boxes: Record<string, { x: number; y: number; w: number; h: number } | null> = {};
  for (const t of texts) {
    const loc = page.locator(t).first();
    const box = await loc.boundingBox().catch(() => null);
    boxes[t] = box ? { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) } : null;
  }
  await context.close();
  return boxes;
}

async function main() {
  const browser = await launch();
  let allOk = true;
  try {
    for (const scene of scenes) {
      if (!scene.texts?.length) continue;
      const orig = await measure(browser, scene.origUrl, scene.origSteps, scene.texts);
      const port = await measure(browser, scene.portUrl, scene.portSteps, scene.texts);
      console.log(`\n${scene.label}`);
      for (const t of scene.texts) {
        const o = orig[t];
        const p = port[t];
        if (!o || !p) {
          console.log(`  ? ${t}  orig=${JSON.stringify(o)} port=${JSON.stringify(p)}  (locator missed on one side)`);
          continue;
        }
        const dx = Math.abs(o.x - p.x);
        const dy = Math.abs(o.y - p.y);
        const dw = Math.abs(o.w - p.w);
        const ok = dx <= 1 && dy <= 1 && dw <= 1;
        allOk = allOk && ok;
        console.log(
          `  ${ok ? '✓' : '✗'} ${t}  orig(${o.x},${o.y},${o.w}x${o.h}) port(${p.x},${p.y},${p.w}x${p.h})  dx=${dx} dy=${dy} dw=${dw}`
        );
      }
    }
  } finally {
    await browser.close();
  }
  console.log(allOk ? '\nAll measured texts within 1px on both sides.' : '\nSome texts moved more than 1px — investigate before raising a threshold.');
  process.exit(allOk ? 0 : 1);
}

await main();
