-- =========================================
-- Phase 16: Due Date Computation Engine (infra)
-- FULL FILE REPLACEMENT
-- =========================================

-- 1) Helper function: compute next due date
-- Uses renewal rule + last_completed_date (or effective_start_date fallback)
create or replace function compute_next_due_date(
  p_renewal_rule_code text,
  p_last_completed_date date,
  p_effective_start_date date
)
returns date
language plpgsql
as $$
declare
  base_date date;
begin
  base_date := coalesce(p_last_completed_date, p_effective_start_date, current_date);

  case lower(p_renewal_rule_code)
    when 'annual' then
      return base_date + interval '1 year';
    when 'biennial' then
      return base_date + interval '2 years';
    when 'triennial' then
      return base_date + interval '3 years';
    when 'on_hire' then
      return base_date; -- due immediately at hire
    when 'on_change' then
      return null;      -- event-driven
    when 'event_based' then
      return null;      -- event-driven
    when 'one_time' then
      return null;      -- no renewal
    when 'custom' then
      return null;      -- custom logic handled externally
    else
      return null;
  end case;
end;
$$;

-- 2) Procedure: recompute next_due_date for a provider
create or replace function recompute_provider_due_dates(p_provider_id uuid)
returns void
language plpgsql
as $$
begin
  update provider_requirement_progress prp
  set next_due_date = compute_next_due_date(
    rr.code,
    prp.last_completed_date,
    r.effective_start_date
  )
  from requirements r
  join renewal_rules rr on rr.id = r.renewal_rule_id
  where prp.provider_id = p_provider_id
    and prp.requirement_id = r.id;
end;
$$;

-- 3) Procedure: recompute due dates for ALL providers (batch-safe)
create or replace function recompute_all_due_dates()
returns void
language plpgsql
as $$
begin
  update provider_requirement_progress prp
  set next_due_date = compute_next_due_date(
    rr.code,
    prp.last_completed_date,
    r.effective_start_date
  )
  from requirements r
  join renewal_rules rr on rr.id = r.renewal_rule_id
  where prp.requirement_id = r.id;
end;
$$;

-- 4) Helper VIEW: provider due-date timeline
create or replace view v_provider_due_dates as
select
  p.id as provider_id,
  p.name as provider_name,
  r.id as requirement_id,
  r.name as requirement_name,
  rr.code as renewal_rule,
  prp.status,
  prp.last_completed_date,
  prp.next_due_date
from provider_requirement_progress prp
join providers p on p.id = prp.provider_id
join requirements r on r.id = prp.requirement_id
join renewal_rules rr on rr.id = r.renewal_rule_id;
