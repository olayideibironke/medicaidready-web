import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export default function CareersShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = router.pathname;

  const isOverview = path === "/careers";
  const isJobs = path === "/careers/jobs" || path.startsWith("/careers/jobs/");
  const isEmployers = path === "/careers/employers";
  const isPost = path === "/careers/post-a-job";

  return (
    <div className="careers-shell">
      <div className="careers-tabs-wrap">
        <div className="careers-container">
          <nav className="careers-tabs" aria-label="Careers section">
            <Link
              href="/careers"
              className={`careers-tab${isOverview ? " is-active" : ""}`}
            >
              Overview
            </Link>
            <Link
              href="/careers/jobs"
              className={`careers-tab${isJobs ? " is-active" : ""}`}
            >
              Find Jobs
            </Link>
            <Link
              href="/careers/employers"
              className={`careers-tab${isEmployers ? " is-active" : ""}`}
            >
              For Employers
            </Link>
            <Link
              href="/careers/post-a-job"
              className={`careers-tab${isPost ? " is-active" : ""}`}
            >
              Post a Job
            </Link>
          </nav>
        </div>
      </div>

      {children}

      <style jsx global>{`
        .careers-shell {
          background: #f6f8fb;
          color: #0f172a;
          --c-navy: #042C53;
          --c-navy-2: #0C447C;
          --c-gold: #BA7517;
          --c-gold-bright: #EF9F27;
          --c-light-blue: #85B7EB;
        }

        .careers-shell .careers-container {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .careers-shell .careers-tabs-wrap {
          padding: 24px 0 0;
        }

        .careers-shell .careers-tabs {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .careers-shell .careers-tabs::-webkit-scrollbar {
          display: none;
        }

        .careers-shell .careers-tab {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          white-space: nowrap;
          transition: background 120ms, color 120ms;
        }

        .careers-shell .careers-tab:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .careers-shell .careers-tab.is-active {
          background: #042C53;
          color: #ffffff;
          box-shadow: inset 0 -2px 0 0 #BA7517;
        }

        .careers-shell .careers-section {
          padding: 56px 0;
        }

        .careers-shell .careers-tabs-wrap + .careers-section {
          padding-top: 28px;
        }

        .careers-shell .careers-section-tight {
          padding: 40px 0;
        }

        .careers-shell .careers-h1 {
          font-size: 44px;
          line-height: 1.1;
          letter-spacing: -0.035em;
          font-weight: 700;
          color: #042C53;
          margin: 0 0 16px;
        }

        .careers-shell .careers-h2 {
          font-size: 28px;
          line-height: 1.2;
          letter-spacing: -0.03em;
          font-weight: 700;
          color: #042C53;
          margin: 0 0 12px;
        }

        .careers-shell .careers-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #BA7517;
          margin: 0 0 10px;
        }

        .careers-shell .careers-lead {
          font-size: 17px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
          max-width: 640px;
        }

        .careers-shell .careers-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .careers-shell .careers-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 22px;
          border-radius: 10px;
          background: #042C53;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          border: 1px solid #021c38;
          box-shadow: 0 4px 14px rgba(4, 44, 83, 0.28), inset 0 -2px 0 0 #BA7517;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 140ms, transform 100ms;
        }

        .careers-shell .careers-btn-primary:hover {
          background: #0C447C;
          transform: translateY(-1px);
          color: #ffffff;
        }

        .careers-shell .careers-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 20px;
          border-radius: 10px;
          background: #ffffff;
          color: #042C53;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid #cbd5e1;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 140ms, border-color 140ms;
        }

        .careers-shell .careers-btn-ghost:hover {
          background: #fff7e6;
          border-color: #BA7517;
          color: #042C53;
        }

        .careers-shell .careers-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        }

        .careers-shell .careers-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .careers-shell .careers-feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #fff7e6;
          color: #BA7517;
          border: 1px solid #f1deb3;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .careers-shell .careers-feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }

        .careers-shell .careers-feature-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }

        .careers-shell .careers-jobs-toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .careers-shell .careers-search {
          flex: 1;
          min-width: 220px;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          transition: border-color 140ms, box-shadow 140ms;
          font-family: inherit;
        }

        .careers-shell .careers-search:focus {
          border-color: #042C53;
          box-shadow: 0 0 0 3px rgba(4, 44, 83, 0.12);
        }

        .careers-shell .careers-select {
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }

        .careers-shell .careers-job-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .careers-shell .careers-job-card {
          display: block;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px 24px;
          text-decoration: none;
          color: inherit;
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
        }

        .careers-shell .careers-job-card:hover {
          border-color: #BA7517;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(4, 44, 83, 0.08);
          color: inherit;
        }

        .careers-shell .careers-job-title {
          font-size: 18px;
          font-weight: 700;
          color: #042C53;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }

        .careers-shell .careers-job-company {
          font-size: 14px;
          color: #475569;
          margin: 0 0 12px;
        }

        .careers-shell .careers-job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 12px;
        }

        .careers-shell .careers-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 500;
        }

        .careers-shell .careers-pill-blue {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .careers-shell .careers-pill-green {
          background: #f0fdf4;
          color: #15803d;
        }

        .careers-shell .careers-pill-gold {
          background: #fff7e6;
          color: #BA7517;
          border: 1px solid #f1deb3;
          font-weight: 700;
        }

        .careers-shell .careers-pill-teal {
          background: #ecfeff;
          color: #0e7490;
        }

        .careers-shell .careers-pill-purple {
          background: #faf5ff;
          color: #7c3aed;
        }

        .careers-shell .careers-pill-navy {
          background: #eff6ff;
          color: #042C53;
        }

        .careers-shell .careers-job-summary {
          font-size: 14px;
          color: #334155;
          line-height: 1.65;
          margin: 0;
        }

        .careers-shell .careers-job-posted {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 10px;
        }

        .careers-shell .careers-empty {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          padding: 40px 24px;
          text-align: center;
          color: #64748b;
        }

        .careers-shell .careers-detail-header {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 16px;
        }

        .careers-shell .careers-detail-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          margin-bottom: 14px;
          text-decoration: none;
        }

        .careers-shell .careers-detail-back:hover {
          color: #BA7517;
        }

        .careers-shell .careers-detail-title {
          font-size: 28px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
        }

        .careers-shell .careers-detail-company {
          font-size: 15px;
          color: #475569;
          margin: 0 0 16px;
        }

        .careers-shell .careers-detail-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 16px;
        }

        .careers-shell .careers-detail-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px;
          letter-spacing: -0.01em;
        }

        .careers-shell .careers-detail-section p,
        .careers-shell .careers-detail-section li {
          font-size: 15px;
          color: #334155;
          line-height: 1.75;
        }

        .careers-shell .careers-detail-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .careers-shell .careers-detail-section li {
          margin-bottom: 6px;
        }

        .careers-shell .careers-form {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
        }

        .careers-shell .careers-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .careers-shell .careers-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .careers-shell .careers-field label {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
        }

        .careers-shell .careers-field input,
        .careers-shell .careers-field select,
        .careers-shell .careers-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          font-family: inherit;
          transition: border-color 140ms, box-shadow 140ms;
          box-sizing: border-box;
        }

        .careers-shell .careers-field textarea {
          min-height: 140px;
          resize: vertical;
          line-height: 1.6;
        }

        .careers-shell .careers-field input:focus,
        .careers-shell .careers-field select:focus,
        .careers-shell .careers-field textarea:focus {
          border-color: #042C53;
          box-shadow: 0 0 0 3px rgba(4, 44, 83, 0.12);
        }

        .careers-shell .careers-form-help {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .careers-shell .careers-form-error {
          font-size: 13px;
          color: #dc2626;
          font-weight: 500;
          margin: 0 0 12px;
        }

        .careers-shell .careers-form-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 18px 20px;
          color: #15803d;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 880px) {
          .careers-shell .careers-feature-grid {
            grid-template-columns: 1fr;
          }
          .careers-shell .careers-form-row {
            grid-template-columns: 1fr;
          }
          .careers-shell .careers-h1 {
            font-size: 32px;
          }
          .careers-shell .careers-h2 {
            font-size: 22px;
          }
          .careers-shell .careers-section {
            padding: 48px 0;
          }
          .careers-shell .careers-tabs-wrap + .careers-section {
            padding-top: 24px;
          }
        }

        @media (max-width: 600px) {
          .careers-shell .careers-tabs-wrap {
            padding-top: 16px;
          }
          .careers-shell .careers-tab {
            padding: 7px 12px;
            font-size: 13px;
          }
          .careers-shell .careers-container {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}
