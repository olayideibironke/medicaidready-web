-- =====================================
-- Phase 9: Category Registry (infra only)
-- requirements.category (text) -> requirements.category_id (FK)
-- =====================================

-- 1) Create categories registry
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,     -- machine-safe slug
  name text not null,            -- display name (existing text)
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Seed locked categories (exact current values)
insert into categories (code, name)
values
('background_screening', 'Background Screening'),
('health_safety', 'Health & Safety'),
('identity_employment', 'Identity & Employment'),
('insurance_business', 'Insurance & Business'),
('licensure_credentials', 'Licensure & Credentials'),
('licensure_enrollment', 'Licensure & Enrollment'),
('medicaid_enrollment', 'Medicaid Enrollment'),
('ownership_control', 'Ownership & Control'),
('policies_procedures', 'Policies & Procedures'),
('training_competency', 'Training & Competency')
on conflict (code) do nothing;

-- 3) Add category_id to requirements
alter table public.requirements
add column if not exists category_id uuid;

-- 4) Backfill category_id from requirements.category (exact match)
update public.requirements r
set category_id = c.id
from public.categories c
where r.category_id is null
  and trim(r.category) = c.name;

-- 5) Add FK constraint (guarded)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'requirements_category_id_fkey'
  ) then
    alter table public.requirements
      add constraint requirements_category_id_fkey
      foreign key (category_id)
      references public.categories(id);
  end if;
end $$;

-- 6) Enforce NOT NULL only if everything is backfilled
do $$
begin
  if not exists (
    select 1 from public.requirements where category_id is null
  ) then
    alter table public.requirements
      alter column category_id set not null;
  end if;
end $$;

-- 7) Keep requirements.category text for now (non-breaking)
-- Safe to deprecate after app switches to category_id
