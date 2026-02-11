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

  // Optional metadata for Phase 24 listing/analytics
  meta?: {
    name?: string;
    provider_type_code?: string;
    jurisdiction_code?: string;
  };

  onboard?: {
    status: "not_started" | "in_progress" | "complete";
    startedAt?: string;
    completedAt?: string;
    contact?: { name?: string; email?: string; phone?: string };
    org?: { name?: string; npi?: string; medicaidId?: string };
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

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function readStore(): Promise<Store> {
  try {
    const buf = await fs.readFile(STORE_PATH);
    const parsed = JSON.parse(buf.toString());
    if (!parsed || typeof parsed !== "object") throw new Error("bad_store");
    if (!parsed.providers || typeof parsed.providers !== "object") return { providers: {} };
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

function computeProgress(items: ChecklistItem[]) {
  const total = items.length || 0;
  const complete = items.filter((i) => i.status === "complete").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;
  const notStarted = items.filter((i) => i.status === "not_started").length;
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);
  return { total, complete, inProgress, notStarted, percentComplete: pct };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = await readStore();

  if (req.method === "GET") {
    const providers = Object.values(store.providers)
      .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
      .map((p) => {
        const progress = computeProgress(p.checklist || []);
        return {
          id: p.id,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          meta: p.meta ?? {},
          onboardStatus: p.onboard?.status ?? "not_started",
          progress,
        };
      });

    return res.status(200).json({ ok: true, providers });
  }

  if (req.method === "POST") {
    // Accepts:
    // {
    //   id?: string,
    //   name?: string,
    //   provider_type_code?: string,
    //   jurisdiction_code?: string
    // }
    const body = req.body ?? {};
    const requestedId = cleanString(body?.id);
    const name = cleanString(body?.name);
    const provider_type_code = cleanString(body?.provider_type_code);
    const jurisdiction_code = cleanString(body?.jurisdiction_code);

    // Generate id if not provided
    const id =
      requestedId ??
      slugify(name ?? `provider-${Date.now()}`) + "-" + String(Date.now()).slice(-6);

    // Create or return existing
    const existing = store.providers[id];
    if (existing) {
      return res.status(200).json({
        ok: true,
        provider: {
          id: existing.id,
          createdAt: existing.createdAt,
          updatedAt: existing.updatedAt,
          meta: existing.meta ?? {},
          onboardStatus: existing.onboard?.status ?? "not_started",
          progress: computeProgress(existing.checklist || []),
        },
        created: false,
      });
    }

    const p = ensureProvider(store, id);
    p.meta = {
      ...(p.meta ?? {}),
      name,
      provider_type_code,
      jurisdiction_code,
    };
    p.updatedAt = nowIso();

    store.providers[id] = p;
    await writeStore(store);

    return res.status(201).json({
      ok: true,
      provider: {
        id: p.id,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        meta: p.meta ?? {},
        onboardStatus: p.onboard?.status ?? "not_started",
        progress: computeProgress(p.checklist || []),
      },
      created: true,
    });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({
    ok: false,
    error: "method_not_allowed",
    message: "Use GET or POST.",
  });
}
