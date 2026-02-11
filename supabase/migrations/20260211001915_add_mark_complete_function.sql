-- =========================================
-- Phase 19: Mark Requirement Complete (scope-aware)
-- FULL FILE REPLACEMENT
-- =========================================

-- Marks a provider requirement as complete for a given scope,
-- sets last_completed_date, recomputes next_due_date, and updates status.
create or replace function mark_requirement_complete(
  p_provider_id uuid,
  p_requirement_id uuid,
  p_scope_code text,              -- 'ORG' or 'STAFF'
  p_completed_date date default current_date
)
returns void
language plpgsql
as $$
declare
  v_scope_id uuid;
begin
  -- Resolve scope_id
  select id
  into v_scope_id
  from scopes
  where upper(code) = upper(p_scope_code);

  if v_scope_id is null then
    raise exception 'Invalid scope code: %', p_scope_code;
  end if;

  -- Update progress row
  update provider_requirement_progress prp
  set
    status = 'complete',
    last_completed_date = p_completed_date
  where prp.provider_id = p_provider_id
    and prp.requirement_id = p_requirement_id
    and prp.scope_id = v_scope_id;

  if not found then
    raise exception
      'Progress row not found for provider_id=%, requirement_id=%, scope=%',
      p_provider_id, p_requirement_id, p_scope_code;
  end if;

  -- Recompute next due dates for this provider (updates next_due_date)
  perform recompute_provider_due_dates(p_provider_id);
end;
$$;

-- Convenience VIEW: quick completion overview
create or replace view v_provider_completion_summary as
select
  prp.provider_id,
  p.name as provider_name,
  s.code as scope,
  prp.status,
  count(*) as count
from provider_requirement_progress prp
join providers p on p.id = prp.provider_id
join scopes s on s.id = prp.scope_id
group by prp.provider_id, p.name, s.code, prp.status
order by prp.provider_id, s.code, prp.status;
