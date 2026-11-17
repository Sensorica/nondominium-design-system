// The derivation, on recorded snapshots: fixtures/v0-1-0.snapshot.json is Sensorica/nondominium as
// it was on 16 November 2026, fixtures/cases.snapshot.json the edge cases the live data does not hold
// today (open PRs, reviews, stacks, heavy runs, a desktop wrapper).
// Run: bun test scripts/release-board

import { describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Chip, ReleaseBoard, Rich, Stream } from '../../src/lib/releases/types';
import { ConfigError, parseConfig } from './config';
import { content, derive } from './derive';
import type { Snapshot } from './snapshot';

const F = join(import.meta.dir, 'fixtures');
const read = (f: string) => readFileSync(join(F, f), 'utf8');
const snapshot = (f: string): Snapshot => JSON.parse(read(f));
const cases = parseConfig(read('cases.release.yaml'));
const NOW = new Date('2026-11-15T15:00:00Z');
const board = (s = snapshot('cases.snapshot.json'), now = NOW) => derive(s, cases, now);
const text = (r: Rich) => r.map((x) => (typeof x === 'string' ? x : x.text)).join('');
const stream = (b: ReleaseBoard, id: string) => b.streams.find((s) => s.id === id) as Stream;
const chip = (s: Stream, label: string) => s.chips.find((c) => c.label === label) as Chip;

describe('which workstream an item is in', () => {
  test('an item with no workstream label, or two, is in the unsorted card, first, saying what to fix', () => {
    const b = board();
    expect(b.streams[0].id).toBe('unsorted');
    const u = stream(b, 'unsorted');
    expect(u.chips.map((c) => c.label)).toEqual(['#16', '#17', '#20']);
    expect(chip(u, '#16').state).toBe('no workstream');
    expect(chip(u, '#17').state).toBe('two workstreams');
    expect(chip(u, '#20').state).toBe('no workstream');
    expect(text(u.next)).toBe('#16: add one drop: label; #17: keep one of drop:one, drop:two; #20: add one drop: label.');
    expect(u.tag).toBe('3 to sort');
  });

  test('no unsorted card when every item has exactly one label', () => {
    const s = snapshot('cases.snapshot.json');
    s.app.prs = s.app.prs.filter((p) => p.number < 16);
    s.app.issues = s.app.issues.filter((i) => i.number !== 20);
    expect(board(s).streams.map((x) => x.id)).not.toContain('unsorted');
  });

  test('cards follow the release file, then the other labels in use, then the desktop', () => {
    expect(board().streams.map((s) => s.id)).toEqual(['unsorted', 'one', 'empty', 'two', 'desktop']);
  });

  test('a stream takes its title and why from the label on GitHub', () => {
    const b = board();
    expect(stream(b, 'one').title).toBe('One');
    expect(text(stream(b, 'one').why)).toBe('The first stream.');
    expect(text(stream(b, 'two').why)).toBe('The drop:two label has no description on GitHub.');
    expect(stream(b, 'empty').tag).toBe('nothing open');
    expect(text(stream(b, 'empty').holds)).toBe('Nobody: nothing open');
  });
});

describe('a chip', () => {
  const one = stream(board(), 'one');
  const two = stream(board(), 'two');

  test('PRs are in stack order: a PR right after the one its branch is based on', () => {
    expect(one.chips.map((c) => c.label)).toEqual(['#10', '#11', '#12', '#21']);
  });

  test('a draft with changes requested says both', () => {
    expect(chip(one, '#12')).toMatchObject({ state: 'draft, changes asked', kind: 'draft', who: 'Bob' });
  });

  test('a Request Changes the head moved past is stale, and the reviewer holds it', () => {
    expect(chip(two, '#13')).toMatchObject({ state: 'changes asked', kind: 'changes' });
    expect(chip(two, '#14')).toMatchObject({ state: 'changes, stale', kind: 'changes' });
    expect(chip(two, '#14').stateTitle).toContain('head now eeee5555');
    expect(chip(two, '#14').stateTitle).toContain('next: Alice re-reviews');
  });

  test('an approval with a red CI says so', () => {
    expect(chip(two, '#15')).toMatchObject({ state: 'approved, CI red', kind: 'ok' });
  });

  test('the heavy mark is the latest finished run at the current head; a cancelled run is none', () => {
    expect(chip(one, '#10').heavy?.result).toBe('ok');
    expect(chip(one, '#11').heavy?.result).toBe('none');
    expect(chip(two, '#13').heavy?.result).toBe('bad');
  });

  test('an issue names its assignees, or says unassigned', () => {
    expect(chip(one, '#21')).toMatchObject({ kind: 'issue', who: 'Alice and Carol' });
    expect(chip(stream(board(), 'unsorted'), '#20').who).toBe('unassigned');
  });
});

describe('who holds the next step', () => {
  test('feat waits on the other maintainer; fix is merged by its author; a draft is its author’s', () => {
    const one = stream(board(), 'one');
    expect(text(one.holds)).toBe('Bob (2), Alice (1)');
    expect(text(one.next)).toBe('Bob reviews #10; takes #12 out of draft. Alice merges #11. Ships first.decided');
    expect(one.next.at(-1)).toEqual({ text: 'decided', meeting: '2026-11-11-dev', anchor: 'decisions-1', cite: true });
  });

  test('changes at the head are the author’s, stale ones the reviewer’s, a red approved PR its author’s to make green', () => {
    const two = stream(board(), 'two');
    expect(text(two.next)).toBe('Bob answers the changes asked on #13; makes CI green on #15. Alice re-reviews #14.');
    expect(two.tag).toBe('2 changes asked · 1 ready');
    expect(two.tone).toBe('bad');
  });
});

describe('the desktop wrapper', () => {
  test('a wrapper on another Holochain line does not pair, and says so plainly', () => {
    const d = stream(board(), 'desktop');
    expect(d.tone).toBe('bad');
    expect(d.tag).toBe('does not pair');
    expect(text(d.pairing!.verdict)).toBe("No. A tag pushed now stops at the pairing check: the hApp is on Holochain 0.7 and the wrapper's release branch bundles 0.6.1.");
    const pr = d.pairing!.rows.find((r) => r.label === 'wrapper #7')!;
    expect(pr.tone).toBe('warn');
    expect(text(pr.value)).toContain('targets main (releases build from release)');
    expect(text(pr.value)).toContain('Holochain 0.7.0');
    expect(chip(d, 'wrapper #7')).toMatchObject({ state: 'ready', who: 'Alice' });
    expect(text(d.next)).toBe('Alice merges wrapper #7.');
  });

  test('a paired wrapper builds; a package.json behind the tag is not yet', () => {
    const s = snapshot('cases.snapshot.json');
    s.wrapper!.releaseConfig!.holochainVersion = '0.7.2';
    expect(text(board(s).streams.find((x) => x.id === 'desktop')!.pairing!.verdict)).toStartWith('Yes.');
    s.app.packageVersion = '1.1.0';
    expect(text(board(s).streams.find((x) => x.id === 'desktop')!.pairing!.verdict)).toStartWith('Not yet.');
  });

  test('no wrapper in the release file, no desktop card', () => {
    const s = snapshot('cases.snapshot.json');
    s.wrapper = null;
    expect(board(s).streams.map((x) => x.id)).not.toContain('desktop');
  });
});

describe('the numbers, the plan and the lists', () => {
  test('days to the tag come from the due date, read in Montreal', () => {
    expect(board().kpis[0]).toMatchObject({ n: '2', unit: 'days', tone: 'bad' });
    expect(text(board().kpis[0].label)).toBe('to the tag, Tuesday 17 November');
    expect(board(undefined, new Date('2026-11-12T15:00:00Z')).kpis[0]).toMatchObject({ n: '5', tone: 'warn' });
    expect(text(board(undefined, new Date('2026-11-19T15:00:00Z')).kpis[0].label)).toBe('past the due date, Tuesday 17 November');
  });

  test('a closed milestone reads closed', () => {
    const s = snapshot('cases.snapshot.json');
    s.app.milestone.state = 'closed';
    s.app.milestone.closedAt = '2026-11-18T02:00:00Z';
    const b = board(s);
    expect(b.milestone.state).toBe('closed');
    expect(b.kpis[0]).toMatchObject({ n: 'closed', tone: 'ok' });
    expect(text(b.kpis[0].label)).toBe('milestone closed on Tuesday 17 November');
  });

  test('the other numbers', () => {
    const [, items, open, changes, heavy, merged] = board().kpis;
    expect(items).toMatchObject({ n: '3/12', unit: '25%', bar: 0.25 });
    expect(open).toMatchObject({ n: '8', unit: 'open', tone: 'warn' });
    expect(text(open.label)).toBe('PRs on the milestone, 1 still a draft');
    expect(text(changes.label)).toBe('with Request Changes standing: #12, #13, #14');
    expect(heavy.n).toBe('1/8');
    expect(text(merged.label)).toBe('merged into dev since v1.1.0, 1 Oct');
  });

  test('landed is newest first, the commit type stripped, the author named', () => {
    const b = board();
    expect(b.landed.map((l) => l.n)).toEqual([6, 5]);
    expect(b.landed[0]).toMatchObject({ title: 'the latest merge', who: 'Carol', when: '13 Nov 22:30' });
    expect(b.landedSince).toBe('v1.1.0, 1 Oct');
  });

  test('the plan spans its first day to its last; notes become typed runs', () => {
    const b = board();
    expect(b.days).toEqual(['2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17']);
    expect(b.plan[0].what).toEqual([
      { text: 'All', strong: true },
      ' of ',
      { text: '#10', href: 'https://github.com/example/app/pull/10', title: 'feat(x): a feature nobody reviewed' },
      ' and ',
      { text: 'the spec', href: 'https://example.org/spec' },
      '.',
    ]);
    expect(b.plan[1].title).toEqual([
      'Tag',
      { text: 'decided 11 Nov', meeting: '2026-11-11-dev', anchor: 'decisions-1', cite: true },
      { text: 'and here', meeting: '2026-11-11-dev', anchor: 'decisions-2', cite: true },
    ]);
    expect(b.decided).toEqual(['Agreed at the ', { text: 'dev meeting', meeting: '2026-11-11-dev' }, ':']);
    expect(b.rules[0][0]).toEqual({ text: '#99', href: 'https://github.com/example/app/issues/99', title: 'Out of scope' });
    expect(b.links[0]).toEqual({ text: 'Meeting', meeting: '2026-11-11-dev', anchor: 'actions-1' });
  });

  test('the board is complete with every note empty', () => {
    const bare = parseConfig('slug: bare\ntitle: "Bare"\napp:\n  repo: example/app\n  milestone: 3\nmaintainers:\n  alice: Alice\n  bob: Bob\n');
    const s = snapshot('cases.snapshot.json');
    s.wrapper = null; // a release file with no wrapper is fetched with none
    const b = derive(s, bare, NOW);
    // a label nobody uses and the file does not name has no card
    expect(b.streams.map((x) => x.id)).toEqual(['unsorted', 'one', 'two']);
    expect(b.plan).toEqual([]);
    expect(b.days).toEqual([]);
    expect(b.kpis).toHaveLength(5); // no heavy-workflow in the bare file, so no heavy number
  });
});

describe('the same GitHub, the same board', () => {
  test('two derivations differ only in their measurement instant', () => {
    const a = board(undefined, new Date('2026-11-15T15:00:00Z'));
    const b = board(undefined, new Date('2026-11-15T16:30:00Z'));
    expect(a.measuredAt).not.toBe(b.measuredAt);
    expect(content(a)).toBe(content(b));
  });

  test('the CLI leaves an unchanged board untouched, and --force rewrites only the instant', () => {
    const dir = mkdtempSync(join(tmpdir(), 'release-board-'));
    copyFileSync(join(F, 'cases.release.yaml'), join(dir, 'cases.release.yaml'));
    const run = (...extra: string[]) => {
      const r = Bun.spawnSync(['bun', join(import.meta.dir, '..', 'release-board.ts'), '--dir', dir, '--from', join(F, 'cases.snapshot.json'), '--json', ...extra], { stdout: 'pipe', stderr: 'pipe' });
      expect(r.stderr.toString()).toBe('');
      return JSON.parse(r.stdout.toString());
    };
    const out = join(dir, 'cases.json');
    expect(run().results[0].result).toBe('written');
    const first = readFileSync(out, 'utf8');
    expect(run().results[0].result).toBe('unchanged');
    expect(readFileSync(out, 'utf8')).toBe(first);
    run('--force');
    const strip = (t: string) => t.replace(/"measuredAt": "[^"]+"/, '').replace(/"measuredLine": "[^"]+"/, '');
    expect(strip(readFileSync(out, 'utf8'))).toBe(strip(first));
  });
});

describe('the live v0.1.0 snapshot', () => {
  const live = snapshot('v0-1-0.snapshot.json');
  const config = parseConfig(readFileSync(join(import.meta.dir, '../../content/releases/v0-1-0.release.yaml'), 'utf8'));
  const LIVE_NOW = new Date('2026-11-16T23:30:00Z');
  const b = derive(live, config, LIVE_NOW);

  test('the board reads milestone 11, v0.1.0, due Tuesday 15 December', () => {
    expect(b.version).toBe('v0.1.0');
    expect(b.milestone).toEqual({ text: 'milestone 11', href: 'https://github.com/Sensorica/nondominium/milestone/11', state: 'open' });
    expect(b.kpis[0]).toMatchObject({ n: '29', unit: 'days' });
    expect(text(b.kpis[0].label)).toBe('to the tag, Tuesday 15 December');
  });

  test('every open PR and issue of the milestone is on exactly one card', () => {
    const labels = b.streams.filter((s) => s.id !== 'desktop').flatMap((s) => s.chips.map((c) => c.label));
    const expected = [...live.app.prs, ...live.app.issues].map((i) => `#${i.number}`);
    expect(labels.sort()).toEqual(expected.sort());
  });

  test('no item carries a drop: label yet, so all of them are on the unsorted card, and no stream is configured', () => {
    expect(live.app.labels).toEqual([]);
    expect(b.streams.map((s) => s.id)).toEqual(['unsorted']);
    const u = stream(b, 'unsorted');
    expect(u.chips.every((c) => c.state === 'no workstream')).toBe(true);
    expect(text(u.holds)).toBe('Any maintainer: Soushi and Tibi');
    expect(text(u.next)).toStartWith('#121: add one drop: label;');
  });

  test('no wrapper and no heavy workflow: no desktop card, no H mark, no heavy number or link', () => {
    expect(live.wrapper).toBeNull();
    expect(b.streams.map((s) => s.id)).not.toContain('desktop');
    expect(b.streams.flatMap((s) => s.chips).some((c) => c.heavy)).toBe(false);
    expect(b.kpis.map((k) => k.src)).not.toContain(expect.stringContaining('runs on GitHub'));
    expect(b.kpis).toHaveLength(5);
    expect(b.links.map((l) => l.text)).not.toContain('Heavy test runs');
    expect(text(b.legend)).not.toContain('heavy run');
  });

  test('the first release lists every merge into dev since the start', () => {
    expect(live.app.previousRelease).toBeNull();
    expect(b.landedSince).toBe('the start');
    expect(b.landed).toHaveLength(live.app.merged.length);
    expect(text(b.kpis.at(-1)!.label)).toBe('merged into dev since the start');
  });

  test('every link goes to GitHub or to a meeting of this site', () => {
    const runs = [...b.kpis.flatMap((k) => k.label), ...b.streams.flatMap((s) => [...s.why, ...s.holds, ...s.next]), ...b.plan.flatMap((p) => [...p.title, ...p.what]), ...b.rules.flat(), ...b.calls.flat(), ...b.decided];
    for (const r of runs) if (typeof r !== 'string' && 'href' in r) expect(r.href).toStartWith('https://github.com/');
    for (const c of b.streams.flatMap((s) => s.chips)) expect(c.href).toStartWith('https://github.com/');
    expect(b.rules[0].at(-1)).toEqual({ text: 'decided 27 Oct', meeting: '2026-10-27-dev', anchor: 'decisions-6', cite: true });
  });
});

describe('a repo with no heavy workflow', () => {
  test('the cases board without one loses the H mark, its number and its link, and nothing else', () => {
    const without = { ...cases, app: { ...cases.app, heavyWorkflow: null } };
    const a = board();
    const b = derive(snapshot('cases.snapshot.json'), without, NOW);
    expect(a.kpis).toHaveLength(6);
    expect(b.kpis).toHaveLength(5);
    expect(b.streams.flatMap((s) => s.chips).some((c) => c.heavy)).toBe(false);
    expect(b.streams.map((s) => s.id)).toEqual(a.streams.map((s) => s.id));
    expect(b.streams.map((s) => text(s.next))).toEqual(a.streams.map((s) => text(s.next)));
  });

  test('a release file without heavy-workflow reads as none, not as a default file name', () => {
    expect(parseConfig('slug: x\ntitle: X\napp:\n  repo: a/b\n  milestone: 1\nmaintainers:\n  a: A\n').app.heavyWorkflow).toBeNull();
  });
});

describe('the release file', () => {
  test('a note YAML did not read as text names the field and how to fix it', () => {
    expect(() => parseConfig('slug: x\ntitle: X\napp:\n  repo: a/b\n  milestone: 1\nmaintainers:\n  a: A\nrules:\n  - [1, 2]\n')).toThrow(ConfigError);
    expect(() => parseConfig('slug: x\ntitle: X\napp:\n  repo: a/b\n  milestone: 1\nmaintainers:\n  a: A\nrules:\n  - [1, 2]\n')).toThrow(/rules\[1\].*double quotes/);
  });

  test('a date that is not YYYY-MM-DD is refused', () => {
    expect(() => parseConfig('slug: x\ntitle: X\napp:\n  repo: a/b\n  milestone: 1\nmaintainers:\n  a: A\nplan:\n  - from: "17 Nov"\n    title: T\n')).toThrow(/plan\[1\]\.from/);
  });

  test('a note YAML read as a comment is dropped, not crashed on, and the docs say to quote it', () => {
    const c = parseConfig('slug: x\ntitle: X\napp:\n  repo: a/b\n  milestone: 1\nmaintainers:\n  a: A\ncalls:\n  - #412 is open\n  - "#412 is open"\n');
    expect(c.calls).toEqual(['#412 is open']);
  });
});
