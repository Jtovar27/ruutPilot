-- Add resend_id for webhook tracking and updated_at for status updates
ALTER TABLE emails_sent ADD COLUMN IF NOT EXISTS resend_id text;
ALTER TABLE emails_sent ADD COLUMN IF NOT EXISTS updated_at timestamptz;
