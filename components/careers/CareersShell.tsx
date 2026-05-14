import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/careers/jobs",
    label: "Find Jobs",
    match: (p) =>
      p === "/careers/jobs" ||
      p.startsWith("/careers/jobs/") ||
      p.startsWith("/careers/category/"),
  },
  {
    href: "/careers/companies",
    label: "Companies",
    match: (p) => p === "/careers/companies" || p.startsWith("/careers/companies/"),
  },
  {
    href: "/careers/resources",
    label: "Career Resources",
    match: (p) => p === "/careers/resources" || p.startsWith("/careers/resources/"),
  },
  {
    href: "/careers/employers",
    label: "For Employers",
    match: (p) => p === "/careers/employers",
  },
];

export default function CareersShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = router.pathname;
  const isOverview = path === "/careers";
  const isAdmin = path.startsWith("/careers/admin");

  return (
    <div className="careers-shell">
      <div className="careers-subnav-wrap">
        <div className="careers-container careers-subnav-inner">
          <Link
            href="/careers"
            className={`careers-subnav-brand${isOverview ? " is-active" : ""}`}
            aria-label="MedicaidReady Careers home"
          >
            <span className="careers-subnav-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 52 56" xmlns="http://www.w3.org/2000/svg" role="img">
                <polygon points="26,3 48,15 48,39 26,51 4,39 4,15" fill="#042C53"/>
                <polygon points="26,9 43,19 43,35 26,45 9,35 9,19" fill="none" stroke="#BA7517" strokeWidth="1.5"/>
                <line x1="26" y1="20" x2="26" y2="34" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
                <line x1="19" y1="27" x2="33" y2="27" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
                <line x1="26" y1="20" x2="26" y2="34" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="19" y1="27" x2="33" y2="27" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="careers-subnav-brand-text">
              <span className="careers-subnav-brand-main">MedicaidReady</span>
              <span className="careers-subnav-brand-accent">Careers</span>
            </span>
          </Link>

          <nav className="careers-subnav-nav" aria-label="Careers section navigation">
            {NAV_ITEMS.map((item) => {
              const active = item.match(path);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`careers-subnav-link${active ? " is-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="careers-subnav-actions">
            <Link
              href="/careers/admin/jobs"
              className={`careers-subnav-signin${isAdmin ? " is-active" : ""}`}
            >
              Sign in
            </Link>
            <Link href="/careers/post-a-job" className="careers-subnav-post">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              Post a Job
            </Link>
          </div>
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
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ===== Sub-nav (Dice-inspired professional job-board nav) ===== */
        .careers-shell .careers-subnav-wrap {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: inset 0 -3px 0 0 #BA7517;
          position: sticky;
          top: 64px;
          z-index: 50;
        }

        .careers-shell .careers-subnav-inner {
          display: flex;
          align-items: center;
          gap: 18px;
          min-height: 56px;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .careers-shell .careers-subnav-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #042C53;
          text-decoration: none;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 120ms;
          flex-shrink: 0;
        }
        .careers-shell .careers-subnav-brand:hover {
          background: #f8fafc;
        }
        .careers-shell .careers-subnav-brand.is-active {
          background: #f8fafc;
        }
        .careers-shell .careers-subnav-brand-mark {
          display: inline-flex;
          align-items: center;
          width: 24px;
          height: 26px;
        }
        .careers-shell .careers-subnav-brand-mark svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .careers-shell .careers-subnav-brand-text {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          font-size: 14px;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .careers-shell .careers-subnav-brand-main {
          color: #042C53;
          font-weight: 800;
        }
        .careers-shell .careers-subnav-brand-accent {
          color: #BA7517;
          font-weight: 700;
        }

        .careers-shell .careers-subnav-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          min-width: 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .careers-shell .careers-subnav-nav::-webkit-scrollbar {
          display: none;
        }
        .careers-shell .careers-subnav-link {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          white-space: nowrap;
          transition: background 120ms, color 120ms;
          position: relative;
        }
        .careers-shell .careers-subnav-link:hover {
          background: #f1f5f9;
          color: #042C53;
        }
        .careers-shell .careers-subnav-link.is-active {
          color: #042C53;
          background: #f8fafc;
          box-shadow: inset 0 -3px 0 0 #BA7517;
        }

        .careers-shell .careers-subnav-actions {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .careers-shell .careers-subnav-signin {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: color 120ms, background 120ms;
        }
        .careers-shell .careers-subnav-signin:hover,
        .careers-shell .careers-subnav-signin.is-active {
          color: #042C53;
          background: #f1f5f9;
        }
        .careers-shell .careers-subnav-post {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 9px;
          background: #042C53;
          color: #ffffff !important;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #021c38;
          text-decoration: none !important;
          box-shadow: 0 2px 8px rgba(4, 44, 83, 0.18), inset 0 -2px 0 0 #BA7517;
          transition: background 140ms, transform 100ms;
        }
        .careers-shell .careers-subnav-post:hover {
          background: #0C447C;
          transform: translateY(-1px);
        }

        /* ===== Layout helpers ===== */
        .careers-shell .careers-section {
          padding: 56px 0;
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
        .careers-shell .careers-btn-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
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
          color: #042C53;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .careers-shell .careers-feature-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }

        /* ===== Job list shared styles ===== */
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
          color: #042C53;
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
          color: #042C53;
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
        }
        @media (max-width: 720px) {
          .careers-shell .careers-subnav-wrap {
            position: static;
          }
          .careers-shell .careers-subnav-inner {
            gap: 10px;
            min-height: 52px;
          }
          .careers-shell .careers-subnav-signin {
            display: none;
          }
          .careers-shell .careers-subnav-brand-text {
            display: none;
          }
          .careers-shell .careers-subnav-link {
            padding: 7px 11px;
            font-size: 13px;
          }
          .careers-shell .careers-subnav-post {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
        @media (max-width: 600px) {
          .careers-shell .careers-container {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}
