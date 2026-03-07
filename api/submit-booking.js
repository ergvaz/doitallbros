import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function generateCode(name) {
  const base = (name || 'USER').trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'USER';
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    const email = (body.email || body.email_address || '').trim().toLowerCase();
    const phone = (body.phone_number || body.phone || '').replace(/\D/g, '');
    const name = body.customer_name || body.name || '';
    const bookingId = body.bookingId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // ── Referral code: get or generate ──
    let referralCode = null;
    let referralCredits = 0;
    let referralCount = 0;

    if (email) {
      const existingCode = await redis.get(`ref:customer:email:${email}`);
      if (existingCode) {
        referralCode = existingCode;
        const referrerData = await redis.get(`ref:code:${existingCode}`);
        if (referrerData) {
          referralCredits = referrerData.creditsEarned || 0;
          referralCount = referrerData.totalCompleted || 0;
        }
      } else {
        // Generate new unique code
        let code = generateCode(name);
        let attempts = 0;
        while ((await redis.get(`ref:code:${code}`)) && attempts < 10) {
          code = generateCode(name);
          attempts++;
        }
        referralCode = code;
        const referrerData = {
          code,
          referrerName: name,
          referrerEmail: email,
          referrerPhone: phone,
          createdAt: new Date().toISOString(),
          creditsEarned: 0,
          totalCompleted: 0,
          pendingCount: 0,
        };
        await redis.set(`ref:code:${code}`, referrerData);
        await redis.set(`ref:customer:email:${email}`, code);
      }
    }

    // ── Record incoming referral if code was used ──
    const usedReferralCode = body.referralCode ? body.referralCode.trim().toUpperCase() : null;
    if (usedReferralCode && email) {
      try {
        await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/referral-record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: usedReferralCode,
            bookingId,
            referredEmail: email,
            referredPhone: phone,
            referredName: name,
          }),
        });
      } catch (e) {
        console.error('Referral record error:', e.message);
      }
    }

    // ── Build enriched payload ──
    const enrichedBody = {
      ...body,
      bookingId,
      type: 'booking',
      referralCode,
      referralCreditsEarned: referralCredits,
      referralCount,
      usedReferralCode,
    };

    const trackerUrl = process.env.TRACKER_WEBHOOK_URL;
    if (!trackerUrl) return res.status(500).json({ error: 'Tracker URL not configured' });

    const response = await fetch(`${trackerUrl}/api/incoming`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedBody),
    });

    if (!response.ok) throw new Error('Tracker webhook failed');

    const data = await response.json().catch(() => ({ success: true }));
    res.status(200).json({ ...data, referralCode });
  } catch (error) {
    console.error('Booking submit error:', error);
    res.status(500).json({ error: 'Failed to submit booking' });
  }
}
