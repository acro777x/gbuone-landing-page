/**
 * GBU One website — PUBLIC Supabase configuration.
 *
 * Copy to `config.js` (git-ignored) and fill the two values, OR run
 *   node tools/setup_landing_config.js
 * which fills them from the app's .env automatically.
 *
 * SECURITY: only a `sb_publishable_...` key may go here. This file is served
 * to every visitor of gbuone.space. Supabase publishable keys are DESIGNED to
 * be public — row level security is the real protection. A `sb_secret_...`
 * key here would hand full database access to the entire internet.
 */
window.GBU_ONE_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  PUBLISHABLE_KEY: "sb_publishable_REPLACE_ME",
};
