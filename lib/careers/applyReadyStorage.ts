export const APPLYREADY_SAVED_JOBS_KEY = "medicaidready.applyready.savedJobs.v1";

export type SavedJobRecord = {
  jobId: string;
  savedAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRawSavedJobs(): SavedJobRecord[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(APPLYREADY_SAVED_JOBS_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.jobId === "string")
      .map((item) => ({
        jobId: item.jobId,
        savedAt:
          typeof item.savedAt === "string" && item.savedAt.trim()
            ? item.savedAt
            : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

function writeRawSavedJobs(records: SavedJobRecord[]) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(APPLYREADY_SAVED_JOBS_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event("applyready:saved-jobs-updated"));
}

export function getSavedJobRecords(): SavedJobRecord[] {
  const seen = new Set<string>();
  const records: SavedJobRecord[] = [];

  for (const record of readRawSavedJobs()) {
    if (seen.has(record.jobId)) continue;

    seen.add(record.jobId);
    records.push(record);
  }

  return records.sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

export function getSavedJobIds(): string[] {
  return getSavedJobRecords().map((record) => record.jobId);
}

export function isJobSaved(jobId: string): boolean {
  return getSavedJobIds().includes(jobId);
}

export function saveJob(jobId: string) {
  const records = getSavedJobRecords();

  if (records.some((record) => record.jobId === jobId)) return;

  writeRawSavedJobs([
    {
      jobId,
      savedAt: new Date().toISOString(),
    },
    ...records,
  ]);
}

export function removeSavedJob(jobId: string) {
  writeRawSavedJobs(getSavedJobRecords().filter((record) => record.jobId !== jobId));
}

export function toggleSavedJob(jobId: string): boolean {
  if (isJobSaved(jobId)) {
    removeSavedJob(jobId);
    return false;
  }

  saveJob(jobId);
  return true;
}