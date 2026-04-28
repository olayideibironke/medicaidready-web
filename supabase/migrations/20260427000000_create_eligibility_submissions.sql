create table if not exists eligibility_submissions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  state text not null,
  household_size integer not null,
  monthly_income numeric(12, 2) not null,
  age integer not null,
  employed boolean not null,
  ai_result text,
  qualified boolean,
  created_at timestamptz default now() not null
);

-- Index for email-based lookups
create index if not exists eligibility_submissions_email_idx
  on eligibility_submissions (email);

-- Index for analytics by state
create index if not exists eligibility_submissions_state_idx
  on eligibility_submissions (state);

-- RLS: deny all direct client access (server-only via service role)
alter table eligibility_submissions enable row level security;
