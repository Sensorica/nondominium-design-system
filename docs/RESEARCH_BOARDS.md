# Research boards

`/research` lists every published research board, newest first, with the same search and filters as `/brainstorms`.
Each one opens at `/research/<slug>` inside the site chrome, with the comments drawer on its own thread and a link to open the board full page.

A research board is not a brainstorm and not a stage of the V.
It reports what was learned outside Nondominium (another system, protocol or project compared with ours), with a source for every finding.
So it has its own surface, and it does not appear on `/workflow`.

## Format

A research board is the same kind of file as a brainstorm board: a Niceboard source, compiled to one offline page.
The frontmatter, the compile command, what may be published and the known limits are in [BRAINSTORMS.md](BRAINSTORMS.md), with three differences.

- The source goes in `content/research/` as `YYYY-MM-DD-<slug>.md`, and the compiled page in `static/research/boards/<same name>.html`.
- The frontmatter carries no `lifecycle:`: research is not a stage the compiler knows, and it refuses one it does not. `src/lib/research` marks every board `research` instead.
- The page is a reading surface, not the brainstorm wall: compile it with a theme that layers the reading overrides (no tilts, no hand lettering) over the Nondominium theme.

Compile it from the repository root with the command in step 2 of [BRAINSTORMS.md](BRAINSTORMS.md#adding-a-board), reading `content/research/<file>.md` and writing `static/research/boards/<file>.html`.
Delete the `<file>.manifest.json` the compiler writes beside the page.
Commit both files; the build picks the board up and nothing else needs registering.

## Code

The surface reuses the brainstorm loader and components, so the three surfaces cannot drift apart.

- `src/lib/research/index.ts` reads `content/research/` through `parseBoard`.
- `src/routes/research/` passes `BoardList.svelte` and `BoardFrame.svelte` its own heading, content directory and links.
- `src/lib/paths.ts` has `research()`, `researchBoard(slug)` and `researchBoardFile(slug)`.

## Comments

One GitHub Discussion per board, keyed `research:<slug>` (`src/lib/surface-keys.ts`).
