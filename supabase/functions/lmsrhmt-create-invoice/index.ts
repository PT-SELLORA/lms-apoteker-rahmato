// =============================================================================
// lmsrhmt-create-invoice
// -----------------------------------------------------------------------------
// Membuat invoice Xendit untuk pembelian kelas LMS Apoteker Rahmato.
// Dipanggil dari frontend via supabase.functions.invoke("lmsrhmt-create-invoice").
//
// external_id WAJIB berformat  LMSRHMT-<invoice_id>  agar Xendit Gateway
// (Internal Ventera) dapat merouting callback pembayaran kembali ke sini.
//
// Deploy:
//   supabase functions deploy lmsrhmt-create-invoice --no-verify-jwt
// Secrets:
//   supabase secrets set XENDIT_ENV="sandbox"
//   supabase secrets set XENDIT_API_KEY_SANDBOX="xnd_development_xxx"
//   supabase secrets set XENDIT_API_KEY_PRODUCTION="xnd_production_xxx"
//   supabase secrets set APP_BASE_URL="https://your-lms-domain"
// =============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const PREFIX = "LMSRHMT";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // --- 1. Environment & API key ---
  const env = (Deno.env.get("XENDIT_ENV") ?? "sandbox").toLowerCase();
  const apiKey =
    env === "production"
      ? Deno.env.get("XENDIT_API_KEY_PRODUCTION")
      : Deno.env.get("XENDIT_API_KEY_SANDBOX");

  if (!apiKey) {
    console.error(`[create-invoice] Missing Xendit API key for env=${env}`);
    return json({ error: "Payment gateway belum dikonfigurasi." }, 500);
  }

  const appBaseUrl = (Deno.env.get("APP_BASE_URL") ?? "").replace(/\/$/, "");

  // --- 2. Parse & validate input ---
  let body: {
    class_id?: string;
    buyer_name?: string;
    buyer_email?: string;
    redirect_base?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Body JSON tidak valid" }, 400);
  }

  const classId = body.class_id?.trim();
  const buyerName = (body.buyer_name ?? "").trim();
  const buyerEmail = (body.buyer_email ?? "").trim();

  if (!classId) return json({ error: "class_id wajib diisi" }, 400);

  // Base URL untuk redirect: pakai redirect_base dari client bila valid http(s)
  // (mis. http://localhost:3000 saat dev), jika tidak pakai APP_BASE_URL.
  let redirectBase = appBaseUrl;
  const rb = body.redirect_base?.trim();
  if (rb && /^https?:\/\/[^ "']+$/.test(rb)) {
    redirectBase = rb.replace(/\/$/, "");
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // --- 3. Ambil harga kelas dari DB (jangan percaya amount dari client) ---
  const { data: cls, error: clsError } = await supabase
    .from("classes")
    .select("id, name, generation_name, price")
    .eq("id", classId)
    .single();

  if (clsError || !cls) {
    return json({ error: "Kelas tidak ditemukan" }, 404);
  }
  if (!cls.price || cls.price <= 0) {
    return json({ error: "Kelas ini tidak berbayar / harga tidak valid" }, 400);
  }

  // --- 4. Buat baris invoice (status pending) ---
  const invoiceId = crypto.randomUUID();
  const externalId = `${PREFIX}-${invoiceId}`;

  const { error: insertError } = await supabase.from("invoices").insert({
    id: invoiceId,
    external_id: externalId,
    class_id: cls.id,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    amount: cls.price,
    currency: "IDR",
    status: "pending",
    environment: env === "production" ? "production" : "sandbox",
    metadata: { class_name: cls.name, generation_name: cls.generation_name },
  });

  if (insertError) {
    console.error("[create-invoice] insert gagal:", insertError.message);
    return json({ error: "Gagal membuat invoice" }, 500);
  }

  // --- 5. Panggil Xendit API v2 ---
  const successUrl = redirectBase
    ? `${redirectBase}/?payment=success&inv=${invoiceId}&class=${encodeURIComponent(cls.id)}`
    : undefined;
  const failureUrl = redirectBase
    ? `${redirectBase}/?payment=failed&inv=${invoiceId}`
    : undefined;

  // Catatan: sengaja TIDAK mengirim `payment_methods` — Xendit akan menampilkan
  // semua metode yang aktif di akun. Mengirim daftar eksplisit membuat invoice
  // ditolak di akun production jika ada metode yang belum diaktifkan
  // ("unsupported IDR payment methods").
  const xenditPayload: Record<string, unknown> = {
    external_id: externalId,
    amount: cls.price,
    currency: "IDR",
    description: `Pendaftaran kelas ${cls.name} (${cls.generation_name}) — LMS Apoteker Rahmato`,
    invoice_duration: 86400, // 24 jam
    customer: {
      given_names: buyerName || "Peserta LMS",
      email: buyerEmail || undefined,
    },
  };
  if (successUrl) xenditPayload.success_redirect_url = successUrl;
  if (failureUrl) xenditPayload.failure_redirect_url = failureUrl;

  let xenditResp: Response;
  try {
    xenditResp = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Basic auth: base64(apiKey + ":")
        Authorization: `Basic ${btoa(apiKey + ":")}`,
      },
      body: JSON.stringify(xenditPayload),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    console.error("[create-invoice] Xendit fetch error:", err);
    await supabase.from("invoices").update({ status: "failed" }).eq("id", invoiceId);
    return json({ error: "Tidak dapat menghubungi Xendit" }, 502);
  }

  const xenditData = await xenditResp.json().catch(() => ({}));

  if (!xenditResp.ok) {
    console.error("[create-invoice] Xendit non-2xx:", xenditResp.status, xenditData);
    await supabase.from("invoices").update({ status: "failed" }).eq("id", invoiceId);
    return json(
      { error: xenditData?.message ?? "Xendit menolak pembuatan invoice" },
      502,
    );
  }

  const invoiceUrl = xenditData.invoice_url as string | undefined;
  const xenditInvoiceId = xenditData.id as string | undefined;

  // --- 6. Simpan referensi Xendit ke invoice ---
  await supabase
    .from("invoices")
    .update({ xendit_invoice_id: xenditInvoiceId, invoice_url: invoiceUrl })
    .eq("id", invoiceId);

  console.info(
    `[create-invoice] [${env}] ${externalId} -> Xendit ${xenditInvoiceId}`,
  );

  return json({
    invoice_id: invoiceId,
    external_id: externalId,
    invoice_url: invoiceUrl,
    amount: cls.price,
  });
});
