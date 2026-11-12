// Shared UI chrome and DOM helpers for PuneAfterhours.
// Option 1 componentization: plain ES module, no build step. Pages keep a static nav
// in HTML (so navigation works with no JS and never flashes), and call
// mountChrome({active}) as progressive enhancement to mark the current tab and to
// keep the stylesheet cache version in one place.
//
// The one value that used to force a 7-file edit on every style change - the CSS
// cache-busting version - now lives here, in CSS_VERSION.

export const CSS_VERSION = 15;

// ---- DOM helpers (shared so events/wall/event stop each defining their own) ----

// el('span','n','text') -> <span class="n">text</span>. className and text optional.
export function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

// A decorative Material Symbol, always aria-hidden (label beside it names the thing).
export function icon(name) {
  const s = el('span', 'msym', name);
  s.setAttribute('aria-hidden', 'true');
  return s;
}

// A status placeholder: kind is 'loading' | 'empty' | 'error' | 'notfound'.
// Returns the inner HTML string so callers can drop it into a .rows container,
// matching the markup the pages already used.
const STATE_ICON = { loading: 'progress_activity', empty: 'inbox', error: 'error', notfound: 'search_off' };
export function stateHTML(kind, message) {
  const cls = kind === 'loading' ? 'empty loading' : 'empty';
  const sym = STATE_ICON[kind] || 'inbox';
  // message is plain text; escape the few HTML-significant chars.
  const safe = String(message == null ? '' : message)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<div class="${cls}"><span class="msym" aria-hidden="true">${sym}</span>${safe}</div>`;
}

// ---- Chrome (progressive enhancement over the static nav) ----

// Keeps the stylesheet cache version in sync with CSS_VERSION and marks the current
// nav tab. `active` is a tab href-key: '', 'roll', 'wall', 'events', 'propose', or the
// home '/' tab (pass 'home'). The nav itself is static HTML already on the page.
export function mountChrome({ active } = {}) {
  syncStylesheet();
  markActiveTab(active);
}

function syncStylesheet() {
  const link = [...document.querySelectorAll('link[rel="stylesheet"]')]
    .find((l) => (l.getAttribute('href') || '').startsWith('/style.css'));
  if (link) link.setAttribute('href', `/style.css?v=${CSS_VERSION}`);
}

// Map of active key -> the tab's href, so we can find the right <a> in the static nav.
const HREF_BY_KEY = { home: '/', roll: '/roll', wall: '/wall', events: '/events', propose: '/propose', gossip: '/gossip' };
function markActiveTab(active) {
  const href = HREF_BY_KEY[active];
  if (!href) return;
  document.querySelectorAll('.tabs a').forEach((a) => {
    a.classList.toggle('on', a.getAttribute('href') === href);
  });
}
