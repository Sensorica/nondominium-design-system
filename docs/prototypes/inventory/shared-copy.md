# Shared prototype layer — Claude Design copy fidelity

Every wording fix made to `src/lib/prototypes/ui/*.svelte` to match its `docs/prototypes/original/prototypes/ui.jsx` (and `core.jsx`) original exactly: labels, hints, placeholders, option texts, button labels, and static prose. One class of defect: the port had reworded ui.jsx's copy. `RuleModal.svelte` was already fixed before this pass and is the model the rest follow; it required no further change here.

Where the original calls `plain()` (PChoice buttons, several option texts), the port keeps calling `plain()`. Where the original shows a raw enum value or a literal string, the fix removes the port's `plain()` call and shows that exact raw value or string.

## `NoteModal.svelte`

| String | Before | After |
|---|---|---|
| Field label | `What did you do? *` | `description *` (raw WorkLog field name, per ui.jsx) |
| Textarea placeholder | `What did you do? What should the next person know?` | `What did you do? What should the next agent know?` |
| Field label | `Hours *` | `hours *` (raw field name) |

## `AttachModal.svelte`

| String | Before | After |
|---|---|---|
| Field label | `How they relate` | `NdoLinkType` (raw RuleData-style field name) |
| Field label | `Target resource` | `Target NDO` |
| Empty-list message | `No other resource to link to yet.` | `No other NDO to link to yet.` |
| Button label | `Create link` | `Create hard link` |

## `AdvanceModal.svelte`

| String | Before | After |
|---|---|---|
| Modal sub | `{ndo.name} is {plain(ndo.stage)}. Started by {agent}.` | `{ndo.name} is {ndo.stage}. Initiator: {agent}.` (raw stage, original label) |
| Terminal-stage message | `Retired is final. No further stage changes.` | `EndOfLife is terminal. No further transitions.` (raw stage name) |
| Hibernating hint | `Pauses the resource. Resuming returns it to {plain(ndo.stage)}.` | `Suspends the NDO. Resuming returns it to {ndo.stage}.` (raw stage) |
| Field label | `The resource that replaces it (required)` | `Successor NDO (required)` |
| Empty option | `Pick a successor` | `— pick a successor` (original em-dash text, kept verbatim) |
| Button label | `Move to {plain(to)}` | `Move to {to}` (raw target stage) |

## `CommitModal.svelte`

| String | Before | After |
|---|---|---|
| Field label | `What` | `VfAction` |
| Field label | `Item` | `Resource` |
| Option text | `{r[0]} · {plain(r[1])}` | `{r[0]} · {r[1]}` (raw operational state) |
| Field label | `From` | `Provider` |
| Button label | `Send request` | `Propose` |

## `ReceiptsModal.svelte`

| String | Before | After |
|---|---|---|
| Empty-list message | `None yet. Complete a request or pick up a suggestion.` | `None yet. Fulfil a commitment or take up a signal.` |

## `GroupModal.svelte`

| String | Before | After |
|---|---|---|
| "Group created" sub | `{name} is its own shared space. Share the invite link so others can join.` | `{name} is its own DHT. Share the invite link so others can join.` |

Port-only addition kept: the "✓ Copied" label swap after the copy button is clicked. Not present in ui.jsx at all (it always shows "⎘ Copy invite link"); kept because it is UX feedback on a state the default screen never shows (before any click) and does not appear in the compare harness's rendered state — flagged here rather than removed silently, since it is not zome-required. Left in place as out of strict scope for this pass (no ISC covers post-click states); worth a follow-up decision.

## `CommitmentsModal.svelte`

| String | Before | After |
|---|---|---|
| Claimed-request label | `done` | `claimed` |
| Empty-list message | `No requests yet.` | `No commitments yet.` |
| Button label | `+ New request` | `+ Propose commitment` |

## `BrowseModal.svelte`

| String | Before | After |
|---|---|---|
| Select label / `aria-label` | `Any type` / `Type` | `Any nature` / `Nature` |
| Select label / `aria-label` | `Any ownership` / `Ownership` | `Any regime` / `Regime` |
| Stage/nature/regime option text | `{plain(x)}` | `{x}` (raw enum value; ui.jsx's `sel()` helper never calls `plain()` for these three selects) |
| Result row | `{plain(n.stage)} · {plain(n.regime)} · {plain(n.nature)} · N open requests` | `{n.stage} · {n.regime} · {n.nature} · N open commitments` (raw values, original noun) |
| Empty-list message | `No resources match. Resources belong to groups: create or join one to see more.` | `No NDOs match. NDOs are scoped to groups: create or join one to see more.` |

## `ResourcesModal.svelte`

| String | Before | After |
|---|---|---|
| "Something happened" option text | `{plain(x)}` | `{x}` (raw VfAction value; ui.jsx shows these five raw) |
| Empty-list message | `No items yet.` | `No resources yet.` |
| Field label | `New item` | `New resource` |
| Field hint | Developer-gated: dev text vs `It starts waiting for approval, with you holding it.` | Always `create_economic_resource · starts PendingValidation with you as custodian` (ui.jsx's hint here is a static literal, not gated on Developer details) |

## `ProfileModal.svelte`

| String | Before | After |
|---|---|---|
| Empty-name placeholder | `?` | `—` (ui.jsx literal, kept verbatim) |
| Roles line | `{roles.map(plain).join(', ')}` | `{roles.join(', ')}` (raw role names) |
| Agent/groups line | Gated on Developer details; text `agent uhCAkT1b3r1usK9x… · roles {roles}` | Always shown; `agent uhCAkT1b3r1usK9x… · joined 3 groups` (ui.jsx shows this unconditionally, and it is a fixed literal, not derived) |
| Handle placeholder | `max 64 characters` | `max 64 chars` |
| Field label | `Picture URL` | `Avatar URL` |
| Avatar hint | `Optional, must start with https://. Without it, your initials are shown.` | `Optional, must start with https://. Without it, initials are shown.` |
| Private-data heading | `Private details` (+ Developer-gated suffix) | `Private data · store_private_person_data` (always shown, ui.jsx literal) |
| Private-data paragraph | `Shared only when you allow it (grant_private_data_access when Developer details is on), for example with the next person to hold an item you hand over.` | `Shared only through a capability grant (grant_private_data_access), e.g. with the next custodian during a transfer.` (always shown) |
| Roles hint | Developer-gated: dev text vs `Trusted roles are confirmed by other members.` | Always `assign_person_role · Accountable roles need peer validation (request_role_promotion)` |
| Role toggle button text | `{plain(r)}` | `{r}` (raw role name) |
| Reputation heading | `Reputation` (+ Developer-gated suffix) | `Reputation · derive_reputation_summary` (always shown) |
| Reputation line | `{custody} hand-overs · {service} services · {creation} created` | `{custody} custody · {service} service · {creation} creation` |
| Extra `<Call>` line | `zome_person::update_person · assign_person_role` | Removed entirely — ui.jsx's `ProfileModal` has no `PCall` at all |

## `FlowMenu.svelte`

| String | Before | After |
|---|---|---|
| Trigger button title | `Everything you can do (Ctrl+K)` | `Everything you can do (⌘K)` |
| Menu footer tip | `Tip: press Ctrl+K (⌘K on a Mac) to open this menu` | `Tip: press ⌘K to open this menu` |

All menu section titles and thirteen item labels already matched ui.jsx exactly; no changes needed there.

## `Onboarding.svelte`

| String | Before | After |
|---|---|---|
| Step-3 label | `First resource` | `First NDO` |
| Profile subtitle | `Your name and picture are visible to the groups you join. Private details stay on your device.` | `Your conductor holds your agent key. The profile is public in the Lobby DHT; private data stays on your source chain.` |
| Avatar-preview caption | `Without a picture, your initials show on a colour that is always the same for you.` / `Paste an https:// image link below to use your own.` | `Default avatar: your initials on a colour derived from your agent key.` / `Paste an https:// image URL below to use your own.` |
| Field label | `Picture URL (optional)` | `Avatar URL (optional)` |
| Profile-step closing line | `You start as a member. Trusted roles come later, when other members confirm them.` | `You start as a SimpleAgent. Accountable roles come later, through peer validation.` |
| Start-step subtitle | `Resources live in groups. Start from the example network, from a blank group, or with an invite link.` | `NDOs are scoped to groups. Start from the example network, from a blank canvas, or with an invite link.` |
| Card 2 title | `Blank group` | `Blank canvas` |
| Card 2 description | `Create a new, empty group. You'll add its first resource next.` | `Create a new, empty group in the prototype network. You'll declare its first NDO next.` |
| NDO-step header | `Add your first shared resource` | `Declare your first NDO` |
| NDO-step subtitle | `A resource starts as an idea. You started it, so only you can move it through its stages.` | `An NDO starts in Ideation. You are its initiator, so only you can move it through its lifecycle.` |
| NDO-step button | `Add resource` | `Declare NDO` |

## Verified unchanged (no divergence found)

`Modal.svelte`, `Field.svelte`, `Choice.svelte`, `ErrorNote.svelte`, `Call.svelte`, `ModalActions.svelte`, `Avatar.svelte`, `AgentAvatar.svelte`, `AgentChip.svelte`, `GroupScope.svelte`, `HelpModal.svelte`, `JoinModal.svelte`, `CreateNdoModal.svelte`, `WhyModal.svelte`, `Toasts.svelte` (including `plain.ts`'s `stageLabel`/`peersLabel`, which already match `core.jsx`'s `STAGE_LABEL` and peers text word for word), `RuleModal.svelte` (fixed before this pass; `ENUM.accessibility`/`ENUM.transfer` in `store/logic.ts` confirmed to match ui.jsx's inline option arrays), `ModalHost.svelte` (routing only, no copy).

## Verification

- `bun run check:prototypes`: passes before and after every edit in this pass (store/zome rules untouched).
- `bunx svelte-check --tsconfig ./tsconfig.json`: 0 errors, 28 pre-existing warnings unrelated to these files.
- `ORIG_PORT=8791 bun run compare:prototypes shared`: 20/20 pairs within threshold, before and after.
- `ORIG_PORT=8791 bun run compare:prototypes mycelium`: 21/21 pairs within threshold, before and after.
