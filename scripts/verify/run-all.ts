// Runs every functional/behaviour verification script in this folder and
// reports a pass count for each (ISA Phase 9 claim 40).
//
//   bun run verify:prototypes
//
// These are NOT fidelity checks (compare:prototypes owns pixel/layout
// comparison); each script here drives real Chrome (playwright-core) to
// prove a control has the same EFFECT ON STATE on both sides, or that a
// direction's own controls work at all.
//
// Two prerequisites this script does not manage:
//   - the design-system dev server on DS_URL (default http://localhost:5180)
//     must already be running (`bun run dev`); every script here reads it,
//     none starts it.
//   - four scripts (field-notes, mycelium, bbox-proof, signal-board-bbox)
//     also compare against the Claude Design original, so this script starts
//     one static server for docs/prototypes/original and points ORIG_BASE at
//     it for exactly those four; the rest never read ORIG_BASE.
//
// NETWORK DEPENDENCY: the original side loads real Google Fonts and the
// React/Babel standalone builds from unpkg.com at runtime (see the header of
// scripts/compare-prototypes.ts), so this needs internet access to be
// meaningful for those four scripts.
import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dir, '../..');
const ORIGINALS = join(ROOT, 'docs/prototypes/original');
const ORIG_SERVER_PORT = Number(process.env.VERIFY_ORIG_PORT ?? 8798);
const ORIG_BASE = `http://localhost:${ORIG_SERVER_PORT}/prototypes`;
const DS_URL = process.env.DS_URL ?? 'http://localhost:5180';

/** Scripts that compare the port against the live original, and so need
 *  ORIG_BASE pointed at this run's static server. Every other script below
 *  only exercises the port against itself (DS_URL). */
const NEEDS_ORIGINAL = new Set(['field-notes.mjs', 'mycelium.mjs', 'bbox-proof.ts', 'signal-board-bbox.ts']);

const SCRIPTS = [
  'mycelium.mjs',
  'field-notes.mjs',
  'holarchy.mjs',
  'signal-board.mjs',
  'flow-graph.mjs',
  'instrument.mjs',
  'shared-box.mjs',
  'bbox-proof.ts',
  'signal-board-bbox.ts',
  'flow-graph-scenario-agents.ts'
];

function serveOriginals() {
  return Bun.serve({
    port: ORIG_SERVER_PORT,
    async fetch(req) {
      const path = decodeURIComponent(new URL(req.url).pathname);
      const file = Bun.file(join(ORIGINALS, path.endsWith('/') ? path + 'index.html' : path));
      return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
    }
  });
}

interface RunResult {
  script: string;
  exitCode: number;
  pass?: number;
  total?: number;
}

async function runOne(script: string): Promise<RunResult> {
  const env = { ...process.env, DS_URL };
  if (NEEDS_ORIGINAL.has(script)) env.ORIG_BASE = ORIG_BASE;
  console.log(`\n── ${script} ${'─'.repeat(Math.max(0, 60 - script.length))}`);
  const child = spawn('bun', [join(import.meta.dir, script)], { cwd: ROOT, env });
  let out = '';
  child.stdout.on('data', (d) => {
    process.stdout.write(d);
    out += d.toString();
  });
  child.stderr.on('data', (d) => {
    process.stderr.write(d);
    out += d.toString();
  });
  const exitCode: number = await new Promise((res) => child.on('close', (code) => res(code ?? 1)));
  // Every script here ends by printing "N/M <label>" (checks passed, controls
  // verified, modals within tolerance); bbox-proof.ts prints only a sentence
  // instead. Take the LAST such match rather than hardcoding each script's
  // own wording.
  const matches = [...out.matchAll(/(\d+)\/(\d+)/g)];
  const last = matches.at(-1);
  return last
    ? { script, exitCode, pass: Number(last[1]), total: Number(last[2]) }
    : { script, exitCode };
}

async function main() {
  const originals = serveOriginals();
  const results: RunResult[] = [];
  try {
    for (const script of SCRIPTS) {
      results.push(await runOne(script));
    }
  } finally {
    originals.stop(true);
  }

  console.log('\n\n══ verify:prototypes summary ══');
  for (const r of results) {
    const counted = r.pass != null ? `${r.pass}/${r.total}` : `exit ${r.exitCode}`;
    console.log(`${r.exitCode === 0 ? '✓' : '✗'} ${r.script}  ${counted}`);
  }
  const totalPass = results.reduce((a, r) => a + (r.pass ?? (r.exitCode === 0 ? 1 : 0)), 0);
  const totalOf = results.reduce((a, r) => a + (r.total ?? 1), 0);
  const failed = results.filter((r) => r.exitCode !== 0);
  console.log(`\n${totalPass}/${totalOf} checks passed across ${results.length} scripts.`);
  process.exit(failed.length ? 1 : 0);
}

await main();
