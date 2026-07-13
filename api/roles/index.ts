/**
 * /api/roles — kelola peran pengguna (khusus admin).
 *   GET  -> daftar semua peran
 *   POST -> { email, role } upsert peran
 *
 * Penjaga: hanya sesi SSO yang email-nya ber-peran `admin` di DB LMS yang boleh.
 * Ini mencegah eskalasi hak akses dari sembarang pengguna di situs publik.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSession } from '../lib/session.server.js';
import { isAdminSession, listRoles, upsertRole, type AppRole } from '../lib/roles.server.js';

const VALID_ROLES: AppRole[] = ['student', 'mentor', 'admin'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Belum login' });
    return;
  }
  if (!(await isAdminSession(session))) {
    res.status(403).json({ error: 'Hanya admin yang boleh mengelola peran' });
    return;
  }

  try {
    if (req.method === 'GET') {
      res.status(200).json({ roles: await listRoles() });
      return;
    }

    if (req.method === 'POST') {
      const { email, role } = (req.body ?? {}) as { email?: string; role?: string };
      if (!email || !role || !VALID_ROLES.includes(role as AppRole)) {
        res.status(400).json({ error: 'email & role (student|mentor|admin) wajib diisi' });
        return;
      }
      const saved = await upsertRole(email, role as AppRole);
      res.status(200).json({ ok: true, row: saved });
      return;
    }

    res.status(405).json({ error: 'Method tidak didukung' });
  } catch (err) {
    res.status(500).json({ error: String((err as Error).message ?? err) });
  }
}
