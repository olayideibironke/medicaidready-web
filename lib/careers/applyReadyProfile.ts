export const APPLYREADY_PROFILE_KEY = "medicaidready.applyready.profile.v1";

export type ApplyReadyProfile = {
  fullName: string;
  email: string;
  location: string;
  preferredRoles: string;
  workMode: string;
  salaryGoal: string;
  skills: string;
  careerInterests: string;
  updatedAt: string;
};

export const EMPTY_APPLYREADY_PROFILE: ApplyReadyProfile = {
  fullName: "",
  email: "",
  location: "",
  preferredRoles: "",
  workMode: "",
  salaryGoal: "",
  skills: "",
  careerInterests: "",
  updatedAt: "",
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getApplyReadyProfile(): ApplyReadyProfile {
  if (!canUseStorage()) return EMPTY_APPLYREADY_PROFILE;

  try {
    const raw = window.localStorage.getItem(APPLYREADY_PROFILE_KEY);

    if (!raw) return EMPTY_APPLYREADY_PROFILE;

    const parsed = JSON.parse(raw) as Partial<ApplyReadyProfile>;

    return {
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      location: typeof parsed.location === "string" ? parsed.location : "",
      preferredRoles: typeof parsed.preferredRoles === "string" ? parsed.preferredRoles : "",
      workMode: typeof parsed.workMode === "string" ? parsed.workMode : "",
      salaryGoal: typeof parsed.salaryGoal === "string" ? parsed.salaryGoal : "",
      skills: typeof parsed.skills === "string" ? parsed.skills : "",
      careerInterests: typeof parsed.careerInterests === "string" ? parsed.careerInterests : "",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return EMPTY_APPLYREADY_PROFILE;
  }
}

export function saveApplyReadyProfile(profile: ApplyReadyProfile) {
  if (!canUseStorage()) return;

  const nextProfile: ApplyReadyProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(APPLYREADY_PROFILE_KEY, JSON.stringify(nextProfile));
  window.dispatchEvent(new Event("applyready:profile-updated"));
}

export function clearApplyReadyProfile() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(APPLYREADY_PROFILE_KEY);
  window.dispatchEvent(new Event("applyready:profile-updated"));
}

export function isApplyReadyProfileStarted(profile: ApplyReadyProfile): boolean {
  return Boolean(
    profile.fullName.trim() ||
      profile.email.trim() ||
      profile.location.trim() ||
      profile.preferredRoles.trim() ||
      profile.workMode.trim() ||
      profile.salaryGoal.trim() ||
      profile.skills.trim() ||
      profile.careerInterests.trim()
  );
}