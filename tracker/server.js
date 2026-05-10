import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const QUEUE_FILE = path.join(__dirname, 'pending.json');
const AVAIL_FILE = path.join(__dirname, 'availability.json');
const STATE_FILE = path.join(__dirname, 'state.json');

// n8n intake webhook — receives new bookings/requests for logging + availability check
const N8N_INTAKE_WEBHOOK = 'https://n8n.srv1122720.hstgr.cloud/webhook/5ebf6849-cf49-4f63-a335-811104ada728';
// n8n confirmation webhook — receives confirmed/quoted/declined actions from tracker owner
const N8N_WEBHOOK = 'https://n8n.srv1122720.hstgr.cloud/webhook/9937e869-76b6-4b62-891f-6cbb4d00ab24';
// n8n contact webhook — receives contact/custom request replies from tracker owner
const N8N_CONTACT_WEBHOOK = 'https://n8n.srv1122720.hstgr.cloud/webhook/ee98ccfc-81d0-45e6-a4be-ea52d4cc46f9';

// Larger body limit for full-state PUTs (clients/bookings/notes can grow).
app.use(express.json({ limit: '8mb' }));

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

// ── State helpers (server-backed React app state) ────────────
// Replaces browser localStorage as the source of truth so any device
// hitting the tracker URL sees the same clients/bookings/notes/etc.
const DEFAULT_STATE = {
  clients: [], bookings: [], contacts: [], tasks: [],
  revenues: [], notes: [], requests: [],
  _meta: { updatedAt: null, revision: 0 },
};
const readState = () => {
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return { ...DEFAULT_STATE, ...parsed, _meta: { ...DEFAULT_STATE._meta, ...(parsed._meta || {}) } };
  } catch { return DEFAULT_STATE; }
};
const writeStateAtomic = (state) => {
  // Bump revision + timestamp so the React app can decide whether to refresh.
  const next = {
    ...state,
    _meta: {
      ...(state._meta || {}),
      updatedAt: new Date().toISOString(),
      revision: ((state._meta && state._meta.revision) || 0) + 1,
    },
  };
  const tmp = STATE_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(next));
  fs.renameSync(tmp, STATE_FILE);
  return next;
};

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
      fetch(N8N_INTAKE_WEBHOOK, {
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
          total_amount: item.total_amount || 0,
          subtotal: item.subtotal || 0,
          preferred_date: item.preferred_date || item.date || item.scheduled_date?.split(' ')[0] || '',
          preferred_time: item.preferred_time || item.time || item.scheduled_date?.split(' ')[1] || '',
          backup_date: item.backup_date || item.backup_date || null,
          backup_time: item.backup_time || item.backup_time || null,
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
    const { bookingId, dateAvailability } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

    const mapStatus = (v) => {
      if (!v || v === 'not_provided') return null;
      if (v === 'available') return 'available';
      return 'unavailable';
    };

    const da = typeof dateAvailability === 'string' ? JSON.parse(dateAvailability) : (dateAvailability || {});
    const avail = readAvail();
    const idx = avail.findIndex(a => a.bookingId === bookingId);
    const entry = {
      bookingId,
      preferred: mapStatus(da.preferred),
      backup: mapStatus(da.backup),
      alternatives: Array.isArray(da.alternatives) ? da.alternatives : [],
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

// ── AI suggested response from n8n ──────────────────────────
// n8n AI agent POSTs here after generating a response to a contact message
// Body: { contactId, aiResponse }
app.post('/api/ai-response', (req, res) => {
  try {
    const { contactId, aiResponse } = req.body;
    if (!contactId || !aiResponse) return res.status(400).json({ error: 'contactId and aiResponse required' });

    const queue = readQueue();
    const idx = queue.findIndex(i => i.contactId === contactId);
    if (idx === -1) return res.status(404).json({ error: 'Contact not found' });

    queue[idx] = { ...queue[idx], aiSuggestedResponse: aiResponse, aiRespondedAt: new Date().toISOString() };
    writeQueue(queue);

    console.log(`[tracker] AI response stored for contact ${contactId}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[tracker] /api/ai-response error:', err.message);
    res.status(500).json({ error: 'Failed to store AI response' });
  }
});

// ── Owner reply to contact/custom request → n8n ─────────────
// Tracker owner submits their response; type: 'second' tells n8n to send the email
app.post('/api/contact-reply', async (req, res) => {
  try {
    const response = await fetch(N8N_CONTACT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req.body, type: 'second' }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[tracker] n8n contact reply failed:', response.status, text);
      return res.status(502).json({ error: 'n8n webhook failed' });
    }
    console.log(`[tracker] Contact reply forwarded to n8n for ${req.body.contactId}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[tracker] /api/contact-reply error:', err.message);
    res.status(500).json({ error: 'Failed to send reply' });
  }
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

// ── Server-backed React state ────────────────────────────────
// GET  /api/state              → full state
// PUT  /api/state              → replace full state
// PATCH /api/state/:collection → replace one collection (clients/bookings/...)
// PUT  /api/state/seed         → seed from localStorage on first run, only
//                                accepts a body if the server has no state yet
app.get('/api/state', (req, res) => {
  res.json(readState());
});

app.put('/api/state', (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'state must be an object' });
    }
    const saved = writeStateAtomic(body);
    res.json({ success: true, _meta: saved._meta });
  } catch (err) {
    console.error('[tracker] /api/state PUT error:', err.message);
    res.status(500).json({ error: 'Failed to save state' });
  }
});

const ALLOWED_COLLECTIONS = new Set(Object.keys(DEFAULT_STATE).filter((k) => !k.startsWith('_')));
app.patch('/api/state/:collection', (req, res) => {
  try {
    const { collection } = req.params;
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return res.status(400).json({ error: `unknown collection: ${collection}` });
    }
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'collection body must be an array' });
    }
    const current = readState();
    const next = { ...current, [collection]: req.body };
    const saved = writeStateAtomic(next);
    res.json({ success: true, _meta: saved._meta });
  } catch (err) {
    console.error('[tracker] PATCH /api/state error:', err.message);
    res.status(500).json({ error: 'Failed to patch collection' });
  }
});

// One-shot seed endpoint — only accepts data if server-side state is empty.
// Lets users push their existing localStorage state up on first deploy
// without overwriting an already-populated server.
app.put('/api/state/seed', (req, res) => {
  try {
    const current = readState();
    const populated = ALLOWED_COLLECTIONS.size > 0 && [...ALLOWED_COLLECTIONS].some((k) => (current[k] || []).length > 0);
    if (populated) {
      return res.status(409).json({ error: 'server already has state', _meta: current._meta });
    }
    const saved = writeStateAtomic(req.body || {});
    console.log('[tracker] state seeded from client');
    res.json({ success: true, _meta: saved._meta });
  } catch (err) {
    console.error('[tracker] /api/state/seed error:', err.message);
    res.status(500).json({ error: 'Failed to seed state' });
  }
});

// ── Serve the React app ──────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`DoItAllBros Tracker running on port ${PORT}`));
