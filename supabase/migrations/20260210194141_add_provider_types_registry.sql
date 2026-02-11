-- ===============================
-- Phase 6: Provider Type Registry (infra only)
-- Targets current schema: requirements table exists; providers table does not
-- ===============================

-- 1) Create provider_types registry table
create table if not exists provider_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Seed locked provider type list (idempotent)
insert into provider_types (code, display_name)
values
('home_health', 'Home Health'),
('personal_care', 'Personal Care'),
('skilled_nursing', 'Skilled Nursing'),
('assisted_living', 'Assisted Living'),
('adult_day_care', 'Adult Day Care'),
('behavioral_health', 'Behavioral Health'),
('substance_use_treatment', 'Substance Use Treatment'),
('physical_therapy', 'Physical Therapy'),
('occupational_therapy', 'Occupational Therapy'),
('speech_therapy', 'Speech Therapy'),
('hospice', 'Hospice'),
('palliative_care', 'Palliative Care'),
('durable_medical_equipment', 'Durable Medical Equipment'),
('transportation', 'Transportation'),
('case_management', 'Case Management'),
('care_coordination', 'Care Coordination'),
('early_intervention', 'Early Intervention'),
('home_and_community_based_services', 'Home and Community-Based Services')
on conflict (code) do nothing;

-- 3) Add provider_type_id to requirements (only if requirements exists)
do $$
begin
  if to_regclass('public.requirements') is not null then
    execute 'alter table public.requirements add column if not exists provider_type_id uuid;';
  end if;
end $$;

-- 4) Backfill requirements.provider_type_id from an existing text code column if present
-- We support either: requirements.provider_type OR requirements.provider_type_code
do $$
declare
  has_provider_type boolean;
  has_provider_type_code boolean;
begin
  if to_regclass('public.requirements') is null then
    return;
  end if;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'requirements'
      and column_name = 'provider_type'
  ) into has_provider_type;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'requirements'
      and column_name = 'provider_type_code'
  ) into has_provider_type_code;

  if has_provider_type then
    execute $sql$
      update public.requirements r
      set provider_type_id = pt.id
      from public.provider_types pt
      where r.provider_type_id is null
        and r.provider_type = pt.code
    $sql$;
  elsif has_provider_type_code then
    execute $sql$
      update public.requirements r
      set provider_type_id = pt.id
      from public.provider_types pt
      where r.provider_type_id is null
        and r.provider_type_code = pt.code
    $sql$;
  else
    -- No known text column to backfill from; leave nullable and stop safely.
    return;
  end if;
end $$;

-- 5) Add FK constraint from requirements.provider_type_id → provider_types.id (guarded)
do $$
begin
  if to_regclass('public.requirements') is null then
    return;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'requirements_provider_type_id_fkey'
  ) then
    alter table public.requirements
      add constraint requirements_provider_type_id_fkey
      foreign key (provider_type_id)
      references public.provider_types(id);
  end if;
end $$;

-- 6) Enforce NOT NULL only if everything is backfilled
do $$
begin
  if to_regclass('public.requirements') is null then
    return;
  end if;

  if not exists (
    select 1
    from public.requirements
    where provider_type_id is null
  ) then
    alter table public.requirements
      alter column provider_type_id set not null;
  end if;
end $$;
