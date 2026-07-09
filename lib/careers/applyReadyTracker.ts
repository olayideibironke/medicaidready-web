export const APPLYREADY_TRACKER_KEY = "medicaidready.applyready.tracker.v1";

export type ApplyReadyApplicationStatus =
  | "Saved"
  | "Preparing"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Not selected"
  | "Follow up"
  | "Archived";

export type ApplyReadyApplication = {
  id: string;
  title: string;
  company: string;
  location: string;
  jobUrl: string;
  status: ApplyReadyApplicationStatus;
  nextStepDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const APPLYREADY_APPLICATION_STATUSES: ApplyReadyApplicationStatus[] = [
  "Saved",
  "Preparing",
  "Applied",
  "Interview",
  "Offer",
  "Not selected",
  "Follow up",
  "Archived",
];

export const EMPTY_APPLYREADY_APPLICATION: ApplyReadyApplication = {
  id: "",
  title: "",
  company: "",
  location: "",
  jobUrl: "",
  status: "Saved",
  nextStepDate: "",
  notes: "",
  createdAt: "",
  updatedAt: "",
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `application_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeApplication(value: Partial<ApplyReadyApplication>): ApplyReadyApplication {
  const status = APPLYREADY_APPLICATION_STATUSES.includes(
    value.status as ApplyReadyApplicationStatus
  )
    ? (value.status as ApplyReadyApplicationStatus)
    : "Saved";

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : createId(),
    title: typeof value.title === "string" ? value.title : "",
    company: typeof value.company === "string" ? value.company : "",
    location: typeof value.location === "string" ? value.location : "",
    jobUrl: typeof value.jobUrl === "string" ? value.jobUrl : "",
    status,
    nextStepDate: typeof value.nextStepDate === "string" ? value.nextStepDate : "",
    notes: typeof value.notes === "string" ? value.notes : "",
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
  };
}

export function getApplyReadyApplications(): ApplyReadyApplication[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(APPLYREADY_TRACKER_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeApplication(item as Partial<ApplyReadyApplication>))
      .sort((a, b) => {
        const bTime = new Date(b.updatedAt).getTime();
        const aTime = new Date(a.updatedAt).getTime();

        return bTime - aTime;
      });
  } catch {
    return [];
  }
}

export function saveApplyReadyApplications(applications: ApplyReadyApplication[]) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(APPLYREADY_TRACKER_KEY, JSON.stringify(applications));
  window.dispatchEvent(new Event("applyready:tracker-updated"));
}

export function addApplyReadyApplication(
  application: Omit<ApplyReadyApplication, "id" | "createdAt" | "updatedAt">
): ApplyReadyApplication {
  const now = new Date().toISOString();
  const nextApplication: ApplyReadyApplication = {
    ...application,
    id: createId(),
    createdAt: now,
    updatedAt: now,
  };

  const applications = getApplyReadyApplications();
  saveApplyReadyApplications([nextApplication, ...applications]);

  return nextApplication;
}

export function updateApplyReadyApplication(
  id: string,
  updates: Partial<Omit<ApplyReadyApplication, "id" | "createdAt">>
): ApplyReadyApplication[] {
  const applications = getApplyReadyApplications();
  const nextApplications = applications.map((application) => {
    if (application.id !== id) return application;

    return normalizeApplication({
      ...application,
      ...updates,
      id: application.id,
      createdAt: application.createdAt,
      updatedAt: new Date().toISOString(),
    });
  });

  saveApplyReadyApplications(nextApplications);

  return nextApplications;
}

export function deleteApplyReadyApplication(id: string): ApplyReadyApplication[] {
  const applications = getApplyReadyApplications();
  const nextApplications = applications.filter((application) => application.id !== id);

  saveApplyReadyApplications(nextApplications);

  return nextApplications;
}

export function clearApplyReadyApplications() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(APPLYREADY_TRACKER_KEY);
  window.dispatchEvent(new Event("applyready:tracker-updated"));
}

export function countApplicationsByStatus(
  applications: ApplyReadyApplication[],
  status: ApplyReadyApplicationStatus
): number {
  return applications.filter((application) => application.status === status).length;
}

export function getActiveApplyReadyApplications(
  applications: ApplyReadyApplication[]
): ApplyReadyApplication[] {
  return applications.filter((application) => application.status !== "Archived");
}