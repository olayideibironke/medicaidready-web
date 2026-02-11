-- =====================================
-- Phase 7: Jurisdictions Registry (infra)
-- requirements.state (text) -> requirements.jurisdiction_id (FK)
-- =====================================

-- 1) Create jurisdictions registry
create table if not exists jurisdictions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,      -- e.g. 'MD', 'DC'
  name text not null,             -- e.g. 'Maryland', 'District of Columbia'
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Seed baseline jurisdictions (expand later, content-free)
insert into jurisdictions (code, name)
values
('DC', 'District of Columbia'),
('MD', 'Maryland'),
('VA', 'Virginia'),
('WV', 'West Virginia'),
('DE', 'Delaware'),
('PA', 'Pennsylvania')
on conflict (code) do nothing;

-- 3) Add jurisdiction_id to requirements
alter table public.requirements
add column if not exists jurisdiction_id uuid;

-- 4) Backfill jurisdiction_id from requirements.state (supports 'MD', 'Maryland', case-insensitive)
update public.requirements r
set jurisdiction_id = j.id
from public.jurisdictions j
where r.jurisdiction_id is null
  and (
    upper(trim(r.state)) = j.code
    or lower(trim(r.state)) = lower(j.name)
  );

-- 5) Add FK constraint (guarded name)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'requirements_jurisdiction_id_fkey'
  ) then
    alter table public.requirements
      add constraint requirements_jurisdiction_id_fkey
      foreign key (jurisdiction_id)
      references public.jurisdictions(id);
  end if;
end $$;

-- 6) Enforce NOT NULL only if everything is backfilled
do $$
begin
  if not exists (
    select 1 from public.requirements where jurisdiction_id is null
  ) then
    alter table public.requirements
      alter column jurisdiction_id set not null;
  end if;
end $$;

-- 7) Optional: keep state text column for now (no breaking changes)
-- We can deprecate/remove it later after app code swaps to jurisdiction_id.
