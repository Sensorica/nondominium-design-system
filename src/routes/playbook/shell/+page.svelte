<svelte:head><title>Shell — Playbook</title></svelte:head>

<h1 class="text-xl font-bold text-gray-900 mb-1">Shell</h1>
<p class="text-sm text-gray-600 mb-6">
  Application layout pattern: sidebar + main content area.
  This is a CSS layout recipe, not a custom element.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">App Shell Preview</h2>
  <div class="shell-preview">
    <aside class="preview-sidebar">
      <div class="preview-sidebar-logo">NDO</div>
      <nav class="preview-nav">
        <a href="#" class="preview-nav-link is-active">Lobby</a>
        <a href="#" class="preview-nav-link">Groups</a>
        <a href="#" class="preview-nav-link">My NDOs</a>
      </nav>
    </aside>
    <main class="preview-main">
      <div class="preview-content">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Lobby</h2>
        <div class="preview-card-row">
          <ndo-card
            name="Solar Array"
            hash="uhC0k1234…"
            badges="lifecycle-active:Active;nature-physical:Physical">
          </ndo-card>
          <ndo-card
            name="Sensor Design"
            hash="uhC0k5678…"
            badges="lifecycle-distributed:Distributed;nature-digital:Digital">
          </ndo-card>
        </div>
      </div>
    </main>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">CSS Recipe</h2>
  <pre class="code-block">{`.app-shell {
  display: flex;
  min-height: 100vh;
  background: rgb(var(--ndo-gray-100));
}

.sidebar {
  width: 13rem;        /* w-52 */
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid rgb(var(--ndo-gray-200));
}

.main {
  flex: 1;
  min-width: 0;
  overflow: auto;
}`}</pre>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading { font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--ndo-gray-500)); margin: 0 0 0.75rem; }

  .shell-preview {
    display: flex;
    height: 20rem;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: 0.5rem;
    overflow: hidden;
    background: rgb(var(--ndo-gray-100));
  }

  .preview-sidebar {
    width: 10rem;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid rgb(var(--ndo-gray-200));
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-sidebar-logo {
    font-size: 0.8125rem;
    font-weight: 700;
    color: rgb(var(--ndo-blue-700));
    letter-spacing: 0.05em;
  }

  .preview-nav { display: flex; flex-direction: column; gap: 0.125rem; }
  .preview-nav-link {
    display: block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
    color: rgb(var(--ndo-gray-700));
    text-decoration: none;
    transition: background-color 150ms ease;
  }
  .preview-nav-link:hover { background: rgb(var(--ndo-gray-100)); }
  .preview-nav-link.is-active { background: rgb(var(--ndo-blue-50)); color: rgb(var(--ndo-blue-700)); font-weight: 500; }

  .preview-main { flex: 1; overflow: auto; padding: 1rem; }
  .preview-content { min-width: 0; }
  .preview-card-row { display: flex; gap: 0.5rem; }

  .code-block { background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); border-radius: 0.5rem; padding: 1rem; font-size: 0.8125rem; font-family: var(--ndo-font-mono); overflow-x: auto; white-space: pre; }
</style>
