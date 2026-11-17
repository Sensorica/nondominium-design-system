# Release boards

`/releases/<slug>` is the team's board for one release of [Nondominium](https://github.com/Sensorica/nondominium): where the milestone stands, the workstreams and their PRs, who holds the next step of each, the plan to the tag, the rules, the open calls and what landed.
The first is [v0.1.0](https://design.sensorica.co/releases/v0-1-0), milestone 11.
It is a port of the Requests and Offers release board, with two things made optional: the heavy-test workflow and the desktop wrapper, neither of which Nondominium has.
It is derived from GitHub, so it stays current without anyone regenerating it, and a wrong board is fixed where the truth lives: on GitHub.

## What it is made of

| File | Who writes it | What it holds |
|---|---|---|
| `content/releases/<slug>.release.yaml` | The team, by hand (on github.com is fine) | The milestone to read (and a heavy workflow and wrapper when there are any), the maintainers, the plan to the tag, and optional notes |
| `content/releases/<slug>.json` | `scripts/release-board.ts`, never a person | The whole board, in the `ReleaseBoard` shape of `src/lib/releases/types.ts` |
| `scripts/release-board/` | Code | `github.ts` reads GitHub, `derive.ts` turns what it read into the board, `config.ts` reads the release file |
| `.github/workflows/release-board.yml` | Code | Runs the script every hour and deploys when a board changed; on a pull request, runs the tests and parses the release files |

The page renders the JSON and nothing else.

## What is derived from GitHub

Nothing in this list is typed anywhere.

- **What is in the release**: every open PR and issue on the milestone the release file names, and every PR merged into the app's default branch since the previous release (the newest published GitHub release that is not this release's own tag).
- **The workstreams**: an item's workstream is its one label starting with `drop:`. The card's title is the label's name without the prefix; its line under the title is the label's description on GitHub, without the leading "Workstream:". The cards follow the order of `streams` in the release file, then any other `drop:` label in use, alphabetically.
- **Unsorted**: an item on the milestone with no `drop:` label, or with two, goes on a red **Unsorted** card at the top that says, item by item, what to change on GitHub. The card disappears when there is nothing to sort.
- **Each chip**: state (draft, changes asked, approved, ready), the fast CI of its head, the review behind its state, its author (for an issue, its assignees), and, when the release file names a heavy-test workflow, the **H** mark: the latest finished run of that workflow at the PR's current head. Nondominium has none (Sweettest and e2e run in `build.yml` on every pull request, so they are in the fast CI), so its chips carry no H. PRs are in stack order: a PR comes right after the PR whose branch it is based on.
- **The review decision**: any reviewer's standing Request Changes wins, then any approval. A Request Changes made on an older commit than the head is **stale**: the author has pushed since.
- **Who holds the next step**, from the PR's state alone, which is the rule below.
- **The numbers**: days to the tag (from the milestone's due date, read in Montreal), items closed on the milestone, open PRs and drafts, standing Request Changes, open PRs green on the heavy suite at their head (only with a heavy workflow), PRs merged since the previous release (for a first release, every merge into the default branch since the start).
- **The desktop card**, from the wrapper repo, when the release file names one: see below.
- **The links**: the milestone, the release's open PRs, the heavy-test runs and the wrapper repo when there are any, the next milestone (the open one due soonest after this one with a due date).

## Who holds the next step

The rule, as `nextStep` in `scripts/release-board/derive.ts` implements it, PR by PR:

1. A draft is its author's, to take out of draft.
2. A Request Changes at the current head is the author's, to answer.
3. A Request Changes the head has moved past is the reviewer's, to re-review.
4. A ready PR nobody has reviewed is the other maintainer's to review, when its type needs review: `feat`, `refactor`, and any type that is not self-merged (a title with no conventional-commit type counts as needing review).
5. A ready PR of a self-merged type (`fix`, `docs`, `chore`, `test`, `copy`) is its author's, to merge after a green run; so is an approved PR of any type.
6. A PR to merge whose fast CI is not green is its author's, to make green. A repo with no checks has nothing to wait for.

The type is the conventional-commit prefix of the PR title (`feat(messaging): ...` is `feat`). "The other maintainer" is every maintainer in the release file except the author; for a PR from outside the team, any maintainer.
This is the merge rule the Requests and Offers team decided on 11 November 2026 (feat and refactor get the other maintainer's review; fix, docs, chore, test and copy are self-merged after a green run). Whether it is Nondominium's rule is an open call on the v0.1.0 board.
A card's "Holds it" counts the PRs each person holds; its "Next" says what each one does, then the card's note if it has one.
Issues show on the cards but are not counted in who holds what.

## The desktop card

Only when the release file names a wrapper repo; Nondominium has none, since v0.1.0 ships as a Moss tool. The card reads:

- **Its PRs for this release**: the open PRs of a wrapper milestone with exactly the app milestone's title; until the wrapper has one, the PRs listed under `wrapper.prs` in the release file.
- **The pairing**: `holochainVersion` in `kangaroo.config.ts` on the wrapper's release branch (`release` unless the file says otherwise), against the Holochain line of the app (the `holonix?ref=main-0.7` in `flake.nix` on its default branch). The app's release workflow stops when the two lines differ, so the card says **No** then. When they pair it also checks `version` in the app's `package.json` against the release's version, because the workflow refuses a tag that differs from it (**Not yet**). Only then does it say **Yes**.
- **For each wrapper PR**: the branch it targets (a PR on `main` does not reach a release built from `release`) and the Holochain version, version and network seed its own `kangaroo.config.ts` carries.

The board cannot see repository secrets, so whether the `KANGAROO_PAT` secret the desktop job pushes with exists is an open call, not a check.

## How to fix a wrong board

| What is wrong | Fix it on GitHub |
|---|---|
| A PR or issue is missing | Put it on the release's milestone |
| It is on the wrong card | Give it the right `drop:` label and remove the other |
| It is on the Unsorted card | Give it exactly one `drop:` label |
| A card's description is wrong | Edit the label's description (Issues, Labels) |
| A chip shows the wrong state | It is GitHub's state: the review, the draft flag or the CI is what changes it |
| Someone holds a step they should not | Their PR's state says so: a stale Request Changes is the reviewer's until they re-review; a `feat` waits on review until it is approved |
| The days to the tag are wrong | Change the milestone's due date |
| A wrapper PR is missing | Give the wrapper a milestone named exactly like the app's milestone, and put the PR on it |

The board picks the change up on its next hourly run.
Anything else (the plan, the rules, the calls, a note) is in the release file.

## How to edit the release file

Open `content/releases/<slug>.release.yaml` on github.com and use the pencil.
The pull request's checks parse it (`scripts/release-board/check-config.ts`) and name the field if an edit broke it.

- Keep every note in "double quotes". A note that starts with `#` and has no quotes is read as a comment and disappears.
- `#121` links to the app's PR or issue 121.
- `[text](https://...)` is a link; `[text](meeting:2026-10-27-dev)` links to a meeting of this site, with `#anchor` for a part of it.
- `[decided 27 Oct](source:2026-10-27-dev#decisions-6)` is the small source link set after a sentence.
- `**bold**` is bold.
- Dates are `"YYYY-MM-DD"`, in quotes. A plan step has `from`, `to` (left out for a one-day step), `kind` (`phase` or `milestone`), `tone` (`ok`, `warn`, `bad` or `accent`), `title`, and for a phase `who` and `what`.

Every note is optional: with all of them empty, the board is still complete and correct.
A note should say what GitHub cannot: a decision, a call, a reason. A note that repeats a state GitHub has goes stale the day the state changes.

## How to add the next release

1. Copy the current release file to `content/releases/<new-slug>.release.yaml` and change `slug`, `title`, `app.milestone`, the plan and the notes.
2. Run the script once locally (below) and commit both files, or let the workflow write the JSON.
3. If the schedule stopped itself after the last release closed, enable it again: Actions, Release board, Enable workflow.

A release whose milestone is closed gets one final board, then the script skips it.

## Run it locally

```bash
bun scripts/release-board.ts            # every release file; reads GH_TOKEN, else `gh auth token`
bun scripts/release-board.ts v0-1-0     # one release
bun scripts/release-board.ts --force    # rewrite even when nothing changed
bun scripts/release-board.ts v0-1-0 --record scripts/release-board/fixtures   # also save what GitHub said, as a test fixture
bun test scripts/release-board          # the derivation, on recorded snapshots, no network
```

A board whose content did not change is left untouched on disk, so `git diff` says whether anything moved; the only thing a rewrite of an unchanged board would change is its measurement instant.

## The schedule, and what it costs

`.github/workflows/release-board.yml` runs at minute 17 of every hour, and on demand from the Actions tab.

- It checks out `master`, installs nothing (the script uses only bun's standard library), and derives every open release.
- When a board changed, it commits the JSON to `master` as `github-actions[bot]` and starts both deploy workflows, `deploy.yml` (GitHub Pages) and `deploy-cloudflare.yml` (design.sensorica.co). A push made with the workflow's `GITHUB_TOKEN` starts no other workflow, which is why the deploys are started with a `workflow_dispatch`: that event is one of the documented exceptions ([GitHub docs: when GITHUB_TOKEN triggers workflow runs](https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs)). It needs the `actions: write` permission, which the workflow declares.
- It needs no secret of its own: Sensorica/nondominium is public, and the deploys use the secrets they already have.
- This repo is public, so the hourly runs use no metered Actions minutes.
- On a pull request that touches the board, a `checks` job runs `bun test scripts/release-board` and parses every release file instead.
- When every tracked milestone is closed, the scheduled run that commits the final board disables the workflow, so it costs nothing until it is enabled again for the next release.

The page's "Measured from GitHub" line is the time the board last changed: an hourly run that finds nothing new does not rewrite it.
