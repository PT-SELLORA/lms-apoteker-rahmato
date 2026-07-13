-- =============================================================================
-- 005_user_roles.sql
-- Peran pengguna (student / mentor / admin) dikelola di DB LMS — BUKAN di SSO.
-- SSO hanya untuk autentikasi (siapa kamu); tabel ini sumber kebenaran otorisasi.
-- Key = email (dari klaim SSO, disimpan lowercase).
--
-- Keamanan: RLS aktif TANPA policy publik. Hanya service role (server-side:
-- /api/auth/me untuk resolve peran, dan /api/roles untuk kelola) yang boleh
-- membaca/menulis. Ini mencegah kebocoran daftar email dan eskalasi hak akses
-- dari client anon.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  email      text PRIMARY KEY,
  role       text        NOT NULL DEFAULT 'student'
                         CHECK (role IN ('student', 'mentor', 'admin')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Normalisasi email ke lowercase + refresh updated_at pada setiap tulis.
CREATE OR REPLACE FUNCTION public.normalize_user_role()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.email = lower(NEW.email);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_roles_normalize ON public.user_roles;
CREATE TRIGGER trg_user_roles_normalize
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.normalize_user_role();

-- RLS aktif, tanpa policy publik => tabel privat, hanya service role.
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
