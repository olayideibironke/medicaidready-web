export const APPLYREADY_RESUME_KEY = "medicaidready.applyready.resume.v1";

export type ApplyReadyResumeStatus = {
  resumeName: string;
  targetRole: string;
  resumeFormat: string;
  resumeLocation: string;
  notes: string;
  hasCurrentResume: boolean;
  reviewedContactInfo: boolean;
  addedRecentExperience: boolean;
  addedSkills: boolean;
  quantifiedImpact: boolean;
  savedAsPdf: boolean;
  readyForSecureUpload: boolean;
  updatedAt: string;
};

export const EMPTY_APPLYREADY_RESUME_STATUS: ApplyReadyResumeStatus = {
  resumeName: "",
  targetRole: "",
  resumeFormat: "",
  resumeLocation: "",
  notes: "",
  hasCurrentResume: false,
  reviewedContactInfo: false,
  addedRecentExperience: false,
  addedSkills: false,
  quantifiedImpact: false,
  savedAsPdf: false,
  readyForSecureUpload: false,
  updatedAt: "",
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getApplyReadyResumeStatus(): ApplyReadyResumeStatus {
  if (!canUseStorage()) return EMPTY_APPLYREADY_RESUME_STATUS;

  try {
    const raw = window.localStorage.getItem(APPLYREADY_RESUME_KEY);

    if (!raw) return EMPTY_APPLYREADY_RESUME_STATUS;

    const parsed = JSON.parse(raw) as Partial<ApplyReadyResumeStatus>;

    return {
      resumeName: typeof parsed.resumeName === "string" ? parsed.resumeName : "",
      targetRole: typeof parsed.targetRole === "string" ? parsed.targetRole : "",
      resumeFormat: typeof parsed.resumeFormat === "string" ? parsed.resumeFormat : "",
      resumeLocation: typeof parsed.resumeLocation === "string" ? parsed.resumeLocation : "",
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
      hasCurrentResume: Boolean(parsed.hasCurrentResume),
      reviewedContactInfo: Boolean(parsed.reviewedContactInfo),
      addedRecentExperience: Boolean(parsed.addedRecentExperience),
      addedSkills: Boolean(parsed.addedSkills),
      quantifiedImpact: Boolean(parsed.quantifiedImpact),
      savedAsPdf: Boolean(parsed.savedAsPdf),
      readyForSecureUpload: Boolean(parsed.readyForSecureUpload),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return EMPTY_APPLYREADY_RESUME_STATUS;
  }
}

export function saveApplyReadyResumeStatus(status: ApplyReadyResumeStatus) {
  if (!canUseStorage()) return;

  const nextStatus: ApplyReadyResumeStatus = {
    ...status,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(APPLYREADY_RESUME_KEY, JSON.stringify(nextStatus));
  window.dispatchEvent(new Event("applyready:resume-updated"));
}

export function clearApplyReadyResumeStatus() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(APPLYREADY_RESUME_KEY);
  window.dispatchEvent(new Event("applyready:resume-updated"));
}

export function isApplyReadyResumeStarted(status: ApplyReadyResumeStatus): boolean {
  return Boolean(
    status.resumeName.trim() ||
      status.targetRole.trim() ||
      status.resumeFormat.trim() ||
      status.resumeLocation.trim() ||
      status.notes.trim() ||
      status.hasCurrentResume ||
      status.reviewedContactInfo ||
      status.addedRecentExperience ||
      status.addedSkills ||
      status.quantifiedImpact ||
      status.savedAsPdf ||
      status.readyForSecureUpload
  );
}

export function calculateApplyReadyResumeCompletion(status: ApplyReadyResumeStatus): number {
  const checks = [
    status.resumeName.trim(),
    status.targetRole.trim(),
    status.resumeFormat.trim(),
    status.resumeLocation.trim(),
    status.hasCurrentResume,
    status.reviewedContactInfo,
    status.addedRecentExperience,
    status.addedSkills,
    status.quantifiedImpact,
    status.savedAsPdf,
    status.readyForSecureUpload,
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}