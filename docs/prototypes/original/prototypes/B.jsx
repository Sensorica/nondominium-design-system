function FnInk({ tr }) {
  const b = Array.from({ length: 7 }, (_, i) => tr.filter(t => Math.floor(t.ago / 1440 / 4) === 6 - i).length);
  const mx = Math.max(1, ...b);
  return <span className="ink">{b.map((v, i) => <i key={i} style={{ height: Math.max(3, v / mx * 100) + '%', opacity: v ? 1 : .25 }}></i>)}</span>;
}

function FnIndex({ P, sel, setSel, q, setQ, setM }) {
  const [shut, setShut] = React.useState({});
  const match = n => !q || (n.name + n.regime + n.stage + n.nature).toLowerCase().includes(q.toLowerCase());
  return (
    <aside className="index">
      <div className="brand"><div className="mark"></div><span>Nondominium</span><FlowMenu P={P} setM={setM} ndo={sel} onOpen={setSel} style={{ marginLeft: 'auto' }} align="left" label="Flows" /></div>
      <input className="search" placeholder="Search the commons register…" value={q} onChange={e => setQ(e.target.value)} />
      {P.s.groups.map(g => {
        const list = P.s.ndos.filter(n => n.group === g.id && match(n));
        return <React.Fragment key={g.id}>
          <div className="idxh" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setShut({ ...shut, [g.id]: !shut[g.id] })}><span>{g.name} · register</span><span>{list.length} {shut[g.id] ? '▸' : '▾'}</span></div>
          {!shut[g.id] && list.map(n => { const quiet = ['Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage); const sig = P.q.signalsOf(n.id).length; return (
            <div key={n.id} className={'entry' + (sel === n.id ? ' on' : '')} onClick={() => setSel(n.id)}>
              <b style={quiet ? { color: 'var(--mute)' } : null}>{n.name}</b><small>{plain(n.stage)} · {plain(n.regime)}{sig ? <span style={{ color: 'var(--rust)' }}> · {sig} left for you</span> : ''}</small><FnInk tr={P.q.tracesOf(n.id)} />
            </div>); })}
          {!list.length && !shut[g.id] && <div className="foot" style={{ margin: '6px 0' }}>{q ? 'No entries match.' : 'No NDOs in this group yet.'}</div>}
        </React.Fragment>;
      })}
      <div className="idxfoot"><span className="btn" onClick={() => setM({ type: 'create', after: setSel })}>Open a new entry</span><span style={{ display: 'flex', gap: 12, fontSize: 13 }}><a onClick={() => setM({ type: 'group' })} style={{ cursor: 'pointer' }}>+ New group</a><a onClick={() => setM({ type: 'join' })} style={{ cursor: 'pointer' }}>→ Join group</a><a onClick={() => setM({ type: 'browse', onOpen: setSel })} style={{ cursor: 'pointer' }}>Browse</a></span><span className="foot">Ink bars show traces per 4 days, newest on the right.</span></div>
    </aside>
  );
}

function FnEntry({ P, id, setM, view, setView }) {
  const n = P.q.ndo(id); const tr = P.q.tracesOf(id);
  if (!n) return <main className="page"><div className="kick">The register</div><h1>{P.s.ndos.length ? 'Pick an entry' : 'An empty register'}</h1><p className="lede">{P.s.ndos.length ? 'Choose an NDO from the index on the left.' : 'NDOs are scoped to groups. Open a new entry, or join a group with an invite link.'}</p><div style={{ display: 'flex', gap: 12 }}><span className="btn" onClick={() => setM({ type: 'create' })}>Open a new entry</span><span className="btn" onClick={() => setM({ type: 'join' })}>→ Join group</span></div></main>;
  const author = tr[tr.length - 1];
  return (
    <main className="page">
      <div className="kick" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Entry № {n.hash} · opened by <Avatar id={n.initiator || (author && author.agent)} size={16} /> {P.q.agent(n.initiator || (author && author.agent))}</div>
      <h1>{n.name}</h1>
      <p className="lede">{n.desc || 'No description yet.'}</p>
      <div className="stamp"><div><small>Stage</small><b>{plain(n.stage)}</b></div><div><small>Ownership</small><b>{plain(n.regime)}</b></div><div><small>Type</small><b>{plain(n.nature)}</b></div><div><small>Use</small><b>{plain(n.rivalry)}</b></div></div>
      <div className="tabs">{[['trail', 'The trail'], ['rules', 'Rules & items'], ['commit', 'Requests'], ['attached', 'Linked']].map(([k, l]) => <span key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{l}</span>)}
        <div className="acts2"><span onClick={() => setM({ type: 'note', ndo: id })}>Log work</span>
        <span onClick={() => setM({ type: 'advance', ndo: id })}>Turn the page (lifecycle)</span></div>
      </div>
      {view === 'trail' && <div className="trail">
        {tr.map(t => { const f = freshness(t.ago); return (
          <div key={t.id} className={'ev ' + (f === 'fresh' || t.status !== 'validated' ? 'fresh' : '')} style={{ opacity: f === 'cold' ? .5 : f === 'fading' ? .75 : 1 }}>
            <div><h4 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar id={t.agent} size={20} /><span>{P.q.agent(t.agent)} {t.text}</span></h4>
              <span className="when">{t.status === 'validated' ? (t.ago < 1 ? 'just now' : fmtAgo(t.ago) + ' ago') : STAGE_LABEL[t.status]}{t.hops.length ? ' · reached you via ' + t.hops.join(' → ') : ''}</span></div>
            <div>{t.note && <div className="margin">“{t.note}”<small>— {P.q.agent(t.agent)}, note on this trace</small></div>}</div>
          </div>); })}
        {!tr.length && <p className="lede">No traces yet. Be the first to leave one.</p>}
      </div>}
      {view === 'rules' && <div className="two">
        <div><h3 className="h3">Rules in force</h3>{(P.s.rules[id] || []).map(([k, v]) => <div key={k} className="sl"><span>{plain(k)}</span><span>{plain(v)}</span></div>)}{!(P.s.rules[id] || []).length && <p className="foot">No governance rules. Default regime behaviour applies.</p>}</div>
        <div><h3 className="h3">Items</h3>{(P.s.instances[id] || []).map(([k, v, c]) => <div key={k} className="sl"><span>{k}</span><span>{plain(v)} · {P.q.agent(c)}</span></div>)}{!(P.s.instances[id] || []).length && <p className="foot">{['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage) ? 'Instances cannot be added at stage ' + n.stage + '.' : 'No instances yet.'}</p>}</div>
      </div>}
      {view === 'rules' && <div style={{ display: 'flex', gap: 12, marginTop: 14 }}><span className="btn" onClick={() => setM({ type: 'rule', ndo: id })}>Add a rule</span><span className="btn" onClick={() => setM({ type: 'resources', ndo: id })}>Items & holders</span></div>}
      {view === 'commit' && <div>
        {P.q.commitmentsOf(id).map(c => <div key={c.id} className="sl" style={c.status !== 'open' ? { opacity: .5 } : null}><span>{plain(c.action)} · {P.q.agent(c.provider)} → {P.q.agent(c.receiver)}{c.note ? ' · ' + c.note : ''}</span><span>{c.status === 'open' ? 'waiting' : 'done'}</span></div>)}
        {!P.q.commitmentsOf(id).length && <p className="foot">No requests yet.</p>}
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}><span className="btn" onClick={() => setM({ type: 'commit', ndo: id })}>Ask to borrow or receive</span><span className="btn" onClick={() => setM({ type: 'commitments', ndo: id })}>Mark done…</span></div>
      </div>}
      {view === 'attached' && <div>
        {P.q.hardLinksOf(id).map((h, i) => <div key={i} className="sl"><span>{(P.q.ndo(h.from === id ? h.to : h.from) || {}).name}</span><span>{plain(h.type)} · {h.from === id ? 'outgoing' : 'incoming'}</span></div>)}
        {!P.q.hardLinksOf(id).length && <p className="foot">No hard links. Link a component, a source it derives from, or an NDO it supersedes.</p>}
        <span className="btn" onClick={() => setM({ type: 'attach', ndo: id })}>Link to another NDO</span>
      </div>}
    </main>
  );
}

function FnSide({ P, id, setM }) {
  if (!P.q.ndo(id)) return <aside className="side"><h3>Left here for you</h3><div className="sub">{P.s.signals.length} open signals across your groups.</div><div className="receipts"><h3 onClick={() => setM({ type: 'receipts' })} style={{ cursor: 'pointer' }}>Your receipts →</h3><div className="foot">{P.s.receipts.length} private receipts.</div></div></aside>;
  const sg = P.q.signalsOf(id); const all = P.s.signals.filter(g => g.ndo !== id);
  return (
    <aside className="side">
      <h3>Left here for you</h3>
      <div className="sub">Open signals any qualified agent can take up.</div>
      {sg.map(g => <div key={g.id} className="note"><b>{g.title}</b><small>{g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : ''}{g.sub}</small><br />
        <span className="act" onClick={() => P.actions.pickUp(g)}>{g.verb} →</span> <span className="why" onClick={() => setM({ type: 'why', sig: g, ndo: g.ndo })}>why?</span></div>)}
      {!sg.length && <div className="note"><small>Nothing left here. The entry is quiet.</small></div>}
      <h3 style={{ marginTop: 26 }}>Elsewhere in the register</h3>
      <div className="sub">{all.length} other open signals</div>
      {all.slice(0, 3).map(g => <div key={g.id} className="note"><small>{P.q.ndo(g.ndo).name}</small><b>{g.title}</b><span className="act" onClick={() => P.actions.pickUp(g)}>{g.verb} →</span></div>)}
      <div className="receipts"><h3 onClick={() => setM({ type: 'receipts' })} style={{ cursor: 'pointer' }}>Your receipts →</h3><div className="sub">Private to your source chain.</div>{P.s.receipts.slice(0, 4).map(r => <div key={r.id} className="sl"><span>◆ {r.text}</span><span>{((P.q.ndo(r.ndo) || {}).name || '').split(' ')[0]}</span></div>)}{!P.s.receipts.length && <div className="foot">None yet.</div>}</div>
      <div className="foot mono" style={{ marginTop: 24 }}>
        <span onClick={P.actions.toggleOffline} style={{ cursor: 'pointer', color: P.s.offline ? 'var(--rust)' : 'inherit' }}>{P.s.offline ? '○ offline · writing locally' : '● 23 peers hold this entry'}</span><br />
        <span onClick={P.actions.reset} style={{ cursor: 'pointer', textDecoration: 'underline' }}>reset prototype</span>
      </div>
    </aside>
  );
}

function FieldNotesApp() {
  const P = useProto(); const [m, setM] = useModals();
  const [sel0, setSel] = React.useState('sol');
  const sel = P.q.ndo(sel0) ? sel0 : (P.s.ndos[0] || {}).id; const [q, setQ] = React.useState(''); const [view, setView] = React.useState('trail');
  React.useEffect(() => setView('trail'), [sel]);
  return (
    <div className="app">
      <FnIndex P={P} sel={sel} setSel={setSel} q={q} setQ={setQ} setM={setM} />
      <FnEntry P={P} id={sel} setM={setM} view={view} setView={setView} />
      <FnSide P={P} id={sel} setM={setM} />
      <ModalHost m={m} setM={setM} P={P} />
      <PToasts toasts={P.toasts} onDrop={P.dropToast} />
      <Onboarding P={P} onNdo={setSel} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<FieldNotesApp />);
