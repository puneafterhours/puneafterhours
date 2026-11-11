# Pune AfterHours

Community site for the AfterHours WhatsApp gang and r/PuneTonight: birthday roll + wall,
meetup proposals with individual event pages and RSVPs, and a live event-discovery feed
pulled from multiple public sources (Meetup Pune/Mumbai, District India majors, and the
r/punetonight monthly guides).

## Pages
- `/` home
- `/roll` birthday signup (day + month; year optional; Instagram and WhatsApp optional,
  each with its own explicit show choice, private by default)
- `/wall` birthday wall (opt-in entries only)
- `/events` proposals list + discovered events from public sources
- `/e?id=event:...` event page with RSVP
- `/propose` pitch a meetup (accepts ?title=&link= prefill from idea cards)

## API (serverless, /api)
- `POST /api/signup` - store a birthday (validation, honeypot `website`, per-IP rate limit 5/hr, 5000-entry cap)
- `GET /api/birthdays` - wall entries only (consent-filtered, no internal fields)
- `POST /api/propose` - store a proposal (same abuse controls)
- `GET /api/events` / `GET /api/events?id=` - list (public fields only) / detail
- `POST /api/rsvp` - increment going/maybe counters (rate limited)
- `GET /api/discover` - aggregated event discovery from Meetup Pune/Mumbai, District
  India (filtered to exceptional majors only: stadium/arena/festival scale or billed
  India/world tours and debuts; routine local shows, open mics, workshops and generic
  listings excluded) and r/punetonight guide posts via public RSS/HTML. Per-source status
  reported in the response, deduped by normalized title+date, cached in Redis for 30 min;
  no caching on partial failure, stale-cache fallback when most sources fail.

## Source terms (checked 11 Nov 2026)
- meetup.com robots.txt allows the /find path; ToS 5.4 restricts automated extraction only
  for commercial purposes - this is a non-commercial community page that links out to every
  source event.
- district.in robots.txt allows / (we use no query strings) and its llms.txt explicitly
  welcomes AI agents reading and citing public pages.
- Reddit public .rss feeds.
- Eventbrite was removed as a source: its Terms of Service (sec 13) prohibit scraping site
  content, and robots permission alone does not override that.

## Storage
Upstash Redis (free tier) via the Vercel Marketplace integration. Env vars injected:
KV_REST_API_URL / KV_REST_API_TOKEN (UPSTASH_REDIS_REST_* also supported).

Upstash REST notes learned the hard way:
- Every response is wrapped: `{"result": ...}` - always unwrap.
- Multi-key reads must be path-style: `POST /mget/key1/key2` (body-array form returns nulls).
- Keys are indexed in sets (`all:entries`, `all:events`) via SADD at write time;
  readers use SMEMBERS + MGET instead of SCAN.

## Deploy
1. `vercel deploy --prod --token TOKEN` (token saved in the vault as "Vercel deploy token (pune-afterhours)")
2. Storage is already connected; redeploys keep working.

## Privacy
- Day + month required; birth year optional.
- Wall shows an entry only if the person chose "Yes, put me on it" (default is on the
  wall, with a clear opt-out).
- Birth year, Instagram and WhatsApp each show only if the person typed it AND chose to
  show it; default private; choices are never applied retroactively to stored entries.
- Proposals are labeled proposals; nothing is a confirmed plan until the team locks it.
- Discovered events link back to the exact original source pages; nothing is auto-posted
  anywhere.

## Tests
The test suite (44 tests with a mock Redis, covering validation, honeypots,
rate limits, consent filtering (wall/year/Instagram/WhatsApp choices), RSVP counters,
discovery dedupe and cache/fallback behavior) is maintained privately and kept out of the
public repo.
