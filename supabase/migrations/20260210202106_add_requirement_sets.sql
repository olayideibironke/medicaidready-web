-- =========================================
-- Phase 13: Requirement Sets (Bundling Engine)
-- provider_type + jurisdiction + scope
-- =========================================

-- 1) Create requirement_sets table
create table if not exists requirement_sets (
  id uuid primary key default gen_random_uuid(),

  provider_type_id uuid not null
    references provider_types(id),

  jurisdiction_id uuid not null
    references jurisdictions(id),

  scope_id uuid not null
    references scopes(id),

  name text not null,               -- e.g. "MD Home Health – Org"
  description text,

  effective_start_date date not null default current_date,
  effective_end_date date,

  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  unique (provider_type_id, jurisdiction_id, scope_id)
);

-- 2) Create requirement_set_items (many-to-many)
create table if not exists requirement_set_items (
  id uuid primary key default gen_random_uuid(),

  requirement_set_id uuid not null
    references requirement_sets(id)
    on delete cascade,

  requirement_id uuid not null
    references requirements(id),

  sort_order integer,

  is_required boolean not null default true,

  created_at timestamptz not null default now(),

  unique (requirement_set_id, requirement_id)
);

-- 3) Guardrail: logical effective dates on sets
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'requirement_sets_effective_dates_check'
  ) then
    alter table requirement_sets
      add constraint requirement_sets_effective_dates_check
      check (
        effective_end_date is null
        or effective_start_date <= effective_end_date
      );
  end if;
end $$;
