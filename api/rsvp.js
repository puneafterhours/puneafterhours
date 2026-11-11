// Counts RSVPs per participant name. Name-keyed, not identity-verified: someone
// using a different spelling counts as a new person. One RSVP per name - changeable, cancellable.
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
  const { id, name, status, website, cancel } = req.body || {};
  if (website) return res.status(200).json({ ok: true });
  if (!id || typeof id !== 'string' || !id.startsWith('event:')) return res.status(400).json({ error: 'id' });
  if (!name || typeof name !== 'string' || !name.trim() || name.length > 40) return res.status(400).json({ error: 'name' });
  if (!cancel && status !== 'going' && status !== 'maybe') return res.status(400).json({ error: 'status' });
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 60);
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  try {
    const count = await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/incr/rate:r:${ip}:${hour}`);
    if (count > 20) return res.status(429).json({ error: 'too many RSVPs, try later' });
    const raw = await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/get/${encodeURIComponent(id)}`);
    if (!raw) return res.status(404).json({ error: 'not found' });
    const event = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (event.status === 'cancelled') return res.status(409).json({ error: 'cancelled' });
    event.who = event.who && typeof event.who === 'object' ? event.who : {};
    const prev = event.who[key];
    const rt = typeof req.body.rt === 'string' ? req.body.rt : '';
    if (prev && prev.tok && prev.tok !== rt) {
      return res.status(409).json({ error: 'name taken', message: 'That name already RSVPed from another browser. Pick a different name or use the device you RSVPed from.' });
    }
    if (cancel) delete event.who[key];
    else event.who[key] = { n: name.trim().slice(0, 40), s: status, tok: prev ? prev.tok : (globalThis.crypto || require('crypto').webcrypto).randomUUID().replace(/-/g, '') };
    const tok = prev ? undefined : (event.who[key] && event.who[key].tok);
    const people = Object.values(event.who);
    event.going = people.filter((p) => p.s === 'going').length;
    event.maybe = people.filter((p) => p.s === 'maybe').length;
    await kv(KV_REST_API_URL, KV_REST_API_TOKEN, `/set/${encodeURIComponent(id)}/${encodeURIComponent(JSON.stringify(event))}`);
    return res.status(200).json({ ok: true, going: event.going, maybe: event.maybe, previous: prev ? prev.s : null, rt: tok });
  } catch (e) {
    if (e.message === 'kv 404') return res.status(404).json({ error: 'not found' });
    return res.status(502).json({ error: 'storage' });
  }
}
