import { supabaseAdmin } from "../supabaseAdmin";

export type SubscribeInput = {
  email: string;
  source?: string;
  category?: string;
};

export type SubscribeResult = {
  ok: true;
  alreadySubscribed: boolean;
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function subscribeJobAlert(
  input: SubscribeInput
): Promise<SubscribeResult> {
  const email = (input.email ?? "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    throw new Error("email_invalid");
  }

  const source = (input.source ?? "unknown").trim().slice(0, 64) || "unknown";
  const category = (input.category ?? "").trim().slice(0, 64) || null;

  const sb = supabaseAdmin();

  const { data: existing, error: existingErr } = await sb
    .from("careers_job_alert_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existingErr) throw new Error(existingErr.message);

  if (existing?.id) {
    if (existing.status !== "active") {
      const { error } = await sb
        .from("careers_job_alert_subscribers")
        .update({ status: "active", unsubscribed_at: null })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true, alreadySubscribed: true };
  }

  const { error: insertErr } = await sb
    .from("careers_job_alert_subscribers")
    .insert({
      email,
      source,
      category,
      status: "active",
    });

  if (insertErr) throw new Error(insertErr.message);

  return { ok: true, alreadySubscribed: false };
}
