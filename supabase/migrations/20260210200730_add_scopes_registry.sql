-- =====================================
-- Phase 8: Scope Registry (infra only)
-- requirements.scope (text) -> requirements.scope_id (FK)
-- =====================================

-- 1) Create scopes registry
create table if not exists scopes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,   -- 'ORG', 'STAFF'
  name text not null,          -- 'Organization', 'Staff'
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Seed locked scopes
insert into scopes (code, name)
values
('ORG', 'Organization'),
('STAFF', 'Staff')
on conflict (code) do nothing;

-- 3) Add scope_id to requirements
alter table public.requirements
add column if not exists scope_id uuid;

-- 4) Backfill scope_id from requirements.scope (case-insensitive)
update public.requirements r
set scope_id = s.id
from public.scopes s
where r.scope_id is null
  and upper(trim(r.scope)) = s.code;

-- 5) Add FK constraint (guarded)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'requirements_scope_id_fkey'
  ) then
    alter table public.requirements
      add constraint requirements_scope_id_fkey
      foreign key (scope_id)
      references public.scopes(id);
  end if;
end $$;

-- 6) Enforce NOT NULL only if everything is backfilled
do $$
begin
  if not exists (
    select 1 from public.requirements where scope_id is null
  ) then
    alter table public.requirements
      alter column scope_id set not null;
  end if;
end $$;

-- 7) Keep requirements.scope text for now (non-breaking)
-- Can be deprecated after app switches to scope_id
