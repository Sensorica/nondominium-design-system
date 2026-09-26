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

/**
 * Components the replica deliberately does not mirror one to one, each with the
 * reason it is exempt. This list is the only legitimate way for a component to
 * be absent or renamed: anything else missing is a real gap, and an unlisted
 * replica file with no original is an invention.
 *
 * The bar for adding an entry is a fact about the app, verified at the pinned
 * revision, not a preference about the prototype.
 */
const EXCEPTIONS: Record<string, { reason: string; replica?: string }> = {
  'lobby/GroupSidebar.svelte': {
    reason:
      'Dead in the app: `git grep GroupSidebar` over ui/src at 20adb11 returns only its own definition, so no route and no component imports it, and the group create/join affordances it holds ship from shell/Sidebar.svelte instead. Replicated anyway, deliberately. A design system exists to give a designer something to work on, dead-in-app is a fact to record rather than a reason to omit, and this is a component somebody may well wire up. The note is the record; the file is the deliverable.'
  },
  'HolochainProvider.svelte': {
    replica: 'ConnectionState.svelte',
    reason:
      "Replicated under a different name and reduced to its three renderable states (connecting, error, disconnected). The app component is a connection wrapper whose body is a conductor call; the prototype has no conductor, so what it can faithfully hold is the wrapper's markup, which is what ConnectionState carries."
  }
};

/**
 * The per-file reading of the script-block divergence.
 *
 * The divergence list below ranks files by unmatched lines and then says, in its
 * own words, that it cannot tell a rerouted import from a dropped behaviour. That
 * is the honest limit of a line-count, and it is also an invitation nobody had
 * taken: on 2026-09-17 a read of `group/GroupView.svelte` found the app opens the
 * group member profile modal by itself on first entry (`hasVisited` gate,
 * REQ-UI-ID-02) and the replica only ever opened it from a URL flag. Same classes,
 * same markup apart from wiring, whole prompt invisible.
 *
 * So a verdict is a record of a read, and a file with no verdict is a file nobody
 * has read yet. `wiring` means the divergence is entirely the two allowances this
 * repo makes: hrefs through `paths.ts` because the site deploys under a sub-path,
 * and modal / tab / panel state in the query string so every surface is linkable
 * and commentable. `behaviour` means something the app does and the replica did
 * not, and it names it.
 */
const VERDICTS: Record<string, { verdict: 'wiring' | 'behaviour'; read_on: string; note: string }> = {
  'group/GroupView.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-17',
    note: "Dropped the first-visit gate on the group member profile modal (REQ-UI-ID-02): the app carries VISITED_KEY, hasVisited and markVisited, opens the modal from its mount effect when the group has not been visited, and records the visit on close. The replica had none of the three symbols. Restored; the URL flag is kept beside the gate. The rest is wiring."
  },
  'group/MemberList.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-17',
    note: 'One line, an import path. Markup closed the same day: the replica had dropped data-testid="member-row", which no class-token check can see because a data attribute emits no utility class.'
  },
  'lobby/LobbyView.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-17',
    note: 'Entirely the two allowances: the profile modal is opened through the query string instead of local state, and the create/join group links go through paths.appHome(). No behaviour differs.'
  },
  'lobby/NdoCard.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-17',
    note: 'One href, built by paths.ndoDetail() instead of interpolated. Markup cannot close while the site deploys under a sub-path.'
  },
  'lobby/ProfileSetupModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-17',
    note: 'Store and dialog wiring. Markup closed the same day by restoring the comment the app carries above <dialog>.'
  },
  'group/GroupProfileModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Two import paths plus a provenance comment. Markup is byte-identical."
  },
  'group/NdoCreateModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Import paths (types, mock stores, the rivalry helper) and the post-create goto through paths.groupDetail(), which applies the same encodeURIComponent. Validation, the duplicate-name warning, input assembly and the error fallback are the app's. The 'Failed to create NDO.' branch exists, but the mock groupStore.createNdo never returns null, so the branch cannot be reached."
  },
  'group/SoftLinkList.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The only difference is a one-line provenance comment. Markup is byte-identical. Nothing in the app's ui/src at 3cbebf0 imports this component."
  },
  'group/WorkLogFeed.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The only difference is a one-line provenance comment. Markup is byte-identical. Nothing in the app's ui/src at 3cbebf0 imports this component."
  },
  'lobby/GroupSidebar.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Props-driven, so no store is involved. Differences are the type import path, page from $app/state instead of $app/stores, and paths.groupDetail() in isGroupActive, both gotos and the href. Handlers, validation copy and catch branches match the app line for line."
  },
  'lobby/LobbyProfileBar.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "One import path for appContext plus a provenance comment. Markup is byte-identical."
  },
  'lobby/NdoBrowser.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Type imports only: NdoDescriptor and friends plus ActiveFilters come from ../types instead of shared-types and the lobby store. The shape is identical to the app's lobby.store ActiveFilters. Markup is byte-identical."
  },
  'lobby/UserProfileForm.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Import paths only (type and the appContext mock). The component reads and writes appContext.lobbyUserProfile exactly as the app does; persisting to localStorage is the store's job in both. Markup is byte-identical."
  },
  'ndo/ActivityTab.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-26',
    note: "The replica had dropped the app's try/catch, so the 'Failed to load activity for this NDO' error path, which resets events and commitments, was gone. It had also swapped the $effect keyed on specActionHash for onMount, so it stopped reloading when the NDO changed, and it read the spec listings directly instead of calling fetchSpecificationsForNdo. All three are restored. What remains is wiring: the Effect programs are now mock service calls, encodeHashToBase64 is an identity shim, and ?modal=commitment|event opens the forms. The markup is now byte-identical."
  },
  'ndo/AssociateNdoModal.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-26',
    note: "The replica never loaded existing associations (loadingAssociations started false and the list stayed empty), so it offered groups that already anchor the NDO. Its confirm button wrote nothing and closed after 900 ms instead of 600. Restored the app's onMount (loadGroups, then getAssociatedGroupIds), the per-group associateNdoWithGroup loop, loadNdos and the 600 ms close, backed by new mock methods that fail as the app's store does."
  },
  'ndo/CommitmentCreateForm.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The markup and the logic already matched the app. The only differences were the conductor key read, done synchronously through appContext, and the import paths. The script is now the app's verbatim: ensureProvider is async with its try/catch again, and it calls a mock holochainClientService that rejects under ?state=anonymous. Beyond that, only the imports and the identity hash shims differ."
  },
  'ndo/CompositionTab.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The app's file is markup-only. The replica adds an empty script block holding only a comment, so its importer gets a type declaration. Markup is byte-identical."
  },
  'ndo/EconomicEventCreateForm.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Same as CommitmentCreateForm. seedAgents only replaced the conductor key read with appContext. It is now the app's async try/catch again, over the mock holochainClientService. The only other differences are the import paths and the identity hash shims. The markup is byte-identical."
  },
  'ndo/ForkNdoModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "One line: the type import is repointed at the replica's types. Script and markup are otherwise the app's."
  },
  'ndo/GovernanceTab.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-26',
    note: "Four behaviours had drifted. The app re-runs loadRules and the agent/roles load from an $effect keyed on specActionHash, and the replica used onMount. canCreateRule had lost the app's truthiness terms, so an empty-string regime or nature enabled the button. The 'No Layer 1 specifications yet' load copy had lost the app's em dash. The New rule click was synchronous. All four are restored; the async fetchSpecificationsForNdo click is now the app's, and the agent key goes through a mock holochainClientService that rejects under ?state=anonymous. The rest is wiring: mock services and ?modal=rule-edit. The markup is byte-identical again, which fixes the reflowed 'AccountableAgent (governance-gated)' button."
  },
  'ndo/LifecycleTransitionModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The Effect call to updateLifecycleStage is replaced by the mock service, and its failure branch is reachable through ?state=error with the app's 'Failed to advance stage:' prefix. The conductor's cause text is replaced by a fixed tail. The transition table and guards are the app's. Formatting, the async signature and the decode step were brought back in line with the app."
  },
  'ndo/NdoIdentityLayer.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The lifecycle modal is opened through the query string via two prototype props, the initiator and successor hrefs go through paths.ts, and persons come from the mock. Identity shims for encodeHashToBase64 and decodeHashFromBase64 now keep isInitiator, ndoActionHash and the initiator match line for line the app's. No behaviour differs."
  },
  'ndo/NdoView.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-26',
    note: "The replica derived the descriptor straight from the mock and showed invented error copy. The app loads it into state, seeds it from ndoDescriptorCache, shows no banner when cached data exists, and uses 'Could not refresh NDO details from the chain. Data shown may be cached.' The app's parse-error copy, Retry re-fetch, role mapping on members and three markup items (data-testid=\"ndo-lifecycle-stage\", independent joinMessage and joinError blocks, the NdoAnchor comment) were also missing. All restored, with {specActionHash} and {ndoCellId} passed as the app does; ndoCellId is null because the mock has no cells. What remains is tab, modal and join state in the query string."
  },
  'ndo/ResourcesTab.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-26',
    note: "The replica used onMount where the app uses an $effect that tracks specActionHash and ndoCellId, so it never reloaded when either prop changed. It also filtered the listings inline instead of awaiting fetchSpecificationsForNdo. Both are restored, and loadError is reset at the end of load as in the app. What remains is wiring: one mock resourceService call and ?modal=spec-create. The markup is byte-identical."
  },
  'ndo/RuleEditorModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Import paths only. The ActionHash props had been typed as string; they now use the replica's ActionHash alias, so everything below the imports is byte-identical to the app."
  },
  'ndo/SpecificationCreateModal.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "Import paths only. The ActionHash prop type now comes from the replica types, so everything below the imports is byte-identical to the app."
  },
  'ndo/TransitionHistoryPanel.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The Effect read is replaced by the mock service, with the failed read driven by ?state=error and the app's copy and F4 comment kept. An identity encodeHashToBase64 shim and the ActionHash prop type restore byte-identical markup; before this the markup had been rewritten to slice raw strings."
  },
  'shell/AppShell.svelte': {
    verdict: 'wiring',
    read_on: '2026-09-26',
    note: "The only difference is a one-line provenance comment in the script block. Markup is byte-identical."
  },
  'shell/Sidebar.svelte': {
    verdict: 'behaviour',
    read_on: '2026-09-26',
    note: "The replica added `else joinError = 'Invalid invite code.'` after a null join. The app has no such branch: its lobbyStore.joinGroup returns null and records 'Join group failed: ...' on lobbyStore.errorMessage, and Sidebar just closes the form. Removed the branch, and the mock joinGroup, createGroup and loadLobby now clear or set lobbyState.errorMessage the way the app's store does. Everything else is wiring: paths.ts hrefs and goto targets, urlParam instead of $page.url.searchParams, the `?editProfile=1` modal flag, and import paths."
  }
};

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

/**
 * The visible text a file renders: the literal copy between its tags.
 *
 * This exists because of what a class list cannot say. The instrument has no
 * vocabulary for "this button is missing", so it reports the button's absence
 * as `bg-blue-600 disabled:cursor-not-allowed text-white` sitting in the
 * app-only column. Read as styling that is noise, and it was skimmed twice by
 * two sessions on 2026-09-08, hiding a whole spec-creation gate: four missing
 * props, a disabled button and an amber notice, all of it announced by the
 * instrument in the only words it had. Text is legible where classes are not:
 * `Cannot create while NDO is` names the feature outright.
 */
function visibleText(markup: string): string[] {
  // Order matters: braces first, tags second. A Svelte handler like
  // `onclick={() => { ... }}` contains a `>`, which terminates the tag matcher
  // early and spills the rest of the attribute list out as if it were copy.
  // Stripping expressions first removes every `>` that is not a tag's own.
  const stripped = markup
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{[^{}]*(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}[^{}]*)*\}/g, ' ')
    .replace(/<[^>]*>/g, '\n');
  return [
    ...new Set(
      stripped
        .split('\n')
        .map((t) => t.replace(/\s+/g, ' ').trim())
        // An attribute fragment that survived anyway is not copy: it has an
        // `="` in it, and no sentence a user reads does.
        .filter((t) => t.length > 3 && /[a-z]{3}/i.test(t) && !t.includes('="'))
    )
  ].sort();
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
console.log('A MISSING UI row is a feature list, not a palette. A class or a line of copy the');
console.log('app emits and the replica does not is a thing the replica cannot render.');
console.log('');

if (WORKTREE) {
  console.warn('WARNING: --worktree measures an unpinned checkout. This result names no commit');
  console.warn('and cannot be located or re-derived later. Use --rev for anything you report.\n');
}

let identical = 0;
let classDrift = 0;
let missing = 0;
const behaviouralDelta: Array<[string, number]> = [];

/** Replica paths claimed by an exception, so they are never reported as orphans. */
const ALIASED = new Set(
  Object.values(EXCEPTIONS)
    .map((e) => e.replica)
    .filter((r): r is string => Boolean(r))
);
const annotated: Array<[string, string]> = [];

for (const file of FILES) {
  const exception = EXCEPTIONS[file];
  const replicaPath = join(DST, exception?.replica ?? file);
  if (exception) annotated.push([file, exception.reason]);
  if (!existsSync(replicaPath)) {
    console.log(`  MISSING IN REPLICA    ${file}`);
    missing++;
    continue;
  }
  if (exception?.replica) {
    // An aliased component is not a markup comparison: it exists under a
    // different name precisely because it could not be copied as it stands.
    // Recording the alias is the whole claim; comparing classes would fail on a
    // divergence the exception already accounts for.
    console.log(`  ALIASED               ${file}  →  ${exception.replica}`);
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
    const ta = visibleText(a);
    const tb = visibleText(b);
    const textOnlyApp = ta.filter((t) => !tb.includes(t));
    const textOnlyReplica = tb.filter((t) => !ta.includes(t));
    // Say what it means. A class the app emits and the replica does not is a
    // feature the replica does not have, so the row is named for the finding
    // rather than for the measurement that produced it.
    console.log(`  MISSING UI            ${file}`);
    if (textOnlyApp.length) {
      console.log(`      copy the app renders and the replica does not:`);
      for (const t of textOnlyApp) console.log(`        "${t}"`);
    }
    if (textOnlyReplica.length) {
      console.log(`      copy the replica renders and the app does not:`);
      for (const t of textOnlyReplica) console.log(`        "${t}"`);
    }
    if (onlyApp.length) console.log(`      classes, app only:     ${onlyApp.join(' ')}`);
    if (onlyReplica.length) console.log(`      classes, replica only: ${onlyReplica.join(' ')}`);
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
      .filter((p) => p.endsWith('.svelte') && !FILES.includes(p) && !ALIASED.has(p))
  : [];
for (const orphan of orphans) console.log(`  NO ORIGINAL           ${orphan}`);

if (annotated.length) {
  console.log('');
  console.log('Deliberate divergence, each with the fact it rests on:');
  for (const [file, reason] of annotated) console.log(`  ${file}\n      ${reason}`);
}

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
    const v = VERDICTS[file];
    const tag = v ? (v.verdict === 'wiring' ? 'wiring  ' : 'BEHAVIOUR') : 'unread  ';
    console.log(`  ±${String(n).padStart(4)}  ${tag}  ${file}`);
  }

  const read = behaviouralDelta.filter(([f]) => VERDICTS[f]).length;
  console.log('');
  console.log(`${read}/${behaviouralDelta.length} of those files have been read. A verdict is a record of a read;`);
  console.log('`unread` means nobody has separated wiring from dropped behaviour there yet.');
  for (const [file, v] of Object.entries(VERDICTS)) {
    console.log(`  ${v.verdict === 'wiring' ? 'wiring   ' : 'BEHAVIOUR'}  ${file}  (read ${v.read_on})`);
    console.log(`      ${v.note}`);
  }
}

if (classDrift > 0 || missing > 0 || orphans.length > 0) {
  console.error('\nThe replica has drifted from the app.');
  process.exit(1);
}
