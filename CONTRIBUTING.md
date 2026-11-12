# Contributing to PuneAfterhours

Small community site: birthdays wall, meetup proposals with RSVP, and a live "what's on" fetcher.

## Stack
- Plain HTML/CSS/JS pages in `public/` (no framework, no build step)
- Shared UI lives in `public/components/ui.js`, a plain ES module (still no build step). Each page keeps its nav as static HTML (so it works with no JS and never flashes) and imports `mountChrome({ active })` as progressive enhancement to mark the current tab and sync the stylesheet version. The helpers `el`, `icon`, and `stateHTML` are exported there for reuse.
- Bump the cache-busting stylesheet version in ONE place: `CSS_VERSION` in `public/components/ui.js`. Keep each page's inline `<link ... style.css?v=N>` in step with it (the module overrides it at runtime, but the inline value avoids an unstyled flash).
- Serverless API routes in `api/` (Node, Vercel functions)
- Upstash Redis (REST) for storage - keys: `entry:*`, `event:*`, sets `all:entries`, `all:events`, `discover:cache4`
- `test-api.mjs` runs the API tests against a mocked store: `node test-api.mjs`

## Ground rules
- Privacy first: birth year and WhatsApp number are never public unless the person explicitly chose to show them. Public API responses must never project `mk`, `who`, `wall`, `showig`, `showyear`, `showwa` or hidden fields.
- Consent over convenience: don't preselect anything that publishes data, except the wall default the owner asked for (with visible opt-out).
- No invented events in the fetcher: everything shown links to a real source, and blocked sources say "unavailable" rather than fake data.
- Run `node test-api.mjs` before sending changes; all tests must pass.
- Never commit `.env`, tokens or the vault. Storage credentials live in Vercel env vars only.

## Deploy
`npx vercel deploy --prod` from the project root (needs a Vercel token for the team account).
