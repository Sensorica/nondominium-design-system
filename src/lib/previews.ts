// Branch previews: every branch pushed to the repo is deployed by
// .github/workflows/deploy-cloudflare.yml, master as production and every
// other branch as a Cloudflare Pages preview. This module names the preview of
// a branch and reads the branch list from GitHub, so /previews needs no build
// step and no list to maintain. See docs/PREVIEWS.md.

export const REPO = 'Sensorica/nondominium-design-system';
export const PRODUCTION_BRANCH = 'master';
const PROJECT_HOST = 'nondominium-design.pages.dev';
const PRODUCTION_URL = 'https://design.sensorica.co';

/** Cloudflare's alias for a branch: lowercased, every non-alphanumeric
 *  character replaced with a hyphen (`fix/api` -> `fix-api`). */
export function branchAlias(branch: string): string {
  return branch.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

/** Where a branch's latest build is served. */
export function previewUrl(branch: string): string {
  return branch === PRODUCTION_BRANCH ? PRODUCTION_URL : `https://${branchAlias(branch)}.${PROJECT_HOST}`;
}

export interface BranchPreview {
  name: string;
  sha: string;
  url: string;
  production: boolean;
  pr?: { number: number; title: string; url: string; draft: boolean; author: string; updatedAt: string };
}

interface GhBranch { name: string; commit: { sha: string } }
interface GhPull {
  number: number;
  title: string;
  html_url: string;
  draft: boolean;
  updated_at: string;
  user: { login: string } | null;
  head: { ref: string; repo: { full_name: string } | null };
}

async function get<T>(path: string, fetcher: typeof fetch): Promise<T> {
  const res = await fetcher(`https://api.github.com/repos/${REPO}/${path}`, { headers: { Accept: 'application/vnd.github+json' } });
  if (res.status === 403 || res.status === 429) {
    throw new Error('GitHub is rate-limiting this address (60 anonymous requests an hour). Try again in a few minutes.');
  }
  if (!res.ok) throw new Error(`GitHub answered ${res.status} for ${path}.`);
  return res.json() as Promise<T>;
}

/** Every branch on the repo with its preview, production first, then branches
 *  with an open PR (most recently updated first), then the rest by name.
 *  A PR from a fork has no branch here and no preview, so it is left out. */
export async function loadPreviews(fetcher: typeof fetch = fetch): Promise<BranchPreview[]> {
  const [branches, pulls] = await Promise.all([
    get<GhBranch[]>('branches?per_page=100', fetcher),
    get<GhPull[]>('pulls?state=open&per_page=100', fetcher)
  ]);
  const prByBranch = new Map(pulls.filter((p) => p.head.repo?.full_name === REPO).map((p) => [p.head.ref, p]));
  const rows = branches.map<BranchPreview>((b) => {
    const p = prByBranch.get(b.name);
    return {
      name: b.name,
      sha: b.commit.sha,
      url: previewUrl(b.name),
      production: b.name === PRODUCTION_BRANCH,
      pr: p && { number: p.number, title: p.title, url: p.html_url, draft: p.draft, author: p.user?.login ?? '', updatedAt: p.updated_at }
    };
  });
  const rank = (r: BranchPreview) => (r.production ? 0 : r.pr ? 1 : 2);
  return rows.sort((a, b) => rank(a) - rank(b) || (b.pr?.updatedAt ?? '').localeCompare(a.pr?.updatedAt ?? '') || a.name.localeCompare(b.name));
}
