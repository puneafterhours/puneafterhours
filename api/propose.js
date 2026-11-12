// Stores a meetup proposal in Vercel KV (or compatible REST Redis).
const RATE_LIMIT = 5;
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
  const { title, when, area, details, name, phone, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true });
  if (!title || typeof title !== 'string' || !title.trim() || title.length > 80) return res.status(400).json({ error: 'title' });
  if (!name || typeof name !== 'string' || !name.trim() || name.length > 40) return res.status(400).json({ error: 'name' });
  if (!phone || typeof phone !== 'string' || !/^[+0-9][0-9\s()-]{7,17}$/.test(phone.trim())) return res.status(400).json({ error: 'phone' });
  if ((when && when.length > 60) || (area && area.length > 80) || (details && details.length > 500)) return res.status(400).json({ error: 'length' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  try {
    const count = await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/incr/rate:p:${ip}:${hour}`);
    if (count > RATE_LIMIT) return res.status(429).json({ error: 'too many proposals, try later' });
  } catch { return res.status(502).json({ error: 'storage' }); }
  const event = {
    title: title.trim().slice(0, 80),
    when: (when || '').trim().slice(0, 60),
    area: (area || '').trim().slice(0, 80),
    details: (details || '').trim().slice(0, 500),
    name: name.trim().slice(0, 40),
    phone: phone.trim().slice(0, 18),
    status: 'pending',
    mk: (globalThis.crypto || require('crypto').webcrypto).randomUUID().replace(/-/g, ''),
    going: 0,
    maybe: 0,
    ts: Date.now(),
  };
  const id = `event:${event.ts}:${Math.random().toString(36).slice(2, 10)}`;
  try {
    await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/set/${encodeURIComponent(id)}/${encodeURIComponent(JSON.stringify(event))}`);
    await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/sadd/all:events/${encodeURIComponent(id)}`);
  } catch { return res.status(502).json({ error: 'storage' }); }
  return res.status(200).json({ ok: true, id, manageKey: event.mk });
}
