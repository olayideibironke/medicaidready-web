# MedicaidReady Careers — Batch 3 Care Workforce + Healthcare Tech

This package contains:
- data/careers_seed_jobs_100_batch3_care_tech.json

Import using the existing script already in the project:

```powershell
cd C:\Users\Roger\OneDrive\Documents\medicaidready\medicaidready-web
node scripts/import-careers-jobs.js data/careers_seed_jobs_100_batch3_care_tech.json --dry-run
node scripts/import-careers-jobs.js data/careers_seed_jobs_100_batch3_care_tech.json
```

Then run the normal QA pipeline:

```powershell
node scripts/audit-careers-jobs.js
node scripts/audit-careers-jobs.js --check-links --concurrency=4
node scripts/archive-careers-broken-links.js "reports\LATEST-AUDIT.json" --dry-run
node scripts/archive-careers-broken-links.js "reports\LATEST-AUDIT.json"
node scripts/archive-careers-duplicates.js "reports\LATEST-AUDIT.json" --dry-run
node scripts/archive-careers-duplicates.js "reports\LATEST-AUDIT.json"
```

The jobs are curated from official employer career pages and Workday/official job pages.
Descriptions are paraphrased, not copied word-for-word.
