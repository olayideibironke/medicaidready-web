import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy • MedicaidReady</title>
        <meta
          name="description"
          content="MedicaidReady Privacy Policy for Medicaid eligibility tools, healthcare career resources, data retention, deletion requests, and privacy rights."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        <section className="hero">
          <Link href="/" className="brand">
            Medicaid<span>Ready</span>
          </Link>

          <p className="eyebrow">Privacy Policy</p>
          <h1>Privacy Policy</h1>
          <p className="updated">Last updated: June 12, 2026</p>

          <div className="notice">
            MedicaidReady is an independent informational tool. MedicaidReady is
            not affiliated with, endorsed by, or operated by Medicaid, Medicare,
            CMS, Healthcare.gov, or any federal, state, or local government
            agency.
          </div>
        </section>

        <section className="card">
          <h2>1. What MedicaidReady is</h2>
          <p>
            MedicaidReady provides informational Medicaid eligibility screening
            tools and healthcare career resources. MedicaidReady helps users
            understand possible Medicaid eligibility and related healthcare
            opportunities.
          </p>
          <p>
            MedicaidReady does not make official Medicaid eligibility decisions.
            Only the appropriate state Medicaid agency or authorized marketplace
            can determine final eligibility and approve benefits.
          </p>
        </section>

        <section className="card">
          <h2>2. Information we collect</h2>
          <p>Depending on how you use MedicaidReady, we may collect information you choose to provide, including:</p>
          <ul>
            <li>State of residence</li>
            <li>Household size</li>
            <li>Monthly income information</li>
            <li>Age</li>
            <li>Employment status</li>
            <li>Email address, if submitted</li>
            <li>Eligibility-related answers entered into the tool</li>
          </ul>
          <p>We may also collect limited technical information such as device type, browser, operating system, app performance data, crash reports, and basic usage analytics.</p>
        </section>

        <section className="card">
          <h2>3. How we use information</h2>
          <ul>
            <li>Provide a preliminary Medicaid eligibility estimate</li>
            <li>Display educational eligibility guidance</li>
            <li>Improve website and mobile app functionality</li>
            <li>Maintain security and prevent misuse</li>
            <li>Respond to support or privacy requests</li>
          </ul>
        </section>

        <section className="card">
          <h2>4. Information we do not collect</h2>
          <p>
            MedicaidReady does not require users to create an account to use the
            eligibility checker. MedicaidReady does not ask users to upload
            medical records, clinical notes, diagnoses, treatment records,
            Social Security numbers, or official Medicaid documents.
          </p>
          <p>
            Users should not submit protected health information, medical
            records, or sensitive government identification numbers through
            MedicaidReady.
          </p>
        </section>

        <section className="card">
          <h2>5. Job and career resources</h2>
          <p>
            If MedicaidReady displays healthcare job opportunities, applications
            may be routed directly to the employer, hiring platform, or external
            job site. MedicaidReady does not control the privacy practices of
            external employers or third-party job platforms.
          </p>
        </section>

        <section className="card">
          <h2>6. Sharing of information</h2>
          <p>
            MedicaidReady does not sell personal information. We may share
            limited information with service providers that help us operate the
            website, mobile app, hosting, analytics, security, email, or support
            services. We may also disclose information if required by law.
          </p>
        </section>

        <section className="card">
          <h2>7. Data retention</h2>
          <p>
            MedicaidReady retains information only as long as reasonably
            necessary to provide services, improve functionality, maintain
            security, comply with legal obligations, resolve disputes, and
            enforce agreements.
          </p>
          <p>
            Eligibility responses and technical data may be retained temporarily
            for operational, troubleshooting, analytics, and security purposes.
            When information is no longer needed, we delete, anonymize, or
            securely retain it only as required for legitimate business or legal
            purposes.
          </p>
        </section>

        <section className="card">
          <h2>8. Data deletion</h2>
          <p>
            Users may request deletion of personal information associated with
            their use of MedicaidReady by contacting us at{" "}
            <strong>support@medicaidready.org</strong>.
          </p>
          <p>
            Please include enough information for us to identify the relevant
            request. We will review and process deletion requests within a
            reasonable timeframe, subject to legal, security, fraud-prevention,
            and operational requirements.
          </p>
        </section>

        <section className="card">
          <h2>9. Analytics and third-party services</h2>
          <p>
            MedicaidReady may use third-party services such as hosting
            providers, app store platforms, analytics tools, crash reporting
            tools, and security services. These services may process limited
            technical or usage information according to their own privacy
            policies.
          </p>
        </section>

        <section className="card">
          <h2>10. Children’s privacy</h2>
          <p>
            MedicaidReady is not directed to children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="card">
          <h2>11. Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational
            safeguards to protect information. However, no website, app, or
            internet transmission is completely secure.
          </p>
        </section>

        <section className="card">
          <h2>12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page with a revised “Last updated” date.
          </p>
        </section>

        <section className="card">
          <h2>13. Contact us</h2>
          <p>
            For privacy questions or deletion requests, contact:
            <br />
            <strong>support@medicaidready.org</strong>
          </p>
          <p>
            Website:{" "}
            <a href="https://www.medicaidready.org">
              https://www.medicaidready.org
            </a>
          </p>
        </section>

        <footer>
          <Link href="/">Home</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <span>© 2026 MedicaidReady</span>
        </footer>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f6f8fb;
          color: #102a43;
          padding: 32px 18px 50px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        .hero,
        .card,
        footer {
          max-width: 920px;
          margin: 0 auto;
        }

        .brand {
          display: inline-block;
          margin-bottom: 34px;
          color: #0a3d6b;
          font-weight: 900;
          font-size: 22px;
          text-decoration: none;
        }

        .brand span {
          color: #c8942f;
        }

        .eyebrow {
          color: #c8942f;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }

        h1 {
          font-size: 44px;
          line-height: 1.05;
          margin: 0;
          color: #102a43;
          letter-spacing: -0.04em;
        }

        .updated {
          color: #52606d;
          margin: 14px 0 22px;
          font-size: 16px;
        }

        .notice {
          background: #fff7e6;
          border: 1px solid #f7d794;
          color: #5c4200;
          border-radius: 18px;
          padding: 18px;
          line-height: 1.65;
          margin-bottom: 18px;
          font-weight: 700;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e5eaf0;
          border-radius: 22px;
          padding: 24px;
          margin-top: 16px;
          box-shadow: 0 14px 32px rgba(11, 37, 69, 0.06);
        }

        h2 {
          font-size: 22px;
          margin: 0 0 12px;
          color: #0a3d6b;
        }

        p,
        li {
          color: #334e68;
          font-size: 16px;
          line-height: 1.75;
        }

        p {
          margin: 0 0 12px;
        }

        ul {
          margin: 0 0 12px;
          padding-left: 22px;
        }

        a {
          color: #0a3d6b;
          font-weight: 800;
        }

        footer {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 28px;
          color: #627d98;
          font-size: 14px;
        }

        footer a {
          color: #0a3d6b;
          text-decoration: none;
          font-weight: 800;
        }

        @media (max-width: 640px) {
          .page {
            padding: 24px 14px 42px;
          }

          h1 {
            font-size: 34px;
          }

          .card {
            padding: 19px;
          }
        }
      `}</style>
    </>
  );
}