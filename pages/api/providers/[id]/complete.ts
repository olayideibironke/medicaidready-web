import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

type ChecklistItemStatus = "not_started" | "in_progress" | "complete";

type ChecklistItem = {
  key: string;
  title: string;
  status: ChecklistItemStatus;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
};

type ProviderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  onboard?: {
    status: "not_started" | "in_progress" | "complete";
    startedAt?: string;
    completedAt?: string;
  };
  checklist: ChecklistItem[];
};

type Store = { providers: Record<string, ProviderRecord> };

const STORE_PATH = path.join(process.cwd(), "data", "providers.json");

function nowIso() {
  return new Date().toISOString();
}

function getId(req: NextApiRequest): string | null {
  const raw = req.query?.id;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim();
  return null;
}

async function readStore(): Promise<Store> {
  try {
    const buf = await fs.readFile(STORE_PATH);
    const parsed = JSON.parse(buf.toString());
    if (!parsed?.providers || typeof parsed.providers !== "object") return { providers: {} };
    return parsed as Store;
  } catch {
    return { providers: {} };
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function ensureProvider(store: Store, id: string): ProviderRecord {
  const t = nowIso();
  const existing = store.providers[id];
  if (existing) return existing;

  const created: ProviderRecord = {
    id,
    createdAt: t,
    updatedAt: t,
    onboard: { status: "not_started" },
    checklist: [
      { key: "provider_profile", title: "Provider profile completed", status: "not_started", updatedAt: t },
      { key: "credentialing", title: "Credentialing verified", status: "not_started", updatedAt: t },
      { key: "enrollment", title: "Enrollment documents submitted", status: "not_started", updatedAt: t },
      { key: "compliance_training", title: "Compliance training completed", status: "not_started", updatedAt: t },
      { key: "attestation", title: "Attestation signed", status: "not_started", updatedAt: t },
    ],
  };

  store.providers[id] = created;
  return created;
}

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = getId(req);
  if (!id) {
    return res.status(400).json({
      ok: false,
      error: "missing_provider_id",
      message: "Provider id is required in the URL path.",
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      ok: false,
      error: "method_not_allowed",
      message: "Use POST.",
    });
  }

  // POST body:
  // { key: "credentialing", notes?: "..." }
  // OR { completeOnboarding: true }
  const body = req.body ?? {};

  const store = await readStore();
  const provider = ensureProvider(store, id);
  const t = nowIso();

  // Option A: complete onboarding
  if (body?.completeOnboarding === true) {
    provider.onboard = provider.onboard ?? { status: "not_started" };
    provider.onboard.status = "complete";
    provider.onboard.startedAt = provider.onboard.startedAt ?? t;
    provider.onboard.completedAt = provider.onboard.completedAt ?? t;

    provider.updatedAt = t;
    store.providers[id] = provider;
    await writeStore(store);

    return res.status(200).json({
      ok: true,
      providerId: id,
      action: "onboarding_completed",
      onboard: provider.onboard,
      updatedAt: provider.updatedAt,
    });
  }

  // Option B: complete a checklist item
  const key = cleanString(body?.key);
  if (!key) {
    return res.status(400).json({
      ok: false,
      error: "invalid_body",
      message: "Provide { key: '<checklist_item_key>' } or { completeOnboarding: true }.",
    });
  }

  const item = provider.checklist.find((i) => i.key === key);
  if (!item) {
    return res.status(404).json({
      ok: false,
      error: "checklist_item_not_found",
      message: `No checklist item found for key '${key}'.`,
    });
  }

  item.status = "complete";
  item.updatedAt = t;
  item.completedAt = item.completedAt ?? t;
  if (typeof body?.notes === "string") item.notes = body.notes;

  provider.updatedAt = t;

  store.providers[id] = provider;
  await writeStore(store);

  return res.status(200).json({
    ok: true,
    providerId: id,
    action: "checklist_item_completed",
    completedKey: key,
    checklist: provider.checklist,
    updatedAt: provider.updatedAt,
  });
}
