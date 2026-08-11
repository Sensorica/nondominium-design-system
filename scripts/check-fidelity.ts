#!/usr/bin/env bun
/**
 * Replica fidelity check.
 *
 * The prototype under src/lib/replica is a copy of the Nondominium app's
 * components. Its whole value is that it renders what the app renders — which
 * decays silently the moment either side changes. This script compares every
 * replica component's markup against its original and fails if the set of
 * UnoCSS utility classes they emit differs.
 *
 * It deliberately does NOT require byte-identical markup: seven components have
 * to differ in wiring, because this site deploys under a sub-path, the
 * prototype is mounted at /app, and modal and tab states are read from the
 * query string so a reviewer can link to them. Those are wiring differences.
 * A class difference is a visual difference, and that is the thing to catch.
 *
 *   bun run check:fidelity
 *   bun run check:fidelity -- --app ../elsewhere/ui
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Where the app lives. `--app` wins; otherwise walk up from the working
 * directory looking for a sibling `nondominium/ui`, so the check works from a
 * normal checkout and from a git worktree (which sits two levels deeper).
 */
function findApp(): string {
  const arg = process.argv.indexOf('--app');
  if (arg > -1) return resolve(process.argv[arg + 1]);
  let dir = resolve('.');
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, '..', 'nondominium', 'ui');
    if (existsSync(join(candidate, 'src/lib/components'))) return resolve(candidate);
    dir = resolve(dir, '..');
  }
  return resolve('../nondominium/ui');
}

const APP = findApp();
const SRC = join(APP, 'src/lib/components');
const DST = resolve('src/lib/replica');

const FILES = [
  'shell/AppShell.svelte',
  'shell/Sidebar.svelte',
  'lobby/LobbyView.svelte',
  'lobby/LobbyProfileBar.svelte',
  'lobby/NdoBrowser.svelte',
  'lobby/NdoCard.svelte',
  'lobby/UserProfileForm.svelte',
  'lobby/ProfileSetupModal.svelte',
  'group/GroupView.svelte',
  'group/MemberList.svelte',
  'group/SoftLinkList.svelte',
  'group/WorkLogFeed.svelte',
  'group/NdoCreateModal.svelte',
  'group/GroupProfileModal.svelte',
  'ndo/NdoView.svelte',
  'ndo/NdoIdentityLayer.svelte',
  'ndo/ResourcesTab.svelte',
  'ndo/GovernanceTab.svelte',
  'ndo/ActivityTab.svelte',
  'ndo/CompositionTab.svelte',
  'ndo/TransitionHistoryPanel.svelte',
  'ndo/LifecycleTransitionModal.svelte',
  'ndo/ForkNdoModal.svelte',
  'ndo/AssociateNdoModal.svelte'
];

/** Everything after the script block: the part that renders. */
function markup(path: string): string {
  const s = readFileSync(path, 'utf8');
  const i = s.indexOf('</script>');
  return (i >= 0 ? s.slice(i + '</script>'.length) : s).trim();
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

if (!existsSync(SRC)) {
  // Skip rather than fail: a contributor working only on the docs site should
  // not need the app checked out beside it. CI does check it out, so drift is
  // still caught on every push.
  console.warn(`SKIPPED — the app's components are not at ${SRC}.`);
  console.warn('Check out Sensorica/nondominium as a sibling, or pass --app <path-to-ui>.');
  process.exit(0);
}

let identical = 0;
let drifted = 0;

console.log(`Replica fidelity against ${APP}`);
console.log('='.repeat(60));

for (const file of FILES) {
  const appPath = join(SRC, file);
  const replicaPath = join(DST, file);
  if (!existsSync(appPath)) {
    console.log(`  MISSING IN APP        ${file}`);
    drifted++;
    continue;
  }
  const a = markup(appPath);
  const b = markup(replicaPath);
  const ca = utilityClasses(a);
  const cb = utilityClasses(b);
  const sameBytes = a === b;
  const sameClasses = ca.join(' ') === cb.join(' ');

  if (sameBytes) identical++;
  if (!sameClasses) {
    drifted++;
    const onlyApp = [...new Set(ca)].filter((c) => !cb.includes(c));
    const onlyReplica = [...new Set(cb)].filter((c) => !ca.includes(c));
    console.log(`  CLASS DRIFT           ${file}`);
    if (onlyApp.length) console.log(`      app only:     ${onlyApp.join(' ')}`);
    if (onlyReplica.length) console.log(`      replica only: ${onlyReplica.join(' ')}`);
  } else {
    console.log(
      `  ${sameBytes ? 'byte-identical' : 'same classes '}        ${file}  (${ca.length} tokens)`
    );
  }
}

console.log('');
console.log(`${identical}/${FILES.length} byte-identical markup`);
console.log(`${FILES.length - drifted}/${FILES.length} emit an identical set of utility classes`);

if (drifted > 0) {
  console.error('\nThe replica has drifted from the app. Re-copy the markup of the files above.');
  process.exit(1);
}
