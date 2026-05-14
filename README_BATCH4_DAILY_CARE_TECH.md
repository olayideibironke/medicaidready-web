# MedicaidReady Careers — Batch 4 Daily 50

This package contains 50 curated jobs for the daily expansion batch:

- 25 care workforce jobs: CNA, patient care tech, hospice aide, nurse support tech.
- 25 healthcare tech/data jobs: healthcare data analyst, EHR/Epic analyst, provider data, claims systems, healthcare IT/product.

All rows are set to:
- status: approved
- source_type: imported
- payment_status: free
- payment_tier: free
- submitted_via: seed_import_batch_4_daily_50

Run dry run first:

```powershell
node scripts/import-careers-jobs.js data/careers_seed_jobs_50_batch4_daily_care_tech.json --dry-run
```

Then import:

```powershell
node scripts/import-careers-jobs.js data/careers_seed_jobs_50_batch4_daily_care_tech.json
```

Then immediately audit and clean:

```powershell
node scripts/audit-careers-jobs.js
node scripts/audit-careers-jobs.js --check-links --concurrency=4
```
