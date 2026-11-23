# Architecture boards

`/architecture` lists every published Nondominium architecture board, newest first, with the same search and filters as `/brainstorms`.
Each one opens at `/architecture/<slug>` inside the site chrome, with the comments drawer on its own thread and a link to open the board full page.

An architecture board is not a brainstorm.
A brainstorm weighs options before any choice.
An architecture board draws the structure of the system, as it runs and as it is planned.
So the two live on separate surfaces, and the architecture boards sit at the architecture stage of the V on `/workflow`.

## Format

An architecture board is the same kind of file as a brainstorm board: a Niceboard source, compiled to one offline page.
The frontmatter, the compile command, what may be published and the known limits are in [BRAINSTORMS.md](BRAINSTORMS.md), with two differences.

- The source goes in `content/architecture/` as `YYYY-MM-DD-<slug>.md`, and the compiled page in `static/architecture/boards/<same name>.html`.
- The frontmatter carries `template: architecture` and `lifecycle: architecture`.
- The frontmatter also carries `repo: Sensorica/nondominium` and the full `sha:` of the commit the board is read at, so every code reference in a spec links to its file and lines on GitHub at that commit.
- Every component carries `links:`, a list of `label` and `url`: the issues, pull requests and documents it names, on GitHub, and the pages of this site that show it (a replica screen, a scenario, the ndo-ui playbook) as root-relative paths. A component that names none links to its source at the board's commit.

Compile it from the repository root with the command in step 2 of [BRAINSTORMS.md](BRAINSTORMS.md#adding-a-board), reading `content/architecture/<file>.md` and writing `static/architecture/boards/<file>.html`.
Delete the `<file>.manifest.json` the compiler writes beside the page.
Commit both files; the build picks the board up and nothing else needs registering.

A link from one board to another is root-relative to the site: `/architecture/<slug>` for an architecture board, `/brainstorms/<slug>` for a brainstorm.

## Code

The two surfaces share one loader and two components, so they cannot drift apart.

- `src/lib/brainstorms/index.ts` holds `parseBoard`, which turns a source into an index entry.
- `src/lib/architecture/index.ts` reads `content/architecture/` through it.
- `src/lib/brainstorms/BoardList.svelte` is the list page and `src/lib/brainstorms/BoardFrame.svelte` is the framed board; `/brainstorms` and `/architecture` pass each its own heading, content directory and links.
- `src/lib/paths.ts` has `architecture()`, `architectureBoard(slug)` and `architectureBoardFile(slug)`.

## Comments

One GitHub Discussion per board, keyed `architecture:<slug>` (`src/lib/surface-keys.ts`).

## Old URLs

Architecture boards were published under `/brainstorms` until 2026-11-20.
Their old addresses still work on both hosts.
GitHub Pages has no `_redirects` file, so each old address is a prerendered redirect page in the build.

| Old address | Lands on |
|---|---|
| `/brainstorms/<slug>` | `/architecture/<slug>` |
| `/brainstorms/boards/<slug>.html` | `/architecture/boards/<slug>.html` |

`src/routes/brainstorms/[slug]/+page.server.ts` and `src/routes/brainstorms/boards/[slug].html/+server.ts` generate them from the architecture boards, so a new architecture board gets its `/brainstorms` addresses redirected too.
