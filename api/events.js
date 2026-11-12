// Lists proposals (public, non-sensitive fields) or returns one by ?id=.
export default async function handler(req, res) {
  const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return res.status(200).json({ events: [] });
  const sm = await fetch(`${KV_REST_API_URL}/smembers/all:events`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  if (!sm.ok) return res.status(502).json({ error: 'read failed' });
  let smData = await sm.json();
  if (smData && typeof smData === 'object' && !Array.isArray(smData) && 'result' in smData) smData = smData.result;
  if (!Array.isArray(smData)) return res.status(502).json({ error: 'read failed' });
  const entryKeys = smData.filter((k) => typeof k === 'string' && k.startsWith('event:'));
  if (!entryKeys.length) return res.status(200).json({ events: [] });
  const get = await fetch(`${KV_REST_API_URL}/mget/${entryKeys.map((k) => encodeURIComponent(k)).join('/')}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  if (!get.ok) return res.status(502).json({ error: 'read failed' });
  let values = await get.json();
  if (values && typeof values === 'object' && !Array.isArray(values) && 'result' in values) values = values.result;
  const all = entryKeys.map((k, i) => {
    try { const e = typeof values[i] === 'string' ? JSON.parse(values[i]) : values[i]; return e ? { id: k, ...e } : null; } catch { return null; }
  }).filter(Boolean).sort((a, b) => b.ts - a.ts);
  res.setHeader('Cache-Control', 'no-store');
  const want = (req.query && req.query.id) || '';
  if (want) {
    const event = all.find((e) => e.id === want) || null;
    if (!event) return res.status(404).json({ error: 'not found' });
    const { id, title, when, area, details, name, going, maybe } = event;
    return res.status(200).json({ event: { id, title, when, area, details, name, going, maybe, status: event.status || 'proposed' } });
  }
  return res.status(200).json({ events: all.filter((x) => x.status !== 'cancelled' && x.status !== 'pending').map(({ id, title, when, area, going, maybe, status }) => ({ id, title, when, area, going, maybe, status: status || 'proposed' })) });
}
