// GitHub App OAuth callback. The popup lands here carrying ?code=...
//
// Exchanges the code for a user-access token server-side (the one step that
// needs the client secret), then hands the result to the opener via
// postMessage and closes itself. The token never appears in a URL and is
// never stored here: this Function is stateless.
//
// The client secret lives in a Pages secret, GITHUB_APP_CLIENT_SECRET.

// Public by design. Keep in step with CLIENT_ID in functions/api/auth/refresh.js
// and src/lib/comments/auth.ts. Grep for REPLACE_WITH_SENSORICA_APP_CLIENT_ID.
const CLIENT_ID = 'REPLACE_WITH_SENSORICA_APP_CLIENT_ID';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const MESSAGE_TYPE = 'ndo-ds-comments-auth';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') ?? '';
  const origin = url.origin;

  if (!code) return page(origin, { state, error: 'missing_code' });

  if (!env.GITHUB_APP_CLIENT_SECRET) {
    return page(origin, { state, error: 'server_missing_client_secret' });
  }

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
        code
      })
    });
    data = await res.json();
  } catch (e) {
    return page(origin, { state, error: 'exchange_request_failed' });
  }

  if (data.error || !data.access_token) {
    return page(origin, { state, error: data.error || 'exchange_failed' });
  }

  return page(origin, {
    state,
    token: data.access_token,
    refresh: data.refresh_token || '',
    // Seconds. Absent when token expiry is disabled on the App.
    expiresIn: Number(data.expires_in || 0)
  });
}

// Any other method is a mistake or a probe: say so, rather than falling through
// to the static site.
export async function onRequest() {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { allow: 'GET', 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }
  });
}

/**
 * A minimal HTML page that posts the payload to the opener and closes.
 * targetOrigin is this exact origin, never '*', which would leak the token
 * to whatever page happened to open the popup.
 */
function page(origin, payload) {
  const failed = Boolean(payload.error);

  const json = JSON.stringify({ ...payload, type: MESSAGE_TYPE })
    // Defensive: stop any value from breaking out of the script element.
    .replace(/</g, '\\u003c');

  const heading = failed ? 'Sign-in failed' : 'Signing you in';
  const detail = failed
    ? `<p>GitHub returned: <code>${escapeHtml(payload.error)}</code></p>
       <p>This window has stayed open so you can read it. Close it and try again.</p>`
    : '<p>This window should close itself.</p>';

  const body = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${heading}</title></head>
<body style="font:16px/1.5 ui-sans-serif,system-ui,sans-serif;padding:2rem;color:#16181d">
<h1 style="font-size:1.25rem;margin:0 0 .5rem">${heading}</h1>
${detail}
<script>
(function () {
  var payload = ${json};
  try {
    if (window.opener) window.opener.postMessage(payload, ${JSON.stringify(origin)});
  } catch (e) {}
  // Only close on success: an error should stay readable.
  if (!payload.error) setTimeout(function () { window.close(); }, 50);
})();
</script>
</body></html>`;

  return new Response(body, {
    status: failed ? 400 : 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer'
    }
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );
}
