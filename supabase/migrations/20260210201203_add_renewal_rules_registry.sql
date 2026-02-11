-- =========================================
-- Phase 10: Renewal Rules Registry (infra)
-- requirements.renewal_rule (text) -> requirements.renewal_rule_id (FK)
-- =========================================

-- 1) Create renewal_rules registry
create table if not exists renewal_rules (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,     -- machine-safe slug
  name text not null,            -- display label
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Seed baseline rules (safe defaults; extend later)
-- These cover the common patterns without enforcing behavior yet.
insert into renewal_rules (code, name, description)
values
('annual', 'Annual', 'Renews every year'),
('biennial', 'Biennial', 'Renews every two years'),
('triennial', 'Triennial', 'Renews every three years'),
('event_based', 'Event-Based', 'Renews upon triggering event'),
('one_time', 'One-Time', 'No renewal required'),
('on_hire', 'On Hire', 'Required at hire/onboarding'),
('on_change', 'On Change', 'Required when changes occur')
on conflict (code) do nothing;

-- 3) Add renewal_rule_id to requirements
alter table public.requirements
add column if not exists renewal_rule_id uuid;

-- 4) Backfill from requirements.renewal_rule (flexible matching)
-- Supports exact name matches or common normalized strings.
update public.requirements r
set renewal_rule_id = rr.id
from public.renewal_rules rr
where r.renewal_rule_id is null
  and (
    lower(trim(r.renewal_rule)) = lower(rr.name)
    or lower(trim(r.renewal_rule)) = lower(replace(rr.code, '_', ' '))
    or lower(trim(r.renewal_rule)) = lower(rr.code)
  );

-- 5) Add FK constraint (guarded)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'requirements_renewal_rule_id_fkey'
  ) then
    alter table public.requirements
      add constraint requirements_renewal_rule_id_fkey
      foreign key (renewal_rule_id)
      references public.renewal_rules(id);
  end if;
end $$;

-- 6) Enforce NOT NULL only if everything is backfilled
do $$
begin
  if not exists (
    select 1 from public.requirements where renewal_rule_id is null
  ) then
    alter table public.requirements
      alter column renewal_rule_id set not null;
  end if;
end $$;

-- 7) Keep requirements.renewal_rule text for now (non-breaking)
-- Can be deprecated after app switches to renewal_rule_id
