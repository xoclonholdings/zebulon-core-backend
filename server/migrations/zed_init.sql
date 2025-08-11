-- ZED Tile: Initial schema, tables, views, RBAC seeds
CREATE SCHEMA IF NOT EXISTS z_zed;

-- Standard tables
CREATE TABLE IF NOT EXISTS z_zed.settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS z_zed.events (
  id serial PRIMARY KEY,
  type text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS z_zed.logs (
  id serial PRIMARY KEY,
  level text NOT NULL,
  message text NOT NULL,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS z_zed.cache (
  k text PRIMARY KEY,
  v jsonb,
  ttl int,
  updated_at timestamptz
);

-- Views
CREATE OR REPLACE VIEW z_zed.views_user_activity AS
SELECT u.id as user_id, l.*
FROM core.users u
JOIN z_zed.logs l ON (l.meta->>'user_id')::uuid = u.id;

CREATE OR REPLACE VIEW z_zed.views_latest_events AS
SELECT * FROM z_zed.events ORDER BY created_at DESC LIMIT 200;

-- RBAC seeds (roles mapped to core.permissions)
INSERT INTO core.permissions (role, resource, access)
VALUES
  ('owner', 'zed', 'all'),
  ('admin', 'zed', 'write'),
  ('member', 'zed', 'read'),
  ('viewer', 'zed', 'read')
ON CONFLICT DO NOTHING;
