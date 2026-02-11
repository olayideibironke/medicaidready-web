-- =========================================
-- Phase 11: Effective Dating & Versioning
-- =========================================

-- 1) Add effective dating columns
alter table public.requirements
add column if not exists effective_start_date date,
add column if not exists effective_end_date date;

-- 2) Add self-referential versioning link
alter table public.requirements
add column if not exists supersedes_requirement_id uuid;

-- 3) Add FK for supersedes (guarded)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'requirements_supersedes_requirement_id_fkey'
  ) then
    alter table public.requirements
      add constraint requirements_supersedes_requirement_id_fkey
      foreign key (supersedes_requirement_id)
      references public.requirements(id);
  end if;
end $$;

-- 4) Default effective_start_date for existing rows (safe)
update public.requirements
set effective_start_date = coalesce(effective_start_date, created_at::date);

-- 5) Optional: enforce logical date order (start <= end)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'requirements_effective_dates_check'
  ) then
    alter table public.requirements
      add constraint requirements_effective_dates_check
      check (
        effective_end_date is null
        or effective_start_date <= effective_end_date
      );
  end if;
end $$;

-- 6) NOTE:
-- effective_end_date NULL = currently active
-- supersedes_requirement_id NULL = original or latest version
