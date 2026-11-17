// Every release board in content/releases/, read once at build time, newest slug first.
// Each file is generated (see types.ts); adding a release = a <slug>.release.yaml beside them,
// then `bun scripts/release-board.ts` writing <slug>.json (docs/RELEASE_BOARD.md).

import type { ReleaseBoard } from './types';

const files = import.meta.glob('/content/releases/*.json', { import: 'default', eager: true }) as Record<string, ReleaseBoard>;

export const releases: ReleaseBoard[] = Object.values(files).sort((a, b) => b.slug.localeCompare(a.slug));

export function releaseBySlug(slug: string): ReleaseBoard | undefined {
  return releases.find((r) => r.slug === slug);
}

export type * from './types';
