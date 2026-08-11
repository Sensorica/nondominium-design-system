---
name: nondominium-design
description: Use this skill to generate well-branded interfaces and assets for Nondominium (the Sensorica Holochain app for resource governance without ownership), either for production or for throwaway prototypes and mocks. Contains the design tokens, brand brief, component playbook, and a navigable prototype of every screen the app has.
user-invocable: true
designsystem:
  spec: 1
  host_stack: sveltekit
  host_stack_source: mirrored
  source_stack: sveltekit
  output: static
  styling: unocss
  tokens: static/tokens.css
  brand_brief: README.md
  capabilities:
    playbook:      { routes: /patterns, categories: 7 }
    ndo-ui:        { routes: [/playbook, /ui-kit], package: packages/ndo-ui, owner: external }
    scenarios:     { routes: /scenarios, count: 6 }
    surface-keys:  { module: src/lib/surface-keys.ts, namespaces: [screen, scenario] }
    mock-state:    { module: src/lib/replica/stores.svelte.ts }
    prototype-app: { routes: /app, screens: 39, groups: [app, connection], mode: replica, data-states: 'src/lib/replica/stores.svelte.ts' }
    replica:       { source: ../nondominium/ui/src/lib/components, components: 24, check: 'bun run check:fidelity' }
    screen-map:    { shortcut: m, overlay: svelte }
    review:        { backend: github-discussions, repo: Sensorica/nondominium-design-review, category_id: DIC_kwDOT06gls4DDH2j }
    static-deploy: { target: gh-pages, base: /nondominium-design-system }
    registry:      { format: .svelte, status: active }
    parity:        { source: ../nondominium/ui, isa: ISA.md }
---

Read `README.md` in this repo first — it is the brand brief as well as the getting-started guide — then explore the referenced files.

If you are creating visual artifacts (slides, mocks, throwaway prototypes), lift the class strings from `/patterns` — they are the app's own — or use `static/tokens.css` when the output cannot run UnoCSS.

If you are working on production code, the app lives at `../nondominium/ui` and is **SvelteKit 5 + UnoCSS + Melt UI** over a three-zome Holochain DNA. Svelte 5 runes only, no `$:` reactive statements, not shadcn. Note that `documentation/TELOS.md` says not to use Tailwind utility classes directly in templates, and the app does exactly that throughout; the classes documented here describe what exists, not what that rule prescribes. Resolving the two is a decision for the team, not something this repo should paper over.

If the user invokes this skill without further guidance, ask what they want to build, ask a couple of questions, and act as an expert designer who outputs either static HTML artifacts or production code, depending on the need.

Key facts:

- **This repo documents the app as it is.** `src/lib/replica/` is a copy of `../nondominium/ui/src/lib/components`, rendering the same markup and the same UnoCSS classes. `bun run check:fidelity` fails if the classes ever diverge. Do not "improve" a replica component; change the app, then re-copy.
- **The brand is one logo, and it dresses this repo only.** `static/assets/nondominium-{logo,mark}.png` plus five `--ndo-brand-*` tokens sampled from it (teal `#14b8b8`, violet `#7048d8`, blue `#2f6bcc`, ink `#0b1a38`, and a gradient). They style the design-system chrome. Nothing inside `/app` uses them, because the app has no brand layer and the replica must not invent one.
- **Two component vocabularies live here.** `/patterns` and `src/lib/replica/` describe what the app writes inline **today** (descriptive). `/playbook`, `/ui-kit` and `packages/ndo-ui/` are the `@nondominium/ndo-ui` library the app is meant to move **to** (prescriptive, maintained separately). When they disagree — they already do on the stage colour map — that is a team decision, not something to settle by editing one side.
- **The app has no design tokens, no component library and no icon set.** It styles entirely in UnoCSS utility classes written inline. `static/tokens.css` is this repo's documentation of the Tailwind values in use, and exists to serve the `ndo-*` custom elements; the app does not import it.
- **Action colour is `blue-600`**; the canvas is `gray-100` page over `gray-50` sidebar over white cards. Colour that is not blue and not grey is carrying domain meaning.
- **Radii:** `rounded` for controls, `rounded-lg` for cards, `rounded-xl` for modals. A **dashed border** means declarative, empty, or not-yet-built.
- **No emoji and no icons** in the app, only text glyphs: `+`, `→`, `⎘`, `✓`, `⧉`. The three connection states are the sole exception.
- **Every URL comes from `src/lib/paths.ts`.** No route segment literal belongs anywhere else.
- **Half the screens are ones you cannot reach in a running app** — loading, error, empty, first-run onboarding, no-profile, no-agent-key, no-such-record. `?state=` serves them from the mock store; the components never see the param. `src/lib/records.ts` names the records the lifecycle screens are keyed to.
- **`lobby/GroupSidebar.svelte` is dead code in the app** (nothing imports it; `shell/Sidebar.svelte` replaced it) and is deliberately not replicated.
- **Every commentable or navigable surface has a key** in `src/lib/surface-keys.ts`, resolved from the whole URL because modal and tab states are query params.
- **The lifecycle transition table lives verbatim in `src/lib/replica/ndo/LifecycleTransitionModal.svelte`** and mirrors the Rust integrity zome. Check `documentation/specifications/specifications.md` §7.5 before touching it.
- Voice is plain and technical. Name constraints and say why; show nulls rather than inventing values.
