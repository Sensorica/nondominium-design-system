// Pairs for the instrument direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'instrument';
const original = 'C%20Instrument.html';

const pairs: Pair[] = [
  { slug, name: 'default', original: { path: original }, port: { path: '/prototypes/instrument' } }
];

export default pairs;
