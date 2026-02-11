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
    contact?: { name?: string; email?: string; phone?: string };
    org?: { name?: string; npi?: string; medicaidId?: string };
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

function computeProgress(items: ChecklistItem[]) {
  const total = items.length || 0;
  const complete = items.filter((i) => i.status === "complete").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;
  const notStarted = items.filter((i) => i.status === "not_started").length;

  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);

  return { total, complete, inProgress, notStarted, percentComplete: pct };
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

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      error: "method_not_allowed",
      message: "Use GET.",
    });
  }

  const store = await readStore();
  const provider = ensureProvider(store, id);

  // Persist auto-create so the snapshot always has a record behind it
  store.providers[id] = provider;
  await writeStore(store);

  const progress = computeProgress(provider.checklist);

  return res.status(200).json({
    ok: true,
    providerId: id,
    createdAt: provider.createdAt,
    updatedAt: provider.updatedAt,
    onboard: provider.onboard ?? { status: "not_started" },
    checklist: provider.checklist,
    progress,
    snapshotAt: nowIso(),
  });
}
