# Deploying the OTP confirm page on Cloudflare (baby steps)

Your site is already live on Cloudflare. Two small things remain.

## Step 1 — add the two PUBLIC values to Cloudflare

In the Cloudflare dashboard, open your **gbuone.space** project:

1. **Settings** → **Environment variables** (Pages) or **Variables** (Workers).
2. Add these **two** variables (plain text, not secret — they are designed to be public):
   - Name `EXPO_PUBLIC_SUPABASE_URL` → value `https://pjnxllnncsoroevgfbmt.supabase.co`
   - Name `EXPO_PUBLIC_SUPABASE_ANON_KEY` → value starting with `sb_publishable_...` (copy it from the app's `.env`)
3. Save.

⚠️ **Never** put an `sb_secret_...` key here. If you do, the build script refuses to generate the file and the deploy fails — that is the guard working.

## Step 2 — make Cloudflare generate `auth/config.js`

In **Settings → Build & deploy**:

- **Build command:** `node setup_landing_config.js`
- **Build output directory:** `.` (the repo root — it is a static site)

Trigger a **Retry deploy**. The script reads the two environment variables and writes `auth/config.js` during the build. It is never committed to git.

(If your project has no build command because it deploys files as-is, set the build command above; Cloudflare Pages supports it. For a pure Workers setup with no build step, generate `auth/config.js` locally with
`node setup_landing_config.js ../gbu-one/.env` and upload that one file next to `auth/confirm.html`.)

## Step 3 — verify

Open in a browser while logged out:

```
https://gbuone.space/auth/confirm/
```

You should see **"This link has no confirmation code…"** — that proves the page loads and the config is present. If instead you see **"not configured"**, the two environment variables are missing or wrong in Cloudflare.

## Step 4 — Supabase dashboard (do this once, if not already)

**Authentication → URL Configuration:**
- **Site URL:** `https://gbuone.space`
- **Redirect URLs:** `https://gbuone.space/auth/confirm` and `gbuone://auth/done`

## Step 5 — real test

Sign up in the app with your own email → open the email on your phone → tap the confirm button → it should open **GBU One** automatically. Then close the app fully, reopen, and log in with the same address and password.
