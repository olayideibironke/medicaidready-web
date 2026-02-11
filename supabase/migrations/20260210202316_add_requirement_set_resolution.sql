-- =========================================
-- Phase 14: Requirement Set Resolution
-- provider_type + jurisdiction + scope -> active set
-- FULL FILE REPLACEMENT (Postgres-safe)
-- =========================================

-- 1) Guardrail: ensure only ONE active set per
-- (provider_type, jurisdiction, scope)
-- NOTE:
--  - No time-based functions allowed in partial indexes
--  - Temporal logic is handled in views below
create unique index if not exists uq_active_requirement_set
on requirement_sets (provider_type_id, jurisdiction_id, scope_id)
where is_active = true;

-- 2) Helper VIEW: resolves the active requirement set for "today"
-- Temporal logic lives here (allowed)
create or replace view v_active_requirement_sets as
select
  rs.id as requirement_set_id,
  rs.provider_type_id,
  rs.jurisdiction_id,
  rs.scope_id,
  rs.name,
  rs.description,
  rs.effective_start_date,
  rs.effective_end_date
from requirement_sets rs
where rs.is_active = true
  and rs.effective_start_date <= current_date
  and (rs.effective_end_date is null or rs.effective_end_date >= current_date);

-- 3) Helper VIEW: resolved checklist items (ordered)
create or replace view v_active_requirement_set_items as
select
  rs.provider_type_id,
  rs.jurisdiction_id,
  rs.scope_id,
  rsi.requirement_set_id,
  rsi.requirement_id,
  rsi.sort_order,
  rsi.is_required
from v_active_requirement_sets rs
join requirement_set_items rsi
  on rsi.requirement_set_id = rs.requirement_set_id
order by rsi.sort_order nulls last;
