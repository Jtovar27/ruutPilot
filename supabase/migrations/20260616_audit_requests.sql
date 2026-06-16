-- Public validation requests for the RuutPilot audit landing flow.

create table if not exists audit_requests (
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

alter table audit_requests enable row level security;

drop policy if exists "audit_requests: public insert" on audit_requests;

create policy "audit_requests: public insert"
  on audit_requests for insert
  to anon, authenticated
  with check (true);

create index if not exists idx_audit_requests_created_at
  on audit_requests(created_at desc);
