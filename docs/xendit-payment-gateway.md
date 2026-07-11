# Xendit Payment Gateway — LMS Apoteker Rahmato (gated via Internal Ventera)

Pembayaran kelas di LMS ini memakai **Xendit**, tetapi TIDAK terhubung langsung
ke Xendit. Semua callback pembayaran diarahkan ke **gateway terpusat Internal
Ventera**, yang lalu meneruskannya kembali ke project ini. Ini membuat satu akun
Xendit bisa dipakai banyak project, dengan audit & routing terpusat.

- **Project prefix:** `LMSRHMT`
- **Format external_id:** `LMSRHMT-<invoice_uuid>`
- **LMS Supabase ref:** `qxunzdwldifsxxeqvhhc`
- **Gateway (Internal Ventera) Supabase ref:** `unpqekghcpjclzvpeyse`

## Arsitektur

```
Buat invoice:
  Frontend (StudentDashboard)
    └─> supabase.functions.invoke("lmsrhmt-create-invoice")
        └─> Xendit API v2  (external_id = LMSRHMT-<uuid>)
        └─> simpan baris ke tabel `invoices` (status: pending)
        └─> kembalikan invoice_url  →  browser di-redirect ke Xendit

Bayar & konfirmasi:
  User bayar di halaman Xendit (VA / QRIS / E-Wallet / Kartu / Retail)
    └─> Xendit callback  →  GATEWAY Internal Ventera (xendit-callback)
        └─> deteksi environment dari x-callback-token
        └─> ambil prefix "LMSRHMT" dari external_id → cari routing
        └─> forward ke  lmsrhmt-payment-confirm  (header x-internal-token)
            └─> validasi token → update `invoices` → status: paid
  Xendit redirect user → /?payment=success&inv=<id>&class=<id>
    └─> App.tsx menandai kelas aktif + banner sukses
```

## Komponen di repo ini

| File | Fungsi |
|------|--------|
| `supabase/migrations/004_invoices.sql` | Tabel `invoices` (RLS: service-role only) |
| `supabase/functions/lmsrhmt-create-invoice/index.ts` | Buat invoice Xendit, dipanggil frontend |
| `supabase/functions/lmsrhmt-payment-confirm/index.ts` | Terima callback dari gateway, update status |
| `supabase/config.toml` | `verify_jwt = false` untuk kedua function |
| `src/lib/api.ts` → `createXenditInvoice()` | Helper frontend |
| `src/components/StudentDashboard.tsx` | Modal checkout Xendit (menggantikan simulator) |
| `src/App.tsx` | Menangani redirect balik `?payment=success\|failed` |

Di repo **internal-ventera**: `supabase/migrations/20260711120000_xendit_routing_lmsrhmt.sql`
mendaftarkan prefix `LMSRHMT` → endpoint `lmsrhmt-payment-confirm` + internal token.

## Langkah deploy

### 1. Migration DB (LMS)
```bash
supabase link --project-ref qxunzdwldifsxxeqvhhc
supabase db push        # menjalankan 004_invoices.sql
```

### 2. Secrets edge function (LMS)
```bash
supabase secrets set XENDIT_ENV="sandbox"     # ganti "production" saat go-live
supabase secrets set XENDIT_API_KEY_SANDBOX="xnd_development_xxx"
supabase secrets set XENDIT_API_KEY_PRODUCTION="xnd_production_xxx"
supabase secrets set INTERNAL_TOKEN_SANDBOX="lmsrhmt_d5a540f7a26ce0168edece8c63512d6995945fe2d51dd971b1318b85478e3750"
supabase secrets set INTERNAL_TOKEN_PRODUCTION="lmsrhmt_ee1b3e217dbddd53f084134f5ecd9cc2a1658d66db65ba93006d007c72f9e6b6"
supabase secrets set APP_BASE_URL="https://<domain-lms>"
```
> `INTERNAL_TOKEN_*` HARUS sama persis dengan yang didaftarkan di routing table
> Internal Ventera (lihat langkah 4). `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`
> otomatis tersedia di edge functions.

### 3. Deploy functions (LMS) — WAJIB `--no-verify-jwt`
```bash
supabase functions deploy lmsrhmt-create-invoice  --no-verify-jwt
supabase functions deploy lmsrhmt-payment-confirm --no-verify-jwt
```

### 4. Daftarkan routing di Internal Ventera
Jalankan migration `20260711000000`+ di repo internal-ventera:
```bash
cd internal-ventera
supabase db push     # menjalankan 20260711120000_xendit_routing_lmsrhmt.sql
```
Atau lewat UI: **Internal Ventera → Xendit Gateway → Routing Config → Tambah Routing**
(prefix `LMSRHMT`, endpoint = URL `lmsrhmt-payment-confirm`, token = internal token di atas).

### 5. Xendit dashboard
Set **satu** callback URL invoice (dipakai gateway, bukan LMS):
```
https://unpqekghcpjclzvpeyse.supabase.co/functions/v1/xendit-callback
```
Token verifikasi (sandbox & production) di-set sebagai secret `XENDIT_TOKEN_SANDBOX`
/ `XENDIT_TOKEN_PRODUCTION` di project Internal Ventera (bukan di sini).

## Testing (sandbox)
1. Pastikan `XENDIT_ENV="sandbox"` dan pakai API key `xnd_development_...`.
2. Di app: **Beli Kelas Baru → Beli Kelas → Bayar Sekarang via Xendit**.
3. Selesaikan pembayaran di halaman Xendit (mode test).
4. Cek log gateway: `supabase functions logs xendit-callback` (project internal-ventera)
   dan tabel `xendit_callback_logs` — `forward_status` harus `200`.
5. Cek log LMS: `supabase functions logs lmsrhmt-payment-confirm` dan baris di
   tabel `invoices` (status `paid`).

## Catatan keamanan
- Tabel `invoices` RLS aktif tanpa policy publik → hanya edge function (service
  role) yang bisa baca/tulis. Frontend tidak pernah membacanya langsung.
- `lmsrhmt-payment-confirm` menolak request tanpa `x-internal-token` yang valid (401).
- Harga invoice diambil ulang dari tabel `classes` di server — nominal dari
  client diabaikan.
- Kelas "aktif" di sisi frontend setelah redirect adalah kenyamanan demo;
  **sumber kebenaran pembayaran adalah tabel `invoices`** yang di-update gateway.
```
