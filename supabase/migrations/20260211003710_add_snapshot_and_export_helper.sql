-- =========================================
-- Phase 20: Snapshot + Export Helper (infra)
-- FULL FILE REPLACEMENT
-- =========================================

-- Convenience function:
-- Creates an audit snapshot and returns snapshot_id
create or replace function snapshot_provider_for_export(
  p_provider_id uuid,
  p_snapshot_label text default null,
  p_snapshot_reason text default 'Export'
)
returns uuid
language plpgsql
as $$
declare
  v_label text;
  v_snapshot_id uuid;
begin
  v_label := coalesce(
    nullif(trim(p_snapshot_label), ''),
    'Export ' || to_char(now(), 'YYYY-MM-DD HH24:MI')
  );

  v_snapshot_id := create_audit_snapshot(
    p_provider_id,
    v_label,
    p_snapshot_reason
  );

  return v_snapshot_id;
end;
$$;

-- Optional: helper view to make "export by snapshot id" easy
-- (You can still query v_audit_snapshot_export directly.)
create or replace view v_latest_audit_snapshot_per_provider as
select distinct on (provider_id)
  provider_id,
  id as audit_snapshot_id,
  snapshot_label,
  snapshot_reason,
  snapshot_taken_at
from audit_snapshots
order by provider_id, snapshot_taken_at desc;
