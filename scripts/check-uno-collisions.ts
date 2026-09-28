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
//
// The generator runs on each file's WHOLE SOURCE TEXT (script and markup),
// exactly as the UnoCSS Vite plugin does when it transforms a module:
// `generate()` given a string runs it through `applyExtractors`, UnoCSS's own
// class-shaped-token scanner, which is not limited to `class="..."`
// attributes. It also catches a class name assembled in a `<script>` string
// (`const cls = 'g grid'`) or hidden in a template expression
// (`class={cond ? 'h3' : 'x'}`), because that is exactly what the real Vite
// plugin sees and styles behind the component's back at dev/build time. The
// previous version of this script only grepped literal `class="..."`
// attributes and `class:name` directives, so a script-built class string
// could collide with a utility and this check would stay green while the
// running app broke.
//
// The one exclusion is each file's own `<style>` block. The Vite plugin's
// default extractor (`extractorSplit`) really does split that text too, so
// property keywords and values (`display: block`, `border: 1px solid`,
// `text-decoration: underline`) come back as "matched" — UnoCSS cannot tell a
// CSS declaration from a class name, so it happily emits a global `.border`
// or `.block` utility rule nobody asked for. That is real, harmless bloat in
// the generated stylesheet, not the failure mode this check guards: those
// tokens are never themselves rendered as a class on an element, so they
// cannot silently restyle one. Scanning `<style>` text here would drown every
// real collision in hundreds of CSS-vocabulary false positives (confirmed:
// this scan flagged `border`, `block`, `absolute`, `underline`, `table` and
// more, none of them an actual class in any of these files). Stripping the
// block keeps the check reading script and markup exactly as the plugin's
// extractor tokenizes them, while not asking every hand-written CSS property
// to be spelled so it never resembles a utility.

import { Glob } from 'bun';
import { createGenerator } from 'unocss';
import config from '../uno.config';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN = 'src/lib/{prototypes,guidelines}/**/*.svelte';

/**
 * Names that match a utility on purpose or harmlessly. Each needs its reason.
 * Scanning script and markup whole (rather than only `class="..."` literals)
 * surfaces every one of these below as "matched": each is a real word in real
 * code or real rendered prose, verified against the file it comes from, and
 * never a `class` attribute value. That is exactly the design this list
 * exists for (see the header): UnoCSS's extractor cannot tell a JS
 * identifier, an HTML tag name, a component prop, a CSS-unit suffix or a
 * sentence of visible text from a class name, so this file is where a human
 * confirms which matches are real and which are not.
 */
const ALLOWED: Record<string, string> = {
  tab: 'emits only tab-size, which affects nothing but literal tab characters, and none are rendered',
  b: "a one-letter variable ([a, b, k] destructuring, a loop's `as b, i`, getBoundingClientRect()'s `b`, a conductor key literal 'b') and the literal <b> tag in ActivityScope.svelte; never a class",
  me: "a plain `const me = proto.me.id` variable (CommitModal.svelte); the component API name for the avatar ring is a separate token below, and its actual CSS class is the scoped `avatar--ring`, never bare",
  'm[t.ndo]': 'an object/Map index expression in FieldView.svelte prototype logic (`m` is a plain object, not a class), matched only because it looks like arbitrary-value bracket syntax',
  'min-w-0': "verbatim prose from the original's own layout-shell.html content (\"main · p-6 (24px) · min-w-0 · overflow auto\"), rendered as a text node in LayoutShell.svelte to describe the hApp's real Tailwind classes, never applied as a class here",
  'p-6': 'the same verbatim layout-shell prose as min-w-0 above',
  my: '"All my groups" is a component prop VALUE (a sentence) in signal-board/App.svelte, not a class',
  outline: '"Dashed outline = regime" is rendered prose in BrandLayers.svelte; the card\'s actual class is the scoped `k-outline`',
  pr: 'a plain `const pr = proto.s.profile` variable in ProfileModal.svelte',
  ps: 'a plain `const ps = Object.values(lay.pos)` variable in flow-graph/App.svelte',
  px: "the CSS unit suffix in a dynamic inline style (`style:width=\"{x}px\"`) across Card.svelte/Avatar.svelte/Modal.svelte/FlowMenu.svelte, and a `px: number` function parameter / `{ px: '2px' }` object key in Canvas.svelte and SpacingScale.svelte; never a class",
  py: 'a `py: number` function parameter in flow-graph/Canvas.svelte, same category as px above',
  ring: 'the Avatar/AgentAvatar component boolean prop (`ring?: boolean`, used as the Svelte shorthand attribute `ring`); its actual CSS class is the scoped `avatar--ring` in Avatar.svelte, never bare `ring`',
  visible: '"are visible to your groups" is a component prop VALUE (a sentence) in ProfileModal.svelte, not a class'
};

const uno = await createGenerator(config);

/**
 * Drop <style>...</style> blocks (see the header note), HTML comments, and
 * JS/TS comments in the <script> block. None of the three is ever rendered,
 * and this codebase's comments routinely quote real Tailwind/Uno class names
 * to describe what the shipped app or Claude Design actually does (e.g.
 * ColorsRegime.svelte's header names `border-dashed border-gray-400 ...
 * text-gray-700` as the app's own classes) — text that would otherwise flood
 * this check with matches for words nobody ever put in a `class` attribute
 * here. `<!-- -->` is Svelte's only comment delimiter across template and
 * script alike, unambiguous to strip. `/* *\/` block comments are equally
 * unambiguous. A `//` line comment is stripped only when it is NOT preceded
 * by `:`, so a `https://` or `http://` literal inside a string (this codebase
 * has several) survives intact instead of losing the rest of its line.
 */
const stripNonRendered = (src: string) =>
  src
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(?<!:)\/\/.*$/gm, '');

const uses = new Map<string, Set<string>>();
let fileCount = 0;

for await (const file of new Glob(SCAN).scan(ROOT)) {
  fileCount++;
  const src = await Bun.file(ROOT + file).text();
  const { matched } = await uno.generate(stripNonRendered(src), { preflights: false });
  for (const token of matched) {
    if (!uses.has(token)) uses.set(token, new Set());
    uses.get(token)!.add(file);
  }
}

/**
 * ALLOWED clears a token found in script text or prose, never one written as a
 * class. Tokens that appear in a class position (a `class="..."` attribute, a
 * string literal inside `class={...}`, or a `class:name` directive) are held
 * to the strict rule whatever ALLOWED says, so allowlisting the `me` variable
 * can never let a reintroduced `class="me"` pass. Only STRICT_ALLOWED clears a
 * class-position token.
 */
const STRICT_ALLOWED = new Set(['tab']);
const classTokens = new Map<string, Set<string>>();
for await (const file of new Glob(SCAN).scan(ROOT)) {
  const src = stripNonRendered(await Bun.file(ROOT + file).text());
  const found: string[] = [];
  for (const m of src.matchAll(/class="([^"]*)"/g)) {
    found.push(...m[1].replace(/\{[^}]*\}/g, ' ').split(/\s+/));
    for (const e of m[1].matchAll(/\{([^}]*)\}/g)) {
      for (const q of e[1].matchAll(/['`]([^'`]*)['`]/g)) found.push(...q[1].split(/\s+/));
    }
  }
  for (const m of src.matchAll(/class=\{([^}]*)\}/g)) {
    for (const s of m[1].matchAll(/['"`]([^'"`]*)['"`]/g)) found.push(...s[1].split(/\s+/));
  }
  for (const m of src.matchAll(/class:([\w-]+)/g)) found.push(m[1]);
  for (const t of found.filter(Boolean)) {
    if (!classTokens.has(t)) classTokens.set(t, new Set());
    classTokens.get(t)!.add(file);
  }
}
const { matched: classMatched } = await uno.generate(new Set(classTokens.keys()), { preflights: false });
const classCollisions = [...classMatched].filter((t) => !STRICT_ALLOWED.has(t));
for (const t of classCollisions) {
  if (!uses.has(t)) uses.set(t, new Set());
  for (const f of classTokens.get(t)!) uses.get(t)!.add(f);
}

const collisions = [...uses.keys()].filter((t) => classCollisions.includes(t) || !(t in ALLOWED)).sort();

if (collisions.length) {
  console.error('check:uno failed: these class names are UnoCSS utilities and get styled behind the component\'s back:');
  for (const t of collisions) console.error(`  ${t}  in ${[...uses.get(t)!].join(', ')}`);
  console.error('Rename them (the ports use a k- prefix), or add a reasoned entry to ALLOWED.');
  process.exit(1);
}
console.log(`check:uno passed: ${fileCount} files scanned whole under ${SCAN}, no class-shaped token styled by UnoCSS (allowed: ${Object.keys(ALLOWED).join(', ')}).`);
