// Pairs for the flow-graph direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
//
// Card click targets are the seeded equipment scenario's own text (Sarah,
// Marco, "CNC Machine · Proxxon MF70", …): identical strings on both sides,
// since the original's scenario seed script was ported verbatim into
// directions/flow-graph/backend.ts. Where a name repeats in the header (the
// perspective tab and the "writing as" button both say "Marco"), a step uses
// Playwright's `:nth-match()` to pick the right one, in the DOM order both
// sides share.
//
// The `blank` scenario ("Start from nothing: a new person") has no original
// counterpart — it is a port-only addition reached through `?fresh=1` (ISA
// claim 34) — so it is exercised manually, not compared here.
import type { Pair } from '../pairs';

const slug = 'flow-graph';
const original = 'F%20Flow%20Graph.dc.html';

const NDO_TITLE = 'CNC Machine · Proxxon MF70';
const RULE_ACCESS = 'Access requirement';
const RULE_LIMIT = 'Usage limit';
const RULE_TRANSFER = 'Transfer condition';
const RESOURCE_TITLE = 'Proxxon MF70 #1';
const COMMITMENT_TITLE = 'Sarah will lend for use Proxxon MF70 #1';

const DEV_ON_ORIG = { 'ndo-f-ui': JSON.stringify({ persp: 'network', dev: true }) };
const DEV_ON_PORT = { 'ndo-dev': '1' };
const DOCK_OPEN_ORIG = { 'ndo-f-ui': JSON.stringify({ persp: 'network', dock: true }) };
const DOCK_OPEN_PORT = { 'ndo-f-ui': JSON.stringify({ dock: true }) };

const pairs: Pair[] = [
  { slug, name: 'default', original: { path: original }, port: { path: '/prototypes/flow-graph' } },

  // Each conductor's view (the header "Whole network / Sarah / Marco" tabs).
  {
    slug,
    name: 'conductor-a',
    original: { path: original, steps: [{ click: 'text="Sarah"' }] },
    port: { path: '/prototypes/flow-graph?view=conductor-a' }
  },
  {
    slug,
    name: 'conductor-b',
    original: { path: original, steps: [{ click: 'text="Marco" >> nth=0' }] },
    port: { path: '/prototypes/flow-graph?view=conductor-b' }
  },

  // Developer details on, still on the Guide (no selection).
  {
    slug,
    name: 'dev-on',
    original: { path: original, storage: DEV_ON_ORIG },
    port: { path: '/prototypes/flow-graph', storage: DEV_ON_PORT }
  },

  // Activity dock open.
  {
    slug,
    name: 'dock-open',
    original: { path: original, storage: DOCK_OPEN_ORIG },
    port: { path: '/prototypes/flow-graph', storage: DOCK_OPEN_PORT }
  },

  // Side panel collapsed to the rail.
  {
    slug,
    name: 'panel-collapsed',
    original: { path: original, steps: [{ click: '[title="Hide panel"]' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: '[title="Hide panel"]' }] }
  },

  // "+ New entry" menu open.
  {
    slug,
    name: 'menu-open',
    original: { path: original, steps: [{ click: 'text="+ New entry"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="+ New entry"' }] }
  },

  // A root-action form: Create person.
  {
    slug,
    name: 'form-create-person',
    original: { path: original, steps: [{ click: 'text="+ New entry"' }, { click: 'text="Create person"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="+ New entry"' }, { click: 'text="Create person"' }] }
  },

  // A shared-resource card selected (Layer 0, its lifecycle/regime/nature badges).
  {
    slug,
    name: 'card-ndo',
    original: { path: original, steps: [{ click: `text="${NDO_TITLE}"` }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${NDO_TITLE}"` }] }
  },

  // Its "Change stage" form, exercising the select + dynamic successor field.
  {
    slug,
    name: 'form-change-stage',
    original: { path: original, steps: [{ click: `text="${NDO_TITLE}"` }, { click: 'text="Change stage"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${NDO_TITLE}"` }, { click: 'text="Change stage"' }] }
  },

  // The three governance-rule colour families (Layer 1 badges).
  {
    slug,
    name: 'card-rule-access',
    original: { path: original, steps: [{ click: `text="${RULE_ACCESS}"` }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${RULE_ACCESS}"` }] }
  },
  {
    slug,
    name: 'card-rule-limit',
    original: { path: original, steps: [{ click: `text="${RULE_LIMIT}"` }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${RULE_LIMIT}"` }] }
  },
  {
    slug,
    name: 'card-rule-transfer',
    original: { path: original, steps: [{ click: `text="${RULE_TRANSFER}"` }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${RULE_TRANSFER}"` }] }
  },

  // An item card (Layer 2, its operational-state badge).
  {
    slug,
    name: 'card-resource',
    original: { path: original, steps: [{ click: `text="${RESOURCE_TITLE}"` }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${RESOURCE_TITLE}"` }] }
  },

  // A promise card: exercises the provider-always-subject / "lend for use" fix.
  {
    slug,
    name: 'card-commitment',
    original: { path: original, steps: [{ click: `text="${COMMITMENT_TITLE}"` }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${COMMITMENT_TITLE}"` }] }
  },

  // Links legend: Agents and Structure toggles.
  {
    slug,
    name: 'legend-agents-on',
    original: { path: original, steps: [{ click: 'text="Agents"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="Agents"' }] }
  },
  {
    slug,
    name: 'legend-struct-off',
    original: { path: original, steps: [{ click: 'text="Structure"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="Structure"' }] }
  },

  // Zoom: fit and zoom in.
  {
    slug,
    name: 'zoom-fit',
    original: { path: original, steps: [{ click: 'text="Fit"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="Fit"' }] }
  },
  {
    slug,
    name: 'zoom-in',
    original: { path: original, steps: [{ click: 'text="+"' }, { click: 'text="+"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="+"' }, { click: 'text="+"' }] }
  },

  // "Writing as" switch to Marco (the second "Marco" in the header: the tab
  // is the first).
  {
    slug,
    name: 'writing-as-marco',
    original: { path: original, steps: [{ click: 'text="Marco" >> nth=1' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: 'text="Marco" >> nth=1' }] }
  },

  // Reset: select a card, then Reset, and land back on the Guide.
  {
    slug,
    name: 'reset',
    original: { path: original, steps: [{ click: `text="${NDO_TITLE}"` }, { click: 'text="Reset"' }] },
    port: { path: '/prototypes/flow-graph', steps: [{ click: `text="${NDO_TITLE}"` }, { click: 'text="Reset"' }] }
  }
];

export default pairs;
