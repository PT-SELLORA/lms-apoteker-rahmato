/**
 * Session helper untuk Vite middleware (Node.js IncomingMessage/ServerResponse).
 * Diadaptasi dari ventera-sso/templates/session.ts — logic JWE sama persis,
 * API diganti dari Next.js cookies() ke req/res langsung.
 */
import { EncryptJWT, jwtDecrypt } from 'jose';
import type { IncomingMessage, ServerResponse } from 'http';

const IS_PROD = process.env.NODE_ENV === 'production';

const RAW_SECRET = process.env.SESSION_SECRET ?? '';
const DEV_FALLBACK_SECRET = 'dev-secret-change-me-min-32chars';
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'ventera_session';
const TX_COOKIE = 'sso_tx';

// Kunci enkripsi cookie sesi (JWE), dihitung lazy saat pertama dipakai. Sesi
// membawa identitas + peran efektif, jadi kunci lemah = cookie bisa dipalsukan =
// eskalasi jadi admin. Di production SESSION_SECRET WAJIB diset & kuat (min 32
// karakter, bukan default) — kalau tidak, gagal keras. Lazy agar proses build
// (yang meng-import modul ini) tidak ikut throw.
let cachedKey: Uint8Array | null = null;
function sessionKey(): Uint8Array {
  if (cachedKey) return cachedKey;
  if (IS_PROD && (RAW_SECRET.length < 32 || RAW_SECRET === DEV_FALLBACK_SECRET)) {
    throw new Error(
      'SESSION_SECRET wajib diset minimal 32 karakter acak di production (jangan pakai default).',
    );
  }
  const secret = (RAW_SECRET || DEV_FALLBACK_SECRET).padEnd(32, '_').slice(0, 32);
  cachedKey = new TextEncoder().encode(secret);
  return cachedKey;
}

export interface SessionData {
  sub: string;
  name?: string;
  email?: string;
  phone?: string;
  realm?: string;
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  exp: number;
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const header = req.headers.cookie ?? '';
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((pair) => {
      const idx = pair.indexOf('=');
      return [pair.slice(0, idx).trim(), pair.slice(idx + 1).trim()];
    }),
  );
}

function setCookie(res: ServerResponse, name: string, value: string, maxAge: number) {
  const secure = IS_PROD ? '; Secure' : '';
  const cookie = `${name}=${value}; HttpOnly; SameSite=Lax; Path=/${secure}; Max-Age=${maxAge}`;
  const existing = res.getHeader('Set-Cookie');
  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookie]);
  } else if (existing) {
    res.setHeader('Set-Cookie', [existing as string, cookie]);
  } else {
    res.setHeader('Set-Cookie', cookie);
  }
}

function deleteCookie(res: ServerResponse, name: string) {
  setCookie(res, name, '', 0);
}

export async function setSession(
  res: ServerResponse,
  data: Omit<SessionData, 'exp'>,
  ttlSeconds = 60 * 60 * 24,
): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const jwe = await new EncryptJWT({ ...data, exp })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .encrypt(sessionKey());
  setCookie(res, COOKIE_NAME, jwe, ttlSeconds);
}

export async function getSession(req: IncomingMessage): Promise<SessionData | null> {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, sessionKey());
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(res: ServerResponse): void {
  deleteCookie(res, COOKIE_NAME);
}

export async function setTransaction(
  res: ServerResponse,
  state: string,
  codeVerifier: string,
): Promise<void> {
  const jwe = await new EncryptJWT({ state, codeVerifier })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .encrypt(sessionKey());
  setCookie(res, TX_COOKIE, jwe, 600);
}

export async function consumeTransaction(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<{ state: string; codeVerifier: string } | null> {
  const token = parseCookies(req)[TX_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, sessionKey());
    deleteCookie(res, TX_COOKIE);
    return { state: payload.state as string, codeVerifier: payload.codeVerifier as string };
  } catch {
    return null;
  }
}
