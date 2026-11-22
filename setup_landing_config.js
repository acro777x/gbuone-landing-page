/**
 * Generates the website's PUBLIC Supabase config from the app's .env.
 *
 *   node tools/setup_landing_config.js
 *
 * Writes landing/auth/config.js (git-ignored) from EXPO_PUBLIC_* values.
 *
 * HARD SECURITY RULES (fail closed):
 *   - the key MUST look like sb_publishable_...;
 *   - sb_secret_..., service-role, legacy JWT and unknown prefixes are
 *     REJECTED, because the website source is public and a privileged key
 *     there would give every visitor full database access;
 *   - only two allowlisted values are copied. Nothing else from .env reaches
 *     the website - no DB password, worker key, FCM key or contact email.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
// Accept an explicit .env path: node setup_landing_config.js ../gbu-one/.env
const ENV = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, '.env');
const OUT = path.join(ROOT, 'auth', 'config.js');

function readEnv(file) {
  const values = {};
  if (!fs.existsSync(file)) return values;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return values;
}

function fail(message) {
  console.error('REFUSING TO WRITE WEBSITE CONFIG: ' + message);
  process.exit(1);
}

function main() {
  const env = readEnv(ENV);
  const url = (env.EXPO_PUBLIC_SUPABASE_URL || '').trim();
  const key = (env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  if (!/^https:\/\/[A-Za-z0-9.-]+\.supabase\.co\/?$/.test(url)) {
    fail('EXPO_PUBLIC_SUPABASE_URL is not a Supabase project URL.');
  }
  if (!key.startsWith('sb_publishable_')) {
    fail(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY must be an sb_publishable_... key. ' +
        'Never publish a secret/service-role key on a public website.',
    );
  }
  if (/sb_secret_|service_role|eyJ[A-Za-z0-9_-]{10,}/i.test(key)) {
    fail('the configured key looks privileged; refusing.');
  }

  // JSON.stringify escapes quotes and newlines, so these values cannot break
  // out of the script even if .env was edited by hand.
  const payload = [
    '/** AUTO-GENERATED from .env by tools/setup_landing_config.js - DO NOT EDIT. */',
    '/** PUBLIC values only. This file is served to every website visitor. */',
    'window.GBU_ONE_CONFIG = ' +
      JSON.stringify({ SUPABASE_URL: url, PUBLISHABLE_KEY: key }, null, 2) +
      ';',
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, payload, 'utf8');
  console.log('Wrote ' + path.relative(ROOT, OUT));
  console.log('Key: ' + key.slice(0, 18) + '... (publishable, safe for a public site)');
}

main();
