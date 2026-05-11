-- MedicaidReady Careers — Phase 2 schema
-- Server-only access via service role. RLS enabled with no policies, so
-- anon and authenticated keys cannot read or write directly.

create table if not exists careers_jobs (
  id uuid primary key default gen_random_uuid(),

  slug text not null,
  title text not null,
  company text not null,
  category text,

  location text,
  work_mode text,
  employment_type text,

  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  salary_currency text not null default 'USD',
  salary_period text not null default 'year',
  salary_display text,

  summary text,
  description text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',

  apply_url text,
  source_type text not null default 'manual',

  status text not null default 'pending_review',
  featured boolean not null default false,

  expires_at timestamptz,
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint careers_jobs_slug_key unique (slug),
  constraint careers_jobs_work_mode_check
    check (work_mode is null or work_mode in ('remote', 'hybrid', 'on_site')),
  constraint careers_jobs_employment_type_check
    check (employment_type is null or employment_type in ('full_time', 'part_time', 'contract', 'internship')),
  constraint careers_jobs_salary_period_check
    check (salary_period in ('year', 'month', 'hour')),
  constraint careers_jobs_salary_currency_check
    check (char_length(salary_currency) = 3),
  constraint careers_jobs_status_check
    check (status in ('draft', 'pending_review', 'approved', 'rejected', 'archived', 'expired')),
  constraint careers_jobs_source_type_check
    check (source_type in ('manual', 'self_serve', 'imported', 'partner', 'sample')),
  constraint careers_jobs_salary_range_check
    check (salary_min is null or salary_max is null or salary_min <= salary_max)
);

-- Indexes for the common access patterns: list approved + sort by recency,
-- filter by category, expire jobs, and float featured listings.
create index if not exists careers_jobs_status_idx
  on careers_jobs (status);

create index if not exists careers_jobs_status_published_idx
  on careers_jobs (status, published_at desc nulls last);

create index if not exists careers_jobs_category_idx
  on careers_jobs (category)
  where category is not null;

create index if not exists careers_jobs_expires_at_idx
  on careers_jobs (expires_at)
  where expires_at is not null;

create index if not exists careers_jobs_featured_idx
  on careers_jobs (featured)
  where featured = true;

-- Maintain updated_at automatically.
create or replace function careers_jobs_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists careers_jobs_set_updated_at_trg on careers_jobs;
create trigger careers_jobs_set_updated_at_trg
before update on careers_jobs
for each row
execute function careers_jobs_set_updated_at();

-- RLS: enabled, no policies. Service role bypasses RLS, anon/authenticated are blocked.
alter table careers_jobs enable row level security;

comment on table careers_jobs is
  'MedicaidReady Careers — job listings. Phase 2: server-only access via service role; no public RLS policies yet.';
comment on column careers_jobs.slug is
  'URL-safe unique identifier used in /careers/jobs/[slug] routing.';
comment on column careers_jobs.status is
  'Lifecycle: draft, pending_review, approved, rejected, archived, expired.';
comment on column careers_jobs.source_type is
  'Origin of the listing: manual, self_serve, imported, partner, sample.';
comment on column careers_jobs.work_mode is
  'remote | hybrid | on_site.';
comment on column careers_jobs.employment_type is
  'full_time | part_time | contract | internship.';
