// Pairs for the holarchy direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'holarchy';
const original = 'E%20Holarchy.html';

const pairs: Pair[] = [
  { slug, name: 'default', original: { path: original }, port: { path: '/prototypes/holarchy' } }
];

export default pairs;
