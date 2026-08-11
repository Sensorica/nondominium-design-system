// Thin, typed GraphQL client for the comments feature.
// All calls go straight from the browser to GitHub. There is no proxy and no
// server: the discussion repo is private to the Sensorica org, and GitHub's API
// permits authenticated cross-origin calls.
//
// Config is re-pointable, so the discussion repo can be swapped without touching
// any other file.

import type { Comment, Discussion, Result } from './comments-types';
import { REACTION_CONTENTS, type ReactionContent } from './comments-types';

// ── Config ──────────────────────────────────────────────────────────────────
// Backend: Sensorica/nondominium-design-review (private).
// The "General" category is repurposed as the comments bucket: GitHub's GraphQL
// API cannot create discussion categories (UI only), so surfaces are told apart
// by the discussion TITLE, which is the surface key.
export const DISCUSSION_CONFIG = {
  owner: 'Sensorica',
  name: 'nondominium-design-review',
  categoryId: 'DIC_kwDOT06gls4DDH2j',
} as const;

const ENDPOINT = 'https://api.github.com/graphql';

// ── Fetch wrapper ───────────────────────────────────────────────────────────
async function gql<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<Result<T>> {
  if (!token) return { ok: false, error: { kind: 'no-token' } };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: { kind: 'auth', message: 'Token rejected by GitHub.' } };
    }
    if (!res.ok) return { ok: false, error: { kind: 'network', message: `HTTP ${res.status}` } };
    const json = await res.json();
    if (json.errors) {
      const message = json.errors.map((e: { message: string }) => e.message).join('; ');
      return { ok: false, error: { kind: 'graphql', message } };
    }
    return { ok: true, value: json.data as T };
  } catch (e) {
    return { ok: false, error: { kind: 'network', message: e instanceof Error ? e.message : String(e) } };
  }
}

// ── Raw shapes from GitHub ──────────────────────────────────────────────────
interface RawReaction { content: string }
interface RawAuthor { login: string; avatarUrl: string; url: string }
interface RawComment {
  id: string;
  body: string;
  bodyHTML: string;
  createdAt: string;
  author: RawAuthor | null;
  reactions: { totalCount: number; nodes: RawReaction[] };
  replies?: { nodes: RawComment[] };
}
interface RawDiscussion {
  id: string;
  number: number;
  title: string;
  url: string;
  comments: { nodes: RawComment[] };
}

// ── Mapping ─────────────────────────────────────────────────────────────────
function mapReactions(raw: { totalCount: number; nodes: RawReaction[] }): Comment['reactions'] {
  const out: Comment['reactions'] = [];
  for (const content of REACTION_CONTENTS) {
    const nodes = raw.nodes.filter((n) => n.content === content);
    if (nodes.length > 0) out.push({ content, count: nodes.length, viewerReacted: false });
  }
  return out;
}

function mapComment(raw: RawComment): Comment {
  return {
    id: raw.id,
    bodyHTML: raw.bodyHTML,
    body: raw.body,
    author: raw.author ?? { login: 'ghost', avatarUrl: '', url: '' },
    createdAt: raw.createdAt,
    reactions: mapReactions(raw.reactions),
    replies: raw.replies ? raw.replies.nodes.map(mapComment) : [],
  };
}

function mapDiscussion(raw: RawDiscussion): Discussion {
  return {
    id: raw.id,
    number: raw.number,
    title: raw.title,
    url: raw.url,
    comments: raw.comments.nodes.map(mapComment),
  };
}

// ── findDiscussion ──────────────────────────────────────────────────────────
// Fetch the repo's discussions unfiltered and match by title in code. Filtering
// by categoryId in the browser context returns nothing (a variable
// serialization quirk in the reference implementation, verified 2026-07-29);
// the category is organizational only, and the title is the real join, so
// dropping the filter costs nothing.
//
// GitHub's schema does not expose a `replies` connection on top-level discussion
// comments in this query, so review threads treat each comment as independent.
const FIND_Q = `query($owner:String!,$name:String!){
  repository(owner:$owner,name:$name){
    discussions(first:50){
      nodes {
        id number title url
        comments(first:50){ nodes {
          id body bodyHTML createdAt
          author{ login avatarUrl url }
          reactions(first:10){ totalCount nodes{ content } }
        } }
      }
    }
  }
}`;

export async function findDiscussion(key: string, token: string): Promise<Result<Discussion | null>> {
  const r = await gql<{ repository: { discussions: { nodes: RawDiscussion[] } } | null }>(
    FIND_Q,
    { owner: DISCUSSION_CONFIG.owner, name: DISCUSSION_CONFIG.name },
    token
  );
  if (!r.ok) return r;
  const nodes = r.value?.repository?.discussions?.nodes ?? [];
  const hit = nodes.find((n) => n.title === key);
  return { ok: true, value: hit ? mapDiscussion(hit) : null };
}

// ── ensureDiscussion (lazy-create, idempotent) ──────────────────────────────
const REPO_ID_Q = `query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id } }`;
const CREATE_Q = `mutation($input:CreateDiscussionInput!){
  createDiscussion(input:$input){ discussion { id number title url } }
}`;

export async function ensureDiscussion(
  key: string,
  label: string,
  token: string
): Promise<Result<Discussion>> {
  const found = await findDiscussion(key, token);
  if (!found.ok) return found;
  if (found.value) return { ok: true, value: found.value };

  const rid = await gql<{ repository: { id: string } }>(
    REPO_ID_Q,
    { owner: DISCUSSION_CONFIG.owner, name: DISCUSSION_CONFIG.name },
    token
  );
  if (!rid.ok) return rid;

  const body = `Auto-managed review thread for **${label}**.\n\nKey: \`${key}\`\n\nComments here appear on the design-system surface, and comments left on the surface appear here.`;
  const created = await gql<{ createDiscussion: { discussion: Omit<RawDiscussion, 'comments'> } }>(
    CREATE_Q,
    {
      input: {
        repositoryId: rid.value.repository.id,
        categoryId: DISCUSSION_CONFIG.categoryId,
        title: key,
        body,
      },
    },
    token
  );
  if (!created.ok) return created;
  const d = created.value.createDiscussion.discussion;
  return { ok: true, value: { ...d, comments: [] } };
}

// ── addComment / addReply ───────────────────────────────────────────────────
const ADD_COMMENT_Q = `mutation($d:ID!,$b:String!){
  addDiscussionComment(input:{discussionId:$d,body:$b}){ comment {
    id body bodyHTML createdAt
    author{ login avatarUrl url }
    reactions(first:10){ totalCount nodes{ content } }
  } }
}`;

export async function addComment(
  discussionId: string,
  body: string,
  token: string
): Promise<Result<Comment>> {
  const r = await gql<{ addDiscussionComment: { comment: RawComment } }>(
    ADD_COMMENT_Q,
    { d: discussionId, b: body },
    token
  );
  if (!r.ok) return r;
  return { ok: true, value: mapComment(r.value.addDiscussionComment.comment) };
}

// Replying requires BOTH discussionId and replyToId; GitHub rejects replyToId
// on its own.
const ADD_REPLY_Q = `mutation($d:ID!,$p:ID!,$b:String!){
  addDiscussionComment(input:{discussionId:$d,replyToId:$p,body:$b}){ comment {
    id body bodyHTML createdAt
    author{ login avatarUrl url }
    reactions(first:10){ totalCount nodes{ content } }
  } }
}`;

export async function addReply(
  discussionId: string,
  parentId: string,
  body: string,
  token: string
): Promise<Result<Comment>> {
  const r = await gql<{ addDiscussionComment: { comment: RawComment } }>(
    ADD_REPLY_Q,
    { d: discussionId, p: parentId, b: body },
    token
  );
  if (!r.ok) return r;
  return { ok: true, value: mapComment(r.value.addDiscussionComment.comment) };
}

// ── Reactions ───────────────────────────────────────────────────────────────
const ADD_REACTION_Q = `mutation($s:ID!,$c:ReactionContent!){
  addReaction(input:{subjectId:$s,content:$c}){ reaction { content } }
}`;
const RM_REACTION_Q = `mutation($s:ID!,$c:ReactionContent!){
  removeReaction(input:{subjectId:$s,content:$c}){ reaction { content } }
}`;

export async function toggleReaction(
  subjectId: string,
  content: ReactionContent,
  token: string,
  alreadyReacted: boolean
): Promise<Result<void>> {
  return gql<void>(alreadyReacted ? RM_REACTION_Q : ADD_REACTION_Q, { s: subjectId, c: content }, token);
}

// ── validateToken ───────────────────────────────────────────────────────────
const VIEWER_Q = `query{ viewer { login } }`;

export async function validateToken(token: string): Promise<Result<string>> {
  const r = await gql<{ viewer: { login: string } }>(VIEWER_Q, {}, token);
  if (!r.ok) return r;
  return { ok: true, value: r.value.viewer.login };
}
