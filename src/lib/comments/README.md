# Screen and scenario comments 💬

Threaded review comments on every prototype screen and every scenario, stored as **GitHub Discussions** in a private repo. Reads and writes go from the browser to GitHub's GraphQL API directly: there is no proxy and no database. The only server code is two small Cloudflare Pages Functions that exist to sign a reviewer in (see "Signing in" below).

## How it works

| Piece | File |
|---|---|
| Surface key resolution | `src/lib/surface-keys.ts` |
| State singleton (token, refresh token, expiry, thread, drawer) | `comments.svelte.ts` |
| GraphQL client | `github-client.ts` |
| Sign-in popup, message check, silent refresh | `auth.ts` |
| Code-for-token exchange and refresh (Pages Functions) | `functions/api/auth/callback.js`, `functions/api/auth/refresh.js` |
| Drawer, list, compose, setup | `src/lib/components/comments/` |

1. The drawer resolves the current pathname to a **surface key** (`ndo-detail`, `scenario:lobby-browse`).
2. It looks for a Discussion whose **title** equals that key.
3. Posting the first comment on a surface creates the Discussion lazily. Browsing creates nothing.

Keys, not URLs, are the join. A route can be restructured without orphaning its review history.

## Configuration

Three values, all in `github-client.ts`:

```ts
export const DISCUSSION_CONFIG = {
  owner: 'Sensorica',
  name: 'nondominium-design-review',
  categoryId: 'DIC_kwDOT06gls4DDH2j',   // the "General" category
} as const;
```

They are mirrored in `SKILL.md` under `capabilities.review`. Change both together.

The category is organisational only. GitHub's GraphQL API cannot create discussion categories (the UI can, the API cannot), so every thread lives in **General** and is told apart by its title.

## Signing in

On `https://design.sensorica.co` the setup card offers **Sign in with GitHub** as the primary action. A reviewer clicks it, approves once in a popup, and comments. They never create a token.

1. `auth.ts` generates a random `state` and opens GitHub's authorize URL in a popup, with the redirect set to `https://design.sensorica.co/api/auth/callback`.
2. GitHub redirects the popup to the callback Function with `?code=` and the `state`.
3. `functions/api/auth/callback.js` exchanges the code at `https://github.com/login/oauth/access_token`. This is the one step that needs the client secret, so it runs server-side. It returns a tiny page that `postMessage`s the result to the opener, with the exact site origin as `targetOrigin` (never `*`), and closes.
4. `auth.ts` accepts the message only if all three hold: `e.origin === location.origin`, the message has the expected `type` (`ndo-ds-comments-auth`), and its `state` equals the one generated in step 1. It then stores the token, the refresh token and the expiry.
5. Tokens last eight hours. When the drawer opens, `ensureFreshToken()` renews a token that is within five minutes of expiry by calling `POST /api/auth/refresh`. A 401 from refresh (spent or revoked refresh token) clears the session and shows the sign-in button again.

Both Functions are stateless, method-checked (`callback` is GET only, `refresh` is POST only, anything else gets a 405), and return a readable HTML error page instead of throwing when `GITHUB_APP_CLIENT_SECRET` is missing.

**The privacy check is GitHub's, not ours.** A user-access token grants the intersection of what the App may reach and what that person may reach, so a non-member sees an empty overlay rather than an error.

### Where sign-in is not offered

The site is also published to GitHub Pages under `/nondominium-design-system`, where Functions do not exist. `signInAvailable` in `auth.ts` is true only when SvelteKit's `base` path is empty and the build is not `vite dev`. The Cloudflare deploy builds with `BASE_PATH=""`, so it gets the button. The GitHub Pages build keeps the sub-path base, and `vite dev` has no Functions, so both show the token-paste form directly.

### The GitHub App

Created once, by an owner of the `Sensorica` organisation:

- Owned by the `Sensorica` organisation.
- One permission: **Repository permissions → Discussions: Read and write**. Nothing else.
- Installed on `Sensorica/nondominium-design-review` only, never org-wide.
- Callback URL: `https://design.sensorica.co/api/auth/callback`.
- User-to-server token expiry left on (eight hours, with refresh tokens).

The client ID is public. It is the constant `CLIENT_ID` in `auth.ts`, `functions/api/auth/callback.js` and `functions/api/auth/refresh.js`, currently the placeholder `REPLACE_WITH_SENSORICA_APP_CLIENT_ID`. Replace all three together (`grep -rn REPLACE_WITH_SENSORICA_APP_CLIENT_ID functions src`).

The client secret is never in the repo. Set it as a Pages secret on the `nondominium-design` project, for production (and preview if you want sign-in on preview deploys, though the callback URL above only matches the production hostname):

```bash
bunx wrangler pages secret put GITHUB_APP_CLIENT_SECRET --project-name nondominium-design
```

Check it after the first deploy:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://design.sensorica.co/api/auth/callback   # 405
curl -s 'https://design.sensorica.co/api/auth/callback?code=invalid' | head -5                    # a readable error page
```

## Pasting a token instead

The older route stays available behind "Use a personal access token instead" (and is the only route on the GitHub Pages copy), so tokens issued before sign-in existed keep working. A pasted token has no recorded expiry and is never refreshed.

You need a fine-grained personal access token from a member of the `Sensorica` organisation:

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. Resource owner: **Sensorica**.
3. Repository access: **Only select repositories** → `nondominium-design-review`.
4. Permissions → Repository permissions → **Discussions: Read and write**.
5. Generate, copy, and paste it into the 💬 drawer.

## Privacy model

- The token lives in `localStorage` in your browser (`ndo_ds_comments_token`, plus `ndo_ds_comments_refresh` and `ndo_ds_comments_expires` after a GitHub sign-in).
- It is sent to `api.github.com` in an `Authorization` header over HTTPS. During sign-in the one-time code passes through this site's callback Function, which stores nothing; the token itself is delivered to the page by `postMessage`, never in a URL.
- **Sign out** clears all three keys immediately, and the drawer locks.
- The review repo is private. Anyone without org access sees the setup card and nothing else, including the fact that a thread exists.

## Known limits

- **Replies render flat.** GitHub's schema does not expose a `replies` connection on top-level discussion comments in the query we use, so a reply posts correctly with `replyToId` but comes back as a top-level comment. The `Comment.replies` field is kept for a richer read later.
- **Reactions are optimistic.** `viewerReacted` is not returned by the list query, so the first click on a reaction you already left will remove it rather than adding a second.
- **Fifty and fifty.** The find query fetches the first 50 discussions and the first 50 comments each. Neither is close to being reached; both will need pagination eventually.
