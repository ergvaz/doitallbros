# DoItAllBros — Dev Notes

---

## Full Booking Flow

```
1. Customer fills out booking form on doitallbros.com
       ↓
2. /api/submit-booking (Vercel) → forwards to n8n AND tracker simultaneously
       ↓
3. n8n "new_booking" workflow runs:
   - Scheduling agent checks Google Calendar for preferred + backup dates
   - Offers 3 alternative dates if preferred is unavailable
   - Sends scheduling result back to tracker via webhook
       ↓
4. Tracker shows the booking in Inbox with date availability info
       ↓
5. Owner (you) selects a confirmed date and sets quoted prices for any quote services
   → Submits → triggers n8n "confirmation email" workflow
       ↓
6. Confirmation email sent to customer with:
   - Confirmed date + time
   - Services + prices (fixed shown, quoted shown once set)
   - ✅ Confirm button(s) linking to /api/confirm-date
       ↓
7. Customer clicks confirm → /api/confirm-date → signal sent to tracker
   → Booking marked as CONFIRMED in tracker
       ↓
8. Owner does the visit → marks COMPLETE in tracker
   → Triggers n8n "completion email" workflow
   → Completion email sent with Stripe payment link (if card payment)
```

---

## Main Site (Vercel — doitallbros.com)

- React + Vite SPA, single file: `src/App.jsx` (~1700+ lines)
- All service data is hardcoded in `serviceData` object at top of App.jsx
- Booking form → `/api/submit-booking.js`
- Contact form → `/api/submit-contact.js`
- Referral system via Upstash Redis (KV store)

### Service Types
| Property | Behavior |
|---|---|
| `sizeDependent: true` | Shows size picker; price set at add-to-cart from `sizePricing[size].price` |
| `dependentPricing: true` | Free quote — no fixed price, sent as `isQuote: true` in payload |
| `hourly: true` | Price = `hourlyRate × hours` selected |
| `perItem: true` | Price = parsed from `service.price` string × quantity |
| `isLightBulb: true` | Price = `max(bulbCount × 10, 40) + fixtureCount × 45` |
| `isDogWalking: true` | Price = `basePrice × (duration/30) + (dogCount-1) × 10 × intervals` |
| `isEmergency: true` | `calculatedPrice = 'emergency'` flag; 1.5× applied at checkout |
| `recurring: true` | Eligible for recurring scheduling |
| `extraOvergrown` | +$40 fee added to item price |
| `materialNote: true` | Shows "materials not included" notice |

### Fees (applied to subtotal of fixed-price services only)
| Trigger | Amount |
|---|---|
| Weekend date selected | +10% of subtotal |
| After 5:00 PM time selected | +20% of subtotal |
| Same-day booking | +30% of subtotal |
| Material procurement selected | +$45 flat |
| Extra overgrown (per item) | +$40 per item |
| Emergency services (isEmergency) | ×1.5 on that item's price |

### Discounts
| Trigger | Amount |
|---|---|
| 3+ services in cart | -10% of subtotal |
| Recurring, one-time full payment | -10% of that item's recurring subtotal |
| Referral code at checkout (referred person's first visit) | -variable% off full `pricing.total` (% returned by `/api/referral-validate`) |
| Referral credit (referrer, after referral's first visit completes) | -20% off referrer's next visit |

### ~~Known Issue: Fees/discounts don't apply to quoted services~~ FIXED (commit b93d143)
Tracker now recomputes fees and discounts at confirmation time using the confirmed date/time
and full subtotal (fixed + quoted). Email receives correct totalCombined automatically.
No email system prompt changes needed.

---

## API Routes (Vercel)

| Endpoint | Purpose |
|---|---|
| `/api/submit-booking` | Receives booking form, assigns bookingId, handles referral code, forwards to tracker |
| `/api/submit-contact` | Receives contact form, forwards to n8n and tracker |
| `/api/confirm-date` | Customer clicks confirm in email → marks booking confirmed in tracker |
| `/api/referral-record` | Records when a referral code is used on a booking |
| `/api/request-date` | Customer requests a different date (from "none of these work" link in email) |

---

## Tracker (Hostinger VPS)

- URL: `https://n8n.srv1122720.hstgr.cloud/dab`
- Password: `doitallbrothers2026`
- Express.js server (`tracker/server.js`) runs inside a **Docker container**
- React app in `tracker/src/App.jsx` (~2100+ lines)
- All client data in localStorage (`dab_tracker_v1`)
- Incoming webhook queue in `pending.json` on disk
- Polls `/api/pending` every 30 seconds

### Docker Setup (CRITICAL)

The tracker runs via Docker Compose at `/root/docker-compose.yml`. Traefik is the reverse proxy — it routes `n8n.srv1122720.hstgr.cloud/dab` to the `dab-tracker` container and strips the `/dab` prefix before passing to Express. The container builds from `/var/www/doitallbros/tracker`.

**PM2 and nginx are irrelevant for the tracker — do not use them to deploy.**

**Rebuild and redeploy after any tracker code change:**
```bash
cd /var/www/doitallbros/tracker && git pull origin main && cd /root && docker compose up -d --build dab-tracker
```

**View live logs:**
```bash
docker logs root-dab-tracker-1 --tail 50
```

**Check running containers:**
```bash
docker ps
```

### Docker Compose Services
| Service | Purpose |
|---|---|
| `traefik` | Reverse proxy + SSL (routes all subdomains) |
| `n8n` | n8n automation at `n8n.srv1122720.hstgr.cloud` |
| `tracker` | vantpath-tracker at `/tracker` path — separate project, do not touch |
| `dab-tracker` | DoItAllBros tracker at `/dab` path |

### n8n HTTP Nodes — Tracker API URLs
All n8n HTTP nodes calling the tracker must use:
```
https://n8n.srv1122720.hstgr.cloud/dab/api/<endpoint>
```
**Do NOT use localhost or tracker.srv1122720.hstgr.cloud from n8n** — only the public URL works reliably from n8n workflows.

### Tracker Sections
- **Dashboard** — stats, today's schedule, inbox preview, upcoming tasks, alerts
- **Inbox** — incoming bookings + contacts, convert to client
- **Clients** — CRUD, profiles, service history, tags
- **Bookings** — Kanban + list, status management, revenue logging
- **Calendar** — monthly grid with booking dots
- **Tasks** — priority groups (overdue/today/upcoming)
- **Revenue** — bar chart, category breakdown, CSV export
- **Notes** — color-coded cards, pin, edit-in-place

### Tracker — Booking Status Flow
```
inbox → confirmed → in_progress → completed
```

### Tracker — Key Actions That Trigger n8n Workflows
| Tracker Action | Workflow Triggered |
|---|---|
| Owner selects date + sets quotes → Submit | Confirmation email workflow |
| Owner marks booking COMPLETE | Completion email + Stripe link workflow |

---

## n8n Workflows

All hosted at: `https://n8n.srv1122720.hstgr.cloud`

### 1. New Booking Workflow
- Trigger: booking submitted from site
- Scheduling agent checks Google Calendar (preferred + backup dates)
- Returns availability + up to 3 alternative dates
- Sends result to tracker

### 2. Confirmation Email Workflow
- Trigger: owner submits date/quotes from tracker
- Email agent (Claude) generates HTML email
- Email sent to customer with confirm buttons
- Buttons link to `/api/confirm-date`

**Email System Prompt key rules:**
- Always show confirm button regardless of whether date was available or not
- Block A (date available): green, "Your Appointment is Ready" + confirm button
- Block B (alternate, no alternatives): amber, "Date Update" + confirm button
- Block C (alternate, 3 alternatives): amber, 3 option cards each with confirm button

### 3. Completion Email Workflow
- Trigger: owner marks booking complete in tracker
- Sends thank you email to customer
- Includes Stripe payment link if payment method = card

### 4. Contact Reply Email Workflow
- Trigger: owner types a reply in tracker inbox and clicks "Send Reply"
- Tracker POSTs to `/api/contact-reply` → forwarded to n8n contact webhook with `type: 'second'`
- n8n AI node formats the reply as a branded HTML email using the system prompt below
- Email sent to the customer

**Contact Reply Email — n8n AI Node System Prompt** (paste into the AI node in n8n):

**n8n input variables:** `{{ $json.body.clientName }}` and `{{ $json.body.replyText }}`

```
You are an email formatter for DoItAllBros, a handyman and home services company in Louisville, KY. Your job is to take the owner's plain-text reply to a customer and output a complete, ready-to-send HTML email body.

You will receive:
- clientName: the customer's first name
- replyText: the owner's reply to format into an email

Rules:
1. Output ONLY valid HTML — no markdown, no explanation, no code fences. The output goes directly into an email sender.
2. Use inline CSS only — no <style> tags, no external stylesheets.
3. If replyText contains any URLs, remove the URL from the paragraph text and reword the sentence naturally so it flows without the link inline (e.g. "visit our website linked below" instead of "visit our website at https://..."). Then place all URLs as styled buttons together at the bottom of the body, just above the sign-off line. Button style: background: #6366F1, color: white, padding: 12px 28px, border-radius: 6px, text-decoration: none, display: inline-block, font-size: 14px, font-weight: 600, margin: 4px.
4. Preserve paragraph breaks from replyText — split on double newlines and wrap each in a <p> tag.
5. Do not add information that isn't in replyText. Do not invent offers, prices, or dates.

HTML structure to follow exactly:

<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); padding: 32px 40px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">DoItAllBros</h1>
    <p style="color: #a5b4fc; margin: 6px 0 0; font-size: 14px;">Louisville, KY · (502) 387-5462</p>
  </div>

  <!-- Body -->
  <div style="padding: 36px 40px; background: #ffffff;">
    <p style="color: #1e293b; font-size: 16px; margin: 0 0 20px;">Hi [clientName],</p>
    [replyText paragraphs go here — no inline URLs]
    [buttons for any URLs go here, centered, before the sign-off]
    <p style="color: #64748b; font-size: 14px; margin: 28px 0 0;">Thanks for choosing DoItAllBros. We look forward to serving you!</p>
  </div>

  <!-- Footer -->
  <div style="background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
    <p style="color: #94a3b8; font-size: 12px; margin: 0;">DoItAllBros · Louisville, KY · (502) 387-5462</p>
    <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0;">Reply to this email or call us anytime.</p>
  </div>

</div>
```

**Key lesson:** If this system prompt is ever updated (wording, colors, structure), update it here in NOTES.md immediately.

---

## Scheduling Agent (n8n AI node)

### Key Rules
- Check one 2-hour slot at a time per tool call
- Eastern Time: EDT (UTC-4) mid-March to early November, EST (UTC-5) otherwise
- Zero events returned = available; never mark unavailable without a confirmed event
- Tool error = output `{ "error": "calendar_tool_failed" }`, do not mark unavailable
- Query format: After=slot_start, Before=slot_start+2h, both in ISO 8601 with offset

### Google Calendar Tool Description (paste in n8n tool node)
```
Retrieves Google Calendar events within a time window you specify via After and Before.
Call this tool ONCE per individual time slot — not for a whole day or week.
Set After = exact slot start in ISO 8601 with Eastern Time offset.
Set Before = exactly 2 hours after slot start.
Eastern Time offset: use -04:00 (EDT) from mid-March through early November, -05:00 (EST) otherwise.
Example — checking March 24 at 10:30 AM EDT:
  After:  2026-03-24T10:30:00-04:00
  Before: 2026-03-24T12:30:00-04:00
If zero events returned → AVAILABLE.
If one or more events returned → UNAVAILABLE.
Events from a previous call have NO bearing on the current slot. Evaluate each call independently.
```

---

## Pending Architecture Fix: Fees/Discounts on Quoted Services

**Problem:** Fees (weekend, after-5pm, same-day) and discounts (3+ services) are calculated at checkout against `subtotal` (fixed-price services only). Quoted services are excluded because their price is unknown. This means:
- A 3-service booking with 1 quote only gets 10% off the 2 fixed services
- If preferred date is 4pm (no after-5pm fee) but confirmed date ends up being 6pm, no fee is applied
- Material procurement and emergency fees are also applied to incomplete subtotals

**Planned Fix:**
Store fee/discount rules as metadata on the booking (not calculated dollar amounts), then recalculate against the full confirmed total when the owner sets quoted prices and the customer confirms.

What to send in booking payload:
- `pendingFeeRules: [{ type: 'weekend', rate: 0.10, label: 'Weekend (10%)' }]`
- `pendingDiscountRules: [{ type: 'multi_service', rate: 0.10, label: '10% Multi-Service Discount' }]`

Then in the tracker, when the owner sets quoted prices:
- Apply pending rules to the full total (fixed + quoted)
- Show the customer the correct final total in the confirmation email

**Status:** Not yet built.

---

## Bug History

### Bug: n8n HTTP node 404 on `/api/ai-response`
**Fix:** Removed the separate endpoint. n8n now POSTs to `/api/incoming` with `type: 'ai_response'`, which is the same endpoint all other webhooks use. The tracker handles this type in its poll loop to update the contact's `aiSuggestedResponse`.

### Bug: Tracker changes not appearing after rebuild (wasted many sessions)
**Root cause:** The tracker runs inside a Docker container managed by Docker Compose at `/root/docker-compose.yml`. Traefik routes `n8n.srv1122720.hstgr.cloud/dab` to the container. Running `npm run build` or PM2 commands at `/var/www/doitallbros/tracker/` rebuilds the files on disk but the Docker container keeps serving its own internal copy.

**Fix:** Always rebuild with:
```bash
cd /var/www/doitallbros/tracker && git pull origin main && cd /root && docker compose up -d --build dab-tracker
```

**Key lesson:** When a site is served via Docker, rebuilding on the host filesystem does nothing. You must rebuild the Docker image.

---

### Bug: `fixedPrice` showing as `$0.00` in tracker inbox
**Fixed:** commit `587a9b2`

**Root cause:** `cartItemsStructured` used `item.calculatedPrice` to set `fixedPrice`. If a cart item was added before a previous fix was deployed (old localStorage), `calculatedPrice` was null, falling back to `fixedPrice = 0`. Size-dependent services worked because selecting a size always sets `calculatedPrice` freshly.

**What didn't work:**
1. Changed perItem detection to use `svc?.perItem` — didn't fix root cause
2. Moved `cartItemsStructured` to render time — it was already there
3. Used `svc.price` as authoritative source — only for perItem, missed fixed-price services
4. Added `calculatedPrice` for perItem in `handleAddToCart` — right idea but old localStorage items bypassed it
5. Added catch-all else branch for simple fixed-price in `handleAddToCart` — correct logic, still relied on `item.calculatedPrice` being freshly computed

**What worked:**
Added a full recomputation fallback inside `cartItemsStructured` itself. If `item.calculatedPrice` is not a number, it recomputes from `serviceData` using the same logic as `handleAddToCart`. This makes `cartItemsStructured` authoritative regardless of cart item state.

**Key lesson:** Never rely on cached computed values from state/localStorage for prices. Always have a fallback that recomputes from source-of-truth data at the time the value is actually needed.

---

### Bug: Scheduling agent marking available dates as unavailable
**Status:** System prompt rewritten — not yet confirmed fixed

**Root cause (suspected):** The Google Calendar node `After`/`Before` fields were "defined automatically by the model" with no guidance on query window size. The model was likely querying a broad date range, receiving events from other days, then misapplying those events to the requested slots. UTC/DST confusion was also a contributing factor (EDT vs EST offset).

**Fix applied:**
1. Added explicit Google Calendar tool description telling the agent to query one 2-hour slot at a time
2. Rewrote system prompt with explicit DST offset rules
3. Added rule: zero events = available; tool error ≠ unavailable
4. Clarified overlap math: `event_start < window_end AND event_end > window_start`
5. Expanded fallback time options in Step 3 from 4 to 9 time slots per day

---

## Service Pricing Reference (as of March 2026)

### Landscaping
| Service | Pricing |
|---|---|
| Lawn Mowing & Edging | Small $45 / Medium $60 / Large $80 / XL $110 |
| Advanced Lawn Care | Small $45 / Medium $60 / Large $80 / XL $110 |
| Weed Removal & Prevention | Small Bed $45 / Garden $65 / Driveway $85 |
| Hedge, Bush & Tree Trimming | Dependent Pricing (free quote) |
| Leaf Cleanup & Debris Removal | Small $50 / Medium $75 / Large $110 / XL $150 |
| Mulching | Dependent Pricing (free quote) |
| Garden Bed Installation | Dependent Pricing (free quote) |
| Soil Leveling & Patch Repair | $40 |
| Snow Shoveling & De-icing | $50–$150 (size-dependent) |

---

## Environment Variables

### Vercel (main site)
- `KV_REST_API_URL` — Upstash Redis URL (referral system)
- `KV_REST_API_TOKEN` — Upstash Redis token
- `TRACKER_WEBHOOK_URL` — tracker VPS URL for incoming bookings

### Tracker VPS
- No env vars needed; all data in localStorage + pending.json

---

## Key File Paths
| File | Purpose |
|---|---|
| `src/App.jsx` | Entire main site (services, booking form, checkout) |
| `api/submit-booking.js` | Booking form handler |
| `api/submit-contact.js` | Contact form handler |
| `tracker/src/App.jsx` | Entire tracker app |
| `tracker/server.js` | Express server + API routes |
| `tracker/api/incoming.js` | Receives webhooks from n8n/main site |
| `tracker/api/pending.js` | Queue reader/clearer for tracker frontend |
