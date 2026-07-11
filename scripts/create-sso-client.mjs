/**
 * Buat OAuth client "lms-apoteker-rahmato" di IdP SSO Ventera.
 * Tidak perlu repo IdP / Prisma — pakai pg langsung.
 *
 * Jalankan:
 *   DATABASE_URL="postgresql://ventera:ventera_dev@localhost:55432/ventera_sso" \
 *   node scripts/create-sso-client.mjs
 */
import pg from 'pg';
import { randomBytes } from 'node:crypto';

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL
  ?? 'postgresql://ventera:ventera_dev@localhost:55432/ventera_sso';

// ── Client config ────────────────────────────────────────────────────────────
const CLIENT_ID      = 'lms-apoteker-rahmato';
const CLIENT_NAME    = 'LMS Apoteker Rahmato';
const CLIENT_TYPE    = 'confidential'; // punya secret
const APP_BASE_URL   = process.env.APP_BASE_URL ?? 'https://rahmato.storo.id';
const REALM_SLUG     = 'ventera-public';
const CLIENT_SECRET  = randomBytes(32).toString('hex'); // auto-generate
// ─────────────────────────────────────────────────────────────────────────────

const REDIRECT_URI         = `${APP_BASE_URL}/auth/callback`;
const POST_LOGOUT_URI      = `${APP_BASE_URL}/`;
const ALLOWED_SCOPES       = ['openid','profile','email','phone','offline_access','realm'];
const GRANT_TYPES          = ['authorization_code','refresh_token'];

const db = new Client({ connectionString: DATABASE_URL });

async function main() {
  await db.connect();
  console.log('✅ Terhubung ke DB:', DATABASE_URL.replace(/:\/\/[^@]+@/, '://***@'));

  // 1. Cari realm
  const { rows: realms } = await db.query(
    `SELECT id, slug FROM "Realm" WHERE slug = $1 LIMIT 1`,
    [REALM_SLUG],
  );
  if (!realms.length) throw new Error(`Realm "${REALM_SLUG}" tidak ditemukan.`);
  const realmId = realms[0].id;
  console.log(`✅ Realm ditemukan: ${REALM_SLUG} (id=${realmId})`);

  // 2. Cek duplikat
  const { rows: existing } = await db.query(
    `SELECT id FROM "OAuthClient" WHERE id = $1`,
    [CLIENT_ID],
  );
  if (existing.length) throw new Error(`Client "${CLIENT_ID}" sudah ada. Hapus dulu atau ganti id.`);

  // 3. Insert client
  await db.query(
    `INSERT INTO "OAuthClient"
      (id, name, "clientSecretHash", "clientType", "redirectUris",
       "postLogoutRedirectUris", "allowedScopes", "grantTypes",
       "skipConsent", "firstParty", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now(),now())`,
    [
      CLIENT_ID,
      CLIENT_NAME,
      CLIENT_SECRET,
      CLIENT_TYPE,
      JSON.stringify([REDIRECT_URI]),
      JSON.stringify([POST_LOGOUT_URI]),
      JSON.stringify(ALLOWED_SCOPES),
      JSON.stringify(GRANT_TYPES),
      true,  // skipConsent
      true,  // firstParty
    ],
  );
  console.log('✅ Client diinsert');

  // 4. Hubungkan ke realm (junction table _OAuthClientToRealm)
  await db.query(
    `INSERT INTO "_OAuthClientToRealm" ("A","B") VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
    [CLIENT_ID, realmId],
  );
  console.log('✅ Realm dihubungkan');

  // 5. Output env vars
  console.log('\n══════════════════════════════════════════');
  console.log('  HASIL — salin ke .env LMS:');
  console.log('══════════════════════════════════════════');
  console.log(`SSO_CLIENT_ID=${CLIENT_ID}`);
  console.log(`SSO_CLIENT_SECRET=${CLIENT_SECRET}`);
  console.log(`APP_BASE_URL=${APP_BASE_URL}`);
  console.log('SSO_ISSUER=https://sso.ventera.ai');
  console.log('══════════════════════════════════════════');
  console.log('\n⚠️  Secret hanya tampil SEKALI. Simpan sekarang.');
  console.log('⚠️  Restart/invalidate cache IdP setelah insert.');
}

main()
  .catch((e) => { console.error('❌', e.message); process.exit(1); })
  .finally(() => db.end());
