// Multi-source Pune plan fetcher. Sources: Meetup, District (pan-India majors),
// and the r/punetonight monthly guides. Public pages allowed by each site's robots.txt
// for these paths; Meetup ToS (5.4) restricts only commercial-purpose scraping and this
// is a non-commercial community page linking out to sources; District's llms.txt
// explicitly welcomes AI agents reading/citing public pages. Eventbrite removed: its
// Terms of Service (sec 13) prohibit scraping site content. Fetched server-side, no
// login, no paid API. Cached 30 min.
// Honest status per source is returned so the page can say what pulled and what didn't.
const CACHE_KEY = 'discover:cache11';
const TTL_MS = 30 * 60 * 1000;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

async function kv(url, token, path, body) {
  const r = await fetch(`${url}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  const d = await r.json();
  return d && typeof d === 'object' && 'result' in d ? d.result : d;
}
async function get(url, timeoutMs = 8000) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(timeoutMs), redirect: 'follow' });
  if (!r.ok) throw new Error('http ' + r.status);
  return r.text();
}
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const clip = (s, n) => (s || '')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[*_#>`\\]+/g, '')
  .replace(/\s+/g, ' ').trim().slice(0, n);
const isoFrom = (dt) => { const d = new Date(dt); return Number.isNaN(+d) ? null : d.toISOString().slice(0, 10); };

// User filter: discovery is for plans worth going out for - outings, gigs, comedy,
// festivals, nightlife, one-off specials. Routine recurring sessions (tech/dev meetups,
// networking mixers, study groups, weekly community circles) are dropped regardless of
// platform, and self-inflated 'first ever'/'biggest' promo claims are dropped from the
// routine sources. A special-event keyword wins over a routine one (e.g. a tech
// community's trek stays). District keeps its own majors filter and is untouched.
const ROUTINE_RE = /\b(tech|developers?|dev\s?ops|coding|programming|javascript|python|reactjs?|node\.?js|aws|kubernetes|docker|machine learning|data science|artificial intelligence|\bai\b|blockchain|web3|crypto|startup|founders?|saas|pitch(ing| deck)?|networking|business (meet|mixer)|\bbni\b|study (group|session)|book club|toastmasters?|language exchange|co-?working|weekly|every (week|monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i;
const HYPE_RE = /\b(first[- ]ever|biggest|india'?s (largest|first)|world'?s (biggest|first))\b/i;
const SPECIAL_RE = /\b(gig|live music|concert|comedy|stand[- ]?up|festival|\bfest\b|party|parties|\bdj\b|rave|club night|ladies night|bollywood night|techno|karaoke|trek(king)?|hike|hiking|stargazing|camp(ing|fire)?|sundowner|pub crawl|food (walk|tour|crawl)|night ?out|nightlife|boat(ing)?|kayak(ing)?)\b/i;
const PARTY_RE = /\b(party|parties|\bdj\b|rave|club|nightlife|bollywood|techno|trance|psytrance|ladies night|sundowner|pub crawl|live music|gig|concert|band|orchestra|dance)\b/i;
const partyScore = (e) => (PARTY_RE.test(`${e.title} ${e.desc || ''} ${e.place || ''}`) ? 1 : 0);
const isRoutineSession = (text) => (ROUTINE_RE.test(text) || HYPE_RE.test(text)) && !SPECIAL_RE.test(text);
const fmtDate = (iso) => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return `${d} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][+m - 1]} ${y}`; };

async function fromMeetup(citySlug, cityLabel, cap) {
  const html = await get(`https://www.meetup.com/find/?location=in--${citySlug}&source=EVENTS`);
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no data block');
  const ap = JSON.parse(m[1]).props.pageProps.__APOLLO_STATE__;
  const groups = {};
  for (const v of Object.values(ap)) if (v && v.__typename === 'Group') groups[v.id] = v.name;
  const out = [];
  for (const v of Object.values(ap)) {
    if (!v || v.__typename !== 'Event' || !v.title || !v.dateTime) continue;
    const iso = isoFrom(v.dateTime);
    if (!iso) continue;
    // Local discovery only: skip online/virtual events - they are not Pune/Mumbai plans.
    const vname = (v.venue && v.venue.name) || '';
    if (String(v.eventType || '').toLowerCase() === 'online' || /^\s*(online|virtual)\b/i.test(vname)) continue;
    const gname = groups[(v.group && v.group.__ref || '').split(':')[1]] || '';
    if (isRoutineSession(`${v.title} ${gname} ${v.description || ''}`)) continue;
    out.push({
      title: clip(v.title, 120), date: iso, dateText: fmtDate(iso),
      desc: clip(v.description, 200),
      place: clip(vname, 90),
      price: v.feeSettings && v.feeSettings.amount != null ? `₹${v.feeSettings.amount}` : '',
      links: v.eventUrl ? [{ url: v.eventUrl, label: 'Meetup' }] : [],
      source: 'Meetup', city: cityLabel,
      group: gname,
    });
  }
  return out.slice(0, cap);
}

async function fromDistrict(cap) {
  const html = await get('https://www.district.in/events/');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const out = [];
  for (const b of blocks) {
    let d; try { d = JSON.parse(b[1]); } catch { continue; }
    if (d['@type'] !== 'ItemList') continue;
    for (const it of d.itemListElement || []) {
      const e = it.item || it;
      const iso = isoFrom(e.startDate);
      if (!e.name || !iso || !e.url) continue;
      const parts = e.name.split('|').map((s) => s.trim());
      const KNOWN = ['Delhi','Mumbai','Pune','Bengaluru','Bangalore','Gurgaon','Gurugram','Noida','Hyderabad','Chennai','Kolkata','Jaipur','Goa','Ahmedabad','Kochi','Chandigarh','Lucknow','Indore','Nagpur'];
      const locName = typeof e.location === 'object' && e.location ? e.location.name : '';
      const city = [...parts, locName].map((p) => KNOWN.find((k) => p && p.toLowerCase().includes(k.toLowerCase()))).find(Boolean) || '';
      // Pan-India section is for exceptional majors only: stadium/arena/festival scale or
      // billed India/world tours and debuts. Routine local shows (generic 'live'/'concert')
      // are excluded.
      if (!/(stadium|arena|festival|\bfest\b|world tour|india tour|first time in india|india debut|\bdebut\b)/i.test(e.name) || /lineup|open mic|workshop/i.test(e.name)) continue;
      out.push({ title: clip(parts.filter((p) => !KNOWN.some((k) => p.toLowerCase() === k.toLowerCase())).join(' | '), 120), date: iso, dateText: fmtDate(iso), desc: '', place: clip(locName, 90), price: '', links: [{ url: e.url, label: 'District' }], source: 'District', city: clip(city, 40) || 'India' });
    }
  }
  return out.slice(0, cap);
}

// District genre-city pages: direct platform listings per city (nightlife, music,
// fests, performances, food & drinks). District's llms.txt explicitly welcomes AI
// agents reading/citing public pages. Party-first: the nightlife page is kept whole
// (minus open mics/workshops); other genres pass the routine-session filter.
async function fromDistrictCity(citySlug, cityLabel, cap) {
  const GENRES = ['nightlife', 'music', 'fests-fairs', 'performances', 'food-drinks'];
  const out = [];
  for (const g of GENRES) {
    try {
      const html = await get(`https://www.district.in/events/${g}-in-${citySlug}-book-tickets`);
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      for (const b of blocks) {
        let d; try { d = JSON.parse(b[1]); } catch { continue; }
        if (d['@type'] !== 'ItemList') continue;
        for (const it of d.itemListElement || []) {
          const e = it.item || it;
          const iso = isoFrom(e.startDate);
          if (!e.name || !iso || !e.url) continue;
          if (e.eventStatus && !/Scheduled/i.test(e.eventStatus)) continue;
          if (e.eventAttendanceMode && /Online/i.test(e.eventAttendanceMode)) continue;
          if (g !== 'nightlife' && isRoutineSession(e.name)) continue;
          if (/open mic|workshop|audition|meetup|mixer/i.test(e.name)) continue;
          const locName = typeof e.location === 'object' && e.location ? e.location.name : '';
          const price = e.offers && e.offers.price ? `From \u20b9${e.offers.price}` : '';
          out.push({
            title: clip(e.name, 120), date: iso, dateText: fmtDate(iso), desc: '',
            place: clip(locName, 90), price,
            links: [{ url: e.url, label: 'District' }], source: 'District', city: cityLabel,
          });
        }
      }
    } catch { /* one genre page failing should not sink the rest */ }
  }
  return out.slice(0, cap);
}

async function fromReddit() {
  const xml = await get('https://www.reddit.com/r/punetonight/.rss?limit=30');
  const entries = xml.split('<entry>').slice(1);
  const strip = (h) => decode(h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  const guides = [];
  const events = [];
  for (const e of entries) {
    const title = decode(((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim());
    const url = ((e.match(/<link\s+href="([^"]+)"/) || [])[1] || '').trim();
    const g = title.match(/pune in (january|february|march|april|may|june|july|august|september|october|november|december) (20\d\d)/i);
    if (!g || !url) continue;
    const gm = MONTHS.indexOf(g[1].slice(0, 3).toUpperCase());
    const gy = Number(g[2]);
    guides.push({ title: clip(title, 200), url, month: gm, year: gy });
    const content = decode(((e.match(/<content[^>]*>([\s\S]*?)<\/content>/) || [])[1] || ''));
    for (const blk of content.split(/<p>\s*<strong>/).slice(1)) {
      const m = blk.match(/^([^<]+)<\/strong>\s*<br\/?>\s*<strong>([^<]+)<\/strong>([\s\S]*?)<\/p>/);
      if (!m) continue;
      const dateLine = m[1].trim();
      const mon = (dateLine.toUpperCase().match(/\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/) || [])[1];
      const day = (dateLine.match(/\b(\d{1,2})\b/) || [])[1];
      if (!mon || !day) continue;
      const mi = MONTHS.indexOf(mon);
      const year = mi < gm - 1 ? gy + 1 : gy;
      const rest = m[3];
      const lines = rest.split(/<br\/?>/).map(strip).filter(Boolean);
      const info = lines.filter((l) => l.startsWith('➜')).map((l) => l.replace(/^➜\s*/, ''));
      const links = [...rest.matchAll(/<a href="([^"]+)">([^<]*)<\/a>/g)].map((x) => ({ url: x[1], label: strip(x[2]) })).filter((l) => /^https?:\/\//.test(l.url)).slice(0, 3);
      if (isRoutineSession(m[2] + ' ' + rest)) continue;
      events.push({
        title: strip(m[2]).slice(0, 120), date: `${year}-${String(mi + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        dateText: dateLine, desc: clip(lines.filter((l) => !l.startsWith('➜') && !/^Tickets:/i.test(l)).join(' '), 200),
        place: clip(info[0] || '', 90), price: clip(info[1] || '', 90), links, source: 'Reddit guide',
        city: /mumbai/i.test(info.join(' ') + ' ' + m[2]) ? 'Mumbai' : 'Pune',
      });
    }
  }
  return { guides, events };
}

function dedupe(events) {
  const seen = new Map();
  for (const e of events) {
    const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24) + '|' + e.date;
    if (seen.has(key)) seen.get(key).sources.push({ source: e.source, link: (e.links[0] || {}).url });
    else seen.set(key, { ...e, sources: [{ source: e.source, link: (e.links[0] || {}).url }] });
  }
  return [...seen.values()];
}

export default async function handler(req, res) {
  const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  res.setHeader('Cache-Control', 'no-store');
  if (KV_URL && KV_TOKEN) {
    try {
      const cached = await kv(KV_URL, KV_TOKEN, `/get/${CACHE_KEY}`);
      if (cached) {
        const c = typeof cached === 'string' ? JSON.parse(cached) : cached;
        if (Date.now() - c.fetchedAt < TTL_MS) return res.status(200).json({ ...c, source: 'cache' });
      }
    } catch { /* fall through */ }
  }
  const status = {};
  const stale = (async () => { if (!KV_URL || !KV_TOKEN) return null; try { const x = await kv(KV_URL, KV_TOKEN, `/get/${CACHE_KEY}`); const c = typeof x === 'string' ? JSON.parse(x) : x; return c && c.fetchedAt ? c : null; } catch { return null; } })();
  const [districtPune, districtMumbai, meetupPune, meetupMumbai, district, reddit] = await Promise.all([
    fromDistrictCity('pune', 'Pune', 30).then((v) => (status['District (Pune)'] = v.length, v)).catch((e) => (status['District (Pune)'] = 'unavailable', [])),
    fromDistrictCity('mumbai', 'Mumbai', 8).then((v) => (status['District (Mumbai)'] = v.length, v)).catch((e) => (status['District (Mumbai)'] = 'unavailable', [])),
    fromMeetup('pune', 'Pune', 25).then((v) => (status['Meetup (Pune)'] = v.length, v)).catch((e) => (status['Meetup (Pune)'] = 'unavailable', [])),
    fromMeetup('mumbai', 'Mumbai', 6).then((v) => (status['Meetup (Mumbai)'] = v.length, v)).catch((e) => (status['Meetup (Mumbai)'] = 'unavailable', [])),
    fromDistrict(12).then((v) => (status['District (India)'] = v.length, v)).catch((e) => (status['District (India)'] = 'unavailable', [])),
    fromReddit().then((v) => (status['Reddit guides'] = v.events.length, v)).catch((e) => (status['Reddit guides'] = 'unavailable', { guides: [], events: [] })),
  ]);
  // Drop past-dated events: this is a what's-on feed, not an archive. Guides stay as-is.
  const todayIst = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  const upcoming = (arr) => arr.filter((e) => !e.date || e.date >= todayIst);
  // Drop restricted events (students/members/invite-only): this is an open community board.
  const openToAll = (arr) => arr.filter((e) => !/(students|members|alumni|employees)\s+only|invite[-\s]only|closed event|private event/i.test(`${e.title} ${e.desc || ''}`));
  // User taste: crazy party and vibe first. Direct-platform sources come before the
  // Reddit roundup so overlapping cards carry the direct source, not the Reddit badge.
  const vibe = (a, b) => (partyScore(b) - partyScore(a)) || a.date.localeCompare(b.date);
  const pune = openToAll(upcoming(dedupe([...districtPune, ...meetupPune, ...reddit.events.filter((e) => e.city === 'Pune')])).sort(vibe));
  const mumbai = openToAll(upcoming(dedupe([...districtMumbai, ...meetupMumbai, ...reddit.events.filter((e) => e.city === 'Mumbai'), ...district.filter((e) => e.city === 'Mumbai')])).sort(vibe));
  const india = openToAll(upcoming(dedupe(district.filter((e) => e.city !== 'Mumbai' && e.city !== 'Pune'))).sort((a, b) => a.date.localeCompare(b.date)));
  const failed = Object.values(status).filter((v) => v === 'unavailable').length;
  if (failed > 2) {
    const c = await stale;
    if (c) return res.status(200).json({ ...c, source: 'stale-cache' });
  }
  const result = { pune, mumbai, india, guides: reddit.guides, status, fetchedAt: Date.now() };
  if (KV_URL && KV_TOKEN && !failed && (pune.length || india.length)) {
    try { await kv(KV_URL, KV_TOKEN, `/set/${CACHE_KEY}/${encodeURIComponent(JSON.stringify(result))}`); } catch { /* best effort */ }
  }
  return res.status(200).json({ ...result, source: 'live' });
}
