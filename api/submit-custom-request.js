export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const trackerUrl = process.env.TRACKER_WEBHOOK_URL;
    if (!trackerUrl) {
      return res.status(500).json({ error: 'Tracker URL not configured' });
    }

    const response = await fetch(`${trackerUrl}/api/incoming`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req.body, type: 'custom_request' })
    });

    if (!response.ok) {
      throw new Error('Tracker webhook failed');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Custom request error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
}
