// Team moderation: remove proposals or wall entries. Passphrase-only over HTTPS POST,
// never in URLs or read APIs. The passphrase is set as the ADMIN_PASS server env var.
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
async function smembers(u, t, s) {
  let d = await kv(u, t, `/smembers/${encodeURIComponent(s)}`);
  return Array.isArray(d) ? d : [];
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const PASS = process.env.ADMIN_PASS;
  if (!URL_ || !TOK || !PASS) return res.status(503).json({ error: 'not configured' });
  res.setHeader('Cache-Control', 'no-store');
  const { pass, action, id } = req.body || {};
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  try {
    const n = await kv(URL_, TOK, `/incr/rate:a:${ip}:${hour}`);
    if (n > 10) return res.status(429).json({ error: 'too many attempts' });
    if (typeof pass !== 'string' || !same(pass, PASS)) return res.status(403).json({ error: 'wrong passphrase' });
    if (action === 'list') {
      const events = (await smembers(URL_, TOK, 'all:events')).filter((k) => typeof k === 'string' && k.startsWith('event:'));
      const entries = (await smembers(URL_, TOK, 'all:entries')).filter((k) => typeof k === 'string' && k.startsWith('entry:'));
      const keys = [...events, ...entries];
      if (!keys.length) return res.status(200).json({ events: [], entries: [] });
      let vals = await kv(URL_, TOK, `/mget/${keys.map(encodeURIComponent).join('/')}`);
      if (!Array.isArray(vals)) vals = [];
      const out = keys.map((k, i) => {
        try { const v = typeof vals[i] === 'string' ? JSON.parse(vals[i]) : vals[i]; return v ? { id: k, ...v, mk: undefined } : null; } catch { return null; }
      }).filter(Boolean);
      return res.status(200).json({
        events: out.filter((v) => v.id.startsWith('event:')).map(({ id, title, when, area, name, phone, going, maybe, status, ts }) => ({ id, title, when, area, name, phone, going, maybe, status: status || 'proposed', ts })),
        entries: out.filter((v) => v.id.startsWith('entry:')).map(({ id, name, day, month, year, insta, whatsapp, showwa, celebrate, wall, showig, status, ts }) => ({ id, name, day, month, year, insta, whatsapp, showwa, celebrate, wall, showig, status: status || 'approved', ts })),
      });
    }
    if (action === 'delete' && typeof id === 'string' && (id.startsWith('event:') || id.startsWith('entry:'))) {
      await kv(URL_, TOK, `/del/${encodeURIComponent(id)}`);
      await kv(URL_, TOK, `/srem/all:${id.startsWith('event:') ? 'events' : 'entries'}/${encodeURIComponent(id)}`);
      return res.status(200).json({ ok: true });
    }
    if (action === 'approve' && typeof id === 'string' && (id.startsWith('event:') || id.startsWith('entry:'))) {
      const raw = await kv(URL_, TOK, `/get/${encodeURIComponent(id)}`);
      let ev = null;
      try { ev = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch {}
      if (!ev || typeof ev !== 'object') return res.status(404).json({ error: 'not found' });
      ev.status = 'approved';
      await kv(URL_, TOK, `/set/${encodeURIComponent(id)}/${encodeURIComponent(JSON.stringify(ev))}`);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'action' });
  } catch { return res.status(502).json({ error: 'storage' }); }
}
