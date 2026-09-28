/* @ds-bundle: {"format":4,"namespace":"NondominiumDesignSystem_c29c2b","components":[{"name":"BADGE_VARIANTS","sourcePath":"components/badge/Badge.jsx"},{"name":"Badge","sourcePath":"components/badge/Badge.jsx"},{"name":"Button","sourcePath":"components/button/Button.jsx"},{"name":"Card","sourcePath":"components/card/Card.jsx"},{"name":"StatusDot","sourcePath":"components/status/StatusDot.jsx"}],"sourceHashes":{"components/badge/Badge.jsx":"1f03c7929d33","components/button/Button.jsx":"9fbc083eb8a8","components/card/Card.jsx":"063484db8c69","components/status/StatusDot.jsx":"fb1abaf7c6f7","design_handoff_nondominium_ds/ui_kits/app/AgentProfile.kit.jsx":"bf1d1425ffc3","design_handoff_nondominium_ds/ui_kits/app/Browse.kit.jsx":"75d08cbd63ec","design_handoff_nondominium_ds/ui_kits/app/Connection.kit.jsx":"2f8b1556d52f","design_handoff_nondominium_ds/ui_kits/app/GovernanceModals.kit.jsx":"cda80e3a4918","design_handoff_nondominium_ds/ui_kits/app/GroupProto.kit.jsx":"30da485bcd6c","design_handoff_nondominium_ds/ui_kits/app/Modal.kit.jsx":"9c3e59676197","design_handoff_nondominium_ds/ui_kits/app/Navigator.kit.jsx":"50f656bebc41","design_handoff_nondominium_ds/ui_kits/app/NdoCreate.kit.jsx":"60d0acf77de3","design_handoff_nondominium_ds/ui_kits/app/NdoLayer1.kit.jsx":"b9b0f360a7de","design_handoff_nondominium_ds/ui_kits/app/NdoModals.kit.jsx":"1367f91e16ac","design_handoff_nondominium_ds/ui_kits/app/NdoTabs.kit.jsx":"deb8e88cf095","design_handoff_nondominium_ds/ui_kits/app/NdoView.kit.jsx":"3c1dda6186cb","design_handoff_nondominium_ds/ui_kits/app/Profile.kit.jsx":"9ba8379ea170","design_handoff_nondominium_ds/ui_kits/app/Shell.kit.jsx":"ad16ff95b521","design_handoff_nondominium_ds/ui_kits/app/data.kit.jsx":"df2f3d9ef21c","explorations/revamp/proto/A.jsx":"4d284b4b6d45","explorations/revamp/proto/B.jsx":"e6ea7ee4d722","explorations/revamp/proto/C.jsx":"2ad08b877db8","explorations/revamp/proto/D.jsx":"a5cbe924c8c0","explorations/revamp/proto/E.jsx":"d5469d9fca6e","explorations/revamp/proto/core.jsx":"91d8f9daa086","explorations/revamp/proto/ui.jsx":"7ad210324c4d","ui_kits/app/AgentProfile.jsx":"bf1d1425ffc3","ui_kits/app/Browse.jsx":"75d08cbd63ec","ui_kits/app/Connection.jsx":"2f8b1556d52f","ui_kits/app/GovernanceModals.jsx":"cda80e3a4918","ui_kits/app/GroupProto.jsx":"30da485bcd6c","ui_kits/app/Modal.jsx":"9c3e59676197","ui_kits/app/Navigator.jsx":"50f656bebc41","ui_kits/app/NdoCreate.jsx":"60d0acf77de3","ui_kits/app/NdoLayer1.jsx":"b9b0f360a7de","ui_kits/app/NdoModals.jsx":"1367f91e16ac","ui_kits/app/NdoTabs.jsx":"deb8e88cf095","ui_kits/app/NdoView.jsx":"3c1dda6186cb","ui_kits/app/Profile.jsx":"9ba8379ea170","ui_kits/app/Shell.jsx":"ad16ff95b521","ui_kits/app/data.jsx":"df2f3d9ef21c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NondominiumDesignSystem_c29c2b = window.NondominiumDesignSystem_c29c2b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/badge/Badge.jsx
try { (() => {
const c = t => `rgb(var(--ndo-${t}))`;
const fill = (bg, fg) => ({
  background: c(bg),
  color: c(fg)
});
const regime = fg => ({
  background: 'transparent',
  border: `1px dashed ${c(fg)}`,
  color: c(fg)
});
const rule = (bg, fg, edge) => ({
  background: c(bg),
  color: c(fg),
  borderRadius: '0 var(--ndo-radius-sm) var(--ndo-radius-sm) 0',
  borderLeft: `3px solid ${c(edge)}`,
  fontFamily: 'var(--ndo-font-mono)'
});
const BADGE_VARIANTS = {
  'lifecycle-ideation': fill('gray-100', 'gray-600'),
  'lifecycle-specification': fill('blue-50', 'blue-600'),
  'lifecycle-development': fill('indigo-100', 'indigo-700'),
  'lifecycle-prototype': fill('amber-100', 'amber-700'),
  'lifecycle-stable': fill('green-100', 'green-700'),
  'lifecycle-distributed': fill('teal-100', 'teal-700'),
  'lifecycle-active': fill('emerald-100', 'emerald-700'),
  'lifecycle-hibernating': fill('yellow-100', 'yellow-700'),
  'lifecycle-deprecated': fill('orange-100', 'orange-700'),
  'lifecycle-end-of-life': fill('red-100', 'red-700'),
  'nature-physical': fill('blue-100', 'blue-700'),
  'nature-digital': fill('purple-100', 'purple-700'),
  'nature-service': fill('orange-100', 'orange-700'),
  'nature-hybrid': fill('teal-100', 'teal-700'),
  'nature-information': fill('indigo-100', 'indigo-700'),
  'regime-nondominium': regime('blue-700'),
  'regime-commons': regime('cyan-700'),
  'regime-collective': regime('violet-700'),
  'regime-pool': regime('teal-700'),
  'regime-common-pool': regime('rose-700'),
  'regime-private': regime('gray-700'),
  'rule-access-requirement': rule('blue-50', 'blue-700', 'blue-700'),
  'rule-usage-limit': rule('amber-50', 'amber-800', 'amber-700'),
  'rule-transfer-condition': rule('violet-100', 'violet-700', 'violet-700'),
  'rule-maintenance-schedule': rule('orange-50', 'orange-700', 'orange-700'),
  'rivalry-rivalrous': fill('rose-100', 'rose-700'),
  'rivalry-non-rivalrous': fill('cyan-100', 'cyan-700'),
  'scope-project': fill('gray-100', 'gray-700'),
  'scope-network': fill('blue-100', 'blue-700'),
  'scope-public': fill('green-100', 'green-700'),
  'opstate-available': fill('green-50', 'green-700'),
  'opstate-reserved': fill('amber-50', 'amber-700'),
  'opstate-in-transit': fill('blue-50', 'blue-700'),
  'opstate-in-storage': fill('indigo-100', 'indigo-700'),
  'opstate-in-maintenance': fill('orange-100', 'orange-700'),
  'opstate-in-use': fill('teal-100', 'teal-700'),
  'opstate-pending-validation': fill('gray-100', 'gray-600'),
  'coming-soon': fill('amber-50', 'amber-600'),
  neutral: fill('gray-100', 'gray-600')
};
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: 'var(--ndo-spacing-0-5) var(--ndo-spacing-2)',
  borderRadius: 'var(--ndo-radius-sm)',
  fontFamily: 'var(--ndo-font-sans)',
  fontSize: 'var(--ndo-text-xs)',
  fontWeight: 'var(--ndo-weight-medium)',
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  border: '1px solid transparent'
};
function Badge({
  variant = 'neutral',
  label = '',
  children,
  style
}) {
  const v = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;
  const isOp = variant.startsWith('opstate-');
  const s = {
    ...base,
    ...v,
    ...(isOp ? {
      borderRadius: 'var(--ndo-radius-xl)',
      paddingLeft: 'var(--ndo-spacing-1-5)'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    style: s,
    "data-variant": variant
  }, isOp && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: '0.375rem',
      height: '0.375rem',
      borderRadius: '50%',
      marginRight: 'var(--ndo-spacing-1-5)',
      background: 'currentColor'
    }
  }), children ?? label);
}
Object.assign(__ds_scope, { BADGE_VARIANTS, Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badge/Badge.jsx", error: String((e && e.message) || e) }); }

// components/button/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  primary: {
    rest: {
      background: 'rgb(var(--ndo-blue-600))',
      color: '#fff',
      borderColor: 'rgb(var(--ndo-blue-600))'
    },
    hover: {
      background: 'rgb(var(--ndo-blue-700))',
      borderColor: 'rgb(var(--ndo-blue-700))'
    }
  },
  ghost: {
    rest: {
      background: 'transparent',
      color: 'rgb(var(--ndo-gray-700))',
      borderColor: 'rgb(var(--ndo-gray-300))'
    },
    hover: {
      background: 'rgb(var(--ndo-gray-50))',
      color: 'rgb(var(--ndo-gray-900))'
    }
  },
  destructive: {
    rest: {
      background: 'rgb(var(--ndo-red-700))',
      color: '#fff',
      borderColor: 'rgb(var(--ndo-red-700))'
    },
    hover: {
      background: 'rgb(var(--ndo-red-700) / 0.85)'
    }
  }
};
function Button({
  variant = 'primary',
  disabled = false,
  href = '',
  type = 'button',
  onClick,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--ndo-spacing-2)',
    padding: 'var(--ndo-spacing-1-5) var(--ndo-spacing-4)',
    borderRadius: 'var(--ndo-radius-md)',
    fontFamily: 'var(--ndo-font-sans)',
    fontSize: 'var(--ndo-text-sm)',
    fontWeight: 'var(--ndo-weight-medium)',
    lineHeight: 'var(--ndo-lh-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    textDecoration: 'none',
    transition: 'var(--ndo-transition-colors), var(--ndo-transition-shadow)',
    whiteSpace: 'nowrap',
    ...v.rest,
    ...(hover && !disabled ? v.hover : null),
    ...(disabled ? {
      opacity: 0.5,
      pointerEvents: 'none'
    } : null),
    ...style
  };
  const h = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  if (href) return /*#__PURE__*/React.createElement("a", _extends({
    href: disabled ? undefined : href,
    "aria-disabled": disabled || undefined,
    style: s,
    onClick: onClick
  }, h), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: s,
    onClick: onClick
  }, h), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/button/Button.jsx", error: String((e && e.message) || e) }); }

// components/card/Card.jsx
try { (() => {
function parseBadges(badges) {
  if (Array.isArray(badges)) return badges;
  if (!badges) return [];
  return badges.split(';').filter(Boolean).map(pair => {
    const i = pair.indexOf(':');
    return i === -1 ? {
      variant: 'neutral',
      label: pair
    } : {
      variant: pair.slice(0, i),
      label: pair.slice(i + 1)
    };
  });
}
function Card({
  name = '',
  description = '',
  hash = '',
  href = '#',
  badges = '',
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const list = parseBadges(badges);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      background: 'rgb(var(--ndo-color-card-bg))',
      border: '1px solid rgb(var(--ndo-gray-200))',
      borderRadius: 'var(--ndo-radius-lg)',
      padding: 'var(--ndo-spacing-4)',
      textDecoration: 'none',
      color: 'inherit',
      boxShadow: hover ? 'var(--ndo-shadow-md)' : 'var(--ndo-shadow-sm)',
      transition: 'var(--ndo-transition-shadow)',
      ...style
    }
  }, list.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--ndo-spacing-2)',
      marginBottom: 'var(--ndo-spacing-2)'
    }
  }, list.map(b => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: b.variant + b.label,
    variant: b.variant,
    label: b.label
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--ndo-font-sans)',
      fontSize: 'var(--ndo-text-lg)',
      fontWeight: 'var(--ndo-weight-semibold)',
      color: 'rgb(var(--ndo-gray-900))',
      lineHeight: 'var(--ndo-lh-lg)'
    }
  }, name), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--ndo-spacing-1) 0 0',
      fontSize: 'var(--ndo-text-sm)',
      color: 'rgb(var(--ndo-gray-600))',
      lineHeight: 'var(--ndo-lh-sm)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description), hash && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--ndo-spacing-1) 0 0',
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 'var(--ndo-text-xs)',
      color: 'rgb(var(--ndo-gray-400))'
    }
  }, "#", hash.slice(0, 12), "\u2026"));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/card/Card.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusDot.jsx
try { (() => {
const S = {
  active: {
    fg: 'emerald-700',
    dot: {
      background: 'rgb(var(--ndo-emerald-700))'
    }
  },
  inactive: {
    fg: 'gray-500',
    dot: {
      background: 'rgb(var(--ndo-gray-400))'
    }
  },
  pending: {
    fg: 'amber-600',
    dot: {
      background: 'rgb(var(--ndo-amber-600))'
    }
  },
  'coming-soon': {
    fg: 'amber-600',
    dot: {
      background: 'rgb(var(--ndo-amber-50))',
      border: '2px solid rgb(var(--ndo-amber-600))'
    }
  }
};
function StatusDot({
  status = 'pending',
  label = '',
  style
}) {
  const s = S[status] || S.pending;
  return /*#__PURE__*/React.createElement("span", {
    "aria-label": label || status,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--ndo-spacing-1-5)',
      fontFamily: 'var(--ndo-font-sans)',
      fontSize: 'var(--ndo-text-xs)',
      fontWeight: 'var(--ndo-weight-medium)',
      color: `rgb(var(--ndo-${s.fg}))`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      flexShrink: 0,
      ...s.dot
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      lineHeight: 1
    }
  }, label));
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusDot.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/AgentProfile.kit.jsx
try { (() => {
// DS prototype: src/routes/ui-kit/agent-profile (not yet in live app)
const card = {
  background: '#fff',
  border: `1px solid ${rgb('gray-200')}`,
  borderRadius: 8,
  padding: 16,
  boxShadow: 'var(--ndo-shadow-sm)'
};
const cardTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: rgb('gray-800')
};
const hintT = {
  fontSize: 12,
  color: rgb('gray-500'),
  margin: 0,
  lineHeight: 1.5
};
const twoCol = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  gap: 16,
  marginBottom: 16
};
function ProtoTabs({
  tabs,
  tab,
  setTab,
  activeBg = 'gray-100',
  pad = '6px 12px',
  gap = 4
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap
    }
  }, tabs.map(([id, l]) => {
    const a = tab === id;
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: id,
      onClick: () => setTab(id),
      hover: a ? null : {
        color: rgb('gray-800')
      },
      style: {
        padding: pad,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'inherit',
        border: `1px solid ${a ? rgb('gray-200') : 'transparent'}`,
        borderBottom: 'none',
        borderRadius: '4px 4px 0 0',
        background: a ? rgb(activeBg) : 'transparent',
        color: a ? rgb('gray-900') : rgb('gray-500'),
        cursor: 'pointer',
        transition: 'color 150ms, background-color 150ms'
      }
    }, l);
  }));
}
function AgentProfile({
  go
}) {
  const [tab, setTab] = React.useState('reputation');
  const [empty, setEmpty] = React.useState(false);
  const metrics = [['Timeliness', 0.82, 'emerald-700'], ['Quality', 0.85, 'emerald-700'], ['Reliability', 0.88, 'emerald-700'], ['Communication', 0.76, 'blue-600']];
  const pprs = [['CustodyTransfer', 12], ['ResourceCreation', 8], ['ValidationActivity', 7], ['TransportFulfillment', 6], ['MaintenanceFulfillment', 6], ['GoodFaithTransfer', 5], ['GovernanceCompliance', 3]];
  const commits = [['transport_custody', 'Community Solar Array', 'Due: 2026-05-15 · You → Bob K.', 'active'], ['maintenance', 'Open Hardware CNC Bed', 'Due: 2026-05-20 · Accepted commitment', 'pending'], ['validation', 'Distributed Sensor Design', 'Validator in 2-of-3 ResourceValidation', 'active']];
  const tiers = [['L1', ['gray-200', 'gray-700'], 'Lobby Profile', 'Stored in localStorage. Never written to DHT. Nickname: SoushAI. Email: not shared. Permissionless — exists before any DHT action.'], ['L2', ['blue-100', 'blue-700'], 'Group Profile', 'Per-group disclosure preferences in localStorage. Sensorica: anonymous. OVN: nickname + bio. No DHT entry required for group membership.'], ['L3', ['emerald-100', 'emerald-700'], 'Agent (DHT)', 'Person entry on the DHT — created on first economic action. Public: name, avatar. Private: legal name, email (capability-gated, 30-day max). Permanent: cannot be deleted.']];
  const affs = [['Sensorica', 'CoreAffiliate', ['amber-100', 'amber-700']], ['Open Value Network', 'ActiveAffiliate', ['emerald-100', 'emerald-700']], ['Fablab Montréal', 'CloseAffiliate', ['blue-50', 'blue-600']]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderBottom: `1px solid ${rgb('gray-200')}`,
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-500'),
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'lobby'
      });
    },
    style: {
      color: rgb('gray-500')
    }
  }, "\u2190 Lobby"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", null, "My Profile")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${rgb('blue-600')}, ${rgb('indigo-700')})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0
    }
  }, "SA"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 2px'
    }
  }, "SoushAI"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-500'),
      marginBottom: 8
    }
  }, "uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVaWx9\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-active",
    label: "Accountable Agent"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "nature-physical",
    label: "Transport"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-distributed",
    label: "ActiveAffiliate"
  }))), /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost"
  }, "Edit profile")), /*#__PURE__*/React.createElement(ProtoTabs, {
    tab: tab,
    setTab: setTab,
    tabs: [['reputation', 'Reputation'], ['identity', 'Identity'], ['commitments', 'Commitments'], ['affiliations', 'Affiliations']]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, tab === 'reputation' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: twoCol
  }, /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: cardTitle
  }, "Reputation Summary"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEmpty(!empty),
    style: {
      fontSize: 12,
      color: rgb('blue-600'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, "Toggle empty state")), !empty ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, "47"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "total interactions")), metrics.map(([l, s, c]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: rgb('gray-600'),
      width: '5.5rem',
      flexShrink: 0
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: '0.4rem',
      background: rgb('gray-200'),
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${s * 100}%`,
      background: rgb(c),
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontFamily: 'var(--ndo-font-mono)',
      color: rgb('gray-500'),
      width: '2.5rem',
      textAlign: 'right'
    }
  }, s.toFixed(2)))), /*#__PURE__*/React.createElement("p", {
    style: hintT
  }, "PPRs are stored as private entries on your source chain. Only you can derive this summary.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px 16px',
      border: `1px dashed ${rgb('gray-300')}`,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-500'),
      margin: 0
    }
  }, "No interactions yet. Complete your first economic process to start building your reputation."))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "PPR Distribution"), pprs.map(([t, n]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 8px',
      borderRadius: 4,
      background: rgb('gray-50'),
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: rgb('gray-700')
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-600'),
      background: rgb('gray-200'),
      padding: '1.6px 6.4px',
      borderRadius: 999
    }
  }, n))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...hintT,
      marginTop: 12,
      paddingTop: 8,
      borderTop: `1px solid ${rgb('gray-100')}`
    }
  }, "47 total \xB7 14 claim categories available"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: rgb('blue-50'),
      border: `1px solid ${rgb('blue-100')}`,
      borderRadius: 8,
      padding: 16,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: rgb('blue-800'),
      margin: '0 0 4px'
    }
  }, "\uD83C\uDF96 Eligible for role promotion"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: rgb('blue-700'),
      margin: 0
    }
  }, "You have 47 completed interactions and a governance_claims count of 10. You can request promotion to ", /*#__PURE__*/React.createElement("strong", null, "Primary Accountable Agent"), ". An existing PrimaryAccountable must approve your request.")), /*#__PURE__*/React.createElement(NDS.Button, null, "Request Promotion \u2192"))), tab === 'identity' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: twoCol
  }, /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Three-Tier Identity Model"), tiers.map(([lv, c, n, d]) => /*#__PURE__*/React.createElement("div", {
    key: lv,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: 8,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      flexShrink: 0,
      background: rgb(c[0]),
      color: rgb(c[1])
    }
  }, lv), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-700')
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500'),
      marginTop: 2,
      lineHeight: 1.5
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Devices & Keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      borderRadius: 4,
      background: rgb('blue-50'),
      border: `1px solid ${rgb('blue-100')}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12,
      fontWeight: 600,
      color: rgb('blue-800')
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCBB Desktop (Primary)"), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-active",
    label: "active"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('blue-700'),
      marginTop: 4
    }
  }, "uhCAk2vMp8X3n\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      borderRadius: 4,
      background: rgb('gray-50'),
      border: `1px solid ${rgb('gray-200')}`,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-700')
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF1 Mobile (Secondary)"), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-hibernating",
    label: "inactive"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-500'),
      marginTop: 4
    }
  }, "uhCAk9Rp7Yq2m\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: "coming-soon",
    label: "Flowsta identity linking (post-MVP)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Private Data (capability-gated)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
      gap: 8
    }
  }, [['Legal name', '••••••••• (private)'], ['Email', '••••••••• (private)'], ['Location', 'Montréal, QC (granted)']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: 8,
      background: rgb('gray-50'),
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, v)))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...hintT,
      marginTop: 12
    }
  }, "Private entries stored only on your source chain. Shared via capability grants with 30-day maximum expiry."))), tab === 'commitments' && /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Active Commitments (3)"), commits.map(([a, r, d, s]) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: 12,
      border: `1px solid ${rgb('gray-200')}`,
      borderRadius: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "nature-physical",
    label: a
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, r), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500'),
      marginTop: 2
    }
  }, d)), /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: s,
    label: s === 'active' ? 'In progress' : 'Pending'
  })))), tab === 'affiliations' && /*#__PURE__*/React.createElement("div", {
    style: twoCol
  }, /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Network Affiliations"), affs.map(([n, s, c], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: i < affs.length - 1 ? `1px solid ${rgb('gray-100')}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-800')
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '1.6px 6.4px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      background: rgb(c[0]),
      color: rgb(c[1])
    }
  }, s))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...hintT,
      marginTop: 12
    }
  }, "AffiliationState is derived \u2014 not stored. Computed from PPR activity, recency, and contribution history.")), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Affiliation Record"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      background: rgb('emerald-100', 0.4),
      border: `1px solid ${rgb('emerald-100')}`,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('emerald-700')
    }
  }, "\u2713 Sensorica \u2014 Terms signed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-600'),
      marginTop: 4
    }
  }, "Nondominium & Custodian agreement \xB7 Benefit Redistribution Algorithm \xB7 ToP v1.2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontFamily: 'var(--ndo-font-mono)',
      color: rgb('gray-500'),
      marginTop: 4
    }
  }, "Signed: 2025-11-14")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: "coming-soon",
    label: "AffiliationRecord entry (post-MVP)"
  }))))));
}
Object.assign(window, {
  AgentProfile,
  ProtoTabs,
  protoCard: card,
  protoCardTitle: cardTitle,
  protoHint: hintT
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/AgentProfile.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/Browse.kit.jsx
try { (() => {
const STAGES = ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'];
const NATURES = ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'];
const REGIMES = ['Private', 'Commons', 'Collective', 'Pool', 'CommonPool', 'Public', 'Nondominium'];
const chip = (bg, fg, bd) => ({
  background: rgb(bg),
  color: rgb(fg),
  borderColor: rgb(bd)
});
const STAGE_C = {
  Ideation: chip('gray-100', 'gray-600', 'gray-300'),
  Specification: chip('blue-50', 'blue-600', 'blue-300'),
  Development: chip('indigo-100', 'indigo-700', 'indigo-300'),
  Prototype: chip('amber-100', 'amber-700', 'amber-300'),
  Stable: chip('green-100', 'green-700', 'green-300'),
  Distributed: chip('teal-100', 'teal-700', 'teal-300'),
  Active: chip('emerald-100', 'emerald-700', 'emerald-300'),
  Hibernating: chip('yellow-100', 'yellow-700', 'yellow-300'),
  Deprecated: chip('orange-100', 'orange-700', 'orange-300'),
  EndOfLife: chip('red-100', 'red-700', 'red-300')
};
const NATURE_C = {
  Physical: chip('blue-100', 'blue-700', 'blue-300'),
  Digital: chip('purple-100', 'purple-700', 'purple-300'),
  Service: chip('orange-100', 'orange-700', 'orange-300'),
  Hybrid: chip('teal-100', 'teal-700', 'teal-300'),
  Information: chip('indigo-100', 'indigo-700', 'indigo-300')
};
const REGIME_C = {
  Private: chip('gray-100', 'gray-600', 'gray-300'),
  Commons: chip('cyan-100', 'cyan-700', 'cyan-300'),
  Collective: chip('violet-100', 'violet-700', 'violet-300'),
  Pool: chip('amber-100', 'amber-700', 'amber-300'),
  CommonPool: chip('rose-100', 'rose-700', 'rose-300'),
  Public: chip('sky-100', 'sky-700', 'sky-300'),
  Nondominium: chip('emerald-100', 'emerald-700', 'emerald-300')
};
function FilterRow({
  label,
  items,
  colors,
  active,
  toggle,
  dashed,
  first
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 6,
      marginTop: first ? 0 : 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: 4,
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-500'),
      textTransform: 'uppercase'
    }
  }, label, ":"), items.map(s => {
    const on = active.includes(s);
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: s,
      onClick: () => toggle(s),
      hover: on ? null : {
        opacity: 1
      },
      style: {
        ...colors[s],
        cursor: 'pointer',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: dashed ? 'dashed' : 'solid',
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'opacity 150ms',
        opacity: on ? 1 : 0.6,
        boxShadow: on ? `0 0 0 1px #fff, 0 0 0 3px currentColor` : 'none'
      }
    }, s);
  }));
}
function NdoBrowser({
  ndos,
  go,
  isLoading,
  errorMessage,
  onRetry,
  showOnboarding,
  hasGroups = true,
  onCreateGroup,
  onJoinGroup
}) {
  const [f, setF] = React.useState({
    stages: [],
    natures: [],
    regimes: []
  });
  const tog = k => v => setF(p => ({
    ...p,
    [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v]
  }));
  const has = f.stages.length || f.natures.length || f.regimes.length;
  const list = ndos.filter(d => (!f.stages.length || f.stages.includes(d.lifecycle_stage)) && (!f.natures.length || f.natures.includes(d.resource_nature)) && (!f.regimes.length || f.regimes.includes(d.property_regime)));
  let content;
  if (isLoading) content = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      marginRight: 8,
      display: 'inline-block',
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: `2px solid ${rgb('gray-300')}`,
      borderTopColor: rgb('blue-600'),
      animation: 'ndoSpin 1s linear infinite'
    }
  }), "Loading NDOs\u2026");else if (list.length === 0 && !errorMessage) {
    if (showOnboarding && !hasGroups) content = /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 8,
        border: `1px dashed ${rgb('blue-300')}`,
        background: rgb('blue-50'),
        padding: 24,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        fontWeight: 500,
        color: rgb('gray-800')
      }
    }, "Create or join a group to see NDOs"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        fontSize: 14,
        color: rgb('gray-500')
      }
    }, "NDOs are scoped to groups. Start by creating a group or pasting an invite link."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        justifyContent: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: onCreateGroup
    }, "Create group"), /*#__PURE__*/React.createElement(Hoverable, {
      onClick: onJoinGroup,
      hover: {
        background: rgb('blue-100')
      },
      style: {
        borderRadius: 4,
        border: `1px solid ${rgb('blue-300')}`,
        background: 'transparent',
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 500,
        color: rgb('blue-700'),
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "Join group")));else content = /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        color: rgb('gray-500')
      }
    }, has ? 'No NDOs match the selected filters.' : 'No NDOs yet. Create one inside a group to see it here.');
  } else content = /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))'
    }
  }, list.map(d => /*#__PURE__*/React.createElement("li", {
    key: d.hash
  }, /*#__PURE__*/React.createElement(NDS.Card, {
    name: d.name,
    description: d.description,
    hash: d.hash,
    badges: ndoBadges(d),
    onClick: e => {
      e.preventDefault();
      go({
        view: 'ndo',
        hash: d.hash
      });
    }
  }))));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderRadius: 8,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      boxShadow: 'var(--ndo-shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement(FilterRow, {
    first: true,
    label: "Stage",
    items: STAGES,
    colors: STAGE_C,
    active: f.stages,
    toggle: tog('stages')
  }), /*#__PURE__*/React.createElement(FilterRow, {
    label: "Nature",
    items: NATURES,
    colors: NATURE_C,
    active: f.natures,
    toggle: tog('natures')
  }), /*#__PURE__*/React.createElement(FilterRow, {
    dashed: true,
    label: "Regime",
    items: REGIMES,
    colors: REGIME_C,
    active: f.regimes,
    toggle: tog('regimes')
  }), has ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setF({
      stages: [],
      natures: [],
      regimes: []
    }),
    style: {
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      fontSize: 12,
      color: rgb('gray-400'),
      textDecoration: 'underline'
    }
  }, "Clear filters")) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, "NDO browser", has ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      fontSize: 14,
      fontWeight: 400,
      color: rgb('gray-400')
    }
  }, "(", list.length, " results)") : null), isLoading && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Loading\u2026")), errorMessage && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      borderRadius: 4,
      border: `1px solid ${rgb('red-200')}`,
      background: rgb('red-50'),
      padding: 8,
      fontSize: 14,
      color: rgb('red-700')
    }
  }, /*#__PURE__*/React.createElement("span", null, errorMessage), onRetry && /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onRetry,
    hover: {
      background: rgb('red-100')
    },
    style: {
      flexShrink: 0,
      borderRadius: 4,
      border: `1px solid ${rgb('red-300')}`,
      background: '#fff',
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('red-700'),
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, "Retry")), /*#__PURE__*/React.createElement("div", {
    "aria-busy": !!isLoading
  }, content)));
}
function LobbyView({
  go,
  ndos,
  hasProfile = true,
  lobbyState = 'default',
  onOpenProfile,
  onCreateGroup,
  onJoinGroup,
  onRetry
}) {
  const noGroups = lobbyState === 'no-groups';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100%',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ProfileBar, {
    hasProfile: hasProfile,
    onOpenProfile: onOpenProfile
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, "Browse NDOs"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      color: rgb('gray-600')
    }
  }, "All NDOs across your groups."), hasProfile && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Agent: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, "Tiberius"))), /*#__PURE__*/React.createElement(NdoBrowser, {
    ndos: noGroups || lobbyState === 'error' ? [] : ndos,
    go: go,
    isLoading: lobbyState === 'loading',
    errorMessage: lobbyState === 'error' ? 'Failed to load NDOs from the Lobby.' : null,
    onRetry: onRetry,
    showOnboarding: true,
    hasGroups: !noGroups,
    onCreateGroup: onCreateGroup,
    onJoinGroup: onJoinGroup
  })));
}
function MemberList({
  members
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "Members"), members.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-300')}`,
      padding: 16,
      fontSize: 14,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "No members yet.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, members.map(m => /*#__PURE__*/React.createElement("li", {
    key: m.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: '8px 12px',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, m.name), m.role && /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 9999,
      background: rgb('gray-100'),
      padding: '2px 8px',
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, m.role)))));
}

// group/SoftLinkList + group/WorkLogFeed — exist in ui/ but are not mounted by GroupView yet
function SoftLinkList({
  softlinks
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "Soft links"), softlinks.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-400')}`,
      padding: 16,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No soft links (stub). Planning-only links use dashed borders per lobby conventions.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, softlinks.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.id,
    style: {
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-400')}`,
      padding: 12,
      fontSize: 14
    }
  }, s.label))));
}
function WorkLogFeed({
  worklogs
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "Work log"), worklogs.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-400')}`,
      padding: 16,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No work log entries (stub).") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, worklogs.map(w => /*#__PURE__*/React.createElement("li", {
    key: w.id,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 12,
      fontSize: 14
    }
  }, w.title))));
}
function GroupView({
  id,
  go,
  ndos,
  onCreate,
  errorMessage
}) {
  const g = GROUPS.find(x => x.id === id) || GROUPS[0];
  const [copied, setCopied] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, g.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 14,
      color: rgb('gray-400')
    }
  }, g.id, "-7f3a9c2e-b41d")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    hover: {
      background: rgb('gray-50')
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb('gray-300')}`,
      background: 'transparent',
      padding: '8px 12px',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-600'),
      fontFamily: 'inherit'
    }
  }, copied ? 'Invite link copied!' : 'Copy invite link'), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onCreate,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      border: 0,
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '8px 16px',
      fontSize: 14,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1
    }
  }, "+"), " Create NDO"))), errorMessage && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      borderRadius: 4,
      border: `1px solid ${rgb('red-200')}`,
      background: rgb('red-50'),
      padding: 8,
      fontSize: 14,
      color: rgb('red-700')
    }
  }, errorMessage), /*#__PURE__*/React.createElement(NdoBrowser, {
    ndos: ndos.filter(d => d.group === g.id),
    go: go
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(MemberList, {
    members: MEMBERS
  })));
}
Object.assign(window, {
  NdoBrowser,
  LobbyView,
  GroupView,
  MemberList,
  SoftLinkList,
  WorkLogFeed
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/Browse.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/Connection.kit.jsx
try { (() => {
// HolochainProvider states + routes/ndo/new placeholder
const center = {
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff'
};
const HINTS = ['Wait until the terminal shows "[launch-happ] Agent N ready" for each agent, then click Retry in the UI.', 'Large happ bundles can take a few minutes to install on first start — keep the terminal open.', 'If startup fails, stop the process and run `bun run network` again (runs `hc sandbox clean` first).'];
function ConnectingScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: center
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 60,
      animation: 'ndoPulse 2s cubic-bezier(0.4,0,0.6,1) infinite'
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 18,
      color: rgb('gray-600')
    }
  }, "Connecting to Holochain...")));
}
function ConnectionFailedScreen({
  onRetry
}) {
  const msg = 'Unable to connect to Holochain — no launcher environment and no dev connection info found.';
  return /*#__PURE__*/React.createElement("div", {
    style: center
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '28rem',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 60
    }
  }, "\u274C"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 20,
      fontWeight: 600,
      color: rgb('red-600')
    }
  }, "Connection Failed"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      color: rgb('gray-600')
    }
  }, "Unable to connect to Holochain conductor: ", msg), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: '0 0 16px',
      paddingLeft: 20,
      textAlign: 'left',
      fontSize: 14,
      color: rgb('gray-600'),
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, HINTS.map(h => /*#__PURE__*/React.createElement("li", {
    key: h
  }, h))), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onRetry,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '8px 16px',
      color: '#fff',
      border: 0,
      cursor: 'pointer',
      fontSize: 16,
      fontFamily: 'inherit',
      transition: 'background-color 150ms'
    }
  }, "Retry Connection"), /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 16,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Connection Details"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      borderRadius: 4,
      background: rgb('gray-100'),
      padding: 12,
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "URL:"), " (not connected)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Mode:"), " unknown"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", msg)))));
}
function NotConnectedScreen({
  onConnect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: center
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 60
    }
  }, "\uD83D\uDD0C"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 18,
      color: rgb('gray-600')
    }
  }, "Holochain not connected.", /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onConnect,
    hover: {
      background: 'rgb(21 128 61)'
    },
    style: {
      marginLeft: 8,
      borderRadius: 4,
      background: 'rgb(22 163 74)',
      padding: '4px 12px',
      color: '#fff',
      border: 0,
      cursor: 'pointer',
      fontSize: 16,
      fontFamily: 'inherit'
    }
  }, "Connect"))));
}
function NewNdoPlaceholder({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: '32rem'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, "New NDO"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, "NDOs are created from within a ", /*#__PURE__*/React.createElement("strong", null, "Group"), ". Groups are the organizational context for NDO creation in Nondominium."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      borderRadius: 8,
      border: `1px dashed ${rgb('gray-300')}`,
      background: rgb('gray-50'),
      padding: '32px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Please create or join a Group from the Lobby first, then use the ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('blue-600')
    }
  }, "+ Create NDO"), " button inside the group."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    onClick: () => go({
      view: 'lobby'
    })
  }, "Go to Lobby"))));
}
Object.assign(window, {
  ConnectingScreen,
  ConnectionFailedScreen,
  NotConnectedScreen,
  NewNdoPlaceholder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/Connection.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/GovernanceModals.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Live-app governance/activity modals: RuleEditorModal, CommitmentCreateForm, EconomicEventCreateForm
// Constraint messages copied from crates/shared/src/constraints.rs
const VF_ACTIONS = ['Transfer', 'Move', 'Use', 'Consume', 'Produce', 'Work', 'Modify', 'Combine', 'Separate', 'Raise', 'Lower', 'Cite', 'Accept', 'InitialTransfer', 'AccessForUse', 'TransferCustody'];
const ME_B64 = 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa';
function checkAction(ndo, action) {
  const v = [];
  if (action === 'Move' && ['Digital', 'Information'].includes(ndo.resource_nature)) v.push({
    rule_id: 'no_transport_for_non_physical_nature',
    message: `Transport (Move) does not apply to a ${ndo.resource_nature} resource.`,
    severity: 'Soft'
  });
  if (ndo.property_regime === 'Nondominium' && ['Transfer', 'Consume', 'Lower'].includes(action)) v.push({
    rule_id: 'nondominium_no_unilateral_capture',
    message: `${action} is not permitted on a Nondominium resource (REQ-RES-03).`,
    severity: 'Hard'
  });
  return v;
}
function checkRule(ndo, kind, f) {
  if (kind === 'TransferCondition' && f.transfer_type === 'Ownership' && ['Nondominium', 'Commons', 'Pool', 'CommonPool', 'Public'].includes(ndo.property_regime)) return [{
    rule_id: 'ownership_transfer_not_permitted_by_regime',
    message: `${ndo.property_regime} does not permit ownership-transfer rules.`,
    severity: ndo.property_regime === 'Nondominium' ? 'Hard' : 'Soft'
  }];
  if (kind === 'AccessRequirement' && f.accessibility === 'Gated' && ndo.property_regime === 'Nondominium') return [{
    rule_id: 'gated_access_contradicts_permissionless_regime',
    message: "Nondominium resources must remain permissionless (REQ-RES-01); 'Gated' access creates a discretionary chokepoint.",
    severity: 'Soft'
  }];
  return [];
}
function Violations({
  list
}) {
  const box = (bd, bg, fg) => ({
    listStyle: 'none',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    borderRadius: 4,
    border: `1px solid ${bd}`,
    background: rgb(bg),
    padding: 12,
    fontSize: 14,
    color: rgb(fg)
  });
  const hard = list.filter(v => v.severity === 'Hard'),
    soft = list.filter(v => v.severity === 'Soft');
  return /*#__PURE__*/React.createElement(React.Fragment, null, hard.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: box(rgb('red-200'), 'red-50', 'red-700')
  }, hard.map(v => /*#__PURE__*/React.createElement("li", {
    key: v.rule_id
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "[", v.rule_id, "]"), " ", v.message))), soft.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: box('rgb(253 230 138)', 'amber-50', 'amber-800')
  }, soft.map(v => /*#__PURE__*/React.createElement("li", {
    key: v.rule_id
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "[", v.rule_id, "]"), " ", v.message))));
}
function RuleEditorModal({
  ndo,
  specName,
  onClose,
  onCreate
}) {
  const [kind, setKind] = React.useState('AccessRequirement');
  const [f, setF] = React.useState({
    accessibility: 'Free',
    required_role: '',
    min_affiliation: '',
    max_duration_hours: '',
    max_quantity_per_period: '',
    period_days: '',
    transfer_type: 'Custody',
    requires_validation: false,
    validator_role: '',
    interval_days: '30',
    maint_role: '',
    enforced_by: ''
  });
  const b = k => ({
    value: f[k],
    onChange: e => setF({
      ...f,
      [k]: e.target.value
    })
  });
  const viol = checkRule(ndo, kind, f);
  const hard = viol.some(v => v.severity === 'Hard');
  const payload = () => kind === 'AccessRequirement' ? {
    accessibility: f.accessibility,
    required_role: f.required_role,
    min_affiliation: f.min_affiliation
  } : kind === 'UsageLimit' ? {
    max_duration_hours: f.max_duration_hours,
    max_quantity_per_period: f.max_quantity_per_period,
    period_days: f.period_days
  } : kind === 'TransferCondition' ? {
    transfer_type: f.transfer_type,
    requires_validation: String(f.requires_validation),
    validator_role: f.validator_role
  } : {
    interval_days: f.interval_days,
    required_role: f.maint_role
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "New governance rule",
    subtitle: "Typed RuleData with live constraint dry-run (Hard blocks submit).",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: hard,
      onClick: () => onCreate({
        kind,
        spec: specName,
        payload: payload(),
        enforced_by: f.enforced_by
      })
    }, "Create rule"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Rule type"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: kind,
    onChange: e => setKind(e.target.value)
  }, ['AccessRequirement', 'UsageLimit', 'TransferCondition', 'MaintenanceSchedule'].map(k => /*#__PURE__*/React.createElement("option", {
    key: k
  }, k)))), kind === 'AccessRequirement' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Accessibility"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('accessibility')), /*#__PURE__*/React.createElement("option", null, "Free"), /*#__PURE__*/React.createElement("option", null, "Credentialed"), /*#__PURE__*/React.createElement("option", null, "Gated"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Required role"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('required_role')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Min affiliation"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('min_affiliation'))))), kind === 'UsageLimit' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Max duration (hours)"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "number"
  }, b('max_duration_hours')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Max quantity / period"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "number"
  }, b('max_quantity_per_period')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Period (days)"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "number"
  }, b('period_days'))))), kind === 'TransferCondition' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Transfer type"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('transfer_type')), /*#__PURE__*/React.createElement("option", null, "Ownership"), /*#__PURE__*/React.createElement("option", null, "Custody"), /*#__PURE__*/React.createElement("option", null, "UseRights"), /*#__PURE__*/React.createElement("option", null, "Benefit"))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: f.requires_validation,
    onChange: () => setF({
      ...f,
      requires_validation: !f.requires_validation
    }),
    style: {
      margin: 0
    }
  }), "Requires validation"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Validator role"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('validator_role'))))), kind === 'MaintenanceSchedule' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Interval (days)"), /*#__PURE__*/React.createElement(Input, _extends({
    type: "number"
  }, b('interval_days')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Required role"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('maint_role'))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Enforced by"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('enforced_by')))), /*#__PURE__*/React.createElement(Violations, {
    list: viol
  }));
}
function CommitmentCreateForm({
  ndo,
  onClose,
  onCreate
}) {
  const [action, setAction] = React.useState('Use');
  const [provider, setProvider] = React.useState(ME_B64);
  const [due, setDue] = React.useState('');
  const [note, setNote] = React.useState('');
  const [err, setErr] = React.useState('');
  const viol = checkAction(ndo, action);
  const hard = viol.some(v => v.severity === 'Hard');
  const submit = () => {
    if (!provider || !due) return setErr('Provider and due date are required.');
    onCreate({
      action,
      due: new Date(due).toLocaleString(),
      note
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Propose commitment",
    subtitle: /*#__PURE__*/React.createElement(React.Fragment, null, "Dry-runs ", /*#__PURE__*/React.createElement("code", {
      style: {
        fontSize: 12
      }
    }, "check_action_constraints"), " before write."),
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: hard,
      onClick: submit
    }, "Propose"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Action"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: action,
    onChange: e => setAction(e.target.value)
  }, VF_ACTIONS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a
  }, a)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Provider (agent pubkey b64)"), /*#__PURE__*/React.createElement(Input, {
    value: provider,
    onChange: e => setProvider(e.target.value),
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Due date"), /*#__PURE__*/React.createElement(Input, {
    type: "datetime-local",
    value: due,
    onChange: e => setDue(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Note"), /*#__PURE__*/React.createElement(Input, {
    as: "textarea",
    rows: 2,
    light: true,
    value: note,
    onChange: e => setNote(e.target.value)
  })), /*#__PURE__*/React.createElement(Violations, {
    list: viol
  }), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
function EconomicEventCreateForm({
  ndo,
  commitments,
  onClose,
  onCreate
}) {
  const [fromC, setFromC] = React.useState('');
  const [action, setAction] = React.useState('Use');
  const [provider, setProvider] = React.useState(ME_B64);
  const [receiver, setReceiver] = React.useState(ME_B64);
  const [res, setRes] = React.useState('');
  const [qty, setQty] = React.useState('1');
  const [note, setNote] = React.useState('');
  const [err, setErr] = React.useState('');
  const viol = checkAction(ndo, action);
  const hard = viol.some(v => v.severity === 'Hard');
  const mono = {
    fontFamily: 'var(--ndo-font-mono)',
    fontSize: 12
  };
  const submit = () => {
    if (!provider || !receiver || !res) return setErr('Provider, receiver, and resource hash are required.');
    onCreate({
      action,
      qty: Number(qty) || 1,
      time: new Date().toLocaleString(),
      note
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Log economic event",
    subtitle: /*#__PURE__*/React.createElement(React.Fragment, null, "Dry-runs ", /*#__PURE__*/React.createElement("code", {
      style: {
        fontSize: 12
      }
    }, "check_action_constraints"), " before write."),
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: hard,
      onClick: submit
    }, "Log event"))
  }, commitments.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Create from commitment"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: fromC,
    onChange: e => {
      setFromC(e.target.value);
      const c = commitments[e.target.value];
      if (c) setAction(c.action);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 none \u2014"), commitments.map((c, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, c.action, " \xB7 due ", c.due)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Action"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: action,
    onChange: e => setAction(e.target.value)
  }, VF_ACTIONS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a
  }, a)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Provider b64"), /*#__PURE__*/React.createElement(Input, {
    value: provider,
    onChange: e => setProvider(e.target.value),
    style: mono
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Receiver b64"), /*#__PURE__*/React.createElement(Input, {
    value: receiver,
    onChange: e => setReceiver(e.target.value),
    style: mono
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Resource action hash b64"), /*#__PURE__*/React.createElement(Input, {
    value: res,
    onChange: e => setRes(e.target.value),
    style: mono
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Quantity"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: qty,
    onChange: e => setQty(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Note"), /*#__PURE__*/React.createElement(Input, {
    as: "textarea",
    rows: 2,
    light: true,
    value: note,
    onChange: e => setNote(e.target.value)
  })), /*#__PURE__*/React.createElement(Violations, {
    list: viol
  }), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
Object.assign(window, {
  RuleEditorModal,
  CommitmentCreateForm,
  EconomicEventCreateForm,
  Violations,
  VF_ACTIONS,
  ME_B64
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/GovernanceModals.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/GroupProto.kit.jsx
try { (() => {
// DS prototype: src/routes/ui-kit/group — richer group view (identity banner, pill filters, members panel)
function GroupProto({
  go
}) {
  const [banner, setBanner] = React.useState(true);
  const [empty, setEmpty] = React.useState(false);
  const [active, setActive] = React.useState([]);
  const tog = c => setActive(a => a.includes(c) ? a.filter(x => x !== c) : [...a, c]);
  const ndos = NDOS.slice(0, 4).map((d, i) => ({
    ...d,
    description: ['Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective.', 'Community-maintained CNC router available for approved fabrication tasks. Requires Transport role.', 'Open-source IoT sensor design file for environmental monitoring in urban commons.', 'Shared laser cutter maintained by the Open Hardware collective. Validation pending.'][i]
  }));
  const Chip = ({
    c
  }) => {
    const on = active.includes(c);
    return /*#__PURE__*/React.createElement(Hoverable, {
      onClick: () => tog(c),
      hover: on ? null : {
        borderColor: rgb('gray-400')
      },
      style: {
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        border: `1px solid ${on ? rgb('blue-600') : rgb('gray-300')}`,
        background: on ? rgb('blue-50') : '#fff',
        color: on ? rgb('blue-700') : rgb('gray-700'),
        cursor: 'pointer',
        transition: 'background-color 150ms, color 150ms, border-color 150ms'
      }
    }, c);
  };
  const Lbl = ({
    children
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-500')
    }
  }, children);
  const Div = () => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 20,
      background: rgb('gray-300')
    }
  });
  const members = [['AL', 'Alice M.', 'Primary Accountable'], ['BK', 'Bob K.', 'Transport'], ['CR', 'Carol R.', 'Accountable Agent']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 4px'
    }
  }, "Sensorica"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, /*#__PURE__*/React.createElement("span", null, "7 members"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "4 NDOs"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: "active",
    label: "Active"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost"
  }, "\uD83C\uDF74 Fork NDO"), /*#__PURE__*/React.createElement(NDS.Button, {
    onClick: () => go({
      view: 'create',
      group: 'sensorica'
    })
  }, "+ Create NDO"))), banner && /*#__PURE__*/React.createElement("div", {
    style: {
      background: rgb('amber-50'),
      border: `1px solid ${rgb('amber-100')}`,
      borderRadius: 8,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('amber-800')
    }
  }, "\uD83D\uDC64 How do you want to appear in ", /*#__PURE__*/React.createElement("strong", null, "Sensorica"), "? Your Lobby profile is set but not linked to this group yet. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'group-proto',
        modal: 'groupProfile'
      });
    },
    style: {
      color: rgb('amber-800'),
      fontWeight: 600
    }
  }, "Set group profile \u2192")), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setBanner(false),
    hover: {
      background: rgb('amber-100')
    },
    style: {
      fontSize: 12,
      color: rgb('amber-700'),
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '3px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      fontFamily: 'inherit'
    }
  }, "Dismiss")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, "Lifecycle"), ['Active', 'Stable', 'Distributed', 'Prototype'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    c: c
  })), /*#__PURE__*/React.createElement(Div, null), /*#__PURE__*/React.createElement(Lbl, null, "Nature"), ['Physical', 'Digital'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    c: c
  })), /*#__PURE__*/React.createElement(Div, null), /*#__PURE__*/React.createElement(Lbl, null, "Regime"), ['Nondominium', 'Commons', 'Pool'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    c: c
  })), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setEmpty(!empty),
    hover: {
      color: rgb('gray-600')
    },
    style: {
      marginLeft: 'auto',
      fontSize: 12,
      color: rgb('gray-400'),
      background: 'none',
      border: `1px dashed ${rgb('gray-300')}`,
      borderRadius: 4,
      padding: '3px 8px',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, empty ? 'Show NDOs' : 'Show empty state')), !empty ? /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))'
    }
  }, ndos.map(d => {
    const bs = ndoBadges(d);
    return /*#__PURE__*/React.createElement("li", {
      key: d.hash
    }, /*#__PURE__*/React.createElement(NDS.Card, {
      name: d.name,
      description: d.description,
      hash: d.hash,
      badges: [bs[0], bs[2], bs[1]],
      onClick: e => {
        e.preventDefault();
        go({
          view: 'ndo',
          hash: d.hash
        });
      }
    }));
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: `2px dashed ${rgb('gray-300')}`,
      borderRadius: 12,
      padding: '48px 32px',
      textAlign: 'center',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 12
    }
  }, "\uD83D\uDCE6"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-700'),
      margin: '0 0 4px'
    }
  }, "No NDOs in this group yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-500'),
      margin: '0 0 20px'
    }
  }, "NDOs created in this group will appear here. Start by creating your first Nondominium Object."), /*#__PURE__*/React.createElement(NDS.Button, {
    onClick: () => go({
      view: 'create',
      group: 'sensorica'
    })
  }, "+ Create first NDO"))), /*#__PURE__*/React.createElement("aside", {
    style: {
      width: '13rem',
      flexShrink: 0,
      alignSelf: 'flex-end',
      position: 'sticky',
      bottom: 0,
      background: '#fff',
      borderTop: `1px solid ${rgb('gray-200')}`,
      borderLeft: `1px solid ${rgb('gray-200')}`,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: rgb('gray-400'),
      marginBottom: 2
    }
  }, "Members (7)"), members.map(([i, n, r]) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: rgb('blue-100'),
      color: rgb('blue-700'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 700,
      flexShrink: 0
    }
  }, i), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-800')
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: rgb('gray-500')
    }
  }, r)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      opacity: 0.55
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: rgb('gray-200'),
      color: rgb('gray-500'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 700
    }
  }, "+4"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "4 more members")), /*#__PURE__*/React.createElement(Hoverable, {
    hover: {
      background: rgb('blue-50')
    },
    style: {
      width: '100%',
      padding: '5px 8px',
      borderRadius: 4,
      fontSize: 12,
      color: rgb('blue-600'),
      background: 'transparent',
      border: `1px dashed ${rgb('blue-600', 0.5)}`,
      cursor: 'pointer',
      marginTop: 4,
      fontFamily: 'inherit',
      transition: 'background-color 150ms'
    }
  }, "\uD83D\uDD17 Copy invite link")));
}
Object.assign(window, {
  GroupProto
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/GroupProto.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/Modal.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared modal + form primitives mirroring the Tailwind classes used across nondominium/ui modals.
function Modal({
  title,
  subtitle,
  width = 'md',
  onClose,
  footer,
  children,
  bodyScroll
}) {
  const w = {
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem'
  }[width];
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgb(0 0 0 / 0.4)',
      backdropFilter: 'blur(4px)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: w,
      borderRadius: 12,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      ...(bodyScroll ? {
        maxHeight: '70vh',
        overflowY: 'auto'
      } : null)
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      borderTop: `1px solid ${rgb('gray-100')}`,
      padding: '16px 24px'
    }
  }, footer)));
}
function TextBtn({
  onClick,
  children,
  small
}) {
  return /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onClick,
    hover: {
      background: rgb('gray-100')
    },
    style: {
      cursor: 'pointer',
      border: 0,
      borderRadius: 4,
      background: 'transparent',
      padding: small ? '4px 8px' : '8px 16px',
      fontSize: small ? 12 : 14,
      fontFamily: 'inherit',
      color: rgb('gray-600')
    }
  }, children);
}
function PrimaryBtn({
  onClick,
  children,
  disabled,
  small
}) {
  return /*#__PURE__*/React.createElement(Hoverable, {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    hover: disabled ? null : {
      background: rgb('blue-700')
    },
    style: {
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 0,
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: small ? '6px 12px' : '8px 16px',
      fontSize: small ? 12 : 14,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: '#fff',
      opacity: disabled ? 0.5 : 1
    }
  }, children);
}
function OutlineBtn({
  onClick,
  children,
  tone = 'gray',
  size = 'xs'
}) {
  const t = tone === 'blue' ? ['blue-300', 'blue-600', 'blue-50'] : tone === 'red' ? ['red-300', 'red-700', 'red-50'] : ['gray-300', 'gray-600', 'gray-50'];
  return /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onClick,
    hover: {
      background: rgb(t[2])
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb(t[0])}`,
      background: 'transparent',
      padding: size === 'sm' ? '8px 12px' : '6px 12px',
      fontSize: size === 'sm' ? 14 : 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: rgb(t[1])
    }
  }, children);
}
function Label({
  htmlFor,
  children,
  req,
  opt,
  muted
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      marginBottom: 4,
      display: 'block',
      fontSize: 14,
      fontWeight: muted ? 400 : 500,
      color: muted ? rgb('gray-600') : rgb('gray-700')
    }
  }, children, req && /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('red-600')
    }
  }, " *"), opt && /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400'),
      fontWeight: 400
    }
  }, " (optional)"));
}
function Input({
  as = 'input',
  light,
  dense,
  ...p
}) {
  const [f, setF] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({}, p, {
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      borderRadius: 4,
      border: `1px solid ${f ? 'rgb(59 130 246)' : light ? rgb('gray-200') : rgb('gray-300')}`,
      padding: dense ? '4px 8px' : '8px 12px',
      fontSize: dense ? 12 : 14,
      fontFamily: 'inherit',
      color: rgb('gray-900'),
      background: '#fff',
      outline: 'none',
      boxShadow: f && as !== 'select' ? '0 0 0 1px rgb(59 130 246)' : 'none',
      ...(p.style || {})
    }
  }));
}
const Hint = ({
  children,
  tone
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: '4px 0 0',
    fontSize: 12,
    color: tone === 'amber' ? rgb('amber-600') : tone === 'red' ? rgb('red-600') : rgb('gray-500')
  }
}, children);
const ErrorBox = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    borderRadius: 4,
    border: `1px solid ${rgb('red-200')}`,
    background: rgb('red-50'),
    padding: 8,
    fontSize: 14,
    color: rgb('red-700')
  }
}, children);
const CapsLabel = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    color: rgb('gray-400'),
    ...style
  }
}, children);
function Check({
  checked,
  onChange,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      width: 16,
      height: 16,
      margin: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, children));
}
Object.assign(window, {
  Modal,
  TextBtn,
  PrimaryBtn,
  OutlineBtn,
  Label,
  Input,
  Hint,
  ErrorBox,
  CapsLabel,
  Check
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/Modal.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/Navigator.kit.jsx
try { (() => {
// Kit-only navigator (not part of the product): jump to any screen / state / modal.
const KIT_DEFAULT = {
  route: {
    view: 'lobby'
  },
  modal: null,
  hasProfile: true,
  lobbyState: 'default',
  loadState: 'ok',
  conn: 'ok',
  sideForm: null
};
const nh = i => NDOS[i].hash;
const KIT_SCREENS = [['Live app · Lobby', [['Browse NDOs', {}], ['Loading', {
  lobbyState: 'loading'
}], ['Load error + retry', {
  lobbyState: 'error'
}], ['No groups (onboarding)', {
  lobbyState: 'no-groups'
}], ['First launch — profile setup', {
  hasProfile: false,
  modal: 'profile'
}], ['Edit profile modal', {
  modal: 'profile'
}], ['Sidebar — new group form', {
  sideForm: 'create'
}], ['Sidebar — join group form', {
  sideForm: 'join'
}]]], ['Live app · Group', [['Group view', {
  route: {
    view: 'group',
    id: 'sensorica'
  }
}], ['Create NDO modal', {
  route: {
    view: 'group',
    id: 'sensorica'
  },
  modal: 'createNdo'
}], ['Group profile (first visit)', {
  route: {
    view: 'group',
    id: 'sensorica'
  },
  modal: 'groupProfile'
}], ['Unmounted: soft links / work log', {
  route: {
    view: 'stubs'
  }
}]]], ['Live app · NDO', [['Active NDO (seeded tabs)', {
  route: {
    view: 'ndo',
    hash: nh(0)
  }
}], ['Hibernating NDO', {
  route: {
    view: 'ndo',
    hash: nh(4)
  }
}], ['Deprecated NDO', {
  route: {
    view: 'ndo',
    hash: nh(5)
  }
}], ['Ideation NDO (Layer 1 blocked)', {
  route: {
    view: 'ndo',
    hash: nh(6)
  }
}], ['Loading skeleton', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  loadState: 'loading'
}], ['Load error banner', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  loadState: 'error'
}], ['Advance lifecycle modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'transition'
}], ['Fork modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'fork'
}], ['Associate modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'associate'
}], ['Create specification modal', {
  route: {
    view: 'ndo',
    hash: nh(1)
  },
  modal: 'spec'
}], ['Spec modal — blocked stage', {
  route: {
    view: 'ndo',
    hash: nh(6)
  },
  modal: 'spec'
}], ['Rule editor modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'rule'
}], ['Propose commitment modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'commitment'
}], ['Log economic event modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'event'
}], ['/ndo/new placeholder', {
  route: {
    view: 'new'
  }
}]]], ['Live app · Connection', [['Connecting', {
  conn: 'connecting'
}], ['Connection failed', {
  conn: 'error'
}], ['Not connected', {
  conn: 'off'
}]]], ['DS prototypes (not in live app)', [['Group view (prototype)', {
  route: {
    view: 'group-proto'
  }
}], ['Create NDO (full page)', {
  route: {
    view: 'create',
    group: 'sensorica'
  }
}], ['Agent profile', {
  route: {
    view: 'agent'
  }
}], ['NDO Layer 1 specification', {
  route: {
    view: 'layer1'
  }
}]]]];
function Navigator({
  st,
  set
}) {
  const [open, setOpen] = React.useState(false);
  const key = JSON.stringify;
  const isCur = p => {
    const n = {
      ...KIT_DEFAULT,
      ...p
    };
    return key(n.route) === key(st.route) && n.modal === st.modal && n.lobbyState === st.lobbyState && n.loadState === st.loadState && n.conn === st.conn && n.hasProfile === st.hasProfile && n.sideForm === st.sideForm;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 16,
      bottom: 16,
      zIndex: 100,
      fontFamily: 'var(--ndo-font-sans)'
    }
  }, open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      width: 280,
      maxHeight: '70vh',
      overflowY: 'auto',
      background: rgb('gray-900'),
      color: '#fff',
      borderRadius: 8,
      padding: 12,
      boxShadow: 'var(--ndo-shadow-lg)'
    }
  }, KIT_SCREENS.map(([sec, items]) => /*#__PURE__*/React.createElement("div", {
    key: sec,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: rgb('gray-400'),
      margin: '0 0 4px'
    }
  }, sec), items.map(([label, patch]) => {
    const cur = isCur(patch);
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: label,
      onClick: () => set({
        ...KIT_DEFAULT,
        ...patch
      }),
      hover: cur ? null : {
        background: rgb('gray-800')
      },
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'left',
        border: 0,
        borderRadius: 4,
        padding: '4px 8px',
        fontSize: 13,
        fontFamily: 'inherit',
        cursor: 'pointer',
        background: cur ? rgb('blue-600') : 'transparent',
        color: '#fff'
      }
    }, label);
  })))), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setOpen(!open),
    hover: {
      background: rgb('gray-800')
    },
    style: {
      display: 'block',
      marginLeft: 'auto',
      border: 0,
      borderRadius: 999,
      background: rgb('gray-900'),
      color: '#fff',
      padding: '8px 14px',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      boxShadow: 'var(--ndo-shadow-md)'
    }
  }, open ? 'Close screens' : 'Screens ▾'));
}
Object.assign(window, {
  Navigator,
  KIT_DEFAULT,
  KIT_SCREENS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/Navigator.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/NdoCreate.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const REGIME_HINTS = {
  Nondominium: 'Uncapturable by design — no agent or group can assert ownership or enclose this resource. Governance rules are cryptographically embedded.',
  Commons: 'Non-rivalrous shared resource governed by licensing and attribution. Can theoretically be enclosed through governance capture.',
  Collective: 'Cooperative ownership where decisions are made collectively. Members share both governance rights and benefit streams.',
  Pool: 'Pool of shareable physical resources requiring custody transfers, scheduling, and maintenance governance.',
  CommonPool: 'Rivalrous consumable resource governed by quota and depletion rules. Community-managed replenishment cycles.',
  Private: 'Full rights bundle with individual or organisational ownership. Fully alienable.'
};
const NATURE_HINTS = {
  Physical: 'Material object — tools, equipment, spaces, consumable stocks. Requires custody chain management.',
  Digital: 'Software, data, design files, documents. Non-rivalrous: can be copied at zero marginal cost.',
  Service: 'Ongoing capability provided by agents. Defined by process commitments and performance metrics.',
  Hybrid: 'Digital twin of a physical resource — a design file linked to a specific manufactured instance.',
  Information: 'Data, research outputs, sensor streams. Non-rivalrous and typically governed under attribution or commons regimes.'
};
const CHIPS = [['Nondominium', 'blue-700'], ['Commons', 'cyan-700'], ['Collective', 'violet-700'], ['Pool', 'teal-700'], ['CommonPool', 'rose-700'], ['Private', 'gray-500']];
function Field({
  label,
  req,
  opt,
  children
}) {
  return /*#__PURE__*/React.createElement("fieldset", {
    style: {
      margin: '0 0 20px',
      border: 0,
      padding: 0,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-700'),
      marginBottom: 6
    }
  }, label, req && /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('red-700'),
      marginLeft: 2
    }
  }, "*"), opt && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 400,
      color: rgb('gray-500'),
      marginLeft: 4
    }
  }, "(optional)")), children);
}
function Control({
  as = 'input',
  ...p
}) {
  const [f, setF] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({}, p, {
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      padding: '8px 12px',
      border: `1px solid ${f ? rgb('blue-600') : rgb('gray-300')}`,
      borderRadius: 6,
      fontFamily: 'var(--ndo-font-sans)',
      fontSize: 14,
      color: rgb('gray-900'),
      background: '#fff',
      outline: 'none',
      boxShadow: f ? 'var(--ndo-focus-ring)' : 'none',
      transition: 'border-color 150ms, box-shadow 150ms',
      resize: as === 'textarea' ? 'vertical' : undefined
    }
  }));
}
const hint = {
  marginTop: 6,
  fontSize: 12,
  color: rgb('gray-500'),
  lineHeight: 1.5
};
const hr = /*#__PURE__*/React.createElement("hr", {
  style: {
    border: 0,
    borderTop: `1px solid ${rgb('gray-100')}`,
    margin: '20px 0'
  }
});
function NdoCreate({
  group,
  go
}) {
  const g = GROUPS.find(x => x.id === group) || GROUPS[0];
  const [name, setName] = React.useState('');
  const [regime, setRegime] = React.useState('');
  const [nature, setNature] = React.useState('');
  const [stage, setStage] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [done, setDone] = React.useState(false);
  const dupe = name.trim() && NDOS.some(n => n.name.toLowerCase() === name.trim().toLowerCase());
  const back = /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'group',
        id: g.id
      });
    },
    style: {
      color: rgb('gray-500')
    }
  }, "\u2190 ", g.name);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '42rem',
      margin: '0 auto',
      padding: '32px 24px'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-500'),
      marginBottom: 24
    }
  }, back, /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", null, "New NDO")), !done ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${rgb('gray-200')}`,
      borderRadius: 12,
      boxShadow: 'var(--ndo-shadow-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 4px'
    }
  }, "New NDO"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-500'),
      margin: 0
    }
  }, "Creating in group: ", /*#__PURE__*/React.createElement("strong", null, g.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name",
    req: true
  }, /*#__PURE__*/React.createElement(Control, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g., Community Solar Array",
    autoComplete: "off"
  }), dupe && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 12,
      color: rgb('amber-700'),
      background: rgb('amber-50'),
      border: `1px solid ${rgb('amber-100')}`,
      borderRadius: 4,
      padding: '6px 10px'
    }
  }, "\u26A0 An NDO named \"", /*#__PURE__*/React.createElement("strong", null, name), "\" already exists in this group. You can continue, but consider a more specific name.")), hr, /*#__PURE__*/React.createElement(Field, {
    label: "Property Regime"
  }, /*#__PURE__*/React.createElement(Control, {
    as: "select",
    value: regime,
    onChange: e => setRegime(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a regime\u2026"), CHIPS.map(([v]) => /*#__PURE__*/React.createElement("option", {
    key: v
  }, v))), regime && /*#__PURE__*/React.createElement("div", {
    style: {
      ...hint,
      padding: '8px 12px',
      background: rgb('blue-50'),
      borderRadius: 4,
      color: rgb('blue-700')
    }
  }, REGIME_HINTS[regime]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8
    }
  }, CHIPS.map(([v, c]) => /*#__PURE__*/React.createElement(Hoverable, {
    key: v,
    title: REGIME_HINTS[v],
    onClick: () => setRegime(v),
    hover: {
      opacity: 0.7
    },
    style: {
      padding: '1.6px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      border: `1px dashed ${rgb(c)}`,
      color: rgb(c),
      background: 'transparent',
      cursor: 'pointer',
      transition: 'opacity 150ms'
    }
  }, v)))), /*#__PURE__*/React.createElement(Field, {
    label: "Resource Nature"
  }, /*#__PURE__*/React.createElement(Control, {
    as: "select",
    value: nature,
    onChange: e => setNature(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a nature\u2026"), Object.keys(NATURE_HINTS).map(v => /*#__PURE__*/React.createElement("option", {
    key: v
  }, v))), nature && /*#__PURE__*/React.createElement("div", {
    style: hint
  }, NATURE_HINTS[nature])), /*#__PURE__*/React.createElement(Field, {
    label: "Lifecycle Stage"
  }, /*#__PURE__*/React.createElement(Control, {
    as: "select",
    value: stage,
    onChange: e => setStage(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a stage\u2026"), /*#__PURE__*/React.createElement("option", null, "Ideation \u2014 concept declared, not yet specified"), /*#__PURE__*/React.createElement("option", null, "Specification \u2014 form defined, not yet built"), /*#__PURE__*/React.createElement("option", null, "Development \u2014 being built or prototyped"), /*#__PURE__*/React.createElement("option", null, "Stable \u2014 ready for distribution"), /*#__PURE__*/React.createElement("option", null, "Hibernating \u2014 temporarily inactive")), /*#__PURE__*/React.createElement("div", {
    style: hint
  }, "NDOs advance through: Ideation \u2192 Specification \u2192 Development \u2192 Prototype \u2192 Stable \u2192 Distributed \u2192 Active. ", /*#__PURE__*/React.createElement("em", null, "Deprecated"), " and ", /*#__PURE__*/React.createElement("em", null, "EndOfLife"), " are reached via lifecycle transitions after creation.")), hr, /*#__PURE__*/React.createElement(Field, {
    label: "Description",
    opt: true
  }, /*#__PURE__*/React.createElement(Control, {
    as: "textarea",
    rows: 4,
    maxLength: 500,
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: "Describe this NDO's purpose, governance intent, or usage context\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: 12,
      color: rgb('gray-400'),
      marginTop: 4
    }
  }, desc.length, " / 500"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      borderTop: `1px solid ${rgb('gray-100')}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost",
    onClick: () => go({
      view: 'group',
      id: g.id
    })
  }, "Cancel"), /*#__PURE__*/React.createElement(NDS.Button, {
    disabled: !name.trim(),
    onClick: () => setDone(true)
  }, "Create NDO"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${rgb('emerald-100')}`,
      borderRadius: 12,
      boxShadow: 'var(--ndo-shadow-md)',
      padding: 40,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 8px'
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-600'),
      margin: '0 0 20px'
    }
  }, "NDO created and anchored on the DHT. Its action hash is your stable identity anchor."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: '8px 16px',
      background: rgb('gray-50'),
      border: `1px solid ${rgb('gray-200')}`,
      borderRadius: 6,
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-700'),
      marginBottom: 24
    }
  }, "uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJ\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost",
    onClick: () => go({
      view: 'group',
      id: g.id
    })
  }, "\u2190 Back to ", g.name), /*#__PURE__*/React.createElement(NDS.Button, {
    onClick: () => go({
      view: 'ndo',
      hash: NDOS[0].hash
    })
  }, "View NDO \u2192"))));
}
Object.assign(window, {
  NdoCreate
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/NdoCreate.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/NdoLayer1.kit.jsx
try { (() => {
// DS prototype: src/routes/ui-kit/ndo-layer1 — Layer 1 surface the live app doesn't have yet.
function NdoLayer1() {
  const rules = [{
    badge: 'rule-access-requirement',
    label: 'AccessRequirement',
    by: 'AccountableAgent',
    fields: [['required_role', 'AccountableAgent'], ['min_reputation', 'none']],
    ok: true
  }, {
    badge: 'rule-usage-limit',
    label: 'UsageLimit',
    by: 'AccountableAgent',
    fields: [['max_hours_per_week', '40'], ['applies_to', 'all custodians']],
    ok: true,
    reason: 'A rivalrous resource is exactly where a usage limit earns its coordination cost.'
  }, {
    badge: 'rule-maintenance-schedule',
    label: 'MaintenanceSchedule',
    by: 'Repair',
    fields: [['interval_days', '90'], ['required_role', 'Repair']],
    ok: true
  }, {
    badge: 'rule-transfer-condition',
    label: 'TransferCondition',
    by: 'PrimaryAccountableAgent',
    fields: [['permits', 'ownership_transfer'], ['to', 'any agent']],
    ok: false,
    reason: 'Hard constraint. Nondominium permits custody transfer and forbids alienation, so a rule asserting ownership transfer cannot attach to this classification. The integrity zome rejects it at create time, not at use time.'
  }];
  const inst = [['Panel bank A', '4 kWp', 'opstate-in-use', 'InUse'], ['Panel bank B', '4 kWp', 'opstate-available', 'Available'], ['Inverter (spare)', '1', 'opstate-in-maintenance', 'InMaintenance'], ['Panel bank C', '2 kWp', 'opstate-pending-validation', 'PendingValidation']];
  const mono = {
    fontFamily: 'var(--ndo-font-mono)',
    fontSize: 12
  };
  const note = {
    fontSize: 14,
    lineHeight: 1.55,
    color: rgb('gray-600'),
    margin: '0 0 16px'
  };
  const h2 = {
    fontSize: 18,
    margin: '0 0 6px',
    color: rgb('gray-900')
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '52rem',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: rgb('gray-500')
    }
  }, "Layer 1 \u2014 Specified"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      margin: '4px 0 12px',
      color: rgb('gray-900')
    }
  }, "Solar Array \u2014 Bay 2 Specification"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "regime-nondominium",
    label: "Nondominium"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "nature-physical",
    label: "Physical"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "rivalry-rivalrous",
    label: "Rivalrous"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "scope-network",
    label: "Scope: Network"
  })), /*#__PURE__*/React.createElement("p", {
    style: note
  }, "Rivalry is default from ResourceNature::Physical, not overridden. It is orthogonal to the property regime: the regime says who may hold rights, rivalry says whether holding excludes anyone else."), /*#__PURE__*/React.createElement("code", {
    style: {
      ...mono,
      color: rgb('gray-400')
    }
  }, "uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Typed governance rules"), /*#__PURE__*/React.createElement("p", {
    style: note
  }, "Four discriminants, rendered by type rather than as a payload dump. Each rule carries the Layer 0 classification with it, which is what lets the integrity zome decide the verdict below without reading the DHT."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, rules.map(r => /*#__PURE__*/React.createElement("li", {
    key: r.label,
    style: {
      border: `1px solid ${rgb(r.ok ? 'gray-200' : 'red-200')}`,
      borderRadius: 8,
      padding: '14px 16px',
      marginBottom: 12,
      background: r.ok ? '#fff' : rgb('red-50')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: r.badge,
    label: r.label
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      color: rgb('gray-500')
    }
  }, "enforced_by: ", r.by), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: r.ok ? 'active' : 'inactive',
    label: r.ok ? 'allowed' : 'rejected'
  })), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px 24px',
      margin: '12px 0 0'
    }
  }, r.fields.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      ...mono,
      color: rgb('gray-500')
    }
  }, k), /*#__PURE__*/React.createElement("dd", {
    style: {
      ...mono,
      margin: 0,
      color: rgb('gray-800')
    }
  }, v)))), r.reason && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 13,
      lineHeight: 1.55,
      color: rgb('gray-700')
    }
  }, r.reason))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Instances and operational state"), /*#__PURE__*/React.createElement("p", {
    style: note
  }, "OperationalState is not a lifecycle stage. The NDO stays Active while individual instances cycle through use, maintenance and availability underneath it. Two axes, two visual languages: a lifecycle badge is flat, an operational state carries a dot."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, inst.map(([n, q, s, l]) => /*#__PURE__*/React.createElement("li", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: `1px solid ${rgb('gray-100')}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 13,
      color: rgb('gray-500'),
      flex: 1
    }
  }, q), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: s,
    label: l
  }))))));
}
Object.assign(window, {
  NdoLayer1
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/NdoLayer1.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/NdoModals.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Live-app NDO modals: LifecycleTransitionModal, TransitionHistoryPanel, ForkNdoModal, AssociateNdoModal, NdoCreateModal
const TRANSITIONS = {
  Ideation: ['Specification', 'Deprecated', 'EndOfLife'],
  Specification: ['Development', 'Deprecated', 'EndOfLife'],
  Development: ['Prototype', 'Deprecated', 'EndOfLife'],
  Prototype: ['Stable', 'Deprecated', 'EndOfLife'],
  Stable: ['Distributed', 'Deprecated', 'EndOfLife'],
  Distributed: ['Active', 'Deprecated', 'EndOfLife'],
  Active: ['Hibernating', 'Deprecated', 'EndOfLife'],
  Hibernating: ['Deprecated', 'EndOfLife'],
  Deprecated: ['EndOfLife']
};
function LifecycleTransitionModal({
  ndo,
  onClose,
  onAdvance
}) {
  const cur = ndo.lifecycle_stage;
  const opts = cur === 'Hibernating' && ndo.hibernation_origin ? [ndo.hibernation_origin, ...(TRANSITIONS[cur] || [])] : TRANSITIONS[cur] || [];
  const [sel, setSel] = React.useState('');
  const [q, setQ] = React.useState('');
  const [succ, setSucc] = React.useState(null);
  const [err, setErr] = React.useState('');
  const matches = q.trim().length >= 2 ? NDOS.filter(n => n.name.toLowerCase().includes(q.toLowerCase()) && n.hash !== ndo.hash) : [];
  const confirm = () => {
    if (!sel) return setErr('Please select a target stage.');
    if (sel === 'Deprecated' && !succ) return setErr('Please select a successor NDO for deprecation.');
    onAdvance(sel, succ);
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "sm",
    title: "Advance lifecycle stage",
    subtitle: /*#__PURE__*/React.createElement(React.Fragment, null, "Current stage: ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500,
        color: rgb('gray-800')
      }
    }, cur)),
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), opts.length > 0 && /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: !sel,
      onClick: confirm
    }, "Confirm"))
  }, opts.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No further transitions available from ", /*#__PURE__*/React.createElement("strong", null, cur), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: 0,
      margin: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-700'),
      padding: 0
    }
  }, "Target stage:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, opts.map(s => /*#__PURE__*/React.createElement("label", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "ts",
    checked: sel === s,
    onChange: () => setSel(s),
    style: {
      width: 16,
      height: 16,
      margin: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, s))))), sel === 'Deprecated' && /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 4,
      border: '1px solid rgb(254 215 170)',
      background: rgb('orange-50'),
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('orange-700')
    }
  }, "Select successor NDO:"), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setSucc(null);
    },
    placeholder: "Search by name\u2026",
    style: {
      width: '100%',
      borderRadius: 4,
      border: '1px solid rgb(254 215 170)',
      padding: '4px 8px',
      fontSize: 14,
      fontFamily: 'inherit',
      outline: 'none'
    }
  }), matches.length > 0 && !succ && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '4px 0 0',
      padding: 0,
      maxHeight: 128,
      overflowY: 'auto',
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff'
    }
  }, matches.map(n => /*#__PURE__*/React.createElement("li", {
    key: n.hash
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => {
      setSucc(n);
      setQ(n.name);
    },
    hover: {
      background: rgb('gray-50')
    },
    style: {
      width: '100%',
      padding: '6px 12px',
      textAlign: 'left',
      fontSize: 14,
      color: rgb('gray-700'),
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, n.name)))), succ && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: 'rgb(22 163 74)'
    }
  }, "Selected: ", succ.name)), sel === 'Hibernating' && /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 4,
      border: '1px solid rgb(254 240 138)',
      background: rgb('yellow-50'),
      padding: 12,
      fontSize: 12,
      color: rgb('yellow-700')
    }
  }, "Hibernating preserves the current stage as origin. The NDO can resume from ", /*#__PURE__*/React.createElement("strong", null, cur), " later.")), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
function TransitionHistoryPanel({
  history
}) {
  return /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 12,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50')
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      userSelect: 'none',
      padding: '8px 12px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('gray-600')
    }
  }, "Lifecycle history \xB7 ", history.length, " transition", history.length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${rgb('gray-200')}`,
      padding: '8px 12px'
    }
  }, history.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "No transitions recorded yet. This NDO is still at the stage it was created in.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, history.map((h, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-100')}`,
      background: '#fff',
      padding: '8px 12px',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, h.from), /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "\u2192"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, h.to)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: rgb('gray-500')
    }
  }, "By ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ndo-font-mono)'
    }
  }, h.agent.slice(0, 10), "\u2026"), " \xB7 ", h.time), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      color: rgb('gray-400')
    }
  }, h.event.slice(0, 12), "\u2026"), /*#__PURE__*/React.createElement("button", {
    title: "Copy event hash",
    style: {
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      color: rgb('gray-400')
    }
  }, "\u29C9")))))));
}
function ForkNdoModal({
  ndo,
  onClose
}) {
  const [copied, setCopied] = React.useState(false);
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Fork this NDO",
    subtitle: ndo.name,
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Close")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      border: '1px solid rgb(253 230 138)',
      background: rgb('amber-50'),
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontSize: 14,
      fontWeight: 600,
      color: rgb('amber-800')
    }
  }, "Fork friction \u2014 by design"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('amber-700')
    }
  }, "Forking is intentionally non-trivial in Nondominium. The NDO model discourages gratuitous forks that fragment shared resource pools.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Step 1 \u2014 Negotiate:"), " Contact the NDO initiator and present your case for a fork. Consensus with existing participants is expected."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Step 2 \u2014 Consensus:"), " A fork requires agreement from active participants, not just the initiator. Minority disagreement must be addressed."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-400')
    }
  }, "Step 3 \u2014 Unyt payment (future):"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "Post-MVP, forking will require a Unyt-denominated stake as friction to prevent extractive forks. This feature is not yet available."))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50'),
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, "Contact the NDO initiator to begin negotiation:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      borderRadius: 4,
      background: '#fff',
      padding: '4px 8px',
      fontSize: 12,
      color: rgb('gray-600'),
      border: `1px solid ${rgb('gray-200')}`,
      fontFamily: 'var(--ndo-font-mono)'
    }
  }, ME_B64), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    hover: {
      background: rgb('gray-100')
    },
    style: {
      flexShrink: 0,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-300')}`,
      background: 'transparent',
      padding: '4px 10px',
      fontSize: 12,
      color: rgb('gray-600'),
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, copied ? '✓ Copied' : 'Copy')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: rgb('gray-400')
    }
  }, "Agent public key (Holochain)")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-400'),
      fontStyle: 'italic',
      textAlign: 'center'
    }
  }, "Full fork functionality (claim submission, vote, Unyt stake) is coming in a future release."));
}
function AssociateNdoModal({
  ndo,
  onClose
}) {
  const [sel, setSel] = React.useState([]);
  const [saved, setSaved] = React.useState(false);
  const avail = GROUPS.filter(g => g.id !== ndo.group);
  const tog = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgb(0 0 0 / 0.4)',
      backdropFilter: 'blur(4px)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    style: {
      width: '100%',
      maxWidth: '24rem',
      borderRadius: 12,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      padding: '16px 20px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, "Associate with a group"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Add ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, "\"", ndo.name, "\""), " to one of your groups so group members can find and join it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: '18rem',
      overflowY: 'auto',
      padding: '12px 20px'
    }
  }, avail.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "This NDO is already associated with all your groups.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, avail.map(g => /*#__PURE__*/React.createElement("li", {
    key: g.id
  }, /*#__PURE__*/React.createElement(Hoverable, {
    as: "label",
    hover: {
      background: rgb('gray-50')
    },
    style: {
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      gap: 10,
      borderRadius: 4,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: sel.includes(g.id),
    onChange: () => tog(g.id),
    style: {
      width: 16,
      height: 16,
      margin: 0,
      accentColor: rgb('blue-600')
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-800')
    }
  }, g.name)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      borderTop: `1px solid ${rgb('gray-100')}`,
      padding: '12px 20px'
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onClose,
    hover: {
      background: rgb('gray-100')
    },
    style: {
      borderRadius: 4,
      padding: '6px 12px',
      fontSize: 14,
      color: rgb('gray-500'),
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement(Hoverable, {
    disabled: !sel.length || saved,
    onClick: () => {
      setSaved(true);
      setTimeout(onClose, 600);
    },
    hover: sel.length ? {
      background: rgb('blue-700')
    } : null,
    style: {
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '6px 12px',
      fontSize: 14,
      fontWeight: 500,
      color: '#fff',
      border: 0,
      cursor: sel.length ? 'pointer' : 'not-allowed',
      opacity: !sel.length || saved ? 0.5 : 1,
      fontFamily: 'inherit'
    }
  }, saved ? 'Saved!' : `Add to ${sel.length || ''} group${sel.length !== 1 ? 's' : ''}`))));
}
const REGIME_TIPS = {
  Private: 'Owned and controlled by a single agent.',
  Commons: 'Shared, self-governed resource open to a defined community.',
  Collective: 'Cooperatively owned by a defined group of agents.',
  Pool: 'Rivalrous shareable; scheduling, custody, and maintenance apply.',
  CommonPool: 'A commons with a defined boundary and subtractable access.',
  Public: 'Under public/governmental stewardship; open-access; non-alienable by the public body.',
  Nondominium: 'Cannot be captured or exclusively owned; maximally open.'
};
const NATURE_TIPS = {
  Physical: 'A tangible, material resource.',
  Digital: 'An intangible, bit-based resource (software, data, etc.).',
  Service: 'A time-based provision of capability or skill.',
  Hybrid: 'A resource with both physical and digital dimensions.',
  Information: 'Knowledge, documentation, or structured data.'
};
const DEFAULT_RIVALRY = {
  Physical: 'Rivalrous',
  Digital: 'NonRivalrous',
  Information: 'NonRivalrous',
  Hybrid: 'Rivalrous',
  Service: null
};
function NdoCreateModal({
  group,
  onClose,
  onCreate
}) {
  const [v, setV] = React.useState({
    name: '',
    property_regime: 'Commons',
    resource_nature: 'Physical',
    rivalry_override: '',
    lifecycle_stage: 'Ideation',
    description: ''
  });
  const [err, setErr] = React.useState('');
  const b = k => ({
    value: v[k],
    onChange: e => setV({
      ...v,
      [k]: e.target.value
    })
  });
  const warn = v.name.trim() && NDOS.some(d => d.name.toLowerCase() === v.name.trim().toLowerCase());
  const riv = DEFAULT_RIVALRY[v.resource_nature];
  const submit = () => {
    if (!v.name.trim()) return setErr('Name is required.');
    onCreate({
      ...v,
      name: v.name.trim(),
      hash: 'uhC0kNew' + Math.random().toString(36).slice(2, 26),
      group: group.id,
      description: v.description || ''
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Create NDO",
    subtitle: "Register a new NondominiumIdentity Layer 0 within this group.",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: submit
    }, "Create NDO"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    req: true
  }, "Name"), /*#__PURE__*/React.createElement(Input, _extends({
    autoFocus: true,
    placeholder: "Unique identifier for this NDO"
  }, b('name'))), warn && /*#__PURE__*/React.createElement(Hint, {
    tone: "amber"
  }, "An NDO with this name already exists in the Lobby.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Property Regime"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('property_regime')), Object.keys(REGIME_TIPS).map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r))), /*#__PURE__*/React.createElement(Hint, null, REGIME_TIPS[v.property_regime])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Resource Nature"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('resource_nature')), Object.keys(NATURE_TIPS).map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r))), /*#__PURE__*/React.createElement(Hint, null, NATURE_TIPS[v.resource_nature]), riv ? /*#__PURE__*/React.createElement(Hint, null, "Default rivalry for this nature: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, riv)) : /*#__PURE__*/React.createElement(Hint, {
    tone: "amber"
  }, "Service nature has no confident rivalry default \u2014 set an override if this is a rivalrous slot (e.g. booking time).")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Rivalry override ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400'),
      fontWeight: 400
    }
  }, "(optional)")), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('rivalry_override')), /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 use nature default \u2014"), /*#__PURE__*/React.createElement("option", null, "Rivalrous"), /*#__PURE__*/React.createElement("option", null, "NonRivalrous")), /*#__PURE__*/React.createElement(Hint, null, "Override only when the nature default is wrong for this resource.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Initial Lifecycle Stage"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('lifecycle_stage')), ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active'].map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))), /*#__PURE__*/React.createElement(Hint, null, "Choose emergence (Ideation\u2013Prototype) for something still forming, or ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Stable"), " / ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Distributed"), " / ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Active"), " for an already mature or in-use resource (e.g. a stable shared tool). ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Hibernating"), ", terminal stages, and deprecation are set only after creation via lifecycle transitions.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Description ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "(optional)")), /*#__PURE__*/React.createElement(Input, _extends({
    as: "textarea",
    rows: 3,
    light: true,
    placeholder: "What is this NDO about?"
  }, b('description')))), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
Object.assign(window, {
  LifecycleTransitionModal,
  TransitionHistoryPanel,
  ForkNdoModal,
  AssociateNdoModal,
  NdoCreateModal,
  DEFAULT_RIVALRY
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/NdoModals.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/NdoTabs.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Live-app tab bodies: ndo/ResourcesTab, GovernanceTab, CompositionTab, ActivityTab
const OPSTATE_LABEL = {
  Available: 'Available',
  Reserved: 'Reserved',
  InTransit: 'In transit',
  InStorage: 'In storage',
  InMaintenance: 'In maintenance',
  InUse: 'In use',
  PendingValidation: 'Pending validation'
};
const liveLi = {
  borderRadius: 4,
  border: `1px solid ${rgb('gray-200')}`,
  background: '#fff',
  padding: 12,
  fontSize: 14
};
const H3L = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("h3", {
  style: {
    margin: 0,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 600,
    color: rgb('gray-900'),
    ...style
  }
}, children);
const H4L = ({
  children
}) => /*#__PURE__*/React.createElement("h4", {
  style: {
    margin: '0 0 8px',
    fontSize: 14,
    fontWeight: 600,
    color: rgb('gray-800')
  }
}, children);
const Muted = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 14,
    color: rgb('gray-500')
  }
}, children);
const stack = g => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: g
});
const INELIGIBLE = new Set(['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife']);
function ResourcesTab({
  ndo,
  specs,
  onNewSpec
}) {
  const can = !INELIGIBLE.has(ndo.lifecycle_stage);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(H3L, null, "Layer 1 specifications"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Resource specifications linked to this NDO.")), /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    disabled: !can,
    onClick: onNewSpec
  }, "+ New specification")), !can && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px solid ${rgb('amber-100')}`,
      background: rgb('amber-50'),
      padding: '8px 12px',
      fontSize: 12,
      color: rgb('amber-800')
    }
  }, "Layer 1 activation is blocked while the NDO is ", /*#__PURE__*/React.createElement("strong", null, ndo.lifecycle_stage), ". Advance the lifecycle first."), specs.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No resource specifications for this NDO yet.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, specs.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-900')
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, s.category, " \xB7 scope ", s.scope, " \xB7 active"), s.description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, s.description), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '12px 0 0',
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      color: rgb('gray-500')
    }
  }, "Economic resources"), s.resources.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No inventoried resources for this specification.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      ...stack(8),
      marginTop: 4
    }
  }, s.resources.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      padding: '8px 12px',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Qty"), " ", r.quantity, " ", r.unit, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Operational state"), " ", OPSTATE_LABEL[r.state])))))));
}
function GovernanceTab({
  specs,
  rules,
  onNewRule
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(H3L, null, "Governance rules"), /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    onClick: onNewRule
  }, "+ New rule")), specs.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No Layer 1 specifications yet \u2014 create one on the Resources tab before adding rules.") : rules.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No governance rules linked to this NDO\u2019s specifications.") : /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, rules.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: liveLi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, r.kind), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "spec: ", r.spec)), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: '8px 0 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: 4,
      fontSize: 12,
      color: rgb('gray-600')
    }
  }, Object.entries(r.payload).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, k, ":"), " ", v === '' || v == null ? '—' : String(v)))), r.enforced_by && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Enforced by: ", r.enforced_by))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(H3L, {
    style: {
      marginBottom: 8
    }
  }, "My roles (person zome)"), /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, ['SimpleAgent', 'AccountableAgent'].map(r => /*#__PURE__*/React.createElement("li", {
    key: r,
    style: {
      ...liveLi,
      padding: '8px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, r)))), /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      marginTop: 12,
      border: 0,
      borderRadius: 4,
      background: rgb('amber-100'),
      padding: '6px 12px',
      fontSize: 12,
      color: rgb('amber-800'),
      fontFamily: 'inherit'
    }
  }, "AccountableAgent (governance-gated)")));
}
function CompositionTab() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      border: `1px dashed ${rgb('gray-400')}`,
      background: '#fff',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginBottom: 12,
      display: 'inline-block',
      borderRadius: 4,
      background: rgb('amber-50'),
      padding: '2px 8px',
      fontSize: 12,
      color: rgb('amber-600')
    }
  }, "Coming soon"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, "Composition view (NdoHardLink graph and D3) is not wired yet. This placeholder avoids pulling D3 or WASM types that are still in flight."));
}
function ActivityTab({
  commitments,
  events,
  onNewCommitment,
  onNewEvent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(H3L, null, "Activity"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Commitments and events for this NDO (client-filtered by ", /*#__PURE__*/React.createElement("code", null, "ndo_identity_hash"), ").")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    onClick: onNewCommitment
  }, "+ New commitment"), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onNewEvent,
    hover: {
      background: rgb('blue-100')
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb('blue-300')}`,
      background: rgb('blue-50'),
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: rgb('blue-700')
    }
  }, "+ New event"))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(H4L, null, "Commitments"), commitments.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No commitments for this NDO yet.") : /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, commitments.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: liveLi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-900')
    }
  }, c.action), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: rgb('gray-600')
    }
  }, "Due ", c.due), c.note && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, c.note))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(H4L, null, "Economic events"), events.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No events recorded for this NDO yet.") : /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, events.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: liveLi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-900')
    }
  }, e.action), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: rgb('gray-600')
    }
  }, "Qty ", e.qty, " \xB7 ", e.time), e.note && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, e.note))))));
}
function SpecificationCreateModal({
  ndo,
  onClose,
  onCreate
}) {
  const can = !INELIGIBLE.has(ndo.lifecycle_stage);
  const locked = ['Nondominium', 'Public'].includes(ndo.property_regime);
  const [v, setV] = React.useState({
    name: '',
    description: '',
    category: 'general',
    scope: 'Project',
    tags: '',
    image: ''
  });
  const [err, setErr] = React.useState('');
  const f = k => ({
    value: v[k],
    onChange: e => setV({
      ...v,
      [k]: e.target.value
    })
  });
  const submit = () => {
    if (!v.name.trim() || !v.description.trim()) return setErr('Name and description are required.');
    onCreate({
      name: v.name,
      description: v.description,
      category: v.category || 'general',
      scope: locked ? 'Public' : v.scope,
      resources: []
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Create resource specification",
    subtitle: "Activate Layer 1 for this NDO. Governance rules can be added afterward.",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: !can,
      onClick: submit
    }, "Create specification"))
  }, !can ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: '1px solid rgb(253 230 138)',
      background: rgb('amber-50'),
      padding: 12,
      fontSize: 14,
      color: rgb('amber-800')
    }
  }, "Layer 1 cannot be activated while the NDO is in ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, ndo.lifecycle_stage), ". Advance the lifecycle stage first (Specification or later, excluding Hibernating / Deprecated / EndOfLife).") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Name *"), /*#__PURE__*/React.createElement(Input, f('name'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Description *"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "textarea",
    rows: 3
  }, f('description')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Category"), /*#__PURE__*/React.createElement(Input, f('category'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Scope"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    disabled: locked,
    value: locked ? 'Public' : v.scope,
    onChange: e => setV({
      ...v,
      scope: e.target.value
    }),
    style: locked ? {
      background: rgb('gray-100'),
      color: rgb('gray-500'),
      cursor: 'not-allowed'
    } : null
  }, /*#__PURE__*/React.createElement("option", null, "Project"), /*#__PURE__*/React.createElement("option", null, "Network"), /*#__PURE__*/React.createElement("option", null, "Public")), /*#__PURE__*/React.createElement(Hint, null, locked ? `A ${ndo.property_regime} NDO is open access, so its specification is always Public. Narrowing the scope would hide it from the global discovery anchor (REQ-RES-03).` : 'Project-scoped specs are omitted from the global discovery anchor.')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Tags ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "(comma-separated)")), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, f('tags')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true,
    opt: true
  }, "Image URL"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "url"
  }, f('image'))))), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
Object.assign(window, {
  ResourcesTab,
  GovernanceTab,
  CompositionTab,
  ActivityTab,
  SpecificationCreateModal,
  OPSTATE_LABEL,
  INELIGIBLE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/NdoTabs.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/NdoView.kit.jsx
try { (() => {
// Live app: ndo/NdoView + NdoIdentityLayer (tabs in NdoTabs.jsx, modals in NdoModals.jsx / GovernanceModals.jsx)
const LIFE_MAP = {
  Ideation: ['gray-100', 'gray-600'],
  Specification: ['blue-50', 'blue-600'],
  Development: ['indigo-100', 'indigo-700'],
  Prototype: ['amber-100', 'amber-700'],
  Stable: ['green-100', 'green-700'],
  Distributed: ['teal-100', 'teal-700'],
  Active: ['emerald-100', 'emerald-700'],
  Hibernating: ['yellow-100', 'yellow-700'],
  Deprecated: ['orange-100', 'orange-700'],
  EndOfLife: ['red-100', 'red-700']
};
const REG_MAP = {
  Private: ['gray-100', 'gray-600'],
  Commons: ['cyan-100', 'cyan-700'],
  Collective: ['violet-100', 'violet-700'],
  Pool: ['amber-100', 'amber-700'],
  CommonPool: ['rose-100', 'rose-700'],
  Public: ['sky-100', 'sky-700'],
  Nondominium: ['emerald-100', 'emerald-700']
};
const NAT_MAP = {
  Physical: ['blue-100', 'blue-700'],
  Digital: ['purple-100', 'purple-700'],
  Service: ['orange-100', 'orange-700'],
  Hybrid: ['teal-100', 'teal-700'],
  Information: ['indigo-100', 'indigo-700']
};
const pill = ([bg, fg], extra) => ({
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 500,
  background: rgb(bg),
  color: rgb(fg),
  ...extra
});
const Caps = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    color: rgb('gray-400')
  }
}, children);
function NdoIdentityLayer({
  ndo,
  history,
  canTransition,
  onTransition,
  go
}) {
  const rival = ndo.rivalry_override || DEFAULT_RIVALRY[ndo.resource_nature];
  const succ = ndo.successor_ndo_hash;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: pill(LIFE_MAP[ndo.lifecycle_stage], {
      fontWeight: 600
    })
  }, ndo.lifecycle_stage), /*#__PURE__*/React.createElement("span", {
    style: pill(REG_MAP[ndo.property_regime], {
      border: '1px dashed currentColor'
    })
  }, ndo.property_regime), /*#__PURE__*/React.createElement("span", {
    style: pill(NAT_MAP[ndo.resource_nature])
  }, ndo.resource_nature), rival && /*#__PURE__*/React.createElement("span", {
    style: pill(['gray-50', 'gray-700'], {
      background: '#fff',
      border: `1px solid ${rgb('gray-200')}`
    })
  }, rival)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 16,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, /*#__PURE__*/React.createElement("span", null, "By ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'agent'
      });
    },
    style: {
      fontWeight: 500,
      color: rgb('blue-600')
    }
  }, "Tiberius")), /*#__PURE__*/React.createElement("span", null, "3/9/2024, 4:00:00 PM"), canTransition && /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onTransition,
    hover: {
      background: rgb('blue-100')
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb('blue-300')}`,
      background: rgb('blue-50'),
      padding: '4px 10px',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: rgb('blue-700')
    }
  }, ndo.lifecycle_stage === 'Active' ? 'Suspend (Hibernate) →' : 'Advance stage →'))), ndo.description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, ndo.description), ndo.lifecycle_stage === 'Hibernating' && ndo.hibernation_origin && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 4,
      background: rgb('yellow-50'),
      padding: '6px 12px',
      fontSize: 12,
      color: rgb('yellow-700')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Hibernating"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgb(234 179 8)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Will resume from: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, ndo.hibernation_origin))), ndo.lifecycle_stage === 'Deprecated' && succ && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 4,
      background: rgb('orange-50'),
      padding: '6px 12px',
      fontSize: 12,
      color: rgb('orange-700')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Deprecated"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgb(251 146 60)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Succeeded by: ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'ndo',
        hash: succ
      });
    },
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      textDecoration: 'underline',
      color: 'inherit'
    }
  }, succ.slice(0, 12), "\u2026"))), /*#__PURE__*/React.createElement(TransitionHistoryPanel, {
    history: history
  }));
}
function NdoView({
  ndo,
  data,
  setData,
  updateNdo,
  go,
  loadState = 'ok',
  modal,
  setModal
}) {
  const [tab, setTab] = React.useState('resources');
  const [join, setJoin] = React.useState(false);
  const [joined, setJoined] = React.useState(false);
  const tabs = [['resources', 'Resources'], ['governance', 'Governance'], ['composition', 'Composition'], ['activity', 'Activity']];
  const loading = loadState === 'loading',
    err = loadState === 'error';
  const add = (k, item) => {
    setData({
      ...data,
      [k]: [...data[k], item]
    });
    setModal(null);
  };
  return /*#__PURE__*/React.createElement("div", null, modal === 'fork' && /*#__PURE__*/React.createElement(ForkNdoModal, {
    ndo: ndo,
    onClose: () => setModal(null)
  }), modal === 'associate' && /*#__PURE__*/React.createElement(AssociateNdoModal, {
    ndo: ndo,
    onClose: () => setModal(null)
  }), modal === 'transition' && /*#__PURE__*/React.createElement(LifecycleTransitionModal, {
    ndo: ndo,
    onClose: () => setModal(null),
    onAdvance: (to, succ) => {
      updateNdo({
        lifecycle_stage: to,
        ...(to === 'Hibernating' ? {
          hibernation_origin: ndo.lifecycle_stage
        } : null),
        ...(succ ? {
          successor_ndo_hash: succ.hash
        } : null)
      });
      setData({
        ...data,
        history: [...data.history, {
          from: ndo.lifecycle_stage,
          to,
          agent: ME_B64,
          time: new Date().toLocaleString(),
          event: 'uhCkk' + Math.random().toString(36).slice(2, 18)
        }]
      });
      setModal(null);
    }
  }), modal === 'spec' && /*#__PURE__*/React.createElement(SpecificationCreateModal, {
    ndo: ndo,
    onClose: () => setModal(null),
    onCreate: s => add('specs', s)
  }), modal === 'rule' && /*#__PURE__*/React.createElement(RuleEditorModal, {
    ndo: ndo,
    specName: data.specs[0]?.name || '—',
    onClose: () => setModal(null),
    onCreate: r => add('rules', r)
  }), modal === 'commitment' && /*#__PURE__*/React.createElement(CommitmentCreateForm, {
    ndo: ndo,
    onClose: () => setModal(null),
    onCreate: c => add('commitments', c)
  }), modal === 'event' && /*#__PURE__*/React.createElement(EconomicEventCreateForm, {
    ndo: ndo,
    commitments: data.commitments,
    onClose: () => setModal(null),
    onCreate: e => add('events', e)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: '16px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      height: 24,
      width: 160,
      borderRadius: 4,
      background: rgb('gray-200'),
      animation: 'ndoPulse 2s cubic-bezier(0.4,0,0.6,1) infinite'
    }
  }) : err ? /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 700,
      color: rgb('red-600')
    }
  }, "Failed to load NDO") : /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, ndo.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-400')
    }
  }, ndo.hash.slice(0, 20), "\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 16,
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(OutlineBtn, {
    onClick: () => setJoin(!join)
  }, "Join NDO"), /*#__PURE__*/React.createElement(OutlineBtn, {
    tone: "blue",
    onClick: () => setModal('associate')
  }, "Associate with a group"), /*#__PURE__*/React.createElement(OutlineBtn, {
    onClick: () => setModal('fork')
  }, "Fork this NDO"))), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "NDO sections",
    style: {
      marginTop: 16,
      display: 'flex',
      gap: 8
    }
  }, tabs.map(([id, l]) => {
    const a = tab === id;
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: id,
      onClick: () => setTab(id),
      hover: a ? null : {
        color: rgb('gray-800')
      },
      style: {
        cursor: 'pointer',
        borderRadius: '4px 4px 0 0',
        border: `1px solid ${a ? rgb('gray-200') : 'transparent'}`,
        borderBottom: 0,
        padding: '8px 12px',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'color 150ms',
        background: a ? rgb('gray-50') : 'transparent',
        color: a ? rgb('gray-900') : rgb('gray-500')
      }
    }, l);
  }))), err && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 24px 0',
      borderRadius: 4,
      border: `1px solid ${rgb('red-200')}`,
      background: rgb('red-50'),
      padding: '12px 16px',
      fontSize: 14,
      color: rgb('red-700')
    }
  }, "Could not refresh NDO details from the chain. Data shown may be cached.", /*#__PURE__*/React.createElement("button", {
    style: {
      marginLeft: 12,
      textDecoration: 'underline',
      border: 0,
      background: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: 14,
      padding: 0
    }
  }, "Retry")), !loading && !err && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 24px 0',
      borderRadius: 8,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 20,
      boxShadow: 'var(--ndo-shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: 16
    }
  }, ndo.description && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement(Caps, null, "Description"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-800')
    }
  }, ndo.description)), [['Property regime', ndo.property_regime], ['Resource nature', ndo.resource_nature], ['Lifecycle stage', ndo.lifecycle_stage]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement(Caps, null, k), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, v ?? '—'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Caps, null, "Created"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, "3/9/2024, 4:00:00 PM")))), join && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 24px 0',
      borderRadius: 8,
      border: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50'),
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "NDO membership"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Joining an NDO records your participation on the DHT. This is distinct from associating the NDO with a group (a curated short list for group members)."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    onClick: () => setJoined(true)
  }, "Join this NDO")), joined && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 12,
      color: rgb('gray-600')
    }
  }, "You have joined this NDO."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: -16
    }
  }, /*#__PURE__*/React.createElement(MemberList, {
    members: joined ? [...MEMBERS, {
      id: 'me',
      name: 'Tiberius (you)',
      role: 'Member'
    }] : MEMBERS
  }))), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      padding: '16px 24px',
      marginTop: 16,
      fontSize: 14,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "Loading Layer 0 identity\u2026") : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(NdoIdentityLayer, {
    ndo: ndo,
    history: data.history,
    canTransition: ndo.lifecycle_stage !== 'EndOfLife',
    onTransition: () => setModal('transition'),
    go: go
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, tab === 'resources' && /*#__PURE__*/React.createElement(ResourcesTab, {
    ndo: ndo,
    specs: data.specs,
    onNewSpec: () => setModal('spec')
  }), tab === 'governance' && /*#__PURE__*/React.createElement(GovernanceTab, {
    specs: data.specs,
    rules: data.rules,
    onNewRule: () => setModal('rule')
  }), tab === 'composition' && /*#__PURE__*/React.createElement(CompositionTab, null), tab === 'activity' && /*#__PURE__*/React.createElement(ActivityTab, {
    commitments: data.commitments,
    events: data.events,
    onNewCommitment: () => setModal('commitment'),
    onNewEvent: () => setModal('event')
  })));
}
Object.assign(window, {
  NdoView,
  NdoIdentityLayer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/NdoView.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/Profile.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PROFILE = {
  nickname: 'Tiberius',
  realName: 'Tiberius Brastaviceanu',
  bio: 'Sensorica co-founder. Open hardware & OVN.',
  email: 'tiberius@sensorica.co',
  phone: '',
  address: 'Montréal, QC'
};
function ProfileFields({
  v,
  set,
  err
}) {
  const f = k => ({
    value: v[k],
    onChange: e => set({
      ...v,
      [k]: e.target.value
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "lup-nickname",
    req: true
  }, "Nickname"), /*#__PURE__*/React.createElement(Input, _extends({
    id: "lup-nickname",
    autoFocus: true,
    placeholder: "How you appear in the Lobby"
  }, f('nickname'))), err && /*#__PURE__*/React.createElement(Hint, {
    tone: "red"
  }, err)), /*#__PURE__*/React.createElement(CapsLabel, null, "Optional fields"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Real name"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    placeholder: "Your full name (optional)"
  }, f('realName')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Bio"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "textarea",
    rows: 2,
    light: true,
    placeholder: "Short bio (optional)"
  }, f('bio')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Email"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "email",
    placeholder: "email@example.com (optional)"
  }, f('email')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Phone"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "tel",
    placeholder: "+1 555 000 0000 (optional)"
  }, f('phone')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Address"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    placeholder: "Location (optional)"
  }, f('address')))));
}

// ProfileSetupModal (first launch: not dismissable until a nickname exists) + UserProfileForm mode="modal"
function ProfileModal({
  existing,
  onClose,
  onSave
}) {
  const [v, setV] = React.useState(existing || {
    nickname: '',
    realName: '',
    bio: '',
    email: '',
    phone: '',
    address: ''
  });
  const [err, setErr] = React.useState('');
  const save = () => {
    if (!v.nickname.trim()) return setErr('Nickname is required.');
    onSave(v);
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: existing ? 'Edit profile' : 'Set up your Lobby profile',
    subtitle: "Your Lobby profile is stored locally. Only your nickname is required.",
    onClose: existing ? onClose : undefined,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, existing && /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: save
    }, "Save"))
  }, /*#__PURE__*/React.createElement(ProfileFields, {
    v: v,
    set: setV,
    err: err
  }));
}
function GroupProfileModal({
  group,
  onClose
}) {
  const [anon, setAnon] = React.useState(false);
  const [shown, setShown] = React.useState([]);
  const labels = {
    realName: 'Real name',
    bio: 'Bio',
    email: 'Email',
    phone: 'Phone',
    address: 'Address'
  };
  const tog = k => setShown(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k]);
  return /*#__PURE__*/React.createElement(Modal, {
    width: "sm",
    title: "Group profile",
    subtitle: "Choose how you appear to other members in this group.",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Skip"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: onClose
    }, "Save"))
  }, /*#__PURE__*/React.createElement(Check, {
    checked: anon,
    onChange: () => setAnon(!anon)
  }, "Appear anonymously (pseudonym only)"), !anon && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('gray-500'),
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    }
  }, "Also share from your Lobby profile:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, Object.keys(labels).filter(k => PROFILE[k]).map(k => /*#__PURE__*/React.createElement(Check, {
    key: k,
    checked: shown.includes(k),
    onChange: () => tog(k)
  }, labels[k], ": ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, PROFILE[k]))))));
}
Object.assign(window, {
  PROFILE,
  ProfileModal,
  GroupProfileModal,
  ProfileFields
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/Profile.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/Shell.kit.jsx
try { (() => {
function SideForm({
  title,
  placeholder,
  onSubmit,
  onCancel,
  busyLabel,
  label,
  validate
}) {
  const [v, setV] = React.useState('');
  const [err, setErr] = React.useState('');
  const go = () => {
    const e = validate(v);
    if (e) return setErr(e);
    onSubmit(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 6px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, title), /*#__PURE__*/React.createElement(Input, {
    dense: true,
    autoFocus: true,
    value: v,
    onChange: e => setV(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') go();
    },
    placeholder: placeholder,
    style: {
      marginBottom: 6
    }
  }), err && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 12,
      color: rgb('red-600')
    }
  }, err), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: go,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '4px 8px',
      fontSize: 12,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'inherit'
    }
  }, label), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onCancel,
    hover: {
      background: rgb('gray-100')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: 'transparent',
      padding: '4px 8px',
      fontSize: 12,
      color: rgb('gray-500'),
      fontFamily: 'inherit'
    }
  }, "Cancel")));
}
function Sidebar({
  route,
  go,
  groups,
  hasProfile = true,
  onOpenProfile,
  form,
  setForm,
  onCreateGroup,
  onJoinGroup
}) {
  const [copied, setCopied] = React.useState(null);
  const [hoverG, setHoverG] = React.useState(null);
  const navItem = active => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    border: 0,
    cursor: 'pointer',
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'background-color 150ms, color 150ms',
    background: active ? '#fff' : 'transparent',
    color: active ? rgb('gray-900') : rgb('gray-700'),
    boxShadow: active ? 'var(--ndo-shadow-sm)' : 'none'
  });
  const hov = {
    background: '#fff',
    color: rgb('gray-900')
  };
  const lobbyActive = route.view === 'lobby';
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Primary",
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '13rem',
      flexShrink: 0,
      borderRight: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50'),
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => go({
      view: 'lobby'
    }),
    hover: lobbyActive ? null : hov,
    style: {
      ...navItem(lobbyActive),
      marginBottom: 12,
      padding: '6px 8px',
      fontWeight: 500,
      color: lobbyActive ? rgb('gray-900') : rgb('gray-600')
    }
  }, "Browse NDOs"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.025em',
      color: rgb('gray-400'),
      textTransform: 'uppercase'
    }
  }, "Groups"), groups.length > 0 ? /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '0 0 8px',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, groups.map(g => {
    const a = route.view === 'group' && route.id === g.id;
    return /*#__PURE__*/React.createElement("li", {
      key: g.id,
      onMouseEnter: () => setHoverG(g.id),
      onMouseLeave: () => setHoverG(null),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(Hoverable, {
      onClick: () => go({
        view: 'group',
        id: g.id
      }),
      hover: a ? null : hov,
      style: {
        ...navItem(a),
        flex: 1,
        minWidth: 0,
        padding: '4px 8px',
        fontWeight: a ? 500 : 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, g.name), /*#__PURE__*/React.createElement(Hoverable, {
      title: "Copy invite link",
      onClick: () => {
        setCopied(g.id);
        setTimeout(() => setCopied(null), 2000);
      },
      hover: {
        background: '#fff',
        color: rgb('blue-600')
      },
      style: {
        flexShrink: 0,
        border: 0,
        borderRadius: 4,
        background: 'transparent',
        padding: '2px 6px',
        fontSize: 12,
        color: rgb('gray-400'),
        cursor: 'pointer',
        opacity: hoverG === g.id || copied === g.id ? 1 : 0,
        transition: 'opacity 150ms'
      }
    }, copied === g.id ? '✓' : '⎘'));
  })) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 12,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "No groups yet."), form === 'create' ? /*#__PURE__*/React.createElement(SideForm, {
    title: "New group",
    placeholder: "Group name",
    label: "Create",
    validate: v => v.trim() ? '' : 'Group name is required.',
    onSubmit: v => {
      setForm(null);
      onCreateGroup(v.trim());
    },
    onCancel: () => setForm(null)
  }) : /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setForm('create'),
    hover: {
      background: '#fff'
    },
    style: {
      ...navItem(false),
      marginBottom: 4,
      display: 'flex',
      gap: 4,
      padding: '6px 8px',
      fontSize: 12,
      color: rgb('blue-600')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "+"), " New Group"), form === 'join' ? /*#__PURE__*/React.createElement(SideForm, {
    title: "Join group",
    placeholder: "Paste invite link",
    label: "Join",
    validate: v => !v.trim() ? 'Paste an invite link or code.' : v.includes('group') ? '' : 'Invalid invite code.',
    onSubmit: () => {
      setForm(null);
      onJoinGroup();
    },
    onCancel: () => setForm(null)
  }) : /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setForm('join'),
    hover: {
      background: '#fff'
    },
    style: {
      ...navItem(false),
      display: 'flex',
      gap: 4,
      padding: '6px 8px',
      fontSize: 12,
      color: rgb('gray-600')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "\u2192"), " Join Group"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      borderTop: `1px solid ${rgb('gray-200')}`,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onOpenProfile,
    hover: {
      background: '#fff',
      color: rgb('gray-700')
    },
    style: {
      ...navItem(false),
      padding: '6px 8px',
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, hasProfile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, "Tiberius"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      color: rgb('gray-400')
    }
  }, "\xB7 Edit profile")) : 'Set up profile')));
}
function ProfileBar({
  hasProfile = true,
  onOpenProfile
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: '8px 24px'
    }
  }, hasProfile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, "Signed in as ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, "Tiberius")), /*#__PURE__*/React.createElement(Hoverable, {
    "aria-label": "Edit profile",
    onClick: onOpenProfile,
    hover: {
      background: rgb('blue-50')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: 'transparent',
      padding: '4px 8px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('blue-600'),
      fontFamily: 'inherit'
    }
  }, "Edit")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No Lobby profile yet"), /*#__PURE__*/React.createElement(Hoverable, {
    "aria-label": "Open profile setup",
    onClick: onOpenProfile,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'inherit'
    }
  }, "Set up your profile")));
}
Object.assign(window, {
  Sidebar,
  ProfileBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/Shell.kit.jsx", error: String((e && e.message) || e) }); }

// design_handoff_nondominium_ds/ui_kits/app/data.kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const NDS = window.NondominiumDesignSystem_c29c2b;
const rgb = (t, a) => a != null ? `rgb(var(--ndo-${t}) / ${a})` : `rgb(var(--ndo-${t}))`;
const NDOS = [{
  hash: 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm',
  name: 'Community Solar Array',
  description: 'Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective. Access is open to all AccountableAgents.',
  lifecycle_stage: 'Active',
  resource_nature: 'Physical',
  property_regime: 'Nondominium',
  group: 'sensorica'
}, {
  hash: 'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
  name: 'Open Hardware CNC Bed',
  description: 'Community-maintained CNC router available for approved fabrication tasks.',
  lifecycle_stage: 'Stable',
  resource_nature: 'Physical',
  property_regime: 'Pool',
  group: 'sensorica'
}, {
  hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
  name: 'Distributed Sensor Design v3',
  description: 'Open-source IoT sensor design file for environmental monitoring in urban commons.',
  lifecycle_stage: 'Distributed',
  resource_nature: 'Digital',
  property_regime: 'Commons',
  group: 'ovn'
}, {
  hash: 'uhC0k1234abcdefghijklmnopqrstuvwx',
  name: 'Collective Laser Cutter',
  description: 'Shared laser cutter maintained by the Open Hardware collective.',
  lifecycle_stage: 'Prototype',
  resource_nature: 'Physical',
  property_regime: 'Collective',
  group: 'sensorica'
}, {
  hash: 'uhC0kSeEdLiBrArY7x2Qw9Rt5Yu3Io1P',
  name: 'Community Seed Library',
  description: 'Seasonal seed exchange paused over winter.',
  lifecycle_stage: 'Hibernating',
  hibernation_origin: 'Active',
  resource_nature: 'Physical',
  property_regime: 'CommonPool',
  group: 'ovn'
}, {
  hash: 'uhC0kLeGaCyFiRmWaReV2aB8cD6eF4gH',
  name: 'Legacy Sensor Firmware v2',
  description: 'Superseded firmware for the v2 sensor board.',
  lifecycle_stage: 'Deprecated',
  successor_ndo_hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
  resource_nature: 'Digital',
  property_regime: 'Commons',
  group: 'ovn'
}, {
  hash: 'uhC0kMeShNeTwOrKiDeA9z8y7x6w5v4u',
  name: 'Neighbourhood Mesh Network',
  description: 'Idea for a community-run wireless mesh.',
  lifecycle_stage: 'Ideation',
  resource_nature: 'Service',
  property_regime: 'Public',
  group: 'sensorica'
}];
const GROUPS = [{
  id: 'sensorica',
  name: 'Sensorica'
}, {
  id: 'ovn',
  name: 'Open Value Network'
}];
const MEMBERS = [{
  id: 'a',
  name: 'Tiberius',
  role: 'Member'
}, {
  id: 'b',
  name: 'Soushi',
  role: 'Member'
}, {
  id: 'c',
  name: 'Lynn',
  role: 'Member'
}];

// Per-NDO Layer 1/2 seed data (ResourcesTab, GovernanceTab, ActivityTab, TransitionHistoryPanel)
const SEED = {
  'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm': {
    specs: [{
      name: 'Community Solar Array v1.0',
      category: 'energy',
      scope: 'Public',
      description: 'Rooftop PV bank with shared inverter.',
      resources: [{
        quantity: 12,
        unit: 'kWp',
        state: 'InUse'
      }, {
        quantity: 8,
        unit: 'kWp',
        state: 'Available'
      }, {
        quantity: 1,
        unit: 'inverter',
        state: 'InMaintenance'
      }]
    }],
    rules: [{
      kind: 'UsageLimit',
      spec: 'Community Solar Array v1.0',
      payload: {
        max_duration_hours: 40,
        max_quantity_per_period: '',
        period_days: 7
      },
      enforced_by: 'AccountableAgent'
    }, {
      kind: 'AccessRequirement',
      spec: 'Community Solar Array v1.0',
      payload: {
        accessibility: 'Credentialed',
        required_role: 'AccountableAgent',
        min_affiliation: ''
      },
      enforced_by: ''
    }, {
      kind: 'MaintenanceSchedule',
      spec: 'Community Solar Array v1.0',
      payload: {
        interval_days: 90,
        required_role: 'Repair'
      },
      enforced_by: 'Repair'
    }],
    commitments: [{
      action: 'TransferCustody',
      due: '5/15/2026, 10:00:00 AM',
      note: 'Monthly collective distribution'
    }],
    events: [{
      action: 'Use',
      qty: 12,
      time: '3/9/2024, 4:00:00 PM',
      note: 'Annual output survey'
    }, {
      action: 'TransferCustody',
      qty: 4,
      time: '2/1/2024, 9:30:00 AM',
      note: ''
    }],
    history: [{
      from: 'Stable',
      to: 'Distributed',
      agent: 'uhCAk2vMp8X3nRwsQzLt',
      time: '1/12/2024, 2:10:00 PM',
      event: 'uhCkkE4vTx9pQ2mR7sLw'
    }, {
      from: 'Distributed',
      to: 'Active',
      agent: 'uhCAk2vMp8X3nRwsQzLt',
      time: '2/20/2024, 11:45:00 AM',
      event: 'uhCkkJ8nWq3cV6bY1zXa'
    }]
  }
};
const emptySeed = () => ({
  specs: [],
  rules: [],
  commitments: [],
  events: [],
  history: []
});
const kebab = s => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const ndoBadges = d => [{
  variant: 'lifecycle-' + kebab(d.lifecycle_stage),
  label: d.lifecycle_stage
}, {
  variant: d.property_regime === 'Public' ? 'neutral' : 'regime-' + kebab(d.property_regime),
  label: d.property_regime
}, {
  variant: 'nature-' + kebab(d.resource_nature),
  label: d.resource_nature
}];
function Hoverable({
  as = 'button',
  style,
  hover,
  children,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({}, rest, {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      ...style,
      ...(h ? hover : null)
    }
  }), children);
}
Object.assign(window, {
  NDS,
  rgb,
  NDOS,
  GROUPS,
  MEMBERS,
  SEED,
  emptySeed,
  kebab,
  ndoBadges,
  Hoverable
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_nondominium_ds/ui_kits/app/data.kit.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/A.jsx
try { (() => {
function MyNode({
  n,
  h,
  sel,
  sig,
  onClick,
  fresh
}) {
  const col = {
    Active: '#2EC4B6',
    Stable: '#2EC4B6',
    Distributed: '#8B5CF6',
    Prototype: '#F2B84B',
    Development: '#F2B84B',
    Specification: '#4C7BE0',
    Ideation: '#56706f',
    Hibernating: '#56706f',
    Deprecated: '#8B5CF6',
    EndOfLife: '#3a4a4a'
  }[n.stage];
  const r = 8 + Math.min(26, h * 7);
  const quiet = ['Ideation', 'Hibernating', 'EndOfLife'].includes(n.stage);
  return /*#__PURE__*/React.createElement("g", {
    onClick: onClick,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: n.x,
    cy: n.y,
    r: r * 4,
    fill: col,
    opacity: Math.min(.28, h * .07),
    style: {
      filter: 'blur(18px)',
      transition: 'all 600ms'
    }
  }), sel && /*#__PURE__*/React.createElement("circle", {
    cx: n.x,
    cy: n.y,
    r: r + 16,
    fill: "none",
    stroke: "#E6EFEE",
    strokeOpacity: ".5",
    strokeDasharray: "2 4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: n.x,
    cy: n.y,
    r: r,
    fill: "#0B1113",
    stroke: col,
    strokeWidth: 2,
    strokeDasharray: quiet ? '3 3' : null,
    style: {
      transition: 'r 600ms'
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: n.x,
    cy: n.y,
    r: r + 9,
    fill: "none",
    stroke: col,
    strokeOpacity: ".22"
  }), fresh && /*#__PURE__*/React.createElement("circle", {
    cx: n.x,
    cy: n.y,
    r: r,
    fill: "none",
    stroke: "#2EC4B6",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "r",
    from: r,
    to: r + 40,
    dur: "1.4s",
    repeatCount: "3"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    from: "1",
    to: "0",
    dur: "1.4s",
    repeatCount: "3"
  })), sig > 0 && /*#__PURE__*/React.createElement("circle", {
    cx: n.x + r * .75,
    cy: n.y - r * .75,
    r: "5",
    fill: "#F2B84B"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "1;.35;1",
    dur: "1.8s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("text", {
    x: n.x,
    y: n.y + r + 24,
    textAnchor: "middle",
    fontSize: "13",
    fontWeight: "600",
    fill: quiet ? '#8CA3A2' : '#E6EFEE'
  }, n.name), /*#__PURE__*/React.createElement("text", {
    x: n.x,
    y: n.y + r + 40,
    textAnchor: "middle",
    fontSize: "11",
    fill: sig ? '#F2B84B' : '#8CA3A2'
  }, n.stage, " \xB7 ", sig ? sig + ' signal' + (sig > 1 ? 's' : '') : Math.round(h * 10) / 10 + ' heat'));
}
function MyField({
  P,
  sel,
  setSel,
  decay,
  mode,
  group
}) {
  const nd = P.s.ndos.filter(n => group === 'all' || n.group === group);
  const ids = new Set(nd.map(n => n.id));
  const kinds = {
    Trails: ['use', 'hard', 'cite'],
    Custody: ['use'],
    Citations: ['cite', 'hard']
  }[mode];
  const style = {
    use: ['#2EC4B6', null],
    cite: ['#8B5CF6', null],
    hard: ['#4C7BE0', '1 7']
  };
  const recent = new Set(P.s.traces.filter(t => t.ago === 0 || t.mine && t.status !== 'validated').map(t => t.ndo));
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: "0 0 836 764",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    strokeLinecap: "round"
  }, P.s.links.filter(([a, b, k]) => ids.has(a) && ids.has(b) && kinds.includes(k)).map(([a, b, k], i) => {
    const A = P.q.ndo(a),
      B = P.q.ndo(b);
    const w = 1 + Math.min(5, (P.q.heatOf(a, decay) + P.q.heatOf(b, decay)) / 2.2);
    const mx = (A.x + B.x) / 2 + (A.y - B.y) * .18,
      my = (A.y + B.y) / 2 + (B.x - A.x) * .18;
    const on = sel === a || sel === b;
    return /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`,
      stroke: style[k][0],
      strokeWidth: w,
      strokeDasharray: style[k][1],
      opacity: on ? .85 : .35,
      style: {
        transition: 'all 500ms'
      }
    });
  })), nd.map(n => /*#__PURE__*/React.createElement(MyNode, {
    key: n.id,
    n: n,
    h: P.q.heatOf(n.id, decay),
    sel: sel === n.id,
    sig: P.q.signalsOf(n.id).length,
    fresh: recent.has(n.id),
    onClick: () => setSel(n.id)
  })));
}
function MySignal({
  g,
  P,
  setM,
  showNdo
}) {
  const c = {
    hands: '#F2B84B',
    avail: '#2EC4B6',
    eyes: '#8B5CF6'
  }[g.lane];
  const mine = (g.takenBy || []).includes(ME.id);
  return /*#__PURE__*/React.createElement("div", {
    className: "sig"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse",
    style: {
      background: c,
      boxShadow: `0 0 0 4px ${c}22`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, showNdo && /*#__PURE__*/React.createElement("small", {
    style: {
      display: 'block',
      color: '#56706f'
    }
  }, P.q.ndo(g.ndo).name), /*#__PURE__*/React.createElement("b", null, g.title), /*#__PURE__*/React.createElement("small", null, g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : '', g.sub), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      setM({
        type: 'why',
        sig: g,
        ndo: g.ndo
      });
    },
    style: {
      display: 'block',
      fontSize: 11,
      marginTop: 4
    }
  }, "why am I seeing this?")), mine && g.lane === 'avail' ? /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      opacity: .5
    }
  }, "In use") : /*#__PURE__*/React.createElement("button", {
    onClick: () => P.actions.pickUp(g)
  }, g.verb));
}
function MyTrace({
  t,
  P,
  decay,
  showNdo
}) {
  const f = freshness(t.ago, decay);
  const op = {
    fresh: 1,
    warm: .85,
    fading: .6,
    cold: .35
  }[f];
  const st = t.status !== 'validated' ? /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: t.status === 'queued' ? '#F2B84B' : '#2EC4B6',
      fontSize: 10
    }
  }, t.status) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "trace",
    style: {
      opacity: op
    },
    title: t.hops.length ? 'reached you via ' + t.hops.join(' → ') : ''
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: t.status === 'queued' ? '#F2B84B' : '#2EC4B6'
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, P.q.agent(t.agent)), " ", t.text, showNdo && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#56706f'
    }
  }, " \xB7 ", P.q.ndo(t.ndo).name), t.note && /*#__PURE__*/React.createElement("em", {
    style: {
      display: 'block',
      color: '#8CA3A2',
      marginTop: 2
    }
  }, "\u201C", t.note, "\u201D")), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, st || fmtAgo(t.ago)));
}
function MyPanel({
  P,
  id,
  setM,
  decay,
  onClose
}) {
  const n = P.q.ndo(id);
  const tr = P.q.tracesOf(id),
    sg = P.q.signalsOf(id),
    sl = P.q.slotsOf(id);
  const bars = Array.from({
    length: 14
  }, (_, i) => tr.filter(t => Math.floor(t.ago / 1440 / 2) === 13 - i).length);
  const mx = Math.max(1, ...bars);
  return /*#__PURE__*/React.createElement("aside", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kick"
  }, "NDO \xB7 ", n.hash), /*#__PURE__*/React.createElement("button", {
    className: "x",
    onClick: onClose
  }, "\u2715")), /*#__PURE__*/React.createElement("h1", null, n.name), /*#__PURE__*/React.createElement("div", {
    className: "tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag l"
  }, n.stage), /*#__PURE__*/React.createElement("span", {
    className: "tag r"
  }, n.regime), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, n.nature), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, n.rivalry)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: '#8CA3A2',
      margin: '0 0 14px',
      lineHeight: 1.5
    }
  }, n.desc), /*#__PURE__*/React.createElement("div", {
    className: "kick"
  }, "Trail strength \xB7 28 days"), /*#__PURE__*/React.createElement("div", {
    className: "strength"
  }, bars.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: Math.max(6, b / mx * 100) + '%',
      opacity: b ? .4 + i / 22 : .12
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", null, "fading"), /*#__PURE__*/React.createElement("span", null, "fresh")), /*#__PURE__*/React.createElement("div", {
    className: "acts"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setM({
      type: 'note',
      ndo: id
    })
  }, "Leave a trace"), NEXT_STAGE[n.stage] && /*#__PURE__*/React.createElement("button", {
    onClick: () => setM({
      type: 'advance',
      ndo: id
    })
  }, "Advance lifecycle")), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("h3", null, "Signals on this resource ", /*#__PURE__*/React.createElement("span", null, sg.length, " open")), sg.length ? sg.map(g => /*#__PURE__*/React.createElement(MySignal, {
    key: g.id,
    g: g,
    P: P,
    setM: setM
  })) : /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "No open signals. The resource is quiet.")), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("h3", null, "Traces ", /*#__PURE__*/React.createElement("span", null, tr.length)), tr.slice(0, 8).map(t => /*#__PURE__*/React.createElement(MyTrace, {
    key: t.id,
    t: t,
    P: P,
    decay: decay
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("h3", null, "Attached by the network ", /*#__PURE__*/React.createElement("span", null, sl.length, " slots")), /*#__PURE__*/React.createElement("div", {
    className: "slots"
  }, sl.map(l => /*#__PURE__*/React.createElement("span", {
    key: l.id,
    className: 'slot ' + l.trust,
    title: 'by ' + P.q.agent(l.by) + ' · ' + l.trust
  }, l.type, " \xB7 ", l.label)), /*#__PURE__*/React.createElement("span", {
    className: "slot add",
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, "+ attach"))));
}
function MyceliumApp() {
  const P = useProto();
  const [m, setM] = useModals();
  const [view, setView] = React.useState('field');
  const [sel, setSel] = React.useState('sol');
  const [decay, setDecay] = React.useState(14);
  const [mode, setMode] = React.useState('Trails');
  const [group, setGroup] = React.useState('all');
  const openSig = P.s.signals.filter(g => !g.done);
  const nav = [['field', 'Field', {}], ['signals', 'Signals', {
    borderStyle: 'dashed'
  }], ['traces', 'Traces', {
    borderRadius: 3
  }], ['me', 'You', {
    background: '#2a3e40',
    border: 0
  }]];
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo",
    title: "Nondominium"
  }), nav.map(([k, l, st]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: 'ri' + (view === k ? ' on' : ''),
    onClick: () => setView(k),
    style: k === 'me' ? {
      marginTop: 'auto'
    } : null
  }, /*#__PURE__*/React.createElement("span", {
    className: "g",
    style: st
  }), l, k === 'signals' && /*#__PURE__*/React.createElement("em", {
    className: "cnt"
  }, openSig.length)))), /*#__PURE__*/React.createElement("main", {
    className: "field"
  }, view === 'field' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, [['all', 'All groups'], ...P.s.groups.map(g => [g.id, g.name])].map(([k, l]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: group === k ? 'on' : '',
    onClick: () => setGroup(k)
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "seg",
    style: {
      marginLeft: 'auto'
    }
  }, ['Trails', 'Custody', 'Citations'].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: mode === k ? 'on' : '',
    onClick: () => setMode(k)
  }, k))), /*#__PURE__*/React.createElement("button", {
    className: "new",
    onClick: () => setM({
      type: 'create',
      after: id => setSel(id)
    })
  }, "+ Declare NDO")), /*#__PURE__*/React.createElement(MyField, {
    P: P,
    sel: sel,
    setSel: setSel,
    decay: decay,
    mode: mode,
    group: group
  }), /*#__PURE__*/React.createElement("div", {
    className: "foot2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "legend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#2EC4B6'
    }
  }), "use & custody"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#8B5CF6'
    }
  }), "citation"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: 'repeating-linear-gradient(90deg,#4C7BE0 0 2px,transparent 2px 8px)'
    }
  }), "hard link"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#F2B84B',
      width: 8,
      height: 8,
      borderRadius: 4
    }
  }), "open signal")), /*#__PURE__*/React.createElement("div", {
    className: "decay"
  }, "Trails fade over ", /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "90",
    value: decay,
    onChange: e => setDecay(+e.target.value)
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, decay, " d")))), view === 'signals' && /*#__PURE__*/React.createElement("div", {
    className: "list"
  }, /*#__PURE__*/React.createElement("h2", null, "Open signals"), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Emitted by resource state and rules across your groups. Pick one up to leave a trace."), openSig.map(g => /*#__PURE__*/React.createElement(MySignal, {
    key: g.id,
    g: g,
    P: P,
    setM: setM,
    showNdo: true
  })), !openSig.length && /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "Nothing is asking for attention right now.")), view === 'traces' && /*#__PURE__*/React.createElement("div", {
    className: "list"
  }, /*#__PURE__*/React.createElement("h2", null, "Traces reaching your node"), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Hover a trace to see the peer path it took. Opacity shows freshness at the current fade setting (", decay, " d)."), P.s.traces.map(t => /*#__PURE__*/React.createElement(MyTrace, {
    key: t.id,
    t: t,
    P: P,
    decay: decay,
    showNdo: true
  }))), view === 'me' && /*#__PURE__*/React.createElement("div", {
    className: "list"
  }, /*#__PURE__*/React.createElement("h2", null, ME.name), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Roles: ", ME.roles.join(', '), ". Your traces live on your own source chain."), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("h3", null, "Private participation receipts ", /*#__PURE__*/React.createElement("span", null, P.s.receipts.length)), P.s.receipts.length ? P.s.receipts.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "trace"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: '#8B5CF6'
    }
  }), /*#__PURE__*/React.createElement("span", null, "\u25C6 ", r.text, " \xB7 ", P.q.ndo(r.ndo).name), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "private"))) : /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "Pick up a \u201CNeeds hands\u201D or \u201CNeeds eyes\u201D signal to earn a receipt.")), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("h3", null, "Your traces ", /*#__PURE__*/React.createElement("span", null, P.s.traces.filter(t => t.agent === ME.id).length)), P.s.traces.filter(t => t.agent === ME.id).map(t => /*#__PURE__*/React.createElement(MyTrace, {
    key: t.id,
    t: t,
    P: P,
    decay: decay,
    showNdo: true
  }))), /*#__PURE__*/React.createElement("button", {
    className: "new",
    style: {
      marginTop: 20
    },
    onClick: P.actions.reset
  }, "Reset prototype data"))), view === 'field' && sel && P.q.ndo(sel) ? /*#__PURE__*/React.createElement(MyPanel, {
    P: P,
    id: sel,
    setM: setM,
    decay: decay,
    onClose: () => setSel(null)
  }) : /*#__PURE__*/React.createElement("aside", {
    className: "panel empty-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "Select an NDO in the field to see its traces, signals and attachments.")), /*#__PURE__*/React.createElement("div", {
    className: "status"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.toggleOffline,
    style: {
      cursor: 'pointer'
    },
    title: "Toggle to simulate going offline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ok",
    style: {
      background: P.s.offline ? '#F2B84B' : '#2EC4B6'
    }
  }), "Your node \xB7 ", P.s.offline ? 'offline, traces queue locally' : 'online'), /*#__PURE__*/React.createElement("span", null, P.s.offline ? 0 : 23, " peers gossiping"), /*#__PURE__*/React.createElement("span", null, P.s.traces.filter(t => t.status === 'queued').length ? P.s.traces.filter(t => t.status === 'queued').length + ' queued' : 'Last trace reached you via Lynn → Fablab node'), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    },
    className: "mono"
  }, "DHT \u27F3 ", P.s.offline ? 'paused' : '98% consistent')), /*#__PURE__*/React.createElement(ModalHost, {
    m: m,
    setM: setM,
    P: P
  }), /*#__PURE__*/React.createElement(PToasts, {
    toasts: P.toasts,
    onDrop: P.dropToast
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(MyceliumApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/A.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/B.jsx
try { (() => {
function FnInk({
  tr
}) {
  const b = Array.from({
    length: 7
  }, (_, i) => tr.filter(t => Math.floor(t.ago / 1440 / 4) === 6 - i).length);
  const mx = Math.max(1, ...b);
  return /*#__PURE__*/React.createElement("span", {
    className: "ink"
  }, b.map((v, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: Math.max(3, v / mx * 100) + '%',
      opacity: v ? 1 : .25
    }
  })));
}
function FnIndex({
  P,
  sel,
  setSel,
  q,
  setQ,
  setM
}) {
  const match = n => !q || (n.name + n.regime + n.stage + n.nature).toLowerCase().includes(q.toLowerCase());
  return /*#__PURE__*/React.createElement("aside", {
    className: "index"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mark"
  }), /*#__PURE__*/React.createElement("span", null, "Nondominium")), /*#__PURE__*/React.createElement("input", {
    className: "search",
    placeholder: "Search the commons register\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }), P.s.groups.map(g => {
    const list = P.s.ndos.filter(n => n.group === g.id && match(n));
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: g.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "idxh"
    }, g.name, " \xB7 register"), list.map(n => {
      const quiet = ['Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage);
      const sig = P.q.signalsOf(n.id).length;
      return /*#__PURE__*/React.createElement("div", {
        key: n.id,
        className: 'entry' + (sel === n.id ? ' on' : ''),
        onClick: () => setSel(n.id)
      }, /*#__PURE__*/React.createElement("b", {
        style: quiet ? {
          color: 'var(--mute)'
        } : null
      }, n.name), /*#__PURE__*/React.createElement("small", null, n.stage, " \xB7 ", n.regime, sig ? /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--rust)'
        }
      }, " \xB7 ", sig, " left for you") : ''), /*#__PURE__*/React.createElement(FnInk, {
        tr: P.q.tracesOf(n.id)
      }));
    }), !list.length && /*#__PURE__*/React.createElement("div", {
      className: "foot",
      style: {
        margin: '6px 0'
      }
    }, "No entries match."));
  }), /*#__PURE__*/React.createElement("div", {
    className: "idxfoot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn",
    onClick: () => setM({
      type: 'create',
      after: setSel
    })
  }, "Open a new entry"), /*#__PURE__*/React.createElement("span", {
    className: "foot"
  }, "Ink bars show traces per 4 days, newest on the right.")));
}
function FnEntry({
  P,
  id,
  setM,
  view,
  setView
}) {
  const n = P.q.ndo(id);
  const tr = P.q.tracesOf(id);
  const author = tr[tr.length - 1];
  return /*#__PURE__*/React.createElement("main", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kick"
  }, "Entry \u2116 ", n.hash, " \xB7 opened by ", author ? P.q.agent(author.agent) : '—'), /*#__PURE__*/React.createElement("h1", null, n.name), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, n.desc || 'No description yet.'), /*#__PURE__*/React.createElement("div", {
    className: "stamp"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "Stage"), /*#__PURE__*/React.createElement("b", null, n.stage)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "Regime"), /*#__PURE__*/React.createElement("b", null, n.regime)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "Nature"), /*#__PURE__*/React.createElement("b", null, n.nature)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "Rivalry"), /*#__PURE__*/React.createElement("b", null, n.rivalry))), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, [['trail', 'The trail'], ['rules', 'Rules & instances'], ['attached', 'Attached']].map(([k, l]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: view === k ? 'on' : '',
    onClick: () => setView(k)
  }, l)), /*#__PURE__*/React.createElement("div", {
    className: "acts2"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setM({
      type: 'note',
      ndo: id
    })
  }, "Write in the margin"), NEXT_STAGE[n.stage] && /*#__PURE__*/React.createElement("span", {
    onClick: () => setM({
      type: 'advance',
      ndo: id
    })
  }, "Turn the page (advance)"))), view === 'trail' && /*#__PURE__*/React.createElement("div", {
    className: "trail"
  }, tr.map(t => {
    const f = freshness(t.ago);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: 'ev ' + (f === 'fresh' || t.status !== 'validated' ? 'fresh' : ''),
      style: {
        opacity: f === 'cold' ? .5 : f === 'fading' ? .75 : 1
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, P.q.agent(t.agent), " ", t.text), /*#__PURE__*/React.createElement("span", {
      className: "when"
    }, t.status === 'validated' ? t.ago < 1 ? 'just now' : fmtAgo(t.ago) + ' ago' : STAGE_LABEL[t.status], t.hops.length ? ' · reached you via ' + t.hops.join(' → ') : '')), /*#__PURE__*/React.createElement("div", null, t.note && /*#__PURE__*/React.createElement("div", {
      className: "margin"
    }, "\u201C", t.note, "\u201D", /*#__PURE__*/React.createElement("small", null, "\u2014 ", P.q.agent(t.agent), ", note on this trace"))));
  }), !tr.length && /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "No traces yet. Be the first to leave one.")), view === 'rules' && /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "h3"
  }, "Rules in force"), (P.s.rules[id] || []).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "sl"
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, v))), !(P.s.rules[id] || []).length && /*#__PURE__*/React.createElement("p", {
    className: "foot"
  }, "No governance rules. Default regime behaviour applies.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "h3"
  }, "Instances"), (P.s.instances[id] || []).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "sl"
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, v))), !(P.s.instances[id] || []).length && /*#__PURE__*/React.createElement("p", {
    className: "foot"
  }, ['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage) ? 'Instances cannot be added at stage ' + n.stage + '.' : 'No instances yet.'))), view === 'attached' && /*#__PURE__*/React.createElement("div", null, P.q.slotsOf(id).map(l => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    className: "sl",
    style: l.trust === 'filtered' ? {
      opacity: .45
    } : null
  }, /*#__PURE__*/React.createElement("span", null, l.label, l.fresh && /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--teal)',
      fontStyle: 'normal'
    }
  }, " \xB7 new")), /*#__PURE__*/React.createElement("span", null, l.type, " \xB7 by ", P.q.agent(l.by), " \xB7 ", l.trust))), /*#__PURE__*/React.createElement("span", {
    className: "btn",
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, "Attach a tool")));
}
function FnSide({
  P,
  id,
  setM
}) {
  const sg = P.q.signalsOf(id);
  const all = P.s.signals.filter(g => !g.done && g.ndo !== id);
  return /*#__PURE__*/React.createElement("aside", {
    className: "side"
  }, /*#__PURE__*/React.createElement("h3", null, "Left here for you"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Open signals any qualified agent can take up."), sg.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "note"
  }, /*#__PURE__*/React.createElement("b", null, g.title), /*#__PURE__*/React.createElement("small", null, g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : '', g.sub), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "act",
    onClick: () => P.actions.pickUp(g)
  }, g.verb, " \u2192"), " ", /*#__PURE__*/React.createElement("span", {
    className: "why",
    onClick: () => setM({
      type: 'why',
      sig: g,
      ndo: g.ndo
    })
  }, "why?"))), !sg.length && /*#__PURE__*/React.createElement("div", {
    className: "note"
  }, /*#__PURE__*/React.createElement("small", null, "Nothing left here. The entry is quiet.")), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 26
    }
  }, "Elsewhere in the register"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, all.length, " other open signals"), all.slice(0, 3).map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "note"
  }, /*#__PURE__*/React.createElement("small", null, P.q.ndo(g.ndo).name), /*#__PURE__*/React.createElement("b", null, g.title), /*#__PURE__*/React.createElement("span", {
    className: "act",
    onClick: () => P.actions.pickUp(g)
  }, g.verb, " \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "receipts"
  }, /*#__PURE__*/React.createElement("h3", null, "Your receipts"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Private to your source chain."), P.s.receipts.slice(0, 4).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "sl"
  }, /*#__PURE__*/React.createElement("span", null, "\u25C6 ", r.text), /*#__PURE__*/React.createElement("span", null, P.q.ndo(r.ndo).name.split(' ')[0]))), !P.s.receipts.length && /*#__PURE__*/React.createElement("div", {
    className: "foot"
  }, "None yet.")), /*#__PURE__*/React.createElement("div", {
    className: "foot mono",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.toggleOffline,
    style: {
      cursor: 'pointer',
      color: P.s.offline ? 'var(--rust)' : 'inherit'
    }
  }, P.s.offline ? '○ offline · writing locally' : '● 23 peers hold this entry'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.reset,
    style: {
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  }, "reset prototype")));
}
function FieldNotesApp() {
  const P = useProto();
  const [m, setM] = useModals();
  const [sel, setSel] = React.useState('sol');
  const [q, setQ] = React.useState('');
  const [view, setView] = React.useState('trail');
  React.useEffect(() => setView('trail'), [sel]);
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(FnIndex, {
    P: P,
    sel: sel,
    setSel: setSel,
    q: q,
    setQ: setQ,
    setM: setM
  }), /*#__PURE__*/React.createElement(FnEntry, {
    P: P,
    id: sel,
    setM: setM,
    view: view,
    setView: setView
  }), /*#__PURE__*/React.createElement(FnSide, {
    P: P,
    id: sel,
    setM: setM
  }), /*#__PURE__*/React.createElement(ModalHost, {
    m: m,
    setM: setM,
    P: P
  }), /*#__PURE__*/React.createElement(PToasts, {
    toasts: P.toasts,
    onDrop: P.dropToast
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(FieldNotesApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/B.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/C.jsx
try { (() => {
const IN_COL = {
  use: '#119C8F',
  custody: '#2E5FD1',
  cite: '#7445E0',
  work: '#E0A21A',
  note: '#46514F',
  attach: '#7445E0',
  lifecycle: '#141A1C'
};
const LED = {
  InUse: '#2E5FD1',
  Available: '#119C8F',
  Maintenance: '#E0A21A',
  InStorage: '#7C8886',
  InTransit: '#E0A21A'
};
function InBench({
  P,
  id,
  setM,
  trust,
  setTrust,
  pick,
  setPick
}) {
  const n = P.q.ndo(id);
  const all = P.q.slotsOf(id);
  const shown = all.filter(l => trust === 'open' || l.trust !== 'filtered');
  const sockets = [...shown, {
    id: 'open',
    open: true
  }];
  const W = 980,
    H = 470,
    cx = W / 2,
    cy = H / 2;
  const pos = sockets.map((l, i) => {
    const left = i % 2 === 0;
    const row = Math.floor(i / 2);
    const rows = Math.ceil(sockets.length / 2);
    const y = cy + (row - (rows - 1) / 2) * 110;
    return {
      l,
      left,
      x: left ? 60 : W - 230,
      y
    };
  });
  const sig = P.q.signalsOf(id).length;
  return /*#__PURE__*/React.createElement("main", {
    className: "bench"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, "surface of attachment"), /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, shown.length, " attached \xB7 ", all.length - shown.length, " filtered"), /*#__PURE__*/React.createElement("span", {
    className: "chip tog",
    onClick: () => setTrust(trust === 'open' ? 'strict' : 'open')
  }, "trust filter: ", /*#__PURE__*/React.createElement("b", null, trust === 'open' ? 'show all' : 'custodians + accountable')), /*#__PURE__*/React.createElement("span", {
    className: "btn",
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, "+ Attach capability")), /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${W} ${H}`,
    style: {
      position: 'absolute',
      left: 0,
      top: 50,
      height: 'calc(100% - 290px)'
    }
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    strokeWidth: "1.5"
  }, pos.map(({
    l,
    left,
    x,
    y
  }) => {
    const sx = left ? x + 170 : x;
    const mx = left ? cx - 140 : cx + 140;
    const on = pick === l.id;
    return /*#__PURE__*/React.createElement("path", {
      key: l.id,
      d: `M${left ? cx - 90 : cx + 90} ${cy} H${mx} V${y} H${sx}`,
      stroke: l.open ? '#7C8886' : l.trust === 'filtered' ? '#D8452F' : on ? '#119C8F' : '#141A1C',
      strokeWidth: on ? 2.5 : 1.5,
      strokeDasharray: l.open || l.trust !== 'trusted' ? '4 4' : null
    });
  })), /*#__PURE__*/React.createElement("rect", {
    x: cx - 90,
    y: cy - 80,
    width: "180",
    height: "160",
    rx: "10",
    fill: "#fff",
    stroke: "#141A1C",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: cx - 78,
    y: cy - 68,
    width: "156",
    height: "136",
    rx: "6",
    fill: "none",
    stroke: "#D6DDDB"
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy - 22,
    textAnchor: "middle",
    fontSize: "10",
    fill: "#7C8886"
  }, "NDO IDENTITY"), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 2,
    textAnchor: "middle",
    fontSize: "14",
    fontWeight: "700",
    fill: "#141A1C"
  }, n.name.length > 20 ? n.name.slice(0, 19) + '…' : n.name), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 22,
    textAnchor: "middle",
    fontSize: "10",
    fill: "#7C8886"
  }, n.hash), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy + 48,
    r: "5",
    fill: sig ? '#E0A21A' : '#119C8F'
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "1;.3;1",
    dur: "1.6s",
    repeatCount: "indefinite"
  })), pos.map(({
    l,
    left,
    x,
    y
  }) => l.open ? /*#__PURE__*/React.createElement("g", {
    key: "open",
    style: {
      cursor: 'pointer'
    },
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y - 24,
    width: "170",
    height: "48",
    rx: "6",
    fill: "#F7F9F8",
    stroke: "#7C8886",
    strokeDasharray: "4 4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: left ? x + 170 : x,
    cy: y,
    r: "5",
    fill: "#fff",
    stroke: "#7C8886"
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 14,
    y: y - 4,
    fontSize: "11",
    fontWeight: "700",
    fill: "#7C8886"
  }, "open socket"), /*#__PURE__*/React.createElement("text", {
    x: x + 14,
    y: y + 12,
    fontSize: "11",
    fill: "#7C8886"
  }, "click to attach")) : /*#__PURE__*/React.createElement("g", {
    key: l.id,
    style: {
      cursor: 'pointer'
    },
    onClick: () => setPick(pick === l.id ? null : l.id)
  }, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y - 24,
    width: "170",
    height: "48",
    rx: "6",
    fill: pick === l.id ? '#E6F5F3' : '#fff',
    stroke: l.trust === 'filtered' ? '#D8452F' : '#141A1C',
    strokeDasharray: l.trust === 'filtered' ? '4 4' : null
  }), /*#__PURE__*/React.createElement("circle", {
    cx: left ? x + 170 : x,
    cy: y,
    r: "5",
    fill: l.trust === 'filtered' ? '#fff' : l.fresh ? '#119C8F' : '#141A1C',
    stroke: l.trust === 'filtered' ? '#D8452F' : 'none'
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 14,
    y: y - 4,
    fontSize: "11",
    fontWeight: "700",
    fill: l.trust === 'filtered' ? '#D8452F' : '#141A1C'
  }, l.type), /*#__PURE__*/React.createElement("text", {
    x: x + 14,
    y: y + 12,
    fontSize: "11",
    fill: "#7C8886"
  }, (l.label + ' · ' + P.q.agent(l.by)).slice(0, 24))))), pick && all.find(l => l.id === pick) && (() => {
    const l = all.find(x => x.id === pick);
    return /*#__PURE__*/React.createElement("div", {
      className: "pop"
    }, /*#__PURE__*/React.createElement("b", null, l.type), /*#__PURE__*/React.createElement("span", null, l.label), /*#__PURE__*/React.createElement("span", null, "attached by ", P.q.agent(l.by), " \xB7 trust: ", l.trust), /*#__PURE__*/React.createElement("span", {
      className: "lnk",
      onClick: () => setPick(null)
    }, "close"));
  })(), /*#__PURE__*/React.createElement(InScope, {
    P: P,
    id: id
  }));
}
function InScope({
  P,
  id
}) {
  const tr = P.q.tracesOf(id);
  const kinds = ['use', 'custody', 'cite', 'work'];
  const days = 30;
  const series = kinds.map(k => Array.from({
    length: days
  }, (_, d) => tr.filter(t => (t.kind === k || k === 'work' && t.kind === 'note') && Math.floor(t.ago / 1440) === days - 1 - d).length));
  const week = tr.filter(t => t.ago < 10080).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "scope"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("b", null, "Trace scope \xB7 30 days"), kinds.map(k => /*#__PURE__*/React.createElement("span", {
    key: k
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: IN_COL[k]
    }
  }), k)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, week, " traces / 7 d \xB7 ", tr.length, " total")), /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "120",
    viewBox: "0 0 900 120",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: "#D6DDDB"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "30",
    x2: "900",
    y2: "30"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "60",
    x2: "900",
    y2: "60"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "90",
    x2: "900",
    y2: "90"
  })), series.map((s, i) => s.map((v, d) => v ? /*#__PURE__*/React.createElement("rect", {
    key: i + '-' + d,
    x: d * 30 + i * 6 + 3,
    y: 116 - v * 26,
    width: "5",
    height: v * 26,
    fill: IN_COL[kinds[i]]
  }) : null)), /*#__PURE__*/React.createElement("line", {
    x1: "897",
    y1: "0",
    x2: "897",
    y2: "120",
    stroke: "#119C8F",
    strokeDasharray: "2 3"
  })), /*#__PURE__*/React.createElement("div", {
    className: "axis"
  }, /*#__PURE__*/React.createElement("span", null, "30 d ago"), /*#__PURE__*/React.createElement("span", null, "now")));
}
function InSpec({
  P,
  id,
  setM
}) {
  const n = P.q.ndo(id);
  const sg = P.q.signalsOf(id);
  return /*#__PURE__*/React.createElement("aside", {
    className: "spec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Spec sheet \xB7 Layer 0"), /*#__PURE__*/React.createElement("h1", null, n.name), /*#__PURE__*/React.createElement("div", {
    className: "hash"
  }, "#", n.hash, "\u2026"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "lifecycle"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "led",
    style: {
      background: '#119C8F'
    }
  }), /*#__PURE__*/React.createElement("b", null, n.stage), " ", NEXT_STAGE[n.stage] && /*#__PURE__*/React.createElement("span", {
    className: "lnk",
    onClick: () => setM({
      type: 'advance',
      ndo: id
    })
  }, "advance"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "regime"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, n.regime), n.regime === 'Nondominium' ? ' · uncapturable' : '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "nature"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, n.nature))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "rivalry"), /*#__PURE__*/React.createElement("td", null, n.rivalry)))), /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      marginBottom: 8
    }
  }, "Layer 1 \xB7 rules in force"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, (P.s.rules[id] || [['—', 'no rules']]).map(([k, v]) => /*#__PURE__*/React.createElement("tr", {
    key: k
  }, /*#__PURE__*/React.createElement("td", null, k), /*#__PURE__*/React.createElement("td", null, v))))), /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      marginBottom: 8
    }
  }, "Layer 2 \xB7 instances"), (P.s.instances[id] || []).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "inst"
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("span", {
    className: "led",
    style: {
      background: LED[v] || '#7C8886'
    }
  }), v))), !(P.s.instances[id] || []).length && /*#__PURE__*/React.createElement("div", {
    className: "hash"
  }, "no instances"), /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      margin: '16px 0 8px'
    }
  }, "Signals emitted \xB7 ", sg.length), sg.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "sg"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, g.title), /*#__PURE__*/React.createElement("small", null, g.progress ? g.progress[0] + '/' + g.progress[1] + ' · ' : '', /*#__PURE__*/React.createElement("span", {
    className: "lnk",
    onClick: () => setM({
      type: 'why',
      sig: g,
      ndo: id
    })
  }, "trace origin"))), /*#__PURE__*/React.createElement("span", {
    className: "btn sm",
    onClick: () => P.actions.pickUp(g)
  }, g.verb))), /*#__PURE__*/React.createElement("span", {
    className: "btn ghost",
    style: {
      marginTop: 14,
      display: 'inline-block'
    },
    onClick: () => setM({
      type: 'note',
      ndo: id
    })
  }, "Log a note"));
}
function InstrumentApp() {
  const P = useProto();
  const [m, setM] = useModals();
  const [id, setId] = React.useState('sol');
  const [trust, setTrust] = React.useState('strict');
  const [pick, setPick] = React.useState(null);
  React.useEffect(() => setPick(null), [id]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mark"
  }), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, "Nondominium"), /*#__PURE__*/React.createElement("nav", null, P.s.ndos.map(n => /*#__PURE__*/React.createElement("span", {
    key: n.id,
    className: id === n.id ? 'on' : '',
    onClick: () => setId(n.id)
  }, n.name.split(' ').slice(0, 2).join(' '), P.q.signalsOf(n.id).length ? /*#__PURE__*/React.createElement("i", {
    className: "dot"
  }) : null)), /*#__PURE__*/React.createElement("span", {
    onClick: () => setM({
      type: 'create',
      after: setId
    })
  }, "+ new")), /*#__PURE__*/React.createElement("div", {
    className: "peer"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.toggleOffline,
    style: {
      cursor: 'pointer'
    }
  }, "node ", /*#__PURE__*/React.createElement("b", {
    style: P.s.offline ? {
      color: '#F2B84B'
    } : null
  }, "\u25CF ", P.s.offline ? 'offline' : 'online')), /*#__PURE__*/React.createElement("span", null, "peers ", /*#__PURE__*/React.createElement("b", null, P.s.offline ? 0 : 23)), /*#__PURE__*/React.createElement("span", null, "receipts ", /*#__PURE__*/React.createElement("b", null, P.s.receipts.length)), /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.reset,
    style: {
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  }, "reset"))), /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(InSpec, {
    P: P,
    id: id,
    setM: setM
  }), /*#__PURE__*/React.createElement(InBench, {
    P: P,
    id: id,
    setM: setM,
    trust: trust,
    setTrust: setTrust,
    pick: pick,
    setPick: setPick
  })), /*#__PURE__*/React.createElement(ModalHost, {
    m: m,
    setM: setM,
    P: P
  }), /*#__PURE__*/React.createElement(PToasts, {
    toasts: P.toasts,
    onDrop: P.dropToast
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(InstrumentApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/C.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/D.jsx
try { (() => {
const SB_LANES = [['hands', 'Needs hands', 'var(--amber)', 'a'], ['avail', 'Available now', 'var(--teal)', 't'], ['eyes', 'Needs eyes', 'var(--violet)', 'v']];
function SbStr({
  n
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "str"
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: i < n ? 'on' : ''
  })));
}
function SbCard({
  g,
  P,
  lane,
  setM,
  setOpen
}) {
  const n = P.q.ndo(g.ndo);
  const cold = n.stage === 'Hibernating' || g.strength <= 1;
  const mine = (g.takenBy || []).includes(ME.id);
  const faces = (g.takenBy || []).filter(a => a !== ME.id);
  return /*#__PURE__*/React.createElement("article", {
    className: 'card ' + (cold ? 'cold' : lane[3]),
    onClick: () => setOpen(g.ndo)
  }, /*#__PURE__*/React.createElement("div", {
    className: "res"
  }, n.name), /*#__PURE__*/React.createElement("h3", null, g.title), /*#__PURE__*/React.createElement("p", null, g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : '', g.sub), /*#__PURE__*/React.createElement("div", {
    className: "foot",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(SbStr, {
    n: g.strength
  }), faces.length || mine ? /*#__PURE__*/React.createElement("span", {
    className: "faces"
  }, mine && /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--ink)',
      color: '#fff'
    }
  }, "T"), faces.map(a => /*#__PURE__*/React.createElement("span", {
    key: a
  }, P.q.agent(a)[0]))) : null, mine && g.lane === 'avail' ? /*#__PURE__*/React.createElement("span", {
    className: "taken",
    style: {
      marginLeft: faces.length || mine ? 8 : 'auto'
    }
  }, "in use by you") : /*#__PURE__*/React.createElement("button", {
    className: 'take' + (cold ? ' ghost' : ''),
    style: faces.length || mine ? null : {
      marginLeft: 'auto'
    },
    onClick: () => P.actions.pickUp(g)
  }, g.verb)), /*#__PURE__*/React.createElement("div", {
    className: "why",
    onClick: e => {
      e.stopPropagation();
      setM({
        type: 'why',
        sig: g,
        ndo: g.ndo
      });
    }
  }, g.why[1].replace('← ', 'from '), " \xB7 why?"));
}
function SbDrawer({
  P,
  id,
  setM,
  onClose
}) {
  const n = P.q.ndo(id);
  const tr = P.q.tracesOf(id);
  return /*#__PURE__*/React.createElement("div", {
    className: "drawerWrap",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("aside", {
    className: "drawer",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "x",
    onClick: onClose
  }, "\u2715"), /*#__PURE__*/React.createElement("div", {
    className: "res"
  }, P.s.groups.find(g => g.id === n.group).name, " \xB7 ", n.hash), /*#__PURE__*/React.createElement("h2", null, n.name), /*#__PURE__*/React.createElement("div", {
    className: "pills"
  }, /*#__PURE__*/React.createElement("span", null, n.stage), /*#__PURE__*/React.createElement("span", null, n.regime), /*#__PURE__*/React.createElement("span", null, n.nature), /*#__PURE__*/React.createElement("span", null, n.rivalry)), /*#__PURE__*/React.createElement("p", null, n.desc), /*#__PURE__*/React.createElement("div", {
    className: "dact"
  }, /*#__PURE__*/React.createElement("button", {
    className: "take",
    onClick: () => setM({
      type: 'note',
      ndo: id
    })
  }, "Leave a trace"), /*#__PURE__*/React.createElement("button", {
    className: "take ghost",
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, "Attach"), NEXT_STAGE[n.stage] && /*#__PURE__*/React.createElement("button", {
    className: "take ghost",
    onClick: () => setM({
      type: 'advance',
      ndo: id
    })
  }, "Advance")), /*#__PURE__*/React.createElement("h4", null, "Signals from this resource"), P.q.signalsOf(id).map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "drow"
  }, /*#__PURE__*/React.createElement("span", null, g.title), /*#__PURE__*/React.createElement("button", {
    className: "take",
    onClick: () => P.actions.pickUp(g)
  }, g.verb))), !P.q.signalsOf(id).length && /*#__PURE__*/React.createElement("div", {
    className: "muted"
  }, "Quiet. No open signals."), /*#__PURE__*/React.createElement("h4", null, "Trail"), tr.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "drow",
    style: {
      opacity: {
        fresh: 1,
        warm: .9,
        fading: .6,
        cold: .4
      }[freshness(t.ago)]
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, P.q.agent(t.agent)), " ", t.text, t.note ? /*#__PURE__*/React.createElement("em", null, " \u201C", t.note, "\u201D") : ''), /*#__PURE__*/React.createElement("span", {
    className: "muted mono"
  }, t.status === 'validated' ? fmtAgo(t.ago) : t.status))), /*#__PURE__*/React.createElement("h4", null, "Attached"), /*#__PURE__*/React.createElement("div", {
    className: "pills"
  }, P.q.slotsOf(id).filter(l => l.trust !== 'filtered').map(l => /*#__PURE__*/React.createElement("span", {
    key: l.id
  }, l.type)))));
}
function SignalBoardApp() {
  const P = useProto();
  const [m, setM] = useModals();
  const [scope, setScope] = React.useState('all');
  const [open, setOpen] = React.useState(null);
  const [mine, setMine] = React.useState(false);
  const inScope = g => scope === 'all' || P.q.ndo(g.ndo).group === scope;
  const sigs = P.s.signals.filter(g => !g.done && inScope(g) && (!mine || g.lane !== 'avail' || true) && (!mine || ME.roles.includes('Repair') || g.lane !== 'hands'));
  const recent = P.s.traces.filter(t => inScope(t) && t.ago < 20000).slice(0, 6);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("div", {
    className: "mark"
  }), /*#__PURE__*/React.createElement("h1", null, "Signals"), /*#__PURE__*/React.createElement("div", {
    className: "scope"
  }, [['all', 'All my groups'], ...P.s.groups.map(g => [g.id, g.name])].map(([k, l]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: scope === k ? 'on' : '',
    onClick: () => setScope(k)
  }, l))), /*#__PURE__*/React.createElement("button", {
    className: "take ghost",
    style: {
      marginLeft: 12
    },
    onClick: () => setM({
      type: 'create',
      after: setOpen
    })
  }, "+ Declare NDO"), /*#__PURE__*/React.createElement("div", {
    className: "me"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: P.s.offline ? 'var(--amber)' : 'var(--mute)',
      cursor: 'pointer'
    },
    onClick: P.actions.toggleOffline,
    title: "Toggle offline"
  }, P.s.offline ? '○ offline' : '● 23 peers'), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--mute)'
    }
  }, "\u25C6 ", P.s.receipts.length, " receipts"), /*#__PURE__*/React.createElement("span", null, ME.name), /*#__PURE__*/React.createElement("span", {
    className: "av",
    onClick: P.actions.reset,
    title: "Reset prototype"
  }, "T"))), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Resources emit signals from their own state and rules. Nobody assigns work here: you pick up what fits you, and doing it leaves a trace. Click a card to open its resource."), /*#__PURE__*/React.createElement("div", {
    className: "board"
  }, SB_LANES.map(l => {
    const list = sigs.filter(g => g.lane === l[0]).sort((a, b) => b.strength - a.strength);
    return /*#__PURE__*/React.createElement("section", {
      key: l[0],
      className: "col"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ch"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sw",
      style: {
        background: l[2]
      }
    }), /*#__PURE__*/React.createElement("b", null, l[1]), /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, list.length)), list.map(g => /*#__PURE__*/React.createElement(SbCard, {
      key: g.id,
      g: g,
      P: P,
      lane: l,
      setM: setM,
      setOpen: setOpen
    })), !list.length && /*#__PURE__*/React.createElement("div", {
      className: "emptyLane"
    }, "Nothing here right now."));
  }), /*#__PURE__*/React.createElement("section", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw",
    style: {
      background: 'var(--blue)'
    }
  }), /*#__PURE__*/React.createElement("b", null, "Just happened"), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "live")), recent.map(t => /*#__PURE__*/React.createElement("article", {
    key: t.id,
    className: "card b",
    style: {
      opacity: {
        fresh: 1,
        warm: .9,
        fading: .7,
        cold: .5
      }[freshness(t.ago)]
    },
    onClick: () => setOpen(t.ndo)
  }, /*#__PURE__*/React.createElement("div", {
    className: "res"
  }, P.q.ndo(t.ndo).name), /*#__PURE__*/React.createElement("h3", null, P.q.agent(t.agent), " ", t.text), /*#__PURE__*/React.createElement("p", null, t.status === 'validated' ? t.ago < 1 ? 'just now' : fmtAgo(t.ago) + ' ago' : STAGE_LABEL[t.status], t.hops.length ? ' · via ' + t.hops.join(' → ') : ''), t.mine && /*#__PURE__*/React.createElement("div", {
    className: "taken"
  }, "+1 trace on this resource"))))), open && P.q.ndo(open) && /*#__PURE__*/React.createElement(SbDrawer, {
    P: P,
    id: open,
    setM: setM,
    onClose: () => setOpen(null)
  }), /*#__PURE__*/React.createElement(ModalHost, {
    m: m,
    setM: setM,
    P: P
  }), /*#__PURE__*/React.createElement(PToasts, {
    toasts: P.toasts,
    onDrop: P.dropToast
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(SignalBoardApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/D.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/E.jsx
try { (() => {
const HO_COL = {
  id: '#0F1A2A',
  rules: '#22B3A6',
  inst: '#3F6FDB',
  slots: '#7C55E6',
  sig: '#E5A52A'
};
const ringPts = (n, r, off = -Math.PI / 2) => Array.from({
  length: n
}, (_, i) => {
  const a = off + i * 2 * Math.PI / Math.max(1, n);
  return [Math.cos(a) * r, Math.sin(a) * r];
});
const HO_IC = {
  InUse: '#3F6FDB',
  Available: '#22B3A6',
  Maintenance: '#E5A52A',
  InStorage: '#8592A3'
};
function HoLobby({
  P,
  go
}) {
  const pos = [[300, 420], [650, 400]];
  return /*#__PURE__*/React.createElement("g", {
    className: "zoomIn"
  }, P.s.groups.map((g, i) => {
    const nd = P.s.ndos.filter(n => n.group === g.id);
    const [x, y] = pos[i] || [480, 420];
    const r = 110 + nd.length * 12;
    return /*#__PURE__*/React.createElement("g", {
      key: g.id,
      onClick: () => go({
        group: g.id
      }),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#fff",
      stroke: "#DDE4EB",
      strokeWidth: "2"
    }), ringPts(nd.length, r * .6).map(([dx, dy], j) => /*#__PURE__*/React.createElement("circle", {
      key: j,
      cx: x + dx,
      cy: y + dy,
      r: 6 + Math.min(14, P.q.heatOf(nd[j].id) * 4),
      fill: "#F3F6F8",
      stroke: P.q.signalsOf(nd[j].id).length ? HO_COL.sig : HO_COL.rules,
      strokeWidth: "2.5"
    })), /*#__PURE__*/React.createElement("text", {
      x: x,
      y: y - 4,
      textAnchor: "middle",
      fontSize: "18",
      fontWeight: "800",
      fill: "#0F1A2A"
    }, g.name), /*#__PURE__*/React.createElement("text", {
      x: x,
      y: y + 16,
      textAnchor: "middle",
      fontSize: "12",
      fill: "#8592A3"
    }, nd.length, " NDOs \xB7 click to enter"));
  }));
}
function HoGroup({
  P,
  gid,
  go,
  sel,
  setSel,
  setM
}) {
  const nd = P.s.ndos.filter(n => n.group === gid);
  const pts = ringPts(nd.length, 230);
  return /*#__PURE__*/React.createElement("g", {
    className: "zoomIn"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "480",
    cy: "420",
    r: "340",
    fill: "#fff",
    stroke: "#DDE4EB"
  }), /*#__PURE__*/React.createElement("text", {
    x: "480",
    y: "102",
    textAnchor: "middle",
    fontSize: "12",
    fontWeight: "700",
    fill: "#8592A3",
    letterSpacing: "1.5"
  }, P.s.groups.find(g => g.id === gid).name.toUpperCase(), " \xB7 GROUP DHT"), nd.map((n, i) => {
    const [dx, dy] = pts[i];
    const x = 480 + dx,
      y = 420 + dy;
    const r = 26 + Math.min(30, P.q.heatOf(n.id) * 8);
    const quiet = ['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife'].includes(n.stage);
    const sg = P.q.signalsOf(n.id).length;
    return /*#__PURE__*/React.createElement("g", {
      key: n.id,
      style: {
        cursor: 'pointer'
      },
      onClick: () => sel === n.id ? go({
        group: gid,
        ndo: n.id
      }) : setSel(n.id)
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: sel === n.id ? '#EAF7F5' : '#F3F6F8',
      stroke: sel === n.id ? '#0F1A2A' : '#DDE4EB',
      strokeDasharray: quiet ? '3 4' : null,
      strokeWidth: sel === n.id ? 2 : 1
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * .38,
      fill: "none",
      stroke: sg ? HO_COL.sig : HO_COL.rules,
      strokeWidth: "3"
    }), /*#__PURE__*/React.createElement("text", {
      x: x,
      y: y + r + 18,
      textAnchor: "middle",
      fontSize: "12",
      fontWeight: "700",
      fill: "#0F1A2A"
    }, n.name), /*#__PURE__*/React.createElement("text", {
      x: x,
      y: y + r + 33,
      textAnchor: "middle",
      fontSize: "11",
      fill: "#8592A3"
    }, n.stage, sg ? ' · ' + sg + ' signal' + (sg > 1 ? 's' : '') : ''));
  }), /*#__PURE__*/React.createElement("g", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => setM({
      type: 'create',
      after: id => go({
        group: P.q.ndo(id).group,
        ndo: id
      })
    })
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "480",
    cy: "420",
    r: "34",
    fill: "#fff",
    stroke: "#8592A3",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: "480",
    y: "425",
    textAnchor: "middle",
    fontSize: "12",
    fontWeight: "700",
    fill: "#8592A3"
  }, "+ NDO")));
}
function HoNdo({
  P,
  id,
  focus,
  setFocus,
  setM
}) {
  const n = P.q.ndo(id);
  const rules = P.s.rules[id] || [];
  const inst = P.s.instances[id] || [];
  const slots = P.q.slotsOf(id).filter(l => l.trust !== 'filtered');
  const sg = P.q.signalsOf(id);
  const dim = k => focus && focus !== k ? .25 : 1;
  const tog = k => () => setFocus(focus === k ? null : k);
  return /*#__PURE__*/React.createElement("g", {
    className: "zoomIn",
    transform: "translate(480 420)"
  }, /*#__PURE__*/React.createElement("g", {
    opacity: dim('slots'),
    style: {
      cursor: 'pointer',
      transition: 'opacity 300ms'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    r: "250",
    fill: "none",
    stroke: HO_COL.slots,
    strokeOpacity: ".16",
    strokeWidth: "34",
    onClick: tog('slots')
  }), ringPts(slots.length + 1, 250).map(([x, y], i) => i < slots.length ? /*#__PURE__*/React.createElement("g", {
    key: i,
    onClick: tog('slots')
  }, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "16",
    fill: "#fff",
    stroke: HO_COL.slots,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y + (y < 0 ? -26 : 34),
    textAnchor: "middle",
    fontSize: "11",
    fontWeight: "700",
    fill: HO_COL.slots
  }, slots[i].type)) : /*#__PURE__*/React.createElement("g", {
    key: "add",
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "16",
    fill: "#fff",
    stroke: "#8592A3",
    strokeDasharray: "3 3",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y + 5,
    textAnchor: "middle",
    fontSize: "15",
    fill: "#8592A3"
  }, "+")))), /*#__PURE__*/React.createElement("g", {
    opacity: dim('inst'),
    onClick: tog('inst'),
    style: {
      cursor: 'pointer',
      transition: 'opacity 300ms'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    r: "170",
    fill: "none",
    stroke: HO_COL.inst,
    strokeOpacity: ".14",
    strokeWidth: "28"
  }), ringPts(inst.length, 170, -Math.PI / 4).map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "10",
    fill: HO_IC[inst[i][1]] || '#8592A3'
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 16,
    y: y + 4,
    fontSize: "11",
    fontWeight: "600",
    fill: HO_IC[inst[i][1]] || '#8592A3'
  }, inst[i][0].split(' · ')[0], " \xB7 ", inst[i][1]))), !inst.length && /*#__PURE__*/React.createElement("text", {
    y: "-162",
    textAnchor: "middle",
    fontSize: "11",
    fill: "#8592A3"
  }, "no instances")), /*#__PURE__*/React.createElement("g", {
    opacity: dim('rules'),
    onClick: tog('rules'),
    style: {
      cursor: 'pointer',
      transition: 'opacity 300ms'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    r: "100",
    fill: "none",
    stroke: HO_COL.rules,
    strokeOpacity: ".2",
    strokeWidth: "22"
  }), ringPts(rules.length, 100, Math.PI * .75).map(([x, y], i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x,
    y: y + 4,
    textAnchor: "middle",
    fontSize: "10",
    fontWeight: "800",
    fill: HO_COL.rules
  }, rules[i][0]))), sg.map((g, i) => {
    const [x, y] = ringPts(sg.length, 134, Math.PI * .15)[i];
    return /*#__PURE__*/React.createElement("circle", {
      key: g.id,
      cx: x,
      cy: y,
      r: "7",
      fill: HO_COL.sig,
      style: {
        cursor: 'pointer'
      },
      onClick: () => setM({
        type: 'why',
        sig: g,
        ndo: id
      })
    }, /*#__PURE__*/React.createElement("animate", {
      attributeName: "r",
      values: "7;10;7",
      dur: "1.8s",
      repeatCount: "indefinite"
    }));
  }), /*#__PURE__*/React.createElement("circle", {
    r: "54",
    fill: "#0F1A2A",
    onClick: () => setFocus(null),
    style: {
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("text", {
    y: "-4",
    textAnchor: "middle",
    fontSize: "12",
    fontWeight: "800",
    fill: "#fff"
  }, n.name.split(' ').slice(-2).join(' ')), /*#__PURE__*/React.createElement("text", {
    y: "14",
    textAnchor: "middle",
    fontSize: "10",
    fill: "#9fb3c8"
  }, n.stage, " \xB7 ", n.regime));
}
function HoCard({
  P,
  at,
  sel,
  focus,
  setFocus,
  setM,
  go
}) {
  const id = at.ndo || sel;
  if (!id) return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, at.group ? 'Group' : 'Lobby'), /*#__PURE__*/React.createElement("h2", null, at.group ? P.s.groups.find(g => g.id === at.group).name : 'Your holarchy'), /*#__PURE__*/React.createElement("p", {
    className: "p"
  }, at.group ? 'Click an NDO once to inspect it, twice to enter it.' : 'Each circle is a group DHT you belong to. Click one to zoom in.'), /*#__PURE__*/React.createElement("div", {
    className: "cta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pbtn",
    onClick: () => setM({
      type: 'create',
      after: nid => go({
        group: P.q.ndo(nid).group,
        ndo: nid
      })
    })
  }, "Declare NDO")));
  const n = P.q.ndo(id);
  const sg = P.q.signalsOf(id);
  const rules = P.s.rules[id] || [];
  const inst = P.s.instances[id] || [];
  const sl = P.q.slotsOf(id);
  const tr = P.q.tracesOf(id);
  const rows = [['id', 'Core identity', `${n.stage} · ${n.regime} · ${n.nature}`, 'L0'], ['rules', rules.length + ' rules travel with it', rules.map(r => r[0]).join(' · ') || 'none', 'L1'], ['inst', inst.length + ' instances', inst.map(i => i[1]).join(' · ') || 'none', 'L2'], ['slots', sl.length + ' attachments', sl.filter(l => l.trust === 'filtered').length + ' filtered by trust', 'slots']];
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Holon \xB7 NDO"), /*#__PURE__*/React.createElement("h2", null, n.name), rows.map(([k, t, s, l]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: 'ring' + (focus === k ? ' on' : ''),
    onClick: () => at.ndo && setFocus(focus === k ? null : k)
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      borderColor: HO_COL[k]
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, t), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, s)), /*#__PURE__*/React.createElement("small", null, l))), focus === 'slots' && /*#__PURE__*/React.createElement("div", {
    className: "detail"
  }, sl.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.id
  }, /*#__PURE__*/React.createElement("span", null, x.type, " \xB7 ", x.label), /*#__PURE__*/React.createElement("small", null, x.trust)))), focus === 'rules' && /*#__PURE__*/React.createElement("div", {
    className: "detail"
  }, rules.map(([a, b]) => /*#__PURE__*/React.createElement("div", {
    key: a
  }, /*#__PURE__*/React.createElement("span", null, a), /*#__PURE__*/React.createElement("small", null, b)))), focus === 'inst' && /*#__PURE__*/React.createElement("div", {
    className: "detail"
  }, inst.map(([a, b]) => /*#__PURE__*/React.createElement("div", {
    key: a
  }, /*#__PURE__*/React.createElement("span", null, a), /*#__PURE__*/React.createElement("small", null, b)))), sg.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k",
    style: {
      margin: '12px 0 6px'
    }
  }, "Signals \xB7 ", sg.length), sg.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "sgr"
  }, /*#__PURE__*/React.createElement("span", null, g.title), /*#__PURE__*/React.createElement("span", {
    className: "mini",
    onClick: () => P.actions.pickUp(g)
  }, g.verb), /*#__PURE__*/React.createElement("span", {
    className: "mini g",
    onClick: () => setM({
      type: 'why',
      sig: g,
      ndo: id
    })
  }, "?")))), at.ndo && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k",
    style: {
      margin: '12px 0 6px'
    }
  }, "Latest traces"), tr.slice(0, 3).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "sgr",
    style: {
      opacity: t.status === 'validated' ? 1 : .7
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, P.q.agent(t.agent)), " ", t.text), /*#__PURE__*/React.createElement("small", null, t.status === 'validated' ? fmtAgo(t.ago) : t.status)))), /*#__PURE__*/React.createElement("div", {
    className: "cta"
  }, at.ndo ? /*#__PURE__*/React.createElement("span", {
    className: "pbtn",
    onClick: () => setM({
      type: 'attach',
      ndo: id
    })
  }, "Attach") : /*#__PURE__*/React.createElement("span", {
    className: "pbtn",
    onClick: () => go({
      group: at.group,
      ndo: id
    })
  }, "Enter this holon"), /*#__PURE__*/React.createElement("span", {
    className: "gbtn",
    onClick: () => setM({
      type: 'note',
      ndo: id
    })
  }, "Leave a trace"), at.ndo && NEXT_STAGE[n.stage] && /*#__PURE__*/React.createElement("span", {
    className: "gbtn",
    onClick: () => setM({
      type: 'advance',
      ndo: id
    })
  }, "Advance")));
}
function HolarchyApp() {
  const P = useProto();
  const [m, setM] = useModals();
  const [at, setAt] = React.useState({
    group: 'sen',
    ndo: 'sol'
  });
  const [sel, setSel] = React.useState(null);
  const [focus, setFocus] = React.useState(null);
  const go = a => {
    setAt(a);
    setSel(null);
    setFocus(null);
  };
  const up = () => at.ndo ? go({
    group: at.group
  }) : at.group ? go({}) : null;
  React.useEffect(() => {
    const w = e => {
      if (e.deltaY > 30) up();
    };
    addEventListener('wheel', w);
    return () => removeEventListener('wheel', w);
  });
  const depth = at.ndo ? 3 : at.group ? 2 : 1;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mark"
  }), /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("span", {
    className: depth === 1 ? 'on' : '',
    onClick: () => go({})
  }, "Lobby"), at.group && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", null, "\u203A"), /*#__PURE__*/React.createElement("span", {
    className: depth === 2 ? 'on' : '',
    onClick: () => go({
      group: at.group
    })
  }, P.s.groups.find(g => g.id === at.group).name)), at.ndo && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", null, "\u203A"), /*#__PURE__*/React.createElement("span", {
    className: "on"
  }, P.q.ndo(at.ndo).name))), /*#__PURE__*/React.createElement("div", {
    className: "zoom"
  }, "scroll down to zoom out \xB7 ", /*#__PURE__*/React.createElement("b", null, depth, " holon", depth > 1 ? 's' : '', " deep"))), /*#__PURE__*/React.createElement("svg", {
    className: "stage",
    viewBox: "0 0 1000 840",
    preserveAspectRatio: "xMinYMid meet",
    key: depth + (at.group || '') + (at.ndo || '')
  }, depth === 1 && /*#__PURE__*/React.createElement(HoLobby, {
    P: P,
    go: go
  }), depth === 2 && /*#__PURE__*/React.createElement(HoGroup, {
    P: P,
    gid: at.group,
    go: go,
    sel: sel,
    setSel: setSel,
    setM: setM
  }), depth === 3 && /*#__PURE__*/React.createElement(HoNdo, {
    P: P,
    id: at.ndo,
    focus: focus,
    setFocus: setFocus,
    setM: setM
  })), /*#__PURE__*/React.createElement(HoCard, {
    P: P,
    at: at,
    sel: sel,
    focus: focus,
    setFocus: setFocus,
    setM: setM,
    go: go
  }), /*#__PURE__*/React.createElement("div", {
    className: "legend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: HO_COL.id
    }
  }), "identity"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: HO_COL.rules
    }
  }), "rules"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: HO_COL.inst
    }
  }), "instances"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: HO_COL.slots
    }
  }), "capability slots"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: HO_COL.sig
    }
  }), "signal")), /*#__PURE__*/React.createElement("div", {
    className: "peers"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.toggleOffline,
    style: {
      cursor: 'pointer'
    }
  }, P.s.offline ? '○ offline · traces queue locally' : '● 23 peers hold this holon'), " \xB7 \u25C6 ", P.s.receipts.length, " receipts \xB7 ", /*#__PURE__*/React.createElement("span", {
    onClick: P.actions.reset,
    style: {
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  }, "reset")), /*#__PURE__*/React.createElement(ModalHost, {
    m: m,
    setM: setM,
    P: P
  }), /*#__PURE__*/React.createElement(PToasts, {
    toasts: P.toasts,
    onDrop: P.dropToast
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(HolarchyApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/E.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/core.jsx
try { (() => {
// Shared data + store for the stigmergic prototypes. Plain React hooks, exported on window.
const PROTO_KEY = 'ndo-stigmergy-proto-v2';
const ME = {
  id: 'tib',
  name: 'Tiberius',
  roles: ['Repair', 'Custodian']
};
const AGENTS = {
  tib: 'Tiberius',
  sou: 'Soushi',
  lyn: 'Lynn',
  ali: 'Alice',
  bob: 'Bob'
};
const STAGES = ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'];
const NEXT_STAGE = {
  Ideation: 'Specification',
  Specification: 'Development',
  Development: 'Prototype',
  Prototype: 'Stable',
  Stable: 'Distributed',
  Distributed: 'Active',
  Active: 'Hibernating',
  Hibernating: 'Active'
};
const SEED = {
  groups: [{
    id: 'sen',
    name: 'Sensorica'
  }, {
    id: 'ovn',
    name: 'Open Value Network'
  }],
  ndos: [{
    id: 'sol',
    name: 'Community Solar Array',
    group: 'sen',
    stage: 'Active',
    regime: 'Nondominium',
    nature: 'Physical',
    rivalry: 'Rivalrous',
    desc: 'Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective.',
    hash: 'uhC0kVX5k7dL',
    x: 330,
    y: 360
  }, {
    id: 'sns',
    name: 'Distributed Sensor Design v3',
    group: 'ovn',
    stage: 'Distributed',
    regime: 'Commons',
    nature: 'Digital',
    rivalry: 'NonRivalrous',
    desc: 'Open design files for low-cost environmental sensors.',
    hash: 'uhC0mQ2pT8wa',
    x: 560,
    y: 250
  }, {
    id: 'las',
    name: 'Collective Laser Cutter',
    group: 'sen',
    stage: 'Prototype',
    regime: 'Collective',
    nature: 'Physical',
    rivalry: 'Rivalrous',
    desc: '60 W CO₂ cutter co-owned by three fab labs.',
    hash: 'uhC0rJ7xN3ke',
    x: 640,
    y: 470
  }, {
    id: 'cnc',
    name: 'Open Hardware CNC Bed',
    group: 'sen',
    stage: 'Stable',
    regime: 'Pool',
    nature: 'Physical',
    rivalry: 'Rivalrous',
    desc: 'Pooled 1.2 × 2.4 m router bed.',
    hash: 'uhC0aB4cD9fg',
    x: 200,
    y: 560
  }, {
    id: 'fw',
    name: 'Legacy Firmware v2',
    group: 'ovn',
    stage: 'Deprecated',
    regime: 'Commons',
    nature: 'Digital',
    rivalry: 'NonRivalrous',
    desc: 'Superseded by Sensor Design v3 firmware.',
    hash: 'uhC0zZ1yX2wv',
    x: 720,
    y: 160
  }, {
    id: 'seed',
    name: 'Community Seed Library',
    group: 'ovn',
    stage: 'Hibernating',
    regime: 'Commons',
    nature: 'Physical',
    rivalry: 'Rivalrous',
    desc: 'Seed exchange paused for winter.',
    hash: 'uhC0hH5jK6lm',
    x: 320,
    y: 650
  }, {
    id: 'mesh',
    name: 'Neighbourhood Mesh Network',
    group: 'sen',
    stage: 'Ideation',
    regime: 'Public',
    nature: 'Hybrid',
    rivalry: 'Rivalrous',
    desc: 'Community-run wireless mesh.',
    hash: 'uhC0nN7pQ8rs',
    x: 130,
    y: 250
  }],
  links: [['sol', 'sns', 'cite'], ['sol', 'cnc', 'use'], ['sns', 'las', 'hard'], ['sol', 'las', 'use'], ['cnc', 'seed', 'use'], ['sns', 'fw', 'cite'], ['mesh', 'sol', 'hard']],
  traces: [{
    id: 't1',
    ndo: 'sol',
    agent: 'sou',
    kind: 'use',
    text: 'used 12 kWp',
    note: 'Output dips after 4 pm, maybe shading from the new mast?',
    ago: 1,
    status: 'validated',
    hops: ['Soushi', 'Lynn', 'Fablab node']
  }, {
    id: 't2',
    ndo: 'sol',
    agent: 'tib',
    kind: 'custody',
    text: 'transferred custody → Bay 2',
    ago: 180,
    status: 'validated',
    hops: ['Lynn']
  }, {
    id: 't3',
    ndo: 'sol',
    agent: 'lyn',
    kind: 'work',
    text: 'logged 2 h work · wiring',
    note: 'Bank B is ready again.',
    ago: 1440,
    status: 'validated',
    hops: ['Lynn']
  }, {
    id: 't4',
    ndo: 'sol',
    agent: 'ali',
    kind: 'cite',
    text: 'cited in Sensor Design v3',
    ago: 8640,
    status: 'validated',
    hops: ['Alice', 'Bob']
  }, {
    id: 't5',
    ndo: 'sns',
    agent: 'ali',
    kind: 'cite',
    text: 'forked firmware module',
    ago: 300,
    status: 'validated',
    hops: ['Alice']
  }, {
    id: 't6',
    ndo: 'las',
    agent: 'bob',
    kind: 'work',
    text: 'calibrated mirrors',
    ago: 600,
    status: 'validated',
    hops: ['Bob']
  }, {
    id: 't7',
    ndo: 'cnc',
    agent: 'lyn',
    kind: 'use',
    text: 'booked 4 h',
    ago: 2880,
    status: 'validated',
    hops: ['Lynn']
  }, {
    id: 't8',
    ndo: 'mesh',
    agent: 'ali',
    kind: 'work',
    text: 'declared this NDO',
    ago: 1440,
    status: 'validated',
    hops: ['Alice']
  }, {
    id: 't9',
    ndo: 'seed',
    agent: 'bob',
    kind: 'use',
    text: 'stock check',
    ago: 30240,
    status: 'validated',
    hops: ['Bob']
  }],
  signals: [{
    id: 's1',
    ndo: 'sol',
    lane: 'hands',
    title: 'Inverter maintenance due in 3 days',
    sub: 'Needs role Repair · about 2 h',
    why: ['signal: maintenance_due', '← MaintenanceSchedule { interval_days: 90 }', '← last MaintenanceFulfillment 87 d ago', '← you hold role: Repair'],
    strength: 4,
    verb: 'Take it',
    traceKind: 'work',
    traceText: 'took on inverter maintenance'
  }, {
    id: 's2',
    ndo: 'sol',
    lane: 'avail',
    title: 'Panel bank B · 4 kWp',
    sub: 'Free to use · 40 h / week limit',
    why: ['signal: available', '← instance state: Available', '← UsageLimit { 40 h / 7 d }'],
    strength: 5,
    verb: 'Use',
    traceKind: 'use',
    traceText: 'used 4 kWp · bank B'
  }, {
    id: 's3',
    ndo: 'sol',
    lane: 'eyes',
    title: 'Review specification v1.1',
    sub: 'custodians reviewed · proposed by Lynn',
    why: ['signal: review_requested', '← Specification v1.1 proposed', '← you are a custodian'],
    strength: 2,
    verb: 'Review',
    traceKind: 'cite',
    traceText: 'reviewed spec v1.1',
    progress: [2, 5]
  }, {
    id: 's4',
    ndo: 'las',
    lane: 'hands',
    title: 'Move to Fablab Montréal',
    sub: 'Transport · InStorage → InTransit',
    why: ['signal: transport_needed', '← state InStorage', '← Commitment: deliver to Fablab Montréal'],
    strength: 2,
    verb: 'Take it',
    traceKind: 'custody',
    traceText: 'picked up transport to Montréal'
  }, {
    id: 's5',
    ndo: 'las',
    lane: 'eyes',
    title: 'Validate new instance',
    sub: 'validators so far',
    why: ['signal: validation_needed', '← TransferCondition { requires_validation: 3 }'],
    strength: 3,
    verb: 'Validate',
    traceKind: 'work',
    traceText: 'validated new instance',
    progress: [1, 3]
  }, {
    id: 's6',
    ndo: 'cnc',
    lane: 'avail',
    title: 'Open slot Thursday 14:00',
    sub: 'Pool · custody passes to you for 4 h',
    why: ['signal: available', '← calendar gap', '← AccessRequirement: AccountableAgent ✓'],
    strength: 3,
    verb: 'Book',
    traceKind: 'use',
    traceText: 'booked Thursday 14:00'
  }, {
    id: 's7',
    ndo: 'sns',
    lane: 'avail',
    title: 'Design files · fork or cite',
    sub: 'Digital · NonRivalrous · cited 14×',
    why: ['signal: citable', '← nature Digital, NonRivalrous'],
    strength: 4,
    verb: 'Cite',
    traceKind: 'cite',
    traceText: 'cited design files'
  }, {
    id: 's8',
    ndo: 'seed',
    lane: 'hands',
    title: 'Winter stock check',
    sub: 'Hibernating · nobody has picked this up in 3 weeks',
    why: ['signal: stock_check', '← MaintenanceSchedule { interval_days: 30 }'],
    strength: 1,
    verb: 'Take it',
    traceKind: 'work',
    traceText: 'did winter stock check'
  }],
  slots: [{
    id: 'l1',
    ndo: 'sol',
    type: 'Documentation',
    label: 'wiring manual',
    by: 'lyn',
    trust: 'trusted'
  }, {
    id: 'l2',
    ndo: 'sol',
    type: 'IssueTracker',
    label: '3 open issues',
    by: 'bob',
    trust: 'trusted'
  }, {
    id: 'l3',
    ndo: 'sol',
    type: 'GovernanceDAO',
    label: '1 proposal · voting',
    by: 'ali',
    trust: 'conditional'
  }, {
    id: 'l4',
    ndo: 'sol',
    type: 'UnytAgreement',
    label: 'energy credits',
    by: 'tib',
    trust: 'trusted'
  }, {
    id: 'l5',
    ndo: 'sol',
    type: 'CustomApp',
    label: 'unknown agent',
    by: '?',
    trust: 'filtered'
  }, {
    id: 'l6',
    ndo: 'sns',
    type: 'Documentation',
    label: 'assembly guide',
    by: 'ali',
    trust: 'trusted'
  }],
  rules: {
    sol: [['UsageLimit', '40 h / 7 d'], ['AccessRequirement', 'AccountableAgent'], ['MaintenanceSchedule', '90 d · Repair']],
    las: [['TransferCondition', 'requires 3 validators'], ['UsageLimit', '10 h / 7 d']],
    cnc: [['AccessRequirement', 'AccountableAgent']]
  },
  instances: {
    sol: [['Panel bank A · 12 kWp', 'InUse'], ['Panel bank B · 4 kWp', 'Available'], ['Inverter', 'Maintenance']],
    las: [['Cutter unit 1', 'InStorage']],
    cnc: [['Router bed', 'Available']]
  },
  receipts: [],
  offline: false
};
const SLOT_TYPES = ['Documentation', 'IssueTracker', 'FabricationQueue', 'GovernanceDAO', 'UnytAgreement', 'FlowstaIdentity', 'CustomApp'];
function fmtAgo(m) {
  if (m < 1) return 'now';
  if (m < 60) return Math.round(m) + (m < 2 ? ' min' : ' min');
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
function heat(m, decayDays = 14) {
  return Math.max(0.08, 1 - m / (decayDays * 1440));
}
let uid = 100;
function useProto() {
  const [s, setS] = React.useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(PROTO_KEY));
      if (v && v.ndos) return v;
    } catch (e) {}
    return JSON.parse(JSON.stringify(SEED));
  });
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    localStorage.setItem(PROTO_KEY, JSON.stringify(s));
  }, [s]);
  const sRef = React.useRef(s);
  sRef.current = s;
  const patchTrace = (id, p) => setS(x => ({
    ...x,
    traces: x.traces.map(t => t.id === id ? {
      ...t,
      ...p
    } : t)
  }));
  const toast = t => {
    const id = 'k' + uid++;
    setToasts(a => [...a, {
      id,
      ...t
    }]);
    return id;
  };
  const patchToast = (id, p) => setToasts(a => a.map(t => t.id === id ? {
    ...t,
    ...p
  } : t));
  const dropToast = id => setToasts(a => a.filter(t => t.id !== id));

  // Leaves a trace and runs it through the P2P write lifecycle: signed → gossiping → validated.
  const leave = (ndo, kind, text, note, extra = {}) => {
    const id = 't' + uid++;
    const offline = sRef.current.offline;
    setS(x => ({
      ...x,
      traces: [{
        id,
        ndo,
        agent: ME.id,
        kind,
        text,
        note,
        ago: 0,
        status: offline ? 'queued' : 'signed',
        hops: [],
        mine: true
      }, ...x.traces],
      ...extra
    }));
    const tid = toast({
      title: text,
      ndo,
      stage: offline ? 'queued' : 'signed',
      peers: 0
    });
    if (offline) return id;
    let peers = 0;
    setTimeout(() => {
      patchTrace(id, {
        status: 'gossip'
      });
      patchToast(tid, {
        stage: 'gossip'
      });
    }, 700);
    const iv = setInterval(() => {
      peers = Math.min(23, peers + 4 + Math.floor(Math.random() * 4));
      patchToast(tid, {
        peers
      });
      if (peers >= 23) clearInterval(iv);
    }, 300);
    setTimeout(() => {
      patchTrace(id, {
        status: 'validated',
        hops: ['Lynn', 'Fablab node']
      });
      patchToast(tid, {
        stage: 'validated',
        peers: 23
      });
      if (kind === 'work') setS(x => ({
        ...x,
        receipts: [{
          id: 'r' + uid++,
          text,
          ndo
        }, ...x.receipts]
      }));
    }, 2600);
    setTimeout(() => dropToast(tid), 5200);
    return id;
  };
  const actions = {
    pickUp(sig) {
      const extra = {};
      const cur = sRef.current;
      extra.signals = cur.signals.map(g => {
        if (g.id !== sig.id) return g;
        if (g.progress) {
          const p = [g.progress[0] + 1, g.progress[1]];
          return {
            ...g,
            progress: p,
            takenBy: [...(g.takenBy || []), ME.id],
            done: p[0] >= p[1]
          };
        }
        return {
          ...g,
          takenBy: [...(g.takenBy || []), ME.id],
          done: g.lane !== 'avail'
        };
      });
      leave(sig.ndo, sig.traceKind, sig.traceText, null, extra);
    },
    leaveNote(ndo, note) {
      leave(ndo, 'note', 'left a note', note);
    },
    attach(ndo, type, label) {
      const cur = sRef.current;
      leave(ndo, 'attach', 'attached ' + type, null, {
        slots: [...cur.slots, {
          id: 'l' + uid++,
          ndo,
          type,
          label: label || 'new',
          by: ME.id,
          trust: 'trusted',
          fresh: true
        }]
      });
    },
    advance(ndo, to) {
      const cur = sRef.current;
      leave(ndo, 'lifecycle', 'advanced to ' + to, null, {
        ndos: cur.ndos.map(n => n.id === ndo ? {
          ...n,
          stage: to
        } : n)
      });
    },
    createNdo(f) {
      const cur = sRef.current;
      const id = 'n' + uid++;
      const n = {
        id,
        name: f.name,
        group: f.group || 'sen',
        stage: 'Ideation',
        regime: f.regime,
        nature: f.nature,
        rivalry: ['Digital', 'Information'].includes(f.nature) ? 'NonRivalrous' : 'Rivalrous',
        desc: f.desc || '',
        hash: 'uhC0' + Math.random().toString(36).slice(2, 10),
        x: 140 + Math.random() * 560,
        y: 180 + Math.random() * 440
      };
      leave(id, 'work', 'declared this NDO', null, {
        ndos: [...cur.ndos, n]
      });
      return id;
    },
    toggleOffline() {
      const was = sRef.current.offline;
      setS(x => ({
        ...x,
        offline: !was
      }));
      if (was) {
        const q = sRef.current.traces.filter(t => t.status === 'queued');
        q.forEach((t, i) => {
          setTimeout(() => patchTrace(t.id, {
            status: 'gossip'
          }), 400 + i * 200);
          setTimeout(() => patchTrace(t.id, {
            status: 'validated',
            hops: ['Lynn']
          }), 1800 + i * 200);
        });
        if (q.length) toast({
          title: q.length + ' queued trace' + (q.length > 1 ? 's' : '') + ' propagating',
          stage: 'gossip',
          peers: 3
        });
      }
    },
    reset() {
      localStorage.removeItem(PROTO_KEY);
      setS(JSON.parse(JSON.stringify(SEED)));
    }
  };
  const q = {
    ndo: id => s.ndos.find(n => n.id === id),
    tracesOf: id => s.traces.filter(t => t.ndo === id),
    signalsOf: id => s.signals.filter(g => g.ndo === id && !g.done),
    slotsOf: id => s.slots.filter(l => l.ndo === id),
    heatOf: (id, decay = 14) => s.traces.filter(t => t.ndo === id).reduce((a, t) => a + heat(t.ago, decay), 0),
    agent: id => AGENTS[id] || id
  };
  return {
    s,
    actions,
    q,
    toasts,
    dropToast
  };
}
Object.assign(window, {
  useProto,
  ME,
  AGENTS,
  STAGES,
  NEXT_STAGE,
  SLOT_TYPES,
  fmtAgo,
  freshness,
  heat,
  PROTO_KEY
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/core.jsx", error: String((e && e.message) || e) }); }

// explorations/revamp/proto/ui.jsx
try { (() => {
// Shared, theme-neutral UI pieces. Each direction sets --pb (panel bg), --pi (ink), --pm (muted), --pl (line), --pa (accent), --pr (radius).
const pv = {
  bg: 'var(--pb)',
  ink: 'var(--pi)',
  mute: 'var(--pm)',
  line: 'var(--pl)',
  acc: 'var(--pa)',
  r: 'var(--pr)'
};
function PModal({
  title,
  sub,
  onClose,
  children,
  width = 440
}) {
  React.useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.45)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '92vw',
      background: pv.bg,
      color: pv.ink,
      border: '1px solid ' + pv.line,
      borderRadius: pv.r,
      boxShadow: '0 30px 60px -20px rgba(0,0,0,.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 12px',
      borderBottom: '1px solid ' + pv.line,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: pv.mute,
      marginTop: 3
    }
  }, sub)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      ...pBtnGhost,
      padding: '4px 9px'
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 22px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, children)));
}
const pBtn = {
  font: 'inherit',
  fontSize: 13,
  fontWeight: 600,
  padding: '8px 14px',
  borderRadius: 'var(--prb, 999px)',
  border: '1px solid var(--pa)',
  background: 'var(--pa)',
  color: 'var(--pac, #fff)',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};
const pBtnGhost = {
  ...pBtn,
  background: 'transparent',
  color: 'var(--pi)',
  border: '1px solid var(--pl)'
};
const pInput = {
  font: 'inherit',
  fontSize: 14,
  padding: '9px 11px',
  borderRadius: 8,
  border: '1px solid var(--pl)',
  background: 'transparent',
  color: 'var(--pi)',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none'
};
const pLabel = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--pm)',
  marginBottom: 5,
  display: 'block'
};
function PField({
  label,
  children,
  hint
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: pLabel
  }, label), children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 12,
      color: 'var(--pm)',
      marginTop: 4
    }
  }, hint));
}
function PChoice({
  options,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    onClick: () => onChange(o),
    style: {
      ...pBtnGhost,
      fontWeight: 500,
      fontSize: 12,
      padding: '6px 10px',
      ...(o === value ? {
        background: 'var(--pa)',
        color: 'var(--pac,#fff)',
        borderColor: 'var(--pa)'
      } : {})
    }
  }, o)));
}
function CreateNdoModal({
  onClose,
  onCreate,
  groups
}) {
  const [f, setF] = React.useState({
    name: '',
    desc: '',
    nature: 'Physical',
    regime: 'Nondominium',
    group: groups[0].id
  });
  const set = k => v => setF(x => ({
    ...x,
    [k]: v
  }));
  const dup = false;
  return /*#__PURE__*/React.createElement(PModal, {
    title: "Declare a new NDO",
    sub: "It starts in Ideation. Others find it through the traces you and they leave.",
    onClose: onClose
  }, /*#__PURE__*/React.createElement(PField, {
    label: "Name *"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    style: pInput,
    value: f.name,
    onChange: e => set('name')(e.target.value),
    placeholder: "e.g. Shared Bike Fleet"
  })), /*#__PURE__*/React.createElement(PField, {
    label: "What is it?"
  }, /*#__PURE__*/React.createElement("textarea", {
    style: {
      ...pInput,
      minHeight: 64,
      resize: 'vertical'
    },
    value: f.desc,
    onChange: e => set('desc')(e.target.value)
  })), /*#__PURE__*/React.createElement(PField, {
    label: "Nature"
  }, /*#__PURE__*/React.createElement(PChoice, {
    options: ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'],
    value: f.nature,
    onChange: set('nature')
  })), /*#__PURE__*/React.createElement(PField, {
    label: "Property regime",
    hint: f.regime === 'Nondominium' ? 'Uncapturable: no agent can take unilateral control.' : null
  }, /*#__PURE__*/React.createElement(PChoice, {
    options: ['Nondominium', 'Commons', 'Collective', 'Pool', 'Public', 'Private'],
    value: f.regime,
    onChange: set('regime')
  })), /*#__PURE__*/React.createElement(PField, {
    label: "Group"
  }, /*#__PURE__*/React.createElement(PChoice, {
    options: groups.map(g => g.name),
    value: groups.find(g => g.id === f.group).name,
    onChange: n => set('group')(groups.find(g => g.name === n).id)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pBtnGhost,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...pBtn,
      opacity: f.name.trim() ? 1 : .4
    },
    disabled: !f.name.trim(),
    onClick: () => {
      onCreate(f);
      onClose();
    }
  }, "Declare NDO")));
}
function AttachModal({
  ndo,
  onClose,
  onAttach
}) {
  const [type, setType] = React.useState('Documentation');
  const [label, setLabel] = React.useState('');
  return /*#__PURE__*/React.createElement(PModal, {
    title: "Attach a capability",
    sub: 'Plug a tool into ' + ndo.name + '. Other agents see it according to their trust filter.',
    onClose: onClose
  }, /*#__PURE__*/React.createElement(PField, {
    label: "Slot type"
  }, /*#__PURE__*/React.createElement(PChoice, {
    options: SLOT_TYPES,
    value: type,
    onChange: setType
  })), /*#__PURE__*/React.createElement(PField, {
    label: "Label"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    style: pInput,
    value: label,
    onChange: e => setLabel(e.target.value),
    placeholder: "e.g. assembly video"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pBtnGhost,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    style: pBtn,
    onClick: () => {
      onAttach(type, label || type);
      onClose();
    }
  }, "Attach")));
}
function NoteModal({
  ndo,
  onClose,
  onSave
}) {
  const [t, setT] = React.useState('');
  return /*#__PURE__*/React.createElement(PModal, {
    title: "Leave a trace",
    sub: 'A note on ' + ndo.name + '. Signed by you and gossiped to peers who hold this NDO.',
    onClose: onClose
  }, /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    style: {
      ...pInput,
      minHeight: 90
    },
    value: t,
    onChange: e => setT(e.target.value),
    placeholder: "What should the next agent know?"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pBtnGhost,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...pBtn,
      opacity: t.trim() ? 1 : .4
    },
    disabled: !t.trim(),
    onClick: () => {
      onSave(t);
      onClose();
    }
  }, "Sign & leave")));
}
function AdvanceModal({
  ndo,
  onClose,
  onAdvance
}) {
  const opts = [NEXT_STAGE[ndo.stage], ndo.stage !== 'Deprecated' && 'Deprecated', 'EndOfLife'].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const [to, setTo] = React.useState(opts[0]);
  return /*#__PURE__*/React.createElement(PModal, {
    title: "Advance lifecycle",
    sub: ndo.name + ' is ' + ndo.stage + '.',
    onClose: onClose,
    width: 400
  }, /*#__PURE__*/React.createElement(PChoice, {
    options: opts,
    value: to,
    onChange: setTo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pBtnGhost,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    style: pBtn,
    onClick: () => {
      onAdvance(to);
      onClose();
    }
  }, "Move to ", to)));
}
function WhyModal({
  sig,
  ndo,
  onClose
}) {
  return /*#__PURE__*/React.createElement(PModal, {
    title: "Why am I seeing this?",
    sub: ndo.name,
    onClose: onClose,
    width: 420
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--pmono, monospace)',
      fontSize: 12,
      lineHeight: 1.7,
      background: 'rgba(127,127,127,.08)',
      padding: 12,
      borderRadius: 8
    }
  }, sig.why.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, w))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--pm)'
    }
  }, "Signals are derived from the NDO's own state and rules. No ranking algorithm, no central feed."));
}
const STAGE_LABEL = {
  queued: 'Queued · no peers reachable',
  signed: 'Signed on your source chain',
  gossip: 'Gossiping',
  validated: 'Validated by peers'
};
function PToasts({
  toasts,
  onDrop,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 18,
      bottom: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: 60,
      width: 300
    }
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    onClick: () => onDrop(t.id),
    style: {
      background: dark ? '#E6EFEE' : '#131A1C',
      color: dark ? '#0B1113' : '#fff',
      borderRadius: 12,
      padding: '11px 13px',
      fontSize: 13,
      boxShadow: '0 12px 30px -10px rgba(0,0,0,.45)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 6
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      marginBottom: 6
    }
  }, ['signed', 'gossip', 'validated'].map((k, i) => {
    const idx = ['signed', 'gossip', 'validated'].indexOf(t.stage);
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        flex: 1,
        height: 3,
        borderRadius: 2,
        background: t.stage === 'queued' ? '#E0A21A' : i <= idx ? '#2EC4B6' : 'rgba(127,127,127,.35)',
        transition: 'background 300ms'
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      opacity: .75
    }
  }, STAGE_LABEL[t.stage], t.stage === 'gossip' ? ' · ' + t.peers + ' of 23 peers' : ''))));
}
function useModals() {
  const [m, setM] = React.useState(null);
  return [m, setM];
}
function ModalHost({
  m,
  setM,
  P
}) {
  if (!m) return null;
  const close = () => setM(null);
  const ndo = m.ndo && P.q.ndo(m.ndo);
  if (m.type === 'create') return /*#__PURE__*/React.createElement(CreateNdoModal, {
    groups: P.s.groups,
    onClose: close,
    onCreate: f => {
      const id = P.actions.createNdo(f);
      m.after && m.after(id);
    }
  });
  if (m.type === 'attach') return /*#__PURE__*/React.createElement(AttachModal, {
    ndo: ndo,
    onClose: close,
    onAttach: (t, l) => P.actions.attach(ndo.id, t, l)
  });
  if (m.type === 'note') return /*#__PURE__*/React.createElement(NoteModal, {
    ndo: ndo,
    onClose: close,
    onSave: t => P.actions.leaveNote(ndo.id, t)
  });
  if (m.type === 'advance') return /*#__PURE__*/React.createElement(AdvanceModal, {
    ndo: ndo,
    onClose: close,
    onAdvance: to => P.actions.advance(ndo.id, to)
  });
  if (m.type === 'why') return /*#__PURE__*/React.createElement(WhyModal, {
    sig: m.sig,
    ndo: ndo,
    onClose: close
  });
  return null;
}
Object.assign(window, {
  PModal,
  pBtn,
  pBtnGhost,
  pInput,
  PToasts,
  ModalHost,
  useModals,
  STAGE_LABEL
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/revamp/proto/ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AgentProfile.jsx
try { (() => {
// DS prototype: src/routes/ui-kit/agent-profile (not yet in live app)
const card = {
  background: '#fff',
  border: `1px solid ${rgb('gray-200')}`,
  borderRadius: 8,
  padding: 16,
  boxShadow: 'var(--ndo-shadow-sm)'
};
const cardTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: rgb('gray-800')
};
const hintT = {
  fontSize: 12,
  color: rgb('gray-500'),
  margin: 0,
  lineHeight: 1.5
};
const twoCol = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  gap: 16,
  marginBottom: 16
};
function ProtoTabs({
  tabs,
  tab,
  setTab,
  activeBg = 'gray-100',
  pad = '6px 12px',
  gap = 4
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap
    }
  }, tabs.map(([id, l]) => {
    const a = tab === id;
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: id,
      onClick: () => setTab(id),
      hover: a ? null : {
        color: rgb('gray-800')
      },
      style: {
        padding: pad,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'inherit',
        border: `1px solid ${a ? rgb('gray-200') : 'transparent'}`,
        borderBottom: 'none',
        borderRadius: '4px 4px 0 0',
        background: a ? rgb(activeBg) : 'transparent',
        color: a ? rgb('gray-900') : rgb('gray-500'),
        cursor: 'pointer',
        transition: 'color 150ms, background-color 150ms'
      }
    }, l);
  }));
}
function AgentProfile({
  go
}) {
  const [tab, setTab] = React.useState('reputation');
  const [empty, setEmpty] = React.useState(false);
  const metrics = [['Timeliness', 0.82, 'emerald-700'], ['Quality', 0.85, 'emerald-700'], ['Reliability', 0.88, 'emerald-700'], ['Communication', 0.76, 'blue-600']];
  const pprs = [['CustodyTransfer', 12], ['ResourceCreation', 8], ['ValidationActivity', 7], ['TransportFulfillment', 6], ['MaintenanceFulfillment', 6], ['GoodFaithTransfer', 5], ['GovernanceCompliance', 3]];
  const commits = [['transport_custody', 'Community Solar Array', 'Due: 2026-05-15 · You → Bob K.', 'active'], ['maintenance', 'Open Hardware CNC Bed', 'Due: 2026-05-20 · Accepted commitment', 'pending'], ['validation', 'Distributed Sensor Design', 'Validator in 2-of-3 ResourceValidation', 'active']];
  const tiers = [['L1', ['gray-200', 'gray-700'], 'Lobby Profile', 'Stored in localStorage. Never written to DHT. Nickname: SoushAI. Email: not shared. Permissionless — exists before any DHT action.'], ['L2', ['blue-100', 'blue-700'], 'Group Profile', 'Per-group disclosure preferences in localStorage. Sensorica: anonymous. OVN: nickname + bio. No DHT entry required for group membership.'], ['L3', ['emerald-100', 'emerald-700'], 'Agent (DHT)', 'Person entry on the DHT — created on first economic action. Public: name, avatar. Private: legal name, email (capability-gated, 30-day max). Permanent: cannot be deleted.']];
  const affs = [['Sensorica', 'CoreAffiliate', ['amber-100', 'amber-700']], ['Open Value Network', 'ActiveAffiliate', ['emerald-100', 'emerald-700']], ['Fablab Montréal', 'CloseAffiliate', ['blue-50', 'blue-600']]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderBottom: `1px solid ${rgb('gray-200')}`,
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-500'),
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'lobby'
      });
    },
    style: {
      color: rgb('gray-500')
    }
  }, "\u2190 Lobby"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", null, "My Profile")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${rgb('blue-600')}, ${rgb('indigo-700')})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0
    }
  }, "SA"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 2px'
    }
  }, "SoushAI"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-500'),
      marginBottom: 8
    }
  }, "uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVaWx9\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-active",
    label: "Accountable Agent"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "nature-physical",
    label: "Transport"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-distributed",
    label: "ActiveAffiliate"
  }))), /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost"
  }, "Edit profile")), /*#__PURE__*/React.createElement(ProtoTabs, {
    tab: tab,
    setTab: setTab,
    tabs: [['reputation', 'Reputation'], ['identity', 'Identity'], ['commitments', 'Commitments'], ['affiliations', 'Affiliations']]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, tab === 'reputation' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: twoCol
  }, /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: cardTitle
  }, "Reputation Summary"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEmpty(!empty),
    style: {
      fontSize: 12,
      color: rgb('blue-600'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, "Toggle empty state")), !empty ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, "47"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "total interactions")), metrics.map(([l, s, c]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: rgb('gray-600'),
      width: '5.5rem',
      flexShrink: 0
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: '0.4rem',
      background: rgb('gray-200'),
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${s * 100}%`,
      background: rgb(c),
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontFamily: 'var(--ndo-font-mono)',
      color: rgb('gray-500'),
      width: '2.5rem',
      textAlign: 'right'
    }
  }, s.toFixed(2)))), /*#__PURE__*/React.createElement("p", {
    style: hintT
  }, "PPRs are stored as private entries on your source chain. Only you can derive this summary.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px 16px',
      border: `1px dashed ${rgb('gray-300')}`,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-500'),
      margin: 0
    }
  }, "No interactions yet. Complete your first economic process to start building your reputation."))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "PPR Distribution"), pprs.map(([t, n]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 8px',
      borderRadius: 4,
      background: rgb('gray-50'),
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: rgb('gray-700')
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-600'),
      background: rgb('gray-200'),
      padding: '1.6px 6.4px',
      borderRadius: 999
    }
  }, n))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...hintT,
      marginTop: 12,
      paddingTop: 8,
      borderTop: `1px solid ${rgb('gray-100')}`
    }
  }, "47 total \xB7 14 claim categories available"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: rgb('blue-50'),
      border: `1px solid ${rgb('blue-100')}`,
      borderRadius: 8,
      padding: 16,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: rgb('blue-800'),
      margin: '0 0 4px'
    }
  }, "\uD83C\uDF96 Eligible for role promotion"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: rgb('blue-700'),
      margin: 0
    }
  }, "You have 47 completed interactions and a governance_claims count of 10. You can request promotion to ", /*#__PURE__*/React.createElement("strong", null, "Primary Accountable Agent"), ". An existing PrimaryAccountable must approve your request.")), /*#__PURE__*/React.createElement(NDS.Button, null, "Request Promotion \u2192"))), tab === 'identity' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: twoCol
  }, /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Three-Tier Identity Model"), tiers.map(([lv, c, n, d]) => /*#__PURE__*/React.createElement("div", {
    key: lv,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: 8,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      flexShrink: 0,
      background: rgb(c[0]),
      color: rgb(c[1])
    }
  }, lv), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-700')
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500'),
      marginTop: 2,
      lineHeight: 1.5
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Devices & Keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      borderRadius: 4,
      background: rgb('blue-50'),
      border: `1px solid ${rgb('blue-100')}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12,
      fontWeight: 600,
      color: rgb('blue-800')
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCBB Desktop (Primary)"), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-active",
    label: "active"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('blue-700'),
      marginTop: 4
    }
  }, "uhCAk2vMp8X3n\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      borderRadius: 4,
      background: rgb('gray-50'),
      border: `1px solid ${rgb('gray-200')}`,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-700')
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF1 Mobile (Secondary)"), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "lifecycle-hibernating",
    label: "inactive"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-500'),
      marginTop: 4
    }
  }, "uhCAk9Rp7Yq2m\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: "coming-soon",
    label: "Flowsta identity linking (post-MVP)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Private Data (capability-gated)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
      gap: 8
    }
  }, [['Legal name', '••••••••• (private)'], ['Email', '••••••••• (private)'], ['Location', 'Montréal, QC (granted)']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: 8,
      background: rgb('gray-50'),
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, v)))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...hintT,
      marginTop: 12
    }
  }, "Private entries stored only on your source chain. Shared via capability grants with 30-day maximum expiry."))), tab === 'commitments' && /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Active Commitments (3)"), commits.map(([a, r, d, s]) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: 12,
      border: `1px solid ${rgb('gray-200')}`,
      borderRadius: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "nature-physical",
    label: a
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, r), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500'),
      marginTop: 2
    }
  }, d)), /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: s,
    label: s === 'active' ? 'In progress' : 'Pending'
  })))), tab === 'affiliations' && /*#__PURE__*/React.createElement("div", {
    style: twoCol
  }, /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Network Affiliations"), affs.map(([n, s, c], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: i < affs.length - 1 ? `1px solid ${rgb('gray-100')}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-800')
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '1.6px 6.4px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      background: rgb(c[0]),
      color: rgb(c[1])
    }
  }, s))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...hintT,
      marginTop: 12
    }
  }, "AffiliationState is derived \u2014 not stored. Computed from PPR activity, recency, and contribution history.")), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cardTitle,
      marginBottom: 12
    }
  }, "Affiliation Record"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      background: rgb('emerald-100', 0.4),
      border: `1px solid ${rgb('emerald-100')}`,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('emerald-700')
    }
  }, "\u2713 Sensorica \u2014 Terms signed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-600'),
      marginTop: 4
    }
  }, "Nondominium & Custodian agreement \xB7 Benefit Redistribution Algorithm \xB7 ToP v1.2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontFamily: 'var(--ndo-font-mono)',
      color: rgb('gray-500'),
      marginTop: 4
    }
  }, "Signed: 2025-11-14")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: "coming-soon",
    label: "AffiliationRecord entry (post-MVP)"
  }))))));
}
Object.assign(window, {
  AgentProfile,
  ProtoTabs,
  protoCard: card,
  protoCardTitle: cardTitle,
  protoHint: hintT
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AgentProfile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Browse.jsx
try { (() => {
const STAGES = ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'];
const NATURES = ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'];
const REGIMES = ['Private', 'Commons', 'Collective', 'Pool', 'CommonPool', 'Public', 'Nondominium'];
const chip = (bg, fg, bd) => ({
  background: rgb(bg),
  color: rgb(fg),
  borderColor: rgb(bd)
});
const STAGE_C = {
  Ideation: chip('gray-100', 'gray-600', 'gray-300'),
  Specification: chip('blue-50', 'blue-600', 'blue-300'),
  Development: chip('indigo-100', 'indigo-700', 'indigo-300'),
  Prototype: chip('amber-100', 'amber-700', 'amber-300'),
  Stable: chip('green-100', 'green-700', 'green-300'),
  Distributed: chip('teal-100', 'teal-700', 'teal-300'),
  Active: chip('emerald-100', 'emerald-700', 'emerald-300'),
  Hibernating: chip('yellow-100', 'yellow-700', 'yellow-300'),
  Deprecated: chip('orange-100', 'orange-700', 'orange-300'),
  EndOfLife: chip('red-100', 'red-700', 'red-300')
};
const NATURE_C = {
  Physical: chip('blue-100', 'blue-700', 'blue-300'),
  Digital: chip('purple-100', 'purple-700', 'purple-300'),
  Service: chip('orange-100', 'orange-700', 'orange-300'),
  Hybrid: chip('teal-100', 'teal-700', 'teal-300'),
  Information: chip('indigo-100', 'indigo-700', 'indigo-300')
};
const REGIME_C = {
  Private: chip('gray-100', 'gray-600', 'gray-300'),
  Commons: chip('cyan-100', 'cyan-700', 'cyan-300'),
  Collective: chip('violet-100', 'violet-700', 'violet-300'),
  Pool: chip('amber-100', 'amber-700', 'amber-300'),
  CommonPool: chip('rose-100', 'rose-700', 'rose-300'),
  Public: chip('sky-100', 'sky-700', 'sky-300'),
  Nondominium: chip('emerald-100', 'emerald-700', 'emerald-300')
};
function FilterRow({
  label,
  items,
  colors,
  active,
  toggle,
  dashed,
  first
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 6,
      marginTop: first ? 0 : 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: 4,
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-500'),
      textTransform: 'uppercase'
    }
  }, label, ":"), items.map(s => {
    const on = active.includes(s);
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: s,
      onClick: () => toggle(s),
      hover: on ? null : {
        opacity: 1
      },
      style: {
        ...colors[s],
        cursor: 'pointer',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: dashed ? 'dashed' : 'solid',
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'opacity 150ms',
        opacity: on ? 1 : 0.6,
        boxShadow: on ? `0 0 0 1px #fff, 0 0 0 3px currentColor` : 'none'
      }
    }, s);
  }));
}
function NdoBrowser({
  ndos,
  go,
  isLoading,
  errorMessage,
  onRetry,
  showOnboarding,
  hasGroups = true,
  onCreateGroup,
  onJoinGroup
}) {
  const [f, setF] = React.useState({
    stages: [],
    natures: [],
    regimes: []
  });
  const tog = k => v => setF(p => ({
    ...p,
    [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v]
  }));
  const has = f.stages.length || f.natures.length || f.regimes.length;
  const list = ndos.filter(d => (!f.stages.length || f.stages.includes(d.lifecycle_stage)) && (!f.natures.length || f.natures.includes(d.resource_nature)) && (!f.regimes.length || f.regimes.includes(d.property_regime)));
  let content;
  if (isLoading) content = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      marginRight: 8,
      display: 'inline-block',
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: `2px solid ${rgb('gray-300')}`,
      borderTopColor: rgb('blue-600'),
      animation: 'ndoSpin 1s linear infinite'
    }
  }), "Loading NDOs\u2026");else if (list.length === 0 && !errorMessage) {
    if (showOnboarding && !hasGroups) content = /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 8,
        border: `1px dashed ${rgb('blue-300')}`,
        background: rgb('blue-50'),
        padding: 24,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        fontWeight: 500,
        color: rgb('gray-800')
      }
    }, "Create or join a group to see NDOs"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        fontSize: 14,
        color: rgb('gray-500')
      }
    }, "NDOs are scoped to groups. Start by creating a group or pasting an invite link."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        justifyContent: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: onCreateGroup
    }, "Create group"), /*#__PURE__*/React.createElement(Hoverable, {
      onClick: onJoinGroup,
      hover: {
        background: rgb('blue-100')
      },
      style: {
        borderRadius: 4,
        border: `1px solid ${rgb('blue-300')}`,
        background: 'transparent',
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 500,
        color: rgb('blue-700'),
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "Join group")));else content = /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        color: rgb('gray-500')
      }
    }, has ? 'No NDOs match the selected filters.' : 'No NDOs yet. Create one inside a group to see it here.');
  } else content = /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))'
    }
  }, list.map(d => /*#__PURE__*/React.createElement("li", {
    key: d.hash
  }, /*#__PURE__*/React.createElement(NDS.Card, {
    name: d.name,
    description: d.description,
    hash: d.hash,
    badges: ndoBadges(d),
    onClick: e => {
      e.preventDefault();
      go({
        view: 'ndo',
        hash: d.hash
      });
    }
  }))));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderRadius: 8,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      boxShadow: 'var(--ndo-shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement(FilterRow, {
    first: true,
    label: "Stage",
    items: STAGES,
    colors: STAGE_C,
    active: f.stages,
    toggle: tog('stages')
  }), /*#__PURE__*/React.createElement(FilterRow, {
    label: "Nature",
    items: NATURES,
    colors: NATURE_C,
    active: f.natures,
    toggle: tog('natures')
  }), /*#__PURE__*/React.createElement(FilterRow, {
    dashed: true,
    label: "Regime",
    items: REGIMES,
    colors: REGIME_C,
    active: f.regimes,
    toggle: tog('regimes')
  }), has ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setF({
      stages: [],
      natures: [],
      regimes: []
    }),
    style: {
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      fontSize: 12,
      color: rgb('gray-400'),
      textDecoration: 'underline'
    }
  }, "Clear filters")) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, "NDO browser", has ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      fontSize: 14,
      fontWeight: 400,
      color: rgb('gray-400')
    }
  }, "(", list.length, " results)") : null), isLoading && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Loading\u2026")), errorMessage && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      borderRadius: 4,
      border: `1px solid ${rgb('red-200')}`,
      background: rgb('red-50'),
      padding: 8,
      fontSize: 14,
      color: rgb('red-700')
    }
  }, /*#__PURE__*/React.createElement("span", null, errorMessage), onRetry && /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onRetry,
    hover: {
      background: rgb('red-100')
    },
    style: {
      flexShrink: 0,
      borderRadius: 4,
      border: `1px solid ${rgb('red-300')}`,
      background: '#fff',
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('red-700'),
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, "Retry")), /*#__PURE__*/React.createElement("div", {
    "aria-busy": !!isLoading
  }, content)));
}
function LobbyView({
  go,
  ndos,
  hasProfile = true,
  lobbyState = 'default',
  onOpenProfile,
  onCreateGroup,
  onJoinGroup,
  onRetry
}) {
  const noGroups = lobbyState === 'no-groups';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100%',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ProfileBar, {
    hasProfile: hasProfile,
    onOpenProfile: onOpenProfile
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, "Browse NDOs"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      color: rgb('gray-600')
    }
  }, "All NDOs across your groups."), hasProfile && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Agent: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, "Tiberius"))), /*#__PURE__*/React.createElement(NdoBrowser, {
    ndos: noGroups || lobbyState === 'error' ? [] : ndos,
    go: go,
    isLoading: lobbyState === 'loading',
    errorMessage: lobbyState === 'error' ? 'Failed to load NDOs from the Lobby.' : null,
    onRetry: onRetry,
    showOnboarding: true,
    hasGroups: !noGroups,
    onCreateGroup: onCreateGroup,
    onJoinGroup: onJoinGroup
  })));
}
function MemberList({
  members
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "Members"), members.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-300')}`,
      padding: 16,
      fontSize: 14,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "No members yet.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, members.map(m => /*#__PURE__*/React.createElement("li", {
    key: m.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: '8px 12px',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, m.name), m.role && /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 9999,
      background: rgb('gray-100'),
      padding: '2px 8px',
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, m.role)))));
}

// group/SoftLinkList + group/WorkLogFeed — exist in ui/ but are not mounted by GroupView yet
function SoftLinkList({
  softlinks
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "Soft links"), softlinks.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-400')}`,
      padding: 16,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No soft links (stub). Planning-only links use dashed borders per lobby conventions.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, softlinks.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.id,
    style: {
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-400')}`,
      padding: 12,
      fontSize: 14
    }
  }, s.label))));
}
function WorkLogFeed({
  worklogs
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "Work log"), worklogs.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px dashed ${rgb('gray-400')}`,
      padding: 16,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No work log entries (stub).") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, worklogs.map(w => /*#__PURE__*/React.createElement("li", {
    key: w.id,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 12,
      fontSize: 14
    }
  }, w.title))));
}
function GroupView({
  id,
  go,
  ndos,
  onCreate,
  errorMessage
}) {
  const g = GROUPS.find(x => x.id === id) || GROUPS[0];
  const [copied, setCopied] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, g.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 14,
      color: rgb('gray-400')
    }
  }, g.id, "-7f3a9c2e-b41d")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    hover: {
      background: rgb('gray-50')
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb('gray-300')}`,
      background: 'transparent',
      padding: '8px 12px',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-600'),
      fontFamily: 'inherit'
    }
  }, copied ? 'Invite link copied!' : 'Copy invite link'), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onCreate,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      border: 0,
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '8px 16px',
      fontSize: 14,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1
    }
  }, "+"), " Create NDO"))), errorMessage && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      borderRadius: 4,
      border: `1px solid ${rgb('red-200')}`,
      background: rgb('red-50'),
      padding: 8,
      fontSize: 14,
      color: rgb('red-700')
    }
  }, errorMessage), /*#__PURE__*/React.createElement(NdoBrowser, {
    ndos: ndos.filter(d => d.group === g.id),
    go: go
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(MemberList, {
    members: MEMBERS
  })));
}
Object.assign(window, {
  NdoBrowser,
  LobbyView,
  GroupView,
  MemberList,
  SoftLinkList,
  WorkLogFeed
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Browse.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Connection.jsx
try { (() => {
// HolochainProvider states + routes/ndo/new placeholder
const center = {
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff'
};
const HINTS = ['Wait until the terminal shows "[launch-happ] Agent N ready" for each agent, then click Retry in the UI.', 'Large happ bundles can take a few minutes to install on first start — keep the terminal open.', 'If startup fails, stop the process and run `bun run network` again (runs `hc sandbox clean` first).'];
function ConnectingScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: center
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 60,
      animation: 'ndoPulse 2s cubic-bezier(0.4,0,0.6,1) infinite'
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 18,
      color: rgb('gray-600')
    }
  }, "Connecting to Holochain...")));
}
function ConnectionFailedScreen({
  onRetry
}) {
  const msg = 'Unable to connect to Holochain — no launcher environment and no dev connection info found.';
  return /*#__PURE__*/React.createElement("div", {
    style: center
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '28rem',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 60
    }
  }, "\u274C"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 20,
      fontWeight: 600,
      color: rgb('red-600')
    }
  }, "Connection Failed"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      color: rgb('gray-600')
    }
  }, "Unable to connect to Holochain conductor: ", msg), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: '0 0 16px',
      paddingLeft: 20,
      textAlign: 'left',
      fontSize: 14,
      color: rgb('gray-600'),
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, HINTS.map(h => /*#__PURE__*/React.createElement("li", {
    key: h
  }, h))), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onRetry,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '8px 16px',
      color: '#fff',
      border: 0,
      cursor: 'pointer',
      fontSize: 16,
      fontFamily: 'inherit',
      transition: 'background-color 150ms'
    }
  }, "Retry Connection"), /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 16,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Connection Details"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      borderRadius: 4,
      background: rgb('gray-100'),
      padding: 12,
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "URL:"), " (not connected)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Mode:"), " unknown"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", msg)))));
}
function NotConnectedScreen({
  onConnect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: center
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 60
    }
  }, "\uD83D\uDD0C"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 18,
      color: rgb('gray-600')
    }
  }, "Holochain not connected.", /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onConnect,
    hover: {
      background: 'rgb(21 128 61)'
    },
    style: {
      marginLeft: 8,
      borderRadius: 4,
      background: 'rgb(22 163 74)',
      padding: '4px 12px',
      color: '#fff',
      border: 0,
      cursor: 'pointer',
      fontSize: 16,
      fontFamily: 'inherit'
    }
  }, "Connect"))));
}
function NewNdoPlaceholder({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: '32rem'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, "New NDO"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, "NDOs are created from within a ", /*#__PURE__*/React.createElement("strong", null, "Group"), ". Groups are the organizational context for NDO creation in Nondominium."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      borderRadius: 8,
      border: `1px dashed ${rgb('gray-300')}`,
      background: rgb('gray-50'),
      padding: '32px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Please create or join a Group from the Lobby first, then use the ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('blue-600')
    }
  }, "+ Create NDO"), " button inside the group."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    onClick: () => go({
      view: 'lobby'
    })
  }, "Go to Lobby"))));
}
Object.assign(window, {
  ConnectingScreen,
  ConnectionFailedScreen,
  NotConnectedScreen,
  NewNdoPlaceholder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Connection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/GovernanceModals.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Live-app governance/activity modals: RuleEditorModal, CommitmentCreateForm, EconomicEventCreateForm
// Constraint messages copied from crates/shared/src/constraints.rs
const VF_ACTIONS = ['Transfer', 'Move', 'Use', 'Consume', 'Produce', 'Work', 'Modify', 'Combine', 'Separate', 'Raise', 'Lower', 'Cite', 'Accept', 'InitialTransfer', 'AccessForUse', 'TransferCustody'];
const ME_B64 = 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa';
function checkAction(ndo, action) {
  const v = [];
  if (action === 'Move' && ['Digital', 'Information'].includes(ndo.resource_nature)) v.push({
    rule_id: 'no_transport_for_non_physical_nature',
    message: `Transport (Move) does not apply to a ${ndo.resource_nature} resource.`,
    severity: 'Soft'
  });
  if (ndo.property_regime === 'Nondominium' && ['Transfer', 'Consume', 'Lower'].includes(action)) v.push({
    rule_id: 'nondominium_no_unilateral_capture',
    message: `${action} is not permitted on a Nondominium resource (REQ-RES-03).`,
    severity: 'Hard'
  });
  return v;
}
function checkRule(ndo, kind, f) {
  if (kind === 'TransferCondition' && f.transfer_type === 'Ownership' && ['Nondominium', 'Commons', 'Pool', 'CommonPool', 'Public'].includes(ndo.property_regime)) return [{
    rule_id: 'ownership_transfer_not_permitted_by_regime',
    message: `${ndo.property_regime} does not permit ownership-transfer rules.`,
    severity: ndo.property_regime === 'Nondominium' ? 'Hard' : 'Soft'
  }];
  if (kind === 'AccessRequirement' && f.accessibility === 'Gated' && ndo.property_regime === 'Nondominium') return [{
    rule_id: 'gated_access_contradicts_permissionless_regime',
    message: "Nondominium resources must remain permissionless (REQ-RES-01); 'Gated' access creates a discretionary chokepoint.",
    severity: 'Soft'
  }];
  return [];
}
function Violations({
  list
}) {
  const box = (bd, bg, fg) => ({
    listStyle: 'none',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    borderRadius: 4,
    border: `1px solid ${bd}`,
    background: rgb(bg),
    padding: 12,
    fontSize: 14,
    color: rgb(fg)
  });
  const hard = list.filter(v => v.severity === 'Hard'),
    soft = list.filter(v => v.severity === 'Soft');
  return /*#__PURE__*/React.createElement(React.Fragment, null, hard.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: box(rgb('red-200'), 'red-50', 'red-700')
  }, hard.map(v => /*#__PURE__*/React.createElement("li", {
    key: v.rule_id
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "[", v.rule_id, "]"), " ", v.message))), soft.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: box('rgb(253 230 138)', 'amber-50', 'amber-800')
  }, soft.map(v => /*#__PURE__*/React.createElement("li", {
    key: v.rule_id
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "[", v.rule_id, "]"), " ", v.message))));
}
function RuleEditorModal({
  ndo,
  specName,
  onClose,
  onCreate
}) {
  const [kind, setKind] = React.useState('AccessRequirement');
  const [f, setF] = React.useState({
    accessibility: 'Free',
    required_role: '',
    min_affiliation: '',
    max_duration_hours: '',
    max_quantity_per_period: '',
    period_days: '',
    transfer_type: 'Custody',
    requires_validation: false,
    validator_role: '',
    interval_days: '30',
    maint_role: '',
    enforced_by: ''
  });
  const b = k => ({
    value: f[k],
    onChange: e => setF({
      ...f,
      [k]: e.target.value
    })
  });
  const viol = checkRule(ndo, kind, f);
  const hard = viol.some(v => v.severity === 'Hard');
  const payload = () => kind === 'AccessRequirement' ? {
    accessibility: f.accessibility,
    required_role: f.required_role,
    min_affiliation: f.min_affiliation
  } : kind === 'UsageLimit' ? {
    max_duration_hours: f.max_duration_hours,
    max_quantity_per_period: f.max_quantity_per_period,
    period_days: f.period_days
  } : kind === 'TransferCondition' ? {
    transfer_type: f.transfer_type,
    requires_validation: String(f.requires_validation),
    validator_role: f.validator_role
  } : {
    interval_days: f.interval_days,
    required_role: f.maint_role
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "New governance rule",
    subtitle: "Typed RuleData with live constraint dry-run (Hard blocks submit).",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: hard,
      onClick: () => onCreate({
        kind,
        spec: specName,
        payload: payload(),
        enforced_by: f.enforced_by
      })
    }, "Create rule"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Rule type"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: kind,
    onChange: e => setKind(e.target.value)
  }, ['AccessRequirement', 'UsageLimit', 'TransferCondition', 'MaintenanceSchedule'].map(k => /*#__PURE__*/React.createElement("option", {
    key: k
  }, k)))), kind === 'AccessRequirement' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Accessibility"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('accessibility')), /*#__PURE__*/React.createElement("option", null, "Free"), /*#__PURE__*/React.createElement("option", null, "Credentialed"), /*#__PURE__*/React.createElement("option", null, "Gated"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Required role"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('required_role')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Min affiliation"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('min_affiliation'))))), kind === 'UsageLimit' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Max duration (hours)"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "number"
  }, b('max_duration_hours')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Max quantity / period"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "number"
  }, b('max_quantity_per_period')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Period (days)"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "number"
  }, b('period_days'))))), kind === 'TransferCondition' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Transfer type"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('transfer_type')), /*#__PURE__*/React.createElement("option", null, "Ownership"), /*#__PURE__*/React.createElement("option", null, "Custody"), /*#__PURE__*/React.createElement("option", null, "UseRights"), /*#__PURE__*/React.createElement("option", null, "Benefit"))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: f.requires_validation,
    onChange: () => setF({
      ...f,
      requires_validation: !f.requires_validation
    }),
    style: {
      margin: 0
    }
  }), "Requires validation"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Validator role"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('validator_role'))))), kind === 'MaintenanceSchedule' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Interval (days)"), /*#__PURE__*/React.createElement(Input, _extends({
    type: "number"
  }, b('interval_days')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Required role"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('maint_role'))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Enforced by"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, b('enforced_by')))), /*#__PURE__*/React.createElement(Violations, {
    list: viol
  }));
}
function CommitmentCreateForm({
  ndo,
  onClose,
  onCreate
}) {
  const [action, setAction] = React.useState('Use');
  const [provider, setProvider] = React.useState(ME_B64);
  const [due, setDue] = React.useState('');
  const [note, setNote] = React.useState('');
  const [err, setErr] = React.useState('');
  const viol = checkAction(ndo, action);
  const hard = viol.some(v => v.severity === 'Hard');
  const submit = () => {
    if (!provider || !due) return setErr('Provider and due date are required.');
    onCreate({
      action,
      due: new Date(due).toLocaleString(),
      note
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Propose commitment",
    subtitle: /*#__PURE__*/React.createElement(React.Fragment, null, "Dry-runs ", /*#__PURE__*/React.createElement("code", {
      style: {
        fontSize: 12
      }
    }, "check_action_constraints"), " before write."),
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: hard,
      onClick: submit
    }, "Propose"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Action"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: action,
    onChange: e => setAction(e.target.value)
  }, VF_ACTIONS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a
  }, a)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Provider (agent pubkey b64)"), /*#__PURE__*/React.createElement(Input, {
    value: provider,
    onChange: e => setProvider(e.target.value),
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Due date"), /*#__PURE__*/React.createElement(Input, {
    type: "datetime-local",
    value: due,
    onChange: e => setDue(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Note"), /*#__PURE__*/React.createElement(Input, {
    as: "textarea",
    rows: 2,
    light: true,
    value: note,
    onChange: e => setNote(e.target.value)
  })), /*#__PURE__*/React.createElement(Violations, {
    list: viol
  }), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
function EconomicEventCreateForm({
  ndo,
  commitments,
  onClose,
  onCreate
}) {
  const [fromC, setFromC] = React.useState('');
  const [action, setAction] = React.useState('Use');
  const [provider, setProvider] = React.useState(ME_B64);
  const [receiver, setReceiver] = React.useState(ME_B64);
  const [res, setRes] = React.useState('');
  const [qty, setQty] = React.useState('1');
  const [note, setNote] = React.useState('');
  const [err, setErr] = React.useState('');
  const viol = checkAction(ndo, action);
  const hard = viol.some(v => v.severity === 'Hard');
  const mono = {
    fontFamily: 'var(--ndo-font-mono)',
    fontSize: 12
  };
  const submit = () => {
    if (!provider || !receiver || !res) return setErr('Provider, receiver, and resource hash are required.');
    onCreate({
      action,
      qty: Number(qty) || 1,
      time: new Date().toLocaleString(),
      note
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Log economic event",
    subtitle: /*#__PURE__*/React.createElement(React.Fragment, null, "Dry-runs ", /*#__PURE__*/React.createElement("code", {
      style: {
        fontSize: 12
      }
    }, "check_action_constraints"), " before write."),
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: hard,
      onClick: submit
    }, "Log event"))
  }, commitments.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Create from commitment"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: fromC,
    onChange: e => {
      setFromC(e.target.value);
      const c = commitments[e.target.value];
      if (c) setAction(c.action);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 none \u2014"), commitments.map((c, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, c.action, " \xB7 due ", c.due)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Action"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    value: action,
    onChange: e => setAction(e.target.value)
  }, VF_ACTIONS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a
  }, a)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Provider b64"), /*#__PURE__*/React.createElement(Input, {
    value: provider,
    onChange: e => setProvider(e.target.value),
    style: mono
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Receiver b64"), /*#__PURE__*/React.createElement(Input, {
    value: receiver,
    onChange: e => setReceiver(e.target.value),
    style: mono
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Resource action hash b64"), /*#__PURE__*/React.createElement(Input, {
    value: res,
    onChange: e => setRes(e.target.value),
    style: mono
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Quantity"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: qty,
    onChange: e => setQty(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Note"), /*#__PURE__*/React.createElement(Input, {
    as: "textarea",
    rows: 2,
    light: true,
    value: note,
    onChange: e => setNote(e.target.value)
  })), /*#__PURE__*/React.createElement(Violations, {
    list: viol
  }), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
Object.assign(window, {
  RuleEditorModal,
  CommitmentCreateForm,
  EconomicEventCreateForm,
  Violations,
  VF_ACTIONS,
  ME_B64
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/GovernanceModals.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/GroupProto.jsx
try { (() => {
// DS prototype: src/routes/ui-kit/group — richer group view (identity banner, pill filters, members panel)
function GroupProto({
  go
}) {
  const [banner, setBanner] = React.useState(true);
  const [empty, setEmpty] = React.useState(false);
  const [active, setActive] = React.useState([]);
  const tog = c => setActive(a => a.includes(c) ? a.filter(x => x !== c) : [...a, c]);
  const ndos = NDOS.slice(0, 4).map((d, i) => ({
    ...d,
    description: ['Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective.', 'Community-maintained CNC router available for approved fabrication tasks. Requires Transport role.', 'Open-source IoT sensor design file for environmental monitoring in urban commons.', 'Shared laser cutter maintained by the Open Hardware collective. Validation pending.'][i]
  }));
  const Chip = ({
    c
  }) => {
    const on = active.includes(c);
    return /*#__PURE__*/React.createElement(Hoverable, {
      onClick: () => tog(c),
      hover: on ? null : {
        borderColor: rgb('gray-400')
      },
      style: {
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        border: `1px solid ${on ? rgb('blue-600') : rgb('gray-300')}`,
        background: on ? rgb('blue-50') : '#fff',
        color: on ? rgb('blue-700') : rgb('gray-700'),
        cursor: 'pointer',
        transition: 'background-color 150ms, color 150ms, border-color 150ms'
      }
    }, c);
  };
  const Lbl = ({
    children
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: rgb('gray-500')
    }
  }, children);
  const Div = () => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 20,
      background: rgb('gray-300')
    }
  });
  const members = [['AL', 'Alice M.', 'Primary Accountable'], ['BK', 'Bob K.', 'Transport'], ['CR', 'Carol R.', 'Accountable Agent']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 4px'
    }
  }, "Sensorica"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, /*#__PURE__*/React.createElement("span", null, "7 members"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "4 NDOs"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: "active",
    label: "Active"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost"
  }, "\uD83C\uDF74 Fork NDO"), /*#__PURE__*/React.createElement(NDS.Button, {
    onClick: () => go({
      view: 'create',
      group: 'sensorica'
    })
  }, "+ Create NDO"))), banner && /*#__PURE__*/React.createElement("div", {
    style: {
      background: rgb('amber-50'),
      border: `1px solid ${rgb('amber-100')}`,
      borderRadius: 8,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('amber-800')
    }
  }, "\uD83D\uDC64 How do you want to appear in ", /*#__PURE__*/React.createElement("strong", null, "Sensorica"), "? Your Lobby profile is set but not linked to this group yet. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'group-proto',
        modal: 'groupProfile'
      });
    },
    style: {
      color: rgb('amber-800'),
      fontWeight: 600
    }
  }, "Set group profile \u2192")), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setBanner(false),
    hover: {
      background: rgb('amber-100')
    },
    style: {
      fontSize: 12,
      color: rgb('amber-700'),
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '3px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      fontFamily: 'inherit'
    }
  }, "Dismiss")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, "Lifecycle"), ['Active', 'Stable', 'Distributed', 'Prototype'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    c: c
  })), /*#__PURE__*/React.createElement(Div, null), /*#__PURE__*/React.createElement(Lbl, null, "Nature"), ['Physical', 'Digital'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    c: c
  })), /*#__PURE__*/React.createElement(Div, null), /*#__PURE__*/React.createElement(Lbl, null, "Regime"), ['Nondominium', 'Commons', 'Pool'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    c: c
  })), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setEmpty(!empty),
    hover: {
      color: rgb('gray-600')
    },
    style: {
      marginLeft: 'auto',
      fontSize: 12,
      color: rgb('gray-400'),
      background: 'none',
      border: `1px dashed ${rgb('gray-300')}`,
      borderRadius: 4,
      padding: '3px 8px',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, empty ? 'Show NDOs' : 'Show empty state')), !empty ? /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))'
    }
  }, ndos.map(d => {
    const bs = ndoBadges(d);
    return /*#__PURE__*/React.createElement("li", {
      key: d.hash
    }, /*#__PURE__*/React.createElement(NDS.Card, {
      name: d.name,
      description: d.description,
      hash: d.hash,
      badges: [bs[0], bs[2], bs[1]],
      onClick: e => {
        e.preventDefault();
        go({
          view: 'ndo',
          hash: d.hash
        });
      }
    }));
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: `2px dashed ${rgb('gray-300')}`,
      borderRadius: 12,
      padding: '48px 32px',
      textAlign: 'center',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 12
    }
  }, "\uD83D\uDCE6"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: rgb('gray-700'),
      margin: '0 0 4px'
    }
  }, "No NDOs in this group yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-500'),
      margin: '0 0 20px'
    }
  }, "NDOs created in this group will appear here. Start by creating your first Nondominium Object."), /*#__PURE__*/React.createElement(NDS.Button, {
    onClick: () => go({
      view: 'create',
      group: 'sensorica'
    })
  }, "+ Create first NDO"))), /*#__PURE__*/React.createElement("aside", {
    style: {
      width: '13rem',
      flexShrink: 0,
      alignSelf: 'flex-end',
      position: 'sticky',
      bottom: 0,
      background: '#fff',
      borderTop: `1px solid ${rgb('gray-200')}`,
      borderLeft: `1px solid ${rgb('gray-200')}`,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: rgb('gray-400'),
      marginBottom: 2
    }
  }, "Members (7)"), members.map(([i, n, r]) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: rgb('blue-100'),
      color: rgb('blue-700'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 700,
      flexShrink: 0
    }
  }, i), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-800')
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: rgb('gray-500')
    }
  }, r)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      opacity: 0.55
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: rgb('gray-200'),
      color: rgb('gray-500'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 700
    }
  }, "+4"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "4 more members")), /*#__PURE__*/React.createElement(Hoverable, {
    hover: {
      background: rgb('blue-50')
    },
    style: {
      width: '100%',
      padding: '5px 8px',
      borderRadius: 4,
      fontSize: 12,
      color: rgb('blue-600'),
      background: 'transparent',
      border: `1px dashed ${rgb('blue-600', 0.5)}`,
      cursor: 'pointer',
      marginTop: 4,
      fontFamily: 'inherit',
      transition: 'background-color 150ms'
    }
  }, "\uD83D\uDD17 Copy invite link")));
}
Object.assign(window, {
  GroupProto
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/GroupProto.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared modal + form primitives mirroring the Tailwind classes used across nondominium/ui modals.
function Modal({
  title,
  subtitle,
  width = 'md',
  onClose,
  footer,
  children,
  bodyScroll
}) {
  const w = {
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem'
  }[width];
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgb(0 0 0 / 0.4)',
      backdropFilter: 'blur(4px)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: w,
      borderRadius: 12,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      ...(bodyScroll ? {
        maxHeight: '70vh',
        overflowY: 'auto'
      } : null)
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      borderTop: `1px solid ${rgb('gray-100')}`,
      padding: '16px 24px'
    }
  }, footer)));
}
function TextBtn({
  onClick,
  children,
  small
}) {
  return /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onClick,
    hover: {
      background: rgb('gray-100')
    },
    style: {
      cursor: 'pointer',
      border: 0,
      borderRadius: 4,
      background: 'transparent',
      padding: small ? '4px 8px' : '8px 16px',
      fontSize: small ? 12 : 14,
      fontFamily: 'inherit',
      color: rgb('gray-600')
    }
  }, children);
}
function PrimaryBtn({
  onClick,
  children,
  disabled,
  small
}) {
  return /*#__PURE__*/React.createElement(Hoverable, {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    hover: disabled ? null : {
      background: rgb('blue-700')
    },
    style: {
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 0,
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: small ? '6px 12px' : '8px 16px',
      fontSize: small ? 12 : 14,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: '#fff',
      opacity: disabled ? 0.5 : 1
    }
  }, children);
}
function OutlineBtn({
  onClick,
  children,
  tone = 'gray',
  size = 'xs'
}) {
  const t = tone === 'blue' ? ['blue-300', 'blue-600', 'blue-50'] : tone === 'red' ? ['red-300', 'red-700', 'red-50'] : ['gray-300', 'gray-600', 'gray-50'];
  return /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onClick,
    hover: {
      background: rgb(t[2])
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb(t[0])}`,
      background: 'transparent',
      padding: size === 'sm' ? '8px 12px' : '6px 12px',
      fontSize: size === 'sm' ? 14 : 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: rgb(t[1])
    }
  }, children);
}
function Label({
  htmlFor,
  children,
  req,
  opt,
  muted
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      marginBottom: 4,
      display: 'block',
      fontSize: 14,
      fontWeight: muted ? 400 : 500,
      color: muted ? rgb('gray-600') : rgb('gray-700')
    }
  }, children, req && /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('red-600')
    }
  }, " *"), opt && /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400'),
      fontWeight: 400
    }
  }, " (optional)"));
}
function Input({
  as = 'input',
  light,
  dense,
  ...p
}) {
  const [f, setF] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({}, p, {
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      borderRadius: 4,
      border: `1px solid ${f ? 'rgb(59 130 246)' : light ? rgb('gray-200') : rgb('gray-300')}`,
      padding: dense ? '4px 8px' : '8px 12px',
      fontSize: dense ? 12 : 14,
      fontFamily: 'inherit',
      color: rgb('gray-900'),
      background: '#fff',
      outline: 'none',
      boxShadow: f && as !== 'select' ? '0 0 0 1px rgb(59 130 246)' : 'none',
      ...(p.style || {})
    }
  }));
}
const Hint = ({
  children,
  tone
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: '4px 0 0',
    fontSize: 12,
    color: tone === 'amber' ? rgb('amber-600') : tone === 'red' ? rgb('red-600') : rgb('gray-500')
  }
}, children);
const ErrorBox = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    borderRadius: 4,
    border: `1px solid ${rgb('red-200')}`,
    background: rgb('red-50'),
    padding: 8,
    fontSize: 14,
    color: rgb('red-700')
  }
}, children);
const CapsLabel = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    color: rgb('gray-400'),
    ...style
  }
}, children);
function Check({
  checked,
  onChange,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      width: 16,
      height: 16,
      margin: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, children));
}
Object.assign(window, {
  Modal,
  TextBtn,
  PrimaryBtn,
  OutlineBtn,
  Label,
  Input,
  Hint,
  ErrorBox,
  CapsLabel,
  Check
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Modal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Navigator.jsx
try { (() => {
// Kit-only navigator (not part of the product): jump to any screen / state / modal.
const KIT_DEFAULT = {
  route: {
    view: 'lobby'
  },
  modal: null,
  hasProfile: true,
  lobbyState: 'default',
  loadState: 'ok',
  conn: 'ok',
  sideForm: null
};
const nh = i => NDOS[i].hash;
const KIT_SCREENS = [['Live app · Lobby', [['Browse NDOs', {}], ['Loading', {
  lobbyState: 'loading'
}], ['Load error + retry', {
  lobbyState: 'error'
}], ['No groups (onboarding)', {
  lobbyState: 'no-groups'
}], ['First launch — profile setup', {
  hasProfile: false,
  modal: 'profile'
}], ['Edit profile modal', {
  modal: 'profile'
}], ['Sidebar — new group form', {
  sideForm: 'create'
}], ['Sidebar — join group form', {
  sideForm: 'join'
}]]], ['Live app · Group', [['Group view', {
  route: {
    view: 'group',
    id: 'sensorica'
  }
}], ['Create NDO modal', {
  route: {
    view: 'group',
    id: 'sensorica'
  },
  modal: 'createNdo'
}], ['Group profile (first visit)', {
  route: {
    view: 'group',
    id: 'sensorica'
  },
  modal: 'groupProfile'
}], ['Unmounted: soft links / work log', {
  route: {
    view: 'stubs'
  }
}]]], ['Live app · NDO', [['Active NDO (seeded tabs)', {
  route: {
    view: 'ndo',
    hash: nh(0)
  }
}], ['Hibernating NDO', {
  route: {
    view: 'ndo',
    hash: nh(4)
  }
}], ['Deprecated NDO', {
  route: {
    view: 'ndo',
    hash: nh(5)
  }
}], ['Ideation NDO (Layer 1 blocked)', {
  route: {
    view: 'ndo',
    hash: nh(6)
  }
}], ['Loading skeleton', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  loadState: 'loading'
}], ['Load error banner', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  loadState: 'error'
}], ['Advance lifecycle modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'transition'
}], ['Fork modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'fork'
}], ['Associate modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'associate'
}], ['Create specification modal', {
  route: {
    view: 'ndo',
    hash: nh(1)
  },
  modal: 'spec'
}], ['Spec modal — blocked stage', {
  route: {
    view: 'ndo',
    hash: nh(6)
  },
  modal: 'spec'
}], ['Rule editor modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'rule'
}], ['Propose commitment modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'commitment'
}], ['Log economic event modal', {
  route: {
    view: 'ndo',
    hash: nh(0)
  },
  modal: 'event'
}], ['/ndo/new placeholder', {
  route: {
    view: 'new'
  }
}]]], ['Live app · Connection', [['Connecting', {
  conn: 'connecting'
}], ['Connection failed', {
  conn: 'error'
}], ['Not connected', {
  conn: 'off'
}]]], ['DS prototypes (not in live app)', [['Group view (prototype)', {
  route: {
    view: 'group-proto'
  }
}], ['Create NDO (full page)', {
  route: {
    view: 'create',
    group: 'sensorica'
  }
}], ['Agent profile', {
  route: {
    view: 'agent'
  }
}], ['NDO Layer 1 specification', {
  route: {
    view: 'layer1'
  }
}]]]];
function Navigator({
  st,
  set
}) {
  const [open, setOpen] = React.useState(false);
  const key = JSON.stringify;
  const isCur = p => {
    const n = {
      ...KIT_DEFAULT,
      ...p
    };
    return key(n.route) === key(st.route) && n.modal === st.modal && n.lobbyState === st.lobbyState && n.loadState === st.loadState && n.conn === st.conn && n.hasProfile === st.hasProfile && n.sideForm === st.sideForm;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 16,
      bottom: 16,
      zIndex: 100,
      fontFamily: 'var(--ndo-font-sans)'
    }
  }, open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      width: 280,
      maxHeight: '70vh',
      overflowY: 'auto',
      background: rgb('gray-900'),
      color: '#fff',
      borderRadius: 8,
      padding: 12,
      boxShadow: 'var(--ndo-shadow-lg)'
    }
  }, KIT_SCREENS.map(([sec, items]) => /*#__PURE__*/React.createElement("div", {
    key: sec,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: rgb('gray-400'),
      margin: '0 0 4px'
    }
  }, sec), items.map(([label, patch]) => {
    const cur = isCur(patch);
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: label,
      onClick: () => set({
        ...KIT_DEFAULT,
        ...patch
      }),
      hover: cur ? null : {
        background: rgb('gray-800')
      },
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'left',
        border: 0,
        borderRadius: 4,
        padding: '4px 8px',
        fontSize: 13,
        fontFamily: 'inherit',
        cursor: 'pointer',
        background: cur ? rgb('blue-600') : 'transparent',
        color: '#fff'
      }
    }, label);
  })))), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setOpen(!open),
    hover: {
      background: rgb('gray-800')
    },
    style: {
      display: 'block',
      marginLeft: 'auto',
      border: 0,
      borderRadius: 999,
      background: rgb('gray-900'),
      color: '#fff',
      padding: '8px 14px',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      boxShadow: 'var(--ndo-shadow-md)'
    }
  }, open ? 'Close screens' : 'Screens ▾'));
}
Object.assign(window, {
  Navigator,
  KIT_DEFAULT,
  KIT_SCREENS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Navigator.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NdoCreate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const REGIME_HINTS = {
  Nondominium: 'Uncapturable by design — no agent or group can assert ownership or enclose this resource. Governance rules are cryptographically embedded.',
  Commons: 'Non-rivalrous shared resource governed by licensing and attribution. Can theoretically be enclosed through governance capture.',
  Collective: 'Cooperative ownership where decisions are made collectively. Members share both governance rights and benefit streams.',
  Pool: 'Pool of shareable physical resources requiring custody transfers, scheduling, and maintenance governance.',
  CommonPool: 'Rivalrous consumable resource governed by quota and depletion rules. Community-managed replenishment cycles.',
  Private: 'Full rights bundle with individual or organisational ownership. Fully alienable.'
};
const NATURE_HINTS = {
  Physical: 'Material object — tools, equipment, spaces, consumable stocks. Requires custody chain management.',
  Digital: 'Software, data, design files, documents. Non-rivalrous: can be copied at zero marginal cost.',
  Service: 'Ongoing capability provided by agents. Defined by process commitments and performance metrics.',
  Hybrid: 'Digital twin of a physical resource — a design file linked to a specific manufactured instance.',
  Information: 'Data, research outputs, sensor streams. Non-rivalrous and typically governed under attribution or commons regimes.'
};
const CHIPS = [['Nondominium', 'blue-700'], ['Commons', 'cyan-700'], ['Collective', 'violet-700'], ['Pool', 'teal-700'], ['CommonPool', 'rose-700'], ['Private', 'gray-500']];
function Field({
  label,
  req,
  opt,
  children
}) {
  return /*#__PURE__*/React.createElement("fieldset", {
    style: {
      margin: '0 0 20px',
      border: 0,
      padding: 0,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-700'),
      marginBottom: 6
    }
  }, label, req && /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('red-700'),
      marginLeft: 2
    }
  }, "*"), opt && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 400,
      color: rgb('gray-500'),
      marginLeft: 4
    }
  }, "(optional)")), children);
}
function Control({
  as = 'input',
  ...p
}) {
  const [f, setF] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({}, p, {
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      padding: '8px 12px',
      border: `1px solid ${f ? rgb('blue-600') : rgb('gray-300')}`,
      borderRadius: 6,
      fontFamily: 'var(--ndo-font-sans)',
      fontSize: 14,
      color: rgb('gray-900'),
      background: '#fff',
      outline: 'none',
      boxShadow: f ? 'var(--ndo-focus-ring)' : 'none',
      transition: 'border-color 150ms, box-shadow 150ms',
      resize: as === 'textarea' ? 'vertical' : undefined
    }
  }));
}
const hint = {
  marginTop: 6,
  fontSize: 12,
  color: rgb('gray-500'),
  lineHeight: 1.5
};
const hr = /*#__PURE__*/React.createElement("hr", {
  style: {
    border: 0,
    borderTop: `1px solid ${rgb('gray-100')}`,
    margin: '20px 0'
  }
});
function NdoCreate({
  group,
  go
}) {
  const g = GROUPS.find(x => x.id === group) || GROUPS[0];
  const [name, setName] = React.useState('');
  const [regime, setRegime] = React.useState('');
  const [nature, setNature] = React.useState('');
  const [stage, setStage] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [done, setDone] = React.useState(false);
  const dupe = name.trim() && NDOS.some(n => n.name.toLowerCase() === name.trim().toLowerCase());
  const back = /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'group',
        id: g.id
      });
    },
    style: {
      color: rgb('gray-500')
    }
  }, "\u2190 ", g.name);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '42rem',
      margin: '0 auto',
      padding: '32px 24px'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-500'),
      marginBottom: 24
    }
  }, back, /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", null, "New NDO")), !done ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${rgb('gray-200')}`,
      borderRadius: 12,
      boxShadow: 'var(--ndo-shadow-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 4px'
    }
  }, "New NDO"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-500'),
      margin: 0
    }
  }, "Creating in group: ", /*#__PURE__*/React.createElement("strong", null, g.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name",
    req: true
  }, /*#__PURE__*/React.createElement(Control, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g., Community Solar Array",
    autoComplete: "off"
  }), dupe && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 12,
      color: rgb('amber-700'),
      background: rgb('amber-50'),
      border: `1px solid ${rgb('amber-100')}`,
      borderRadius: 4,
      padding: '6px 10px'
    }
  }, "\u26A0 An NDO named \"", /*#__PURE__*/React.createElement("strong", null, name), "\" already exists in this group. You can continue, but consider a more specific name.")), hr, /*#__PURE__*/React.createElement(Field, {
    label: "Property Regime"
  }, /*#__PURE__*/React.createElement(Control, {
    as: "select",
    value: regime,
    onChange: e => setRegime(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a regime\u2026"), CHIPS.map(([v]) => /*#__PURE__*/React.createElement("option", {
    key: v
  }, v))), regime && /*#__PURE__*/React.createElement("div", {
    style: {
      ...hint,
      padding: '8px 12px',
      background: rgb('blue-50'),
      borderRadius: 4,
      color: rgb('blue-700')
    }
  }, REGIME_HINTS[regime]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8
    }
  }, CHIPS.map(([v, c]) => /*#__PURE__*/React.createElement(Hoverable, {
    key: v,
    title: REGIME_HINTS[v],
    onClick: () => setRegime(v),
    hover: {
      opacity: 0.7
    },
    style: {
      padding: '1.6px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      border: `1px dashed ${rgb(c)}`,
      color: rgb(c),
      background: 'transparent',
      cursor: 'pointer',
      transition: 'opacity 150ms'
    }
  }, v)))), /*#__PURE__*/React.createElement(Field, {
    label: "Resource Nature"
  }, /*#__PURE__*/React.createElement(Control, {
    as: "select",
    value: nature,
    onChange: e => setNature(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a nature\u2026"), Object.keys(NATURE_HINTS).map(v => /*#__PURE__*/React.createElement("option", {
    key: v
  }, v))), nature && /*#__PURE__*/React.createElement("div", {
    style: hint
  }, NATURE_HINTS[nature])), /*#__PURE__*/React.createElement(Field, {
    label: "Lifecycle Stage"
  }, /*#__PURE__*/React.createElement(Control, {
    as: "select",
    value: stage,
    onChange: e => setStage(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a stage\u2026"), /*#__PURE__*/React.createElement("option", null, "Ideation \u2014 concept declared, not yet specified"), /*#__PURE__*/React.createElement("option", null, "Specification \u2014 form defined, not yet built"), /*#__PURE__*/React.createElement("option", null, "Development \u2014 being built or prototyped"), /*#__PURE__*/React.createElement("option", null, "Stable \u2014 ready for distribution"), /*#__PURE__*/React.createElement("option", null, "Hibernating \u2014 temporarily inactive")), /*#__PURE__*/React.createElement("div", {
    style: hint
  }, "NDOs advance through: Ideation \u2192 Specification \u2192 Development \u2192 Prototype \u2192 Stable \u2192 Distributed \u2192 Active. ", /*#__PURE__*/React.createElement("em", null, "Deprecated"), " and ", /*#__PURE__*/React.createElement("em", null, "EndOfLife"), " are reached via lifecycle transitions after creation.")), hr, /*#__PURE__*/React.createElement(Field, {
    label: "Description",
    opt: true
  }, /*#__PURE__*/React.createElement(Control, {
    as: "textarea",
    rows: 4,
    maxLength: 500,
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: "Describe this NDO's purpose, governance intent, or usage context\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: 12,
      color: rgb('gray-400'),
      marginTop: 4
    }
  }, desc.length, " / 500"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      borderTop: `1px solid ${rgb('gray-100')}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost",
    onClick: () => go({
      view: 'group',
      id: g.id
    })
  }, "Cancel"), /*#__PURE__*/React.createElement(NDS.Button, {
    disabled: !name.trim(),
    onClick: () => setDone(true)
  }, "Create NDO"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${rgb('emerald-100')}`,
      borderRadius: 12,
      boxShadow: 'var(--ndo-shadow-md)',
      padding: 40,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: rgb('gray-900'),
      margin: '0 0 8px'
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: rgb('gray-600'),
      margin: '0 0 20px'
    }
  }, "NDO created and anchored on the DHT. Its action hash is your stable identity anchor."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: '8px 16px',
      background: rgb('gray-50'),
      border: `1px solid ${rgb('gray-200')}`,
      borderRadius: 6,
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-700'),
      marginBottom: 24
    }
  }, "uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJ\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.Button, {
    variant: "ghost",
    onClick: () => go({
      view: 'group',
      id: g.id
    })
  }, "\u2190 Back to ", g.name), /*#__PURE__*/React.createElement(NDS.Button, {
    onClick: () => go({
      view: 'ndo',
      hash: NDOS[0].hash
    })
  }, "View NDO \u2192"))));
}
Object.assign(window, {
  NdoCreate
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NdoCreate.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NdoLayer1.jsx
try { (() => {
// DS prototype: src/routes/ui-kit/ndo-layer1 — Layer 1 surface the live app doesn't have yet.
function NdoLayer1() {
  const rules = [{
    badge: 'rule-access-requirement',
    label: 'AccessRequirement',
    by: 'AccountableAgent',
    fields: [['required_role', 'AccountableAgent'], ['min_reputation', 'none']],
    ok: true
  }, {
    badge: 'rule-usage-limit',
    label: 'UsageLimit',
    by: 'AccountableAgent',
    fields: [['max_hours_per_week', '40'], ['applies_to', 'all custodians']],
    ok: true,
    reason: 'A rivalrous resource is exactly where a usage limit earns its coordination cost.'
  }, {
    badge: 'rule-maintenance-schedule',
    label: 'MaintenanceSchedule',
    by: 'Repair',
    fields: [['interval_days', '90'], ['required_role', 'Repair']],
    ok: true
  }, {
    badge: 'rule-transfer-condition',
    label: 'TransferCondition',
    by: 'PrimaryAccountableAgent',
    fields: [['permits', 'ownership_transfer'], ['to', 'any agent']],
    ok: false,
    reason: 'Hard constraint. Nondominium permits custody transfer and forbids alienation, so a rule asserting ownership transfer cannot attach to this classification. The integrity zome rejects it at create time, not at use time.'
  }];
  const inst = [['Panel bank A', '4 kWp', 'opstate-in-use', 'InUse'], ['Panel bank B', '4 kWp', 'opstate-available', 'Available'], ['Inverter (spare)', '1', 'opstate-in-maintenance', 'InMaintenance'], ['Panel bank C', '2 kWp', 'opstate-pending-validation', 'PendingValidation']];
  const mono = {
    fontFamily: 'var(--ndo-font-mono)',
    fontSize: 12
  };
  const note = {
    fontSize: 14,
    lineHeight: 1.55,
    color: rgb('gray-600'),
    margin: '0 0 16px'
  };
  const h2 = {
    fontSize: 18,
    margin: '0 0 6px',
    color: rgb('gray-900')
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '52rem',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: rgb('gray-500')
    }
  }, "Layer 1 \u2014 Specified"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      margin: '4px 0 12px',
      color: rgb('gray-900')
    }
  }, "Solar Array \u2014 Bay 2 Specification"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "regime-nondominium",
    label: "Nondominium"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "nature-physical",
    label: "Physical"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "rivalry-rivalrous",
    label: "Rivalrous"
  }), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: "scope-network",
    label: "Scope: Network"
  })), /*#__PURE__*/React.createElement("p", {
    style: note
  }, "Rivalry is default from ResourceNature::Physical, not overridden. It is orthogonal to the property regime: the regime says who may hold rights, rivalry says whether holding excludes anyone else."), /*#__PURE__*/React.createElement("code", {
    style: {
      ...mono,
      color: rgb('gray-400')
    }
  }, "uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Typed governance rules"), /*#__PURE__*/React.createElement("p", {
    style: note
  }, "Four discriminants, rendered by type rather than as a payload dump. Each rule carries the Layer 0 classification with it, which is what lets the integrity zome decide the verdict below without reading the DHT."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, rules.map(r => /*#__PURE__*/React.createElement("li", {
    key: r.label,
    style: {
      border: `1px solid ${rgb(r.ok ? 'gray-200' : 'red-200')}`,
      borderRadius: 8,
      padding: '14px 16px',
      marginBottom: 12,
      background: r.ok ? '#fff' : rgb('red-50')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: r.badge,
    label: r.label
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      color: rgb('gray-500')
    }
  }, "enforced_by: ", r.by), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(NDS.StatusDot, {
    status: r.ok ? 'active' : 'inactive',
    label: r.ok ? 'allowed' : 'rejected'
  })), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px 24px',
      margin: '12px 0 0'
    }
  }, r.fields.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      ...mono,
      color: rgb('gray-500')
    }
  }, k), /*#__PURE__*/React.createElement("dd", {
    style: {
      ...mono,
      margin: 0,
      color: rgb('gray-800')
    }
  }, v)))), r.reason && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 13,
      lineHeight: 1.55,
      color: rgb('gray-700')
    }
  }, r.reason))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Instances and operational state"), /*#__PURE__*/React.createElement("p", {
    style: note
  }, "OperationalState is not a lifecycle stage. The NDO stays Active while individual instances cycle through use, maintenance and availability underneath it. Two axes, two visual languages: a lifecycle badge is flat, an operational state carries a dot."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, inst.map(([n, q, s, l]) => /*#__PURE__*/React.createElement("li", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: `1px solid ${rgb('gray-100')}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 13,
      color: rgb('gray-500'),
      flex: 1
    }
  }, q), /*#__PURE__*/React.createElement(NDS.Badge, {
    variant: s,
    label: l
  }))))));
}
Object.assign(window, {
  NdoLayer1
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NdoLayer1.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NdoModals.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Live-app NDO modals: LifecycleTransitionModal, TransitionHistoryPanel, ForkNdoModal, AssociateNdoModal, NdoCreateModal
const TRANSITIONS = {
  Ideation: ['Specification', 'Deprecated', 'EndOfLife'],
  Specification: ['Development', 'Deprecated', 'EndOfLife'],
  Development: ['Prototype', 'Deprecated', 'EndOfLife'],
  Prototype: ['Stable', 'Deprecated', 'EndOfLife'],
  Stable: ['Distributed', 'Deprecated', 'EndOfLife'],
  Distributed: ['Active', 'Deprecated', 'EndOfLife'],
  Active: ['Hibernating', 'Deprecated', 'EndOfLife'],
  Hibernating: ['Deprecated', 'EndOfLife'],
  Deprecated: ['EndOfLife']
};
function LifecycleTransitionModal({
  ndo,
  onClose,
  onAdvance
}) {
  const cur = ndo.lifecycle_stage;
  const opts = cur === 'Hibernating' && ndo.hibernation_origin ? [ndo.hibernation_origin, ...(TRANSITIONS[cur] || [])] : TRANSITIONS[cur] || [];
  const [sel, setSel] = React.useState('');
  const [q, setQ] = React.useState('');
  const [succ, setSucc] = React.useState(null);
  const [err, setErr] = React.useState('');
  const matches = q.trim().length >= 2 ? NDOS.filter(n => n.name.toLowerCase().includes(q.toLowerCase()) && n.hash !== ndo.hash) : [];
  const confirm = () => {
    if (!sel) return setErr('Please select a target stage.');
    if (sel === 'Deprecated' && !succ) return setErr('Please select a successor NDO for deprecation.');
    onAdvance(sel, succ);
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "sm",
    title: "Advance lifecycle stage",
    subtitle: /*#__PURE__*/React.createElement(React.Fragment, null, "Current stage: ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500,
        color: rgb('gray-800')
      }
    }, cur)),
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), opts.length > 0 && /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: !sel,
      onClick: confirm
    }, "Confirm"))
  }, opts.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No further transitions available from ", /*#__PURE__*/React.createElement("strong", null, cur), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: 0,
      margin: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-700'),
      padding: 0
    }
  }, "Target stage:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, opts.map(s => /*#__PURE__*/React.createElement("label", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "ts",
    checked: sel === s,
    onChange: () => setSel(s),
    style: {
      width: 16,
      height: 16,
      margin: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, s))))), sel === 'Deprecated' && /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 4,
      border: '1px solid rgb(254 215 170)',
      background: rgb('orange-50'),
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('orange-700')
    }
  }, "Select successor NDO:"), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setSucc(null);
    },
    placeholder: "Search by name\u2026",
    style: {
      width: '100%',
      borderRadius: 4,
      border: '1px solid rgb(254 215 170)',
      padding: '4px 8px',
      fontSize: 14,
      fontFamily: 'inherit',
      outline: 'none'
    }
  }), matches.length > 0 && !succ && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '4px 0 0',
      padding: 0,
      maxHeight: 128,
      overflowY: 'auto',
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff'
    }
  }, matches.map(n => /*#__PURE__*/React.createElement("li", {
    key: n.hash
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => {
      setSucc(n);
      setQ(n.name);
    },
    hover: {
      background: rgb('gray-50')
    },
    style: {
      width: '100%',
      padding: '6px 12px',
      textAlign: 'left',
      fontSize: 14,
      color: rgb('gray-700'),
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, n.name)))), succ && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: 'rgb(22 163 74)'
    }
  }, "Selected: ", succ.name)), sel === 'Hibernating' && /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 4,
      border: '1px solid rgb(254 240 138)',
      background: rgb('yellow-50'),
      padding: 12,
      fontSize: 12,
      color: rgb('yellow-700')
    }
  }, "Hibernating preserves the current stage as origin. The NDO can resume from ", /*#__PURE__*/React.createElement("strong", null, cur), " later.")), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
function TransitionHistoryPanel({
  history
}) {
  return /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 12,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50')
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      userSelect: 'none',
      padding: '8px 12px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('gray-600')
    }
  }, "Lifecycle history \xB7 ", history.length, " transition", history.length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${rgb('gray-200')}`,
      padding: '8px 12px'
    }
  }, history.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "No transitions recorded yet. This NDO is still at the stage it was created in.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, history.map((h, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-100')}`,
      background: '#fff',
      padding: '8px 12px',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, h.from), /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "\u2192"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, h.to)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: rgb('gray-500')
    }
  }, "By ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ndo-font-mono)'
    }
  }, h.agent.slice(0, 10), "\u2026"), " \xB7 ", h.time), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      color: rgb('gray-400')
    }
  }, h.event.slice(0, 12), "\u2026"), /*#__PURE__*/React.createElement("button", {
    title: "Copy event hash",
    style: {
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      color: rgb('gray-400')
    }
  }, "\u29C9")))))));
}
function ForkNdoModal({
  ndo,
  onClose
}) {
  const [copied, setCopied] = React.useState(false);
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Fork this NDO",
    subtitle: ndo.name,
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Close")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      border: '1px solid rgb(253 230 138)',
      background: rgb('amber-50'),
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontSize: 14,
      fontWeight: 600,
      color: rgb('amber-800')
    }
  }, "Fork friction \u2014 by design"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('amber-700')
    }
  }, "Forking is intentionally non-trivial in Nondominium. The NDO model discourages gratuitous forks that fragment shared resource pools.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Step 1 \u2014 Negotiate:"), " Contact the NDO initiator and present your case for a fork. Consensus with existing participants is expected."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Step 2 \u2014 Consensus:"), " A fork requires agreement from active participants, not just the initiator. Minority disagreement must be addressed."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-400')
    }
  }, "Step 3 \u2014 Unyt payment (future):"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "Post-MVP, forking will require a Unyt-denominated stake as friction to prevent extractive forks. This feature is not yet available."))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50'),
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, "Contact the NDO initiator to begin negotiation:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      borderRadius: 4,
      background: '#fff',
      padding: '4px 8px',
      fontSize: 12,
      color: rgb('gray-600'),
      border: `1px solid ${rgb('gray-200')}`,
      fontFamily: 'var(--ndo-font-mono)'
    }
  }, ME_B64), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    hover: {
      background: rgb('gray-100')
    },
    style: {
      flexShrink: 0,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-300')}`,
      background: 'transparent',
      padding: '4px 10px',
      fontSize: 12,
      color: rgb('gray-600'),
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, copied ? '✓ Copied' : 'Copy')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: rgb('gray-400')
    }
  }, "Agent public key (Holochain)")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-400'),
      fontStyle: 'italic',
      textAlign: 'center'
    }
  }, "Full fork functionality (claim submission, vote, Unyt stake) is coming in a future release."));
}
function AssociateNdoModal({
  ndo,
  onClose
}) {
  const [sel, setSel] = React.useState([]);
  const [saved, setSaved] = React.useState(false);
  const avail = GROUPS.filter(g => g.id !== ndo.group);
  const tog = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgb(0 0 0 / 0.4)',
      backdropFilter: 'blur(4px)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    style: {
      width: '100%',
      maxWidth: '24rem',
      borderRadius: 12,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      padding: '16px 20px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, "Associate with a group"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "Add ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, "\"", ndo.name, "\""), " to one of your groups so group members can find and join it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: '18rem',
      overflowY: 'auto',
      padding: '12px 20px'
    }
  }, avail.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "This NDO is already associated with all your groups.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, avail.map(g => /*#__PURE__*/React.createElement("li", {
    key: g.id
  }, /*#__PURE__*/React.createElement(Hoverable, {
    as: "label",
    hover: {
      background: rgb('gray-50')
    },
    style: {
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      gap: 10,
      borderRadius: 4,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: sel.includes(g.id),
    onChange: () => tog(g.id),
    style: {
      width: 16,
      height: 16,
      margin: 0,
      accentColor: rgb('blue-600')
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-800')
    }
  }, g.name)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      borderTop: `1px solid ${rgb('gray-100')}`,
      padding: '12px 20px'
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onClose,
    hover: {
      background: rgb('gray-100')
    },
    style: {
      borderRadius: 4,
      padding: '6px 12px',
      fontSize: 14,
      color: rgb('gray-500'),
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement(Hoverable, {
    disabled: !sel.length || saved,
    onClick: () => {
      setSaved(true);
      setTimeout(onClose, 600);
    },
    hover: sel.length ? {
      background: rgb('blue-700')
    } : null,
    style: {
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '6px 12px',
      fontSize: 14,
      fontWeight: 500,
      color: '#fff',
      border: 0,
      cursor: sel.length ? 'pointer' : 'not-allowed',
      opacity: !sel.length || saved ? 0.5 : 1,
      fontFamily: 'inherit'
    }
  }, saved ? 'Saved!' : `Add to ${sel.length || ''} group${sel.length !== 1 ? 's' : ''}`))));
}
const REGIME_TIPS = {
  Private: 'Owned and controlled by a single agent.',
  Commons: 'Shared, self-governed resource open to a defined community.',
  Collective: 'Cooperatively owned by a defined group of agents.',
  Pool: 'Rivalrous shareable; scheduling, custody, and maintenance apply.',
  CommonPool: 'A commons with a defined boundary and subtractable access.',
  Public: 'Under public/governmental stewardship; open-access; non-alienable by the public body.',
  Nondominium: 'Cannot be captured or exclusively owned; maximally open.'
};
const NATURE_TIPS = {
  Physical: 'A tangible, material resource.',
  Digital: 'An intangible, bit-based resource (software, data, etc.).',
  Service: 'A time-based provision of capability or skill.',
  Hybrid: 'A resource with both physical and digital dimensions.',
  Information: 'Knowledge, documentation, or structured data.'
};
const DEFAULT_RIVALRY = {
  Physical: 'Rivalrous',
  Digital: 'NonRivalrous',
  Information: 'NonRivalrous',
  Hybrid: 'Rivalrous',
  Service: null
};
function NdoCreateModal({
  group,
  onClose,
  onCreate
}) {
  const [v, setV] = React.useState({
    name: '',
    property_regime: 'Commons',
    resource_nature: 'Physical',
    rivalry_override: '',
    lifecycle_stage: 'Ideation',
    description: ''
  });
  const [err, setErr] = React.useState('');
  const b = k => ({
    value: v[k],
    onChange: e => setV({
      ...v,
      [k]: e.target.value
    })
  });
  const warn = v.name.trim() && NDOS.some(d => d.name.toLowerCase() === v.name.trim().toLowerCase());
  const riv = DEFAULT_RIVALRY[v.resource_nature];
  const submit = () => {
    if (!v.name.trim()) return setErr('Name is required.');
    onCreate({
      ...v,
      name: v.name.trim(),
      hash: 'uhC0kNew' + Math.random().toString(36).slice(2, 26),
      group: group.id,
      description: v.description || ''
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Create NDO",
    subtitle: "Register a new NondominiumIdentity Layer 0 within this group.",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: submit
    }, "Create NDO"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    req: true
  }, "Name"), /*#__PURE__*/React.createElement(Input, _extends({
    autoFocus: true,
    placeholder: "Unique identifier for this NDO"
  }, b('name'))), warn && /*#__PURE__*/React.createElement(Hint, {
    tone: "amber"
  }, "An NDO with this name already exists in the Lobby.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Property Regime"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('property_regime')), Object.keys(REGIME_TIPS).map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r))), /*#__PURE__*/React.createElement(Hint, null, REGIME_TIPS[v.property_regime])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Resource Nature"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('resource_nature')), Object.keys(NATURE_TIPS).map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r))), /*#__PURE__*/React.createElement(Hint, null, NATURE_TIPS[v.resource_nature]), riv ? /*#__PURE__*/React.createElement(Hint, null, "Default rivalry for this nature: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, riv)) : /*#__PURE__*/React.createElement(Hint, {
    tone: "amber"
  }, "Service nature has no confident rivalry default \u2014 set an override if this is a rivalrous slot (e.g. booking time).")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Rivalry override ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400'),
      fontWeight: 400
    }
  }, "(optional)")), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('rivalry_override')), /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 use nature default \u2014"), /*#__PURE__*/React.createElement("option", null, "Rivalrous"), /*#__PURE__*/React.createElement("option", null, "NonRivalrous")), /*#__PURE__*/React.createElement(Hint, null, "Override only when the nature default is wrong for this resource.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Initial Lifecycle Stage"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "select"
  }, b('lifecycle_stage')), ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active'].map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))), /*#__PURE__*/React.createElement(Hint, null, "Choose emergence (Ideation\u2013Prototype) for something still forming, or ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Stable"), " / ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Distributed"), " / ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Active"), " for an already mature or in-use resource (e.g. a stable shared tool). ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Hibernating"), ", terminal stages, and deprecation are set only after creation via lifecycle transitions.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Description ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "(optional)")), /*#__PURE__*/React.createElement(Input, _extends({
    as: "textarea",
    rows: 3,
    light: true,
    placeholder: "What is this NDO about?"
  }, b('description')))), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
Object.assign(window, {
  LifecycleTransitionModal,
  TransitionHistoryPanel,
  ForkNdoModal,
  AssociateNdoModal,
  NdoCreateModal,
  DEFAULT_RIVALRY
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NdoModals.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NdoTabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Live-app tab bodies: ndo/ResourcesTab, GovernanceTab, CompositionTab, ActivityTab
const OPSTATE_LABEL = {
  Available: 'Available',
  Reserved: 'Reserved',
  InTransit: 'In transit',
  InStorage: 'In storage',
  InMaintenance: 'In maintenance',
  InUse: 'In use',
  PendingValidation: 'Pending validation'
};
const liveLi = {
  borderRadius: 4,
  border: `1px solid ${rgb('gray-200')}`,
  background: '#fff',
  padding: 12,
  fontSize: 14
};
const H3L = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("h3", {
  style: {
    margin: 0,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 600,
    color: rgb('gray-900'),
    ...style
  }
}, children);
const H4L = ({
  children
}) => /*#__PURE__*/React.createElement("h4", {
  style: {
    margin: '0 0 8px',
    fontSize: 14,
    fontWeight: 600,
    color: rgb('gray-800')
  }
}, children);
const Muted = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 14,
    color: rgb('gray-500')
  }
}, children);
const stack = g => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: g
});
const INELIGIBLE = new Set(['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife']);
function ResourcesTab({
  ndo,
  specs,
  onNewSpec
}) {
  const can = !INELIGIBLE.has(ndo.lifecycle_stage);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(H3L, null, "Layer 1 specifications"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Resource specifications linked to this NDO.")), /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    disabled: !can,
    onClick: onNewSpec
  }, "+ New specification")), !can && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: `1px solid ${rgb('amber-100')}`,
      background: rgb('amber-50'),
      padding: '8px 12px',
      fontSize: 12,
      color: rgb('amber-800')
    }
  }, "Layer 1 activation is blocked while the NDO is ", /*#__PURE__*/React.createElement("strong", null, ndo.lifecycle_stage), ". Advance the lifecycle first."), specs.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No resource specifications for this NDO yet.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, specs.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-900')
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, s.category, " \xB7 scope ", s.scope, " \xB7 active"), s.description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, s.description), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '12px 0 0',
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      color: rgb('gray-500')
    }
  }, "Economic resources"), s.resources.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No inventoried resources for this specification.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      ...stack(8),
      marginTop: 4
    }
  }, s.resources.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      borderRadius: 4,
      border: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      padding: '8px 12px',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Qty"), " ", r.quantity, " ", r.unit, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Operational state"), " ", OPSTATE_LABEL[r.state])))))));
}
function GovernanceTab({
  specs,
  rules,
  onNewRule
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(H3L, null, "Governance rules"), /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    onClick: onNewRule
  }, "+ New rule")), specs.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No Layer 1 specifications yet \u2014 create one on the Resources tab before adding rules.") : rules.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No governance rules linked to this NDO\u2019s specifications.") : /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, rules.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: liveLi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, r.kind), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "spec: ", r.spec)), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: '8px 0 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: 4,
      fontSize: 12,
      color: rgb('gray-600')
    }
  }, Object.entries(r.payload).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, k, ":"), " ", v === '' || v == null ? '—' : String(v)))), r.enforced_by && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Enforced by: ", r.enforced_by))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(H3L, {
    style: {
      marginBottom: 8
    }
  }, "My roles (person zome)"), /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, ['SimpleAgent', 'AccountableAgent'].map(r => /*#__PURE__*/React.createElement("li", {
    key: r,
    style: {
      ...liveLi,
      padding: '8px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, r)))), /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      marginTop: 12,
      border: 0,
      borderRadius: 4,
      background: rgb('amber-100'),
      padding: '6px 12px',
      fontSize: 12,
      color: rgb('amber-800'),
      fontFamily: 'inherit'
    }
  }, "AccountableAgent (governance-gated)")));
}
function CompositionTab() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      border: `1px dashed ${rgb('gray-400')}`,
      background: '#fff',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginBottom: 12,
      display: 'inline-block',
      borderRadius: 4,
      background: rgb('amber-50'),
      padding: '2px 8px',
      fontSize: 12,
      color: rgb('amber-600')
    }
  }, "Coming soon"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, "Composition view (NdoHardLink graph and D3) is not wired yet. This placeholder avoids pulling D3 or WASM types that are still in flight."));
}
function ActivityTab({
  commitments,
  events,
  onNewCommitment,
  onNewEvent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(H3L, null, "Activity"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Commitments and events for this NDO (client-filtered by ", /*#__PURE__*/React.createElement("code", null, "ndo_identity_hash"), ").")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    onClick: onNewCommitment
  }, "+ New commitment"), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onNewEvent,
    hover: {
      background: rgb('blue-100')
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb('blue-300')}`,
      background: rgb('blue-50'),
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: rgb('blue-700')
    }
  }, "+ New event"))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(H4L, null, "Commitments"), commitments.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No commitments for this NDO yet.") : /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, commitments.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: liveLi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-900')
    }
  }, c.action), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: rgb('gray-600')
    }
  }, "Due ", c.due), c.note && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, c.note))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(H4L, null, "Economic events"), events.length === 0 ? /*#__PURE__*/React.createElement(Muted, null, "No events recorded for this NDO yet.") : /*#__PURE__*/React.createElement("ul", {
    style: stack(8)
  }, events.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: liveLi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: rgb('gray-900')
    }
  }, e.action), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: rgb('gray-600')
    }
  }, "Qty ", e.qty, " \xB7 ", e.time), e.note && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, e.note))))));
}
function SpecificationCreateModal({
  ndo,
  onClose,
  onCreate
}) {
  const can = !INELIGIBLE.has(ndo.lifecycle_stage);
  const locked = ['Nondominium', 'Public'].includes(ndo.property_regime);
  const [v, setV] = React.useState({
    name: '',
    description: '',
    category: 'general',
    scope: 'Project',
    tags: '',
    image: ''
  });
  const [err, setErr] = React.useState('');
  const f = k => ({
    value: v[k],
    onChange: e => setV({
      ...v,
      [k]: e.target.value
    })
  });
  const submit = () => {
    if (!v.name.trim() || !v.description.trim()) return setErr('Name and description are required.');
    onCreate({
      name: v.name,
      description: v.description,
      category: v.category || 'general',
      scope: locked ? 'Public' : v.scope,
      resources: []
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    width: "lg",
    bodyScroll: true,
    title: "Create resource specification",
    subtitle: "Activate Layer 1 for this NDO. Governance rules can be added afterward.",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      disabled: !can,
      onClick: submit
    }, "Create specification"))
  }, !can ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 4,
      border: '1px solid rgb(253 230 138)',
      background: rgb('amber-50'),
      padding: 12,
      fontSize: 14,
      color: rgb('amber-800')
    }
  }, "Layer 1 cannot be activated while the NDO is in ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, ndo.lifecycle_stage), ". Advance the lifecycle stage first (Specification or later, excluding Hibernating / Deprecated / EndOfLife).") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Name *"), /*#__PURE__*/React.createElement(Input, f('name'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Description *"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "textarea",
    rows: 3
  }, f('description')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Category"), /*#__PURE__*/React.createElement(Input, f('category'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Scope"), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    disabled: locked,
    value: locked ? 'Public' : v.scope,
    onChange: e => setV({
      ...v,
      scope: e.target.value
    }),
    style: locked ? {
      background: rgb('gray-100'),
      color: rgb('gray-500'),
      cursor: 'not-allowed'
    } : null
  }, /*#__PURE__*/React.createElement("option", null, "Project"), /*#__PURE__*/React.createElement("option", null, "Network"), /*#__PURE__*/React.createElement("option", null, "Public")), /*#__PURE__*/React.createElement(Hint, null, locked ? `A ${ndo.property_regime} NDO is open access, so its specification is always Public. Narrowing the scope would hide it from the global discovery anchor (REQ-RES-03).` : 'Project-scoped specs are omitted from the global discovery anchor.')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Tags ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: rgb('gray-400')
    }
  }, "(comma-separated)")), /*#__PURE__*/React.createElement(Input, _extends({
    light: true
  }, f('tags')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true,
    opt: true
  }, "Image URL"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "url"
  }, f('image'))))), err && /*#__PURE__*/React.createElement(ErrorBox, null, err));
}
Object.assign(window, {
  ResourcesTab,
  GovernanceTab,
  CompositionTab,
  ActivityTab,
  SpecificationCreateModal,
  OPSTATE_LABEL,
  INELIGIBLE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NdoTabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NdoView.jsx
try { (() => {
// Live app: ndo/NdoView + NdoIdentityLayer (tabs in NdoTabs.jsx, modals in NdoModals.jsx / GovernanceModals.jsx)
const LIFE_MAP = {
  Ideation: ['gray-100', 'gray-600'],
  Specification: ['blue-50', 'blue-600'],
  Development: ['indigo-100', 'indigo-700'],
  Prototype: ['amber-100', 'amber-700'],
  Stable: ['green-100', 'green-700'],
  Distributed: ['teal-100', 'teal-700'],
  Active: ['emerald-100', 'emerald-700'],
  Hibernating: ['yellow-100', 'yellow-700'],
  Deprecated: ['orange-100', 'orange-700'],
  EndOfLife: ['red-100', 'red-700']
};
const REG_MAP = {
  Private: ['gray-100', 'gray-600'],
  Commons: ['cyan-100', 'cyan-700'],
  Collective: ['violet-100', 'violet-700'],
  Pool: ['amber-100', 'amber-700'],
  CommonPool: ['rose-100', 'rose-700'],
  Public: ['sky-100', 'sky-700'],
  Nondominium: ['emerald-100', 'emerald-700']
};
const NAT_MAP = {
  Physical: ['blue-100', 'blue-700'],
  Digital: ['purple-100', 'purple-700'],
  Service: ['orange-100', 'orange-700'],
  Hybrid: ['teal-100', 'teal-700'],
  Information: ['indigo-100', 'indigo-700']
};
const pill = ([bg, fg], extra) => ({
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 500,
  background: rgb(bg),
  color: rgb(fg),
  ...extra
});
const Caps = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    color: rgb('gray-400')
  }
}, children);
function NdoIdentityLayer({
  ndo,
  history,
  canTransition,
  onTransition,
  go
}) {
  const rival = ndo.rivalry_override || DEFAULT_RIVALRY[ndo.resource_nature];
  const succ = ndo.successor_ndo_hash;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: pill(LIFE_MAP[ndo.lifecycle_stage], {
      fontWeight: 600
    })
  }, ndo.lifecycle_stage), /*#__PURE__*/React.createElement("span", {
    style: pill(REG_MAP[ndo.property_regime], {
      border: '1px dashed currentColor'
    })
  }, ndo.property_regime), /*#__PURE__*/React.createElement("span", {
    style: pill(NAT_MAP[ndo.resource_nature])
  }, ndo.resource_nature), rival && /*#__PURE__*/React.createElement("span", {
    style: pill(['gray-50', 'gray-700'], {
      background: '#fff',
      border: `1px solid ${rgb('gray-200')}`
    })
  }, rival)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 16,
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, /*#__PURE__*/React.createElement("span", null, "By ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'agent'
      });
    },
    style: {
      fontWeight: 500,
      color: rgb('blue-600')
    }
  }, "Tiberius")), /*#__PURE__*/React.createElement("span", null, "3/9/2024, 4:00:00 PM"), canTransition && /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onTransition,
    hover: {
      background: rgb('blue-100')
    },
    style: {
      cursor: 'pointer',
      borderRadius: 4,
      border: `1px solid ${rgb('blue-300')}`,
      background: rgb('blue-50'),
      padding: '4px 10px',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      color: rgb('blue-700')
    }
  }, ndo.lifecycle_stage === 'Active' ? 'Suspend (Hibernate) →' : 'Advance stage →'))), ndo.description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, ndo.description), ndo.lifecycle_stage === 'Hibernating' && ndo.hibernation_origin && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 4,
      background: rgb('yellow-50'),
      padding: '6px 12px',
      fontSize: 12,
      color: rgb('yellow-700')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Hibernating"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgb(234 179 8)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Will resume from: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, ndo.hibernation_origin))), ndo.lifecycle_stage === 'Deprecated' && succ && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 4,
      background: rgb('orange-50'),
      padding: '6px 12px',
      fontSize: 12,
      color: rgb('orange-700')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "Deprecated"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgb(251 146 60)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Succeeded by: ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go({
        view: 'ndo',
        hash: succ
      });
    },
    style: {
      fontFamily: 'var(--ndo-font-mono)',
      textDecoration: 'underline',
      color: 'inherit'
    }
  }, succ.slice(0, 12), "\u2026"))), /*#__PURE__*/React.createElement(TransitionHistoryPanel, {
    history: history
  }));
}
function NdoView({
  ndo,
  data,
  setData,
  updateNdo,
  go,
  loadState = 'ok',
  modal,
  setModal
}) {
  const [tab, setTab] = React.useState('resources');
  const [join, setJoin] = React.useState(false);
  const [joined, setJoined] = React.useState(false);
  const tabs = [['resources', 'Resources'], ['governance', 'Governance'], ['composition', 'Composition'], ['activity', 'Activity']];
  const loading = loadState === 'loading',
    err = loadState === 'error';
  const add = (k, item) => {
    setData({
      ...data,
      [k]: [...data[k], item]
    });
    setModal(null);
  };
  return /*#__PURE__*/React.createElement("div", null, modal === 'fork' && /*#__PURE__*/React.createElement(ForkNdoModal, {
    ndo: ndo,
    onClose: () => setModal(null)
  }), modal === 'associate' && /*#__PURE__*/React.createElement(AssociateNdoModal, {
    ndo: ndo,
    onClose: () => setModal(null)
  }), modal === 'transition' && /*#__PURE__*/React.createElement(LifecycleTransitionModal, {
    ndo: ndo,
    onClose: () => setModal(null),
    onAdvance: (to, succ) => {
      updateNdo({
        lifecycle_stage: to,
        ...(to === 'Hibernating' ? {
          hibernation_origin: ndo.lifecycle_stage
        } : null),
        ...(succ ? {
          successor_ndo_hash: succ.hash
        } : null)
      });
      setData({
        ...data,
        history: [...data.history, {
          from: ndo.lifecycle_stage,
          to,
          agent: ME_B64,
          time: new Date().toLocaleString(),
          event: 'uhCkk' + Math.random().toString(36).slice(2, 18)
        }]
      });
      setModal(null);
    }
  }), modal === 'spec' && /*#__PURE__*/React.createElement(SpecificationCreateModal, {
    ndo: ndo,
    onClose: () => setModal(null),
    onCreate: s => add('specs', s)
  }), modal === 'rule' && /*#__PURE__*/React.createElement(RuleEditorModal, {
    ndo: ndo,
    specName: data.specs[0]?.name || '—',
    onClose: () => setModal(null),
    onCreate: r => add('rules', r)
  }), modal === 'commitment' && /*#__PURE__*/React.createElement(CommitmentCreateForm, {
    ndo: ndo,
    onClose: () => setModal(null),
    onCreate: c => add('commitments', c)
  }), modal === 'event' && /*#__PURE__*/React.createElement(EconomicEventCreateForm, {
    ndo: ndo,
    commitments: data.commitments,
    onClose: () => setModal(null),
    onCreate: e => add('events', e)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: '16px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      height: 24,
      width: 160,
      borderRadius: 4,
      background: rgb('gray-200'),
      animation: 'ndoPulse 2s cubic-bezier(0.4,0,0.6,1) infinite'
    }
  }) : err ? /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 700,
      color: rgb('red-600')
    }
  }, "Failed to load NDO") : /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 700,
      color: rgb('gray-900')
    }
  }, ndo.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--ndo-font-mono)',
      fontSize: 12,
      color: rgb('gray-400')
    }
  }, ndo.hash.slice(0, 20), "\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 16,
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(OutlineBtn, {
    onClick: () => setJoin(!join)
  }, "Join NDO"), /*#__PURE__*/React.createElement(OutlineBtn, {
    tone: "blue",
    onClick: () => setModal('associate')
  }, "Associate with a group"), /*#__PURE__*/React.createElement(OutlineBtn, {
    onClick: () => setModal('fork')
  }, "Fork this NDO"))), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "NDO sections",
    style: {
      marginTop: 16,
      display: 'flex',
      gap: 8
    }
  }, tabs.map(([id, l]) => {
    const a = tab === id;
    return /*#__PURE__*/React.createElement(Hoverable, {
      key: id,
      onClick: () => setTab(id),
      hover: a ? null : {
        color: rgb('gray-800')
      },
      style: {
        cursor: 'pointer',
        borderRadius: '4px 4px 0 0',
        border: `1px solid ${a ? rgb('gray-200') : 'transparent'}`,
        borderBottom: 0,
        padding: '8px 12px',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'color 150ms',
        background: a ? rgb('gray-50') : 'transparent',
        color: a ? rgb('gray-900') : rgb('gray-500')
      }
    }, l);
  }))), err && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 24px 0',
      borderRadius: 4,
      border: `1px solid ${rgb('red-200')}`,
      background: rgb('red-50'),
      padding: '12px 16px',
      fontSize: 14,
      color: rgb('red-700')
    }
  }, "Could not refresh NDO details from the chain. Data shown may be cached.", /*#__PURE__*/React.createElement("button", {
    style: {
      marginLeft: 12,
      textDecoration: 'underline',
      border: 0,
      background: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: 14,
      padding: 0
    }
  }, "Retry")), !loading && !err && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 24px 0',
      borderRadius: 8,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 20,
      boxShadow: 'var(--ndo-shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: 16
    }
  }, ndo.description && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement(Caps, null, "Description"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-800')
    }
  }, ndo.description)), [['Property regime', ndo.property_regime], ['Resource nature', ndo.resource_nature], ['Lifecycle stage', ndo.lifecycle_stage]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement(Caps, null, k), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      fontWeight: 500,
      color: rgb('gray-800')
    }
  }, v ?? '—'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Caps, null, "Created"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: rgb('gray-600')
    }
  }, "3/9/2024, 4:00:00 PM")))), join && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 24px 0',
      borderRadius: 8,
      border: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50'),
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 600,
      color: rgb('gray-800')
    }
  }, "NDO membership"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, "Joining an NDO records your participation on the DHT. This is distinct from associating the NDO with a group (a curated short list for group members)."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    small: true,
    onClick: () => setJoined(true)
  }, "Join this NDO")), joined && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 12,
      color: rgb('gray-600')
    }
  }, "You have joined this NDO."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: -16
    }
  }, /*#__PURE__*/React.createElement(MemberList, {
    members: joined ? [...MEMBERS, {
      id: 'me',
      name: 'Tiberius (you)',
      role: 'Member'
    }] : MEMBERS
  }))), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${rgb('gray-100')}`,
      background: rgb('gray-50'),
      padding: '16px 24px',
      marginTop: 16,
      fontSize: 14,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "Loading Layer 0 identity\u2026") : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(NdoIdentityLayer, {
    ndo: ndo,
    history: data.history,
    canTransition: ndo.lifecycle_stage !== 'EndOfLife',
    onTransition: () => setModal('transition'),
    go: go
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, tab === 'resources' && /*#__PURE__*/React.createElement(ResourcesTab, {
    ndo: ndo,
    specs: data.specs,
    onNewSpec: () => setModal('spec')
  }), tab === 'governance' && /*#__PURE__*/React.createElement(GovernanceTab, {
    specs: data.specs,
    rules: data.rules,
    onNewRule: () => setModal('rule')
  }), tab === 'composition' && /*#__PURE__*/React.createElement(CompositionTab, null), tab === 'activity' && /*#__PURE__*/React.createElement(ActivityTab, {
    commitments: data.commitments,
    events: data.events,
    onNewCommitment: () => setModal('commitment'),
    onNewEvent: () => setModal('event')
  })));
}
Object.assign(window, {
  NdoView,
  NdoIdentityLayer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NdoView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Profile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PROFILE = {
  nickname: 'Tiberius',
  realName: 'Tiberius Brastaviceanu',
  bio: 'Sensorica co-founder. Open hardware & OVN.',
  email: 'tiberius@sensorica.co',
  phone: '',
  address: 'Montréal, QC'
};
function ProfileFields({
  v,
  set,
  err
}) {
  const f = k => ({
    value: v[k],
    onChange: e => set({
      ...v,
      [k]: e.target.value
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "lup-nickname",
    req: true
  }, "Nickname"), /*#__PURE__*/React.createElement(Input, _extends({
    id: "lup-nickname",
    autoFocus: true,
    placeholder: "How you appear in the Lobby"
  }, f('nickname'))), err && /*#__PURE__*/React.createElement(Hint, {
    tone: "red"
  }, err)), /*#__PURE__*/React.createElement(CapsLabel, null, "Optional fields"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Real name"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    placeholder: "Your full name (optional)"
  }, f('realName')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Bio"), /*#__PURE__*/React.createElement(Input, _extends({
    as: "textarea",
    rows: 2,
    light: true,
    placeholder: "Short bio (optional)"
  }, f('bio')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Email"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "email",
    placeholder: "email@example.com (optional)"
  }, f('email')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Phone"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    type: "tel",
    placeholder: "+1 555 000 0000 (optional)"
  }, f('phone')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    muted: true
  }, "Address"), /*#__PURE__*/React.createElement(Input, _extends({
    light: true,
    placeholder: "Location (optional)"
  }, f('address')))));
}

// ProfileSetupModal (first launch: not dismissable until a nickname exists) + UserProfileForm mode="modal"
function ProfileModal({
  existing,
  onClose,
  onSave
}) {
  const [v, setV] = React.useState(existing || {
    nickname: '',
    realName: '',
    bio: '',
    email: '',
    phone: '',
    address: ''
  });
  const [err, setErr] = React.useState('');
  const save = () => {
    if (!v.nickname.trim()) return setErr('Nickname is required.');
    onSave(v);
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: existing ? 'Edit profile' : 'Set up your Lobby profile',
    subtitle: "Your Lobby profile is stored locally. Only your nickname is required.",
    onClose: existing ? onClose : undefined,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, existing && /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: save
    }, "Save"))
  }, /*#__PURE__*/React.createElement(ProfileFields, {
    v: v,
    set: setV,
    err: err
  }));
}
function GroupProfileModal({
  group,
  onClose
}) {
  const [anon, setAnon] = React.useState(false);
  const [shown, setShown] = React.useState([]);
  const labels = {
    realName: 'Real name',
    bio: 'Bio',
    email: 'Email',
    phone: 'Phone',
    address: 'Address'
  };
  const tog = k => setShown(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k]);
  return /*#__PURE__*/React.createElement(Modal, {
    width: "sm",
    title: "Group profile",
    subtitle: "Choose how you appear to other members in this group.",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextBtn, {
      onClick: onClose
    }, "Skip"), /*#__PURE__*/React.createElement(PrimaryBtn, {
      onClick: onClose
    }, "Save"))
  }, /*#__PURE__*/React.createElement(Check, {
    checked: anon,
    onChange: () => setAnon(!anon)
  }, "Appear anonymously (pseudonym only)"), !anon && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('gray-500'),
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    }
  }, "Also share from your Lobby profile:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, Object.keys(labels).filter(k => PROFILE[k]).map(k => /*#__PURE__*/React.createElement(Check, {
    key: k,
    checked: shown.includes(k),
    onChange: () => tog(k)
  }, labels[k], ": ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, PROFILE[k]))))));
}
Object.assign(window, {
  PROFILE,
  ProfileModal,
  GroupProfileModal,
  ProfileFields
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Profile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Shell.jsx
try { (() => {
function SideForm({
  title,
  placeholder,
  onSubmit,
  onCancel,
  busyLabel,
  label,
  validate
}) {
  const [v, setV] = React.useState('');
  const [err, setErr] = React.useState('');
  const go = () => {
    const e = validate(v);
    if (e) return setErr(e);
    onSubmit(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      borderRadius: 4,
      border: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 6px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, title), /*#__PURE__*/React.createElement(Input, {
    dense: true,
    autoFocus: true,
    value: v,
    onChange: e => setV(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') go();
    },
    placeholder: placeholder,
    style: {
      marginBottom: 6
    }
  }), err && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 12,
      color: rgb('red-600')
    }
  }, err), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: go,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '4px 8px',
      fontSize: 12,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'inherit'
    }
  }, label), /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onCancel,
    hover: {
      background: rgb('gray-100')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: 'transparent',
      padding: '4px 8px',
      fontSize: 12,
      color: rgb('gray-500'),
      fontFamily: 'inherit'
    }
  }, "Cancel")));
}
function Sidebar({
  route,
  go,
  groups,
  hasProfile = true,
  onOpenProfile,
  form,
  setForm,
  onCreateGroup,
  onJoinGroup
}) {
  const [copied, setCopied] = React.useState(null);
  const [hoverG, setHoverG] = React.useState(null);
  const navItem = active => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    border: 0,
    cursor: 'pointer',
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'background-color 150ms, color 150ms',
    background: active ? '#fff' : 'transparent',
    color: active ? rgb('gray-900') : rgb('gray-700'),
    boxShadow: active ? 'var(--ndo-shadow-sm)' : 'none'
  });
  const hov = {
    background: '#fff',
    color: rgb('gray-900')
  };
  const lobbyActive = route.view === 'lobby';
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Primary",
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '13rem',
      flexShrink: 0,
      borderRight: `1px solid ${rgb('gray-200')}`,
      background: rgb('gray-50'),
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => go({
      view: 'lobby'
    }),
    hover: lobbyActive ? null : hov,
    style: {
      ...navItem(lobbyActive),
      marginBottom: 12,
      padding: '6px 8px',
      fontWeight: 500,
      color: lobbyActive ? rgb('gray-900') : rgb('gray-600')
    }
  }, "Browse NDOs"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.025em',
      color: rgb('gray-400'),
      textTransform: 'uppercase'
    }
  }, "Groups"), groups.length > 0 ? /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '0 0 8px',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, groups.map(g => {
    const a = route.view === 'group' && route.id === g.id;
    return /*#__PURE__*/React.createElement("li", {
      key: g.id,
      onMouseEnter: () => setHoverG(g.id),
      onMouseLeave: () => setHoverG(null),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(Hoverable, {
      onClick: () => go({
        view: 'group',
        id: g.id
      }),
      hover: a ? null : hov,
      style: {
        ...navItem(a),
        flex: 1,
        minWidth: 0,
        padding: '4px 8px',
        fontWeight: a ? 500 : 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, g.name), /*#__PURE__*/React.createElement(Hoverable, {
      title: "Copy invite link",
      onClick: () => {
        setCopied(g.id);
        setTimeout(() => setCopied(null), 2000);
      },
      hover: {
        background: '#fff',
        color: rgb('blue-600')
      },
      style: {
        flexShrink: 0,
        border: 0,
        borderRadius: 4,
        background: 'transparent',
        padding: '2px 6px',
        fontSize: 12,
        color: rgb('gray-400'),
        cursor: 'pointer',
        opacity: hoverG === g.id || copied === g.id ? 1 : 0,
        transition: 'opacity 150ms'
      }
    }, copied === g.id ? '✓' : '⎘'));
  })) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 12,
      color: rgb('gray-400'),
      fontStyle: 'italic'
    }
  }, "No groups yet."), form === 'create' ? /*#__PURE__*/React.createElement(SideForm, {
    title: "New group",
    placeholder: "Group name",
    label: "Create",
    validate: v => v.trim() ? '' : 'Group name is required.',
    onSubmit: v => {
      setForm(null);
      onCreateGroup(v.trim());
    },
    onCancel: () => setForm(null)
  }) : /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setForm('create'),
    hover: {
      background: '#fff'
    },
    style: {
      ...navItem(false),
      marginBottom: 4,
      display: 'flex',
      gap: 4,
      padding: '6px 8px',
      fontSize: 12,
      color: rgb('blue-600')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "+"), " New Group"), form === 'join' ? /*#__PURE__*/React.createElement(SideForm, {
    title: "Join group",
    placeholder: "Paste invite link",
    label: "Join",
    validate: v => !v.trim() ? 'Paste an invite link or code.' : v.includes('group') ? '' : 'Invalid invite code.',
    onSubmit: () => {
      setForm(null);
      onJoinGroup();
    },
    onCancel: () => setForm(null)
  }) : /*#__PURE__*/React.createElement(Hoverable, {
    onClick: () => setForm('join'),
    hover: {
      background: '#fff'
    },
    style: {
      ...navItem(false),
      display: 'flex',
      gap: 4,
      padding: '6px 8px',
      fontSize: 12,
      color: rgb('gray-600')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "\u2192"), " Join Group"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      borderTop: `1px solid ${rgb('gray-200')}`,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement(Hoverable, {
    onClick: onOpenProfile,
    hover: {
      background: '#fff',
      color: rgb('gray-700')
    },
    style: {
      ...navItem(false),
      padding: '6px 8px',
      fontSize: 12,
      color: rgb('gray-500')
    }
  }, hasProfile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: rgb('gray-700')
    }
  }, "Tiberius"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      color: rgb('gray-400')
    }
  }, "\xB7 Edit profile")) : 'Set up profile')));
}
function ProfileBar({
  hasProfile = true,
  onOpenProfile
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${rgb('gray-200')}`,
      background: '#fff',
      padding: '8px 24px'
    }
  }, hasProfile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-700')
    }
  }, "Signed in as ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: rgb('gray-900')
    }
  }, "Tiberius")), /*#__PURE__*/React.createElement(Hoverable, {
    "aria-label": "Edit profile",
    onClick: onOpenProfile,
    hover: {
      background: rgb('blue-50')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: 'transparent',
      padding: '4px 8px',
      fontSize: 12,
      fontWeight: 500,
      color: rgb('blue-600'),
      fontFamily: 'inherit'
    }
  }, "Edit")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: rgb('gray-500')
    }
  }, "No Lobby profile yet"), /*#__PURE__*/React.createElement(Hoverable, {
    "aria-label": "Open profile setup",
    onClick: onOpenProfile,
    hover: {
      background: rgb('blue-700')
    },
    style: {
      border: 0,
      cursor: 'pointer',
      borderRadius: 4,
      background: rgb('blue-600'),
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'inherit'
    }
  }, "Set up your profile")));
}
Object.assign(window, {
  Sidebar,
  ProfileBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const NDS = window.NondominiumDesignSystem_c29c2b;
const rgb = (t, a) => a != null ? `rgb(var(--ndo-${t}) / ${a})` : `rgb(var(--ndo-${t}))`;
const NDOS = [{
  hash: 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm',
  name: 'Community Solar Array',
  description: 'Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective. Access is open to all AccountableAgents.',
  lifecycle_stage: 'Active',
  resource_nature: 'Physical',
  property_regime: 'Nondominium',
  group: 'sensorica'
}, {
  hash: 'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
  name: 'Open Hardware CNC Bed',
  description: 'Community-maintained CNC router available for approved fabrication tasks.',
  lifecycle_stage: 'Stable',
  resource_nature: 'Physical',
  property_regime: 'Pool',
  group: 'sensorica'
}, {
  hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
  name: 'Distributed Sensor Design v3',
  description: 'Open-source IoT sensor design file for environmental monitoring in urban commons.',
  lifecycle_stage: 'Distributed',
  resource_nature: 'Digital',
  property_regime: 'Commons',
  group: 'ovn'
}, {
  hash: 'uhC0k1234abcdefghijklmnopqrstuvwx',
  name: 'Collective Laser Cutter',
  description: 'Shared laser cutter maintained by the Open Hardware collective.',
  lifecycle_stage: 'Prototype',
  resource_nature: 'Physical',
  property_regime: 'Collective',
  group: 'sensorica'
}, {
  hash: 'uhC0kSeEdLiBrArY7x2Qw9Rt5Yu3Io1P',
  name: 'Community Seed Library',
  description: 'Seasonal seed exchange paused over winter.',
  lifecycle_stage: 'Hibernating',
  hibernation_origin: 'Active',
  resource_nature: 'Physical',
  property_regime: 'CommonPool',
  group: 'ovn'
}, {
  hash: 'uhC0kLeGaCyFiRmWaReV2aB8cD6eF4gH',
  name: 'Legacy Sensor Firmware v2',
  description: 'Superseded firmware for the v2 sensor board.',
  lifecycle_stage: 'Deprecated',
  successor_ndo_hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
  resource_nature: 'Digital',
  property_regime: 'Commons',
  group: 'ovn'
}, {
  hash: 'uhC0kMeShNeTwOrKiDeA9z8y7x6w5v4u',
  name: 'Neighbourhood Mesh Network',
  description: 'Idea for a community-run wireless mesh.',
  lifecycle_stage: 'Ideation',
  resource_nature: 'Service',
  property_regime: 'Public',
  group: 'sensorica'
}];
const GROUPS = [{
  id: 'sensorica',
  name: 'Sensorica'
}, {
  id: 'ovn',
  name: 'Open Value Network'
}];
const MEMBERS = [{
  id: 'a',
  name: 'Tiberius',
  role: 'Member'
}, {
  id: 'b',
  name: 'Soushi',
  role: 'Member'
}, {
  id: 'c',
  name: 'Lynn',
  role: 'Member'
}];

// Per-NDO Layer 1/2 seed data (ResourcesTab, GovernanceTab, ActivityTab, TransitionHistoryPanel)
const SEED = {
  'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm': {
    specs: [{
      name: 'Community Solar Array v1.0',
      category: 'energy',
      scope: 'Public',
      description: 'Rooftop PV bank with shared inverter.',
      resources: [{
        quantity: 12,
        unit: 'kWp',
        state: 'InUse'
      }, {
        quantity: 8,
        unit: 'kWp',
        state: 'Available'
      }, {
        quantity: 1,
        unit: 'inverter',
        state: 'InMaintenance'
      }]
    }],
    rules: [{
      kind: 'UsageLimit',
      spec: 'Community Solar Array v1.0',
      payload: {
        max_duration_hours: 40,
        max_quantity_per_period: '',
        period_days: 7
      },
      enforced_by: 'AccountableAgent'
    }, {
      kind: 'AccessRequirement',
      spec: 'Community Solar Array v1.0',
      payload: {
        accessibility: 'Credentialed',
        required_role: 'AccountableAgent',
        min_affiliation: ''
      },
      enforced_by: ''
    }, {
      kind: 'MaintenanceSchedule',
      spec: 'Community Solar Array v1.0',
      payload: {
        interval_days: 90,
        required_role: 'Repair'
      },
      enforced_by: 'Repair'
    }],
    commitments: [{
      action: 'TransferCustody',
      due: '5/15/2026, 10:00:00 AM',
      note: 'Monthly collective distribution'
    }],
    events: [{
      action: 'Use',
      qty: 12,
      time: '3/9/2024, 4:00:00 PM',
      note: 'Annual output survey'
    }, {
      action: 'TransferCustody',
      qty: 4,
      time: '2/1/2024, 9:30:00 AM',
      note: ''
    }],
    history: [{
      from: 'Stable',
      to: 'Distributed',
      agent: 'uhCAk2vMp8X3nRwsQzLt',
      time: '1/12/2024, 2:10:00 PM',
      event: 'uhCkkE4vTx9pQ2mR7sLw'
    }, {
      from: 'Distributed',
      to: 'Active',
      agent: 'uhCAk2vMp8X3nRwsQzLt',
      time: '2/20/2024, 11:45:00 AM',
      event: 'uhCkkJ8nWq3cV6bY1zXa'
    }]
  }
};
const emptySeed = () => ({
  specs: [],
  rules: [],
  commitments: [],
  events: [],
  history: []
});
const kebab = s => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const ndoBadges = d => [{
  variant: 'lifecycle-' + kebab(d.lifecycle_stage),
  label: d.lifecycle_stage
}, {
  variant: d.property_regime === 'Public' ? 'neutral' : 'regime-' + kebab(d.property_regime),
  label: d.property_regime
}, {
  variant: 'nature-' + kebab(d.resource_nature),
  label: d.resource_nature
}];
function Hoverable({
  as = 'button',
  style,
  hover,
  children,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({}, rest, {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      ...style,
      ...(h ? hover : null)
    }
  }), children);
}
Object.assign(window, {
  NDS,
  rgb,
  NDOS,
  GROUPS,
  MEMBERS,
  SEED,
  emptySeed,
  kebab,
  ndoBadges,
  Hoverable
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BADGE_VARIANTS = __ds_scope.BADGE_VARIANTS;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatusDot = __ds_scope.StatusDot;

})();
