import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.json({ found: false });

  const normalizedEmail = email.trim().toLowerCase();
  const code = await redis.get(`ref:customer:email:${normalizedEmail}`);
  if (!code) return res.json({ found: false });

  const referrerData = await redis.get(`ref:code:${code}`);
  return res.json({
    found: true,
    code,
    creditsEarned: referrerData?.creditsEarned || 0,
    totalCompleted: referrerData?.totalCompleted || 0,
  });
}
