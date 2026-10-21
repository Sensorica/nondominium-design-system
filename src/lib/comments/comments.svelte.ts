// Module-level $state singleton for the comments overlay. One instance at module
// scope, so the token and the loaded thread persist across client-side
// navigations within a session. Mirrors the screenMap / appState pattern.
//
// Token persistence is localStorage, SSR-guarded: this site prerenders, and
// `localStorage` does not exist on the server.

import type { CommentsError, Discussion } from './comments-types';
import type { About } from './about';

// Sign-in with GitHub (auth.ts) issues a user-access token that expires after 8
// hours, so a refresh token and an expiry timestamp are stored beside it. A pasted
// personal access token has neither and keeps working as before.
const TOKEN_KEY = 'ndo_ds_comments_token';
const REFRESH_KEY = 'ndo_ds_comments_refresh';
const EXPIRES_KEY = 'ndo_ds_comments_expires';

function readItem(key: string): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(key) ?? '';
}

function writeItem(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return;
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
}

export const comments = $state({
  /** Token present AND validated against the API. */
  enabled: false,
  open: false,
  token: readItem(TOKEN_KEY),
  /** Refresh token, when the App issues one. '' for a pasted token. */
  refresh: readItem(REFRESH_KEY),
  /** Epoch ms when the token expires. 0 means no known expiry. */
  expiresAt: Number(readItem(EXPIRES_KEY)) || 0,
  viewerLogin: '' as string,
  loading: false,
  error: null as CommentsError | null,
  /** The current surface's discussion, or null. */
  thread: null as Discussion | null,
  /**
   * A moment a page has asked the next comment to be about, such as a meeting
   * paragraph's first minute. The top-level compose box takes it and clears it.
   */
  stamp: null as { t: number; quote?: string } | null,
  /**
   * A paragraph a page has asked the next comment to point at (about.ts). The
   * top-level compose box takes it and clears it.
   */
  about: null as About | null,
});

/**
 * Store a whole session. `expiresIn` is seconds from now, as GitHub returns it;
 * 0 means the App has token expiry disabled, so no expiry is recorded.
 */
export function setSession(token: string, refresh: string, expiresIn: number): void {
  comments.token = token;
  comments.refresh = refresh;
  comments.expiresAt = expiresIn > 0 ? Date.now() + expiresIn * 1000 : 0;

  writeItem(TOKEN_KEY, token);
  writeItem(REFRESH_KEY, refresh);
  writeItem(EXPIRES_KEY, comments.expiresAt ? String(comments.expiresAt) : '');

  comments.enabled = !!token;
  if (!token) comments.viewerLogin = '';
}

/** The paste path, and anything that only has a bare token. */
export function setToken(t: string): void {
  setSession(t, '', 0);
}

export function clearToken(): void {
  setSession('', '', 0);
  comments.thread = null;
  comments.error = null;
}
