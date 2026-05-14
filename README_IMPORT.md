# MedicaidReady Careers 50-Job Seed Import

Files:
- data/careers_seed_jobs_50.json
- scripts/import-careers-jobs.js

Safe workflow:
1. Copy `careers_seed_jobs_50.json` into your project under:
   data/careers_seed_jobs_50.json

2. Copy `import-careers-jobs.js` into your project under:
   scripts/import-careers-jobs.js

3. From project root, run dry-run first:
   node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json --dry-run

4. Import to Supabase:
   node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json

Safer review option:
   node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json --force-status pending_review

This script only upserts into `careers_jobs` using `slug`.
It reads `.env.local` for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
It does not touch existing MedicaidReady quiz, guide, Stripe, PDF, provider, or consumer tables.
