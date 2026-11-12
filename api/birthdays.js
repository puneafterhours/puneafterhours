// Returns only entries the person opted into showing on the wall. Never returns stored
// Instagram unless they chose "show"; private entries are never returned.
export default async function handler(req, res) {
  const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return res.status(200).json({ entries: [] });
  const sm = await fetch(`${KV_REST_API_URL}/smembers/all:entries`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  if (!sm.ok) return res.status(502).json({ error: 'read failed' });
  let smData = await sm.json();
  if (smData && typeof smData === 'object' && !Array.isArray(smData) && 'result' in smData) smData = smData.result;
  if (!Array.isArray(smData)) return res.status(502).json({ error: 'read failed' });
  const entryKeys = smData.filter((k) => typeof k === 'string' && k.startsWith('entry:'));
  if (!entryKeys.length) return res.status(200).json({ entries: [] });
  const get = await fetch(`${KV_REST_API_URL}/mget/${entryKeys.map((k) => encodeURIComponent(k)).join('/')}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  if (!get.ok) return res.status(502).json({ error: 'read failed' });
  let values = await get.json();
  if (values && typeof values === 'object' && !Array.isArray(values) && 'result' in values) values = values.result;
  const entries = (values || [])
    .map((v) => { try { return typeof v === 'string' ? JSON.parse(v) : v; } catch { return null; } })
    .filter((e) => e && e.wall && e.status !== 'pending')
    .map((e) => ({ name: e.name, day: e.day, month: e.month, celebrate: e.celebrate, ...((e.showig === 'show' || (e.showig === undefined && e.insta)) && e.insta ? { insta: e.insta } : {}), ...(e.showyear === 'show' && e.year ? { year: e.year } : {}) }));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ entries });
}
