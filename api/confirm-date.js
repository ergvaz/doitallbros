import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).send(page('Invalid Link', 'This confirmation link is missing required information.', false));
  }

  const confirmedAt = new Date().toISOString();

  // Store in Redis so tracker can reliably pick it up
  try {
    await redis.set(`confirmation:${bookingId}`, { bookingId, confirmedAt }, { ex: 60 * 60 * 24 * 7 });
  } catch (_) {}

  // Also signal tracker directly (best-effort)
  try {
    const trackerUrl = process.env.TRACKER_WEBHOOK_URL;
    if (trackerUrl) {
      await fetch(`${trackerUrl}/api/incoming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'date_confirmation', bookingId, confirmedAt }),
      }).catch(() => {});
    }
  } catch (_) {}

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(page(
    'Date Confirmed!',
    "We've received your confirmation and we're all set. See you soon!",
    true
  ));
}

function page(title, message, success) {
  const color = success ? '#6366F1' : '#EF4444';
  const icon = success ? '✅' : '❌';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} — Do It All Bros</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:480px;width:100%;margin:32px 16px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.09);">
    <div style="background:#1E293B;padding:28px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:.04em;">DoItAllBros</div>
      <div style="font-size:13px;color:#94A3B8;margin-top:4px;">Louisville's Trusted Home &amp; Business Services</div>
    </div>
    <div style="padding:48px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:16px;">${icon}</div>
      <h1 style="font-size:24px;font-weight:800;color:#1E293B;margin:0 0 12px 0;">${title}</h1>
      <p style="font-size:15px;color:#64748B;line-height:1.7;margin:0 0 28px 0;">${message}</p>
      <p style="font-size:14px;color:#94A3B8;margin:0;">Questions? Text us at <strong style="color:#1E293B;">(502) 387-5462</strong></p>
    </div>
    <div style="background:#1E293B;padding:16px 32px;text-align:center;">
      <div style="color:#94A3B8;font-size:12px;">Do It All Bros &nbsp;|&nbsp; Louisville, KY &nbsp;|&nbsp; (502) 387-5462</div>
    </div>
  </div>
</body>
</html>`;
}
