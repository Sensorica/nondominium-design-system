/**
 * The site's colour theme: light or dark, written as `data-theme` on <html>,
 * which is what static/tokens.css flips its semantic layer on.
 *
 * With no stored choice the site follows the OS (`prefers-color-scheme`) and
 * keeps following it live. A click on the toggle stores the choice in
 * localStorage, and from then on the choice wins over the OS.
 *
 * The first paint is decided by the inline script in src/app.html, which runs
 * the same rule before any CSS paints, so there is no light flash in dark mode.
 * `initTheme` only adopts what that script wrote and keeps it current.
 *
 * Some surfaces are pinned light: the replica at /app and the Claude Design card
 * frames at /guidelines/<id> reproduce a product and cards that have no dark
 * mode, and rendering them dark would show reviewers something that does not
 * exist. `pinnedLight` is the one rule both this module and app.html apply.
 *
 * Every browser API is guarded: the site prerenders with adapter-static, so
 * module scope runs in Node during the build.
 */

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'ndo-ds-theme';

/** Same test as the inline script in src/app.html; keep the two in step. */
export function pinnedLight(pathname: string): boolean {
  return /\/app(\/|$)/.test(pathname) || /\/guidelines\/[^/]+/.test(pathname);
}

export const theme = $state({
  /** The site theme, before any pin: what the toggle shows and the boards follow. */
  mode: 'light' as Theme,
  /** True once the reviewer has picked a theme; until then the OS decides. */
  chosen: false,
});

function systemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

let started = false;

/** Read the stored or OS theme and follow OS changes. Call once, from the root layout. */
export function initTheme(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  const stored = storedTheme();
  theme.chosen = stored !== null;
  theme.mode = stored ?? systemTheme();
  if (typeof window.matchMedia === 'function') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!theme.chosen) theme.mode = e.matches ? 'dark' : 'light';
    });
  }
}

export function setTheme(t: Theme): void {
  theme.mode = t;
  theme.chosen = true;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    // Storage blocked: the choice holds for this visit and is not remembered.
  }
}

export function toggleTheme(): void {
  setTheme(theme.mode === 'dark' ? 'light' : 'dark');
}

/** Write the theme the page should show onto <html>. */
export function applyTheme(t: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', t);
}
