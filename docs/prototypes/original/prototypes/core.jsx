// Shared data + store for the A–E prototypes. Scenario data follows documentation/Applications/user-story/*.
// Every action is annotated with the zome call it stands for; see BACKEND.md.
const PROTO_KEY = 'ndo-stigmergy-proto-v5';
const ME = { id: 'tib', name: 'Tiberius', roles: ['AccountableAgent', 'Transport', 'Repair'] };
const AGENTS = { tib: 'Tiberius', sar: 'Sarah', mar: 'Marco', che: 'Chen Wei', ele: 'Elena', may: 'Maya', jp: 'Jean-Pierre', mit: 'Dr. Mitchell', vas: 'Elena V.', mc: 'Marcus', dk: 'David', sop: 'Sophie', mg: 'Maria', jc: 'James' };
const STAGES = ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'];
const NEXT_STAGE = { Ideation: 'Specification', Specification: 'Development', Development: 'Prototype', Prototype: 'Stable', Stable: 'Distributed', Distributed: 'Active', Active: 'Hibernating', Hibernating: 'Active' };
const ENUM = {
  regime: ['Nondominium', 'Commons', 'Collective', 'Pool', 'CommonPool', 'Public', 'Private'],
  nature: ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'],
  opstate: ['Available', 'Reserved', 'InTransit', 'InStorage', 'InMaintenance', 'InUse', 'PendingValidation'],
  role: ['SimpleAgent', 'AccountableAgent', 'PrimaryAccountableAgent', 'Transport', 'Repair', 'Storage'],
  rule: ['AccessRequirement', 'UsageLimit', 'TransferCondition', 'MaintenanceSchedule'],
  action: ['AccessForUse', 'TransferCustody', 'Use', 'Work', 'Move', 'Modify', 'Cite'],
};
// Backend state machine (zome_resource integrity): forward chain, suspend/resume, terminal exits.
function allowedStages(n) {
  const fwd = { Ideation: 'Specification', Specification: 'Development', Development: 'Prototype', Prototype: 'Stable', Stable: 'Distributed', Distributed: 'Active' };
  if (n.stage === 'EndOfLife') return [];
  if (n.stage === 'Deprecated') return ['EndOfLife'];
  if (n.stage === 'Hibernating') return [n.hibernation_origin || 'Active', 'Deprecated', 'EndOfLife'];
  return [fwd[n.stage], 'Hibernating', 'Deprecated', 'EndOfLife'].filter(Boolean);
}
// Plain-language layer: newcomers see everyday words; "Developer details" (menu) shows the hApp's own terms.
const NDO_DEV = (() => { try { return localStorage.getItem('ndo-dev') === '1'; } catch (e) { return false; } })();
const PLAIN = {
  Ideation: 'Idea', Specification: 'Being specified', Development: 'In development', Prototype: 'Prototype', Stable: 'Stable', Distributed: 'Distributed', Active: 'Active', Hibernating: 'Paused', Deprecated: 'Replaced', EndOfLife: 'Retired',
  Nondominium: 'Uncapturable', Commons: 'Commons', Collective: 'Co-owned', Pool: 'Shared pool', CommonPool: 'Common pool', Public: 'Public', Private: 'Private',
  Hybrid: 'Physical + digital', Rivalrous: 'One user at a time', NonRivalrous: 'Many users at once',
  InTransit: 'On the move', InStorage: 'In storage', InMaintenance: 'Being repaired', InUse: 'In use', PendingValidation: 'Waiting for approval',
  AccessForUse: 'Borrow', TransferCustody: 'Hand over', Work: 'Work on',
  AccessRequirement: 'Who can access', UsageLimit: 'Usage limit', TransferCondition: 'Hand-over condition', MaintenanceSchedule: 'Maintenance schedule',
  SimpleAgent: 'Member', AccountableAgent: 'Trusted member', PrimaryAccountableAgent: 'Steward',
  Free: 'Open to all', Credentialed: 'Needs a role', Gated: 'Needs approval', Custody: 'Custody', validated: 'needs approval',
  CustodyTransfer: 'Handed over an item', CustodyAcceptance: 'Took responsibility for an item', RuleCompliance: 'Followed the rules', ResourceValidation: 'Approved something', ResourceCreation: 'Created a resource', MaintenanceFulfillmentCompleted: 'Did maintenance', TransportFulfillmentCompleted: 'Transported an item',
  Component: 'is part of', DerivedFrom: 'is derived from', Supersedes: 'replaces',
};
// Plain words are always shown; "Developer details" only adds technical extras (zome calls, hashes, rule chains).
function plain(t) { if (t == null) return t; const s = String(t); if (PLAIN[s]) return PLAIN[s]; return s.split(' · ').map(p => PLAIN[p.trim()] || p).join(' · '); }

const PPR_TYPES = { TransferCustody: ['CustodyTransfer', 'CustodyAcceptance'], AccessForUse: ['RuleCompliance', 'RuleCompliance'], Move: ['TransportFulfillmentCompleted', null], Work: ['MaintenanceFulfillmentCompleted', null], Modify: ['MaintenanceFulfillmentCompleted', null], Use: ['RuleCompliance', null], Cite: ['RuleCompliance', null] };

const SEED = {
  profile: { name: 'Tiberius', handle: 'tibi', bio: 'Transport and repair, FabLab network', avatar: '', private: { email: 'tiberius@fablab.example', location: 'Montréal', time_zone: 'America/Toronto' } },
  groups: [{ id: 'sen', name: 'Sensorica', desc: 'Open value network, Montréal', invite: 'ndo-invite:sen-4f9q' }, { id: 'ovn', name: 'Open Value Network', desc: 'Research, art and fabrication commons', invite: 'ndo-invite:ovn-2k7m' }],
  // A group Tiberius has been invited to but not joined yet (food basket user story). Paste the code in "Join group".
  invites: { 'ndo-invite:food-7k2p': { group: { id: 'food', name: 'Local Food Coop', desc: '8 farms, 3 community kitchens, 2 hubs', invite: 'ndo-invite:food-7k2p' },
    ndos: [{ id: 'seed', name: 'Weekly Organic Baskets', group: 'food', stage: 'Active', regime: 'CommonPool', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'mg', desc: 'Maria Garcia\'s weekly harvest, consolidated at the hub by James Chen. Food safety and temperature tracking rules.', hash: 'uhC0hH5jK6lm', x: 320, y: 650 }],
    rules: { seed: [['AccessRequirement', 'Credentialed · Storage'], ['MaintenanceSchedule', '7 d · Repair · cold chain']] },
    instances: { seed: [['Harvest baskets · 40', 'Available', 'mg'], ['Refrigerated van', 'InMaintenance', 'jc']] },
    links: [['seed', 'sol', 'use']] } },
  ndos: [
    { id: 'sol', name: 'CNC Machine · Proxxon MF70', group: 'sen', stage: 'Active', regime: 'Pool', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'sar', desc: 'Modified desktop CNC mill at the Sensorica Workshop, Montréal. Lent to partner FabLabs under certified-operator rules.', hash: 'uhC0kVX5k7dL', x: 330, y: 360 },
    { id: 'sns', name: 'Environmental Sensor Design v3', group: 'ovn', stage: 'Distributed', regime: 'Commons', nature: 'Digital', rivalry: 'NonRivalrous', initiator: 'tib', desc: 'Open design for climate-research sensors, commissioned by Dr. Sarah Mitchell and produced across three makerspaces.', hash: 'uhC0mQ2pT8wa', x: 560, y: 250 },
    { id: 'las', name: 'Cryo-EM CEM-3000', group: 'ovn', stage: 'Active', regime: 'Pool', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'che', desc: 'Cryogenic electron microscope at the Advanced Materials Research Lab. Research certification and protocol approval required.', hash: 'uhC0rJ7xN3ke', x: 640, y: 470 },
    { id: 'cnc', name: 'Urban Rhythms', group: 'ovn', stage: 'Active', regime: 'Private', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'may', desc: 'Oil on canvas by Maya Rodriguez, 36 × 48 in. 70% artist commission, $40/month rental, smoke-free display.', hash: 'uhC0aB4cD9fg', x: 200, y: 560 },
    { id: 'fw', name: 'Urban Canopy', group: 'sen', stage: 'Development', regime: 'Commons', nature: 'Hybrid', rivalry: 'Rivalrous', initiator: 'vas', desc: '12-metre interactive light sculpture, co-produced by four studios. Lead artist Elena Vasquez, fabrication by Marcus Chen.', hash: 'uhC0zZ1yX2wv', x: 720, y: 160 },
    { id: 'mesh', name: 'Fragments of Memory · tour', group: 'ovn', stage: 'Specification', regime: 'Collective', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'dk', desc: 'David Kim\'s photography exhibition touring 5 venues over 6 months, coordinated by Sophie Laurent.', hash: 'uhC0nN7pQ8rs', x: 130, y: 250 },
  ],
  // Economic-event relationships between NDOs (derived from Use / Cite events) plus hard links.
  links: [['sol', 'sns', 'use'], ['las', 'sns', 'cite'], ['fw', 'sol', 'hard'], ['mesh', 'cnc', 'cite'], ['cnc', 'fw', 'cite'], ['sns', 'las', 'hard']],
  traces: [
    { id: 't1', ndo: 'sol', agent: 'mar', kind: 'commit', text: 'asked to borrow it for 2 weeks', note: 'Prototype run at the FabLab. 48 h transport notice works for me.', ago: 30, status: 'validated', hops: ['Marco', 'Sensorica node'] },
    { id: 't2', ndo: 'sol', agent: 'sar', kind: 'work', text: 'approved Marco to hold it', ago: 120, status: 'validated', hops: ['Sarah'] },
    { id: 't3', ndo: 'sol', agent: 'sar', kind: 'custody', text: 'reserved Proxxon MF70 #1 for Marco', ago: 90, status: 'validated', hops: ['Sarah'] },
    { id: 't4', ndo: 'sol', agent: 'sar', kind: 'work', text: 'declared this NDO', ago: 20160, status: 'validated', hops: ['Sarah'] },
    { id: 't5', ndo: 'sns', agent: 'mit', kind: 'commit', text: 'commissioned 12 sensor units', ago: 600, status: 'validated', hops: ['Dr. Mitchell'] },
    { id: 't6', ndo: 'sns', agent: 'tib', kind: 'cite', text: 'published design files v3', ago: 2880, status: 'validated', hops: [] },
    { id: 't7', ndo: 'las', agent: 'ele', kind: 'commit', text: 'asked to borrow it for climate research', note: 'Two weeks of cryo sessions. Protocol attached.', ago: 240, status: 'validated', hops: ['Elena', 'MIT node'] },
    { id: 't8', ndo: 'las', agent: 'che', kind: 'work', text: 'calibrated the microscope', ago: 1440, status: 'validated', hops: ['Chen Wei'] },
    { id: 't9', ndo: 'cnc', agent: 'jp', kind: 'commit', text: 'asked to show it in his café for 3 months', ago: 180, status: 'validated', hops: ['Jean-Pierre'] },
    { id: 't10', ndo: 'cnc', agent: 'may', kind: 'work', text: 'registered Urban Rhythms', ago: 4320, status: 'validated', hops: ['Maya'] },
    { id: 't11', ndo: 'fw', agent: 'mc', kind: 'work', text: 'logged 6 h welding · canopy frame', ago: 300, status: 'validated', hops: ['Marcus'] },
    { id: 't12', ndo: 'fw', agent: 'vas', kind: 'cite', text: 'noted the CNC machine is used to cut panels', ago: 10080, status: 'validated', hops: ['Elena V.'] },
    { id: 't13', ndo: 'mesh', agent: 'sop', kind: 'work', text: 'confirmed 3 of 5 venues', ago: 700, status: 'validated', hops: ['Sophie'] },
    { id: 't14', ndo: 'mesh', agent: 'dk', kind: 'work', text: 'declared the tour', ago: 1440, status: 'validated', hops: ['David'] },
  ],
  // Hard links between NDOs (governance zome NdoHardLink: Component / DerivedFrom / Supersedes).
  hardLinks: [{ from: 'fw', to: 'sol', type: 'Component' }, { from: 'sns', to: 'las', type: 'DerivedFrom' }],
  validations: {},
  rules: {
    sol: [['AccessRequirement', 'Credentialed · Transport'], ['TransferCondition', 'Custody · validated'], ['UsageLimit', '336 h / 30 d']],
    las: [['AccessRequirement', 'Gated · AccountableAgent'], ['UsageLimit', '80 h / 14 d'], ['MaintenanceSchedule', '30 d · Repair']],
    cnc: [['AccessRequirement', 'Credentialed · AccountableAgent'], ['UsageLimit', '— / 90 d'], ['TransferCondition', 'Custody · validated']],
    fw: [['MaintenanceSchedule', '14 d · Repair']],
  },
  // [label, OperationalState, custodian]
  instances: {
    sol: [['Proxxon MF70 #1', 'Reserved', 'sar']],
    las: [['CEM-3000', 'Available', 'che']],
    cnc: [['Urban Rhythms · 36×48 in', 'PendingValidation', 'may']],
    sns: [['Sensor batch · 12 units', 'InUse', 'tib']],
    fw: [['Steel canopy frame', 'InStorage', 'mc']],
  },
  commitments: [
    { id: 'c1', ndo: 'sol', action: 'AccessForUse', provider: 'sar', receiver: 'mar', inst: 0, note: 'Prototype production, 2 weeks', status: 'open' },
    { id: 'c2', ndo: 'las', action: 'AccessForUse', provider: 'che', receiver: 'ele', inst: 0, note: 'Climate research, 2 weeks', status: 'open' },
    { id: 'c3', ndo: 'cnc', action: 'TransferCustody', provider: 'may', receiver: 'jp', inst: 0, note: 'Café display, 3 months', status: 'open' },
    { id: 'c4', ndo: 'sns', action: 'TransferCustody', provider: 'tib', receiver: 'mit', inst: 0, note: 'Deliver the 12-unit batch for calibration', status: 'open' },
  ],
  receipts: [
    { id: 'r1', text: 'created Environmental Sensor Design v3', ndo: 'sns', type: 'ResourceCreation', with: 'mit' },
    { id: 'r2', text: 'moved the laser cutter to Montréal', ndo: 'sol', type: 'TransportFulfillmentCompleted', with: 'sar' },
  ],
  offline: false,
};

// Fresh start: no profile, no groups. The example groups become invites, so a new agent walks the whole flow:
// create_person → create_group (blank canvas) or join the example network → create_ndo → manage.
function packGroup(S, gid) {
  const ids = S.ndos.filter(n => n.group === gid).map(n => n.id); const has = id => ids.includes(id);
  const pick = o => Object.fromEntries(Object.entries(o).filter(([k]) => has(k)));
  return { group: S.groups.find(g => g.id === gid), ndos: S.ndos.filter(n => has(n.id)), rules: pick(S.rules), instances: pick(S.instances),
    links: S.links.filter(([a, b]) => has(a) && has(b)), traces: S.traces.filter(t => has(t.ndo)), commitments: S.commitments.filter(k => has(k.ndo)), hardLinks: S.hardLinks.filter(h => has(h.from)) };
}
function freshState() {
  const S = JSON.parse(JSON.stringify(SEED));
  const inv = { 'ndo-invite:sen-4f9q': packGroup(S, 'sen'), 'ndo-invite:ovn-2k7m': packGroup(S, 'ovn') };
  inv['ndo-invite:ovn-2k7m'].links = S.links.filter(([a, b]) => S.ndos.some(n => n.id === a) && S.ndos.some(n => n.id === b) && !inv['ndo-invite:sen-4f9q'].links.some(l => l[0] === a && l[1] === b));
  return { ...S, profile: null, roles: ['SimpleAgent'], groups: [], ndos: [], links: [], traces: [], hardLinks: [], validations: {}, rules: {}, instances: {}, commitments: [], receipts: [], invites: { ...inv, ...S.invites } };
}
const DEMO_INVITES = ['ndo-invite:sen-4f9q', 'ndo-invite:ovn-2k7m'];

const LINK_TYPES = ['Component', 'DerivedFrom', 'Supersedes'];
// Signals are not stored anywhere: they are derived on the client from backed entries
// (open commitments, PendingValidation resources, Available resources, MaintenanceSchedule rules).
function deriveSignals(s) {
  const out = []; const nd = id => s.ndos.find(n => n.id === id);
  s.commitments.filter(k => k.status === 'open' && nd(k.ndo)).forEach(k => {
    const r = (s.instances[k.ndo] || [])[k.inst];
    if (k.provider === ME.id || k.receiver === ME.id) out.push({ id: 'sig-f-' + k.id, kind: 'fulfil', ref: k.id, ndo: k.ndo, lane: 'hands', title: (NDO_DEV ? 'Fulfil ' + k.action : { TransferCustody: 'Hand over', AccessForUse: 'Lend', Move: 'Move', Work: 'Work on', Use: 'Use' }[k.action] || 'Complete') + (r ? ' · ' + r[0] : ''), sub: AGENTS[k.provider] + ' → ' + AGENTS[k.receiver] + (k.note ? ' · ' + k.note : ''), strength: 4, verb: NDO_DEV ? 'Fulfil' : 'Done it',
      why: ['open Commitment { action: ' + k.action + ' }', '← propose_commitment by ' + AGENTS[k.receiver], '← you are ' + (k.provider === ME.id ? 'provider' : 'receiver'), k.action === 'TransferCustody' ? '← transfer_custody needs the current custodian' : '← claim_commitment + issue_participation_receipts'] });
    else { const v = (s.validations[k.id] || []); if (!v.includes(ME.id)) out.push({ id: 'sig-vc-' + k.id, kind: 'validate', ref: k.id, ndo: k.ndo, lane: 'eyes', title: (NDO_DEV ? 'Validate ' + AGENTS[k.receiver] + '\'s ' + k.action : 'Approve ' + AGENTS[k.receiver] + '\'s request'), sub: 'validators so far', progress: [v.length, 2], strength: 3, verb: NDO_DEV ? 'Validate' : 'Approve', why: ['open Commitment { action: ' + k.action + ' }', '← TransferCondition / AccessRequirement on this NDO', '← create_validation_receipt'] }); }
  });
  Object.entries(s.instances).forEach(([ndo, list]) => { if (!nd(ndo)) return; list.forEach((r, i) => {
    const key = ndo + ':' + i; const v = s.validations[key] || [];
    if (r[1] === 'PendingValidation' && r[2] !== ME.id && !v.includes(ME.id)) out.push({ id: 'sig-vr-' + key, kind: 'validate', ref: key, ndo, lane: 'eyes', title: (NDO_DEV ? 'Validate ' : 'Check and approve ') + r[0], sub: NDO_DEV ? 'PendingValidation · validators' : 'waiting for approval · approvals', progress: [v.length, 1], strength: 3, verb: NDO_DEV ? 'Validate' : 'Approve', why: ['EconomicResource { operational_state: PendingValidation }', '← create_economic_resource by ' + AGENTS[r[2]], '← create_validation_receipt'] });
    if (r[1] === 'PendingValidation' && r[2] === ME.id && v.length) out.push({ id: 'sig-av-' + key, kind: 'available', ref: key, ndo, lane: 'hands', title: 'Make ' + r[0] + ' available', sub: v.length + ' validation receipt' + (v.length > 1 ? 's' : ''), strength: 3, verb: 'Make available', why: ['ValidationReceipt { approved: true }', '← you are custodian', '← update_operational_state(Available)'] });
    if (r[1] === 'Available' && r[2] !== ME.id && !s.commitments.some(k => k.ndo === ndo && k.inst === i && k.status === 'open' && k.receiver === ME.id)) out.push({ id: 'sig-rq-' + key, kind: 'request', ref: key, ndo, lane: 'avail', title: r[0] + ' is available', sub: (NDO_DEV ? 'custodian ' : 'held by ') + AGENTS[r[2]] + ((s.rules[ndo] || []).find(x => x[0] === 'UsageLimit') ? ' · ' + (s.rules[ndo] || []).find(x => x[0] === 'UsageLimit')[1] : ''), strength: 4, verb: NDO_DEV ? 'Request' : 'Ask to borrow', why: ['EconomicResource { operational_state: Available }', ...(s.rules[ndo] || []).map(x => '← ' + x[0] + ' { ' + x[1] + ' }'), '← propose_commitment(AccessForUse)'] });
  }); });
  Object.entries(s.rules).forEach(([ndo, rs]) => { const m = rs.find(x => x[0] === 'MaintenanceSchedule'); if (!m || !nd(ndo) || !(s.instances[ndo] || []).length) return; const role = (m[1].split('·')[1] || '').trim();
    out.push({ id: 'sig-m-' + ndo, kind: 'maintain', ref: ndo, ndo, lane: 'hands', title: 'Scheduled maintenance · ' + (s.instances[ndo][0][0]), sub: plain(m[1]) + (role && !ME.roles.includes(role) ? ' · needs role ' + role : ''), strength: 2, verb: 'Log work', why: ['GovernanceRule MaintenanceSchedule { ' + m[1] + ' }', role ? '← required_role: ' + role + (ME.roles.includes(role) ? ' (you hold it)' : ' (you do not hold it)') : '← no required role', '← log_economic_event(Work) + issue_participation_receipts'] }); });
  return out;
}

function fmtAgo(m) {
  if (m < 1) return 'now';
  if (m < 60) return Math.round(m) + ' min';
  if (m < 1440) return Math.round(m / 60) + ' h';
  if (m < 10080) return Math.round(m / 1440) + ' d';
  return Math.round(m / 10080) + ' wk';
}
function freshness(m, decayDays = 14) {
  const d = m / 1440;
  if (d < 0.05) return 'fresh';
  if (d < decayDays * 0.15) return 'warm';
  if (d < decayDays) return 'fading';
  return 'cold';
}
function heat(m, decayDays = 14) { return Math.max(0.08, 1 - m / (decayDays * 1440)); }
const fail = (error) => ({ ok: false, error });

let uid = Date.now() % 1e9; // unique across reloads (ids are persisted)
function useProto() {
  const [s, setS] = React.useState(() => {
    if (/[?&]fresh=1/.test(location.search)) { try { history.replaceState(null, '', location.pathname); } catch (e) {} return freshState(); }
    if (/[?&]example=1/.test(location.search)) { try { history.replaceState(null, '', location.pathname); } catch (e) {} return JSON.parse(JSON.stringify(SEED)); }
    try { const v = JSON.parse(localStorage.getItem(PROTO_KEY)); if (v && v.ndos && v.commitments && v.hardLinks) { for (const k of ['traces', 'receipts', 'commitments']) { const seen = new Set(); v[k] = (v[k] || []).map(x => { if (seen.has(x.id)) x = { ...x, id: x.id + '-' + (uid++) }; seen.add(x.id); return x; }); } return v; } } catch (e) {}
    return JSON.parse(JSON.stringify(SEED));
  });
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => { localStorage.setItem(PROTO_KEY, JSON.stringify(s)); }, [s]);
  const sRef = React.useRef(s); sRef.current = s;
  ME.name = s.profile ? s.profile.name : 'New agent'; ME.roles = s.roles || ME.roles; ME.avatar = s.profile && s.profile.avatar && s.profile.avatar.startsWith('https://') ? s.profile.avatar : null;

  const patchTrace = (id, p) => setS(x => ({ ...x, traces: x.traces.map(t => t.id === id ? { ...t, ...p } : t) }));
  const toast = (t) => { const id = 'k' + (uid++); setToasts(a => [...a, { id, ...t }]); return id; };
  const patchToast = (id, p) => setToasts(a => a.map(t => t.id === id ? { ...t, ...p } : t));
  const dropToast = (id) => setToasts(a => a.filter(t => t.id !== id));
  // Runs the P2P write lifecycle on a toast: signed → gossiping → validated (or queued offline).
  const lifecycle = (title, onValidated) => {
    const offline = sRef.current.offline;
    const tid = toast({ title, stage: offline ? 'queued' : 'signed', peers: 0 });
    if (offline) { setTimeout(() => dropToast(tid), 5200); return; }
    let peers = 0;
    setTimeout(() => patchToast(tid, { stage: 'gossip' }), 700);
    const iv = setInterval(() => { peers = Math.min(23, peers + 4 + Math.floor(Math.random() * 4)); patchToast(tid, { peers }); if (peers >= 23) clearInterval(iv); }, 300);
    setTimeout(() => { patchToast(tid, { stage: 'validated', peers: 23 }); onValidated && onValidated(); }, 2600);
    setTimeout(() => dropToast(tid), 5200);
  };
  // Leaves a trace on an NDO and runs it through the write lifecycle.
  const leave = (ndo, kind, text, note, extra = {}, receipt) => {
    const id = 't' + (uid++);
    const offline = sRef.current.offline;
    setS(x => ({ ...x, traces: [{ id, ndo, agent: ME.id, kind, text, note, ago: 0, status: offline ? 'queued' : 'signed', hops: [], mine: true }, ...x.traces], ...(typeof extra === 'function' ? extra(x) : extra) }));
    if (!offline) setTimeout(() => patchTrace(id, { status: 'gossip' }), 700);
    lifecycle(text, () => {
      patchTrace(id, { status: 'validated', hops: ['Marco', 'FabLab node'] });
      const rs = receipt || (kind === 'work' ? [{ text, ndo, type: 'MaintenanceFulfillmentCompleted' }] : []);
      if (rs.length) setS(x => ({ ...x, receipts: [...rs.map(r => ({ id: 'r' + (uid++), ...r })), ...x.receipts] }));
    });
    return id;
  };
  const instOf = (ndo, i) => ((sRef.current.instances[ndo] || [])[i]);
  const setInst = (x, ndo, i, patch) => ({ ...x.instances, [ndo]: x.instances[ndo].map((r, j) => j === i ? [patch[0] ?? r[0], patch[1] ?? r[1], patch[2] ?? r[2]] : r) });

  const actions = {
    // Signals route to the zome call they were derived from.
    pickUp(sig) {
      if (sig.kind === 'fulfil') return actions.fulfil(sig.ref);
      if (sig.kind === 'validate') return actions.validate(sig.ref, sig.ndo);
      if (sig.kind === 'available') { const [ndo, i] = sig.ref.split(':'); return actions.setOpState(ndo, +i, 'Available'); }
      if (sig.kind === 'request') { const [ndo, i] = sig.ref.split(':'); const r = instOf(ndo, +i); return actions.propose({ ndo, inst: +i, action: 'AccessForUse', provider: r[2], note: 'requested from signal' }); }
      if (sig.kind === 'maintain') return actions.logEvent(sig.ndo, 0, 'Work', 'scheduled maintenance');
    },
    // zome_gouvernance::create_validation_receipt (resource approval or commitment approval)
    validate(ref, ndo) {
      const v = sRef.current.validations[ref] || []; if (v.includes(ME.id)) return fail('You already validated this item.');
      const isRes = ref.includes(':'); const r = isRes ? instOf(ref.split(':')[0], +ref.split(':')[1]) : null;
      if (r && r[2] === ME.id) return fail('An agent cannot validate their own resource.');
      leave(ndo, 'work', 'validated ' + (r ? r[0] : 'commitment'), null, x => ({ validations: { ...x.validations, [ref]: [...(x.validations[ref] || []), ME.id] } }), [{ text: 'validated ' + (r ? r[0] : 'a commitment'), ndo, type: 'ResourceValidation' }]); return { ok: true };
    },
    // zome_gouvernance::log_economic_event (+ issue_participation_receipts for Work)
    logEvent(ndo, i, action, note) {
      const r = instOf(ndo, i); if (!r) return fail('log_economic_event needs a resource (resource_inventoried_as).');
      if (!ENUM.action.includes(action)) return fail('Invalid VfAction.');
      leave(ndo, action === 'Work' || action === 'Modify' ? 'work' : action === 'Cite' ? 'cite' : 'use', action + ' · ' + r[0] + (note ? ' · ' + note : ''), note || null, {}, action === 'Work' || action === 'Modify' ? [{ text: action + ' on ' + r[0], ndo, type: 'MaintenanceFulfillmentCompleted', with: r[2] }] : []); return { ok: true };
    },
    // zome_group::log_work (group WorkLog: description + hours; planning only, no PPR)
    logWork(ndo, description, hours) {
      if (!description || !description.trim()) return fail('WorkLog description cannot be empty');
      if (!(+hours > 0)) return fail('WorkLog hours must be greater than 0');
      leave(ndo, 'note', 'logged ' + (+hours) + ' h work', description.trim()); return { ok: true };
    },
    // zome_gouvernance::create_ndo_hard_link — needs a fulfilment event, so the UI logs a Cite event first
    hardLink(from, to, type) {
      if (from === to) return fail('An NDO cannot link to itself.');
      if (!LINK_TYPES.includes(type)) return fail('Invalid NdoLinkType.');
      if (sRef.current.hardLinks.some(h => h.from === from && h.to === to && h.type === type)) return fail('This hard link already exists.');
      leave(from, 'cite', 'linked: this ' + (PLAIN[type] || type) + ' ' + (sRef.current.ndos.find(n => n.id === to) || {}).name, null, x => ({ hardLinks: [...x.hardLinks, { from, to, type }], links: [...x.links, [from, to, 'hard']] })); return { ok: true };
    },
    // zome_resource::update_lifecycle_stage — initiator only; Deprecated needs a successor
    advance(ndo, to, successor) {
      const n = sRef.current.ndos.find(x => x.id === ndo);
      if (n.initiator && n.initiator !== ME.id) return fail('NotAuthor: only the initiator (' + (AGENTS[n.initiator] || n.initiator) + ') may change the lifecycle stage.');
      if (!allowedStages(n).includes(to)) return fail('Invalid lifecycle transition ' + n.stage + ' → ' + to + '.');
      if (to === 'Deprecated' && !successor) return fail('Transitioning to Deprecated requires successor_ndo_hash (REQ-NDO-LC-06).');
      const patch = { stage: to, hibernation_origin: to === 'Hibernating' ? n.stage : null };
      if (to === 'Deprecated') patch.successor = successor;
      leave(ndo, 'lifecycle', 'moved to ' + to, null, x => ({ ndos: x.ndos.map(m => m.id === ndo ? { ...m, ...patch } : m) }));
      return { ok: true };
    },
    // zome_resource::create_ndo → zome_group::create_ndo_anchor
    createNdo(f) {
      const cur = sRef.current; const id = 'n' + (uid++);
      const n = { id, name: f.name, group: f.group || cur.groups[0].id, stage: 'Ideation', regime: f.regime, nature: f.nature, rivalry: ['Digital', 'Information', 'Service'].includes(f.nature) ? 'NonRivalrous' : 'Rivalrous', initiator: ME.id, desc: f.desc || '', hash: 'uhC0' + Math.random().toString(36).slice(2, 10) };
      leave(id, 'work', 'declared this NDO', null, { ndos: [...cur.ndos, n] }, [{ text: 'declared ' + f.name, ndo: id, type: 'ResourceCreation' }]);
      return id;
    },
    // first time: zome_person::create_person + lobby::upsert_lobby_agent_profile; later update_person. Roles via assign_person_role
    updateProfile(p) {
      if (!p.name || !p.name.trim()) return fail('Person name cannot be empty.');
      if (p.handle && p.handle.length > 64) return fail('handle must be ≤ 64 characters');
      if (p.avatar && !p.avatar.startsWith('https://')) return fail('avatar_url must start with https://');
      setS(x => ({ ...x, profile: { name: p.name.trim(), handle: p.handle || '', bio: p.bio || '', avatar: p.avatar || '', private: { email: p.email || '', location: p.location || '', time_zone: p.time_zone || '' } }, roles: p.roles || x.roles || ME.roles }));
      lifecycle('updated your profile'); return { ok: true };
    },
    // zome_group::create_group (+ lobby::announce_group)
    createGroup(g) {
      if (!g.name || !g.name.trim()) return fail('Group name cannot be empty.');
      if (g.name.length > 100) return fail('Group name too long (max 100 characters).');
      const id = 'g' + (uid++); const grp = { id, name: g.name.trim(), desc: g.desc || '', invite: 'ndo-invite:' + id + '-' + Math.random().toString(36).slice(2, 6) };
      setS(x => ({ ...x, groups: [...x.groups, grp] })); lifecycle('created group ' + grp.name); return { ok: true, id, invite: grp.invite };
    },
    // zome_group::join_group via invite link (group DNA hash + network seed)
    joinGroup(code) {
      const c = (code || '').trim(); const cur = sRef.current; const inv = cur.invites && cur.invites[c];
      if (cur.groups.some(g => g.invite === c)) return fail('You are already a member of this group.');
      if (!inv) return fail('Invalid invite code.');
      setS(x => { const { [c]: _, ...rest } = x.invites; return { ...x, invites: rest, groups: [...x.groups, inv.group], ndos: [...x.ndos, ...inv.ndos], rules: { ...x.rules, ...inv.rules }, instances: { ...x.instances, ...inv.instances }, links: [...x.links, ...inv.links].filter(([a, b]) => [...x.ndos, ...inv.ndos].some(n => n.id === a) && [...x.ndos, ...inv.ndos].some(n => n.id === b)), traces: [...x.traces, ...(inv.traces || [])], commitments: [...x.commitments, ...(inv.commitments || [])], hardLinks: [...x.hardLinks, ...(inv.hardLinks || [])] }; });
      lifecycle('joined ' + inv.group.name); return { ok: true, id: inv.group.id };
    },
    // zome_resource::create_governance_rule (typed RuleData)
    addRule(ndo, type, summary) {
      if (!ENUM.rule.includes(type)) return fail('Invalid RuleData variant.');
      leave(ndo, 'rule', 'added rule ' + type, null, x => ({ rules: { ...x.rules, [ndo]: [...(x.rules[ndo] || []).filter(r => r[0] !== type), [type, summary || '—']] } })); return { ok: true };
    },
    // zome_resource::create_economic_resource — starts PendingValidation, caller is custodian
    addInstance(ndo, label) {
      const n = sRef.current.ndos.find(x => x.id === ndo);
      if (['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage)) return fail('Instances cannot be added at stage ' + n.stage + '.');
      if (!label || !label.trim()) return fail('Label cannot be empty.');
      leave(ndo, 'work', 'created resource ' + label, null, x => ({ instances: { ...x.instances, [ndo]: [...(x.instances[ndo] || []), [label.trim(), 'PendingValidation', ME.id]] } }), [{ text: 'created ' + label, ndo, type: 'ResourceCreation' }]); return { ok: true };
    },
    // zome_resource::update_operational_state — custodian only
    setOpState(ndo, i, state) {
      const r = instOf(ndo, i); if (!r) return fail('Resource not found.');
      if (r[2] !== ME.id) return fail('NotCustodian: only the current custodian (' + (AGENTS[r[2]] || r[2]) + ') can update operational state.');
      leave(ndo, 'custody', r[0] + ' → ' + state, null, x => ({ instances: setInst(x, ndo, i, [null, state, null]) })); return { ok: true };
    },
    // transfer_custody → log_economic_event(TransferCustody) → issue_participation_receipts
    transferCustody(ndo, i, to) {
      const r = instOf(ndo, i); if (!r) return fail('Resource not found.');
      if (r[2] !== ME.id) return fail('NotCustodian: only the current custodian (' + (AGENTS[r[2]] || r[2]) + ') can transfer custody.');
      if (to === ME.id) return fail('New custodian must differ from current custodian.');
      leave(ndo, 'custody', 'transferred custody of ' + r[0] + ' → ' + AGENTS[to], null, x => ({ instances: setInst(x, ndo, i, [null, null, to]) }), [{ text: 'handed ' + r[0] + ' to ' + AGENTS[to], ndo, type: 'CustodyTransfer', with: to }]); return { ok: true };
    },
    // zome_gouvernance::propose_commitment — receiver is the caller
    propose(f) {
      if (!ENUM.action.includes(f.action)) return fail('Invalid VfAction.');
      if (f.provider === ME.id) return fail('Provider and receiver are both you. Pick another provider.');
      const c = { id: 'c' + (uid++), ndo: f.ndo, action: f.action, provider: f.provider, receiver: ME.id, inst: f.inst || 0, note: f.note || '', status: 'open', mine: true };
      leave(f.ndo, 'commit', 'proposed ' + f.action + (f.note ? ' · ' + f.note : ''), null, x => ({ commitments: [c, ...x.commitments] })); return { ok: true };
    },
    // [transfer_custody →] log_economic_event → claim_commitment → issue_participation_receipts
    fulfil(cid) {
      const c = sRef.current.commitments.find(x => x.id === cid); if (!c || c.status !== 'open') return fail('Commitment already claimed.');
      const r = instOf(c.ndo, c.inst);
      if (c.action === 'TransferCustody') { if (!r) return fail('Commitment has no resource.'); if (r[2] !== ME.id) return fail('transfer_custody: NotCustodian. Only ' + (AGENTS[r[2]] || r[2]) + ' can fulfil this TransferCustody commitment.'); }
      if (c.provider !== ME.id && c.receiver !== ME.id) return fail('You are neither provider nor receiver of this commitment.');
      const [pc, rc] = PPR_TYPES[c.action] || ['RuleCompliance', null];
      const other = c.provider === ME.id ? c.receiver : c.provider;
      const mineType = c.provider === ME.id ? pc : rc;
      leave(c.ndo, c.action === 'TransferCustody' ? 'custody' : 'use', 'fulfilled ' + c.action + ' · ' + AGENTS[c.provider] + ' → ' + AGENTS[c.receiver], null,
        x => ({ commitments: x.commitments.map(k => k.id === cid ? { ...k, status: 'claimed' } : k), instances: c.action === 'TransferCustody' ? setInst(x, c.ndo, c.inst, [null, 'InTransit', c.receiver]) : x.instances }),
        mineType ? [{ text: c.action + ' with ' + AGENTS[other], ndo: c.ndo, type: mineType, with: other }] : []);
      return { ok: true };
    },
    toggleOffline() {
      const was = sRef.current.offline;
      setS(x => ({ ...x, offline: !was }));
      if (was) {
        const q = sRef.current.traces.filter(t => t.status === 'queued');
        q.forEach((t, i) => { setTimeout(() => patchTrace(t.id, { status: 'gossip' }), 400 + i * 200); setTimeout(() => patchTrace(t.id, { status: 'validated', hops: ['Marco'] }), 1800 + i * 200); });
        if (q.length) toast({ title: q.length + ' queued trace' + (q.length > 1 ? 's' : '') + ' propagating', stage: 'gossip', peers: 3 });
      }
    },
    reset() { localStorage.removeItem(PROTO_KEY); setS(JSON.parse(JSON.stringify(SEED))); },
    // Start over as a brand-new agent: no Person entry, no groups.
    startFresh() { setS(freshState()); },
    // Joins the example network's group invites at once (onboarding shortcut).
    joinDemo() { DEMO_INVITES.forEach(code => { if (sRef.current.invites[code]) actions.joinGroup(code); }); return { ok: true }; },
  };

  const S = { ...s, signals: deriveSignals(s) };
  const q = {
    ndo: id => s.ndos.find(n => n.id === id),
    tracesOf: id => s.traces.filter(t => t.ndo === id),
    signalsOf: id => S.signals.filter(g => g.ndo === id),
    hardLinksOf: id => s.hardLinks.filter(h => h.from === id || h.to === id),
    commitmentsOf: id => s.commitments.filter(c => c.ndo === id),
    openCommitments: () => s.commitments.filter(c => c.status === 'open'),
    heatOf: (id, decay = 14) => s.traces.filter(t => t.ndo === id).reduce((a, t) => a + heat(t.ago, decay), 0),
    agent: id => AGENTS[id] || id,
    reputation: () => { const r = s.receipts; const k = p => r.filter(x => p.some(y => (x.type || '').startsWith(y))).length; return { total_claims: r.length, custody_claims: k(['Custody']), service_claims: k(['Maintenance', 'Transport', 'Storage']), governance_claims: k(['Rule', 'Validation']), creation_claims: k(['ResourceCreation']) }; },
  };
  return { s: S, actions, q, toasts, dropToast };
}

Object.assign(window, { NDO_DEV, PLAIN, plain, freshState, DEMO_INVITES, useProto, ME, AGENTS, STAGES, NEXT_STAGE, ENUM, allowedStages, LINK_TYPES, fmtAgo, freshness, heat, PROTO_KEY });
