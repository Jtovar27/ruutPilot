-- Persistent searches table
CREATE TABLE IF NOT EXISTS searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type TEXT NOT NULL,
  location TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  results JSONB NOT NULL DEFAULT '[]',
  rejected_categories JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused')),
  total_keywords INTEGER NOT NULL DEFAULT 0,
  completed_keywords INTEGER NOT NULL DEFAULT 0,
  current_keyword TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own searches" ON searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches" ON searches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches" ON searches
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_searches_user_id ON searches(user_id);
CREATE INDEX idx_searches_status ON searches(user_id, status);
