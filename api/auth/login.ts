import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildAuthorizationStart } from '../lib/sso.server.js';
import { setTransaction } from '../lib/session.server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { state, codeVerifier, authorizationUrl } = await buildAuthorizationStart();
  await setTransaction(res, state, codeVerifier);
  res.writeHead(303, { Location: authorizationUrl });
  res.end();
}
