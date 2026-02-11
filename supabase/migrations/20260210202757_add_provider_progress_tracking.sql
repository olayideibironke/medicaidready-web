-- =========================================
-- Phase 15: Provider Progress Tracking (infra)
-- Tracks per-provider compliance against requirements
-- FULL FILE REPLACEMENT
-- =========================================

-- 1) Provider registry (lightweight; future-expandable)
-- NOTE: This assumes a provider entity will exist.
-- If you already have a providers table later, we can merge.
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider_type_id uuid not null references provider_types(id),
  jurisdiction_id uuid not null references jurisdictions(id),
  created_at timestamptz not null default now()
);

-- 2) Provider requirement progress (core tracking table)
create table if not exists provider_requirement_progress (
  id uuid primary key default gen_random_uuid(),

  provider_id uuid not null
    references providers(id)
    on delete cascade,

  requirement_id uuid not null
    references requirements(id),

  scope_id uuid not null
    references scopes(id),

  status text not null default 'pending',
  -- pending | complete | expired | waived | not_applicable

  last_completed_date date,
  next_due_date date,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (provider_id, requirement_id, scope_id)
);

-- 3) Status guardrail (soft governance)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'provider_requirement_progress_status_check'
  ) then
    alter table provider_requirement_progress
      add constraint provider_requirement_progress_status_check
      check (
        status in (
          'pending',
          'complete',
          'expired',
          'waived',
          'not_applicable'
        )
      );
  end if;
end $$;

-- 4) Auto-update updated_at timestamp
create or replace function set_updated_at_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_provider_requirement_progress_updated_at
on provider_requirement_progress;

create trigger trg_provider_requirement_progress_updated_at
before update on provider_requirement_progress
for each row
execute function set_updated_at_timestamp();

-- 5) Helper VIEW: provider compliance snapshot
create or replace view v_provider_compliance_snapshot as
select
  p.id as provider_id,
  p.name as provider_name,
  pt.code as provider_type,
  j.code as jurisdiction,
  s.code as scope,
  prp.status,
  prp.last_completed_date,
  prp.next_due_date,
  r.id as requirement_id,
  r.name as requirement_name,
  c.name as category
from provider_requirement_progress prp
join providers p on p.id = prp.provider_id
join provider_types pt on pt.id = p.provider_type_id
join jurisdictions j on j.id = p.jurisdiction_id
join scopes s on s.id = prp.scope_id
join requirements r on r.id = prp.requirement_id
join categories c on c.id = r.category_id;
