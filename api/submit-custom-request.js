export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const n8nWebhook = 'https://n8n.srv1122720.hstgr.cloud/webhook/5ebf6849-cf49-4f63-a335-811104ada728';

    // Forward to n8n webhook
    await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }).catch(e => console.warn('n8n webhook failed:', e.message));

    // Forward to tracker
    const trackerUrl = process.env.TRACKER_WEBHOOK_URL;
    if (trackerUrl) {
      await fetch(`${trackerUrl}/api/incoming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...req.body, type: 'custom_request' })
      }).catch(e => console.warn('Tracker webhook failed:', e.message));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Custom request error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
}
