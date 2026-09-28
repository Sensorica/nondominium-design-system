function MyNode({ n, h, sel, sig, onClick, fresh }) {
  const col = { Active: '#2EC4B6', Stable: '#2EC4B6', Distributed: '#8B5CF6', Prototype: '#F2B84B', Development: '#F2B84B', Specification: '#4C7BE0', Ideation: '#56706f', Hibernating: '#56706f', Deprecated: '#8B5CF6', EndOfLife: '#3a4a4a' }[n.stage];
  const r = 8 + Math.min(26, h * 7);
  const quiet = ['Ideation', 'Hibernating', 'EndOfLife'].includes(n.stage);
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle cx={n.x} cy={n.y} r={r * 4} fill={col} opacity={Math.min(.28, h * .07)} style={{ filter: 'blur(18px)', transition: 'all 600ms' }} />
      {sel && <circle cx={n.x} cy={n.y} r={r + 16} fill="none" stroke="#E6EFEE" strokeOpacity=".5" strokeDasharray="2 4" />}
      <circle cx={n.x} cy={n.y} r={r} fill="#0B1113" stroke={col} strokeWidth={2} strokeDasharray={quiet ? '3 3' : null} style={{ transition: 'r 600ms' }} />
      <circle cx={n.x} cy={n.y} r={r + 9} fill="none" stroke={col} strokeOpacity=".22" />
      {fresh && <circle cx={n.x} cy={n.y} r={r} fill="none" stroke="#2EC4B6" strokeWidth="2"><animate attributeName="r" from={r} to={r + 40} dur="1.4s" repeatCount="3" /><animate attributeName="opacity" from="1" to="0" dur="1.4s" repeatCount="3" /></circle>}
      {sig > 0 && <circle cx={n.x + r * .75} cy={n.y - r * .75} r="5" fill="#F2B84B"><animate attributeName="opacity" values="1;.35;1" dur="1.8s" repeatCount="indefinite" /></circle>}
      <text x={n.x} y={n.y + r + 24} textAnchor="middle" fontSize="13" fontWeight="600" fill={quiet ? '#8CA3A2' : '#E6EFEE'}>{n.name}</text>
      <text x={n.x} y={n.y + r + 40} textAnchor="middle" fontSize="11" fill={sig ? '#F2B84B' : '#8CA3A2'}>{plain(n.stage)} · {sig ? sig + ' signal' + (sig > 1 ? 's' : '') : Math.round(h * 10) / 10 + ' heat'}</text>
    </g>
  );
}

// Seeded NDOs keep their hand-placed positions; any number of new ones go on a golden-angle spiral, and the view fits them all.
function fieldPositions(ndos) {
  let k = 0; return ndos.map(n => { if (n.x != null) return n; const a = (k++) * 2.39996; const r = 60 + 48 * Math.sqrt(k); return { ...n, x: 430 + Math.cos(a) * r * 1.3, y: 400 + Math.sin(a) * r }; });
}
function MyField({ P, sel, setSel, decay, mode, group }) {
  const nd = fieldPositions(P.s.ndos).filter(n => group === 'all' || n.group === group);
  const byId = Object.fromEntries(nd.map(n => [n.id, n]));
  const xs = nd.map(n => n.x), ys = nd.map(n => n.y);
  const vb = nd.length ? [Math.min(60, Math.min(...xs) - 90), Math.min(80, Math.min(...ys) - 110), 0, 0] : [0, 0, 836, 764];
  if (nd.length) { vb[2] = Math.max(836, Math.max(...xs) + 110 - vb[0]); vb[3] = Math.max(764, Math.max(...ys) + 110 - vb[1]); }
  const ids = new Set(nd.map(n => n.id));
  const kinds = { Trails: ['use', 'hard', 'cite'], Custody: ['use'], Citations: ['cite', 'hard'] }[mode];
  const style = { use: ['#2EC4B6', null], cite: ['#8B5CF6', null], hard: ['#4C7BE0', '1 7'] };
  const recent = new Set(P.s.traces.filter(t => t.ago === 0 || t.mine && t.status !== 'validated').map(t => t.ndo));
  return (
    <svg width="100%" height="100%" viewBox={vb.join(' ')} style={{ position: 'absolute', inset: 0 }}>
      <g fill="none" strokeLinecap="round">
        {P.s.links.filter(([a, b, k]) => ids.has(a) && ids.has(b) && kinds.includes(k)).map(([a, b, k], i) => {
          const A = byId[a], B = byId[b]; const w = 1 + Math.min(5, (P.q.heatOf(a, decay) + P.q.heatOf(b, decay)) / 2.2);
          const mx = (A.x + B.x) / 2 + (A.y - B.y) * .18, my = (A.y + B.y) / 2 + (B.x - A.x) * .18;
          const on = sel === a || sel === b;
          return <path key={i} d={`M${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} stroke={style[k][0]} strokeWidth={w} strokeDasharray={style[k][1]} opacity={on ? .85 : .35} style={{ transition: 'all 500ms' }} />;
        })}
      </g>
      {nd.map(n => <MyNode key={n.id} n={n} h={P.q.heatOf(n.id, decay)} sel={sel === n.id} sig={P.q.signalsOf(n.id).length} fresh={recent.has(n.id)} onClick={() => setSel(n.id)} />)}
    </svg>
  );
}

function MySignal({ g, P, setM, showNdo }) {
  const c = { hands: '#F2B84B', avail: '#2EC4B6', eyes: '#8B5CF6' }[g.lane];
  const mine = false;
  return (
    <div className="sig">
      <span className="pulse" style={{ background: c, boxShadow: `0 0 0 4px ${c}22` }}></span>
      <div style={{ minWidth: 0 }}>
        {showNdo && <small style={{ display: 'block', color: '#56706f' }}>{P.q.ndo(g.ndo).name}</small>}
        <b>{g.title}</b><small>{g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : ''}{g.sub}</small>
        <a href="#" onClick={e => { e.preventDefault(); setM({ type: 'why', sig: g, ndo: g.ndo }); }} style={{ display: 'block', fontSize: 11, marginTop: 4 }}>why am I seeing this?</a>
      </div>
      {mine && g.lane === 'avail' ? <button disabled style={{ opacity: .5 }}>In use</button> : <button onClick={() => P.actions.pickUp(g)}>{g.verb}</button>}
    </div>
  );
}

function MyTrace({ t, P, decay, showNdo }) {
  const f = freshness(t.ago, decay);
  const op = { fresh: 1, warm: .85, fading: .6, cold: .35 }[f];
  const st = t.status !== 'validated' ? <span className="mono" style={{ color: t.status === 'queued' ? '#F2B84B' : '#2EC4B6', fontSize: 10 }}>{t.status}</span> : null;
  return (
    <div className="trace" style={{ opacity: op }} title={t.hops.length ? 'reached you via ' + t.hops.join(' → ') : ''}>
      <span className="d" style={{ background: t.status === 'queued' ? '#F2B84B' : '#2EC4B6' }}></span>
      <span><Avatar id={t.agent} size={16} /> <b>{P.q.agent(t.agent)}</b> {t.text}{showNdo && <span style={{ color: '#56706f' }}> · {P.q.ndo(t.ndo).name}</span>}{t.note && <em style={{ display: 'block', color: '#8CA3A2', marginTop: 2 }}>“{t.note}”</em>}</span>
      <span className="t">{st || fmtAgo(t.ago)}</span>
    </div>
  );
}

function MyPanel({ P, id, setM, decay, onClose }) {
  const n = P.q.ndo(id);
  const tr = P.q.tracesOf(id), sg = P.q.signalsOf(id), hl = P.q.hardLinksOf(id);
  const bars = Array.from({ length: 14 }, (_, i) => tr.filter(t => Math.floor(t.ago / 1440 / 2) === 13 - i).length);
  const mx = Math.max(1, ...bars);
  return (
    <aside className="panel">
      <div style={{ display: 'flex', alignItems: 'center' }}><div className="kick">Shared resource{NDO_DEV ? ' · ' + n.hash : ''}</div><button className="x" onClick={onClose}>✕</button></div>
      <h1>{n.name}</h1>
      <div className="tags"><span className="tag l">{plain(n.stage)}</span><span className="tag r">{plain(n.regime)}</span><span className="tag">{plain(n.nature)}</span><span className="tag">{plain(n.rivalry)}</span></div>
      <p style={{ fontSize: 13, color: '#8CA3A2', margin: '0 0 14px', lineHeight: 1.5 }}>{n.desc}</p>
      <div className="kick">Trail strength · 28 days</div>
      <div className="strength">{bars.map((b, i) => <span key={i} style={{ height: Math.max(6, b / mx * 100) + '%', opacity: b ? .4 + i / 22 : .12 }}></span>)}</div>
      <div className="row"><span>fading</span><span>fresh</span></div>
      <div className="acts">
        <button onClick={() => setM({ type: 'note', ndo: id })}>Log work</button>
        <button onClick={() => setM({ type: 'advance', ndo: id })}>Lifecycle</button>
        <button onClick={() => setM({ type: 'resources', ndo: id })}>Items & holders</button>
        <button onClick={() => setM({ type: 'commitments', ndo: id })}>Requests · {P.q.commitmentsOf(id).filter(c => c.status === 'open').length}</button>
        <button onClick={() => setM({ type: 'rule', ndo: id })}>+ Rule</button>
      </div>
      <div className="sec"><h3>Signals on this resource <span>{sg.length} open</span></h3>{sg.length ? sg.map(g => <MySignal key={g.id} g={g} P={P} setM={setM} />) : <div className="empty">No open signals. The resource is quiet.</div>}</div>
      <div className="sec"><h3>Traces <span>{tr.length}</span></h3>{tr.slice(0, 8).map(t => <MyTrace key={t.id} t={t} P={P} decay={decay} />)}</div>
      <div className="sec"><h3>Linked resources <span>{hl.length}</span></h3>
        <div className="slots">{hl.map((h, i) => <span key={i} className="slot">{plain(h.type)} {h.from === id ? '→' : '←'} {(P.q.ndo(h.from === id ? h.to : h.from) || {}).name}</span>)}<span className="slot add" onClick={() => setM({ type: 'attach', ndo: id })}>+ link resource</span></div>
      </div>
    </aside>
  );
}

function MyceliumApp() {
  const P = useProto();
  const [m, setM] = useModals();
  const [view, setView] = React.useState('field');
  const [sel, setSel] = React.useState('sol');
  const [decay, setDecay] = React.useState(14);
  const [mode, setMode] = React.useState('Trails');
  const [group, setGroup] = React.useState('all');
  const openSig = P.s.signals;
  const nav = [['field', 'Field', {}], ['signals', 'Signals', { borderStyle: 'dashed' }], ['traces', 'Traces', { borderRadius: 3 }], ['me', 'You', { background: '#2a3e40', border: 0 }]];
  return (
    <div className="app">
      <nav className="rail">
        <div className="logo" title="Nondominium"></div>
        {nav.map(([k, l, st]) => <div key={k} className={'ri' + (view === k ? ' on' : '')} onClick={() => setView(k)} style={k === 'me' ? { marginTop: 'auto' } : null}>{k === 'me' ? <Avatar id={ME.id} size={22} ring={view === 'me'} /> : <span className="g" style={st}></span>}{l}{k === 'signals' && <em className="cnt">{openSig.length}</em>}</div>)}
      </nav>
      <main className="field">
        {view === 'field' && <React.Fragment>
          <div className="top">
            <div className="seg" style={{ alignItems: 'center' }}><GroupScope P={P} value={group} onChange={setGroup} /></div>
            <div className="seg" style={{ marginLeft: 'auto' }}>{['Trails', 'Custody', 'Citations'].map(k => <span key={k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>{k}</span>)}</div>
            <span className="seg"><span onClick={() => setM({ type: 'group', after: g => setGroup(g) })}>+ Group</span><span onClick={() => setM({ type: 'join', after: g => setGroup(g) })}>→ Join</span></span>
            <FlowMenu P={P} setM={setM} ndo={sel} onOpen={id => { setView('field'); setSel(id); }} onGroup={g => setGroup(g)} />
            <button className="new" onClick={() => setM({ type: 'create', after: id => setSel(id) })}>+ Declare NDO</button>
          </div>
          <MyField P={P} sel={sel} setSel={setSel} decay={decay} mode={mode} group={group} />
          <div className="foot2"><div className="legend"><span><i style={{ background: '#2EC4B6' }}></i>use &amp; custody</span><span><i style={{ background: '#8B5CF6' }}></i>citation</span><span><i style={{ background: 'repeating-linear-gradient(90deg,#4C7BE0 0 2px,transparent 2px 8px)' }}></i>hard link</span><span><i style={{ background: '#F2B84B', width: 8, height: 8, borderRadius: 4 }}></i>open signal</span></div>
          <div className="decay">Trails fade over <input type="range" min="1" max="90" value={decay} onChange={e => setDecay(+e.target.value)} /><span className="mono">{decay} d</span></div></div>
        </React.Fragment>}
        {view === 'signals' && <div className="list"><h2>Open signals</h2><p className="lede">Derived from open commitments, resource states and governance rules across your groups. Picking one up runs the matching zome call.</p>{openSig.map(g => <MySignal key={g.id} g={g} P={P} setM={setM} showNdo />)}{!openSig.length && <div className="empty">Nothing is asking for attention right now.</div>}</div>}
        {view === 'traces' && <div className="list"><h2>Traces reaching your node</h2><p className="lede">Hover a trace to see the peer path it took. Opacity shows freshness at the current fade setting ({decay} d).</p>{P.s.traces.map(t => <MyTrace key={t.id} t={t} P={P} decay={decay} showNdo />)}</div>}
        {view === 'me' && <div className="list"><div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}><Avatar id={ME.id} size={52} ring /><h2 style={{ margin: 0 }}>{ME.name}</h2></div><p className="lede">Roles: {ME.roles.join(', ')}. Your traces live on your own source chain.</p>
          <div style={{ display: 'flex', gap: 8, margin: '4px 0 12px' }}><button className="new" onClick={() => setM({ type: 'profile' })}>Edit profile & roles</button><button className="new" style={{ background: 'transparent', color: 'var(--teal)', border: '1px solid #2a4a4a' }} onClick={() => setM({ type: 'receipts' })}>Reputation summary</button></div>
          <div className="sec"><h3>Private participation receipts <span>{P.s.receipts.length}</span></h3>{P.s.receipts.length ? P.s.receipts.map(r => <div key={r.id} className="trace"><span className="d" style={{ background: '#8B5CF6' }}></span><span>◆ {r.text} · {(P.q.ndo(r.ndo) || {}).name}{r.type ? <em style={{ display: 'block', color: '#56706f', fontStyle: 'normal' }}>{r.type}</em> : null}</span><span className="t">private</span></div>) : <div className="empty">Pick up a “Needs hands” or “Needs eyes” signal to earn a receipt.</div>}</div>
          <div className="sec"><h3>Your traces <span>{P.s.traces.filter(t => t.agent === ME.id).length}</span></h3>{P.s.traces.filter(t => t.agent === ME.id).map(t => <MyTrace key={t.id} t={t} P={P} decay={decay} showNdo />)}</div>
          <button className="new" style={{ marginTop: 20 }} onClick={P.actions.reset}>Reset prototype data</button>
        </div>}
      </main>
      {view === 'field' && sel && P.q.ndo(sel) ? <MyPanel P={P} id={sel} setM={setM} decay={decay} onClose={() => setSel(null)} /> : <aside className="panel empty-panel"><div className="empty">{P.s.ndos.length ? 'Select an NDO in the field to see its traces, signals and links.' : 'No NDOs yet. NDOs are scoped to groups: declare one with + Declare NDO.'}</div></aside>}
      <div className="status">
        <span onClick={P.actions.toggleOffline} style={{ cursor: 'pointer' }} title="Toggle to simulate going offline"><span className="ok" style={{ background: P.s.offline ? '#F2B84B' : '#2EC4B6' }}></span>Your node · {P.s.offline ? 'offline, traces queue locally' : 'online'}</span>
        <span>{P.s.offline ? 0 : 23} peers gossiping</span>
        <span>{P.s.traces.filter(t => t.status === 'queued').length ? P.s.traces.filter(t => t.status === 'queued').length + ' queued' : 'Last trace reached you via Marco → FabLab node'}</span>
        <span style={{ marginLeft: 'auto' }} className="mono">DHT ⟳ {P.s.offline ? 'paused' : '98% consistent'}</span>
      </div>
      <ModalHost m={m} setM={setM} P={P} />
      <PToasts toasts={P.toasts} onDrop={P.dropToast} />
      <Onboarding P={P} onNdo={id => { setView('field'); setSel(id); }} onGroup={g => setGroup('all')} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<MyceliumApp />);
