-- =========================================
-- Phase 12: Automation Readiness (infra)
-- =========================================

-- 1) Add automation-ready date fields
alter table public.requirements
add column if not exists last_verified_date date,
add column if not exists next_due_date date;

-- 2) Add status field (lightweight, future-computed)
-- NOTE: This is NOT enforcing workflow yet.
alter table public.requirements
add column if not exists status text;

-- 3) Backfill status safely for existing data
update public.requirements
set status = coalesce(status, 'active');

-- 4) Optional guardrail: limit status values (soft governance)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'requirements_status_check'
  ) then
    alter table public.requirements
      add constraint requirements_status_check
      check (status in ('draft', 'active', 'deprecated', 'superseded'));
  end if;
end $$;

-- 5) Notes:
-- last_verified_date = when compliance was last confirmed
-- next_due_date = when action is next required
-- status will later be computed from dates + rules
