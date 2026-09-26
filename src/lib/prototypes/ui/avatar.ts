// Default avatar: an agent's avatar_url is optional. Without one, the UI shows
// initials on one of eight hues, chosen by hashing the agent key, so the same
// agent always gets the same colour in every direction. These eight hex values
// are the only hex literals the prototype kit allows (from the handoff).
export const AVATAR_HUES = ['#2E7D74', '#3F6FDB', '#7C55E6', '#C2410C', '#B45309', '#0E7490', '#BE185D', '#4D7C0F'] as const;

export function avatarColor(id: string): string {
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_HUES[h % AVATAR_HUES.length];
}

export function initials(name: string | null | undefined): string {
  return (
    String(name || '?')
      .replace(/^Dr\.\s*/, '')
      .split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  );
}

/** Only https avatar URLs are shown (the zome requires it). */
export const isHttpsUrl = (u: string | null | undefined): u is string => !!u && u.startsWith('https://');
