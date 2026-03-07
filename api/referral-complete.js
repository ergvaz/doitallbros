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

  const { bookingId } = req.body;
  if (!bookingId) return res.status(400).json({ error: 'Missing bookingId' });

  const bookingRef = await redis.get(`ref:booking:${bookingId}`);
  if (!bookingRef) return res.status(404).json({ error: 'No referral found for this booking' });
  if (bookingRef.status === 'completed') return res.status(400).json({ error: 'Already completed' });

  const { code, referredEmail, referredName } = bookingRef;
  const referrer = await redis.get(`ref:code:${code}`);
  if (!referrer) return res.status(404).json({ error: 'Referrer not found' });

  const newCredits = (referrer.creditsEarned || 0) + 1;
  const newPending = Math.max(0, (referrer.pendingCount || 1) - 1);

  await redis.set(`ref:booking:${bookingId}`, {
    ...bookingRef,
    status: 'completed',
    completedAt: new Date().toISOString(),
  });

  await redis.set(`ref:code:${code}`, {
    ...referrer,
    creditsEarned: newCredits,
    pendingCount: newPending,
  });

  // Notify referrer via n8n
  const n8nWebhook = process.env.N8N_REFERRAL_COMPLETE_WEBHOOK_URL;
  if (n8nWebhook) {
    await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrerName: referrer.referrerName,
        referrerEmail: referrer.referrerEmail,
        referredName,
        creditsEarned: newCredits,
        discountPercent: 20,
      }),
    });
  }

  return res.json({ success: true, creditsEarned: newCredits });
}
