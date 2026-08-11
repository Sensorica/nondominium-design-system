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
    playbook:      { routes: /playbook, categories: 7 }
    scenarios:     { routes: /scenarios, count: 6 }
    surface-keys:  { module: src/lib/surface-keys.ts, namespaces: [screen, scenario] }
    mock-state:    { module: src/lib/state.svelte.ts }
    prototype-app: { routes: /app, screens: 27, groups: [shell, gate] }
    flow-guards:   { machines: [joining, lifecycle] }
    screen-map:    { shortcut: m, overlay: svelte }
    review:        { backend: github-discussions, repo: Sensorica/nondominium-design-review, category_id: DIC_kwDOT06gls4DDH2j }
    static-deploy: { target: gh-pages, base: /nondominium-design-system }
    registry:      { format: .svelte, status: active }
    parity:        { source: ../nondominium/ui, isa: ISA.md }
---

Read `README.md` in this repo first — it is the brand brief as well as the getting-started guide — then explore the referenced files.

If you are creating visual artifacts (slides, mocks, throwaway prototypes), reference `static/tokens.css` for every colour, type, spacing and radius value, and lift component recipes from `/playbook`. Never hardcode a hex value; every one of them has a token.

If you are working on production code, the app lives at `../nondominium/ui` and is **SvelteKit 5 + UnoCSS + Melt UI** over a three-zome Holochain DNA. Svelte 5 runes only, no `$:` reactive statements, no Tailwind utility classes in templates, not shadcn.

If the user invokes this skill without further guidance, ask what they want to build, ask a couple of questions, and act as an expert designer who outputs either static HTML artifacts or production code, depending on the need.

Key facts:

- **Domain semantics are the visual system.** Lifecycle stage, resource nature and property regime each own a colour family and a badge variant. The mapping lives in `src/lib/ndo-ui.ts` and is never re-picked at a call site.
- **8px is the base radius**; pill radius is reserved for badges, chips and status dots, so a badge is never mistaken for a control.
- **Primary is blue** `#2563eb`, extracted by frequency from the production UI. Colour that is not primary and not grey is carrying domain meaning.
- **Emoji are the icon system.** No icon font, no SVG set. 🧿 is the brand mark.
- **Every URL comes from `src/lib/paths.ts`.** No route segment literal belongs anywhere else.
- **Every commentable or navigable surface has a key** in `src/lib/surface-keys.ts`. Keys are stable; URLs are not.
- **The lifecycle transition table in `src/lib/guards/useLifecycleFlow.svelte.ts` mirrors the Rust integrity zome.** Do not add a transition to it without checking `documentation/specifications/specifications.md` §7.5 in the app repo.
- Voice is plain, precise and unhurried. Name constraints and say why; show nulls rather than inventing values.
