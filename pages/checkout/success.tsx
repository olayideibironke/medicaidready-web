import Head from "next/head";
import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <>
      <Head>
        <title>You&apos;re all set! — MedicaidReady</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="page">
        <div className="container">
          <div className="card">
            <div className="icon" aria-hidden="true">🎉</div>
            <h1 className="title">You&apos;re all set!</h1>
            <p className="body">
              Your <strong>Complete Medicaid Application Guide</strong> is on its way.
              Check your email — it should arrive within a few minutes.
            </p>
            <p className="body">
              If you don&apos;t see it in 10 minutes, check your spam folder or contact us at{" "}
              <a href="mailto:support@medicaidready.org" className="link">
                support@medicaidready.org
              </a>
              .
            </p>

            <div className="actions">
              <Link href="/" className="btnPrimary">
                Back to home
              </Link>
              <Link href="/quiz" className="btnSecondary">
                Run another check
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          background: #f3f6fb;
          padding: 72px 0;
          min-height: 60vh;
          display: flex;
          align-items: center;
        }

        .container {
          max-width: 520px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
        }

        .card {
          background: #ffffff;
          border: 1px solid rgba(230, 233, 239, 0.95);
          border-radius: 24px;
          box-shadow: 0 16px 40px rgba(11, 18, 32, 0.09);
          padding: 40px 36px;
          text-align: center;
        }

        .icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .title {
          margin: 0 0 14px;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.035em;
          color: #0b1220;
        }

        .body {
          margin: 0 0 12px;
          color: #445065;
          font-size: 15px;
          line-height: 1.7;
        }

        .link {
          color: #0b3a66;
          font-weight: 700;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btnPrimary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0b3a66, #0f6aa6);
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          border: 1px solid rgba(11, 58, 102, 0.3);
          box-shadow: 0 8px 20px rgba(11, 18, 32, 0.14);
          text-decoration: none;
        }

        .btnSecondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 22px;
          border-radius: 12px;
          background: #ffffff;
          color: #0b1220;
          font-weight: 700;
          font-size: 14px;
          border: 1.5px solid rgba(11, 58, 102, 0.18);
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
