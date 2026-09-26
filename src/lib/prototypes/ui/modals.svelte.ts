// Which shared modal is open. One direction is mounted at a time, so one
// module-level slot is enough; the direction's <ModalHost /> renders it.
//
//   import { modals } from '$lib/prototypes/ui';
//   modals.open({ type: 'rule', ndo: id });
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

export const modals = {
  get current(): ModalRequest | null {
    return current;
  },
  open(m: ModalRequest): void {
    current = m;
  },
  close(): void {
    current = null;
  }
};
