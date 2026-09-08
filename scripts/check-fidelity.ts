#!/usr/bin/env bun
/**
 * Replica fidelity check.
 *
 * The prototype under src/lib/replica is a copy of the Nondominium app's
 * components. Its whole value is that it renders what the app renders, which
 * decays silently the moment either side changes. This script compares every
 * replica component against its original and fails if the set of UnoCSS
 * utility classes they emit differs, or if the two trees hold different files.
 *
 * It deliberately does NOT require byte-identical markup: several components
 * have to differ in wiring, because this site deploys under a sub-path, the
 * prototype is mounted at /app, and modal and tab states are read from the
 * query string so a reviewer can link to them. Those are wiring differences.
 * A class difference is a visual difference, and that is the thing to catch.
 *
 *   bun run check:fidelity
 *   bun run check:fidelity -- --rev 20adb11
 *   bun run check:fidelity -- --app ../elsewhere/nondominium --rev origin/dev
 *   bun run check:fidelity -- --worktree      # read the checkout, unpinned
 *
 * Three defects in the previous version, all found on 2026-09-08 and all of the
 * same class: the instrument decided the result before the measurement.
 *
 * 1. It read the app's WORKING TREE, so it measured whatever that checkout
 *    happened to have checked out and pinned nothing. The local `dev` was seven
 *    days behind `origin/dev` and it printed green. A verdict without a commit
 *    id describes a state nobody can find, so this now reads blobs out of git at
 *    an explicit revision and prints the resolved commit in its header.
 * 2. Its file list was a hardcoded array of 24 names while the app had 26
 *    components, so `HolochainProvider.svelte` and `lobby/GroupSidebar.svelte`
 *    were invisible to it, and #132 then added four more it would never have
 *    seen either. The list is now derived from the app at the pinned revision,
 *    which makes the whole class of defect impossible rather than fixing the
 *    two instances of it.
 * 3. It compared only class tokens inside markup, so it printed `byte-identical`
 *    on files whose script blocks, and therefore whose behaviour, differed. That
 *    is how the replica silently lost GroupView's first-visit modal. Class drift
 *    is still the only failing condition, because wiring divergence is legitimate
 *    here, but the size of each script divergence is now reported so a reviewer
 *    can see which components carry behavioural difference and go read them.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const argv = process.argv;
const flag = (name: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i > -1 ? argv[i + 1] : undefined;
};
const has = (name: string): boolean => argv.includes(`--${name}`);

/** Path inside the app repo that holds the components this prototype mirrors. */
const COMPONENTS = 'ui/src/lib/components';

/**
 * Where the app repo lives. `--app` wins; otherwise walk up from the working
 * directory looking for a sibling `nondominium`, so the check works from a
 * normal checkout and from a git worktree (which sits two levels deeper).
 */
function findApp(): string {
  const given = flag('app');
  if (given) return resolve(given);
  let dir = resolve('.');
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, '..', 'nondominium');
    if (existsSync(join(candidate, COMPONENTS))) return resolve(candidate);
    dir = resolve(dir, '..');
  }
  return resolve('../nondominium');
}

const APP = findApp();
const DST = resolve('src/lib/replica');
const REV = flag('rev') ?? 'origin/dev';
const WORKTREE = has('worktree');

function git(...args: string[]): string {
  return execFileSync('git', ['-C', APP, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

if (!existsSync(join(APP, COMPONENTS))) {
  // Skip rather than fail: a contributor working only on the docs site should
  // not need the app checked out beside it. CI does check it out, so drift is
  // still caught on every push.
  console.warn(`SKIPPED — the app's components are not at ${join(APP, COMPONENTS)}.`);
  console.warn('Check out Sensorica/nondominium as a sibling, or pass --app <path-to-repo>.');
  process.exit(0);
}

/** The commit this run measured against, so the result is locatable. */
let resolvedRev = 'WORKING TREE (unpinned)';
if (!WORKTREE) {
  try {
    resolvedRev = git('rev-parse', REV).trim();
  } catch {
    console.error(`Cannot resolve --rev ${REV} in ${APP}.`);
    console.error('Fetch it first, or pass --worktree to measure the checkout instead.');
    process.exit(2);
  }
}

/** Read one app file, from git at the pinned revision or from the checkout. */
function appFile(file: string): string {
  const path = `${COMPONENTS}/${file}`;
  if (WORKTREE) return readFileSync(join(APP, path), 'utf8');
  return git('show', `${resolvedRev}:${path}`);
}

/**
 * Every component the app has at this revision. Derived, never hardcoded: a
 * list typed by hand is a list that stops matching the tree, silently, and
 * reports a green measured over the wrong set.
 */
function appComponents(): string[] {
  const raw = WORKTREE
    ? execFileSync('find', [join(APP, COMPONENTS), '-name', '*.svelte'], { encoding: 'utf8' })
        .split('\n')
        .map((p) => p.replace(join(APP, COMPONENTS) + '/', ''))
    : git('ls-tree', '-r', '--name-only', resolvedRev, '--', COMPONENTS)
        .split('\n')
        .map((p) => p.replace(`${COMPONENTS}/`, ''));
  return raw.filter((p) => p.endsWith('.svelte')).sort();
}

/** Everything after the script block: the part that renders. */
function markup(source: string): string {
  const i = source.indexOf('</script>');
  return (i >= 0 ? source.slice(i + '</script>'.length) : source).trim();
}

/** The script block: the part that behaves. Reported, never failed on. */
function script(source: string): string {
  const i = source.indexOf('</script>');
  return (i >= 0 ? source.slice(0, i) : '').trim();
}

const CLASS_RE = /class=(?:"([^"]*)"|\{`([^`]*)`\}|\{([^}]*)\})/gs;
const STR_RE = /'([^']*)'/g;

/**
 * Every literal utility class a file can emit: the static parts of each class
 * attribute, plus the string literals inside its interpolations (that is where
 * the conditional variants live). Route arguments like isActive('/') land in
 * the same attribute and are filtered out — they start with a slash and no
 * utility class does.
 */
function utilityClasses(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(CLASS_RE)) {
    const raw = m[1] ?? m[2] ?? m[3] ?? '';
    for (const lit of raw.matchAll(STR_RE)) out.push(...lit[1].split(/\s+/));
    out.push(...raw.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, ' ').split(/\s+/));
  }
  return out.filter((t) => t && !t.startsWith('{') && !t.startsWith('/')).sort();
}

/** Crude line-level divergence, enough to say how much behaviour differs. */
function divergentLines(a: string, b: string): number {
  const left = new Map<string, number>();
  for (const line of a.split('\n')) {
    const k = line.trim();
    if (k) left.set(k, (left.get(k) ?? 0) + 1);
  }
  let unmatched = 0;
  for (const line of b.split('\n')) {
    const k = line.trim();
    if (!k) continue;
    const n = left.get(k) ?? 0;
    if (n > 0) left.set(k, n - 1);
    else unmatched++;
  }
  return unmatched + [...left.values()].reduce((s, n) => s + n, 0);
}

const FILES = appComponents();

console.log(`Replica fidelity: ${DST}`);
console.log(`against          ${APP}`);
console.log(`at revision      ${WORKTREE ? resolvedRev : `${REV} = ${resolvedRev}`}`);
console.log('='.repeat(72));

if (WORKTREE) {
  console.warn('WARNING: --worktree measures an unpinned checkout. This result names no commit');
  console.warn('and cannot be located or re-derived later. Use --rev for anything you report.\n');
}

let identical = 0;
let classDrift = 0;
let missing = 0;
const behaviouralDelta: Array<[string, number]> = [];

for (const file of FILES) {
  const replicaPath = join(DST, file);
  if (!existsSync(replicaPath)) {
    console.log(`  MISSING IN REPLICA    ${file}`);
    missing++;
    continue;
  }
  const appSource = appFile(file);
  const replicaSource = readFileSync(replicaPath, 'utf8');

  const a = markup(appSource);
  const b = markup(replicaSource);
  const ca = utilityClasses(a);
  const cb = utilityClasses(b);
  const sameBytes = a === b;
  const sameClasses = ca.join(' ') === cb.join(' ');

  const scriptDelta = divergentLines(script(appSource), script(replicaSource));
  if (scriptDelta > 0) behaviouralDelta.push([file, scriptDelta]);

  if (sameBytes) identical++;

  if (!sameClasses) {
    classDrift++;
    const onlyApp = [...new Set(ca)].filter((c) => !cb.includes(c));
    const onlyReplica = [...new Set(cb)].filter((c) => !ca.includes(c));
    console.log(`  CLASS DRIFT           ${file}`);
    if (onlyApp.length) console.log(`      app only:     ${onlyApp.join(' ')}`);
    if (onlyReplica.length) console.log(`      replica only: ${onlyReplica.join(' ')}`);
  } else {
    const mark = sameBytes ? 'byte-identical' : 'same classes ';
    const note = scriptDelta > 0 ? `  [script ±${scriptDelta}]` : '';
    console.log(`  ${mark}        ${file}  (${ca.length} tokens)${note}`);
  }
}

/** A replica file with no original is an invention, and inventions are the thing to catch. */
const orphans = FILES.length
  ? execFileSync('find', [DST, '-name', '*.svelte'], { encoding: 'utf8' })
      .split('\n')
      .map((p) => p.replace(DST + '/', '').trim())
      .filter((p) => p.endsWith('.svelte') && !FILES.includes(p))
  : [];
for (const orphan of orphans) console.log(`  NO ORIGINAL           ${orphan}`);

console.log('');
console.log(`${FILES.length} components in the app at ${resolvedRev.slice(0, 12)}`);
console.log(`${identical}/${FILES.length} byte-identical markup`);
console.log(`${FILES.length - classDrift - missing}/${FILES.length} emit an identical set of utility classes`);
if (missing) console.log(`${missing} present in the app and absent from the replica`);
if (orphans.length) console.log(`${orphans.length} present in the replica with no original`);

if (behaviouralDelta.length) {
  console.log('');
  console.log('Script-block divergence, in unmatched lines. Wiring is legitimate here, so this');
  console.log('never fails the check; it is the list of files whose BEHAVIOUR to go read, because');
  console.log('a dropped behaviour hides in exactly the same diff as a rerouted import.');
  for (const [file, n] of behaviouralDelta.sort((x, y) => y[1] - x[1])) {
    console.log(`  ±${String(n).padStart(4)}  ${file}`);
  }
}

if (classDrift > 0 || missing > 0 || orphans.length > 0) {
  console.error('\nThe replica has drifted from the app.');
  process.exit(1);
}
