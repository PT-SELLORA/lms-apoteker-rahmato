import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSession } from '../lib/session.server.js';
import { resolveRealm } from '../lib/roles.server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ authenticated: false });
    return;
  }
  // Peran diambil dari DB LMS (user_roles), menimpa realm dari SSO.
  const realm = await resolveRealm(session);
  const { idToken: _i, accessToken: _a, refreshToken: _r, ...safe } = session;
  res.status(200).json({ authenticated: true, user: { ...safe, realm } });
}
