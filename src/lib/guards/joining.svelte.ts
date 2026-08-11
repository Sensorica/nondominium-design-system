// The identity-ladder machine for the whole prototype, instantiated ONCE at
// module scope. Screens import THIS singleton; they never construct their own.
import { useJoiningGuard } from './useJoiningGuard.svelte';

export const joining = useJoiningGuard();
