# Branch previews

Every branch pushed to this repo is built and published on its own address. `/previews` lists them all, with the pull request each one belongs to.

## Getting a preview

Push a branch. That is all: no label, no naming rule, nothing to register. `.github/workflows/deploy-cloudflare.yml` runs on every push and deploys the build to the `nondominium-design` Cloudflare Pages project with the branch name:

| Branch | Served at |
|---|---|
| `master` | https://design.sensorica.co (production) |
| any other, e.g. `feat/branch-previews` | https://feat-branch-previews.nondominium-design.pages.dev |

Cloudflare lowercases the branch name and turns every character that is not a letter or a digit into a hyphen. The alias always points at the branch's latest push; each push also keeps its own permanent hash address, listed in the run's log.

## What is and is not covered

- A branch cut before this workflow existed carries the old copy, which deploys `master` only, so it gets no preview until it is rebased onto (or merges) `master`. Never run that old copy by hand with **Run workflow** on such a branch: it passes `--branch master` and would publish the branch as production.

- A pull request from a fork gets no preview: the workflow needs the repo's Cloudflare secrets, which GitHub does not hand to forks.

- `delete_branch_on_merge` is on, so a merged branch disappears from `/previews`. Its last preview stays on Cloudflare but nothing links to it.

- Signing in with GitHub to comment needs the Pages secret `GITHUB_APP_CLIENT_SECRET`, which Cloudflare keeps per environment. Unless it is also set for the Preview environment, use the token paste route on a preview.

- Per-branch subdomains under `design.sensorica.co` are not possible while `sensorica.co` is served by GoDaddy DNS; Cloudflare can only pin a custom domain to a branch through its own DNS.

## The page

`/previews` reads the branches and open pull requests from the GitHub API in the browser (`src/lib/previews.ts`), so it never goes stale and needs no build. Anonymous GitHub API calls are limited to 60 an hour per address; when the limit is hit the page says so and offers to retry.

## Later, if the list gets noisy

Decided on 2026-10-09: start with every branch. If the list ever grows too long, the page can filter on a pull-request label (for example `preview`) without touching the workflow. That is a filter on the same list, not a new deploy path, and nobody needs it yet.
