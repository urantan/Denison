# Denison Ops — Drilling Operations Portal

Internal-facing prototype for Denison Mines' Phoenix ISR project. Tracks per-well, per-task drilling operations against admin-configured campaign targets.

This repo is a single-page HTML prototype served by a minimal Node + Express server. All data is held in the browser via `localStorage` for now — no database, no backend API. The Node layer exists so the prototype can be deployed to platforms like Render, Fly, or Railway with one click.

## What's in the box

- `public/index.html` — the entire prototype (HTML, CSS, JS in one file). Includes 10 task categories, 9 seeded wells, 90 seeded task entries, the Construction Output chart, on-track summary card, and the Admin configuration screen.
- `server.js` — Express static server. Serves `/public`, handles SPA-style deep links, exposes a `/healthz` endpoint.
- `render.yaml` — Render Blueprint for one-click deployment.
- `package.json` — dependencies (just Express) and start script.

## Local development

```bash
npm install
npm start
```

The app boots on `http://localhost:4000`. Edit `public/index.html` and reload the browser — there's no build step.

The login screen accepts:
- **Full access** code: `DENISON-2026`
- **View-only** code: `VIEW-DENISON`

## Data persistence

The prototype persists state to the browser's `localStorage`. This means:

- ✅ Each visitor's data survives page refreshes.
- ✅ Admin config changes (task durations, targets, dates) persist.
- ❌ Visitors cannot see each other's data — every browser is its own world.
- ❌ Clearing browser data wipes everything.
- ❌ ~5 MB cap per browser. Adequate for prototype scale (thousands of wells before it'd matter).

To reset to the original seed data, click **Reset demo data** on the Admin page.

## Deploying to Render

Two ways:

### Option 1 — Blueprint (one-click)

1. Push this repo to GitHub.
2. In the Render dashboard, click **New +** → **Blueprint**.
3. Connect the GitHub repo. Render reads `render.yaml` and provisions automatically.
4. Wait ~2 minutes for the build to finish.
5. Visit the assigned `*.onrender.com` URL.

### Option 2 — Manual web service

1. In Render, click **New +** → **Web Service**.
2. Connect this repo.
3. Settings:
   - **Environment**: Node
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Health check path**: `/healthz`
4. Deploy.

The free plan is fine for demos. Note Render's free-tier services sleep after 15 minutes of inactivity and take ~30 seconds to wake up.

## Architecture roadmap

Today's stack is intentionally minimal:

```
Browser (localStorage)  ←→  Node static server  ←→  Render
```

Next steps when you're ready to make this a real product:

1. **Add a backend API**. Replace `persistState()` with `POST /api/v1/wells`, `POST /api/v1/tasks`, etc. Add PostgreSQL with a `wells` table, `tasks` table, and a `task_config` table for the admin settings currently held in `window.TASK_DURATIONS`/`TASK_EXPECTATIONS`/`TASK_TOTAL_TARGET`.
2. **Real authentication**. Swap the demo access codes for Microsoft Entra ID SSO (Denison is on Microsoft). Tie user identity to an `audit_log` table for CNSC compliance.
3. **Split the single file**. The prototype is ~5,500 lines of HTML+CSS+JS in one file. Move to a React/Vue SPA with a Vite build, component files, and a real router. The current `data-view` attributes map cleanly to route components.
4. **Background jobs**. Some metrics (period rates, on-track projections) could be precomputed and cached, especially as task volume grows. A small worker process or scheduled function does this.

## Brand

- Primary green `#3e8642`, dark forest `#2d5a31`
- Brand gold `#f5b800`, deep gold `#c89400`
- Font: Inter for UI, JetBrains Mono for IDs and tabular data

## License

Proprietary — internal Denison Mines use only.
