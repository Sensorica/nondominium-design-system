// D11 proof for the D Signal Board header-gap fix (ISA Phase 9 finding 1):
// the port used to wrap "+ Add resource", "+ Group" and the FlowMenu button
// in a `.adds` div with an 8px gap; D Signal Board.html lays them out as
// direct header children under the header's own 16px gap ("+ Group" at
// x=751 vs the port's x=759, "Menu" at x=835 vs x=851, per the reviewer's
// reading). App.svelte now makes them direct header children again, with a
// `.first` class carrying the "+ Add resource" button's extra 12px
// marginLeft. This checks both later buttons land within 1px of the
// original on x.
//
// Run: ORIG_BASE=http://localhost:8783/prototypes DS_URL=http://localhost:5180 bun scripts/verify/signal-board-bbox.ts
import { launch, freshPage, goto, ORIG_BASE, PORT_BASE, assert, summarize } from './lib';

async function boxes(browser: import('playwright-core').Browser, url: string, texts: string[]) {
  const { context, page } = await freshPage(browser);
  await goto(page, url);
  const out: Record<string, { x: number; y: number; w: number; h: number } | null> = {};
  for (const t of texts) {
    const loc = page.locator(t).first();
    const box = await loc.boundingBox().catch(() => null);
    out[t] = box ? { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) } : null;
  }
  await context.close();
  return out;
}

async function main() {
  const texts = [
    'text=+ Group',
    'text=Menu',
    'text=+ Add resource',
    'text=Signals',
    'text=Needs hands',
    'text=Available now',
    'text=Needs eyes',
    'text=Just happened',
    'text=Hand over · Sensor batch · 12 units',
    'text=CEM-3000 is available'
  ];
  const browser = await launch();
  let code = 1;
  try {
    const orig = await boxes(browser, `${ORIG_BASE}/D%20Signal%20Board.html`, texts);
    const port = await boxes(browser, `${PORT_BASE}/prototypes/signal-board`, texts);
    for (const t of texts) {
      const o = orig[t];
      const p = port[t];
      if (!o || !p) {
        assert(t, false, `locator missed on one side: orig=${JSON.stringify(o)} port=${JSON.stringify(p)}`);
        continue;
      }
      const dx = Math.abs(o.x - p.x);
      assert(t, dx <= 1, `orig(${o.x},${o.y}) port(${p.x},${p.y}) dx=${dx}`);
    }
  } finally {
    code = summarize('signal-board header gap (ISA Phase 9 finding 1)');
    await browser.close();
  }
  process.exit(code);
}

await main();
