// The one hand-written input of a release board: content/releases/<slug>.release.yaml.
// Everything GitHub knows is derived (derive.ts); this file holds only what GitHub
// cannot know: which milestone and wrapper to read, the plan, and the team's notes.
// Parsing is strict and its errors name the field, because the file is edited on
// github.com by people who should not have to read a stack trace.

import type { Tone } from '../../src/lib/releases/types';

export type PlanStepConfig = {
  from: string;
  to: string;
  kind: 'phase' | 'milestone';
  tone: Tone;
  title: string;
  who?: string;
  what: string;
};

export type StreamNote = { note: string };

export type ReleaseConfig = {
  slug: string;
  title: string;
  /** heavyWorkflow: the file name of the manual heavy-test workflow, or null for a repo that has none. */
  app: { repo: string; milestone: number; heavyWorkflow: string | null };
  wrapper?: { repo: string; releaseBranch: string; prs: number[] };
  /** GitHub login -> the name the board shows. The maintainers are the people who review each other. */
  maintainers: Record<string, string>;
  /** Workstream labels start with this prefix. */
  labelPrefix: string;
  /** Workstream label -> optional note; the order here is the order of the cards. */
  streams: Record<string, StreamNote>;
  desktopNote: string;
  plan: PlanStepConfig[];
  decided: string;
  rules: string[];
  calls: string[];
  links: { text: string; href: string }[];
};

const TONES: Tone[] = ['ok', 'warn', 'bad', 'accent'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REPO = /^[\w.-]+\/[\w.-]+$/;

export class ConfigError extends Error {}

const fail = (file: string, field: string, why: string): never => {
  throw new ConfigError(`${file}: ${field}: ${why}`);
};

/** A note may be missing or empty; a note that YAML read as something else (a `#` at the start makes the rest a comment) is an error. */
const text = (file: string, field: string, v: unknown, required = false): string => {
  if (v === undefined || v === null) {
    if (required) fail(file, field, 'is required');
    return '';
  }
  if (typeof v === 'number') return String(v);
  if (typeof v !== 'string') fail(file, field, `must be text, found ${JSON.stringify(v)}; put the text in double quotes`);
  return (v as string).trim();
};

const list = (file: string, field: string, v: unknown): string[] => {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) fail(file, field, 'must be a list, each item on its own line starting with "- "');
  return (v as unknown[]).map((x, i) => text(file, `${field}[${i + 1}]`, x)).filter(Boolean);
};

export function parseConfig(source: string, file = 'release.yaml'): ReleaseConfig {
  let raw: any;
  try {
    raw = Bun.YAML.parse(source);
  } catch (e) {
    throw new ConfigError(`${file}: not valid YAML: ${(e as Error).message}`);
  }
  if (!raw || typeof raw !== 'object') fail(file, '(file)', 'is empty');

  const slug = text(file, 'slug', raw.slug, true);
  if (!/^[a-z0-9-]+$/.test(slug)) fail(file, 'slug', 'lowercase letters, digits and dashes only');

  const app = raw.app ?? {};
  const repo = text(file, 'app.repo', app.repo, true);
  if (!REPO.test(repo)) fail(file, 'app.repo', 'must read owner/name');
  const milestone = Number(app.milestone);
  if (!Number.isInteger(milestone) || milestone < 1) fail(file, 'app.milestone', 'must be the milestone number on GitHub');

  let wrapper: ReleaseConfig['wrapper'];
  if (raw.wrapper) {
    const w = raw.wrapper;
    const wrepo = text(file, 'wrapper.repo', w.repo, true);
    if (!REPO.test(wrepo)) fail(file, 'wrapper.repo', 'must read owner/name');
    const prs = w.prs === undefined || w.prs === null ? [] : Array.isArray(w.prs) ? w.prs : [w.prs];
    wrapper = {
      repo: wrepo,
      releaseBranch: text(file, 'wrapper.release-branch', w['release-branch']) || 'release',
      prs: prs.map((n: unknown, i: number) => {
        const k = Number(n);
        if (!Number.isInteger(k) || k < 1) fail(file, `wrapper.prs[${i + 1}]`, 'must be a pull request number');
        return k;
      }),
    };
  }

  const maintainers: Record<string, string> = {};
  for (const [login, name] of Object.entries(raw.maintainers ?? {})) maintainers[login] = text(file, `maintainers.${login}`, name, true);
  if (Object.keys(maintainers).length === 0) fail(file, 'maintainers', 'name at least one GitHub login and the name the board shows for it');

  const streams: Record<string, StreamNote> = {};
  for (const [label, v] of Object.entries(raw.streams ?? {})) {
    const note = v && typeof v === 'object' ? (v as any).note : v;
    streams[label] = { note: text(file, `streams.${label}.note`, note) };
  }

  const plan = (Array.isArray(raw.plan) ? raw.plan : raw.plan ? fail(file, 'plan', 'must be a list of steps') : []).map((st: any, i: number) => {
    const f = `plan[${i + 1}]`;
    const from = text(file, `${f}.from`, st?.from, true);
    const to = text(file, `${f}.to`, st?.to) || from;
    if (!DATE.test(from)) fail(file, `${f}.from`, 'must be a date written YYYY-MM-DD, in quotes');
    if (!DATE.test(to)) fail(file, `${f}.to`, 'must be a date written YYYY-MM-DD, in quotes');
    if (to < from) fail(file, `${f}.to`, 'is before from');
    const kind = text(file, `${f}.kind`, st.kind) || (from === to && !st.what ? 'milestone' : 'phase');
    if (kind !== 'phase' && kind !== 'milestone') fail(file, `${f}.kind`, 'is phase or milestone');
    const tone = (text(file, `${f}.tone`, st.tone) || 'accent') as Tone;
    if (!TONES.includes(tone)) fail(file, `${f}.tone`, `is one of ${TONES.join(', ')}`);
    const who = text(file, `${f}.who`, st.who);
    return { from, to, kind, tone, title: text(file, `${f}.title`, st.title, true), ...(who ? { who } : {}), what: text(file, `${f}.what`, st.what) } as PlanStepConfig;
  });

  const links = (Array.isArray(raw.links) ? raw.links : []).map((l: any, i: number) => ({
    text: text(file, `links[${i + 1}].text`, l?.text, true),
    href: text(file, `links[${i + 1}].href`, l?.href, true),
  }));

  return {
    slug,
    title: text(file, 'title', raw.title, true),
    app: { repo, milestone, heavyWorkflow: text(file, 'app.heavy-workflow', app['heavy-workflow']) || null },
    ...(wrapper ? { wrapper } : {}),
    maintainers,
    labelPrefix: text(file, 'label-prefix', raw['label-prefix']) || 'drop:',
    streams,
    desktopNote: text(file, 'desktop.note', raw.desktop?.note),
    plan,
    decided: text(file, 'decided', raw.decided),
    rules: list(file, 'rules', raw.rules),
    calls: list(file, 'calls', raw.calls),
    links,
  };
}
