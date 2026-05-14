# MedicaidReady Careers Batch 2 — 100 curated jobs

Created for MedicaidReady Careers on 2026-05-12.

This package contains 100 curated live job listings for the MedicaidReady Careers job board.

Files:
- data/careers_seed_jobs_100_batch2.json
- scripts/import-careers-jobs.js

Dry run:
node scripts/import-careers-jobs.js data/careers_seed_jobs_100_batch2.json --dry-run

Import:
node scripts/import-careers-jobs.js data/careers_seed_jobs_100_batch2.json

Notes:
- The import script inserts/upserts rows into careers_jobs only.
- It does not touch MedicaidReady quiz, Stripe, PDF guide delivery, provider APIs, or public site code.
- Jobs are marked status=approved, source_type=imported, payment_status=free, payment_tier=free.
- No Git push is required for job data; the live site reads jobs from Supabase.
