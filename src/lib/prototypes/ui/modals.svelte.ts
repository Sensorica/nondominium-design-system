// Which shared modal is open. One direction is mounted at a time, so one
// module-level slot is enough; the direction's <ModalHost /> renders it.
//
//   import { modals } from '$lib/prototypes/ui';
//   modals.open({ type: 'rule', ndo: id });
//
// The slot outlives the direction that filled it (it is module state), so it
// is owned: a request remembers the route it was opened on, ModalHost renders
// it only on that route, and the direction layout closes it whenever the
// direction changes or is left. A callback such as `after` belongs to the
// direction that opened it; without the owner check, a modal left open in E
// and reopened by D's host would run E's `after` and navigate back to E.
import type { Signal } from '../store/logic';

export type ModalRequest =
  | { type: 'create'; after?: (ndoId: string) => void }
  | { type: 'attach' | 'note' | 'advance' | 'rule' | 'resources' | 'commit'; ndo: string }
  | { type: 'commitments'; ndo?: string }
  | { type: 'profile' | 'receipts' | 'help' }
  | { type: 'group' | 'join'; after?: (groupId: string) => void }
  | { type: 'browse'; onOpen?: (ndoId: string) => void }
  | { type: 'why'; sig: Signal; ndo: string };

export type ModalType = ModalRequest['type'];

let current = $state.raw<ModalRequest | null>(null);
let owner = $state.raw<string | null>(null);

const here = (): string | null => (typeof location === 'undefined' ? null : location.pathname);

export const modals = {
  get current(): ModalRequest | null {
    return current;
  },
  /** The route pathname the open modal belongs to. */
  get owner(): string | null {
    return owner;
  },
  open(m: ModalRequest): void {
    owner = here();
    current = m;
  },
  close(): void {
    current = null;
    owner = null;
  }
};
