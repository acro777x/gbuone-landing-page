# Setting up the website confirmation page (baby steps)

The website source is **public** — anyone can read it. Only the Supabase
**publishable** key may appear there. That key is designed for browsers;
row-level security in the database is what actually protects student data.
A `sb_secret_…` key must **never** be put in `landing/`.

## 1. Generate the public config (one command on your build machine)

```bash
cd "C:\Users\Public\Downloads\chrome downloads\gbu one"
node tools/setup_landing_config.js
```

This reads two values from `.env` and writes `landing/auth/config.js`:

- `EXPO_PUBLIC_SUPABASE_URL` → `https://…supabase.co`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` → must start with `sb_publishable_`

The command **refuses** to write anything if the key is a secret, a service
role key or a legacy JWT. Only those two values are copied — no password,
FCM key, worker key or contact email reaches the website.

`landing/auth/config.js` is in `.gitignore`. Deploy it with the site, but
never commit it. If your host builds from git (GitHub Pages / Cloudflare
Pages), add these two values as **public environment variables** in the
host's dashboard and generate `config.js` during the build, or upload the
generated file as a build artifact.

## 2. Deploy the page

Copy this folder to the **website repo** so it is reachable at:

```
https://gbuone.space/auth/confirm/
```

Files needed in that folder:

| File | Source |
|---|---|
| `index.html` | `landing/auth/confirm.html` |
| `config.js` | generated in step 1 (public values only) |

## 3. Supabase dashboard (one time)

**Authentication → URL Configuration:**

- **Site URL:** `https://gbuone.space`
- **Redirect URLs** (two narrow entries, not a wildcard):
  - `https://gbuone.space/auth/confirm`
  - `gbuone://auth/done`

Also recommended there: keep **Confirm email** ON, turn ON **Secure email
change**, and use a short OTP expiry.

## 4. What happens

1. Student signs up in the app → Supabase emails a link to `gbuone.space/auth/confirm/?token_hash=…&type=signup`.
2. The page scrubs the URL **immediately** (`history.replaceState` in `<head>`), so the one-time token is not left in history or logs.
3. It verifies the token with Supabase using the publishable key.
4. It shows "All set" and opens `gbuone://auth/done?verified=1` in the app.

On any error it shows a **generic** message, never backend details, and never
sends the token anywhere.

## 5. Verification

- `npm test` includes `tests/landing_security.test.ts`: fails if any
  `sb_secret_…`, service-role JWT or DB password appears in `landing/`, or if
  the confirmation page loses its URL scrub / CSP / fail-closed type check.
- To test live: sign up in the app with your own email, open the link on your
  phone, confirm the app opens automatically.
