export function truncateHash(hash: string, len = 12): string {
  return hash.length <= len ? hash : `${hash.slice(0, len)}…`;
}

export function formatTimestamp(micros: number | null | undefined): string | null {
  if (micros == null) return null;
  return new Date(micros / 1000).toLocaleString();
}

export function formatDate(micros: number | null | undefined): string | null {
  if (micros == null) return null;
  return new Date(micros / 1000).toLocaleDateString();
}
