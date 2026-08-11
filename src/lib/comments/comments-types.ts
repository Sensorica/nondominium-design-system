// Types for the screen & scenario comments feature.
// The backend is GitHub Discussions; these are the shapes we keep after
// flattening what the GraphQL API returns.

export interface CommentAuthor {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface CommentReaction {
  content: string;
  count: number;
  viewerReacted: boolean;
}

export interface Comment {
  id: string;
  bodyHTML: string;
  body: string;
  author: CommentAuthor;
  createdAt: string;
  reactions: CommentReaction[];
  /** One level of replies is enough for review threads. */
  replies: Comment[];
}

export interface Discussion {
  /** Discussion node id (GraphQL global id). */
  id: string;
  number: number;
  /** Equals the resolved surface key. */
  title: string;
  url: string;
  comments: Comment[];
}

export type CommentsError =
  | { kind: 'no-token' }
  | { kind: 'auth'; message: string }
  | { kind: 'network'; message: string }
  | { kind: 'graphql'; message: string };

export type Result<T> = { ok: true; value: T } | { ok: false; error: CommentsError };

/** The ReactionContent enum values GitHub accepts (the subset we surface). */
export const REACTION_CONTENTS = [
  'THUMBS_UP',
  'THUMBS_DOWN',
  'LAUGH',
  'HOORAY',
  'CONFUSED',
  'HEART',
  'ROCKET',
  'EYES',
] as const;
export type ReactionContent = (typeof REACTION_CONTENTS)[number];
