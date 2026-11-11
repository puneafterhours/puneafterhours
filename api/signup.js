// Stores a birthday signup in Vercel KV. Expects env KV_REST_API_URL and KV_REST_API_TOKEN.
// Abuse controls: per-IP rate limit, field whitelists, length caps, no user data echoed back.
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const VIBES = ['Cake spam','Plan a night out','Just a shoutout','Skip the fuss'];
const RATE_LIMIT = 5; // signups per IP per hour
const MAX_ENTRIES = 5000;

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return res.status(503).json({ error: 'storage not configured' });

  const { name, day, month, year, insta, whatsapp, celebrate, wall, ig, showyear, showwa, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // honeypot: pretend success, store nothing
  const d = parseInt(day, 10);
  if (!name || typeof name !== 'string' || !name.trim() || name.length > 60) return res.status(400).json({ error: 'name' });
  if (!/^\S+\s+\S+/.test(name.trim())) return res.status(400).json({ error: 'proper name (first and last) required' });
  const dim = { January:31, February:29, March:31, April:30, May:31, June:30, July:31, August:31, September:30, October:31, November:30, December:31 };
  if (!Number.isInteger(d) || d < 1 || !MONTHS.includes(month) || d > dim[month]) return res.status(400).json({ error: 'birthday' });
  if (insta && (typeof insta !== 'string' || insta.length > 40)) return res.status(400).json({ error: 'insta' });
  let wa = '';
  if (whatsapp && String(whatsapp).trim()) {
    wa = String(whatsapp).replace(/[\s()-]/g, '');
    if (!/^\+?[0-9]{10,15}$/.test(wa)) return res.status(400).json({ error: 'whatsapp' });
  }
  if (!String(insta || '').trim() && !wa) return res.status(400).json({ error: 'instagram or whatsapp required' });
  let y = null;
  if (year !== undefined && year !== null && String(year).trim() !== '') {
    y = parseInt(year, 10);
    const nowYear = new Date().getFullYear();
    if (!Number.isInteger(y) || y < 1920 || y > nowYear) return res.status(400).json({ error: 'year' });
  }
  if (wall !== 'wall' && wall !== 'private') return res.status(400).json({ error: 'wall choice required' });
  if (ig !== 'show' && ig !== 'hide') { if (insta && String(insta).trim()) return res.status(400).json({ error: 'instagram choice required' }); else ig = 'hide'; }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  try {
    const count = await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/incr/rate:${ip}:${hour}`);
    if (count > RATE_LIMIT) return res.status(429).json({ error: 'too many signups, try later' });
    const total = await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/incr/count:entries`);
    if (total > MAX_ENTRIES) {
      await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/decr/count:entries`);
      return res.status(503).json({ error: 'full' });
    }
  } catch { return res.status(502).json({ error: 'storage' }); }

  const entry = {
    name: name.trim().slice(0, 60),
    day: d,
    month,
    year: y, // public only when showyear==='show'
    showyear: showyear === 'show' && y ? 'show' : 'hide',
    whatsapp: wa,
    showwa: showwa === 'show' && wa ? 'show' : 'hide',
    insta: ig === 'show' && insta ? insta.trim().slice(0, 40) : '',
    celebrate: VIBES.includes(celebrate) ? celebrate : '',
    wall: wall === 'wall',
    ts: Date.now(),
  };
  const id = `entry:${entry.ts}:${Math.random().toString(36).slice(2, 10)}`;
  try {
    await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/set/${encodeURIComponent(id)}/${encodeURIComponent(JSON.stringify(entry))}`);
    await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/sadd/all:entries/${encodeURIComponent(id)}`);
  } catch { return res.status(502).json({ error: 'storage' }); }
  return res.status(200).json({ ok: true });
}
