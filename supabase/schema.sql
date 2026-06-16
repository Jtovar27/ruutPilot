-- RuutPilot Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- PUBLIC AUDIT REQUESTS
-- ============================================
create table audit_requests (
  id                  uuid primary key default gen_random_uuid(),
  business_name       text not null,
  owner_name          text not null,
  email               text not null,
  phone               text,
  website             text,
  city                text,
  business_type       text not null,
  leads_per_week      text,
  lead_sources        text[] not null default '{}',
  response_time       text,
  quote_process       text,
  deposits_required   text,
  unpaid_invoices     text,
  review_process      text,
  current_tools       text,
  biggest_pain        text not null,
  preferred_call_time text,
  extra_notes         text,
  status              text not null default 'new',
  created_at          timestamptz default now()
);

-- ============================================
-- LEADS
-- ============================================
create table leads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  company     text,
  email       text,
  phone       text,
  website     text,
  address     text,
  city        text,
  category    text,
  rating      numeric(3,1),
  reviews     integer,
  notes       text,
  source      text default 'manual',       -- 'scraping' | 'manual' | 'import'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================
-- PIPELINE
-- ============================================
create table pipeline_deals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  lead_id       uuid references leads(id) on delete set null,
  name          text not null,
  company       text,
  value         numeric(12,2) default 0,
  stage         text not null default 'prospecto',
  -- stages: prospecto | contactado | propuesta | negociacion | cerrado | perdido
  probability   integer default 0,         -- 0-100%
  expected_close date,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================
-- ACTIVITIES (history per deal)
-- ============================================
create table activities (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  deal_id     uuid references pipeline_deals(id) on delete cascade,
  lead_id     uuid references leads(id) on delete cascade,
  type        text not null,   -- 'email' | 'call' | 'note' | 'stage_change' | 'meeting'
  title       text,
  body        text,
  metadata    jsonb,
  created_at  timestamptz default now()
);

-- ============================================
-- EMAIL SEQUENCES
-- ============================================
create table email_sequences (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  status      text default 'active',    -- 'active' | 'paused' | 'archived'
  steps       jsonb not null default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table email_enrollments (
  id            uuid primary key default gen_random_uuid(),
  sequence_id   uuid references email_sequences(id) on delete cascade not null,
  lead_id       uuid references leads(id) on delete cascade not null,
  current_step  integer default 0,
  status        text default 'active',  -- 'active' | 'completed' | 'unsubscribed'
  enrolled_at   timestamptz default now(),
  completed_at  timestamptz
);

create table emails_sent (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  lead_id         uuid references leads(id) on delete set null,
  sequence_id     uuid references email_sequences(id) on delete set null,
  subject         text not null,
  body            text,
  to_email        text not null,
  status          text default 'sent',  -- 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced'
  opened_at       timestamptz,
  replied_at      timestamptz,
  sent_at         timestamptz default now()
);

-- ============================================
-- REVENUE GOALS
-- ============================================
create table revenue_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  month       integer not null,   -- 1-12
  year        integer not null,
  revenue     numeric(12,2) default 0,
  leads       integer default 0,
  deals       integer default 0,
  created_at  timestamptz default now(),
  unique(user_id, month, year)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table leads              enable row level security;
alter table audit_requests     enable row level security;
alter table pipeline_deals     enable row level security;
alter table activities         enable row level security;
alter table email_sequences    enable row level security;
alter table email_enrollments  enable row level security;
alter table emails_sent        enable row level security;
alter table revenue_goals      enable row level security;

-- Policies: users only see their own data
create policy "audit_requests: public insert"
  on audit_requests for insert
  to anon, authenticated
  with check (true);

create policy "leads: own data"
  on leads for all using (auth.uid() = user_id);

create policy "pipeline_deals: own data"
  on pipeline_deals for all using (auth.uid() = user_id);

create policy "activities: own data"
  on activities for all using (auth.uid() = user_id);

create policy "email_sequences: own data"
  on email_sequences for all using (auth.uid() = user_id);

create policy "emails_sent: own data"
  on emails_sent for all using (auth.uid() = user_id);

create policy "revenue_goals: own data"
  on revenue_goals for all using (auth.uid() = user_id);

create policy "email_enrollments: via sequence"
  on email_enrollments for all
  using (sequence_id in (
    select id from email_sequences where user_id = auth.uid()
  ));

-- ============================================
-- INDEXES
-- ============================================
create index idx_leads_user          on leads(user_id);
create index idx_audit_requests_created_at on audit_requests(created_at desc);
create index idx_deals_user          on pipeline_deals(user_id);
create index idx_deals_stage         on pipeline_deals(stage);
create index idx_activities_deal     on activities(deal_id);
create index idx_emails_sent_user    on emails_sent(user_id);
create index idx_revenue_goals_user  on revenue_goals(user_id, year, month);

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

create trigger pipeline_deals_updated_at
  before update on pipeline_deals
  for each row execute function update_updated_at();

create trigger email_sequences_updated_at
  before update on email_sequences
  for each row execute function update_updated_at();
