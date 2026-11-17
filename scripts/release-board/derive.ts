// derive(snapshot, config, now): the whole release board, from what GitHub said and the
// release's notes file. Pure: no network, no clock but `now`, no file system. Every rule
// it applies is stated in docs/RELEASE_BOARD.md; change one here, change it there.

import type { Chip, Inline, Kpi, Landed, Pairing, PairingRow, ReleaseBoard, Rich, Step, Stream, Tone } from '../../src/lib/releases/types';
import type { ReleaseConfig } from './config';
import type { Issue, Pr, Review, Snapshot, WrapperConfig } from './snapshot';

export const TIME_ZONE = 'America/Toronto';

/** Conventional-commit types a PR author merges alone after a green run; every other type waits on the other maintainer's review. */
export const SELF_MERGE = ['fix', 'docs', 'chore', 'test', 'copy'];

/** A meeting of this site written as a full URL, on either deployment: design.sensorica.co or GitHub Pages. */
const DS_MEETING = /^https:\/\/(?:design\.sensorica\.co|sensorica\.github\.io\/nondominium-design-system)\/meetings\/([\w-]+)(?:#(.+))?$/;

// ── dates, always read in Montreal ─────────────────────────────────────────────────────────
const hm = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
const day = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'short' }).format(new Date(iso));
const localDate = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date(iso));
/** A calendar date (YYYY-MM-DD) as "Tuesday 17 November". */
const longDate = (ymd: string) => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${ymd}T12:00:00Z`));
const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 864e5);
const short = (sha: string | null | undefined) => (sha ?? '').slice(0, 8);
const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many);
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

// ── the context every rule reads ───────────────────────────────────────────────────────────
type Ctx = { s: Snapshot; c: ReleaseConfig; gh: string; prNumbers: Set<number> };

const nameOf = (ctx: Ctx, login: string) => ctx.c.maintainers[login] ?? ctx.s.names[login] ?? login;

/** Who reviews a PR by `author`: the other maintainers, or any maintainer for a PR from outside the team. */
const otherMaintainer = (ctx: Ctx, author: string) => {
  const others = Object.keys(ctx.c.maintainers).filter((l) => l !== author);
  return list((others.length ? others : Object.keys(ctx.c.maintainers)).map((l) => nameOf(ctx, l))).replace(/ and ([^,]+)$/, ' or $1');
};

const hrefOf = (ctx: Ctx, n: number) => {
  const ref = ctx.s.app.refs[String(n)];
  if (ref) return ref.url;
  return `${ctx.gh}/${ctx.prNumbers.has(n) ? 'pull' : 'issues'}/${n}`;
};

const titleOf = (ctx: Ctx, n: number): string | undefined =>
  ctx.s.app.refs[String(n)]?.title ?? ctx.s.app.prs.find((p) => p.number === n)?.title ?? ctx.s.app.issues.find((i) => i.number === n)?.title ?? ctx.s.app.merged.find((m) => m.number === n)?.title;

const ghLink = (ctx: Ctx, n: number): Inline => {
  const title = titleOf(ctx, n);
  return { text: `#${n}`, href: hrefOf(ctx, n), ...(title ? { title } : {}) };
};

// ── notes: plain text with a little markdown, into typed runs ──────────────────────────────
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(?<![\w/&#])#(\d+)\b/g;

/**
 * A note's text into runs. `**bold**`; `[text](https://…)` a link; `[text](meeting:slug#anchor)`
 * a link to a meeting of this site; `[text](source:slug#anchor)` the short source link set after
 * a sentence; every bare `#N` a link to the app repo's PR or issue N.
 */
export function rich(ctx: Ctx, t: string): Rich {
  const out: Inline[] = [];
  let at = 0;
  const push = (r: Inline) => out.push(r);
  for (const m of t.matchAll(INLINE)) {
    let before = t.slice(at, m.index);
    const [, bold, label, href, num] = m;
    const cite = href?.startsWith('source:');
    if (cite) before = before.trimEnd();
    if (before) push(before);
    if (bold !== undefined) push({ text: bold, strong: true });
    else if (num !== undefined) push(ghLink(ctx, Number(num)));
    else {
      const meeting = /^(?:meeting|source):([\w-]+)(?:#(.+))?$/.exec(href) ?? DS_MEETING.exec(href);
      if (meeting) push({ text: label, meeting: meeting[1], ...(meeting[2] ? { anchor: meeting[2] } : {}), ...(cite ? { cite: true } : {}) });
      else push({ text: label, href });
    }
    at = m.index! + m[0].length;
  }
  if (at < t.length) push(t.slice(at));
  // a run that ended as whitespace before a source link is dropped, so two sources sit side by side
  return out.filter((r) => typeof r !== 'string' || r.length > 0);
}

// ── one PR: its review, its state, who holds its next step ────────────────────────────────
export type Decision = { kind: 'changes' | 'approved' | 'none'; review?: Review; stale?: boolean };

/** GitHub's reviews, read the way the team reads them: any standing Request Changes wins, then any approval. */
export function decision(pr: Pr): Decision {
  const latest = (state: Review['state']) =>
    pr.reviews.filter((r) => r.state === state).sort((a, b) => a.submittedAt.localeCompare(b.submittedAt)).pop();
  const changes = latest('CHANGES_REQUESTED');
  if (changes) return { kind: 'changes', review: changes, stale: !!changes.commit && changes.commit !== pr.headSha };
  const ok = latest('APPROVED');
  if (ok) return { kind: 'approved', review: ok, stale: !!ok.commit && ok.commit !== pr.headSha };
  return { kind: 'none' };
}

/** The conventional-commit type in a PR title: `feat(x): …` is feat. A title without one is treated as needing review. */
export const prType = (title: string) => /^([a-z]+)(?:\([^)]*\))?!?:/i.exec(title)?.[1]?.toLowerCase() ?? '';

export type Verb = 'answer' | 're-review' | 'review' | 'merge' | 'green' | 'undraft';

export type Next = { holder: string; verb: Verb };

/**
 * Who holds a PR's next step, from its state alone:
 * a draft is its author's to take out of draft; a Request Changes at the current head is the
 * author's to answer, and one the head has moved past is the reviewer's to re-read; a ready PR
 * nobody has reviewed is the other maintainer's when its type needs review (feat, refactor and
 * any type not in SELF_MERGE), and its author's to merge when it does not; an approved PR is
 * its author's to merge. Whoever merges first needs a green fast CI (or none configured):
 * until then it is the author's to make green.
 */
export function nextStep(ctx: Ctx, pr: Pr): Next {
  const author = nameOf(ctx, pr.author);
  const d = decision(pr);
  const green = pr.ci === 'SUCCESS' || pr.ci === null; // a repo with no checks has nothing to wait for
  if (pr.isDraft) return { holder: author, verb: 'undraft' };
  if (d.kind === 'changes') return d.stale ? { holder: nameOf(ctx, d.review!.author), verb: 're-review' } : { holder: author, verb: 'answer' };
  if (d.kind === 'none' && !SELF_MERGE.includes(prType(pr.title))) return { holder: otherMaintainer(ctx, pr.author), verb: 'review' };
  return { holder: author, verb: green ? 'merge' : 'green' };
}

const ciWord = (ci: Pr['ci']) => (ci === 'SUCCESS' ? 'green' : ci === 'FAILURE' || ci === 'ERROR' ? 'red' : ci === 'PENDING' || ci === 'EXPECTED' ? 'running' : 'none');

const VERB_TEXT: Record<Verb, string> = {
  answer: 'answers the changes asked',
  're-review': 're-reviews',
  review: 'reviews',
  merge: 'merges',
  green: 'makes CI green',
  undraft: 'takes it out of draft',
};

function heavyAt(s: Snapshot, sha: string) {
  return s.app.heavyRuns
    .filter((r) => r.headSha === sha && r.status === 'completed' && r.conclusion !== 'skipped' && r.conclusion !== 'cancelled')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

function prChip(ctx: Ctx, pr: Pr, opts: { label?: string; heavy?: boolean; extra?: string } = {}): Chip {
  const d = decision(pr);
  const n = nextStep(ctx, pr);
  const ci = ciWord(pr.ci);
  let state: string, kind: Chip['kind'];
  if (pr.isDraft) [state, kind] = [d.kind === 'changes' ? 'draft, changes asked' : 'draft', 'draft'];
  else if (d.kind === 'changes') [state, kind] = [d.stale ? 'changes, stale' : 'changes asked', 'changes'];
  else if (d.kind === 'approved') [state, kind] = [ci === 'green' ? 'approved' : `approved, CI ${ci}`, 'ok'];
  else [state, kind] = [ci === 'green' || ci === 'none' ? 'ready' : `ready, CI ${ci}`, 'ready'];
  const review = d.review
    ? `${d.kind === 'changes' ? 'Request Changes' : 'approved'} by ${nameOf(ctx, d.review.author)} ${day(d.review.submittedAt)} ${hm(d.review.submittedAt)} at ${short(d.review.commit)}${d.stale ? `, head now ${short(pr.headSha)}` : ', at its head'}`
    : 'no review yet';
  const tip = [review, `fast CI ${ci}`, opts.extra, `next: ${n.holder} ${VERB_TEXT[n.verb]}`].filter(Boolean).join(' · ');
  const chip: Chip = { label: opts.label ?? `#${pr.number}`, href: pr.url, title: pr.title, state, stateTitle: tip, kind, who: nameOf(ctx, pr.author) };
  if (opts.heavy !== false && ctx.c.app.heavyWorkflow) {
    const h = heavyAt(ctx.s, pr.headSha);
    chip.heavy = h
      ? { result: h.conclusion === 'success' ? 'ok' : 'bad', title: `heavy run ${h.conclusion} at the head, ${day(h.createdAt)} ${hm(h.createdAt)}` }
      : { result: 'none', title: `no heavy run at the head ${short(pr.headSha)}` };
  }
  return chip;
}

function issueChip(ctx: Ctx, i: Issue): Chip {
  return { label: `#${i.number}`, href: i.url, title: i.title, state: 'open', kind: 'issue', who: i.assignees.length ? list(i.assignees.map((a) => nameOf(ctx, a))) : 'unassigned' };
}

/** Stack order: a PR comes right after the PR whose branch it is based on; roots by number. */
export function stackOrder(prs: Pr[]): Pr[] {
  const byHead = new Map(prs.map((p) => [p.headRef, p]));
  const children = new Map<number, Pr[]>();
  const roots: Pr[] = [];
  for (const p of [...prs].sort((a, b) => a.number - b.number)) {
    const parent = byHead.get(p.baseRef);
    if (parent && parent !== p) children.set(parent.number, [...(children.get(parent.number) ?? []), p]);
    else roots.push(p);
  }
  const out: Pr[] = [];
  const seen = new Set<number>();
  const walk = (p: Pr) => {
    if (seen.has(p.number)) return;
    seen.add(p.number);
    out.push(p);
    for (const c of children.get(p.number) ?? []) walk(c);
  };
  roots.forEach(walk);
  prs.filter((p) => !seen.has(p.number)).forEach(walk); // a cycle of bases, which GitHub allows; never drop a PR
  return out;
}

/** "Tibi (2), Soushi (1)" and "Tibi answers the changes asked on #12, #14; Soushi reviews #15." */
function holdsAndNext(ctx: Ctx, prs: Pr[], label: (p: Pr) => Inline = (p) => ghLink(ctx, p.number)): { holds: Rich; next: Rich } {
  const by = new Map<string, Map<Verb, Pr[]>>();
  for (const p of prs) {
    const n = nextStep(ctx, p);
    const verbs = by.get(n.holder) ?? new Map<Verb, Pr[]>();
    verbs.set(n.verb, [...(verbs.get(n.verb) ?? []), p]);
    by.set(n.holder, verbs);
  }
  const count = (m: Map<Verb, Pr[]>) => [...m.values()].reduce((k, v) => k + v.length, 0);
  const holders = [...by.entries()].sort((a, b) => count(b[1]) - count(a[1]) || a[0].localeCompare(b[0]));
  if (!holders.length) return { holds: ['Nobody: nothing open'], next: [] };
  const holds: Rich = [holders.map(([h, m]) => `${h} (${count(m)})`).join(', ')];
  const ORDER: Verb[] = ['answer', 're-review', 'review', 'merge', 'green', 'undraft'];
  const next: Rich = [];
  holders.forEach(([h, m], hi) => {
    next.push(`${hi ? ' ' : ''}${h} `);
    ORDER.filter((v) => m.has(v)).forEach((v, vi) => {
      const ps = m.get(v)!;
      if (vi) next.push('; ');
      const lead = { answer: 'answers the changes asked on ', 're-review': 're-reviews ', review: 'reviews ', merge: 'merges ', green: 'makes CI green on ', undraft: 'takes ' }[v];
      next.push(lead);
      ps.forEach((p, i) => {
        if (i) next.push(', ');
        next.push(label(p));
      });
      if (v === 'undraft') next.push(' out of draft');
    });
    next.push('.');
  });
  return { holds, next: merge(next) };
}

/** Adjacent plain runs into one, so the JSON reads as the sentence it renders. */
function merge(runs: Rich): Rich {
  const out: Rich = [];
  for (const r of runs) {
    const last = out[out.length - 1];
    if (typeof r === 'string' && typeof last === 'string') out[out.length - 1] = last + r;
    else out.push(r);
  }
  return out;
}

const withNote = (ctx: Ctx, base: Rich, note: string): Rich => (note ? merge([...base, ...(base.length ? [' '] : []), ...rich(ctx, note)]) : base);

function tagOf(prs: Pr[], issues: number): { tag: string; tone: Tone } {
  const drafts = prs.filter((p) => p.isDraft).length;
  const changes = prs.filter((p) => !p.isDraft && decision(p).kind === 'changes').length;
  const ready = prs.length - drafts - changes;
  const parts = [changes && `${changes} changes asked`, drafts && `${drafts} ${plural(drafts, 'draft')}`, ready && `${ready} ready`].filter(Boolean) as string[];
  if (!prs.length) return { tag: issues ? `${issues} ${plural(issues, 'issue')} open` : 'nothing open', tone: issues ? 'accent' : 'ok' };
  return { tag: parts.join(' · '), tone: changes ? 'bad' : drafts ? 'warn' : 'ok' };
}

// ── the desktop wrapper ────────────────────────────────────────────────────────────────────
const line = (v: string | null | undefined) => (v ? v.split('.').slice(0, 2).join('.') : null);

export function pairing(ctx: Ctx): Pairing | undefined {
  const w = ctx.s.wrapper;
  if (!w) return undefined;
  const app = ctx.s.app;
  const version = versionOf(app.milestone.title);
  const rc: WrapperConfig | null = w.releaseConfig;
  const wrapperUrl = `https://github.com/${w.repo}`;
  const rows: PairingRow[] = [];
  const hcApp = app.holochainLine;
  const hcWrap = rc?.holochainVersion ?? null;
  const hcOk = !!hcApp && !!hcWrap && line(hcWrap) === hcApp;
  rows.push({
    label: 'Holochain',
    value: [`hApp ${hcApp ?? 'unknown'} (flake.nix on ${app.defaultBranch}), wrapper ${hcWrap ?? 'unknown'} (kangaroo.config.ts on `, { text: w.releaseBranch, href: `${wrapperUrl}/blob/${w.releaseBranch}/kangaroo.config.ts` }, ')'],
    tone: hcOk ? 'ok' : hcApp && hcWrap ? 'bad' : 'warn',
  });
  const want = version.replace(/^v/, '');
  const versionOk = app.packageVersion === want;
  rows.push({
    label: 'Version',
    value: [`the tag ${version} needs package.json on ${app.defaultBranch} to read ${want}; it reads ${app.packageVersion ?? 'unknown'}`],
    tone: versionOk ? 'ok' : 'warn',
  });
  if (rc?.networkSeed) rows.push({ label: 'Network seed', value: [`${rc.networkSeed} (the desktop seed, from the wrapper's ${w.releaseBranch} branch)`], tone: 'accent' });
  if (rc?.bootstrapUrl) rows.push({ label: 'Bootstrap', value: [rc.bootstrapUrl], tone: 'accent' });
  for (const pr of w.prs) {
    const hc = pr.config?.holochainVersion ?? null;
    const pairs = !!hc && line(hc) === hcApp;
    const onRelease = pr.baseRef === w.releaseBranch;
    rows.push({
      label: `wrapper #${pr.number}`,
      value: [
        { text: `#${pr.number}`, href: pr.url, title: pr.title },
        ` targets ${pr.baseRef}${onRelease ? '' : ` (releases build from ${w.releaseBranch})`}; it carries Holochain ${hc ?? 'unknown'}${pr.config?.version ? `, version ${pr.config.version}` : ''}${pr.config?.networkSeed ? `, seed ${pr.config.networkSeed}` : ''}`,
      ],
      tone: pairs && onRelease ? 'ok' : pairs ? 'warn' : 'bad',
    });
  }
  let verdict: Rich, tone: Tone;
  if (!hcApp || !hcWrap) [verdict, tone] = [[`Unknown: the board could not read the Holochain version of ${hcApp ? 'the wrapper' : 'the hApp'}.`], 'warn'];
  else if (!hcOk)
    [verdict, tone] = [[{ text: 'No.', strong: true }, ` A tag pushed now stops at the pairing check: the hApp is on Holochain ${hcApp} and the wrapper's ${w.releaseBranch} branch bundles ${hcWrap}.`], 'bad'];
  else if (!versionOk)
    [verdict, tone] = [[{ text: 'Not yet.', strong: true }, ` Holochain pairs (${hcApp}), but the release workflow refuses a tag whose version differs from package.json, which reads ${app.packageVersion ?? 'unknown'}.`], 'warn'];
  else [verdict, tone] = [[{ text: 'Yes.', strong: true }, ` A tag pushed now pairs with the wrapper's ${w.releaseBranch} branch on Holochain ${hcApp}.`], 'ok'];
  return { verdict, tone, rows };
}

function desktopStream(ctx: Ctx): Stream | undefined {
  const w = ctx.s.wrapper;
  if (!w) return undefined;
  const p = pairing(ctx)!;
  const prs = stackOrder(w.prs);
  const chips = prs.map((pr) => prChip(ctx, pr, { label: `wrapper #${pr.number}`, heavy: false, extra: `last change ${day(pr.updatedAt)}` }));
  const t = tagOf(prs, 0);
  const worst: Tone[] = ['bad', 'warn', 'ok', 'accent'];
  const tone = worst.find((x) => x === p.tone || x === t.tone) ?? 'ok';
  const hn = holdsAndNext(ctx, prs, (pr) => ({ text: `wrapper #${pr.number}`, href: pr.url, title: pr.title }));
  const marked = w.markedBy === 'milestone' ? 'its milestone of the same title' : 'the PRs named in the release file';
  return {
    id: 'desktop',
    title: 'Desktop',
    tone,
    tag: p.tone === 'ok' ? 'pairs' : p.tone === 'bad' ? 'does not pair' : 'not yet',
    why: ['The desktop app, built from ', { text: w.repo.split('/')[1], href: `https://github.com/${w.repo}` }, `'s ${w.releaseBranch} branch; its open PRs from ${marked}.`],
    chips,
    holds: hn.holds,
    next: withNote(ctx, hn.next, ctx.c.desktopNote),
    pairing: p,
  };
}

// ── the board ──────────────────────────────────────────────────────────────────────────────
export const versionOf = (title: string) => {
  const m = /^v?(\d+\.\d+\.\d+[^\s,:;]*)/.exec(title.trim());
  return m ? `v${m[1]}` : title.trim().split(/\s/)[0];
};

/** "messaging" -> "Messaging", but "hREA economic lifecycle" keeps its case. */
const capital = (t: string) => (/^.[A-Z]/.test(t) ? t : t.charAt(0).toUpperCase() + t.slice(1));

export function derive(s: Snapshot, c: ReleaseConfig, now: Date): ReleaseBoard {
  const gh = `https://github.com/${s.app.repo}`;
  const prNumbers = new Set<number>([...s.app.prs.map((p) => p.number), ...s.app.merged.map((m) => m.number)]);
  const ctx: Ctx = { s, c, gh, prNumbers };
  const nowIso = now.toISOString();
  const today = localDate(nowIso);
  const ms = s.app.milestone;
  const msLink = `${gh}/milestone/${ms.number}`;

  // which workstream each open item is in: exactly one label with the prefix, or the unsorted card
  const ws = (labels: string[]) => labels.filter((l) => l.startsWith(c.labelPrefix));
  const known = new Map(s.app.labels.map((l) => [l.name, l.description]));
  const configured = Object.keys(c.streams).filter((l) => known.has(l));
  const used = [...new Set([...s.app.prs, ...s.app.issues].map((i) => ws(i.labels)).filter((l) => l.length === 1).map((l) => l[0]))];
  const order = [...configured, ...used.filter((l) => !configured.includes(l)).sort()];

  const streams: Stream[] = [];
  const unsortedPrs = s.app.prs.filter((p) => ws(p.labels).length !== 1);
  const unsortedIssues = s.app.issues.filter((i) => ws(i.labels).length !== 1);
  if (unsortedPrs.length + unsortedIssues.length) {
    const why = (labels: string[]) => {
      const w = ws(labels);
      return w.length ? `${w.length} workstream labels: ${w.join(', ')}` : 'no workstream label';
    };
    const fix = (n: number, labels: string[]): Rich => {
      const w = ws(labels);
      return [ghLink(ctx, n), w.length ? `: keep one of ${w.join(', ')}` : `: add one ${c.labelPrefix} label`];
    };
    const items = [...unsortedPrs.map((p) => ({ n: p.number, labels: p.labels })), ...unsortedIssues.map((i) => ({ n: i.number, labels: i.labels }))].sort((a, b) => a.n - b.n);
    streams.push({
      id: 'unsorted',
      title: 'Unsorted',
      tone: 'bad',
      tag: `${items.length} to sort`,
      why: [`On `, { text: `milestone ${ms.number}`, href: msLink }, ` with no ${c.labelPrefix} workstream label, or with more than one. Give each exactly one on GitHub and the next run files it.`],
      chips: [
        ...unsortedPrs.map((p) => ({ ...prChip(ctx, p), state: ws(p.labels).length ? 'two workstreams' : 'no workstream', kind: 'changes' as const, stateTitle: `${why(p.labels)} · ${prChip(ctx, p).state}` })),
        ...unsortedIssues.map((i) => ({ ...issueChip(ctx, i), state: ws(i.labels).length ? 'two workstreams' : 'no workstream', kind: 'changes' as const, stateTitle: why(i.labels) })),
      ],
      holds: [`Any maintainer: ${list(Object.keys(c.maintainers).map((l) => nameOf(ctx, l)))}`],
      next: merge(items.flatMap((it, k) => [...(k ? ['; '] : []), ...fix(it.n, it.labels)]).concat(['.'])),
    });
  }

  for (const label of order) {
    const prs = stackOrder(s.app.prs.filter((p) => ws(p.labels).length === 1 && ws(p.labels)[0] === label));
    const issues = s.app.issues.filter((i) => ws(i.labels).length === 1 && ws(i.labels)[0] === label).sort((a, b) => a.number - b.number);
    const desc = (known.get(label) ?? '').replace(/^\s*workstream:\s*/i, '').trim();
    const t = tagOf(prs, issues.length);
    const hn = holdsAndNext(ctx, prs);
    streams.push({
      id: label.slice(c.labelPrefix.length).replace(/[^\w-]/g, '-'),
      title: capital(label.slice(c.labelPrefix.length)),
      tone: t.tone,
      tag: t.tag,
      why: [desc ? `${capital(desc)}.` : `The ${label} label has no description on GitHub.`],
      chips: [...prs.map((p) => prChip(ctx, p)), ...issues.map((i) => issueChip(ctx, i))],
      holds: hn.holds,
      next: withNote(ctx, hn.next, c.streams[label]?.note ?? ''),
    });
  }
  const desktop = desktopStream(ctx);
  if (desktop) streams.push(desktop);

  // the numbers across the top
  const open = s.app.prs;
  const total = ms.openCount + ms.closedCount;
  const drafts = open.filter((p) => p.isDraft).length;
  const changes = open.filter((p) => decision(p).kind === 'changes');
  const heavyGreen = open.filter((p) => heavyAt(s, p.headSha)?.conclusion === 'success').length;
  const due = ms.dueOn ? ms.dueOn.slice(0, 10) : null;
  const left = due ? daysBetween(today, due) : null;
  const since = s.app.previousRelease;
  const kpis: Kpi[] = [];
  if (ms.state === 'closed') kpis.push({ n: 'closed', unit: '', label: [`milestone closed on ${ms.closedAt ? longDate(localDate(ms.closedAt)) : 'an unknown day'}`], src: `milestone ${ms.number} on GitHub`, tone: 'ok' });
  else if (left === null) kpis.push({ n: '?', unit: '', label: ['no due date on the milestone'], src: `milestone ${ms.number} on GitHub`, tone: 'warn' });
  else if (left >= 0) kpis.push({ n: `${left}`, unit: plural(left, 'day'), label: [`to the tag, ${longDate(due!)}`], src: `milestone ${ms.number} due date on GitHub`, tone: left <= 2 ? 'bad' : 'warn' });
  else kpis.push({ n: `${-left}`, unit: plural(-left, 'day'), label: [`past the due date, ${longDate(due!)}`], src: `milestone ${ms.number} due date on GitHub`, tone: 'bad' });
  kpis.push({
    n: `${ms.closedCount}/${total}`,
    unit: total ? `${Math.round((100 * ms.closedCount) / total)}%` : '',
    label: [`milestone ${ms.number} items closed (issues and PRs)`],
    src: `milestone ${ms.number} on GitHub`,
    tone: 'accent',
    ...(total ? { bar: ms.closedCount / total } : {}),
  });
  kpis.push({ n: `${open.length}`, unit: 'open', label: [drafts ? `PRs on the milestone, ${drafts} still ${plural(drafts, 'a draft', 'drafts')}` : 'PRs on the milestone, none a draft'], src: 'pull requests on GitHub', tone: drafts ? 'warn' : 'ok' });
  kpis.push({
    n: `${changes.length}`,
    unit: '',
    label: merge(['with Request Changes standing: ', ...(changes.length ? stackOrder(changes).flatMap((p, i) => [...(i ? [', '] : []), ghLink(ctx, p.number)]) : ['none'])]),
    src: 'reviews on GitHub',
    tone: changes.length ? 'bad' : 'ok',
  });
  // a repo with no heavy-test workflow has no heavy number, rather than a 0 that reads as a failure
  if (c.app.heavyWorkflow) kpis.push({ n: `${heavyGreen}/${open.length}`, unit: '', label: ['open PRs with a green heavy run at their current head'], src: `${c.app.heavyWorkflow} runs on GitHub`, tone: heavyGreen < open.length ? 'warn' : 'ok' });
  const sinceText = since ? `${since.tag}, ${day(since.publishedAt)}` : 'the start';
  kpis.push({ n: `${s.app.merged.length}`, unit: '', label: [`merged into ${s.app.defaultBranch} since ${sinceText}`], src: 'merged pull requests on GitHub', tone: 'ok' });

  // the plan to the tag: one column per day from the first step to the last
  const plan: Step[] = c.plan.map((st) => ({
    kind: st.kind,
    tone: st.tone,
    from: st.from,
    to: st.to,
    title: rich(ctx, st.title),
    ...(st.who ? { who: st.who } : {}),
    what: rich(ctx, st.what),
  }));
  const days: string[] = [];
  if (plan.length) {
    const first = plan.map((p) => p.from).sort()[0];
    const last = plan.map((p) => p.to).sort().pop()!;
    for (let d = first; d <= last; d = addDays(d, 1)) days.push(d);
  }

  const landed: Landed[] = [...s.app.merged]
    .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt) || b.number - a.number)
    .map((p) => ({ at: p.mergedAt, when: `${day(p.mergedAt)} ${hm(p.mergedAt)}`, n: p.number, href: p.url, title: p.title.replace(/^[a-z]+(\([^)]*\))?!?:\s*/i, ''), who: nameOf(ctx, p.author) }));

  const links: ReleaseBoard['links'] = c.links.map((l) => {
    const m = /^meeting:([\w-]+)(?:#(.+))?$/.exec(l.href) ?? DS_MEETING.exec(l.href);
    return m ? { text: l.text, meeting: m[1], ...(m[2] ? { anchor: m[2] } : {}) } : { text: l.text, href: l.href };
  });
  links.push({ text: `Milestone ${ms.number}, ${versionOf(ms.title)}`, href: msLink });
  links.push({ text: 'Open PRs of the release', href: `${gh}/pulls?q=${encodeURIComponent(`is:pr is:open milestone:"${ms.title}"`)}` });
  if (c.app.heavyWorkflow) links.push({ text: 'Heavy test runs', href: `${gh}/actions/workflows/${c.app.heavyWorkflow}` });
  if (s.app.nextMilestone) links.push({ text: `Next: milestone ${s.app.nextMilestone.number}, ${versionOf(s.app.nextMilestone.title)}`, href: s.app.nextMilestone.url });
  if (s.wrapper) links.push({ text: 'Desktop wrapper', href: `https://github.com/${s.wrapper.repo}` });

  return {
    schema: 1,
    slug: c.slug,
    title: c.title,
    version: versionOf(ms.title),
    milestone: { text: `milestone ${ms.number}`, href: msLink, state: ms.state },
    measuredAt: nowIso,
    measuredLine: `${day(nowIso)} at ${hm(nowIso)}`,
    timeZone: TIME_ZONE,
    kpis,
    streams,
    legend: [
      'Each chip: the PR or issue (to GitHub), its state on GitHub (hover for the review, the CI and who holds the next step), ',
      ...(c.app.heavyWorkflow ? [{ text: 'H', strong: true } as Inline, ' a heavy run at its current head (solid green when green, red when red, dashed when none), '] : []),
      'and its author, or for an issue its assignees. Every item of the release: ',
      { text: `milestone ${ms.number} on GitHub`, href: msLink },
      '.',
    ],
    days,
    plan,
    decided: rich(ctx, c.decided),
    rules: c.rules.map((r) => rich(ctx, r)),
    calls: c.calls.map((r) => rich(ctx, r)),
    landedSince: sinceText,
    landed,
    links,
    footer: `Derived from GitHub: which items are in the release, their workstreams, states, holders and every number. The plan, the rules, the calls and the notes are the team's, in content/releases/${c.slug}.release.yaml. A wrong board is fixed on GitHub (the milestone, one ${c.labelPrefix} label per item) or in that file, never in the generated JSON.`,
  };
}

/** The board without its measurement instant: two runs over the same GitHub state compare equal on this. */
export const content = (b: ReleaseBoard) => JSON.stringify({ ...b, measuredAt: undefined, measuredLine: undefined });

/** Every #N a release file's notes mention, so the fetcher can look them up. */
export function referencedNumbers(c: ReleaseConfig): number[] {
  const texts = [c.decided, ...c.rules, ...c.calls, c.desktopNote, ...Object.values(c.streams).map((s) => s.note), ...c.plan.flatMap((p) => [p.title, p.what])];
  const out = new Set<number>();
  for (const t of texts) for (const m of t.matchAll(INLINE)) if (m[4]) out.add(Number(m[4]));
  return [...out].sort((a, b) => a - b);
}
