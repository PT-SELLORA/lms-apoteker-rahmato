import type { VercelRequest, VercelResponse } from '@vercel/node';
import { completeAuthorization } from '../lib/sso.server.js';
import { setSession, consumeTransaction } from '../lib/session.server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const host = req.headers.host ?? 'rahmato.storo.id';
  const currentUrl = new URL(req.url!, `https://${host}`);

  const tx = await consumeTransaction(req, res);
  if (!tx) {
    res.writeHead(303, { Location: '/?sso_error=no_transaction' });
    res.end();
    return;
  }

  try {
    const { tokens, claims } = await completeAuthorization(currentUrl, tx.state, tx.codeVerifier);
    await setSession(res, {
      sub: claims.sub,
      name: claims.name as string | undefined,
      email: claims.email as string | undefined,
      phone: claims.phone_number as string | undefined,
      realm: (claims as Record<string, unknown>).realm as string | undefined,
      idToken: tokens.id_token ?? '',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    const realm = (claims as Record<string, unknown>).realm as string | undefined;
    const redirectTo = realm === 'mentor' ? '/mentor' : '/kelas';
    res.writeHead(303, { Location: redirectTo });
    res.end();
  } catch (err) {
    console.error('[SSO callback]', err);
    res.writeHead(303, { Location: `/?sso_error=${encodeURIComponent(String(err))}` });
    res.end();
  }
}
