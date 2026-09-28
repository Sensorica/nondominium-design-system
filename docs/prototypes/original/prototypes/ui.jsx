// Shared, theme-neutral UI pieces. Each direction sets --pb (panel bg), --pi (ink), --pm (muted), --pl (line), --pa (accent), --pr (radius).
const pv = { bg: 'var(--pb)', ink: 'var(--pi)', mute: 'var(--pm)', line: 'var(--pl)', acc: 'var(--pa)', r: 'var(--pr)' };

function PModal({ title, sub, onClose, children, width = 440 }) {
  React.useEffect(() => { const k = e => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(3px)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ width, maxWidth: '92vw', background: pv.bg, color: pv.ink, border: '1px solid ' + pv.line, borderRadius: pv.r, boxShadow: '0 30px 60px -20px rgba(0,0,0,.5)' }}>
        <div style={{ padding: '18px 22px 12px', borderBottom: '1px solid ' + pv.line, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>{sub && <div style={{ fontSize: 13, color: pv.mute, marginTop: 3 }}>{sub}</div>}</div>
          <button onClick={onClose} style={{ ...pBtnGhost, padding: '4px 9px' }}>✕</button>
        </div>
        <div style={{ padding: '16px 22px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      </div>
    </div>
  );
}
const pBtn = { font: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 'var(--prb, 999px)', border: '1px solid var(--pa)', background: 'var(--pa)', color: 'var(--pac, #fff)', cursor: 'pointer', whiteSpace: 'nowrap' };
const pBtnGhost = { ...pBtn, background: 'transparent', color: 'var(--pi)', border: '1px solid var(--pl)' };
const pInput = { font: 'inherit', fontSize: 14, padding: '9px 11px', borderRadius: 8, border: '1px solid var(--pl)', background: 'transparent', color: 'var(--pi)', width: '100%', boxSizing: 'border-box', outline: 'none' };
const pLabel = { fontSize: 12, fontWeight: 600, color: 'var(--pm)', marginBottom: 5, display: 'block' };

function PField({ label, children, hint }) { return <label style={{ display: 'block' }}><span style={pLabel}>{label}</span>{children}{hint && <span style={{ display: 'block', fontSize: 12, color: 'var(--pm)', marginTop: 4 }}>{hint}</span>}</label>; }
function PChoice({ options, value, onChange }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{options.map(o => <button key={o} title={o} onClick={() => onChange(o)} style={{ ...pBtnGhost, fontWeight: 500, fontSize: 12, padding: '6px 10px', ...(o === value ? { background: 'var(--pa)', color: 'var(--pac,#fff)', borderColor: 'var(--pa)' } : {}) }}>{plain(o)}</button>)}</div>;
}

function CreateNdoModal({ onClose, onCreate, groups }) {
  const [f, setF] = React.useState({ name: '', desc: '', nature: 'Physical', regime: 'Nondominium', group: groups[0].id });
  const set = k => v => setF(x => ({ ...x, [k]: v }));
  const dup = false;
  return (
    <PModal title="Add a shared resource" sub="It starts as an idea. You can move it through its stages as it becomes real." onClose={onClose}>
      <PField label="Name *"><input autoFocus style={pInput} value={f.name} onChange={e => set('name')(e.target.value)} placeholder="e.g. Shared Bike Fleet" /></PField>
      <PField label="What is it?"><textarea style={{ ...pInput, minHeight: 64, resize: 'vertical' }} value={f.desc} onChange={e => set('desc')(e.target.value)} /></PField>
      <PField label="Nature"><PChoice options={['Physical', 'Digital', 'Service', 'Hybrid', 'Information']} value={f.nature} onChange={set('nature')} /></PField>
      <PField label="Property regime" hint={f.regime === 'Nondominium' ? 'Uncapturable: no agent can take unilateral control.' : null}><PChoice options={ENUM.regime} value={f.regime} onChange={set('regime')} /></PField>
      <PField label="Group"><PChoice options={groups.map(g => g.name)} value={groups.find(g => g.id === f.group).name} onChange={n => set('group')(groups.find(g => g.name === n).id)} /></PField>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button style={pBtnGhost} onClick={onClose}>Cancel</button><button style={{ ...pBtn, opacity: f.name.trim() ? 1 : .4 }} disabled={!f.name.trim()} onClick={() => { onCreate(f); onClose(); }}>Declare NDO</button></div>
    </PModal>
  );
}

// zome_gouvernance::create_ndo_hard_link (Component / DerivedFrom / Supersedes)
function AttachModal({ ndo, P, onClose }) {
  const others = P.s.ndos.filter(n => n.id !== ndo.id);
  const [to, setTo] = React.useState(others[0] ? others[0].id : ''); const [type, setType] = React.useState('Component'); const [e, setE] = React.useState(null);
  return (
    <PModal title="Link to another resource" sub={'Typed hard link from ' + ndo.name + '. It is backed by an economic event, so it survives across groups.'} onClose={onClose}>
      <PCall c="log_economic_event(Cite) → zome_gouvernance::create_ndo_hard_link" />
      <PField label="NdoLinkType" hint={{ Component: 'This NDO is a component of the target.', DerivedFrom: 'This NDO was derived from the target (fork, adaptation).', Supersedes: 'This NDO replaces the target.' }[type]}><PChoice options={LINK_TYPES} value={type} onChange={setType} /></PField>
      <PField label="Target NDO"><select style={pSelect} value={to} onChange={x => setTo(x.target.value)}>{others.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</select></PField>
      {!others.length && <div style={{ fontSize: 13, color: 'var(--pm)' }}>No other NDO to link to yet.</div>}
      <PErr e={e} /><PActs onClose={onClose} label="Create hard link" disabled={!to} onOk={() => run(P.actions.hardLink(ndo.id, to, type), setE, onClose)} />
    </PModal>
  );
}

// zome_group::log_work — a WorkLog in the NDO's group (description + hours)
function NoteModal({ ndo, P, onClose }) {
  const [d, setD] = React.useState(''); const [h, setH] = React.useState('1'); const [e, setE] = React.useState(null);
  return (
    <PModal title="Log work" sub={'Recorded as a WorkLog in ' + (P.s.groups.find(g => g.id === ndo.group) || {}).name + ' and shown on ' + ndo.name + '\'s trail.'} onClose={onClose}>
      <PCall c="zome_group::log_work" />
      <PField label="description *"><textarea autoFocus style={{ ...pInput, minHeight: 80 }} value={d} onChange={x => setD(x.target.value)} placeholder="What did you do? What should the next agent know?" /></PField>
      <PField label="hours *"><input type="number" min="0" step="0.5" style={{ ...pInput, width: 120 }} value={h} onChange={x => setH(x.target.value)} /></PField>
      <PErr e={e} /><PActs onClose={onClose} label="Sign & log" disabled={!d.trim()} onOk={() => run(P.actions.logWork(ndo.id, d, h), setE, onClose)} />
    </PModal>
  );
}

// Default avatar: LobbyAgentProfile.avatar_url is optional; without one the UI shows initials on a colour derived from the agent key.
const AV_HUES = ['#2E7D74', '#3F6FDB', '#7C55E6', '#C2410C', '#B45309', '#0E7490', '#BE185D', '#4D7C0F'];
function avatarColor(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return AV_HUES[h % AV_HUES.length]; }
function initials(name) { return String(name || '?').replace(/^Dr\.\s*/, '').split(/[\s-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(); }
function Avatar({ id, size = 24, url, ring, title }) {
  const name = id === ME.id ? ME.name : (AGENTS[id] || id);
  const src = url || (id === ME.id ? ME.avatar : null);
  const st = { width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.4), fontWeight: 700, letterSpacing: '.02em', color: '#fff', background: avatarColor(id), boxShadow: ring ? '0 0 0 2px var(--pb, #fff), 0 0 0 3px ' + avatarColor(id) : 'none', overflow: 'hidden', verticalAlign: 'middle', fontFamily: 'inherit', lineHeight: 1 };
  return <span title={title || name} style={st}>{src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none'; }} /> : initials(name)}</span>;
}
function AgentChip({ id, size = 18 }) { return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Avatar id={id} size={size} /><span>{id === ME.id ? ME.name : (AGENTS[id] || id)}</span></span>; }

const F_ERR = [[/NotCustodian|only the current custodian/i, 'Only the person currently holding this item can do that.'], [/NotAuthor|only the initiator/i, 'Only the person who created this resource can change its stage.'], [/requires successor/i, 'Pick the resource that replaces this one first.'], [/cannot validate their own/i, 'You can\'t approve your own item. Ask someone else.'], [/already validated/i, 'You have already approved this.'], [/already claimed/i, 'This has already been done.'], [/already a member/i, 'You are already in this group.'], [/Invalid invite/i, 'That invite link doesn\'t work. Check you copied all of it.'], [/cannot be empty/i, 'Please fill in the name.'], [/hours must be/i, 'Enter how many hours you worked.'], [/neither provider nor receiver/i, 'Only the two people in this agreement can complete it.'], [/must start with https/i, 'The picture link must start with https://'], [/Instances cannot be added at stage (\w+)/, 'Items can\'t be added while the resource is in this stage.'], [/Provider and receiver are both you/, 'Choose who you are asking. It can\'t be yourself.']];
function friendly(e) { if (!e) return e; const f = F_ERR.find(([r]) => r.test(e)); return f ? f[1] : e; }
function PErr({ e }) { e = friendly(e); return e ? <div style={{ fontSize: 12, lineHeight: 1.5, color: '#D8452F', background: 'rgba(216,69,47,.08)', border: '1px solid rgba(216,69,47,.3)', borderRadius: 8, padding: '8px 10px', fontFamily: 'var(--pmono, monospace)' }}>{e}</div> : null; }
function PCall({ c }) { if (!NDO_DEV) return null; return <div style={{ fontFamily: 'var(--pmono, monospace)', fontSize: 11, color: 'var(--pm)', marginTop: -6 }}>{c}</div>; }
function PActs({ onClose, onOk, label, disabled }) { return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button style={pBtnGhost} onClick={onClose}>Cancel</button><button style={{ ...pBtn, opacity: disabled ? .4 : 1 }} disabled={disabled} onClick={onOk}>{label}</button></div>; }
const pSelect = { ...pInput, appearance: 'auto' };
const run = (r, setE, onClose, after) => { if (r && r.ok === false) setE(r.error); else { after && after(r); onClose(); } };

function AdvanceModal({ ndo, P, onClose }) {
  const opts = allowedStages(ndo);
  const [to, setTo] = React.useState(opts[0]); const [succ, setSucc] = React.useState(''); const [e, setE] = React.useState(null);
  const others = P.s.ndos.filter(n => n.id !== ndo.id);
  return (
    <PModal title="Change stage" sub={ndo.name + ' is ' + ndo.stage + '. Initiator: ' + P.q.agent(ndo.initiator) + '.'} onClose={onClose} width={420}>
      <PCall c="zome_resource::update_lifecycle_stage" />
      {opts.length ? <PChoice options={opts} value={to} onChange={v => { setTo(v); setE(null); }} /> : <div style={{ fontSize: 13, color: 'var(--pm)' }}>EndOfLife is terminal. No further transitions.</div>}
      {to === 'Hibernating' && <div style={{ fontSize: 12, color: 'var(--pm)' }}>Suspends the NDO. Resuming returns it to {ndo.stage}.</div>}
      {to === 'Deprecated' && <PField label="Successor NDO (required)"><select style={pSelect} value={succ} onChange={x => setSucc(x.target.value)}><option value="">— pick a successor</option>{others.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</select></PField>}
      <PErr e={e} />
      {opts.length > 0 && <PActs onClose={onClose} label={'Move to ' + to} onOk={() => run(P.actions.advance(ndo.id, to, succ), setE, onClose)} />}
    </PModal>
  );
}

function ProfileModal({ P, onClose }) {
  const pr = P.s.profile;
  const [f, setF] = React.useState({ name: pr.name, handle: pr.handle || '', bio: pr.bio, avatar: pr.avatar || '', roles: ME.roles, email: (pr.private || {}).email || '', location: (pr.private || {}).location || '', time_zone: (pr.private || {}).time_zone || '' }); const [e, setE] = React.useState(null);
  const tog = r => setF(x => ({ ...x, roles: x.roles.includes(r) ? x.roles.filter(y => y !== r) : [...x.roles, r] }));
  const rep = P.q.reputation();
  const sec = { fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--pm)', marginBottom: -4 };
  return (
    <PModal title="Your profile" sub="Your name and picture are visible to your groups. Contact details stay private unless you choose to share them." onClose={onClose} width={560}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Avatar id={ME.id} size={64} url={f.avatar && f.avatar.startsWith('https://') ? f.avatar : null} ring />
        <div style={{ minWidth: 0 }}><div style={{ fontSize: 18, fontWeight: 700 }}>{f.name || '—'}</div><div style={{ fontSize: 12, color: 'var(--pm)' }}>@{f.handle || f.name.toLowerCase().replace(/\s+/g, '')} · {ME.roles.join(', ')}</div>
          <div style={{ fontFamily: 'var(--pmono, monospace)', fontSize: 11, color: 'var(--pm)', marginTop: 2 }}>agent uhCAkT1b3r1usK9x… · joined 3 groups</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <PField label="Name *"><input style={pInput} value={f.name} onChange={x => setF({ ...f, name: x.target.value })} /></PField>
        <PField label="Lobby handle"><input style={pInput} value={f.handle} onChange={x => setF({ ...f, handle: x.target.value })} placeholder="max 64 chars" /></PField>
      </div>
      <PField label="Bio"><input style={pInput} value={f.bio} onChange={x => setF({ ...f, bio: x.target.value })} /></PField>
      <PField label="Avatar URL" hint="Optional, must start with https://. Without it, initials are shown."><input style={pInput} value={f.avatar} onChange={x => setF({ ...f, avatar: x.target.value })} placeholder="https://…" /></PField>
      <div style={sec}>Private data · store_private_person_data</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <PField label="Email"><input style={pInput} value={f.email} onChange={x => setF({ ...f, email: x.target.value })} /></PField>
        <PField label="Location"><input style={pInput} value={f.location} onChange={x => setF({ ...f, location: x.target.value })} /></PField>
        <PField label="Time zone"><input style={pInput} value={f.time_zone} onChange={x => setF({ ...f, time_zone: x.target.value })} /></PField>
      </div>
      <div style={{ fontSize: 12, color: 'var(--pm)' }}>Shared only through a capability grant (grant_private_data_access), e.g. with the next custodian during a transfer.</div>
      <PField label="Roles" hint="assign_person_role · Accountable roles need peer validation (request_role_promotion)"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{ENUM.role.map(r => <button key={r} onClick={() => tog(r)} style={{ ...pBtnGhost, fontWeight: 500, fontSize: 12, padding: '6px 10px', ...(f.roles.includes(r) ? { background: 'var(--pa)', color: 'var(--pac,#fff)', borderColor: 'var(--pa)' } : {}) }}>{r}</button>)}</div></PField>
      <div style={sec}>Reputation · derive_reputation_summary</div>
      <div style={{ fontSize: 13, color: 'var(--pm)' }}>{rep.total_claims} receipts · {rep.custody_claims} custody · {rep.service_claims} service · {rep.creation_claims} creation</div>
      <PErr e={e} /><PActs onClose={onClose} label="Save profile" onOk={() => run(f.avatar && !f.avatar.startsWith('https://') ? { ok: false, error: 'avatar_url must start with https://' } : f.handle.length > 64 ? { ok: false, error: 'handle must be ≤ 64 characters' } : P.actions.updateProfile(f), setE, onClose)} />
    </PModal>
  );
}

function GroupModal({ P, onClose, after }) {
  const [f, setF] = React.useState({ name: '', desc: '' }); const [e, setE] = React.useState(null); const [done, setDone] = React.useState(null);
  if (done) return <PModal title="Group created" sub={done.name + ' is its own DHT. Share the invite link so others can join.'} onClose={onClose}>
    <div style={{ fontFamily: 'var(--pmono, monospace)', fontSize: 13, padding: '10px 12px', border: '1px dashed var(--pl)', borderRadius: 8 }}>{done.invite}</div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button style={pBtnGhost} onClick={() => navigator.clipboard && navigator.clipboard.writeText(done.invite)}>⎘ Copy invite link</button><button style={pBtn} onClick={() => { after && after(done.id); onClose(); }}>Open group</button></div>
  </PModal>;
  return (
    <PModal title="Create a group" sub="A group is a community that shares resources. You can invite people with a link." onClose={onClose}>
      <PCall c="zome_group::create_group → lobby::announce_group" />
      <PField label="Name *"><input autoFocus style={pInput} value={f.name} onChange={x => setF({ ...f, name: x.target.value })} placeholder="e.g. FabLab Montréal" /></PField>
      <PField label="Description"><input style={pInput} value={f.desc} onChange={x => setF({ ...f, desc: x.target.value })} /></PField>
      <PErr e={e} /><PActs onClose={onClose} label="Create group" disabled={!f.name.trim()} onOk={() => { const r = P.actions.createGroup(f); if (r.ok === false) setE(r.error); else setDone({ ...r, name: f.name }); }} />
    </PModal>
  );
}

function JoinModal({ P, onClose, after }) {
  const [c, setC] = React.useState(''); const [e, setE] = React.useState(null);
  const hint = Object.keys(P.s.invites || {})[0];
  return (
    <PModal title="Join a group" sub="Paste the invite link someone sent you." onClose={onClose}>
      <PCall c="zome_group::join_group" />
      <PField label="Invite link" hint={hint ? 'Pending invite in this prototype: ' + hint : null}><input autoFocus style={{ ...pInput, fontFamily: 'var(--pmono, monospace)' }} value={c} onChange={x => { setC(x.target.value); setE(null); }} placeholder="ndo-invite:…" /></PField>
      <PErr e={e} /><PActs onClose={onClose} label="Join group" disabled={!c.trim()} onOk={() => run(P.actions.joinGroup(c), setE, onClose, r => after && after(r.id))} />
    </PModal>
  );
}

function BrowseModal({ P, onClose, onOpen }) {
  const [q, setQ] = React.useState(''); const [f, setF] = React.useState({ stage: '', nature: '', regime: '', group: '' });
  const list = P.s.ndos.filter(n => (!q || (n.name + ' ' + n.desc).toLowerCase().includes(q.toLowerCase())) && (!f.stage || n.stage === f.stage) && (!f.nature || n.nature === f.nature) && (!f.regime || n.regime === f.regime) && (!f.group || n.group === f.group));
  const sel = (k, opts, all) => <select style={{ ...pSelect, width: 'auto', fontSize: 12, padding: '6px 8px' }} value={f[k]} onChange={x => setF({ ...f, [k]: x.target.value })}><option value="">{all}</option>{opts.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select>;
  return (
    <PModal title="Find resources" sub="Everything shared in your groups." onClose={onClose} width={620}>
      <PCall c="get_all_ndos · get_ndos_by_lifecycle_stage / _nature / _property_regime" />
      <input autoFocus style={pInput} value={q} onChange={x => setQ(x.target.value)} placeholder="Search by name or description" />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{sel('group', P.s.groups.map(g => [g.id, g.name]), 'All groups')}{sel('stage', STAGES.map(x => [x, x]), 'Any stage')}{sel('nature', ENUM.nature.map(x => [x, x]), 'Any nature')}{sel('regime', ENUM.regime.map(x => [x, x]), 'Any regime')}</div>
      <div style={{ maxHeight: 340, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {list.map(n => <button key={n.id} onClick={() => { onOpen && onOpen(n.id); onClose(); }} style={{ textAlign: 'left', font: 'inherit', color: 'inherit', background: 'transparent', border: '1px solid var(--pl)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <b style={{ fontSize: 14 }}>{n.name}</b><span style={{ fontSize: 12, color: 'var(--pm)' }}>{P.s.groups.find(g => g.id === n.group)?.name} · {n.stage} · {n.regime} · {n.nature} · {P.q.openCommitments().filter(c => c.ndo === n.id).length} open commitments</span></button>)}
        {!list.length && <div style={{ fontSize: 13, color: 'var(--pm)', padding: 8 }}>No NDOs match. NDOs are scoped to groups: create or join one to see more.</div>}
      </div>
    </PModal>
  );
}

function RuleModal({ ndo, P, onClose }) {
  const [type, setType] = React.useState('AccessRequirement'); const [v, setV] = React.useState({ accessibility: 'Credentialed', role: 'AccountableAgent', hours: '40', days: '7', transfer: 'Custody', validated: 'true', interval: '90' }); const [e, setE] = React.useState(null);
  const summary = { AccessRequirement: v.accessibility + (v.role ? ' · ' + v.role : ''), UsageLimit: v.hours + ' h / ' + v.days + ' d', TransferCondition: v.transfer + (v.validated === 'true' ? ' · validated' : ''), MaintenanceSchedule: v.interval + ' d' + (v.role ? ' · ' + v.role : '') }[type];
  const sel = (k, opts) => <select style={pSelect} value={v[k]} onChange={x => setV({ ...v, [k]: x.target.value })}>{opts.map(o => <option key={o} value={o}>{o || '— none'}</option>)}</select>;
  return (
    <PModal title="Add a rule" sub={'Rules travel with ' + ndo.name + ' across groups.'} onClose={onClose}>
      <PCall c="zome_resource::create_governance_rule (RuleData)" />
      <PField label="RuleData"><PChoice options={ENUM.rule} value={type} onChange={setType} /></PField>
      {type === 'AccessRequirement' && <React.Fragment><PField label="accessibility">{sel('accessibility', ['Free', 'Credentialed', 'Gated'])}</PField><PField label="required_role">{sel('role', ['', ...ENUM.role])}</PField></React.Fragment>}
      {type === 'UsageLimit' && <div style={{ display: 'flex', gap: 10 }}><PField label="max_duration_hours"><input type="number" style={pInput} value={v.hours} onChange={x => setV({ ...v, hours: x.target.value })} /></PField><PField label="period_days"><input type="number" style={pInput} value={v.days} onChange={x => setV({ ...v, days: x.target.value })} /></PField></div>}
      {type === 'TransferCondition' && <React.Fragment><PField label="transfer_type">{sel('transfer', ['Ownership', 'Custody', 'UseRights', 'Benefit'])}</PField><PField label="requires_validation">{sel('validated', ['true', 'false'])}</PField></React.Fragment>}
      {type === 'MaintenanceSchedule' && <React.Fragment><PField label="interval_days"><input type="number" style={pInput} value={v.interval} onChange={x => setV({ ...v, interval: x.target.value })} /></PField><PField label="required_role">{sel('role', ['', ...ENUM.role])}</PField></React.Fragment>}
      <div style={{ fontFamily: 'var(--pmono, monospace)', fontSize: 12, color: 'var(--pm)' }}>{type} · {summary}</div>
      <PErr e={e} /><PActs onClose={onClose} label="Add rule" onOk={() => run(type === 'MaintenanceSchedule' && !(+v.interval > 0) ? { ok: false, error: 'MaintenanceSchedule.interval_days must be > 0' } : P.actions.addRule(ndo.id, type, summary), setE, onClose)} />
    </PModal>
  );
}

function ResourcesModal({ ndo, P, onClose }) {
  const inst = P.s.instances[ndo.id] || []; const [e, setE] = React.useState(null); const [label, setLabel] = React.useState('');
  const [to, setTo] = React.useState({}); const [st, setSt] = React.useState({});
  const agents = Object.keys(AGENTS);
  const res = r => { if (r && r.ok === false) setE(r.error); else setE(null); };
  return (
    <PModal title="Items and who holds them" sub={'The actual items of ' + ndo.name + '. Only the current holder can hand one over or change its status.'} onClose={onClose} width={560}>
      {inst.map(([l, s, c], i) => <div key={i} style={{ border: '1px solid var(--pl)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar id={c} size={22} /><b style={{ fontSize: 14 }}>{l}</b><span style={{ fontSize: 12, color: 'var(--pm)' }}>{plain(s)} · held by {P.q.agent(c)}{c === ME.id ? ' (you)' : ''}</span></div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <select style={{ ...pSelect, width: 'auto', fontSize: 12, padding: '5px 8px' }} value={st[i] || ''} onChange={x => setSt({ ...st, [i]: x.target.value })}><option value="">New status…</option>{ENUM.opstate.filter(x => x !== s).map(x => <option key={x} value={x}>{plain(x)}</option>)}</select>
          <button style={{ ...pBtnGhost, fontSize: 12, padding: '5px 10px' }} disabled={!st[i]} onClick={() => res(P.actions.setOpState(ndo.id, i, st[i]))}>{NDO_DEV ? 'update_operational_state' : 'Change status'}</button>
          <select style={{ ...pSelect, width: 'auto', fontSize: 12, padding: '5px 8px' }} value={to[i] || ''} onChange={x => setTo({ ...to, [i]: x.target.value })}><option value="">Hand over to…</option>{agents.filter(a => a !== c).map(a => <option key={a} value={a}>{AGENTS[a]}</option>)}</select>
          <button style={{ ...pBtn, fontSize: 12, padding: '5px 10px' }} disabled={!to[i]} onClick={() => res(P.actions.transferCustody(ndo.id, i, to[i]))}>{NDO_DEV ? 'transfer_custody' : 'Hand over'}</button>
          <select style={{ ...pSelect, width: 'auto', fontSize: 12, padding: '5px 8px' }} value={(st['ev' + i]) || ''} onChange={x => setSt({ ...st, ['ev' + i]: x.target.value })}><option value="">Something happened…</option>{['Use', 'Work', 'Modify', 'Move', 'Cite'].map(x => <option key={x}>{x}</option>)}</select>
          <button style={{ ...pBtnGhost, fontSize: 12, padding: '5px 10px' }} disabled={!st['ev' + i]} onClick={() => res(P.actions.logEvent(ndo.id, i, st['ev' + i]))}>{NDO_DEV ? 'log_economic_event' : 'Record'}</button>
          {c !== ME.id && s === 'PendingValidation' && <button style={{ ...pBtnGhost, fontSize: 12, padding: '5px 10px' }} onClick={() => res(P.actions.validate(ndo.id + ':' + i, ndo.id))}>{NDO_DEV ? 'create_validation_receipt' : 'Approve'}</button>}
        </div></div>)}
      {!inst.length && <div style={{ fontSize: 13, color: 'var(--pm)' }}>No resources yet.</div>}
      <PField label="New resource" hint="create_economic_resource · starts PendingValidation with you as custodian"><div style={{ display: 'flex', gap: 8 }}><input style={pInput} value={label} onChange={x => setLabel(x.target.value)} placeholder="e.g. Spare spindle" /><button style={pBtn} onClick={() => { const r = P.actions.addInstance(ndo.id, label); res(r); if (r.ok) setLabel(''); }}>Create</button></div></PField>
      <PErr e={e} />
    </PModal>
  );
}

function CommitModal({ ndo, P, onClose }) {
  const inst = P.s.instances[ndo.id] || [];
  const [f, setF] = React.useState({ action: 'AccessForUse', inst: 0, provider: (inst[0] && inst[0][2] !== ME.id ? inst[0][2] : ndo.initiator !== ME.id ? ndo.initiator : 'sar'), note: '' }); const [e, setE] = React.useState(null);
  return (
    <PModal title="Ask to borrow or receive" sub={'Send a request to the person holding the item. They complete it by handing it over.'} onClose={onClose}>
      <PCall c="zome_gouvernance::propose_commitment" />
      <PField label="VfAction"><PChoice options={ENUM.action} value={f.action} onChange={v => setF({ ...f, action: v })} /></PField>
      {inst.length > 0 && <PField label="Resource"><select style={pSelect} value={f.inst} onChange={x => setF({ ...f, inst: +x.target.value })}>{inst.map((r, i) => <option key={i} value={i}>{r[0]} · {r[1]}</option>)}</select></PField>}
      <PField label="Provider"><select style={pSelect} value={f.provider} onChange={x => setF({ ...f, provider: x.target.value })}>{Object.keys(AGENTS).map(a => <option key={a} value={a}>{AGENTS[a]}</option>)}</select></PField>
      <PField label="Note"><input style={pInput} value={f.note} onChange={x => setF({ ...f, note: x.target.value })} placeholder="e.g. 2 weeks, 48 h transport notice" /></PField>
      <PErr e={e} /><PActs onClose={onClose} label="Propose" onOk={() => run(P.actions.propose({ ...f, ndo: ndo.id }), setE, onClose)} />
    </PModal>
  );
}

function CommitmentsModal({ ndo, P, onClose, setM }) {
  const list = ndo ? P.q.commitmentsOf(ndo.id) : P.s.commitments; const [e, setE] = React.useState(null);
  return (
    <PModal title="Requests" sub={ndo ? ndo.name : 'Across your groups'} onClose={onClose} width={560}>
      <PCall c="get_all_commitments · claim_commitment" />
      {list.map(c => <div key={c.id} style={{ border: '1px solid var(--pl)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center', opacity: c.status === 'open' ? 1 : .6 }}>
        <span style={{ display: 'inline-flex' }}><Avatar id={c.provider} size={26} /><span style={{ marginLeft: -8 }}><Avatar id={c.receiver} size={26} ring /></span></span><div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 14 }}>{plain(c.action)}</b> <span style={{ fontSize: 12, color: 'var(--pm)' }}>{P.q.agent(c.provider)} → {P.q.agent(c.receiver)}{!ndo ? ' · ' + P.q.ndo(c.ndo)?.name : ''}</span>{c.note && <div style={{ fontSize: 12, color: 'var(--pm)' }}>{c.note}</div>}</div>
        {c.status === 'open' ? <button style={{ ...pBtn, fontSize: 12, padding: '6px 10px' }} onClick={() => { const r = P.actions.fulfil(c.id); setE(r.ok === false ? r.error : null); }}>{NDO_DEV ? 'Fulfil' : 'Mark as done'}</button> : <span style={{ fontSize: 12, color: 'var(--pm)' }}>claimed</span>}
      </div>)}
      {!list.length && <div style={{ fontSize: 13, color: 'var(--pm)' }}>No commitments yet.</div>}
      <div style={{ fontSize: 12, color: 'var(--pm)' }}>{NDO_DEV ? 'Fulfil runs [transfer_custody →] log_economic_event → claim_commitment → issue_participation_receipts.' : 'Complete a request when it has happened. Both people get a private receipt.'}</div>
      <PErr e={e} />
      {ndo && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button style={pBtnGhost} onClick={() => setM({ type: 'commit', ndo: ndo.id })}>+ Propose commitment</button></div>}
    </PModal>
  );
}

function ReceiptsModal({ P, onClose }) {
  const rep = P.q.reputation();
  return (
    <PModal title="Your receipts" sub="Each time you help, you get a private receipt. Only you can see them, and you choose what to share." onClose={onClose} width={520}>
      <PCall c="get_my_participation_claims · derive_reputation_summary" />
      <div style={{ fontSize: 12, color: 'var(--pm)', marginBottom: -6 }}>Your reputation so far</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(84px, 1fr))', gap: 6 }}>{Object.entries(rep).map(([k, v]) => <div key={k} style={{ border: '1px solid var(--pl)', borderRadius: 8, padding: '8px 10px', minWidth: 0, overflow: 'hidden' }}><div style={{ fontSize: 20, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 11, color: 'var(--pm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={k}>{{ total_claims: 'receipts', custody_claims: 'hand-overs', service_claims: 'services', governance_claims: 'approvals', creation_claims: 'created' }[k]}</div></div>)}</div>
      <div style={{ maxHeight: 300, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>{P.s.receipts.map(r => <div key={r.id} style={{ display: 'flex', gap: 10, fontSize: 13, borderBottom: '1px solid var(--pl)', padding: '6px 0' }}><span style={{ flex: 1 }}>◆ {r.text}</span><span style={{ fontSize: 11, color: 'var(--pm)' }}>{plain(r.type) || 'Receipt'}</span></div>)}
      {!P.s.receipts.length && <div style={{ fontSize: 13, color: 'var(--pm)' }}>None yet. Fulfil a commitment or take up a signal.</div>}</div>
    </PModal>
  );
}

// Group scope that scales: the first few groups as chips, the rest in a select.
function GroupScope({ P, value, onChange, max = 3, allLabel = 'All groups', chip = 'span', onClass = 'on' }) {
  const gs = P.s.groups; const head = gs.slice(0, max); const rest = gs.slice(max);
  const Chip = chip; const inRest = rest.some(g => g.id === value);
  return <React.Fragment>
    {[['all', allLabel], ...head.map(g => [g.id, g.name])].map(([k, l]) => <Chip key={k} className={value === k ? onClass : ''} onClick={() => onChange(k)} title={l}>{l.length > 22 ? l.slice(0, 21) + '…' : l}</Chip>)}
    {rest.length > 0 && <select value={inRest ? value : ''} onChange={e => e.target.value && onChange(e.target.value)} style={{ font: 'inherit', fontSize: 12, background: 'transparent', color: 'inherit', border: 0, padding: '4px 6px', cursor: 'pointer', maxWidth: 170, fontWeight: inRest ? 700 : 400 }}><option value="">{'+' + rest.length + ' more groups'}</option>{rest.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>}
  </React.Fragment>;
}

// First-run flow, identical in every prototype: create_person → pick a start (example network, blank canvas, invite) → first NDO.
function Onboarding({ P, onNdo, onGroup }) {
  const [step, setStep] = React.useState(null); const [e, setE] = React.useState(null);
  const [pf, setPf] = React.useState({ name: '', handle: '', bio: '', avatar: '', roles: ['SimpleAgent'] });
  const [g, setG] = React.useState({ name: '', desc: '' }); const [code, setCode] = React.useState('');
  const [nd, setNd] = React.useState({ name: '', desc: '', nature: 'Physical', regime: 'Nondominium' });
  const cur = !P.s.profile ? 'profile' : !P.s.groups.length ? 'start' : step;
  if (!cur) return null;
  const idx = { profile: 0, start: 1, ndo: 2 }[cur];
  const card = { border: '1px solid var(--pl)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: 'transparent' };
  const newest = P.s.groups[P.s.groups.length - 1];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'var(--pb)', color: 'var(--pi)', overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 6 }}>{['Profile', 'Network', 'First NDO'].map((l, i) => <div key={l} style={{ flex: 1 }}><div style={{ height: 3, borderRadius: 2, background: i <= idx ? 'var(--pa)' : 'var(--pl)' }}></div><div style={{ fontSize: 11, color: i === idx ? 'var(--pi)' : 'var(--pm)', marginTop: 6 }}>{i + 1} · {l}</div></div>)}</div>
        {cur === 'profile' && <React.Fragment>
          <div><div style={{ fontSize: 26, fontWeight: 700 }}>Set up your profile</div><div style={{ fontSize: 14, color: 'var(--pm)', marginTop: 4 }}>Your conductor holds your agent key. The profile is public in the Lobby DHT; private data stays on your source chain.</div></div>
          <PCall c="zome_person::create_person → lobby::upsert_lobby_agent_profile" />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex' }}>{pf.avatar.startsWith('https://') ? <Avatar id={ME.id} size={72} url={pf.avatar} ring /> : <span style={{ width: 72, height: 72, borderRadius: '50%', background: avatarColor(pf.name || 'new'), color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700 }}>{(pf.name || '?').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()}</span>}</span>
            <div style={{ fontSize: 12, color: 'var(--pm)', lineHeight: 1.5 }}>Default avatar: your initials on a colour derived from your agent key.<br />Paste an https:// image URL below to use your own.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <PField label="Name *"><input autoFocus style={pInput} value={pf.name} onChange={x => setPf({ ...pf, name: x.target.value })} placeholder="e.g. Marco" /></PField>
            <PField label="Lobby handle"><input style={pInput} value={pf.handle} onChange={x => setPf({ ...pf, handle: x.target.value })} placeholder="e.g. marco-fablab" /></PField>
          </div>
          <PField label="Bio"><input style={pInput} value={pf.bio} onChange={x => setPf({ ...pf, bio: x.target.value })} placeholder="What you do, where" /></PField>
          <PField label="Avatar URL (optional)"><input style={pInput} value={pf.avatar} onChange={x => setPf({ ...pf, avatar: x.target.value })} placeholder="https://…" /></PField>
          <div style={{ fontSize: 12, color: 'var(--pm)' }}>You start as a SimpleAgent. Accountable roles come later, through peer validation.</div>
          <PErr e={e} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><a onClick={() => P.actions.reset()} style={{ fontSize: 13, cursor: 'pointer' }}>Skip, open the example network</a><button style={{ ...pBtn, opacity: pf.name.trim() ? 1 : .4 }} disabled={!pf.name.trim()} onClick={() => { const r = P.actions.updateProfile(pf); setE(r.ok === false ? r.error : null); }}>Create profile</button></div>
        </React.Fragment>}
        {cur === 'start' && <React.Fragment>
          <div><div style={{ fontSize: 26, fontWeight: 700 }}>Welcome, {P.s.profile.name}</div><div style={{ fontSize: 14, color: 'var(--pm)', marginTop: 4 }}>NDOs are scoped to groups. Start from the example network, from a blank canvas, or with an invite link.</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div style={card}><b style={{ fontSize: 15 }}>Example network</b><span style={{ fontSize: 13, color: 'var(--pm)', lineHeight: 1.5, flex: 1 }}>Join Sensorica and the Open Value Network: a shared CNC machine, a cryo-EM, an artwork on tour, a light sculpture and a sensor design, from the documented user stories.</span><PCall c="join_group × 2" /><button style={pBtn} onClick={() => { P.actions.joinDemo(); onGroup && onGroup('sen'); }}>Join the example network</button></div>
            <div style={card}><b style={{ fontSize: 15 }}>Blank canvas</b><span style={{ fontSize: 13, color: 'var(--pm)', lineHeight: 1.5 }}>Create a new, empty group in the prototype network. You'll declare its first NDO next.</span>
              <input style={pInput} value={g.name} onChange={x => setG({ ...g, name: x.target.value })} placeholder="Group name *" /><input style={pInput} value={g.desc} onChange={x => setG({ ...g, desc: x.target.value })} placeholder="Description" />
              <PCall c="zome_group::create_group" /><button style={{ ...pBtn, opacity: g.name.trim() ? 1 : .4 }} disabled={!g.name.trim()} onClick={() => { const r = P.actions.createGroup(g); if (r.ok === false) setE(r.error); else { setE(null); onGroup && onGroup(r.id); setNd(n => ({ ...n, group: r.id })); setStep('ndo'); } }}>Create group</button></div>
            <div style={card}><b style={{ fontSize: 15 }}>Invite link</b><span style={{ fontSize: 13, color: 'var(--pm)', lineHeight: 1.5, flex: 1 }}>Paste a link someone shared with you. Try the food basket network: <span style={{ fontFamily: 'var(--pmono, monospace)' }}>ndo-invite:food-7k2p</span></span>
              <input style={{ ...pInput, fontFamily: 'var(--pmono, monospace)' }} value={code} onChange={x => setCode(x.target.value)} placeholder="ndo-invite:…" />
              <PCall c="zome_group::join_group" /><button style={{ ...pBtn, opacity: code.trim() ? 1 : .4 }} disabled={!code.trim()} onClick={() => { const r = P.actions.joinGroup(code); if (r.ok === false) setE(r.error); else { setE(null); onGroup && onGroup(r.id); } }}>Join group</button></div>
          </div>
          <PErr e={e} />
        </React.Fragment>}
        {cur === 'ndo' && <React.Fragment>
          <div><div style={{ fontSize: 26, fontWeight: 700 }}>Declare your first NDO</div><div style={{ fontSize: 14, color: 'var(--pm)', marginTop: 4 }}>{newest ? newest.name + ' is ready. ' : ''}An NDO starts in Ideation. You are its initiator, so only you can move it through its lifecycle.</div></div>
          <PCall c="zome_resource::create_ndo → zome_group::create_ndo_anchor" />
          <PField label="Name *"><input autoFocus style={pInput} value={nd.name} onChange={x => setNd({ ...nd, name: x.target.value })} placeholder="e.g. Shared 3D printer" /></PField>
          <PField label="Description"><input style={pInput} value={nd.desc} onChange={x => setNd({ ...nd, desc: x.target.value })} /></PField>
          <PField label="Resource Nature"><PChoice options={ENUM.nature} value={nd.nature} onChange={v => setNd({ ...nd, nature: v })} /></PField>
          <PField label="Property Regime" hint={nd.regime === 'Nondominium' ? 'Uncapturable: no agent can take unilateral control.' : null}><PChoice options={ENUM.regime} value={nd.regime} onChange={v => setNd({ ...nd, regime: v })} /></PField>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><a onClick={() => setStep(null)} style={{ fontSize: 13, cursor: 'pointer' }}>Skip for now</a><button style={{ ...pBtn, opacity: nd.name.trim() ? 1 : .4 }} disabled={!nd.name.trim()} onClick={() => { const id = P.actions.createNdo({ ...nd, group: nd.group || (newest && newest.id) }); setStep(null); onNdo && onNdo(id); }}>Declare NDO</button></div>
        </React.Fragment>}
      </div>
    </div>
  );
}

function HelpModal({ onClose }) {
  const row = (h, p) => <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12, fontSize: 14, lineHeight: 1.5 }}><b>{h}</b><span style={{ color: 'var(--pm)' }}>{p}</span></div>;
  return (
    <PModal title="How this works" sub="Nondominium lets people share things without anyone owning or controlling them." onClose={onClose} width={560}>
      {row('Groups', 'The communities you belong to. Each group lists the resources its members share. Invite others with a link.')}
      {row('Resources', 'Something shared: a machine, a design, an artwork. Each one carries its own rules, wherever it goes.')}
      {row('Items', 'The actual physical or digital things of a resource, and who holds each one right now.')}
      {row('Requests', 'When you ask to borrow or receive an item. The holder completes it by handing the item over.')}
      {row('Approvals', 'Other members check new items and requests. Nobody can approve their own.')}
      {row('Receipts', 'Each time you help, you get a private receipt. Only you see them, and they build your reputation.')}
      {row('Offline', 'Everything works offline. Your actions are saved on your device and shared when you reconnect.')}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button style={pBtn} onClick={onClose}>Got it</button></div>
    </PModal>
  );
}

// One menu, same v0.1 flows in every prototype. ndo = the NDO in focus (optional); onOpen(id) selects an NDO.
function FlowMenu({ P, setM, ndo, onOpen, onGroup, style, align = 'right', label }) {
  const [open, setOpen] = React.useState(false); const btnRef = React.useRef(null); const [rect, setRect] = React.useState(null);
  React.useEffect(() => { if (open && btnRef.current) setRect(btnRef.current.getBoundingClientRect()); }, [open]);
  React.useEffect(() => { const k = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); } if (e.key === 'Escape') setOpen(false); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);
  const n = ndo && P.q.ndo(ndo);
  const go = m => { setOpen(false); if (m.type === '__dev') { try { localStorage.setItem('ndo-dev', NDO_DEV ? '0' : '1'); } catch (e) {} return location.reload(); } if (m.type === '__fresh') return P.actions.startFresh(); if (m.type === '__example') return P.actions.reset(); setM(m); };
  const open_c = P.q.openCommitments().length;
  const items = [
    ['You and your groups', [['How this works', { type: 'help' }], ['Your profile', { type: 'profile' }], ['+ Create a group', { type: 'group', after: onGroup }], ['→ Join a group with a link', { type: 'join', after: onGroup }], ['+ Add a shared resource', { type: 'create', after: onOpen }], ['Find resources', { type: 'browse', onOpen }], ['Requests · ' + open_c + ' open', { type: 'commitments' }], ['Your receipts · ' + P.s.receipts.length, { type: 'receipts' }]]],
    ['Prototype', [['Start over as a new person', { type: '__fresh' }], ['Reload the example', { type: '__example' }], [(NDO_DEV ? '✓ ' : '') + 'Developer details', { type: '__dev' }]]],
    n ? [n.name, [['Change its stage', { type: 'advance', ndo: n.id }], ['Add a rule', { type: 'rule', ndo: n.id }], ['Items and who holds them', { type: 'resources', ndo: n.id }], ['Ask to borrow or receive', { type: 'commit', ndo: n.id }], ['Requests on this resource', { type: 'commitments', ndo: n.id }], ['Link to another resource', { type: 'attach', ndo: n.id }], ['Log work', { type: 'note', ndo: n.id }]]] : null,
  ].filter(Boolean);
  return (
    <div style={{ position: 'relative', ...style }}>
      <button ref={btnRef} onClick={() => setOpen(!open)} title="Everything you can do (⌘K)" style={{ ...pBtnGhost, color: 'inherit', borderColor: 'currentColor', fontSize: 13, fontWeight: 600, padding: '4px 12px 4px 4px', display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar id={ME.id} size={22} /><span>{label || 'Menu'}</span><span style={{ opacity: .7 }}>▾</span></button>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 45 }}></div>}
      {open && rect && <div style={{ position: 'fixed', top: Math.min(rect.bottom + 6, innerHeight - 120), left: Math.max(8, Math.min(align === 'left' ? rect.left : rect.right - 260, innerWidth - 268)), width: 260, background: 'var(--pb)', color: 'var(--pi)', border: '1px solid var(--pl)', borderRadius: 12, boxShadow: '0 20px 40px -16px rgba(0,0,0,.45)', padding: 6, zIndex: 46, maxHeight: 'calc(100vh - ' + Math.round(Math.min(rect.bottom + 6, innerHeight - 120) + 12) + 'px)', overflow: 'auto' }}>
        {items.map(([h, list]) => <div key={h} style={{ padding: '4px 0' }}><div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--pm)', padding: '6px 10px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h}</div>
          {list.map(([l, m]) => <button key={l} onClick={() => go(m)} style={{ display: 'block', width: '100%', textAlign: 'left', font: 'inherit', fontSize: 13, color: 'inherit', background: 'transparent', border: 0, borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(127,127,127,.12)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{l}</button>)}</div>)}
        <div style={{ fontSize: 10, color: 'var(--pm)', padding: '6px 10px' }}>Tip: press ⌘K to open this menu</div>
      </div>}
    </div>
  );
}

const WHY_PLAIN = { fulfil: 'You are one of the two people in this request. Mark it done once the item has been handed over or used. You will both get a private receipt.', validate: 'New items and requests need a check from another member before they go ahead. Nobody can approve their own.', available: 'Your item has been approved. Make it available so others can ask to borrow it.', request: 'This item is free right now. You can ask the person holding it to borrow it. The rules of the resource apply.', maintain: 'This resource has a maintenance rule. Logging the work keeps everyone informed and earns you a receipt.' };
function WhyModal({ sig, ndo, P, onClose }) {
  const rules = ((P && P.s.rules[ndo.id]) || []);
  const [tech, setTech] = React.useState(false);
  const sec = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--pm)' };
  const whatToDo = { fulfil: 'Once it has happened, press the button on the card. You both get a private receipt.', validate: 'Check it, then approve. It goes ahead once enough members approve.', available: 'Make it available so others can ask to borrow it.', request: 'Ask the holder to borrow it. They will hand it over when it suits them.', maintain: 'Do the maintenance, then log the work.' }[sig.kind];
  return (
    <PModal title="Why am I seeing this?" sub={sig.title + ' · ' + ndo.name} onClose={onClose} width={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><div style={sec}>In short</div><div style={{ fontSize: 15, lineHeight: 1.55 }}>{WHY_PLAIN[sig.kind] || 'This comes from the current state of the resource and its rules.'}</div></div>
      {whatToDo && <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><div style={sec}>What you can do</div><div style={{ fontSize: 14, lineHeight: 1.55 }}>{whatToDo}</div></div>}
      {rules.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><div style={sec}>Rules of {ndo.name}</div>
        {rules.map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, borderBottom: '1px solid var(--pl)', padding: '6px 0' }}><span>{PLAIN[k] || k}</span><span style={{ color: 'var(--pm)', textAlign: 'right' }}>{String(v).split(' · ').map(x => PLAIN[x.trim()] || x).join(' · ')}</span></div>)}</div>}
      <div style={{ fontSize: 13, color: 'var(--pm)', lineHeight: 1.5 }}>Nobody assigns tasks here. Suggestions come from the state of shared resources and their rules, not from a ranking or a central feed.</div>
      {NDO_DEV && <div><a onClick={() => setTech(!tech)} style={{ fontSize: 12, cursor: 'pointer' }}>{tech ? 'Hide' : 'Show'} technical details</a>
        {tech && <div style={{ marginTop: 8, fontFamily: 'var(--pmono, monospace)', fontSize: 12, lineHeight: 1.7, background: 'rgba(127,127,127,.08)', padding: 12, borderRadius: 8 }}>{sig.why.map((w, i) => <div key={i}>{w}</div>)}</div>}</div>}
    </PModal>
  );
}

const STAGE_LABEL = NDO_DEV ? { queued: 'Queued · no peers reachable', signed: 'Signed on your source chain', gossip: 'Gossiping', validated: 'Validated by peers' } : { queued: 'Saved on your device · will share when back online', signed: 'Saved on your device', gossip: 'Sharing with your groups', validated: 'Shared and confirmed' };
function PToasts({ toasts, onDrop, dark }) {
  return (
    <div style={{ position: 'fixed', right: 18, bottom: 18, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 60, width: 300 }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => onDrop(t.id)} style={{ background: dark ? '#E6EFEE' : '#131A1C', color: dark ? '#0B1113' : '#fff', borderRadius: 12, padding: '11px 13px', fontSize: 13, boxShadow: '0 12px 30px -10px rgba(0,0,0,.45)', cursor: 'pointer' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{t.title}</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>{['signed', 'gossip', 'validated'].map((k, i) => { const idx = ['signed', 'gossip', 'validated'].indexOf(t.stage); return <span key={k} style={{ flex: 1, height: 3, borderRadius: 2, background: t.stage === 'queued' ? '#E0A21A' : i <= idx ? '#2EC4B6' : 'rgba(127,127,127,.35)', transition: 'background 300ms' }}></span>; })}</div>
          <div style={{ fontSize: 11, opacity: .75 }}>{STAGE_LABEL[t.stage]}{t.stage === 'gossip' ? ' · ' + t.peers + (NDO_DEV ? ' of 23 peers' : ' of 23 people') : ''}</div>
        </div>
      ))}
    </div>
  );
}

function useModals() {
  const [m, setM] = React.useState(null);
  return [m, setM];
}

function ModalHost({ m, setM, P }) {
  if (!m) return null;
  const close = () => setM(null);
  const ndo = m.ndo && P.q.ndo(m.ndo);
  if (m.type === 'create') return <CreateNdoModal groups={P.s.groups} onClose={close} onCreate={f => { const id = P.actions.createNdo(f); m.after && m.after(id); }} />;
  if (m.type === 'attach') return <AttachModal ndo={ndo} P={P} onClose={close} />;
  if (m.type === 'note') return <NoteModal ndo={ndo} P={P} onClose={close} />;
  if (m.type === 'advance') return <AdvanceModal ndo={ndo} P={P} onClose={close} />;
  if (m.type === 'profile') return <ProfileModal P={P} onClose={close} />;
  if (m.type === 'group') return <GroupModal P={P} onClose={close} after={m.after} />;
  if (m.type === 'join') return <JoinModal P={P} onClose={close} after={m.after} />;
  if (m.type === 'browse') return <BrowseModal P={P} onClose={close} onOpen={m.onOpen} />;
  if (m.type === 'rule') return <RuleModal ndo={ndo} P={P} onClose={close} />;
  if (m.type === 'resources') return <ResourcesModal ndo={ndo} P={P} onClose={close} />;
  if (m.type === 'commit') return <CommitModal ndo={ndo} P={P} onClose={close} />;
  if (m.type === 'commitments') return <CommitmentsModal ndo={ndo} P={P} onClose={close} setM={setM} />;
  if (m.type === 'receipts') return <ReceiptsModal P={P} onClose={close} />;
  if (m.type === 'help') return <HelpModal onClose={close} />;
  if (m.type === 'why') return <WhyModal sig={m.sig} ndo={ndo} P={P} onClose={close} />;
  return null;
}

Object.assign(window, { GroupScope, Onboarding, Avatar, AgentChip, avatarColor, PModal, pBtn, pBtnGhost, pInput, PToasts, ModalHost, useModals, STAGE_LABEL, FlowMenu });
