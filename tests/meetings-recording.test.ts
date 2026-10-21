import { describe, expect, test } from 'bun:test';
import { cutLabel, fmtMmSs, parseCuts, parseRecordingUrl, pickRecording } from '../src/lib/meetings/recording';
import { cutsSource, parseMeeting } from '../src/lib/meetings/parse';

const journal = (front: string) => `---\nkind: dev\n${front}\n---\n\n# Title\n\n**Date:** Tuesday, September 8, 2026 (48 minutes)\n\n## Discussion\n\n**Topic.** Some text. [1 to 5m]\n`;

describe('parseRecordingUrl', () => {
  test('accepts an https URL', () => {
    const url = 'https://media.alternef.org/k3f9x2/2026-09-08-dev.opus';
    expect(parseRecordingUrl(url)).toBe(url);
    expect(parseRecordingUrl(`  ${url}  `)).toBe(url);
  });
  test('rejects local paths, other schemes and junk', () => {
    for (const v of ['~/Téléchargements/call.opus', '/home/x/call.opus', 'C:\\call.opus', 'call.opus', 'http://media.alternef.org/a.opus', 'file:///tmp/a.opus', 'javascript:alert(1)', 'ftp://x/a.opus', 'https://', 'https://user:pw@host/a.opus', '', undefined, null, 42]) {
      expect(parseRecordingUrl(v)).toBeNull();
    }
  });
});

describe('parseCuts', () => {
  test('parses [start, end] pairs and sorts them', () => {
    expect(parseCuts('[[610, 640], [120, 185.5]]')).toEqual([[120, 185.5], [610, 640]]);
    expect(parseCuts([[1, 2]])).toEqual([[1, 2]]);
  });
  test('drops pairs that are not numbers or have start >= end, keeps the rest', () => {
    expect(parseCuts('[[5, 5], [9, 3], ["1", 2], [1], [1, 2, 3], [-4, 2], [10, 20]]')).toEqual([[10, 20]]);
    expect(parseCuts([[Number.NaN, 4], [0, Number.POSITIVE_INFINITY], [0, 4]])).toEqual([[0, 4]]);
  });
  test('returns nothing for anything that is not a list', () => {
    for (const v of ['', 'nope', '{"a":1}', '3', undefined, null, 7]) expect(parseCuts(v)).toEqual([]);
  });
});

describe('mm:ss formatting', () => {
  test('pads and does not wrap minutes at 60', () => {
    expect(fmtMmSs(0)).toBe('00:00');
    expect(fmtMmSs(125)).toBe('02:05');
    expect(fmtMmSs(3725)).toBe('62:05');
    expect(fmtMmSs(59.9)).toBe('00:59');
    expect(fmtMmSs(-3)).toBe('00:00');
  });
  test('labels a cut in English and French', () => {
    expect(cutLabel([120, 185], 'en')).toBe('removed for privacy, 02:00 to 03:05');
    expect(cutLabel([120, 185], 'fr')).toBe('retiré pour confidentialité, de 02:00 à 03:05');
  });
});

describe('pickRecording', () => {
  const a = { url: 'https://x/a.opus', cuts: [] };
  const b = { url: 'https://x/b.opus', cuts: [[1, 2]] as [number, number][] };
  test('prefers the version shown, falls back to the other', () => {
    expect(pickRecording(a, b)).toBe(a);
    expect(pickRecording(null, b)).toBe(b);
    expect(pickRecording(null, undefined)).toBeNull();
  });
});

describe('frontmatter', () => {
  test('recording and inline cuts are read', () => {
    const m = parseMeeting('2026-09-08-dev.md', journal('recording: https://media.alternef.org/k3f9x2/2026-09-08-dev.opus\nrecording_cuts: [[120, 185], [610, 640]]'));
    expect(m.recording).toBe('https://media.alternef.org/k3f9x2/2026-09-08-dev.opus');
    expect(m.recordingCuts).toEqual([[120, 185], [610, 640]]);
  });
  test('block-list cuts are read', () => {
    const m = parseMeeting('2026-09-08-dev.md', journal('recording: https://x.example/a.opus\nrecording_cuts:\n  - [120, 185]\n  - [10, 20]\ntopic: "t"'));
    expect(m.recordingCuts).toEqual([[10, 20], [120, 185]]);
    expect(cutsSource('recording_cuts:\n  - [1, 2]\nkind: dev')).toBe('[[1, 2]]');
  });
  test('a local path is ignored', () => {
    const m = parseMeeting('2026-09-08-dev.md', journal('recording: ~/Téléchargements/2026-09-08.opus'));
    expect(m.recording).toBeNull();
  });
  test('no recording leaves the journal as before', () => {
    const m = parseMeeting('2026-09-08-dev.md', journal('topic: "t"'));
    expect(m.recording).toBeNull();
    expect(m.recordingCuts).toEqual([]);
  });
  test('invalid cuts are dropped', () => {
    const m = parseMeeting('2026-09-08-dev.md', journal('recording_cuts: [[30, 10], [1, 2]]'));
    expect(m.recordingCuts).toEqual([[1, 2]]);
  });
});
