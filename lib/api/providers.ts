// lib/api/providers.ts

export type ChecklistStatus = "not_started" | "in_progress" | "complete";

export interface ChecklistItem {
  key: string;
  title: string;
  status: ChecklistStatus;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface OnboardData {
  status: "not_started" | "in_progress" | "complete";
  startedAt?: string;
  completedAt?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  org?: {
    name?: string;
    npi?: string;
    medicaidId?: string;
  };
}

export interface SnapshotResponse {
  ok: boolean;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  onboard: OnboardData;
  checklist: ChecklistItem[];
  progress: {
    total: number;
    complete: number;
    inProgress: number;
    notStarted: number;
    percentComplete: number;
  };
  snapshotAt: string;
}

const BASE = "/api/providers";

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}

/* ========================
   SNAPSHOT
======================== */

export async function getSnapshot(
  providerId: string
): Promise<SnapshotResponse> {
  return request(`${BASE}/${providerId}/snapshot`);
}

/* ========================
   CHECKLIST
======================== */

export async function getChecklist(providerId: string) {
  return request(`${BASE}/${providerId}/checklist`);
}

export async function updateChecklistItem(
  providerId: string,
  key: string,
  status: ChecklistStatus
) {
  return request(`${BASE}/${providerId}/checklist`, {
    method: "PATCH",
    body: JSON.stringify({ key, status }),
  });
}

/* ========================
   COMPLETE
======================== */

export async function completeChecklistItem(
  providerId: string,
  key: string
) {
  return request(`${BASE}/${providerId}/complete`, {
    method: "POST",
    body: JSON.stringify({ key }),
  });
}

export async function completeOnboarding(providerId: string) {
  return request(`${BASE}/${providerId}/complete`, {
    method: "POST",
    body: JSON.stringify({ completeOnboarding: true }),
  });
}

/* ========================
   ONBOARD
======================== */

export async function updateOnboard(
  providerId: string,
  payload: Partial<OnboardData>
) {
  return request(`${BASE}/${providerId}/onboard`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
