-- =========================================
-- Phase 18B: Provider Onboarding Generator
-- FULL FILE REPLACEMENT
-- =========================================

-- This function:
-- - Resolves the ACTIVE requirement set for a provider + scope
-- - Inserts provider_requirement_progress rows
-- - Is idempotent (safe to re-run)
-- - Leaves status as 'pending'

create or replace function generate_provider_onboarding(
  p_provider_id uuid,
  p_scope_code text   -- 'ORG' or 'STAFF'
)
returns integer
language plpgsql
as $$
declare
  v_provider_type_id uuid;
  v_jurisdiction_id uuid;
  v_scope_id uuid;
  v_requirement_set_id uuid;
  v_inserted_count integer := 0;
begin
  -- 1) Resolve provider context
  select provider_type_id, jurisdiction_id
  into v_provider_type_id, v_jurisdiction_id
  from providers
  where id = p_provider_id;

  if v_provider_type_id is null or v_jurisdiction_id is null then
    raise exception 'Provider context not found for provider_id=%', p_provider_id;
  end if;

  -- 2) Resolve scope
  select id
  into v_scope_id
  from scopes
  where upper(code) = upper(p_scope_code);

  if v_scope_id is null then
    raise exception 'Invalid scope code: %', p_scope_code;
  end if;

  -- 3) Resolve ACTIVE requirement set (today)
  select requirement_set_id
  into v_requirement_set_id
  from v_active_requirement_sets
  where provider_type_id = v_provider_type_id
    and jurisdiction_id = v_jurisdiction_id
    and scope_id = v_scope_id
  limit 1;

  if v_requirement_set_id is null then
    raise exception
      'No active requirement set found for provider_type=%, jurisdiction=%, scope=%',
      v_provider_type_id, v_jurisdiction_id, v_scope_id;
  end if;

  -- 4) Insert progress rows (idempotent)
  insert into provider_requirement_progress (
    provider_id,
    requirement_id,
    scope_id,
    status
  )
  select
    p_provider_id,
    rsi.requirement_id,
    v_scope_id,
    'pending'
  from requirement_set_items rsi
  where rsi.requirement_set_id = v_requirement_set_id
  on conflict (provider_id, requirement_id, scope_id)
  do nothing;

  -- 5) Count how many rows now exist for this provider + scope
  select count(*)
  into v_inserted_count
  from provider_requirement_progress
  where provider_id = p_provider_id
    and scope_id = v_scope_id;

  return v_inserted_count;
end;
$$;
