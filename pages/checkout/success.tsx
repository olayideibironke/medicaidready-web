import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function CheckoutSuccess() {
  const router = useRouter();

  const sessionId = useMemo(() => {
    return typeof router.query.session_id === "string"
      ? router.query.session_id
      : "";
  }, [router.query.session_id]);

  const [status, setStatus] = useState<"idle" | "resolving" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!sessionId) return;

    let cancelled = false;

    async function resolveAccess() {
      try {
        setStatus("resolving");

        const resp = await fetch(
          `/api/stripe/resolve-submission?session_id=${encodeURIComponent(
            sessionId
          )}`,
          { method: "GET" }
        );

        const json = await resp.json();

        if (!resp.ok || !json?.ok) {
          throw new Error(json?.message || "Failed to finalize access.");
        }

        if (!cancelled) {
          setStatus("done");

          // IMPORTANT: Hard redirect ensures cookie is sent next request
          window.location.href = "/providers";
        }
      } catch (e: any) {
        if (!cancelled) {
          setStatus("error");
          setError(e?.message || String(e));
        }
      }
    }

    resolveAccess();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, sessionId]);

  return (
    <>
      <Head>
        <title>Payment successful | MedicaidReady</title>
      </Head>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
        <h1>Payment successful</h1>
        <p>Your subscription is active. Finalizing access…</p>

        {status === "error" && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              border: "1px solid #f3b3b3",
              background: "#fff3f3",
              borderRadius: 12,
              color: "#7a1f1f",
            }}
          >
            <strong>Error:</strong>
            <div style={{ marginTop: 8 }}>{error}</div>
          </div>
        )}
      </main>
    </>
  );
}
