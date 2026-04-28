import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeEmail(v: unknown): string {
  return (v ?? "").toString().trim().toLowerCase();
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "Washington, DC",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const body = (req.body ?? {}) as Record<string, unknown>;

    const email = normalizeEmail(body.email);
    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    const state = (body.state ?? "").toString().trim().toUpperCase();
    if (!STATE_NAMES[state]) {
      return res.status(400).json({ ok: false, error: "invalid_state" });
    }

    const householdSize = clamp(Number(body.householdSize) || 1, 1, 8);
    const monthlyIncome = Math.max(0, Number(body.monthlyIncome) || 0);
    const age = clamp(Number(body.age) || 25, 0, 120);
    const employed = Boolean(body.employed);

    const stateName = STATE_NAMES[state];

    // Build Claude prompt
    const prompt = `You are a friendly Medicaid eligibility advisor. A user has submitted the following information:

- State: ${stateName} (${state})
- Household size: ${householdSize} person${householdSize !== 1 ? "s" : ""}
- Monthly household income: $${monthlyIncome.toLocaleString()}
- Age: ${age} years old
- Currently employed: ${employed ? "Yes" : "No"}

Based on current Medicaid and CHIP eligibility rules for ${stateName}, assess whether this person likely qualifies.

Key considerations:
- Whether ${stateName} has expanded Medicaid under the ACA (138% FPL threshold)
- Income compared to the federal poverty level for their household size
- Age-based categorical eligibility (children, pregnant, elderly, disabled)
- Employment is not a barrier to Medicaid eligibility in any state

Respond with valid JSON only — no markdown, no explanation outside of the JSON object:
{
  "qualified": true or false,
  "summary": "Write 2–3 warm, plain-English paragraphs. First paragraph: state the likely outcome clearly. Second paragraph: explain the key eligibility factors for their specific state. Third paragraph: tell them the concrete next step they should take."
}`;

    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mustGet("OPENROUTER_API_KEY")}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medicaidready.org",
        "X-Title": "MedicaidReady",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!orRes.ok) {
      const errText = await orRes.text();
      throw new Error(`OpenRouter error ${orRes.status}: ${errText}`);
    }

    const orData = (await orRes.json()) as {
      choices: { message: { content: string } }[];
    };
    const rawText = (orData.choices[0]?.message?.content ?? "").trim();

    let qualified: boolean;
    let summary: string;
    try {
      const parsed = JSON.parse(rawText) as { qualified: boolean; summary: string };
      qualified = Boolean(parsed.qualified);
      summary = String(parsed.summary ?? "").trim();
      if (!summary) throw new Error("empty summary");
    } catch {
      // Fallback: try to extract from text if JSON parse fails
      qualified = rawText.toLowerCase().includes('"qualified": true');
      summary = rawText.replace(/\{[\s\S]*"summary"\s*:\s*"/, "").replace(/"[\s\S]*\}$/, "").trim()
        || "We assessed your information. Please visit your state Medicaid office for a definitive determination.";
    }

    // Save to Supabase
    const sb = supabaseAdmin();
    const { data: inserted, error: dbErr } = await sb
      .from("eligibility_submissions")
      .insert({
        email,
        state,
        household_size: householdSize,
        monthly_income: monthlyIncome,
        age,
        employed,
        ai_result: summary,
        qualified,
      })
      .select("id")
      .single();

    if (dbErr) {
      console.error("Supabase insert error:", dbErr);
      // Don't block the user — return result even if DB save fails
    }

    return res.status(200).json({
      ok: true,
      id: inserted?.id ?? null,
      qualified,
      summary,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("check-eligibility error:", msg);
    return res.status(500).json({ ok: false, error: "internal_error", message: msg });
  }
}
