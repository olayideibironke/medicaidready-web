import { useEffect, useState } from "react";
import {
  isJobSaved,
  toggleSavedJob,
} from "../../lib/careers/applyReadyStorage";

type Props = {
  jobId: string;
  variant?: "compact" | "full";
};

export default function SaveJobButton({ jobId, variant = "compact" }: Props) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSaved(isJobSaved(jobId));
      setReady(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("applyready:saved-jobs-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("applyready:saved-jobs-updated", sync);
    };
  }, [jobId]);

  function handleClick() {
    setSaved(toggleSavedJob(jobId));
  }

  return (
    <>
      <button
        type="button"
        className={`save-job-btn save-job-btn-${variant}${saved ? " is-saved" : ""}`}
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={saved ? "Remove saved job" : "Save job"}
      >
        <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M5 3.5h8a1 1 0 011 1v10.1a.5.5 0 01-.78.42L9 12.2l-4.22 2.82A.5.5 0 014 14.6V4.5a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill={saved ? "currentColor" : "none"}
          />
        </svg>
        <span>{ready && saved ? "Saved" : "Save"}</span>
      </button>

      <style jsx>{`
        .save-job-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid #cfdced;
          background: #ffffff;
          color: #042c53;
          border-radius: 999px;
          font-family: inherit;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 140ms ease,
            border-color 140ms ease,
            background 140ms ease,
            color 140ms ease,
            box-shadow 140ms ease;
        }

        .save-job-btn:hover {
          transform: translateY(-1px);
          border-color: #ba7517;
          color: #ba7517;
          background: #fff7e6;
          box-shadow: 0 10px 22px rgba(186, 117, 23, 0.1);
        }

        .save-job-btn.is-saved {
          border-color: #ba7517;
          background: #fff7e6;
          color: #ba7517;
        }

        .save-job-btn-compact {
          min-height: 36px;
          padding: 8px 12px;
          font-size: 12px;
        }

        .save-job-btn-full {
          min-height: 46px;
          padding: 10px 18px;
          font-size: 14px;
        }

        .save-job-btn svg {
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}