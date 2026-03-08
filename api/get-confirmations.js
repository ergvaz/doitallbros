import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const keys = await redis.keys('confirmation:*');
    if (!keys.length) return res.status(200).json([]);

    const confirmations = await Promise.all(keys.map(k => redis.get(k)));
    const valid = confirmations.filter(Boolean);

    if (req.method === 'DELETE') {
      await Promise.all(keys.map(k => redis.del(k)));
    }

    res.status(200).json(valid);
  } catch (err) {
    console.error('get-confirmations error:', err);
    res.status(500).json([]);
  }
}
