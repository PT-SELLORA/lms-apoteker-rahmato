// =============================================================================
// lmsrhmt-payment-confirm
// -----------------------------------------------------------------------------
// Menerima notifikasi pembayaran yang DITERUSKAN oleh Xendit Gateway
// (Internal Ventera). Bukan dipanggil langsung oleh Xendit, melainkan oleh
// fungsi `xendit-callback` di project Internal Ventera setelah merouting
// berdasarkan prefix external_id (LMSRHMT-...).
//
// Keamanan: memvalidasi header `x-internal-token` terhadap secret yang sama
// dengan yang didaftarkan di xendit_routing_table Internal Ventera.
//
// Deploy:
//   supabase functions deploy lmsrhmt-payment-confirm --no-verify-jwt
// Secrets:
//   supabase secrets set INTERNAL_TOKEN_SANDBOX="lmsrhmt_xxx"
//   supabase secrets set INTERNAL_TOKEN_PRODUCTION="lmsrhmt_xxx"
// =============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const TOKEN_PRODUCTION = Deno.env.get("INTERNAL_TOKEN_PRODUCTION") ?? "";
const TOKEN_SANDBOX = Deno.env.get("INTERNAL_TOKEN_SANDBOX") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-token",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Map status Xendit -> status invoices lokal
function mapStatus(xenditStatus: string): "paid" | "expired" | "failed" | null {
  const s = xenditStatus?.toUpperCase();
  if (s === "PAID" || s === "SETTLED") return "paid";
  if (s === "EXPIRED") return "expired";
  if (s === "FAILED") return "failed";
  return null; // PENDING / lainnya -> tidak ada perubahan
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // --- 1. Validasi internal token dari gateway ---
  const incoming = req.headers.get("x-internal-token") ?? "";
  const isValid =
    (TOKEN_PRODUCTION && incoming === TOKEN_PRODUCTION) ||
    (TOKEN_SANDBOX && incoming === TOKEN_SANDBOX);
  if (!isValid) {
    return json({ error: "Unauthorized" }, 401);
  }

  // --- 2. Parse payload dari gateway ---
  let payload: {
    external_id?: string;
    invoice_id?: string;
    status?: string;
    amount?: number;
    paid_at?: string;
    payment_method?: string;
    payment_channel?: string;
    environment?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Body JSON tidak valid" }, 400);
  }

  const externalId = payload.external_id;
  if (!externalId) return json({ error: "external_id tidak ada" }, 400);

  const nextStatus = mapStatus(payload.status ?? "");
  console.info(
    `[payment-confirm] [${payload.environment ?? "?"}] ${externalId} -> ${payload.status} (${nextStatus ?? "skip"})`,
  );

  // Status yang tidak final (mis. PENDING) -> tidak diproses, tetap 200
  if (!nextStatus) {
    return json({ ok: true, skipped: true, reason: "non-final status" });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // --- 3. Cari invoice berdasarkan external_id ---
  const { data: invoice, error: findError } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("external_id", externalId)
    .maybeSingle();

  if (findError) {
    console.error("[payment-confirm] lookup error:", findError.message);
    return json({ error: "DB lookup error" }, 500);
  }
  if (!invoice) {
    console.error("[payment-confirm] invoice tidak ditemukan:", externalId);
    return json({ error: "Invoice not found" }, 404);
  }

  // --- 4. Idempoten: kalau sudah final, jangan proses ulang ---
  if (invoice.status !== "pending") {
    return json({ ok: true, skipped: true, reason: `already ${invoice.status}` });
  }

  // --- 5. Update status invoice ---
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      status: nextStatus,
      paid_at: nextStatus === "paid" ? (payload.paid_at ?? new Date().toISOString()) : null,
      amount: typeof payload.amount === "number" ? payload.amount : undefined,
      payment_method: payload.payment_method ?? null,
      payment_channel: payload.payment_channel ?? null,
    })
    .eq("id", invoice.id)
    .eq("status", "pending"); // guard balapan (race) — hanya update kalau masih pending

  if (updateError) {
    console.error("[payment-confirm] update gagal:", updateError.message);
    return json({ error: updateError.message }, 500);
  }

  console.info(`[payment-confirm] ${externalId} -> ${nextStatus}`);
  return json({ ok: true, external_id: externalId, status: nextStatus });
});
