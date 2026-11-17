// What the fetcher reads from GitHub, in the shape the derivation needs and nothing more.
// A snapshot is plain JSON, so a run can be recorded (`--record`) and replayed as a
// test fixture: derive(snapshot, config, now) is the whole board.

export type CiState = 'SUCCESS' | 'FAILURE' | 'ERROR' | 'PENDING' | 'EXPECTED' | null;

/** A reviewer's latest approval or Request Changes (GitHub's latestOpinionatedReviews). */
export type Review = { author: string; state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING'; commit: string | null; submittedAt: string };

export type Pr = {
  number: number;
  title: string;
  url: string;
  isDraft: boolean;
  baseRef: string;
  headRef: string;
  headSha: string;
  author: string;
  labels: string[];
  reviews: Review[];
  ci: CiState;
  updatedAt: string;
};

export type Issue = { number: number; title: string; url: string; labels: string[]; assignees: string[] };

export type Merged = { number: number; title: string; url: string; mergedAt: string; author: string };

export type HeavyRun = { headSha: string; status: string; conclusion: string | null; createdAt: string; url: string };

export type Milestone = {
  number: number;
  title: string;
  url: string;
  state: 'open' | 'closed';
  dueOn: string | null;
  closedAt: string | null;
  openCount: number;
  closedCount: number;
};

/** The parts of a wrapper's kangaroo.config.ts the release workflow reads. */
export type WrapperConfig = { version: string | null; networkSeed: string | null; holochainVersion: string | null; bootstrapUrl: string | null };

export type WrapperPr = Pr & { config: WrapperConfig | null };

export type Snapshot = {
  app: {
    repo: string;
    defaultBranch: string;
    milestone: Milestone;
    nextMilestone: { number: number; title: string; url: string } | null;
    /** Every label of the repo whose name starts with the workstream prefix. */
    labels: { name: string; description: string }[];
    prs: Pr[];
    issues: Issue[];
    merged: Merged[];
    previousRelease: { tag: string; publishedAt: string } | null;
    ownRelease: { tag: string; publishedAt: string } | null;
    heavyRuns: HeavyRun[];
    /** Every #N the notes mention, looked up so its link and title are exact. */
    refs: Record<string, { kind: 'pr' | 'issue'; title: string; url: string }>;
    /** `version` in package.json on the default branch. */
    packageVersion: string | null;
    /** The Holochain line (0.7) of the holonix ref in flake.nix on the default branch. */
    holochainLine: string | null;
  };
  wrapper: {
    repo: string;
    releaseBranch: string;
    releaseConfig: WrapperConfig | null;
    /** How the open PRs of this release were found: a milestone of the same title, or the config's list. */
    markedBy: 'milestone' | 'config';
    prs: WrapperPr[];
  } | null;
  /** GitHub profile names of authors and assignees who are not in the config's maintainers. */
  names: Record<string, string>;
};
