// bun scripts/release-board/check-config.ts <file.release.yaml> ...
// Parses each release file the way the derivation does, so a broken edit made on github.com
// fails the pull request's checks with the field it broke, before the schedule meets it.
import { readFileSync } from 'node:fs';
import { parseConfig } from './config';

let bad = 0;
for (const f of process.argv.slice(2)) {
  try {
    parseConfig(readFileSync(f, 'utf8'), f);
    console.log(`${f}: ok`);
  } catch (e) {
    console.error((e as Error).message);
    bad++;
  }
}
process.exit(bad ? 1 : 0);
