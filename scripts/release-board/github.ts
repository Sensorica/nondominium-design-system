// Reads one release's Snapshot from GitHub: GraphQL for the milestone's items and their
// reviews (one request for what would be a hundred REST calls), REST for the rest. The app
// and wrapper repos are public, so any token reads them, the Actions GITHUB_TOKEN included.
// Everything read here is data: no text from GitHub is ever run or followed.

import type { ReleaseConfig } from './config';
import { referencedNumbers, versionOf } from './derive';
import type { CiState, Issue, Merged, Pr, Snapshot, WrapperConfig, WrapperPr } from './snapshot';

const API = 'https://api.github.com';

/** The token: GH_TOKEN or GITHUB_TOKEN from the environment, else the gh CLI's on a developer machine. */
export function token(): string {
  const env = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (env) return env;
  const r = Bun.spawnSync(['gh', 'auth', 'token'], { stdout: 'pipe', stderr: 'pipe' });
  const t = r.stdout.toString().trim();
  if (r.exitCode !== 0 || !t) throw new Error('no GitHub token: set GH_TOKEN, or log in with `gh auth login`');
  return t;
}

async function call(tok: string, url: string, init: RequestInit = {}, accept = 'application/vnd.github+json'): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${tok}`, Accept: accept, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'release-board', ...(init.headers ?? {}) },
    });
    if (res.status < 500 || attempt === 3) return res;
    await Bun.sleep(1000 * attempt);
  }
}

async function rest<T>(tok: string, path: string): Promise<T> {
  const res = await call(tok, `${API}${path}`);
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

/** A file's text on a ref, or null when it does not exist there. */
async function raw(tok: string, repo: string, path: string, ref: string): Promise<string | null> {
  const res = await call(tok, `${API}/repos/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`, {}, 'application/vnd.github.raw+json');
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${repo}/${path}@${ref}: ${res.status}`);
  return res.text();
}

async function graphql<T>(tok: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await call(tok, `${API}/graphql`, { method: 'POST', body: JSON.stringify({ query, variables }), headers: { 'Content-Type': 'application/json' } });
  const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || body.errors?.length) throw new Error(`GraphQL: ${res.status} ${(body.errors ?? []).map((e) => e.message).join('; ')}`);
  return body.data as T;
}

const PR_FIELDS = `number title url isDraft baseRefName headRefName headRefOid updatedAt
  author { login } labels(first: 30) { nodes { name } }
  latestOpinionatedReviews(first: 30) { nodes { state submittedAt author { login } commit { oid } } }
  commits(last: 1) { nodes { commit { statusCheckRollup { state } } } }`;

const ISSUE_FIELDS = `number title url labels(first: 30) { nodes { name } } assignees(first: 10) { nodes { login } }`;

const toPr = (n: any): Pr => ({
  number: n.number,
  title: n.title,
  url: n.url,
  isDraft: n.isDraft,
  baseRef: n.baseRefName,
  headRef: n.headRefName,
  headSha: n.headRefOid,
  author: n.author?.login ?? 'ghost',
  labels: n.labels.nodes.map((l: any) => l.name),
  reviews: n.latestOpinionatedReviews.nodes.map((r: any) => ({ author: r.author?.login ?? 'ghost', state: r.state, commit: r.commit?.oid ?? null, submittedAt: r.submittedAt })),
  ci: (n.commits.nodes[0]?.commit?.statusCheckRollup?.state ?? null) as CiState,
  updatedAt: n.updatedAt,
});

const toIssue = (n: any): Issue => ({ number: n.number, title: n.title, url: n.url, labels: n.labels.nodes.map((l: any) => l.name), assignees: n.assignees.nodes.map((a: any) => a.login) });

const split = (repo: string) => {
  const [owner, name] = repo.split('/');
  return { owner, name };
};

/** Every open PR or issue on a milestone, page by page. */
async function milestoneItems(tok: string, repo: string, number: number, kind: 'pullRequests' | 'issues'): Promise<any[]> {
  const out: any[] = [];
  let after: string | null = null;
  do {
    const q = `query($owner: String!, $name: String!, $n: Int!, $after: String) { repository(owner: $owner, name: $name) { milestone(number: $n) {
      ${kind}(first: 50, states: OPEN, after: $after) { pageInfo { hasNextPage endCursor } nodes { ${kind === 'pullRequests' ? PR_FIELDS : ISSUE_FIELDS} } } } } }`;
    const d: any = await graphql(tok, q, { ...split(repo), n: number, after });
    const conn = d.repository.milestone[kind];
    out.push(...conn.nodes);
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);
  return out;
}

async function mergedSince(tok: string, repo: string, base: string, since: string | null, until: string | null): Promise<Merged[]> {
  const range = since && until ? `${since}..${until}` : since ? `>=${since}` : until ? `<=${until}` : '';
  const search = `repo:${repo} is:pr is:merged base:${base}${range ? ` merged:${range}` : ''}`;
  const out: Merged[] = [];
  let after: string | null = null;
  do {
    const d: any = await graphql(
      tok,
      `query($q: String!, $after: String) { search(query: $q, type: ISSUE, first: 100, after: $after) { pageInfo { hasNextPage endCursor }
        nodes { ... on PullRequest { number title url mergedAt author { login } } } } }`,
      { q: search, after },
    );
    out.push(...d.search.nodes.filter((n: any) => n.number).map((n: any) => ({ number: n.number, title: n.title, url: n.url, mergedAt: n.mergedAt, author: n.author?.login ?? 'ghost' })));
    after = d.search.pageInfo.hasNextPage ? d.search.pageInfo.endCursor : null;
  } while (after);
  return out;
}

/** The fields of kangaroo.config.ts the app's release workflow reads, by the same regex rule as scripts/release-manifest.ts there. */
export function parseWrapperConfig(src: string | null): WrapperConfig | null {
  if (src === null) return null;
  const key = (k: string) => new RegExp(`^\\s*${k}:\\s*(['"])([^'"\\n]+)\\1`, 'm').exec(src)?.[2] ?? null;
  return { version: key('version'), networkSeed: key('networkSeed'), holochainVersion: key('holochainVersion'), bootstrapUrl: key('bootstrapUrl') };
}

/** `holonix.url = "github:holochain/holonix?ref=main-0.7"` is Holochain 0.7. */
export const holochainLineOf = (flake: string | null) => (flake ? (/holonix\?ref=main-(\d+\.\d+)/.exec(flake)?.[1] ?? null) : null);

export async function fetchSnapshot(c: ReleaseConfig, tok = token()): Promise<Snapshot> {
  const repo = c.app.repo;
  const [info, ms, labels, releases, runs, milestones] = await Promise.all([
    rest<any>(tok, `/repos/${repo}`),
    rest<any>(tok, `/repos/${repo}/milestones/${c.app.milestone}`),
    rest<any[]>(tok, `/repos/${repo}/labels?per_page=100`),
    rest<any[]>(tok, `/repos/${repo}/releases?per_page=30`),
    c.app.heavyWorkflow ? rest<any>(tok, `/repos/${repo}/actions/workflows/${c.app.heavyWorkflow}/runs?per_page=100`) : Promise.resolve({ workflow_runs: [] }),
    rest<any[]>(tok, `/repos/${repo}/milestones?state=open&per_page=100`),
  ]);
  const base = info.default_branch as string;
  const version = versionOf(ms.title);

  // the previous release is the newest published one that is not this release's own tag
  const published = releases.filter((r) => !r.draft && r.published_at).sort((a, b) => b.published_at.localeCompare(a.published_at));
  const own = published.find((r) => r.tag_name === version) ?? null;
  const previous = published.find((r) => r.tag_name !== version && (!own || r.published_at < own.published_at)) ?? null;

  const [prNodes, issueNodes, merged, pkg, flake] = await Promise.all([
    milestoneItems(tok, repo, c.app.milestone, 'pullRequests'),
    milestoneItems(tok, repo, c.app.milestone, 'issues'),
    mergedSince(tok, repo, base, previous?.published_at ?? null, own?.published_at ?? null),
    raw(tok, repo, 'package.json', base),
    raw(tok, repo, 'flake.nix', base),
  ]);

  // every #N the notes mention, in one query, so a link to it is exact
  const nums = referencedNumbers(c);
  const refs: Snapshot['app']['refs'] = {};
  if (nums.length) {
    const fields = nums.map((n) => `n${n}: issueOrPullRequest(number: ${n}) { __typename ... on PullRequest { title url } ... on Issue { title url } }`).join('\n');
    const d: any = await graphql(tok, `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { ${fields} } }`, split(repo));
    for (const n of nums) {
      const r = d.repository[`n${n}`];
      if (r) refs[String(n)] = { kind: r.__typename === 'PullRequest' ? 'pr' : 'issue', title: r.title, url: r.url };
    }
  }

  // the next milestone: the open one due soonest after this one
  const next = milestones
    .filter((m) => m.number !== ms.number && m.due_on && (!ms.due_on || m.due_on > ms.due_on))
    .sort((a, b) => a.due_on.localeCompare(b.due_on))[0];

  let wrapper: Snapshot['wrapper'] = null;
  if (c.wrapper) {
    const w = c.wrapper;
    const wms = (await rest<any[]>(tok, `/repos/${w.repo}/milestones?state=all&per_page=100`)).find((m) => m.title === ms.title);
    let prs: Pr[];
    if (wms) prs = (await milestoneItems(tok, w.repo, wms.number, 'pullRequests')).map(toPr);
    else if (w.prs.length) {
      const fields = w.prs.map((n) => `n${n}: pullRequest(number: ${n}) { state ${PR_FIELDS} }`).join('\n');
      const d: any = await graphql(tok, `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { ${fields} } }`, split(w.repo));
      prs = w.prs.map((n) => d.repository[`n${n}`]).filter((p: any) => p && p.state === 'OPEN').map(toPr);
    } else prs = [];
    const withConfig: WrapperPr[] = await Promise.all(prs.map(async (p) => ({ ...p, config: parseWrapperConfig(await raw(tok, w.repo, 'kangaroo.config.ts', p.headSha)) })));
    wrapper = {
      repo: w.repo,
      releaseBranch: w.releaseBranch,
      releaseConfig: parseWrapperConfig(await raw(tok, w.repo, 'kangaroo.config.ts', w.releaseBranch)),
      markedBy: wms ? 'milestone' : 'config',
      prs: withConfig,
    };
  }

  const prs = prNodes.map(toPr);
  const issues = issueNodes.map(toIssue);
  const logins = new Set<string>([...prs.map((p) => p.author), ...prs.flatMap((p) => p.reviews.map((r) => r.author)), ...issues.flatMap((i) => i.assignees), ...merged.map((m) => m.author), ...(wrapper?.prs ?? []).map((p) => p.author)]);
  const others = [...logins].filter((l) => !(l in c.maintainers) && l !== 'ghost').sort();
  const found = await Promise.all(others.map((l) => rest<any>(tok, `/users/${l}`).catch(() => null)));
  const names: Record<string, string> = {};
  others.forEach((l, i) => {
    if (found[i]?.name) names[l] = String(found[i].name).split(/\s+/)[0];
  });
  // only the runs at a PR's current head matter; keeping just those keeps a recorded snapshot small
  const heads = new Set(prs.map((p) => p.headSha));

  return {
    app: {
      repo,
      defaultBranch: base,
      milestone: {
        number: ms.number,
        title: ms.title,
        url: ms.html_url,
        state: ms.state,
        dueOn: ms.due_on,
        closedAt: ms.closed_at,
        openCount: ms.open_issues,
        closedCount: ms.closed_issues,
      },
      nextMilestone: next ? { number: next.number, title: next.title, url: next.html_url } : null,
      labels: labels.filter((l) => l.name.startsWith(c.labelPrefix)).map((l) => ({ name: l.name, description: l.description ?? '' })).sort((a, b) => a.name.localeCompare(b.name)),
      prs: prs.sort((a, b) => a.number - b.number),
      issues: issues.sort((a, b) => a.number - b.number),
      merged: merged.sort((a, b) => a.number - b.number),
      previousRelease: previous ? { tag: previous.tag_name, publishedAt: previous.published_at } : null,
      ownRelease: own ? { tag: own.tag_name, publishedAt: own.published_at } : null,
      heavyRuns: (runs.workflow_runs as any[]).filter((r) => heads.has(r.head_sha)).map((r) => ({ headSha: r.head_sha, status: r.status, conclusion: r.conclusion, createdAt: r.created_at, url: r.html_url })),
      refs,
      packageVersion: pkg ? (JSON.parse(pkg).version ?? null) : null,
      holochainLine: holochainLineOf(flake),
    },
    wrapper,
    names,
  };
}
