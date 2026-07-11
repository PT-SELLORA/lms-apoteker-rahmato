-- =============================================================================
-- LMS Apoteker Rahmato / Farma Masterclass
-- Migration 004: Invoices (Xendit payments — gated via Internal Ventera gateway)
-- =============================================================================
-- Alur pembayaran:
--   1. Frontend -> edge function `lmsrhmt-create-invoice` -> Xendit API v2
--      external_id = 'LMSRHMT-<invoice.id>'  (prefix WAJIB agar gateway bisa merouting)
--   2. User bayar di halaman Xendit (VA / QRIS / E-Wallet / Kartu).
--   3. Xendit -> callback ke gateway Internal Ventera (xendit-callback)
--      -> diteruskan ke edge function `lmsrhmt-payment-confirm` (header x-internal-token)
--      -> baris invoices di-update status = 'paid'.
--
-- CATATAN: amount disimpan dalam RUPIAH penuh (bukan sen) supaya konsisten
-- dengan classes.price dan dengan konvensi create-invoice gateway (Xendit IDR
-- memakai rupiah penuh).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- external_id yang dikirim ke Xendit: 'LMSRHMT-<id>'. Unik & dipakai gateway
  -- untuk mencocokkan callback kembali ke baris ini.
  external_id      text        NOT NULL UNIQUE,

  -- Kelas yang dibeli + identitas pembeli (LMS pakai SSO/simulator, bukan
  -- Supabase Auth, jadi identitas disimpan langsung di sini).
  class_id         text        REFERENCES public.classes(id) ON DELETE SET NULL,
  buyer_name       text        NOT NULL DEFAULT '',
  buyer_email      text        NOT NULL DEFAULT '',

  amount           integer     NOT NULL,                 -- Rupiah penuh
  currency         text        NOT NULL DEFAULT 'IDR',
  status           text        NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'paid', 'expired', 'failed')),

  -- Data dari Xendit
  xendit_invoice_id text,
  invoice_url       text,
  payment_method    text,
  payment_channel   text,
  environment       text       CHECK (environment IN ('sandbox', 'production')),

  paid_at          timestamptz,
  metadata         jsonb       NOT NULL DEFAULT '{}',

  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_external_id      ON public.invoices(external_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status           ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_class_id         ON public.invoices(class_id);
CREATE INDEX IF NOT EXISTS idx_invoices_xendit_invoice   ON public.invoices(xendit_invoice_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_invoices_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoices_updated_at();

-- =============================================================================
-- RLS: invoices hanya boleh disentuh oleh edge functions (service role bypass
-- RLS otomatis). TIDAK ada policy publik — mencegah anon membaca daftar invoice.
-- Frontend tidak pernah membaca tabel ini langsung; status pembayaran adalah
-- sumber kebenaran server-side yang di-update oleh gateway.
-- =============================================================================
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
