// Pairs for the field-notes direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'field-notes';
const original = 'B%20Field%20Notes.html';

const pairs: Pair[] = [
  { slug, name: 'default', original: { path: original }, port: { path: '/prototypes/field-notes' } }
];

export default pairs;
