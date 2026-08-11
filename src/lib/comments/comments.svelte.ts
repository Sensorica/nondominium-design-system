// Module-level $state singleton for the comments overlay. One instance at module
// scope, so the token and the loaded thread persist across client-side
// navigations within a session. Mirrors the screenMap / appState pattern.
//
// Token persistence is localStorage, SSR-guarded: this site prerenders, and
// `localStorage` does not exist on the server.

import type { CommentsError, Discussion } from './comments-types';

const TOKEN_KEY = 'ndo_ds_comments_token';

function readToken(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(TOKEN_KEY) ?? '';
}

export const comments = $state({
  /** Token present AND validated against the API. */
  enabled: false,
  open: false,
  token: readToken(),
  viewerLogin: '' as string,
  loading: false,
  error: null as CommentsError | null,
  /** The current surface's discussion, or null. */
  thread: null as Discussion | null,
});

export function setToken(t: string): void {
  comments.token = t;
  if (typeof localStorage !== 'undefined') {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }
  comments.enabled = !!t;
  if (!t) comments.viewerLogin = '';
}

export function clearToken(): void {
  setToken('');
  comments.thread = null;
  comments.error = null;
}
