const IN_COL = { use: '#119C8F', custody: '#2E5FD1', cite: '#7445E0', work: '#E0A21A', note: '#46514F', attach: '#7445E0', lifecycle: '#141A1C' };
const LED = { InUse: '#2E5FD1', Available: '#119C8F', InMaintenance: '#E0A21A', InStorage: '#7C8886', InTransit: '#E0A21A', Reserved: '#7445E0', PendingValidation: '#D8452F' };

function InBench({ P, id, setM, trust, setTrust, pick, setPick }) {
  const n = P.q.ndo(id);
  // Everything the hApp attaches to an NDO: group anchor, typed rules, resources, commitments, hard links.
  const all = [
    ...P.s.groups.filter(g => g.id === n.group).map(g => ({ id: 'g-' + g.id, type: NDO_DEV ? 'NdoAnchor' : 'Group', label: g.name, by: n.initiator, entry: 'zome_group::create_ndo_anchor' })),
    ...(P.s.rules[id] || []).map(([k, v]) => ({ id: 'r-' + k, type: NDO_DEV ? k : 'Rule · ' + plain(k), label: plain(v), by: n.initiator, entry: 'create_governance_rule' })),
    ...(P.s.instances[id] || []).map(([k, v, c], i) => ({ id: 'i-' + i, type: NDO_DEV ? 'EconomicResource' : 'Item', label: k + ' · ' + plain(v), by: c, entry: 'create_economic_resource' })),
    ...P.q.commitmentsOf(id).map(c => ({ id: 'c-' + c.id, type: NDO_DEV ? 'Commitment' : 'Request', label: plain(c.action) + ' · ' + (c.status === 'open' ? 'waiting' : 'done'), by: c.receiver, entry: 'propose_commitment' })),
    ...P.q.hardLinksOf(id).map((h, i) => ({ id: 'h-' + i, type: NDO_DEV ? 'NdoHardLink' : 'Linked resource', label: plain(h.type) + (h.from === id ? ' → ' : ' ← ') + ((P.q.ndo(h.from === id ? h.to : h.from) || {}).name || '—'), by: n.initiator, entry: 'create_ndo_hard_link' })),
  ].map(x => ({ ...x, trust: 'trusted' }));
  const shown = all;
  const sockets = [...shown.slice(0, 11), { id: 'open', open: true }];
  const W = 980, H = 470, cx = W / 2, cy = H / 2;
  const pos = sockets.map((l, i) => { const left = i % 2 === 0; const row = Math.floor(i / 2); const rows = Math.ceil(sockets.length / 2); const y = cy + (row - (rows - 1) / 2) * 110; return { l, left, x: left ? 60 : W - 230, y }; });
  const sig = P.q.signalsOf(id).length;
  return (
    <main className="bench">
      <div className="hdr" style={{ flexWrap: 'nowrap' }}>
        <span className="chip" style={{ flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{shown.length} things linked to this resource{shown.length > 11 ? ' · showing 11' : ''}</span>
        <span className="btn" onClick={() => setM({ type: 'attach', ndo: id })}>+ Link resource</span><span className="btn" onClick={() => setM({ type: 'rule', ndo: id })}>+ Rule</span><span className="btn" onClick={() => setM({ type: 'resources', ndo: id })}>+ Item</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 60, height: 'calc(100% - 196px)' }}>
        <g fill="none" strokeWidth="1.5">
          {pos.map(({ l, left, x, y }) => { const sx = left ? x + 170 : x; const mx = left ? cx - 140 : cx + 140; const on = pick === l.id; return <path key={l.id} d={`M${left ? cx - 90 : cx + 90} ${cy} H${mx} V${y} H${sx}`} stroke={l.open ? '#7C8886' : l.trust === 'filtered' ? '#D8452F' : on ? '#119C8F' : '#141A1C'} strokeWidth={on ? 2.5 : 1.5} strokeDasharray={l.open || l.trust !== 'trusted' ? '4 4' : null} />; })}
        </g>
        <rect x={cx - 90} y={cy - 80} width="180" height="160" rx="10" fill="#fff" stroke="#141A1C" strokeWidth="2" />
        <rect x={cx - 78} y={cy - 68} width="156" height="136" rx="6" fill="none" stroke="#D6DDDB" />
        <text x={cx} y={cy - 22} textAnchor="middle" fontSize="10" fill="#7C8886">SHARED RESOURCE</text>
        <text x={cx} y={cy + 2} textAnchor="middle" fontSize="14" fontWeight="700" fill="#141A1C">{n.name.length > 20 ? n.name.slice(0, 19) + '…' : n.name}</text>
        {NDO_DEV && <text x={cx} y={cy + 22} textAnchor="middle" fontSize="10" fill="#7C8886">{n.hash}</text>}
        <circle cx={cx} cy={cy + 48} r="5" fill={sig ? '#E0A21A' : '#119C8F'}><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite" /></circle>
        {pos.map(({ l, left, x, y }) => l.open ? (
          <g key="open" style={{ cursor: 'pointer' }} onClick={() => setM({ type: 'attach', ndo: id })}>
            <rect x={x} y={y - 24} width="170" height="48" rx="6" fill="#F7F9F8" stroke="#7C8886" strokeDasharray="4 4" />
            <circle cx={left ? x + 170 : x} cy={y} r="5" fill="#fff" stroke="#7C8886" />
            <text x={x + 14} y={y - 4} fontSize="11" fontWeight="700" fill="#7C8886">open socket</text><text x={x + 14} y={y + 12} fontSize="11" fill="#7C8886">link a resource</text>
          </g>) : (
          <g key={l.id} style={{ cursor: 'pointer' }} onClick={() => setPick(pick === l.id ? null : l.id)}>
            <rect x={x} y={y - 24} width="170" height="48" rx="6" fill={pick === l.id ? '#E6F5F3' : '#fff'} stroke={l.trust === 'filtered' ? '#D8452F' : '#141A1C'} strokeDasharray={l.trust === 'filtered' ? '4 4' : null} />
            <circle cx={left ? x + 170 : x} cy={y} r="5" fill={l.trust === 'filtered' ? '#fff' : l.fresh ? '#119C8F' : '#141A1C'} stroke={l.trust === 'filtered' ? '#D8452F' : 'none'} />
            <text x={x + 14} y={y - 4} fontSize="11" fontWeight="700" fill={l.trust === 'filtered' ? '#D8452F' : '#141A1C'}>{l.type}</text>
            <text x={x + 14} y={y + 12} fontSize="11" fill="#7C8886">{l.label.length > 24 ? l.label.slice(0, 23) + '…' : l.label}</text>
          </g>))}
      </svg>
      {pick && all.find(l => l.id === pick) && (() => { const l = all.find(x => x.id === pick); return (
        <div className="pop"><b>{l.type}</b><span>{l.label}</span><span>by {P.q.agent(l.by)} · {NDO_DEV ? <span className="mono">{l.entry}</span> : null}</span>
          <span className="lnk" onClick={() => setPick(null)}>close</span></div>); })()}
      <InScope P={P} id={id} />
    </main>
  );
}

function InScope({ P, id }) {
  const tr = P.q.tracesOf(id);
  const kinds = ['use', 'custody', 'cite', 'work'];
  const days = 30;
  const series = kinds.map(k => Array.from({ length: days }, (_, d) => tr.filter(t => (t.kind === k || (k === 'work' && t.kind === 'note')) && Math.floor(t.ago / 1440) === days - 1 - d).length));
  const week = tr.filter(t => t.ago < 10080).length;
  return (
    <div className="scope">
      <div className="h"><b>{NDO_DEV ? 'Trace scope · 30 days' : 'Activity · last 30 days'}</b>{kinds.map(k => <span key={k}><i style={{ background: IN_COL[k] }}></i>{k}</span>)}<span style={{ marginLeft: 'auto' }}>{week} traces / 7 d · {tr.length} total</span></div>
      <svg width="100%" height="52" viewBox="0 0 900 120" preserveAspectRatio="none">
        <g stroke="#D6DDDB"><line x1="0" y1="30" x2="900" y2="30" /><line x1="0" y1="60" x2="900" y2="60" /><line x1="0" y1="90" x2="900" y2="90" /></g>
        {series.map((s, i) => s.map((v, d) => v ? <rect key={i + '-' + d} x={d * 30 + i * 6 + 3} y={116 - v * 26} width="5" height={v * 26} fill={IN_COL[kinds[i]]} /> : null))}
        <line x1="897" y1="0" x2="897" y2="120" stroke="#119C8F" strokeDasharray="2 3" />
      </svg>
      <div className="axis"><span>30 d ago</span><span>now</span></div>
    </div>
  );
}

function InSpec({ P, id, setM }) {
  const n = P.q.ndo(id);
  const sg = P.q.signalsOf(id);
  return (
    <aside className="spec">
      <div className="lbl">Shared resource</div>
      <h1>{n.name}</h1>
      {NDO_DEV && <div className="hash">#{n.hash}…</div>}
      <table><tbody>
        <tr><td>stage</td><td><span className="led" style={{ background: '#119C8F' }}></span><b>{plain(n.stage)}</b> <span className="lnk" onClick={() => setM({ type: 'advance', ndo: id })}>change</span></td></tr>
        <tr><td>ownership</td><td><b>{plain(n.regime)}</b>{n.regime === 'Nondominium' ? ' · uncapturable' : ''}</td></tr>
        <tr><td>type</td><td><b>{plain(n.nature)}</b></td></tr><tr><td>use</td><td>{plain(n.rivalry)}</td></tr>
      </tbody></table>
      <div className="lbl" style={{ marginBottom: 8 }}>Rules</div>
      <table><tbody>{(P.s.rules[id] || [['—', 'no rules']]).map(([k, v]) => <tr key={k}><td>{plain(k)}</td><td>{plain(v)}</td></tr>)}</tbody></table>
      <span className="lnk" onClick={() => setM({ type: 'rule', ndo: id })}>+ add rule</span>
      <div className="lbl" style={{ margin: '12px 0 8px' }}>Items <span className="lnk" onClick={() => setM({ type: 'resources', ndo: id })}>who holds them</span></div>
      {(P.s.instances[id] || []).map(([k, v, c]) => <div key={k} className="inst"><span>{k}<br /><small style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Avatar id={c} size={14} />custodian {P.q.agent(c)}</small></span><small><span className="led" style={{ background: LED[v] || '#7C8886' }}></span>{plain(v)}</small></div>)}
      {!(P.s.instances[id] || []).length && <div className="hash">no instances</div>}
      <div className="lbl" style={{ margin: '16px 0 8px' }}>Needs attention · {sg.length}</div>
      {sg.map(g => <div key={g.id} className="sg"><div><b>{g.title}</b><small>{g.progress ? g.progress[0] + '/' + g.progress[1] + ' · ' : ''}<span className="lnk" onClick={() => setM({ type: 'why', sig: g, ndo: id })}>why?</span></small></div><span className="btn sm" onClick={() => P.actions.pickUp(g)}>{g.verb}</span></div>)}
      <div className="lbl" style={{ margin: '16px 0 8px' }}>Requests · {P.q.commitmentsOf(id).filter(c => c.status === 'open').length} open</div>
      {P.q.commitmentsOf(id).map(c => <div key={c.id} className="sg"><div><b>{plain(c.action)}</b><small>{P.q.agent(c.provider)} → {P.q.agent(c.receiver)} · {c.status === 'open' ? 'waiting' : 'done'}</small></div>{c.status === 'open' && <span className="btn sm" onClick={() => setM({ type: 'commitments', ndo: id })}>Mark done</span>}</div>)}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}><span className="btn ghost" onClick={() => setM({ type: 'commit', ndo: id })}>Ask to borrow</span><span className="btn ghost" onClick={() => setM({ type: 'note', ndo: id })}>Log work</span></div>
    </aside>
  );
}

function InstrumentApp() {
  const P = useProto(); const [m, setM] = useModals();
  const [id0, setId] = React.useState('sol');
  const id = P.q.ndo(id0) ? id0 : (P.s.ndos[0] || {}).id; const [trust, setTrust] = React.useState('strict'); const [pick, setPick] = React.useState(null);
  React.useEffect(() => setPick(null), [id]);
  return (
    <React.Fragment>
      <div className="bar"><div className="mark"></div><span className="nm">Nondominium</span><span onClick={() => setM({ type: 'profile' })} style={{ cursor: 'pointer', marginLeft: 8, display: 'inline-flex' }} title="Your profile"><Avatar id={ME.id} size={24} /></span>
        <nav>{P.s.ndos.map(n => <span key={n.id} title={n.name} className={id === n.id ? 'on' : ''} onClick={() => setId(n.id)}>{n.name.split(' ').slice(0, 3).join(' ')}{P.q.signalsOf(n.id).length ? <i className="dot"></i> : null}</span>)}<span onClick={() => setM({ type: 'create', after: setId })}>+ new</span><span onClick={() => setM({ type: 'browse', onOpen: setId })}>browse {P.s.ndos.length}</span></nav>
        <div className="peer"><FlowMenu P={P} setM={setM} ndo={id} onOpen={setId} /><span onClick={P.actions.toggleOffline} style={{ cursor: 'pointer' }}>node <b style={P.s.offline ? { color: '#F2B84B' } : null}>● {P.s.offline ? 'offline' : 'online'}</b></span><span>peers <b>{P.s.offline ? 0 : 23}</b></span><span onClick={() => setM({ type: 'receipts' })} style={{ cursor: 'pointer' }}>receipts <b>{P.s.receipts.length}</b></span><span onClick={P.actions.reset} style={{ cursor: 'pointer', textDecoration: 'underline' }}>reset</span></div>
      </div>
      {id ? <div className="wrap"><InSpec P={P} id={id} setM={setM} /><InBench P={P} id={id} setM={setM} trust={trust} setTrust={setTrust} pick={pick} setPick={setPick} /></div>
        : <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}><div style={{ textAlign: 'center', maxWidth: 420 }}><div className="lbl">No NDO on the bench</div><p style={{ fontSize: 14, color: 'var(--mute)' }}>NDOs are scoped to groups. Declare one, or join a group with an invite link.</p><span className="btn" onClick={() => setM({ type: 'create', after: setId })}>+ Declare NDO</span> <span className="btn ghost" onClick={() => setM({ type: 'join' })}>→ Join group</span></div></div>}
      <ModalHost m={m} setM={setM} P={P} /><PToasts toasts={P.toasts} onDrop={P.dropToast} />
      <Onboarding P={P} onNdo={setId} />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<InstrumentApp />);
