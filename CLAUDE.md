# Claude Instructions — DoItAllBros

## Before Every Response
1. Check NOTES.md for relevant context (paths, architecture, known fixes, how things work)
2. Check the RULES section below before taking any action

## After Every Compaction
When the conversation is compacted (context compressed to save space), immediately re-read NOTES.md in full before responding. Do not rely solely on the compaction summary — it may be missing details. Treat NOTES.md as the single source of truth for this project.

---

## Rules

### Core
1. Read error messages completely before attempting fixes
2. Never guess at solutions — if unsure, ask first
3. When a command fails, explain WHY before trying again
4. Break complex tasks into small, testable steps
5. After each significant change, verify it works before moving forward
6. Use descriptive commit messages explaining what changed and why
7. Check file paths are correct before running commands — use NOTES.md for known paths
8. When debugging, isolate the problem — don't change multiple things at once
9. If something works, don't "improve" it unless asked
10. Keep dependencies minimal — only install what's actually needed
11. Ask clarifying questions when requirements are ambiguous
12. Never delete or overwrite files without confirming first
13. Use environment variables for sensitive data, never hardcode
14. When stuck, explain what was tried and what failed before asking for direction
15. Don't over-engineer — simple solutions beat complex ones
16. If about to do something destructive (rm, drop database, force push), warn first
17. Take time to understand the problem fully before touching code — quality over speed
18. Always make sure the problem is 100% understood before attempting a fix

### Notes — MANDATORY
- Update NOTES.md immediately whenever: something breaks and gets fixed, architecture changes, new paths/commands are discovered, a workflow is clarified, a bug is resolved, or anything important for future context is learned
- This is not optional — if a fix took time to find, it goes in NOTES.md before the conversation ends
- Add bugs to the Bug History section: root cause, what didn't work, what did work, key lesson
- Update existing sections if they become outdated (e.g. wrong commands, wrong paths)

### Project-Specific
- Match existing code style and patterns in each file before writing new code
- Tech stack: React, Vite, Express, n8n, Vercel (main site), Hostinger VPS (tracker + n8n)
- Always build mobile-responsive
- Match established color schemes: primary `#6366F1`, dark `#1E293B`, text `#64748B`
- Tracker changes require Docker rebuild: `cd /var/www/doitallbros/tracker && git pull origin main && cd /root && docker compose up -d --build dab-tracker`
- Main site auto-deploys on push to main (Vercel)

---

## Key Paths (never use placeholders)

| Thing | Value |
|---|---|
| Main site repo | `/Users/eligvazdinskas/Library/Mobile Documents/com~apple~CloudDocs/doitallbros` |
| Tracker VPS root | `/var/www/doitallbros/tracker/` |
| Tracker PM2 name | `dab-tracker` |
| Tracker URL | `https://n8n.srv1122720.hstgr.cloud/dab` |
| Main site | `https://www.doitallbros.com` |

## Key Files (never guess, always check NOTES.md first)

| File | Purpose |
|---|---|
| `src/App.jsx` | Entire main site — services, booking form, checkout |
| `api/submit-booking.js` | Booking form handler |
| `tracker/src/App.jsx` | Entire tracker app |
| `tracker/server.js` | Express server |
| `NOTES.md` | Full project reference — architecture, flows, bug history, paths |
