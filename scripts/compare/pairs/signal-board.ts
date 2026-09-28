// Pairs for the signal-board direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'signal-board';
const original = 'D%20Signal%20Board.html';

const pairs: Pair[] = [
  {
    slug,
    name: 'default',
    original: { path: original },
    port: { path: '/prototypes/signal-board' }
  }
];

export default pairs;
