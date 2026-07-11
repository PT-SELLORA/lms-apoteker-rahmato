import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildLogoutUrl } from '../lib/sso.server.js';
import { getSession, clearSession } from '../lib/session.server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await getSession(req);
  clearSession(res);
  const url = await buildLogoutUrl(session?.idToken);
  res.writeHead(303, { Location: url });
  res.end();
}
