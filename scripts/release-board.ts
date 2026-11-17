/**
 * release-board.ts: derive every release board from GitHub (docs/RELEASE_BOARD.md).
 *
 *   bun scripts/release-board.ts [slug ...] [--force] [--record <dir>] [--from <snapshot.json>] [--summary <file>] [--json]
 *
 * For each content/releases/<slug>.release.yaml (or only the slugs named), reads GitHub and
 * writes content/releases/<slug>.json. A board whose content did not change, its measurement
 * instant aside, is left as it is on disk, so `git diff` says whether anything moved.
 * A board whose milestone was already closed when it was last written is final and skipped.
 *
 *   --force          write even when nothing changed, and re-derive a closed release
 *   --record <dir>   also write what GitHub said as <dir>/<slug>.snapshot.json (a test fixture)
 *   --from <file>    derive from a recorded snapshot instead of GitHub (one slug)
 *   --summary <file> append `changed=` and `active=` lines (for $GITHUB_OUTPUT)
 *   --json           print the result as JSON
 *   --dir <dir>      read and write another folder than content/releases (tests)
 *
 * Token: GH_TOKEN or GITHUB_TOKEN, else `gh auth token`.
 */
import { existsSync, appendFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parseConfig } from './release-board/config';
import { content, derive } from './release-board/derive';
import { fetchSnapshot } from './release-board/github';
import type { Snapshot } from './release-board/snapshot';
import type { ReleaseBoard } from '../src/lib/releases/types';

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const value = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const valued = new Set(['--record', '--from', '--summary', '--dir']);
const DIR = resolve(value('--dir') ?? resolve(import.meta.dir, '../content/releases'));
const slugs = args.filter((a, i) => !a.startsWith('--') && !valued.has(args[i - 1] ?? ''));
const force = flag('--force');
const record = value('--record');
const from = value('--from');

const files = readdirSync(DIR).filter((f) => f.endsWith('.release.yaml')).sort();
const chosen = slugs.length ? files.filter((f) => slugs.includes(f.replace(/\.release\.yaml$/, ''))) : files;
if (slugs.length && chosen.length !== slugs.length) {
  console.error(`no content/releases/<slug>.release.yaml for: ${slugs.filter((s) => !files.includes(`${s}.release.yaml`)).join(', ')}`);
  process.exit(2);
}
if (from && chosen.length !== 1) {
  console.error('--from replays one snapshot: name exactly one slug');
  process.exit(2);
}

type Result = { slug: string; result: 'written' | 'unchanged' | 'final'; milestone: 'open' | 'closed'; out: string };
const results: Result[] = [];
const now = new Date();

for (const file of chosen) {
  const config = parseConfig(readFileSync(join(DIR, file), 'utf8'), `content/releases/${file}`);
  const out = join(DIR, `${config.slug}.json`);
  const shown = relative(process.cwd(), out);
  const before: ReleaseBoard | null = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null;
  if (before?.milestone.state === 'closed' && !force && !from) {
    results.push({ slug: config.slug, result: 'final', milestone: 'closed', out: shown });
    continue;
  }
  const snapshot: Snapshot = from ? JSON.parse(readFileSync(from, 'utf8')) : await fetchSnapshot(config);
  if (record) {
    mkdirSync(record, { recursive: true });
    writeFileSync(join(record, `${config.slug}.snapshot.json`), JSON.stringify(snapshot, null, 2) + '\n');
  }
  const board = derive(snapshot, config, now);
  const same = before !== null && content(before) === content(board);
  if (!same || force) writeFileSync(out, JSON.stringify(board, null, 2) + '\n');
  results.push({ slug: config.slug, result: same && !force ? 'unchanged' : 'written', milestone: board.milestone.state ?? 'open', out: shown });
}

const changed = results.some((r) => r.result === 'written');
const active = results.filter((r) => r.milestone === 'open').length;
const summary = value('--summary');
if (summary) appendFileSync(summary, `changed=${changed}\nactive=${active}\n`);
if (flag('--json')) console.log(JSON.stringify({ changed, active, results }, null, 2));
else for (const r of results) console.log(`${r.slug}: ${r.result} (milestone ${r.milestone})`);
