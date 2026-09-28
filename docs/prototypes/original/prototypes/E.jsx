const HO_COL = { id: '#0F1A2A', rules: '#22B3A6', inst: '#3F6FDB', slots: '#7C55E6', sig: '#E5A52A' };
const ringPts = (n, r, off = -Math.PI / 2) => Array.from({ length: n }, (_, i) => { const a = off + i * 2 * Math.PI / Math.max(1, n); return [Math.cos(a) * r, Math.sin(a) * r]; });
const HO_IC = { InUse: '#3F6FDB', Available: '#22B3A6', InMaintenance: '#E5A52A', InStorage: '#8592A3', Reserved: '#7C55E6', InTransit: '#E5A52A', PendingValidation: '#D8452F' };

function HoLobby({ P, go, setM }) {
  const gs = P.s.groups; const N = Math.max(1, gs.length);
  const cols = Math.ceil(Math.sqrt(N)), rows = Math.ceil(N / cols);
  const cw = 920 / cols, chh = 720 / rows, cell = Math.min(cw, chh);
  return <g className="zoomIn">
    {gs.map((g, i) => { const nd = P.s.ndos.filter(n => n.group === g.id); const col = i % cols, row = Math.floor(i / cols); const inRow = Math.min(cols, N - row * cols);
      const x = 40 + (920 - inRow * cw) / 2 + cw * (col + .5), y = 90 + (720 - rows * chh) / 2 + chh * (row + .5);
      const r = Math.min(cell * .44, 90 + nd.length * 10); const fs = Math.max(11, Math.min(18, r / 6)); const dot = Math.max(3, Math.min(12, r / 12));
      return (
      <g key={g.id} onClick={() => go({ group: g.id })} style={{ cursor: 'pointer' }}>
        <circle cx={x} cy={y} r={r} fill="#fff" stroke="#DDE4EB" strokeWidth="2" />
        {ringPts(nd.length, r * .66).map(([dx, dy], j) => <circle key={j} cx={x + dx} cy={y + dy} r={dot + Math.min(dot, P.q.heatOf(nd[j].id) * 2)} fill="#F3F6F8" stroke={P.q.signalsOf(nd[j].id).length ? HO_COL.sig : HO_COL.rules} strokeWidth="2" />)}
        <text x={x} y={y - 4} textAnchor="middle" fontSize={fs} fontWeight="800" fill="#0F1A2A">{g.name.length > 22 ? g.name.slice(0, 21) + '…' : g.name}</text>
        <text x={x} y={y + fs} textAnchor="middle" fontSize={Math.max(10, fs * .66)} fill="#8592A3">{nd.length} NDO{nd.length === 1 ? '' : 's'}</text>
      </g>); })}
    {!gs.length && <text x="480" y="420" textAnchor="middle" fontSize="14" fill="#8592A3">No groups yet. Create one or join with an invite link.</text>}
  </g>;
}

function HoGroup({ P, gid, go, sel, setSel, setM }) {
  const nd = P.s.ndos.filter(n => n.group === gid);
  const two = nd.length > 12; const pts = nd.map((_, i) => { const [x, y] = ringPts(nd.length, 1)[i]; const R = two ? (i % 2 ? 300 : 185) : 230; return [x * R, y * R]; });
  const k = Math.max(.45, Math.min(1, 10 / Math.max(1, nd.length)));
  return <g className="zoomIn">
    <circle cx="480" cy="420" r="340" fill="#fff" stroke="#DDE4EB" />
    <text x="480" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill="#8592A3" letterSpacing="1.5">{P.s.groups.find(g => g.id === gid).name.toUpperCase()} · GROUP DHT</text>
    {nd.map((n, i) => { const [dx, dy] = pts[i]; const x = 480 + dx, y = 420 + dy; const r = (26 + Math.min(30, P.q.heatOf(n.id) * 8)) * k; const quiet = ['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage); const sg = P.q.signalsOf(n.id).length; return (
      <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => sel === n.id ? go({ group: gid, ndo: n.id }) : setSel(n.id)}>
        <circle cx={x} cy={y} r={r} fill={sel === n.id ? '#EAF7F5' : '#F3F6F8'} stroke={sel === n.id ? '#0F1A2A' : '#DDE4EB'} strokeDasharray={quiet ? '3 4' : null} strokeWidth={sel === n.id ? 2 : 1} />
        <circle cx={x} cy={y} r={r * .38} fill="none" stroke={sg ? HO_COL.sig : HO_COL.rules} strokeWidth="3" />
        <text x={x} y={y + r + 16} textAnchor="middle" fontSize={nd.length > 12 ? 10 : 12} fontWeight="700" fill="#0F1A2A">{n.name.length > 20 ? n.name.slice(0, 19) + '…' : n.name}</text>
        <text x={x} y={y + r + 29} textAnchor="middle" fontSize={nd.length > 12 ? 9 : 11} fill="#8592A3">{plain(n.stage)}{sg ? ' · ' + sg + ' signal' + (sg > 1 ? 's' : '') : ''}</text>
      </g>); })}
    <g style={{ cursor: 'pointer' }} onClick={() => setM({ type: 'create', after: id => go({ group: P.q.ndo(id).group, ndo: id }) })}><circle cx="480" cy="420" r="34" fill="#fff" stroke="#8592A3" strokeDasharray="3 4" /><text x="480" y="425" textAnchor="middle" fontSize="12" fontWeight="700" fill="#8592A3">+ Resource</text></g>
  </g>;
}

function HoNdo({ P, id, focus, setFocus, setM }) {
  const n = P.q.ndo(id); const rules = P.s.rules[id] || []; const inst = P.s.instances[id] || []; const slots = P.q.hardLinksOf(id).map(h => ({ type: h.type, label: (P.q.ndo(h.from === id ? h.to : h.from) || {}).name })); const sg = P.q.signalsOf(id);
  const dim = k => focus && focus !== k ? .25 : 1;
  const tog = k => () => setFocus(focus === k ? null : k);
  return <g className="zoomIn" transform="translate(480 420)">
    <g opacity={dim('slots')} style={{ cursor: 'pointer', transition: 'opacity 300ms' }}>
      <circle r="250" fill="none" stroke={HO_COL.slots} strokeOpacity=".16" strokeWidth="34" onClick={tog('slots')} />
      {ringPts(slots.length + 1, 250).map(([x, y], i) => i < slots.length ? <g key={i} onClick={tog('slots')}><circle cx={x} cy={y} r="16" fill="#fff" stroke={HO_COL.slots} strokeWidth="2" /><text x={x} y={y + (y < 0 ? -26 : 34)} textAnchor="middle" fontSize="11" fontWeight="700" fill={HO_COL.slots}>{plain(slots[i].type)}</text></g> : <g key="add" onClick={() => setM({ type: 'attach', ndo: id })}><circle cx={x} cy={y} r="16" fill="#fff" stroke="#8592A3" strokeDasharray="3 3" strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="15" fill="#8592A3">+</text></g>)}
    </g>
    <g opacity={dim('inst')} onClick={tog('inst')} style={{ cursor: 'pointer', transition: 'opacity 300ms' }}>
      <circle r="170" fill="none" stroke={HO_COL.inst} strokeOpacity=".14" strokeWidth="28" />
      {ringPts(inst.length, 170, -Math.PI / 4).map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="10" fill={HO_IC[inst[i][1]] || '#8592A3'} /><text x={x + 16} y={y + 4} fontSize="11" fontWeight="600" fill={HO_IC[inst[i][1]] || '#8592A3'}>{inst[i][0].split(' · ')[0]} · {plain(inst[i][1])}</text></g>)}
      {!inst.length && <text y="-162" textAnchor="middle" fontSize="11" fill="#8592A3">no instances</text>}
    </g>
    <g opacity={dim('rules')} onClick={tog('rules')} style={{ cursor: 'pointer', transition: 'opacity 300ms' }}>
      <circle r="100" fill="none" stroke={HO_COL.rules} strokeOpacity=".2" strokeWidth="22" />
      {ringPts(rules.length, 100, Math.PI * .75).map(([x, y], i) => <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={HO_COL.rules}>{plain(rules[i][0])}</text>)}
    </g>
    {sg.map((g, i) => { const [x, y] = ringPts(sg.length, 134, Math.PI * .15)[i]; return <circle key={g.id} cx={x} cy={y} r="7" fill={HO_COL.sig} style={{ cursor: 'pointer' }} onClick={() => setM({ type: 'why', sig: g, ndo: id })}><animate attributeName="r" values="7;10;7" dur="1.8s" repeatCount="indefinite" /></circle>; })}
    <circle r="54" fill="#0F1A2A" onClick={() => setFocus(null)} style={{ cursor: 'pointer' }} />
    <text y="-4" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{n.name.split(' ').slice(-2).join(' ')}</text>
    <text y="14" textAnchor="middle" fontSize="10" fill="#9fb3c8">{plain(n.stage)} · {plain(n.regime)}</text>
  </g>;
}

function HoCard({ P, at, sel, focus, setFocus, setM, go }) {
  const id = at.ndo || sel;
  if (!id) return <div className="card"><div className="k">{at.group ? 'Group' : 'Lobby'}</div><h2>{at.group ? P.s.groups.find(g => g.id === at.group).name : 'Your holarchy'}</h2><p className="p">{at.group ? 'Click an NDO once to inspect it, twice to enter it.' : 'Each circle is a group DHT you belong to. Click one to zoom in.'}</p><div className="cta"><span className="pbtn" onClick={() => setM({ type: 'create', after: nid => go({ group: P.q.ndo(nid).group, ndo: nid }) })}>+ Add resource</span>{!at.group && <span className="gbtn" onClick={() => setM({ type: 'group', after: g => go({ group: g }) })}>+ New group</span>}{!at.group && <span className="gbtn" onClick={() => setM({ type: 'join', after: g => go({ group: g }) })}>→ Join group</span>}{at.group && <span className="gbtn" onClick={() => { const g = P.s.groups.find(x => x.id === at.group); navigator.clipboard && navigator.clipboard.writeText(g.invite); }}>⎘ Copy invite link</span>}</div></div>;
  const n = P.q.ndo(id); const sg = P.q.signalsOf(id); const rules = P.s.rules[id] || []; const inst = P.s.instances[id] || []; const sl = P.q.hardLinksOf(id).map((h, i) => { const other = (P.q.ndo(h.from === id ? h.to : h.from) || {}).name; const out = h.from === id; return { id: i, type: h.type, label: other, dir: out ? 'outgoing' : 'incoming', text: out ? 'This ' + plain(h.type) + ' ' + other : other + ' ' + plain(h.type) + ' this' }; }); const tr = P.q.tracesOf(id);
  const rows = [['id', 'What it is', `${plain(n.stage)} · ${plain(n.regime)} · ${plain(n.nature)}`, 'L0'], ['rules', rules.length + ' rules go with it', rules.map(r => plain(r[0])).join(' · ') || 'none', 'L1'], ['inst', inst.length + (inst.length === 1 ? ' item' : ' items'), inst.map(i => i[0] + ' · ' + plain(i[1])).join(', ') || 'none', 'L2'], ['slots', sl.length + (sl.length === 1 ? ' linked resource' : ' linked resources'), sl.map(x => x.text).join(' · ') || 'none', 'links']];
  return (
    <div className="card">
      <div className="k">Shared resource</div><h2>{n.name}</h2>
      {rows.map(([k, t, s, l]) => <div key={k} className={'ring' + (focus === k ? ' on' : '')} onClick={() => at.ndo && setFocus(focus === k ? null : k)}><i style={{ borderColor: HO_COL[k] }}></i><span><b>{t}</b><br /><small>{s}</small></span>{NDO_DEV ? <small>{l}</small> : null}</div>)}
      {focus === 'slots' && <div className="detail">{sl.map(x => <div key={x.id}><span>{x.text}</span><small>{x.dir}</small></div>)}</div>}
      {focus === 'rules' && <div className="detail">{rules.map(([a, b]) => <div key={a}><span>{plain(a)}</span><small>{plain(b)}</small></div>)}</div>}
      {focus === 'inst' && <div className="detail">{inst.map(([a, b, c]) => <div key={a}><span>{a}</span><small>{plain(b)} · {P.q.agent(c)}</small></div>)}</div>}
      {sg.length > 0 && <div><div className="k" style={{ margin: '12px 0 6px' }}>Needs attention · {sg.length}</div>{sg.map(g => <div key={g.id} className="sgr"><span>{g.title}</span><span className="mini" onClick={() => P.actions.pickUp(g)}>{g.verb}</span><span className="mini g" onClick={() => setM({ type: 'why', sig: g, ndo: id })}>?</span></div>)}</div>}
      {at.ndo && <div><div className="k" style={{ margin: '12px 0 6px' }}>Recent activity</div>{tr.slice(0, 3).map(t => <div key={t.id} className="sgr" style={{ opacity: t.status === 'validated' ? 1 : .7 }}><span><Avatar id={t.agent} size={16} /> <b>{P.q.agent(t.agent)}</b> {t.text}</span><small>{t.status === 'validated' ? fmtAgo(t.ago) : t.status}</small></div>)}</div>}
      <div className="cta">
        {at.ndo ? <span className="pbtn" onClick={() => setM({ type: 'attach', ndo: id })}>Link resource</span> : <span className="pbtn" onClick={() => go({ group: at.group, ndo: id })}>Enter this holon</span>}
        <span className="gbtn" onClick={() => setM({ type: 'note', ndo: id })}>Log work</span>
        {at.ndo && <span className="gbtn" onClick={() => setM({ type: 'advance', ndo: id })}>Lifecycle</span>}
        {at.ndo && <span className="gbtn" onClick={() => setM({ type: 'resources', ndo: id })}>Items</span>}
        {at.ndo && <span className="gbtn" onClick={() => setM({ type: 'commitments', ndo: id })}>Requests</span>}
        {at.ndo && <span className="gbtn" onClick={() => setM({ type: 'rule', ndo: id })}>+ Rule</span>}
      </div>
    </div>
  );
}

function HolarchyApp() {
  const P = useProto(); const [m, setM] = useModals();
  const [at0, setAt] = React.useState({ group: 'sen', ndo: 'sol' });
  const at = !at0.group || !P.s.groups.some(g => g.id === at0.group) ? {} : at0.ndo && !P.q.ndo(at0.ndo) ? { group: at0.group } : at0; const [sel, setSel] = React.useState(null); const [focus, setFocus] = React.useState(null);
  const go = a => { setAt(a); setSel(null); setFocus(null); };
  const up = () => at.ndo ? go({ group: at.group }) : at.group ? go({}) : null;
  React.useEffect(() => { const w = e => { if (m || !(e.target.closest && e.target.closest('svg.stage'))) return; if (e.deltaY > 30) up(); }; addEventListener('wheel', w); return () => removeEventListener('wheel', w); });
  const depth = at.ndo ? 3 : at.group ? 2 : 1;
  return (
    <React.Fragment>
      <div className="top">
        <div className="mark"></div>
        <div className="crumbs"><span className={depth === 1 ? 'on' : ''} onClick={() => go({})}>Lobby</span>{at.group && <React.Fragment><em>›</em><span className={depth === 2 ? 'on' : ''} onClick={() => go({ group: at.group })}>{P.s.groups.find(g => g.id === at.group).name}</span></React.Fragment>}{at.ndo && <React.Fragment><em>›</em><span className="on">{P.q.ndo(at.ndo).name}</span></React.Fragment>}</div>
        <FlowMenu P={P} setM={setM} ndo={at.ndo || sel} onOpen={nid => go({ group: P.q.ndo(nid).group, ndo: nid })} onGroup={g => go({ group: g })} style={{ marginLeft: 'auto' }} /><div className="zoom">scroll down to go back up · <b>{['', 'all groups', 'inside a group', 'inside a resource'][depth]}</b></div>
      </div>
      <svg className="stage" viewBox="0 0 1000 840" preserveAspectRatio="xMinYMid meet" key={depth + (at.group || '') + (at.ndo || '')}>
        {depth === 1 && <HoLobby P={P} go={go} setM={setM} />}
        {depth === 2 && <HoGroup P={P} gid={at.group} go={go} sel={sel} setSel={setSel} setM={setM} />}
        {depth === 3 && <HoNdo P={P} id={at.ndo} focus={focus} setFocus={setFocus} setM={setM} />}
      </svg>
      <HoCard P={P} at={at} sel={sel} focus={focus} setFocus={setFocus} setM={setM} go={go} />
      <div className="legend"><span><i style={{ background: HO_COL.id }}></i>the resource</span><span><i style={{ background: HO_COL.rules }}></i>rules</span><span><i style={{ background: HO_COL.inst }}></i>items</span><span><i style={{ background: HO_COL.slots }}></i>linked resources</span><span><i style={{ background: HO_COL.sig }}></i>needs attention</span></div>
      <div className="peers"><span onClick={P.actions.toggleOffline} style={{ cursor: 'pointer' }}>{P.s.offline ? (NDO_DEV ? '○ offline · traces queue locally' : '○ offline · your changes are saved and will be shared later') : (NDO_DEV ? '● 23 peers hold this holon' : '● online · shared with 23 people')}</span> · <span onClick={() => setM({ type: 'receipts' })} style={{ cursor: 'pointer' }}>◆ {P.s.receipts.length} receipts</span> · <span onClick={P.actions.reset} style={{ cursor: 'pointer', textDecoration: 'underline' }}>reset</span></div>
      <ModalHost m={m} setM={setM} P={P} /><PToasts toasts={P.toasts} onDrop={P.dropToast} />
      <Onboarding P={P} onNdo={nid => go({ group: (P.s.groups[P.s.groups.length - 1] || {}).id, ndo: nid })} onGroup={g => go({ group: g })} />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<HolarchyApp />);
