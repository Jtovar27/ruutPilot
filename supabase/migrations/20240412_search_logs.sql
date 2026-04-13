CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own search logs"
  ON search_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS search_logs_user_month_idx
  ON search_logs(user_id, created_at);
