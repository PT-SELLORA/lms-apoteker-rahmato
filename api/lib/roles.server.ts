/**
 * Helper server-side untuk PERAN pengguna (student / mentor / admin).
 *
 * Sumber kebenaran peran ada di tabel Supabase `user_roles` (bukan di SSO).
 * Tabel ini PRIVAT (RLS tanpa policy publik), jadi hanya boleh diakses via
 * service role key dari sisi server — tidak pernah dari client.
 *
 * SSO tetap dipakai HANYA untuk autentikasi (siapa kamu). Peran diambil di sini.
 */
import type { SessionData } from './session.server.js';

export type AppRole = 'student' | 'mentor' | 'admin';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

function restHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

function configured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

/** Ambil peran untuk satu email. Null bila tidak ada baris / belum dikonfigurasi. */
export async function getRoleByEmail(email?: string): Promise<AppRole | null> {
  if (!email || !configured()) return null;
  const url = `${SUPABASE_URL}/rest/v1/user_roles?email=eq.${encodeURIComponent(
    email.toLowerCase(),
  )}&select=role&limit=1`;
  try {
    const resp = await fetch(url, { headers: restHeaders() });
    if (!resp.ok) return null;
    const rows = (await resp.json()) as Array<{ role: AppRole }>;
    return rows[0]?.role ?? null;
  } catch {
    return null;
  }
}

/**
 * Peran efektif untuk sebuah sesi SSO:
 * peran dari DB LMS menang; bila belum ada, fallback ke realm SSO; lalu 'student'.
 */
export async function resolveRealm(session: SessionData): Promise<string> {
  const dbRole = await getRoleByEmail(session.email);
  return dbRole ?? session.realm ?? 'student';
}

/** True bila email sesi adalah admin di DB LMS. */
export async function isAdminSession(session: SessionData | null): Promise<boolean> {
  if (!session?.email) return false;
  return (await getRoleByEmail(session.email)) === 'admin';
}

export interface UserRoleRow {
  email: string;
  role: AppRole;
  updated_at: string;
}

/** Daftar semua entri peran (untuk panel admin). */
export async function listRoles(): Promise<UserRoleRow[]> {
  if (!configured()) return [];
  const url = `${SUPABASE_URL}/rest/v1/user_roles?select=email,role,updated_at&order=updated_at.desc`;
  const resp = await fetch(url, { headers: restHeaders() });
  if (!resp.ok) throw new Error(`listRoles gagal: ${resp.status}`);
  return (await resp.json()) as UserRoleRow[];
}

/** Upsert peran untuk sebuah email (insert bila baru, update bila sudah ada). */
export async function upsertRole(email: string, role: AppRole): Promise<UserRoleRow> {
  if (!configured()) throw new Error('Supabase belum dikonfigurasi di server');
  const url = `${SUPABASE_URL}/rest/v1/user_roles?on_conflict=email`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: restHeaders({
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify({ email: email.toLowerCase(), role }),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`upsertRole gagal: ${resp.status} ${detail}`);
  }
  const rows = (await resp.json()) as UserRoleRow[];
  return rows[0];
}
