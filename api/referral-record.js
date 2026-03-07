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

  const { code, bookingId, referredEmail, referredPhone, referredName } = req.body;
  if (!code || !bookingId) return res.status(400).json({ error: 'Missing required fields' });

  const normalizedCode = code.trim().toUpperCase();
  const normalizedEmail = (referredEmail || '').trim().toLowerCase();
  const normalizedPhone = (referredPhone || '').replace(/\D/g, '');

  const referrer = await redis.get(`ref:code:${normalizedCode}`);
  if (!referrer) return res.status(400).json({ error: 'Invalid code' });

  const usage = {
    code: normalizedCode,
    bookingId,
    referredName,
    referredEmail: normalizedEmail,
    usedAt: new Date().toISOString(),
    status: 'pending',
  };

  if (normalizedEmail) await redis.set(`ref:used:email:${normalizedEmail}`, usage);
  if (normalizedPhone) await redis.set(`ref:used:phone:${normalizedPhone}`, usage);
  await redis.set(`ref:booking:${bookingId}`, {
    code: normalizedCode,
    referredEmail: normalizedEmail,
    referredName,
    status: 'pending',
    usedAt: new Date().toISOString(),
  });

  await redis.set(`ref:code:${normalizedCode}`, {
    ...referrer,
    pendingCount: (referrer.pendingCount || 0) + 1,
  });

  return res.json({ success: true });
}
