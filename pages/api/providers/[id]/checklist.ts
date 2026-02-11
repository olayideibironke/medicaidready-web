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
  };
  checklist: ChecklistItem[];
};

type Store = {
  providers: Record<string, ProviderRecord>;
};

const STORE_PATH = path.join(process.cwd(), "data", "providers.json");

const DEFAULT_CHECKLIST: Array<Pick<ChecklistItem, "key" | "title">> = [
  { key: "provider_profile", title: "Provider profile completed" },
  { key: "credentialing", title: "Credentialing verified" },
  { key: "enrollment", title: "Enrollment documents submitted" },
  { key: "compliance_training", title: "Compliance training completed" },
  { key: "attestation", title: "Attestation signed" },
];

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
    if (!parsed || typeof parsed !== "object") throw new Error("bad_store");
    if (!parsed.providers || typeof parsed.providers !== "object") {
      return { providers: {} };
    }
    return parsed as Store;
  } catch {
    return { providers: {} };
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function buildDefaultChecklist(): ChecklistItem[] {
  const t = nowIso();
  return DEFAULT_CHECKLIST.map((x) => ({
    key: x.key,
    title: x.title,
    status: "not_started",
    updatedAt: t,
  }));
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
    checklist: buildDefaultChecklist(),
  };

  store.providers[id] = created;
  return created;
}

function normalizeKey(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const key = v.trim();
  return key ? key : null;
}

function normalizeStatus(v: unknown): ChecklistItemStatus | null {
  if (v === "not_started" || v === "in_progress" || v === "complete") return v;
  return null;
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

  const store = await readStore();
  const provider = ensureProvider(store, id);

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      providerId: id,
      checklist: provider.checklist,
      updatedAt: provider.updatedAt,
    });
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    // Body supports:
    // { items: [{ key, status, notes? }] }
    // OR { key, status, notes? }
    const body = req.body ?? {};
    const itemsInput = Array.isArray(body.items)
      ? body.items
      : body.key
      ? [body]
      : [];

    if (!itemsInput.length) {
      return res.status(400).json({
        ok: false,
        error: "invalid_body",
        message: "Provide { items: [{ key, status }] } or { key, status }.",
      });
    }

    const t = nowIso();
    const byKey = new Map(provider.checklist.map((i) => [i.key, i]));

    const updatedKeys: string[] = [];
    for (const it of itemsInput) {
      const key = normalizeKey(it?.key);
      const status = normalizeStatus(it?.status);

      if (!key || !status) continue;

      const existing = byKey.get(key);
      if (!existing) continue;

      existing.status = status;
      existing.updatedAt = t;
      if (typeof it?.notes === "string") existing.notes = it.notes;

      if (status === "complete") {
        existing.completedAt = existing.completedAt ?? t;
      } else {
        // If moving away from complete, clear completedAt
        delete existing.completedAt;
      }

      updatedKeys.push(key);
    }

    if (!updatedKeys.length) {
      return res.status(400).json({
        ok: false,
        error: "no_valid_updates",
        message: "No valid checklist updates were provided.",
      });
    }

    provider.updatedAt = t;
    store.providers[id] = provider;
    await writeStore(store);

    return res.status(200).json({
      ok: true,
      providerId: id,
      updatedKeys,
      checklist: provider.checklist,
      updatedAt: provider.updatedAt,
    });
  }

  res.setHeader("Allow", "GET, PUT, PATCH");
  return res.status(405).json({
    ok: false,
    error: "method_not_allowed",
    message: "Use GET, PUT, or PATCH.",
  });
}
