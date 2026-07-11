/**
 * SSO Ventera helper untuk Vite React SPA.
 * Diadaptasi dari ventera-sso/templates/sso.ts — logic sama persis,
 * hanya env var prefix disesuaikan (SSO_ tetap, APP_BASE_URL diganti VITE_APP_URL).
 *
 * Jalan di Node.js (Vite configureServer middleware), BUKAN di browser bundle.
 */
import * as client from 'openid-client';

const ISSUER = process.env.SSO_ISSUER ?? 'http://localhost:3030';
const CLIENT_ID = process.env.SSO_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.SSO_CLIENT_SECRET ?? '';
const APP_BASE_URL = process.env.APP_BASE_URL ?? 'http://localhost:3007';

export const REDIRECT_URI = `${APP_BASE_URL}/auth/callback`;
export const POST_LOGOUT_URI = `${APP_BASE_URL}/`;

const SCOPE = 'openid profile email phone offline_access realm';

let _config: client.Configuration | undefined;

export async function getOidcConfig(): Promise<client.Configuration> {
  if (_config) return _config;
  _config = await client.discovery(
    new URL(ISSUER),
    CLIENT_ID,
    CLIENT_SECRET || undefined,
    undefined,
    {
      execute: ISSUER.startsWith('http://') ? [client.allowInsecureRequests] : [],
    },
  );
  return _config;
}

export async function buildAuthorizationStart() {
  const config = await getOidcConfig();
  const state = client.randomState();
  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

  const url = client.buildAuthorizationUrl(config, {
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return { state, codeVerifier, authorizationUrl: url.toString() };
}

export async function completeAuthorization(
  currentUrl: URL,
  expectedState: string,
  codeVerifier: string,
) {
  const config = await getOidcConfig();
  const tokens = await client.authorizationCodeGrant(config, currentUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedState,
  });
  const claims = tokens.claims();
  return { tokens, claims };
}

export async function buildLogoutUrl(idToken?: string): Promise<string> {
  const config = await getOidcConfig();
  const params: Record<string, string> = {
    post_logout_redirect_uri: POST_LOGOUT_URI,
    client_id: CLIENT_ID,
  };
  if (idToken) params.id_token_hint = idToken;
  return client.buildEndSessionUrl(config, params).toString();
}
