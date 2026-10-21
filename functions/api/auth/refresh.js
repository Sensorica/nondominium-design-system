// Silent refresh. GitHub App user-access tokens expire after 8 hours; the
// refresh token is good for around six months. The client calls this when the
// stored token is near expiry, so a reviewer signs in once rather than daily.
//
// Stateless: takes a refresh token, returns a fresh pair, stores nothing.

// Public by design. Keep in step with CLIENT_ID in functions/api/auth/callback.js
// and src/lib/comments/auth.ts. Grep for Iv23liFgsr9Y22WKGQm1.
const CLIENT_ID = 'Iv23liFgsr9Y22WKGQm1';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

export async function onRequestPost({ request, env }) {
  if (!env.GITHUB_APP_CLIENT_SECRET) {
    return json({ error: 'server_missing_client_secret' }, 500);
  }

  let refreshToken;
  try {
    const body = await request.json();
    refreshToken = body && body.refresh_token;
  } catch (e) {
    return json({ error: 'bad_request' }, 400);
  }

  if (!refreshToken) return json({ error: 'missing_refresh_token' }, 400);

  let data;
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'user-agent': 'nondominium-design-review'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: env.GITHUB_APP_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });
    data = await res.json();
  } catch (e) {
    return json({ error: 'refresh_request_failed' }, 502);
  }

  // A refresh token that has expired or been revoked lands here. The client
  // treats this as "signed out" and shows the sign-in button again.
  if (data.error || !data.access_token) {
    return json({ error: data.error || 'refresh_failed' }, 401);
  }

  return json({
    token: data.access_token,
    refresh: data.refresh_token || '',
    expiresIn: Number(data.expires_in || 0)
  });
}

// Any other method gets a 405 instead of falling through to the static site.
export async function onRequest() {
  return json({ error: 'method_not_allowed' }, 405, { allow: 'POST' });
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extra
    }
  });
}
