// Copy of ui/src/lib/utils/operational-state-labels.ts from the app at
// 20adb117219de3e7a1a45b53d8a02fc0602feb7e. Only the type import is repointed.
//
// The app path and SHA above are load-bearing: check:fidelity walks
// ui/src/lib/components only, so no instrument in this repo measures a util
// against its original. This comment is the only record of where this came
// from and what it was faithful to.
//
// OperationalState is NOT LifecycleStage and must never borrow its badge. A
// resource being repaired is still LifecycleStage.Active with
// OperationalState.InMaintenance; conflating the two is the exact defect the
// legacy ResourceState enum carries and that REQ-NDO-OS-06 exists to split.
import type { OperationalState } from './types';

const LABELS: Record<OperationalState, string> = {
  Available: 'Available',
  Reserved: 'Reserved',
  InTransit: 'In transit',
  InStorage: 'In storage',
  InMaintenance: 'In maintenance',
  InUse: 'In use',
  PendingValidation: 'Pending validation'
};

/** Human-readable label for an EconomicResource operational_state value. */
export function operationalStateLabel(state: OperationalState | string): string {
  if (state in LABELS) {
    return LABELS[state as OperationalState];
  }
  return state;
}
