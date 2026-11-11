// Host controls for a proposal: lock (confirm), unlock, cancel or delete.
// Requires the private manage key returned once to the proposer. Never exposed by any read API.
import { timingSafeEqual } from 'node:crypto';
async function kv(url, token, path) {
  const r = await fetch(`${url}${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error('kv ' + r.status);
  const d = await r.json();
  return d && typeof d === 'object' && 'result' in d ? d.result : d;
}
function same(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!URL_ || !TOK) return res.status(503).json({ error: 'storage not configured' });
  const { id, key, action } = req.body || {};
  if (typeof id !== 'string' || !id.startsWith('event:') || typeof key !== 'string' || !key) return res.status(400).json({ error: 'bad request' });
  if (!['lock', 'unlock', 'cancel', 'delete'].includes(action)) return res.status(400).json({ error: 'action' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  try {
    const n = await kv(URL_, TOK, `/incr/rate:m:${ip}:${hour}`);
    if (n > 30) return res.status(429).json({ error: 'too many attempts' });
    const raw = await kv(URL_, TOK, `/get/${encodeURIComponent(id)}`);
    if (!raw) return res.status(404).json({ error: 'not found' });
    const ev = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!ev.mk || !same(ev.mk, key)) return res.status(403).json({ error: 'wrong key' });
    if (action === 'delete') {
      await kv(URL_, TOK, `/del/${encodeURIComponent(id)}`);
      await kv(URL_, TOK, `/srem/all:events/${encodeURIComponent(id)}`);
      return res.status(200).json({ ok: true, status: 'deleted' });
    }
    ev.status = action === 'lock' ? 'locked' : action === 'cancel' ? 'cancelled' : 'proposed';
    await kv(URL_, TOK, `/set/${encodeURIComponent(id)}/${encodeURIComponent(JSON.stringify(ev))}`);
    return res.status(200).json({ ok: true, status: ev.status });
  } catch { return res.status(502).json({ error: 'storage' }); }
}
