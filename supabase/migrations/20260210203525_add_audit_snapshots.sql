-- =========================================
-- Phase 17: Audit Snapshots (infra)
-- FULL FILE REPLACEMENT
-- =========================================

-- 1) Snapshot header (one per audit event)
create table if not exists audit_snapshots (
  id uuid primary key default gen_random_uuid(),

  provider_id uuid not null
    references providers(id)
    on delete cascade,

  snapshot_label text,                -- e.g. "Annual Audit 2026"
  snapshot_reason text,               -- e.g. "Regulatory submission"
  snapshot_taken_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

-- 2) Snapshot items (frozen requirement state)
create table if not exists audit_snapshot_items (
  id uuid primary key default gen_random_uuid(),

  audit_snapshot_id uuid not null
    references audit_snapshots(id)
    on delete cascade,

  requirement_id uuid not null
    references requirements(id),

  scope_id uuid not null
    references scopes(id),

  status text not null,
  last_completed_date date,
  next_due_date date,

  requirement_name text not null,
  category_name text not null,
  renewal_rule_code text not null,

  created_at timestamptz not null default now(),

  unique (audit_snapshot_id, requirement_id, scope_id)
);

-- 3) Helper function: create audit snapshot for a provider
create or replace function create_audit_snapshot(
  p_provider_id uuid,
  p_snapshot_label text,
  p_snapshot_reason text
)
returns uuid
language plpgsql
as $$
declare
  v_snapshot_id uuid;
begin
  -- create snapshot header
  insert into audit_snapshots (provider_id, snapshot_label, snapshot_reason)
  values (p_provider_id, p_snapshot_label, p_snapshot_reason)
  returning id into v_snapshot_id;

  -- freeze current compliance state
  insert into audit_snapshot_items (
    audit_snapshot_id,
    requirement_id,
    scope_id,
    status,
    last_completed_date,
    next_due_date,
    requirement_name,
    category_name,
    renewal_rule_code
  )
  select
    v_snapshot_id,
    r.id,
    prp.scope_id,
    prp.status,
    prp.last_completed_date,
    prp.next_due_date,
    r.name,
    c.name,
    rr.code
  from provider_requirement_progress prp
  join requirements r on r.id = prp.requirement_id
  join categories c on c.id = r.category_id
  join renewal_rules rr on rr.id = r.renewal_rule_id
  where prp.provider_id = p_provider_id;

  return v_snapshot_id;
end;
$$;

-- 4) Helper VIEW: flattened audit snapshot (export-ready)
create or replace view v_audit_snapshot_export as
select
  a.id as audit_snapshot_id,
  a.snapshot_label,
  a.snapshot_reason,
  a.snapshot_taken_at,

  p.id as provider_id,
  p.name as provider_name,

  asi.requirement_id,
  asi.requirement_name,
  asi.category_name,
  asi.scope_id,
  s.code as scope,
  asi.status,
  asi.last_completed_date,
  asi.next_due_date,
  asi.renewal_rule_code
from audit_snapshots a
join providers p on p.id = a.provider_id
join audit_snapshot_items asi on asi.audit_snapshot_id = a.id
join scopes s on s.id = asi.scope_id;
