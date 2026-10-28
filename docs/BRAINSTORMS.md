# Brainstorms

`/brainstorms` lists every published Nondominium design board, newest first, with full-text search and filters by stage, status, project and language. Each one opens at `/brainstorms/<slug>` inside the site chrome, with the comments drawer on its own thread and a link to open the board full page.

A board is a Niceboard: one markdown source compiled into an interactive, offline page (stickies, decision cards with a "copy my answers" export, zoomable diagrams). The site publishes the compiled page as it is and indexes the source's frontmatter.

## Adding a board

1. Drop the source into `content/brainstorms/` as `YYYY-MM-DD-<slug>.md`, with this frontmatter at the top:

   ```yaml
   ---
   title: "Nondominium v0.1.0: the Moss release plan"
   date: 2026-10-27
   lifecycle: project-management
   project: nondominium
   status: open
   summary: "One or two sentences: what the board settles and where it stands."
   lang: en
   ---
   ```

   | Key | Values |
   |---|---|
   | `title` | the card's title; defaults to the source's `# heading` |
   | `date` | `YYYY-MM-DD`; defaults to the file name's date |
   | `lifecycle` | the board's stage on the V (below); defaults to `brainstorm` |
   | `project` | `nondominium` for now; the filter appears once there are two |
   | `status` | `open` (decision cards still waiting), `decided`, or `archived` |
   | `summary` | the card's text, and part of what search reads |
   | `lang` | `en` or `fr`; the board's own `<html lang>` too |

2. Compile it, from the repository root, into `static/brainstorms/boards/` under the same name:

   ```bash
   bun ~/.claude/skills/Niceboard/Tools/Board.ts content/brainstorms/<file>.md --out static/brainstorms/boards/<file>.html --public --no-drawer --no-sketch --theme <path to nondominium>/.local/state/theme.css --icon static/favicon.png
   ```

   `--public` builds the board without anything that only works on the author's machine; `--no-drawer` leaves out the live assistant drawer, since the site has its own comments drawer; `--no-sketch` leaves out the sketch wall, whose embedded Excalidraw bundle carries key-shaped strings the public-repo scan refuses and weighs about 8 MB. The compiler also writes a `<file>.manifest.json` beside the page: delete it, it is not published.

3. Commit both files. The build picks the board up; nothing else to register. With no boards the list shows its empty message.

Recompile whenever the source changes, so the page and the index never disagree.

The boards live in `boards/`, not beside the route, because the site prerenders `/brainstorms/<slug>` to `brainstorms/<slug>.html`: a compiled board of the same name would be overwritten by the page that frames it.

## The stages of the V

`lifecycle:` is the same key the board compiler reads to draw its own stage bar, so one word places the board on the board and in the index. The stages, in order:

| `lifecycle:` | Stage |
|---|---|
| `brainstorm` | Brainstorm: the options, before any choice |
| `requirements` | Requirements: what must be true |
| `architecture` | Architecture: the shape that makes it true |
| `interfaces` | Interfaces: the contracts between the parts |
| `project-management` | Project management: issues, milestones, release plans |
| `implementation` | Implementation: the build |
| `proofs` | Proofs: the tests and checks that show it works |
| `deployments` | Deployments: where it runs |

### The V on the site

`/workflow` draws the V: the eight stages in order, implementation at the point and on the axis of symmetry, the design stages descending on the left, and proofs and deployments rising on the right. Proofs faces project management and deployments faces interfaces. Each stage lists the published boards whose `lifecycle:` is that stage, newest first, each linking to its page at `/brainstorms/<slug>`. A stage with no board says so. Under 860px the V becomes a vertical list in the same order.

A board moves down the V as the work advances: when a brainstorm settles into requirements, change its `lifecycle:` (or publish the requirements board as its own file), recompile, and the board appears at its new stage on the next build. The stage labels come from `src/lib/brainstorms/labels.ts`, which mirrors the compiler's stage ids and order.

Do not add the compiler's `lifecycle-<stage>:` sibling keys to a published board: they point at local files or a local server, which the published site cannot reach.

## What may be published

A board committed here is published with the site, so treat it as public. It covers Sensorica and Nondominium only.

- Strip anything about other projects (hAppenings, Requests & Offers, EvoluData and the like) and anything personal before the source goes in `content/brainstorms/`.
- No local machine path, no `~/.claude` path, no `127.0.0.1` or `localhost` address (naming localhost in prose is fine), in the source or in the compiled page. Check the page with `grep -lE '/home/|~/\.claude|127\.0\.0\.1|//localhost' static/brainstorms/boards/*.html content/brainstorms/*.md`; it should print nothing.
- No credentials, private addresses or anything a participant asked to keep off the record.

## Comments and answers

Comments use the site's drawer (`src/lib/comments/`): one GitHub Discussion per board, keyed `brainstorm:<slug>` (`src/lib/surface-keys.ts`). Open it with **💬 Comments** in the board's bar, or press <kbd>c</kbd>.

The board's own interactions (picks on decision cards, notes, stickies) stay in the reader's browser. "copy my answers" on the board exports only what the reader changed; send it, or paste it into a comment, to share it with the team.

## Known limits

- **Size.** Each compiled board is 1.3 to 1.7 MB, because it carries its fonts and diagram renderer inline so it works offline. Every board adds that weight to the deploy and to the first load of its page.
- **No sketch wall.** Published boards are built with `--no-sketch`; sketching stays in the author's local copy of the board.
- **The frame.** The board runs in an iframe on `/brainstorms/<slug>`; its own theme follows the reader's system setting rather than the site's theme switch. "Open full page" shows it without the frame.
