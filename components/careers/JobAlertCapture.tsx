import { useState } from "react";
import type { FormEvent } from "react";

type Props = {
  source: string;
  heading?: string;
  body?: string;
};

export default function JobAlertCapture({
  source,
  heading = "Get career and ApplyReady updates in your inbox",
  body = "One short email when new verified roles, career tools, or ApplyReady updates go live. No spam, unsubscribe anytime.",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/careers/job-alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });

      const json = (await res.json()) as {
        ok: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "subscribe_failed");
      }

      setAlreadySubscribed(Boolean(json.alreadySubscribed));
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="alert-capture">
      <div className="alert-capture-text">
        <div className="alert-capture-heading">{heading}</div>
        <div className="alert-capture-body">{body}</div>
      </div>

      {done ? (
        <div className="alert-capture-done">
          {alreadySubscribed
            ? "You are already on the list. We will be in touch when new updates go live."
            : "Subscribed. We will be in touch when new updates go live."}
        </div>
      ) : (
        <form className="alert-capture-form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            className="alert-capture-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Your email"
            required
          />
          <button
            type="submit"
            className="alert-capture-btn"
            disabled={submitting || !email.trim()}
          >
            {submitting ? "..." : "Notify me"}
          </button>
        </form>
      )}

      {error && (
        <p className="alert-capture-error" role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .alert-capture {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        }

        .alert-capture-heading {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          margin: 0 0 4px;
        }

        .alert-capture-body {
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 12px;
        }

        .alert-capture-form {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .alert-capture-input {
          flex: 1;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          font-family: inherit;
          transition: border-color 140ms, box-shadow 140ms;
          box-sizing: border-box;
          min-width: 0;
        }

        .alert-capture-input:focus {
          border-color: #0a3d6b;
          box-shadow: 0 0 0 3px rgba(10, 61, 107, 0.1);
        }

        .alert-capture-btn {
          padding: 11px 18px;
          border-radius: 10px;
          background: #0a3d6b;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #072d52;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: background 140ms;
        }

        .alert-capture-btn:hover:not(:disabled) {
          background: #072d52;
        }

        .alert-capture-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .alert-capture-done {
          font-size: 14px;
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .alert-capture-error {
          font-size: 13px;
          color: #dc2626;
          margin: 8px 0 0;
        }

        @media (max-width: 620px) {
          .alert-capture {
            padding: 18px;
          }

          .alert-capture-form {
            flex-direction: column;
          }

          .alert-capture-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}