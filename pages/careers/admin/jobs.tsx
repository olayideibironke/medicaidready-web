import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  category: string | null;
  location: string | null;
  work_mode: "remote" | "hybrid" | "on_site" | null;
  employment_type: "full_time" | "part_time" | "contract" | "internship" | null;
  salary_min: number | string | null;
  salary_max: number | string | null;
  salary_currency: string;
  salary_period: string;
  salary_display: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  apply_url: string | null;
  source_type: string;
  status: string;
  featured: boolean;
  expires_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type AuthState = "checking" | "needs_login" | "disabled" | "authed";
type StatusFilter = "all" | Job["status"];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
  { value: "expired", label: "Expired" },
];

const SOURCE_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "self_serve", label: "Self-serve" },
  { value: "imported", label: "Imported" },
  { value: "partner", label: "Partner" },
  { value: "sample", label: "Sample" },
];

const WORK_MODE_OPTIONS = [
  { value: "", label: "—" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on_site", label: "On-site" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "", label: "—" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const SALARY_PERIOD_OPTIONS = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "hour", label: "Hour" },
];

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
);

type FormShape = {
  slug: string;
  title: string;
  company: string;
  category: string;
  location: string;
  work_mode: string;
  employment_type: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  salary_period: string;
  salary_display: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  apply_url: string;
  source_type: string;
  status: string;
  featured: boolean;
  expires_at: string;
  published_at: string;
};

const EMPTY_FORM: FormShape = {
  slug: "",
  title: "",
  company: "",
  category: "",
  location: "",
  work_mode: "",
  employment_type: "full_time",
  salary_min: "",
  salary_max: "",
  salary_currency: "USD",
  salary_period: "year",
  salary_display: "",
  summary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  apply_url: "",
  source_type: "manual",
  status: "draft",
  featured: false,
  expires_at: "",
  published_at: "",
};

function toDateTimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function jobToForm(j: Job): FormShape {
  return {
    slug: j.slug ?? "",
    title: j.title ?? "",
    company: j.company ?? "",
    category: j.category ?? "",
    location: j.location ?? "",
    work_mode: j.work_mode ?? "",
    employment_type: j.employment_type ?? "",
    salary_min: j.salary_min == null ? "" : String(j.salary_min),
    salary_max: j.salary_max == null ? "" : String(j.salary_max),
    salary_currency: j.salary_currency ?? "USD",
    salary_period: j.salary_period ?? "year",
    salary_display: j.salary_display ?? "",
    summary: j.summary ?? "",
    description: j.description ?? "",
    responsibilities: (j.responsibilities ?? []).join("\n"),
    requirements: (j.requirements ?? []).join("\n"),
    benefits: (j.benefits ?? []).join("\n"),
    apply_url: j.apply_url ?? "",
    source_type: j.source_type ?? "manual",
    status: j.status ?? "draft",
    featured: Boolean(j.featured),
    expires_at: toDateTimeLocal(j.expires_at),
    published_at: toDateTimeLocal(j.published_at),
  };
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminJobs() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadError, setLoadError] = useState("");

  const [keyInput, setKeyInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormShape>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/careers/admin/jobs");
      if (res.status === 401) {
        setAuth("needs_login");
        setJobs([]);
        return;
      }
      if (res.status === 503) {
        setAuth("disabled");
        return;
      }
      const json = (await res.json()) as { ok: boolean; jobs?: Job[]; error?: string };
      if (!res.ok || !json.ok) {
        setLoadError(json.error ?? "failed_to_load");
        return;
      }
      setAuth("authed");
      setLoadError("");
      setJobs(json.jobs ?? []);
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/careers/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyInput.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setLoginError(json.error ?? "invalid_key");
        return;
      }
      setKeyInput("");
      await refresh();
    } catch (e: unknown) {
      setLoginError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/careers/admin/logout", { method: "POST" });
    setAuth("needs_login");
    setJobs([]);
    setEditingId(null);
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setFormError("");
  }

  function openEdit(job: Job) {
    setForm(jobToForm(job));
    setEditingId(job.id);
    setFormError("");
  }

  function closeForm() {
    setEditingId(null);
    setFormError("");
  }

  async function quickPatch(id: string, patch: Partial<Job>) {
    const prev = jobs;
    setJobs((curr) => curr.map((j) => (j.id === id ? { ...j, ...patch } : j)));
    try {
      const res = await fetch(`/api/careers/admin/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`status_${res.status}`);
      const json = (await res.json()) as { ok: boolean; job?: Job; error?: string };
      if (!json.ok || !json.job) throw new Error(json.error ?? "update_failed");
      setJobs((curr) => curr.map((j) => (j.id === id ? json.job! : j)));
    } catch (e: unknown) {
      setJobs(prev);
      setLoadError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDelete(id: string) {
    const job = jobs.find((j) => j.id === id);
    const label = job ? `${job.title} — ${job.company}` : id;
    const ok = window.confirm(`Delete this job?\n\n${label}\n\nThis cannot be undone.`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/careers/admin/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(json.message ?? json.error ?? `status_${res.status}`);
      }
      setJobs((curr) => curr.filter((j) => j.id !== id));
      if (editingId === id) closeForm();
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) {
      setFormError("Title and company are required.");
      return;
    }
    setSaving(true);
    setFormError("");

    const body: Record<string, unknown> = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      company: form.company.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      work_mode: form.work_mode || null,
      employment_type: form.employment_type || null,
      salary_min: form.salary_min === "" ? null : Number(form.salary_min),
      salary_max: form.salary_max === "" ? null : Number(form.salary_max),
      salary_currency: form.salary_currency.trim().toUpperCase() || "USD",
      salary_period: form.salary_period || "year",
      salary_display: form.salary_display.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      responsibilities: form.responsibilities,
      requirements: form.requirements,
      benefits: form.benefits,
      apply_url: form.apply_url.trim(),
      source_type: form.source_type || "manual",
      status: form.status || "draft",
      featured: Boolean(form.featured),
      expires_at: form.expires_at || null,
      published_at: form.published_at || null,
    };

    try {
      const isNew = editingId === "new";
      const url = isNew
        ? "/api/careers/admin/jobs"
        : `/api/careers/admin/jobs/${editingId}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; job?: Job; error?: string; message?: string };
      if (!res.ok || !json.ok || !json.job) {
        throw new Error(json.message ?? json.error ?? `status_${res.status}`);
      }
      const saved = json.job;
      setJobs((curr) => {
        if (isNew) return [saved, ...curr];
        return curr.map((j) => (j.id === saved.id ? saved : j));
      });
      closeForm();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") return jobs;
    return jobs.filter((j) => j.status === statusFilter);
  }, [jobs, statusFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: jobs.length };
    for (const j of jobs) map[j.status] = (map[j.status] ?? 0) + 1;
    return map;
  }, [jobs]);

  return (
    <>
      <Head>
        <title>Admin · MedicaidReady Careers</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="careers-admin">
        <header className="ca-header">
          <div className="ca-header-inner">
            <div className="ca-title">
              <span className="ca-title-mark">CA</span>
              <span>
                MedicaidReady Careers <span className="ca-title-accent">· Admin</span>
              </span>
            </div>
            {auth === "authed" && (
              <button type="button" className="ca-btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            )}
          </div>
        </header>

        <main className="ca-main">
          {auth === "checking" && <div className="ca-status">Loading…</div>}

          {auth === "disabled" && (
            <div className="ca-card ca-card-narrow">
              <h1 className="ca-h1">Careers admin is disabled</h1>
              <p className="ca-text">
                Set <code className="ca-code">CAREERS_ADMIN_KEY</code> (12+ characters) in your
                environment and redeploy to enable this page.
              </p>
            </div>
          )}

          {auth === "needs_login" && (
            <div className="ca-card ca-card-narrow">
              <h1 className="ca-h1">Enter admin key</h1>
              <p className="ca-text">
                This area manages MedicaidReady Careers job listings. Enter the shared admin key to
                continue.
              </p>
              <form onSubmit={handleLogin} className="ca-login-form">
                <input
                  type="password"
                  className="ca-input"
                  placeholder="Admin key"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  autoFocus
                  autoComplete="current-password"
                  required
                />
                <button
                  type="submit"
                  className="ca-btn-primary"
                  disabled={loggingIn || !keyInput.trim()}
                >
                  {loggingIn ? "Checking…" : "Sign in"}
                </button>
              </form>
              {loginError && (
                <p className="ca-error" role="alert">
                  {loginError === "invalid_key" ? "Invalid admin key." : loginError}
                </p>
              )}
            </div>
          )}

          {auth === "authed" && editingId === null && (
            <>
              <div className="ca-toolbar">
                <div className="ca-filters" role="tablist" aria-label="Status filter">
                  <button
                    type="button"
                    className={`ca-chip${statusFilter === "all" ? " is-active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All <span className="ca-chip-count">{counts.all ?? 0}</span>
                  </button>
                  {STATUS_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={`ca-chip${statusFilter === o.value ? " is-active" : ""}`}
                      onClick={() => setStatusFilter(o.value as StatusFilter)}
                    >
                      {o.label} <span className="ca-chip-count">{counts[o.value] ?? 0}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="ca-btn-primary" onClick={openCreate}>
                  + New job
                </button>
              </div>

              {loadError && (
                <div className="ca-banner ca-banner-error" role="alert">
                  {loadError}
                </div>
              )}

              {jobs.length === 0 ? (
                <div className="ca-empty">
                  No jobs yet. Click <strong>New job</strong> to create the first listing.
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="ca-empty">No jobs match this filter.</div>
              ) : (
                <div className="ca-table-wrap">
                  <table className="ca-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Updated</th>
                        <th aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <div className="ca-job-title">{job.title}</div>
                            <div className="ca-job-sub">
                              {job.company}
                              {job.location ? ` · ${job.location}` : ""}
                            </div>
                            <div className="ca-job-slug">/{job.slug}</div>
                          </td>
                          <td>
                            <select
                              className="ca-select-inline"
                              value={job.status}
                              onChange={(e) =>
                                void quickPatch(job.id, { status: e.target.value })
                              }
                              aria-label={`Status for ${job.title}`}
                            >
                              {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <label className="ca-toggle">
                              <input
                                type="checkbox"
                                checked={job.featured}
                                onChange={(e) =>
                                  void quickPatch(job.id, { featured: e.target.checked })
                                }
                                aria-label={`Featured: ${job.title}`}
                              />
                              <span>{job.featured ? "Yes" : "No"}</span>
                            </label>
                          </td>
                          <td className="ca-cell-time">{formatTimestamp(job.updated_at)}</td>
                          <td className="ca-cell-actions">
                            <button
                              type="button"
                              className="ca-btn-ghost-sm"
                              onClick={() => openEdit(job)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="ca-btn-danger-sm"
                              onClick={() => void handleDelete(job.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {auth === "authed" && editingId !== null && (
            <form className="ca-form ca-card" onSubmit={handleSave}>
              <div className="ca-form-head">
                <h1 className="ca-h1">
                  {editingId === "new" ? "New job" : "Edit job"}
                </h1>
                <button type="button" className="ca-btn-ghost" onClick={closeForm}>
                  Cancel
                </button>
              </div>

              <div className="ca-form-row">
                <div className="ca-field">
                  <label htmlFor="f-title">Title *</label>
                  <input
                    id="f-title"
                    className="ca-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="ca-field">
                  <label htmlFor="f-company">Company *</label>
                  <input
                    id="f-company"
                    className="ca-input"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="ca-form-row">
                <div className="ca-field">
                  <label htmlFor="f-slug">Slug</label>
                  <input
                    id="f-slug"
                    className="ca-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated from title if blank"
                  />
                </div>
                <div className="ca-field">
                  <label htmlFor="f-category">Category</label>
                  <input
                    id="f-category"
                    className="ca-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="eligibility, compliance, billing, …"
                  />
                </div>
              </div>

              <div className="ca-form-row">
                <div className="ca-field">
                  <label htmlFor="f-location">Location</label>
                  <input
                    id="f-location"
                    className="ca-input"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <div className="ca-field ca-field-pair">
                  <div>
                    <label htmlFor="f-mode">Work mode</label>
                    <select
                      id="f-mode"
                      className="ca-input"
                      value={form.work_mode}
                      onChange={(e) => setForm({ ...form, work_mode: e.target.value })}
                    >
                      {WORK_MODE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-emp">Employment type</label>
                    <select
                      id="f-emp"
                      className="ca-input"
                      value={form.employment_type}
                      onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                    >
                      {EMPLOYMENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="ca-form-row">
                <div className="ca-field ca-field-pair">
                  <div>
                    <label htmlFor="f-smin">Salary min</label>
                    <input
                      id="f-smin"
                      type="number"
                      step="0.01"
                      className="ca-input"
                      value={form.salary_min}
                      onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="f-smax">Salary max</label>
                    <input
                      id="f-smax"
                      type="number"
                      step="0.01"
                      className="ca-input"
                      value={form.salary_max}
                      onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ca-field ca-field-pair">
                  <div>
                    <label htmlFor="f-cur">Currency</label>
                    <input
                      id="f-cur"
                      className="ca-input"
                      maxLength={3}
                      value={form.salary_currency}
                      onChange={(e) =>
                        setForm({ ...form, salary_currency: e.target.value.toUpperCase() })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="f-per">Period</label>
                    <select
                      id="f-per"
                      className="ca-input"
                      value={form.salary_period}
                      onChange={(e) => setForm({ ...form, salary_period: e.target.value })}
                    >
                      {SALARY_PERIOD_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="ca-field">
                <label htmlFor="f-sdisp">Salary display (optional override)</label>
                <input
                  id="f-sdisp"
                  className="ca-input"
                  value={form.salary_display}
                  onChange={(e) => setForm({ ...form, salary_display: e.target.value })}
                  placeholder="e.g. $50,000 – $60,000 / year"
                />
              </div>

              <div className="ca-field">
                <label htmlFor="f-sum">Summary</label>
                <textarea
                  id="f-sum"
                  className="ca-input ca-textarea-sm"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="ca-field">
                <label htmlFor="f-desc">Description</label>
                <textarea
                  id="f-desc"
                  className="ca-input ca-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="ca-field">
                <label htmlFor="f-resp">Responsibilities — one per line</label>
                <textarea
                  id="f-resp"
                  className="ca-input ca-textarea"
                  value={form.responsibilities}
                  onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                />
              </div>

              <div className="ca-field">
                <label htmlFor="f-req">Requirements — one per line</label>
                <textarea
                  id="f-req"
                  className="ca-input ca-textarea"
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                />
              </div>

              <div className="ca-field">
                <label htmlFor="f-ben">Benefits — one per line</label>
                <textarea
                  id="f-ben"
                  className="ca-input ca-textarea"
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                />
              </div>

              <div className="ca-form-row">
                <div className="ca-field">
                  <label htmlFor="f-apply">Apply URL</label>
                  <input
                    id="f-apply"
                    className="ca-input"
                    value={form.apply_url}
                    onChange={(e) => setForm({ ...form, apply_url: e.target.value })}
                    placeholder="https://"
                  />
                </div>
                <div className="ca-field">
                  <label htmlFor="f-src">Source</label>
                  <select
                    id="f-src"
                    className="ca-input"
                    value={form.source_type}
                    onChange={(e) => setForm({ ...form, source_type: e.target.value })}
                  >
                    {SOURCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ca-form-row">
                <div className="ca-field">
                  <label htmlFor="f-status">Status</label>
                  <select
                    id="f-status"
                    className="ca-input"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ca-field ca-field-checkbox">
                  <label className="ca-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              <div className="ca-form-row">
                <div className="ca-field">
                  <label htmlFor="f-pub">Published at</label>
                  <input
                    id="f-pub"
                    type="datetime-local"
                    className="ca-input"
                    value={form.published_at}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  />
                </div>
                <div className="ca-field">
                  <label htmlFor="f-exp">Expires at</label>
                  <input
                    id="f-exp"
                    type="datetime-local"
                    className="ca-input"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  />
                </div>
              </div>

              {formError && (
                <div className="ca-banner ca-banner-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="ca-form-actions">
                <button type="submit" className="ca-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : editingId === "new" ? "Create job" : "Save changes"}
                </button>
                <button type="button" className="ca-btn-ghost" onClick={closeForm}>
                  Cancel
                </button>
                {editingId !== "new" && (
                  <button
                    type="button"
                    className="ca-btn-danger"
                    onClick={() => editingId && void handleDelete(editingId)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          )}
        </main>
      </div>

      <style jsx global>{`
        .careers-admin {
          background: #f3f6fb;
          color: #0f172a;
          min-height: calc(100vh - 64px);
        }
        .careers-admin .ca-header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }
        .careers-admin .ca-header-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .careers-admin .ca-title {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 700;
          color: #0a3d6b;
          letter-spacing: -0.01em;
        }
        .careers-admin .ca-title-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #0a3d6b;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .careers-admin .ca-title-accent {
          color: #64748b;
          font-weight: 500;
        }
        .careers-admin .ca-main {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }
        .careers-admin .ca-status {
          color: #64748b;
          font-size: 14px;
          padding: 32px 0;
        }
        .careers-admin .ca-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }
        .careers-admin .ca-card-narrow {
          max-width: 460px;
          margin: 60px auto 0;
        }
        .careers-admin .ca-h1 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .careers-admin .ca-text {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          margin: 0 0 18px;
        }
        .careers-admin .ca-code {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .careers-admin .ca-login-form {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .careers-admin .ca-login-form .ca-input {
          flex: 1;
        }
        .careers-admin .ca-input {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 140ms, box-shadow 140ms;
        }
        .careers-admin .ca-input:focus {
          border-color: #0a3d6b;
          box-shadow: 0 0 0 3px rgba(10, 61, 107, 0.1);
        }
        .careers-admin .ca-textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.55;
          font-family: inherit;
        }
        .careers-admin .ca-textarea-sm {
          min-height: 56px;
          resize: vertical;
          font-family: inherit;
        }
        .careers-admin .ca-error {
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
          margin-top: 12px;
        }
        .careers-admin .ca-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          border-radius: 8px;
          background: #0a3d6b;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #072d52;
          cursor: pointer;
          font-family: inherit;
          transition: background 140ms;
          white-space: nowrap;
        }
        .careers-admin .ca-btn-primary:hover:not(:disabled) {
          background: #072d52;
        }
        .careers-admin .ca-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .careers-admin .ca-btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 9px 14px;
          border-radius: 8px;
          background: #ffffff;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          font-family: inherit;
          transition: background 120ms;
        }
        .careers-admin .ca-btn-ghost:hover {
          background: #f1f5f9;
        }
        .careers-admin .ca-btn-ghost-sm {
          padding: 6px 12px;
          border-radius: 7px;
          background: #ffffff;
          color: #334155;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          font-family: inherit;
          transition: background 120ms;
        }
        .careers-admin .ca-btn-ghost-sm:hover {
          background: #f1f5f9;
        }
        .careers-admin .ca-btn-danger {
          display: inline-flex;
          align-items: center;
          padding: 9px 14px;
          border-radius: 8px;
          background: #ffffff;
          color: #b91c1c;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #fecaca;
          cursor: pointer;
          font-family: inherit;
          margin-left: auto;
          transition: background 120ms;
        }
        .careers-admin .ca-btn-danger:hover {
          background: #fef2f2;
        }
        .careers-admin .ca-btn-danger-sm {
          padding: 6px 12px;
          border-radius: 7px;
          background: #ffffff;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #fecaca;
          cursor: pointer;
          font-family: inherit;
          transition: background 120ms;
        }
        .careers-admin .ca-btn-danger-sm:hover {
          background: #fef2f2;
        }
        .careers-admin .ca-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin: 0 0 18px;
          flex-wrap: wrap;
        }
        .careers-admin .ca-filters {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .careers-admin .ca-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 120ms;
        }
        .careers-admin .ca-chip:hover {
          background: #f1f5f9;
        }
        .careers-admin .ca-chip.is-active {
          background: #0a3d6b;
          color: #ffffff;
          border-color: #072d52;
        }
        .careers-admin .ca-chip-count {
          font-size: 11px;
          background: rgba(15, 23, 42, 0.06);
          color: inherit;
          padding: 1px 6px;
          border-radius: 999px;
          font-weight: 600;
        }
        .careers-admin .ca-chip.is-active .ca-chip-count {
          background: rgba(255, 255, 255, 0.18);
        }
        .careers-admin .ca-banner {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .careers-admin .ca-banner-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
        .careers-admin .ca-empty {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          padding: 40px 24px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        .careers-admin .ca-table-wrap {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }
        .careers-admin .ca-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .careers-admin .ca-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #64748b;
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .careers-admin .ca-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
        }
        .careers-admin .ca-table tbody tr:last-child td {
          border-bottom: none;
        }
        .careers-admin .ca-job-title {
          font-weight: 600;
          color: #0f172a;
        }
        .careers-admin .ca-job-sub {
          font-size: 13px;
          color: #475569;
          margin-top: 2px;
        }
        .careers-admin .ca-job-slug {
          font-size: 12px;
          color: #94a3b8;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          margin-top: 4px;
        }
        .careers-admin .ca-select-inline {
          padding: 6px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          font-size: 13px;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          cursor: pointer;
        }
        .careers-admin .ca-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
        }
        .careers-admin .ca-cell-time {
          font-size: 13px;
          color: #475569;
          white-space: nowrap;
        }
        .careers-admin .ca-cell-actions {
          text-align: right;
          white-space: nowrap;
        }
        .careers-admin .ca-cell-actions > * + * {
          margin-left: 6px;
        }
        .careers-admin .ca-form {
          margin: 0;
        }
        .careers-admin .ca-form-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }
        .careers-admin .ca-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 4px;
        }
        .careers-admin .ca-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .careers-admin .ca-field label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          letter-spacing: 0.01em;
        }
        .careers-admin .ca-field-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .careers-admin .ca-field-pair > div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .careers-admin .ca-field-checkbox {
          align-self: end;
          padding-bottom: 8px;
        }
        .careers-admin .ca-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #0f172a;
          font-weight: 500;
          cursor: pointer;
        }
        .careers-admin .ca-form-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
        }

        @media (max-width: 720px) {
          .careers-admin .ca-form-row {
            grid-template-columns: 1fr;
          }
          .careers-admin .ca-field-pair {
            grid-template-columns: 1fr 1fr;
          }
          .careers-admin .ca-table th,
          .careers-admin .ca-table td {
            padding: 10px 12px;
          }
          .careers-admin .ca-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .careers-admin .ca-toolbar .ca-btn-primary {
            align-self: flex-end;
          }
        }
      `}</style>
    </>
  );
}
