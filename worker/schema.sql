-- Ejecutar con:
--   wrangler d1 execute specsolid-newsletter-db --remote --file=worker/schema.sql
--
-- (usa --local en vez de --remote mientras pruebas con `wrangler dev`)

CREATE TABLE IF NOT EXISTS subscribers (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT NOT NULL UNIQUE,
  name              TEXT,
  chapter_selected  TEXT,
  status            TEXT NOT NULL DEFAULT 'active',   -- active | unsubscribed
  source            TEXT NOT NULL DEFAULT 'website',
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  last_sent_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers (status);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers (created_at);
