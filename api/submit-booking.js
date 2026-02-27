export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Forward to n8n webhook
    const response = await fetch('https://n8n.srv1122720.hstgr.cloud/webhook/9937e869-76b6-4b62-891f-6cbb4d00ab24', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      throw new Error('Webhook request failed');
    }
    
    const data = await response.json().catch(() => ({ success: true }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to submit booking' });
  }
}
