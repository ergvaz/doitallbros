import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const QUEUE_FILE = path.join(__dirname, 'pending.json');
const AVAIL_FILE = path.join(__dirname, 'availability.json');

// n8n booking webhook — receives confirmed/quoted/declined bookings from tracker
const N8N_WEBHOOK = 'https://n8n.srv1122720.hstgr.cloud/webhook/9937e869-76b6-4b62-891f-6cbb4d00ab24';

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// ── Queue helpers ────────────────────────────────────────────
const readQueue = () => {
  try { return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')); }
  catch { return []; }
};
const writeQueue = (items) => fs.writeFileSync(QUEUE_FILE, JSON.stringify(items));

const readAvail = () => {
  try { return JSON.parse(fs.readFileSync(AVAIL_FILE, 'utf8')); }
  catch { return []; }
};
const writeAvail = (items) => fs.writeFileSync(AVAIL_FILE, JSON.stringify(items));

// ── API routes ───────────────────────────────────────────────

// Receive incoming webhook from main site (bookings, custom requests, contacts)
app.post('/api/incoming', (req, res) => {
  try {
    const queue = readQueue();
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...req.body,
      receivedAt: new Date().toISOString(),
    };
    queue.push(item);
    writeQueue(queue);
    console.log(`[tracker] Received ${item.type || 'item'}: ${item.id}`);
    res.json({ success: true, id: item.id });

    // Forward bookings and custom requests to n8n immediately so it can:
    // 1. Log to Google Sheets with the bookingId
    // 2. Check calendar availability and send signal back via POST /api/availability
    const type = item.type || '';
    if (type === 'booking' || type === 'custom_request') {
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'booking' ? 'new_booking' : 'new_custom_request',
          bookingId: item.id,
          customer_name: item.customer_name || item.name || '',
          email: item.email_address || item.email || '',
          phone: item.phone_number || item.phone || '',
          address: item.address || '',
          service_list: item.service_list || item.description || '',
          has_quoted_services: item.has_quoted_services || false,
          preferred_date: item.preferred_date || '',
          preferred_time: item.preferred_time || '',
          backup_date: item.backup_date || null,
          backup_time: item.backup_time || null,
          payment_method: item.payment_method || '',
          notes: item.extra_notes || item.notes || item.otherNotes || '',
          receivedAt: item.receivedAt,
        }),
      }).catch(err => console.warn('[tracker] n8n initial notify failed:', err.message));
    }
  } catch (err) {
    console.error('[tracker] /api/incoming error:', err.message);
    res.status(500).json({ error: 'Failed to store item' });
  }
});

// Return all pending items (frontend polls every 30s)
app.get('/api/pending', (req, res) => res.json(readQueue()));

// Clear entire queue
app.delete('/api/pending', (req, res) => {
  writeQueue([]);
  res.json({ success: true });
});

// Delete a single item from the queue by ID
app.delete('/api/pending/:id', (req, res) => {
  const queue = readQueue().filter(i => i.id !== req.params.id);
  writeQueue(queue);
  res.json({ success: true });
});

// ── Availability signals from n8n ────────────────────────────
// n8n POSTs here after checking calendar availability for a booking's dates
// Body: { bookingId, preferredAvailable: true|false, backupAvailable: true|false|null }
app.post('/api/availability', (req, res) => {
  try {
    const { bookingId, preferredAvailable, backupAvailable } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

    const avail = readAvail();
    const idx = avail.findIndex(a => a.bookingId === bookingId);
    const entry = {
      bookingId,
      preferred: preferredAvailable != null ? (preferredAvailable ? 'available' : 'unavailable') : null,
      backup: backupAvailable != null ? (backupAvailable ? 'available' : 'unavailable') : null,
      updatedAt: new Date().toISOString(),
      applied: false,
    };
    if (idx >= 0) avail[idx] = entry;
    else avail.push(entry);
    writeAvail(avail);

    console.log(`[tracker] Availability update for ${bookingId}: preferred=${entry.preferred} backup=${entry.backup}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[tracker] /api/availability error:', err.message);
    res.status(500).json({ error: 'Failed to store availability' });
  }
});

// Return unapplied availability updates (frontend polls this)
app.get('/api/availability', (req, res) => {
  const avail = readAvail().filter(a => !a.applied);
  res.json(avail);
});

// Mark availability updates as applied (frontend calls after processing)
app.delete('/api/availability/:bookingId', (req, res) => {
  const avail = readAvail().map(a =>
    a.bookingId === req.params.bookingId ? { ...a, applied: true } : a
  );
  writeAvail(avail);
  res.json({ success: true });
});

// ── Forward processed booking to n8n ────────────────────────
// Frontend calls this when owner confirms/quotes/declines a request
// Body: the full structured payload to send to n8n
app.post('/api/forward', async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[tracker] n8n forward failed:', response.status, text);
      return res.status(502).json({ error: 'n8n webhook failed' });
    }
    console.log(`[tracker] Forwarded ${req.body.type} to n8n`);
    res.json({ success: true });
  } catch (err) {
    console.error('[tracker] /api/forward error:', err.message);
    res.status(500).json({ error: 'Failed to forward to n8n' });
  }
});

// ── Serve the React app ──────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`DoItAllBros Tracker running on port ${PORT}`));
