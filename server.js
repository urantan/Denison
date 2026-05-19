// Denison Ops — minimal static server.
// Serves the single-file HTML prototype from /public.
// All state still lives in the browser (localStorage); this server
// has no persistence layer and no database. When you're ready to add
// a backend, this is the place to mount REST endpoints under /api.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static assets from /public. The prototype is /public/index.html.
app.use(express.static(path.join(__dirname, 'public'), {
  // Set a short cache TTL during the prototype phase so changes propagate quickly.
  maxAge: '5m',
  // Always look for index.html on directory hits.
  index: 'index.html',
}));

// Healthcheck endpoint Render can hit.
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', service: 'denison-ops', version: require('./package.json').version });
});

// SPA-style fallback: any unmatched route returns the same index.html so
// deep links (e.g. /admin, /wells) still load the page. The page's own
// in-memory router will then take over.
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Denison Ops listening on http://localhost:${PORT}`);
});
