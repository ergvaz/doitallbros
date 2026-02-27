export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Forward to n8n webhook
    const response = await fetch('https://n8n.srv1122720.hstgr.cloud/webhook/ee98ccfc-81d0-45e6-a4be-ea52d4cc46f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error('n8n webhook failed');
    }

    // Also forward to the tracker (awaited so Vercel doesn't kill it early)
    const trackerUrl = process.env.TRACKER_WEBHOOK_URL;
    if (trackerUrl) {
      await fetch(`${trackerUrl}/api/incoming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...req.body, type: 'contact' })
      }).catch(e => console.warn('Tracker webhook failed:', e.message));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact webhook error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
