# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, equal weight. Members of the AfterHours WhatsApp group, and readers of r/PuneTonight. They use the same site for the group's own rituals and for public discovery of what's on. The PuneAfters Team hosts and moderates.

## Product Purpose

A shared home for the AfterHours gang and r/PuneTonight: a birthday roll and wall, meetup proposals with RSVPs, and a live feed of real public events. Success means either audience can do those jobs from one link, without the site inventing plans or exposing details someone chose to keep private.

## Positioning

One community page that holds the crew's own rituals and a sourced "what's on" feed together. A city listings site does not keep this group's birthday roll or unofficial proposals. The group chat does not aggregate Meetup, District, and r/punetonight guides into one sourced list. Run by the PuneAfters Team, shared with the AfterHours group and r/PuneTonight.

## Operating Context

People arrive from a link shared in the AfterHours WhatsApp group or on r/PuneTonight. The wall and plans are visible to anyone with the link. Hosts lock, unlock, cancel, or delete a proposal from a private manage link. The team removes entries from a passphrase-gated admin page that is not indexed. Storage is Upstash Redis, injected on Vercel as `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Upstash REST aliases also work).

## Capabilities and Constraints

Pages, all kept:

- `/` home
- `/roll` birthday signup
- `/wall` birthday wall
- `/events` crew proposals plus discovered events
- `/e?id=` one proposal, with RSVP and host controls
- `/propose` pitch a meetup; accepts `?title=&when=&area=&link=` prefill from idea cards
- `/admin` team moderation, `noindex`

Birthday signup requires a first and last name and at least one contact (Instagram or WhatsApp). Day and month are required. Birth year is optional. Celebration choices: Cake spam, Plan a night out, Just a shoutout, Skip the fuss. The wall lists an entry only when the person chose "Yes, put me on it" (that choice defaults on, with a visible opt-out). Birth year, Instagram, and WhatsApp appear on the wall only when that person typed them and chose to show them. Those defaults are private. Choices are never applied retroactively. The team can be asked to take an entry down.

A meetup proposal shows title, rough when, area, optional details, and the proposer's name. It is labeled a proposal until the host locks it. When the host locks it they may set an optional confirmed date and time (date-only or date plus time); that confirmed time, not the rough freeform "when", is what the plan's "Add to calendar" links use, and it is cleared if the plan is unlocked or cancelled. A locked plan offers Add-to-calendar links (Google Calendar and a downloadable .ics) built only from public fields. RSVP is going or maybe, one per name, and identity is not verified. Phone numbers and street addresses stay out of proposals.

Discovered events come from Meetup (Pune and Mumbai), District India (exceptional majors only), and r/punetonight guide posts. Every card links to its original source. The "What's on" list offers client-side filters (Free only, This weekend, Nightlife) that narrow the already-fetched results; they add no new sources and invent nothing. Failed sources say they are unavailable. Nothing is invented, and nothing is auto-posted. "This weekend" is source-backed Pune plans for the coming Friday–Sunday, including multi-day events that span into that weekend. Mumbai is "worth the drive." India-wide is major tours and one-off big nights, with organisers' superlatives left as the organisers' own claims.

Abuse controls already in the API stay: honeypot field `website`, per-IP rate limits, entry caps, and public responses that never project internal fields (`mk`, `who`, `wall`, `showig`, `showyear`, `showwa`, or other hidden fields).

This round is a visual rework. It is not a rename and not a new product. Routes, forms, RSVP, discovery sources, and admin behavior stay.

Undecided, and not to be invented: member counts, testimonials, press, photography, and any claim that a proposal is a confirmed plan before the host locks it.

## Brand Commitments

The name is PuneAfterhours. Credit the PuneAfters Team. Keep the casual, direct voice already in the copy: short sentences, the group called the AfterHours gang or the crew, plans called proposals until they are locked. The current visual theme is not a commitment. This round may replace it.

## Evidence on Hand

Live copy and behavior are in `public/` and `api/`. Source-use notes (checked 11 Nov 2026) are in `README.md`: Meetup and District are used as a non-commercial community page that links out; Reddit via public RSS; Eventbrite is excluded because its terms prohibit scraping.

No photography, logos, testimonials, press, or usage numbers are in the repo. Future work must not fabricate them, and must not fabricate events.

## Product Principles

- The AfterHours group and r/PuneTonight are both first-class. Crew rituals and public discovery carry equal weight.
- Consent over convenience. Private fields stay private unless that person chose to show them.
- A proposal is a pitch until the host locks it. The site never pretends otherwise.
- Every public event links to a real source. A failed source is said to be unavailable, never filled in.
- The name, the team credit, and the casual voice stay. The look may change.
