import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const QUEUE_FILE = path.join(__dirname, 'pending.json');

app.use(express.json());

// CORS — allow the main site to POST to /api/incoming
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// ── Queue helpers (stored in pending.json on disk) ──────────
const readQueue = () => {
  try { return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')); }
  catch { return []; }
};

const writeQueue = (items) => {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(items));
};

// ── API routes ───────────────────────────────────────────────

// Receive incoming webhook from the main DoItAllBros site
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
    console.log(`[tracker] Received ${item.type || 'item'} from website: ${item.id}`);
    res.json({ success: true, id: item.id });
  } catch (err) {
    console.error('[tracker] Error in /api/incoming:', err.message);
    res.status(500).json({ error: 'Failed to store item' });
  }
});

// Return all pending items (tracker frontend polls this every 30s)
app.get('/api/pending', (req, res) => {
  res.json(readQueue());
});

// Clear the queue after the frontend processes items
app.delete('/api/pending', (req, res) => {
  writeQueue([]);
  res.json({ success: true });
});

// ── Serve the React app ──────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

// All other routes → React (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DoItAllBros Tracker running on port ${PORT}`);
});
