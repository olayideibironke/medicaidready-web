import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import CareersShell from "../../../components/careers/CareersShell";
import {
  addApplyReadyApplication,
  APPLYREADY_APPLICATION_STATUSES,
  countApplicationsByStatus,
  deleteApplyReadyApplication,
  EMPTY_APPLYREADY_APPLICATION,
  getActiveApplyReadyApplications,
  getApplyReadyApplications,
  updateApplyReadyApplication,
  type ApplyReadyApplication,
  type ApplyReadyApplicationStatus,
} from "../../../lib/careers/applyReadyTracker";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/applyready/tracker";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

type DraftApplication = Omit<ApplyReadyApplication, "id" | "createdAt" | "updatedAt">;

const EMPTY_DRAFT: DraftApplication = {
  title: "",
  company: "",
  location: "",
  jobUrl: "",
  status: "Saved",
  nextStepDate: "",
  notes: "",
};

const STATUS_DESCRIPTIONS: Record<ApplyReadyApplicationStatus, string> = {
  Saved: "Role is saved for review.",
  Preparing: "Resume, profile, or notes are being prepared.",
  Applied: "Application has been submitted.",
  Interview: "Interview or screening is active.",
  Offer: "Offer stage or negotiation.",
  "Not selected": "Application did not move forward.",
  "Follow up": "Needs a follow-up action.",
  Archived: "Hidden from active tracking.",
};

function formatDate(value: string): string {
  if (!value) return "No date set";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "Date saved";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatUpdated(value: string): string {
  if (!value) return "Not saved yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Updated recently";

  return `Updated ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function applicationToDraft(application: ApplyReadyApplication): DraftApplication {
  return {
    title: application.title,
    company: application.company,
    location: application.location,
    jobUrl: application.jobUrl,
    status: application.status,
    nextStepDate: application.nextStepDate,
    notes: application.notes,
  };
}

export default function ApplyReadyTrackerPage() {
  const [applications, setApplications] = useState<ApplyReadyApplication[]>([]);
  const [draft, setDraft] = useState<DraftApplication>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftApplication>(EMPTY_DRAFT);
  const [ready, setReady] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplyReadyApplicationStatus | "All">("All");

  useEffect(() => {
    const sync = () => {
      setApplications(getApplyReadyApplications());
      setReady(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("applyready:tracker-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("applyready:tracker-updated", sync);
    };
  }, []);

  const activeApplications = useMemo(
    () => getActiveApplyReadyApplications(applications),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    if (statusFilter === "All") return applications;

    return applications.filter((application) => application.status === statusFilter);
  }, [applications, statusFilter]);

  const activeCount = activeApplications.length;
  const appliedCount = countApplicationsByStatus(applications, "Applied");
  const interviewCount = countApplicationsByStatus(applications, "Interview");
  const followUpCount = countApplicationsByStatus(applications, "Follow up");

  function showMessage(message: string) {
    setSavedMessage(message);
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  function updateDraft(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateEditDraft(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setEditDraft((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.title.trim() || !draft.company.trim()) {
      showMessage("Add at least the role title and company.");
      return;
    }

    addApplyReadyApplication({
      ...draft,
      title: draft.title.trim(),
      company: draft.company.trim(),
      location: draft.location.trim(),
      jobUrl: normalizeUrl(draft.jobUrl),
      notes: draft.notes.trim(),
    });

    setApplications(getApplyReadyApplications());
    setDraft(EMPTY_DRAFT);
    showMessage("Application added to tracker.");
  }

  function handleStatusChange(id: string, status: ApplyReadyApplicationStatus) {
    const nextApplications = updateApplyReadyApplication(id, { status });
    setApplications(nextApplications);
  }

  function handleStartEdit(application: ApplyReadyApplication) {
    setEditingId(application.id);
    setEditDraft(applicationToDraft(application));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditDraft(EMPTY_DRAFT);
  }

  function handleSaveEdit(id: string) {
    if (!editDraft.title.trim() || !editDraft.company.trim()) {
      showMessage("Keep at least the role title and company.");
      return;
    }

    const nextApplications = updateApplyReadyApplication(id, {
      ...editDraft,
      title: editDraft.title.trim(),
      company: editDraft.company.trim(),
      location: editDraft.location.trim(),
      jobUrl: normalizeUrl(editDraft.jobUrl),
      notes: editDraft.notes.trim(),
    });

    setApplications(nextApplications);
    setEditingId(null);
    setEditDraft(EMPTY_DRAFT);
    showMessage("Application updated.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("Remove this application from the tracker?");

    if (!confirmed) return;

    const nextApplications = deleteApplyReadyApplication(id);
    setApplications(nextApplications);

    if (editingId === id) {
      setEditingId(null);
      setEditDraft(EMPTY_DRAFT);
    }
  }

  const metaTitle = "Application Tracker | ApplyReady | MedicaidReady Careers";
  const metaDescription =
    "Track job applications, statuses, follow-up dates, and notes with the ApplyReady application tracker foundation.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:site_name" content="MedicaidReady Careers" />
      </Head>

      <CareersShell>
        <main className="art-page">
          <section className="art-hero">
            <div className="art-hero-glow" />
            <div className="careers-container art-hero-inner">
              <div className="art-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/applyready">ApplyReady</Link>
                <span>/</span>
                <span>Application Tracker</span>
              </div>

              <div className="art-hero-grid">
                <div>
                  <p className="art-eyebrow">Application Tracker</p>
                  <h1>Track every role from saved to submitted.</h1>
                  <p>
                    Keep role titles, companies, links, notes, follow-up dates, and statuses
                    in one place while ApplyReady grows toward secure account-based tracking.
                  </p>

                  <div className="art-actions">
                    <Link href="/careers/jobs" className="art-primary">
                      Browse Jobs
                    </Link>
                    <Link href="/careers/saved-jobs" className="art-secondary">
                      View Saved Jobs
                    </Link>
                  </div>
                </div>

                <aside className="art-panel">
                  <span>Tracker summary</span>
                  <div className="art-panel-metrics">
                    <div>
                      <strong>{ready ? activeCount : 0}</strong>
                      <small>Active</small>
                    </div>
                    <div>
                      <strong>{ready ? appliedCount : 0}</strong>
                      <small>Applied</small>
                    </div>
                    <div>
                      <strong>{ready ? interviewCount : 0}</strong>
                      <small>Interview</small>
                    </div>
                    <div>
                      <strong>{ready ? followUpCount : 0}</strong>
                      <small>Follow up</small>
                    </div>
                  </div>
                  <p>
                    This is browser-saved tracking for now. Account-based tracking comes later.
                  </p>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="art-layout">
                <form className="art-form" onSubmit={handleSubmit}>
                  <div className="art-form-head">
                    <div>
                      <p className="art-eyebrow art-eyebrow-dark">Add application</p>
                      <h2>Add a role you want to track.</h2>
                    </div>
                    {savedMessage && <span className="art-save-message">{savedMessage}</span>}
                  </div>

                  <div className="art-form-grid">
                    <label className="art-field">
                      <span>Role title</span>
                      <input
                        name="title"
                        type="text"
                        value={draft.title}
                        onChange={updateDraft}
                        placeholder="Program Analyst, Data Analyst, DevOps Engineer"
                      />
                    </label>

                    <label className="art-field">
                      <span>Company</span>
                      <input
                        name="company"
                        type="text"
                        value={draft.company}
                        onChange={updateDraft}
                        placeholder="Company name"
                      />
                    </label>

                    <label className="art-field">
                      <span>Location</span>
                      <input
                        name="location"
                        type="text"
                        value={draft.location}
                        onChange={updateDraft}
                        placeholder="Remote, Washington DC, Maryland"
                      />
                    </label>

                    <label className="art-field">
                      <span>Status</span>
                      <select name="status" value={draft.status} onChange={updateDraft}>
                        {APPLYREADY_APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="art-field">
                      <span>Job link</span>
                      <input
                        name="jobUrl"
                        type="text"
                        value={draft.jobUrl}
                        onChange={updateDraft}
                        placeholder="https://company.com/job"
                      />
                    </label>

                    <label className="art-field">
                      <span>Next step date</span>
                      <input
                        name="nextStepDate"
                        type="date"
                        value={draft.nextStepDate}
                        onChange={updateDraft}
                      />
                    </label>

                    <label className="art-field art-field-wide">
                      <span>Notes</span>
                      <textarea
                        name="notes"
                        value={draft.notes}
                        onChange={updateDraft}
                        placeholder="Resume version used, follow-up plan, contact person, interview notes, or reminders."
                      />
                    </label>
                  </div>

                  <div className="art-form-actions">
                    <button type="submit" className="art-submit">
                      Add to Tracker
                    </button>
                    <button
                      type="button"
                      className="art-clear"
                      onClick={() => setDraft(EMPTY_DRAFT)}
                    >
                      Clear Form
                    </button>
                  </div>

                  <p className="art-local-note">
                    This tracker is saved only in this browser for now. Later, it will move
                    into secure account-based storage.
                  </p>
                </form>

                <aside className="art-side">
                  <div className="art-side-card">
                    <div className="art-side-title">Tracker stages</div>
                    <p>
                      Use statuses to organize where each job stands, from saved and
                      preparing to applied, interview, offer, follow up, or archived.
                    </p>
                  </div>

                  <div className="art-side-card art-side-card-dark">
                    <div className="art-side-title">Build order</div>
                    <p>
                      We shaped profile, resume readiness, saved jobs, and tracker before
                      adding real accounts and resume upload.
                    </p>
                    <Link href="/careers/applyready/dashboard">Back to dashboard</Link>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="art-tracker-section">
            <div className="careers-container">
              <div className="art-tracker-head">
                <div>
                  <p className="art-eyebrow art-eyebrow-dark">Tracked applications</p>
                  <h2>Your application list.</h2>
                </div>

                <div className="art-filter">
                  <span>Filter</span>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as ApplyReadyApplicationStatus | "All")
                    }
                  >
                    <option value="All">All statuses</option>
                    {APPLYREADY_APPLICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="art-empty">
                  <h3>No applications tracked yet.</h3>
                  <p>
                    Add a role above, or save jobs from the job board and move the roles you
                    want to track here.
                  </p>
                  <Link href="/careers/jobs">Browse jobs</Link>
                </div>
              ) : (
                <div className="art-list">
                  {filteredApplications.map((application) => {
                    const isEditing = editingId === application.id;

                    return (
                      <article className="art-card" key={application.id}>
                        <div className="art-card-main">
                          <div>
                            <span className="art-status-pill">{application.status}</span>
                            <h3>{application.title}</h3>
                            <p>
                              {application.company}
                              {application.location ? ` · ${application.location}` : ""}
                            </p>
                          </div>

                          <div className="art-card-actions">
                            {application.jobUrl && !isEditing && (
                              <a
                                href={application.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open job
                              </a>
                            )}
                            {!isEditing && (
                              <button type="button" onClick={() => handleStartEdit(application)}>
                                Edit
                              </button>
                            )}
                            <button type="button" onClick={() => handleDelete(application.id)}>
                              Remove
                            </button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="art-edit-box">
                            <div className="art-form-grid">
                              <label className="art-field">
                                <span>Role title</span>
                                <input
                                  name="title"
                                  type="text"
                                  value={editDraft.title}
                                  onChange={updateEditDraft}
                                />
                              </label>

                              <label className="art-field">
                                <span>Company</span>
                                <input
                                  name="company"
                                  type="text"
                                  value={editDraft.company}
                                  onChange={updateEditDraft}
                                />
                              </label>

                              <label className="art-field">
                                <span>Location</span>
                                <input
                                  name="location"
                                  type="text"
                                  value={editDraft.location}
                                  onChange={updateEditDraft}
                                />
                              </label>

                              <label className="art-field">
                                <span>Status</span>
                                <select
                                  name="status"
                                  value={editDraft.status}
                                  onChange={updateEditDraft}
                                >
                                  {APPLYREADY_APPLICATION_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="art-field">
                                <span>Job link</span>
                                <input
                                  name="jobUrl"
                                  type="text"
                                  value={editDraft.jobUrl}
                                  onChange={updateEditDraft}
                                />
                              </label>

                              <label className="art-field">
                                <span>Next step date</span>
                                <input
                                  name="nextStepDate"
                                  type="date"
                                  value={editDraft.nextStepDate}
                                  onChange={updateEditDraft}
                                />
                              </label>

                              <label className="art-field art-field-wide">
                                <span>Notes</span>
                                <textarea
                                  name="notes"
                                  value={editDraft.notes}
                                  onChange={updateEditDraft}
                                  placeholder="Update your follow-up plan, resume notes, contact person, or interview notes."
                                />
                              </label>
                            </div>

                            <div className="art-edit-actions">
                              <button
                                type="button"
                                className="art-submit"
                                onClick={() => handleSaveEdit(application.id)}
                              >
                                Save Changes
                              </button>
                              <button type="button" className="art-clear" onClick={handleCancelEdit}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="art-card-details">
                              <div>
                                <span>Next step</span>
                                <strong>{formatDate(application.nextStepDate)}</strong>
                              </div>
                              <div>
                                <span>Last update</span>
                                <strong>{formatUpdated(application.updatedAt)}</strong>
                              </div>
                            </div>

                            <div className="art-card-control">
                              <label>
                                <span>Update status</span>
                                <select
                                  value={application.status}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      application.id,
                                      event.target.value as ApplyReadyApplicationStatus
                                    )
                                  }
                                >
                                  {APPLYREADY_APPLICATION_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            {application.notes && <p className="art-notes">{application.notes}</p>}

                            <p className="art-status-description">
                              {STATUS_DESCRIPTIONS[application.status]}
                            </p>
                          </>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx global>{`
        .art-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .art-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 20%, rgba(239, 159, 39, 0.22), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(133, 183, 235, 0.2), transparent 34%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
        }

        .art-hero-glow {
          position: absolute;
          right: -180px;
          bottom: -220px;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: rgba(133, 183, 235, 0.18);
          filter: blur(10px);
          pointer-events: none;
        }

        .art-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 76px;
        }

        .art-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          font-weight: 850;
        }

        .art-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .art-breadcrumbs a:hover {
          color: #f5b942;
        }

        .art-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 34px;
          align-items: center;
        }

        .art-eyebrow {
          margin: 0;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .art-eyebrow-dark {
          color: #0c447c;
        }

        .art-hero h1 {
          max-width: 900px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .art-hero p {
          max-width: 760px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          line-height: 1.72;
        }

        .art-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .art-primary,
        .art-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 13px 21px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
        }

        .art-primary {
          background: #f5b942;
          color: #061b3a;
        }

        .art-primary:hover {
          background: #ffd978;
        }

        .art-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .art-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .art-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .art-panel > span {
          display: block;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .art-panel-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 18px;
        }

        .art-panel-metrics div {
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .art-panel strong {
          display: block;
          color: #ffffff;
          font-size: 32px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .art-panel small {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          font-weight: 750;
          line-height: 1.5;
        }

        .art-panel p {
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.6;
        }

        .art-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 24px;
          align-items: start;
        }

        .art-form {
          border: 1px solid #dbe5f0;
          border-radius: 28px;
          background: #ffffff;
          padding: 28px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .art-form-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .art-form-head h2,
        .art-tracker-head h2 {
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(30px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .art-save-message {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #bbf7d0;
          border-radius: 999px;
          background: #f0fdf4;
          color: #15803d;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .art-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .art-field {
          display: grid;
          gap: 7px;
        }

        .art-field-wide {
          grid-column: 1 / -1;
        }

        .art-field span {
          color: #042c53;
          font-size: 13px;
          font-weight: 900;
        }

        .art-field input,
        .art-field select,
        .art-field textarea,
        .art-filter select,
        .art-card-control select {
          width: 100%;
          border: 1.5px solid #dbe5f0;
          border-radius: 14px;
          background: #ffffff;
          color: #0f172a;
          padding: 13px 14px;
          font-size: 15px;
          line-height: 1.5;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
        }

        .art-field textarea {
          min-height: 112px;
          resize: vertical;
        }

        .art-form-actions,
        .art-edit-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .art-submit,
        .art-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          min-height: 46px;
          padding: 0 18px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
        }

        .art-submit {
          border: 1px solid #021c38;
          background: #042c53;
          color: #ffffff;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .art-clear {
          border: 1px solid #cfdced;
          background: #ffffff;
          color: #334155;
        }

        .art-local-note {
          margin: 18px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .art-side {
          display: grid;
          gap: 14px;
        }

        .art-side-card {
          border: 1px solid #dbe5f0;
          border-radius: 22px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .art-side-title {
          color: #042c53;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .art-side-card p {
          margin: 9px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .art-side-card-dark {
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.15), transparent 34%),
            #061b3a;
          border-color: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .art-side-card-dark .art-side-title {
          color: #ffffff;
        }

        .art-side-card-dark p {
          color: rgba(255, 255, 255, 0.72);
        }

        .art-side-card-dark a {
          display: inline-flex;
          margin-top: 14px;
          color: #f5b942;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }

        .art-tracker-section {
          padding: 0 0 64px;
        }

        .art-tracker-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-end;
          margin-bottom: 22px;
        }

        .art-filter {
          display: grid;
          gap: 7px;
          min-width: 220px;
        }

        .art-filter span {
          color: #042c53;
          font-size: 13px;
          font-weight: 900;
        }

        .art-empty {
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          background: #ffffff;
          padding: 34px;
          text-align: center;
        }

        .art-empty h3 {
          margin: 0;
          color: #042c53;
          font-size: 22px;
          font-weight: 950;
        }

        .art-empty p {
          max-width: 620px;
          margin: 10px auto 0;
          color: #64748b;
          line-height: 1.68;
        }

        .art-empty a {
          display: inline-flex;
          margin-top: 18px;
          border-radius: 999px;
          background: #042c53;
          color: #ffffff;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
        }

        .art-list {
          display: grid;
          gap: 14px;
        }

        .art-card {
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #ffffff;
          padding: 22px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .art-card-main {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
        }

        .art-status-pill {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #f1deb3;
          border-radius: 999px;
          background: #fff7e6;
          color: #ba7517;
          padding: 5px 9px;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .art-card h3 {
          margin: 10px 0 0;
          color: #042c53;
          font-size: 21px;
          line-height: 1.15;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .art-card p {
          margin: 8px 0 0;
          color: #64748b;
          line-height: 1.65;
        }

        .art-card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .art-card-actions a,
        .art-card-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid #cfdced;
          background: #ffffff;
          color: #042c53;
          min-height: 38px;
          padding: 0 14px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
        }

        .art-card-actions button:hover,
        .art-card-actions a:hover {
          border-color: #ba7517;
          background: #fff7e6;
          color: #ba7517;
        }

        .art-card-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 18px;
        }

        .art-card-details div {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #f8fafc;
          padding: 13px;
        }

        .art-card-details span,
        .art-card-control span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 850;
        }

        .art-card-details strong {
          display: block;
          margin-top: 5px;
          color: #042c53;
          font-size: 14px;
          font-weight: 950;
        }

        .art-card-control {
          margin-top: 14px;
        }

        .art-card-control label {
          display: grid;
          gap: 7px;
        }

        .art-edit-box {
          margin-top: 18px;
          border-top: 1px solid #e2e8f0;
          padding-top: 18px;
        }

        .art-notes {
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
        }

        .art-status-description {
          color: #94a3b8 !important;
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .art-hero-grid,
          .art-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .art-hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .art-panel-metrics,
          .art-form-grid,
          .art-card-details {
            grid-template-columns: 1fr;
          }

          .art-tracker-head,
          .art-card-main,
          .art-form-head {
            flex-direction: column;
            align-items: stretch;
          }

          .art-actions,
          .art-form-actions,
          .art-edit-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .art-primary,
          .art-secondary,
          .art-submit,
          .art-clear {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
