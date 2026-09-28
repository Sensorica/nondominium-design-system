// Fails when a class name in the prototype directions, the shared prototype UI
// or the Claude Design cards is also a UnoCSS utility.
//
// UnoCSS scans every Svelte file for class-shaped tokens and emits a rule for
// any that matches a utility, whatever the author meant. A scoped `.h3` in
// Field Notes became `.h3 { height: 0.75rem }`, a 12px box no line-height could
// change, and moved every row below it by 6px; `me`, `grow`, `grid`, `static`,
// `ring` and `outline` were live the same way (ISA Phase 9). The ports mirror
// hand-written CSS from the originals, so their class names must never be
// utility names.

import { Glob } from 'bun';
import { createGenerator } from 'unocss';
import config from '../uno.config';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN = 'src/lib/{prototypes,guidelines}/**/*.svelte';

/** Names that match a utility on purpose or harmlessly. Each needs its reason. */
const ALLOWED: Record<string, string> = {
  tab: 'emits only tab-size, which affects nothing but literal tab characters, and none are rendered'
};

const uses = new Map<string, Set<string>>();
const add = (token: string, file: string) => {
  if (!uses.has(token)) uses.set(token, new Set());
  uses.get(token)!.add(file);
};

for await (const file of new Glob(SCAN).scan(ROOT)) {
  const src = await Bun.file(ROOT + file).text();
  for (const m of src.matchAll(/class="([^"]*)"/g)) {
    for (const token of m[1].replace(/\{[^}]*\}/g, ' ').split(/\s+/)) if (token) add(token, file);
  }
  for (const m of src.matchAll(/class:([\w-]+)/g)) add(m[1], file);
}

const uno = await createGenerator(config);
const { matched } = await uno.generate(new Set(uses.keys()), { preflights: false });
const collisions = [...matched].filter((t) => !(t in ALLOWED)).sort();

if (collisions.length) {
  console.error('check:uno failed: these class names are UnoCSS utilities and get styled behind the component\'s back:');
  for (const t of collisions) console.error(`  ${t}  in ${[...uses.get(t)!].join(', ')}`);
  console.error('Rename them (the ports use a k- prefix), or add a reasoned entry to ALLOWED.');
  process.exit(1);
}
console.log(`check:uno passed: ${uses.size} class names in ${SCAN}, none styled by UnoCSS (allowed: ${Object.keys(ALLOWED).join(', ')}).`);
