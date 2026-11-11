/**
 * Join / membership affordance shared by NDO detail surfaces.
 *
 * Creation and joining stay separate: an initiator is not a member until
 * `join_ndo` (or the session's join action) records membership. `joined: null`
 * means the membership read has not returned yet — Join stays disabled so the
 * button cannot flip under the agent.
 */
export function joinAffordance(opts: {
  /** `null` until membership is known; `true` after a successful join or read. */
  joined: boolean | null;
  loading: boolean;
}): { disabled: boolean; headerLabel: string; confirmLabel: string } {
  const { joined, loading } = opts;
  if (loading) {
    return { disabled: true, headerLabel: 'Joining…', confirmLabel: 'Joining…' };
  }
  if (joined === true) {
    return { disabled: true, headerLabel: 'Joined', confirmLabel: 'Joined' };
  }
  // `joined === false` → clickable. `joined === null` → wait for the read.
  return {
    disabled: joined !== false,
    headerLabel: 'Join NDO',
    confirmLabel: 'Join this NDO'
  };
}
