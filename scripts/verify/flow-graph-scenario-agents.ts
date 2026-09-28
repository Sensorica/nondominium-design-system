// Text assertion for ISA Phase 9 finding 2: Panel.svelte's Guide agents line
// used to read `Object.values(CONDUCTORS)` with no reactive dependency, so
// Svelte 5 never re-ran it after backend.ts's `setConductors` repopulated the
// module object on a scenario switch. Switching to "science" or "art" kept
// showing the equipment scenario's own agents ("Sarah · Sensorica · Marco ·
// FabLab Montréal"). A compare pair's pixel ratio cannot catch one wrong line
// of text on a page this dense (scripts/compare/pairs/flow-graph.ts's
// scenario-science/scenario-art measure well under 1% either way), so this
// checks the actual rendered string on the port for both scenarios.
//
// Run: DS_URL=http://localhost:5180 bun scripts/verify/flow-graph-scenario-agents.ts
import { launch, freshPage, goto, PORT_BASE, assert, summarize } from './lib';

const URL = `${PORT_BASE}/prototypes/flow-graph`;
const AGENTS_LINE = '.stack .small';

async function agentsLineAfter(browser: import('playwright-core').Browser, scenarioText: string) {
  const { context, page } = await freshPage(browser);
  await goto(page, URL);
  await page.locator(`text=${scenarioText}`).first().click();
  await page.waitForTimeout(300);
  const text = await page.locator(AGENTS_LINE).first().textContent();
  await context.close();
  return (text ?? '').trim();
}

async function main() {
  const browser = await launch();
  let code = 1;
  try {
    const equipment = await agentsLineAfter(browser, 'Equipment sharing between two organisations');
    assert(
      'equipment scenario shows Sarah/Marco',
      equipment.includes('Sarah') && equipment.includes('Marco'),
      equipment
    );

    const science = await agentsLineAfter(browser, 'Open science: shared laboratory equipment');
    assert(
      'science scenario shows Chen Wei/Elena, not the stale equipment agents',
      science.includes('Chen Wei') && science.includes('Elena') && !science.includes('Sarah') && !science.includes('Marco'),
      science
    );

    const art = await agentsLineAfter(browser, 'ArtCoin: artwork circulating through venues');
    assert(
      'art scenario shows Maya/Jean-Pierre, not the stale equipment agents',
      art.includes('Maya') && art.includes('Jean-Pierre') && !art.includes('Sarah') && !art.includes('Marco'),
      art
    );
  } finally {
    code = summarize('flow-graph scenario agents line (ISA Phase 9 finding 2)');
    await browser.close();
  }
  process.exit(code);
}

await main();
