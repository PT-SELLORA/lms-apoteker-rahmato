# LMS Apoteker Rahmato — Farma Masterclass

Learning Management System (mock-up demo) untuk kelas farmasi klinis Apoteker Rahmato.

> **Status: DEMO / MOCK.** Sebagian besar fitur (siswa, transaksi, forum, kuis, materi,
> notifikasi, pesan) berjalan di **localStorage** dengan data seed dari
> [`src/data/coursesData.ts`](src/data/coursesData.ts). Backend nyata yang sudah aktif:
> **SSO Ventera** (login), **katalog kelas** (Supabase), **pembayaran Xendit**
> (edge functions), dan **kelola peran** (`/api/roles`).

## Menjalankan Lokal

**Prasyarat:** Node.js 18+

1. Install dependency:
   ```
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local` dan isi minimal:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — untuk katalog kelas.
   - Variabel `SSO_*` / `SESSION_SECRET` — untuk login SSO (opsional saat demo UI).
   - Secret Xendit di-set lewat `supabase secrets` (bukan `.env` frontend).
3. Jalankan:
   ```
   npm run dev
   ```
   App berjalan di http://localhost:3000

## Skrip

- `npm run dev` — dev server (Vite) di port 3000.
- `npm run build` — build produksi ke `dist/`.
- `npm run preview` — preview hasil build.
- `npm run lint` — typecheck (`tsc --noEmit`).

## Arsitektur singkat

- **Frontend:** React 19 + React Router 7 + Tailwind 4 + Motion.
- **Auth:** SSO Ventera (OIDC + cookie JWE, pola BFF) — lihat [`api/`](api/) & [`src/server/sso-middleware.ts`](src/server/sso-middleware.ts).
- **Data kelas:** Supabase (`src/lib/api.ts` → `loadClasses`).
- **Pembayaran:** Xendit via gateway Internal Ventera — lihat [`supabase/functions/`](supabase/functions/) & [`docs/xendit-payment-gateway.md`](docs/xendit-payment-gateway.md).
- **Peran (student/mentor/admin):** tabel `user_roles` (privat), dikelola via `/api/roles`.
