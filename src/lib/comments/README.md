# Screen and scenario comments 💬

Threaded review comments on every prototype screen and every scenario, stored as **GitHub Discussions** in a private repo. The site stays fully static: the browser talks to GitHub's GraphQL API directly. There is no server, no proxy, and no database.

## How it works

| Piece | File |
|---|---|
| Surface key resolution | `src/lib/surface-keys.ts` |
| State singleton (token, thread, drawer) | `comments.svelte.ts` |
| GraphQL client | `github-client.ts` |
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

## Getting a token

You need a fine-grained personal access token from a member of the `Sensorica` organisation:

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. Resource owner: **Sensorica**.
3. Repository access: **Only select repositories** → `nondominium-design-review`.
4. Permissions → Repository permissions → **Discussions: Read and write**.
5. Generate, copy, and paste it into the 💬 drawer.

## Privacy model

- The token lives in `localStorage` under `ndo_ds_comments_token`, in your browser, on your machine.
- It is sent only to `api.github.com`, in an `Authorization` header, over HTTPS.
- It never reaches this site's origin, because this site has no origin to reach — it is static files on GitHub Pages.
- **Log out** clears it immediately, and the drawer locks.
- The review repo is private. Anyone without org access sees the setup card and nothing else, including the fact that a thread exists.

## Known limits

- **Replies render flat.** GitHub's schema does not expose a `replies` connection on top-level discussion comments in the query we use, so a reply posts correctly with `replyToId` but comes back as a top-level comment. The `Comment.replies` field is kept for a richer read later.
- **Reactions are optimistic.** `viewerReacted` is not returned by the list query, so the first click on a reaction you already left will remove it rather than adding a second.
- **Fifty and fifty.** The find query fetches the first 50 discussions and the first 50 comments each. Neither is close to being reached; both will need pagination eventually.
