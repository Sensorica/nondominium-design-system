// GitHub App sign-in. Replaces the paste-a-token flow as the primary route.
//
// The popup goes to GitHub, GitHub redirects it to /api/auth/callback, and that
// Cloudflare Pages Function exchanges the code server-side and postMessages the
// result back here. The client secret never reaches the browser.
//
// Same-origin throughout, because the site and the Functions share a hostname on
// Cloudflare Pages. That collapses the receive-side check to a plain equality on
// location.origin.
//
// The GitHub Pages copy of the site (a sub-path, no Functions) cannot sign in;
// see signInAvailable.

import { base } from '$app/paths';
import { setSession, clearToken, comments } from './comments.svelte';

// Public by design. Keep in step with CLIENT_ID in functions/api/auth/callback.js
// and functions/api/auth/refresh.js. Grep for REPLACE_WITH_SENSORICA_APP_CLIENT_ID.
const CLIENT_ID = 'REPLACE_WITH_SENSORICA_APP_CLIENT_ID';
const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const CALLBACK_PATH = '/api/auth/callback';
const REFRESH_PATH = '/api/auth/refresh';
const MESSAGE_TYPE = 'ndo-ds-comments-auth';

/** Refresh when the token has this long or less remaining. */
const REFRESH_WINDOW_MS = 5 * 60 * 1000;

/**
 * Whether this build can offer "Sign in with GitHub". The Functions exist only on
 * the Cloudflare Pages deploy, which is built with BASE_PATH="" and so serves the
 * site at the domain root. The GitHub Pages deploy keeps the sub-path base, and
 * `vite dev` has no Functions and no matching callback URL, so neither can sign
 * in and both fall back to pasting a token.
 */
export const signInAvailable: boolean = base === '' && !import.meta.env.DEV;

type AuthResult = { ok: true } | { ok: false; error: string };

function randomState(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (n) => n.toString(16).padStart(2, '0')).join('');
}

/**
 * Open the GitHub authorization popup and resolve once the callback has posted
 * a token back. Rejects nothing: failures come back as { ok: false }.
 */
export function signInWithGitHub(): Promise<AuthResult> {
  return new Promise((resolve) => {
    if (!signInAvailable) {
      resolve({ ok: false, error: 'sign_in_unavailable' });
      return;
    }

    const state = randomState();
    const redirectUri = `${location.origin}${CALLBACK_PATH}`;
    const url =
      `${AUTHORIZE_URL}?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}`;

    const popup = window.open(url, MESSAGE_TYPE, 'width=640,height=780');
    if (!popup) {
      resolve({ ok: false, error: 'popup_blocked' });
      return;
    }

    let settled = false;

    function finish(result: AuthResult) {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', onMessage);
      clearInterval(closedPoll);
      resolve(result);
    }

    function onMessage(e: MessageEvent) {
      // Three checks, all of them load-bearing: same origin, our message
      // shape, and the state we generated for this attempt.
      if (e.origin !== location.origin) return;
      const d = e.data as Record<string, unknown> | null;
      if (!d || d.type !== MESSAGE_TYPE) return;
      if (d.state !== state) return;

      if (d.error) {
        finish({ ok: false, error: String(d.error) });
        return;
      }
      if (typeof d.token !== 'string' || !d.token) {
        finish({ ok: false, error: 'no_token_returned' });
        return;
      }

      setSession(d.token, typeof d.refresh === 'string' ? d.refresh : '', Number(d.expiresIn) || 0);
      finish({ ok: true });
    }

    window.addEventListener('message', onMessage);

    // The user closing the popup without authorizing is a normal outcome, not
    // an error state to leave hanging.
    const closedPoll = setInterval(() => {
      if (popup.closed) finish({ ok: false, error: 'cancelled' });
    }, 500);
  });
}

/**
 * Ensure the stored token is usable. Refreshes silently when it is close to
 * expiry. Returns false when the session is gone and the user must sign in.
 *
 * expiresAt of 0 means "no expiry recorded": either a pasted personal access
 * token or an App with token expiry disabled. Both are left alone.
 */
export async function ensureFreshToken(): Promise<boolean> {
  if (!comments.token) return false;
  if (!comments.expiresAt) return true;
  if (Date.now() < comments.expiresAt - REFRESH_WINDOW_MS) return true;

  if (!comments.refresh) {
    clearToken();
    return false;
  }

  try {
    const res = await fetch(REFRESH_PATH, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: comments.refresh })
    });

    // 401 means the refresh token is spent or revoked: signed out, cleanly.
    if (res.status === 401) {
      clearToken();
      return false;
    }
    // Any other failure (a server fault, a misconfigured secret) is not proof the
    // session is gone. Keep it and let the next API call surface the problem.
    if (!res.ok) return true;

    const data = (await res.json()) as {
      token?: string;
      refresh?: string;
      expiresIn?: number;
    };

    if (!data.token) {
      clearToken();
      return false;
    }

    setSession(data.token, data.refresh ?? '', Number(data.expiresIn) || 0);
    return true;
  } catch {
    // Network failure is not a signed-out state: keep the session.
    return true;
  }
}

export function signOut(): void {
  clearToken();
}
