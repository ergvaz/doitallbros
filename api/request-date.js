export default async function handler(req, res) {
  const bookingId = req.method === 'POST' ? req.body?.bookingId : req.query?.bookingId;

  if (req.method === 'POST') {
    const { date, time, note } = req.body || {};
    try {
      const trackerUrl = process.env.TRACKER_WEBHOOK_URL;
      if (trackerUrl && bookingId) {
        await fetch(`${trackerUrl}/api/incoming`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'date_request',
            bookingId,
            requestedDate: date || '',
            requestedTime: time || '',
            note: note || '',
            requestedAt: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
    } catch (_) {}
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(layout('Request Received', `
      <div style="font-size:52px;margin-bottom:16px;">📅</div>
      <h1 style="font-size:24px;font-weight:800;color:#1E293B;margin:0 0 12px 0;">Request Received!</h1>
      <p style="font-size:15px;color:#64748B;line-height:1.7;margin:0 0 28px 0;">We got your date request and will be in touch shortly to confirm.</p>
      <p style="font-size:14px;color:#94A3B8;margin:0;">Questions? Text us at <strong style="color:#1E293B;">(502) 387-5462</strong></p>
    `));
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(layout('Request a Different Date', `
    <h1 style="font-size:22px;font-weight:800;color:#1E293B;margin:0 0 8px 0;">Request a Different Date</h1>
    <p style="font-size:14px;color:#64748B;margin:0 0 24px 0;">Pick a date and time that works for you and we'll get back to you to confirm.</p>
    <form method="POST" action="/api/request-date" style="text-align:left;">
      <input type="hidden" name="bookingId" value="${bookingId || ''}" />
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Preferred Date</label>
        <input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}" style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:15px;color:#1E293B;background:#fff;" />
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Preferred Time</label>
        <select name="time" required style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:15px;color:#1E293B;background:#fff;">
          <option value="">Select a time...</option>
          ${['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'].map(t => {
            const [h, m] = t.split(':');
            const hr = parseInt(h);
            const label = `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
            return `<option value="${t}">${label}</option>`;
          }).join('')}
        </select>
      </div>
      <div style="margin-bottom:24px;">
        <label style="display:block;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Any notes? (optional)</label>
        <textarea name="note" rows="3" placeholder="e.g. mornings work best, prefer weekends..." style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:15px;color:#1E293B;background:#fff;resize:vertical;"></textarea>
      </div>
      <button type="submit" style="width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;">Submit Request</button>
    </form>
  `));
}

function layout(title, body) {
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
    <div style="padding:40px 32px;text-align:center;">${body}</div>
    <div style="background:#1E293B;padding:16px 32px;text-align:center;">
      <div style="color:#94A3B8;font-size:12px;">Do It All Bros &nbsp;|&nbsp; Louisville, KY &nbsp;|&nbsp; (502) 387-5462</div>
    </div>
  </div>
</body>
</html>`;
}
