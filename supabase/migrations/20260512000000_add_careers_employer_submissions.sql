-- Phase 6: employer self-serve submissions, payment tracking, and job alerts.
-- All additive. No edits to prior migrations.

alter table careers_jobs
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists payment_tier text not null default 'free',
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists submitted_via text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'careers_jobs_payment_status_check') then
    alter table careers_jobs
      add constraint careers_jobs_payment_status_check
      check (payment_status in ('unpaid', 'paid', 'refunded', 'free'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'careers_jobs_payment_tier_check') then
    alter table careers_jobs
      add constraint careers_jobs_payment_tier_check
      check (payment_tier in ('free', 'standard', 'featured'));
  end if;
end $$;

create index if not exists careers_jobs_payment_status_idx
  on careers_jobs (payment_status);

create index if not exists careers_jobs_contact_email_idx
  on careers_jobs (contact_email)
  where contact_email is not null;

create index if not exists careers_jobs_stripe_session_idx
  on careers_jobs (stripe_session_id)
  where stripe_session_id is not null;

comment on column careers_jobs.payment_status is 'unpaid | paid | refunded | free.';
comment on column careers_jobs.payment_tier is 'free | standard | featured.';
comment on column careers_jobs.contact_email is 'Employer contact email captured at submission time.';
comment on column careers_jobs.contact_name is 'Employer contact name captured at submission time.';
comment on column careers_jobs.submitted_via is 'Origin of the submission, e.g. self_serve_form.';
comment on column careers_jobs.stripe_session_id is 'Last successful Stripe checkout session id for this job posting.';

-- Job seeker email capture for future Medicaid Careers alerts.
create table if not exists careers_job_alert_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'unknown',
  category text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz,

  constraint careers_job_alert_subscribers_status_check
    check (status in ('active', 'unsubscribed'))
);

create unique index if not exists careers_job_alert_subscribers_email_unique
  on careers_job_alert_subscribers (lower(email));

create index if not exists careers_job_alert_subscribers_status_idx
  on careers_job_alert_subscribers (status);

alter table careers_job_alert_subscribers enable row level security;

comment on table careers_job_alert_subscribers is
  'MedicaidReady Careers — job seeker email captures for future Medicaid careers alerts. Server-only access via service role.';
