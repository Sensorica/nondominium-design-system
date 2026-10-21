// Meeting journals -> the data a Meeting Niceboard renders.
//
// The source is the journal markdown the Transcribe workflow writes, kept in
// content/meetings/. The shape is fixed (TL;DR, Updates, Discussion, Decisions,
// Discussed not decided, Actions, Outstanding, Corrections) but journals vary:
// hard-wrapped lines, ### subsections, a Reports or Next section, actions without
// a bold owner. Anything unrecognised renders as prose, so no text is lost.
//
// Journals are English or French. The French headings (Décisions, Discuté non
// décidé, En suspens, Corrections après la rencontre...), the header lines with a
// space before the colon (`**Date :**`, `**Participants :**`, `**Contexte :**`)
// and minute marks in the French form (`[34 à 38]`, no trailing m) are all read.
//
// A ```mermaid fence becomes a figure block: numbered across the meeting, with
// its `%% caption:` line as the caption. The page renders it as a diagram.
//
// Ported from requests-offers-design-system (src/lib/meetings/parse.ts) and
// extended for the above.

import { marked } from 'marked';

/** Minutes into the recording, as written in the journal: [62 to 67m] or [62 à 67]. */
export type Span = [number, number];

export type TextBlock =
  | { type: 'entry'; id: string; lead: string; leadHtml: string; html: string; spans: Span[] }
  | { type: 'item'; id: string; lead: string; leadHtml: string; html: string; spans: Span[]; recorded?: boolean };

export type Block =
  | TextBlock
  | { type: 'sub'; id: string; title: string }
  | { type: 'figure'; id: string; n: number; source: string; caption: string }
  | { type: 'code'; id: string; lang: string; html: string };

/** A paragraph or bullet: the blocks a reader can comment on, tick or place on the timeline. */
export const isText = (b: Block): b is TextBlock => b.type === 'entry' || b.type === 'item';

export type SectionKind = 'tldr' | 'prose' | 'decisions' | 'open' | 'actions' | 'outstanding' | 'corrections';

export interface Section {
  id: string;
  title: string;
  kind: SectionKind;
  /** Paragraphs that are not entries or items, such as a section's lede. */
  lede: string;
  blocks: Block[];
}

export interface Action {
  id: string;
  owner: string;
  html: string;
  text: string;
  spans: Span[];
  /** Ticked in the journal itself (`- [x] ...`): done on the record, for everyone. */
  recorded: boolean;
}

export interface Meeting {
  slug: string;
  date: string; // YYYY-MM-DD, from the file name
  kind: string; // lab, dev, team
  /** 'fr' when the journal uses the French headings or header lines. */
  lang: 'en' | 'fr';
  title: string;
  topic: string;
  dateLine: string;
  attendees: string;
  context: string;
  durationMin: number | null;
  breaks: Span[];
  tldr: string;
  sections: Section[];
  actions: Action[];
  owners: string[];
  counts: { decisions: number; open: number; actions: number; words: number; done: number; settled: number };
}

// A range is `62 to 67m` / `62m` (English) or `62 à 67` / `62` (French, no unit).
const RANGE = String.raw`\d+\s*m?(?:\s*(?:to|à)\s*\d+\s*m?)?`;
const SPAN_RE = new RegExp(String.raw`\s*\[(${RANGE}(?:\s*,\s*${RANGE})*)\]\s*\.?\s*$`);

/** Pull the trailing minute ranges off a paragraph or bullet. */
export function takeSpans(text: string): { text: string; spans: Span[] } {
  const m = text.match(SPAN_RE);
  if (!m) return { text, spans: [] };
  const spans = m[1].split(',').map((part) => {
    const [a, b] = part.replace(/m/g, '').trim().split(/\s*(?:to|à)\s*/).map(Number);
    return [a, b ?? a] as Span;
  });
  return { text: text.slice(0, m.index).trim(), spans };
}

const inline = (s: string) => marked.parseInline(s, { async: false }) as string;
const plain = (s: string) => s.replace(/\*\*|`|\[([^\]]+)\]\([^)]*\)/g, (_, t) => t ?? '').trim();

/**
 * `**Lead.** rest` or `**Owner:** rest` -> lead and rest. A bold phrase that runs
 * on into its sentence (`**Whether X** happens`) is not a lead and stays inline.
 */
export function splitLead(text: string): { lead: string; rest: string } {
  const m = text.match(/^\*\*(.+?)\*\*(\s*[:.]?)\s*([\s\S]*)$/);
  if (!m) return { lead: '', rest: text };
  const [, bold, mark, rest] = m;
  const isLead = /[.:?!]$/.test(bold.trim()) || mark.trim() !== '' || !rest;
  if (!isLead) return { lead: '', rest: text };
  return { lead: bold.replace(/[.:]\s*$/, '').trim(), rest: rest.trim() };
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// French headings map to the English section ids, so a translated journal and its original
// share every block id (`updates-3`): a tick, a reaction or a pinned comment holds in both.
const FR_SECTION_ID: Record<string, string> = {
  'depuis-la-derni-re-rencontre': 'since-last-meeting',
  'mises-jour': 'updates',
  'nouvelles': 'updates',
  'd-cisions': 'decisions',
  'discut-non-tranch': 'discussed-not-decided',
  'discut-non-d-cid': 'discussed-not-decided',
  'en-suspens': 'outstanding',
  'corrections-apr-s-la-rencontre': 'corrections-after-the-meeting',
};

function sectionKind(title: string): SectionKind {
  // Accents are dropped so "Décisions" and "decisions" are one heading.
  const t = title.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  if (t.startsWith('tl;dr')) return 'tldr';
  if (t.startsWith('decisions')) return 'decisions';
  if (/not decided|non decide|non tranche/.test(t) || t.startsWith('open question') || t.startsWith('questions ouvertes')) return 'open';
  if (t.startsWith('actions')) return 'actions';
  if (t.startsWith('outstanding') || t.startsWith('en suspens')) return 'outstanding';
  if (t.startsWith('corrections')) return 'corrections';
  return 'prose';
}

/** Split a section body into paragraphs, bullets, ### headings and fenced blocks, joining wrapped lines. */
type Chunk = { kind: 'p' | 'li' | 'h3' | 'table' | 'fence'; text: string; rows?: string[][]; lang?: string };
function chunks(body: string): Chunk[] {
  const out: Chunk[] = [];
  let cur: Chunk | null = null;
  let fence: Chunk | null = null;
  for (const raw of body.split('\n')) {
    // A fenced block keeps its blank lines and indentation untouched.
    if (fence) {
      if (/^\s*```\s*$/.test(raw)) { out.push(fence); fence = null; } else fence.text += (fence.text ? '\n' : '') + raw;
      continue;
    }
    const open = raw.match(/^\s*```\s*([\w-]*)\s*$/);
    if (open) { cur = null; fence = { kind: 'fence', text: '', lang: open[1].toLowerCase() }; continue; }
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { cur = null; continue; }
    if (/^\|/.test(line)) {
      if (cur?.kind !== 'table') { cur = { kind: 'table', text: '', rows: [] }; out.push(cur); }
      cur.text += line + '\n';
      if (!/^\|[\s:|-]+\|$/.test(line)) cur.rows!.push(line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      continue;
    }
    if (/^###\s/.test(line)) { out.push({ kind: 'h3', text: line.replace(/^###\s+/, '') }); cur = null; continue; }
    const bullet = line.match(/^(?:[-*]|\d+\.)\s+(.*)$/);
    if (bullet) { cur = { kind: 'li', text: bullet[1] }; out.push(cur); continue; }
    const nested = line.match(/^\s+(?:[-*]|\d+\.)\s+(.*)$/);
    if (nested && cur) { cur.text += ' · ' + nested[1]; continue; }
    if (cur) { cur.text += ' ' + line.trim(); continue; }
    cur = { kind: 'p', text: line.trim() };
    out.push(cur);
  }
  // A fence the journal never closed still renders, rather than swallowing the rest.
  if (fence) out.push(fence);
  return out;
}

// `(1h 52m, ...)` or `(1 h 47, ...)` or `(45 min, ...)`.
function durationOf(dateLine: string): number | null {
  const hm = dateLine.match(/\((\d+)\s*h\s*(\d+)/);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2]);
  const min = dateLine.match(/\((\d+)\s*min/);
  return min ? Number(min[1]) : null;
}

// `break at 39 to 44m` or `pause de 80 à 84`.
function breaksOf(dateLine: string): Span[] {
  const at = dateLine.match(/(?:breaks?|pauses?)\s+(?:at|de|à)\s+([^)]*)/i);
  if (!at) return [];
  return [...at[1].matchAll(/(\d+)\s*(?:to|à)\s*(\d+)\s*m?/g)].map((m) => [Number(m[1]), Number(m[2])] as Span);
}

/** `%% caption: text` inside a mermaid fence names the figure; the line is not diagram source. */
function splitCaption(source: string): { source: string; caption: string } {
  let caption = '';
  const kept = source.split('\n').filter((l) => {
    const m = l.match(/^\s*%%\s*caption\s*:\s*(.*)$/i);
    if (m) { caption = m[1].trim(); return false; }
    return true;
  });
  return { source: kept.join('\n').trim(), caption };
}

const words = (s: string) => plain(s).split(/\s+/).filter(Boolean).length;

export function parseMeeting(file: string, src: string): Meeting {
  // `YYYY-MM-DD-<kind>.md` is the English journal, the default; `YYYY-MM-DD-<kind>.fr.md` is
  // the French original beside it. Both share the slug, so they are one meeting.
  const slug = file.replace(/^.*\//, '').replace(/\.md$/, '').replace(/\.fr$/, '');
  const fm: Record<string, string> = {};
  const body = src.replace(/^---\n([\s\S]*?)\n---\n/, (_, block: string) => {
    for (const line of block.split('\n')) {
      const m = line.match(/^(\w+):\s*"?(.*?)"?$/);
      if (m) fm[m[1]] = m[2];
    }
    return '';
  });

  const title = body.match(/^# (.+)$/m)?.[1].trim() ?? slug;
  // Header lines: `**Date:**` in English, `**Date :**` in French (space before the colon).
  const head = (k: string) => {
    const m = body.match(new RegExp(`^\\*\\*(?:${k})\\s?:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\n|\\n\\*\\*[^*\\n]+?\\s?:\\*\\*|\\n## )`, 'm'));
    return m ? m[1].replace(/\s*\n\s*/g, ' ').trim() : '';
  };
  const dateLine = head('Date');
  const lang: 'en' | 'fr' =
    fm.lang === 'fr' || /^\*\*(?:Participants|Contexte)\s?:\*\*/m.test(body) || /^## (?:Décisions|En suspens|Mises à jour|Depuis la dernière)/m.test(body) ? 'fr' : 'en';

  const sections: Section[] = [];
  const actions: Action[] = [];
  let wordCount = 0;
  let tldr = '';
  let figures = 0;

  for (const part of body.split(/^## /m).slice(1)) {
    const nl = part.indexOf('\n');
    const titleText = part.slice(0, nl).trim();
    const kind = sectionKind(titleText);
    const raw = slugify(titleText);
    const id = FR_SECTION_ID[raw] ?? (raw || `s${sections.length + 1}`);
    const section: Section = { id, title: titleText, kind, lede: '', blocks: [] };
    let n = 0;
    for (const c of chunks(part.slice(nl + 1))) {
      if (c.kind === 'fence') {
        n += 1;
        if (c.lang === 'mermaid') {
          figures += 1;
          section.blocks.push({ type: 'figure', id: `${id}-${n}`, n: figures, ...splitCaption(c.text) });
        } else {
          section.blocks.push({ type: 'code', id: `${id}-${n}`, lang: c.lang ?? '', html: marked.parse('```' + (c.lang ?? '') + '\n' + c.text + '\n```', { async: false }) as string });
        }
        continue;
      }
      wordCount += words(c.text);
      if (kind === 'tldr') { tldr += (tldr ? '\n\n' : '') + c.text; continue; }
      if (c.kind === 'table') {
        const rows = c.rows!;
        if (kind === 'actions' && rows.length > 1) {
          for (const r of rows.slice(1)) {
            n += 1;
            const ref = (r[2] ?? '').replace(/^\[|\]$/g, '');
            const spans = ref ? takeSpans(` [${/m$/.test(ref) ? ref : ref + 'm'}]`).spans : [];
            const cell = r[1] ?? '';
            const ticked = /^\[[xX]\]\s*/.test(cell);
            const what = cell.replace(/^\[[ xX]\]\s*/, '');
            actions.push({ id: `${id}-${n}`, owner: r[0] || 'Team', html: inline(what), text: plain(what), spans, recorded: ticked });
          }
        } else {
          section.lede += marked.parse(c.text, { async: false }) as string;
        }
        continue;
      }
      if (c.kind === 'h3') { section.blocks.push({ type: 'sub', id: `${id}-${slugify(c.text)}`, title: c.text }); continue; }
      // `- [x] ...` in the journal records an action as done or a question as settled.
      const task = c.kind === 'li' ? c.text.match(/^\[( |x|X)\]\s+/) : null;
      const recorded = !!task && task[1] !== ' ';
      const { text, spans } = takeSpans(task ? c.text.slice(task[0].length) : c.text);
      n += 1;
      const bid = `${id}-${n}`;
      if (kind === 'actions' && c.kind === 'li') {
        const { lead, rest } = splitLead(text);
        const owner = lead || 'Team';
        const body = lead ? rest : text;
        actions.push({ id: bid, owner, html: inline(body), text: plain(body), spans, recorded });
        continue;
      }
      if (c.kind === 'p' && !text.startsWith('**') && kind !== 'prose') { section.lede += (section.lede ? ' ' : '') + inline(text); continue; }
      const { lead, rest } = splitLead(text);
      // Leads read as sentences on the page: a full stop is added unless one is there.
      const leadHtml = lead ? inline(/[?!]$/.test(lead) ? lead : `${lead}.`) : '';
      section.blocks.push({ type: c.kind === 'li' ? 'item' : 'entry', id: bid, lead: plain(lead), leadHtml, html: inline(lead ? rest : text), spans, ...(recorded ? { recorded } : {}) });
    }
    sections.push(section);
  }

  const owners = [...new Set(actions.map((a) => a.owner))];
  const count = (k: SectionKind) => sections.filter((s) => s.kind === k).reduce((t, s) => t + s.blocks.filter(isText).length, 0);

  return {
    slug,
    date: slug.slice(0, 10),
    // The file name is YYYY-MM-DD-<kind>; the frontmatter wins when it says otherwise.
    kind: fm.kind || slug.slice(11) || 'dev',
    lang,
    title,
    topic: fm.topic ?? '',
    dateLine: plain(dateLine),
    attendees: inline(head('Attendees|Participants')),
    context: inline(head('Context|Contexte')),
    durationMin: durationOf(dateLine),
    breaks: breaksOf(dateLine),
    tldr: inline(tldr.replace(/\n\n/g, ' ')),
    sections,
    actions,
    owners,
    counts: {
      decisions: count('decisions'),
      open: count('open'),
      actions: actions.length,
      words: wordCount,
      done: actions.filter((a) => a.recorded).length,
      settled: sections.filter((s) => s.kind === 'open').flatMap((s) => s.blocks).filter((b) => b.type === 'item' && b.recorded).length,
    },
  };
}

export { inline as renderInline };
