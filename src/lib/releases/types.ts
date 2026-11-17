// The data a release board is rendered from. It is generated, never written by hand:
// `bun scripts/release-board.ts` reads content/releases/<slug>.release.yaml, derives
// everything else from GitHub and writes content/releases/<slug>.json in this shape
// (docs/RELEASE_BOARD.md). Bump `schema` on any breaking change.

/** How a card, a stat or a timeline step reads: done, at risk, blocked, or neutral. */
export type Tone = 'ok' | 'warn' | 'bad' | 'accent';

/**
 * One run of inline text. A link is either absolute (GitHub, opened as is) or a
 * meeting of this site, resolved through `paths.meeting(slug)` so it follows the base.
 * `cite` marks the short source link set after a sentence ("decided 11 Nov ›").
 */
export type Inline =
  | string
  | { text: string; strong: true }
  | { text: string; href: string; title?: string }
  | { text: string; meeting: string; anchor?: string; cite?: boolean };

export type Rich = Inline[];

export type Kpi = { n: string; unit: string; label: Rich; src: string; tone: Tone; bar?: number };

/** A PR or issue chip: its GitHub state, and for a PR the heavy run at its head. */
export type Chip = {
  label: string;
  href?: string;
  title?: string;
  state: string;
  stateTitle?: string;
  kind: 'changes' | 'draft' | 'ready' | 'ok' | 'merged' | 'issue' | 'wip' | 'none';
  heavy?: { result: 'ok' | 'bad' | 'none'; title: string };
  who?: string;
};

/** One line of the desktop pairing check: what the app says, what the wrapper says, and whether they agree. */
export type PairingRow = { label: string; value: Rich; tone: Tone };

/** Whether a tag pushed now would build a desktop app, read from the wrapper's release branch. */
export type Pairing = { verdict: Rich; tone: Tone; rows: PairingRow[] };

export type Stream = { id: string; title: string; tone: Tone; tag: string; why: Rich; chips: Chip[]; holds: Rich; next: Rich; pairing?: Pairing };

/** A step of the plan to the tag: a phase spans days, a milestone sits on one. Dates are YYYY-MM-DD, Montreal time. */
export type Step = { kind: 'phase' | 'milestone'; tone: Tone; from: string; to: string; title: Rich; who?: string; what: Rich };

export type Landed = { at: string; when: string; n: number; href: string; title: string; who: string };

export type ReleaseBoard = {
  schema: 1;
  slug: string;
  title: string;
  version: string;
  milestone: { text: string; href: string; state?: 'open' | 'closed' };
  /** ISO instant of the measurement, and the same instant as read in Montreal. */
  measuredAt: string;
  measuredLine: string;
  /** IANA zone every date on the board is read in. */
  timeZone: string;
  kpis: Kpi[];
  streams: Stream[];
  legend: Rich;
  days: string[];
  plan: Step[];
  decided: Rich;
  rules: Rich[];
  calls: Rich[];
  landedSince: string;
  landed: Landed[];
  links: { text: string; href?: string; meeting?: string; anchor?: string }[];
  footer: string;
};
