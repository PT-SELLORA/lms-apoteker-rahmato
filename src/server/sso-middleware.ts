/**
 * Vite plugin: menambahkan auth routes SSO Ventera ke Vite dev server.
 * Routes: GET /auth/login  GET /auth/callback  POST /auth/logout  GET /api/auth/me
 *
 * Pattern BFF (Backend-For-Frontend): token tidak pernah ke browser,
 * hanya JWE session cookie (httpOnly) yang dikirim ke client.
 */
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { buildAuthorizationStart, completeAuthorization, buildLogoutUrl } from '../../api/lib/sso.server';
import {
  setSession,
  getSession,
  clearSession,
  setTransaction,
  consumeTransaction,
  type SessionData,
} from '../../api/lib/session.server';
import {
  resolveRealm,
  isAdminSession,
  listRoles,
  upsertRole,
} from '../../api/lib/roles.server';

function redirect(res: ServerResponse, url: string, status = 303) {
  res.writeHead(status, { Location: url });
  res.end();
}

function json(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

async function handleLogin(res: ServerResponse) {
  const { state, codeVerifier, authorizationUrl } = await buildAuthorizationStart();
  await setTransaction(res, state, codeVerifier);
  redirect(res, authorizationUrl);
}

async function handleCallback(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? `localhost:${process.env.PORT ?? '3007'}`;
  const currentUrl = new URL(req.url!, `http://${host}`);

  const tx = await consumeTransaction(req, res);
  if (!tx) {
    redirect(res, '/?sso_error=no_transaction');
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
    redirect(res, '/');
  } catch (err) {
    console.error('[SSO] callback error:', err);
    redirect(res, `/?sso_error=${encodeURIComponent(String(err))}`);
  }
}

async function handleLogout(req: IncomingMessage, res: ServerResponse) {
  const session = await getSession(req);
  clearSession(res);
  const url = await buildLogoutUrl(session?.idToken);
  redirect(res, url);
}

async function handleMe(req: IncomingMessage, res: ServerResponse) {
  const session = await getSession(req);
  if (!session) {
    json(res, { authenticated: false }, 401);
    return;
  }
  // Peran diambil dari DB LMS (user_roles), menimpa realm dari SSO.
  const realm = await resolveRealm(session);
  const { idToken: _i, accessToken: _a, refreshToken: _r, ...safe } = session;
  json(res, { authenticated: true, user: { ...safe, realm } });
}

async function handleRoles(req: IncomingMessage, res: ServerResponse) {
  const session = await getSession(req);
  if (!session) {
    json(res, { error: 'Belum login' }, 401);
    return;
  }
  if (!(await isAdminSession(session))) {
    json(res, { error: 'Hanya admin yang boleh mengelola peran' }, 403);
    return;
  }

  if (req.method === 'GET') {
    json(res, { roles: await listRoles() });
    return;
  }

  if (req.method === 'POST') {
    let parsed: { email?: string; role?: string } = {};
    try {
      parsed = JSON.parse((await readBody(req)) || '{}');
    } catch {
      parsed = {};
    }
    const { email, role } = parsed;
    if (!email || !role || !['student', 'mentor', 'admin'].includes(role)) {
      json(res, { error: 'email & role (student|mentor|admin) wajib diisi' }, 400);
      return;
    }
    try {
      const saved = await upsertRole(email, role as 'student' | 'mentor' | 'admin');
      json(res, { ok: true, row: saved });
    } catch (err) {
      json(res, { error: String((err as Error).message ?? err) }, 500);
    }
    return;
  }

  json(res, { error: 'Method tidak didukung' }, 405);
}

export function ssoPlugin(): Plugin {
  return {
    name: 'vite-plugin-ventera-sso',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '/';
        const method = req.method ?? 'GET';

        try {
          if (method === 'GET' && url === '/auth/login') {
            await handleLogin(res);
          } else if (method === 'GET' && url.startsWith('/auth/callback')) {
            await handleCallback(req, res);
          } else if (method === 'POST' && url === '/auth/logout') {
            await handleLogout(req, res);
          } else if (method === 'GET' && url === '/api/auth/me') {
            await handleMe(req, res);
          } else if (url === '/api/roles' || url.startsWith('/api/roles?')) {
            await handleRoles(req, res);
          } else {
            next();
          }
        } catch (err) {
          console.error('[SSO middleware]', err);
          next(err);
        }
      });
    },
  };
}
