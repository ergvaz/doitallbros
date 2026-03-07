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

  const { code, email, phone } = req.body;
  if (!code) return res.json({ valid: false, error: 'No code provided' });

  const normalizedCode = code.trim().toUpperCase();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPhone = (phone || '').replace(/\D/g, '');

  const referrer = await redis.get(`ref:code:${normalizedCode}`);
  if (!referrer) return res.json({ valid: false, error: 'Invalid referral code' });

  if (referrer.referrerEmail.toLowerCase() === normalizedEmail) {
    return res.json({ valid: false, error: 'You cannot use your own referral code' });
  }

  if (normalizedPhone && referrer.referrerPhone.replace(/\D/g, '') === normalizedPhone) {
    return res.json({ valid: false, error: 'You cannot use your own referral code' });
  }

  if (normalizedEmail) {
    const emailUsed = await redis.get(`ref:used:email:${normalizedEmail}`);
    if (emailUsed) return res.json({ valid: false, error: 'This email has already used a referral code' });
  }

  if (normalizedPhone) {
    const phoneUsed = await redis.get(`ref:used:phone:${normalizedPhone}`);
    if (phoneUsed) return res.json({ valid: false, error: 'This phone number has already used a referral code' });
  }

  if ((referrer.pendingCount || 0) >= 5) {
    return res.json({ valid: false, error: 'This referral code has reached its limit' });
  }

  return res.json({ valid: true, discount: 10, referrerName: referrer.referrerName });
}
