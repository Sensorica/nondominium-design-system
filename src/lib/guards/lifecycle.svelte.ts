// The NDO lifecycle machine's draft state, instantiated ONCE at module scope so
// the transition modal survives a client-side navigation. The transition RULES
// are pure functions in useLifecycleFlow.svelte.ts — import those directly.
import { useLifecycleFlow } from './useLifecycleFlow.svelte';

export const lifecycle = useLifecycleFlow();
