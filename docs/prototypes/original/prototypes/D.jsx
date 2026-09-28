const SB_LANES = [['hands', 'Needs hands', 'var(--amber)', 'a'], ['avail', 'Available now', 'var(--teal)', 't'], ['eyes', 'Needs eyes', 'var(--violet)', 'v']];

function SbStr({ n }) { return <span className="str">{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < n ? 'on' : ''}></i>)}</span>; }

function SbCard({ g, P, lane, setM, setOpen }) {
  const n = P.q.ndo(g.ndo);
  const cold = n.stage === 'Hibernating' || g.strength <= 1;
  const mine = false;
  const faces = [];
  return (
    <article className={'card ' + (cold ? 'cold' : lane[3])} onClick={() => setOpen(g.ndo)}>
      <div className="res">{n.name}</div><h3>{g.title}</h3>
      <p>{g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : ''}{g.sub}</p>
      <div className="foot" onClick={e => e.stopPropagation()}>
        <SbStr n={g.strength} />
        {(faces.length || mine) ? <span style={{ display: 'inline-flex', marginLeft: 'auto' }}>{mine && <Avatar id={ME.id} size={22} ring />}{faces.map(a => <span key={a} style={{ marginLeft: -6 }}><Avatar id={a} size={22} ring /></span>)}</span> : null}
        {mine && g.lane === 'avail' ? <span className="taken" style={{ marginLeft: faces.length || mine ? 8 : 'auto' }}>in use by you</span> :
          <button className={'take' + (cold ? ' ghost' : '')} style={faces.length || mine ? null : { marginLeft: 'auto' }} onClick={() => P.actions.pickUp(g)}>{g.verb}</button>}
      </div>
      <div className="why" onClick={e => { e.stopPropagation(); setM({ type: 'why', sig: g, ndo: g.ndo }); }}>{NDO_DEV ? g.why[1].replace('← ', 'from ') + ' · why?' : 'Why am I seeing this?'}</div>
    </article>
  );
}

function SbDrawer({ P, id, setM, onClose }) {
  const n = P.q.ndo(id); const tr = P.q.tracesOf(id);
  return (
    <div className="drawerWrap" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        <div className="res">{(P.s.groups.find(g => g.id === n.group) || {}).name}{NDO_DEV ? ' · ' + n.hash : ''}</div>
        <h2>{n.name}</h2>
        <div className="pills"><span>{plain(n.stage)}</span><span>{plain(n.regime)}</span><span>{plain(n.nature)}</span><span>{plain(n.rivalry)}</span></div>
        <p>{n.desc}</p>
        <div className="dact"><button className="take" onClick={() => setM({ type: 'note', ndo: id })}>Log work</button><button className="take ghost" onClick={() => setM({ type: 'attach', ndo: id })}>Link NDO</button><button className="take ghost" onClick={() => setM({ type: 'advance', ndo: id })}>Lifecycle</button><button className="take ghost" onClick={() => setM({ type: 'resources', ndo: id })}>Items</button><button className="take ghost" onClick={() => setM({ type: 'commit', ndo: id })}>Ask to borrow</button><button className="take ghost" onClick={() => setM({ type: 'rule', ndo: id })}>+ Rule</button></div>
        <h4>Requests</h4>
        {P.q.commitmentsOf(id).map(c => <div key={c.id} className="drow" style={c.status !== 'open' ? { opacity: .5 } : null}><span><b>{plain(c.action)}</b> {P.q.agent(c.provider)} → {P.q.agent(c.receiver)}</span>{c.status === 'open' ? <button className="take" onClick={() => setM({ type: 'commitments', ndo: id })}>Mark done</button> : <span className="muted">claimed</span>}</div>)}
        {!P.q.commitmentsOf(id).length && <div className="muted">No requests.</div>}
        <h4>Signals from this resource</h4>
        {P.q.signalsOf(id).map(g => <div key={g.id} className="drow"><span>{g.title}</span><button className="take" onClick={() => P.actions.pickUp(g)}>{g.verb}</button></div>)}
        {!P.q.signalsOf(id).length && <div className="muted">Quiet. No open signals.</div>}
        <h4>Trail</h4>
        {tr.map(t => <div key={t.id} className="drow" style={{ opacity: { fresh: 1, warm: .9, fading: .6, cold: .4 }[freshness(t.ago)] }}><span><Avatar id={t.agent} size={18} /> <b>{P.q.agent(t.agent)}</b> {t.text}{t.note ? <em> “{t.note}”</em> : ''}</span><span className="muted mono">{t.status === 'validated' ? fmtAgo(t.ago) : t.status}</span></div>)}
        <h4>Linked resources</h4>
        <div className="pills">{P.q.hardLinksOf(id).map((h, i) => <span key={i}>{plain(h.type)} {h.from === id ? '→' : '←'} {(P.q.ndo(h.from === id ? h.to : h.from) || {}).name}</span>)}</div>
        {!P.q.hardLinksOf(id).length && <div className="muted">None.</div>}
      </aside>
    </div>
  );
}

function SignalBoardApp() {
  const P = useProto(); const [m, setM] = useModals();
  const [scope, setScope] = React.useState('all'); const [open, setOpen] = React.useState(null); const [mine, setMine] = React.useState(false);
  const inScope = g => scope === 'all' || (P.q.ndo(g.ndo) || {}).group === scope;
  const sigs = P.s.signals.filter(g => P.q.ndo(g.ndo) && inScope(g));
  const recent = P.s.traces.filter(t => P.q.ndo(t.ndo) && inScope(t) && t.ago < 20000).slice(0, 8);
  return (
    <React.Fragment>
      <header>
        <div className="mark"></div><h1>Signals</h1>
        <div className="scope" style={{ alignItems: 'center' }}><GroupScope P={P} value={scope} onChange={setScope} allLabel="All my groups" /></div>
        <button className="take ghost" style={{ marginLeft: 12 }} onClick={() => setM({ type: 'create', after: setOpen })}>+ Add resource</button>
        <button className="take ghost" onClick={() => setM({ type: 'group', after: setScope })}>+ Group</button>
        <FlowMenu P={P} setM={setM} ndo={open} onOpen={setOpen} onGroup={setScope} />
        <div className="me">
          <span className="mono" style={{ color: P.s.offline ? 'var(--amber)' : 'var(--mute)', cursor: 'pointer' }} onClick={P.actions.toggleOffline} title="Toggle offline">{P.s.offline ? '○ offline' : '● 23 peers'}</span>
          <span className="mono" style={{ color: 'var(--mute)', cursor: 'pointer' }} onClick={() => setM({ type: 'receipts' })}>◆ {P.s.receipts.length} receipts</span>
          <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => setM({ type: 'profile' })}><Avatar id={ME.id} size={28} />{ME.name}</span><span className="mono" style={{ color: 'var(--mute)', cursor: 'pointer', textDecoration: 'underline' }} onClick={P.actions.reset} title="Reset prototype">reset</span>
        </div>
      </header>
      <div className="sub">Signals are derived from entries on the DHT: open commitments, resource states and governance rules. Nobody assigns work here. Picking one up runs the matching zome call. Click a card to open its resource.</div>
      <div className="board">
        {SB_LANES.map(l => { const list = sigs.filter(g => g.lane === l[0]).sort((a, b) => b.strength - a.strength); return (
          <section key={l[0]} className="col">
            <div className="ch"><span className="sw" style={{ background: l[2] }}></span><b>{l[1]}</b><span className="n">{list.length}</span></div>
            {list.map(g => <SbCard key={g.id} g={g} P={P} lane={l} setM={setM} setOpen={setOpen} />)}
            {!list.length && <div className="emptyLane">Nothing here right now.</div>}
          </section>); })}
        <section className="col">
          <div className="ch"><span className="sw" style={{ background: 'var(--blue)' }}></span><b>Just happened</b><span className="n">live</span></div>
          {recent.map(t => <article key={t.id} className="card b" style={{ opacity: { fresh: 1, warm: .9, fading: .7, cold: .5 }[freshness(t.ago)] }} onClick={() => setOpen(t.ndo)}>
            <div className="res">{P.q.ndo(t.ndo).name}</div><h3 style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Avatar id={t.agent} size={22} /><span>{P.q.agent(t.agent)} {t.text}</span></h3>
            <p>{t.status === 'validated' ? (t.ago < 1 ? 'just now' : fmtAgo(t.ago) + ' ago') : STAGE_LABEL[t.status]}{t.hops.length ? ' · via ' + t.hops.join(' → ') : ''}</p>
            {t.mine && <div className="taken">+1 trace on this resource</div>}
          </article>)}
        </section>
      </div>
      {open && P.q.ndo(open) && <SbDrawer P={P} id={open} setM={setM} onClose={() => setOpen(null)} />}
      <ModalHost m={m} setM={setM} P={P} /><PToasts toasts={P.toasts} onDrop={P.dropToast} />
      <Onboarding P={P} onNdo={setOpen} onGroup={() => setScope('all')} />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<SignalBoardApp />);
