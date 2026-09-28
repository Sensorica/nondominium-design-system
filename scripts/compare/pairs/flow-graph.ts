// Pairs for the flow-graph direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'flow-graph';
const original = 'F%20Flow%20Graph.dc.html';

const pairs: Pair[] = [
  { slug, name: 'default', original: { path: original }, port: { path: '/prototypes/flow-graph' } }
];

export default pairs;
