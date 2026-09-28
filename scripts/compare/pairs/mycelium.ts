// Pairs for the mycelium direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'mycelium';
const original = 'A%20Mycelium.html';

const pairs: Pair[] = [
  { slug, name: 'default', original: { path: original }, port: { path: '/prototypes/mycelium' } }
];

export default pairs;
