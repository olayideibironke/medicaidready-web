import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

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
  checklist: Array<{
    key: string;
    title: string;
    status: "not_started" | "in_progress" | "complete";
    updatedAt: string;
    completedAt?: string;
    notes?: string;
  }>;
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

  const store = await readStore();
  const provider = ensureProvider(store, id);

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      providerId: id,
      onboard: provider.onboard ?? { status: "not_started" },
      updatedAt: provider.updatedAt,
    });
  }

  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    // Body supports:
    // {
    //   status?: "not_started" | "in_progress" | "complete",
    //   contact?: { name?: string, email?: string, phone?: string },
    //   org?: { name?: string, npi?: string, medicaidId?: string }
    // }
    const body = req.body ?? {};
    const t = nowIso();

    const current = provider.onboard ?? { status: "not_started" as const };
    const next = { ...current };

    const status = body?.status;
    if (status === "not_started" || status === "in_progress" || status === "complete") {
      next.status = status;
      if (status === "in_progress") {
        next.startedAt = next.startedAt ?? t;
        delete next.completedAt;
      }
      if (status === "complete") {
        next.startedAt = next.startedAt ?? t;
        next.completedAt = next.completedAt ?? t;
      }
      if (status === "not_started") {
        delete next.startedAt;
        delete next.completedAt;
      }
    } else {
      // If no status provided, default to in_progress (common onboarding behavior)
      if (current.status === "not_started") {
        next.status = "in_progress";
        next.startedAt = next.startedAt ?? t;
      }
    }

    const contact = body?.contact ?? {};
    const org = body?.org ?? {};

    next.contact = {
      ...(next.contact ?? {}),
      name: cleanString(contact?.name) ?? next.contact?.name,
      email: cleanString(contact?.email) ?? next.contact?.email,
      phone: cleanString(contact?.phone) ?? next.contact?.phone,
    };

    next.org = {
      ...(next.org ?? {}),
      name: cleanString(org?.name) ?? next.org?.name,
      npi: cleanString(org?.npi) ?? next.org?.npi,
      medicaidId: cleanString(org?.medicaidId) ?? next.org?.medicaidId,
    };

    provider.onboard = next;
    provider.updatedAt = t;
    store.providers[id] = provider;
    await writeStore(store);

    return res.status(200).json({
      ok: true,
      providerId: id,
      onboard: provider.onboard,
      updatedAt: provider.updatedAt,
    });
  }

  res.setHeader("Allow", "GET, POST, PUT, PATCH");
  return res.status(405).json({
    ok: false,
    error: "method_not_allowed",
    message: "Use GET, POST, PUT, or PATCH.",
  });
}
