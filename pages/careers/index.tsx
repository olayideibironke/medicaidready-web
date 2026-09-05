import Head from "next/head";

const ROLEARROW_URL = "https://www.rolearrow.org";

export default function CareersMovedPage() {
  return (
    <>
      <Head>
        <title>MedicaidReady Careers Has Moved to RoleArrow</title>
        <meta
          name="description"
          content="MedicaidReady Careers has moved to RoleArrow, our dedicated job search and career platform."
        />
        <link rel="canonical" href="https://www.medicaidready.org/careers" />
        <meta property="og:title" content="MedicaidReady Careers Has Moved to RoleArrow" />
        <meta
          property="og:description"
          content="Our careers platform now has a dedicated home at RoleArrow."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medicaidready.org/careers" />
      </Head>

      <main className="careers-moved-page">
        <section className="careers-moved-card" aria-labelledby="careers-moved-title">
          <div className="careers-moved-eyebrow">MedicaidReady Careers</div>

          <div className="careers-moved-icon" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <path
                d="M8 21h24M24 12l9 9-9 9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 id="careers-moved-title">MedicaidReady Careers has moved.</h1>

          <p className="careers-moved-lead">
            Our careers platform now has a dedicated home at <strong>RoleArrow</strong>.
            Continue there for verified job opportunities, employer information, hiring
            reports, career resources, and tools designed to support your next career move.
          </p>

          <a href={ROLEARROW_URL} className="careers-moved-button">
            Visit RoleArrow
            <span aria-hidden="true">→</span>
          </a>

          <div className="careers-moved-url">www.rolearrow.org</div>
        </section>
      </main>

      <style jsx global>{`
        .footer {
          display: none !important;
        }

        .careers-moved-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          background:
            radial-gradient(circle at 14% 18%, rgba(239, 159, 39, 0.16), transparent 26%),
            radial-gradient(circle at 86% 18%, rgba(12, 68, 124, 0.20), transparent 32%),
            linear-gradient(180deg, #eef4fb 0%, #f8fafc 100%);
        }

        .careers-moved-card {
          width: 100%;
          max-width: 940px;
          border: 1px solid #dbe5f0;
          border-radius: 32px;
          background: #ffffff;
          padding: 72px 64px;
          text-align: center;
          box-shadow: 0 30px 90px rgba(4, 44, 83, 0.14);
        }

        .careers-moved-eyebrow {
          color: #ba7517;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .careers-moved-icon {
          width: 82px;
          height: 82px;
          margin: 30px auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          background: #eef4fb;
          color: #0c447c;
          box-shadow: inset 0 -4px 0 #ef9f27;
        }

        .careers-moved-card h1 {
          max-width: 820px;
          margin: 30px auto 0;
          color: #042c53;
          font-size: clamp(44px, 7vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .careers-moved-lead {
          max-width: 760px;
          margin: 28px auto 0;
          color: #475569;
          font-size: 19px;
          line-height: 1.75;
        }

        .careers-moved-lead strong {
          color: #042c53;
          font-weight: 950;
        }

        .careers-moved-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 58px;
          margin-top: 38px;
          padding: 0 30px;
          border-radius: 15px;
          background: linear-gradient(135deg, #042c53, #0c447c);
          color: #ffffff;
          font-size: 16px;
          font-weight: 950;
          text-decoration: none;
          box-shadow: 0 16px 34px rgba(4, 44, 83, 0.22), inset 0 -3px 0 #ba7517;
          transition: transform 150ms ease, box-shadow 150ms ease;
        }

        .careers-moved-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(4, 44, 83, 0.26), inset 0 -3px 0 #ef9f27;
        }

        .careers-moved-url {
          margin-top: 18px;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        @media (max-width: 680px) {
          .careers-moved-page {
            padding: 36px 16px;
          }

          .careers-moved-card {
            padding: 48px 22px;
            border-radius: 24px;
          }

          .careers-moved-lead {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
